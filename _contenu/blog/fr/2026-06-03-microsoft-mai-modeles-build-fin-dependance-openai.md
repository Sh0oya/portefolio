---
title: "Microsoft Build 2026: 7 modèles IA pour sortir d'OpenAI"
date: 2026-06-03T08:00:00+02:00
language: fr
slug: 2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai
url: https://mathieuhaye.fr/blog/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai
alternate: https://mathieuhaye.fr/blog/en/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai
category: IA appliquée
description: "Le 2 juin 2026, Microsoft a dévoilé sept modèles IA maison à Build, dont MAI-Thinking-1 (35 milliards de paramètres actifs). Fin de la dépendance Azure à OpenAI."
---

# Microsoft Build 2026: 7 modèles IA pour sortir d'OpenAI

> Le 2 juin 2026, Microsoft a dévoilé sept modèles IA maison à Build, dont MAI-Thinking-1 (35 milliards de paramètres actifs). Fin de la dépendance Azure à OpenAI.

- **L'essentiel en 30 secondes:**

                - Microsoft a présenté 7 modèles IA maison à Build 2026 le 2 juin, sous la bannière MAI.

                - MAI-Thinking-1 active 35 milliards de paramètres sur 1 000 milliards théoriques, avec une fenêtre de contexte de 256 000 tokens.

                - Le modèle atteint 97,0 % sur AIME 2025 et égale Claude Opus 4.6 sur SWE-Bench Pro selon les évaluations internes Microsoft.

                - Mustafa Suleyman annonce un coût d'inférence dix fois inférieur à GPT-5 sur les benchmarks préparés avec McKinsey.





## Le fait



Pendant huit ans, Azure s'est confondu avec OpenAI. Le 2 juin 2026, Microsoft a rompu cette équation lors de sa conférence Build à San Francisco. Mustafa Suleyman, directeur général de Microsoft AI, a présenté sept modèles d'intelligence artificielle conçus en interne sous la bannière MAI. Le plus visible, MAI-Thinking-1, est un système de raisonnement de 35 milliards de paramètres actifs construit sur une architecture sparse Mixture of Experts d'environ 1 000 milliards de paramètres totaux, doté d'une fenêtre de contexte de 256 000 tokens. Selon la documentation publiée par Microsoft, il atteint 97,0 % sur le benchmark mathématique AIME 2025 et 94,5 % sur AIME 2026, et égale Claude Opus 4.6 d'Anthropic sur le test de génération de code SWE-Bench Pro. Des évaluateurs humains anonymes l'ont préféré à Claude Sonnet 4.6 en comparaison à l'aveugle.

