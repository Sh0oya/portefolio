<?php
/**
 * Shareable AI-visibility scan result.
 * Stateless: the result is encoded in the URL as base64url of
 * "score|vkey|av|ac|ag|lang|host". Renders a public result card + per-result
 * Open Graph tags so the link previews nicely on LinkedIn and other socials,
 * with a CTA back to the free test. No storage, no secrets, read-only.
 * Every value comes from the URL, so everything is validated and escaped.
 */
declare(strict_types=1);

// ---- Read the encoded result, robust to how the host routes /r/<token> ----
// (clean rewrite to ?d=, OR MultiViews/PATH_INFO where $_GET['d'] is empty).
$d = '';
if (preg_match('~/r/([A-Za-z0-9_\-]+)~', (string)($_SERVER['REQUEST_URI'] ?? ''), $m)) {
    $d = $m[1];
} elseif (isset($_GET['d']) && $_GET['d'] !== '') {
    $d = (string)$_GET['d'];
} elseif (isset($_SERVER['PATH_INFO'])) {
    $d = trim((string)$_SERVER['PATH_INFO'], '/');
}

$b64 = strtr($d, '-_', '+/');
$mod = strlen($b64) % 4;
if ($mod) { $b64 .= str_repeat('=', 4 - $mod); }
$raw = ($d !== '') ? base64_decode($b64) : '';

if (!is_string($raw) || strpos($raw, '|') === false) {
    header('Location: /visible-par-les-ia', true, 302);
    exit;
}

$p     = explode('|', $raw);
$clamp = static function ($v) { $v = (int)$v; return $v < 0 ? 0 : ($v > 100 ? 100 : $v); };

$score = $clamp($p[0] ?? 0);
$vkey  = $p[1] ?? 'visible';
if (!in_array($vkey, ['invisible', 'visible', 'citable', 'agent_ready'], true)) { $vkey = 'visible'; }
$av    = $clamp($p[2] ?? 0);
$ac    = $clamp($p[3] ?? 0);
$ag    = $clamp($p[4] ?? 0);
$lang  = (($p[5] ?? 'fr') === 'en') ? 'en' : 'fr';

$hostRaw = strtolower(trim((string)($p[6] ?? '')));
$hostRaw = (string)preg_replace('~[^a-z0-9.\-]~', '', $hostRaw);
$hostRaw = substr($hostRaw, 0, 80);
$host    = ($hostRaw !== '') ? $hostRaw : ($lang === 'en' ? 'your site' : 'votre site');

// ---- Verdict, band, color ----
$V = [
    'invisible'   => ['fr' => ['Invisible pour les IA',     "Les IA ne peuvent pas lire ce site : son contenu leur est inaccessible."],
                      'en' => ['Invisible to AI',           "AI assistants cannot read this site: its content is out of reach."]],
    'visible'     => ['fr' => ['Visible, mais pas citable', "Les IA voient ce site, mais il n'est pas structuré pour être cité."],
                      'en' => ['Visible, but not citable',  "AI can see this site, but it is not structured to be cited."]],
    'citable'     => ['fr' => ['Lisible et citable',        "Les IA peuvent lire et citer ce site, mais la couche agents manque encore."],
                      'en' => ['Readable and citable',      "AI can read and cite this site, but the agents layer is still missing."]],
    'agent_ready' => ['fr' => ['Prêt pour les agents IA',   "Ce site est lisible, citable et prêt pour les agents IA."],
                      'en' => ['Ready for AI agents',       "This site is readable, citable and ready for AI agents."]],
];
$bandMap  = ['invisible' => 'invisible', 'visible' => 'visible', 'citable' => 'citable', 'agent_ready' => 'agent'];
$colorMap = ['invisible' => '#C0392B', 'visible' => '#D98A1F', 'citable' => '#8B1A2F', 'agent_ready' => '#2E7D5B'];
$band      = $bandMap[$vkey];
$bandColor = $colorMap[$vkey];
$vTitle    = $V[$vkey][$lang][0];
$vSent     = $V[$vkey][$lang][1];

$e     = static function ($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); };
$base  = 'https://mathieuhaye.fr';
$token = (string)preg_replace('~[^A-Za-z0-9_-]~', '', $d);

$shareUrl = $base . '/r/' . $token;
$ogImg    = $base . '/assets/img/scan-og-' . $band . '-' . $lang . '.jpg';
$scanUrl  = ($lang === 'en') ? '/en/ai-visibility' : '/visible-par-les-ia';
$ogTitle  = ($lang === 'en') ? "{$host}: {$vTitle} ({$score}/100)" : "{$host} : {$vTitle} ({$score}/100)";
$ogDesc   = ($lang === 'en')
    ? "Free AI visibility test (ChatGPT, Perplexity, Google AI). How does your own site score?"
    : "Test gratuit de visibilité par les IA (ChatGPT, Perplexity, Google AI). Et le vôtre, il obtient combien ?";

