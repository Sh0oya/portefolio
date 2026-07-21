---
title: "Projects & work · AI apps, automations, custom CRM"
url: https://mathieuhaye.fr/en/projects
language: en
alternate: https://mathieuhaye.fr/projets
description: "Emma, a custom CRM for e-Enfance / 3018, an automated AI newsletter, AI agents, dashboards and n8n automations: 8 projects shipped or tested in real conditions."
---

# Is a builder, automation-obsessed, AI-first, Paris-based and freelance-driven.

> What I build when teams hand me their processes: pipelines, agents, CRMs, apps. Everything below is in production or tested in real conditions.

Related services: [AI agent developer](https://mathieuhaye.fr/en/ai-agent-developer) · [n8n automation](https://mathieuhaye.fr/en/n8n-automation) · [AI agent for SMEs](https://mathieuhaye.fr/en/ai-agent-for-smes) · [Custom CRM](https://mathieuhaye.fr/en/custom-crm) · [Custom web app](https://mathieuhaye.fr/en/custom-web-app) · [AI freelance](https://mathieuhaye.fr/en/ai-freelance) · [Collaboration](https://mathieuhaye.fr/en/collaboration)

## Projects: pipelines, agents, things that ship

## 01. e-Enfance / 3018, Emma custom CRM

Tags: Emma custom CRM, Full-stack TS, Realtime supervision, Market CRM (prior), Unified multichannel queue, Distress-signal detection, FR-hosted

- Client: e-Enfance / 3018
- Scope: Emma, all-in-one custom CRM
- Integrations: Chat, phone, email, WhatsApp, Messenger
- Role: Freelance consultant

### The brief

3018 is the French national hotline for protecting minors online, run by the e-Enfance association. I first worked on their existing market CRM. That experience showed me exactly what the teams needed day to day, and where their market CRM reached its limits for this need.

### What I built

**Emma, a custom CRM.** The listeners' workstation: a single queue that merges every channel (chat, phone, email, WhatsApp, Messenger), automatic distress-signal detection with suicide-risk prioritization, a structured, exportable case file, real-time supervision and reporting.

- A **single unified queue** that merges every channel: chat, phone, email, WhatsApp and Messenger, so listeners work from one screen.
- **Automatic distress-signal detection** with suicide-risk prioritization, surfacing the most urgent cases first.
- A **structured, exportable case file** for every conversation.
- **Real-time supervision and reporting** for the coordination team.
- **Full-stack TypeScript**, designed and shipped end to end, replacing their market CRM.
- **Sovereign and France-hosted**, on sensitive data, with an audit trail.

### Why it is on this portfolio

Proof I can design and ship a real, all-in-one operations platform end to end, on sensitive data, not just configure an existing tool. That is exactly what a commercial operations platform needs.

## 02. IA Brew. AI Newsletter

Tags: n8n, Claude API, Apify, Brevo, HTML templating

- Type: Automated newsletter
- Workflow: 93+ nodes n8n
- Frequency: Weekly, unattended
- Stack: Apify + Claude + Brevo

### The pipeline

A newsletter that writes itself. 20+ sources (RSS, APIs, scraped sites) feed into an n8n workflow. Claude scores every item for relevance, clusters duplicates, summarises the top picks, and renders an HTML email. Brevo ships it every week.

### Stages

- **Ingest**: Apify actors + n8n HTTP nodes pull raw items.
- **Dedupe**: content fingerprinting to collapse same-story items across sources.
- **Score & summarise**: Claude API with a tuned prompt (relevance + signal extraction).
- **Render**: HTML template assembled from scored blocks.
- **Send**: Brevo campaign creation + dispatch to list.
- **Observability**: per-step logging in Google Sheets for post-mortem.

### Take-away

Same pattern applies to any research-desk workflow: ingest, score, cluster, render, distribute. The difference between a toy and a product is the observability and the scoring rigor.

## 03. Multi-source Job Scorer + ATS PDF Generator

Tags: Python, WTTJ API, JobTeaser, Claude API, ReportLab, HTML / JS, SQLite

- Sources: WTTJ, JobTeaser, LinkedIn
- Jobs scored: 240+
- Auto-generated: ATS CV + cover letter in PDF
- Scoring: Weighted, profile-aware

### What it does

Pulls job postings from three platforms via their APIs, normalises the schema, scores each posting against my profile on a weighted set of criteria (stack match, industry fit, location, seniority), and renders a filterable HTML dashboard. For every high-scoring offer, the pipeline auto-generates a **CV and a cover letter tailored to the job description**, both exported as clean **ATS-optimised PDFs**.

### Build

- **Per-source scrapers** with rate limits and caching.
- **Unified schema** so I compare like for like.
- **Scoring engine**: manual weights tuned over 2 iterations.
- **Tailored CV generator**: Claude reshuffles the sections of my master CV to match the job keywords, then ReportLab renders a pixel-clean PDF.
- **Cover letter generator**: same pattern, with a structured prompt that enforces tone, structure and length.
- **ATS rules**: single-column layout, no tables, no images behind text, real font files (not image-based), standard section names, machine-parseable headings.
- **UI**: vanilla HTML / JS dashboard with filterable table and one-click download of the two PDFs per offer.

### Why ATS matters

Most CVs today are first read by Applicant Tracking Systems before any human sees them. A beautiful two-column design or a CV exported as an image silently drops your score to zero. This pipeline respects the ATS constraints by construction: every CV it outputs is parsed correctly by Workday, Greenhouse, Lever and friends.

### What I got from it

Clean case study in ETL discipline plus applied GenAI: if the schema is wrong, the scoring is meaningless; if the CV prompt is sloppy, the PDF reads like filler. Both disciplines reward rigor more than creativity.

## 04. Juice Jacking Guard. USB Threat Monitor (Windows)

Tags: Python 3.10+, Tkinter, WMI (Win32_PnPEntity), Raw Input API (ctypes), pnputil, PyInstaller, Inno Setup, VirusTotal API v3

- Platform: Windows 10 / 11
- Threats covered: BadUSB, Rubber Ducky, O.MG Cable, juice jacking, USB payloads
- Size: ~4,900 lines, 20 modules, 11 subsystems
- Distribution: Single-file .exe installer (23.3 MB)

### Why it exists

A USB device is never just a USB. When you plug something in, Windows trusts whatever it declares, a Rubber Ducky that announces itself as a keyboard can type 200 commands in a few seconds with no prompt. An O.MG cable looks like a normal Lightning cable but hides a chip that exfiltrates data. No antivirus catches this in time. Juice Jacking Guard intercepts the device **before** it can speak to Windows.

### Detection and blocking

- **WMI background monitor**: scans `Win32_PnPEntity` in a dedicated thread, immediate block via `pnputil` on insertion.
- **Classifier**: VID/PID, USB classes, vendor, composite multi-interfaces. Four risk levels (low to critical) with per-category policies.
- **Composite trap**: a device that exposes HID + mass storage simultaneously is the classic BadUSB / O.MG signature, flagged CRITICAL automatically.
- **Block-first, ask-after** policy: minimal exposure window, the device is disabled at OS level until the user explicitly trusts it.

### The Anti-BadUSB challenge (killer feature)

- **Raw Input API via ctypes**: I use `hDevice` from `WM_INPUT` to identify the exact physical keyboard sending each keystroke.
- **Interactive challenge**: every new keyboard pops a modal asking "press key X on the new keyboard", a Rubber Ducky cannot read a prompt and respond, so it unmasks itself.
- **Burst detection**: 3 or more keystrokes in under 30 ms is the signature of a payload dump, automatic block.
- **Dedicated message-only window** for Raw Input, running in its own thread, communicates with the UI via `Queue` + `threading.Event`.

### Scanning and reputation

- **On-insert read-only scan** of mass storage: `autorun.inf`, 23 executable extensions, hidden files, suspicious shortcuts.
- **SHA-256** computed locally for every finding.
- **VirusTotal lookup (optional, free tier)**: hash-only API v3 calls, no file upload, token-bucket rate limiter to respect 4 req/min.
- **Live verdict** in the alert popup, with per-finding evidence.

### Engineering highlights

- **Multi-threading**: WMI monitor thread + event dispatcher thread + Raw Input thread (own message-only window) + Tk main thread, all wired through `Queue` and `threading.Event`.
- **UAC self-elevation**: if not admin at launch, re-launch via `ShellExecuteW` with the `runas` verb.
- **Task Scheduler boot hook**: `Register-ScheduledTask` with `RunLevel Highest` = silent admin boot, no UAC prompt every session.
- **Modern dark UI**: full custom Tkinter theme, Windows dark title bar via `DwmSetWindowAttribute(DWMWA_USE_IMMERSIVE_DARK_MODE)`, sidebar nav (Dashboard / Whitelist / Journal / Preferences), system tray, toast notifications.
- **Installer**: Inno Setup script, Program Files install, Desktop + Start Menu shortcuts, scheduled task, Defender exclusion, clean uninstall.
- **Build**: PyInstaller single-file + Inno Setup, chained in `build.bat` (PowerShell alt in `setup.bat`).

### Download (Windows 10 / 11)

- Download .zip (recommended, 22.7 MB): https://mathieuhaye.fr/downloads/JuiceJackingGuard-Setup.zip
- Direct .exe (23.3 MB): https://mathieuhaye.fr/downloads/JuiceJackingGuard-Setup.exe

SHA-256 (.zip): e37364564f1eed9af699b85a40dae6e5fdbf9f25efba72f3002f6d0e0b41ffac

SHA-256 (.exe): 1132af4c3a2158f17806a7720b0a46d4c477799bae78b6a81d3a315cfa30812a

The installer is **unsigned** (no 400 EUR/year code-signing certificate), so Chrome / Edge and Windows SmartScreen will warn before download and at first launch. The **.zip is recommended** because browsers trust archives more than raw executables. After extraction, Windows will show "Windows protected your PC", click More info, then Run anyway. Verify the SHA-256 before running. The app is local-first, no telemetry, only reaches out to VirusTotal if you enable the optional hash lookup feature.

### Why it is on this portfolio

Juice Jacking Guard is the project where the builder reflex meets real systems programming: ctypes calls into the Windows API, threading discipline that does not deadlock, an installer that survives Defender, a security model that defaults to "deny". It also shows that I can take a niche, half-understood threat (USB payloads) and ship a defence that actually works on the machine you are reading this on.

## 05. Bloomberg-Style Dashboard

Tags: Next.js 14, TypeScript, Claude API, Recharts, CoinGecko, Yahoo Finance, Telegram

- Scope: 6 assets (crypto, stocks, ETF)
- AI: Claude Haiku 4.5
- Alerts: Telegram, 3 tiers
- Schedule: 08:50 / 13:00 / 17:30 Paris

### Goal

A personal terminal I actually use every morning. Follows BTC, ETH, SOL, NVDA, TTE and CW8. Pulls prices, runs technicals, asks Claude for a short take at market-relevant hours, pushes everything to Telegram.

### Features

- **Scheduled AI analysis** before open, at midday, after close.
- **Technicals**: RSI, MACD, Bollinger, ATR across 1D / 1W / 1M / 3M.
- **What-If simulator** with 10-day Monte Carlo (median / worst / best).
- **Correlation heatmap** (Pearson 6x6) + diversification score.
- **DCA tracker**: cost basis per asset, P&L %, budget progress.
- **Events calendar**: earnings, dividends, ECB, Fed with J-N countdown.
- **Trade journal**: logs reasoning + emotional state per trade.

### Why it matters

This project hits every junior quant touchpoint: data ingestion, feature engineering, Monte Carlo, production LLM calls, scheduling. It is the kind of tool I want to learn to build with proper math.

## 06. IchimokuSignal Pro

Tags: Pine Script v6, TradingView, Python, yfinance, pandas, numpy

- Type: Indicator + backtester
- Version: v3.3 (Bounce + 15% SL)
- Net return (AAOI, 5y): +187% vs +1088% B&H
- Win rate / PF / MaxDD: 54% / 1.62 / 24%

### Problem

Most Ichimoku setups on TradingView fire too often on long-term stock charts. I wanted a single-shot "GO" / "WAIT" signal for buy-and-hold style stock picking, validated with a Python backtest that includes commissions and slippage.

### Approach

- **Primary signal**: Kijun / Tenkan bounce detection.
- **Risk**: trailing 15% stop loss drawn as a dotted line, exit on score drop below 2.
- **Enhanced Chikou**: checked against the cloud at the Chikou position.
- **Higher timeframe candles**: engulfing, hammer, doji, marubozu. Anti-repaint.
- **Composite score**: 10 criteria, up to 13 points.
- **Python backtester**: reproduces the Pine logic candle by candle, now with 0.1% round-trip fees and 1-tick slippage.

### Honest results (AAOI, 5y)

- Strategy: **+187%**, 54% WR, PF 1.62, MaxDD -24%.
- Buy & Hold baseline: **+1088%**, MaxDD -62%.
- So the strategy loses to B&H in absolute terms, but cuts drawdown by more than half.
- Single-stock backtest. Forward-testing on a 15-ticker basket is next.

### What it taught me

Two things. First, single-asset backtests are always partly overfit, so out-of-sample testing is non-negotiable. Second, a strategy that underperforms B&H on return but halves drawdown is still a valid product for a risk-averse investor. Choosing a strategy is choosing a risk profile.

## 07. Real Estate Investment Model

Tags: Python, pandas, Notion, INSEE open data, Google Sheets

- Scope: SCI/IS vs LMNP, mortgage
- Data: INSEE, notary stats, rental yields
- Cities ranked: 34 French metros
- Purpose: Size my own portfolio

### What it does

A working model to choose between SCI at IS (corporate tax) and LMNP (furnished rental, BIC regime) on a per-deal basis. Includes mortgage scenarios, 10-year IRR, tax impact, exit strategy and a city-level index to rank rental attractiveness across France.

### Components

- **Regime comparator**: SCI/IS vs LMNP, cash flow year by year, IRR, net equity at exit.
- **Mortgage simulator**: amortisation, interest curve, break-even rent.
- **City index**: rental yield, vacancy risk, price momentum, notarial tax.
- **Macro overlay**: rate scenarios, inflation, salary growth.
- **Notion dashboard**: I use it on actual deals I underwrite.

### Why it matters

Real estate is the asset class where I learned that the tax wrapper matters more than the price. Modelling it forced me to understand how corporate vs personal tax regimes interact with financing. The same reasoning applies to any structured instrument in finance.

## 08. Crypto Trading Bot (MEXC)

Tags: Python, MEXC API, pandas, numpy, Streamlit, TA-Lib

- Strategy: Mean reversion, BTC + ETH
- Paper P&L: +3.2% over 90 days
- Live P&L: -2.1% over 30 days
- Win rate: 46% (214 trades)

### Hypothesis

Short-term crypto pairs often overshoot. When RSI dips below a band and price breaks below the lower Bollinger envelope, a snap-back is more likely than a trend continuation. The bot fades that move with a tight stop.

### Architecture

- **Indicator engine**: RSI(14) + Bollinger (20, 2 sigma) on rolling 1m and 5m candles.
- **Entry filter**: both signals agree + volume spike above 1.5x average.
- **Position sizing**: fixed fractional, capped per pair.
- **Exit**: take-profit at mid-band, hard stop 1.5%, time stop after 30 candles.
- **Dashboard**: live equity curve, per-trade log, kill switch.

### Results (honest numbers)

- Paper (90 days): **+3.2%**, PF 1.18, MaxDD -8.4%.
- Live pilot (30 days, 10% of paper size): **-2.1%**, WR 46%.
- Delta: paper did not model **taker fees (0.1%)** and real slippage on illiquid pairs.
- Fees alone explain roughly 4 percentage points of the gap.

### What I changed next

Pivoted to a maker-rebate version using limit orders at the Bollinger edges. Lower fill rate, but when it fills, fees turn negative. That is still running in paper. The real lesson: never trust a backtest that does not model friction costs tick by tick.

## Background: economics, code, AI

### 2026 · Bloomberg Market Concepts (BMC), Certification

Certified. Covers economic indicators, currencies, fixed income, interest rate risk and equities. The shared language for any business-and-markets conversation. Verify certificate: https://portal.bloombergforeducation.com/certificates/7kakVQVUGSdR7qBjzaATqhsL

### Oct 2025 to present · Freelance Consultant. CRM, Data, Applied AI

Clients: e-Enfance / 3018, Fromagerie Ermitage, Horus Condition Report, Profile Club

- **e-Enfance / 3018, Emma custom CRM.** Worked on their existing market CRM first; then designed and shipped Emma, the listeners' workstation: a single queue merging every channel (chat, phone, email, WhatsApp, Messenger), automatic distress-signal detection with suicide-risk prioritization, an exportable case file, real-time supervision and reporting. Full sovereign build, hosted in France.
- **Data monitoring, Fromagerie Ermitage.** 93-node n8n workflow for automated press and social media monitoring. 19-indicator keyword scoring, temporal filtering, weekly reports auto-generated.
- **CRM restructuring, Horus Condition Report.** Pipedrive migration and bilingual (FR / EN) sales automations.
- **Data & analytics, Profile Club.** 146-record member database, cohort analysis, campaign segmentation, KPI dashboards on Google Apps Script.

### Sep 2024 to Sep 2025 · Digital Project Coordinator, Concilium, Paris

Digital project management agency, 150+ projects / year.

- **Project coordination.** Backlog management, steering committee prep, deliverable tracking, client reporting across 150+ digital projects.
- **CRM admin.** OHME and Pipedrive deployment, contact data structuring, segmentation, campaign exports.
- **Automated reporting.** Sector monitoring newsletter and internal AI newsletter built on n8n + Brevo.

## A project like these?

Describe your project in 30 seconds. I'll tell you if I can do it (and how long) within 24h.

- [Book a call](https://calendly.com/mathieu-haye/30min)
- [See the services](https://mathieuhaye.fr/en/ai-freelance)

---

Contact: contact@mathieuhaye.fr | Book a call: https://calendly.com/mathieu-haye/30min | Site: https://mathieuhaye.fr/