Le modèle est disponible en preview privée sur la plateforme Microsoft Foundry depuis le 2 juin 2026. Il s'accompagne de MAI-Code-1-Flash, premier modèle Microsoft dédié à la génération de code applicatif, et de cinq autres modèles plus spécialisés. Mustafa Suleyman affirme, dans [une déclaration relayée par CNBC](https://www.cnbc.com/2026/06/02/microsoft-unveils-new-ai-models-lessen-reliance-on-openai-lower-costs.html), que les benchmarks préparés avec le cabinet McKinsey montrent un coût d'inférence dix fois inférieur à celui de GPT-5 pour des résultats comparables. L'annonce s'inscrit dans la suite directe de l'amendement signé en avril 2026 entre Microsoft et OpenAI, qui a mis fin à la licence exclusive accordée à Microsoft sur la propriété intellectuelle d'OpenAI et supprimé l'obligation de reverser une part de revenus à OpenAI; la part reversée par OpenAI à Microsoft reste plafonnée jusqu'en 2030. Microsoft a publié ses résultats sous forme de preprint, [comme l'a souligné TechTimes](https://www.techtimes.com/articles/317631/20260602/microsoft-build-2026-mai-thinking-1-first-house-reasoning-model-trained-without-openai-data.htm), sans relecture par pairs ni reproduction indépendante à ce jour.



## Pourquoi Microsoft choisit l'autonomie maintenant ?



Microsoft choisit l'autonomie en juin 2026 parce que le coût d'OpenAI pesait directement sur sa marge cloud, et parce que la dépendance technique était devenue intenable face à AWS et Google. L'éditeur a versé pendant cinq ans une part significative des revenus Azure à OpenAI au titre de la licence exclusive, alors que les usages explosaient. Les agents IA, les complétions de code, les chatbots intégrés à Office: chaque produit Microsoft payait OpenAI à chaque appel d'inférence. L'amendement d'avril 2026 a desserré le nœud financier, le lancement des MAI le coupe net.

Le second levier est stratégique. Une plateforme cloud qui dépend d'un seul fournisseur de modèles porte une vulnérabilité concurrentielle structurelle. Si OpenAI augmente ses prix, Microsoft les répercute. Si OpenAI accuse un retard technique, Azure accuse le même retard. En internalisant la couche modèle, Microsoft reprend le contrôle de la roadmap, du calendrier de release et de la marge. C'est la logique appliquée par Amazon Web Services avec Bedrock et par Google Cloud avec Gemini: chaque hyperscaler veut posséder son propre catalogue de modèles.

Le troisième levier, le moins commenté, est le contrôle du plan d'inférence. Microsoft Foundry sert désormais de plan de contrôle unique pour orchestrer modèles maison, modèles OpenAI, modèles partenaires et modèles open source. Pour un acheteur grand compte, le message est limpide: vous achetez la plateforme, vous arbitrez ensuite entre fournisseurs sans changer d'API, sans réécrire vos workflows agents. C'est le même argumentaire que Bedrock chez AWS, transposé sur Azure. La différence est nette: Microsoft contrôle désormais l'un des fournisseurs de sa propre liste.



## Quelle est la valeur des benchmarks annoncés ?



La valeur des benchmarks annoncés par Microsoft mérite un examen serré, car les évaluations ont été publiées en preprint sans relecture par pairs ni reproduction indépendante. Les comparaisons à Claude Opus 4.6 sur SWE-Bench Pro et la préférence humaine sur Claude Sonnet 4.6 reposent sur des évaluations décrites par Microsoft lui-même. Les laboratoires Anthropic, OpenAI et DeepMind appliquent la même précaution avec leurs propres benchmarks, mais l'historique du secteur invite à la prudence: un modèle annoncé au niveau d'un concurrent peut décrocher dès qu'il rencontre des charges de travail en production.

Le chiffre du coût dix fois inférieur à GPT-5 vient des benchmarks préparés avec McKinsey, c'est-à-dire d'un cabinet client de Microsoft Foundry. La méthodologie complète n'est pas publique. Ce qui est vérifiable, en revanche, c'est l'architecture: une approche sparse Mixture of Experts active seulement 35 milliards de paramètres sur les 1 000 milliards théoriques pour chaque requête. À architecture égale, ce type de design réduit mécaniquement le coût d'inférence par token, à condition que le système de routage soit efficace. Si Microsoft a réussi cet équilibrage, la promesse de coût devient plausible, même si le facteur dix doit encore être validé sur des charges hétérogènes.

L'enjeu pour les directions techniques n'est donc pas de prendre les chiffres au pied de la lettre, mais de tester MAI-Thinking-1 sur leurs propres cas d'usage. Les retours terrain des prochains trimestres pèseront davantage que les preprints. Microsoft basculera vraisemblablement une partie de ses produits internes Copilot vers MAI sur l'année à venir, ce qui constituera le premier vrai test à l'échelle. Avant cela, toute promesse de migration depuis Claude ou GPT-5 reste un pari.



## Ce que ça change pour les acheteurs entreprise



Pour les directions des systèmes d'information, la conséquence immédiate est tactique: Microsoft devient un négociateur de catalogue, là où il portait jusqu'ici une rente sur un fournisseur unique. Les contrats Azure renégociés en seconde moitié 2026 contiendront mécaniquement des clauses sur la portabilité entre MAI, GPT-5 et modèles partenaires. Les acheteurs avisés demanderont des engagements de prix indexés sur les modèles les moins chers du catalogue, pas sur les modèles propriétaires premium.

La deuxième conséquence est plus profonde. Pendant cinq ans, l'argument commercial de Microsoft tenait dans la qualité de GPT-4 puis de GPT-5. Le nouveau récit affirme que la qualité naît du choix du bon modèle pour la bonne tâche. Cela impose aux équipes IT d'apprendre à comparer, à benchmarker en interne, à mesurer la qualité par cas d'usage plutôt qu'à s'en remettre à un label unique. C'est exactement le travail que les éditeurs comme OpenRouter, Vellum ou Promptfoo monétisent déjà à petite échelle, et qui devient un réflexe de gouvernance plutôt qu'un sport d'expert.

La troisième conséquence touche la concurrence entre hyperscalers. AWS pousse Bedrock comme une plateforme agnostique. Google pousse Vertex AI avec Gemini. Microsoft Foundry rejoint cette logique avec en plus une carte unique: son intégration native dans Office, Teams, Outlook et Windows. Le combat ne porte plus sur le modèle qui gagne, mais sur la plateforme qui orchestre le mieux la diversité. Les entreprises qui sortiront vainqueurs seront celles qui auront construit une couche d'abstraction interne pour basculer d'un modèle à l'autre sans tout réécrire.



## Ce que ça change dans mon quotidien de freelance



Cette logique multi-modèles est exactement celle que j'applique en mission depuis dix-huit mois. Pour le scorer d'offres d'emploi avec génération de CV ATS que je maintiens, j'ai testé quatre fournisseurs sur le même jeu de quarante annonces. Les écarts de qualité étaient minimes, les écarts de coût allaient du simple au quadruple. Le choix final s'est porté sur deux modèles distincts: un raisonnement plus fort pour la note d'analyse, un modèle plus léger pour la génération CV. La qualité utile au cas d'usage tient rarement sur un seul fournisseur.

Côté [Bloomberg Dashboard](https://mathieuhaye.fr/#projets) appliqué à mon portefeuille personnel, Claude Haiku 4.5 suffit à scorer les positions au quotidien; un modèle plus lourd serait du gaspillage. La même discipline structure le pipeline n8n à 93 nœuds que j'ai construit pour la [Fromagerie Ermitage](https://mathieuhaye.fr/#projets): un modèle de classification rapide en amont, un modèle de rédaction plus exigeant en aval. L'annonce Microsoft confirme que cette pratique deviendra la norme. La compétence vendable en freelance n'est plus de prompter; c'est d'arbitrer entre fournisseurs sur un cas d'usage précis, métrique en main. C'est exactement ce que j'apporte aux PME qui veulent [travailler avec moi](/collaboration) sur leurs projets IA.



## Questions fréquentes



### Quelle est la différence entre MAI-Thinking-1 et MAI-Code-1-Flash ?



MAI-Thinking-1 est un modèle de raisonnement de 35 milliards de paramètres actifs avec une fenêtre de contexte de 256 000 tokens, conçu pour les tâches longues et analytiques. MAI-Code-1-Flash est un modèle plus léger spécialisé dans la génération de code à partir d'instructions en langage naturel. Les deux sont disponibles sur Microsoft Foundry depuis le 2 juin 2026.



### Le partenariat Microsoft-OpenAI est-il rompu ?



Non, mais il a été profondément réécrit en avril 2026. Microsoft a perdu sa licence exclusive sur la propriété intellectuelle d'OpenAI et n'a plus à reverser une part de revenus à OpenAI. OpenAI continue toutefois de reverser une part plafonnée de ses revenus à Microsoft jusqu'en 2030.



### Faut-il migrer vos workflows Azure vers les modèles MAI ?



Pas immédiatement. MAI-Thinking-1 est disponible en preview privée et ses performances réelles en production restent à valider sur des charges hétérogènes. La bonne approche consiste à benchmarker MAI sur deux ou trois cas d'usage internes représentatifs avant d'arbitrer entre MAI, GPT-5 et modèles partenaires sur la même plateforme Foundry.



---



L'ère du fournisseur unique est terminée. Microsoft, qui en avait tiré la rente la plus visible avec OpenAI, vient d'acter le passage à un monde multi-modèles. Reste à voir si les MAI tiendront en production ce que leurs preprints annoncent. La question n'est plus de savoir quel modèle gagne, mais quelle équipe sait arbitrer vite, sur la bonne métrique, au bon moment.

---

Source: [https://mathieuhaye.fr/blog/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai](https://mathieuhaye.fr/blog/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai) | Other language: [https://mathieuhaye.fr/blog/en/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai](https://mathieuhaye.fr/blog/en/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai)
