---
title: "Snowflake rachète Natoma: gouverner les agents IA"
date: 2026-05-29T08:00:00+02:00
language: fr
slug: 2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia
url: https://mathieuhaye.fr/blog/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia
alternate: https://mathieuhaye.fr/blog/en/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia
category: Data & Analytics
description: "Snowflake rachète Natoma le 27 mai 2026 pour gouverner les agents IA via le protocole MCP. Pourquoi le contrôle des agents devient le vrai champ de bataille."
---

# Snowflake rachète Natoma: gouverner les agents IA

> Snowflake rachète Natoma le 27 mai 2026 pour gouverner les agents IA via le protocole MCP. Pourquoi le contrôle des agents devient le vrai champ de bataille.

Depuis dix-huit mois, tout le discours sur les agents IA tournait autour d'une question: comment leur donner accès aux données de l'entreprise. La semaine du 26 mai 2026 a renversé la question. Le vrai sujet n'est plus l'accès, c'est le contrôle de ce que l'agent a le droit de faire une fois qu'il a cet accès.



## Le fait



Le 27 mai 2026, Snowflake a annoncé son intention d'acquérir [Natoma](https://www.snowflake.com/en/news/press-releases/snowflake-announces-intent-to-acquire-natoma-providing-secure-connectivity-for-the-agentic-enterprise/), une plateforme dédiée au protocole MCP (Model Context Protocol). Natoma a été fondée en 2024, emploie 27 personnes et est dirigée par Pratyus Patnaik, qui avait revendu sa précédente société, atSpoke, à Okta en août 2021 pour 79,3 millions de dollars. Le montant de l'opération Snowflake n'a pas été divulgué, ni la date de clôture.

Natoma ne stocke pas de données et n'entraîne pas de modèle. Son produit est une passerelle: une couche qui décide quels agents peuvent découvrir, atteindre et agir sur quels systèmes, avec autorisation liée à l'identité, politiques d'accès et journal d'audit complet. Une fois l'opération bouclée, les clients pourront connecter Cortex Agents, Snowflake Intelligence et Cortex Code à leurs applications SaaS, leurs environnements cloud, leurs VPC et leur infrastructure interne via une bibliothèque vérifiée de serveurs MCP, puis croiser les données Snowflake avec le contexte de Slack, de la messagerie, du CRM ou de Jira.

L'annonce est tombée le même jour que les résultats trimestriels. Sur le premier trimestre de son exercice 2027, Snowflake affiche 1,33 milliard de dollars de revenu produit, en hausse de 34 % sur un an, une accélération par rapport aux 30 % du trimestre précédent. Le revenu total atteint 1,39 milliard de dollars (+33 %), le taux de rétention nette s'établit à 126 %, et 779 clients dépassent désormais le million de dollars de revenu produit annuel. Dans la foulée, l'éditeur a confirmé un engagement de 6 milliards de dollars sur cinq ans avec AWS pour la compute Graviton et les services IA. Sridhar Ramaswamy, le directeur général, a résumé la logique: *les agents n'ont pas seulement besoin d'accéder aux données, ils ont besoin du bon contexte, des permissions et de garde-fous pour opérer sans risque dans l'entreprise.*



## L'accès aux données n'est plus le problème



Pendant deux ans, l'industrie a vendu l'idée que la valeur d'un agent dépendait de la richesse des données qu'on lui ouvrait. C'était vrai tant que les agents se contentaient de lire. Le problème change de nature dès qu'ils écrivent, déclenchent des actions et enchaînent des appels d'outils sans validation humaine. Un agent qui peut lire votre CRM est utile; un agent qui peut modifier une opportunité, envoyer un email au nom du commercial et déclencher un remboursement est un acteur autonome dans vos processus. La question n'est plus de savoir s'il voit la donnée, mais s'il a le droit de poser ce geste précis, à ce moment précis, dans ce contexte précis.

C'est exactement le terrain de Natoma. La passerelle ne sert pas à donner plus d'accès, elle sert à en refuser. Elle impose l'identité, la politique et l'audit au niveau de l'appel d'outil, pas au niveau de la base. Michael Ni, analyste chez Constellation Research, l'a formulé sans détour, cité par [CIO](https://www.cio.com/article/4178160/snowflake-to-acquire-mcp-focused-natoma-to-boost-governance-for-ai-agents.html): *les plateformes de données ont gagné l'ère de l'analytique; celui qui gouverne les agents, le contexte et les actions autonomes gagnera l'ère agentique.* Snowflake ne rachète pas un produit, il rachète une position sur la couche où se jouera la prochaine décennie.



## MCP, victime de son succès



MCP est un protocole ouvert publié par Anthropic. En un peu plus d'un an, il est devenu le standard de fait pour brancher un agent sur des outils, des API et des sources de données externes. Le succès a un revers: chaque serveur MCP ajoute une porte, et personne ne tient le trousseau de clés. Snowflake le reconnaît dans son propre communiqué, en évoquant une gouvernance fragmentée, du shadow AI et un risque accru d'exfiltration de données.

