---
title: "ECB's QRF: how a random forest has quietly steered inflation calls since 2022"
date: 2026-04-29T08:00:00+02:00
language: en
slug: 2026-04-29-bce-qrf-machine-learning-inflation
url: https://mathieuhaye.fr/blog/en/2026-04-29-bce-qrf-machine-learning-inflation
alternate: https://mathieuhaye.fr/blog/2026-04-29-bce-qrf-machine-learning-inflation
category: Applied AI
description: "Since late 2022, the ECB has run a Quantile Regression Forest in its policy toolkit. Four economists confirmed it on April 21: what the disclosure changes."
---

# ECB's QRF: how a random forest has quietly steered inflation calls since 2022

> Since late 2022, the ECB has run a Quantile Regression Forest in its policy toolkit. Four economists confirmed it on April 21: what the disclosure changes.

## A Quantile Regression Forest inside Frankfurt's kitchen



On April 21, 2026, Óscar Arce (Director General for Economics at the ECB), Karin Klieber, Michele Lenza and Joan Paredes published a post on [the official ECB blog](https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260421~3c1c5a08ee.en.html) describing the inner workings of a tool that had stayed quietly in the background: a **Quantile Regression Forest (QRF)**, which has been "part of the broader analytical toolkit used for monetary policy preparation" since the end of 2022.

The QRF reads roughly 60 variables on a rolling basis, covering inflation expectations, cost pressures, real economic activity and financial conditions. They are refreshed multiple times per quarter. The output is not a point forecast, but a distribution: for each horizon, the model says how much inflation could surprise on the upside or the downside, and which factors are pulling in which direction.

The reality check came in 2025. According to the authors, "in the second and fourth quarters of 2025, the model flagged upside risks to core inflation that later materialised, with final readings coming about 20 basis points above official Eurosystem projections". The drivers it identified, namely wages and firms' selling-price expectations, were the ones that actually moved pricing. To anyone familiar with ECB staff projections, which often miss by more than that, a 20bp gap is not large; the early warning, on the other hand, is rare.

This is not a homegrown black box. The model rests on Nicolai Meinshausen's foundational 2006 paper in the *Journal of Machine Learning Research* and on Lenza, Moutachaker and Paredes, published in 2025 in *European Economic Review*, vol. 178. The academic transparency is full; the political disclosure is what is new.



## Why a random forest, and not a DSGE



The ECB has not retired its structural general equilibrium models. It has added a neighbour that sees what they miss. Traditional DSGE models lean on linear assumptions, revolve around conditional means and struggle with regime shifts. A Quantile Regression Forest does the opposite: it averages hundreds of decision trees to estimate the full distribution, and it handles non-linearities, sectoral interactions and fat tails far better.

Why does that matter more now? Because the euro area has been digesting a string of shocks that central models swallow poorly. An energy shock, a partial return of services inflation, a trade shock tied to the Middle East (March 2026 projections revised 2026 inflation to 2.6%, against a 2% target), and now, on the horizon, the bill for AI capex. Goldman Sachs recently estimated that data centers will drive about 40% of incremental power demand growth over the next five years, and add 0.2 percentage points to U.S. headline inflation in 2026. In a linear world, that kind of shock averages out. In reality, it prints into specific lines of the harmonised CPI basket before others.

The QRF, by reading 60 heterogeneous variables, is theoretically less elegant than a structural model; but it warns earlier. And 20 basis points on core inflation is hardly trivial when markets price every meeting to the quarter-point.



## Why publish now: transparency as a weapon



The April 21, 2026 timing is not accidental. It comes one month after Frankfurt's hawkish revision in March, and three days before the April 30 meeting where Christine Lagarde held rates at 2.00%. The ECB is under pressure: higher projected inflation, growth cut to 0.9%, and a recurring critique on its ability to spot shocks early.

