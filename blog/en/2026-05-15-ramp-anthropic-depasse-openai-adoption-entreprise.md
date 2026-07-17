---
title: "Anthropic overtakes OpenAI in enterprise AI adoption"
date: 2026-05-15T08:00:00+02:00
language: en
slug: 2026-05-15-ramp-anthropic-depasse-openai-adoption-entreprise
url: https://mathieuhaye.fr/blog/en/2026-05-15-ramp-anthropic-depasse-openai-adoption-entreprise
alternate: https://mathieuhaye.fr/blog/2026-05-15-ramp-anthropic-depasse-openai-adoption-entreprise
category: B2B SaaS
description: "On May 13, 2026, Ramp's AI Index put Anthropic at 34.4% of business adoption, ahead of OpenAI at 32.3%. Why now, and three threats that could erase the lead."
---

# Anthropic overtakes OpenAI in enterprise AI adoption

> On May 13, 2026, Ramp's AI Index put Anthropic at 34.4% of business adoption, ahead of OpenAI at 32.3%. Why now, and three threats that could erase the lead.

For three years, the "Anthropic or OpenAI?" debate has gone in circles. An answer just landed on the angle that actually drives buying decisions: B2B penetration. On May 13, 2026, Ramp released its monthly AI Index. For the first time, Anthropic took the lead.



## The numbers behind the flip



Ramp manages corporate cards and supplier payments for more than 50,000 US companies. Its monthly read on AI adoption has become one of the market's most-watched indicators because it reflects actual transactions, not stated intent in a survey.

