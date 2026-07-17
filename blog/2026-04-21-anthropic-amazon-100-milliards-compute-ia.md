---
title: "Anthropic-Amazon : 100 milliards et 5 GW pour tenir Claude"
date: 2026-04-21
language: fr
slug: 2026-04-21-anthropic-amazon-100-milliards-compute-ia
url: https://mathieuhaye.fr/blog/2026-04-21-anthropic-amazon-100-milliards-compute-ia
alternate: https://mathieuhaye.fr/blog/en/2026-04-21-anthropic-amazon-100-milliards-compute-ia
category: Finance
description: "Le 20 avril 2026, Amazon investit jusqu'à 25 milliards dans Anthropic pour 5 GW de compute. Décryptage d'un deal IA et de son modèle circulaire."
---

# Anthropic-Amazon : 100 milliards et 5 GW pour tenir Claude

> Le 20 avril 2026, Amazon investit jusqu'à 25 milliards dans Anthropic pour 5 GW de compute. Décryptage d'un deal IA et de son modèle circulaire.

Le communiqué est tombé lundi matin heure Seattle. Amazon injecte 5 milliards de dollars de plus dans Anthropic, avec une option pour ajouter jusqu'à 20 milliards supplémentaires si certains jalons commerciaux sont atteints. En face, Anthropic s'engage à dépenser plus de 100 milliards de dollars chez Amazon Web Services sur les dix prochaines années, et sécurise l'accès à 5 gigawatts de capacité de calcul pour entraîner et faire tourner Claude. Les détails sont consignés sur la [page officielle d'Anthropic](https://www.anthropic.com/news/anthropic-amazon-compute) et dans le [communiqué d'Amazon](https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai).

Quelques ordres de grandeur pour fixer l'échelle. Cinq gigawatts, c'est la puissance continue de cinq tranches nucléaires de taille moyenne. Anthropic annonce que près de 1 GW de capacité Trainium2 et Trainium3 sera en ligne d'ici fin 2026, avec plus d'un million de puces Trainium2 déjà déployées. Le run-rate de revenu d'Anthropic serait passé d'environ 9 milliards de dollars fin 2025 à 30 milliards aujourd'hui, selon les chiffres repris par [TechCrunch](https://techcrunch.com/2026/04/20/anthropic-takes-5b-from-amazon-and-pledges-100b-in-cloud-spending-in-return/). La valorisation cible évoquée côté capital-risque tourne, elle, autour de 800 milliards de dollars. Pour mémoire, Amazon avait déjà mis 8 milliards dans Anthropic, ce qui porte la mise cumulée à 13 milliards aujourd'hui, et potentiellement 33 milliards.



## Le compute devient la vraie matière première



Ce qui est intéressant dans ce deal, ce n'est pas le montant. C'est l'unité. On ne parle plus en licences, en sièges ou en API calls. On parle en gigawatts et en puces. Anthropic achète de l'électrification, un parc de datacenters et des accélérateurs maison d'AWS : Trainium2, Trainium3, et même Trainium4 qui n'existe pas encore sur le marché. Le Graviton est inclus pour la partie CPU. L'accord ressemble moins à un contrat cloud classique qu'à un contrat d'approvisionnement long terme, comme ceux que signent les raffineurs avec les pétroliers.

Pour la finance, c'est une bascule. Pendant deux ans, on a traité l'IA comme une couche logicielle à ajouter sur les systèmes existants : un modèle, une API, un coût marginal faible par token. Avec 100 milliards de CapEx cloud étalés sur dix ans, la narrative change. Le coût marginal d'un token Claude devient en réalité l'amortissement d'une flotte de puces, d'une facture d'électricité et d'un bail foncier sur des datacenters texans ou saoudiens. Un analyste equity qui valorise une banque européenne utilisant Claude pour sa conformité ne peut plus ignorer cette couche infrastructure. Elle conditionne les prix, la latence et la résilience du service.

La Banque centrale européenne, la [Banque de France via l'ACPR](https://acpr.banque-france.fr/fr/actualites/le-reglement-europeen-sur-lintelligence-artificielle-ai-act) et les régulateurs britanniques commencent à poser la question de la concentration. Si les quinze plus grandes banques européennes tournent demain sur Claude via AWS, combien d'heures faut-il pour faire tomber tout un pan du shadow IT financier ? La question n'est pas théorique : ces deux dernières semaines, plusieurs utilisateurs ont constaté des ralentissements sur Claude, et Anthropic a elle-même reconnu dans son communiqué une « hausse brutale » de la demande qui a pesé sur la fiabilité du service.



## L'investissement circulaire, version 2026



Il y a un autre angle que peu de commentaires relèvent. Amazon investit 5 milliards dans Anthropic. Anthropic s'engage à rendre plus de 100 milliards à Amazon sous forme d'achats AWS. Sur dix ans, cela veut dire que les revenus cloud d'Amazon vont mécaniquement intégrer une part d'argent qu'Amazon a elle-même fournie. On appelle ça un investissement circulaire, et ce n'est pas nouveau : le pattern est apparu chez Microsoft avec OpenAI, puis chez Oracle avec OpenAI, et Amazon elle-même a signé un accord similaire il y a deux mois avec OpenAI, pour près de 50 milliards d'investissement et 100 milliards de cloud.

Pour un analyste crédit ou equity, c'est un vrai sujet d'audit. La question à se poser est simple : dans la croissance d'AWS sur les trois prochains exercices, quelle part correspond à de la demande organique, et quelle part reflète l'effet boomerang de chèques qu'Amazon signe à ses propres partenaires IA ? Le ratio ne sera pas publié de manière transparente. On l'approximera à partir des dépenses capitalisées d'Amazon, des revenus déclarés par segment et des engagements restants à livrer. Le parallèle avec la bulle télécoms de 1999-2001 circule déjà dans les notes sell-side : à l'époque, Cisco finançait une partie des achats de ses propres clients. Le marché avait fini par retirer cette composante des multiples. Ce genre de retraitement mettra du temps à se refléter dans le consensus, mais tout analyste qui couvre Amazon, Microsoft ou Alphabet a intérêt à le modéliser dès maintenant.

À un étage macro, la Banque des règlements internationaux et plusieurs régulateurs ont déjà pointé le risque : une poignée d'acteurs capte la quasi-totalité des investissements en IA, et ces acteurs se financent mutuellement. Le [PwC 2026 AI Performance Study](https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-performance-study.html) publié le 13 avril rappelle que 75 % des gains économiques liés à l'IA sont captés par 20 % des entreprises. Le deal Amazon-Anthropic est un symptôme de cette concentration, pas une anomalie.



## Ce que ça change pour ceux qui construisent avec Claude



Concrètement, pour un développeur ou une équipe finance qui utilise Claude dans son flux de travail, l'annonce est une bonne nouvelle à court terme. La capacité 2026 triple, les limites d'API devraient se détendre, et la pression sur les files d'attente baisser. Anthropic a parallèlement étoffé son offre Claude for Financial Services, avec des connecteurs directs vers Bloomberg, FactSet, Morningstar, Databricks et Palantir, d'après [sa documentation produit](https://www.anthropic.com/news/claude-for-financial-services). Les cas d'usage annoncés touchent la due diligence, les mémos d'investissement, la modélisation financière avec piste d'audit et les simulations Monte Carlo.

Sur mon propre [Bloomberg Dashboard](/#projects), que je fais tourner avec Claude Haiku pour la partie synthèse, le gain de débit va se voir tout de suite. Pendant mes sessions de backtest, j'ai régulièrement tapé contre le plafond sur les analyses intraday. Plus parlant encore côté production : IA Brew, la newsletter IA que j'opère sur n8n avec Claude et Brevo, génère et met en forme chaque édition de façon automatisée, et le moindre ralentissement d'API se voit directement dans la chaîne. Une fonction qui consomme énormément de génération de texte et d'analyse, comme un back-office finance, marche sur la même corde : un modèle capable d'industrialiser la production de commentaires serait un levier direct sur la productivité d'une équipe. Le fait qu'Anthropic sécurise enfin le compute qui va avec, c'est précisément ce qui rend crédible l'intégration en production.

Il reste un angle qu'on oublie dans les [stacks](/#projects) que je construis : le coût. Les entreprises qui embarquent Claude achètent, sans le savoir, une exposition aux prix de l'électricité, aux tarifs de l'interconnexion réseau et au planning d'amortissement d'AWS. Tant que la croissance finance l'ambition, le prix unitaire baisse. Si le marché ralentit, les tarifs API deviennent un coût fixe bien moins souple que prévu. Pour une direction financière, c'est une nouvelle catégorie de risque à documenter, à côté du risque fournisseur classique.



## Take-away



Quand la ligne *compute* devient le premier poste variable d'un LLM, la question n'est plus « quel modèle choisir », mais « sur quelle courbe énergétique je m'adosse ». Les banques qui embarquent Claude deviennent, de fait, exposées au parc nucléaire, gazier et solaire qui alimente AWS. C'est une ligne de risque nouvelle, et elle n'est documentée nulle part dans les frameworks ALM actuels.

---

Source: [https://mathieuhaye.fr/blog/2026-04-21-anthropic-amazon-100-milliards-compute-ia](https://mathieuhaye.fr/blog/2026-04-21-anthropic-amazon-100-milliards-compute-ia) | Other language: [https://mathieuhaye.fr/blog/en/2026-04-21-anthropic-amazon-100-milliards-compute-ia](https://mathieuhaye.fr/blog/en/2026-04-21-anthropic-amazon-100-milliards-compute-ia)
