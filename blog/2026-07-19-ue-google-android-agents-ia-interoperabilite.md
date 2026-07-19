---
title: "L'UE force Google à ouvrir Android aux agents IA rivaux"
date: 2026-07-19T09:00:00+02:00
language: fr
slug: 2026-07-19-ue-google-android-agents-ia-interoperabilite
url: https://mathieuhaye.fr/blog/2026-07-19-ue-google-android-agents-ia-interoperabilite
alternate: https://mathieuhaye.fr/blog/en/2026-07-19-ue-google-android-agents-ia-interoperabilite
category: Régulation
description: "Le 16 juillet 2026, l'UE a ordonné à Google d'ouvrir 11 fonctions d'Android aux assistants IA rivaux, au même niveau que Gemini. Ce que ça change."
---

# L'UE force Google à ouvrir Android aux agents IA rivaux

> Le 16 juillet 2026, l'UE a ordonné à Google d'ouvrir 11 fonctions d'Android aux assistants IA rivaux, au même niveau que Gemini. Ce que ça change.

**L'essentiel en 30 secondes**

- Le 16 juillet 2026, la Commission européenne a imposé à Google, au titre du règlement sur les marchés numériques (DMA, Digital Markets Act), d'ouvrir onze fonctionnalités d'Android aux assistants IA concurrents, au même niveau d'accès que Gemini.

- Ces mesures doivent arriver dans la prochaine version majeure du système, Android 18, et être pleinement appliquées au plus tard le 1er août 2027.

- Une seconde décision oblige Google à partager avec les moteurs de recherche et les chatbots rivaux les données de recherche qu'il collecte à grande échelle, sous forme anonymisée et à prix encadré, dès janvier 2027.

- La Commission estime qu'environ 60 % des utilisateurs de smartphones dans l'Union sont concernés ; Google prévient que ces règles risquent d'affaiblir des garde-fous de sécurité et de vie privée.

Pendant deux ans, la course aux agents IA s'est jouée sur la puissance des modèles. La décision de la Commission européenne du 16 juillet 2026 déplace le terrain de jeu là où l'usage se décide vraiment : le point d'accès sur le téléphone. En obligeant Google à ouvrir Android à ses concurrents, Bruxelles traite l'endroit d'où l'on invoque un assistant comme une infrastructure partagée, et non comme une chasse gardée.

## Ce que la Commission a décidé le 16 juillet

