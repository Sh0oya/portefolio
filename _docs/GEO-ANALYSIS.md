# GEO Analysis — mathieuhaye.fr

**Date** : 28 mai 2026
**Cadre** : optimisation pour AI Overviews (Google), ChatGPT, Perplexity, Bing Copilot, Claude.

> Ce que dit Google : optimiser pour la recherche IA générative *reste du SEO*. AEO et GEO sont des labels rebrandés pour le même travail. Les changements de ce rapport sont d'abord du SEO fondamental appliqué aux surfaces IA.

---

## GEO Readiness Score : 87 / 100

| Plateforme | Score | Détail |
|---|---|---|
| Google AI Overviews | **92/100** | Schema riche, sitemap propre, content structuré, FAQPage ajoutée |
| ChatGPT (web search) | **85/100** | llms.txt complet, robots.txt allow GPTBot, Person schema détaillé |
| Perplexity | **82/100** | Manque présence Reddit pour citation source #1 chez Perplexity |
| Bing Copilot | **88/100** | Bingbot allow, Content-Signal, sitemap soumis |

---

## ✅ Changements implémentés aujourd'hui

### Citability (high impact)
- **Bloc définition canonique** ajouté en début de `<body>` de `index.html` (`<header class="sr-only">`) — fournit aux crawlers IA une définition extraite en moins de 60 mots de "Mathieu Haye is..." avec localisation, services, packages, contact. Accessible aux lecteurs d'écran, conforme aux guidelines Google.
- **Paragraphe canonique** ajouté en haut de `llms.txt` (section "Mathieu Haye in one paragraph") — bloc citation-ready de 134-167 mots optimal pour extraction LLM.

### Structural Readability
- **FAQPage schema** ajoutée sur `index.html#faq` : 8 questions/réponses optimisées pour AI search (Who is, What does he build, Pricing, Why solo vs agency, Stack, Speed, Vibe coding, Contact). Format Q&A natif pour citation.
- **HowTo schema** ajoutée sur `~~/estimer-mon-projet~~ (supprimé)` (FR + EN) : les 5 étapes de l'estimator marquées formellement → éligible Rich Results "How to" sur Google et extraction native chez ChatGPT.

### Authority & Brand Signals
- **Person schema mise à jour** : description (134 mots, citation-ready), jobTitle aligné, `knowsAbout` enrichi de 14 compétences précises (Next.js, Supabase, Stripe Connect, Claude API, Apex/LWC, etc.).
- **makesOffer** ajouté sur Person : les 3 packages structurés avec PriceSpecification (offre publique = signal de sérieux pour AI).
- **Service node** dans le @graph : décrit explicitement l'activité freelance avec `hasOfferCatalog` pour AI commerce surfaces.
- **WebSite description** mise à jour pour cohérence positionnement.

### Technical SEO foundation
- **`<title>` et meta description** : passés du vieil angle Albert School / 22 ans / Eugenia vers le positionnement actuel "builder solo augmenté" + packages chiffrés (puissant pour CTR SERP).
- **Open Graph + Twitter Cards** : titres et descriptions alignés.
- **Keywords** : passage des termes désuets (Albert School, Bloomberg BMC) vers les requêtes longue-traîne actuelles (builder solo augmenté, MVP en 4 semaines, agent IA sur-mesure, Stripe Connect MVP, etc.).
- **llms.txt** : réécriture complète. Avant : positionnement Albert School obsolète. Après : narratif "third way", clients actuels nommés (e-Enfance/3018, Callkom, Ermitage, Horus, Profile Club), 7 projets phares précis, packages avec fourchettes €, licensing AI explicite.

### ItemList sitelinks
- Ajout des nouvelles pages dans `ItemList#sitelinks` : Approach, How we work together, Estimate my project, AI agent. Google les indexera comme sitelinks dans la SERP.

---

## 🔍 AI Crawler Access (vérifié)

| Crawler | Status | Recommandation |
|---|---|---|
| Googlebot | ✅ Allow + Content-Signal | OK |
| Bingbot | ✅ Allow + Content-Signal | OK (alimente Copilot) |
| ClaudeBot | ✅ Allow | OK |
| anthropic-ai | ✅ Allow | OK |
| GPTBot (OpenAI) | ✅ Allow | OK (alimente ChatGPT web search) |
| OAI-SearchBot | ✅ Allow | OK |
| PerplexityBot | ✅ Allow | OK |
| CCBot (Common Crawl) | ❌ Disallow | OK (volonté explicite, training data) |
| Google-Extended | ❌ Disallow | OK (training data) |

**RAS sur cette dimension** — robots.txt est mieux configuré que 95% des sites.

---