$L = ($lang === 'en')
    ? ['eyebrow' => 'AI VISIBILITY TEST', 'lead' => 'Result for', 'visible' => 'Visible', 'citable' => 'Citable', 'agent' => 'Agent-ready', 'cta' => 'Test your site, free', 'cta2' => 'Talk to Mathieu', 'back' => 'Free AI visibility test']
    : ['eyebrow' => 'TEST DE VISIBILITÉ IA', 'lead' => 'Résultat pour', 'visible' => 'Visible', 'citable' => 'Citable', 'agent' => 'Agent-ready', 'cta' => 'Testez votre site, gratuit', 'cta2' => 'Parler à Mathieu', 'back' => 'Test gratuit de visibilité par les IA'];

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
?>
<!DOCTYPE html>
<html lang="<?= $lang ?>">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= $e($ogTitle) ?></title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="<?= $base . $scanUrl ?>">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Mathieu Haye">
<meta property="og:title" content="<?= $e($ogTitle) ?>">
<meta property="og:description" content="<?= $e($ogDesc) ?>">
<meta property="og:url" content="<?= $e($shareUrl) ?>">
<meta property="og:image" content="<?= $e($ogImg) ?>">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="<?= $lang === 'en' ? 'en_US' : 'fr_FR' ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= $e($ogTitle) ?>">
<meta name="twitter:description" content="<?= $e($ogDesc) ?>">
<meta name="twitter:image" content="<?= $e($ogImg) ?>">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css?v=61">
<style>
.rwrap { position:relative; z-index:2; max-width: 720px; margin: 0 auto; padding: calc(var(--nav-height, 72px) + 36px) var(--space-md, 20px) 80px; }
.rback { font-family: var(--font-mono); font-size: 12px; letter-spacing: .05em; color: var(--ink-500); text-decoration: none; }
.rback:hover { color: var(--albert-royal); }
.rcard { margin-top: 22px; background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-radius: var(--radius-lg, 20px); padding: clamp(24px, 4vw, 42px); box-shadow: var(--glass-shadow), var(--glass-inset); }
.reyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--albert-royal); font-weight: 600; }
.rhost { font-family: var(--font-mono); font-size: 13px; color: var(--ink-500); margin-top: 6px; word-break: break-all; }
.rtop { display: flex; align-items: center; gap: 26px; flex-wrap: wrap; margin-top: 18px; }
.rring { position: relative; width: 130px; height: 130px; border-radius: 50%; flex: 0 0 auto; background: conic-gradient(<?= $bandColor ?> calc(<?= $score ?> * 1%), rgba(31,13,25,.10) 0); }
.rring::after { content: ""; position: absolute; inset: 12px; border-radius: 50%; background: #fff; box-shadow: inset 0 1px 4px rgba(31,13,25,.08); }
.rring-in { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.rnum { font-family: var(--font-display); font-size: 38px; font-weight: 600; color: var(--ink-900); line-height: 1; }
.rmax { font-family: var(--font-mono); font-size: 11px; color: var(--ink-500); margin-top: 2px; }
.rverdict { flex: 1; min-width: 220px; }
.rvtitle { font-family: var(--font-display); font-size: clamp(1.5rem, 3.4vw, 2.1rem); font-weight: 600; line-height: 1.12; color: <?= $bandColor ?>; }
.rvsent { font-size: 15px; line-height: 1.6; color: var(--ink-700, #3a2630); margin-top: 8px; }
.raxes { margin-top: 24px; display: grid; gap: 12px; }
.rax-l { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-500); margin-bottom: 4px; }
.rax-t { height: 8px; border-radius: 999px; background: rgba(31,13,25,.10); overflow: hidden; }
.rax-f { height: 100%; border-radius: 999px; background: var(--albert-royal); }
.rcta { margin-top: 30px; display: flex; gap: 12px; flex-wrap: wrap; }
.rbtn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px; border-radius: 999px; font-weight: 600; font-size: 15px; text-decoration: none; transition: all 200ms ease; }
.rbtn-p { background: var(--albert-royal); color: #fff; box-shadow: 0 6px 18px rgba(139,26,47,.22); }
.rbtn-p:hover { transform: translateY(-2px); }
.rbtn-g { background: transparent; color: var(--ink-900); border: 1px solid var(--glass-border); }
.rfoot { text-align: center; margin-top: 26px; font-family: var(--font-mono); font-size: 12px; color: var(--ink-500); }
</style>
</head>
<body class="launch-done">
<div class="bg-grid"></div>
<div class="bg-gradient"></div>
<nav class="nav" id="nav">
  <div class="nav-container">
    <a href="/" class="nav-logo" aria-label="Mathieu Haye"><span class="nav-logo-wordmark">mathieu <em>haye.</em></span></a>
  </div>
</nav>
<main class="rwrap">
  <a href="<?= $scanUrl ?>" class="rback">&larr; <?= $e($L['back']) ?></a>
  <div class="rcard">
    <div class="reyebrow"><?= $e($L['eyebrow']) ?></div>
    <div class="rhost"><?= $e($L['lead']) ?> <strong><?= $e($host) ?></strong></div>
    <div class="rtop">
      <div class="rring"><div class="rring-in"><span class="rnum"><?= $score ?></span><span class="rmax">/ 100</span></div></div>
      <div class="rverdict">
        <div class="rvtitle"><?= $e($vTitle) ?></div>
        <div class="rvsent"><?= $e($vSent) ?></div>
      </div>
    </div>
    <div class="raxes">
      <div><div class="rax-l"><span><?= $e($L['visible']) ?></span><b><?= $av ?>%</b></div><div class="rax-t"><div class="rax-f" style="width:<?= $av ?>%"></div></div></div>
      <div><div class="rax-l"><span><?= $e($L['citable']) ?></span><b><?= $ac ?>%</b></div><div class="rax-t"><div class="rax-f" style="width:<?= $ac ?>%"></div></div></div>
      <div><div class="rax-l"><span><?= $e($L['agent']) ?></span><b><?= $ag ?>%</b></div><div class="rax-t"><div class="rax-f" style="width:<?= $ag ?>%"></div></div></div>
    </div>
    <div class="rcta">
      <a href="<?= $scanUrl ?>" class="rbtn rbtn-p"><?= $e($L['cta']) ?> &rarr;</a>
      <a href="/#agent" class="rbtn rbtn-g"><?= $e($L['cta2']) ?></a>
    </div>
  </div>
  <div class="rfoot">mathieuhaye.fr</div>
</main>
</body>
</html>
