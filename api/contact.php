<?php
/**
 * Contact endpoint - receives leads from the chat agent, the quiz, etc.
 * Sends an HTML notification to Mathieu via Brevo (transactional API) with a
 * plain-text fallback to PHP mail(). Optionally sends an HTML confirmation to
 * the visitor.
 *
 * POST JSON: {
 *   "first_name", "last_name", "email",
 *   "phone"?, "summary", "lang": "fr|en",
 *   "website": ""   // honeypot - must be empty
 * }
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Per-IP rate limit to curb mail-spam abuse. Fails open if the store is
// unwritable (defense in depth, not an auth control).
if (!rate_limit('contact', 6, 600)) {
    http_response_code(429);
    echo json_encode(['error' => 'rate_limited']);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server not configured']);
    exit;
}
$config = require $configPath;

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === ($config['allowed_origin'] ?? '')) {
    header('Access-Control-Allow-Origin: ' . $config['allowed_origin']);
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payload']);
    exit;
}

// Honeypot - bots fill all fields including hidden ones
if (!empty($data['website'])) {
    echo json_encode(['ok' => true]); // pretend success
    exit;
}

$first   = trim(mb_substr((string)($data['first_name'] ?? ''), 0, 60));
$last    = trim(mb_substr((string)($data['last_name']  ?? ''), 0, 60));
$email   = trim(mb_substr((string)($data['email']      ?? ''), 0, 120));
$phone   = trim(mb_substr((string)($data['phone']      ?? ''), 0, 30));
$summary = trim(mb_substr((string)($data['summary']    ?? ''), 0, 6000));
$lang    = ($data['lang'] ?? 'fr') === 'en' ? 'en' : 'fr';

// Header-injection guard: strip control chars (CR/LF/TAB) from the fields that
// land in the mail() subject. The email is already validated (cannot carry CRLF).
$first = trim((string)preg_replace('~[\x00-\x1F]+~', ' ', $first));
$last  = trim((string)preg_replace('~[\x00-\x1F]+~', ' ', $last));

if ($first === '' || $last === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}
if ($phone !== '' && !preg_match('/^[\d\s\+\.\(\)\-]{4,30}$/', $phone)) {
    $phone = '';
}

$fullName  = trim($first . ' ' . $last);
$phoneDisp = $phone !== '' ? $phone : ($lang === 'en' ? '(not provided)' : '(non renseigne)');
$ip        = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$date      = date('c');
$result    = (isset($data['result']) && is_array($data['result'])) ? $data['result'] : null;
$scan      = (isset($data['scan'])   && is_array($data['scan']))   ? $data['scan']   : null;

// ----- Notification to Mathieu (plain text fallback + HTML) -----
$subject = '[mathieuhaye.fr] Nouveau lead - ' . $fullName;
$body  = "Nouveau contact via le site.\n\n";
$body .= "Prenom    : $first\n";
$body .= "Nom       : $last\n";
$body .= "Email     : $email\n";
$body .= "Telephone : $phoneDisp\n";
$body .= "Langue    : $lang\n";
$body .= "IP        : $ip\n";
$body .= "Date      : $date\n\n";
$body .= "----- Details -----\n" . $summary . "\n";

$htmlBody = notif_html($fullName, $email, $phoneDisp, $lang, $ip, $date, $summary);

$sender = [
    'name'  => $config['brevo_sender_name']  ?? 'Mathieu Haye',
    'email' => $config['brevo_sender_email'] ?? 'contact@mathieuhaye.fr',
];

$brevoKey = (string)($config['brevo_key'] ?? '');
$useBrevo = ($brevoKey !== '' && strpos($brevoKey, 'PASTE') === false);

$sent = false;

if ($useBrevo) {
    // 1. Notify Mathieu
    $sent = brevo_send($brevoKey, [
        'sender'      => $sender,
        'to'          => [['email' => $config['recipient_email']]],
        'replyTo'     => ['email' => $email, 'name' => $fullName],
        'subject'     => $subject,
        'htmlContent' => $htmlBody,
        'textContent' => $body,
    ]);

    // 2. Confirmation to the visitor (optional)
    if ($sent && !empty($config['send_visitor_copy'])) {
        if ($lang === 'en') {
            $vSubject = 'Got your message - Mathieu Haye';
            $vText    = "Hi $first,\n\nThanks for reaching out. I read every request myself and I'll get back to you within 24h (business days).\n\nTalk soon,\nMathieu Haye\nhttps://mathieuhaye.fr";
        } else {
            $vSubject = 'Bien recu - Mathieu Haye';
            $vText    = "Bonjour $first,\n\nMerci pour votre message. Je lis chaque demande moi-meme et je reviens vers vous sous 24h (jours ouvres).\n\nA tres vite,\nMathieu Haye\nhttps://mathieuhaye.fr";
        }
        if ($scan) {
            $vSubject = $lang === 'en'
                ? 'Your AI visibility report - Mathieu Haye'
                : 'Votre diagnostic de visibilite IA - Mathieu Haye';
        }
        // Best effort; failure here does not fail the request
        $vHtml = $scan
            ? conf_html_scan($first, $lang, $scan)
            : ($result ? conf_html_rich($first, $lang, $result) : conf_html($first, $lang));
        brevo_send($brevoKey, [
            'sender'      => ['name' => 'Mathieu Haye', 'email' => $sender['email']],
            'to'          => [['email' => $email, 'name' => $fullName]],
            'subject'     => $vSubject,
            'htmlContent' => $vHtml,
            'textContent' => $vText,
        ]);
    }
}

// ----- Fallback: PHP mail() if Brevo unavailable or failed -----
if (!$sent) {
    $headers  = 'From: ' . $sender['email'] . "\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();
    $sent = @mail($config['recipient_email'], $subject, $body, $headers);
}

// ---- Lead log for /admin (fail-open: a log failure never breaks the request) ----
$logDir = __DIR__ . '/data';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0700, true);
}
@file_put_contents(
    $logDir . '/contacts.jsonl',
    json_encode([
        'ts'      => date('c'),
        'name'    => $fullName,
        'email'   => $email,
        'message' => mb_substr($summary, 0, 500),
        'lang'    => $lang,
        'sent'    => (bool)$sent,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

if (!$sent) {
    error_log('[contact.php] all send methods failed for ' . $email);
    http_response_code(500);
    echo json_encode(['error' => 'Mail send failed']);
    exit;
}

echo json_encode(['ok' => true]);


/* =========================================================
   Helpers
   ========================================================= */

function esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
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
 * Send a transactional email through the Brevo API. Returns true on HTTP 2xx.
 */
function brevo_send(string $apiKey, array $payload): bool
{
    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'accept: application/json',
            'content-type: application/json',
            'api-key: ' . $apiKey,
        ],
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($resp === false || $code >= 300) {
        error_log("[contact.php] Brevo error $code: $err / $resp");
        return false;
    }
    return true;
}

/**
 * HTML email sent to Mathieu when a new lead comes in.
 */
function notif_html(string $name, string $email, string $phone, string $lang, string $ip, string $date, string $summary): string
{
    $n = esc($name);
    $e = esc($email);
    $p = esc($phone);
    $l = esc($lang);
    $i = esc($ip);
    $d = esc($date);
    $s = nl2br(esc($summary));
    return <<<HTML
<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FBF7F2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#FBF7F2;">Nouveau lead via mathieuhaye.fr — {$n}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F2;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #efe7e0;border-radius:16px;overflow:hidden;">
    <tr><td style="height:5px;background:#8B1A2F;background:linear-gradient(90deg,#8B1A2F,#C13B30 60%,#FCBA35);font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="padding:30px 34px 6px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;color:#1F0D19;">mathieu <span style="font-style:italic;color:#8B1A2F;">haye.</span></div>
      <div style="margin-top:20px;font-size:11px;letter-spacing:2px;color:#8B1A2F;font-weight:bold;">NOUVEAU LEAD</div>
      <div style="margin-top:6px;font-size:25px;font-weight:bold;color:#1F0D19;line-height:1.2;">{$n}</div>
    </td></tr>
    <tr><td style="padding:10px 34px;font-size:14px;color:#1F0D19;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;color:#5b6473;width:96px;vertical-align:top;">Email</td><td style="padding:6px 0;"><a href="mailto:{$e}" style="color:#8B1A2F;text-decoration:none;font-weight:bold;">{$e}</a></td></tr>
        <tr><td style="padding:6px 0;color:#5b6473;vertical-align:top;">Téléphone</td><td style="padding:6px 0;">{$p}</td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:14px 34px 4px;">
      <div style="font-size:11px;letter-spacing:1px;color:#8B1A2F;font-weight:bold;margin-bottom:8px;">DÉTAILS</div>
      <div style="background:#FBF7F2;border:1px solid #efe7e0;border-radius:10px;padding:16px 18px;font-family:'Courier New',Courier,monospace;font-size:13px;line-height:1.7;color:#1F0D19;">{$s}</div>
    </td></tr>
    <tr><td style="padding:20px 34px 6px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#8B1A2F;">
        <a href="mailto:{$e}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">Répondre →</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="padding:14px 34px 26px;font-size:11px;color:#9aa0ad;border-top:1px solid #f1ece6;">
      Langue {$l} &nbsp;·&nbsp; IP {$i} &nbsp;·&nbsp; {$d}
    </td></tr>
  </table>
  <div style="font-size:11px;color:#9aa0ad;margin-top:14px;">Envoyé automatiquement depuis mathieuhaye.fr</div>
</td></tr></table>
</body></html>
HTML;
}

