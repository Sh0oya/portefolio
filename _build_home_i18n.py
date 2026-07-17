# -*- coding: utf-8 -*-
"""P5 — Home FR statique + miroir EN.
1) Bake les textes FR (dict i18n de script.js) dans index.html (la home est FR par défaut).
2) Génère en/index.html : textes EN bakés, hrefs data-en-href appliqués, chemins d'assets
   absolus, head EN (canonical /en/, og:locale en_US, JSON-LD WebPage en), lang-switch inversé.
Le bloc <div class="latest-articles"> est copié VERBATIM dans les deux fichiers :
c'est le contrat du cron blog (step 9b) qui le patche à l'identique dans index.html
ET en/index.html ; côté EN, applyLang('en') swap textes (clés la*) et hrefs au runtime.
Usage : python _build_home_i18n.py  (relançable — part toujours de index.html)
"""
import io, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))

# ---------- dict i18n depuis script.js (HTML conservé) ----------
def load_i18n():
    js = io.open(os.path.join(ROOT, 'script.js'), encoding='utf-8').read()
    rx = re.compile(r"'([^']+)'\s*:\s*\{\s*en:\s*'((?:[^'\\]|\\.)*)'\s*,\s*fr:\s*'((?:[^'\\]|\\.)*)'\s*\}")
    def un(s):
        s = s.replace("\\'", "'").replace('\\n', '\n').replace('\\\\', '\\')
        return re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), s)
    return {k: {'en': un(en), 'fr': un(fr)} for k, en, fr in rx.findall(js)}

I18N = load_i18n()
print('i18n keys:', len(I18N))

# ---------- bake data-i18n / -placeholder / -aria ----------
TAG_RX = re.compile(r'<(\w+)((?:[^>"]|"[^"]*")*?data-i18n="([^"]+)"(?:[^>"]|"[^"]*")*)>(.*?)</\1>', re.S)

def bake(html, lang):
    def repl(m):
        tag, attrs, key, inner = m.group(1), m.group(2), m.group(3), m.group(4)
        entry = I18N.get(key)
        if not entry or not entry.get(lang):
            return m.group(0)
        return '<%s%s>%s</%s>' % (tag, attrs, entry[lang], tag)
    html = TAG_RX.sub(repl, html)

    def attr_repl(kind, target_attr, html):
        rx = re.compile(r'(<[^>]*?)%s="([^"]+)"([^>]*?)>' % kind)
        def r(m):
            key = m.group(2)
            entry = I18N.get(key)
            if not entry or not entry.get(lang):
                return m.group(0)
            whole = m.group(0)
            val = entry[lang].replace('"', '&quot;')
            # (?<![-\w]) : ne pas matcher "placeholder=" DANS "data-i18n-placeholder="
            whole2 = re.sub(r'(?<![-\w])%s="[^"]*"' % target_attr, '%s="%s"' % (target_attr, val), whole, count=1)
            return whole2
        return rx.sub(r, html)
    html = attr_repl('data-i18n-placeholder', 'placeholder', html)
    html = attr_repl('data-i18n-aria', 'aria-label', html)
    return html

# ---------- extraction du bloc latest-articles (divs équilibrés) ----------
def cut_latest(html):
    start = html.index('<div class="latest-articles"')
    i, depth = start, 0
    div_rx = re.compile(r'<div\b|</div>')
    for m in div_rx.finditer(html, start):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            end = m.end()
            return html[:start], html[start:end], html[end:]
    raise SystemExit('latest-articles block not balanced')

# ---------- 1) FR bake in place ----------
src = io.open(os.path.join(ROOT, 'index.html'), encoding='utf-8', newline='').read()
head_fr, latest, tail_fr = cut_latest(src)
fr = bake(head_fr, 'fr') + latest + bake(tail_fr, 'fr')
io.open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8', newline='').write(fr)
print('index.html : FR bake OK')

# ---------- 2) EN mirror ----------
head, latest, tail = cut_latest(fr)

def to_en(part):
    part = bake(part, 'en')
    # data-en-href -> href (href précède toujours data-en-href dans le markup)
    part = re.sub(r'href="[^"]*"([^>]*?)data-en-href="([^"]*)"',
                  lambda m: 'href="%s"%sdata-en-href="%s"' % (m.group(2), m.group(1), m.group(2)),
                  part)
    return part

en = to_en(head) + latest + to_en(tail)

# chemins absolus (la page vit sous /en/)
en = en.replace('href="style.css', 'href="/style.css')
en = en.replace('src="script.js', 'src="/script.js')
en = en.replace('src="gsap-enhance.js', 'src="/gsap-enhance.js')
en = re.sub(r'(?<![/\w])assets/(img|projects)/', r'/assets/\1/', en)

