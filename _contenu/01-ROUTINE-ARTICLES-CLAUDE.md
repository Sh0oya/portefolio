# La routine Claude qui rédige les articles du Journal

> Résumé opérationnel. Le prompt complet et à jour vit dans `_docs/articles-prompt.md` (v2, jamais uploadé). À coller dans une conversation Claude Code depuis la racine du repo, à chaque run.

## Ce que c'est

Une routine éditoriale exécutée par Claude Code qui produit, à chaque run, **un article bilingue complet (FR + EN)** pour le Journal, publié sur `/blog/` et `/blog/en/`, avec toute la chaîne technique régénérée automatiquement. C'est elle qui a produit les ~52 articles par langue du blog. Cadence cible : un article tous les deux jours (dans les faits, souvent quotidien).

## L'objectif éditorial (stratégie v2)

Le blog n'est pas un blog de veille : **chaque article doit amener des clients vers les pages services et le booking**. Règle d'or : « vendre, pas enseigner » — l'article explique le problème, les enjeux et les critères de décision, jamais la recette pas-à-pas (pas de tutoriel, pas de code) : le « comment » est ce que Mathieu vend.

Deux formats en alternance :
- **Type A — Actu commentée** : une actu des dernières 48 h (IA appliquée, Data, CRM/Sales tech, automatisation) sourcée (Bloomberg, FT, Reuters, Les Échos, TechCrunch…), avec la lecture d'un praticien. Section obligatoire « Ce que ça change pour vous » qui traduit l'actu en décision concrète pour une PME et pointe vers LA page service concernée.
- **Type B — Question client** (evergreen, intention d'achat) : réponse honnête à une vraie question d'acheteur (« Combien coûte un CRM sur mesure ? », « n8n, Make ou Zapier ? », « Agent IA ou chatbot ? »…). TL;DR = la réponse dès la première phrase, puis critères, pièges, ordres de grandeur. Banque de questions dans le prompt.

## Les étapes d'un run

1. **Choix du sujet** — WebSearch actu 48 h (Type A) ou question de la banque (Type B).
2. **Anti-doublon** — vérification contre tous les titres existants de `blog/`.
3. **Recherche** — lecture de 2-3 sources (WebFetch), chiffres exacts, dates, citations réelles.
4. **Rédaction FR puis EN** — 1 200-1 800 mots par langue. Structure imposée : TL;DR citable, hook, le fait/le problème (sourcé), l'analyse (H2 en vraies questions), « Ce que ça change pour vous » (lien service), points clés, FAQ (avec JSON-LD FAQPage). Exigences GEO : passages auto-portants, une affirmation citable par section (sujet + verbe + chiffre + date + source), entités nommées, acronymes définis.
5. **Fichiers HTML** — à partir de `blog/_template.html` et `blog/en/_template.html`, mêmes slugs `YYYY-MM-DD-slug`, tous les {{placeholders}} remplis (title, meta, catégorie, temps de lecture, JSON-LD…), URLs propres sans .html.
6. **Index des blogs** — insertion de la carte article en tête de `blog/index.html` et `blog/en/index.html`.
7. **Sitemap** — ajout des deux URLs avec hreflang croisés.
8. **Régénération automatique** (script Python inclus dans le prompt) : `feed.xml` (RSS), `feed.json`, `blog.md` (index machine-lisible pour les IA) et **le jumeau `.md` de chaque article** (les fichiers copiés dans ce dossier `blog/`).
9. **Cartes « Articles récents » de la home** (étape 9b) : patch des clés `la1-la3` dans `script.js` + des 3 cartes dans `index.html` (fallback FR — la home est FR par défaut depuis P5) + recopie du bloc verbatim dans `en/index.html` (miroir EN statique). Ce bloc nourrit la card stack animée de la section Journal.
   ⚠️ Bug connu : le script rate la mise à jour de `la*.title`/`la*.lead` quand l'ancienne valeur contient une apostrophe — corriger `script.js` à la main après chaque run.
10. **Sync `_deploy/`** (`python _build_deploy.py`) puis **rapport final** : liste exacte des ~12 fichiers à ré-uploader sur IONOS.

## Garde-fous

- **Anti-hallucination** : aucun chiffre sans source lue, aucune citation fabriquée, aucun lien inventé. Seuls prix autorisés : Sprint dès 400 €, MVP 4-6 semaines sur devis.
- **Style** : zéro em-dash, zéro vocabulaire corporate IA, formats de nombres/dates FR et EN distincts, EN = traduction éditoriale, jamais de mention étudiant/diplôme/école.
- **Sécurité** : ne jamais lire/copier les secrets (`api/config.php`, `api/google-sa.json`), ne toucher que le bloc « Latest posts » dans `index.html`/`en/index.html`/`script.js`, `_docs/` jamais uploadé, pas de Git, l'upload reste manuel (Mathieu).

## Comment lancer un run

Ouvrir Claude Code à la racine du repo, coller le contenu de `_docs/articles-prompt.md`, préciser éventuellement le type du jour (A ou B) ou un sujet imposé. La routine fait le reste et rend son rapport avec la liste d'upload.