/**
 * HTML confirmation sent to the visitor.
 */
function conf_html(string $first, string $lang): string
{
    $f = esc($first);
    if ($lang === 'en') {
        $eyebrow = 'MESSAGE RECEIVED';
        $title   = "Thanks, {$f}.";
        $line1   = 'I got your message. I read every request myself and I will get back to you within 24h (business days).';
        $line2   = 'In the meantime, feel free to explore my work.';
        $cta     = 'See my work';
        $sign    = 'Mathieu Haye';
        $role    = 'Freelance Builder · AI apps, automations &amp; custom CRM';
    } else {
        $eyebrow = 'MESSAGE BIEN REÇU';
        $title   = "Merci, {$f}.";
        $line1   = 'J’ai bien reçu votre message. Je lis chaque demande moi-même et je reviens vers vous sous 24h (jours ouvrés).';
        $line2   = 'En attendant, vous pouvez découvrir mon travail.';
        $cta     = 'Voir mon travail';
        $sign    = 'Mathieu Haye';
        $role    = 'Freelance Builder · apps IA, automatisations &amp; CRM sur-mesure';
    }
    return <<<HTML
<!DOCTYPE html>
<html lang="{$lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FBF7F2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#FBF7F2;">{$line1}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F2;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #efe7e0;border-radius:16px;overflow:hidden;">
    <tr><td style="height:5px;background:#8B1A2F;background:linear-gradient(90deg,#8B1A2F,#C13B30 60%,#FCBA35);font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="padding:32px 34px 8px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;color:#1F0D19;">mathieu <span style="font-style:italic;color:#8B1A2F;">haye.</span></div>
      <div style="margin-top:22px;font-size:11px;letter-spacing:2px;color:#8B1A2F;font-weight:bold;">{$eyebrow}</div>
      <div style="margin-top:8px;font-size:28px;font-weight:bold;color:#1F0D19;line-height:1.15;">{$title}</div>
    </td></tr>
    <tr><td style="padding:6px 34px;font-size:15px;line-height:1.65;color:#3a4150;">
      <p style="margin:0 0 14px;">{$line1}</p>
      <p style="margin:0 0 4px;">{$line2}</p>
    </td></tr>
    <tr><td style="padding:18px 34px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#8B1A2F;">
        <a href="https://mathieuhaye.fr" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">{$cta} →</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="padding:22px 34px 28px;border-top:1px solid #f1ece6;font-size:13px;color:#3a4150;">
      <div style="font-weight:bold;color:#1F0D19;">{$sign}</div>
      <div style="color:#5b6473;margin-top:2px;">{$role}</div>
      <div style="margin-top:8px;"><a href="mailto:contact@mathieuhaye.fr" style="color:#8B1A2F;text-decoration:none;">contact@mathieuhaye.fr</a></div>
    </td></tr>
  </table>
  <div style="font-size:11px;color:#9aa0ad;margin-top:14px;">mathieuhaye.fr</div>
</td></tr></table>
</body></html>
HTML;
}