# head : lang, SEO, OG, twitter, JSON-LD, sr-only, lang-switch
PAIRS = [
    ('<html lang="fr">', '<html lang="en">'),
    ('<title>Mathieu Haye &middot; Freelance CRM, IA &amp; Automatisation</title>',
     '<title>Mathieu Haye &middot; Freelance CRM, AI &amp; Automation</title>'),
    ('<meta name="description" content="Les logiciels sur mesure qui simplifient le travail de vos &eacute;quipes : CRM, automatisations, agents IA et applications m&eacute;tier pour PME. Un seul interlocuteur, &agrave; Paris.">',
     '<meta name="description" content="Custom software that simplifies your teams&rsquo; work: CRM builds, automations, AI agents and business applications for SMEs. One point of contact, Paris based.">'),
    ('<link rel="canonical" href="https://mathieuhaye.fr/">',
     '<link rel="canonical" href="https://mathieuhaye.fr/en/">'),
    ('<link rel="alternate" type="text/markdown" title="Markdown version" href="/index.md">',
     '<link rel="alternate" type="text/markdown" title="Markdown version" href="/en/index.md">'),
    ('<meta property="og:title" content="Mathieu Haye &middot; Freelance CRM, IA &amp; Automatisation">',
     '<meta property="og:title" content="Mathieu Haye &middot; Freelance CRM, AI &amp; Automation">'),
    ('<meta property="og:image" content="https://mathieuhaye.fr/assets/img/og-cover.jpg">',
     '<meta property="og:image" content="https://mathieuhaye.fr/assets/img/og-cover-en.jpg">'),
    ('<meta name="twitter:image" content="https://mathieuhaye.fr/assets/img/og-cover.jpg">',
     '<meta name="twitter:image" content="https://mathieuhaye.fr/assets/img/og-cover-en.jpg">'),
    ('<meta property="og:description" content="Les logiciels sur mesure qui simplifient le travail de vos &eacute;quipes : CRM, automatisations, agents IA, applications m&eacute;tier. Con&ccedil;us autour de vos processus, livr&eacute;s en semaines.">',
     '<meta property="og:description" content="Custom software that simplifies your teams&rsquo; work: CRM, automations, AI agents, business applications. Designed around your processes, shipped in weeks.">'),
    ('<meta property="og:url" content="https://mathieuhaye.fr/">',
     '<meta property="og:url" content="https://mathieuhaye.fr/en/">'),
    ('<meta property="og:image:alt" content="Mathieu Haye. Consultant IA &amp; automatisation. CRM, agents IA et applications m&eacute;tier sur mesure.">',
     '<meta property="og:image:alt" content="Mathieu Haye. AI &amp; automation consultant. Custom CRM, AI agents and business applications.">'),
    ('<meta property="og:locale" content="fr_FR">\n    <meta property="og:locale:alternate" content="en_US">',
     '<meta property="og:locale" content="en_US">\n    <meta property="og:locale:alternate" content="fr_FR">'),
    ('<meta name="twitter:title" content="Mathieu Haye &middot; Freelance CRM, IA &amp; Automatisation">',
     '<meta name="twitter:title" content="Mathieu Haye &middot; Freelance CRM, AI &amp; Automation">'),
    ('<meta name="twitter:description" content="CRM, automatisations, agents IA et applications m&eacute;tier con&ccedil;us autour de vos processus. Livr&eacute;s en semaines, un seul interlocuteur.">',
     '<meta name="twitter:description" content="CRM, automations, AI agents and business applications designed around your processes. Shipped in weeks, one point of contact.">'),
    ('"@id": "https://mathieuhaye.fr/#webpage",\n          "url": "https://mathieuhaye.fr/",',
     '"@id": "https://mathieuhaye.fr/en/#webpage",\n          "url": "https://mathieuhaye.fr/en/",'),
    ('"name": "Mathieu Haye. Freelance CRM, IA & Automatisation. Les logiciels sur mesure qui simplifient le travail de vos équipes.",',
     '"name": "Mathieu Haye. Freelance CRM, AI & Automation. Custom software that simplifies your teams\u2019 work.",'),
    ('"description": "Services pour PME et scale-ups : CRM sur-mesure, agents IA, automatisations et applications métier, livrés en semaines. Un seul interlocuteur du cadrage à la production. Paris, FR/EN.",',
     '"description": "Services for SMEs and scale-ups: custom CRM builds, AI agents, automations and business applications, shipped in weeks. One point of contact from scoping to production. Paris, FR/EN.",'),
    ('"inLanguage": "fr",\n          "speakable"', '"inLanguage": "en",\n          "speakable"'),
    ('{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mathieuhaye.fr/" }',
     '{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mathieuhaye.fr/en/" }'),
    ('"@id": "https://mathieuhaye.fr/#breadcrumbs",',
     '"@id": "https://mathieuhaye.fr/en/#breadcrumbs",'),
    # lang switch inversé
    ('<span class="lang-btn active">FR</span>\n                <span class="lang-sep" aria-hidden="true">/</span>\n                <a class="lang-btn" href="/en/" hreflang="en">EN</a>',
     '<a class="lang-btn" href="/" hreflang="fr">FR</a>\n                <span class="lang-sep" aria-hidden="true">/</span>\n                <span class="lang-btn active">EN</span>'),
    ('<div class="lang-switch" role="group" aria-label="Langue">',
     '<div class="lang-switch" role="group" aria-label="Language">'),
]
missed = []
for a, b in PAIRS:
    # le fichier peut être en LF ou CRLF selon qui l'a réécrit (cron, éditeur)
    for a2, b2 in ((a, b), (a.replace('\n', '\r\n'), b.replace('\n', '\r\n'))):
        if a2 in en:
            en = en.replace(a2, b2, 1)
            break
    else:
        missed.append(a[:70])

