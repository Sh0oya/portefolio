---
title: "AI agents: whoever owns the semantic layer wins"
date: 2026-06-08T11:00:00+02:00
language: en
slug: 2026-06-08-couche-semantique-agents-ia-fabric-snowflake
url: https://mathieuhaye.fr/blog/en/2026-06-08-couche-semantique-agents-ia-fabric-snowflake
alternate: https://mathieuhaye.fr/blog/2026-06-08-couche-semantique-agents-ia-fabric-snowflake
category: Data & Analytics
description: "On June 7, 2026, a SiliconANGLE analysis marks a shift: the value of AI agents now sits in the data semantic layer, not the model. Here is what it means."
---

# AI agents: whoever owns the semantic layer wins

> On June 7, 2026, a SiliconANGLE analysis marks a shift: the value of AI agents now sits in the data semantic layer, not the model. Here is what it means.

- **The 30-second version:**

                - On June 7, 2026, SiliconANGLE framed the new enterprise AI fight as the battle for the "System of Intelligence": the layer that encodes what data means, not the model.

                - At its Build conference in early June 2026, Microsoft launched Fabric IQ, a semantic layer that defines what a customer, an order or a product is, and sets the boundaries of what AI agents may do.

                - Microsoft also unveiled Azure HorizonDB (128TB of storage, 3,072 virtual cores, sub-millisecond latency) and a GPU-accelerated Fabric warehouse claimed to be up to 7x faster than three rivals.

                - Snowflake (Horizon, Cortex) and Databricks (Genie, Unity Catalog) are climbing to the same floor: organizing business context so agents reason and act without getting it wrong.





## The facts



