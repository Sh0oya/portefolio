---
title: "Anthropic buys Stainless: who owns the AI agent plumbing"
date: 2026-05-19T08:00:00+02:00
language: en
slug: 2026-05-19-anthropic-rachete-stainless-sdk-agents
url: https://mathieuhaye.fr/blog/en/2026-05-19-anthropic-rachete-stainless-sdk-agents
alternate: https://mathieuhaye.fr/blog/2026-05-19-anthropic-rachete-stainless-sdk-agents
category: Applied AI
description: "Anthropic buys Stainless for over $300M. The SDK toolkit powering OpenAI, Google and Cloudflare APIs now belongs to their direct competitor."
---

# Anthropic buys Stainless: who owns the AI agent plumbing

> Anthropic buys Stainless for over $300M. The SDK toolkit powering OpenAI, Google and Cloudflare APIs now belongs to their direct competitor.

**San Francisco, Monday May 18, 2026.** Anthropic [announced the acquisition of Stainless](https://www.anthropic.com/news/anthropic-acquires-stainless), a startup founded in 2022 by Alex Rattray, a former Stripe engineer. Anthropic did not disclose the price. The Information, picked up by [TechCrunch, put the deal at more than $300 million](https://techcrunch.com/2026/05/18/anthropic-has-acquired-the-dev-tools-startup-used-by-openai-google-and-cloudflare/). Stainless had been backed by Sequoia Capital and Andreessen Horowitz.

The product itself is technical but central. Stainless takes an OpenAPI specification and automatically generates official SDKs in at least six languages: Python, TypeScript, Kotlin, Go, Java. More importantly, the tool keeps those SDKs in sync as the underlying API evolves. That is what made it the reference for platform builders: Stainless generated every official Anthropic SDK, but also OpenAI's, Google's, Cloudflare's, Replicate's and Runway's. In other words, almost the entire club of generative AI vendors.

Anthropic has confirmed it will wind down every hosted Stainless product, including the SDK generator. Existing customers keep ownership of the SDKs they have already generated and the right to modify them freely. Future versions of the service will simply not exist. The announcement quotes Katelyn Lesse, Anthropic's Head of Platform Engineering: *"agents are only as useful as what they can connect to"*. Alex Rattray stays on with his team and continues to work on the toolchain, only now at the direct competitor of his former customers.



## The front line has shifted from models to connectivity



For eighteen months, the rivalry between Anthropic, OpenAI and Google has played out on reasoning benchmarks, context windows and multimodal quality. The Stainless deal says that battleground is no longer the only one, and may not even be the main one. A team building an agent that can close a customer account, send an invoice or provision a workstation easily strings together fifteen to thirty API calls per run. The SDK that wraps each of those calls matters as much as the LLM that decides when to invoke it. A poorly maintained SDK, a type broken after an API update, and the agent chain fails silently.

VentureBeat puts it bluntly: [Claude's next enterprise battle is not models, it's the agent control plane](https://venturebeat.com/orchestration/claudes-next-enterprise-battle-is-not-models-its-the-agent-control-plane). That is the layer that decides which model is called, with which SDK, against which API, with which response format. Until now this layer was fragmented across the specification (OpenAPI), the generator (Stainless), the orchestration protocol (MCP, itself an Anthropic push) and the orchestrators themselves (LangChain, n8n, Make and proprietary agent platforms).

The acquisition consolidates two of those layers in a single move. Anthropic now owns the SDK generator that produces OpenAI's official libraries, and continues to push MCP as the connection protocol between LLMs and customer systems. To gauge how unusual this is, picture Microsoft maintaining the official AWS SDKs. No comparable precedent exists in public cloud.



## Buying the plumbing, not the talent



This is not an acqui-hire. [TipRanks describes it as a lock placed on infrastructure](https://www.tipranks.com/news/private-companies/anthropic-buys-stainless-to-lock-up-key-sdk-infrastructure-and-deny-rivals-access). Anthropic is not buying an engineering team; it is buying a structural dependency. Every team that regenerates its OpenAI or Google SDK through Stainless will have to choose, within six to twelve months, between migrating the generator tooling to an internal alternative or accepting that the maintainer of its API connectors is the direct commercial rival of its model provider.

The economics are clean. Anthropic reports a 2026 revenue run rate above $30bn, up from $9bn one year earlier, based on the figures disclosed alongside last week's SAP-Claude announcement. The number of enterprises spending more than $1 million annually with the company has climbed from 500 to more than 1,000 between March and May. A $300 million ticket is close to one percent of annualised revenue: a small line in the budget of a vendor whose enterprise-share dynamics shifted in its favour with the mid-May release of the Ramp AI Index.

The real benefit for Anthropic is measured elsewhere. It is measured in control over time. When an OpenAI developer tomorrow wants to ship a new version of their Python SDK, the generation tool will be maintained, prioritised and roadmapped by a team that reports inside Anthropic. Nobody has to refuse an update. It is enough to queue it.



## What it changes for the enterprise stack



For a CIO who built her agent stack on an OpenAI Python SDK, nothing breaks on May 19. The generated SDK runs and will keep running. The real question opens at the next update cycle, or at the next major version of the OpenAI API. Investment trade-offs will move faster than expected toward a deliberate multi-vendor logic, with continuous testing on two competing models for any critical workflow.

The B2B vendors now exposing MCP servers are on the front line. [HubSpot, which is opening its CRM through APIs and an MCP server with connectors for Claude, ChatGPT, Gemini and Copilot](https://www.cxtoday.com/crm/hubspot-prepares-to-hand-the-crm-keys-to-ai-agents/), will need to measure whether the experience stays equivalent when one vendor's official SDK is maintained by its rival's engineering team. Salesforce Agentforce, which claimed 18,500 customers in early May and more than 3 billion monthly workflow executions, faces the same calculation. Microsoft shipped Agent 365 on May 8 to take back control of multi-model agent governance; the Stainless deal validates that bet.

The likely scenario at eighteen months is a fragmentation of control above the model layer. Every major software vendor (SAP, Salesforce, ServiceNow, Microsoft) is building its own agent control plane. Every major LLM provider (Anthropic, OpenAI, Google) is moving down into the tooling to become unavoidable. Enterprise buyers who have not treated their agent stack as a portfolio question will discover, in 2027, that they signed up to a single vendor without realising it.



## My read from the field



Both of my running projects depend directly on Stainless-generated SDKs. [IA Brew, the automated newsletter I run across 93 n8n nodes](https://mathieuhaye.fr/#projects), uses Anthropic's Python SDK and OpenAI's TypeScript SDK inside its nodes. My personal Bloomberg Dashboard, which keeps scoring a portfolio with Claude Haiku 4.5, runs on the same Anthropic SDK. Nothing breaks today. Twelve months out, if the Claude SDK roadmap moves faster than the competing SDKs because the original Stainless team is now on Anthropic's payroll, I will see the gap on my critical nodes.

The lesson I pull for my CRM and automation engagements is simple: do not overweight a single LLM vendor at the orchestration layer. Run Claude and OpenAI in parallel on the same critical node, and switch in a few hours when one side slips on quality. It is the same hygiene that applies to a database or a payment processor. What changes in May 2026 is that the discipline now extends down to the SDK layer, which everyone had treated as neutral.



## The real signal



May 18, 2026 does not read like a tech acquisition. It reads like a map change. As long as AI agents depend on external APIs to act, controlling the tooling that connects model to API is worth as much as the model itself. The useful question for a CTO or CFO is no longer which LLM to choose; it is how many critical workflows are running today on SDKs whose roadmap belongs to a single vendor.

---

Source: [https://mathieuhaye.fr/blog/en/2026-05-19-anthropic-rachete-stainless-sdk-agents](https://mathieuhaye.fr/blog/en/2026-05-19-anthropic-rachete-stainless-sdk-agents) | Other language: [https://mathieuhaye.fr/blog/2026-05-19-anthropic-rachete-stainless-sdk-agents](https://mathieuhaye.fr/blog/2026-05-19-anthropic-rachete-stainless-sdk-agents)
