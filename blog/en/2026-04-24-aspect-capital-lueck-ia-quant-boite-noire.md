---
title: "Aspect Capital: Martin Lueck pushes back on AI quant trading"
date: 2026-04-24T08:00:00+02:00
language: en
slug: 2026-04-24-aspect-capital-lueck-ia-quant-boite-noire
url: https://mathieuhaye.fr/blog/en/2026-04-24-aspect-capital-lueck-ia-quant-boite-noire
alternate: https://mathieuhaye.fr/blog/2026-04-24-aspect-capital-lueck-ia-quant-boite-noire
category: Quant trading
description: "Martin Lueck, Aspect Capital co-founder and quant pioneer, refuses to hand portfolio decisions to AI. Why the FT interview matters for finance."
---

# Aspect Capital: Martin Lueck pushes back on AI quant trading

> Martin Lueck, Aspect Capital co-founder and quant pioneer, refuses to hand portfolio decisions to AI. Why the FT interview matters for finance.

Martin Lueck is not a professional AI sceptic. He is one of the few practitioners who can say "slow down" to the quant industry without sounding like a relic. He co-founded Aspect Capital in 1997, and today runs a firm with roughly $7.8bn in assets under management. Before Aspect, he was the "L" in AHL (Adam, Harding & Lueck), later acquired by Man Group and now one of the landmark British systematic trading houses. When this man sits down with the *Financial Times* to push back on AI hype in hedge funds, it is not a posture.

