---
title: "HubSpot backs off default CRM data sharing"
date: 2026-07-07T08:00:00+02:00
language: en
slug: 2026-07-07-hubspot-donnees-crm-enrichissement-ia
url: https://mathieuhaye.fr/blog/en/2026-07-07-hubspot-donnees-crm-enrichissement-ia
alternate: https://mathieuhaye.fr/blog/2026-07-07-hubspot-donnees-crm-enrichissement-ia
category: CRM & Sales
description: "On July 5, 2026, HubSpot reversed in four days a plan to share its 299,458 customers' enrichment data by default. What the episode says about AI and data."
---

# HubSpot backs off default CRM data sharing

> On July 5, 2026, HubSpot reversed in four days a plan to share its 299,458 customers' enrichment data by default. What the episode says about AI and data.

**The 30-second version**

- On July 1, 2026, HubSpot published a terms update turning on, by default, the cross-account sharing of enrichment data: business contact details, employer information and email deliverability signals.

- On July 5, 2026, four days later, the company backtracked; co-founder Dharmesh Shah wrote "We made a mistake and are reversing that decision," and chief product officer Duncan Lennox issued a public apology.

- HubSpot reports 299,458 customers and $881.0m in Q1 2026 revenue, up 23% year over year.

- The reversal covers the terms, not the strategy: HubSpot keeps its "Trusted Prospecting" vision and promises data enrichment that is now fully opt-in.

It took HubSpot four days to go from a new data policy to a public apology. Between July 1 and July 5, 2026, the CRM most widely used by small and mid-sized businesses announced, then pulled, a clause that turned its customers' database into a shared enrichment source by default. The affair looks minor; it says something essential about what data is worth in the age of AI agents, and about the line customers refuse to see crossed.

## What HubSpot announced on July 1

