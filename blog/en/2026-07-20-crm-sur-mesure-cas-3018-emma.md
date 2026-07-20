---
title: "What a custom CRM really changes: the 3018 case"
date: 2026-07-20T08:00:00+02:00
language: en
slug: 2026-07-20-crm-sur-mesure-cas-3018-emma
url: https://mathieuhaye.fr/blog/en/2026-07-20-crm-sur-mesure-cas-3018-emma
alternate: https://mathieuhaye.fr/blog/2026-07-20-crm-sur-mesure-cas-3018-emma
category: Cases and Tools
description: "French helpline 3018 replaced its off-the-shelf CRM with Emma, a custom tool: one multichannel queue, prioritised urgencies, hosted in France."
---

# What a custom CRM really changes: the 3018 case

> French helpline 3018 replaced its off-the-shelf CRM with Emma, a custom tool: one multichannel queue, prioritised urgencies, hosted in France.

## Key takeaways



                - 3018, the French national helpline for young victims of online violence run by the e-Enfance association, now works on Emma, a fully custom CRM that replaced an off-the-shelf one.

                - Five channels (chat, phone, email, WhatsApp, Messenger) land in a single queue, with automatic detection of distress signals and priority routing for suicide-risk situations.

                - According to CRM data compiled by CRM.org in 2026, 43% of companies use less than half the features of their CRM, and most CRM failures come down to user adoption rather than the technology itself.

                - The replacement was only decided after exhausting every configuration option on the existing tool: in most cases, a well-configured off-the-shelf CRM remains the cheaper answer.





## The starting point: an off-the-shelf CRM pushed past its limits



3018 is the free, confidential national number for minors who are victims of online violence, and for their parents. It is operated by the e-Enfance association and reachable seven days a week, from 9am to 11pm, by phone and chat, as [the French government information service](https://www.info.gouv.fr/actualite/l-application-3018-pour-aider-les-victimes-de-cyberharcelement) notes (source in French). The service has a fast-track reporting procedure that can get harmful content or accounts taken down within hours.

I first worked on their off-the-shelf CRM, with no anti-vendor bias. The goal was straightforward: make the existing tool hold. Day to day, the counsellors were juggling several channels and scattered information. Every urgent case meant reassembling context spread across different windows.

Three limits turned out to be structural, and none of them could be fixed by configuration. Multichannel handling simply did not exist in the tool. The real counselling paths, the ones teams follow with a minor in distress, could not be modelled in the standard objects. And the data involved is about as sensitive as it gets, which puts hard constraints on hosting and auditability. From there, every requested change was paid for in added complexity.



## What was built: a single queue instead of a pile of tabs



The replacement was only proposed after exhausting the configuration options on the existing platform. The new tool, called Emma, is the workstation for 3018 counsellors. It was designed around the teams' actual work, not around a generic sales-management template.

In practice, five channels arrive in one queue: chat, phone, email, WhatsApp and Messenger. A counsellor no longer picks a window, they take the next conversation. Distress signals are detected automatically, and suicide-risk situations move to the front of the queue instead of waiting their turn. Every case is documented in a structured, exportable file, and supervisors follow activity in real time. The whole system is hosted in France, with full access traceability.

What matters to a business owner is not the feature list: it is that these four decisions follow from the work itself. The single queue exists because a victim writes on whatever channel is at hand. Prioritisation exists because not every conversation carries the same vital urgency. French hosting exists because the data concerns minors. None of those choices would have been right for a standard sales team.



## What does it actually change for a team?



A CRM is worth nothing if nobody opens it. The most telling industry number is this: according to [CRM data compiled by CRM.org in 2026](https://crm.org/crmland/crm-statistics), 43% of companies use less than half the features of their CRM. Failure analyses converge on a counterintuitive point too: [the leading cause of CRM project failure is user adoption](https://gain.io/blog/crm-adoption-challenges-why-sales-teams-fail-to-use-their-crm-and-how-to-fix-it), far ahead of any flaw in the platform itself.

That is exactly the shift a custom build produces when it is justified. You stop asking the team to bend its work to the structure of the tool; you start from the actual task and build around it. At 3018, that task is "take care of a young person in trouble, whatever the channel". At a manufacturing SME, it will be "follow a deal from quote to after-sales service across three different contacts". The principle is identical: the tool's structure fits the real process, not the reverse.

The second effect is economic and often underestimated. A custom CRM has no per-seat licence. A growing team does not watch its software bill grow alongside it. And the client owns the code, with the Git repository in their name and the matching documentation, which makes it possible to bring maintenance in house or switch providers with no hidden lock-in.



## When custom is the wrong answer



Most of the time it is the wrong answer, and saying so is part of the job.

If Pipedrive, HubSpot or Brevo covers the bulk of your process, good configuration will cost far less than development and ship faster. If your problem is that nobody opens the CRM, a custom build fixes nothing while the pipeline stays confusing and the team has never been trained on its own process. If the data already exists somewhere and someone retypes it by hand every day, the right investment is an integration between your tools, not a rebuild.

Custom becomes justified when the workarounds pile up: processes that cannot be modelled, missing multichannel handling, sensitive data, per-seat licences that swell with the team. That was the diagnosis at e-Enfance, and reaching it required going through the "make the existing thing work" stage first. A provider who proposes a custom build before seriously looking at what your current tool already does is selling you their catalogue, not a solution.



## What you can check at your own company this week



Three questions are enough to tell which side you are on. How many windows does your team open to handle a single case? How many times a week is a piece of information retyped from one tool into another? And how much of your real process exists nowhere in the CRM, because it lives in a spreadsheet on the side?

If the answers are "one or two, rarely, almost none", keep your tool and have it tuned. If they are "four, every day, about half", the subject is worth thirty minutes. You can [book a 30-minute scoping call](https://calendly.com/mathieu-haye03/30min); the three possible modes of intervention, from a simple fix to a full replacement, are detailed on the [custom CRM](/en/custom-crm) page.



## Frequently asked questions



### Does a custom CRM always cost more than a subscription?



Not necessarily over time, because a custom CRM carries no per-seat licence: a growing team does not see its software bill grow with it. The upfront investment is higher than a monthly subscription, though, which makes custom hard to justify for a small stable team whose process fits an off-the-shelf tool.



### How long does it take to replace an off-the-shelf CRM?



Tuning or repairing an existing CRM takes days. A fully custom CRM is built over several weeks, starting with a first version covering the most critical path, put in the team's hands, then iterated. The precise timeline is set during scoping.



### Who owns the code of a custom-built CRM?



In my engagements, the client owns it entirely, with the Git repository in their name and the documentation that goes with it. This is the clause to lock down with any provider: without code ownership and admin access, a custom CRM creates stronger lock-in than an off-the-shelf subscription.



### Is custom development only for high volumes?



No, it depends on how specific the process is rather than on volume. A few-dozen-person association with an atypical practice and sensitive data needs custom work more than a hundred-person sales team with a standard process, which will be well served by a properly configured off-the-shelf CRM.



---



The best CRM is not the most complete one, it is the one the team opens without thinking about it. 3018 got there by replacing its tool, but the question asked at the start was the opposite one: what would it take for this one to be enough? That is always where to begin.

---

Source: [https://mathieuhaye.fr/blog/en/2026-07-20-crm-sur-mesure-cas-3018-emma](https://mathieuhaye.fr/blog/en/2026-07-20-crm-sur-mesure-cas-3018-emma) | Other language: [https://mathieuhaye.fr/blog/2026-07-20-crm-sur-mesure-cas-3018-emma](https://mathieuhaye.fr/blog/2026-07-20-crm-sur-mesure-cas-3018-emma)
