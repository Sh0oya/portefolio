---
title: "Bloomberg AskB : Anthropic Claude au cœur du Terminal"
date: 2026-04-30T08:00:00+02:00
language: fr
slug: 2026-04-30-bloomberg-askb-agent-ia-terminal
url: https://mathieuhaye.fr/blog/2026-04-30-bloomberg-askb-agent-ia-terminal
alternate: https://mathieuhaye.fr/blog/en/2026-04-30-bloomberg-askb-agent-ia-terminal
category: IA appliquée
description: "Le 28 avril 2026, Bloomberg a ouvert AskB en bêta à 125 000 utilisateurs du Terminal. Pourquoi cet agent IA, alimenté par Claude, change la donne."
---

# Bloomberg AskB : Anthropic Claude au cœur du Terminal

> Le 28 avril 2026, Bloomberg a ouvert AskB en bêta à 125 000 utilisateurs du Terminal. Pourquoi cet agent IA, alimenté par Claude, change la donne.

## Ce qu'a annoncé Bloomberg le 28 avril



L'annonce est tombée pendant l'*AI in Finance Summit* londonien. AskB, prononcer « ask-bee », est un agent conversationnel ouvert en bêta à environ un tiers des utilisateurs du Bloomberg Terminal, soit près de 125 000 traders, gérants et analystes sur 375 000 abonnés. Il est décrit par Shawn Edwards, CTO de Bloomberg, comme « le plus grand redessin du Terminal de son histoire ».