His message comes down to one distinction, relayed in detail by [Hedgeweek](https://www.hedgeweek.com/quant-veteran-cautions-against-full-ai-control-in-hedge-fund-trading/): AI and machine learning are acceptable tools to process data, test hypotheses or accelerate research; they should not drive end-to-end portfolio construction. The reason is operational, not ideological. During a market crisis, a portfolio manager needs to explain to an investor why the book is positioned a certain way. When the model has become opaque, that conversation stops being possible. This is exactly why Lueck left AHL in the 1990s: early systematic models were already effectively "black boxes" that their own designers could not explain under stress.

The warning lands precisely as the industry tilts in the opposite direction. JPMorgan Asset Management committed up to $500m to [Numerai](https://www.hedgeweek.com/quant-hedge-fund-numerai-secures-500m-jpmorgan-allocation/), a crowdsourced hedge fund that blends predictions from thousands of anonymous data scientists into a single AI model. Numerai returned 25.45% net in 2024 with a Sharpe ratio of 2.75. The temptation is to say "it works, why bother explaining?" Lueck's response is that the question is not whether it works today; it is what happens the day it breaks.



## Transparency is not a luxury, it is risk control



Lueck has to be read through the lens of a risk professional, not that of an AI hype-watcher. His central argument is known in asset management as "model explainability". A manager who cannot articulate the drivers of his P&L is unable to do three essential things. First, spot a regime break: if the model was trained on a rising-rates world and markets flip into another regime, a human quant can read the transition and adjust; an opaque system keeps applying its rules until the drawdown is catastrophic. Second, separate structural alpha from statistical noise: without a handle on explanatory variables, a manager cannot tell whether past performance comes from a real edge or from in-sample optimisation bias. Third, explain the position to an institutional investor, who demands a clear narrative before committing more capital.

These requirements are not just commercial, they are codified by regulators. The EU AI Act, which enters full application on August 2, 2026, classifies AI systems used for credit scoring, fraud detection and automated risk evaluation as "high risk", with mandatory transparency, governance and audit obligations, as outlined in the [EBA factsheet](https://www.eba.europa.eu/sites/default/files/2025-11/d8b999ce-a1d9-4964-9606-971bbc2aaf89/AI%20Act%20implications%20for%20the%20EU%20banking%20sector.pdf) on implications for the banking and payments sector. The Bank of England released in mid-April 2026 a dedicated stress-test framework for AI models, and the ECB is finalising its questionnaires on AI vendor concentration risk. Lueck is not speaking from outside the regulatory envelope; as an active manager, he is articulating what that envelope is trying to impose on everyone.

The financial logic is just as direct. A non-explainable portfolio is an asset whose risk premium cannot be estimated properly. Institutional LPs (pension funds, insurers, European family offices) have for two years applied a transparency premium inside their due diligence. Without documented P&L drivers, the ticket size shrinks or the allocation is simply declined.



## AI as research assistant, not portfolio manager



Where Lueck gets most interesting is in what he accepts. He is not anti-AI. He identifies four legitimate use cases for a quant: unstructured data processing (reports, news, conference transcripts), feature research across large time series, hypothesis testing on backtests, and code-writing assistance. These four areas are what Anglo-Saxon hedge funds now call "research augmentation". Historic trend-following houses (Aspect, Man AHL, Winton, Millburn) already use machine learning at that level, sometimes with dozens of dedicated engineers, but they keep the final execution decision inside parametric models whose coefficients remain legible.

The second category, the funds that accept end-to-end AI decisions, consists mostly of newer managers launched after 2020, running more speculative capital. Their 2025 performance has been roughly in line, on average, with the historic houses. Their intra-year volatility has been meaningfully higher, with more drawdowns that no one has been able to reconstruct after the fact. That asymmetry is what pushes a manager like Lueck to say publicly what many think internally: inside a quant book, explainability is not a comfort option, it is a survival constraint.

For an analyst or a quant manager in training, the lesson is concrete. The area where AI creates the most immediate value is not the final decision (who buys, who sells, at what weight); it is the offloading of the unglamorous work: data cleaning, factor mining, backtest code generation, macro-indicator extraction from transcripts. The 80% of time a quant analyst used to spend preparing data can drop to 40%. The 20% spent thinking about the signal must stay at 20% or rise. That is exactly Lueck's message, framed through productivity instead of through risk.



## Explain or lose the investor



There is a commercial backdrop to the interview. Aspect Capital manages $7.8bn, mostly for institutional investors. That client base does not tolerate, and will not tolerate, answers along the lines of "the machine decided". Consultants who select funds for European, American or Australian pension funds have for two years demanded, inside their due diligence mandates, an explicit map of where AI operates and documentation of the human safeguards at each decision step.

On the other side, funds that go all-in on AI (Renaissance Medallion, DE Shaw, alternative-data specialists) live in a different world. Their investor base is either internal (the partners) or ultra-sophisticated (tech family offices, sovereign funds comfortable with model risk). They can afford opacity because they do not have to sell the portfolio logic to a municipal investment committee or a regional pension board. Lueck sells to UK, German and Australian pension funds. The pitch "here is why the model is long yen and short bund" is not a posture, it is a commercial survival condition.

The open question for recruiters is which profile wins the next cycle. The two camps will coexist. The bulk of institutional assets will stay with the transparent houses; the bulk of pure innovation will stay with the opaque ones. The people who bridge the two, mastering ML while still knowing how to document and explain a signal, will be the most valuable. That is exactly the line I hold as a freelancer: I ship models and automations a client can audit step by step, never a black box they would have to take on trust.



## View from my desk



On my [Ichimoku bot](/#projects) and the [Bloomberg Dashboard](/#projects) I am building, I apply Lueck's distinction almost by reflex. The Ichimoku model is parametric, its rules are legible, each position is explained by the Tenkan-Kijun-Senkou configuration of the underlying. Claude, through the API, is used to summarise news flows, extract indicators from quarterly reports, or verify the consistency of a backtest rationale. It does not make the entry or exit decision. That discipline has saved me, in paper trading, from giving too much weight to an LLM intuition that turned out to be wrong during two nervous market episodes.

The same logic shapes what I ship for clients. When I automate a 93-node press-monitoring workflow on n8n for [Fromagerie Ermitage](/#projects), or a lead-scoring step in the Callkom B2B pipeline, the reflex is identical: every filter, every ranking rule has to be defensible to the client, never buried in a layer no one could reopen. That is exactly the constraint of a bank ALCO committee, where every hedging decision, every swap, every refinancing choice has to be explained to an auditor or a regulator. An AI model that optimises hedging without exposing its inputs has no chance of clearing the committee door. Lueck is speaking to hedge funds; the argument holds exactly as strongly for bank treasury teams integrating deposit-behaviour, rate or embedded-optionality models into their liabilities.



## Take-away



A manager does not measure a model by its performance in calm regimes; he measures it by its ability to explain itself when the market breaks. Lueck's reminder is that in finance, transparency is not an epistemic whim, it is a risk asset. As long as LLMs remain probabilistic predictors that are hard to audit, serious firms will confine them to the research room. The rest will learn, sooner or later, what a drawdown you cannot narrate really costs.

---

Source: [https://mathieuhaye.fr/blog/en/2026-04-24-aspect-capital-lueck-ia-quant-boite-noire](https://mathieuhaye.fr/blog/en/2026-04-24-aspect-capital-lueck-ia-quant-boite-noire) | Other language: [https://mathieuhaye.fr/blog/2026-04-24-aspect-capital-lueck-ia-quant-boite-noire](https://mathieuhaye.fr/blog/2026-04-24-aspect-capital-lueck-ia-quant-boite-noire)
