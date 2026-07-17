---
title: "GitHub Copilot passe au token: la fin du forfait IA"
date: 2026-06-02T08:00:00+02:00
language: fr
slug: 2026-06-02-github-copilot-tokens-fin-forfait-ia
url: https://mathieuhaye.fr/blog/2026-06-02-github-copilot-tokens-fin-forfait-ia
alternate: https://mathieuhaye.fr/blog/en/2026-06-02-github-copilot-tokens-fin-forfait-ia
category: B2B SaaS
description: "Le 1er juin 2026, GitHub Copilot bascule au token. Le forfait illimité disparaît, les premières factures s'envolent. Le vrai modèle économique de l'IA."
---

# GitHub Copilot passe au token: la fin du forfait IA

> Le 1er juin 2026, GitHub Copilot bascule au token. Le forfait illimité disparaît, les premières factures s'envolent. Le vrai modèle économique de l'IA.

Pendant trois ans, l'IA en entreprise s'est vendue au forfait. Vous payiez vingt dollars par mois, vous tapiez autant de prompts que vous vouliez, l'éditeur absorbait la perte. Le 1er juin 2026, GitHub a mis fin à cette époque pour Copilot, son outil de complétion de code utilisé par plus de 20 millions de développeurs. Tous les plans payants passent au modèle métré, et les premières factures dessinent un changement de régime bien plus large que GitHub.



## Le fait



