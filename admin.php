<?php
/**
 * Back office prive - https://mathieuhaye.fr/admin
 *
 * Page unique, auto-contenue, servie via la reecriture /admin -> admin.php :
 *   - authentification par mot de passe (hash bcrypt lu dans api/config.php),
 *   - mode setup au premier lancement (genere le hash, ne l'ecrit JAMAIS),
 *   - onglets : Dashboard, Leads & scans, Articles, Actions.
 *
 * Securite :
 *   - session HttpOnly / Secure / SameSite=Strict, regeneree au login,
 *   - jeton CSRF (hash_equals) sur chaque formulaire POST,
 *   - rate limit fichier sur le login (6 essais / 15 min, meme pattern que
 *     api/ai-scan.php),
 *   - X-Robots-Tag noindex + CSP restrictive envoyes par la page elle-meme,
 *   - toute sortie passe par htmlspecialchars(ENT_QUOTES),
 *   - aucune entree utilisateur ne touche un chemin, une commande ou du SQL.
 */

declare(strict_types=1);

// ---- Headers (avant toute sortie) ----
header('X-Robots-Tag: noindex, nofollow');
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, max-age=0');
header('Content-Type: text/html; charset=utf-8');

// ---- Session ----
session_name('mh_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => '',
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

// ---- Config ----
$configPath = __DIR__ . '/api/config.php';
$config     = is_file($configPath) ? require $configPath : [];
if (!is_array($config)) {
    $config = [];
}
$adminHash = (string)($config['admin_password_hash'] ?? '');
$setupMode = ($adminHash === '');


/* =========================================================
   Helpers
   ========================================================= */

function esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

/**
 * Fixed allowlist of keys the back office may persist to settings.json.
 * MUST stay in sync with the overlay allowlist in api/config.php.
 * 'google_sa_json' is deliberately absent : the service-account path is fixed.
 */
function settings_allowlist(): array
{
    return [
        'admin_password_hash',
        'gsc_site_url',
        'ga4_property_id',
        'pagespeed_api_key',
        'recipient_email',
        'anthropic_model',
        'max_output_tok',
        'rate_limit_per_h',
        'allowed_origin',
        'send_visitor_copy',
        'anthropic_key',
        'brevo_key',
        'brevo_sender_email',
        'brevo_sender_name',
        'index_ping_token',
        'indexnow_key',
        'index_host',
    ];
}

/**
 * Persist editable config values to the web-denied api/data/settings.json.
 * The path is FIXED (__DIR__), never derived from user input. Only keys in the
 * allowlist survive. Merges $updates over the existing file, writes atomically
 * (temp file in the same dir + rename), and chmods 0600. Returns false on any
 * failure and never throws.
 */
function save_settings(array $updates): bool
{
    $allow = settings_allowlist();
    $dir   = __DIR__ . '/api/data';
    $path  = $dir . '/settings.json';

    // Load existing settings (or start empty), keeping only allowlisted keys.
    $current = [];
    if (is_file($path)) {
        $raw = @file_get_contents($path);
        if (is_string($raw) && $raw !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $current = $decoded;
            }
        }
    }

    $merged = [];
    foreach (array_merge($current, $updates) as $k => $v) {
        if (in_array($k, $allow, true)) {
            $merged[$k] = $v;
        }
    }

    $enc = json_encode($merged, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if (!is_string($enc)) {
        return false;
    }

    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    if (!is_dir($dir) || !is_writable($dir)) {
        return false;
    }

    // Atomic write : unique temp file in the same dir, then rename over target.
    $tmp = @tempnam($dir, 'set_');
    if ($tmp === false) {
        return false;
    }
    if (@file_put_contents($tmp, $enc, LOCK_EX) === false) {
        @unlink($tmp);
        return false;
    }
    @chmod($tmp, 0600);
    if (!@rename($tmp, $path)) {
        @unlink($tmp);
        return false;
    }
    @chmod($path, 0600);
    return true;
}

/**
 * Lightweight per-IP rate limiter backed by the system temp dir (no DB).
 * Sliding window, same pattern as api/ai-scan.php. Returns true when allowed.
 */
function rate_limit(string $bucket, int $max, int $windowSec): bool
{
    // Atomic sliding-window limiter: the read-modify-write is done under an
    // exclusive flock so parallel requests cannot each read a stale pre-increment
    // count and bypass the cap. Fails open only if the store is truly unavailable
    // (the login itself is still protected by a bcrypt hash + 12-char minimum).
    $ip   = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
    $file = sys_get_temp_dir() . '/mh_rl_' . $bucket . '_' . hash('sha256', $ip) . '.json';
    $now  = time();
    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        return true;
    }
    if (!@flock($fh, LOCK_EX)) {
        fclose($fh);
        return true;
    }
    $raw  = stream_get_contents($fh);
    $prev = (is_string($raw) && $raw !== '') ? json_decode($raw, true) : null;
    $hits = is_array($prev) ? $prev : [];
    $hits = array_values(array_filter($hits, function ($t) use ($now, $windowSec) {
        return is_int($t) && ($now - $t) < $windowSec;
    }));
    $allowed = count($hits) < $max;
    if ($allowed) {
        $hits[] = $now;
        rewind($fh);
        ftruncate($fh, 0);
        fwrite($fh, json_encode($hits));
        fflush($fh);
    }
    @flock($fh, LOCK_UN);
    fclose($fh);
    return $allowed;
}

/**
 * Scan a blog directory for dated articles (YYYY-MM-DD-slug.html).
 * Returns rows sorted newest first: ['date', 'slug', 'title'].
 */
