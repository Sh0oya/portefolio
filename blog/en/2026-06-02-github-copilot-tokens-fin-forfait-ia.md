---
title: "GitHub Copilot moves to tokens: end of flat AI pricing"
date: 2026-06-02T08:00:00+02:00
language: en
slug: 2026-06-02-github-copilot-tokens-fin-forfait-ia
url: https://mathieuhaye.fr/blog/en/2026-06-02-github-copilot-tokens-fin-forfait-ia
alternate: https://mathieuhaye.fr/blog/2026-06-02-github-copilot-tokens-fin-forfait-ia
category: B2B SaaS
description: "On June 1, 2026, GitHub Copilot moved every paid user to token-based billing. The unlimited flat rate is dead, replaced by AI Credits priced per model."
---

# GitHub Copilot moves to tokens: end of flat AI pricing

> On June 1, 2026, GitHub Copilot moved every paid user to token-based billing. The unlimited flat rate is dead, replaced by AI Credits priced per model.

For three years, enterprise AI sold itself as a flat rate. You paid $20 a month, you typed as many prompts as you wanted, the vendor absorbed the loss. On June 1, 2026, GitHub closed that era for Copilot, the code completion tool used by more than 20 million developers. Every paid plan now runs on metered billing, and the first invoices outline a shift that will reshape the wider enterprise AI market.



## The facts