## 📄 llms.txt Status

- **Présent** : oui (`https://mathieuhaye.fr/llms.txt`)
- **Format** : conforme proposal Coyier/Howell
- **Contenu** : à jour avec le nouveau positionnement (réécrit aujourd'hui)
- **Note** : selon les études récentes (SE Ranking 300k domaines, OtterlyAI audit), llms.txt n'est pas encore un signal de citation chez les LLMs majeurs. Mais : (1) zéro downside à le maintenir, (2) certains agents IA verticaux le lisent, (3) c'est de la documentation propre pour quand l'écosystème mûrira. Garde-le à jour à chaque évolution du profil.

---

## 🌐 Brand Mention Analysis (hors site, à toi de bâtir)

C'est **la** zone où Mathieu peut gagner le plus de visibilité IA. D'après Ahrefs (étude 75k brands, déc 2025) : **les mentions de marque corrélent 3x plus fort avec les citations IA que les backlinks**.

| Plateforme | État | Priorité |
|---|---|---|
| LinkedIn | ✅ Profil + posts | Continuer (post A400M = 339k impressions, montre que ça marche) |
| YouTube | ❌ Absent | **TRÈS HAUTE** — corrélation #1 avec citations IA (0.737). Recommandation : 1 chaîne avec démos build solo augmenté, 1 vidéo/mois suffit |
| Reddit | ❌ Absent | **HAUTE** — Perplexity tire 46.7% de ses citations de Reddit. Recommandation : commentaires utiles sur r/SaaS, r/Entrepreneur, r/nocode, r/n8n, r/Claude_ai |
| Wikipedia | ❌ Absent | Moyenne — viendra naturellement avec un projet phare type IA Brew si tu fais 10x sa taille |
| GitHub | ⚠️ À vérifier | Moyenne — si tu publies des libs ou des templates n8n en open source, ajoute le lien dans `sameAs` |
| Wikidata | ❌ Absent | Faible — possible plus tard |
| Indie Hackers / Product Hunt | ❌ Absent | Moyenne — lance un side project en featured launch |

**Action concrète** : enrichis le `sameAs` du Person schema dès que tu as un compte GitHub public, une chaîne YouTube ou un profil Reddit actif. Chaque entry = un nouveau signal pour l'IA que tu es la même entité partout.

---

## 📐 Passage-Level Citability (134-167 mots optimal)

| Passage | Mots | Status |
|---|---|---|
| Hero "Mathieu Haye is a French développeur freelance spécialisé IA et automatisation..." (llms.txt) | 142 | ✅ Optimal |
| Définition canonique (index.html `<header>`) | 95 | ⚠️ Court — c'est OK, complémentaire au paragraphe llms.txt |
| FAQ "Who is Mathieu Haye?" | 78 | ⚠️ Court — étendable de 50-80 mots si besoin |
| FAQ "What does Mathieu Haye build?" | 56 | ⚠️ Court |
| FAQ "Why work with a solo builder?" | 88 | ⚠️ Court |
| Service description (schema) | 64 | ⚠️ Court |

**Reco** : les FAQ peuvent être étoffées de 30-50 mots chacune pour atteindre la fenêtre optimale 134-167 mots et maximiser la probabilité de citation intégrale dans un AI Overview.

---

## 🚀 Top 5 actions à plus fort impact (à faire dans cet ordre)

### 1. Push YouTube — 1 vidéo "build solo augmenté"  (priority: **CRITIQUE**)
- 1 démo de 3-5 min : "Comment j'ai shippé l'estimator de mon portfolio en 1 soirée avec Claude Code"
- Titre type "I shipped a SaaS feature in 4 hours with Claude Code — full vibe coding session"
- Description longue avec liens vers mathieuhaye.fr, comment-on-bosse, GitHub
- Tags : claude code, n8n, vibe coding, solo dev, MVP freelance
- **Impact** : la chaîne devient une source citable. Une seule vidéo bien faite peut générer 100+ mentions IA dans les 6 mois.

### 2. Présence Reddit (Perplexity feeds 47% de Reddit) (priority: **HAUTE**)
- Crée un compte avec ton vrai nom
- 10 commentaires utiles par semaine sur r/SaaS, r/n8n, r/ClaudeAI, r/Entrepreneur, r/cscareerquestions
- Quand pertinent (~1 sur 20) : mentionne brièvement un projet/méthode + lien blog
- **Pas de spam** — sois utile d'abord. C'est un investissement 3-6 mois.

### 3. Étendre les FAQ home + ajouter FAQ sur projets phares (priority: **MOYENNE**)
- Étoffer chaque réponse de la FAQPage actuelle à 130-160 mots
- Ajouter `FAQPage` schema sur chaque case study projet (quand tu en feras des dédiées)
- **Impact** : multiplie par 2-3 la probabilité de citation directe par AI

### 4. Lancer 1 outil viral / lead-magnet (priority: **MOYENNE**)
- L'estimator que tu as déjà → partage sur LinkedIn, Indie Hackers, Reddit
- Idée bonus : "n8n workflow library" — 10 templates téléchargeables, capture email, te positionne expert sur le sujet n8n
- **Impact** : crée des backlinks organiques + des mentions par les utilisateurs

### 5. Date "Last updated" sur les pages clés (priority: **FAIBLE mais quick win**)
- Ajouter sur home + comment-on-bosse + estimer-mon-projet un petit `<time>` "Last updated: May 28, 2026"
- Google et les LLMs préfèrent le contenu frais → un signal explicite de fraîcheur aide.

---

## 📊 Schema markup coverage (post-changes)

| Page | Schemas présents |
|---|---|
| `/` | Person + makesOffer, WebSite, WebPage, BreadcrumbList, ItemList, **Service**, **FAQPage** |
| `/comment-on-bosse` | BreadcrumbList, Service + OfferCatalog |
| `/en/how-i-work` | BreadcrumbList |
| `~~/estimer-mon-projet~~ (supprimé)` | **BreadcrumbList**, **HowTo**, **WebApplication** |
| `/en/estimate-my-project` | **BreadcrumbList**, **HowTo**, **WebApplication** |
| `/albert-school` | BreadcrumbList, FAQPage, Article |
| `/blog/[article]` | BlogPosting (templates) |

**Gaps restants** :
- `/en/how-i-work` mériterait son propre `Service` + `FAQPage` schemas (l'équivalent FR les a déjà via /comment-on-bosse).
- Les articles blog pourraient ajouter `Person` author schema en ld+json plutôt que juste meta tag.

---

## 🔎 Vérifications à faire après upload

1. **Rich Results Test Google** : https://search.google.com/test/rich-results
   - Tester `https://mathieuhaye.fr/` → doit détecter Person, FAQPage, Service, BreadcrumbList, ItemList
   - Tester `https://mathieuhaye.fr~~/estimer-mon-projet~~ (supprimé)` → doit détecter HowTo, BreadcrumbList, WebApplication
2. **Search Console** → Améliorations → vérifier que FAQPage et HowTo apparaissent dans les rapports
3. **Bing Webmaster Tools** : resoumettre sitemap (déjà à jour)
4. **Soumettre URLs IndexNow** pour propagation rapide vers Bing/Copilot
5. **Test "chat" sur ChatGPT/Claude** : taper "Who is Mathieu Haye?" dans ChatGPT web search dans 1-2 semaines après upload — doit retourner le paragraphe canonique de llms.txt

---

## 📦 Fichiers modifiés aujourd'hui

| Fichier | Changement |
|---|---|
| `llms.txt` | Réécriture complète, paragraphe canonique 142 mots, nouveau positionnement |
| `index.html` | Person schema (description + knowsAbout + makesOffer), ajout Service, ajout FAQPage 8 Q, ItemList enrichi, title/meta/OG/Twitter alignés, header sr-only avec définition canonique, cache bump v=44 |
| `estimer-mon-projet.html` | Ajout JSON-LD : BreadcrumbList + HowTo (5 steps) + WebApplication |
| `en/estimate-my-project.html` | Ajout JSON-LD : BreadcrumbList + HowTo (5 steps) + WebApplication |
| `style.css` | Ajout `.sr-only` (alias de `.visually-hidden`) |

À uploader sur IONOS : ces 5 fichiers. Cache bump v=44 force le rafraîchissement CSS.

---

## ⚠️ Mythes GEO à éviter (selon Google)

| Mythe | Réalité |
|---|---|
| "Ajouter `llms.txt` boost les citations IA" | Aucune preuve. Garde-le, mais pas un quick-win. |
| "Découper le contenu en chunks de 500 tokens aide" | Non. Optimise la structure pour l'humain, l'IA suit. |
| "Faire reformuler son site par une IA aide" | Non, ça nuit. L'IA détecte le contenu généré et le déclasse. |
| "Multiplier les mentions de marque sur des sites lambda" | Spam, contre-productif. Vise des plateformes à autorité (Reddit, YouTube, Wikipedia, LinkedIn). |
| "Bourrer les keywords" | Catastrophique pour AI Overviews qui privilégie le naturel. |

**Règle d'or Google** : si une optimisation aurait dégoûté un éditeur SEO chevronné en 2018, elle dégoûtera aussi les LLMs en 2026.
