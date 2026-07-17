---
title: "Arcade raises $60M: identity is the AI agent bottleneck"
date: 2026-06-16T09:00:00+02:00
language: en
slug: 2026-06-16-arcade-60-millions-identite-agents-ia-production
url: https://mathieuhaye.fr/blog/en/2026-06-16-arcade-60-millions-identite-agents-ia-production
alternate: https://mathieuhaye.fr/blog/2026-06-16-arcade-60-millions-identite-agents-ia-production
category: Applied AI
description: "Arcade raised $60M on June 15, 2026 to secure what production AI agents do. The real bottleneck is no longer the model, it's authorization and audit."
---

# Arcade raises $60M: identity is the AI agent bottleneck

> Arcade raised $60M on June 15, 2026 to secure what production AI agents do. The real bottleneck is no longer the model, it's authorization and audit.

**The 30-second version:**



                - Arcade announced a $60M Series A on June 15, 2026, led by SYN Ventures, with Morgan Stanley and Wipro as strategic investors.

                - The round brings Arcade's total raised to $72M, after a $12M seed in 2025.

                - Tool-call volume routed through Arcade by agents grew 25x in six months; customers include a top US bank, the Prosus group, and LangChain.

                - Arcade authored the authorization specification for the MCP (Model Context Protocol) standard, adopted by Anthropic, and runs more than 8,000 MCP tools.





For two years the AI agent debate circled a single question: which model is smartest? Arcade's raise moves the spotlight. On June 15, 2026, the startup closed $60M to tackle a far less glamorous but far more blocking problem: who is allowed to do what, on whose behalf, when an agent acts on its own inside a company's systems.



## The fact: $60M for the agent action layer