On May 30, 2026, GitHub announced on its community forum that Copilot was dropping Premium Request Units and replacing them with [GitHub AI Credits](https://github.com/orgs/community/discussions/192948), credits priced against each model's published API rate. The rollout went live on June 1, 2026. The four existing plans keep their monthly subscription price, but now include a credit envelope equal to that price: $10 in credits for Copilot Pro at $10/month, $39 for Pro+, $19 per user for Business, $39 per user for Enterprise. Anything above the envelope is metered at the public API rate of the model used.

Inline completions and Next Edit Suggestions, the daily bread and butter for most developers, stay unlimited and free of metering. Everything else (agents, advanced chat, extended modes, automated code review) is now on the clock. Annual plans have been retired. To cushion the move, GitHub granted promotional credits for June, July and August 2026: an extra $30/month for Business and $70/month for Enterprise.

Developer reaction was immediate. [TechCrunch](https://techcrunch.com/2026/05/30/what-a-joke-github-copilots-new-token-based-billing-spurs-consternation-among-devs/) reported personal projections jumping from $29 to nearly $750 a month, and from $50 to $3,000 in agentic setups where Copilot reads a repo, plans, edits multiple files and iterates. Microsoft did not respond to TechCrunch's request for comment. On GitHub's community board, hundreds of posts circle the same point, echoed by [Dataconomy](https://dataconomy.com/2026/06/01/github-copilot-token-pricing-backlash/): Microsoft spent two years pushing heavy chatbot and agent use, then turned the meter on.



## The end of the unlimited plan is not a political choice



What is happening at Copilot is not a pricing tantrum; it is alignment with the underlying economics. A frontier language model costs a measurable amount per call: a query to Claude Opus, GPT-5 or Gemini Ultra consumes GPU compute whose price is public. As long as vendors absorbed the gap to gain market share, they accepted losing money on power users and recovering it on light ones. The math holds at first. It collapses as soon as agentic use becomes common, because an agent does not consume like a human: it chains tool calls, reloads context, and iterates many times to close out a task.

The June 2026 calendar is not isolated. Anthropic and OpenAI already reshaped their enterprise tiers around consumption; Google is doing the same on the Workspace side. The $20 flat plan that hooked early adopters played the role of a loss leader, not a durable business model. Once the user base is locked in and usage has become a habit, the token price reclaims its seat. At Copilot, the move is honest: basic completions stay free because they cost almost nothing to serve, and anything touching agents goes on the meter. That is internally consistent. What is not is the implicit promise of price stability that the product carried for three years.



## The gap between the pitch and the invoice



The real issue is not the price; it is the unpredictability. Engineering teams budget on a per-seat annual basis. When the CFO signed off on $39 per user per month, she did not approve a blank check at $3,000 because a developer left an agentic session running on a large repo. Moving to tokens transfers risk from the vendor to the customer, without handing the customer the tools to manage it.

The cases cited in [TechCrunch](https://techcrunch.com/2026/05/30/what-a-joke-github-copilots-new-token-based-billing-spurs-consternation-among-devs/) show the problem: these are not edge abuses, they are the workflows Microsoft actively pushed on stage at every developer event. Some users fairly note that the vendor accelerated dependence on expensive patterns before sending the bill. The unofficial counter, offered by some developers themselves, is that heavy usage reflects sloppy *vibe coding*. There is some truth in that. It does not remove the need for a clear cap, real-time alerts and a per-user budget policy that few enterprises run today.

The contrast with other markets is instructive. Nobody buys their AWS cloud on a flat unlimited plan, and nobody complains about that. The difference is that teams learned to budget cloud with FinOps, dashboards and alerts. For AI, that vocabulary does not exist yet inside most companies. CFOs are discovering that a single developer seat can cost $100 or $3,000 depending on the month, with no native tool to see the spike coming. The work for the next twelve months is not technical; it is about building a budgeting culture around AI consumption.



## What it changes for enterprise budgets



For a CIO or an engineering leader, the practical consequence is immediate. AI budgets must shift from a fixed per-seat line to a usage-based forecast, with individual caps, team-level tracking and a clear policy on what is allowed in autonomous agent mode. The vendors that win this transition will not be the ones with the best model, but the ones that ship the best consumption dashboard and the best governance layer. Several start-ups are already working on it; the June switch will be their best sales accelerator of the year.

The second consequence is commercial. Microsoft resellers and GitHub partners now have to sell Copilot differently: no longer as a flat subscription, but as a service with a volume commitment. That looks a lot like selling an AWS contract, and it validates the consultancies positioning themselves on FinOps for AI. For start-ups, it opens a clear window: every metered agentic tool needs an observability, cap, attribution and optimization layer on top. There is a Datadog and a Vercel to build on the cost of tokens. It is also the weak point in GitHub's pitch: by keeping completions free but charging for agents, the vendor invites its heaviest users to compare its cost against a direct call to Anthropic's or OpenAI's API, without the Copilot wrapper. The *buy direct* question is back on the table for every team spending $200 per developer per month.



## What it changes in my day-to-day



I bill flat rates for client work, but every automation I ship runs on tokens. On [IA Brew](https://mathieuhaye.fr/#projets), my newsletter generated by a 93-node n8n pipeline, I had to set up an explicit counter from month one: how many Claude Sonnet calls, how many input tokens, how many output tokens, how many per issue. Without that tracking, the cost of an issue can vary by a factor of ten between a clean run and one where the scraper feeds too much noise into the context window.

The same logic drove my choice of Claude Haiku 4.5 for the [Bloomberg Dashboard](https://mathieuhaye.fr/#projets) built against my personal portfolio: Haiku's analysis quality is enough to score positions, and the cost per call stays compatible with daily use. It is also what clients pay me to arbitrate as a freelancer, from the Callkom prospection pipeline to the 93-node monitoring workflow for Fromagerie Ermitage: the real skill is not prompting, it is picking the right model for the job with cost as part of the equation, because it is my margin as much as theirs. The Copilot episode will impose that discipline on tens of thousands of teams who have not learned it yet.



---



The flat AI plan was a loss-leader promise. The return to tokens is arithmetic reclaiming its rights. The companies that come out ahead will be the ones that build, before everyone else, their own FinOps culture around AI.

---

Source: [https://mathieuhaye.fr/blog/en/2026-06-02-github-copilot-tokens-fin-forfait-ia](https://mathieuhaye.fr/blog/en/2026-06-02-github-copilot-tokens-fin-forfait-ia) | Other language: [https://mathieuhaye.fr/blog/2026-06-02-github-copilot-tokens-fin-forfait-ia](https://mathieuhaye.fr/blog/2026-06-02-github-copilot-tokens-fin-forfait-ia)
