# -*- coding: utf-8 -*-
"""Exporte TOUT le contenu texte du site en un seul fichier Markdown,
page par page : _docs/CONTENU-SITE.md.
Relançable à volonté : python _build_contenu_md.py
Extraction : titre + meta description + texte visible (h1-h4 -> titres MD,
p/li/td -> lignes). Ignorés : script/style/svg/form/nav/template, les éléments
hidden ou aria-hidden="true", les headers/footers de page (chrome répété)."""
import io, os, re, datetime
from html.parser import HTMLParser
from html import unescape

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, '_docs', 'CONTENU-SITE.md')

SKIP_TAGS = {'script', 'style', 'svg', 'noscript', 'template', 'form', 'nav', 'canvas', 'iframe'}
CHROME_CLASSES = ('v51-header', 'footer-min', 'menu-overlay', 'nav ', 'footer ', 'lang-switch',
                  'scroll-progress', 'sticky-cta', 'newsletter-wrap', 'modal')
HEADINGS = {'h1': '#', 'h2': '##', 'h3': '###', 'h4': '####'}
VOID_TAGS = {'br', 'img', 'hr', 'input', 'meta', 'link', 'source', 'wbr',
             'area', 'base', 'col', 'embed', 'track', 'param'}
BLOCK_TAGS = {'p', 'li', 'td', 'th', 'blockquote', 'figcaption', 'dt', 'dd', 'pre', 'div', 'span', 'a', 'section', 'article'}


class TextExtract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.title = ''
        self.desc = ''
        self.in_title = False
        self.heading = None
        self.buf = []
        self.lines = []

    def _class_of(self, attrs):
        for k, v in attrs:
            if k == 'class':
                return (v or '') + ' '
        return ''

    def _is_hidden(self, attrs):
        for k, v in attrs:
            if k == 'hidden':
                return True
            if k == 'aria-hidden' and v == 'true':
                return True
            if k == 'class':
                cls = (v or '') + ' '
                for c in CHROME_CLASSES:
                    if cls.startswith(c) or (' ' + c) in (' ' + cls):
                        return True
        return False

    def handle_starttag(self, tag, attrs):
        if self.skip_depth:
            # les balises void n'ont pas de fermant : ne pas creuser le compteur
            if tag not in VOID_TAGS:
                self.skip_depth += 1
            return
        if tag in VOID_TAGS and tag not in ('meta', 'br'):
            return
        if tag == 'meta':
            d = dict(attrs)
            if d.get('name') == 'description':
                self.desc = d.get('content', '')
            return
        if tag in SKIP_TAGS or self._is_hidden(attrs):
            self.skip_depth = 1
            return
        if tag == 'title':
            self.in_title = True
            return
        if tag in HEADINGS:
            self._flush()
            self.heading = HEADINGS[tag]
        elif tag in ('p', 'li', 'blockquote', 'figcaption', 'dt', 'dd', 'tr', 'br'):
            self._flush()

    def handle_endtag(self, tag):
        if self.skip_depth:
            self.skip_depth -= 1
            return
        if tag == 'title':
            self.in_title = False
            return
        if tag in HEADINGS:
            self._flush()
            self.heading = None
        elif tag in ('p', 'li', 'blockquote', 'div', 'section', 'article', 'tr', 'ul', 'ol', 'table'):
            self._flush()

    def handle_data(self, data):
        if self.skip_depth:
            return
        if self.in_title:
            self.title += data
            return
        self.buf.append(data)

    def _flush(self):
        txt = re.sub(r'\s+', ' ', ''.join(self.buf)).strip()
        self.buf = []
        if not txt:
            return
        if self.heading:
            self.lines.append('')
            self.lines.append(self.heading + ' ' + txt)
            self.lines.append('')
        else:
            self.lines.append(txt)

    def result(self):
        self._flush()
        out, prev_blank = [], False
        for ln in self.lines:
            blank = (ln == '')
            if blank and prev_blank:
                continue
            out.append(ln)
            prev_blank = blank
        return '\n'.join(out).strip()


def clean_url(rel):
    rel = rel.replace('\\', '/')
    if rel == 'index.html':
        return '/'
    if rel.endswith('/index.html'):
        return '/' + rel[:-len('index.html')]
    if rel.endswith('.html'):
        return '/' + rel[:-5]
    return '/' + rel


def collect():
    groups = [('Pages françaises', []), ('Pages anglaises', []),
              ('Blog (FR)', []), ('Blog (EN)', [])]
    for base, _, files in os.walk(ROOT):
        rel_base = os.path.relpath(base, ROOT).replace('\\', '/')
        if rel_base.startswith(('_deploy', '.claude', 'assets', 'api', '.well-known', '_docs')):
            continue
        for f in sorted(files):
            if not f.endswith('.html') or f.startswith('_'):
                continue
            rel = (rel_base + '/' + f) if rel_base != '.' else f
            if rel_base == '.':
                groups[0][1].append(rel)
            elif rel_base == 'en':
                groups[1][1].append(rel)
            elif rel_base == 'blog':
                groups[2][1].append(rel)
            elif rel_base == 'blog/en':
                groups[3][1].append(rel)
    # home d'abord, blog du plus récent au plus ancien
    for idx in (0, 1):
        groups[idx][1].sort(key=lambda r: (not r.endswith('index.html'), r))
    for idx in (2, 3):
        groups[idx][1].sort(key=lambda r: os.path.basename(r), reverse=True)
        groups[idx][1].sort(key=lambda r: not r.endswith('index.html'))
    return groups


def main():
    os.makedirs(os.path.join(ROOT, '_docs'), exist_ok=True)
    today = datetime.date.today().isoformat()
    parts = [
        '# Contenu du site mathieuhaye.fr — export texte brut',
        '',
        'Généré le %s par `_build_contenu_md.py` (relançable). Une section par page,' % today,
        'dans l\'ordre : pages FR, pages EN, blog FR (récent → ancien), blog EN.',
        'Le chrome répété (navigation, footers, formulaires) est exclu.',
        '',
    ]
    total = 0
    for label, rels in collect():
        if not rels:
            continue
        parts.append('')
        parts.append('# ' + '=' * 70)
        parts.append('# ' + label.upper())
        parts.append('# ' + '=' * 70)
        for rel in rels:
            raw = io.open(os.path.join(ROOT, rel), encoding='utf-8', newline='').read()
            px = TextExtract()
            px.feed(raw)
            title = re.sub(r'\s+', ' ', unescape(px.title)).strip()
            parts.append('')
            parts.append('---')
            parts.append('')
            parts.append('## %s' % clean_url(rel))
            parts.append('')
            parts.append('**Titre :** %s' % (title or '(sans titre)'))
            if px.desc:
                parts.append('**Description :** %s' % re.sub(r'\s+', ' ', unescape(px.desc)).strip())
            parts.append('')
            parts.append(px.result())
            total += 1
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write('\n'.join(parts) + '\n')
    print('%s : %d pages exportées, %d Ko' % (OUT, total, os.path.getsize(OUT) // 1024))


if __name__ == '__main__':
    main()