function blog_articles(string $dir): array
{
    $out = [];
    if (!is_dir($dir)) {
        return $out;
    }
    $files = glob(rtrim($dir, '/\\') . '/*.html');
    if (!is_array($files)) {
        return $out;
    }
    foreach ($files as $f) {
        $name = basename($f);
        if (!preg_match('~^(\d{4}-\d{2}-\d{2})-(.+)\.html$~', $name, $m)) {
            continue;
        }
        $title = '';
        $head  = @file_get_contents($f, false, null, 0, 6000);
        if (is_string($head) && preg_match('~<title[^>]*>(.*?)</title>~is', $head, $t)) {
            $title = trim(html_entity_decode($t[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }
        $out[] = [
            'date'  => $m[1],
            'slug'  => $m[1] . '-' . $m[2],
            'title' => $title !== '' ? $title : $m[2],
        ];
    }
    usort($out, function (array $a, array $b): int {
        return strcmp($b['slug'], $a['slug']);
    });
    return $out;
}

/**
 * Read a JSONL file (one JSON object per line), newest first.
 * Returns ['total' => int, 'rows' => array] ; empty shape if the file is absent.
 */
function read_jsonl(string $path, int $max): array
{
    $res = ['total' => 0, 'rows' => []];
    if (!is_file($path)) {
        return $res;
    }
    $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return $res;
    }
    $res['total'] = count($lines);
    foreach (array_reverse($lines) as $line) {
        if (count($res['rows']) >= $max) {
            break;
        }
        $row = json_decode((string)$line, true);
        if (is_array($row)) {
            $res['rows'][] = $row;
        }
    }
    return $res;
}

/**
 * HEAD request with a short timeout (health checks only).
 * Returns ['status' => int, 'headers' => string]. Never throws.
 */
function head_probe(string $url): array
{
    $res = ['status' => 0, 'headers' => ''];
    $ch  = curl_init($url);
    if ($ch === false) {
        return $res;
    }
    curl_setopt_array($ch, [
        CURLOPT_NOBODY         => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER         => true,
        CURLOPT_TIMEOUT        => 3,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_USERAGENT      => 'MathieuHaye-Admin/1.0 (+https://mathieuhaye.fr)',
    ]);
    $resp = curl_exec($ch);
    $res['status']  = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $res['headers'] = is_string($resp) ? $resp : '';
    curl_close($ch);
    return $res;
}

/**
 * Server-side health probes. Returns null if curl is unavailable, otherwise a
 * list of ['label' => string, 'ok' => bool]. A slow network only produces red
 * dots (status 0), never a fatal.
 */
function site_health(): ?array
{
    if (!function_exists('curl_init')) {
        return null;
    }
    $base    = 'https://mathieuhaye.fr';
    $targets = [
        ['label' => 'Accueil mathieuhaye.fr (HTTP 200)', 'url' => $base . '/'],
        ['label' => 'robots.txt',                        'url' => $base . '/robots.txt'],
        ['label' => 'llms.txt',                          'url' => $base . '/llms.txt'],
        ['label' => 'sitemap.xml',                       'url' => $base . '/sitemap.xml'],
    ];
    $out         = [];
    $homeHeaders = '';
    foreach ($targets as $i => $t) {
        $probe = head_probe($t['url']);
        if ($i === 0) {
            $homeHeaders = strtolower($probe['headers']);
        }
        $out[] = ['label' => $t['label'], 'ok' => ($probe['status'] === 200)];
    }
    $out[] = [
        'label' => 'En-tête Content-Signal (accueil)',
        'ok'    => (strpos($homeHeaders, 'content-signal:') !== false),
    ];
    return $out;
}

/**
 * Call the indexing pinger server-side (the token never reaches the browser).
 * Returns the pretty-printed JSON response, or a short error message.
 */
function admin_ping(array $config): string
{
    if (!function_exists('curl_init')) {
        return 'curl indisponible sur ce serveur.';
    }
    $token = (string)($config['index_ping_token'] ?? '');
    $url   = 'https://mathieuhaye.fr/api/index-ping.php';
    if ($token !== '') {
        $url .= '?token=' . urlencode($token);
    }
    $ch = curl_init($url);
    if ($ch === false) {
        return 'Impossible d\'initialiser la requête.';
    }
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_USERAGENT      => 'MathieuHaye-Admin/1.0 (+https://mathieuhaye.fr)',
    ]);
    $resp = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if (!is_string($resp) || $resp === '') {
        return 'Échec de l\'appel (HTTP ' . $code . ($err !== '' ? ' / ' . $err : '') . ').';
    }
    $j = json_decode($resp, true);
    if (is_array($j)) {
        $pretty = json_encode($j, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (is_string($pretty)) {
            return $pretty;
        }
    }
    return $resp;
}

/* ---------------------------------------------------------
   Google Site Kit-style panels (Search Console, GA4, PageSpeed)
   All calls are curl, https only, 8s timeout, fully guarded.
   No secret, token or key is ever returned or rendered.
   --------------------------------------------------------- */

/** base64url without padding (same encoding as api/index-ping.php). */
function gsk_b64url(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Mint a service-account JWT (RS256) and exchange it for a Google OAuth2
 * access token scoped to $scope. Same signing + token-exchange logic as
 * api/index-ping.php's google_token(), generalised to any read scope.
 * Returns null on ANY failure. Never throws, never leaks the key or token.
 */
function google_token(array $config, string $scope): ?string
{
    if (!function_exists('curl_init') || !function_exists('openssl_sign')) {
        return null;
    }
    $saPath = (string)($config['google_sa_json'] ?? '');
    if ($saPath === '' || !is_file($saPath)) {
        return null;
    }
    $raw = @file_get_contents($saPath);
    if (!is_string($raw) || $raw === '') {
        return null;
    }
    $sa = json_decode($raw, true);
    if (!is_array($sa) || empty($sa['client_email']) || empty($sa['private_key'])) {
        return null;
    }
    $now    = time();
    $header = gsk_b64url((string)json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $claim  = gsk_b64url((string)json_encode([
        'iss'   => $sa['client_email'],
        'scope' => $scope,
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $now,
        'exp'   => $now + 3600,
    ]));
    $signingInput = $header . '.' . $claim;
    $sig = '';
    if (!@openssl_sign($signingInput, $sig, $sa['private_key'], OPENSSL_ALGO_SHA256)) {
        return null;
    }
    $assertion = $signingInput . '.' . gsk_b64url($sig);

    $ch = @curl_init('https://oauth2.googleapis.com/token');
    if ($ch === false) {
        return null;
    }
    @curl_setopt_array($ch, [
        CURLOPT_POST             => true,
        CURLOPT_POSTFIELDS       => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $assertion,
        ]),
        CURLOPT_RETURNTRANSFER   => true,
        CURLOPT_TIMEOUT          => 8,
        CURLOPT_CONNECTTIMEOUT   => 5,
        CURLOPT_PROTOCOLS        => CURLPROTO_HTTPS,
        CURLOPT_REDIR_PROTOCOLS  => CURLPROTO_HTTPS,
        CURLOPT_FOLLOWLOCATION   => false,
    ]);
    $resp = @curl_exec($ch);
    $code = (int)@curl_getinfo($ch, CURLINFO_HTTP_CODE);
    @curl_close($ch);
    if (!is_string($resp) || $code < 200 || $code >= 300) {
        return null;
    }
    $j = json_decode($resp, true);
    if (!is_array($j) || empty($j['access_token']) || !is_string($j['access_token'])) {
        return null;
    }
    return $j['access_token'];
}

/**
 * Guarded HTTPS request. Returns ['status' => int, 'body' => string|null].
 * Never throws. https only, 8s timeout. Used for every Google call.
 */
function gsk_http(string $method, string $url, ?string $bearer, ?string $jsonBody, int $timeout = 8): array
{
    $res = ['status' => 0, 'body' => null];
    if (!function_exists('curl_init')) {
        return $res;
    }
    $ch = @curl_init($url);
    if ($ch === false) {
        return $res;
    }
    $headers = [];
    if ($bearer !== null && $bearer !== '') {
        $headers[] = 'Authorization: Bearer ' . $bearer;
    }
    $opts = [
        CURLOPT_RETURNTRANSFER   => true,
        CURLOPT_TIMEOUT          => $timeout,
        CURLOPT_CONNECTTIMEOUT   => 5,
        CURLOPT_PROTOCOLS        => CURLPROTO_HTTPS,
        CURLOPT_REDIR_PROTOCOLS  => CURLPROTO_HTTPS,
        CURLOPT_FOLLOWLOCATION   => false,
        CURLOPT_USERAGENT        => 'MathieuHaye-Admin/1.0 (+https://mathieuhaye.fr)',
    ];
    if ($method === 'POST') {
        $opts[CURLOPT_POST] = true;
        if ($jsonBody !== null) {
            $opts[CURLOPT_POSTFIELDS] = $jsonBody;
            $headers[] = 'Content-Type: application/json; charset=utf-8';
        }
    }
    if (!empty($headers)) {
        $opts[CURLOPT_HTTPHEADER] = $headers;
    }
    @curl_setopt_array($ch, $opts);
    $resp = @curl_exec($ch);
    $res['status'] = (int)@curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $res['body']   = is_string($resp) ? $resp : null;
    @curl_close($ch);
    return $res;
}

/** Email du compte de service (client_email uniquement, jamais la clé). */
function gsk_sa_email(array $config): string
{
    $saPath = (string)($config['google_sa_json'] ?? '');
    if ($saPath === '' || !is_file($saPath)) {
        return '';
    }
    $sa = json_decode((string)@file_get_contents($saPath), true);
    return is_array($sa) ? (string)($sa['client_email'] ?? '') : '';
}

/** Cache file path for a panel. */
function gsk_cache_path(string $dataDir, string $panel): string
{
    return rtrim($dataDir, '/\\') . '/gsk_' . $panel . '.json';
}

/** Read a cached panel if it exists and is younger than $maxAgeSec. Else null. */
function gsk_cache_read(string $dataDir, string $panel, int $maxAgeSec): ?array
{
    $path = gsk_cache_path($dataDir, $panel);
    if (!is_file($path)) {
        return null;
    }
    $raw = @file_get_contents($path);
    if (!is_string($raw) || $raw === '') {
        return null;
    }
    $j = json_decode($raw, true);
    if (!is_array($j) || !isset($j['fetched_at'])) {
        return null;
    }
    // Un panneau en échec ne reste en cache que 15 min (une réussite : 6 h) :
    // sinon une erreur de permission corrigée resterait affichée des heures.
    $failed = (array_key_exists('ok', $j) && empty($j['ok']))
           || (isset($j['state']) && $j['state'] !== 'ok');
    if ($failed) {
        $maxAgeSec = min($maxAgeSec, 900);
    }
    $age = time() - (int)$j['fetched_at'];
    if ($age > $maxAgeSec) {
        return null;
    }
    return $j;
}

/** Persist a panel payload with a fetched-at timestamp. Guarded. */
function gsk_cache_write(string $dataDir, string $panel, array $payload): array
{
    $dir = rtrim($dataDir, '/\\');
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $payload['fetched_at'] = time();
    $enc = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if (is_string($enc) && is_dir($dir)) {
        @file_put_contents(gsk_cache_path($dir, $panel), $enc, LOCK_EX);
    }
    return $payload;
}

/** Query Search Console searchAnalytics for a date range + dimensions. */
function gsk_gsc_query(string $token, string $siteUrl, string $startDate, string $endDate, array $dimensions, int $rowLimit): array
{
    $endpoint = 'https://searchconsole.googleapis.com/webmasters/v3/sites/'
        . rawurlencode($siteUrl) . '/searchAnalytics/query';
    $body = json_encode([
        'startDate'  => $startDate,
        'endDate'    => $endDate,
        'dimensions' => $dimensions,
        'rowLimit'   => $rowLimit,
    ], JSON_UNESCAPED_SLASHES);
    $r = gsk_http('POST', $endpoint, $token, is_string($body) ? $body : '{}');
    $rows = [];
    if ($r['status'] >= 200 && $r['status'] < 300 && is_string($r['body'])) {
        $j = json_decode($r['body'], true);
        if (is_array($j) && isset($j['rows']) && is_array($j['rows'])) {
            $rows = $j['rows'];
        }
    }
    return ['status' => $r['status'], 'rows' => $rows];
}

/**
 * Build the Search Console panel payload. Tries the configured siteUrl first;
 * on 403/404 retries the domain property 'sc-domain:mathieuhaye.fr'.
 * Returns a structured array (never throws). 'ok' flags data availability.
 */
function gsk_build_gsc(array $config): array
{
    $out = [
        'ok'       => false,
        'siteUsed' => '',
        'totals'   => ['clicks' => 0, 'impressions' => 0, 'ctr' => 0.0, 'position' => 0.0],
        'queries'  => [],
        'pages'    => [],
    ];
    $out['error'] = '';
    $token = google_token($config, 'https://www.googleapis.com/auth/webmasters.readonly');
    if ($token === null) {
        $out['error'] = 'jeton refusé : vérifier api/google-sa.json et que l\'API Search Console est activée sur le projet Google Cloud';
        return $out;
    }
    $endDate   = date('Y-m-d', time() - 3 * 86400);   // GSC data lags ~2-3 days
    $startDate = date('Y-m-d', time() - 31 * 86400);  // 28-day window before that
    $candidates = [];
    $primary = (string)($config['gsc_site_url'] ?? 'https://mathieuhaye.fr/');
    if ($primary === '') {
        $primary = 'https://mathieuhaye.fr/';
    }
    $candidates[] = $primary;
    $candidates[] = 'sc-domain:mathieuhaye.fr';

    $lastStatus = 0;
    foreach ($candidates as $site) {
        $totalsR = gsk_gsc_query($token, $site, $startDate, $endDate, [], 1);
        if ($totalsR['status'] === 403 || $totalsR['status'] === 404) {
            $lastStatus = $totalsR['status'];
            continue; // try next candidate
        }
        if ($totalsR['status'] < 200 || $totalsR['status'] >= 300) {
            $out['error'] = 'HTTP ' . $totalsR['status'] . ' sur ' . $site;
            return $out; // transient error, report unavailable
        }
        $out['siteUsed'] = $site;
        if (!empty($totalsR['rows'][0])) {
            $t = $totalsR['rows'][0];
            $out['totals']['clicks']      = (int)($t['clicks'] ?? 0);
            $out['totals']['impressions'] = (int)($t['impressions'] ?? 0);
            $out['totals']['ctr']         = (float)($t['ctr'] ?? 0);
            $out['totals']['position']    = (float)($t['position'] ?? 0);
        }
        $qR = gsk_gsc_query($token, $site, $startDate, $endDate, ['query'], 10);
        foreach ($qR['rows'] as $row) {
            $keys = isset($row['keys']) && is_array($row['keys']) ? $row['keys'] : [];
            $out['queries'][] = [
                'key'         => (string)($keys[0] ?? ''),
                'clicks'      => (int)($row['clicks'] ?? 0),
                'impressions' => (int)($row['impressions'] ?? 0),
                'ctr'         => (float)($row['ctr'] ?? 0),
                'position'    => (float)($row['position'] ?? 0),
            ];
        }
        $pR = gsk_gsc_query($token, $site, $startDate, $endDate, ['page'], 10);
        foreach ($pR['rows'] as $row) {
            $keys = isset($row['keys']) && is_array($row['keys']) ? $row['keys'] : [];
            $out['pages'][] = [
                'key'         => (string)($keys[0] ?? ''),
                'clicks'      => (int)($row['clicks'] ?? 0),
                'impressions' => (int)($row['impressions'] ?? 0),
                'ctr'         => (float)($row['ctr'] ?? 0),
                'position'    => (float)($row['position'] ?? 0),
            ];
        }
        $out['ok'] = true;
        return $out;
    }
    $out['error'] = 'HTTP ' . $lastStatus . ' sur ' . implode(' puis ', $candidates)
        . ' : le compte de service n\'a pas accès à la propriété Search Console';
    return $out;
}

/**
 * Build the GA4 panel payload via the Data API runReport.
 * 'state' is 'ok', 'unconfigured' (no property id), or 'error' (permission/etc.).
 */
function gsk_build_ga4(array $config): array
{
    $out = [
        'state'   => 'unconfigured',
        'totals'  => ['sessions' => 0, 'totalUsers' => 0, 'screenPageViews' => 0],
        'pages'   => [],
    ];
    $propId = trim((string)($config['ga4_property_id'] ?? ''));
    if ($propId === '' || !ctype_digit($propId)) {
        return $out; // stays 'unconfigured'
    }
    $out['error'] = '';
    $token = google_token($config, 'https://www.googleapis.com/auth/analytics.readonly');
    if ($token === null) {
        $out['state'] = 'error';
        $out['error'] = 'jeton refusé : vérifier api/google-sa.json et que l\'API Analytics Data est activée';
        return $out;
    }
    $endpoint = 'https://analyticsdata.googleapis.com/v1beta/properties/'
        . rawurlencode($propId) . ':runReport';

    // Totals
    $totalsBody = json_encode([
        'dateRanges' => [['startDate' => '28daysAgo', 'endDate' => 'today']],
        'metrics'    => [
            ['name' => 'sessions'],
            ['name' => 'totalUsers'],
            ['name' => 'screenPageViews'],
        ],
    ], JSON_UNESCAPED_SLASHES);
    $tR = gsk_http('POST', $endpoint, $token, is_string($totalsBody) ? $totalsBody : '{}');
    if ($tR['status'] < 200 || $tR['status'] >= 300) {
        $out['state'] = 'error';
        $out['error'] = 'HTTP ' . $tR['status'] . ' sur la propriété ' . $propId
            . ($tR['status'] === 403 ? ' : ajouter le compte de service en Lecteur sur la propriété GA4' : '');
        return $out;
    }
    $tj = is_string($tR['body']) ? json_decode($tR['body'], true) : null;
    if (is_array($tj) && !empty($tj['rows'][0]['metricValues'])) {
        $mv = $tj['rows'][0]['metricValues'];
        $out['totals']['sessions']        = (int)($mv[0]['value'] ?? 0);
        $out['totals']['totalUsers']      = (int)($mv[1]['value'] ?? 0);
        $out['totals']['screenPageViews'] = (int)($mv[2]['value'] ?? 0);
    }

    // Top pages
    $pagesBody = json_encode([
        'dateRanges' => [['startDate' => '28daysAgo', 'endDate' => 'today']],
        'dimensions' => [['name' => 'pagePath']],
        'metrics'    => [['name' => 'screenPageViews']],
        'orderBys'   => [['metric' => ['metricName' => 'screenPageViews'], 'desc' => true]],
        'limit'      => 10,
    ], JSON_UNESCAPED_SLASHES);
    $pR = gsk_http('POST', $endpoint, $token, is_string($pagesBody) ? $pagesBody : '{}');
    if ($pR['status'] >= 200 && $pR['status'] < 300 && is_string($pR['body'])) {
        $pj = json_decode($pR['body'], true);
        if (is_array($pj) && !empty($pj['rows']) && is_array($pj['rows'])) {
            foreach ($pj['rows'] as $row) {
                $dim = $row['dimensionValues'][0]['value'] ?? '';
                $val = $row['metricValues'][0]['value'] ?? 0;
                $out['pages'][] = ['path' => (string)$dim, 'views' => (int)$val];
            }
        }
    }
    $out['state'] = 'ok';
    return $out;
}

/**
 * Build the PageSpeed Insights panel (public API, no auth).
 * Returns ['ok' => bool, 'score' => int|null, 'lcp' => ?, 'cls' => ?, 'inp' => ?].
 */
function gsk_build_pagespeed(array $config): array
{
    $out = ['ok' => false, 'score' => null, 'metrics' => []];
    $url  = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
        . '?url=' . rawurlencode('https://mathieuhaye.fr/')
        . '&strategy=mobile&category=performance';
    $key = trim((string)($config['pagespeed_api_key'] ?? ''));
    if ($key !== '') {
        $url .= '&key=' . rawurlencode($key);
    }
    $r = gsk_http('GET', $url, null, null, 50);
    if ($r['status'] < 200 || $r['status'] >= 300 || !is_string($r['body'])) {
        $out['error'] = $r['status'] === 0 ? 'délai dépassé (PageSpeed peut prendre 30 s ou plus)' : 'HTTP ' . $r['status'];
        return $out;
    }
    $j = json_decode($r['body'], true);
    if (!is_array($j) || !isset($j['lighthouseResult'])) {
        return $out;
    }
    $lh = $j['lighthouseResult'];
    $scoreRaw = $lh['categories']['performance']['score'] ?? null;
    if (is_numeric($scoreRaw)) {
        $out['score'] = (int)round(((float)$scoreRaw) * 100);
    }
    $audits = isset($lh['audits']) && is_array($lh['audits']) ? $lh['audits'] : [];
    $pick = function (string $id) use ($audits): ?string {
        if (isset($audits[$id]['displayValue']) && is_string($audits[$id]['displayValue'])) {
            return $audits[$id]['displayValue'];
        }
        return null;
    };
    $metrics = [];
    $lcp = $pick('largest-contentful-paint');
    if ($lcp !== null) { $metrics[] = ['label' => 'LCP', 'value' => $lcp]; }
    $cls = $pick('cumulative-layout-shift');
    if ($cls !== null) { $metrics[] = ['label' => 'CLS', 'value' => $cls]; }
    // INP is field-only; the lab proxy is Total Blocking Time / max potential FID.
    $inp = $pick('interactive') ?? $pick('total-blocking-time') ?? $pick('max-potential-fid');
    if ($inp !== null) { $metrics[] = ['label' => 'INP / réactivité', 'value' => $inp]; }
    $out['metrics'] = $metrics;
    $out['ok'] = true;
    return $out;
}

/**
 * Return the three panels, using the 6h cache unless $force. Fail-graceful:
 * if a live fetch fails, falls back to any stale cache, else an empty payload.
 */
function gsk_panels(array $config, string $dataDir, bool $force): array
{
    $maxAge  = 6 * 3600;
    $panels  = [];
    $builders = [
        'gsc'       => 'gsk_build_gsc',
        'ga4'       => 'gsk_build_ga4',
        'pagespeed' => 'gsk_build_pagespeed',
    ];
    foreach ($builders as $name => $builder) {
        $cached = $force ? null : gsk_cache_read($dataDir, $name, $maxAge);
        if ($cached !== null) {
            $panels[$name] = $cached;
            continue;
        }
        $fresh = $builder($config);
        $fresh = gsk_cache_write($dataDir, $name, $fresh);
        $panels[$name] = $fresh;
    }
    return $panels;
}

/** Format a 0..1 CTR as a percentage string. */
function gsk_pct(float $ratio): string
{
    return number_format($ratio * 100, 1, ',', ' ') . ' %';
}

/** Format a large integer with a thin space thousands separator. */
function gsk_int(int $n): string
{
    return number_format($n, 0, ',', ' ');
}

/** '2026-07-05T10:22:33+02:00' -> '2026-07-05 10:22' (fallback: raw string). */
function fmt_ts(string $iso): string
{
    $t = strtotime($iso);
    if ($t === false) {
        return $iso;
    }
    return date('Y-m-d H:i', $t);
}

/** French phrasing for "X days ago". */
function days_ago_fr(int $days): string
{
    if ($days <= 0) {
        return "aujourd'hui";
    }
    if ($days === 1) {
        return 'il y a 1 jour';
    }
    return 'il y a ' . $days . ' jours';
}

/** Short French label for a scan verdict key. */
function verdict_fr(string $key): string
{
    $map = [
        'invisible'   => 'Invisible',
        'visible'     => 'Visible, pas citable',
        'citable'     => 'Lisible et citable',
        'agent_ready' => 'Prêt pour les agents',
    ];
    return $map[$key] ?? $key;
}


/* =========================================================
   Auth + POST handling
   ========================================================= */

if (empty($_SESSION['mh_csrf']) || !is_string($_SESSION['mh_csrf'])) {
    $_SESSION['mh_csrf'] = bin2hex(random_bytes(32));
}
$csrf = (string)$_SESSION['mh_csrf'];

$uaHash = hash('sha256', (string)($_SERVER['HTTP_USER_AGENT'] ?? ''));
$logged = !$setupMode
    && !empty($_SESSION['mh_admin_ok'])
    && is_string($_SESSION['mh_admin_ua'] ?? null)
    && hash_equals((string)$_SESSION['mh_admin_ua'], $uaHash);



/* =========================================================
   SEO / GEO — self-scan biencité + audit on-page local
   Réutilise le scanner public api/ai-scan.php (19 signaux) en boucle
   locale et audite les fichiers HTML des pages clés sur le disque.
   ========================================================= */

function seo_history_path(): string
{
    return __DIR__ . '/api/data/self-scans.jsonl';
}

function seo_last_path(): string
{
    return __DIR__ . '/api/data/self-scan-last.json';
}

/** POST {url} vers son propre scanner public ; enregistre historique + dernier. */
function seo_selfscan(): array
{
    $ch = curl_init('https://mathieuhaye.fr/api/ai-scan.php');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['url' => 'https://mathieuhaye.fr']),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT        => 60,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT      => 'mh-admin-selfscan/1.0',
    ]);
    $out = curl_exec($ch);
    curl_close($ch);
    $d = is_string($out) ? json_decode($out, true) : null;
    if (!is_array($d) || empty($d['ok'])) {
        return ['ok' => false, 'error' => is_array($d) ? (string)($d['error'] ?? 'scan_failed') : 'reseau'];
    }
    $checks = [];
    foreach ((array)($d['checks'] ?? []) as $c) {
        $checks[] = ['id' => (string)($c['id'] ?? ''), 'status' => (string)($c['status'] ?? '')];
    }
    $hist = [
        'ts'      => date('c'),
        'score'   => (int)($d['score'] ?? 0),
        'axes'    => $d['axes'] ?? null,
        'verdict' => (string)($d['verdict']['key'] ?? ''),
        'checks'  => $checks,
    ];
    $enc = json_encode($hist, JSON_UNESCAPED_UNICODE);
    if (is_string($enc)) {
        @file_put_contents(seo_history_path(), $enc . "\n", FILE_APPEND | LOCK_EX);
    }
    $encLast = json_encode($d, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    if (is_string($encLast)) {
        @file_put_contents(seo_last_path(), $encLast, LOCK_EX);
    }
    return $d;
}

