---
title: "Projets & réalisations · Apps IA, automatisations, CRM"
url: https://mathieuhaye.fr/projets
language: fr
alternate: https://mathieuhaye.fr/en/projects
description: "Emma, CRM sur-mesure pour e-Enfance / 3018, newsletter IA automatisée, agents, dashboards, automatisations n8n : 8 projets livrés ou testés en conditions réelles."
---

# Est un builder, obsédé d'automatisation, AI-first, basé à Paris et en mode freelance.

> Ce que je construis quand des équipes me confient leurs process : pipelines, agents, CRM, apps. Tout ce qui suit est en production ou testé en conditions réelles.

Services associés : [Développeur d'agents IA](https://mathieuhaye.fr/developpeur-agent-ia) · [Automatisation n8n](https://mathieuhaye.fr/automatisation-n8n) · [Agent IA pour PME](https://mathieuhaye.fr/agent-ia-pme) · [CRM sur-mesure](https://mathieuhaye.fr/crm-sur-mesure) · [Application sur-mesure](https://mathieuhaye.fr/application-sur-mesure) · [Freelance IA](https://mathieuhaye.fr/freelance-ia) · [Collaboration](https://mathieuhaye.fr/collaboration)

## 1. e-Enfance / 3018, CRM sur-mesure « Emma »

Build CRM sur-mesure. Tags : Emma, CRM sur-mesure, Full-stack TS, File unique multicanale, Détection de détresse, Priorisation risque suicidaire, Supervision temps réel, CRM du marché (avant), Hébergé en France.

- **Client** : e-Enfance / 3018
- **Portée** : Emma, poste de travail des écoutants
- **Canaux** : tchat, téléphone, e-mail, WhatsApp, Messenger
- **Rôle** : consultant freelance

### Le brief

Le 3018 est la ligne d'écoute nationale française pour la protection des mineurs en ligne, gérée par l'association e-Enfance. J'y suis d'abord intervenu sur leur CRM du marché. Cette expérience m'a montré exactement ce dont les équipes avaient besoin au quotidien, et là où leur CRM du marché atteignait ses limites pour ce besoin.

### Ce que j'ai livré

- **Emma, un CRM sur-mesure** : le poste de travail des écoutants, qui a remplacé leur CRM du marché et colle aux équipes au quotidien.
- Une **file unique** qui réunit tous les canaux au même endroit : tchat, téléphone, e-mail, WhatsApp et Messenger.
- La **détection automatique des signaux de détresse**, avec priorisation du risque suicidaire dans la file.
- Un **dossier de cas structuré et exportable**, la **supervision en temps réel** et le **reporting**.
- Un build **full-stack TypeScript**, conçu et livré de bout en bout. **Souverain et hébergé en France**, sur données sensibles, avec audit trail.

### Pourquoi c'est sur ce portfolio

La preuve que je sais concevoir et livrer une vraie plateforme d'opérations tout-en-un de bout en bout, sur données sensibles, pas seulement configurer un outil existant.

## 2. IA Brew. Newsletter IA

Produit IA. Tags : n8n, Claude API, Apify, Brevo, HTML templating.

- **Type** : newsletter automatisée
- **Workflow** : 93+ nœuds n8n
- **Fréquence** : hebdo, sans humain
- **Stack** : Apify + Claude + Brevo

### Le pipeline

Une newsletter qui s'écrit toute seule. 20+ sources (RSS, APIs, sites scrapés) alimentent un workflow n8n. Claude score chaque item sur sa pertinence, regroupe les doublons, résume les meilleurs picks, et rend un mail HTML. Brevo l'envoie chaque semaine.

### Étapes

- **Ingestion** : acteurs Apify + nodes HTTP n8n récupèrent les items bruts.
- **Déduplication** : empreinte de contenu pour fusionner les items qui couvrent la même histoire.
- **Score & résumé** : API Claude avec un prompt calibré (pertinence + extraction de signal).
- **Rendu** : template HTML assemblé à partir des blocs scorés.
- **Envoi** : création de la campagne Brevo + dispatch à la liste.
- **Observabilité** : logging par étape dans Google Sheets pour post-mortem.

### Take-away

Le même pattern s'applique à n'importe quel workflow d'équipe research : ingestion, score, cluster, rendu, distribution. La différence entre un toy et un produit, c'est l'observabilité et la rigueur du scoring.

## 3. Scorer d'offres + générateur CV/LM ATS en PDF

Pipeline data + GenIA. Tags : Python, WTTJ API, JobTeaser, Claude API, ReportLab, HTML / JS, SQLite.

- **Sources** : WTTJ, JobTeaser, LinkedIn
- **Offres scorées** : 240+
- **Auto-généré** : CV ATS + lettre de motivation en PDF
- **Scoring** : pondéré, profile-aware

### Ce que ça fait

Récupère les offres de trois plateformes via leurs API, normalise le schéma, score chaque offre contre mon profil sur un ensemble de critères pondérés (match stack, secteur, localisation, séniorité), et rend un dashboard HTML filtrable. Pour chaque offre au score élevé, le pipeline génère automatiquement un **CV et une lettre de motivation taillés pour l'offre**, tous deux exportés en **PDF ATS-optimisés**.

### Build

- **Scrapers par source** avec rate limits et cache.
- **Schéma unifié** pour comparer ce qui est comparable.
- **Moteur de scoring** : poids manuels calibrés sur 2 itérations.
- **Générateur CV taillé** : Claude réordonne les sections de mon master CV pour matcher les mots-clés de l'offre, puis ReportLab rend un PDF au pixel près.
- **Générateur de LM** : même pattern, avec un prompt structuré qui impose ton, structure et longueur.
- **Règles ATS** : layout single-column, pas de tableaux, pas d'images derrière le texte, vraies polices (pas d'images), noms de sections standards, titres parseables machine.
- **UI** : dashboard HTML / JS vanilla avec table filtrable et téléchargement en un clic des deux PDF par offre.

