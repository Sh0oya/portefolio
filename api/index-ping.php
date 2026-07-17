<?php
/**
 * Auto-indexing pinger.
 * Reads the sitemap, finds URLs not yet pinged, and notifies:
 *   - Google Indexing API (needs /api/google-sa.json + Search Console ownership)
 *   - IndexNow (Bing, Yandex, ...) - free, just needs the key file at the root
 *
 * Trigger it once a day:
 *   - IONOS cron:  curl -s "https://mathieuhaye.fr/api/index-ping.php?token=YOUR_TOKEN"
 *   - or from the blog-generation routine after upload.
 *
 * State is stored in /api/.index-state.json so URLs are only pinged once.
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$config = require __DIR__ . '/config.php';

// --- Auth: optional shared token to avoid abuse ---
$expected = (string)($config['index_ping_token'] ?? '');
$given    = (string)($_GET['token'] ?? '');
if ($expected !== '' && !hash_equals($expected, $given)) {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

$host       = (string)($config['index_host'] ?? 'mathieuhaye.fr');
$inKey      = (string)($config['indexnow_key'] ?? '');
$saPath     = (string)($config['google_sa_json'] ?? '');
$statePath  = __DIR__ . '/.index-state.json';
$sitemapPath = dirname(__DIR__) . '/sitemap.xml';
$GOOGLE_CAP = 50; // max Google pings per run (quota ~200/day)

// --- Collect URLs from the sitemap ---
$urls = [];
if (is_file($sitemapPath)) {
    $xml = (string)file_get_contents($sitemapPath);
    if (preg_match_all('#<loc>\s*([^<\s]+)\s*</loc>#i', $xml, $m)) {
        $urls = array_values(array_unique($m[1]));
    }
}
if (!$urls) {
    echo json_encode(['ok' => true, 'note' => 'no urls found in sitemap']);
    exit;
}

// --- Load state ---
$state = ['in' => [], 'g' => []];
if (is_file($statePath)) {
    $s = json_decode((string)file_get_contents($statePath), true);
    if (is_array($s)) {
        $state['in'] = is_array($s['in'] ?? null) ? $s['in'] : [];
        $state['g']  = is_array($s['g']  ?? null) ? $s['g']  : [];
    }
}

$now = date('c');

// --- IndexNow: every URL not yet sent (one batch) ---
$newIn = array_values(array_diff($urls, array_keys($state['in'])));
$inResult = 'skipped';
if ($inKey !== '' && $newIn) {
    $inResult = indexnow_ping($host, $inKey, $newIn) ? 'ok' : 'failed';
    if ($inResult === 'ok') {
        foreach ($newIn as $u) { $state['in'][$u] = $now; }
    }
}

// --- Google Indexing API: every URL not yet sent (capped per run) ---
$newG = array_values(array_diff($urls, array_keys($state['g'])));
$gDone = 0;
$gResult = 'skipped';
$GINDEX_LASTERR = '';
$token = ($saPath !== '' && is_file($saPath)) ? google_token($saPath) : null;
if ($token) {
    $gResult = 'ok';
    foreach ($newG as $u) {
        if ($gDone >= $GOOGLE_CAP) break;
        if (google_index_ping($token, $u)) {
            $state['g'][$u] = $now;
            $gDone++;
        }
    }
} elseif ($saPath !== '' && is_file($saPath)) {
    $gResult = 'auth_failed';
}

// --- Persist state ---
@file_put_contents($statePath, json_encode($state, JSON_UNESCAPED_SLASHES), LOCK_EX);

$googleOut = ['status' => $gResult, 'sent' => $gDone, 'pending' => max(0, count($newG) - $gDone)];
if ($GINDEX_LASTERR !== '') { $googleOut['error'] = $GINDEX_LASTERR; }

echo json_encode([
    'ok'        => true,
    'indexnow'  => ['status' => $inResult, 'sent' => count($newIn)],
    'google'    => $googleOut,
    'totalUrls' => count($urls),
], JSON_UNESCAPED_SLASHES);


/* ========================================================= */

function b64url(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/** Get a Google OAuth access token from a service-account JSON (scope: indexing). */
function google_token(string $saPath): ?string
{
    $sa = json_decode((string)file_get_contents($saPath), true);
    if (!is_array($sa) || empty($sa['client_email']) || empty($sa['private_key'])) {
        return null;
    }
    $now = time();
    $header = b64url(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $claim  = b64url(json_encode([
        'iss'   => $sa['client_email'],
        'scope' => 'https://www.googleapis.com/auth/indexing',
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $now,
        'exp'   => $now + 3600,
    ]));
    $signingInput = $header . '.' . $claim;
    $sig = '';
    if (!openssl_sign($signingInput, $sig, $sa['private_key'], OPENSSL_ALGO_SHA256)) {
        return null;
    }
    $assertion = $signingInput . '.' . b64url($sig);

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $assertion,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 300) {
        error_log("[index-ping] Google token error $code: $resp");
        return null;
    }
    $j = json_decode((string)$resp, true);
    return is_array($j) ? ($j['access_token'] ?? null) : null;
}

/** Notify Google that a single URL was updated. */
function google_index_ping(string $token, string $url): bool
{
    global $GINDEX_LASTERR;
    $ch = curl_init('https://indexing.googleapis.com/v3/urlNotifications:publish');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['url' => $url, 'type' => 'URL_UPDATED']),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token,
        ],
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 300) {
        error_log("[index-ping] Google publish $code for $url: $resp");
        if ($GINDEX_LASTERR === '') {
            $GINDEX_LASTERR = 'HTTP ' . $code . ': ' . trim(substr((string)$resp, 0, 240));
        }
        return false;
    }
    return true;
}

/** Submit a batch of URLs to IndexNow (Bing, Yandex, ...). */
function indexnow_ping(string $host, string $key, array $urls): bool
{
    $payload = [
        'host'        => $host,
        'key'         => $key,
        'keyLocation' => "https://$host/$key.txt",
        'urlList'     => array_values($urls),
    ];
    $ch = curl_init('https://api.indexnow.org/indexnow');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_SLASHES),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json; charset=utf-8'],
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 300) {
        error_log("[index-ping] IndexNow error $code: $resp");
        return false;
    }
    return true; // 200 or 202 = accepted
}
