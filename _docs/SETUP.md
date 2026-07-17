# Mathieu Haye. Portfolio

One-page static site. HTML, CSS, JS. No build step, no dependencies.
Ships on IONOS Web Plus shared hosting.

---

## Structure

```
Portefolio/
├── index.html          ← page structure + sections
├── style.css           ← Design system v4 « Papier & Vin », animations, responsive
├── script.js           ← reveal-on-scroll, modals, filters, parallax
├── assets/
│   ├── img/
│   │   └── mathieu.webp ← your photo (already copied)
│   └── projects/       ← project screenshots (drop them here)
└── SETUP.md            ← this file
```

---

## Project screenshots

Drop a PNG or JPG into `assets/projects/` with the exact key as filename. Missing files are hidden gracefully.

| Project | File |
|---|---|
| Crypto Trading Bot (MEXC) | `assets/projects/mexc.png` |
| Bloomberg-Style Dashboard | `assets/projects/bloomberg.png` |
| IchimokuSignal Pro | `assets/projects/ichimoku.png` |
| Real Estate Investment Model | `assets/projects/realestate.png` |
| IA Brew Newsletter | `assets/projects/iabrew.png` |
| Multi-source Job Scorer | `assets/projects/jobs.png` |
| e-Enfance / 3018 Platform | `assets/projects/salesforce.png` |

For **multiple screenshots** per project (carousel), add numbered variants:
```
bloomberg.png      ← first image (base)
bloomberg1.png     ← second image
bloomberg2.png     ← third image
bloomberg3.png     ← etc.
```

WebP is preferred over PNG (smaller, same quality). The carousel probes `.webp` first, then `.png`.
Stop numbering when you run out of images; the carousel auto-detects how many exist.

Recommended: WebP or PNG, max 1600 px wide, around 200-400 KB per image.

---

## Palette (v4 « Papier & Vin », refonte 2026-07-09)

| Role | Hex |
|---|---|
| Papier (canvas) | `#F6F0E4` |
| Carte | `#FFFCF5` |
| Encre (titres) | `#26141A` |
| Vin (brand) | `#6E1528` / `#8E1D33` |
| Vin profond (sections sombres) | `#2E0A15` |
| Vin noir (footer/menu) | `#1C050C` |
| Orange brûlé (accent signature, dither) | `#EC4E02` |
| Orange CTA (boutons) | `#C2410C` |
| Or (accent secondaire) | `#E8A33D` |

Dans `style.css`, les variables historiques `--albert-*` restent définies comme alias
vers ces valeurs (compat avec les modules legacy : quiz, scanner, blog, projets).

Fonts (inchangées) : `Instrument Serif` (display dominant, échelle géante),
`Space Grotesk` (UI/boutons), `Inter` (corps), `JetBrains Mono` (labels).

---

## Local preview

**Option 1. Python (already installed)**
```bash
cd C:/Users/Haye/Documents/Portefolio
python -m http.server 8080
```
Open http://localhost:8080

**Option 2. Double-click `index.html`** (some browsers block local asset loading due to CORS).

---

## Deploy to IONOS Web Plus

### Via the IONOS panel (easiest)

1. Sign in at [ionos.fr](https://www.ionos.fr) → **Hosting** → **File Browser** (or SSH / FTP).
2. Open your domain folder (usually `htdocs/` or `public_html/`).
3. Drag and drop the 3 files + the `assets/` folder:
   - `index.html`
   - `style.css`
   - `script.js`
   - `assets/` (whole folder)
4. Done. Open `https://your-domain.fr`.

### Via FTP (FileZilla)

1. Install [FileZilla](https://filezilla-project.org/).
2. Get your FTP credentials from the IONOS panel (FTP / SSH access section).
3. Connect:
   - Host: `home.XXX.1and1.com` (or whatever IONOS gave you)
   - User: your FTP login
   - Password: your FTP password
   - Port: 21
4. Navigate to `htdocs/` (or your domain root).
5. Upload the **contents** of the `Portefolio/` folder (not the folder itself).

### Post-deploy checks

- [ ] `https://your-domain.fr` loads
- [ ] `https://your-domain.fr/assets/img/mathieu.webp` serves your photo
- [ ] HTTPS is on (IONOS offers free Let's Encrypt in the panel)
- [ ] Mobile view works

---

## Editing content

### Change text
Everything is in `index.html`. Look for the section comments (`<!-- ============ HERO ============ -->`, etc.).

### Change a project
In `script.js`, the `projectsData` object holds one entry per project with:
`title`, `eyebrow`, `tech[]`, `meta[]`, `sections[]` (heading + body or list).

### Add a project
1. Duplicate a `<article class="project-card">` in `index.html`.
2. Change `data-project="KEY"` to a new unique key.
3. Change `data-category="finance ia web"` (filter buckets).
4. Add a `KEY: { ... }` entry in `projectsData` in `script.js`.

### Replace the photo
Overwrite `assets/img/mathieu.webp` with your file (same name, transparent PNG).

---

## SEO & sharing

The site already has:
- `<title>`, `<meta description>`, `<meta author>`
- Open Graph (`og:title`, `og:description`, `og:type`)
- Inline SVG favicon
- Semantic tags (`<section>`, `<nav>`, `<article>`)

To go further:
- Add `og:image` (1200x630) for richer previews on LinkedIn / Twitter
- Submit a `sitemap.xml` to Google Search Console after deploy

---

## Contact links

The site points to:
- `mailto:contact@mathieuhaye.fr`
- `tel:+33661513289`
- `https://www.linkedin.com/in/mathieu-haye/`

Double-check the exact LinkedIn slug in `index.html` if needed.

---

## Stack

- Zero dependencies. Vanilla HTML / CSS / JS
- Fonts via Google Fonts with `preconnect`
- Works on Chrome, Firefox, Safari, Edge, mobile
- Respects `prefers-reduced-motion`
- WCAG contrast AA+ on body copy

Good luck with the MSc application.
