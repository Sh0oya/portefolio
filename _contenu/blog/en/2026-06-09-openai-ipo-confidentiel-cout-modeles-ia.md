---
title: "OpenAI Files for IPO: The Hidden Cost of AI Models"
date: 2026-06-09T09:00:00+02:00
language: en
slug: 2026-06-09-openai-ipo-confidentiel-cout-modeles-ia
url: https://mathieuhaye.fr/blog/en/2026-06-09-openai-ipo-confidentiel-cout-modeles-ia
alternate: https://mathieuhaye.fr/blog/2026-06-09-openai-ipo-confidentiel-cout-modeles-ia
category: Business & Growth
description: "OpenAI filed confidentially for an IPO on June 8, 2026, a week after Anthropic. What the move to public markets reveals about the real cost of AI models."
---

# OpenAI Files for IPO: The Hidden Cost of AI Models

> OpenAI filed confidentially for an IPO on June 8, 2026, a week after Anthropic. What the move to public markets reveals about the real cost of AI models.

- **The 30-second version:**

                - OpenAI filed a confidential draft IPO registration with the SEC on June 8, 2026, a week after Anthropic filed on June 1.

                - OpenAI was valued at $852bn in March 2026, now overtaken by Anthropic at $965bn.

                - ChatGPT claims around 900 million weekly active users, yet OpenAI does not expect to be profitable for at least four more years per its own projections.

                - OpenAI expects to burn close to $85bn in cash in 2028 and spend roughly $122bn on compute for research alone that year.





## The facts