/**
 * Rich HTML email sent to the visitor after completing the AI maturity quiz:
 * hero with level + score, diagnostic, priority levers and an answers recap.
 */
function conf_html_rich(string $first, string $lang, array $result): string
{
    $f     = esc($first);
    $level = esc((string)($result['level'] ?? ''));
    $pct   = (int)($result['pct'] ?? 0);
    if ($pct < 0) { $pct = 0; }
    if ($pct > 100) { $pct = 100; }
    $diag  = esc((string)($result['diagnostic'] ?? ''));
    $isComplete = (($result['mode'] ?? '') === 'complet');

    $recoRows = '';
    $reco = is_array($result['reco'] ?? null) ? array_slice($result['reco'], 0, 8) : [];
    foreach ($reco as $r) {
        $recoRows .= '<tr><td style="padding:6px 0;font-size:14px;color:#1F0D19;line-height:1.5;"><span style="color:#8B1A2F;font-weight:bold;">&rarr;</span>&nbsp;&nbsp;' . esc((string)$r) . '</td></tr>';
    }

    $ansRows = '';
    $answers = is_array($result['answers'] ?? null) ? array_slice($result['answers'], 0, 25) : [];
    foreach ($answers as $a) {
        $lbl = esc((string)($a['label'] ?? ''));
        $val = esc((string)($a['value'] ?? ''));
        $ansRows .= '<tr><td style="padding:8px 0;border-bottom:1px solid #f1ece6;font-size:13px;color:#5b6473;vertical-align:top;width:50%;">' . $lbl . '</td><td style="padding:8px 0;border-bottom:1px solid #f1ece6;font-size:13px;color:#1F0D19;font-weight:bold;text-align:right;">' . $val . '</td></tr>';
    }

    if ($lang === 'en') {
        $eyebrow = 'YOUR AI DIAGNOSTIC';
        $hi      = "Hi {$f},";
        $intro   = 'Here is the result of your AI maturity test: your level, your priority levers and a recap of your answers. I will come back to you within 24h to dig into the quick wins.';
        $levers  = 'Your priority levers';
        $detail  = 'Your answers (' . ($isComplete ? 'complete' : 'quick') . ' test)';
        $cta     = 'Discuss your levers';
        $scoreL  = 'maturity score';
        $role    = 'Freelance Builder &middot; AI apps, automations &amp; custom CRM';
    } else {
        $eyebrow = 'VOTRE DIAGNOSTIC IA';
        $hi      = "Bonjour {$f},";
        $intro   = 'Voici le résultat de votre test de maturité IA : votre niveau, vos leviers prioritaires et le récap de vos réponses. Je reviens vers vous sous 24h pour creuser les quick wins.';
        $levers  = 'Vos leviers prioritaires';
        $detail  = 'Vos réponses (test ' . ($isComplete ? 'complet' : 'rapide') . ')';
        $cta     = 'Discutons de vos leviers';
        $scoreL  = 'score de maturité';
        $role    = 'Freelance Builder &middot; apps IA, automatisations &amp; CRM sur-mesure';
    }

    return <<<HTML
<!DOCTYPE html>
<html lang="{$lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FBF7F2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#FBF7F2;">{$level} — {$pct}% · {$scoreL}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F2;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #efe7e0;border-radius:16px;overflow:hidden;">
    <!-- HERO -->
    <tr><td style="background:#3A0F1F;background:linear-gradient(135deg,#8B1A2F 0%,#3A0F1F 100%);padding:30px 34px 28px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#ffffff;">mathieu <span style="font-style:italic;color:#FCBA35;">haye.</span></div>
      <div style="margin-top:22px;font-size:11px;letter-spacing:2px;color:#e8b9c2;font-weight:bold;">{$eyebrow}</div>
      <div style="margin-top:8px;font-size:32px;font-weight:bold;color:#ffffff;line-height:1.1;">{$level}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;"><tr>
        <td style="background:#641421;border-radius:999px;padding:0;font-size:0;line-height:0;">
          <table role="presentation" width="{$pct}%" cellpadding="0" cellspacing="0"><tr><td style="background:#FCBA35;height:9px;border-radius:999px;font-size:0;line-height:0;">&nbsp;</td></tr></table>
        </td>
      </tr></table>
      <div style="margin-top:10px;font-family:'Courier New',Courier,monospace;font-size:13px;color:#f0d9de;">{$pct}% &middot; {$scoreL}</div>
    </td></tr>
    <!-- INTRO -->
    <tr><td style="padding:26px 34px 6px;font-size:15px;line-height:1.65;color:#3a4150;">
      <p style="margin:0 0 12px;font-weight:bold;color:#1F0D19;">{$hi}</p>
      <p style="margin:0;">{$intro}</p>
    </td></tr>
    <!-- DIAGNOSTIC -->
    <tr><td style="padding:18px 34px 4px;">
      <div style="background:#FBF7F2;border-left:3px solid #8B1A2F;border-radius:8px;padding:14px 18px;font-size:14px;line-height:1.6;color:#1F0D19;">{$diag}</div>
    </td></tr>
    <!-- LEVERS -->
    <tr><td style="padding:22px 34px 4px;">
      <div style="font-size:11px;letter-spacing:1px;color:#8B1A2F;font-weight:bold;margin-bottom:8px;">{$levers}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{$recoRows}</table>
    </td></tr>
    <!-- ANSWERS -->
    <tr><td style="padding:22px 34px 4px;">
      <div style="font-size:11px;letter-spacing:1px;color:#8B1A2F;font-weight:bold;margin-bottom:4px;">{$detail}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{$ansRows}</table>
    </td></tr>
    <!-- CTA -->
    <tr><td style="padding:24px 34px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#8B1A2F;">
        <a href="https://mathieuhaye.fr/#agent" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">{$cta} &rarr;</a>
      </td></tr></table>
    </td></tr>
    <!-- SIGN -->
    <tr><td style="padding:22px 34px 28px;border-top:1px solid #f1ece6;font-size:13px;color:#3a4150;">
      <div style="font-weight:bold;color:#1F0D19;">Mathieu Haye</div>
      <div style="color:#5b6473;margin-top:2px;">{$role}</div>
      <div style="margin-top:8px;"><a href="mailto:contact@mathieuhaye.fr" style="color:#8B1A2F;text-decoration:none;">contact@mathieuhaye.fr</a></div>
    </td></tr>
  </table>
  <div style="font-size:11px;color:#9aa0ad;margin-top:14px;">mathieuhaye.fr</div>
</td></tr></table>
</body></html>
HTML;
}

