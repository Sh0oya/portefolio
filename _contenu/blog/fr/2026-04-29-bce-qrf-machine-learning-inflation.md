---
title: "BCE et IA : le modèle QRF qui surveille l'inflation depuis 2022"
date: 2026-04-29T08:00:00+02:00
language: fr
slug: 2026-04-29-bce-qrf-machine-learning-inflation
url: https://mathieuhaye.fr/blog/2026-04-29-bce-qrf-machine-learning-inflation
alternate: https://mathieuhaye.fr/blog/en/2026-04-29-bce-qrf-machine-learning-inflation
category: IA appliquée
description: "Depuis fin 2022, la BCE utilise un Quantile Regression Forest pour traquer l'inflation. Quatre économistes l'ont admis le 21 avril 2026 : ce que cela change."
---

# BCE et IA : le modèle QRF qui surveille l'inflation depuis 2022

> Depuis fin 2022, la BCE utilise un Quantile Regression Forest pour traquer l'inflation. Quatre économistes l'ont admis le 21 avril 2026 : ce que cela change.

## Un Quantile Regression Forest dans la cuisine de Francfort



Le 21 avril 2026, Óscar Arce (directeur général de l'économie à la BCE), Karin Klieber, Michele Lenza et Joan Paredes ont publié un billet sur [le blog officiel de la BCE](https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260421~3c1c5a08ee.en.html) qui décrit la mécanique d'un outil resté jusque-là discret : un **Quantile Regression Forest (QRF)**, devenu « partie intégrante de la boîte à outils analytique utilisée pour préparer les décisions de politique monétaire » depuis fin 2022.

Le QRF lit en continu environ 60 variables couvrant les anticipations d'inflation, les pressions sur les coûts, l'activité réelle et les conditions financières. Il les met à jour plusieurs fois par trimestre. La sortie n'est pas un nombre central, mais une distribution : pour chaque horizon, le modèle indique à quel point l'inflation pourrait surprendre à la hausse ou à la baisse, et quels facteurs poussent dans quelle direction.

L'épreuve du réel est arrivée en 2025. D'après les auteurs, « au deuxième et au quatrième trimestre de 2025, le modèle a signalé des risques haussiers sur l'inflation sous-jacente qui se sont effectivement matérialisés, avec des chiffres finaux d'environ 20 points de base au-dessus des projections officielles de l'Eurosystème ». Les facteurs identifiés, salaires et anticipations de prix de vente des entreprises, ont été ceux qui ont effectivement poussé le pricing. Pour qui est familier des projections du staff BCE, qui se trompent souvent de plus que ça, l'écart est faible mais la lecture en amont, elle, est rare.

Le modèle n'est pas un OVNI bricolé en interne. Il s'appuie sur l'article fondateur de Nicolai Meinshausen (2006) dans le *Journal of Machine Learning Research*, et sur les travaux de Lenza, Moutachaker et Paredes publiés en 2025 dans *European Economic Review*, vol. 178. La transparence académique est complète ; l'aveu politique, lui, est récent.



## Pourquoi un random forest plutôt qu'un DSGE



La BCE n'a pas remplacé ses modèles structurels d'équilibre général. Elle leur a ajouté un voisin qui voit ce que les premiers ratent. Les modèles DSGE traditionnels font des hypothèses linéaires, ils tournent autour de moyennes conditionnelles et ils peinent face aux changements de régime. Un Quantile Regression Forest, lui, fait l'inverse : il agrège des centaines d'arbres de décision pour estimer toute une distribution, et il repère mieux les non-linéarités, les interactions sectorielles et les queues épaisses.

Pourquoi cela compte désormais davantage ? Parce que la zone euro vit depuis trois ans une succession de chocs que les modèles centraux digestent mal. Choc énergétique, retour partiel de l'inflation des services, choc commercial lié au Moyen-Orient (les projections de mars 2026 ont révisé l'inflation 2026 à 2,6 %, contre une cible à 2 %), et maintenant, sur l'horizon, la pression de la facture d'investissement IA. Goldman Sachs a chiffré récemment que les *data centers* contribueraient à environ 40 % de la croissance de la demande d'électricité sur les cinq prochaines années, et ajouteraient 0,2 point de pourcentage à l'inflation américaine en 2026. Dans un monde linéaire, ce genre de choc se moyennise. Dans la réalité, il s'imprime sur certaines lignes du panier de l'IPCH avant d'autres.

Le QRF, en lisant 60 variables hétérogènes, est moins beau théoriquement qu'un modèle structurel; mais il prévient plus tôt. Et 20 points de base sur l'inflation sous-jacente, ce n'est pas anecdotique quand les marchés pricent chaque réunion au quart de point près.



## Pourquoi publier maintenant : la transparence comme arme