On June 7, 2026, analyst firm SiliconANGLE published a reading that reframes the enterprise AI race. [According to SiliconANGLE](https://siliconangle.com/2026/06/07/snowflake-databricks-model-makers-battle-agentic-client-ai-back-end/), the real contest is not models pitted against each other, but a fight over two interlocking layers: the agentic client, where work gets done, and the "System of Intelligence", the back end that holds the company's context. The thesis fits in one sentence: an agent is only as good as the layer that tells it what your data means and what it is allowed to do with it.

The analysis lands days after Microsoft's Build conference in early June 2026, where the company placed its pieces on exactly this floor. Microsoft launched Fabric IQ, a semantic layer built on the Power BI data definition framework: it describes business concepts (customers, orders, products), their relationships, calculation rules and real-time signals, and it sets the boundaries of what an agent can and cannot do. [According to Digital Today](https://www.digitaltoday.co.kr/en/view/61144/microsoft-fabric-aims-to-be-data-platform-for-ai-agents-targeting-snowflake-and-databricks), Microsoft rounded out the announcement with Azure HorizonDB, a managed PostgreSQL database scaling to 128TB of storage, 3,072 virtual cores and sub-millisecond latency, and a GPU-accelerated Fabric warehouse, in early access in July 2026, presented as up to 7x faster than three rival cloud warehouses. The target is named: Snowflake and Databricks.



## Why does the semantic layer become the real prize?



The semantic layer becomes the central prize because an AI agent does not read tables, it reads meaning. A large language model (LLM) wired straight into a database sees columns named `cust_id`, `amt`, `stat`; it has no idea that an "active customer" excludes accounts cancelled more than 90 days ago, or that "recognized revenue" follows a specific accounting rule. The semantic layer encodes these definitions once, in one place, so every agent gives the same answer to the same question.

This inverts the 2023 intuition, when value concentrated on the model: the most powerful one won. Two years on, frontier models are nearly interchangeable and their cost of access is collapsing. The differentiator has moved to what cannot be copied in a quarter: turning raw data into reliable, dated, governed business concepts. SiliconANGLE describes this "System of Intelligence" as five floors: data mapping, business rules, institutional memory, decision guidance and continuous learning. None of these floors is a model; all of them describe how a company understands its own workings.

The practical consequence is sharp. Two companies renting the same Claude or GPT model will get radically different agents depending on the quality of their semantic layer. One ends up with an assistant that computes the right revenue per segment; the other, with an agent that sums up amounts without knowing which are taxed, refunded or cancelled. Same model; entirely different result.



## Microsoft, Snowflake, Databricks: three ways to hold the ground



Microsoft attacks through depth of integration. Fabric IQ does not stand alone: it connects to Microsoft Foundry, Agent 365, Microsoft 365 Copilot and GitHub Copilot CLI. In other words, Microsoft's semantic layer feeds straight into the surfaces where hundreds of millions of workers already operate. Microsoft's pitch at Build, in early June 2026, is to handle real-time operational data and analytical data on a single platform, where Snowflake and Databricks have historically specialized in analytics.

Snowflake answers with its Horizon layer, which organizes what data means, access permissions and usage policies, paired with Cortex and a natural-language interface, Snowflake Intelligence. [SiliconANGLE noted as early as May 30, 2026](https://siliconangle.com/2026/05/30/personal-agents-light-fuse-snowflake-databricks-move-ai-stack/) that Snowflake and Databricks had "crossed the Rubicon": they are no longer just data platforms serving analytics, they are climbing toward the layer where knowledge, rules and business context become the substrate for agent action. Databricks plays the same score with Genie, its natural-language interface, and Unity Catalog, its governance framework describing access and definitions, extended toward agent observability through MLflow.

Three players, one shared conviction: whoever owns the layer that tells agents what data means will hold the position hardest to dislodge. The model changes with a single config line; the semantic layer holds years of business definitions that nobody rewrites overnight.



## The model is rented, the semantics are built



The heart of the matter is this asymmetry: a model is rented by the minute, a semantic layer is built over time. Any company can, in an afternoon, plug in the application programming interface (API) of a frontier LLM; almost none can, in an afternoon, assemble coherent definitions of "customer", "order", "margin" or "churn" validated by finance, sales and legal. It is precisely this slowness of construction that makes it a defensible asset.

For a decision-maker, the useful question is therefore no longer "which model do I pick", but "do I have a layer that tells a machine what my data means, and that stops it from acting out of bounds?". Without that layer, deploying agents is like letting a very fast newcomer make decisions with no glossary and no procedure. With it, the same agent becomes reliable because meaning and limits are written once, in the right place.



## What this changes in my freelance work



This billion-dollar fight matches what I see at the scale of a small business or a nonprofit. On the [KPI dashboards I built with Apps Script for Profile Club](https://mathieuhaye.fr/#projets), the real work was never the presentation layer, but the shared definition: what counts as an active member, how an attendance is counted, which date is authoritative. Until those rules are written in one place, two dashboards tell two truths, and no agent can trust either.

It is the same logic on my n8n automations and CRM projects. Before wiring anything intelligent onto a pipeline, I spend most of the time making data reliable and naming it: deduplicating, normalizing, dating, setting clear business rules. On my [Bloomberg dashboard driven by Claude Haiku 4.5](https://mathieuhaye.fr/#projets), an agent fed ambiguous labels produces a confident, wrong analysis; the same agent, backed by framed and dated data, becomes a real assistant. Microsoft, Snowflake and Databricks confirm at the billion-dollar scale what I build at the scale of a single client: in a world of agents, the semantic layer is the real defensible asset, and it is built by hand before it is delegated to a machine. It is also why proprietary data gains value, as I covered for [AlphaSense and its $7.5bn corpus](/blog/en/2026-06-05-alphasense-350-millions-agent-recherche-financiere).



## The takeaway



Microsoft, Snowflake and Databricks have just put a price on a simple idea: in the agent era, whoever owns the layer that says what data means owns what matters. The real question for every leader is no longer "which LLM do I plug in", but "is my semantic layer clear enough for a machine to act in my place without getting it wrong?"



## Frequently asked questions



### What is a semantic layer for AI agents?



A semantic layer is the software layer that turns raw data into business concepts an agent can understand: it defines what a customer, an order or a margin is, their relationships, and the calculation rules attached to them. For an AI agent, it acts as both a glossary and a guardrail: it tells the agent what the data means and what it is allowed to do with it. Microsoft Fabric IQ, Snowflake Horizon and Databricks Unity Catalog are three examples launched or extended in 2026.



### What is Microsoft Fabric IQ?



Fabric IQ is Microsoft's semantic layer, launched at the Build conference in early June 2026 and built on the Power BI data definition framework. It describes business concepts (customers, orders, products), their relationships and rules, sets the boundaries of what agents can do, and integrates with Microsoft Foundry, Agent 365, Microsoft 365 Copilot and GitHub Copilot CLI. Microsoft positions it against Snowflake and Databricks.



### Why does the semantic layer matter more than the model?



Because frontier models have become nearly interchangeable and cheap to run, while a semantic layer cannot be copied in a quarter. Two companies renting the same model get very different agents depending on the quality of their business definitions. The durable differentiator is not the model but the governed translation of data into reliable meaning, what SiliconANGLE calls the "System of Intelligence". [Full analysis on SiliconANGLE](https://siliconangle.com/2026/06/07/snowflake-databricks-model-makers-battle-agentic-client-ai-back-end/).

---

Source: [https://mathieuhaye.fr/blog/en/2026-06-08-couche-semantique-agents-ia-fabric-snowflake](https://mathieuhaye.fr/blog/en/2026-06-08-couche-semantique-agents-ia-fabric-snowflake) | Other language: [https://mathieuhaye.fr/blog/2026-06-08-couche-semantique-agents-ia-fabric-snowflake](https://mathieuhaye.fr/blog/2026-06-08-couche-semantique-agents-ia-fabric-snowflake)