Le 16 juillet 2026, la Commission européenne a adopté deux décisions de spécification contraignantes visant Alphabet, la maison mère de Google, dans le cadre du DMA ([Commission européenne](https://digital-markets-act.ec.europa.eu/commission-provides-guidance-google-ai-interoperability-android-and-sharing-google-search-data-under-2026-07-16_en)). La première porte sur l'interopérabilité des assistants IA : Google doit donner aux services concurrents le même accès qu'à Gemini à onze fonctionnalités d'Android. Concrètement, un assistant rival doit pouvoir être déclenché à la voix, comme "Hey Google", ou depuis le bouton d'accueil ; agir dans les applications et d'une application à l'autre, y compris pour des tâches longues qui tournent en arrière-plan ; accéder au contexte des applications et aux capteurs de l'appareil ; et disposer des ressources matérielles et logicielles nécessaires, jusqu'aux modèles d'IA embarqués sur le téléphone ([MacRumors](https://www.macrumors.com/2026/07/16/eu-google-ai-apps-android-access/)).

La seconde décision oblige Google à partager les données de recherche qu'il est seul à collecter à cette échelle avec les moteurs concurrents, et désormais aussi avec les chatbots qui proposent une fonction de recherche. Le partage, prévu pour débuter en janvier 2027, se fera sur des données anonymisées, selon une méthode élaborée avec des experts de la vie privée et une formule de prix jugée équitable. Google dispose de la prochaine version majeure du système, Android 18, pour se conformer, avec une échéance ferme fixée au 1er août 2027, soit environ un an après la décision. La Commission chiffre à près de 60 % la part des utilisateurs de smartphones de l'Union concernés par ces changements ([Computerworld](https://www.computerworld.com/article/4198420/google-must-open-android-to-rival-ai-agents-eu-orders.html)).

## Pourquoi la bataille des agents se joue sur le téléphone ?

La bataille des agents se joue sur le téléphone parce que le meilleur assistant du monde reste invisible s'il ne peut pas être appelé. Sur Android, le geste par défaut, presser le bouton d'accueil ou dire "Hey Google", menait jusqu'ici vers Gemini, et lui seul disposait d'un accès complet au contexte, aux capteurs et aux modèles embarqués. Un concurrent, même supérieur en qualité de réponse, partait avec deux ou trois clics de retard et un accès dégradé aux données de l'appareil. Dans un marché où l'usage se gagne à la friction près, ce désavantage est décisif.

C'est pourquoi la décision compte bien au-delà du duel Google contre OpenAI ou Perplexity. Elle acte que la couche de distribution des agents, l'endroit d'où on les invoque et ce qu'ils ont le droit de toucher, devient un bien commun réglementé, au même titre que l'a été l'accès au navigateur ou au moteur de recherche à l'époque du web. Pour un éditeur d'assistant, l'accès au bouton d'accueil vaut aujourd'hui plus cher que quelques points de performance sur un banc d'essai.

## Ce que l'UE standardise vraiment : l'invocation et le contexte

Au fond, les onze fonctionnalités listées par la Commission décrivent un contrat technique : comment un agent est déclenché, ce qu'il peut lire, et ce qu'il peut faire à la place de l'utilisateur. C'est exactement le problème que le secteur essaie de résoudre par le bas avec des protocoles comme le MCP (Model Context Protocol), qui normalise la façon dont un agent se connecte à des outils et à des données. La différence, c'est que Bruxelles impose cette interopérabilité par le haut, sur la surface la plus convoitée du marché : le smartphone.

Le risque soulevé par Google mérite d'être pris au sérieux plutôt que balayé. Donner à un assistant tiers le droit d'agir dans les applications et de lire le contexte de l'appareil ouvre une surface d'attaque réelle. Kent Walker, responsable des affaires internationales de Google, avertit que ces décisions "risquent d'affaiblir des garde-fous essentiels de vie privée et de sécurité pour des millions d'Européens", et affirme que l'entreprise avait proposé d'autres solutions. Roman Stanek, PDG de Good Data AI, résume le vrai chantier côté entreprises : les responsables sécurité doivent cesser de traiter "assistant IA" comme une permission unique et bien comprise. Autrement dit, l'interopérabilité imposée déplace la charge de la sécurité vers une gestion fine des droits accordés à chaque agent.

## Ce que ça change quand on construit des agents

Pour qui construit des agents et des automatisations, la leçon est concrète : le point de blocage n'est presque jamais le modèle, c'est l'accès. La valeur d'un agent se mesure à ce qu'il peut réellement déclencher dans les outils métier, pas à sa qualité de rédaction. C'est la même logique que sur mes missions : les 93 nœuds n8n qui font tourner la newsletter d'IA Brew ou l'intégration de la téléphonie 3CX dans le Salesforce d'e-Enfance ne valent pas par le morceau intelligent, mais par le câblage qui donne à l'agent le droit d'agir sur les bons systèmes, avec les bonnes permissions.

La décision européenne pousse ce câblage vers un standard sur le téléphone, mais la question qu'elle pose est universelle : quels droits accorde-t-on à un agent, et comment les révoque-t-on ? Une PME qui déploie un assistant commercial doit se poser la même question que la Commission pose à Google. Ouvrir l'accès crée de la valeur ; l'ouvrir sans gouvernance des permissions crée un risque. Le bon réflexe n'est pas de tout verrouiller, mais de savoir exactement ce que chaque agent peut lire et exécuter.

La vraie nouvelle du 16 juillet n'est pas qu'un régulateur ait sanctionné Google de plus. C'est que le champ de bataille des agents s'est officiellement déplacé du modèle vers la distribution. En 2027, la question ne sera plus "quel assistant répond le mieux", mais "lequel a le droit d'agir, et depuis où".

## Questions fréquentes

### Qu'a décidé l'Union européenne contre Google le 16 juillet 2026 ?

La Commission européenne a adopté deux décisions contraignantes au titre du DMA. La première oblige Google à ouvrir onze fonctionnalités d'Android aux assistants IA concurrents, au même niveau d'accès que Gemini. La seconde impose le partage de ses données de recherche avec les moteurs et chatbots rivaux, sous forme anonymisée, à partir de janvier 2027.

### À quelle échéance Google doit-il se conformer ?

Google doit intégrer les mesures d'interopérabilité IA dans la prochaine version majeure d'Android, Android 18, avec une conformité pleine et entière au plus tard le 1er août 2027, soit environ un an après la décision du 16 juillet 2026. Le partage des données de recherche, lui, doit débuter dès janvier 2027.

### Pourquoi cette décision compte-t-elle pour les agents IA ?

Parce qu'elle fait de la couche de distribution, le point depuis lequel un agent est invoqué et ce qu'il peut toucher, une infrastructure ouverte plutôt qu'une chasse gardée. Sur mobile, l'accès au bouton d'accueil, au contexte et aux capteurs pèse davantage que quelques points de performance sur un banc d'essai. La décision fixe de fait un standard d'invocation et de permissions pour les assistants.

---

Source: [https://mathieuhaye.fr/blog/2026-07-19-ue-google-android-agents-ia-interoperabilite](https://mathieuhaye.fr/blog/2026-07-19-ue-google-android-agents-ia-interoperabilite) | Other language: [https://mathieuhaye.fr/blog/en/2026-07-19-ue-google-android-agents-ia-interoperabilite](https://mathieuhaye.fr/blog/en/2026-07-19-ue-google-android-agents-ia-interoperabilite)