### Pourquoi l'ATS compte

La plupart des CVs aujourd'hui sont lus d'abord par des Applicant Tracking Systems avant qu'un humain ne les voie. Un beau design two-column ou un CV exporté en image fait silencieusement chuter le score à zéro. Ce pipeline respecte les contraintes ATS par construction : chaque CV qu'il sort est parsé correctement par Workday, Greenhouse, Lever et compagnie.

### Ce que j'en retiens

Un cas d'étude propre en discipline ETL + GenIA appliquée : si le schéma est mauvais, le scoring n'a aucun sens ; si le prompt CV est sale, le PDF lit comme du filler. Les deux disciplines récompensent la rigueur plus que la créativité.

## 4. Juice Jacking Guard. Surveillance USB (Windows)

Application desktop sécurité. Tags : Python 3.10+, Tkinter, WMI (Win32_PnPEntity), Raw Input API (ctypes), pnputil, PyInstaller, Inno Setup, VirusTotal API v3.

- **Plateforme** : Windows 10 / 11
- **Menaces couvertes** : BadUSB, Rubber Ducky, câble O.MG, juice jacking, payloads USB
- **Taille** : ~4 900 lignes, 20 modules, 11 sous-systèmes
- **Distribution** : installeur .exe single-file (23,3 Mo)

### Pourquoi ça existe

Un device USB n'est jamais juste un USB. Quand on branche quelque chose, Windows fait confiance à ce qu'il déclare, un Rubber Ducky qui s'annonce comme clavier peut taper 200 commandes en quelques secondes sans la moindre permission. Un câble O.MG ressemble à un Lightning normal mais cache une puce qui exfiltre des données. Aucun antivirus n'attrape ça à temps. Juice Jacking Guard intercepte le device **avant** qu'il puisse parler à Windows.

### Détection et blocage

- **Monitoring WMI en background** : scan de `Win32_PnPEntity` dans un thread dédié, blocage immédiat via `pnputil` à l'insertion.
- **Classifier** : VID/PID, classes USB, fabricant, composite multi-interfaces. Quatre niveaux de risque (de faible à critique) avec politiques par catégorie.
- **Piège composite** : un device qui expose HID + mass storage en même temps = signature classique BadUSB / O.MG, classé CRITIQUE automatiquement.
- **Politique « bloque-d'abord, demande-après »** : fenêtre d'exposition minimale, le device est désactivé au niveau OS jusqu'à validation explicite.

### Le challenge Anti-BadUSB (killer feature)

- **Raw Input API via ctypes** : utilisation de `hDevice` depuis `WM_INPUT` pour identifier le clavier physique exact qui envoie chaque frappe.
- **Challenge interactif** : chaque nouveau clavier ouvre une modale « appuie sur la touche X sur le nouveau clavier », un Rubber Ducky ne peut pas lire le prompt et répondre, donc il se démasque.
- **Détection des rafales** : 3 frappes ou plus en moins de 30 ms = signature de payload dump, blocage automatique.
- **Fenêtre message-only dédiée** pour Raw Input, dans son propre thread, qui communique avec l'UI via `Queue` + `threading.Event`.

