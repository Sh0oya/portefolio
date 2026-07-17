---
title: "Apple, Gemini et Siri : le modèle d'IA devient un réglage"
date: 2026-06-08T09:00:00+02:00
language: fr
slug: 2026-06-08-apple-gemini-siri-modele-ia-interchangeable
url: https://mathieuhaye.fr/blog/2026-06-08-apple-gemini-siri-modele-ia-interchangeable
alternate: https://mathieuhaye.fr/blog/en/2026-06-08-apple-gemini-siri-modele-ia-interchangeable
category: Business & Growth
description: "Le 8 juin 2026, Apple confie Siri à Gemini et laisse l'utilisateur choisir Claude ou ChatGPT. Pourquoi le modèle d'IA devient une pièce interchangeable."
---

# Apple, Gemini et Siri : le modèle d'IA devient un réglage

> Le 8 juin 2026, Apple confie Siri à Gemini et laisse l'utilisateur choisir Claude ou ChatGPT. Pourquoi le modèle d'IA devient une pièce interchangeable.

- **L'essentiel en 30 secondes :**

                - Le 8 juin 2026, Apple a présenté à la WWDC un Siri reconstruit sur un modèle Gemini de Google sur-mesure, doté de 1 200 milliards de paramètres.

                - Apple paie environ 1 milliard de dollars par an pour ce modèle, après avoir écarté Anthropic, qui réclamait « plusieurs milliards » de dollars par an.

                - iOS 27 introduit « Extensions » : l'utilisateur pourra choisir Gemini, Claude ou ChatGPT comme moteur de Siri, des Writing Tools et d'Image Playground, à partir de l'automne 2026.

                - Les requêtes Gemini tournent dans Private Cloud Compute, l'infrastructure chiffrée d'Apple ; selon Apple, aucune donnée utilisateur n'est partagée avec Google.





## Le fait



Le 8 juin 2026, lors de l'ouverture de sa conférence développeurs WWDC, Apple a dévoilé un Siri entièrement reconstruit, propulsé non par un modèle maison mais par un modèle Gemini de Google conçu sur-mesure, de 1 200 milliards de paramètres. Le nouvel assistant accompagne iOS 27, iPadOS 27 et macOS 27, et apporte enfin les capacités promises dès 2024 puis repoussées : compréhension du contexte personnel, lecture de l'écran et exécution d'actions dans les applications. Selon plusieurs rapports concordants, Apple verse environ 1 milliard de dollars par an à Google pour ce modèle, qui tourne dans l'infrastructure chiffrée Private Cloud Compute d'Apple, sans partage de données utilisateur avec Google.

Le point le plus structurant n'est pas le contrat, c'est le cadre baptisé « Extensions ». Révélé par Bloomberg le 5 mai 2026 puis confirmé à la WWDC, ce système d'API laisse n'importe quel fournisseur d'IA se brancher sur Apple Intelligence. Dans les réglages « Apple Intelligence et Siri », l'utilisateur pourra désigner le modèle qui alimente Siri, les Writing Tools et Image Playground : Gemini par défaut, mais aussi Claude d'Anthropic, ChatGPT d'OpenAI ou un autre service compatible. C'est la fin de l'exclusivité dont jouissait ChatGPT depuis deux ans. La fonction est attendue à l'automne 2026. [Détails du dispositif sur MacRumors](https://www.macrumors.com/2026/05/05/ios-27-third-party-chatbots-apple-intelligence/).



## Pourquoi Apple a-t-elle renoncé à construire son propre modèle ?



Apple a renoncé à imposer un modèle maison parce que le calcul économique ne tenait plus : louer un modèle de pointe coûtait moins cher que d'en bâtir un compétitif, et plus vite. La marque qui fabrique ses propres puces, son propre système et ses propres services a, sur l'IA générative, choisi d'acheter plutôt que de construire. C'est un aveu inhabituel pour une entreprise dont la stratégie repose depuis quinze ans sur la maîtrise verticale de bout en bout.