Le 30 mai 2026, GitHub a annoncé sur son forum communautaire que Copilot abandonnait les Premium Request Units pour les remplacer par les [GitHub AI Credits](https://github.com/orgs/community/discussions/192948), des crédits indexés sur le coût réel de chaque modèle appelé. Le déploiement est effectif depuis le 1er juin 2026. Les quatre plans existants conservent leur tarif mensuel, mais incluent désormais une enveloppe de crédits égale à leur prix: 10 dollars de crédits pour Copilot Pro à 10 dollars, 39 dollars pour Pro+, 19 dollars par utilisateur pour Business, 39 dollars par utilisateur pour Enterprise. Au-delà, c'est de la consommation à l'usage, au prix API public de chaque modèle.

Les complétions inline et les Next Edit Suggestions, qui constituent l'usage quotidien de la majorité des développeurs, restent illimitées et non décomptées. Tout le reste, agents, chat avancé, modes étendus, code review automatique, passe désormais au compteur. Les forfaits annuels sont supprimés. Pour amortir le choc, GitHub a accordé des crédits promotionnels pour juin, juillet et août 2026: 30 dollars supplémentaires par mois pour Business, 70 dollars pour Enterprise.

La réaction des développeurs a été immédiate. [TechCrunch](https://techcrunch.com/2026/05/30/what-a-joke-github-copilots-new-token-based-billing-spurs-consternation-among-devs/) a relayé des projections individuelles passant de 29 dollars à près de 750 dollars par mois, et de 50 dollars à 3 000 dollars dans des configurations agentiques où Copilot lit le dépôt, planifie, modifie plusieurs fichiers et itère. Microsoft n'a pas répondu aux sollicitations du média. Sur le forum GitHub, des centaines de messages tournent autour de la même idée, relayée par [Dataconomy](https://dataconomy.com/2026/06/01/github-copilot-token-pricing-backlash/): l'éditeur a poussé pendant deux ans à un usage intensif des chatbots et des agents avant de mettre le compteur.



## La fin du forfait illimité n'est pas un choix politique



Ce qui se joue chez Copilot n'est pas un caprice tarifaire, c'est un alignement avec la réalité économique. Un modèle de langage frontière coûte un montant mesurable à chaque appel: un appel à Claude Opus, à GPT-5 ou à Gemini Ultra consomme de la compute GPU dont le prix est public. Tant que les éditeurs absorbaient le delta pour gagner des parts de marché, ils acceptaient de perdre sur les utilisateurs intensifs et de gagner sur les usagers occasionnels. Le calcul tient au début. Il s'effondre dès que l'usage agentique devient courant, parce qu'un agent ne consomme pas comme un humain: il enchaîne les appels d'outils, recharge le contexte, multiplie les itérations pour boucler une tâche.

Le calendrier de juin 2026 n'est pas isolé. Anthropic et OpenAI ont déjà recadré leurs offres entreprises autour de la consommation; Google fait la même chose côté Workspace. Le forfait à vingt dollars qui a séduit les premiers utilisateurs jouait un rôle de produit d'appel, pas de modèle économique durable. Une fois la base installée et l'usage devenu réflexe, le prix du token reprend sa place. Chez Copilot, le geste est franc: les complétions de base restent gratuites parce qu'elles ne coûtent presque rien à servir, et tout ce qui touche aux agents passe au métré. C'est cohérent. Ce qui ne l'est pas, c'est la promesse implicite de stabilité tarifaire portée pendant trois ans.



## Le décalage entre la promesse et la facture



Le vrai problème n'est pas le prix; c'est l'imprévisibilité. Une équipe de développement raisonne par budget annuel par poste. Quand la direction financière a validé un coût de 39 dollars par utilisateur et par mois, elle ne signe pas un chèque en blanc à 3 000 dollars parce qu'un développeur a lancé une session agentique un peu trop longue sur un dépôt volumineux. Le passage au token transfère le risque de l'éditeur vers le client, sans donner au client les outils pour le maîtriser.

Les exemples cités dans [TechCrunch](https://techcrunch.com/2026/05/30/what-a-joke-github-copilots-new-token-based-billing-spurs-consternation-among-devs/) illustrent le problème: ce ne sont pas des abus marginaux, ce sont les workflows que Microsoft a activement encouragés à coups de démonstrations sur scène. Une partie des utilisateurs estime, à juste titre, que l'éditeur a accéléré la dépendance à des usages coûteux avant d'envoyer la facture. La défense officieuse, formulée par certains développeurs eux-mêmes, consiste à dire que les usages massifs reflètent du *vibe coding* mal cadré. C'est partiellement vrai. Ça ne résout pas le besoin d'un plafond clair, d'alertes en temps réel et d'une politique de cap par utilisateur que peu d'entreprises savent gérer aujourd'hui.

Le contraste avec d'autres marchés est éclairant. Personne n'achète son cloud AWS au forfait illimité, et personne ne s'en plaint. La différence, c'est que les équipes ont appris à budgéter le cloud avec FinOps, dashboards et alertes. Pour l'IA, ce vocabulaire n'existe pas encore en interne. Les directions financières découvrent qu'un poste développeur peut coûter 100 dollars ou 3 000 dollars selon le mois, et qu'aucun outil natif ne leur permet d'anticiper la marche. Le travail à faire dans les douze prochains mois ne porte pas sur la techno; il porte sur la gouvernance budgétaire de l'IA.



## Ce que ça change pour les budgets d'entreprise



Pour un directeur des systèmes d'information ou un responsable engineering, la conséquence pratique est immédiate. Les budgets IA doivent passer d'une ligne fixe par siège à un modèle prévisionnel basé sur l'usage, avec cap individuel, suivi par équipe et politique claire sur ce qui est autorisé en mode agent autonome. Les éditeurs qui sortiront vainqueurs de cette transition ne seront pas ceux qui ont le meilleur modèle, mais ceux qui livreront le meilleur tableau de bord de consommation et la meilleure interface de pilotage. Plusieurs start-ups y travaillent déjà; la bascule de juin va leur servir d'accélérateur commercial.

La deuxième conséquence est commerciale. Les revendeurs Microsoft et les partenaires GitHub vont devoir vendre Copilot autrement: non plus comme un forfait, mais comme un service avec engagement de volume. Cela ressemble à la vente d'un contrat AWS, et donne raison aux cabinets de conseil qui se positionnent sur le FinOps appliqué à l'IA. Côté start-up, c'est une fenêtre nouvelle: chaque outil agentique facturé au métré a besoin d'une surcouche d'observabilité, de cap, d'attribution et d'optimisation. Il y a un Datadog et un Vercel à construire sur le coût des tokens. C'est aussi la principale fragilité du discours de GitHub: en gardant les complétions gratuites mais en facturant les agents, l'éditeur invite ses utilisateurs intensifs à comparer son coût avec celui d'un appel direct à l'API d'Anthropic ou d'OpenAI, sans la couche Copilot. La question du *fournis-toi en direct* revient sur la table dans toutes les équipes qui passent 200 dollars par développeur et par mois.



## Ce que ça change dans mon quotidien



Je facture au forfait ce que je construis pour mes clients, mais je suis exposé au token à chaque automatisation que je livre. Sur [IA Brew](https://mathieuhaye.fr/#projets), ma newsletter générée par un pipeline de 93 nœuds n8n, j'ai dû mettre en place un compteur explicite dès le premier mois: combien d'appels Claude Sonnet, combien de tokens en entrée, combien en sortie, combien par édition. Sans ce suivi, le coût d'une newsletter peut varier d'un facteur dix entre une édition propre et une édition où le scraper renvoie trop de bruit dans le contexte.

C'est la même logique qui m'a fait choisir Claude Haiku 4.5 pour le [Bloomberg Dashboard](https://mathieuhaye.fr/#projets) appliqué à mon portefeuille personnel: la qualité d'analyse de Haiku suffit pour scorer des positions, et le coût par appel reste compatible avec un usage quotidien. C'est aussi ce que mes clients me paient à arbitrer en freelance, du pipeline de prospection Callkom au workflow de veille à 93 nœuds pour la Fromagerie Ermitage: la vraie compétence n'est pas de savoir prompter, c'est de savoir choisir le bon modèle pour le bon usage en intégrant son coût, parce que c'est ma marge autant que la leur. L'épisode Copilot va imposer cette discipline à des dizaines de milliers d'équipes qui ne la pratiquent pas encore.



---



Le forfait IA était une promesse de produit d'appel. Le retour au token est l'arithmétique reprenant ses droits. Les entreprises qui sortiront gagnantes de cette transition seront celles qui auront construit, avant les autres, leur propre culture FinOps autour de l'IA.

---

Source: [https://mathieuhaye.fr/blog/2026-06-02-github-copilot-tokens-fin-forfait-ia](https://mathieuhaye.fr/blog/2026-06-02-github-copilot-tokens-fin-forfait-ia) | Other language: [https://mathieuhaye.fr/blog/en/2026-06-02-github-copilot-tokens-fin-forfait-ia](https://mathieuhaye.fr/blog/en/2026-06-02-github-copilot-tokens-fin-forfait-ia)