### Scan et réputation

- **Scan read-only à l'insertion** du mass storage : `autorun.inf`, 23 extensions exécutables, fichiers cachés, raccourcis suspects.
- **SHA-256** calculé localement pour chaque finding.
- **Lookup VirusTotal (optionnel, free tier)** : appels API v3 sur les hashs uniquement, jamais d'upload de fichier, rate limiter token-bucket pour respecter les 4 req/min.
- **Verdict live** dans le popup d'alerte, avec preuves par finding.

### Highlights techniques

- **Multi-threading** : thread monitor WMI + thread dispatcher d'événements + thread Raw Input (sa propre fenêtre message-only) + thread main Tk, communication via `Queue` et `threading.Event`.
- **Self-elevation UAC** : si pas admin au lancement, relance via `ShellExecuteW` avec le verbe `runas`.
- **Boot hook via Task Scheduler** : `Register-ScheduledTask` avec `RunLevel Highest` = boot admin silencieux, pas de prompt UAC à chaque session.
- **UI dark moderne** : theme Tkinter custom complet, dark title bar Windows via `DwmSetWindowAttribute(DWMWA_USE_IMMERSIVE_DARK_MODE)`, sidebar nav (Dashboard / Whitelist / Journal / Préférences), system tray, notifications toast.
- **Installeur** : script Inno Setup, install dans Program Files, raccourcis Bureau + Menu Démarrer, tâche planifiée, exclusion Defender, désinstallation propre.
- **Build** : PyInstaller single-file + Inno Setup, chaînés dans `build.bat` (alternative PowerShell dans `setup.bat`).

### Téléchargement (Windows 10 / 11)

- Télécharger .zip (recommandé, 22,7 Mo) : https://mathieuhaye.fr/downloads/JuiceJackingGuard-Setup.zip
- .exe direct (23,3 Mo) : https://mathieuhaye.fr/downloads/JuiceJackingGuard-Setup.exe
- SHA-256 (.zip) : e37364564f1eed9af699b85a40dae6e5fdbf9f25efba72f3002f6d0e0b41ffac
- SHA-256 (.exe) : 1132af4c3a2158f17806a7720b0a46d4c477799bae78b6a81d3a315cfa30812a

L'installeur est **non signé** (pas de certificat code-signing à 400 €/an), donc Chrome / Edge et Windows SmartScreen vont prévenir avant le téléchargement et au premier lancement. Le **.zip est recommandé** parce que les navigateurs font plus confiance aux archives qu'aux exécutables bruts. Après extraction, Windows affichera « Windows a protégé votre PC », cliquez sur *Informations complémentaires, puis Exécuter quand même*. Vérifiez le SHA-256 avant exécution. L'app est locale, pas de télémétrie, ne contacte VirusTotal que si vous activez la fonctionnalité optionnelle de lookup.

### Pourquoi c'est sur ce portfolio

Juice Jacking Guard est le projet où le réflexe builder rencontre le vrai systems programming : appels ctypes dans l'API Windows, discipline de threading qui ne deadlock pas, installeur qui survit à Defender, modèle de sécurité qui défaut sur « deny ». Il montre aussi que je peux prendre une menace de niche, à moitié comprise (les payloads USB), et livrer une défense qui marche réellement sur la machine que vous utilisez pour lire ce texte.

## 5. Dashboard Bloomberg-like

Tracker multi-actifs. Tags : Next.js 14, TypeScript, Claude API, Recharts, CoinGecko, Yahoo Finance, Telegram.

- **Portée** : 6 actifs (crypto, actions, ETF)
- **IA** : Claude Haiku 4.5
- **Alertes** : Telegram, 3 niveaux
- **Planning** : 08h50 / 13h00 / 17h30 Paris

### Objectif

Un terminal perso que j'utilise vraiment chaque matin. Suivi de BTC, ETH, SOL, NVDA, TTE et CW8. Récupère les prix, calcule les indicateurs techniques, demande à Claude un point court aux heures de marché, pousse le tout sur Telegram.

### Fonctionnalités

