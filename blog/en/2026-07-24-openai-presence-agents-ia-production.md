---
title: "OpenAI Presence: AI Agents Move Into Production"
date: 2026-07-24T08:00:00+02:00
language: en
slug: 2026-07-24-openai-presence-agents-ia-production
url: https://mathieuhaye.fr/blog/en/2026-07-24-openai-presence-agents-ia-production
alternate: https://mathieuhaye.fr/blog/2026-07-24-openai-presence-agents-ia-production
category: Applied AI
description: "OpenAI launches Presence, an enterprise AI agent platform: 75% of support calls resolved without a human. What it means for small and mid-sized companies."
---

# OpenAI Presence: AI Agents Move Into Production

> OpenAI launches Presence, an enterprise AI agent platform: 75% of support calls resolved without a human. What it means for small and mid-sized companies.

**TL;DR:** On July 22, 2026, OpenAI launched Presence, a platform that deploys AI support and sales agents connected to the internal systems of large enterprises; on its own phone support line, OpenAI's agent resolves 75% of inbound calls without human intervention.

The announcement flew somewhat under the radar of mainstream media, yet it is one of the most structural of the summer. It tells you where the market is going: AI agents are leaving the demo stage and entering operations, with rules, guardrails and a human at the end of the chain.



## Key takeaways



                - Presence, launched on July 22, 2026, bundles internal policies, guardrails, approved actions, simulations and evaluation tools to run AI agents in production.

                - On OpenAI's English-language support line, the agent resolves 75% of calls without a human and cut handoffs to an operator by 15 percentage points in 10 days.

                - Presence is not self-serve: every deployment is led by OpenAI engineers or partner integrators, for large accounts such as BBVA, SoftBank and the insurer IAG.

                - The same week, HubSpot opened its Prospecting Agent to every paid customer: AI agents are landing in the tools SMEs already use, no dedicated project required.





## What OpenAI announced



On July 22, 2026, OpenAI unveiled Presence, an enterprise platform for deploying voice and chat AI agents on operational tasks: customer support, outbound sales development, procurement, IT services and HR. According to [Help Net Security](https://www.helpnetsecurity.com/2026/07/22/openai-presence-ai-agent-platform/), Presence is not a new model but a deployment platform: it assembles internal policies and procedures, guardrails able to interrupt an interaction that drifts outside the company's boundaries, approved actions, test simulations and evaluation tools, plus a continuous improvement loop powered by Codex, OpenAI's software engineering system.

The proof comes from OpenAI itself: its English-language phone support line runs on Presence and resolves 75% of inbound calls without human intervention. According to [Metaverse Post](https://mpost.io/openai-debuts-presence-an-enterprise-platform-for-mission-critical-ai-agents/), handoffs to a human operator dropped by 15 percentage points within 10 days thanks to that improvement loop. The first named customers are the bank BBVA in Mexico, Japanese carrier SoftBank and Australian insurer IAG, which is evaluating it to absorb call spikes during severe weather events.

The detail that matters: Presence is not self-serve. The platform is in limited general availability, reserved for enterprise customers, and every deployment is led by OpenAI's Forward Deployed Engineers or selected systems integrators. OpenAI is selling field engineering, not a checkbox in a subscription.



## Why sell a platform rather than a model?



Because a model alone is not enough to put an agent into production. That is the implicit admission in this announcement, and it is a valuable one. Everything Presence packages for large accounts is exactly what demos lack: written procedures the agent must follow, a closed list of actions it is allowed to execute, guardrails that cut the conversation when it leaves the perimeter, simulations before going live, and continuous evaluation after.

The choice of assisted deployment confirms the diagnosis. If plugging an agent into a company's systems were simple, OpenAI would sell it self-serve, like ChatGPT. The company with the strongest incentive in the world to show that "AI deploys itself" is sending engineers on site. The hard work is not the model; it is the meeting point between the model and an organization's real processes: its data, its business rules, its edge cases.

The movement goes beyond OpenAI. Research firm Gartner projects that 40% of enterprise applications will embed agents by the end of 2026, up from less than 5% in 2025. The question is no longer whether agents are coming to business software, but under what conditions they are reliable.



## What does this change for a small or mid-sized company?



Directly, nothing: a 30-person company will not sign a Presence contract with OpenAI engineers. Indirectly, a lot, for three reasons.

First, agents are arriving in the tools SMEs already use. The same week, HubSpot opened its Prospecting Agent to all paid customers and pushed its Breeze assistant into contact search and meeting preparation, according to the [July 2026 product update recap](https://vantagepoint.io/blog/hs/hubspot-july-2026-product-updates). A company running a mainstream CRM will have AI agents in its daily workflow within months, whether it decided to or not. Better to configure them deliberately than to endure them.

Second, the Presence method is transferable even if the platform is not. A scope written down in black and white, a closed list of authorized actions, a handoff to a human as soon as a case leaves the perimeter, regular review of conversations: these principles apply to an agent built with an off-the-shelf model and an orchestration tool such as n8n, at a cost that has nothing in common with an enterprise contract. That is the difference between an agent that answers the phone and a chatbot that improvises.

Third, the figure to remember is not 75%; it is the remaining quarter. OpenAI openly accepts that its agent hands one call in four to a human. For an SME, that is the right target: an agent that handles repetitive requests and passes the baton cleanly on the rest. A vendor promising 100% autonomy on customer service is selling something other than engineering.



## What I take from this in the field



I build agents and automations for SMEs, and this announcement validates an approach rather than a technology. IA Brew, the newsletter I automated with 93 n8n nodes, runs on its own every day because each step has a bounded scope and checkpoints; the [Chat with my AI](/en/chat-with-my-ai) page on this site answers from a closed corpus, with explicit limits on what it does not know. None of these systems needs an enterprise-contract platform: they need clear rules and honest supervision.

That is exactly the job of an [AI agent developer](/en/ai-agent-developer) at SME scale: defining what the agent is allowed to do, wiring it into the company's real tools, and organizing the handoff to a human. The model part has become the easy part.



## Frequently asked questions



### What is OpenAI Presence?



Presence is an enterprise platform launched by OpenAI on July 22, 2026 to deploy voice and chat AI agents connected to internal company systems. It bundles policies, guardrails, approved actions, simulations and evaluation tools. It is reserved for large enterprise customers, with no self-serve option.



### Can a small or mid-sized company use OpenAI Presence?



Not at this stage. Presence is in limited general availability and every deployment is led by OpenAI engineers or partner systems integrators. The platform's principles, however, a written scope, approved actions, human escalation and continuous evaluation, transfer well to an agent built at SME scale.



### Do AI agents replace human support?



No. The figure OpenAI highlights is 75% autonomous resolution on its own support line; the remaining quarter is handed off to human operators. A well-designed agent is judged as much by what it escalates as by what it resolves on its own.



---



The real news of July 22 is not that OpenAI can build agents. It is that OpenAI believes making them work in production is worth a service contract with dedicated engineers. When the sector's leader puts that price on deployment, the useful question for a business owner is not "which AI tool should I pick" but "who will make that tool hold up inside my processes".

---

Source: [https://mathieuhaye.fr/blog/en/2026-07-24-openai-presence-agents-ia-production](https://mathieuhaye.fr/blog/en/2026-07-24-openai-presence-agents-ia-production) | Other language: [https://mathieuhaye.fr/blog/2026-07-24-openai-presence-agents-ia-production](https://mathieuhaye.fr/blog/2026-07-24-openai-presence-agents-ia-production)
