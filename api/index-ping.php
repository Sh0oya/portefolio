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
$state = ['in' => [], 'g' => [], 'in403' => 0, 'inKeyOverride' => ''];
if (is_file($statePath)) {
    $s = json_decode((string)file_get_contents($statePath), true);
    if (is_array($s)) {
        $state['in'] = is_array($s['in'] ?? null) ? $s['in'] : [];
        $state['g']  = is_array($s['g']  ?? null) ? $s['g']  : [];
        $state['in403'] = (int)($s['in403'] ?? 0);
        $state['inKeyOverride'] = (string)($s['inKeyOverride'] ?? '');
    }
}

$now = date('c');

// Une clé tournée automatiquement (après refus persistant) prime sur la config.
if ($state['inKeyOverride'] !== '' && preg_match('/^[a-f0-9]{32}$/', $state['inKeyOverride'])) {
    $inKey = $state['inKeyOverride'];
}

// --- IndexNow: every URL not yet sent (one batch) ---
$newIn = array_values(array_diff($urls, array_keys($state['in'])));
$inResult = 'skipped';
$inHttp   = 0;
$inNote   = '';
if ($inKey !== '' && $newIn) {
    // Auto-réparation : le fichier de clé à la racine DOIT contenir exactement la
    // clé utilisée, sinon IndexNow rejette tout le lot (keyLocation invalide).
    indexnow_write_keyfile($inKey, $inNote);
    $inHttp   = indexnow_ping($host, $inKey, $newIn);
    $inResult = ($inHttp >= 200 && $inHttp < 300) ? 'ok' : 'failed';
    if ($inResult === 'ok') {
        foreach ($newIn as $u) { $state['in'][$u] = $now; }
        $state['in403'] = 0;
    } elseif ($inHttp === 403) {
        // 403 alors que le fichier de clé est servi correctement = le plus souvent
        // un cache de validation côté IndexNow (clé vue invalide par le passé).
        $state['in403']++;
        if ($state['in403'] >= 2) {
            // Rotation : nouvelle clé jamais vue par IndexNow, validée de zéro.
            $fresh = bin2hex(random_bytes(16));
            $rotNote = '';
            if (indexnow_write_keyfile($fresh, $rotNote)) {
                $state['inKeyOverride'] = $fresh;
                $state['in403'] = 0;
                $inHttp   = indexnow_ping($host, $fresh, $newIn);
                $inResult = ($inHttp >= 200 && $inHttp < 300) ? 'ok' : 'failed';
                if ($inResult === 'ok') {
                    foreach ($newIn as $u) { $state['in'][$u] = $now; }
                }
                $inNote = 'clé tournée automatiquement (' . substr($fresh, 0, 8) . '…) après 403 répétés';
            } else {
                $inNote = 'rotation impossible : écriture du fichier de clé refusée';
            }
        } else {
            $inNote = 'fichier de clé valide mais refus 403 : cache IndexNow probable, '
                    . 'nouvelle tentative (puis rotation de clé) au prochain ping';
        }
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
        } elseif (strpos($GINDEX_LASTERR, 'PERMISSION_DENIED') !== false
               || strpos($GINDEX_LASTERR, 'ownership') !== false) {
            // Le compte de service n'est pas propriétaire de la propriété
            // Search Console : inutile d'essayer les URLs suivantes.
            $gResult = 'ownership_denied';
            break;
        } elseif (strpos($GINDEX_LASTERR, 'HTTP 429') === 0
               || strpos($GINDEX_LASTERR, 'RESOURCE_EXHAUSTED') !== false
               || strpos($GINDEX_LASTERR, 'Quota exceeded') !== false) {
            // Quota journalier épuisé : inutile de marteler l'API avec le reste
            // du lot, les URLs restantes repartiront au prochain ping.
            $gResult = 'quota_exhausted';
            break;
        }
    }
} elseif ($saPath !== '' && is_file($saPath)) {
    $gResult = 'auth_failed';
}

// --- Persist state ---
@file_put_contents($statePath, json_encode($state, JSON_UNESCAPED_SLASHES), LOCK_EX);

$googleOut = ['status' => $gResult, 'sent' => $gDone, 'pending' => max(0, count($newG) - $gDone)];
if ($GINDEX_LASTERR !== '') { $googleOut['error'] = $GINDEX_LASTERR; }
if ($gResult === 'quota_exhausted') {
    $googleOut['fix'] = 'Quota Indexing API épuisé (200 requêtes/jour, reset vers 9h heure de Paris). '
        . 'Les URLs restantes repartiront automatiquement au prochain ping : à 50 URLs/jour, '
        . 'le lot complet passe en ~3 jours. Ne pas relancer le ping plusieurs fois le même jour.';
}
if ($gResult === 'ownership_denied' || strpos($GINDEX_LASTERR, 'PERMISSION_DENIED') !== false) {
    $saEmail = '';
    if ($saPath !== '' && is_file($saPath)) {
        $saJ = json_decode((string)@file_get_contents($saPath), true);
        $saEmail = is_array($saJ) ? (string)($saJ['client_email'] ?? '') : '';
    }
    $googleOut['service_account'] = $saEmail;
    $googleOut['fix'] = 'Search Console > Paramètres > Utilisateurs et autorisations : ajouter ce compte de service comme PROPRIÉTAIRE (délégué) de la propriété, puis relancer le ping. Un simple accès Utilisateur ne suffit pas pour l\'API Indexing.';
}

$inOut = ['status' => $inResult, 'sent' => count($newIn)];
if ($inHttp) { $inOut['http'] = $inHttp; }
if ($inNote !== '') { $inOut['note'] = $inNote; }

echo json_encode([
    'ok'        => true,
    'indexnow'  => $inOut,
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

/** Écrit (si besoin) le fichier de clé IndexNow à la racine. Retourne true si le fichier est bon. */
function indexnow_write_keyfile(string $key, string &$note): bool
{
    $keyFile = dirname(__DIR__) . '/' . $key . '.txt';
    $current = is_file($keyFile) ? trim((string)@file_get_contents($keyFile)) : '';
    if ($current === $key) {
        return true;
    }
    if (@file_put_contents($keyFile, $key . "\n", LOCK_EX) !== false) {
        @chmod($keyFile, 0644);
        $note = 'fichier de clé (ré)écrit à la racine';
        return true;
    }
    $note = 'ÉCHEC écriture du fichier de clé ' . basename($keyFile);
    return false;
}

/** Submit a batch of URLs to IndexNow (Bing, Yandex, ...). Returns the HTTP code. */
function indexnow_ping(string $host, string $key, array $urls): int
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
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 300 || $code === 0) {
        error_log("[index-ping] IndexNow error $code: $resp");
    }
    return $code; // 200 ou 202 = accepté
}