- **Analyse IA planifiée** avant l'ouverture, à midi, après la clôture.
- **Indicateurs** : RSI, MACD, Bollinger, ATR sur 1J / 1S / 1M / 3M.
- **Simulateur What-If** avec Monte Carlo 10 jours (médian / pire / meilleur).
- **Heatmap de corrélation** (Pearson 6x6) + score de diversification.
- **DCA tracker** : coût d'entrée par actif, P&L %, suivi du budget.
- **Calendrier d'événements** : résultats, dividendes, BCE, Fed, avec compte à rebours en J-N.
- **Journal de trading** : log du raisonnement et de l'état émotionnel par trade.

### Pourquoi ça compte

Ce projet coche toutes les cases d'un junior quant : ingestion de données, feature engineering, Monte Carlo, appels LLM en production, scheduling. C'est typiquement le genre d'outil que j'ai envie d'apprendre à construire *avec les bonnes maths derrière*.

## 6. IchimokuSignal Pro

Pine Script + backtest. Tags : Pine Script v6, TradingView, Python, yfinance, pandas, numpy.

- **Type** : indicateur + backtester
- **Version** : v3.3 (rebond + SL 15 %)
- **Rendement net (AAOI, 5 ans)** : +187 % vs +1088 % B&H
- **WR / PF / MaxDD** : 54 % / 1,62 / 24 %

### Problème

La plupart des setups Ichimoku sur TradingView déclenchent trop souvent sur des charts long terme. Je voulais un signal « GO » / « WAIT » unique pour du stock picking type buy-and-hold, validé par un backtest Python qui inclut commissions et slippage.

### Approche

- **Signal principal** : détection de rebond Kijun / Tenkan.
- **Risque** : stop suiveur 15 % en pointillés, sortie quand le score passe sous 2.
- **Chikou renforcé** : vérifié contre le nuage à la position du Chikou.
- **Bougies HTF** : englobante, marteau, doji, marubozu. Anti-repaint.
- **Score composite** : 10 critères, jusqu'à 13 points.
- **Backtester Python** : reproduit la logique Pine bougie par bougie, frais aller-retour 0,1 % et slippage 1 tick inclus.

### Résultats honnêtes (AAOI, 5 ans)

- Stratégie : **+187 %**, WR 54 %, PF 1,62, MaxDD -24 %.
- Buy & Hold de référence : **+1088 %**, MaxDD -62 %.
- Donc la stratégie *perd* contre le B&H en absolu, mais coupe le drawdown de plus de moitié.
- Backtest mono-titre. Forward-test sur un panier de 15 tickers à venir.

### Ce que ça m'a appris

Deux choses. Premièrement, un backtest mono-actif est toujours en partie overfitté, donc le out-of-sample n'est pas négociable. Deuxièmement, une stratégie qui sous-performe le B&H en rendement mais divise le drawdown par deux reste un produit valable pour un investisseur averse au risque. Choisir une stratégie, c'est choisir un profil de risque.

## 7. Modèle d'investissement immobilier

Modélisation financière. Tags : Python, pandas, Notion, INSEE open data, Google Sheets.

- **Portée** : SCI/IS vs LMNP, financement
- **Données** : INSEE, stats notariales, rendements locatifs
- **Villes classées** : 34 métropoles françaises
- **Usage** : dimensionner mon propre patrimoine

### Ce que ça fait

Un modèle opérationnel pour choisir entre SCI à l'IS (impôt société) et LMNP (location meublée, régime BIC) par deal. Inclut scénarios d'emprunt, TRI à 10 ans, impact fiscal, stratégie de sortie et un indice par ville pour classer l'attractivité locative en France.

### Composants

- **Comparateur de régime** : SCI/IS vs LMNP, cash flow année par année, TRI, valeur nette à la sortie.
- **Simulateur d'emprunt** : amortissement, courbe d'intérêts, loyer break-even.
- **Indice villes** : rendement locatif, risque de vacance, momentum prix, fiscalité notariale.
- **Overlay macro** : scénarios de taux, inflation, croissance des salaires.
- **Dashboard Notion** : je l'utilise sur les vrais deals que je souscris.

### Pourquoi ça compte

L'immobilier est la classe d'actifs où j'ai appris que l'enveloppe fiscale compte plus que le prix. Le modéliser m'a forcé à comprendre comment les régimes corporate vs perso interagissent avec le financement. Le même raisonnement s'applique à tout instrument structuré en finance.

## 8. Bot de trading crypto (MEXC)

Trading quant. Tags : Python, MEXC API, pandas, numpy, Streamlit, TA-Lib.

