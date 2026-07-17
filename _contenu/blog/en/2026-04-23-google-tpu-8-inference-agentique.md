---
title: "Google TPU 8: the agentic era lands on silicon"
date: 2026-04-23T08:00:00+02:00
language: en
slug: 2026-04-23-google-tpu-8-inference-agentique
url: https://mathieuhaye.fr/blog/en/2026-04-23-google-tpu-8-inference-agentique
alternate: https://mathieuhaye.fr/blog/2026-04-23-google-tpu-8-inference-agentique
category: Applied AI
description: "On April 22, 2026, Google unveiled its TPU 8t and 8i for the agentic era. Anthropic commits 3.5 GW. What this means for banks and AI inference costs."
---

# Google TPU 8: the agentic era lands on silicon

> On April 22, 2026, Google unveiled its TPU 8t and 8i for the agentic era. Anthropic commits 3.5 GW. What this means for banks and AI inference costs.

At Google Cloud Next 2026 on Wednesday, April 22, Sundar Pichai and Thomas Kurian presented two chips: the **TPU 8t**, built for model training, and the **TPU 8i**, optimized for inference. Google frames them as "the chips for the agentic era". The gains are precise. The TPU 8t delivers up to 2.7x the performance per dollar of the previous Ironwood generation for large-scale training, and 124% more performance per watt. The TPU 8i claims 80% better performance per dollar for inference, 117% better performance per watt, and three times more on-chip SRAM to host larger KV caches without leaving silicon. The new Boardfly topology connects 1,152 chips in a single pod, and Google says it can link more than a million TPUs in a single cluster, as detailed in the [technical deep dive published by Google Cloud](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive).

