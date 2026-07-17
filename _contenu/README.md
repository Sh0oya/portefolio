# _contenu/ — Tout le contenu du site en dur

> Généré le 9 juillet 2026 par `_export_contenu.py` (relancer le script pour régénérer).
> Ce dossier n'est **jamais uploadé** (exclu de `_build_deploy.py`).

## Structure — un dossier par page, `fr.md` + `en.md`

```
_contenu/
├── 00-OBJECTIF-DU-SITE.md          ← l'objectif global, le positionnement, le funnel
├── 01-ROUTINE-ARTICLES-CLAUDE.md   ← la routine Claude qui rédige les articles
├── accueil/                        ← home (reconstruite depuis index.html + i18n de script.js)
│   ├── fr.md · en.md
│   └── modales-projets.md          ← textes des modales projets (clés p.* de script.js)
├── services/
│   ├── crm-sur-mesure/             ← fr.md + en.md (idem pour chaque service)
│   ├── developpeur-agent-ia/
│   ├── automatisation-n8n/
│   ├── application-sur-mesure/
│   ├── agent-ia-pme/
│   └── freelance-ia/               ← hub services
├── outils/
│   ├── visible-par-les-ia/         ← scanner GEO (lead magnet)
│   └── test-maturite-ia/           ← quiz maturité IA (lead magnet)
├── projets/                        ← portfolio
├── collaboration/                  ← packages & méthode
├── confidentialite/                ← FR uniquement (pas de version EN)
├── moet-hennessy/
└── blog/
    ├── index-du-blog.md            ← index machine-lisible (copie de blog.md)
    ├── fr/  (52 articles .md)
    └── en/  (52 articles .md)
```

## D'où vient le contenu

- **Pages avec jumeau Markdown** (services, projets, outils, collaboration, blog) : copie directe des `.md` GEO du repo — c'est la version la plus fidèle et déjà relue.
- **Accueil** : reconstruit depuis `index.html` en injectant les textes FR/EN de la carte i18n de `script.js` (la home est une seule page bilingue pilotée par JS).
- **Confidentialité / Moët Hennessy** : extraits du HTML (pas de jumeau .md).

## À savoir pour éditer

- Ces fichiers sont une **photographie** : modifier un fichier ici ne modifie pas le site. Le contenu vivant est dans les `.html` (+ `script.js` pour la home) et les jumeaux `.md` à la racine.
- Si tu veux qu'une modification parte en ligne : édite la page source (ou demande à Claude), puis `python _build_deploy.py` et upload.
- Pour resynchroniser ce dossier après des changements de contenu : `python _export_contenu.py`.