# JSON-LD sitelinks : @id + URLs anglaises (scopé au bloc ItemList uniquement)
SL_START = '"@id": "https://mathieuhaye.fr/#sitelinks"'
if SL_START in en:
    s = en.index(SL_START)
    e = en.index(']', s)
    block = en[s:e]
    block = block.replace('"@id": "https://mathieuhaye.fr/#sitelinks"',
                          '"@id": "https://mathieuhaye.fr/en/#sitelinks"')
    SL_MAP = [
        ('https://mathieuhaye.fr/#about',      'https://mathieuhaye.fr/en/#about'),
        ('https://mathieuhaye.fr/#approach',   'https://mathieuhaye.fr/en/#approach'),
        ('https://mathieuhaye.fr/#agent',      'https://mathieuhaye.fr/en/#agent'),
        ('https://mathieuhaye.fr/#contact',    'https://mathieuhaye.fr/en/#contact'),
        ('https://mathieuhaye.fr/projets',     'https://mathieuhaye.fr/en/projects'),
        ('https://mathieuhaye.fr/crm-sur-mesure', 'https://mathieuhaye.fr/en/custom-crm'),
        ('https://mathieuhaye.fr/application-sur-mesure', 'https://mathieuhaye.fr/en/custom-web-app'),
        ('https://mathieuhaye.fr/collaboration', 'https://mathieuhaye.fr/en/collaboration'),
        ('https://mathieuhaye.fr/blog/',       'https://mathieuhaye.fr/blog/en/'),
    ]
    for a, b in SL_MAP:
        block = block.replace('"' + a + '"', '"' + b + '"')
    en = en[:s] + block + en[e:]
else:
    missed.append(SL_START)

# sr-only FR -> EN
SR_FR_START = '<header class="sr-only" aria-label='
i0 = en.index(SR_FR_START)
i1 = en.index('</header>', i0) + len('</header>')
SR_EN = '''<header class="sr-only" aria-label="About this site">
        <p><strong>Mathieu Haye, freelance developer specialised in AI and automation (custom CRM, AI agents, business applications)</strong></p>
        <p>
            Mathieu Haye helps SMEs and scale-ups remove the manual work that slows their growth:
            he designs and ships custom CRM platforms, AI agents, automations and business
            applications built around each client's processes, not a SaaS vendor's. His promise:
            building the software your company wishes it had found on the market. He does not
            build by default: he recommends the simplest solution that fits, and only custom-builds
            what truly deserves it. One point of contact from scoping to production, shipped in
            weeks. Three packages: a 1-week Sprint from €400, a 4-to-6-week
            MVP, and a monthly retainer (MVP and retainer priced on quote). Based near Paris,
            working in French and English. Contact: contact@mathieuhaye.fr.
            Reply within 24h Monday to Friday.
        </p>
    </header>'''
en = en[:i0] + SR_EN + en[i1:]

out = os.path.join(ROOT, 'en', 'index.html')
io.open(out, 'w', encoding='utf-8', newline='').write(en)
print('en/index.html : OK')
if missed:
    print('ATTENTION, paires non trouvées :')
    for m in missed:
        print('  -', m)
