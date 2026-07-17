---
title: "Anthropic-Amazon: $100bn and 5 GW to keep Claude running"
date: 2026-04-21
language: en
slug: 2026-04-21-anthropic-amazon-100-milliards-compute-ia
url: https://mathieuhaye.fr/blog/en/2026-04-21-anthropic-amazon-100-milliards-compute-ia
alternate: https://mathieuhaye.fr/blog/2026-04-21-anthropic-amazon-100-milliards-compute-ia
category: Finance
description: "On April 20, 2026, Amazon commits up to $25bn more to Anthropic for 5 GW of compute. A deep dive into the deal, its circular financing, and why finance should care."
---

# Anthropic-Amazon: $100bn and 5 GW to keep Claude running

> On April 20, 2026, Amazon commits up to $25bn more to Anthropic for 5 GW of compute. A deep dive into the deal, its circular financing, and why finance should care.

The joint release dropped on Monday morning Seattle time. Amazon is putting another $5bn into Anthropic, with an option to add up to $20bn more if certain commercial milestones are hit. On the other side, Anthropic commits to spend more than $100bn at Amazon Web Services over the next decade, and locks in access to 5 gigawatts of compute capacity to train and serve Claude. The specifics are laid out on [Anthropic's official post](https://www.anthropic.com/news/anthropic-amazon-compute) and in [Amazon's newsroom](https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai).

A few reference points to size the thing. 5 gigawatts is the continuous output of about five mid-size nuclear units. Anthropic says close to 1 GW of combined Trainium2 and Trainium3 capacity will be online by the end of 2026, with more than one million Trainium2 chips already deployed. Anthropic's run-rate revenue reportedly went from roughly $9bn at the end of 2025 to $30bn today, per [TechCrunch](https://techcrunch.com/2026/04/20/anthropic-takes-5b-from-amazon-and-pledges-100b-in-cloud-spending-in-return/). Secondary term sheets circulating in VC land now price the company around $800bn. Amazon had already injected $8bn into Anthropic before this round, which brings its cumulative stake to $13bn, potentially $33bn once the milestones convert.



## Compute becomes the real raw material



The interesting thing about this deal is not the dollar amount. It is the unit. We are not talking about licenses, seats or API calls anymore. We are talking about gigawatts and silicon. Anthropic is buying electrification, a fleet of data centers and AWS's custom accelerators: Trainium2, Trainium3, and even Trainium4, which is not yet on the market. Graviton is in the mix for CPU work. The contract looks less like a standard cloud agreement and more like a long-term supply deal, similar to the ones refiners sign with oil majors.

For finance, that is a shift. For the past two years, we treated AI as a software layer to graft onto existing stacks: a model, an API, a modest per-token cost. With $100bn of cloud capex spread over ten years, the story changes. The marginal cost of a Claude token becomes, in reality, the amortization of a chip fleet, a power bill and a land lease on data centers in Texas or Saudi Arabia. An equity analyst valuing a European bank that runs Claude for compliance workflows can no longer ignore that infrastructure layer. It drives pricing, latency and service resilience.

The European Central Bank, the French [ACPR (Banque de France, FR source)](https://acpr.banque-france.fr/fr/actualites/le-reglement-europeen-sur-lintelligence-artificielle-ai-act) and the British regulators are starting to ask the concentration question. If the fifteen largest European banks end up running on Claude via AWS tomorrow, how many hours does it take to knock out a whole layer of financial shadow IT? The question is not academic. Over the past two weeks, several users have reported slowdowns on Claude, and Anthropic itself flagged a "sharp rise" in demand that has strained reliability, in the same release.



## Circular investment, 2026 edition



There is another angle few commentators stress. Amazon invests $5bn into Anthropic. Anthropic commits to hand more than $100bn back to Amazon in the form of AWS purchases. Over ten years, that means AWS revenue will mechanically include a chunk of money that Amazon itself provided. That pattern has a name: circular investment. And it is not new. It showed up at Microsoft with OpenAI, then at Oracle with OpenAI, and Amazon signed a similar deal with OpenAI only two months ago, for close to $50bn of investment against $100bn of cloud commitments.

For a credit or equity analyst, that is a real audit question. The question to ask is simple: inside AWS growth over the next three fiscal years, how much is organic customer demand, and how much is the boomerang effect of checks Amazon wrote to its own AI partners? The ratio will never be disclosed cleanly. Analysts will approximate it from Amazon's capex, segment-reported revenue and remaining performance obligations. The parallel to the 1999-2001 telecom bubble is already making the rounds in sell-side notes: back then, Cisco was financing a portion of its own customers' purchases. The market eventually stripped that component out of the multiple. That kind of adjustment takes time to filter into consensus, but any analyst covering Amazon, Microsoft or Alphabet has an incentive to model it now.

At the macro level, the Bank for International Settlements and several regulators have already pointed at the risk: a handful of players capture almost all AI investment, and those players fund each other. The [PwC 2026 AI Performance Study](https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-performance-study.html), released on April 13, shows that 75% of the economic gains from AI accrue to just 20% of companies. The Amazon-Anthropic deal is a symptom of that concentration, not an anomaly.



## What it means for teams building on Claude



On the ground, for a developer or a finance team using Claude in their workflow, the short-term news is good. 2026 capacity triples, API rate limits should loosen, and queue pressure should ease. Anthropic has also expanded its Claude for Financial Services offering, with direct connectors to Bloomberg, FactSet, Morningstar, Databricks and Palantir, per [its product documentation](https://www.anthropic.com/news/claude-for-financial-services). Announced use cases cover due diligence, investment memos, financial modeling with full audit trails, and Monte Carlo simulations.

On my own [Bloomberg Dashboard](/en#projects), which I run with Claude Haiku for the synthesis layer, the throughput gain will show up immediately. During my backtest sessions, I regularly hit the ceiling on intraday analyses. Even more telling in production: IA Brew, the AI newsletter I operate on n8n with Claude and Brevo, generates and formats every edition automatically, and any API slowdown shows up directly in the pipeline. A function that runs on huge volumes of text generation and analysis, like a finance back-office, sits on the same wire: a model that can industrialize commentary production would be a direct lever on a team's productivity. The fact that Anthropic is finally locking in the compute to match is exactly what makes production integration credible.

There is one more angle that tends to be missed in the [stacks](/en#projects) I build: cost. Companies embedding Claude are buying, without quite realizing it, exposure to electricity prices, network interconnect tariffs and AWS's depreciation schedule. As long as growth funds the ambition, unit pricing keeps falling. If the market slows, API pricing becomes a fixed cost that is far less flexible than expected. For a CFO, that is a new category of risk to document, on top of classic vendor risk.



## Take-away



Once the *compute* line becomes the first variable cost of an LLM, the question is no longer "which model should we pick" but "which power curve are we leaning against". Banks that embed Claude are, de facto, exposed to the nuclear, gas and solar mix feeding AWS. That is a new risk line, and it shows up in no current ALM framework.

---

Source: [https://mathieuhaye.fr/blog/en/2026-04-21-anthropic-amazon-100-milliards-compute-ia](https://mathieuhaye.fr/blog/en/2026-04-21-anthropic-amazon-100-milliards-compute-ia) | Other language: [https://mathieuhaye.fr/blog/2026-04-21-anthropic-amazon-100-milliards-compute-ia](https://mathieuhaye.fr/blog/2026-04-21-anthropic-amazon-100-milliards-compute-ia)
