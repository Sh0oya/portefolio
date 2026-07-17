---
title: "Agentic commerce: when AI agents start to pay"
date: 2026-07-05T11:00:00+02:00
language: en
slug: 2026-07-05-aisa-paiement-agents-ia-commerce-agentique
url: https://mathieuhaye.fr/blog/en/2026-07-05-aisa-paiement-agents-ia-commerce-agentique
alternate: https://mathieuhaye.fr/blog/2026-07-05-aisa-paiement-agents-ia-commerce-agentique
category: Fintech
description: "AIsa raised $6.5m to let AI agents pay for data and APIs. Visa, Mastercard, Stripe and Coinbase are fighting to own the agentic commerce payment layer."
---

# Agentic commerce: when AI agents start to pay

> AIsa raised $6.5m to let AI agents pay for data and APIs. Visa, Mastercard, Stripe and Coinbase are fighting to own the agentic commerce payment layer.

**The essentials in 30 seconds**

- AIsa raised a $6.5m seed round on July 3, 2026, led by Alibaba and Tribe Capital, to build a payment layer that lets AI agents buy data, APIs and software through a single interface.

- AIsa's platform onboarded more than 20,000 agents between February and June 2026 with no paid marketing, and settles transactions in fiat or stablecoin.

- Stripe opened its Shared Payment Tokens to Mastercard Agent Pay and Visa Intelligent Commerce on March 3, 2026; the buy-now-pay-later methods they include move more than $300bn a year worldwide.

- Visa reported a $7bn annualised run rate of stablecoin flows in April 2026, and Coinbase's x402 protocol processed 169 million payments in its first year.

An AI agent that drafts a plan, queries a database and recommends an action is still an advisor. The day it pays for an API or a dataset itself, it becomes an economic actor. On July 3, 2026, a quiet funding round was a reminder that this shift is being built right now, and that it already draws the largest payment networks in the world.

## The news: AIsa raises $6.5m to let agents pay

