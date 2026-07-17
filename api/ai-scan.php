<?php
/**
 * AI Visibility scanner.
 * Fetches a target URL (+ robots.txt, llms.txt, sitemap.xml, several .well-known
 * docs and a markdown-negotiation probe) and scores how VISIBLE, how CITABLE and
 * how AGENT-READY the site is to AI crawlers, answer engines and agents.
 * Read-only. No LLM call. Rule-based only.
 *
 * Labels are intentionally non-actionable: they describe the gap, not the fix.
 *
 * POST JSON: { "url": "https://example.com", "platform": "code|wordpress|shopify|wix|webflow|framer|autre", "lang": "fr|en" }
 * Returns:   { ok, url, host, secure, score, axes:{visible,citable,agent},
 *              verdict:{key,title,sentence}, checks:[{id,axis,label,status}], fetchedAt }
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Per-IP rate limit: caps SSRF abuse and mass-probing (repeated scans could
// otherwise be used to reconstruct the scoring model). Fails open if the store
// is unwritable (defense in depth, not an auth control).
if (!rate_limit('scan', 12, 300)) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'rate_limited']);
    exit;
}

$configPath = __DIR__ . '/config.php';
$config = file_exists($configPath) ? require $configPath : [];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $origin === ($config['allowed_origin'] ?? '')) {
    header('Access-Control-Allow-Origin: ' . $config['allowed_origin']);
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payload']);
    exit;
}

$lang = (($data['lang'] ?? 'fr') === 'en') ? 'en' : 'fr';
$url  = trim((string)($data['url'] ?? ''));
if ($url === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'empty_url']);
    exit;
}
if (!preg_match('~^https?://~i', $url)) {
    $url = 'https://' . $url;
}
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    echo json_encode(['ok' => false, 'error' => 'invalid_url']);
    exit;
}

$parts  = parse_url($url);
$scheme = strtolower($parts['scheme'] ?? '');
$host   = $parts['host'] ?? '';
if (!in_array($scheme, ['http', 'https'], true) || $host === '') {
    echo json_encode(['ok' => false, 'error' => 'invalid_url']);
    exit;
}

// ---- SSRF guard: never let the scanner hit private / internal hosts ----
if (!host_is_public($host)) {
    echo json_encode(['ok' => false, 'error' => 'blocked_host']);
    exit;
}

$port = isset($parts['port']) ? ':' . (int)$parts['port'] : '';
$base = $scheme . '://' . $host . $port;

// ---- Fetch the homepage ----
$home = http_get($url);
if ($home['error'] || $home['status'] === 0 || $home['status'] >= 500) {
    echo json_encode(['ok' => false, 'error' => 'unreachable', 'url' => $url]);
    exit;
}

$html     = $home['body'];
$finalUrl = $home['final'] !== '' ? $home['final'] : $url;
$secure   = stripos($finalUrl, 'https://') === 0;

// ---- Auxiliary documents (best effort) ----
$robots      = http_get($base . '/robots.txt');
$llms        = http_get($base . '/llms.txt');
$sitemap     = http_get($base . '/sitemap.xml');
$agentSkills = http_get($base . '/.well-known/agent-skills/index.json');
$mcpCard     = http_get($base . '/.well-known/mcp/server-card.json');
$apiCatalog  = http_get($base . '/.well-known/api-catalog');
$oauthPR     = http_get($base . '/.well-known/oauth-protected-resource');
$authMd      = http_get($base . '/auth.md');
$homeMd      = http_get($url, ['Accept: text/markdown']); // markdown-for-agents probe

// ---- Parse homepage signals ----
$hasTitle     = preg_match('~<title[^>]*>\s*\S~i', $html) === 1;
$hasDesc      = preg_match('~<meta[^>]+name=["\']description["\'][^>]+content=["\'][^"\']{20,}~i', $html) === 1;
$hasH1        = preg_match('~<h1[\s>]~i', $html) === 1;
$h2count      = (int)preg_match_all('~<h2[\s>]~i', $html);
$hasOG        = preg_match('~<meta[^>]+property=["\']og:~i', $html) === 1;
$hasJsonLd    = preg_match('~<script[^>]+type=["\']application/ld\+json["\']~i', $html) === 1;

// Content readable without JS? (detect SPA shells with little server HTML)
$stripped = preg_replace('~<(script|style|noscript|template)[^>]*>.*?</\1>~is', ' ', $html);
$text     = trim(preg_replace('~\s+~', ' ', strip_tags((string)$stripped)));
$textLen  = mb_strlen($text);
$pCount   = (int)preg_match_all('~<p[\s>]~i', $html);
$contentInHtml = ($textLen >= 600 || $pCount >= 5);

// robots.txt analysis
$robotsTxt        = strtolower((string)($robots['body'] ?? ''));
$aiBlocked        = ai_crawlers_blocked($robotsTxt);
$homeHeaders      = strtolower((string)($home['headers'] ?? ''));
$hasContentSignal = (strpos($robotsTxt, 'content-signal') !== false)
    || (strpos($homeHeaders, 'content-signal:') !== false);

// llms.txt present (and not an HTML 404 page served with 200)
$llmsBody   = (string)($llms['body'] ?? '');
$llmsExists = ($llms['status'] === 200 && stripos($llms['ctype'], 'html') === false && trim($llmsBody) !== '');

// sitemap present
$sitemapBody   = (string)($sitemap['body'] ?? '');
$sitemapExists = ($sitemap['status'] >= 200 && $sitemap['status'] < 400)
    && (stripos($sitemapBody, '<urlset') !== false || stripos($sitemapBody, '<sitemapindex') !== false);

// agent-readiness documents
$jsonOk = function (array $r): bool {
    return $r['status'] === 200 && stripos($r['ctype'], 'json') !== false;
};
$mcpOk         = $jsonOk($mcpCard);
$skillsOk      = $jsonOk($agentSkills);
$oauthOk       = $jsonOk($oauthPR);
$apiCatalogOk  = ($apiCatalog['status'] === 200 && (stripos($apiCatalog['ctype'], 'json') !== false || stripos($apiCatalog['ctype'], 'linkset') !== false));
$authMdBody    = (string)($authMd['body'] ?? '');
$authMdOk      = ($authMd['status'] === 200 && stripos($authMd['ctype'], 'html') === false && trim($authMdBody) !== '');
$markdownOk    = ($homeMd['status'] >= 200 && $homeMd['status'] < 400 && stripos($homeMd['ctype'], 'markdown') !== false);

// Citable enrichments: structured key facts (Dataset), Speakable markup, and
// linked entities (2+ sameAs entries, or a Wikidata link).
$hasDataset   = preg_match('~"@type"\s*:\s*"Dataset"~i', $html) === 1;
$hasSpeakable = preg_match('~"@type"\s*:\s*"SpeakableSpecification"|"speakable"\s*:~i', $html) === 1;
$sameAsCount  = 0;
if (preg_match('~"sameAs"\s*:\s*\[(.*?)\]~is', $html, $mSA)) {
    $sameAsCount = (int)preg_match_all('~https?://~', $mSA[1]);
}
$hasEntities  = ($sameAsCount >= 2) || (stripos($html, 'wikidata.org') !== false);

// ---- Checks (weighted, three axes: VISIBLE 33 / CITABLE 37 / AGENT 30) ----
// Labels are deliberately vague: they name the capability that is missing,
// never the technical fix.
$checks = [
    ['id' => 'secure',           'axis' => 'visible', 'label' => 'Connexion sécurisée',                    'pass' => $secure,                  'w' => 5],
    ['id' => 'ai_access',        'axis' => 'visible', 'label' => 'Accès autorisé aux robots IA',           'pass' => !$aiBlocked,              'w' => 11],
    ['id' => 'content_html',     'axis' => 'visible', 'label' => 'Contenu lisible directement par les IA', 'pass' => $contentInHtml,           'w' => 10],
    ['id' => 'meta',             'axis' => 'visible', 'label' => 'Informations de page essentielles',      'pass' => ($hasTitle && $hasDesc),  'w' => 4],
    ['id' => 'sitemap',          'axis' => 'visible', 'label' => 'Plan de site exploitable',               'pass' => $sitemapExists,           'w' => 3],

    ['id' => 'structured_data',  'axis' => 'citable', 'label' => 'Données structurées pour les IA',        'pass' => $hasJsonLd,               'w' => 8],
    ['id' => 'headings',         'axis' => 'citable', 'label' => 'Contenu structuré pour la citation',     'pass' => ($hasH1 && $h2count >= 2), 'w' => 6],
    ['id' => 'social',           'axis' => 'citable', 'label' => 'Aperçu optimisé pour le partage',        'pass' => $hasOG,                   'w' => 4],
    ['id' => 'llms_txt',         'axis' => 'citable', 'label' => 'Guide de lecture dédié aux IA',          'pass' => $llmsExists,              'w' => 6],
    ['id' => 'content_signals',  'axis' => 'citable', 'label' => "Préférences d'usage IA déclarées",       'pass' => $hasContentSignal,        'w' => 6],
    ['id' => 'key_facts',        'axis' => 'citable', 'label' => 'Faits clés structurés pour les IA',      'pass' => $hasDataset,              'w' => 3],
    ['id' => 'speakable',        'axis' => 'citable', 'label' => 'Contenu prêt pour la lecture vocale',    'pass' => $hasSpeakable,            'w' => 2],
    ['id' => 'entities',         'axis' => 'citable', 'label' => 'Entités et profils reliés',              'pass' => $hasEntities,             'w' => 2],

    ['id' => 'markdown_neg',     'axis' => 'agent',   'label' => 'Version lisible par les agents',         'pass' => $markdownOk,              'w' => 6],
    ['id' => 'mcp_card',         'axis' => 'agent',   'label' => 'Carte de capacités pour agents',         'pass' => $mcpOk,                   'w' => 6],
    ['id' => 'agent_skills',     'axis' => 'agent',   'label' => 'Index de compétences agents',            'pass' => $skillsOk,                'w' => 5],
    ['id' => 'oauth_pr',         'axis' => 'agent',   'label' => "Cadre d'authentification agents",        'pass' => $oauthOk,                 'w' => 5],
    ['id' => 'api_catalog',      'axis' => 'agent',   'label' => 'Catalogue de services exposé',           'pass' => $apiCatalogOk,            'w' => 4],
    ['id' => 'auth_md',          'axis' => 'agent',   'label' => "Guide d'accès pour agents",              'pass' => $authMdOk,                'w' => 4],
];

$score = 0;
$axMax = ['visible' => 0, 'citable' => 0, 'agent' => 0];
$axGot = ['visible' => 0, 'citable' => 0, 'agent' => 0];
foreach ($checks as $c) {
    $axMax[$c['axis']] += $c['w'];
    if ($c['pass']) { $axGot[$c['axis']] += $c['w']; $score += $c['w']; }
}
$visiblePct = $axMax['visible'] ? (int)round($axGot['visible'] / $axMax['visible'] * 100) : 0;
$citablePct = $axMax['citable'] ? (int)round($axGot['citable'] / $axMax['citable'] * 100) : 0;
$agentPct   = $axMax['agent']   ? (int)round($axGot['agent']   / $axMax['agent']   * 100) : 0;

// ---- Verdict (one clear sentence, no how-to) ----
$V = [
    'invisible' => [
        'fr' => ['Invisible pour les IA', "Les IA ne peuvent pas lire votre site : son contenu leur est inaccessible. Aujourd'hui, vous n'apparaissez pas dans leurs réponses."],
        'en' => ['Invisible to AI', "AI assistants cannot read your site: its content is out of reach. Right now, you do not show up in their answers."],
    ],
    'visible' => [
        'fr' => ['Visible, mais pas citable', "Votre site est visible par les IA, mais il n'est pas structuré pour être cité. Elles vous voient sans pouvoir vous recommander."],
        'en' => ['Visible, but not citable', "AI assistants can see your site, but it is not structured to be cited. They see you without being able to recommend you."],
    ],
    'citable' => [
        'fr' => ['Lisible et citable', "Les IA peuvent lire et citer votre site, mais la couche agents est absente. Vous restez en retrait face aux sites prêts pour les agents IA."],
        'en' => ['Readable and citable', "AI can read and cite your site, but the agents layer is missing. You stay behind sites that are ready for AI agents."],
    ],
    'agent_ready' => [
        'fr' => ['Prêt pour les agents IA', "Votre site est lisible, citable et prêt pour les agents IA. Vous êtes en avance sur l'immense majorité des sites."],
        'en' => ['Ready for AI agents', "Your site is readable, citable and ready for AI agents. You are ahead of the vast majority of sites."],
    ],
];
$vKey = ($aiBlocked || !$contentInHtml) ? 'invisible'
      : ($citablePct < 50 ? 'visible'
      : ($agentPct < 40 ? 'citable' : 'agent_ready'));
$verdict = ['key' => $vKey, 'title' => $V[$vKey][$lang][0], 'sentence' => $V[$vKey][$lang][1]];

// Vague English labels (same intent: capability, not fix)
$EN = [
    'secure'          => 'Secure connection',
    'ai_access'       => 'AI crawlers allowed in',
    'content_html'    => 'Content readable directly by AI',
    'meta'            => 'Essential page information',
    'sitemap'         => 'Usable site map',
    'structured_data' => 'Structured data for AI',
    'headings'        => 'Content structured for citation',
    'social'          => 'Optimized sharing preview',
    'llms_txt'        => 'Dedicated reading guide for AI',
    'content_signals' => 'AI usage preferences declared',
    'key_facts'       => 'Structured key facts for AI',
    'speakable'       => 'Content ready for voice',
    'entities'        => 'Linked entities and profiles',
    'markdown_neg'    => 'Agent-readable version',
    'mcp_card'        => 'Capability card for agents',
    'agent_skills'    => 'Agent skills index',
    'oauth_pr'        => 'Agent authentication framework',
    'api_catalog'     => 'Exposed service catalog',
    'auth_md'         => 'Agent access guide',
];
$outChecks = [];
foreach ($checks as $c) {
    $label = ($lang === 'en' && isset($EN[$c['id']])) ? $EN[$c['id']] : $c['label'];
    $outChecks[] = ['id' => $c['id'], 'axis' => $c['axis'], 'label' => $label, 'status' => $c['pass'] ? 'pass' : 'fail'];
}

// ---- Feasibility computed SERVER-SIDE: per-signal weights never leave the
// server, so the scoring model cannot be lifted from the network response. ----
$platform = (string)($data['platform'] ?? 'autre');
if (!in_array($platform, ['code', 'wordpress', 'shopify', 'wix', 'webflow', 'framer', 'autre'], true)) {
    $platform = 'autre';
}
$IMPOSSIBLE = [
    'shopify' => ['llms_txt', 'markdown_neg', 'mcp_card', 'agent_skills', 'oauth_pr', 'api_catalog', 'auth_md'],
    'wix'     => ['llms_txt', 'markdown_neg', 'mcp_card', 'agent_skills', 'oauth_pr', 'api_catalog', 'auth_md'],
    'webflow' => ['llms_txt', 'markdown_neg', 'mcp_card', 'agent_skills', 'oauth_pr', 'api_catalog', 'auth_md'],
    'framer'  => ['llms_txt', 'markdown_neg', 'mcp_card', 'agent_skills', 'oauth_pr', 'api_catalog', 'auth_md'],
];
$impIds           = $IMPOSSIBLE[$platform] ?? [];
$impossibleLabels = [];
$fixableGain      = 0;
foreach ($checks as $c) {
    if ($c['pass']) { continue; }
    $lbl = ($lang === 'en' && isset($EN[$c['id']])) ? $EN[$c['id']] : $c['label'];
    if (in_array($c['id'], $impIds, true)) {
        $impossibleLabels[] = $lbl;
    } else {
        $fixableGain += $c['w'];
    }
}
$feasibility = [
    'current'    => $score,
    'projected'  => min(100, $score + $fixableGain),
    'impossible' => $impossibleLabels,
];

// ---- Scan log for /admin (fail-open: a log failure never breaks the scan) ----
$logDir = __DIR__ . '/data';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0700, true);
}
@file_put_contents(
    $logDir . '/scans.jsonl',
    json_encode([
        'ts'       => date('c'),
        'url'      => $finalUrl,
        'host'     => $host,
        'score'    => $score,
        'verdict'  => $vKey,
        'platform' => $platform,
        'lang'     => $lang,
    ], JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE) . "\n",
    FILE_APPEND | LOCK_EX
);

echo json_encode([
    'ok'        => true,
    'url'       => $finalUrl,
    'host'      => $host,
    'secure'    => $secure,
    'score'     => $score,
    'axes'      => ['visible' => $visiblePct, 'citable' => $citablePct, 'agent' => $agentPct],
    'verdict'     => $verdict,
    'checks'      => $outChecks,
    'feasibility' => $feasibility,
    'fetchedAt'   => date('c'),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);


/* =========================================================
   Helpers
   ========================================================= */