On the same day, Anthropic stood out as the largest publicly disclosed TPU customer, with a commitment of multiple gigawatts of next-generation capacity. The expanded agreement with Broadcom and Google, signed in early April 2026, covers 3.5 GW of additional TPU capacity starting in 2027, on top of the 1 GW already coming online in 2026. [Anthropic's own announcement](https://www.anthropic.com/news/google-broadcom-partnership-compute) and the [Tom's Hardware report](https://www.tomshardware.com/tech-industry/broadcom-expands-anthropic-deal-to-3-5gw-of-google-tpu-capacity-from-2027) pin the financial stakes: Anthropic's annualized revenue run-rate went from roughly $9bn at the end of 2025 to above $30bn in spring 2026. Enterprise customers spending more than $1m per year doubled from 500 to over 1,000 in less than two months.

Google positions the TPU 8 as a direct alternative to Nvidia, while still distributing Nvidia's Vera Rubin on its cloud, as [TechCrunch notes](https://techcrunch.com/2026/04/22/google-cloud-next-new-tpu-ai-chips-compete-with-nvidia/). For anyone watching AI in finance, the event is not the reveal of a new chip. It is the precise spot where Google placed the emphasis: inference, not training.



## Inference becomes the economic front line for hyperscalers



For three years, the AI compute race has been about training. The $100bn commitment from Anthropic to AWS or the 4,600 MW ordered by Microsoft were all justified by the cost of building foundation models. 2026 flips the rule. Google has said in public what its engineers have been saying in private for eighteen months: inference is now the dominant expense, and it is permanent.

The logic is brutal for a CFO. Training is a fixed, annual, capitalizable cost. Inference is a variable cost per request that never ends as long as the product lives. With the shift to agents, each user task now triggers 10 to 20 model calls, compared with one in the ChatGPT 3.5 era. The RAG layer, now standard in enterprise use cases, multiplies the number of tokens consumed per query by 3x to 5x, according to figures compiled by [Oplexa](https://oplexa.com/ai-inference-cost-crisis-2026/). The total bill did not go down; it shifted from R&D to production.

The TPU 8i is designed for this world. Three times more on-chip SRAM lets the KV cache live on silicon, which means a 200-billion-parameter model can be served with a latency of a few hundred milliseconds without relying on external HBM. The Boardfly topology, which connects 1,152 TPUs in a single pod, targets workloads where agents call each other in cascading chains. Google is aiming at "millions of concurrent agents". That part is marketing; the design choices behind it are serious.

The open question for enterprise customers: how much of that 80% gain actually reaches the invoice? The history of the five previous TPU generations suggests customers rarely capture more than a third of the technical improvement. The rest feeds into Google Cloud's gross margin, now Alphabet's main growth line.



## Diversifying silicon: the Anthropic lesson for finance



It is worth looking at Anthropic's posture without a filter. As of April 2026, the company runs on three active silicon suppliers: Google's TPUs, Amazon's Trainium chips, and Nvidia's GPUs. Each comes with a distinct contractual logic: the Google-Broadcom deal for 3.5 GW in 2027, the Amazon agreement for $100bn of AWS spending over ten years signed on April 20, and the Nvidia relationship through existing clusters. Anthropic's technical leadership justifies the triangulation as a refusal to depend on a single chip family. The economic motive is more direct: three vendors in the room means better pricing, and coverage against a supply crunch.

This is the behavior of a financial actor that diversifies its counterparties. For banks and asset managers scaling LLM use cases, the question is framed identically. Picking a single model or cloud provider imports concentration risk, pricing dependency, and exposure to a vendor's unilateral decisions. That is exactly the angle adopted by the Bank of England in its March 2026 notes on AI vendor concentration risk, and by the ECB in its preparatory questionnaires for euro-area banks.

For a bank, the defense is not symmetric to Anthropic's. Banks don't negotiate multi-gigawatt contracts. They buy, through one main cloud, API access to a proprietary model, and pay per token. But the logic is the same: you need to be able to switch. The most serious bank AI architectures in 2026 now rely on an abstraction layer (LangChain, an internal gateway, or a LiteLLM proxy) that allows pivoting from OpenAI to Anthropic, or from Claude to Gemini, without rewriting business code. At BNP Paribas or HSBC, that layer has a different internal name, but the function is identical.

The TPU 8 adds a new element to the picture. It boosts Google Cloud's ability to serve third-party models (Claude in particular) at lower cost. A bank client that has picked Anthropic as its preferred vendor can now consume it from Google Cloud at a better price, while keeping the contractual sovereignty of its vendor choice. That dilutes the question "which cloud?" in favor of the question "which abstraction layer?".



## Price per token becomes a P&L line item



The figures from [Epoch AI](https://epoch.ai/data-insights/llm-inference-price-trends) are striking. Between 2022 and 2024, the price per million tokens for a GPT-4-class model dropped from $20 to around $0.40, a 50x reduction. Over the same period, total enterprise spending on generative AI rose 320%. The paradox is simple: the cheaper inference gets, the more enterprises consume. The Jevons curve, familiar to energy economists, repeats itself on compute.

For a bank rolling out a front-office copilot or a credit scoring model, that paradox translates into a practical question. Is the architecture sized for a constant request volume, or is it absorbing the internal democratization of the service? In the first case, falling prices read as margin gain. In the second, they fund a rise in usage whose consolidated financial impact is harder to forecast.

The ghost in this debate has a name: inference debt. Every model shipped to production creates a permanent opex stream indexed on usage. A classic data project amortizes over 3 to 5 years. An AI assistant never amortizes: every future request costs. Pharma has already moved. Eli Lilly rolled out LillyPod in 2026, a purpose-built 9,000+ petaflop on-premise inference system. Finance has not moved yet on this terrain, but the "rent from a hyperscaler versus build your own cluster" debate will come fast.

The TPU 8i speeds up that debate. By making hyperscaler inference 80% cheaper, it pushes the economic breakeven in favor of the cloud. Absent exceptionally large and sensitive workloads, renting remains more rational. That is probably a relief for bank CIOs, who have neither the headcount nor the timeline to build their own dedicated AI infrastructure.



## From where I sit



The [Bloomberg Dashboard](/#projects) I use runs on Claude through the API, via a Python client that routinely chains 8 to 12 calls to process a single annual report. At personal scale, the bill stays reasonable, on the order of a few euros per week. But the exercise taught me to think in tokens before thinking in euros: which part of the context the model actually needs, which part can be compressed, which call can be avoided through a local cache. Those are exactly the habits a bank's IT function will have to generalize when its AI assistant is consumed by 50,000 employees instead of 500.

When I bill a client as a freelancer, these economics stop being theoretical. For [IA Brew](/#projects), my automated AI newsletter on n8n, Claude and Brevo, each edition chains enough calls that the token bill becomes a line to watch like any recurring cost. The real question for a client is never "which model?" but "how sensitive is my margin if price per token drops 40% or if volume doubles?". That question, still absent from bank ALM committees today, will soon join the other market risk and operational cost-of-risk indicators.



## Take-away



Google placed its bet on inference silicon. Anthropic signed for multiple gigawatts. In the middle, a bank rolling out an AI copilot is about to discover that its next recurring cost line is not a software subscription but a compute bill that moves with every use. The question is no longer "should we do AI?", but "at what price per token does my revenue model actually hold?". Bank risk committees have two years to answer.

---

Source: [https://mathieuhaye.fr/blog/en/2026-04-23-google-tpu-8-inference-agentique](https://mathieuhaye.fr/blog/en/2026-04-23-google-tpu-8-inference-agentique) | Other language: [https://mathieuhaye.fr/blog/2026-04-23-google-tpu-8-inference-agentique](https://mathieuhaye.fr/blog/2026-04-23-google-tpu-8-inference-agentique)