Phil Fersht, patron du cabinet HFS Research, décrit le piège, toujours dans CIO: *MCP devient le tissu conjonctif des agents d'entreprise, mais sans identité, politiques, contrôle des accès privilégiés et auditabilité, cela peut vite tourner au risque de shadow AI.* Un agent qui tire son contexte de la messagerie, de Slack, du CRM et des systèmes internes peut aussi exposer une information sensible, déclencher la mauvaise action ou contourner un contrôle si les règles sont faibles. Le protocole résout la connectivité; il ne résout pas la confiance. Et la confiance est précisément ce qu'un directeur des systèmes d'information exige avant de mettre un agent en production.

Voilà pourquoi un éditeur de plateforme de données paie pour une société de 27 personnes sans revenu publié. Snowflake a déjà la donnée et le moteur d'agents avec Cortex; ce qui lui manquait, c'était le poste de contrôle entre les deux. Acheter Natoma, c'est s'offrir le droit d'être l'endroit où l'entreprise décide ce que ses agents peuvent toucher.



## La couche de gouvernance, nouveau champ de bataille



Cette acquisition n'est pas un coup isolé, c'est un mouvement de consolidation. Quelques jours plus tôt, Anthropic ajoutait à ses agents managés des bacs à sable auto-hébergés et une fonctionnalité de tunnels MCP pour appeler des serveurs internes via une passerelle chiffrée. Tout le monde construit la même chose au même moment: la couche qui sépare un agent de ce qu'il peut faire. La compute brute se banalise, les modèles se ressemblent de plus en plus; la marge et le verrou se déplacent vers le plan de contrôle.

Le calendrier n'est pas un hasard non plus. Snowflake a annoncé l'acquisition le jour même où il publiait 34 % de croissance produit et un engagement de 6 milliards de dollars avec AWS. Le message aux investisseurs: l'éditeur ne surfe pas seulement sur la vague de l'entrepôt de données, il se place sur la couche au-dessus. Un taux de rétention nette de 126 % indique que les clients existants dépensent toujours plus; tenir le poste de contrôle des agents, c'est protéger cette expansion à mesure que les charges passent des tableaux de bord aux actions autonomes. La plateforme qui détient vos données et décide désormais de ce que vos agents peuvent en faire devient très difficile à remplacer.

Pour un acheteur d'entreprise, le message est limpide. La prochaine grille d'évaluation d'une plateforme agentique ne portera pas sur le nombre de connecteurs ou la performance du modèle, mais sur des questions plus sèches: qui a fait quoi, avec quelle permission, et peut-on le prouver après coup. Le journal d'audit devient un argument commercial. C'est une bonne nouvelle pour la maturité du marché, et un signal que la phase expérimentale touche à sa fin. On ne met pas un agent autonome dans un processus financier sans savoir l'arrêter et le tracer.



## Ce que ça change dans mon quotidien



Je travaille tous les jours avec des chaînes d'automatisation et des serveurs MCP. Sur [IA Brew](https://mathieuhaye.fr/#projets), ma newsletter générée par un pipeline de 93 nœuds n8n, le point sensible n'a jamais été de connecter les sources; c'était de garder le contrôle sur ce que la chaîne avait le droit de publier, de modifier ou d'envoyer sans relecture. Dès qu'un workflow agentique touche à un CRM ou à une boîte mail, la vraie ligne de défense n'est pas le modèle, c'est la liste des actions autorisées et la trace de chaque appel.

C'est aussi ce que je retrouve sur le build Salesforce que je livre pour e-Enfance / 3018 et sur la migration Pipedrive de Horus Condition Report: la première question du client n'est plus seulement *est-ce que ça marche*, mais *qu'est-ce que l'automatisation a le droit de faire si je la laisse tourner seule*. L'acquisition de Natoma valide une intuition que je mets en pratique projet après projet pour mes clients en freelance: dans l'IA appliquée au business, la gouvernance des actions n'est pas une contrainte qu'on ajoute à la fin, c'est le produit. C'est précisément ce que je vends quand je cadre un Einstein Bot ou une automatisation commerciale bilingue: une chaîne dont chaque action est explicitement autorisée et tracée. Si vous voulez mettre un agent en production sans perdre ce contrôle, voilà [comment on travaille ensemble](/collaboration).



---



La course aux modèles a fait les gros titres pendant deux ans. La prochaine se gagnera sur une question moins spectaculaire: qui tient le registre de ce que les agents ont le droit de faire. Snowflake vient de répondre en achetant le registre.

---

Source: [https://mathieuhaye.fr/blog/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia](https://mathieuhaye.fr/blog/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia) | Other language: [https://mathieuhaye.fr/blog/en/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia](https://mathieuhaye.fr/blog/en/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia)
