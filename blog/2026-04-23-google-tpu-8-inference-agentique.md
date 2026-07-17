---
title: "Google TPU 8 : l'ère agentique se joue sur le silicium"
date: 2026-04-23T08:00:00+02:00
language: fr
slug: 2026-04-23-google-tpu-8-inference-agentique
url: https://mathieuhaye.fr/blog/2026-04-23-google-tpu-8-inference-agentique
alternate: https://mathieuhaye.fr/blog/en/2026-04-23-google-tpu-8-inference-agentique
category: IA appliquée
description: "Le 22 avril 2026, Google dévoile ses TPU 8t et 8i pour l'ère agentique. Anthropic valide avec 3,5 GW. Ce que ça change pour les banques et l'inférence IA."
---

# Google TPU 8 : l'ère agentique se joue sur le silicium

> Le 22 avril 2026, Google dévoile ses TPU 8t et 8i pour l'ère agentique. Anthropic valide avec 3,5 GW. Ce que ça change pour les banques et l'inférence IA.

Lors de Google Cloud Next 2026, mercredi 22 avril, Sundar Pichai et Thomas Kurian ont présenté deux puces : la **TPU 8t**, dédiée à l'entraînement de modèles, et la **TPU 8i**, optimisée pour l'inférence. Les deux sont vendues comme « les puces de l'ère agentique ». Les gains annoncés par Google sont précis. La TPU 8t offre jusqu'à 2,7 fois la performance par dollar de la génération précédente Ironwood pour l'entraînement à grande échelle, et 124 % de performance par watt supplémentaire. La TPU 8i revendique de son côté 80 % de gains en performance par dollar pour l'inférence, 117 % en performance par watt, et trois fois plus de mémoire SRAM embarquée pour héberger de grands caches KV sans sortir du silicium. La topologie Boardfly connecte 1 152 puces dans un seul pod, et Google annonce pouvoir relier plus d'un million de TPU dans un même cluster, selon le [deep dive technique publié par Google Cloud](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive).