On July 1, 2026, HubSpot published a terms of service update introducing a feature called Contact Discovery, due to launch on August 4, 2026 ([PPC Land](https://ppc.land/hubspot-kills-contact-discovery-terms-after-customer-backlash/)). The text stated that enrichment data "such as business contact details, employer information, and email deliverability signals" could be shared with other customers. In practice, the business contacts, employer information and email deliverability signals gathered in one account could feed another account's database.

The friction was not the feature but its default. Sharing was on by default; to withdraw, a customer had to opt out manually before August 4, 2026, through separate settings for enrichment, AI model training and email tracking ([CMSWire](https://www.cmswire.com/customer-experience/hubspot-reverses-customer-data-enrichment-plan-after-customer-backlash/)). HubSpot claimed customers kept "complete control," while making non-participation the most laborious choice.

The backlash came from LinkedIn. Gabe Larsen, chief revenue officer at Atonom, captured the unease: "I bought the software... I imported the contacts... I cleaned the data... I enriched the records... And now you're telling me the default is that my database helps improve yours?" Other voices, such as sales leader Saarika Chotai, called it "another reason to boycott" the company. Within hours, a terms setting had become a trust issue.

## Why was sharing-by-default the real problem?

Because opt-out shifts the burden of consent onto the customer instead of the vendor. With sharing on by default, silence counts as agreement: customers who had not read the update, or not understood the three settings to turn off, would have ended up feeding a shared pool without meaning to. The difference between opt-in and opt-out is not cosmetic; it decides who, vendor or customer, must act to protect the data.

On July 5, 2026, HubSpot decided in the customer's favor. In a community post titled "We got this wrong, and we are fixing it," chief product officer Duncan Lennox wrote: "Nothing matters more to us than the trust of our customers, and with our recent terms of service update we let you down. We are sorry about that. We will not move forward with the terms of service changes we communicated on July 1, 2026." Co-founder Dharmesh Shah was even blunter: "Sorry. You are right. We made a mistake and are reversing that decision" ([Salesforce Ben](https://www.salesforceben.com/hubspot-backtracks-after-ai-data-sharing-controversy/)).

The retreat is clear but bounded. HubSpot cancels the terms, not the ambition: the company still believes in its "Trusted Prospecting" vision and in the idea that a continuously refined dataset "can play a role." The promise going forward fits in one phrase: any future enrichment using customer data will be "fully and transparently opt-in" ([HubSpot Community](https://community.hubspot.com/t/we-got-this-wrong-and-we-are-fixing-it/152063)). The fight is not over; it is postponed to the next version, better packaged.

## What the episode reveals about AI and proprietary data

A CRM that aggregates the enrichment data of 299,458 customers mechanically builds one of the richest B2B contact sets on the market (Q1 2026 figure, [HubSpot 8-K](https://www.sec.gov/Archives/edgar/data/0001404655/000119312526211923/hubs-ex99_1.htm)). That fuel is exactly what feeds AI-assisted prospecting: the denser and fresher the shared base, the better agents can qualify, complete and prioritize contacts. HubSpot was not trying to resell the data; it was trying to feed a network effect, where each customer improves the tool for everyone else.

The problem is the boundary. HubSpot keeps repeating that "your CRM data, your contacts, notes, deals, call recordings, custom fields, and customer records, belongs to you." But enrichment data, derived and aggregated, fell into a gray zone the update tried to shift onto the vendor's side. From the customer's point of view, the contact they imported, cleaned and enriched stays theirs, whatever name you give it. It was that unilateral redefinition of ownership, more than the feature itself, that triggered the reaction.

The episode puts HubSpot on the turf of ZoomInfo, Apollo and Clay, platforms whose model openly rests on a pooled contact database. The difference is that those players sell data first; HubSpot sells a CRM into which the customer deposits their own. Crossing that line, even through a clause, rewrites the implicit contract. In the age of agents, where proprietary data becomes the real differentiator, that boundary is worth more than any feature.

## Opt-in by default: the new standard for B2B AI?

For a European audience, the debate feels familiar: since 2018, GDPR has required explicit consent, that is opt-in, for a large share of personal data processing. What HubSpot just learned the hard way is that the norm is spreading beyond the law, into the expectations of American B2B customers too. In 2026, data sharing that is on by default no longer flies, even wrapped in a useful feature.

The lesson goes beyond HubSpot. As every SaaS vendor wires agents onto its customers' data, governance stops being a legal clause and becomes a product argument. Who owns the data, who can see it, where it travels when an agent uses it: those questions now decide trust, and trust decides retention. The HubSpot episode sets a useful precedent: on customer data, opt-in is no longer a courtesy, it is the starting point.

## What I take from it for my CRM work

When I build a revenue operations component, the question "who owns the enriched data" always shows up, and rarely at a convenient time. On my Horus Condition Report engagement, a bilingual FR/EN Pipedrive pipeline, every imported contact, every auto-completed field and every note added by an agent raises the same question HubSpot ran into: where does the customer's data end, and where does the data the tool reuses begin. The answer is not settled in the terms of service; it is settled in the architecture, by deciding upfront which flows stay siloed and which can feed a shared enrichment, with clear consent. It is less spectacular than an agent that prospects on its own, but it is what keeps a customer trusting their CRM once AI is wired into it.

HubSpot fixed a terms mistake in four days; it still has to prove that opt-in enrichment can deliver the commercial promise of sharing-by-default. The real question is not whether vendors will want to pool your data to feed their agents. It is whether they will let you say no by default.

## Frequently asked questions

### What did HubSpot announce on July 1, 2026?

On July 1, 2026, HubSpot published a terms of service update introducing a feature called Contact Discovery, due to launch on August 4, 2026. It would have shared enrichment data by default across customer accounts, including business contact details, employer information and email deliverability signals.

### Why did HubSpot customers push back?

Because sharing was on by default: customers had to opt out manually before August 4, 2026, through separate settings. Many felt the contact database they had imported, cleaned and enriched was being turned, without their explicit consent, into a shared resource that improved a competitor's tool.

### Did HubSpot abandon data enrichment?

No. On July 5, 2026, HubSpot reversed the terms changes and apologized, but kept its "Trusted Prospecting" strategy. The company promises that any future enrichment using customer data will be fully and transparently opt-in, with clear upfront control.

### What is the difference between opt-in and opt-out for CRM data?

With opt-out, sharing is on by default and the customer must act to withdraw; silence counts as consent. With opt-in, nothing is shared until the customer gives explicit consent. For personal data, GDPR has required opt-in in Europe since 2018, and that expectation is now spreading to B2B customers.

---

Source: [https://mathieuhaye.fr/blog/en/2026-07-07-hubspot-donnees-crm-enrichissement-ia](https://mathieuhaye.fr/blog/en/2026-07-07-hubspot-donnees-crm-enrichissement-ia) | Other language: [https://mathieuhaye.fr/blog/2026-07-07-hubspot-donnees-crm-enrichissement-ia](https://mathieuhaye.fr/blog/2026-07-07-hubspot-donnees-crm-enrichissement-ia)