/** Recommandations actionnables par check (adaptation « site codé main » du
    recommendations_map de biencité). */
function seo_recos(): array
{
    return [
        'secure'          => 'Servir tout le site en HTTPS avec redirection 301 (déjà dans .htaccess : vérifier le certificat).',
        'ai_access'       => 'Vérifier robots.txt : ne pas bloquer GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot ni Google-Extended si la visibilité IA est voulue.',
        'content_html'    => 'Le contenu principal doit être présent dans le HTML servi (pas de rendu JS obligatoire) : vérifier que les sections clés sont bien statiques.',
        'meta'            => 'Chaque page : <title> unique (15-60 car.) + meta description (80-165 car.) orientée bénéfice.',
        'sitemap'         => 'sitemap.xml à jour (lastmod réels) et déclaré dans robots.txt ; ajouter chaque nouvelle page.',
        'structured_data' => 'JSON-LD @graph sur chaque page clé : WebPage + BreadcrumbList, Service/Offer sur les pages services, FAQPage synchronisé avec la FAQ visible.',
        'headings'        => 'Un seul H1 par page + au moins deux H2 descriptifs : structure citable par les moteurs IA.',
        'social'          => 'Balises og:title / og:description / og:image (1200x630) sur chaque page partagée.',
        'llms_txt'        => '/llms.txt à la racine : identité, services, offres, liens ; le maintenir après chaque changement de positionnement.',
        'content_signals' => 'Header Content-Signal (search=yes, ai-input=yes, ai-train=no) via .htaccess : déclaré, vérifier qu\'il est bien servi.',
        'key_facts'       => 'Bloc de faits clés structurés (Dataset/DefinedTerm JSON-LD) sur la home : chiffres et offres à jour.',
        'speakable'       => 'Propriété speakable dans le JSON-LD WebPage pointant le H1/lead (cssSelector valides après refonte).',
        'entities'        => 'sameAs vers LinkedIn/Malt + Person/Organization JSON-LD cohérents sur tout le site.',
        'markdown_neg'    => 'Négociation Accept: text/markdown (.htaccess) + twins .md synchronisés avec le HTML après chaque réécriture.',
        'mcp_card'        => '.well-known/mcp/server-card.json : descriptions des outils à jour avec le positionnement.',
        'agent_skills'    => '.well-known/agent-skills/index.json : liens valides (view-background → /collaboration).',
        'oauth_pr'        => '.well-known/oauth-protected-resource + oauth-authorization-server : rester honnête (accès anonyme documenté).',
        'api_catalog'     => '.well-known/api-catalog : endpoints réels uniquement.',
        'auth_md'         => '/auth.md : guide d\'accès agents à jour (aucune clé requise).',
    ];
}