/**
 * Rich HTML email sent to the visitor after the AI visibility scan:
 * hero with verdict + score, the one-line verdict, visible/citable bars and a
 * signal-by-signal recap.
 */
function conf_html_scan(string $first, string $lang, array $scan): string
{
    $f     = esc($first);
    $host  = esc((string)($scan['host'] ?? ($scan['url'] ?? '')));
    $score = (int)($scan['score'] ?? 0);
    if ($score < 0)   { $score = 0; }
    if ($score > 100) { $score = 100; }
    $vTitle    = esc((string)($scan['verdict']['title'] ?? ''));
    $vSentence = esc((string)($scan['verdict']['sentence'] ?? ''));
    $av = max(0, min(100, (int)($scan['axes']['visible'] ?? 0)));
    $ac = max(0, min(100, (int)($scan['axes']['citable'] ?? 0)));
    $agp = max(0, min(100, (int)($scan['axes']['agent'] ?? 0)));

    $checkRows = '';
    $checks = is_array($scan['checks'] ?? null) ? array_slice($scan['checks'], 0, 12) : [];
    foreach ($checks as $c) {
        $ok   = (($c['status'] ?? '') === 'pass');
        $ico  = $ok ? '&#10003;' : '&#10007;';
        $col  = $ok ? '#2E7D5B' : '#C0392B';
        $lbl  = esc((string)($c['label'] ?? ''));
        $axis = (($c['axis'] ?? '') === 'visible') ? 'visible' : 'citable';
        $checkRows .= '<tr><td style="padding:7px 0;border-bottom:1px solid #f1ece6;font-size:14px;color:#1F0D19;"><span style="color:' . $col . ';font-weight:bold;">' . $ico . '</span>&nbsp;&nbsp;' . $lbl . '</td><td style="padding:7px 0;border-bottom:1px solid #f1ece6;font-size:10px;color:#9aa0ad;text-align:right;text-transform:uppercase;letter-spacing:1px;">' . $axis . '</td></tr>';
    }

    if ($lang === 'en') {
        $eyebrow  = 'YOUR AI VISIBILITY REPORT';
        $hi       = "Hi {$f},";
        $intro    = "Here is the result for <b>{$host}</b>: whether AI assistants can read and cite your site, and what holds it back today.";
        $visibleL = 'Visible'; $citableL = 'Citable'; $agentL = 'Agent-ready';
        $detail   = 'Signal by signal';
        $cta      = 'Fix this with me';
        $scoreL   = 'AI visibility score';
        $role     = 'Freelance Builder &middot; AI apps, automations &amp; custom CRM';
    } else {
        $eyebrow  = 'VOTRE DIAGNOSTIC DE VISIBILITÉ IA';
        $hi       = "Bonjour {$f},";
        $intro    = "Voici le résultat pour <b>{$host}</b> : ce que les IA peuvent lire et citer de votre site, et ce qui le freine aujourd'hui.";
        $visibleL = 'Visible'; $citableL = 'Citable'; $agentL = 'Agent-ready';
        $detail   = 'Signal par signal';
        $cta      = 'En parler avec moi';
        $scoreL   = 'score de visibilité IA';
        $role     = 'Freelance Builder &middot; apps IA, automatisations &amp; CRM sur-mesure';
    }

    return <<<HTML
<!DOCTYPE html>
<html lang="{$lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FBF7F2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#FBF7F2;">{$vTitle} · {$score}/100 · {$scoreL}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F2;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #efe7e0;border-radius:16px;overflow:hidden;">
    <tr><td style="background:#3A0F1F;background:linear-gradient(135deg,#8B1A2F 0%,#3A0F1F 100%);padding:30px 34px 28px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#ffffff;">mathieu <span style="font-style:italic;color:#FCBA35;">haye.</span></div>
      <div style="margin-top:22px;font-size:11px;letter-spacing:2px;color:#e8b9c2;font-weight:bold;">{$eyebrow}</div>
      <div style="margin-top:8px;font-size:30px;font-weight:bold;color:#ffffff;line-height:1.12;">{$vTitle}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;"><tr>
        <td style="background:#641421;border-radius:999px;padding:0;font-size:0;line-height:0;">
          <table role="presentation" width="{$score}%" cellpadding="0" cellspacing="0"><tr><td style="background:#FCBA35;height:9px;border-radius:999px;font-size:0;line-height:0;">&nbsp;</td></tr></table>
        </td>
      </tr></table>
      <div style="margin-top:10px;font-family:'Courier New',Courier,monospace;font-size:13px;color:#f0d9de;">{$score}/100 &middot; {$scoreL}</div>
    </td></tr>
    <tr><td style="padding:26px 34px 6px;font-size:15px;line-height:1.65;color:#3a4150;">
      <p style="margin:0 0 12px;font-weight:bold;color:#1F0D19;">{$hi}</p>
      <p style="margin:0;">{$intro}</p>
    </td></tr>
    <tr><td style="padding:18px 34px 4px;">
      <div style="background:#FBF7F2;border-left:3px solid #8B1A2F;border-radius:8px;padding:14px 18px;font-size:14px;line-height:1.6;color:#1F0D19;">{$vSentence}</div>
    </td></tr>
    <tr><td style="padding:20px 34px 4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:12px;color:#5b6473;padding-bottom:4px;">{$visibleL}</td>
        <td style="font-size:12px;color:#8B1A2F;font-weight:bold;text-align:right;padding-bottom:4px;">{$av}%</td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;"><tr><td style="background:#f1ece6;border-radius:999px;font-size:0;line-height:0;">
        <table role="presentation" width="{$av}%" cellpadding="0" cellspacing="0"><tr><td style="background:#8B1A2F;height:8px;border-radius:999px;font-size:0;line-height:0;">&nbsp;</td></tr></table>
      </td></tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:12px;color:#5b6473;padding-bottom:4px;">{$citableL}</td>
        <td style="font-size:12px;color:#8B1A2F;font-weight:bold;text-align:right;padding-bottom:4px;">{$ac}%</td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#f1ece6;border-radius:999px;font-size:0;line-height:0;">
        <table role="presentation" width="{$ac}%" cellpadding="0" cellspacing="0"><tr><td style="background:#C13B30;height:8px;border-radius:999px;font-size:0;line-height:0;">&nbsp;</td></tr></table>
      </td></tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;"><tr>
        <td style="font-size:12px;color:#5b6473;padding-bottom:4px;">{$agentL}</td>
        <td style="font-size:12px;color:#8B1A2F;font-weight:bold;text-align:right;padding-bottom:4px;">{$agp}%</td>
      </tr></table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#f1ece6;border-radius:999px;font-size:0;line-height:0;">
        <table role="presentation" width="{$agp}%" cellpadding="0" cellspacing="0"><tr><td style="background:#8B1A2F;height:8px;border-radius:999px;font-size:0;line-height:0;">&nbsp;</td></tr></table>
      </td></tr></table>
    </td></tr>
    <tr><td style="padding:18px 34px 4px;">
      <div style="font-size:11px;letter-spacing:1px;color:#8B1A2F;font-weight:bold;margin-bottom:4px;">{$detail}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{$checkRows}</table>
    </td></tr>
    <tr><td style="padding:24px 34px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#8B1A2F;">
        <a href="https://mathieuhaye.fr/#agent" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">{$cta} &rarr;</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="padding:22px 34px 28px;border-top:1px solid #f1ece6;font-size:13px;color:#3a4150;">
      <div style="font-weight:bold;color:#1F0D19;">Mathieu Haye</div>
      <div style="color:#5b6473;margin-top:2px;">{$role}</div>
      <div style="margin-top:8px;"><a href="mailto:contact@mathieuhaye.fr" style="color:#8B1A2F;text-decoration:none;">contact@mathieuhaye.fr</a></div>
    </td></tr>
  </table>
  <div style="font-size:11px;color:#9aa0ad;margin-top:14px;">mathieuhaye.fr</div>
</td></tr></table>
</body></html>
HTML;
}
