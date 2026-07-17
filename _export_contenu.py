# -*- coding: utf-8 -*-
"""Construit _contenu/ : tout le contenu du site en dur, un dossier par page.
Usage : python _export_contenu.py (depuis la racine). Jamais deploye (_contenu exclu)."""
import os, re, shutil, html as H
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, '_contenu')

# ---------------- i18n map from script.js ----------------
def load_i18n():
    js = open(os.path.join(ROOT, 'script.js'), encoding='utf-8').read()
    rx = re.compile(r"'([^']+)'\s*:\s*\{\s*en:\s*'((?:[^'\\]|\\.)*)'\s*,\s*fr:\s*'((?:[^'\\]|\\.)*)'\s*\}")
    m = {}
    for k, en, fr in rx.findall(js):
        def un(s):
            s = s.replace("\\'", "'").replace('\\n', '\n')
            s = re.sub(r'\\u([0-9a-fA-F]{4})', lambda mm: chr(int(mm.group(1), 16)), s)
            return H.unescape(s)
        strip = lambda s: re.sub(r'<[^>]+>', '', s)
        m[k] = {'en': strip(un(en)).strip(), 'fr': strip(un(fr)).strip()}
    return m

I18N = load_i18n()

# ---------------- generic HTML -> markdown-ish extractor ----------------
SKIP_TAGS = {'script', 'style', 'svg', 'noscript', 'template', 'iframe', 'canvas'}
SKIP_IDS = {'menuOverlay', 'projectModal', 'nav'}
SKIP_CLASSES = {'launch-overlay', 'menu-overlay', 'sticky-cta', 'scroll-progress', 'nav'}
HEADINGS = {'h1': '# ', 'h2': '## ', 'h3': '### ', 'h4': '#### ', 'h5': '##### ', 'h6': '###### '}
BLOCKS = {'p', 'li', 'blockquote', 'figcaption', 'dt', 'dd', 'div', 'section', 'article', 'header', 'footer', 'ul', 'ol', 'tr', 'th', 'td'}

class Extractor(HTMLParser):
    def __init__(self, lang):
        super().__init__(convert_charrefs=True)
        self.lang = lang
        self.lines = []
        self.buf = []
        self.skip_depth = 0
        self.i18n_skip_depth = 0
        self.stack = []
        self.cur_heading = None
        self.li_mode = 0

    def _attrs(self, attrs):
        return {k: (v or '') for k, v in attrs}

    def flush(self):
        txt = re.sub(r'\s+', ' ', ' '.join(self.buf)).strip()
        self.buf = []
        if not txt:
            return
        if self.cur_heading:
            self.lines.append('')
            self.lines.append(HEADINGS[self.cur_heading] + txt)
            self.lines.append('')
        elif self.li_mode:
            self.lines.append('- ' + txt)
        else:
            self.lines.append(txt)
            self.lines.append('')

    def handle_starttag(self, tag, attrs):
        a = self._attrs(attrs)
        self.stack.append(tag)
        if self.skip_depth:
            self.skip_depth += 1
            return
        classes = set(a.get('class', '').split())
        if (tag in SKIP_TAGS or a.get('id') in SKIP_IDS or (classes & SKIP_CLASSES)
                or a.get('aria-hidden') == 'true'):
            self.skip_depth = 1
            return
        if self.i18n_skip_depth:
            self.i18n_skip_depth += 1
        if tag in HEADINGS:
            self.flush()
            self.cur_heading = tag
        elif tag == 'li':
            self.flush()
            self.li_mode += 1
        elif tag in BLOCKS:
            self.flush()
        key = a.get('data-i18n')
        if key and not self.i18n_skip_depth:
            val = I18N.get(key, {}).get(self.lang)
            if val:
                self.buf.append(val)
                self.i18n_skip_depth = 1  # ignore the element's own inner text

    def handle_endtag(self, tag):
        if self.stack:
            self.stack.pop()
        if self.skip_depth:
            self.skip_depth -= 1
            return
        if self.i18n_skip_depth:
            self.i18n_skip_depth -= 1
        if tag in HEADINGS:
            self.flush()
            self.cur_heading = None
        elif tag == 'li':
            self.flush()
            self.li_mode = max(0, self.li_mode - 1)
        elif tag in BLOCKS:
            self.flush()

    def handle_data(self, data):
        if self.skip_depth or self.i18n_skip_depth:
            return
        if data.strip():
            self.buf.append(data.strip())

def html_to_md(path, lang):
    doc = open(path, encoding='utf-8').read()
    body = re.search(r'<body[^>]*>(.*)</body>', doc, re.DOTALL)
    ex = Extractor(lang)
    ex.feed(body.group(1) if body else doc)
    ex.flush()
    md = '\n'.join(ex.lines)
    md = re.sub(r'\n{3,}', '\n\n', md)
    return md.strip() + '\n'

def header(title, url, note=''):
    h = '# %s\n\n> Source : %s\n' % (title, url)
    if note:
        h += '> %s\n' % note
    return h + '\n---\n\n'

# ---------------- build ----------------
if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)