/**
 * GET a URL with curl, SSRF-hardened:
 *  - http/https only (curl protocols restricted, so a redirect to file://,
 *    gopher://, dict:// ... is refused),
 *  - every hop is re-validated as a public host and the connection is pinned to
 *    the validated IP (CURLOPT_RESOLVE), blocking redirect-to-internal and
 *    DNS-rebinding,
 *  - redirects followed manually (max 4), body capped, short timeouts.
 * Returns ['status','body','headers','final','ctype','error','errno'].
 */
function http_get(string $u, array $extraHeaders = []): array
{
    $cap     = 700000; // ~700 KB is plenty for a homepage / robots / sitemap head
    $maxHops = 4;
    $cur     = $u;

    for ($hop = 0; $hop <= $maxHops; $hop++) {
        $p      = parse_url($cur);
        $scheme = strtolower((string)($p['scheme'] ?? ''));
        $host   = strtolower((string)($p['host'] ?? ''));
        if (!in_array($scheme, ['http', 'https'], true) || $host === '') {
            return http_fail($cur);
        }
        $ip = safe_resolve($host); // validated public IP, or null
        if ($ip === null) {
            return http_fail($cur);
        }
        $port = isset($p['port']) ? (int)$p['port'] : ($scheme === 'https' ? 443 : 80);

        $body = '';
        $hdrs = '';
        $ch   = curl_init($cur);
        curl_setopt_array($ch, [
            CURLOPT_FOLLOWLOCATION => false, // followed manually so every hop is re-validated
            CURLOPT_PROTOCOLS      => CURLPROTO_HTTP | CURLPROTO_HTTPS,
            CURLOPT_RESOLVE        => ["{$host}:{$port}:{$ip}"], // pin to the validated IP
            CURLOPT_TIMEOUT        => 7,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HEADER         => false,
            CURLOPT_ENCODING       => '',
            CURLOPT_HTTPHEADER     => $extraHeaders,
            CURLOPT_USERAGENT      => 'MathieuHaye-AIVisibilityBot/1.0 (+https://mathieuhaye.fr/visible-par-les-ia)',
            CURLOPT_HEADERFUNCTION => function ($c, $h) use (&$hdrs) {
                $hdrs .= $h;
                return strlen($h);
            },
            CURLOPT_WRITEFUNCTION  => function ($c, $chunk) use (&$body, $cap) {
                $body .= $chunk;
                if (strlen($body) > $cap) {
                    return 0; // abort transfer once we have enough
                }
                return strlen($chunk);
            },
        ]);
        curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $ctype  = (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $errno  = curl_errno($ch);
        curl_close($ch);

        // Follow one redirect manually; the next hop is re-validated at the top.
        if ($status >= 300 && $status < 400 && preg_match('~^location:\s*(.+)$~im', $hdrs, $m)) {
            $next = abs_url($cur, trim($m[1]));
            if ($next === null) {
                return http_fail($cur);
            }
            $cur = $next;
            continue;
        }

        // errno 23 = CURLE_WRITE_ERROR, expected when we abort after the cap.
        $error = ($errno !== 0 && $errno !== 23 && $body === '');
        return ['status' => $status, 'body' => $body, 'headers' => $hdrs, 'final' => $cur, 'ctype' => $ctype, 'error' => $error, 'errno' => $errno];
    }
    return http_fail($cur); // too many redirects
}

/** Standard failure shape for http_get. */
function http_fail(string $u): array
{
    return ['status' => 0, 'body' => '', 'headers' => '', 'final' => $u, 'ctype' => '', 'error' => true, 'errno' => -1];
}

/**
 * Resolve a redirect Location (possibly relative) against the current URL.
 * Returns an absolute http(s) URL, or null for any non-http(s) target.
 */
function abs_url(string $base, string $loc): ?string
{
    if ($loc === '') {
        return null;
    }
    if (preg_match('~^https?://~i', $loc)) {
        return $loc;
    }
    if (preg_match('~^[a-z][a-z0-9+.\-]*:~i', $loc)) {
        return null; // non-http scheme: mailto:, data:, javascript:, file: ...
    }
    $b = parse_url($base);
    if (!isset($b['scheme'], $b['host'])) {
        return null;
    }
    $origin = $b['scheme'] . '://' . $b['host'] . (isset($b['port']) ? ':' . (int)$b['port'] : '');
    if (strpos($loc, '//') === 0) {
        return $b['scheme'] . ':' . $loc;
    }
    if (strpos($loc, '/') === 0) {
        return $origin . $loc;
    }
    $path = isset($b['path']) ? preg_replace('~/[^/]*$~', '/', $b['path']) : '/';
    return $origin . $path . $loc;
}

/**
 * Validate a host as public and return one resolved public IP to pin the
 * connection to (anti DNS-rebinding), or null if private/reserved/unresolvable.
 */
function safe_resolve(string $host): ?string
{
    $host = strtolower(trim($host));
    if ($host === '' || $host === 'localhost' || substr($host, -6) === '.local') {
        return null;
    }
    $flags = FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE;
    if (filter_var($host, FILTER_VALIDATE_IP)) {
        return filter_var($host, FILTER_VALIDATE_IP, $flags) ? $host : null;
    }
    $ips = @gethostbynamel($host);
    if (!is_array($ips) || !$ips) {
        $one = @gethostbyname($host);
        $ips = ($one && $one !== $host) ? [$one] : [];
    }
    if (!$ips) {
        return null;
    }
    foreach ($ips as $ip) {
        if (!filter_var($ip, FILTER_VALIDATE_IP, $flags)) {
            return null; // any private/reserved IP => refuse the whole host
        }
    }
    return $ips[0];
}

/** Boolean wrapper used by the entry point. */
function host_is_public(string $host): bool
{
    return safe_resolve($host) !== null;
}

/**
 * Lightweight per-IP rate limiter backed by the system temp dir (no DB).
 * Sliding window. Fails OPEN if the store is unwritable. Returns true when the
 * request is allowed.
 */
function rate_limit(string $bucket, int $max, int $windowSec): bool
{
    $ip   = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    $file = sys_get_temp_dir() . '/mh_rl_' . $bucket . '_' . hash('sha256', $ip) . '.json';
    $now  = time();
    $hits = [];
    if (is_file($file)) {
        $raw  = @file_get_contents($file);
        $prev = $raw !== false ? json_decode($raw, true) : null;
        if (is_array($prev)) {
            $hits = $prev;
        }
    }
    $hits = array_values(array_filter($hits, function ($t) use ($now, $windowSec) {
        return is_int($t) && ($now - $t) < $windowSec;
    }));
    if (count($hits) >= $max) {
        return false;
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
    return true;
}

/**
 * True if robots.txt fully blocks the major AI answer-engine crawlers
 * (or everyone via '*'). Training-only bots (CCBot, Google-Extended) are
 * intentionally ignored: blocking them does not hurt AI answer visibility.
 */
function ai_crawlers_blocked(string $robots): bool
{
    if (trim($robots) === '') {
        return false;
    }
    $groups = [];
    $curUAs = [];
    $curDisallow = [];
    $seenRule = false;
    $flush = function () use (&$groups, &$curUAs, &$curDisallow) {
        foreach ($curUAs as $ua) {
            $groups[$ua] = array_merge($groups[$ua] ?? [], $curDisallow);
        }
    };
    // A robots group is a run of consecutive User-agent lines plus its rule
    // lines. A new User-agent after ANY rule (Allow OR Disallow) starts a fresh
    // group, so a later "Disallow: /" never leaks onto earlier Allow-only groups
    // (e.g. GPTBot/ClaudeBot all "Allow: /", only CCBot "Disallow: /").
    foreach (preg_split('~\r?\n~', $robots) as $line) {
        $line = trim((string)preg_replace('~#.*$~', '', $line));
        if ($line === '') {
            continue;
        }
        if (preg_match('~^user-agent\s*:\s*(.+)$~i', $line, $m)) {
            if ($seenRule) { $flush(); $curUAs = []; $curDisallow = []; $seenRule = false; }
            $curUAs[] = strtolower(trim($m[1]));
        } elseif (preg_match('~^disallow\s*:\s*(.*)$~i', $line, $m)) {
            $curDisallow[] = strtolower(trim($m[1]));
            $seenRule = true;
        } elseif (preg_match('~^allow\s*:~i', $line)) {
            $seenRule = true;
        }
    }
    if (!empty($curUAs)) {
        $flush();
    }
    $blocksRoot = function ($ua) use ($groups) {
        if (!isset($groups[$ua])) {
            return false;
        }
        foreach ($groups[$ua] as $dis) {
            if ($dis === '/') {
                return true;
            }
        }
        return false;
    };
    if ($blocksRoot('*')) {
        return true;
    }
    foreach (['gptbot', 'oai-searchbot', 'claudebot', 'anthropic-ai', 'perplexitybot'] as $bot) {
        if ($blocksRoot($bot)) {
            return true;
        }
    }
    return false;
}
