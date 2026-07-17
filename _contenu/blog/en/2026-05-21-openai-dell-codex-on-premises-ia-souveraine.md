---
title: "OpenAI x Dell: Codex leaves the cloud for on-premises data centers"
date: 2026-05-21T08:00:00+02:00
language: en
slug: 2026-05-21-openai-dell-codex-on-premises-ia-souveraine
url: https://mathieuhaye.fr/blog/en/2026-05-21-openai-dell-codex-on-premises-ia-souveraine
alternate: https://mathieuhaye.fr/blog/2026-05-21-openai-dell-codex-on-premises-ia-souveraine
category: Applied AI
description: "On May 19, 2026, OpenAI signed a deal with Dell to run Codex in hybrid and on-premises environments, the first frontier offering built for regulated sectors."
---

# OpenAI x Dell: Codex leaves the cloud for on-premises data centers

> On May 19, 2026, OpenAI signed a deal with Dell to run Codex in hybrid and on-premises environments, the first frontier offering built for regulated sectors.

The official announcement landed on May 19, 2026, on [OpenAI's blog](https://openai.com/index/dell-codex-enterprise-partnership/): Dell Technologies and OpenAI have signed a multi-year agreement to run Codex inside the Dell AI Data Platform and the Dell AI Factory. In practice, the coding agent that spent the past 12 months locked inside ChatGPT Enterprise and the OpenAI API can now sit on the customer's own Dell hardware, with source code never leaving the corporate perimeter.

OpenAI reports more than 4 million weekly Codex developers. Dell, on its side, claims 5,000 Dell AI Factory customers already deployed, according to [ChannelLife](https://channellife.com.au/story/openai-dell-partner-on-codex-for-on-premises-firms). Combining these two footprints gives Codex a direct distribution channel into private enterprise data centers, with no dependency on Azure or any other public cloud vendor. As far as I can tell, this is the first time OpenAI has officially agreed to decouple its flagship product from the public cloud.

The commercial framing comes from Ihab Tarazi, Dell SVP and CTO for Infrastructure Solutions Group: *"The Dell AI Factory with OpenAI Codex will allow enterprises to deploy AI where enterprise data already lives, within their premises, giving customers a practical, secure path to deploying AI agents at scale"* ([ResultSense](https://www.resultsense.com/news/2026-05-19-openai-dell-codex-on-prem/)). The pitch is squarely aimed at regulated sectors: financial services, healthcare, government.



## What moving out of the public cloud actually changes



Since 2023, every frontier AI vendor has been selling the same implicit promise: *send us your data, pay per token, get an answer back*. That model fits a startup or a marketing team perfectly. It hits a wall the moment you walk into a sector where data sovereignty is non-negotiable. A UK retail bank cannot send the source code of its pricing engine to an Azure US East endpoint. An NHS trust cannot expose patient records inside a cloud prompt. A government department often cannot, by law, send certain workloads outside national borders.

The outcome: these organisations have stacked up AI pilots over the past 18 months, but very few have moved to production. The OpenAI-Dell deal unblocks that bottleneck. Codex installs on the customer's infrastructure, indexes internal repositories, reads proprietary documentation, suggests edits, and none of the code leaves the perimeter. For shops that already invested in the Dell AI Factory to run Llama 3 or in-house models, this is an upgrade to a frontier model without changing the underlying stack.

The technical angle matters too. The hook into the Dell AI Data Platform suggests Codex will not only answer, it will also read from and write to enterprise systems of record. The OpenAI release explicitly mentions data preparation, system-of-record management, AI application deployment. We are stepping from coding assistant to operational agent embedded in the in-house stack.



## A strategic answer to Anthropic, and a hit against Azure



This announcement should be read as a move in a three-way chess game. Anthropic spent the past seven months locking down the Big Four consultancies (Deloitte, PwC, KPMG), SAP, Slack and Salesforce, hammering home that Claude was *the* frontier model compatible with enterprise constraints. Each alliance verticalises Claude distribution a little more. Over the same period, OpenAI kept looking like the lab tethered to Microsoft Azure for heavy enterprise workloads.

The Dell partnership shifts that positioning. OpenAI can now address a customer who says outright *"I don't want Azure"*, which until now would push the prospect toward Anthropic via AWS Bedrock or toward an open-source model. Mechanically, this opens a sales door across European banking and insurance, where Azure is sometimes contractually excluded for sovereignty reasons.

From Microsoft's seat, the signal is ambiguous. Officially, the publisher remains OpenAI's preferred cloud partner. But a hybrid/on-prem alliance with Dell tells a simple story: **OpenAI can no longer afford to hand the regulated-sector market to Anthropic and open-source models**. Even if it dilutes Azure exclusivity a little. For the IT architects who have been tracking this file since 2024, this is confirmation that the public-cloud-only phase of enterprise frontier AI is over.

The other angle is purely financial. On a typical regulated-sector buyer negotiating an eight-figure AI contract today, the share that lands at OpenAI depends directly on the contractual vehicle. Routing through Azure, OpenAI splits margin with Microsoft. Routing through Dell on-prem, the split is with Dell, whose public-market multiples sit well below Microsoft Cloud. Mechanically, net revenue per customer can be higher on-prem even at the same sticker price. No one has costed this in the press releases, but it is a number every OpenAI CFO has run by now.

It also reframes what "winning the enterprise" looks like. A year ago, the metric was tokens per second and context window. Today, it is the percentage of Fortune 500 IT estate where the model can legally and physically run. By that lens, Anthropic has a head start on consulting and SaaS distribution; OpenAI just bought itself a foothold inside the customer's own racks. The next 12 months will probably see Anthropic respond with its own on-prem play, most likely through AWS Outposts or a similar OEM partnership.



## From raw capability to deployment infrastructure



Six months ago the frontier race was about benchmarks. Today it is about delivery. Anthropic bought [Stainless](https://mathieuhaye.fr/blog/en/2026-05-19-anthropic-rachete-stainless-sdk-agents) to control the SDK plumbing. OpenAI launched [the Deployment Company](https://openai.com/index/openai-launches-the-deployment-company/) with over $4bn in initial capital and 150 Forward Deployed Engineers absorbed from the Tomoro acquisition. And now this Dell partnership to drop straight into the customer data center.

The pattern is clear: frontier labs are accepting that shipping a model is no longer enough. You have to deliver it, integrate it, maintain it. This looks a lot like what IBM did in the 1990s with Global Services, or Oracle with its consulting ecosystem. The difference: here the raw material is not middleware, it is a model whose gross margin shrinks as competition tightens. Frontier labs capture value by pushing into the deployment layer, because that is where the customer pays for years.

For developers, this shift has a tangible consequence. The job of *AI engineer* in 2026 is no longer prompting Claude or GPT. It is installing an agent inside a complex environment: Active Directory integration, permission mapping, secret handling, internal Git connection, call observability. The Forward Deployed Engineer is now the most sought-after profile of the moment.



## What this changes for the kind of work I see



On the freelance work I deliver, the *on-prem* question shows up systematically. When I built the job-scoring tool with ATS-friendly CV generation for [my own portfolio](https://mathieuhaye.fr/), I kept the LLM layer on a public API because the data was mine. On the Salesforce-3CX engagement for [3018 / e-Enfance](https://www.e-enfance.org/), the brief was the opposite: everything had to stay inside the client's Salesforce tenant with a full audit trail. No external AI assistant was allowed near the recorded conversations.

With Codex on Dell AI Factory, that kind of scope suddenly becomes easier to draft. You can picture a code-review agent installed inside the Salesforce perimeter, reading Apex classes from a production org, proposing refactors, and never sending anything back to OpenAI. For the clients I work with, the blocker has never been *model quality*; it has always been *data exfiltration*. That barrier just dropped for Codex. Worth watching for ChatGPT Enterprise and the broader API in the coming months; the release hints the rest will follow on the same infrastructure.



---



**Takeaway.** The OpenAI-Dell deal does not change the model's raw capability; it changes who can buy it. And at this scale, who can buy it is worth more than any HumanEval score.

---

Source: [https://mathieuhaye.fr/blog/en/2026-05-21-openai-dell-codex-on-premises-ia-souveraine](https://mathieuhaye.fr/blog/en/2026-05-21-openai-dell-codex-on-premises-ia-souveraine) | Other language: [https://mathieuhaye.fr/blog/2026-05-21-openai-dell-codex-on-premises-ia-souveraine](https://mathieuhaye.fr/blog/2026-05-21-openai-dell-codex-on-premises-ia-souveraine)
