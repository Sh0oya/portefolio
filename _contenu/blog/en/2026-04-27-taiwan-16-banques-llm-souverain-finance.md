---
title: "Taiwan: 16 banks unite to build a sovereign banking LLM"
date: 2026-04-27T08:00:00+02:00
language: en
slug: 2026-04-27-taiwan-16-banques-llm-souverain-finance
url: https://mathieuhaye.fr/blog/en/2026-04-27-taiwan-16-banques-llm-souverain-finance
alternate: https://mathieuhaye.fr/blog/2026-04-27-taiwan-16-banques-llm-souverain-finance
category: Applied AI
description: "On April 23, 2026, sixteen Taiwanese banks pooled funds to build a sovereign banking LLM for NT$40-70 million. What this signals for Europe's financial AI strategy."
---

# Taiwan: 16 banks unite to build a sovereign banking LLM

> On April 23, 2026, sixteen Taiwanese banks pooled funds to build a sovereign banking LLM for NT$40-70 million. What this signals for Europe's financial AI strategy.

The announcement was reported on April 23 by [Bloomberg](https://www.bloomberg.com/news/articles/2026-04-23/taiwan-banks-to-build-own-ai-model-to-rival-global-giants) and confirmed the same day by the [Taipei Times](https://www.taipeitimes.com/News/biz/archives/2026/04/23/2003856063). Sixteen Taiwanese financial institutions are forming a consortium to build a banking-specific large language model. The coordinator is CTBC Financial Holding, one of the island's largest financial groups. Supervision sits with the Financial Supervisory Commission (FSC), whose chairman Peng Jin-lung is publicly backing the project. Taiwan's Ministry of Digital Affairs will provide a "sovereign AI" corpus for training.

The numbers are striking in their modesty. The initial budget runs between NT$40 million and NT$70 million, roughly $1.3 million to $2.2 million, shared across participants. The list of banks involved reads like a near-complete map of the local market: Bank of Taiwan, Land Bank of Taiwan, Taiwan Business Bank, Chang Hwa Commercial Bank, Cathay Financial Holding, Fubon Financial Holding, Mega Financial Holding, First Financial Holding, Hua Nan Financial Holdings, Taishin Financial Holding, Shin Kong Financial Holding, SinoPac Financial Holdings, Taiwan Cooperative Financial Holding, E.SUN Financial Holding, Chunghwa Post and Next Bank. Training begins in May 2026, an initial banking-focused version is expected in August, full deployment by year-end, and expansion to insurance and securities sectors in 2027.

The technical detail is just as instructive. The model will sit on top of an open-source base, but explicitly *not* a Chinese platform, as [BigGo Finance](https://finance.biggo.com/news/5vuKt50BQ45Y7dX6z0sz) notes. The FSC's reasoning is straightforward: Taiwan's financial services operate inside a complex local regulatory framework that foreign models simply do not capture. The same logic shapes the first use cases listed by [BanklessTimes](https://www.banklesstimes.com/articles/2026/04/23/taiwan-banks-build-local-ai-to-cut-foreign-reliance/): customer support, document analysis, internal knowledge search. No market signal generation, no automated decision-making. The first building blocks are conservative and auditable.



## Why a dedicated banking LLM, instead of ChatGPT?



The question deserves a direct answer, because it shapes how to read the announcement. The FSC offers three. First, data confidentiality. A general-purpose model hosted at OpenAI, Google or Meta forces, sooner or later, a banking query out onto foreign infrastructure. For KYC files, credit notes or client transcripts, that pattern is incompatible with data protection rules and banking secrecy. Second, fidelity to local regulation. A general-purpose model knows US or European rules better than Taiwanese ones; in production, it makes subtle errors that supervisors no longer tolerate. Third, auditability. A model whose training and corpus you control can be explained to an auditor or a regulator. A model whose weights are sealed in San Francisco cannot.

This logic is not unique to Taiwan. It mirrors exactly the European debate. Mistral raised €722 million in March 2026 to fund its data centre near Paris, fitted with 13,800 Nvidia GB300 GPUs, as [CNBC](https://www.cnbc.com/2026/03/30/mistral-ai-paris-data-center-cluster-debt-financing.html) reported. The pitch is identical: offer large European institutions an open, continent-hosted alternative compatible with MiFID II, GDPR and the AI Act. HSBC, Allianz and several insurers have already picked Mistral for internal use cases. Unlike Taiwan, however, Europe is moving fund by fund and bank by bank. The Commission has not asked institutions to co-fund a shared infrastructure. They negotiate licenses in scattered order.

The Taiwanese specificity sits there: the regulator is not just setting rules, it is orchestrating mutualisation. A single infrastructure, paid for by the sixteen largest financial groups, supervised by the FSC, aligned with the *AI Basic Act* that took effect in January 2026. The bet is that pooling costs lets mid-sized banks access a model they could never have funded alone. Cost per participant in the initial phase falls to roughly $100,000 on average, trivial next to the tens of millions an equivalent in-house project would cost each one.



## Sovereignty or operational concentration?



The geopolitical reading is too easy. Taiwan's project is not retreat; it is an attempt to build a specialised banking layer on top of an open-source base. That is, in fact, applied-AI best practice. A general-purpose model, however powerful, underperforms in a niche domain when it is not trained on the sector's vocabulary, flows and use cases. Goldman Sachs and JPMorgan know this well: their internal assistants (GS-AI, LLM Suite) are not wrappers around ChatGPT, they are fine-tunes on their own documents. Taiwan's innovation is to do that work at the scale of an entire financial centre rather than one firm.

Mutualisation comes with a cost that should not be glossed over. A shared infrastructure creates a single point of fragility. If the common model goes down, Taiwan's banking sector slows down with it. If the model hallucinates on a class of documents, the error spreads to every participant simultaneously. The concentration risk that the ECB has flagged since 2024 in its financial stability report, and that the [Bank of England confirmed in April 2026](/blog/en/2026-04-20-bank-of-england-ia-stabilite-financiere), applies as much to a model proprietary to a single vendor as to a model common to a financial centre. The FSC is aware of this: centralised governance can, in theory, test and audit the shared model with rigor that no individual bank could match alone.

The other watch-out is raw performance. A Taiwanese banking LLM trained for $1.3-$2.2 million will not match GPT-5 or Claude 4.7 in reasoning capabilities. That is not the goal. The announced scope (customer support, document analysis, internal search) is precisely the territory where AI value depends more on domain knowledge than on abstract reasoning. For complex arbitrage, risk analytics or quantitative research, banks will likely keep calling on frontier models in parallel.



## What Europe should be watching



The Taiwanese lesson has immediate European relevance. France already hosts one of the three global poles of sovereign AI through Mistral and Kyutai. The Paris financial centre includes BNP Paribas, Société Générale, Crédit Agricole, BPCE, Axa, Crédit Mutuel; on its own, a banking volume comparable to Taiwan's. No equivalent mutualisation initiative has been announced to date. Each major French bank signs its own contracts with OpenAI, Anthropic, Mistral, sometimes all three at once, with no coordination on use cases. Banque de France and the ACPR observe; they do not organise.

An equivalent European initiative could take several shapes. The simplest would be a consortium led by the Fédération bancaire française with co-funding from Bpifrance, building on a European open-source model trained on French banking corpora and ACPR jurisprudence. The most ambitious would be a eurozone-wide project under the European Banking Authority, with thematic modules per jurisdiction. The most likely trajectory is the least glamorous: each major bank will keep funding its own fine-tune on general-purpose models, in duplication, with no mutualisation benefit.



## From where I sit



The sovereignty-and-hosting question is one I face on every freelance project, at a different scale. When I build the Salesforce CRM for [e-Enfance / 3018](/#projects), which handles reports involving minors, or the Callkom B2B prospection pipeline that joins Pappers and Apify data, a client's first question is never "which model is smartest" but "where do my data live, who can read them, and can I explain it". That is exactly the FSC's reasoning, transposed to an SME or a nonprofit. At the scale of a development bank like AFD, which refinances roughly €13 billion per year and whose counterparties are sovereign states, the same question lands in even more demanding terms: governance of a cash-flow-forecasting or asset-liability-allocation model cannot rely on opaque weights and corpora.

On my own tools, the picture is more modest but consistent. The [Bloomberg Dashboard](/#projects) I am building uses Claude through API for narrow tasks (summarising articles, extracting indicators from transcripts), with human checks at each step. If I had to industrialise it inside a financial institution tomorrow, the real question would not be "which model is smartest", but "which model can I audit, host and explain to my risk committee". Taiwan answers that question through infrastructure; Europe, for now, answers it through individual contracts.



## Take-away



When sixteen banks from the same financial centre pool a single LLM, this is not a technical procurement; it is a strategic option on what banking AI will look like over the next decade. Taiwan has just set a precedent. The Paris financial centre has every asset to set its own; the question is which side of the chain (banks, regulator or public authorities) will be the first to put the project on the table.

---

Source: [https://mathieuhaye.fr/blog/en/2026-04-27-taiwan-16-banques-llm-souverain-finance](https://mathieuhaye.fr/blog/en/2026-04-27-taiwan-16-banques-llm-souverain-finance) | Other language: [https://mathieuhaye.fr/blog/2026-04-27-taiwan-16-banques-llm-souverain-finance](https://mathieuhaye.fr/blog/2026-04-27-taiwan-16-banques-llm-souverain-finance)