Le choix de Gemini plutôt que de Claude s'est joué sur le prix. [Selon AppleInsider](https://appleinsider.com/articles/26/01/30/apple-could-have-used-claude-to-power-a-future-siri-but-anthropic-got-greedy), Anthropic réclamait « plusieurs milliards » de dollars par an, avec un tarif censé doubler chaque année pendant trois ans, alors que Google a proposé son modèle sur-mesure pour environ 1 milliard de dollars par an. Claude tournait pourtant déjà en interne sur des versions de test à Apple Park avant l'échec des négociations. Le détail qui remet l'opération en perspective : Apple encaisse déjà près de 20 milliards de dollars par an de Google au titre de l'accord faisant de son moteur la recherche par défaut sur iPhone. À cette échelle, reverser 1 milliard pour Gemini reste une dépense modeste.

Autrement dit, Apple a traité le modèle d'IA comme un composant que l'on sélectionne au meilleur rapport prix-performance, pas comme un actif différenciant à posséder. C'est exactement la posture qu'adopte une direction des achats face à une commodité.



## Ce que révèle un modèle d'IA « au choix »



Quand l'entreprise la plus fermée de la tech transforme le modèle d'IA en menu déroulant, elle envoie un message clair : le modèle n'est plus le produit, il devient une pièce remplaçable. Pendant deux ans, le discours dominant voulait que la victoire revienne à qui détient le LLM le plus puissant. Apple vient d'acter l'inverse en rendant ce LLM interchangeable d'un simple réglage, au même titre que le moteur de recherche par défaut.

Ce basculement déplace la valeur. Si le modèle se remplace en deux clics, le pouvoir ne réside plus dans le modèle mais dans ce qui l'entoure : la distribution et le contexte. La distribution, c'est le parc d'environ 1,4 milliard d'iPhone actifs par lequel Apple devient le guichet d'entrée vers l'IA pour un public de masse, en position d'arbitre entre Google, OpenAI et Anthropic. Le contexte, c'est la couche qui rend une réponse utile : vos données, vos applications, vos permissions, que seul Apple orchestre via Private Cloud Compute. Les fournisseurs de modèles, eux, se retrouvent en concurrence frontale pour une case de réglage.

La leçon vaut au-delà d'Apple : à mesure que les modèles de pointe convergent en qualité et que leur coût d'accès baisse, la rente migre vers les couches que l'on ne peut pas commuter d'un clic. Posséder le meilleur modèle d'un trimestre ne protège plus ; maîtriser la distribution et le contexte, oui.



## Portabilité des modèles : le réflexe à adopter en entreprise



Pour une entreprise qui déploie de l'IA, la décision d'Apple se traduit en une règle simple : ne jamais coder en dur un seul fournisseur de modèle. Le bon réflexe est de construire au-dessus d'une couche d'abstraction, où le modèle se change sans réécrire l'application, et de choisir le modèle tâche par tâche selon le triptyque coût, latence, qualité. Un résumé d'e-mail n'a pas besoin du modèle le plus cher ; une analyse juridique, peut-être.

Cette portabilité n'est pas qu'une coquetterie d'architecte. Elle protège contre trois risques très concrets : la hausse unilatérale des prix d'un fournisseur, la dépréciation d'un modèle que l'on retire du catalogue, et la dépendance à un acteur dont les conditions d'usage peuvent changer. Anthropic vient de retirer Claude Opus 4.1 de son offre, avec une migration imposée vers Opus 4.8 ; toute entreprise qui avait figé sa stack sur une version précise l'a appris à ses dépens. Concevoir pour la substitution, c'est s'épargner ce genre de réécriture en urgence.

Le corollaire est tout aussi important : si le modèle devient une commodité, l'avantage durable se construit ailleurs. Dans la qualité des données qu'on lui donne à lire, dans la finesse des automatisations qui l'entourent, dans l'intégration au système d'information existant. Le modèle se loue ; le contexte propre et les processus, eux, se bâtissent et ne se copient pas en un clic.