Publishing the QRF, and signing it collectively, is one way of saying: we see things, our toolkit did not miss the 2025 surprises. It is also a way to lay the narrative groundwork. If inflation overshoots again in 2026, the central bank will have a publicly documented, academically published model to point to, and it will be able to argue that its decisions integrated those signals. Transparency becomes a credibility instrument, not just a democratic duty.

This is not an isolated move. Bundesbank President Joachim Nagel disclosed on December 9, 2025 that his central bank runs MILA, a model that scores euro area central bank communications, plus document analysis assistants. The ECB itself rolled out AI tools to [overhaul its corporate telephone survey](https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260216~6ae9dd0ef0.en.html), in a February 2026 post by other in-house economists. And on the U.S. side, the debate is even more public: Christopher Waller frames AI as a disinflationary force pushing productivity past 2%, Philip Jefferson warns of a "double-edged" effect (productivity gains versus pressure on land and energy demand), and Kevin Warsh, tipped to chair the Fed, talks [about an AI "escape velocity"](https://www.euronews.com/business/2026/04/29/how-ai-is-forcing-central-banks-to-rethink-inflation-and-rates), cautioning that the promised gains may not arrive in time.

The stakes underneath are heavy: if AI is a disinflationary supply shock, you cut rates faster than expected. If it is first a demand shock (capex before gains), you raise them. That is the same debate sitting on the ALM committees of every large European bank right now; and it may be the first time a random forest could materially weigh on the answer.

The split is already visible on Wall Street. Mike Hunstad, who runs Northern Trust's $1.4 trillion asset management division, leans on the disinflation bull case and frames AI as a major positive supply shock. Goldman Sachs and Oxford Economics, on the other side, are putting numbers on the near-term inflation drag of compute build-out, with 0.2pp added to U.S. headline inflation in 2026 and another 0.15pp in 2027. Reading these two camps through a QRF lens is exactly what a central bank wants right now: less consensus, more conditional probabilities. The model does not pick a winner; it widens the cone of uncertainty in a structured way, and it tags which variables would tilt the balance.



## What this echoes in my freelance practice



This announcement lands very directly on what I build for clients. A good part of my work is turning a heterogeneous stream of signals into something you can act on: my personal Bloomberg Dashboard runs Claude Haiku on a portfolio, and the B2B market-watch SaaS I am building (Next.js, Supabase, Exa AI) aggregates dozens of sources to surface a signal before the consensus does. What rarely matters is the point estimate; it is the tail of the distribution, the probability that a variable surprises by 20 basis points. Exactly what the ECB's QRF tries to capture.

Concretely, the same family of models, random forests, gradient boosting, even QRF directly, is usable far beyond a central bank: to score the risk that a price signal flips in non-linear scenarios; to estimate the distribution of a behaviour rather than a mean; to calibrate alert thresholds on an automated watch. When I wire up a 93-node n8n workflow to monitor press and social mentions for Fromagerie Ermitage, the underlying problem is the same: separating noise from a real move, early enough to act.

The bet is interesting. If central banks communicate more openly on their ML models, it also legitimises their use everywhere else, right down to the tools I ship to SMEs and startups. That is probably where the next wave is fought: those who move from deterministic Excel calculations to distributional pricing on trees will be the ones who read the next shock best.



---



Frankfurt's disclosure does not say AI decides. It says AI sits in the room where decisions are made. The real question, for the next twelve months, is no longer "do central banks use machine learning?", but: how do human judgment and the algorithmic signal share the room when the gap between them is worth, downstream, hundreds of billions of euros of bank balance sheets to readjust?

---

Source: [https://mathieuhaye.fr/blog/en/2026-04-29-bce-qrf-machine-learning-inflation](https://mathieuhaye.fr/blog/en/2026-04-29-bce-qrf-machine-learning-inflation) | Other language: [https://mathieuhaye.fr/blog/2026-04-29-bce-qrf-machine-learning-inflation](https://mathieuhaye.fr/blog/2026-04-29-bce-qrf-machine-learning-inflation)
