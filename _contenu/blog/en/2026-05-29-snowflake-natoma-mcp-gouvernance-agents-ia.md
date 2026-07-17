---
title: "Snowflake buys Natoma: governing AI agents"
date: 2026-05-29T08:00:00+02:00
language: en
slug: 2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia
url: https://mathieuhaye.fr/blog/en/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia
alternate: https://mathieuhaye.fr/blog/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia
category: Data & Analytics
description: "Snowflake acquired Natoma on May 27, 2026 to govern AI agents through the MCP protocol. Why controlling agents, not data access, is the real battleground."
---

# Snowflake buys Natoma: governing AI agents

> Snowflake acquired Natoma on May 27, 2026 to govern AI agents through the MCP protocol. Why controlling agents, not data access, is the real battleground.

For eighteen months, the whole conversation about AI agents revolved around one question: how do you give them access to enterprise data. The week of May 26, 2026 flipped the question on its head. Access is no longer the hard part. The hard part is controlling what the agent is allowed to do once it has that access.



## The facts



On May 27, 2026, Snowflake announced its intent to acquire [Natoma](https://www.snowflake.com/en/news/press-releases/snowflake-announces-intent-to-acquire-natoma-providing-secure-connectivity-for-the-agentic-enterprise/), a platform built around the Model Context Protocol (MCP). Natoma was founded in 2024, employs 27 people, and is led by Pratyus Patnaik, who previously sold his company atSpoke to Okta in August 2021 for $79.3M. Snowflake did not disclose the deal terms or the expected closing date.

Natoma stores no data and trains no model. Its product is a gateway: a layer that decides which agents can discover, reach and act on which systems, with identity-aware authorization, access policies and a full audit trail. Once the deal closes, customers will be able to connect Cortex Agents, Snowflake Intelligence and Cortex Code to their SaaS apps, cloud environments, VPCs and on-prem infrastructure through a verified library of MCP servers, then enrich Snowflake data with context from Slack, email, the CRM or Jira.

The announcement landed the same day as quarterly earnings. For the first quarter of its fiscal 2027, Snowflake posted product revenue of $1.33bn, up 34% year over year, an acceleration from 30% the prior quarter. Total revenue hit $1.39bn (up 33%), net revenue retention stood at 126%, and 779 customers now spend more than $1M in annual product revenue. Alongside it, the company confirmed a $6bn, five-year commitment with AWS for Graviton compute and AI services. Sridhar Ramaswamy, the chief executive, summed up the logic: *agents don't just need access to data; they need the right context, permissions and policy guardrails to operate safely inside the enterprise.*



## Data access is no longer the problem



For two years, the industry sold the idea that an agent's value scaled with the richness of the data you opened to it. That held while agents only read. The problem changes the moment they write, trigger actions and chain tool calls without a human in the loop. An agent that can read your CRM is useful; an agent that can edit an opportunity, send an email on the rep's behalf and trigger a refund is an autonomous actor inside your processes. The question is no longer whether it sees the data, but whether it is allowed to take that specific action, at that specific moment, in that specific context.

That is exactly Natoma's turf. The gateway is not there to grant more access; it is there to deny it. It enforces identity, policy and audit at the tool-call level, not at the database level. Michael Ni, an analyst at Constellation Research, put it bluntly to [CIO](https://www.cio.com/article/4178160/snowflake-to-acquire-mcp-focused-natoma-to-boost-governance-for-ai-agents.html): *data platforms won the analytics era; whoever governs agents, context and autonomous actions wins the agentic era.* Snowflake is not buying a product, it is buying a position on the layer where the next decade will be decided.



## MCP, a victim of its own success



MCP is an open protocol released by Anthropic. In a little over a year, it became the de facto standard for plugging an agent into external tools, APIs and data sources. Success has a downside: every MCP server adds a door, and nobody holds the master keyring. Snowflake admits as much in its own release, pointing to fragmented governance, shadow AI and a higher risk of data exfiltration.

Phil Fersht, head of the analyst firm HFS Research, describes the trap, again to CIO: *MCP is becoming the connective tissue for enterprise agents, but without identity, policy, privileged access controls and auditability, it can quickly become a shadow AI risk.* An agent that pulls context from email, Slack, the CRM and internal systems can also expose sensitive information, trigger the wrong action or bypass a control if the rules are weak. The protocol solves connectivity; it does not solve trust. And trust is precisely what a CIO demands before putting an agent into production.

That is why a data platform vendor pays for a 27-person company with no published revenue. Snowflake already has the data and the agent engine with Cortex; what it lacked was the control room between the two. Buying Natoma means owning the place where the enterprise decides what its agents are allowed to touch.



## The governance layer is the new battleground



This acquisition is not a one-off, it is a consolidation move. A few days earlier, Anthropic added self-hosted sandboxes to its managed agents along with an MCP tunnels feature to reach internal servers through an encrypted gateway. Everyone is building the same thing at the same time: the layer that separates an agent from what it can do. Raw compute is commoditizing, models look increasingly alike; margin and lock-in are shifting to the control plane.

It also explains the timing. Snowflake announced the deal on the same day it posted 34% product growth and a $6bn AWS commitment. The message to investors is that the company is not just riding the data-warehouse wave, it is positioning for the layer above it. A 126% net revenue retention rate tells you existing customers keep spending more; owning the agent control room is how Snowflake protects that expansion as workloads shift from dashboards to autonomous actions. The platform that holds your data and now decides what your agents can do with it is very hard to replace.

For an enterprise buyer, the message is clear. The next scorecard for an agentic platform will not be about the number of connectors or model performance, but about drier questions: who did what, with what permission, and can you prove it after the fact. The audit log becomes a sales argument. That is good news for market maturity, and a sign that the experimental phase is ending. You don't put an autonomous agent into a financial process without being able to stop it and trace it.



## What this changes in my own work



I work every day with automation chains and MCP servers. On [IA Brew](https://mathieuhaye.fr/#projets), my newsletter generated by a 93-node n8n pipeline, the sore point was never connecting the sources; it was keeping control over what the chain was allowed to publish, edit or send without review. The moment an agentic workflow touches a CRM or a mailbox, the real line of defense is not the model, it is the list of authorized actions and the trace of every call.

I see the same on the Salesforce build I ship for e-Enfance / 3018 and on the Pipedrive migration for Horus Condition Report: the client's first question is no longer just *does it work*, but *what is the automation allowed to do if I let it run on its own*. The Natoma acquisition validates an intuition I apply project after project for my freelance clients: in AI applied to business, governing actions is not a constraint you bolt on at the end, it is the product. It is exactly what I sell when I scope an Einstein Bot or a bilingual sales automation: a chain where every action is explicitly authorized and traced. If you want to put an agent into production without losing that control, here is [how we work together](/en/collaboration).



---



The race for models made headlines for two years. The next one will be won on a less glamorous question: who keeps the ledger of what agents are allowed to do. Snowflake just answered by buying the ledger.

---

Source: [https://mathieuhaye.fr/blog/en/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia](https://mathieuhaye.fr/blog/en/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia) | Other language: [https://mathieuhaye.fr/blog/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia](https://mathieuhaye.fr/blog/2026-05-29-snowflake-natoma-mcp-gouvernance-agents-ia)