OpenAI, the maker of ChatGPT, filed a confidential draft registration statement with the Securities and Exchange Commission (SEC), the US market regulator, on June 8, 2026. The move, [reported by TechCrunch](https://techcrunch.com/2026/06/08/following-anthropic-openai-files-confidentially-for-ipo/), comes a week after [Anthropic's similar filing on June 1, 2026](https://techcrunch.com/2026/06/01/anthropic-files-to-go-public/). OpenAI says no timeline has been set; the company notes the process may take a while, since some decisions are "easier to make while private."

The numbers set the scene. OpenAI was valued at $852bn at its last post-money round in March 2026, and traded around $880bn on the secondary market in April. In the meantime, Anthropic raised $65bn in a Series H and reached [a $965bn valuation](https://www.axios.com/2026/05/28/anthropic-ai-fundraising-openai), becoming the most valuable AI startup, ahead of OpenAI. ChatGPT claims around 900 million weekly active users. But the books stay in the red: per projections reported by TechCrunch, OpenAI expects to burn close to $85bn in cash in 2028 and to spend roughly $122bn on computing power for research alone that year. The company is not expected to generate more cash than it spends for at least four more years. In the background, SpaceX is preparing an offering that would target a $1.75tn valuation: 2026 is the year private tech giants pivot to public markets.



## Why is OpenAI filing now?



OpenAI is opening the process now because funding the compute race already exceeds what a single private round, however large, can absorb. Anthropic just raised $65bn in one shot; yet against a projected compute bill of roughly $122bn for research alone in 2028, even those sums fall short. Public markets, by contrast, open access to a deeper pool of capital and to debt instruments backed by assets such as data centers. Filing a draft is a way to keep that option ready before it becomes urgent.

Tempo matters as much as substance. Anthropic filed on June 1, 2026, OpenAI a week later: neither wants to let the other set the reference price for AI on the public market alone. OpenAI's confidential filing, which commits to no date, looks as much like a defensive move as a firm intent to list soon. The line about decisions being "easier to make while private" betrays real reluctance: a public company must report its accounts every quarter and answer for its losses. For a company losing billions to build the future, the transparency imposed by the market is a change of regime, not just a change of status.



## What the model bill reveals about AI economics



The filing exposes a reality long softened by private rounds: at this stage, building frontier models costs far more than they earn. OpenAI is running at around $2bn in monthly revenue in early 2026, an annualized run rate close to $24bn; yet [according to financial documents reported by Fortune](https://fortune.com/2025/11/12/openai-cash-burn-rate-annual-losses-2028-profitable-2030-financial-documents/), the company was projecting a loss on the order of $14bn for the year. Almost the entire gap sits in one line: compute. Training and serving models at scale consumes chips and electricity at a pace that fast-growing revenue does not yet catch up to.

That point sheds light on another, already documented: raw spending is not the same as a lead. Anthropic overtook OpenAI in valuation while spending markedly less to train its models, and its annualized recurring revenue passed $47bn. In other words, the market no longer pays for the size of the compute budget; it pays for how efficiently that budget turns into enterprise revenue. This is exactly the kind of trade-off public markets are built to scrutinize, quarter after quarter. The "growth at all costs" era funded by patient capital will have to coexist with results discipline.

For the reader in a hurry, one sentence captures the stakes: OpenAI generates roughly $24bn in annualized revenue but expects to burn close to $85bn in cash in 2028, putting profitability at least four years out. It is this equation, not the technical feat, that public-market investors will have to agree to fund.



## What it changes for companies that depend on OpenAI



For a company that built a product on OpenAI's API, going public means one concrete thing: pricing pressure will rise, not fall. A public company has to show a path to profitability; when profitability is four years out and the annual loss runs into the tens of billions, the obvious levers are higher prices, the end of unlimited plans and usage-based billing. GitHub already made that turn by replacing its flat plan with per-token billing, a signal I analyzed in [the end of GitHub Copilot's unlimited plan](/blog/en/2026-06-02-github-copilot-tokens-fin-forfait-ia).

The fix is not to flee OpenAI, but to avoid being chained to it. Frontier models are becoming largely interchangeable: Apple itself turned Siri into a product where the underlying model is swappable, a topic covered in [choosing an interchangeable AI model](/blog/en/2026-06-08-apple-gemini-siri-modele-ia-interchangeable). The practical takeaway for any builder is simple: isolate the model layer behind an abstraction, measure cost per task rather than per subscription, and keep a backup provider ready to take over. Dependence on a single AI vendor is a cost risk before it is a technical one.



## What it changes in my freelance work



This equation matches a reflex I apply on my projects: pick the right cost tier before picking the most powerful model. On my [Bloomberg dashboard run by Claude Haiku 4.5](https://mathieuhaye.fr/#projets), which tracks my personal portfolio, I chose Haiku not by chance but because a lighter model was enough for the task at a fraction of the price. When an assistant runs continuously, the per-call cost difference between one tier and another decides the product's economic viability, well before the model's raw quality.

The same logic guides my automation and CRM work. Before wiring a model into an n8n pipeline or a customer record, I think in cost per run and keep the calling layer neutral enough to switch providers without rewriting everything. OpenAI's IPO simply makes public a truth I verify at the scale of a small business: a model's price is not a fixed parameter, it is a market variable that will rise when the vendors, too, have to answer for their numbers.



## The takeaway



OpenAI is putting its books on the public table at the worst point in its loss cycle, and that is exactly the value: the market will force a real number onto what a frontier model actually costs. The real question for a leader is no longer "which is the best model?" but "how much will it cost me once my vendor finally has to make money?"



## Frequently asked questions



### When will OpenAI go public?



No date is set. OpenAI only filed a confidential draft registration statement with the SEC on June 8, 2026, which opens the process without committing to it. The company says the move may take a while, as some decisions are easier to make while private. An actual listing would happen in the second half of 2026 at the earliest, possibly in 2027.



### Why is Anthropic worth more than OpenAI?



Anthropic reached a $965bn valuation after raising $65bn in May 2026, surpassing OpenAI's $852bn valuation from March. The market is paying for Anthropic's enterprise revenue growth, with annualized recurring revenue past $47bn, and a more contained training cost structure. [Details of the Series H on Anthropic's site.](https://www.anthropic.com/news/series-h)



### Will an OpenAI IPO push up the price of ChatGPT and the API?



That is the most likely direction. A public company has to show a path to profitability, yet OpenAI does not expect to be profitable for at least four more years. Public-market pressure pushes toward higher prices, fewer unlimited plans and usage-based billing, as GitHub Copilot already did. Companies that depend on a single AI vendor are wise to diversify.

---

Source: [https://mathieuhaye.fr/blog/en/2026-06-09-openai-ipo-confidentiel-cout-modeles-ia](https://mathieuhaye.fr/blog/en/2026-06-09-openai-ipo-confidentiel-cout-modeles-ia) | Other language: [https://mathieuhaye.fr/blog/2026-06-09-openai-ipo-confidentiel-cout-modeles-ia](https://mathieuhaye.fr/blog/2026-06-09-openai-ipo-confidentiel-cout-modeles-ia)
