---
title: "IA systémique : la Bank of England passe aux simulations"
date: 2026-04-20
language: fr
slug: 2026-04-20-bank-of-england-ia-stabilite-financiere
url: https://mathieuhaye.fr/blog/2026-04-20-bank-of-england-ia-stabilite-financiere
alternate: https://mathieuhaye.fr/blog/en/2026-04-20-bank-of-england-ia-stabilite-financiere
category: ALM & Risque
description: "Le 16 avril 2026, la Bank of England confirme qu'elle teste l'IA en scénario de stabilité financière. Fin du wait-and-see réglementaire."
---

# IA systémique : la Bank of England passe aux simulations

> Le 16 avril 2026, la Bank of England confirme qu'elle teste l'IA en scénario de stabilité financière. Fin du wait-and-see réglementaire.

La Bank of England a publié le 16 avril 2026 une lettre adressée au Treasury Committee de la Chambre des communes. Sa signataire, **Sarah Breeden**, occupe le poste de Deputy Governor pour la stabilité financière ; son message est que l'institution construit un dispositif de stress test dédié aux risques posés par l'intelligence artificielle dans le système financier britannique. Ce courrier s'inscrit dans la continuité du [relevé du Financial Policy Committee](https://www.bankofengland.co.uk/financial-policy-committee-record/2026/april-2026) du 27 mars, rendu public quelques jours plus tôt.

Trois points saillants. Premièrement, le FPC estime que l'adoption de l'IA générative et de l'IA agentique dans la finance britannique n'atteint pas encore un seuil systémique. Deuxièmement, il alerte que les risques « are likely to increase, potentially rapidly ». Troisièmement, il demande à la BoE et à la FCA un travail ciblé sur l'IA agentique appliquée aux paiements et aux marchés financiers.

