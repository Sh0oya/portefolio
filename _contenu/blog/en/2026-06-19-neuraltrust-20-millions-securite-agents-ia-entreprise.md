---
title: "NeuralTrust raises $20M to govern enterprise AI agents"
date: 2026-06-19T08:00:00+02:00
language: en
slug: 2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise
url: https://mathieuhaye.fr/blog/en/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise
alternate: https://mathieuhaye.fr/blog/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise
category: Applied AI
description: "NeuralTrust raises $20M, the EU's largest cybersecurity seed, to map and secure the AI agents companies deploy faster than they can count. My analysis."
---

# NeuralTrust raises $20M to govern enterprise AI agents

> NeuralTrust raises $20M, the EU's largest cybersecurity seed, to map and secure the AI agents companies deploy faster than they can count. My analysis.

**TL;DR:** NeuralTrust, a Barcelona-based cybersecurity startup, announced on June 17, 2026 a $20M seed round (€17.2M), billed as the largest cybersecurity seed ever raised by an EU company, to secure and govern the AI agents deployed inside enterprises.



## Key takeaways



                - **$20M (€17.2M)** raised by NeuralTrust in a seed round on June 17, 2026, the largest cybersecurity seed by an EU company to date.

                - Round led by **Alstin Capital** (Munich), with Seaya, Kibo Ventures, VentureFriends, EA Ventures Plug and Play Fund and bank Banc Sabadell.

                - The platform rests on three layers: **TrustGate** (model-call gateway), **TrustGuard** (real-time attack detection) and **TrustLens** (agent mapping).

                - Gartner expects **more than 40% of agentic AI projects to be canceled by the end of 2027**, largely over cost and governance.





## The facts



NeuralTrust, founded in 2024 in Barcelona by Joan Vendrell (CEO), Victor Garcia and Alejandro Domingo, closed a $20M seed round, or €17.2M. The round is led by Munich fund Alstin Capital, joined by Seaya, Kibo Ventures, VentureFriends, the EA Ventures Plug and Play Fund, Catalan bank Banc Sabadell, the European Innovation Council and Spain's State Research Agency. The company claims the largest cybersecurity seed financing ever raised by a company in the European Union, according to [The Next Web](https://thenextweb.com/news/neuraltrust-20-million-seed-ai-agent-security).

The product tackles a precise problem: large enterprises connect AI agents to their internal systems faster than their security teams can track them. NeuralTrust places a central layer between agents and models, with three components: *TrustGate* acts as a gateway for all model calls, *TrustGuard* detects attacks at runtime, and *TrustLens* maps and monitors live agents. The platform inspects millions of agent interactions per day and flags roughly 1.2% of them as malicious, about one in 80.