Le même jour, Anthropic est apparu comme le plus gros client TPU publiquement identifié, avec un engagement sur plusieurs gigawatts de capacité de nouvelle génération. L'accord étendu avec Broadcom et Google, signé début avril 2026, prévoit 3,5 gigawatts de capacité TPU supplémentaires à partir de 2027, en plus du gigawatt déjà programmé pour 2026. Le [communiqué d'Anthropic](https://www.anthropic.com/news/google-broadcom-partnership-compute) et la [note de Tom's Hardware](https://www.tomshardware.com/tech-industry/broadcom-expands-anthropic-deal-to-3-5gw-of-google-tpu-capacity-from-2027) chiffrent l'enjeu financier : le run rate annuel d'Anthropic est passé d'environ 9 milliards de dollars fin 2025 à plus de 30 milliards au printemps 2026. Les clients entreprise dépensant plus d'un million de dollars par an sont passés de 500 à plus de 1 000 en moins de deux mois.

Google positionne la TPU 8 comme une alternative directe à Nvidia, tout en continuant de distribuer la Vera Rubin du même Nvidia sur son cloud, comme le souligne [TechCrunch](https://techcrunch.com/2026/04/22/google-cloud-next-new-tpu-ai-chips-compete-with-nvidia/). Pour qui observe l'IA appliquée à la finance, l'événement n'est pas la levée de voile d'une nouvelle puce. C'est l'endroit précis où Google a placé l'accent : l'inférence, pas l'entraînement.



## L'inférence, nouveau front économique des hyperscalers



Depuis trois ans, la course au compute IA s'est jouée sur l'entraînement. Les 100 milliards de dollars d'Anthropic chez AWS ou les 4 600 mégawatts en commande chez Microsoft ont été justifiés par la construction des modèles de fondation. Le basculement de 2026 change la règle. Google vient de dire publiquement ce que ses ingénieurs murmuraient depuis dix-huit mois : l'inférence est désormais la dépense dominante, et elle est permanente.

Le raisonnement est brutal pour une direction financière. Un entraînement est un coût fixe, annuel, capitalisable. Une inférence est un coût variable, par requête, qui ne s'éteint jamais tant que le produit existe. Avec le passage aux agents, chaque tâche utilisateur déclenche entre 10 et 20 appels au modèle, contre un seul à l'époque ChatGPT 3.5. La couche RAG, devenue standard pour les cas d'usage entreprise, multiplie par 3 à 5 le nombre de tokens consommés par requête, selon les données compilées par [Oplexa](https://oplexa.com/ai-inference-cost-crisis-2026/). La facture totale n'a donc pas baissé ; elle a été déplacée du poste R&D vers le poste production.

La TPU 8i est pensée pour ce monde. Trois fois plus de SRAM permet de loger le cache KV sur la puce, et donc de servir un modèle de 200 milliards de paramètres avec une latence de quelques centaines de millisecondes sans aller solliciter de la HBM externe. La topologie Boardfly, qui connecte 1 152 TPU dans un seul pod, vise les charges de travail où les agents s'appellent entre eux en cascade. Google dit viser « des millions d'agents concurrents ». La formule est commerciale, le design, lui, est sérieux.

La question qui reste ouverte pour les clients finaux : à quel prix catalogue ces gains de 80 % se traduisent-ils réellement dans la facture ? L'historique des cinq précédentes générations TPU suggère que les clients captent rarement plus d'un tiers des gains techniques. Le reste est absorbé par la marge brute de Google Cloud, désormais la principale ligne de croissance d'Alphabet.



## Diversifier le silicium : la leçon Anthropic pour la finance



Il faut regarder la posture d'Anthropic sans filtre. L'éditeur compte, en avril 2026, trois fournisseurs de silicium actifs : les TPU de Google, les puces Trainium d'Amazon et les GPU Nvidia. Chacun porte une logique contractuelle distincte : commitment Google avec Broadcom pour 3,5 GW en 2027, commitment Amazon avec 100 milliards de dollars de dépenses AWS sur dix ans signé le 20 avril, commitment Nvidia via les clusters existants. La direction technique d'Anthropic justifie cette triangulation par le refus de dépendre d'un seul silicium. Le motif économique est plus direct : trois fournisseurs en négociation permettent d'obtenir de meilleurs prix, et de se couvrir contre une pénurie ponctuelle.

Ce comportement est celui d'un acteur financier qui diversifie ses contreparties. Pour les banques et les gérants d'actifs qui industrialisent des cas d'usage LLM, la question se pose dans les mêmes termes. Choisir un seul fournisseur de modèle ou de cloud, c'est importer un risque de concentration, une dépendance tarifaire, et une exposition à la décision unilatérale d'un éditeur. C'est exactement l'angle retenu par la Bank of England dans ses notes de mars 2026 sur le risque de concentration des fournisseurs IA, et par la BCE dans ses questionnaires préparatoires aux banques de la zone euro.

Pour un établissement bancaire, la parade n'est pas symétrique à celle d'Anthropic. Une banque ne négocie pas un contrat multi-gigawatts. Elle achète, via un cloud principal, un accès API à un modèle propriétaire, et paye au token. Mais la logique est la même : il faut pouvoir basculer. Les architectures bancaires IA les plus sérieuses en 2026 reposent désormais sur une couche d'abstraction (LangChain, gateway interne, passerelle LiteLLM) qui permet de pivoter d'OpenAI à Anthropic, de Claude à Gemini, sans réécrire le code métier. Chez BNP Paribas ou HSBC, cette couche porte un nom interne, mais la fonction est identique.

La TPU 8 ajoute un élément à la photo. Elle accélère la capacité de Google Cloud à offrir des modèles tiers (Claude notamment) à coût réduit. Un client bancaire qui a choisi Anthropic comme fournisseur préféré peut désormais le consommer depuis Google Cloud à meilleur prix, tout en gardant la souveraineté contractuelle de son choix d'éditeur. Cela dilue la question « quel cloud ? » au profit de la question « quelle couche d'abstraction ? ».



## Le coût par token devient une ligne de P&L



Les chiffres d'[Epoch AI](https://epoch.ai/data-insights/llm-inference-price-trends) sont frappants. Entre 2022 et 2024, le prix par million de tokens d'un modèle comparable au GPT-4 est passé de 20 dollars à environ 0,40 dollar, soit une baisse d'un facteur 50. Sur la même période, la dépense totale des entreprises en IA générative a augmenté de 320 %. Le paradoxe est simple : plus l'inférence devient bon marché, plus les entreprises en consomment. La courbe de Jevons, classique en économie de l'énergie, se rejoue sur le compute.

Pour une banque qui industrialise un copilote Front Office ou un modèle de scoring crédit, ce paradoxe se traduit par une question pratique. L'architecture est-elle dimensionnée pour un volume constant de requêtes, ou accompagne-t-elle la démocratisation interne du service ? Dans le premier cas, la baisse des prix se lit comme un gain de marge. Dans le second, elle finance une augmentation de l'usage dont la consolidation financière est plus compliquée à piloter.

Le fantôme de ce débat porte un nom : la dette d'inférence. Chaque modèle déployé en production crée un flux permanent de coûts opex, indexé sur le volume d'usage. Un projet data classique s'amortit sur 3 à 5 ans. Un assistant IA ne s'amortit jamais : chaque requête future coûte. L'industrie pharmaceutique a déjà tranché, avec des systèmes d'inférence internes comme le LillyPod d'Eli Lilly, annoncé en 2026 à plus de 9 000 petaflops. La finance n'a pas encore bougé sur ce terrain, mais le débat sur l'équation « louer chez un hyperscaler contre bâtir son cluster » arrivera vite.

La TPU 8i accélère cette discussion. En rendant l'inférence hyperscaler 80 % moins chère, elle décale le point de bascule économique au profit du cloud. Sauf charge de travail exceptionnellement volumineuse et sensible, il reste plus rentable de louer. C'est probablement un soulagement pour les DSI bancaires, qui n'ont ni les effectifs ni le calendrier pour bâtir leur propre infrastructure IA dédiée.



## Vu de mon poste de travail



Le [Bloomberg Dashboard](/#projects) que j'utilise fait tourner Claude via API, à travers un client Python qui enchaîne facilement 8 à 12 appels pour traiter un rapport annuel d'entreprise. À l'échelle perso, la facture reste raisonnable, de l'ordre de quelques euros par semaine. Mais l'exercice m'a appris à penser en tokens avant de penser en euros : quelle partie du contexte est nécessaire au modèle, quelle partie peut être compressée, quel appel peut être évité par un cache local. Ces gestes sont exactement ceux qu'une DSI bancaire devra généraliser quand son assistant IA sera consommé par 50 000 collaborateurs plutôt que par 500.

Quand je facture un client en freelance, cette économie n'est plus théorique. Pour [IA Brew](/#projects), ma newsletter IA automatisée sur n8n, Claude et Brevo, chaque édition enchaîne assez d'appels pour que la facture de tokens devienne un poste à surveiller comme n'importe quel coût récurrent. La vraie question pour un client n'est jamais « quel modèle utiliser » mais « quelle est la sensibilité de ma marge si le prix par token baisse de 40 % ou si le volume double ? ». Cette question, aujourd'hui encore absente des comités ALM des banques, rejoindra vite les autres risques de marché et les indicateurs de suivi du coût du risque opérationnel.



## Take-away



Google a placé son pari sur le silicium d'inférence. Anthropic a signé pour plusieurs gigawatts. Et au milieu, une banque qui déploie un copilote IA va découvrir que sa prochaine ligne de coût récurrente n'est pas un abonnement logiciel mais une facture de compute qui varie avec chaque usage. La question ne sera plus « faut-il faire de l'IA ? », mais « à quel prix par token est-ce que mon modèle de revenu tient ? ». Les comités des risques bancaires ont deux ans pour y répondre.

---

Source: [https://mathieuhaye.fr/blog/2026-04-23-google-tpu-8-inference-agentique](https://mathieuhaye.fr/blog/2026-04-23-google-tpu-8-inference-agentique) | Other language: [https://mathieuhaye.fr/blog/en/2026-04-23-google-tpu-8-inference-agentique](https://mathieuhaye.fr/blog/en/2026-04-23-google-tpu-8-inference-agentique)
