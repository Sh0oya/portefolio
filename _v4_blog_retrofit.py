# -*- coding: utf-8 -*-
"""
_v4_blog_retrofit.py — Refonte v4 « Papier & Vin » : retrofit des articles du blog.

Pour chaque article blog/*.html (FR) et blog/en/*.html (EN), hors index.html et _template.html :
  a) bump style.css -> ?v=80, ui.js -> ?v=80, gsap-enhance -> ?v=3 si présents ;
     <meta name="theme-color"> -> #F6F0E4 (insérée après le viewport si absente) ;
     <meta name="color-scheme"> -> light si présente.
  b) insère le bloc CTA conversion (marqueur : class="article-conversion") juste après le
     </footer> de .article-footer (fallback : avant </main>). Bonus : 3e lien ghost
     « Service lié » si la catégorie de l'article est identifiable.
  c) insère le footer v4 (_v4_footer_fr.html / _v4_footer_en.html selon le dossier)
     avant </body> (avant le <script defer src="/ui.js"> de fin) si aucun
     <footer class="footer"> n'existe.
  d) log un résumé : traités / déjà à jour / erreurs.

Idempotent : relançable sans dupliquer quoi que ce soit.
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BLOG_FR = ROOT / "blog"
BLOG_EN = ROOT / "blog" / "en"
FOOTER_FR = (ROOT / "_v4_footer_fr.html").read_text(encoding="utf-8")
FOOTER_EN = (ROOT / "_v4_footer_en.html").read_text(encoding="utf-8")

CTA_FR = """\
        <!-- Bloc conversion (v4) -->
        <section class="final-cta article-conversion">
            <div class="section-container">
                <div class="final-cta-card">
                    <h2 class="final-cta-title">Un projet CRM, IA ou automatisation&nbsp;?</h2>
                    <p class="final-cta-lead">Je con&ccedil;ois et livre ce genre de syst&egrave;mes pour des PME et scale-ups &mdash; du cadrage &agrave; la production. Appel de cadrage 30&nbsp;min, gratuit.</p>
                    <div class="final-cta-actions">
                        <a class="btn btn-primary" href="https://calendar.app.google/HJ3UcYc4FxdB2A9H8" target="_blank" rel="noopener">R&eacute;server un appel</a>
                        <a class="btn btn-ghost" href="/collaboration">Voir les offres</a>{SERVICE_LINK}
                    </div>
                </div>
            </div>
        </section>
"""

CTA_EN = """\
        <!-- Conversion block (v4) -->
        <section class="final-cta article-conversion">
            <div class="section-container">
                <div class="final-cta-card">
                    <h2 class="final-cta-title">A CRM, AI or automation project?</h2>
                    <p class="final-cta-lead">I design and ship these systems for SMEs and scale-ups &mdash; from scoping to production. Free 30-min scoping call.</p>
                    <div class="final-cta-actions">
                        <a class="btn btn-primary" href="https://calendar.app.google/HJ3UcYc4FxdB2A9H8" target="_blank" rel="noopener">Book a call</a>
                        <a class="btn btn-ghost" href="/en/collaboration">See the offers</a>{SERVICE_LINK}
                    </div>
                </div>
            </div>
        </section>
"""

SERVICE_LINK_TPL = {
    "fr": '\n                        <a class="btn btn-ghost" href="{href}">Service li&eacute; &rarr;</a>',
    "en": '\n                        <a class="btn btn-ghost" href="{href}">Related service &rarr;</a>',
}


def service_href(category_html, lang):
    """Mappe la catégorie visible de l'article vers la page service correspondante."""
    cat = html.unescape(category_html or "").lower()
    if "visibilit" in cat or "geo" in cat or "visibility" in cat:
        return "/visible-par-les-ia" if lang == "fr" else "/en/ai-visibility"
    if "crm" in cat:
        return "/crm-sur-mesure" if lang == "fr" else "/en/custom-crm"
    if "automatisation" in cat or "automation" in cat:
        return "/automatisation-n8n" if lang == "fr" else "/en/n8n-automation"
    if re.search(r"\b(ia|ai)\b", cat) or "agent" in cat:
        return "/developpeur-agent-ia" if lang == "fr" else "/en/ai-agent-developer"
    return None