def put(dest_rel, content):
    p = os.path.join(OUT, dest_rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8', newline='\n').write(content)

def copy_md(src_rel, dest_rel, title, url):
    src = os.path.join(ROOT, src_rel)
    body = open(src, encoding='utf-8').read()
    put(dest_rel, header(title, url, 'Copie du jumeau Markdown ' + src_rel + ' (source de verite editable).') + body)

# --- pages with .md twins: (fr_md, en_md, folder, title, fr_url, en_url)
PAGES = [
    ('crm-sur-mesure.md',        'en/custom-crm.md',        'services/crm-sur-mesure',        'CRM sur-mesure',              '/crm-sur-mesure',        '/en/custom-crm'),
    ('developpeur-agent-ia.md',  'en/ai-agent-developer.md', 'services/developpeur-agent-ia',  "Developpeur d'agents IA",     '/developpeur-agent-ia',  '/en/ai-agent-developer'),
    ('automatisation-n8n.md',    'en/n8n-automation.md',    'services/automatisation-n8n',    'Automatisation n8n',          '/automatisation-n8n',    '/en/n8n-automation'),
    ('application-sur-mesure.md', 'en/custom-web-app.md',   'services/application-sur-mesure', 'Application & MVP sur-mesure', '/application-sur-mesure', '/en/custom-web-app'),
    ('agent-ia-pme.md',          'en/ai-agent-for-smes.md', 'services/agent-ia-pme',          'Agent IA pour PME',           '/agent-ia-pme',          '/en/ai-agent-for-smes'),
    ('freelance-ia.md',          'en/ai-freelance.md',      'services/freelance-ia',          'Freelance IA (hub services)', '/freelance-ia',          '/en/ai-freelance'),
    ('projets.md',               'en/projects.md',          'projets',                        'Projets (portfolio)',         '/projets',               '/en/projects'),
    ('maturite-ia.md',           'en/ai-maturity.md',       'outils/test-maturite-ia',        'Test de maturite IA',         '/maturite-ia',           '/en/ai-maturity'),
    ('visible-par-les-ia.md',    'en/ai-visibility.md',     'outils/visible-par-les-ia',      'Visible par les IA (scanner GEO)', '/visible-par-les-ia', '/en/ai-visibility'),
    ('collaboration.md',         'en/collaboration.md',     'collaboration',                  'Collaboration (packages & methode)', '/collaboration',   '/en/collaboration'),
]
for fr_md, en_md, folder, title, fr_url, en_url in PAGES:
    copy_md(fr_md, folder + '/fr.md', title + ' (FR)', 'https://mathieuhaye.fr' + fr_url)
    if en_md and os.path.isfile(os.path.join(ROOT, en_md)):
        copy_md(en_md, folder + '/en.md', title + ' (EN)', 'https://mathieuhaye.fr' + en_url)

# --- pages without twins: extract from HTML
put('confidentialite/fr.md',
    header('Politique de confidentialite (FR)', 'https://mathieuhaye.fr/confidentialite', 'Extrait du HTML (pas de jumeau .md).')
    + html_to_md(os.path.join(ROOT, 'confidentialite.html'), 'fr'))
put('moet-hennessy/fr.md',
    header('Moet Hennessy (page dediee, FR)', 'https://mathieuhaye.fr/moet-hennessy', 'Extrait du HTML (pas de jumeau .md).')
    + html_to_md(os.path.join(ROOT, 'moet-hennessy.html'), 'fr'))
if os.path.isfile(os.path.join(ROOT, 'en/moet-hennessy.html')):
    put('moet-hennessy/en.md',
        header('Moet Hennessy (EN)', 'https://mathieuhaye.fr/en/moet-hennessy', 'Extrait du HTML (pas de jumeau .md).')
        + html_to_md(os.path.join(ROOT, 'en/moet-hennessy.html'), 'en'))

# --- home: bilingual extraction via the i18n map
for lang in ('fr', 'en'):
    put('accueil/%s.md' % lang,
        header('Accueil (%s)' % lang.upper(), 'https://mathieuhaye.fr/',
               'Reconstruit depuis index.html + la carte i18n de script.js (textes %s).' % lang.upper())
        + html_to_md(os.path.join(ROOT, 'index.html'), lang))

# --- home project modals: p.* i18n keys
pk = sorted(k for k in I18N if k.startswith('p.'))
groups = {}
for k in pk:
    parts = k.split('.')
    groups.setdefault(parts[1], []).append(k)
lines = [header('Modales projets de la home (contenu injecte par script.js)', 'https://mathieuhaye.fr/ (clic sur une carte projet)',
                'Textes stockes dans la carte i18n de script.js (cles p.*).')]
for g, keys in groups.items():
    lines.append('## Projet : %s\n' % g)
    for k in keys:
        lines.append('**%s**' % k)
        lines.append('- FR : %s' % I18N[k]['fr'])
        lines.append('- EN : %s' % I18N[k]['en'])
        lines.append('')
put('accueil/modales-projets.md', '\n'.join(lines))

# --- blog: copy every article twin
os.makedirs(os.path.join(OUT, 'blog', 'fr'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'blog', 'en'), exist_ok=True)
nfr = nen = 0
for fn in sorted(os.listdir(os.path.join(ROOT, 'blog'))):
    if fn.endswith('.md'):
        shutil.copy2(os.path.join(ROOT, 'blog', fn), os.path.join(OUT, 'blog', 'fr', fn)); nfr += 1
for fn in sorted(os.listdir(os.path.join(ROOT, 'blog', 'en'))):
    if fn.endswith('.md'):
        shutil.copy2(os.path.join(ROOT, 'blog', 'en', fn), os.path.join(OUT, 'blog', 'en', fn)); nen += 1
shutil.copy2(os.path.join(ROOT, 'blog.md'), os.path.join(OUT, 'blog', 'index-du-blog.md'))

print('OK -', OUT)
print('blog: %d FR + %d EN articles' % (nfr, nen))