Sous le capot : une orchestration multi-modèles. Des modèles propriétaires entraînés par Bloomberg sur ses propres données financières, et des modèles de frontière fournis par [Anthropic](https://www.anthropic.com/) selon la complexité de la tâche. Les workflows routent chaque requête vers le modèle le moins coûteux capable de la traiter, parce que la facture de tokens compte autant que la latence quand la base utilisateurs cible se mesure en centaines de milliers.

Côté capacités, AskB ne se contente pas de répondre. Il construit des écrans d'investissement à partir de questions en langage naturel, produit des rapports de recherche complets (modélisation, cas bull et cas bear), permet de créer des templates planifiés ou déclenchés par des conditions de marché. Pendant la saison des résultats, un trader peut programmer un workflow qui synthétise automatiquement, à la sortie de chaque publication, un résumé long/short structuré.

Les données qu'il agrège valent autant que le moteur. Bloomberg News, recherche sell-side de plus de 800 émetteurs, données de marché, données alternatives (transactions de cartes anonymisées, fréquentation des magasins par signaux de téléphones, imagerie satellite des parkings, métriques d'usage applicatif). Pour limiter les hallucinations, le système vérifie ses propres synthèses contre les passages source, détecte les inversions sémantiques et invalide les liens fabriqués. Annoncé par Edwards à [Fortune le 28 avril](https://fortune.com/2026/04/28/bloomberg-askb-ai-agents-lessons-from-bloomberg-cto-shawn-edwards-eye-on-ai/) : « This will be the new Terminal. The primary way most interactions happen. »



## Pourquoi c'est un agent, pas un chatbot



Le mot « agent » est galvaudé depuis dix-huit mois. Ici, il a un sens technique précis. Un chatbot répond à une question; un agent planifie une tâche, l'exécute en plusieurs étapes, appelle des outils externes, contrôle ses propres sorties. Quand un utilisateur demande à AskB « comment une guerre en Iran et une hausse du baril impacteraient mon portefeuille ? », le système ne sort pas un paragraphe. Il décompose, va chercher la composition du portefeuille, applique des chocs sur les facteurs sensibles, génère des sensibilités et compose un rapport. Ce n'est pas du *retrieval augmented generation* sophistiqué, c'est une chaîne d'appels structurée.

La différence se voit le mieux dans les workflows automatisés. AskB permet de programmer une routine du type : à chaque publication de résultats des entreprises de mon univers, génère un brief long/short et envoie une alerte si la thèse change. C'est de l'orchestration agentique, pas du Q&R. Le Terminal historique faisait déjà ce genre de routines via des fonctions et des macros, mais avec une syntaxe propre que seuls les utilisateurs avancés maîtrisaient vraiment. AskB fait sauter cette barrière d'entrée.

L'autre indice qu'il s'agit d'un vrai agent : la stratégie multi-modèles. Bloomberg ne sert pas tout à Claude ou tout à Bloomberg-LLM. Il route vers le modèle le moins coûteux qui sait faire le job. Edwards le résume sans détour : « vous devez acheter toutes ces sources, faire le travail de validation, construire les benchmarks, et les tokens ne sont pas gratuits. » Pour un produit qui touchera potentiellement 375 000 utilisateurs en simultané, l'économie unitaire des tokens devient un sujet aussi sérieux que la latence.



## La donnée alternative comme vrai moat



Le moment où Edwards lâche que « la donnée reste le différenciateur critique » est intéressant à plusieurs niveaux. Sur l'IA générative, la course au modèle est, fondamentalement, perdue par tout acteur qui n'est pas Anthropic, OpenAI, Google ou Meta. Personne, pas même Bloomberg, n'a les moyens de soutenir un cycle d'entraînement de pointe à plusieurs milliards de dollars. Bloomberg avait fait *BloombergGPT* en 2023 (50 milliards de paramètres, entraîné sur 363 milliards de tokens financiers). En 2026, ils n'essaient même plus d'aller sur ce terrain. Ils utilisent Claude.

En revanche, ce qu'ils ont, c'est l'agrégat de données financières le plus complet de l'industrie : la recherche sell-side de plus de 800 maisons, les flux de prix sur quasiment tous les actifs cotés, et surtout, ce que les concurrents OpenAI ou Anthropic n'auront jamais en standard, les données alternatives. Transactions de cartes bancaires anonymisées pour anticiper les revenus retail, fréquentation des magasins, satellite, usage des applications mobiles. C'est cette couche qui fait que ChatGPT répondra à une question macro mais pas à « donne-moi une thèse contrarienne sur Lululemon en lisant les paniers d'achat des trois derniers mois ».

Le contrôle qualité suit la même logique. Plutôt que d'essayer d'éliminer les hallucinations en amont (ce que personne ne sait faire), Bloomberg a investi dans le contrôle aval : chaque synthèse produite par AskB est passée à un vérificateur qui re-lit les passages cités, détecte les retournements de sens (où le modèle dit l'inverse de ce que dit la source) et invalide les liens fabriqués. C'est de l'évaluation continue, exactement ce que Edwards désigne quand il [déclare](https://fortune.com/2026/04/28/bloomberg-askb-ai-agents-lessons-from-bloomberg-cto-shawn-edwards-eye-on-ai/) : « les évaluations sont ce qui fait ou défait un système utile et digne de confiance ».



## Ce que ça change pour les salles de marché et les ALM



La bascule, si elle se confirme, est lourde de conséquences. Pour les desks aujourd'hui, le Terminal est l'outil sur lequel on perd 4 à 6 heures par jour à composer des écrans, exporter des données, copier des cellules dans Excel, lancer des fonctions de pricing. Si AskB tient ses promesses, ces 4 à 6 heures se réduisent à des questions et des routines automatisées; le temps libéré bascule sur l'analyse, le client, le pricing.

Pour les fonctions risque et ALM, le pari est plus subtil. La génération de rapports IRRBB, les sensibilités de gap de taux, les scénarios de stress sur les dépôts à vue : tout cela est aujourd'hui un travail de patience qui occupe deux ou trois analystes par grande banque. Un agent qui sait composer ces rapports à partir d'un cahier des charges en langage naturel libère un temps considérable. À condition que la *governance* suive, parce que confier à un agent la rédaction d'un rapport qui finit en comité ALM impose une traçabilité forte, une auditabilité complète, et un contrôle humain à chaque étape critique.

L'autre risque est plus politique. Si AskB devient l'interface unique de 125 000 puis 375 000 utilisateurs, Bloomberg verrouille un peu plus son positionnement de plateforme indispensable. Cela renforce la dépendance des banques à un agent dont elles ne contrôlent ni les modèles, ni les évaluations, ni la gouvernance des données. Pour les régulateurs européens qui finalisent l'AI Act (le trilogue du 28 avril vient justement de se solder par un échec après douze heures de négociation, prochain rendez-vous le 13 mai), c'est un sujet imminent : un agent qui produit des rapports utilisés en décision d'investissement, est-ce un système IA à haut risque ?



## Ce que ça résonne quand on construit avec Claude au quotidien



L'annonce d'AskB recoupe directement ma façon de travailler en freelance. Côté perso, mon Bloomberg Dashboard de portefeuille tourne sur **Claude Haiku 4.5**, exactement la même logique d'agent que celle décrite par Edwards en plus modeste : agréger de la donnée, demander en langage naturel une analyse de sensibilité, sortir une vue de risque. La différence est l'échelle, pas la philosophie. Et confirmer qu'un acteur comme Bloomberg fait du multi-modèles avec Claude, plutôt que de tout entraîner en interne, valide une intuition pratique : un freelance ou un quant solo n'a aucun intérêt à ré-entraîner; il a tout intérêt à orchestrer.

Côté missions, c'est exactement ce que je livre à mes clients : IA Brew, ma newsletter IA automatisée, enchaîne n8n, Claude et Brevo pour digerer un flux de sources et produire un livrable chaque matin, sans intervention. Ce que Bloomberg vient de faire, c'est légitimer publiquement l'usage d'agents IA pour des tâches qui touchent au cœur d'un métier : génération de scénarios, agrégation de signaux, synthèse vérifiée contre la source. La même bascule, du calcul déterministe sous Excel à la génération orchestrée par agent, attend les PME et les desks. Ceux qui auront commencé tôt à construire leurs propres workflows agentiques, sur leurs propres données, arriveront moins essoufflés que ceux qui découvriront tout en 2027. Le même réflexe vaut pour votre présence en ligne : avant qu'un agent ne réponde à votre place, mieux vaut vérifier [si votre site est visible par les IA](/visible-par-les-ia) qui agrègent désormais l'information.



---



Le pari de Bloomberg est qu'à terme, la plupart des décisions financières se prendront non pas en consultant des données, mais en interrogeant un agent qui les a déjà digestées. Les utilisateurs qui auront pris l'habitude tôt de composer des prompts précis sortiront vainqueurs. Les autres regarderont leurs écrans clignoter sans plus savoir quoi en faire.

---

Source: [https://mathieuhaye.fr/blog/2026-04-30-bloomberg-askb-agent-ia-terminal](https://mathieuhaye.fr/blog/2026-04-30-bloomberg-askb-agent-ia-terminal) | Other language: [https://mathieuhaye.fr/blog/en/2026-04-30-bloomberg-askb-agent-ia-terminal](https://mathieuhaye.fr/blog/en/2026-04-30-bloomberg-askb-agent-ia-terminal)
