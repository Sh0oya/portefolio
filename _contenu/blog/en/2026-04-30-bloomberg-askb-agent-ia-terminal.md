---
title: "Bloomberg AskB: Anthropic Claude lands inside the Terminal"
date: 2026-04-30T08:00:00+02:00
language: en
slug: 2026-04-30-bloomberg-askb-agent-ia-terminal
url: https://mathieuhaye.fr/blog/en/2026-04-30-bloomberg-askb-agent-ia-terminal
alternate: https://mathieuhaye.fr/blog/2026-04-30-bloomberg-askb-agent-ia-terminal
category: Applied AI
description: "On April 28, 2026, Bloomberg opened AskB in beta to 125,000 Terminal users. Why this Anthropic Claude-powered AI agent rewrites Wall Street's playbook."
---

# Bloomberg AskB: Anthropic Claude lands inside the Terminal

> On April 28, 2026, Bloomberg opened AskB in beta to 125,000 Terminal users. Why this Anthropic Claude-powered AI agent rewrites Wall Street's playbook.

## What Bloomberg announced on April 28



The launch landed during the London *AI in Finance Summit*. AskB, pronounced "ask-bee", is a conversational agent now in beta with roughly one third of Bloomberg Terminal users, around 125,000 traders, portfolio managers and analysts out of 375,000 paying seats. Shawn Edwards, Bloomberg's CTO, calls it "the biggest rethink of the Terminal in Bloomberg's history".