On July 3, 2026, San Francisco startup AIsa announced a $6.5m seed round led by Alibaba and Tribe Capital, with Draper Associates, Sumitomo Corporation and Saison Capital also taking part ([Forbes](https://www.forbes.com/sites/elainepofeldt/2026/07/03/startup-raises-65-million-by-making-it-easier-for-ai-employees-to-make-payments-online/)). The ten-person company is building what co-founder Jordan Liu calls "the Amazon for agents": a unified transaction layer where an autonomous agent discovers, accesses and pays for digital resources through a single programmable interface.

The problem AIsa targets is concrete. Almost every digital platform was designed for humans: account creation, subscriptions, contracts, card entry. "Autonomous agents cannot navigate these pathways smoothly, posing a roadblock to their use at scale," Liu explains. AIsa bills on usage and settles in fiat or stablecoin. Between February and June 2026, the platform onboarded more than 20,000 agents with no paid marketing, a rare traction signal for infrastructure this young.

AIsa is not alone in this lane. The same week, the agentic payments ecosystem thickened: Stripe, Visa, Mastercard and Coinbase are each building their version of the same idea. An agent has to be able to trigger a payment securely, without exposing its owner's credentials.

## Why couldn't agents pay until now?

Because online payment was designed for a human who clicks. An agent that needs to buy data or call a paid API hits three obstacles: proving who it is, proving it is allowed to spend, and doing so without storing its owner's card number. Stripe answered on March 3, 2026 with Shared Payment Tokens (SPTs): the agent initiates the purchase with the customer's permission and preferred method, without ever seeing the underlying credentials ([Stripe](https://stripe.com/blog/supporting-additional-payment-methods-for-agentic-commerce)).

On that same March 3, Stripe extended these tokens to Mastercard Agent Pay, Visa Intelligent Commerce and the buy-now-pay-later (BNPL) methods of Affirm and Klarna, a market that exceeds $300bn in transactions a year worldwide. The underlying move is identical everywhere: turn the customer's intent into a scoped token that the agent uses at any merchant. The network handles verification, authorisation and mapping the token back to the real card number at settlement. For agents, it is the equivalent of what card-on-file was for 2010s e-commerce.

## Two rails emerge: cards for humans, stablecoins for machines

The market is splitting into two logics. On one side, the card networks extend their model: Visa Intelligent Commerce and Mastercard Agent Pay issue card-backed tokens, with fraud protection and dispute resolution, built for retail purchases. On the other, stablecoin rails target machine-to-machine micro-payments. Coinbase's x402 protocol, which revives the HTTP 402 "Payment Required" status code, processed 169 million payments across 590,000 buyers and 100,000 sellers in its first year, settling in roughly 200 milliseconds ([Forbes](https://www.forbes.com/sites/digital-assets/2026/06/07/visa-mastercard-and-coinbase-are-fighting-over-how-ai-agents-pay/)).

The dividing line is clean: of the five most visible agentic-commerce deployments live in early 2026, three settle on card rails and two on stablecoins, almost exactly along the consumer-versus-machine axis. The networks are hedging on both sides. Visa reported a $7bn annualised run rate of stablecoin flows in April 2026, up 50% quarter on quarter, with more than 130 stablecoin-linked card programmes across 50-plus countries. Mastercard acquired stablecoin platform BVNK for up to $1.8bn in March 2026. No one wants to bet on a single rail.

One figure captures the urgency for them: Visa justified its Trusted Agent Protocol, which verifies agents and blocks malicious bots, by pointing to a 4,700% surge in AI-driven traffic to US retail sites. The traffic is arriving; the open question is who collects.

## The real bottleneck is not the model, it is the plumbing

What this wave reveals is that value is moving from the model to the infrastructure around it. An agent that can reason has existed for eighteen months; an agent that can act, meaning pay, identify itself and be authorised, is still a work in progress. Visa even shipped an MCP (Model Context Protocol) server, the layer that lets a language model plug directly into its payment APIs. The same MCP standard used to connect an agent to a database now connects it to a payment method.

For a business, the practical question is no longer "which model" but "which authorisation". How much can an agent spend, with whom, over what period, and who is liable when it gets it wrong? These are governance and plumbing questions, not compute questions. A virtual card hacked together per workflow does not scale to hundreds of agents; you need a per-agent spending cap, a trace of every transaction and a clean separation of identities. That is exactly where the next few years of agentic commerce will be decided, and where AIsa, Stripe and the card networks are positioning.

## What this changes in my own builds

In my automations, agent payments stop being theoretical. The IA Brew newsletter runs on a 93-node n8n workflow that calls several external APIs on every edition. As long as those calls sit under a flat subscription, the topic stays invisible. The day an agent has to consume a data source billed per call, or buy a one-off enrichment, usage-based billing and authorisation become a real block to design: spending cap, logging, identity separation. Layers like Stripe's Shared Payment Tokens or a marketplace like AIsa promise to handle that part for me, rather than spinning up a virtual card per workflow. For a builder assembling agents in production, that is the difference between an agent that proposes an action and one that carries it through to payment, under control.

The AI race was long measured in model size. It will soon be measured in the ability to pay: the first network that makes an agent solvent, traceable and authorised will take a position no one takes back easily.

## Frequently asked questions

### What is agentic commerce?

Agentic commerce refers to transactions where an autonomous AI agent buys goods, data or services on a user's behalf, without a human approving each step. It requires a dedicated payment layer that verifies the agent, caps what it can spend and settles the transaction without exposing the owner's credentials.

### How does an AI agent pay without exposing its owner's card?

Through payment tokens. Stripe's Shared Payment Tokens, launched on March 3, 2026, let an agent initiate a payment with the customer's permission and preferred method, without ever seeing the card number. The network, Visa or Mastercard, maps the token back to the real card at settlement.

### Card or stablecoin for AI agent payments?

Both coexist depending on the use case. Card rails such as Visa Intelligent Commerce and Mastercard Agent Pay dominate retail purchases thanks to fraud protection. Stablecoins, driven by Coinbase's x402 protocol, dominate fast machine-to-machine micro-payments, settling in roughly 200 milliseconds.

---

Source: [https://mathieuhaye.fr/blog/en/2026-07-05-aisa-paiement-agents-ia-commerce-agentique](https://mathieuhaye.fr/blog/en/2026-07-05-aisa-paiement-agents-ia-commerce-agentique) | Other language: [https://mathieuhaye.fr/blog/2026-07-05-aisa-paiement-agents-ia-commerce-agentique](https://mathieuhaye.fr/blog/2026-07-05-aisa-paiement-agents-ia-commerce-agentique)
