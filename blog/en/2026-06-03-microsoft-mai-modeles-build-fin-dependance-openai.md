---
title: "Microsoft Build 2026: 7 in-house AI models cut OpenAI ties"
date: 2026-06-03T08:00:00+02:00
language: en
slug: 2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai
url: https://mathieuhaye.fr/blog/en/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai
alternate: https://mathieuhaye.fr/blog/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai
category: Applied AI
description: "On June 2, 2026, Microsoft unveiled seven in-house AI models at Build, including MAI-Thinking-1 with 35 billion active parameters. End of Azure's OpenAI dependency."
---

# Microsoft Build 2026: 7 in-house AI models cut OpenAI ties

> On June 2, 2026, Microsoft unveiled seven in-house AI models at Build, including MAI-Thinking-1 with 35 billion active parameters. End of Azure's OpenAI dependency.

- **Key takeaways:**

                - Microsoft introduced 7 in-house AI models at Build 2026 on June 2, branded as the MAI family.

                - MAI-Thinking-1 activates 35 billion of its 1 trillion parameters per query, with a 256,000-token context window.

                - It scores 97.0% on AIME 2025 and matches Claude Opus 4.6 on SWE-Bench Pro, per Microsoft's internal evaluations.

                - Mustafa Suleyman claims inference costs 10x lower than GPT-5 on benchmarks prepared with McKinsey.





## The facts



For eight years, Azure and OpenAI were practically synonymous. On June 2, 2026, Microsoft broke that equation at its Build conference in San Francisco. Mustafa Suleyman, CEO of Microsoft AI, introduced seven in-house artificial intelligence models under the MAI brand. The most visible, MAI-Thinking-1, is a reasoning system with 35 billion active parameters running on a sparse Mixture of Experts architecture with approximately 1 trillion total parameters, paired with a 256,000-token context window. Per Microsoft documentation, it scores 97.0% on the AIME 2025 mathematics benchmark and 94.5% on AIME 2026, and matches Anthropic's Claude Opus 4.6 on the SWE-Bench Pro coding test. Anonymous human raters preferred it over Claude Sonnet 4.6 in blind side-by-side evaluations.