The traction numbers are sharp: 92% of NeuralTrust customers post more than $1bn in annual revenue, and the company says it doubled its 2025 annual recurring revenue in the first quarter of 2026 alone, according to [TechFundingNews](https://techfundingnews.com/neuraltrust-20m-europe-largest-cybersecurity-seed-ai-agents/). Named customers include Iberia, Air Europa, Abanca and Banc Sabadell. Joan Vendrell puts the risk bluntly: *"If you connect AI to your email system and it sends emails to outside addresses, leaking internal information, that's a disaster."*



## Why is governance the real bottleneck?



Agent governance has become the main thing blocking agentic AI from reaching production. Gartner expects more than 40% of agentic AI projects to be canceled by the end of 2027, partly due to unclear costs and weak governance, per its [June 2025 press release](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027). The pilot works, the demo impresses, then the project stalls on a simple question: who controls what the agent can read, write and trigger?

An AI agent is not a classic application. An app has a fixed perimeter: its access rights are set at deployment and never move. An agent decides at runtime which tools to call, which data to read and which actions to chain. The access perimeter becomes dynamic, and therefore hard to audit after the fact. That is exactly the gap NeuralTrust wants to fill: making visible and loggable what was, until now, an operational black box.

The timing of the round is no accident. In 2024 and 2025, companies mostly spent to *deploy* agents. In 2026, the question changed in nature: it is no longer whether agents work, but which ones are running, with which rights, and under what oversight. The market is shifting from the "does it work" phase to the "is it sustainable" phase. That shift creates a product category that did not exist two years ago.



## Agent sprawl: the risk nobody measures



*Agent sprawl* describes the spread of AI agents deployed faster than a company can inventory them. The term echoes *shadow IT*, the tools teams install without the IT department's sign-off, and pushes it a step further: an agent does not just exist, it acts. It reads files, writes to a CRM, sends messages, triggers payments. Each connection to a tool adds an entry point and a data exit.

NeuralTrust's figure of 1.2% malicious interactions looks small, but it has to be read against volume. Across millions of daily interactions, one in 80 going wrong means thousands of risky events per day for a single large enterprise. The problem is not that an agent is malicious by design; it is that a legitimate agent, poorly scoped or hijacked by a prompt injection, acts with an employee's rights but none of the judgment.

This round fits a broader move. Agent security and governance have become an investment thesis in their own right: agent identity, call logging, permission control over the MCP (Model Context Protocol, the standard that connects agents to tools). NeuralTrust owns the observability and real-time filtering slot. The shared promise: you do not ship to production what you cannot see.



## European sovereignty: a deliberate angle



NeuralTrust positions itself explicitly as a non-American alternative, betting on the EU AI Act and on the preference of some European companies for home-grown security tools. Joan Vendrell says it directly: *"There are real issues now regarding technological and defence sovereignty in the EU."* The argument carries weight because security touches the most sensitive data: handing the filtering of your agents to a vendor under extraterritorial law is a choice many European legal teams now scrutinize closely.

Having Banc Sabadell, the European Innovation Council and Spain's State Research Agency on the cap table is not neutral: it roots the company in a European institutional ecosystem. Whether the sovereignty argument is enough against better-funded American players remains to be seen. But a cybersecurity seed reaching $20M in Europe signals that investors believe in a specifically European window of opportunity on this topic.



## How this maps to my own work



I build automation workflows that touch real tools, and that is exactly where NeuralTrust's pitch resonates. On **IA Brew**, my auto-generated newsletter, the n8n pipeline runs 93 nodes that read sources, call models and publish content. On the competitive-intelligence watch for **Fromagerie Ermitage**, an agentic workflow scans the market and returns summaries. Each time, the real question is not "does it produce the right output", but "what is this workflow allowed to read and trigger, and how do I know".

The same reflex applies on the CRM side. When I wire automations into **Salesforce** for e-Enfance's 3018 platform, or rules into **Pipedrive** for a revenue operations engagement, the permission perimeter is the first thing to scope, before any business logic. An agent writing to a CRM with no guardrails is a delayed data leak. What NeuralTrust sells to large accounts, I apply at my scale: log everything, limit rights to the strict minimum, and keep a clear view of what each automation can do.



## The takeaway



The real news is not that one more startup raised money, but that agent security has become a standalone category, funded to the tune of $20M at the seed stage. If you deploy agents in 2026, the useful question is no longer "what can they do" but "what could you explain if they did something dumb tonight?"



## Frequently asked questions



### What is agent sprawl?



Agent sprawl is the spread of AI agents across a company faster than teams can inventory them. Every agent wired into a tool (email, CRM, database) opens a new access surface, often with no inventory and no clear permission rules.



### What does the NeuralTrust platform do?



NeuralTrust secures enterprise AI agents through three layers: TrustGate, a gateway that centralizes model calls; TrustGuard, which detects attacks in real time; and TrustLens, which maps and tracks live agents. The goal is to make previously invisible agents visible and controllable.



### Why does governance slow down agentic AI?



Gartner expects more than 40% of agentic AI projects to be canceled by the end of 2027, largely due to unclear costs and weak governance. Without visibility into what agents can read, write and trigger, companies fail to move from prototype to production.

---

Source: [https://mathieuhaye.fr/blog/en/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise](https://mathieuhaye.fr/blog/en/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise) | Other language: [https://mathieuhaye.fr/blog/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise](https://mathieuhaye.fr/blog/2026-06-19-neuraltrust-20-millions-securite-agents-ia-entreprise)