According to [the report published on May 13, 2026](https://ramp.com/leading-indicators/ai-index-may-2026), Anthropic adoption hit 34.4% of paying businesses; OpenAI dropped to 32.3%. Over April, Anthropic gained 3.8 points, OpenAI lost 2.9. Total paid AI model adoption ticked up to 50.6%. Google sits under 10%.

The bigger gap shows over twelve months. [Anthropic quadrupled its B2B adoption](https://techcrunch.com/2026/05/13/anthropic-now-has-more-business-customers-than-openai-according-to-ramp-data/); OpenAI gained only 0.3 points in the same window. Among 2026's first-time AI buyers, Anthropic captures 73% of the spend. On revenue, Claude's maker crossed $30bn in annualized revenue in April, against roughly $24bn for OpenAI.

The engine behind that growth comes down to one product: Claude Code. The agentic coding tool now reportedly powers 4% of all public commits on GitHub, double the share of the previous month. And on May 14, [PwC expanded its alliance with Anthropic](https://www.anthropic.com/news/pwc-expanded-partnership): 30,000 consultants certified on Claude, Claude Code and Cowork rolled out across US teams, and a new Anthropic-native Office of the CFO practice. PwC put numbers on early client results: insurance underwriting cycles compressed from ten weeks to ten days, cybersecurity incident response down from hours to minutes.



## Why the market is flipping now



This inversion didn't happen by accident. Enterprise AI has entered its third phase. The first, in 2023, was the POC era: everyone tried ChatGPT Enterprise, OpenAI cashed in on its consumer brand. The second, through 2024 and 2025, was proliferation: pile up subscriptions, compare, keep everything. The third, just starting, is industrialization: procurement teams consolidate vendors, CFOs read invoices line by line, IT demands real token governance.

Anthropic is better positioned for that phase. Ramp economist Ara Kharazian put it bluntly to TechCrunch: "Anthropic started with a very technical customer base, focused on their needs, really succeeded in execution, then began broadening out through tools like Cowork." Translation: Claude landed first with developers, data teams, and financial analysts. Three groups that ultimately decide which model goes into production. When the buying center shifts from marketing to engineering and R&D, the power balance shifts with it.

Second factor: OpenAI still reads as a consumer brand. Strong with individual users, less embedded in back-office and engineering workflows. [Axios's reading](https://www.axios.com/2026/05/13/anthropic-openai-workplace-ai-adoption) is direct: Anthropic now captures the first-time AI buyers, meaning companies that hadn't yet put paid AI into production. That's the other half of the US market.



## Three threats that could erase the lead



Ramp's analysis doesn't stop at the win. It flags three structural risks for Anthropic, and each one weighs on the trajectory.

The first risk is internal: a business model tied to token consumption. Anthropic earns more when companies burn more tokens, and especially when they reach for the more expensive models. Uber's CTO publicly said the company [already blew through its 2026 AI budget](https://venturebeat.com/technology/anthropic-finally-beat-openai-in-business-ai-adoption-but-3-big-threats-could-erase-its-lead), and he isn't alone. The recent update that tripled the token cost of any prompt containing an image didn't help. When a buyer sees the monthly bill double without any usage change, the conversation with finance turns sour fast.

The second risk is operational: perceived service degradation. Claude users reported more frequent outages, tighter rate limits, and less consistent results earlier this year. Anthropic reset its quotas in April and secured datacenter capacity at SpaceX, but the image of a product under pressure doesn't fade overnight. And paying buyers have zero appetite for an unexpected rate limit on a Monday morning.

The third risk comes from below: inference platforms serving open-source models at marginal cost. Ramp ranks them among the fastest-growing SaaS vendors in April. A buyer running Claude for a customer support agent at 12 cents per interaction starts looking at Llama 4 or Qwen at 2 cents for the same task. The question is no longer raw quality; it's cost per useful business action.



## What this changes for builders



The "which model should I pick" debate is becoming the wrong debate. The real issue for anyone deploying AI in the enterprise is the portability of the orchestration layer. If the pipeline is locked into one vendor, every future price hike lands at full impact. If it's portable, you switch to the cheapest viable model in two weeks, without rewriting the architecture.

Token budgeting becomes a real line item in AI ROI. Not a row on the cloud invoice, but an operational discipline: who consumes, on what, at what gross margin. A serious buyer's conversation in 2026 is no longer "which AI do we pick"; it's "at what cost per business action can we absorb 3x volume without renegotiating the contract."



## What this looks like on the ground



On the [automated competitive intelligence workflow I run for Fromagerie Ermitage](/#projects), that arbitrage didn't wait for May 2026 to get concrete. The n8n workflow combines Claude nodes for reasoning tasks (contract summaries, classification, argument extraction) and lighter models for repetitive steps. Not a dogma, an actual budget discipline: about a hundred items processed per month under a fixed cap, no drift when topic complexity rises.

Same logic on the [IA Brew](/#projects) project, an auto-generated newsletter built on 93 n8n nodes: model picked step by step based on added value. The n8n layer plays the insulator role. If Mistral, Llama 4, or Qwen make a task viable at a tenth of the price six months from now, we swap without rewriting the pipeline. Today's news is a reminder of why that matters: a competitive edge built on a single vendor doesn't hold for eighteen months, especially when that vendor's business model mechanically pushes more consumption. This is exactly the kind of portable, model-agnostic architecture I put in place when we [work together on a project](/en/collaboration).



## What comes next



Anthropic takes the lead for one month. The question isn't who runs the market in May 2026; it's how long an advantage can last when it rests on one flagship product, a pricing grid CFOs are starting to inspect, and an infrastructure that needs to double capacity every six months to keep up. Four signals to watch in the next Ramp AI Index releases: 90-day retention, renewal share, the adoption pace at Google and Mistral, and the growth of open-source inference platforms.

---

Source: [https://mathieuhaye.fr/blog/en/2026-05-15-ramp-anthropic-depasse-openai-adoption-entreprise](https://mathieuhaye.fr/blog/en/2026-05-15-ramp-anthropic-depasse-openai-adoption-entreprise) | Other language: [https://mathieuhaye.fr/blog/2026-05-15-ramp-anthropic-depasse-openai-adoption-entreprise](https://mathieuhaye.fr/blog/2026-05-15-ramp-anthropic-depasse-openai-adoption-entreprise)