The model has been live in private preview on Microsoft Foundry since June 2, 2026. Alongside it ships MAI-Code-1-Flash, Microsoft's first in-house code generation model, and five further specialized models. Mustafa Suleyman, in [remarks reported by CNBC](https://www.cnbc.com/2026/06/02/microsoft-unveils-new-ai-models-lessen-reliance-on-openai-lower-costs.html), said benchmarks prepared with McKinsey showed inference costs 10 times lower than GPT-5 for comparable results. The announcement follows directly from the April 2026 amendment between Microsoft and OpenAI, which ended Microsoft's exclusive license on OpenAI intellectual property and removed Microsoft's obligation to share Azure revenue with OpenAI; OpenAI's capped revenue share to Microsoft was preserved through 2030. Microsoft published the evaluations as a preprint, [as flagged by TechTimes](https://www.techtimes.com/articles/317631/20260602/microsoft-build-2026-mai-thinking-1-first-house-reasoning-model-trained-without-openai-data.htm), without peer review or independent reproduction so far.



## Why Microsoft is choosing independence now



Microsoft is choosing independence in June 2026 because OpenAI's cost was eating directly into its cloud margin, and because single-supplier dependency had become untenable against AWS and Google. For five years, a significant share of Azure revenue flowed back to OpenAI under the exclusive license, even as usage exploded. AI agents, code completions, chatbots embedded in Office: every Microsoft product paid OpenAI on every inference call. The April 2026 amendment loosened that financial knot. The MAI launch cuts it.

The second driver is strategic. A cloud platform built on a single model supplier carries structural competitive risk. If OpenAI raises prices, Microsoft passes them on. If OpenAI slips behind technically, Azure slips with it. By owning the model layer, Microsoft regains control of its roadmap, release cadence, and gross margin. It is the same playbook Amazon Web Services runs with Bedrock and Google Cloud runs with Gemini: every hyperscaler wants its own model catalog.

The third driver, which gets less coverage, is control of the inference plane. Microsoft Foundry now acts as a single control plane that orchestrates in-house models, OpenAI models, partner models, and open source models. For an enterprise buyer, the pitch is sharp: you buy the platform, then arbitrate across providers without changing API or rewriting agent workflows. It is the Bedrock argument, transposed onto Azure. The twist is that Microsoft now controls one of the providers on its own catalog.



## How much do the benchmarks actually mean?



The benchmarks Microsoft published deserve careful reading, because the evaluations were released as a preprint without peer review or independent reproduction. The comparisons against Claude Opus 4.6 on SWE-Bench Pro and the human-preference results against Claude Sonnet 4.6 rest on Microsoft's own evaluations. Anthropic, OpenAI, and DeepMind use the same playbook with their own releases, but the sector's track record calls for caution: a model announced at parity with a competitor frequently slips once it meets real production workloads.

The 10x cost figure against GPT-5 comes from benchmarks prepared with McKinsey, a Microsoft Foundry customer. The full methodology is not public. What is verifiable is the architecture itself: a sparse Mixture of Experts that activates only 35 billion parameters out of a notional 1 trillion per query. Other things equal, that design lowers per-token inference cost, provided the routing system is efficient. If Microsoft has nailed the routing, the cost claim becomes plausible, though the 10x ratio still needs validation on heterogeneous workloads.

The right move for engineering leaders is not to take the numbers at face value, but to test MAI-Thinking-1 against their own use cases. The field reports of the next few quarters will matter more than the preprint. Microsoft will likely migrate parts of its internal Copilot stack to MAI over the coming year, which will produce the first real test at scale. Until then, any migration story from Claude or GPT-5 is a bet, not a decision.



## What it changes for enterprise buyers



For CIOs, the immediate consequence is tactical: Microsoft becomes a catalog negotiator, after years of monetizing a single-supplier rent. Azure contracts renegotiated in the second half of 2026 will mechanically include portability clauses between MAI, GPT-5, and partner models. Smart buyers will ask for pricing benchmarked against the cheapest model in the catalog, not the premium proprietary ones.

The second consequence runs deeper. For five years, Microsoft's commercial pitch boiled down to the quality of GPT-4 then GPT-5. The new pitch says quality comes from picking the right model for the right task. That forces IT teams to learn to compare, benchmark internally, and measure quality per use case rather than rely on a single brand. It is exactly the work that vendors like OpenRouter, Vellum, and Promptfoo already monetize at small scale, and it now becomes a governance reflex rather than a specialist sport.

The third consequence reshapes the hyperscaler fight. AWS pushes Bedrock as an agnostic platform. Google pushes Vertex AI with Gemini. Microsoft Foundry now joins the same logic, with one unique card: native integration into Office, Teams, Outlook, and Windows. The contest is no longer which model wins; it is which platform best orchestrates diversity. The companies that come out ahead will be those that build an internal abstraction layer to swap models without rewriting their stack.



## What it changes in my freelance work



This multi-model logic is exactly what I have been applying with clients for eighteen months. For the job-offer scorer with ATS resume generation I maintain, I tested four providers on the same set of forty postings. Quality gaps were small; cost ratios ranged from one to four. The final stack settled on two distinct models: a stronger reasoning model for the analysis note, a lighter model for resume generation. Useful quality rarely lives in a single provider.

On the [Bloomberg Dashboard](https://mathieuhaye.fr/#projets) applied to my personal portfolio, Claude Haiku 4.5 is enough to score positions daily; a heavier model would be wasted spend. The same discipline shapes the 93-node n8n pipeline I built for [Fromagerie Ermitage](https://mathieuhaye.fr/#projets): a fast classification model upstream, a stronger writer downstream. Microsoft's announcement confirms this will become standard practice. The freelance skill that pays in 2026 is no longer prompt craft; it is provider arbitrage on a precise use case, with metrics on the table. That is exactly what I bring to the SMEs that want to [work with me](/en/collaboration) on their AI projects.



## Frequently asked questions



### What is the difference between MAI-Thinking-1 and MAI-Code-1-Flash?



MAI-Thinking-1 is a reasoning model with 35 billion active parameters and a 256,000-token context window, built for long analytical workloads. MAI-Code-1-Flash is a lighter model dedicated to generating application code from plain-language prompts. Both have been live in private preview on Microsoft Foundry since June 2, 2026.



### Is the Microsoft-OpenAI partnership broken?



No, but it was rewritten in April 2026. Microsoft lost its exclusive license on OpenAI intellectual property and is no longer obligated to share Azure revenue with OpenAI. OpenAI still pays a capped revenue share back to Microsoft through 2030.



### Should you migrate your Azure workloads to MAI models?



Not yet. MAI-Thinking-1 is in private preview and its production behavior on heterogeneous workloads has not been independently validated. The right approach is to benchmark MAI on two or three of your internal use cases before deciding between MAI, GPT-5, and partner models on the same Foundry plane.



---



The era of the single AI supplier is over. Microsoft, which had extracted the most visible rent from that model with OpenAI, just formalized the shift to a multi-model world. Whether MAI delivers in production what its preprints promise remains an open question. The competitive question is no longer which model wins; it is which team can arbitrate fastest, on the right metric, at the right moment.

---

Source: [https://mathieuhaye.fr/blog/en/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai](https://mathieuhaye.fr/blog/en/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai) | Other language: [https://mathieuhaye.fr/blog/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai](https://mathieuhaye.fr/blog/2026-06-03-microsoft-mai-modeles-build-fin-dependance-openai)