Inside the box: a multi-model orchestration. Bloomberg-trained proprietary models for the financial heavy lifting; frontier models from [Anthropic](https://www.anthropic.com/) for harder reasoning. Each query routes to the cheapest capable model. With a target user base in the hundreds of thousands, token economics matter as much as latency.

On the capability side, AskB is not a Q&A box. It builds investment screens from a natural-language prompt, generates full research reports including bull and bear scenarios, and lets users author workflow templates that fire on a schedule or on a market trigger. During earnings season, a trader can program a routine that synthesises a structured long/short brief at every release in their universe.

The data it sits on top of is at least as important as the engine. Bloomberg News, sell-side research from over 800 contributing houses, market data, and a thick layer of alternative data: anonymised credit-card transactions, mobile-phone foot traffic, satellite imagery of parking lots, app-usage metrics. To contain hallucinations, AskB checks its own summaries against the cited source passages, flags semantic reversals where the model says the opposite of the source, and invalidates fabricated links. Edwards [told Fortune on April 28](https://fortune.com/2026/04/28/bloomberg-askb-ai-agents-lessons-from-bloomberg-cto-shawn-edwards-eye-on-ai/): "This will be the new Terminal. The primary way most interactions happen."



## Why this is an agent, not a chatbot



The word "agent" has been worn out for eighteen months. Here it has a precise technical meaning. A chatbot answers a question; an agent plans a task, runs it across several steps, calls external tools, checks its own outputs. When a user asks AskB "how would a war in Iran and a spike in oil prices affect my portfolio?", the system does not reply with a paragraph. It decomposes the request, fetches the portfolio composition, applies shocks to the sensitive factors, generates exposures and writes up the brief. This is not sophisticated retrieval-augmented generation. It is a structured tool-call chain.

The clearest signal sits in the automated workflows. AskB lets a user schedule a routine such as: at every earnings release in my universe, write a long/short brief and fire an alert if the thesis flips. That is agentic orchestration, not Q&A. The legacy Terminal already supported similar routines through functions and macros, but the syntax was so arcane that only seasoned power-users mastered it. AskB removes the entry barrier.

The other tell that this is a real agent: the multi-model strategy. Bloomberg does not push everything to Claude or everything to its in-house LLM. It routes each call to the cheapest model that can do the job. Edwards puts it bluntly: "you have to buy all those sources, do all the validation work, build benchmarks, and tokens aren't cheap." For a product targeting up to 375,000 simultaneous users, unit token economics become as serious as latency.



## Alternative data as the real moat



The moment Edwards says "data remains the critical differentiator" is interesting on several levels. On the model race, anyone who is not Anthropic, OpenAI, Google or Meta has already lost. Not even Bloomberg can sustain a multi-billion-dollar frontier training cycle. They tried with *BloombergGPT* in 2023 (50 billion parameters, 363 billion financial tokens). In 2026, they are not trying that route any more. They use Claude.

What they do have is the most complete financial data aggregate in the industry: sell-side research from 800-plus shops, prices on virtually every listed asset, and the layer that no general-purpose AI lab will ship by default, alternative data. Anonymised card transactions to predict retail revenue, store traffic, satellite, mobile-app usage. That is the layer that lets a Terminal user ask "give me a contrarian thesis on Lululemon based on the last three months of basket data", a question ChatGPT cannot answer well.

The quality strategy follows the same logic. Rather than trying to eliminate hallucinations upstream (which nobody knows how to do reliably), Bloomberg invested in downstream control: every summary AskB produces is passed to a verifier that re-reads the cited passages, detects semantic reversals where the model contradicts the source, and invalidates fabricated links. That is continuous evaluation, exactly what Edwards [means](https://fortune.com/2026/04/28/bloomberg-askb-ai-agents-lessons-from-bloomberg-cto-shawn-edwards-eye-on-ai/) when he says "evaluations, I cannot stress enough, are the make-or-break of building a useful, trustworthy system."



## What this changes for trading floors and ALM teams



If the bet works, the consequences are heavy. On a typical trading floor today, the Terminal is the tool where 4 to 6 hours a day get burned composing screens, exporting data, copy-pasting cells into Excel and running pricing functions. If AskB delivers, those 4 to 6 hours collapse into prompts and scheduled routines; the freed time shifts to analysis, client work and pricing.

For risk and ALM functions, the bet is more subtle. IRRBB report generation, interest-rate gap sensitivities, deposit-stickiness stress scenarios: today this is patient work that occupies two or three analysts in every large bank. An agent that can compose those reports from a natural-language brief frees up serious time. With one caveat: governance has to keep up. Handing the drafting of a report that ends up in the ALM committee to an agent demands strong traceability, full auditability, and a human in the loop at every critical step.

The other risk is more political. If AskB becomes the single interface for 125,000, then 375,000, users, Bloomberg locks in its position as an indispensable platform. That deepens banks' dependence on an agent whose models, evaluations and data governance they do not control. For European regulators finalising the AI Act (the April 28 trilogue collapsed after twelve hours of talks; next round on May 13), the question is now imminent: an agent producing reports used in investment decisions, is that a high-risk AI system?



## What this means when you build with Claude every day



The AskB news intersects directly with how I work as a freelance builder. On the personal side, my Bloomberg Dashboard for portfolio monitoring runs on **Claude Haiku 4.5**, exactly the agent logic Edwards describes, in a smaller key: aggregate data, ask a sensitivity question in natural language, return a risk view. The difference is scale, not philosophy. Confirming that a player like Bloomberg has gone multi-model with Claude rather than retraining everything in-house validates a practical hunch: a freelance or solo quant has zero interest in retraining; they have every interest in orchestrating.

On the client side, this is exactly what I ship: IA Brew, my automated AI newsletter, chains n8n, Claude and Brevo to digest a stream of sources and produce a deliverable every morning, hands-off. What Bloomberg just did is publicly legitimise the use of AI agents for tasks that sit at the heart of a job: scenario generation, signal aggregation, summaries checked against the source. The same shift, from deterministic Excel to agent-driven generation, is waiting for SMEs and trading desks alike. Those who start building their own agentic workflows on their own data now will arrive less out of breath than those who discover everything in 2027. The same reflex applies to your own online presence: before an agent answers on your behalf, it is worth checking [whether your site is visible to the AI](/en/ai-visibility) engines that now aggregate the information.



---



Bloomberg is betting that, in the long run, most financial decisions will not be made by consulting data but by querying an agent that has already digested it. The users who learn early how to compose precise prompts will come out ahead. The others will keep watching their screens blink without knowing what to do with what they see.

---

Source: [https://mathieuhaye.fr/blog/en/2026-04-30-bloomberg-askb-agent-ia-terminal](https://mathieuhaye.fr/blog/en/2026-04-30-bloomberg-askb-agent-ia-terminal) | Other language: [https://mathieuhaye.fr/blog/2026-04-30-bloomberg-askb-agent-ia-terminal](https://mathieuhaye.fr/blog/2026-04-30-bloomberg-askb-agent-ia-terminal)