def process(path, lang):
    with open(path, "r", encoding="utf-8", newline="") as fh:
        src = fh.read()
    crlf = "\r\n" in src
    txt = src
    changes = []

    # ---- a) bumps de versions ----
    txt2 = re.sub(r"style\.css\?v=\d+", "style.css?v=80", txt)
    if txt2 != txt:
        changes.append("style.css v80")
    txt = txt2
    txt2 = re.sub(r"ui\.js\?v=\d+", "ui.js?v=80", txt)
    if txt2 != txt:
        changes.append("ui.js v80")
    txt = txt2
    txt2 = re.sub(r"gsap-enhance\.js\?v=\d+", "gsap-enhance.js?v=3", txt)
    if txt2 != txt:
        changes.append("gsap v3")
    txt = txt2

    # theme-color -> #F6F0E4 (insertion après le viewport si absente)
    if 'name="theme-color"' in txt:
        txt2 = re.sub(
            r'(<meta name="theme-color" content=")[^"]*(")',
            r"\g<1>#F6F0E4\g<2>",
            txt,
        )
        if txt2 != txt:
            changes.append("theme-color maj")
        txt = txt2
    else:
        m = re.search(r'[ \t]*<meta name="viewport"[^>]*>', txt)
        if m:
            indent = re.match(r"[ \t]*", m.group(0)).group(0)
            txt = (
                txt[: m.end()]
                + "\n"
                + indent
                + '<meta name="theme-color" content="#F6F0E4">'
                + txt[m.end() :]
            )
            changes.append("theme-color ajoutee")

    # color-scheme -> light si présente
    txt2 = re.sub(
        r'(<meta name="color-scheme" content=")[^"]*(")', r"\g<1>light\g<2>", txt
    )
    if txt2 != txt:
        changes.append("color-scheme light")
    txt = txt2

    # ---- b) bloc CTA conversion ----
    if 'class="final-cta article-conversion"' not in txt and "article-conversion" not in txt:
        mcat = re.search(r'class="article-category">([^<]*)<', txt)
        href = service_href(mcat.group(1) if mcat else "", lang)
        link_tpl = SERVICE_LINK_TPL[lang]
        service_link = link_tpl.format(href=href) if href else ""
        cta = (CTA_FR if lang == "fr" else CTA_EN).format(SERVICE_LINK=service_link)

        inserted = False
        i = txt.find('<footer class="article-footer"')
        if i != -1:
            j = txt.find("</footer>", i)
            if j != -1:
                j_end = j + len("</footer>")
                txt = txt[:j_end] + "\n\n" + cta.rstrip("\n") + txt[j_end:]
                inserted = True
        if not inserted:
            k = txt.find("</main>")
            if k != -1:
                txt = txt[:k] + cta + "\n    " + txt[k:]
                inserted = True
        if inserted:
            changes.append("CTA insere" + (" (+service)" if service_link else ""))
        else:
            return ("error", "ni .article-footer ni </main> trouve pour le CTA", None)

    # ---- c) footer v4 ----
    if '<footer class="footer"' not in txt:
        footer = (FOOTER_FR if lang == "fr" else FOOTER_EN).rstrip("\n")
        m = re.search(r'[ \t]*<script[^>]*src="/ui\.js[^"]*"[^>]*>\s*</script>', txt)
        if m:
            txt = txt[: m.start()] + "\n" + footer + "\n" + txt[m.start() :]
            changes.append("footer v4")
        else:
            k = txt.find("</body>")
            if k == -1:
                return ("error", "pas de </body> pour inserer le footer", None)
            txt = txt[:k] + footer + "\n" + txt[k:]
            changes.append("footer v4 (avant </body>)")

    if not changes:
        return ("uptodate", "", None)

    if crlf and "\r\n" not in FOOTER_FR:
        # Les blocs insérés utilisent \n ; on normalise tout le fichier sur ses fins
        # de ligne d'origine (CRLF) pour rester cohérent.
        txt = txt.replace("\r\n", "\n").replace("\n", "\r\n")

    with open(path, "w", encoding="utf-8", newline="") as fh:
        fh.write(txt)
    return ("done", ", ".join(changes), None)


def main():
    results = {"done": [], "uptodate": [], "error": []}
    jobs = []
    for f in sorted(BLOG_FR.glob("*.html")):
        if f.name in ("index.html", "_template.html"):
            continue
        jobs.append((f, "fr"))
    for f in sorted(BLOG_EN.glob("*.html")):
        if f.name == "index.html":
            continue
        jobs.append((f, "en"))

    for f, lang in jobs:
        try:
            status, detail, _ = process(f, lang)
        except Exception as e:  # noqa: BLE001
            status, detail = "error", repr(e)
        results[status].append((f, lang, detail))
        rel = f.relative_to(ROOT)
        print(f"[{status.upper():8}] {rel} {('- ' + detail) if detail else ''}")

    n_fr = sum(1 for f, l, _ in results["done"] if l == "fr")
    n_en = sum(1 for f, l, _ in results["done"] if l == "en")
    print("\n===== RESUME =====")
    print(f"Traites      : {len(results['done'])} (FR {n_fr} / EN {n_en})")
    print(f"Deja a jour  : {len(results['uptodate'])}")
    print(f"Erreurs      : {len(results['error'])}")
    for f, lang, d in results["error"]:
        print(f"  !! {f.relative_to(ROOT)} [{lang}] : {d}")
    return 1 if results["error"] else 0


if __name__ == "__main__":
    sys.exit(main())