## Ce que ça change dans mon quotidien de freelance



Cette logique guide déjà mes choix techniques. Sur mon [dashboard Bloomberg piloté par Claude Haiku 4.5](https://mathieuhaye.fr/#projets), qui suit mon portefeuille personnel, je n'ai pas retenu le modèle le plus prestigieux mais celui dont le rapport coût-latence collait à l'usage : des analyses fréquentes, courtes, à servir vite et à bas prix. Le même réflexe qu'Apple appliquant un calcul d'achat à Gemini, à l'échelle d'un projet solo.

Sur mes missions de données et d'automatisation, je conçois pour la substitution dès le départ. Une chaîne n8n ou un connecteur CRM ne doivent pas dépendre d'un modèle unique : l'appel au modèle est isolé, paramétrable, remplaçable, pour pouvoir basculer si un fournisseur change ses prix ou retire une version. Ce qui fait la valeur d'une mission n'est jamais le LLM choisi ce mois-ci, c'est la propreté des données en amont et la solidité des automatisations en aval. Apple confirme à l'échelle de 1,4 milliard d'appareils ce que je vérifie à l'échelle d'une PME : le modèle est interchangeable, le contexte ne l'est pas.



## Le take-away



Apple vient de rendre public ce que le marché pressentait : à l'ère où les modèles convergent, le modèle d'IA devient un réglage, et la valeur se loge dans la distribution et le contexte. La vraie question pour un dirigeant n'est plus « quel modèle choisir », mais « mon IA reste-t-elle débranchable et rebranchable sans tout réécrire ? »



## Questions fréquentes



### Pourquoi Apple a-t-elle choisi Gemini plutôt que Claude ou ChatGPT pour Siri ?



Apple a retenu Gemini de Google pour des raisons de prix : Anthropic réclamait plusieurs milliards de dollars par an, avec un tarif censé doubler chaque année pendant trois ans, quand Google a proposé un modèle Gemini sur-mesure pour environ 1 milliard de dollars par an. Apple touchant déjà près de 20 milliards de dollars par an de Google pour la recherche par défaut, ce coût restait modeste à son échelle.



### Qu'est-ce que les Extensions d'Apple Intelligence ?



Les Extensions sont un cadre d'API introduit avec iOS 27, iPadOS 27 et macOS 27 qui permet à un fournisseur d'IA tiers de se brancher sur les fonctions d'Apple Intelligence. Concrètement, l'utilisateur pourra choisir dans les réglages quel modèle (Gemini, Claude, ChatGPT ou un autre) alimente Siri, les Writing Tools et Image Playground, mettant fin à l'exclusivité de ChatGPT.



### Pourra-t-on remplacer Gemini par Claude ou ChatGPT sur iPhone ?



Oui. Gemini sera le modèle par défaut du nouveau Siri, mais à partir de l'automne 2026, iOS 27 laissera l'utilisateur désigner Claude, ChatGPT ou un autre service compatible Extensions comme moteur d'Apple Intelligence. Le modèle d'IA devient un réglage que l'on change dans les paramètres, au même titre que le moteur de recherche par défaut. [Analyse complémentaire sur TechRadar](https://www.techradar.com/ai-platforms-assistants/apple-intelligence/apple-is-about-to-let-you-replace-its-ai-with-chatgpt-gemini-and-claude-and-it-could-change-the-iphone-forever).

---

Source: [https://mathieuhaye.fr/blog/2026-06-08-apple-gemini-siri-modele-ia-interchangeable](https://mathieuhaye.fr/blog/2026-06-08-apple-gemini-siri-modele-ia-interchangeable) | Other language: [https://mathieuhaye.fr/blog/en/2026-06-08-apple-gemini-siri-modele-ia-interchangeable](https://mathieuhaye.fr/blog/en/2026-06-08-apple-gemini-siri-modele-ia-interchangeable)
