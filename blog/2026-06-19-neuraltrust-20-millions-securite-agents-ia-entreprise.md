---
title: "NeuralTrust lève 20 M$ pour gouverner les agents IA"
date: 2026-06-19T08:00:00+02:00
language: fr
slug: 2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise
url: https://mathieuhaye.fr/blog/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise
alternate: https://mathieuhaye.fr/blog/en/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise
category: IA appliquée
description: "NeuralTrust lève 20 M$, le plus gros seed cyber d'une entreprise UE, pour cartographier et sécuriser les agents IA déployés en entreprise. Mon analyse."
---

# NeuralTrust lève 20 M$ pour gouverner les agents IA

> NeuralTrust lève 20 M$, le plus gros seed cyber d'une entreprise UE, pour cartographier et sécuriser les agents IA déployés en entreprise. Mon analyse.

**TL;DR :** NeuralTrust, start-up de cybersécurité basée à Barcelone, a annoncé le 17 juin 2026 une levée de 20 millions de dollars (17,2 millions d'euros), présentée comme le plus gros tour d'amorçage cybersécurité jamais bouclé par une entreprise de l'Union européenne, pour sécuriser et gouverner les agents IA déployés en entreprise.



## L'essentiel en 30 secondes



                - **20 millions de dollars (17,2 millions d'euros)** levés par NeuralTrust en seed le 17 juin 2026, le plus gros seed cybersécurité d'une entreprise de l'UE à ce jour.

                - Tour mené par **Alstin Capital** (Munich), avec Seaya, Kibo Ventures, VentureFriends, EA Ventures Plug and Play Fund et la banque Banc Sabadell.

                - La plateforme repose sur trois briques : **TrustGate** (passerelle des appels modèles), **TrustGuard** (détection d'attaques en temps réel) et **TrustLens** (cartographie des agents).

                - Gartner anticipe que **plus de 40 % des projets d'IA agentique seront abandonnés d'ici fin 2027**, en grande partie pour des raisons de coûts et de gouvernance.





## Le fait



NeuralTrust, fondée en 2024 à Barcelone par Joan Vendrell (PDG), Victor Garcia et Alejandro Domingo, a bouclé un tour d'amorçage de 20 millions de dollars, soit 17,2 millions d'euros. Le tour est mené par le fonds munichois Alstin Capital, rejoint par Seaya, Kibo Ventures, VentureFriends, le fonds EA Ventures Plug and Play, la banque catalane Banc Sabadell, le Conseil européen de l'innovation et l'Agence espagnole de la recherche. La société revendique le plus important financement d'amorçage en cybersécurité jamais levé par une entreprise de l'Union européenne, d'après [The Next Web](https://thenextweb.com/news/neuraltrust-20-million-seed-ai-agent-security).

Le produit s'attaque à un problème précis : les grandes entreprises connectent des agents IA à leurs systèmes internes plus vite que leurs équipes de sécurité ne peuvent les suivre. NeuralTrust place une couche centrale entre les agents et les modèles, avec trois composants : *TrustGate* sert de passerelle pour tous les appels aux modèles, *TrustGuard* détecte les attaques en cours d'exécution, et *TrustLens* cartographie et surveille les agents actifs. La plateforme inspecte des millions d'interactions d'agents par jour et signale environ 1,2 % d'entre elles comme malveillantes, soit près d'une sur 80.

Les chiffres de traction sont nets : 92 % des clients de NeuralTrust affichent plus de 1 milliard de dollars de revenu annuel, et la société indique avoir doublé son revenu annuel récurrent de 2025 sur le seul premier trimestre 2026, selon [TechFundingNews](https://techfundingnews.com/neuraltrust-20m-europe-largest-cybersecurity-seed-ai-agents/). Parmi les clients cités figurent Iberia, Air Europa, Abanca et Banc Sabadell. Joan Vendrell résume le risque sans détour : *« Si vous connectez l'IA à votre messagerie et qu'elle envoie des e-mails vers l'extérieur, en laissant fuiter des informations internes, c'est une catastrophe. »*



## Pourquoi la gouvernance devient le vrai goulot d'étranglement ?



La gouvernance des agents est devenue le principal frein au passage en production de l'IA agentique. Gartner anticipe que plus de 40 % des projets d'IA agentique seront abandonnés d'ici fin 2027, en partie à cause de coûts mal maîtrisés et d'une gouvernance insuffisante, d'après son [communiqué publié en juin 2025](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027). Le pilote fonctionne, la démonstration impressionne, puis le projet cale au moment de répondre à une question simple : qui contrôle ce que l'agent peut lire, écrire et déclencher ?

Un agent IA n'est pas une application classique. Une application a un périmètre figé : ses droits d'accès sont définis au déploiement et ne bougent plus. Un agent, lui, décide à l'exécution quels outils appeler, quelles données lire et quelles actions enchaîner. Le périmètre d'accès devient dynamique, donc difficile à auditer après coup. C'est exactement ce vide que NeuralTrust veut combler : rendre visible et journalisable ce qui était jusque-là une boîte noire opérationnelle.

Le timing de la levée n'est pas un hasard. En 2024 et 2025, les entreprises ont surtout investi pour *déployer* des agents. En 2026, la question a changé de nature : il ne s'agit plus de savoir si les agents fonctionnent, mais de savoir lesquels tournent, avec quels droits et sous quelle surveillance. Le marché bascule de la phase « est-ce que ça marche » à la phase « est-ce que c'est tenable ». Et cette bascule crée une catégorie de produits qui n'existait pas il y a deux ans.



## Agent sprawl : le risque que personne ne mesure



L'*agent sprawl* désigne la prolifération d'agents IA déployés plus vite que l'entreprise ne peut les recenser. Le terme reprend la logique du *shadow IT*, ces outils installés par les équipes sans validation de la DSI, et la pousse d'un cran : un agent ne se contente pas d'exister, il agit. Il lit des fichiers, écrit dans un CRM, envoie des messages, déclenche des paiements. Chaque connexion à un outil ajoute une porte d'entrée et une sortie de données.

Le chiffre de 1,2 % d'interactions malveillantes détectées par NeuralTrust paraît faible, mais il faut le rapporter au volume. Sur des millions d'interactions quotidiennes, une sur 80 qui dérape représente des milliers d'événements à risque par jour pour une seule grande entreprise. Le problème n'est pas qu'un agent soit malveillant par conception ; c'est qu'un agent légitime, mal cadré ou détourné par une injection de prompt, agisse avec les droits d'un collaborateur sans en avoir le jugement.

Cette levée s'inscrit dans un mouvement plus large. La sécurité et la gouvernance des agents sont devenues une thèse d'investissement à part entière : identité des agents, journalisation des appels, contrôle des permissions sur le protocole MCP (Model Context Protocol, le standard qui connecte les agents aux outils). NeuralTrust occupe le créneau de l'observabilité et du filtrage en temps réel. La promesse commune : on ne déploie pas en production ce qu'on ne peut pas voir.



## Souveraineté européenne : un angle assumé



NeuralTrust se positionne explicitement comme une alternative non américaine, en misant sur le règlement européen sur l'IA (AI Act) et la préférence d'une partie des entreprises du continent pour des solutions de sécurité locales. Joan Vendrell le formule directement : *« Il y a aujourd'hui de vrais enjeux de souveraineté technologique et de défense au sein de l'UE. »* L'argument porte d'autant plus que la sécurité touche aux données les plus sensibles : déléguer le filtrage de ses agents à un fournisseur soumis à un droit extraterritorial est un choix que beaucoup de directions juridiques européennes regardent désormais de près.

La présence au capital de Banc Sabadell, du Conseil européen de l'innovation et de l'Agence espagnole de la recherche n'est pas neutre : elle ancre la société dans un écosystème institutionnel européen. Reste à voir si cet argument de souveraineté suffira face à des acteurs américains mieux dotés. Mais le fait qu'un seed cybersécurité atteigne 20 millions de dollars en Europe indique que les investisseurs croient à une fenêtre de tir spécifiquement européenne sur ce sujet.



## Le lien avec mon quotidien



Je construis des workflows d'automatisation qui touchent de vrais outils, et c'est précisément là que le discours de NeuralTrust résonne. Sur **IA Brew**, ma newsletter générée automatiquement, le pipeline n8n compte 93 nœuds qui lisent des sources, appellent des modèles et publient du contenu. Sur la veille concurrentielle de la **Fromagerie Ermitage**, un workflow agentique scrute le marché et restitue des synthèses. À chaque fois, la vraie question n'est pas « est-ce que ça produit le bon résultat », mais « qu'est-ce que ce workflow a le droit de lire et de déclencher, et comment je le sais ».

Le même réflexe vaut côté CRM. Quand j'intègre des automatisations dans **Salesforce** pour la plateforme 3018 d'e-Enfance, ou des règles dans **Pipedrive** pour une mission de revenue operations, le périmètre des permissions est la première chose à cadrer, avant même la logique métier. Un agent qui écrit dans un CRM sans garde-fou, c'est une fuite de données à retardement. Ce que vend NeuralTrust aux grands comptes, je l'applique à mon échelle : journaliser, limiter les droits au strict nécessaire, et garder une vue claire de ce que chaque automatisation peut faire.



## À retenir



La vraie nouvelle n'est pas qu'une start-up de plus ait levé des fonds, mais que la sécurité des agents soit devenue une catégorie autonome, financée à hauteur de 20 millions de dollars dès l'amorçage. Si vous déployez des agents en 2026, la question utile n'est plus « que peuvent-ils faire » mais « que sauriez-vous expliquer s'ils faisaient une bêtise ce soir ? »



## Questions fréquentes



### Qu'est-ce que l'agent sprawl ?



L'agent sprawl désigne la prolifération d'agents IA déployés dans une entreprise plus vite que les équipes ne peuvent les recenser. Chaque agent connecté à un outil (messagerie, CRM, base de données) crée une nouvelle surface d'accès, souvent sans inventaire ni règles de permission claires.



### Que fait la plateforme NeuralTrust ?



NeuralTrust sécurise les agents IA en entreprise via trois briques : TrustGate, une passerelle qui centralise les appels aux modèles ; TrustGuard, qui détecte les attaques en temps réel ; et TrustLens, qui cartographie et suit les agents actifs. L'objectif est de rendre visibles et contrôlables des agents jusque-là invisibles.



### Pourquoi la gouvernance freine-t-elle l'IA agentique ?



Gartner anticipe que plus de 40 % des projets d'IA agentique seront abandonnés d'ici fin 2027, souvent à cause de coûts mal maîtrisés et d'une gouvernance insuffisante. Sans visibilité sur ce que les agents peuvent lire, écrire et déclencher, les entreprises ne passent pas du prototype à la production.

---

Source: [https://mathieuhaye.fr/blog/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise](https://mathieuhaye.fr/blog/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise) | Other language: [https://mathieuhaye.fr/blog/en/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise](https://mathieuhaye.fr/blog/en/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise)
