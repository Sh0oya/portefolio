---
title: "EU forces Google to open Android to rival AI agents"
date: 2026-07-19T09:00:00+02:00
language: en
slug: 2026-07-19-ue-google-android-agents-ia-interoperabilite
url: https://mathieuhaye.fr/blog/en/2026-07-19-ue-google-android-agents-ia-interoperabilite
alternate: https://mathieuhaye.fr/blog/2026-07-19-ue-google-android-agents-ia-interoperabilite
category: Regulation
description: "On July 16, 2026, the EU ordered Google to open 11 Android features to rival AI assistants, on par with Gemini. Why distribution is the real fight."
---

# EU forces Google to open Android to rival AI agents

> On July 16, 2026, the EU ordered Google to open 11 Android features to rival AI assistants, on par with Gemini. Why distribution is the real fight.

**The 30-second version**

- On July 16, 2026, the European Commission ordered Google, under the Digital Markets Act (DMA), to open eleven Android features to rival AI assistants, with the same level of access it grants Gemini.

- The measures must ship in the next major release, Android 18, and be fully implemented by August 1, 2027 at the latest.

- A second decision forces Google to share the search data it collects at scale with rival search engines and chatbots, anonymized and at a regulated price, starting January 2027.

- The Commission estimates that around 60% of smartphone users in the EU are affected; Google warns the rules risk weakening privacy and security safeguards.

For two years, the AI agent race has been fought on model power. The European Commission's July 16, 2026 decision moves the contest to where usage is actually decided: the entry point on the phone. By forcing Google to open Android to competitors, Brussels treats the place from which you invoke an assistant as shared infrastructure rather than private turf.

## What the Commission decided on July 16

On July 16, 2026, the European Commission adopted two binding specification decisions targeting Alphabet, Google's parent company, under the DMA ([European Commission](https://digital-markets-act.ec.europa.eu/commission-provides-guidance-google-ai-interoperability-android-and-sharing-google-search-data-under-2026-07-16_en)). The first covers AI assistant interoperability: Google must give competing services the same access it gives Gemini to eleven Android features. In practice, a rival assistant must be able to be triggered by voice, like "Hey Google", or from the home button; to act within and across apps, including long-running background tasks; to access context from apps and device sensors; and to get the hardware and software resources it needs, down to the on-device AI models ([MacRumors](https://www.macrumors.com/2026/07/16/eu-google-ai-apps-android-access/)).

The second decision forces Google to share the search data it alone collects at this scale with rival search engines, and now also with chatbots that offer a search function. The sharing, due to begin in January 2027, will use anonymized data, following a method built with privacy experts and a pricing formula deemed fair. Google has until the next major release, Android 18, to comply, with a hard deadline of August 1, 2027, roughly a year after the decision. The Commission puts the share of EU smartphone users affected at close to 60% ([Computerworld](https://www.computerworld.com/article/4198420/google-must-open-android-to-rival-ai-agents-eu-orders.html)).

## Why the agent fight is happening on the phone

The agent fight is happening on the phone because the best assistant in the world stays invisible if it cannot be called. On Android, the default gesture, pressing the home button or saying "Hey Google", led only to Gemini, and Gemini alone had full access to context, sensors and on-device models. A competitor, even with better answers, started two or three taps behind and with degraded access to device data. In a market won on friction, that gap is decisive.

That is why the decision matters well beyond the Google versus OpenAI or Perplexity duel. It establishes that the agent distribution layer, the place from which they are invoked and what they are allowed to touch, becomes regulated common ground, much as browser and search-engine access were in the web era. For an assistant maker, access to the home button is now worth more than a few points on a benchmark. It is a shift the industry has seen before: on the desktop web, the default browser and the default search engine decided which products people actually used, no matter how good the alternatives were. The phone is now that chokepoint for agents, and the Commission has decided it should not belong to a single company.

## What the EU is really standardizing: invocation and context

At heart, the eleven features listed by the Commission describe a technical contract: how an agent is triggered, what it can read, and what it can do on the user's behalf. That is exactly the problem the industry is trying to solve from the bottom up with protocols like MCP (Model Context Protocol), which standardizes how an agent connects to tools and data. The difference is that Brussels is imposing this interoperability from the top, on the most coveted surface on the market: the smartphone.

The risk Google raises deserves to be taken seriously rather than waved away. Letting a third-party assistant act within apps and read device context opens a real attack surface. Kent Walker, Google's head of global affairs, warns that the decisions "risk undermining vital privacy and security guardrails for millions of Europeans", and says the company had offered alternative solutions. Roman Stanek, CEO of Good Data AI, names the real work on the enterprise side: security leaders must stop treating "AI assistant" as a single, well-understood permission. In other words, forced interoperability shifts the security burden toward fine-grained control of the rights granted to each agent.

## What it changes when you build agents

For anyone building agents and automations, the lesson is concrete: the bottleneck is almost never the model, it is access. An agent's value is measured by what it can actually trigger in business tools, not by how well it writes. It is the same logic as on my own projects: the 93 n8n nodes that run the IA Brew newsletter, or the 3CX telephony integration inside e-Enfance's Salesforce, are not valuable for the clever part but for the wiring that gives the agent the right to act on the right systems, with the right permissions. Strip the wiring away and even a state-of-the-art model does nothing useful.

The European decision pushes that wiring toward a standard on the phone, but the question it raises is universal: what rights do you grant an agent, and how do you revoke them? An SME deploying a sales assistant faces the same question the Commission is putting to Google. Opening access creates value; opening it without permission governance creates risk. The right reflex is not to lock everything down, but to know exactly what each agent can read and execute.

The real news of July 16 is not that a regulator fined Google again. It is that the agent battlefield has officially moved from the model to distribution. In 2027, the question will no longer be "which assistant answers best", but "which one is allowed to act, and from where".

## Frequently asked questions

### What did the European Union decide against Google on July 16, 2026?

The European Commission adopted two binding decisions under the DMA. The first forces Google to open eleven Android features to rival AI assistants, with the same access it gives Gemini. The second requires it to share its search data with rival engines and chatbots, anonymized, starting January 2027.

### By when must Google comply?

Google must build the AI interoperability measures into the next major Android release, Android 18, with full compliance by August 1, 2027 at the latest, about a year after the July 16, 2026 decision. The search data sharing must begin as early as January 2027.

### Why does this decision matter for AI agents?

Because it turns the distribution layer, the point from which an agent is invoked and what it can touch, into open infrastructure rather than private turf. On mobile, access to the home button, context and sensors matters more than a few points on a benchmark. In effect, it sets a standard for how assistants are invoked and permissioned.

---

Source: [https://mathieuhaye.fr/blog/en/2026-07-19-ue-google-android-agents-ia-interoperabilite](https://mathieuhaye.fr/blog/en/2026-07-19-ue-google-android-agents-ia-interoperabilite) | Other language: [https://mathieuhaye.fr/blog/2026-07-19-ue-google-android-agents-ia-interoperabilite](https://mathieuhaye.fr/blog/2026-07-19-ue-google-android-agents-ia-interoperabilite)