Arcade, run by co-founder and CEO Alex Salazar, announced a $60M Series A on June 15, 2026 led by SYN Ventures, with strategic participation from Morgan Stanley and Wipro ([BusinessWire release](https://www.businesswire.com/news/home/20260615229631/en/Arcade-Raises-$60M-to-Become-the-Secure-Action-Layer-Behind-Every-Production-AI-Agent)). The round brings the company's total funding to $72M, after a $12M seed closed in 2025.

Arcade describes itself as a secure action layer for production AI agents. In practice, the platform checks that an agent only accesses the permissions actually held by the user it acts on behalf of, ships tools built for agent workflows, and keeps a full audit trail of every action ([PYMNTS](https://www.pymnts.com/news/investment-tracker/2026/arcade-raises-60-million-to-control-ai-agents/)). The founding team comes from the identity, data, and integration layers of Okta, Redis, MongoDB, Snowflake, and Airbyte; in other words, people who have already built the invisible plumbing behind Fortune 500 products.

Salazar's diagnosis fits in one sentence:


> "Agents don't fail in production because the model is wrong. They fail because nobody can prove that for any given action by an agent, whether that agent on behalf of that user can perform that action on that resource."



Usage numbers show the traction: tool-call volume flowing through Arcade grew 25x in six months, and deployments include a top US bank, the investment group Prosus, and the LangChain platform ([MarTech Series](https://martechseries.com/predictive-ai/ai-platforms-machine-learning/arcade-raises-60m-to-become-the-secure-action-layer-behind-every-production-ai-agent/)).



## Why is identity the real AI agent bottleneck?



Identity is the bottleneck because an autonomous agent breaks the classic enterprise software security model. Until now, either software ran inside a service account with fixed permissions, or a human clicked and left a named trace. An agent chains dozens of actions per minute, on behalf of different users, across different systems, and makes micro-decisions nobody explicitly approved in advance.

The problem has a name in security: the confused deputy. When an agent holds broad access so it can be useful, it becomes able to act beyond what the end user could do themselves. Giving a sales agent permission to read the whole CRM to answer a question also gives it, by default, the ability to export records that have nothing to do with its user. The line between "enough rights to be useful" and "too many rights to be safe" is razor-thin. And unlike a human, an agent can repeat that mistake thousands of times before anyone notices, which is exactly why a regulated bank cannot ship one without a complete record of every call.

Jay Leek, managing partner at SYN Ventures, sums up the market moment: "Every wave of enterprise software has eventually hit the same wall, where adoption outruns the infrastructure that makes it safe. Agents are at that wall right now." Arcade's raise bets that this wall is a market of its own, separate from the model race.



## What the raise reveals: value moves to the plumbing



Arcade's raise confirms a shift visible for months: the value of enterprise AI is moving from the model to the infrastructure layer around it. The model becomes an interchangeable component; what gets monetized is identity, authorization, observability, and governance. Morgan Stanley co-investing in an agent authorization layer is not a tech fund chasing the next model, it's a financial player securing an operational dependency.

The most strategic detail sits elsewhere: Arcade authored the authorization specification for the MCP (Model Context Protocol), the open standard describing how a model connects to external tools, and that specification was adopted by Anthropic. Writing the authorization standard for a protocol the whole industry adopts means sitting at the toll booth. With more than 8,000 MCP tools already running, Arcade is not just selling a product; it's selling a position in the agent value chain. The pattern rhymes with what the founders did before: identity at Okta, data at Snowflake, integration at Airbyte all became layers nobody wanted to rebuild once a credible default existed. Agent authorization looks like the next one, and being early to write its rules is the whole bet.

The market context makes the bet credible. Gartner expects 40% of enterprise applications to embed task-specific AI agents in 2026, up from less than 5% in 2025 ([Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025)). If the forecast holds, every app that deploys an agent will face the same authorization question, and few companies will want to recode that plumbing in-house. That's exactly the slot Arcade targets.



## How this maps to my day-to-day



I hit this authorization question the moment an automation touches a real client system. On the IA Brew newsletter, the n8n workflow runs 93 nodes that call APIs, read sources, and write content; as long as it stays on public reads, the risk is low. The day an agent has to write into a CRM or send a message on behalf of a specific user, the first thing to scope isn't the prompt, it's the boundary of its rights.

On a bilingual Pipedrive engagement like the Horus Condition Report, or on a Salesforce integration where an Agentforce agent would pull from opportunities, the same rule applies: an agent should never inherit broader access than the user it serves, and every action should leave an auditable trace. Arcade sells that discipline as a product; on smaller projects, it's a discipline you enforce by hand, by scoping token permissions and logging every call. The principle is identical, only the scale changes.



## The takeaway



The real AI agent competition is no longer about how smart the model is, but about the ability to prove who did what, on whose behalf. As long as that proof is missing, a pilot stays a pilot. The question for 2026 is no longer "which model do I pick", but "who controls the authorization layer between the model and your systems".



## Frequently asked questions



### What does Arcade actually do?



Arcade provides a secure action layer for production AI agents. The platform checks that an agent only acts within the permissions held by the user it operates on behalf of, ships tools built for agent workflows, and keeps a full audit trail of every action.



### Why $60M for agent authorization?



Because security and traceability have become the main blocker between an agent pilot and a production deployment. Arcade announced a $60M Series A on June 15, 2026 led by SYN Ventures, bringing its total raised to $72M, to meet that demand for governance.



### What is the MCP protocol and how does Arcade relate to it?



MCP (Model Context Protocol) is an open standard describing how an AI model connects to external tools and data. Arcade authored the authorization specification for that protocol, adopted by Anthropic, and runs more than 8,000 MCP tools.

---

Source: [https://mathieuhaye.fr/blog/en/2026-06-16-arcade-60-millions-identite-agents-ia-production](https://mathieuhaye.fr/blog/en/2026-06-16-arcade-60-millions-identite-agents-ia-production) | Other language: [https://mathieuhaye.fr/blog/2026-06-16-arcade-60-millions-identite-agents-ia-production](https://mathieuhaye.fr/blog/2026-06-16-arcade-60-millions-identite-agents-ia-production)
