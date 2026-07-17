# mathieuhaye.fr — Objectif global du site

> Document de référence stratégique. Mis à jour le 9 juillet 2026.

## En une phrase

**mathieuhaye.fr est un site de services freelance dont l'unique objectif est de générer des appels de cadrage qualifiés** (booking Google Calendar, 30 min) pour l'activité de Mathieu Haye : CRM sur-mesure, agents IA, automatisation n8n et applications web pour PME et scale-ups.

## Le positionnement : « la 3e voie »

Le site vend une thèse, répétée du hero au footer : entre le **no-code seul** (rapide mais plafonné) et **l'agence traditionnelle** (capable mais lente et chère), il existe une troisième voie — **un builder solo augmenté par l'IA** (Claude Code, n8n, Next.js, Supabase, Stripe) qui livre en semaines ce qui demandait une équipe de quatre, avec un interlocuteur unique du cadrage à la production.

Messages piliers :
- « Le logiciel sur-mesure que votre stack SaaS ne couvre pas. Livré en semaines, pas en mois. » (hero)
- Vous possédez le code · NDA possible · 2 semaines de support inclus · appel de cadrage gratuit.
- Souveraineté : builds hébergés en France quand les données l'exigent (preuve : CRM Emma pour e-Enfance/3018).

## Les offres (seuls prix publics autorisés)

| Offre | Périmètre | Prix |
|---|---|---|
| **Sprint 1 semaine** | Un workflow n8n, un agent IA, une intégration CRM — cadré, livré, déployé en 5 jours | **dès 400 €** |
| **MVP 4 à 6 semaines** | App web complète : utilisateurs, paiement, agent IA, déployée en production | sur devis |
| **Retainer mensuel** | Évolutions, maintenance, support sur un produit existant | sur devis |

## Le funnel

1. **Acquisition** — double moteur :
   - **SEO classique** (pages services optimisées, sitemap, hreflang FR/EN) ;
   - **GEO** (Generative Engine Optimization) : être **cité par les IA** (ChatGPT, Perplexity, Google AI Overviews). Le site est lui-même l'argument : llms.txt, jumeaux Markdown de chaque page, JSON-LD complet, fichiers .well-known agent-ready. Le service « Visible par les IA » vend exactement cette expertise.
2. **Nurturing / autorité** — le **Journal** (blog bilingue, ~1 article/jour ou tous les 2 jours, voir `01-ROUTINE-ARTICLES-CLAUDE.md`) : actus commentées et questions d'acheteurs, chaque article renvoie vers 1-2 pages services.
3. **Lead magnets** — deux diagnostics gratuits :
   - **Score GEO** (`/visible-par-les-ia`) : votre site est-il visible par les IA ? Score /100, résultat lead-gaté (nom + email).
   - **Test de maturité IA** (`/maturite-ia`) : 6 ou 20 questions, niveau + leviers prioritaires.
4. **Conversion** — partout : bouton « Réserver un appel » (https://calendly.com/mathieu-haye03/30min), agent IA conversationnel sur la home (version IA de Mathieu propulsée par Claude, avec formulaire de recontact in-chat), email contact@mathieuhaye.fr, LinkedIn, téléphone.

## Les preuves (portfolio)

- **e-Enfance / 3018 — CRM Emma** : la référence phare. Poste de travail des écoutants : file unique multicanale (tchat, téléphone, e-mail, WhatsApp, Messenger), détection automatique des signaux de détresse avec priorisation du risque suicidaire, dossier structuré exportable, supervision temps réel. Souverain, hébergé en France, a remplacé leur CRM du marché.
- **IA Brew** : newsletter IA 100 % automatisée (93 nœuds n8n, Claude API, Apify, Brevo), tourne seule chaque semaine.
- **Scorer d'offres + générateur CV/LM ATS** : agrégation WTTJ/JobTeaser/LinkedIn, scoring pondéré, 240+ offres scorées, PDF ATS auto-générés.
- **Juice Jacking Guard** : app desktop Windows de surveillance USB (~4 900 lignes, installeur single-file), distribution gratuite sur `/projets`.
- Expériences : Concilium, Moët Hennessy (page dédiée), certification Bloomberg BMC.

## Cibles

PME et scale-ups francophones d'abord (site FR par défaut), clients B2B internationaux ensuite (miroir EN complet : `/en/*` + `/blog/en/`). Décideurs non techniques : le contenu explique l'enjeu et les critères de décision, **jamais la recette technique** (règle éditoriale « vendre, pas enseigner » — le "comment" est ce que Mathieu vend).

## Identité et règles de contenu

- Mathieu est **développeur freelance spécialisé IA et automatisation**, point. Jamais de mention d'âge, d'études, d'école ou de statut étudiant (purgé du site en 2026-06/07).
- Ton direct, zéro jargon corporate IA (leverage, seamless, unleash…), pas de tutoiement en FR, pas d'em-dash.
- Bilingue strict : chaque contenu FR a son miroir EN naturel (pas de mot-à-mot).
- Design : système v4 « Papier & Vin » (refonte 2026-07-09) — canvas papier #F6F0E4, vin profond #6E1528/#8E1D33 en sections sombres, orange brûlé #EC4E02 en accent signature (+ orange CTA #C2410C, or #E8A33D), typo inchangée mais Instrument Serif dominant à échelle géante. Hero clair éditorial (venn Data·IA·Business, polaroids projets) ; sections en ports littéraux des réfs 21st.dev (card stack animée sur le journal, stats card glassmorphism sur la 3e voie, CTA dithering final) ; « Réserver un appel » permanent dans la nav de toutes les pages.

## Architecture du site

- **Home** (`/`) : hero → réassurance → services → approche (3e voie) → offres → projets → diagnostics → agent IA → journal → profil → contact.
- **5 pages services** + hub `/freelance-ia` : CRM sur-mesure, développeur d'agents IA, automatisation n8n, application sur-mesure, agent IA pour PME.
- **2 outils** : `/visible-par-les-ia` (scanner GEO), `/maturite-ia` (quiz).
- **Portfolio** : `/projets` + page `/moet-hennessy`.
- **Blog** : `/blog/` (FR) + `/blog/en/` (EN), ~52 articles par langue.
- **Légal/process** : `/collaboration` (packages & méthode), `/confidentialite`.
- Infra : IONOS mutualisé, statique + PHP (API agent/scanner/newsletter), pas de Git (backups zip), déploiement par miroir `_deploy/` uploadé manuellement.