Le courrier de Sarah Breeden précise la méthode. Il s'agit d'une analyse de scénarios « focused on plausible macroeconomic and core financial market outcomes », complétée par des exercices cyber et opérationnels. Le contexte ajoute une nuance. Le Treasury Committee [avait accusé la BoE d'un attentisme coupable](https://committees.parliament.uk/committee/158/treasury-committee/news/213162/bank-of-england-and-fca-commit-to-action-on-ai-following-warnings-from-mps) ; l'institution rejette cette lecture. Et pendant ce temps, la [BCE prépare ses propres questions](https://www.pymnts.com/artificial-intelligence-2/2026/bank-of-england-probes-ai-threats-to-uk-financial-stability/) auprès des banques européennes, portant notamment sur le modèle Mythos développé par Anthropic pour plusieurs banques britanniques dans le cadre du Project Glasswing.



## Un pivot de doctrine discret mais net



Depuis plusieurs années, la doctrine de la plupart des régulateurs financiers se résume à une formule : *technology-agnostic*. Peu importe l'outil, ce qui compte sont les risques produits. C'est la ligne que le PRA et la FCA continuent de défendre publiquement, rappelée dans leur réponse conjointe du 1er avril 2026 sur l'IA en services financiers.

Le pivot n'est donc pas idéologique. Il est méthodologique. Rester *technology-agnostic* sur le cadre juridique, oui ; mais construire des scénarios de stress tests dédiés à l'IA, parce que les canaux de transmission ne sont plus ceux d'une banque des années 2010. Un stress test classique pose une hypothèse de choc macro et regarde la capacité des banques à absorber les pertes. Un stress test IA pose une hypothèse de défaillance ou de comportement corrélé des systèmes algorithmiques et mesure la propagation de cette défaillance.

Le Bank Policy Institute avait publié en début d'année un texte intitulé « The Overlooked Risk in Bank AI Adoption : Regulatory Inaction ». La thèse : l'absence d'un cadre clair laissait les banques avancer sans garde-fou, reportant la responsabilité sur les régulateurs. La lettre de Breeden se lit comme une réponse directe. L'AI Act européen, qui devient pleinement applicable aux systèmes à haut risque à partir d'août 2026, fournit un socle juridique. La BoE, elle, construit la couche quantitative : scénarios chiffrés, expositions, effets de second tour.



## Quatre canaux, pas un seul



Le FPC ne raisonne pas en « risque IA » abstrait. Il décompose quatre canaux concrets, et c'est ce qui rend la démarche crédible.

**Le herding algorithmique.** Si plusieurs desks de marchés utilisent des agents IA entraînés sur des données comparables, leurs réponses à un signal de stress seront corrélées. Le Flash Crash de mai 2010 offre la matrice ; les agents LLM ajoutent une couche de latence décisionnelle encore plus courte et une opacité sur l'objectif réellement poursuivi par l'agent. Le FPC demande expressément un travail sur les usages en paiements et sur les marchés.

**La concentration des fournisseurs.** Quelques acteurs (OpenAI, Anthropic, Google, peut-être Mistral et Cohere) fournissent l'essentiel des modèles de frontière. Cette concentration est supérieure à celle que l'on observait déjà avec AWS, Azure et GCP sur le cloud, et le régulateur dispose de moins de leviers d'audit interne. Un bug ou une vulnérabilité partagée n'affecte plus un acteur, mais une fraction majeure du marché.

**Les risques cyber.** Les prompts, les embeddings et les outputs deviennent des surfaces d'attaque. L'insertion d'instructions malveillantes dans un document structuré, les attaques de type *prompt injection* ou *data poisoning*, et la fragilité des chaînes de valeur tierces sont désormais traités comme des variables de stabilité, et non comme de simples sujets de sécurité des systèmes d'information.

**L'autonomie croissante.** Un copilote qui propose une réponse à valider est un outil ; un agent qui déclenche une décision de crédit, une cotation ou un hedge sans revue humaine est une position de marché. Si ces positions se multiplient, les enchaînements de décisions produisent des effets systémiques mal couverts par les modèles de risque actuels.



## Project Glasswing et le problème de l'opacité



Le nom qui attire l'œil dans ce dossier est **Mythos**, le modèle qu'Anthropic développe sous le nom de projet *Glasswing* pour plusieurs banques britanniques. La BCE prévoit d'interroger les banques européennes sur les risques cyber qui en découlent, dans la foulée d'initiatives comparables aux États-Unis et au Royaume-Uni.

Le point de tension est classique en économie de l'externalisation : la mutualisation des modèles réduit les coûts fixes mais concentre les défaillances. Si trois ou quatre banques majeures partagent un même modèle entraîné sur des données sensibles, un bug de génération, une dérive statistique ou une vulnérabilité cyber n'affectent plus un acteur mais une fraction importante du marché. Les frameworks de gouvernance actuels, dont le DORA européen, couvrent une partie du sujet ; ils n'ont pas été écrits pour des modèles dont l'état interne n'est pas directement observable.

La BoE ne demande pas l'arrêt de ces projets. Elle construit le cadre qui dira, demain, si une banque peut porter une exposition à un agent sans que cette exposition soit dénoncée comme risque de concentration. La bataille qui s'ouvre n'est pas entre l'IA et la régulation ; elle est entre les banques qui documentent sérieusement leurs dépendances modèles et celles qui découvriront, à la prochaine simulation, ce qu'elles ne savaient pas sur leur propre chaîne opérationnelle.



## Ce que ça change concrètement quand on construit ces systèmes



Je regarde ce dossier depuis mon poste de freelance, où je branche des modèles sur des données clients tous les jours. Ce que la BoE décrit, je le manipule à petite échelle : sur l'[automatisation de prospection B2B Callkom](/#projects), un workflow n8n enchaîne Apify, Pappers et Brevo, et l'agent qui orchestre ces appels prend des décisions que personne ne relit ligne à ligne. Tant que c'est une PME qui qualifie des prospects, l'enjeu reste mesuré. Transposez la même logique d'agents corrélés sur un desk de marché, et les épisodes de stress deviennent plus rapides et plus synchronisés. Un stress test qui ignore ce paramètre partira avec un trimestre de retard.

L'autre angle est côté outillage. Le [Bloomberg Dashboard](/#projects) que j'ai développé utilise Claude Haiku pour lire des rapports de résultats, extraire des ratios et formuler une interprétation. À l'échelle d'un portefeuille personnel, c'est un assistant. À l'échelle d'un back-office bancaire, c'est une position de risque. La lecture que propose la BoE, depuis Breeden, est exactement celle-là : ne plus regarder le modèle comme un outil, le regarder comme une contrepartie opérationnelle dont la défaillance a un coût chiffrable et un périmètre de propagation. C'est aussi la discipline que je m'impose dès qu'un build client laisse un modèle agir sans revue humaine.



## Take-away



Les modèles de langage changent plus vite que les doctrines, et la BoE vient de rattraper un trimestre de retard en un courrier. La vraie question désormais : à quelle vitesse l'ACPR et la BCE publieront leurs propres scénarios, et à quelle vitesse les banques qui se positionnent en « AI-first » accepteront que leurs modèles entrent dans un stress test dont les paramètres ne seront pas les leurs.

---

Source: [https://mathieuhaye.fr/blog/2026-04-20-bank-of-england-ia-stabilite-financiere](https://mathieuhaye.fr/blog/2026-04-20-bank-of-england-ia-stabilite-financiere) | Other language: [https://mathieuhaye.fr/blog/en/2026-04-20-bank-of-england-ia-stabilite-financiere](https://mathieuhaye.fr/blog/en/2026-04-20-bank-of-england-ia-stabilite-financiere)