- **Stratégie** : mean reversion, BTC + ETH
- **P&L paper** : +3,2 % sur 90 jours
- **P&L live** : -2,1 % sur 30 jours
- **Win rate** : 46 % (214 trades)

### Hypothèse

Les paires crypto court terme dépassent souvent leur niveau d'équilibre. Quand le RSI passe sous une bande basse et que le prix casse l'enveloppe inférieure de Bollinger, un retour à la moyenne est plus probable qu'une continuation. Le bot prend cette respiration à contre-pied avec un stop serré.

### Architecture

- **Moteur d'indicateurs** : RSI(14) + Bollinger (20, 2 sigma) sur bougies 1m et 5m glissantes.
- **Filtre d'entrée** : les deux signaux s'accordent + pic de volume supérieur à 1,5x la moyenne.
- **Sizing** : fraction fixe du capital, plafond par paire.
- **Sortie** : take-profit à la bande médiane, stop dur à 1,5 %, time stop après 30 bougies.
- **Dashboard** : courbe d'equity live, log par trade, kill switch.

### Résultats (les vrais chiffres)

- Paper (90 jours) : **+3,2 %**, PF 1,18, MaxDD -8,4 %.
- Pilote live (30 jours, 10 % de la taille paper) : **-2,1 %**, WR 46 %.
- Écart : le paper n'intégrait pas les **frais taker (0,1 %)** ni le slippage réel sur paires peu liquides.
- Les frais expliquent à eux seuls près de 4 points de pourcentage de l'écart.

### Ce que j'ai changé ensuite

Bascule vers une version maker-rebate via ordres limite aux bords des Bollinger. Taux de remplissage plus faible, mais quand ça remplit les frais deviennent négatifs. Toujours en paper. Vraie leçon : ne jamais croire un backtest qui ne modélise pas les coûts de friction tick par tick.

## Parcours : économie, code, IA

- **2026 : Bloomberg Market Concepts (BMC), certification.** Certifié. Indicateurs économiques, devises, produits de taux, risque de taux et actions. Le vocabulaire partagé pour toute discussion business-et-marchés. Vérifier le certificat : https://portal.bloombergforeducation.com/certificates/7kakVQVUGSdR7qBjzaATqhsL
- **Oct. 2025 à aujourd'hui : consultant freelance. CRM, Data, IA appliquée.** Clients : e-Enfance / 3018, Fromagerie Ermitage, Horus Condition Report, Profile Club.
  - **e-Enfance / 3018, CRM sur-mesure « Emma ».** D'abord intervenu sur leur CRM du marché ; puis conception et livraison d'Emma, le poste de travail des écoutants, en remplacement de leur CRM du marché : file unique qui réunit tous les canaux (tchat, téléphone, e-mail, WhatsApp, Messenger), détection automatique des signaux de détresse avec priorisation du risque suicidaire, dossier structuré et exportable, supervision en temps réel et reporting. Build souverain complet, hébergé en France.
  - **Veille, Fromagerie Ermitage.** Workflow n8n de 93 nœuds pour la veille presse et réseaux sociaux. Scoring mots-clés sur 19 indicateurs, filtrage temporel, rapports hebdo auto-générés.
  - **CRM, Horus Condition Report.** Migration Pipedrive et automations commerciales bilingues (FR / EN).
  - **Data & analytics, Profile Club.** Base de 146 membres, analyse de cohorte, segmentation des campagnes, dashboards KPI sur Google Apps Script.
- **Sept. 2024 à sept. 2025 : coordinateur de projets digitaux.** Concilium, Paris. Agence de gestion de projets digitaux, 150+ projets / an.
  - **Coordination projet.** Gestion de backlog, préparation de comités de pilotage, suivi des livrables, reporting client sur 150+ projets.
  - **Admin CRM.** Déploiement OHME et Pipedrive, structuration des données contacts, segmentation, exports de campagnes.
  - **Reporting automatisé.** Newsletter de veille sectorielle et newsletter IA interne construites sur n8n + Brevo.

## Un projet du même genre ?

Décrivez votre projet en 30 secondes, je vous dis si je peux le faire (et combien de temps ça prend) en 24h max. Réservez un appel : https://calendly.com/mathieu-haye/30min ou voyez les services : https://mathieuhaye.fr/freelance-ia

---

Contact: contact@mathieuhaye.fr | Réserver un appel : https://calendly.com/mathieu-haye/30min | Site : https://mathieuhaye.fr/
