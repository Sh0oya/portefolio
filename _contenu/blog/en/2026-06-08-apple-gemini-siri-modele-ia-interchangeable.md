---
title: "Apple picks Gemini for Siri: the AI model is now a setting"
date: 2026-06-08T09:00:00+02:00
language: en
slug: 2026-06-08-apple-gemini-siri-modele-ia-interchangeable
url: https://mathieuhaye.fr/blog/en/2026-06-08-apple-gemini-siri-modele-ia-interchangeable
alternate: https://mathieuhaye.fr/blog/2026-06-08-apple-gemini-siri-modele-ia-interchangeable
category: Business & Growth
description: "On June 8, 2026, Apple handed Siri to Gemini and will let users pick Claude or ChatGPT instead. Why the AI model is becoming a swappable component."
---

# Apple picks Gemini for Siri: the AI model is now a setting

> On June 8, 2026, Apple handed Siri to Gemini and will let users pick Claude or ChatGPT instead. Why the AI model is becoming a swappable component.

- **The 30-second version:**

                - On June 8, 2026, Apple unveiled at WWDC a rebuilt Siri running on a custom 1.2-trillion-parameter Google Gemini model.

                - Apple pays roughly $1bn a year for that model, after passing on Anthropic, which reportedly asked for "several billion" dollars a year.

                - iOS 27 introduces "Extensions": users will be able to set Gemini, Claude or ChatGPT as the engine behind Siri, Writing Tools and Image Playground, starting in fall 2026.

                - Gemini queries run inside Private Cloud Compute, Apple's encrypted infrastructure; Apple says no user data is shared with Google.





## What happened



On June 8, 2026, opening its WWDC developer conference, Apple unveiled a fully rebuilt Siri powered not by an in-house model but by a custom Google Gemini model with 1.2 trillion parameters. The new assistant ships with iOS 27, iPadOS 27 and macOS 27, and finally delivers the capabilities promised back in 2024 and then delayed: personal context awareness, on-screen awareness and in-app action execution. According to multiple aligned reports, Apple pays Google roughly $1bn a year for the model, which runs inside Apple's encrypted Private Cloud Compute infrastructure, with no user data shared with Google.

