---
title: "SAP bets $1.16bn on tabular AI, not another LLM"
date: 2026-07-19T08:00:00+02:00
language: en
slug: 2026-07-19-sap-prior-labs-ia-tabulaire-donnees-entreprise
url: https://mathieuhaye.fr/blog/en/2026-07-19-sap-prior-labs-ia-tabulaire-donnees-entreprise
alternate: https://mathieuhaye.fr/blog/2026-07-19-sap-prior-labs-ia-tabulaire-donnees-entreprise
category: Data & Analytics
description: "On July 17, 2026, SAP closed its Prior Labs acquisition and is investing over €1 billion in tabular AI, built to predict on structured business data."
---

# SAP bets $1.16bn on tabular AI, not another LLM

> On July 17, 2026, SAP closed its Prior Labs acquisition and is investing over €1 billion in tabular AI, built to predict on structured business data.

**Key takeaways**

- On July 17, 2026, SAP closed its acquisition of Prior Labs, a German company founded about 18 months ago, committing to invest more than €1 billion (roughly $1.16 billion) over four years.

- Prior Labs does not build a language model: it created TabPFN, a tabular foundation model published in *Nature* and downloaded more than 3 million times, built to predict on tables of business data.

- SAP's bet: large language models have only a rudimentary understanding of tables, numbers and statistics, while most enterprise data (ERP, CRM, accounting) lives in rows and columns.

- For an SME, the signal is clear: the value of applied AI sits in structured data (churn, payment delays, lead scoring), not just the chatbot laid on top of it.

For two years, the enterprise AI race boiled down to one question: which language model is the biggest? On July 17, 2026, SAP answered a different question, and that is exactly the point. The German software maker closed its acquisition of Prior Labs, a team that does no conversational AI at all, and pledged to pour more than €1 billion into it. The message is blunt: the next battle in enterprise AI will not be fought over text, but over tables.

## What SAP closed on July 17