/** Audit on-page local des pages clés (lecture disque, zéro réseau). */
function seo_onpage_audit(): array
{
    $pages = [
        '/'                       => 'index.html',
        '/crm-sur-mesure'         => 'crm-sur-mesure.html',
        '/developpeur-agent-ia'   => 'developpeur-agent-ia.html',
        '/automatisation-n8n'     => 'automatisation-n8n.html',
        '/application-sur-mesure' => 'application-sur-mesure.html',
        '/agent-ia-pme'           => 'agent-ia-pme.html',
        '/freelance-ia'           => 'freelance-ia.html',
        '/collaboration'          => 'collaboration.html',
        '/projets'                => 'projets.html',
        '/discuter-avec-mon-ia'   => 'discuter-avec-mon-ia.html',
        '/maturite-ia'            => 'maturite-ia.html',
        '/visible-par-les-ia'     => 'visible-par-les-ia.html',
    ];
    $rows = [];
    foreach ($pages as $url => $file) {
        $path = __DIR__ . '/' . $file;
        if (!is_file($path)) {
            continue;
        }
        $html = (string)@file_get_contents($path);
        $title = '';
        if (preg_match('~<title>(.*?)</title>~si', $html, $m)) {
            $title = trim(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }
        $desc = '';
        if (preg_match('~<meta\s+name="description"\s+content="([^"]*)"~si', $html, $m)) {
            $desc = trim(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        }
        $h1 = preg_match_all('~<h1[\s>]~i', $html);
        $ld = (strpos($html, 'application/ld+json') !== false);
        $canonical = (strpos($html, 'rel="canonical"') !== false);
        $body = preg_replace('~<script[\s\S]*?</script>|<style[\s\S]*?</style>|<[^>]+>~', ' ', $html);
        $words = str_word_count((string)$body);
        $tLen = mb_strlen($title);
        $dLen = mb_strlen($desc);
        $rows[] = [
            'url'    => $url,
            'title'  => $tLen,
            'tOk'    => ($tLen >= 15 && $tLen <= 65),
            'desc'   => $dLen,
            'dOk'    => ($dLen >= 80 && $dLen <= 168),
            'h1'     => $h1,
            'h1Ok'   => ($h1 === 1),
            'ld'     => $ld,
            'canon'  => $canonical,
            'words'  => $words,
            'wOk'    => ($words >= 250),
        ];
    }
    return $rows;
}

/* =========================================================
   Logos clients (marquee de la home)
   Manifeste : assets/data/logos.json, lu par script.js sur la home.
   Fichiers uploades : assets/img/logos/custom/ (chemins FIXES, jamais
   derives d'une entree utilisateur ; le nom de fichier est regenere).
   ========================================================= */

function logos_json_path(): string
{
    return __DIR__ . '/assets/data/logos.json';
}

function logos_load(): array
{
    $path = logos_json_path();
    if (!is_file($path)) {
        return [];
    }
    $raw = @file_get_contents($path);
    $d   = is_string($raw) ? json_decode($raw, true) : null;
    return (is_array($d) && isset($d['logos']) && is_array($d['logos'])) ? array_values($d['logos']) : [];
}

function logos_save(array $logos): bool
{
    $dir = __DIR__ . '/assets/data';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
        return false;
    }
    $enc = json_encode(['logos' => array_values($logos)], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if (!is_string($enc)) {
        return false;
    }
    $tmp = $dir . '/.logos.tmp';
    if (@file_put_contents($tmp, $enc, LOCK_EX) === false) {
        return false;
    }
    @chmod($tmp, 0644);
    return @rename($tmp, logos_json_path());
}

$flash   = '';
$flashOk = '';
$pingOut = '';

// One-shot flashes carried across a PRG redirect (setup, settings...).
if (!empty($_SESSION['mh_flash_ok']) && is_string($_SESSION['mh_flash_ok'])) {
    $flashOk = $_SESSION['mh_flash_ok'];
    unset($_SESSION['mh_flash_ok']);
}
if (!empty($_SESSION['mh_flash_err']) && is_string($_SESSION['mh_flash_err'])) {
    $flash = $_SESSION['mh_flash_err'];
    unset($_SESSION['mh_flash_err']);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action   = (string)($_POST['action'] ?? '');
    $csrfPost = (string)($_POST['csrf'] ?? '');

    if ($csrfPost === '' || !hash_equals($csrf, $csrfPost)) {
        $flash = 'Session expirée : rechargez la page et réessayez.';
    } elseif ($action === 'logout') {
        $_SESSION = [];
        setcookie(session_name(), '', [
            'expires'  => time() - 42000,
            'path'     => '/',
            'secure'   => true,
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
        session_destroy();
        header('Location: /admin');
        exit;
    } elseif ($setupMode && $action === 'setup') {
        if (!rate_limit('adminlogin', 6, 900)) {
            $flash = 'Réessayez plus tard.';
        } else {
            $tokenGiven = (string)($_POST['token'] ?? '');
            $tokenReal  = (string)($config['index_ping_token'] ?? '');
            $password   = (string)($_POST['password'] ?? '');
            if ($tokenReal === '' || $tokenGiven === '' || !hash_equals($tokenReal, $tokenGiven)) {
                $flash = "Jeton d'autorisation invalide.";
            } elseif (strlen($password) < 12) {
                $flash = 'Mot de passe trop court : 12 caractères minimum.';
            } elseif (save_settings(['admin_password_hash' => password_hash($password, PASSWORD_DEFAULT)])) {
                // Password persisted server-side : nothing to copy by hand anymore.
                $_SESSION['mh_flash_ok'] = 'Mot de passe enregistré. Connectez-vous ci-dessous.';
                header('Location: /admin');
                exit;
            } else {
                $flash = "Échec de l'enregistrement du mot de passe sur le serveur. Vérifiez les droits d'écriture de api/data/.";
            }
        }
    } elseif (!$setupMode && !$logged && $action === 'login') {
        if (!rate_limit('adminlogin', 6, 900)) {
            $flash = 'Réessayez plus tard.';
        } else {
            $password = (string)($_POST['password'] ?? '');
            if ($password !== '' && password_verify($password, $adminHash)) {
                session_regenerate_id(true);
                $_SESSION['mh_admin_ok'] = true;
                $_SESSION['mh_admin_ua'] = $uaHash;
                $_SESSION['mh_csrf']     = bin2hex(random_bytes(32));
                header('Location: /admin');
                exit;
            }
            $flash = 'Mot de passe incorrect.';
        }
    } elseif ($logged && $action === 'ping') {
        $pingOut = admin_ping($config);
    } elseif ($logged && $action === 'gsk_refresh') {
        // Force a refetch of all three Google panels, then land on the tab.
        gsk_panels($config, __DIR__ . '/api/data', true);
        header('Location: /admin?tab=google');
        exit;
    } elseif ($logged && $action === 'save_settings') {
        // Build the update set from the submitted form. Secrets are only touched
        // when a non-empty value is provided (empty = keep the existing secret).
        // No submitted or existing secret is ever echoed back.
        $updates = [];
        $errors  = [];

        // --- Non-secret text / url / email / number fields ---
        $gscSite = trim((string)($_POST['gsc_site_url'] ?? ''));
        if ($gscSite !== '') {
            $okScDomain = (strpos($gscSite, 'sc-domain:') === 0);
            if ($okScDomain || filter_var($gscSite, FILTER_VALIDATE_URL) !== false) {
                $updates['gsc_site_url'] = $gscSite;
            } else {
                $errors[] = "L'URL Search Console n'est pas valide.";
            }
        }

        $ga4 = trim((string)($_POST['ga4_property_id'] ?? ''));
        // GA4 property id is a numeric string; allow empty to clear.
        if ($ga4 === '' || ctype_digit($ga4)) {
            $updates['ga4_property_id'] = $ga4;
        } else {
            $errors[] = "L'ID de propriété GA4 doit être numérique.";
        }

        $indexHost = trim((string)($_POST['index_host'] ?? ''));
        if ($indexHost !== '') {
            $updates['index_host'] = $indexHost;
        }

        $anthModel = trim((string)($_POST['anthropic_model'] ?? ''));
        if ($anthModel !== '') {
            $updates['anthropic_model'] = $anthModel;
        }

        // Numbers : cast to int, keep sane lower bounds.
        $maxTok = trim((string)($_POST['max_output_tok'] ?? ''));
        if ($maxTok !== '') {
            $updates['max_output_tok'] = max(1, (int)$maxTok);
        }
        $rlHour = trim((string)($_POST['rate_limit_per_h'] ?? ''));
        if ($rlHour !== '') {
            $updates['rate_limit_per_h'] = max(1, (int)$rlHour);
        }

        $allowedOrigin = trim((string)($_POST['allowed_origin'] ?? ''));
        if ($allowedOrigin !== '') {
            if (filter_var($allowedOrigin, FILTER_VALIDATE_URL) !== false) {
                $updates['allowed_origin'] = $allowedOrigin;
            } else {
                $errors[] = "L'origine autorisée n'est pas une URL valide.";
            }
        }

        // Emails.
        $recip = trim((string)($_POST['recipient_email'] ?? ''));
        if ($recip !== '') {
            if (filter_var($recip, FILTER_VALIDATE_EMAIL) !== false) {
                $updates['recipient_email'] = $recip;
            } else {
                $errors[] = "L'email destinataire n'est pas valide.";
            }
        }
        $brevoFrom = trim((string)($_POST['brevo_sender_email'] ?? ''));
        if ($brevoFrom !== '') {
            if (filter_var($brevoFrom, FILTER_VALIDATE_EMAIL) !== false) {
                $updates['brevo_sender_email'] = $brevoFrom;
            } else {
                $errors[] = "L'email expéditeur Brevo n'est pas valide.";
            }
        }
        $brevoName = trim((string)($_POST['brevo_sender_name'] ?? ''));
        if ($brevoName !== '') {
            $updates['brevo_sender_name'] = $brevoName;
        }

        // Checkbox -> bool (present = coché).
        $updates['send_visitor_copy'] = !empty($_POST['send_visitor_copy']);

        // --- Secret fields : only stored if a non-empty value was submitted ---
        $secretFields = [
            'pagespeed_api_key',
            'index_ping_token',
            'indexnow_key',
            'anthropic_key',
            'brevo_key',
        ];
        foreach ($secretFields as $sf) {
            $val = (string)($_POST[$sf] ?? '');
            if ($val !== '') {
                $updates[$sf] = $val;
            }
        }

        // --- Admin password change (optional) ---
        $newPw     = (string)($_POST['new_password'] ?? '');
        $confirmPw = (string)($_POST['confirm_password'] ?? '');
        if ($newPw !== '' || $confirmPw !== '') {
            if (strlen($newPw) < 12) {
                $errors[] = 'Nouveau mot de passe trop court : 12 caractères minimum.';
            } elseif (!hash_equals($newPw, $confirmPw)) {
                $errors[] = 'La confirmation du mot de passe ne correspond pas.';
            } else {
                $updates['admin_password_hash'] = password_hash($newPw, PASSWORD_DEFAULT);
            }
        }

        if (!empty($errors)) {
            $_SESSION['mh_flash_err'] = implode(' ', $errors);
        } elseif (save_settings($updates)) {
            $_SESSION['mh_flash_ok'] = 'Réglages enregistrés.';
        } else {
            $_SESSION['mh_flash_err'] = "Échec de l'enregistrement. Vérifiez les droits d'écriture de api/data/.";
        }
        header('Location: /admin?tab=settings');
        exit;
    } elseif ($logged && $action === 'seo_scan') {
        if (!rate_limit('selfscan', 6, 900)) {
            $_SESSION['mh_flash_err'] = 'Trop de scans rapprochés : réessayez dans quelques minutes.';
        } else {
            $res = seo_selfscan();
            if (!empty($res['ok'])) {
                $_SESSION['mh_flash_ok'] = 'Scan terminé : score ' . (int)($res['score'] ?? 0) . '/100.';
            } else {
                $_SESSION['mh_flash_err'] = 'Scan impossible (' . esc((string)($res['error'] ?? '?')) . ').';
            }
        }
        header('Location: /admin?tab=seo');
        exit;
    } elseif ($logged && $action === 'logo_add') {
        $errors = [];
        $alt    = trim((string)($_POST['logo_alt'] ?? ''));
        $href   = trim((string)($_POST['logo_href'] ?? ''));
        $h      = (int)($_POST['logo_h'] ?? 46);
        $white  = !empty($_POST['logo_white']);

        if ($alt === '' || mb_strlen($alt) > 60) {
            $errors[] = 'Nom du client requis (60 caractères max).';
        }
        if ($href !== '' && (filter_var($href, FILTER_VALIDATE_URL) === false || !preg_match('#^https?://#i', $href))) {
            $errors[] = 'Le lien du site doit être une URL http(s) valide.';
        }
        $h     = max(20, min(80, $h ?: 46));
        $logos = logos_load();
        if (count($logos) >= 20) {
            $errors[] = 'Maximum 20 logos dans le bandeau.';
        }

        $file = $_FILES['logo_file'] ?? null;
        if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            $errors[] = 'Fichier logo manquant ou upload échoué.';
        } elseif ((int)$file['size'] > 2 * 1024 * 1024) {
            $errors[] = 'Logo trop lourd : 2 Mo maximum.';
        }

        $ext = '';
        if (empty($errors)) {
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mime  = (string)$finfo->file((string)$file['tmp_name']);
            $map   = [
                'image/png'     => 'png',
                'image/jpeg'    => 'jpg',
                'image/webp'    => 'webp',
                'image/svg+xml' => 'svg',
            ];
            if (!isset($map[$mime])) {
                $errors[] = 'Format non supporté : png, jpg, webp ou svg.';
            } else {
                $ext = $map[$mime];
            }
        }

        if (empty($errors)) {
            $dir = __DIR__ . '/assets/img/logos/custom';
            if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
                $errors[] = "Impossible de créer assets/img/logos/custom/ (droits d'écriture ?).";
            } else {
                $slug = strtolower((string)preg_replace('/[^a-z0-9]+/i', '-', $alt));
                $slug = trim(substr($slug, 0, 40), '-');
                if ($slug === '') {
                    $slug = 'logo';
                }
                $name = $slug . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
                $dest = $dir . '/' . $name;
                if (!@move_uploaded_file((string)$file['tmp_name'], $dest)) {
                    $errors[] = "Échec de l'enregistrement du fichier sur le serveur.";
                } else {
                    @chmod($dest, 0644);
                    $logos[] = [
                        'file'  => '/assets/img/logos/custom/' . $name,
                        'alt'   => $alt,
                        'href'  => $href,
                        'h'     => $h,
                        'white' => $white,
                    ];
                    if (!logos_save($logos)) {
                        @unlink($dest);
                        $errors[] = "Échec de l'écriture de assets/data/logos.json (droits d'écriture ?).";
                    }
                }
            }
        }

        if ($errors) {
            $_SESSION['mh_flash_err'] = implode(' ', $errors);
        } else {
            $_SESSION['mh_flash_ok'] = 'Logo ajouté : le bandeau de la home est à jour immédiatement.';
        }
        header('Location: /admin?tab=logos');
        exit;
    } elseif ($logged && $action === 'logo_delete') {
        $idx   = (int)($_POST['idx'] ?? -1);
        $logos = logos_load();
        if ($idx >= 0 && isset($logos[$idx])) {
            $entry = $logos[$idx];
            array_splice($logos, $idx, 1);
            if (logos_save($logos)) {
                // Seuls les fichiers uploades (custom/) sont supprimes du disque :
                // les 5 logos d'origine restent disponibles pour re-ajout.
                $rel = (string)($entry['file'] ?? '');
                if (strpos($rel, '/assets/img/logos/custom/') === 0) {
                    $base = basename($rel);
                    if ($base !== '' && preg_match('/^[a-z0-9._-]+$/i', $base)) {
                        @unlink(__DIR__ . '/assets/img/logos/custom/' . $base);
                    }
                }
                $_SESSION['mh_flash_ok'] = 'Logo retiré du bandeau.';
            } else {
                $_SESSION['mh_flash_err'] = "Échec de l'écriture de assets/data/logos.json.";
            }
        }
        header('Location: /admin?tab=logos');
        exit;
    }
}


/* =========================================================
   Tab data (server-rendered, whitelist)
   ========================================================= */

$tabs = [
    'dashboard' => 'Dashboard',
    'leads'     => 'Leads & scans',
    'articles'  => 'Articles',
    'logos'     => 'Logos',    'seo'       => 'SEO / GEO',

    'google'    => 'Google',
    'actions'   => 'Actions',
    'settings'  => 'Réglages',
];
$tab = (string)($_GET['tab'] ?? 'dashboard');
if (!isset($tabs[$tab])) {
    $tab = 'dashboard';
}

$dataDir      = __DIR__ . '/api/data';
$frArticles   = [];
$enArticles   = [];
$contactsInfo = ['total' => 0, 'rows' => []];
$scansInfo    = ['total' => 0, 'rows' => []];
$health       = null;
$daysSince    = null;
$seoLast      = null;
$seoHist      = ['total' => 0, 'rows' => []];
$seoPages     = [];
$logosList    = [];
$gskPanels    = null;

if ($logged) {
    if ($tab === 'dashboard' || $tab === 'articles') {
        $frArticles = blog_articles(__DIR__ . '/blog');
        $enArticles = blog_articles(__DIR__ . '/blog/en');
        if (!empty($frArticles)) {
            $lastTs = strtotime($frArticles[0]['date']);
            if ($lastTs !== false) {
                $daysSince = (int)floor((time() - $lastTs) / 86400);
            }
        }
    }
    if ($tab === 'dashboard') {
        $contactsInfo = read_jsonl($dataDir . '/contacts.jsonl', 1);
        $scansInfo    = read_jsonl($dataDir . '/scans.jsonl', 1);
        $health       = site_health();
    }
    if ($tab === 'leads') {
        $contactsInfo = read_jsonl($dataDir . '/contacts.jsonl', 200);
        $scansInfo    = read_jsonl($dataDir . '/scans.jsonl', 200);
    }
    if ($tab === 'seo') {
        $rawLast = is_file(seo_last_path()) ? @file_get_contents(seo_last_path()) : false;
        $seoLast = is_string($rawLast) ? json_decode($rawLast, true) : null;
        $seoHist = read_jsonl(seo_history_path(), 60);
        $seoPages = seo_onpage_audit();
    }
    if ($tab === 'logos') {
        $logosList = logos_load();
    }
    if ($tab === 'google') {
        // Cached (6h) unless a Rafraichir POST forced a refetch above.
        $gskPanels = gsk_panels($config, $dataDir, false);
    }
}
$warnCadence = ($daysSince !== null && $daysSince > 3);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Back office &middot; Mathieu Haye</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --bordeaux:#8B1A2F; --bordeaux-2:#C13B30; --deep:#3A0F1F; --ink:#1F0D19;
  --gold:#FCBA35; --cream:#FBF7F2;
  --bg:#150A12;
  --card:rgba(251,247,242,.04);
  --border:rgba(251,247,242,.10);
  --tx:#F1E7EA; --tx-dim:#C4B2B9; --tx-faint:#8F7B84;
  --ok:#3ECF8E; --ko:#E0524A;
  --font-mono:'JetBrains Mono',ui-monospace,SFMono-Regular,monospace;
  --font-disp:'Space Grotesk',sans-serif;
  --font-body:'Inter',system-ui,sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{color-scheme:dark}
body{background:var(--bg);color:var(--tx);font-family:var(--font-body);font-size:15px;line-height:1.6;min-height:100vh}
body::before{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(55% 45% at 12% 0%,rgba(139,26,47,.30),transparent 62%),radial-gradient(45% 38% at 100% 100%,rgba(252,186,53,.06),transparent 60%)}
a{color:var(--gold);text-decoration:none}
a:hover{text-decoration:underline}
.wrap{position:relative;max-width:1100px;margin:0 auto;padding:26px 20px 90px}
.topbar{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
.wordmark{font-family:var(--font-disp);font-size:20px;font-weight:600;color:var(--cream)}
.wordmark em{font-style:italic;color:var(--gold)}
.eyebrow{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);font-weight:600}
.topmeta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:999px;border:1px solid var(--border);background:transparent;color:var(--tx);font-family:var(--font-body);font-weight:600;font-size:13.5px;cursor:pointer;transition:all .18s ease}
.btn:hover{border-color:var(--gold);color:var(--gold)}
.btn-p{background:var(--bordeaux);border-color:var(--bordeaux);color:#fff;box-shadow:0 6px 20px rgba(139,26,47,.35)}
.btn-p:hover{background:var(--bordeaux-2);border-color:var(--bordeaux-2);color:#fff}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-top:26px;border-bottom:1px solid var(--border)}
.tab{font-family:var(--font-mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--tx-dim);padding:10px 14px;border-bottom:2px solid transparent}
.tab:hover{color:var(--cream);text-decoration:none}
.tab.on{color:var(--gold);border-bottom-color:var(--gold)}
h1{font-family:var(--font-disp);font-size:clamp(1.5rem,3vw,2rem);font-weight:600;color:var(--cream);margin-top:30px;line-height:1.15}
h2{font-family:var(--font-disp);font-size:1.1rem;font-weight:600;color:var(--cream)}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px 24px;margin-top:18px}
.card-label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:12px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:20px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px 20px}
.kpi .n{font-family:var(--font-disp);font-size:30px;font-weight:700;color:var(--cream);line-height:1.1}
.kpi .l{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--tx-faint);margin-top:6px}
.kpi .s{font-size:12.5px;color:var(--tx-dim);margin-top:4px}
.kpi.warn{border-color:rgba(252,186,53,.45)}
.kpi.warn .n{color:var(--gold)}
.gold{color:var(--gold)}
.dotline{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:14px;border-bottom:1px solid rgba(251,247,242,.05)}
.dotline:last-child{border-bottom:none}
.dot{width:9px;height:9px;border-radius:50%;flex:0 0 auto}
.dot.ok{background:var(--ok);box-shadow:0 0 8px rgba(62,207,142,.5)}
.dot.ko{background:var(--ko);box-shadow:0 0 8px rgba(224,82,74,.5)}
.links{display:flex;gap:10px;flex-wrap:wrap}
.pill{display:inline-block;padding:9px 16px;border-radius:999px;border:1px solid var(--border);font-size:13px;color:var(--tx);transition:all .18s ease}
.pill:hover{border-color:var(--gold);color:var(--gold);text-decoration:none}
.tblwrap{overflow-x:auto;margin-top:8px}
table{width:100%;border-collapse:collapse;font-size:13.5px}
th{font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--tx-faint);text-align:left;padding:9px 12px;border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:9px 12px;border-bottom:1px solid rgba(251,247,242,.05);vertical-align:top;color:var(--tx-dim)}
td.strong{color:var(--cream);font-weight:500}
td.mono{font-family:var(--font-mono);font-size:12px;white-space:nowrap}
.empty{color:var(--tx-faint);font-size:14px;padding:12px 4px}
.note{font-size:13px;color:var(--tx-faint);line-height:1.6}
.flash{margin-top:16px;padding:12px 16px;border-radius:10px;border:1px solid rgba(224,82,74,.4);background:rgba(224,82,74,.08);color:#F3B7B2;font-size:14px}
.flash-ok{margin-top:16px;padding:12px 16px;border-radius:10px;border:1px solid rgba(62,207,142,.4);background:rgba(62,207,142,.08);color:#B6EFD3;font-size:14px}
.fieldset{border:1px solid var(--border);border-radius:14px;padding:18px 20px 6px;margin-top:18px}
.fieldset legend{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:600;padding:0 8px}
.field{margin-bottom:14px}
.field .hint{font-size:12px;color:var(--tx-faint);margin-top:4px}
input[type=email],input[type=number]{width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:rgba(21,10,18,.6);color:var(--cream);font-family:var(--font-body);font-size:15px;outline:none}
input[type=email]:focus,input[type=number]:focus{border-color:var(--bordeaux-2)}
.badge{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;vertical-align:middle}
.badge.set{border:1px solid rgba(62,207,142,.4);background:rgba(62,207,142,.08);color:var(--ok)}
.badge.unset{border:1px solid var(--border);background:transparent;color:var(--tx-faint)}
.checkrow{display:flex;align-items:center;gap:10px;margin-top:6px}
.checkrow input[type=checkbox]{width:18px;height:18px;accent-color:var(--bordeaux-2)}
.checkrow label{margin:0;text-transform:none;letter-spacing:0;font-family:var(--font-body);font-size:14px;color:var(--tx-dim)}
.auth{position:relative;max-width:440px;margin:9vh auto 0;padding:0 20px}
.auth .card{padding:30px 30px 28px}
label{display:block;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--tx-faint);margin:16px 0 6px}
input[type=password],input[type=text]{width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:rgba(21,10,18,.6);color:var(--cream);font-family:var(--font-body);font-size:15px;outline:none}
input[type=password]:focus,input[type=text]:focus{border-color:var(--bordeaux-2)}
code.hash{display:block;margin-top:12px;padding:14px 16px;border-radius:10px;border:1px solid rgba(252,186,53,.35);background:rgba(252,186,53,.06);color:var(--gold);font-family:var(--font-mono);font-size:12.5px;word-break:break-all;user-select:all}
pre.json{margin-top:14px;padding:16px 18px;border-radius:12px;border:1px solid var(--border);background:rgba(21,10,18,.65);color:var(--tx);font-family:var(--font-mono);font-size:12.5px;line-height:1.55;overflow-x:auto;white-space:pre-wrap;word-break:break-word}
ol.check{margin:6px 0 0 20px;display:grid;gap:8px}
ol.check li{color:var(--tx-dim);font-size:14px}
ol.check code{font-family:var(--font-mono);font-size:12.5px;color:var(--gold);background:rgba(252,186,53,.08);padding:2px 6px;border-radius:6px}
.grid2{display:grid;grid-template-columns:1fr;gap:0}
.logo-thumb{height:34px;width:auto;background:#F3F1EA;border-radius:6px;padding:3px;vertical-align:middle}
input[type=file]{width:100%;padding:10px 12px;border-radius:10px;border:1px dashed var(--border);background:rgba(21,10,18,.6);color:var(--tx-dim);font-family:var(--font-body);font-size:13.5px}
.foot{margin-top:44px;font-family:var(--font-mono);font-size:11px;color:var(--tx-faint);text-align:center}
</style>
</head>
<body>
<?php if (!$logged): ?>

<div class="auth">
  <div style="text-align:center;margin-bottom:10px"><span class="wordmark">mathieu <em>haye.</em></span></div>
  <div class="card">
  <?php if ($setupMode): ?>
    <div class="eyebrow">Configuration initiale</div>
    <h2 style="margin-top:8px">Créer le mot de passe du back office</h2>
      <p class="note" style="margin-top:14px">Aucun mot de passe n'est encore configuré. Entrez le jeton d'autorisation (la valeur de <strong>index_ping_token</strong> dans api/config.php) et le mot de passe souhaité : il sera enregistré de façon sécurisée sur le serveur, rien à copier à la main.</p>
      <?php if ($flashOk !== ''): ?><div class="flash-ok"><?= esc($flashOk) ?></div><?php endif; ?>
      <?php if ($flash !== ''): ?><div class="flash"><?= esc($flash) ?></div><?php endif; ?>
      <form method="post" action="/admin">
        <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
        <input type="hidden" name="action" value="setup">
        <label for="token">Jeton d'autorisation</label>
        <input type="password" id="token" name="token" required autocomplete="off">
        <label for="password">Mot de passe souhaité (12 caractères min.)</label>
        <input type="password" id="password" name="password" required minlength="12" autocomplete="new-password">
        <div style="margin-top:20px"><button type="submit" class="btn btn-p">Enregistrer le mot de passe</button></div>
      </form>
  <?php else: ?>
    <div class="eyebrow">Espace privé</div>
    <h2 style="margin-top:8px">Back office</h2>
    <?php if ($flashOk !== ''): ?><div class="flash-ok"><?= esc($flashOk) ?></div><?php endif; ?>
    <?php if ($flash !== ''): ?><div class="flash"><?= esc($flash) ?></div><?php endif; ?>
    <form method="post" action="/admin">
      <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
      <input type="hidden" name="action" value="login">
      <label for="password">Mot de passe</label>
      <input type="password" id="password" name="password" required autocomplete="current-password" autofocus>
      <div style="margin-top:20px"><button type="submit" class="btn btn-p">Se connecter</button></div>
    </form>
  <?php endif; ?>
  </div>
  <div class="foot">mathieuhaye.fr &middot; accès réservé</div>
</div>

<?php else: ?>

<div class="wrap">
  <div class="topbar">
    <div>
      <span class="wordmark">mathieu <em>haye.</em></span>
      <div class="eyebrow" style="margin-top:4px">Back office</div>
    </div>
    <div class="topmeta">
      <a class="pill" href="https://mathieuhaye.fr/" target="_blank" rel="noopener noreferrer">Voir le site</a>
      <form method="post" action="/admin">
        <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
        <input type="hidden" name="action" value="logout">
        <button type="submit" class="btn">Se déconnecter</button>
      </form>
    </div>
  </div>

  <nav class="tabs">
    <?php foreach ($tabs as $key => $labelTab): ?>
      <a class="tab<?= $tab === $key ? ' on' : '' ?>" href="/admin?tab=<?= esc($key) ?>"><?= esc($labelTab) ?></a>
    <?php endforeach; ?>
  </nav>

  <?php if ($flashOk !== ''): ?><div class="flash-ok"><?= esc($flashOk) ?></div><?php endif; ?>
  <?php if ($flash !== ''): ?><div class="flash"><?= esc($flash) ?></div><?php endif; ?>

  <?php if ($tab === 'dashboard'): ?>

    <h1>Dashboard</h1>

    <div class="kpis">
      <div class="kpi">
        <div class="n"><?= count($frArticles) ?></div>
        <div class="l">Articles FR</div>
      </div>
      <div class="kpi">
        <div class="n"><?= count($enArticles) ?></div>
        <div class="l">Articles EN</div>
      </div>
      <div class="kpi<?= $warnCadence ? ' warn' : '' ?>">
        <div class="n"><?= $daysSince === null ? '&ndash;' : (int)$daysSince . ' j' ?></div>
        <div class="l">Dernier article</div>
        <div class="s">
          <?php if (empty($frArticles)): ?>
            aucun article trouvé
          <?php else: ?>
            <?= esc($frArticles[0]['date']) ?> &middot; <?= esc(days_ago_fr((int)$daysSince)) ?>
            <?php if ($warnCadence): ?><br><span class="gold">cadence visée : 1 article / 2 jours</span><?php endif; ?>
          <?php endif; ?>
        </div>
      </div>
      <div class="kpi">
        <div class="n"><?= (int)$scansInfo['total'] ?></div>
        <div class="l">Scans loggés</div>
      </div>
      <div class="kpi">
        <div class="n"><?= (int)$contactsInfo['total'] ?></div>
        <div class="l">Contacts loggés</div>
      </div>
    </div>

    <div class="card">
      <div class="card-label">Santé du site</div>
      <?php if ($health === null): ?>
        <div class="empty">Vérification indisponible (curl absent sur ce serveur).</div>
      <?php else: ?>
        <?php foreach ($health as $h): ?>
          <div class="dotline"><span class="dot <?= $h['ok'] ? 'ok' : 'ko' ?>"></span><span><?= esc($h['label']) ?></span></div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>

    <div class="card">
      <div class="card-label">Liens rapides</div>
      <div class="links">
        <a class="pill" href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Google Search Console</a>
        <a class="pill" href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer">Bing Webmaster</a>
        <a class="pill" href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">Google Analytics</a>
        <a class="pill" href="https://my.ionos.fr/" target="_blank" rel="noopener noreferrer">IONOS</a>
        <a class="pill" href="https://calendly.com/mathieu-haye/30min" target="_blank" rel="noopener noreferrer">Lien de booking</a>
        <a class="pill" href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer">LinkedIn Post Inspector</a>
      </div>
    </div>

  <?php elseif ($tab === 'leads'): ?>

    <h1>Leads &amp; scans</h1>

    <div class="card">
      <div class="card-label">Contacts &middot; <?= (int)$contactsInfo['total'] ?> au total<?= $contactsInfo['total'] > 200 ? ' (200 affichés)' : '' ?></div>
      <?php if (empty($contactsInfo['rows'])): ?>
        <div class="empty">Aucune donnée encore : les prochains scans/contacts seront loggés.</div>
      <?php else: ?>
        <div class="tblwrap">
        <table>
          <tr><th>Date</th><th>Nom</th><th>Email</th><th>Message (extrait)</th><th>Langue</th><th>Envoyé</th></tr>
          <?php foreach ($contactsInfo['rows'] as $r): ?>
          <tr>
            <td class="mono"><?= esc(fmt_ts((string)($r['ts'] ?? ''))) ?></td>
            <td class="strong"><?= esc((string)($r['name'] ?? '')) ?></td>
            <td><?= esc((string)($r['email'] ?? '')) ?></td>
            <td><?= esc(mb_substr((string)($r['message'] ?? ''), 0, 200)) ?></td>
            <td class="mono"><?= esc((string)($r['lang'] ?? '')) ?></td>
            <td><span class="dot <?= !empty($r['sent']) ? 'ok' : 'ko' ?>" style="display:inline-block"></span></td>
          </tr>
          <?php endforeach; ?>
        </table>
        </div>
      <?php endif; ?>
    </div>

    <div class="card">
      <div class="card-label">Scans de visibilité IA &middot; <?= (int)$scansInfo['total'] ?> au total<?= $scansInfo['total'] > 200 ? ' (200 affichés)' : '' ?></div>
      <?php if (empty($scansInfo['rows'])): ?>
        <div class="empty">Aucune donnée encore : les prochains scans/contacts seront loggés.</div>
      <?php else: ?>
        <div class="tblwrap">
        <table>
          <tr><th>Date</th><th>URL scannée</th><th>Host</th><th>Score</th><th>Verdict</th><th>Plateforme</th><th>Langue</th></tr>
          <?php foreach ($scansInfo['rows'] as $r): ?>
          <tr>
            <td class="mono"><?= esc(fmt_ts((string)($r['ts'] ?? ''))) ?></td>
            <td><?= esc((string)($r['url'] ?? '')) ?></td>
            <td class="strong"><?= esc((string)($r['host'] ?? '')) ?></td>
            <td class="mono"><?= (int)($r['score'] ?? 0) ?>/100</td>
            <td><?= esc(verdict_fr((string)($r['verdict'] ?? ''))) ?></td>
            <td class="mono"><?= esc((string)($r['platform'] ?? '')) ?></td>
            <td class="mono"><?= esc((string)($r['lang'] ?? '')) ?></td>
          </tr>
          <?php endforeach; ?>
        </table>
        </div>
      <?php endif; ?>
    </div>

  <?php elseif ($tab === 'articles'): ?>

    <h1>Articles</h1>

    <div class="kpis">
      <div class="kpi">
        <div class="n"><?= count($frArticles) ?></div>
        <div class="l">Articles FR</div>
      </div>
      <div class="kpi">
        <div class="n"><?= count($enArticles) ?></div>
        <div class="l">Articles EN</div>
      </div>
      <div class="kpi<?= $warnCadence ? ' warn' : '' ?>">
        <div class="n"><?= $daysSince === null ? '&ndash;' : (int)$daysSince . ' j' ?></div>
        <div class="l">Cadence</div>
        <div class="s">
          <?php if ($daysSince === null): ?>
            aucun article daté
          <?php elseif ($warnCadence): ?>
            <span class="gold">en retard &middot; cadence visée : 1 article / 2 jours</span>
          <?php else: ?>
            dans les temps (1 article / 2 jours)
          <?php endif; ?>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-label">20 derniers articles (FR)</div>
      <?php if (empty($frArticles)): ?>
        <div class="empty">Aucun article trouvé dans blog/.</div>
      <?php else: ?>
        <div class="tblwrap">
        <table>
          <tr><th>Date</th><th>Titre</th><th>Lien</th></tr>
          <?php foreach (array_slice($frArticles, 0, 20) as $a): ?>
          <tr>
            <td class="mono"><?= esc($a['date']) ?></td>
            <td class="strong"><?= esc($a['title']) ?></td>
            <td><a href="https://mathieuhaye.fr/blog/<?= esc(rawurlencode($a['slug'])) ?>" target="_blank" rel="noopener noreferrer">Voir &rarr;</a></td>
          </tr>
          <?php endforeach; ?>
        </table>
        </div>
      <?php endif; ?>
    </div>

    <div class="card">
      <div class="card-label">Publier un article &middot; checklist</div>
      <ol class="check">
        <li>Ouvrir Claude Code à la racine du repo.</li>
        <li>Coller le prompt <code>_docs/articles-prompt.md</code> (choisir type A actu ou B question client).</li>
        <li>Vérifier le rapport + <code>node --check script.js</code>.</li>
        <li>Lancer <code>python _build_deploy.py</code>.</li>
        <li>Uploader les 12 fichiers listés par le rapport.</li>
        <li>Cliquer le bouton Ping indexation (onglet <a href="/admin?tab=actions">Actions</a>).</li>
      </ol>
    </div>

  <?php elseif ($tab === 'seo'): ?>
    <h1>SEO / GEO</h1>
    <p class="note" style="margin-top:10px">Moteur d'audit de <a href="https://www.biencite.fr/" target="_blank" rel="noopener">biencité</a> (19 signaux : visible / citable / agent-ready) appliqué à mathieuhaye.fr, plus un audit on-page des fichiers du site.</p>

    <div class="card">
      <div class="card-label">Scan visibilité IA &middot; mathieuhaye.fr</div>
      <form method="post" action="/admin" style="margin-bottom:14px">
        <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
        <input type="hidden" name="action" value="seo_scan">
        <button class="btn btn-p" type="submit">Lancer un scan</button>
      </form>
      <?php if (is_array($seoLast) && !empty($seoLast['ok'])): ?>
        <?php
          $axes = (array)($seoLast['axes'] ?? []);
          $checksArr = (array)($seoLast['checks'] ?? []);
          $recos = seo_recos();
          $prev = null;
          if ((int)$seoHist['total'] >= 2) {
              $r = $seoHist['rows'];
              $prev = $r[count($r) - 2] ?? null;
          }
          $delta = (is_array($prev) && isset($prev['score'])) ? ((int)($seoLast['score'] ?? 0) - (int)$prev['score']) : null;
        ?>
        <div class="kpis">
          <div class="kpi"><div class="n"><?= (int)($seoLast['score'] ?? 0) ?>/100<?= $delta !== null ? ' <span style="font-size:14px;color:var(--tx-dim)">(' . ($delta >= 0 ? '+' : '') . (int)$delta . ')</span>' : '' ?></div><div class="l">Score global</div><div class="s"><?= esc((string)($seoLast['verdict']['title'] ?? '')) ?></div></div>
          <div class="kpi"><div class="n"><?= (int)($axes['visible'] ?? 0) ?></div><div class="l">Visible</div></div>
          <div class="kpi"><div class="n"><?= (int)($axes['citable'] ?? 0) ?></div><div class="l">Citable</div></div>
          <div class="kpi"><div class="n"><?= (int)($axes['agent'] ?? 0) ?></div><div class="l">Agent-ready</div></div>
        </div>
        <?php if ((int)$seoHist['total'] >= 2): ?>
        <?php
          $pts = [];
          $histRows = array_slice($seoHist['rows'], -30);
          $n = count($histRows);
          foreach ($histRows as $i => $hh) {
              $x = $n > 1 ? round($i * 220 / ($n - 1), 1) : 0;
              $y = round(34 - max(0, min(100, (int)($hh['score'] ?? 0))) * 0.30, 1);
              $pts[] = $x . ',' . $y;
          }
        ?>
        <div style="margin-top:14px">
          <svg width="230" height="40" viewBox="0 0 230 40" aria-label="Historique du score">
            <polyline fill="none" stroke="#FCBA35" stroke-width="2" points="<?= esc(implode(' ', $pts)) ?>"/>
          </svg>
          <span class="note" style="margin-left:8px"><?= (int)$seoHist['total'] ?> scans enregistrés</span>
        </div>
        <?php endif; ?>
        <div class="tblwrap" style="margin-top:16px">
          <table>
            <tr><th></th><th>Signal</th><th>Axe</th><th>Action recommandée</th></tr>
            <?php foreach ($checksArr as $c): ?>
            <?php $pass = (($c['status'] ?? '') === 'pass'); ?>
            <tr>
              <td><span class="dot <?= $pass ? 'ok' : 'ko' ?>"></span></td>
              <td class="strong"><?= esc((string)($c['label'] ?? $c['id'] ?? '')) ?></td>
              <td class="mono"><?= esc((string)($c['axis'] ?? '')) ?></td>
              <td><?= $pass ? '<span style="color:var(--tx-faint)">OK</span>' : esc((string)($recos[(string)($c['id'] ?? '')] ?? 'Voir la fiche correspondante sur biencité.')) ?></td>
            </tr>
            <?php endforeach; ?>
          </table>
        </div>
      <?php else: ?>
        <div class="empty">Aucun scan enregistré : lancez le premier scan ci-dessus (une quinzaine de secondes).</div>
      <?php endif; ?>
    </div>

    <div class="card">
      <div class="card-label">Audit on-page &middot; <?= count($seoPages) ?> pages clés (fichiers locaux)</div>
      <div class="tblwrap">
        <table>
          <tr><th>Page</th><th>Title</th><th>Description</th><th>H1</th><th>JSON-LD</th><th>Canonical</th><th>Mots</th></tr>
          <?php foreach ($seoPages as $pg): ?>
          <tr>
            <td class="mono"><a href="https://mathieuhaye.fr<?= esc($pg['url']) ?>" target="_blank" rel="noopener"><?= esc($pg['url']) ?></a></td>
            <td><span class="dot <?= $pg['tOk'] ? 'ok' : 'ko' ?>"></span> <?= (int)$pg['title'] ?> c.</td>
            <td><span class="dot <?= $pg['dOk'] ? 'ok' : 'ko' ?>"></span> <?= (int)$pg['desc'] ?> c.</td>
            <td><span class="dot <?= $pg['h1Ok'] ? 'ok' : 'ko' ?>"></span> <?= (int)$pg['h1'] ?></td>
            <td><span class="dot <?= $pg['ld'] ? 'ok' : 'ko' ?>"></span></td>
            <td><span class="dot <?= $pg['canon'] ? 'ok' : 'ko' ?>"></span></td>
            <td><span class="dot <?= $pg['wOk'] ? 'ok' : 'ko' ?>"></span> <?= (int)$pg['words'] ?></td>
          </tr>
          <?php endforeach; ?>
        </table>
      </div>
      <p class="note" style="margin-top:12px">Seuils : title 15-65 caractères, description 80-168, exactement 1 H1, JSON-LD et canonical présents, 250 mots minimum. L'audit lit les fichiers du serveur : il reflète ce qui est réellement en ligne.</p>
    </div>

  <?php elseif ($tab === 'logos'): ?>
    <h1>Logos clients</h1>
    <p class="note" style="margin-top:10px">Le bandeau &laquo;&nbsp;Ils me font déjà confiance&nbsp;&raquo; de la home lit <code style="font-family:var(--font-mono);font-size:12px">assets/data/logos.json</code>, géré ici. Les changements sont visibles immédiatement (FR et EN).</p>

    <div class="card">
      <div class="card-label">Bandeau actuel &middot; <?= count($logosList) ?> logo<?= count($logosList) === 1 ? '' : 's' ?></div>
      <?php if (empty($logosList)): ?>
        <div class="empty">Aucun logo dans le manifeste : la home affiche sa liste HTML par défaut.</div>
      <?php else: ?>
      <div class="tblwrap">
        <table>
          <tr><th>Logo</th><th>Client</th><th>Lien du site</th><th>Hauteur</th><th>Blanc</th><th></th></tr>
          <?php foreach ($logosList as $i => $lg): ?>
          <tr>
            <td><img class="logo-thumb" src="<?= esc((string)($lg['file'] ?? '')) ?>" alt=""></td>
            <td class="strong"><?= esc((string)($lg['alt'] ?? '')) ?></td>
            <td class="mono"><?= ($lg['href'] ?? '') !== '' ? esc((string)$lg['href']) : '&mdash;' ?></td>
            <td class="mono"><?= (int)($lg['h'] ?? 46) ?>&nbsp;px</td>
            <td class="mono"><?= !empty($lg['white']) ? 'oui' : '&mdash;' ?></td>
            <td>
              <form method="post" action="/admin" onsubmit="return confirm('Retirer ce logo du bandeau ?')">
                <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
                <input type="hidden" name="action" value="logo_delete">
                <input type="hidden" name="idx" value="<?= (int)$i ?>">
                <button class="btn" type="submit">Retirer</button>
              </form>
            </td>
          </tr>
          <?php endforeach; ?>
        </table>
      </div>
      <?php endif; ?>
    </div>

    <div class="card">
      <div class="card-label">Ajouter un logo</div>
      <form method="post" action="/admin" enctype="multipart/form-data">
        <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
        <input type="hidden" name="action" value="logo_add">
        <div class="field">
          <label for="logo_alt">Nom du client</label>
          <input type="text" id="logo_alt" name="logo_alt" required maxlength="60">
        </div>
        <div class="field">
          <label for="logo_href">Lien du site (optionnel)</label>
          <input type="text" id="logo_href" name="logo_href" placeholder="https://exemple.fr" inputmode="url">
          <div class="hint">Si renseigné, le logo devient cliquable dans le bandeau (nouvel onglet).</div>
        </div>
        <div class="field">
          <label for="logo_file">Fichier logo &middot; png, jpg, webp ou svg &middot; 2&nbsp;Mo max</label>
          <input type="file" id="logo_file" name="logo_file" required accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml">
          <div class="hint">Idéalement un logo détouré (fond transparent), ~150&nbsp;px de haut.</div>
        </div>
        <div class="field">
          <label for="logo_h">Hauteur dans le bandeau (20&ndash;80&nbsp;px)</label>
          <input type="number" id="logo_h" name="logo_h" min="20" max="80" value="46">
        </div>
        <div class="checkrow">
          <input type="checkbox" id="logo_white" name="logo_white" value="1">
          <label for="logo_white">Logo blanc (sera assombri pour rester lisible sur le fond sable)</label>
        </div>
        <div style="margin-top:18px"><button class="btn btn-p" type="submit">Ajouter au bandeau</button></div>
      </form>
    </div>

  <?php elseif ($tab === 'google'): ?>

    <?php
      $gsc = is_array($gskPanels['gsc'] ?? null) ? $gskPanels['gsc'] : ['ok' => false];
      $ga4 = is_array($gskPanels['ga4'] ?? null) ? $gskPanels['ga4'] : ['state' => 'error'];
      $psi = is_array($gskPanels['pagespeed'] ?? null) ? $gskPanels['pagespeed'] : ['ok' => false];

      // Freshest fetched-at across the three panels, for the "mis à jour" line.
      $fetchedAt = 0;
      foreach (['gsc', 'ga4', 'pagespeed'] as $pk) {
          if (is_array($gskPanels[$pk] ?? null) && isset($gskPanels[$pk]['fetched_at'])) {
              $fetchedAt = max($fetchedAt, (int)$gskPanels[$pk]['fetched_at']);
          }
      }
      $psiScore = isset($psi['score']) && $psi['score'] !== null ? (int)$psi['score'] : null;
      $psiColor = 'var(--tx-faint)';
      if ($psiScore !== null) {
          $psiColor = $psiScore >= 90 ? 'var(--ok)' : ($psiScore >= 50 ? 'var(--gold)' : 'var(--ko)');
      }
    ?>

    <div class="topbar" style="margin-top:30px;align-items:center">
      <h1 style="margin-top:0">Google</h1>
      <form method="post" action="/admin?tab=google">
        <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
        <input type="hidden" name="action" value="gsk_refresh">
        <button type="submit" class="btn">Rafraîchir</button>
      </form>
    </div>
    <p class="note" style="margin-top:6px">
      Données mises en cache 6 h côté serveur. Aucun jeton ni clé n'atteint le navigateur.
      <?php if ($fetchedAt > 0): ?>
        Dernière mise à jour : <?= esc(date('Y-m-d H:i', $fetchedAt)) ?>.
      <?php endif; ?>
    </p>

    <?php
      $saEmail = gsk_sa_email($config);
      $anyFail = empty($gsc['ok']) || (($ga4['state'] ?? '') !== 'ok') || empty($psi['ok']);
    ?>
    <?php if ($anyFail && $saEmail !== ''): ?>
    <div class="card">
      <div class="card-label">Configuration requise côté Google</div>
      <p class="note">Compte de service : <code class="hash" style="display:inline;padding:3px 8px;font-size:11.5px"><?= esc($saEmail) ?></code></p>
      <ol class="check" style="margin-top:10px">
        <li><strong>Search Console</strong> (données + API Indexing du ping) : Paramètres &rarr; Utilisateurs et autorisations &rarr; ajouter cet email comme <strong>Propriétaire</strong> (délégué) de la propriété <code>sc-domain:mathieuhaye.fr</code>.</li>
        <li><strong>GA4</strong> : Administration &rarr; Gestion des accès à la propriété &rarr; ajouter cet email en <strong>Lecteur</strong>.</li>
        <li>Dans Google Cloud (projet du compte de service) : APIs <em>Search Console</em>, <em>Analytics Data</em> et <em>Web Search Indexing</em> activées.</li>
        <li>Attendre 2-3 minutes puis cliquer « Rafraîchir ».</li>
      </ol>
    </div>
    <?php endif; ?>

    <!-- ===== Search Console ===== -->
    <div class="card">
      <div class="card-label">Search Console &middot; 28 derniers jours</div>
      <?php if (empty($gsc['ok'])): ?>
        <div class="empty">Données Search Console indisponibles<?= !empty($gsc['error']) ? ' — ' . esc((string)$gsc['error']) : '.' ?></div>
      <?php else: ?>
        <div class="kpis" style="margin-top:8px">
          <div class="kpi">
            <div class="n"><?= esc(gsk_int((int)$gsc['totals']['clicks'])) ?></div>
            <div class="l">Clics</div>
          </div>
          <div class="kpi">
            <div class="n"><?= esc(gsk_int((int)$gsc['totals']['impressions'])) ?></div>
            <div class="l">Impressions</div>
          </div>
          <div class="kpi">
            <div class="n"><?= esc(gsk_pct((float)$gsc['totals']['ctr'])) ?></div>
            <div class="l">CTR moyen</div>
          </div>
          <div class="kpi">
            <div class="n"><?= esc(number_format((float)$gsc['totals']['position'], 1, ',', ' ')) ?></div>
            <div class="l">Position moyenne</div>
          </div>
        </div>
        <?php if (!empty($gsc['siteUsed'])): ?>
          <p class="note" style="margin-top:12px">Propriété : <?= esc((string)$gsc['siteUsed']) ?></p>
        <?php endif; ?>
      <?php endif; ?>
    </div>

    <?php if (!empty($gsc['ok'])): ?>
    <div class="card">
      <div class="card-label">Top 10 requêtes</div>
      <?php if (empty($gsc['queries'])): ?>
        <div class="empty">Aucune requête sur la période.</div>
      <?php else: ?>
        <div class="tblwrap">
        <table>
          <tr><th>Requête</th><th>Clics</th><th>Impressions</th><th>CTR</th><th>Position</th></tr>
          <?php foreach ($gsc['queries'] as $row): ?>
          <tr>
            <td class="strong"><?= esc((string)($row['key'] ?? '')) ?></td>
            <td class="mono"><?= esc(gsk_int((int)($row['clicks'] ?? 0))) ?></td>
            <td class="mono"><?= esc(gsk_int((int)($row['impressions'] ?? 0))) ?></td>
            <td class="mono"><?= esc(gsk_pct((float)($row['ctr'] ?? 0))) ?></td>
            <td class="mono"><?= esc(number_format((float)($row['position'] ?? 0), 1, ',', ' ')) ?></td>
          </tr>
          <?php endforeach; ?>
        </table>
        </div>
      <?php endif; ?>
    </div>

    <div class="card">
      <div class="card-label">Top 10 pages</div>
      <?php if (empty($gsc['pages'])): ?>
        <div class="empty">Aucune page sur la période.</div>
      <?php else: ?>
        <div class="tblwrap">
        <table>
          <tr><th>Page</th><th>Clics</th><th>Impressions</th><th>CTR</th><th>Position</th></tr>
          <?php foreach ($gsc['pages'] as $row): ?>
          <tr>
            <td class="strong"><?= esc((string)($row['key'] ?? '')) ?></td>
            <td class="mono"><?= esc(gsk_int((int)($row['clicks'] ?? 0))) ?></td>
            <td class="mono"><?= esc(gsk_int((int)($row['impressions'] ?? 0))) ?></td>
            <td class="mono"><?= esc(gsk_pct((float)($row['ctr'] ?? 0))) ?></td>
            <td class="mono"><?= esc(number_format((float)($row['position'] ?? 0), 1, ',', ' ')) ?></td>
          </tr>
          <?php endforeach; ?>
        </table>
        </div>
      <?php endif; ?>
    </div>
    <?php endif; ?>

    <!-- ===== GA4 Analytics ===== -->
    <div class="card">
      <div class="card-label">Analytics GA4 &middot; 28 derniers jours</div>
      <?php if (($ga4['state'] ?? '') === 'ok'): ?>
        <div class="kpis" style="margin-top:8px">
          <div class="kpi">
            <div class="n"><?= esc(gsk_int((int)$ga4['totals']['sessions'])) ?></div>
            <div class="l">Sessions</div>
          </div>
          <div class="kpi">
            <div class="n"><?= esc(gsk_int((int)$ga4['totals']['totalUsers'])) ?></div>
            <div class="l">Utilisateurs</div>
          </div>
          <div class="kpi">
            <div class="n"><?= esc(gsk_int((int)$ga4['totals']['screenPageViews'])) ?></div>
            <div class="l">Pages vues</div>
          </div>
        </div>
        <?php if (!empty($ga4['pages'])): ?>
          <div class="tblwrap" style="margin-top:16px">
          <table>
            <tr><th>Page</th><th>Pages vues</th></tr>
            <?php foreach ($ga4['pages'] as $row): ?>
            <tr>
              <td class="strong"><?= esc((string)($row['path'] ?? '')) ?></td>
              <td class="mono"><?= esc(gsk_int((int)($row['views'] ?? 0))) ?></td>
            </tr>
            <?php endforeach; ?>
          </table>
          </div>
        <?php endif; ?>
      <?php else: ?>
        <div class="empty">Analytics indisponible<?= !empty($ga4['error']) ? ' — ' . esc((string)$ga4['error']) : ' : renseigner l\'ID de propriété GA4 dans les Réglages et donner l\'accès Lecteur au compte de service (carte ci-dessus).' ?></div>
      <?php endif; ?>
    </div>

    <!-- ===== PageSpeed ===== -->
    <div class="card">
      <div class="card-label">PageSpeed Insights &middot; mobile &middot; accueil</div>
      <?php if (empty($psi['ok'])): ?>
        <div class="empty">PageSpeed indisponible<?= !empty($psi['error']) ? ' — ' . esc((string)$psi['error']) : ' pour le moment.' ?> Réessayer via « Rafraîchir ».</div>
      <?php else: ?>
        <div class="kpis" style="margin-top:8px">
          <div class="kpi">
            <div class="n" style="color:<?= esc($psiColor) ?>"><?= $psiScore === null ? '&ndash;' : (int)$psiScore ?></div>
            <div class="l">Score performance</div>
            <div class="s">sur 100</div>
          </div>
          <?php foreach (($psi['metrics'] ?? []) as $m): ?>
          <div class="kpi">
            <div class="n" style="font-size:22px"><?= esc((string)($m['value'] ?? '')) ?></div>
            <div class="l"><?= esc((string)($m['label'] ?? '')) ?></div>
          </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </div>

  <?php elseif ($tab === 'actions'): ?>

    <h1>Actions</h1>

    <div class="card">
      <div class="card-label">Indexation</div>
      <p class="note">Notifie Google (Indexing API) et IndexNow (Bing, Yandex...) des URLs du sitemap pas encore pingées. L'appel se fait côté serveur : le jeton ne quitte jamais le serveur.</p>
      <form method="post" action="/admin?tab=actions" style="margin-top:14px">
        <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
        <input type="hidden" name="action" value="ping">
        <button type="submit" class="btn btn-p">Ping indexation (Google + IndexNow)</button>
      </form>
      <?php if ($pingOut !== ''): ?>
        <pre class="json"><?= esc($pingOut) ?></pre>
      <?php endif; ?>
    </div>

    <div class="card">
      <div class="card-label">Outils externes</div>
      <div class="links">
        <a class="pill" href="https://mathieuhaye.fr/visible-par-les-ia" target="_blank" rel="noopener noreferrer">Re-scanner le site</a>
        <a class="pill" href="https://validator.schema.org/" target="_blank" rel="noopener noreferrer">Valider le schema</a>
        <a class="pill" href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">Rich Results Test</a>
        <a class="pill" href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer">LinkedIn Post Inspector</a>
      </div>
    </div>

  <?php elseif ($tab === 'settings'): ?>

    <?php
      // Current effective value of a non-secret field, esc()'d for pre-fill.
      $cfgVal = function (string $key) use ($config): string {
          return esc((string)($config[$key] ?? ''));
      };
      // A secret is "défini" when its effective value is non-empty. This reveals
      // only existence, never the value itself.
      $secretSet = function (string $key) use ($config): bool {
          return trim((string)($config[$key] ?? '')) !== '';
      };
      $renderBadge = function (bool $isSet): string {
          return $isSet
              ? '<span class="badge set">défini</span>'
              : '<span class="badge unset">non défini</span>';
      };
    ?>

    <h1>Réglages</h1>
    <p class="note" style="margin-top:6px">
      Ces valeurs sont enregistrées dans un fichier privé du serveur (api/data/settings.json, non accessible depuis le web)
      et priment sur api/config.php. Les champs secrets restent masqués : laissez-les vides pour conserver la valeur actuelle.
    </p>

    <form method="post" action="/admin?tab=settings">
      <input type="hidden" name="csrf" value="<?= esc($csrf) ?>">
      <input type="hidden" name="action" value="save_settings">

      <fieldset class="fieldset">
        <legend>Google / SEO</legend>
        <div class="field">
          <label for="gsc_site_url">Propriété Search Console</label>
          <input type="text" id="gsc_site_url" name="gsc_site_url" value="<?= $cfgVal('gsc_site_url') ?>" autocomplete="off">
          <div class="hint">URL exacte (avec / final) ou <code>sc-domain:mathieuhaye.fr</code>.</div>
        </div>
        <div class="field">
          <label for="ga4_property_id">ID propriété GA4</label>
          <input type="text" id="ga4_property_id" name="ga4_property_id" value="<?= $cfgVal('ga4_property_id') ?>" autocomplete="off" inputmode="numeric">
          <div class="hint">ID numérique de la propriété GA4. Vide = panneau Analytics en mode configuration.</div>
        </div>
        <div class="field">
          <label for="pagespeed_api_key">Clé API PageSpeed <?= $renderBadge($secretSet('pagespeed_api_key')) ?></label>
          <input type="password" id="pagespeed_api_key" name="pagespeed_api_key" value="" placeholder="inchangé" autocomplete="new-password">
        </div>
        <div class="field">
          <label for="index_ping_token">Jeton index-ping <?= $renderBadge($secretSet('index_ping_token')) ?></label>
          <input type="password" id="index_ping_token" name="index_ping_token" value="" placeholder="inchangé" autocomplete="new-password">
        </div>
        <div class="field">
          <label for="indexnow_key">Clé IndexNow <?= $renderBadge($secretSet('indexnow_key')) ?></label>
          <input type="password" id="indexnow_key" name="indexnow_key" value="" placeholder="inchangé" autocomplete="new-password">
          <div class="hint">Doit correspondre au fichier <code>&lt;clé&gt;.txt</code> à la racine du site.</div>
        </div>
        <div class="field">
          <label for="index_host">Hôte d'indexation</label>
          <input type="text" id="index_host" name="index_host" value="<?= $cfgVal('index_host') ?>" autocomplete="off">
        </div>
      </fieldset>

      <fieldset class="fieldset">
        <legend>IA / Chat</legend>
        <div class="field">
          <label for="anthropic_model">Modèle Anthropic</label>
          <input type="text" id="anthropic_model" name="anthropic_model" value="<?= $cfgVal('anthropic_model') ?>" autocomplete="off">
        </div>
        <div class="field">
          <label for="max_output_tok">Tokens de sortie max</label>
          <input type="number" id="max_output_tok" name="max_output_tok" value="<?= $cfgVal('max_output_tok') ?>" min="1" step="1">
        </div>
        <div class="field">
          <label for="rate_limit_per_h">Limite de requêtes / heure</label>
          <input type="number" id="rate_limit_per_h" name="rate_limit_per_h" value="<?= $cfgVal('rate_limit_per_h') ?>" min="1" step="1">
        </div>
        <div class="field">
          <label for="allowed_origin">Origine autorisée</label>
          <input type="text" id="allowed_origin" name="allowed_origin" value="<?= $cfgVal('allowed_origin') ?>" autocomplete="off">
        </div>
        <div class="field">
          <label for="anthropic_key">Clé API Anthropic <?= $renderBadge($secretSet('anthropic_key')) ?></label>
          <input type="password" id="anthropic_key" name="anthropic_key" value="" placeholder="inchangé" autocomplete="new-password">
        </div>
      </fieldset>

      <fieldset class="fieldset">
        <legend>Emails / Contact</legend>
        <div class="field">
          <label for="recipient_email">Email destinataire</label>
          <input type="email" id="recipient_email" name="recipient_email" value="<?= $cfgVal('recipient_email') ?>" autocomplete="off">
        </div>
        <div class="field">
          <label for="brevo_sender_email">Email expéditeur Brevo</label>
          <input type="email" id="brevo_sender_email" name="brevo_sender_email" value="<?= $cfgVal('brevo_sender_email') ?>" autocomplete="off">
          <div class="hint">Doit être un expéditeur vérifié dans Brevo.</div>
        </div>
        <div class="field">
          <label for="brevo_sender_name">Nom expéditeur Brevo</label>
          <input type="text" id="brevo_sender_name" name="brevo_sender_name" value="<?= $cfgVal('brevo_sender_name') ?>" autocomplete="off">
        </div>
        <div class="field">
          <div class="checkrow">
            <input type="checkbox" id="send_visitor_copy" name="send_visitor_copy" value="1" <?= !empty($config['send_visitor_copy']) ? 'checked' : '' ?>>
            <label for="send_visitor_copy">Envoyer une copie de confirmation au visiteur</label>
          </div>
        </div>
        <div class="field">
          <label for="brevo_key">Clé API Brevo <?= $renderBadge($secretSet('brevo_key')) ?></label>
          <input type="password" id="brevo_key" name="brevo_key" value="" placeholder="inchangé" autocomplete="new-password">
        </div>
      </fieldset>

      <fieldset class="fieldset">
        <legend>Mot de passe admin</legend>
        <div class="field">
          <label for="new_password">Nouveau mot de passe (12 caractères min.)</label>
          <input type="password" id="new_password" name="new_password" value="" placeholder="laisser vide pour ne pas changer" minlength="12" autocomplete="new-password">
        </div>
        <div class="field">
          <label for="confirm_password">Confirmation</label>
          <input type="password" id="confirm_password" name="confirm_password" value="" placeholder="laisser vide pour ne pas changer" minlength="12" autocomplete="new-password">
        </div>
      </fieldset>

      <div style="margin-top:22px"><button type="submit" class="btn btn-p">Enregistrer les réglages</button></div>
    </form>

  <?php endif; ?>

  <div class="foot">mathieuhaye.fr &middot; back office privé &middot; noindex</div>
</div>

<?php endif; ?>
</body>
</html>