The more structural move isn't the contract; it's the framework named "Extensions." First reported by Bloomberg on May 5, 2026 and confirmed at WWDC, this API system lets any AI provider plug into Apple Intelligence. Under "Apple Intelligence & Siri" settings, users will be able to choose which model powers Siri, Writing Tools and Image Playground: Gemini by default, but also Anthropic's Claude, OpenAI's ChatGPT or another compatible service. That ends the exclusivity ChatGPT had enjoyed for two years. The feature is expected in fall 2026. [Details on MacRumors](https://www.macrumors.com/2026/05/05/ios-27-third-party-chatbots-apple-intelligence/).



## Why did Apple give up on building its own model?



Apple gave up on forcing an in-house model because the math no longer worked: renting a frontier model cost less than building a competitive one, and arrived faster. The company that makes its own chips, its own operating system and its own services chose, on generative AI, to buy rather than build. That's an unusual concession for a firm whose strategy has rested for fifteen years on end-to-end vertical control.

Picking Gemini over Claude came down to price. [According to AppleInsider](https://appleinsider.com/articles/26/01/30/apple-could-have-used-claude-to-power-a-future-siri-but-anthropic-got-greedy), Anthropic asked for "several billion" dollars a year, with terms that would have doubled annually for three years, while Google offered its custom model for roughly $1bn a year. Claude was already running internally on test builds at Apple Park before the talks collapsed. The detail that reframes the whole deal: Apple already collects close to $20bn a year from Google for making its engine the default search on iPhone. At that scale, paying $1bn back for Gemini stays a modest line item.

Put differently, Apple treated the AI model as a component you select on best price-performance, not as a differentiating asset you must own. That's exactly the stance a procurement team takes toward a commodity.



## What a "pick-your-model" AI really signals



When the most closed company in tech turns the AI model into a dropdown menu, the message is plain: the model is no longer the product, it becomes a replaceable part. For two years the dominant story said victory would go to whoever held the most powerful LLM. Apple just inverted that by making the LLM swappable from a single setting, on par with the default search engine.

This shift moves the value. If the model swaps out in two taps, power no longer sits in the model but in what surrounds it: distribution and context. Distribution is the roughly 1.4 billion active iPhones through which Apple becomes the front door to AI for a mass audience, arbitrating between Google, OpenAI and Anthropic. Context is the layer that makes an answer useful: your data, your apps, your permissions, all orchestrated by Apple alone through Private Cloud Compute. Model providers, meanwhile, end up in head-to-head competition for a settings slot.

The lesson reaches beyond Apple: as frontier models converge in quality and access costs fall, the rent migrates to the layers you cannot swap with one click. Owning the best model of a given quarter no longer protects you; owning distribution and context does.



## Model portability: the habit to adopt in your company



For any company deploying AI, Apple's decision translates into a simple rule: never hard-code a single model provider. The right habit is to build on top of an abstraction layer, where the model can be swapped without rewriting the application, and to choose the model task by task against the cost-latency-quality triangle. Summarizing an email doesn't need the most expensive model; a legal analysis might.

This portability isn't an architect's vanity. It guards against three very concrete risks: a provider's unilateral price hike, the deprecation of a model pulled from the catalog, and dependence on a vendor whose terms can change. Anthropic just retired Claude Opus 4.1, with a forced migration to Opus 4.8; any company that froze its stack on a specific version learned the hard way. Designing for substitution spares you that kind of emergency rewrite.

The corollary matters just as much: if the model becomes a commodity, durable advantage is built elsewhere. In the quality of the data you feed it, in the precision of the automations around it, in the integration with the existing information system. The model is rented; clean context and solid processes are built, and they don't copy in one click.



## What this changes in my freelance work



This logic already drives my technical choices. On my [Bloomberg dashboard powered by Claude Haiku 4.5](https://mathieuhaye.fr/#projets), which tracks my personal portfolio, I didn't pick the most prestigious model but the one whose cost-latency fit the use: frequent, short analyses to serve fast and cheap. The same reflex as Apple applying procurement logic to Gemini, scaled down to a solo project.

On my data and automation engagements, I design for substitution from the start. An n8n flow or a CRM connector shouldn't depend on a single model: the model call is isolated, configurable, replaceable, so you can switch if a provider changes pricing or pulls a version. What makes an engagement valuable is never the LLM picked this month; it's the cleanliness of the data upstream and the robustness of the automation downstream. Apple confirms across 1.4 billion devices what I check at the scale of a small business: the model is interchangeable, the context is not.



## The takeaway



Apple just made public what the market suspected: in an era where models converge, the AI model becomes a setting, and value lodges in distribution and context. The real question for a leader is no longer "which model do I pick," but "can my AI still be unplugged and replugged without rewriting everything?"



## Frequently asked questions



### Why did Apple pick Gemini over Claude or ChatGPT for Siri?



Apple chose Google's Gemini on price. Anthropic reportedly asked for several billion dollars a year, with terms that would have doubled annually for three years, while Google offered a custom Gemini model for roughly $1bn a year. Since Apple already collects close to $20bn a year from Google for default search on iPhone, the cost was modest at its scale.



### What are Apple Intelligence Extensions?



Extensions is an API framework introduced with iOS 27, iPadOS 27 and macOS 27 that lets a third-party AI provider plug into Apple Intelligence features. In settings, users will be able to pick which model (Gemini, Claude, ChatGPT or another) powers Siri, Writing Tools and Image Playground, ending ChatGPT's exclusivity.



### Will you be able to replace Gemini with Claude or ChatGPT on iPhone?



Yes. Gemini will be the default model for the new Siri, but starting in fall 2026, iOS 27 will let users set Claude, ChatGPT or another Extensions-compatible service as the engine behind Apple Intelligence. The AI model becomes a setting you change in preferences, just like the default search engine. [Further analysis on TechRadar](https://www.techradar.com/ai-platforms-assistants/apple-intelligence/apple-is-about-to-let-you-replace-its-ai-with-chatgpt-gemini-and-claude-and-it-could-change-the-iphone-forever).

---

Source: [https://mathieuhaye.fr/blog/en/2026-06-08-apple-gemini-siri-modele-ia-interchangeable](https://mathieuhaye.fr/blog/en/2026-06-08-apple-gemini-siri-modele-ia-interchangeable) | Other language: [https://mathieuhaye.fr/blog/2026-06-08-apple-gemini-siri-modele-ia-interchangeable](https://mathieuhaye.fr/blog/2026-06-08-apple-gemini-siri-modele-ia-interchangeable)