On July 17, 2026, SAP announced it had completed the acquisition of Prior Labs, a company founded in Freiburg, Germany, about 18 months earlier ([SAP News](https://news.sap.com/2026/07/sap-completes-prior-labs-acquisition/)). Financial terms were not disclosed, but SAP is committing to invest "more than €1 billion over the next four years" to turn Prior Labs into a leading AI lab for structured data. TechCrunch put the bet at about $1.16 billion and flagged the boldness of wagering that sum on an 18-month-old outfit ([TechCrunch](https://techcrunch.com/2026/05/05/sap-bets-1-16b-on-18-month-old-german-ai-lab-and-says-yes-to-nemoclaw/)).

Prior Labs will stay an independent unit, based in Freiburg, with its team and open-source direction intact. Its founders, Frank Hutter, Noah Hollmann and Sauraj Gambhir, created TabPFN, a model series published in the journal *Nature* and downloaded more than 3 million times. The latest version, TabPFN-2.6, tops the TabArena benchmark and, per SAP, "matches the accuracy of a four-hour automated machine learning pipeline, instantly, in a single model" ([SAP News](https://news.sap.com/2026/05/sap-to-acquire-prior-labs-establish-frontier-ai-lab-europe/)). SAP plans to integrate the technology into SAP AI Core, SAP Business Data Cloud and its agentic layer, Joule.

## Why bet on a "tabular" model instead of one more LLM?

SAP is betting on tabular models because a language model reads the stuff that runs a business poorly. As the company puts it, "large language models struggle to make accurate predictions on structured business data because they have only a rudimentary understanding of tables, numbers and statistics." Yet the ERP, the CRM, accounting, inventory: all of it lives in rows and columns, not in paragraphs.

A tabular foundation model, or TFM, is designed for that format. Where an LLM generates plausible text, a TFM predicts a value: a likely payment delay, a supplier risk, an upsell opportunity, a customer about to leave. TabPFN learns to generalize to tables it has never seen, without the long training cycle of a classic machine learning model. The gain is not cosmetic: it compresses into a single model what used to require a toolchain, a data scientist and hours of compute. It is the difference between renting a chatty generalist brain and having a numbers specialist that answers on the first try.

## The real signal: value is moving toward structured data

The deal says something broader about enterprise AI in 2026: value is no longer moving toward ever-larger models, but toward the proprietary data those models act on. "Early on, SAP recognized that the greatest untapped opportunity in enterprise AI wasn't large language models; it was AI built for the structured data that runs the world's businesses," says Philipp Herzig, SAP's chief technology officer. In plain terms: whoever holds the tables holds the edge, and SAP hosts some of the largest reserves on the planet, inside the ERP systems of tens of thousands of companies.

The other signal is financial. Prior Labs had raised under $10 million in pre-seed funding in early 2025; 18 months later, it exits on a commitment of more than €1 billion. "Joining the SAP family gives us the resources, data environment and customer reach to take this category to its full potential," says Frank Hutter, CEO of Prior Labs. The message to investors is clear: a sharp research team on a real technical niche, prediction over tabular data, is now worth more than yet another conversational assistant wrapped around an LLM API. After two years of excess around model size, the market is paying for measurable usefulness again.

## What it changes for an SME, and for my own work

For an SME, the lesson is concrete: the questions that pay (which customer will leave, which invoice will slip, which lead is worth a call) are prediction problems on tabular data, not text-generation problems. You do not need the biggest language model to answer them; you need clean data and a model built for tables. That is good budget news: the prediction layer is becoming affordable, provided you have first put your data in order.

This is where I spend most of my time on client work. The job-offer scorer I built, with its ATS-friendly CV generation, is at heart a ranking problem on structured data: criteria in columns, a score out. On the Pipedrive Horus engagement (a bilingual Condition Report), the value comes not from a chatbot but from structuring the pipeline so scoring and follow-ups hold up. And on the Bloomberg dashboard I built with Claude Haiku 4.5 to track a portfolio, most of the work was shaping the market data, not the model. A TFM like TabPFN is exactly the tool that was missing between the spreadsheet and the large language model: able to predict on columns without standing up a machine learning factory. The building block is spreading; the edge will stay with those whose data is clean.

The real question of 2026 is no longer "which model is biggest," but "who holds the tables and can predict on them." SAP just paid a billion euros to take a position. For an SME, the affordable version of the same answer starts with one thing: clean, structured data.

## Frequently asked questions

### What is a tabular foundation model?

A tabular foundation model (TFM) is an AI model built to predict on structured data organized in rows and columns, like the data in an ERP, a CRM or a spreadsheet. Unlike a language model, which is built for text, it estimates business values such as churn, payment delay or lead score, and generalizes to tables it has never seen. TabPFN, developed by Prior Labs, is the most downloaded example of this category.

### How much did SAP pay for Prior Labs?

SAP did not disclose the purchase price, but it is committing to invest more than €1 billion (about $1.16 billion) over four years to grow Prior Labs into an AI lab focused on structured data. The deal closed on July 17, 2026, roughly 18 months after the company was founded in Freiburg, Germany.

### Why not just use an LLM for these predictions?

Because a language model, in SAP's words, has only a rudimentary understanding of tables, numbers and statistics, which makes it unreliable for predicting on structured business data. A tabular model is trained specifically for that format and reaches an accuracy a general-purpose LLM cannot match on these tasks, often with far less compute.

---

Source: [https://mathieuhaye.fr/blog/en/2026-07-19-sap-prior-labs-ia-tabulaire-donnees-entreprise](https://mathieuhaye.fr/blog/en/2026-07-19-sap-prior-labs-ia-tabulaire-donnees-entreprise) | Other language: [https://mathieuhaye.fr/blog/2026-07-19-sap-prior-labs-ia-tabulaire-donnees-entreprise](https://mathieuhaye.fr/blog/2026-07-19-sap-prior-labs-ia-tabulaire-donnees-entreprise)
