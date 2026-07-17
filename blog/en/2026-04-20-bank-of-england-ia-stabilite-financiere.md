---
title: "Systemic AI: the Bank of England moves to simulations"
date: 2026-04-20
language: en
slug: 2026-04-20-bank-of-england-ia-stabilite-financiere
url: https://mathieuhaye.fr/blog/en/2026-04-20-bank-of-england-ia-stabilite-financiere
alternate: https://mathieuhaye.fr/blog/2026-04-20-bank-of-england-ia-stabilite-financiere
category: ALM & Risk
description: "On April 16, 2026, the Bank of England confirmed it is now stress-testing AI for financial stability. The wait-and-see doctrine is officially over."
---

# Systemic AI: the Bank of England moves to simulations

> On April 16, 2026, the Bank of England confirmed it is now stress-testing AI for financial stability. The wait-and-see doctrine is officially over.

The Bank of England published on April 16, 2026 a letter addressed to the Treasury Committee of the House of Commons. Its signatory, **Sarah Breeden**, is Deputy Governor for Financial Stability; her message is that the institution is building a stress-test framework dedicated to the risks artificial intelligence creates in the UK financial system. The letter sits alongside the [Financial Policy Committee record](https://www.bankofengland.co.uk/financial-policy-committee-record/2026/april-2026) of March 27, published a few days earlier.

Three points stand out. First, the FPC considers that generative and agentic AI adoption in UK finance has not yet reached a systemic threshold. Second, it warns that risks "are likely to increase, potentially rapidly". Third, it asks the BoE and the FCA for further targeted work on agentic AI applied to payments and financial markets.

Breeden's letter details the method. A scenario analysis "focused on plausible macroeconomic and core financial market outcomes", complemented by cyber and operational exercises. The context adds a layer. The Treasury Committee [had accused the BoE of a wait-and-see stance](https://committees.parliament.uk/committee/158/treasury-committee/news/213162/bank-of-england-and-fca-commit-to-action-on-ai-following-warnings-from-mps); the institution rejects that reading. Meanwhile, the [ECB is preparing its own inquiry](https://www.pymnts.com/artificial-intelligence-2/2026/bank-of-england-probes-ai-threats-to-uk-financial-stability/) into European banks, focused on the Mythos model that Anthropic is developing for several UK banks under Project Glasswing.



## A quiet but clear doctrine shift



For several years, the dominant regulatory stance has boiled down to a formula: *technology-agnostic*. Never mind the tool, what counts are the risks it produces. That line is still defended publicly by the PRA and the FCA, as reminded in their joint response of April 1, 2026 on AI in financial services.

So the pivot is not ideological. It is methodological. Stay technology-agnostic on the legal framework, yes; but build AI-specific stress-test scenarios, because the transmission channels are no longer those of a 2010-era bank. A classic stress test assumes a macro shock and measures banks' capacity to absorb losses. An AI stress test assumes a failure or correlated behaviour from algorithmic systems and measures the propagation.

The Bank Policy Institute had published earlier this year a note titled "The Overlooked Risk in Bank AI Adoption: Regulatory Inaction". Its thesis: the absence of a clear framework was letting banks move fast without guardrails, shifting the responsibility back onto regulators. Breeden's letter reads as a direct response. The EU AI Act, fully enforceable for high-risk systems from August 2026, supplies the legal layer. The BoE is now supplying the quantitative one: scenario numbers, exposures, second-round effects.



## Four channels, not one



The FPC does not think in terms of an abstract "AI risk". It breaks the problem into four concrete channels, which is what makes the approach credible.

**Algorithmic herding.** If several trading desks deploy AI agents trained on similar data, their response to a stress signal will be correlated. The Flash Crash of May 2010 gave the template; LLM-based agents add shorter decision latency and opacity on the agent's actual objective. The FPC explicitly asks for work on payments and markets use cases.

**Provider concentration.** A handful of vendors (OpenAI, Anthropic, Google, possibly Mistral and Cohere) supply most of the frontier models. The concentration is tighter than what we already saw on AWS, Azure and GCP at the cloud layer, and regulators have fewer internal audit levers. A shared bug or vulnerability no longer affects one firm, but a sizeable slice of the market.

**Cyber risk.** Prompts, embeddings and outputs become attack surfaces. Malicious instructions inserted into a structured document, *prompt injection* and *data poisoning* attacks, and the fragility of third-party supply chains are now treated as stability variables, not only as IT security topics.

**Growing autonomy.** A copilot that suggests a response for human review is a tool; an agent that triggers a credit decision, a quote or a hedge without review is a market position. If these positions multiply, the resulting chains of decisions produce systemic effects poorly covered by current risk models.



## Project Glasswing and the opacity problem



The name that draws the eye in this file is **Mythos**, the model Anthropic is developing under the codename *Glasswing* for several UK banks. The ECB plans to question European banks about the cyber risks flowing from it, following comparable initiatives in the US and UK.

The tension point is classic outsourcing economics: pooling models lowers fixed costs but concentrates failures. If three or four major banks share a single model trained on sensitive data, a generation bug, a statistical drift or a cyber vulnerability no longer hits one firm but a significant share of the market. Current governance frameworks, including the EU's DORA, cover part of the ground; they were not written for models whose internal state is not directly observable.

The BoE is not asking for these projects to stop. It is building the framework that will decide, tomorrow, whether a bank can carry exposure to an agent without triggering a concentration-risk flag. The battle opening up is not between AI and regulation; it is between banks that seriously document their model dependencies and those that will discover, at the next simulation, what they did not know about their own operational chain.



## What it changes when you build these systems



I look at this file from my freelance desk, where I wire models onto client data every day. What the BoE describes, I handle at small scale: on the [Callkom B2B prospection pipeline](/#projects), an n8n workflow chains Apify, Pappers and Brevo, and the agent orchestrating those calls makes decisions nobody reviews line by line. As long as it is an SME qualifying leads, the stakes stay measured. Transpose that same logic of correlated agents onto a trading desk, and stress episodes get faster and more synchronised. A stress test that ignores that parameter will run a quarter behind.

The other angle is tooling. The [Bloomberg Dashboard](/#projects) I built uses Claude Haiku to read earnings reports, extract ratios and suggest an interpretation. At personal-portfolio scale, it is an assistant. At bank back-office scale, it is a risk position. The reading Breeden is pushing, from the BoE, is exactly that: stop treating the model as a tool, treat it as an operational counterparty whose failure has a quantifiable cost and a defined propagation perimeter. It is also the discipline I impose on myself the moment a client build lets a model act without human review.



## Take-away



Language models move faster than doctrines, and the BoE just closed a quarter of lag in one letter. The real question now: how fast the ACPR and the ECB will publish their own scenarios, and how fast the banks that market themselves as "AI-first" will accept their models entering a stress test whose parameters are not theirs to set.

---

Source: [https://mathieuhaye.fr/blog/en/2026-04-20-bank-of-england-ia-stabilite-financiere](https://mathieuhaye.fr/blog/en/2026-04-20-bank-of-england-ia-stabilite-financiere) | Other language: [https://mathieuhaye.fr/blog/2026-04-20-bank-of-england-ia-stabilite-financiere](https://mathieuhaye.fr/blog/2026-04-20-bank-of-england-ia-stabilite-financiere)