La date du 21 avril 2026 n'est pas neutre. Elle vient un mois après la révision haussière des projections de Francfort en mars, et trois jours avant la réunion du 30 avril où Christine Lagarde a maintenu les taux à 2,00 %. La BCE est sous pression : une inflation prévue plus haute, une croissance révisée à 0,9 %, et une critique récurrente sur sa capacité à voir venir les chocs.

Publier le QRF, en signant collectivement, c'est une manière de dire : nous voyons les choses, nos outils n'ont pas raté les surprises de 2025. C'est aussi une façon de préparer le terrain narratif. Si l'inflation surprend encore en 2026, la banque centrale aura sur la table un modèle académiquement publié et publiquement documenté, et pourra dire que ses décisions ont intégré ces signaux. La transparence devient un instrument de crédibilité, pas seulement un devoir démocratique.

Ce mouvement n'est pas isolé. Le président de la Bundesbank Joachim Nagel a révélé le 9 décembre 2025 que sa banque centrale exploitait MILA, un modèle qui évalue les communications des banques centrales de la zone euro, ainsi que des assistants d'analyse documentaire. La BCE s'est par ailleurs dotée d'outils d'IA pour [transformer son enquête téléphonique auprès des entreprises](https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260216~6ae9dd0ef0.en.html), billet publié en février 2026 par d'autres économistes maison. Et côté américain, le débat est plus public encore : Christopher Waller voit l'IA comme une force désinflationniste qui pousse la productivité au-delà de 2 %, Philip Jefferson met en garde sur l'effet « à double tranchant » (gains de productivité vs. pression sur la demande de terrain et d'énergie), et Kevin Warsh, pressenti pour présider la Fed, parle [de « vitesse de libération »](https://www.euronews.com/business/2026/04/29/how-ai-is-forcing-central-banks-to-rethink-inflation-and-rates), en avertissant que les gains promis par l'IA ne se matérialiseront pas nécessairement à temps.

L'enjeu derrière est lourd : si l'IA est un choc d'offre désinflationniste, on baisse les taux plus vite que prévu. Si c'est d'abord un choc de demande (les capex avant les gains), on les remonte. C'est le même débat qui anime aujourd'hui les comités ALM des grandes banques européennes ; et c'est peut-être la première fois qu'un random forest pourrait peser sur la réponse.



## Ce que ça résonne dans ma pratique de freelance



Cette annonce résonne très directement avec ce que je construis pour mes clients. Une bonne partie de mon travail, c'est de transformer un flux hétérogène de signaux en lecture exploitable : mon Bloomberg Dashboard personnel fait tourner Claude Haiku sur un portefeuille, et le SaaS de veille de marché B2B que je développe (Next.js, Supabase, Exa AI) agrège des dizaines de sources pour faire ressortir un signal avant le consensus. Or ce qui compte rarement, c'est le chiffre central ; c'est la queue de distribution, c'est la probabilité qu'une variable surprenne de 20 points de base. Exactement ce que le QRF de la BCE essaie de saisir.

Concrètement, la même classe de modèles random forest, gradient boosting, voire QRF directement, est utilisable bien au-delà d'une banque centrale : scorer le risque qu'un signal de prix bascule dans des scénarios non linéaires; estimer la distribution d'un comportement plutôt qu'une moyenne; calibrer des seuils d'alerte sur une veille automatisée. Quand je câble un workflow n8n de 93 nœuds pour surveiller la presse et les réseaux de la Fromagerie Ermitage, le problème de fond est le même : distinguer le bruit du vrai mouvement, assez tôt pour agir.

Le pari est intéressant. Si les banques centrales communiquent plus ouvertement sur leurs modèles ML, ça légitime aussi leur usage partout ailleurs, jusque dans les outils que je livre à des PME et des startups. C'est probablement là que se joue la prochaine vague : ceux qui passeront du calcul déterministe sous Excel au pricing distributionnel sur des arbres seront ceux qui liront le mieux le prochain choc.



---



L'aveu de Francfort ne dit pas que l'IA décide. Il dit qu'elle s'est installée dans la pièce où l'on décide. La vraie question, pour les douze mois qui viennent, n'est plus « les banques centrales utilisent-elles le machine learning ? », mais : comment cohabitent le jugement humain et le signal algorithmique quand l'écart entre les deux vaut, en bout de chaîne, des centaines de milliards d'euros de bilans bancaires à réajuster ?

---

Source: [https://mathieuhaye.fr/blog/2026-04-29-bce-qrf-machine-learning-inflation](https://mathieuhaye.fr/blog/2026-04-29-bce-qrf-machine-learning-inflation) | Other language: [https://mathieuhaye.fr/blog/en/2026-04-29-bce-qrf-machine-learning-inflation](https://mathieuhaye.fr/blog/en/2026-04-29-bce-qrf-machine-learning-inflation)
