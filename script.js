/* ================================================
   MATHIEU HAYE. PORTFOLIO
   Scripts: reveal, counters, nav, modal, filter
   ================================================ */

(() => {
    'use strict';

    /* ========== WEBMCP (expose site tools to AI agents) ========== */
    // See https://webmachinelearning.github.io/webmcp/
    // Registers tools via navigator.modelContext.provideContext if available.
    if (typeof navigator !== 'undefined' && navigator.modelContext && typeof navigator.modelContext.provideContext === 'function') {
        try {
            navigator.modelContext.provideContext({
                tools: [
                    {
                        name: 'contact_info',
                        description: 'Return Mathieu Haye\u2019s contact information (email, phone, LinkedIn, location).',
                        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
                        execute: async () => ({
                            name: 'Mathieu Haye',
                            email: 'contact@mathieuhaye.fr',
                            phone: '+33661513289',
                            linkedin: 'https://www.linkedin.com/in/mathieu-haye/',
                            location: 'Vaires-sur-Marne, Île-de-France, France (missions in Paris and remote)',
                            languages: ['French (native)', 'English (professional)'],
                            status: 'Freelance, available for new client engagements'
                        })
                    },
                    {
                        name: 'list_projects',
                        description: 'List Mathieu Haye\u2019s portfolio projects with their key facts (stack, metrics, status).',
                        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
                        execute: async () => ([
                            { key: 'mexc', title: 'Crypto Trading Bot (MEXC)', stack: ['Python', 'MEXC API', 'Streamlit'], status: 'Paper tested', paperPnL: '+3.2% / 90d', livePnL: '-2.1% / 30d' },
                            { key: 'bloomberg', title: 'Bloomberg-Style Dashboard', stack: ['Next.js 14', 'Claude AI', 'Recharts'], status: 'Production' },
                            { key: 'ichimoku', title: 'IchimokuSignal Pro', stack: ['Pine Script v6', 'Python'], backtest: '+187% on AAOI 5y, 54% WR, PF 1.62, MaxDD 24%' },
                            { key: 'realestate', title: 'Real Estate Investment Model', stack: ['Python', 'INSEE data', 'Notion'], scope: 'SCI/IS vs LMNP, 34 French cities' },
                            { key: 'iabrew', title: 'IA Brew AI Newsletter', stack: ['n8n (93 nodes)', 'Claude API', 'Apify', 'Brevo'], frequency: 'Weekly, unattended' },
                            { key: 'jobs', title: 'Multi-source Job Scorer + ATS PDF Generator', stack: ['Python', 'Claude API', 'ReportLab'], scored: '240+ jobs' },
                            { key: 'salesforce', title: 'e-Enfance / 3018, Emma custom CRM', stack: ['Emma (custom CRM)', 'Full-stack TS', 'Realtime', 'Market CRM (prior)', 'Unified multichannel queue'], client: 'e-Enfance / 3018' },
                            { key: 'usbguard', title: 'Juice Jacking Guard. USB Threat Monitor (Windows)', stack: ['Python', 'Tkinter', 'WMI', 'Raw Input API', 'pnputil', 'PyInstaller', 'Inno Setup'], lines: '~4,900', subsystems: 11, packaging: 'single-file .exe installer', protects_against: ['BadUSB', 'Rubber Ducky', 'O.MG Cable', 'juice jacking', 'removable-media payloads'] }
                        ])
                    },
                    {
                        name: 'open_section',
                        description: 'Scroll the homepage to a named section.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                section: { type: 'string', enum: ['hero', 'services', 'approach', 'offer', 'projects', 'contact'] }
                            },
                            required: ['section'],
                            additionalProperties: false
                        },
                        execute: async ({ section }) => {
                            const el = document.getElementById(section);
                            if (!el) return { ok: false, error: 'section not found', section };
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            return { ok: true, section };
                        }
                    },
                    {
                        name: 'open_project',
                        description: 'Open the details modal for a specific project.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                project: { type: 'string', enum: ['mexc', 'bloomberg', 'ichimoku', 'realestate', 'iabrew', 'jobs', 'salesforce', 'usbguard'] }
                            },
                            required: ['project'],
                            additionalProperties: false
                        },
                        execute: async ({ project }) => {
                            const card = document.querySelector('[data-project="' + project + '"]');
                            if (!card) {
                                // Not on the current page (the home only shows 4 flagship cards):
                                // send the agent to the full portfolio where all 8 are detailed.
                                window.location.href = '/projets';
                                return { ok: true, project, navigating: '/projets', note: 'project detailed on the portfolio page' };
                            }
                            card.click();
                            return { ok: true, project };
                        }
                    },
                    {
                        name: 'switch_language',
                        description: 'Switch the site language between English (en) and French (fr). Navigates to the static language mirror (/ = FR, /en/ = EN).',
                        inputSchema: {
                            type: 'object',
                            properties: { lang: { type: 'string', enum: ['en', 'fr'] } },
                            required: ['lang'],
                            additionalProperties: false
                        },
                        execute: async ({ lang }) => {
                            const current = (document.documentElement.lang || 'fr').toLowerCase().indexOf('en') === 0 ? 'en' : 'fr';
                            if (current === lang) return { ok: true, language: lang, note: 'already on this language' };
                            window.location.href = lang === 'en' ? '/en/' : '/';
                            return { ok: true, language: lang, navigating: true };
                        }
                    },
                    {
                        name: 'list_journal_articles',
                        description: 'List all journal articles (FR + EN) with title, language, date, slug, HTML URL and Markdown URL. Optionally filter by language and limit count.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                lang: { type: 'string', enum: ['fr', 'en'], description: 'Filter by language. Omit for both.' },
                                limit: { type: 'integer', minimum: 1, maximum: 100, description: 'Max number of articles to return. Default 20.' }
                            },
                            additionalProperties: false
                        },
                        execute: async ({ lang, limit }) => {
                            try {
                                const res = await fetch('/feed.json', { headers: { Accept: 'application/json' } });
                                if (!res.ok) return { ok: false, error: 'feed.json not reachable', status: res.status };
                                const feed = await res.json();
                                let items = (feed.items || []).map(it => ({
                                    title: it.title,
                                    language: it.language,
                                    date: it.date_published,
                                    url: it.url,
                                    markdown_url: it.url + '.md',
                                    summary: it.summary
                                }));
                                if (lang) items = items.filter(it => it.language === lang);
                                items = items.slice(0, limit || 20);
                                return { ok: true, count: items.length, items };
                            } catch (e) {
                                return { ok: false, error: String(e) };
                            }
                        }
                    },
                    {
                        name: 'get_article_markdown',
                        description: 'Fetch a journal article in Markdown by slug or full URL.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                slug: { type: 'string', description: 'Article slug (e.g. "2026-04-30-bloomberg-askb-agent-ia-terminal").' },
                                url: { type: 'string', description: 'Full HTML URL of the article (alternative to slug).' },
                                lang: { type: 'string', enum: ['fr', 'en'], description: 'Required when using slug.' }
                            },
                            additionalProperties: false
                        },
                        execute: async ({ slug, url, lang }) => {
                            let target = url;
                            if (!target && slug) {
                                const base = lang === 'en' ? '/blog/en/' : '/blog/';
                                target = base + slug;
                            }
                            if (!target) return { ok: false, error: 'Provide either {slug, lang} or {url}.' };
                            const mdUrl = target.endsWith('.md') ? target : target + '.md';
                            try {
                                const res = await fetch(mdUrl, { headers: { Accept: 'text/markdown' } });
                                if (!res.ok) return { ok: false, error: 'article not found', status: res.status, url: mdUrl };
                                const text = await res.text();
                                return { ok: true, url: mdUrl, content_type: res.headers.get('Content-Type') || 'text/markdown', length: text.length, body: text };
                            } catch (e) {
                                return { ok: false, error: String(e) };
                            }
                        }
                    },
                    {
                        name: 'list_skills',
                        description: 'List the technical skills displayed on the site (CRM, AI/automation, Python/data, business literacy).',
                        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
                        execute: async () => ([
                            { area: 'AI & Automation', items: ['Claude API (daily reflex)', 'agentic workflows', 'AI scoring pipelines', 'prompt engineering', 'n8n (93+ nodes)', 'Make', 'Apps Script'] },
                            { area: 'Python & Data', items: ['pandas', 'numpy', 'scipy', 'scikit-learn', 'SQL', 'ETL', 'APIs', 'scraping', 'Power BI', 'Looker Studio'] },
                            { area: 'CRM & Platforms', items: ['Pipedrive', 'HubSpot', 'Brevo', 'Odoo'] },
                            { area: 'Business literacy', items: ['commercial pitching', 'business reading', 'multi-client account handling', 'sector watch', 'Bloomberg BMC certified'] }
                        ])
                    },
                    {
                        name: 'get_availability',
                        description: 'Check Mathieu\'s availability for freelance briefs and engagements.',
                        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
                        execute: async () => ({
                            current: 'Freelance, four active clients (Oct 2025 \u2192 present)',
                            mission_types: ['Custom web apps & SaaS', 'AI agents & RAG', 'n8n automations', 'Custom CRM', 'Data pipelines & dashboards'],
                            location: 'Paris, France (\u00cele-de-France)',
                            languages: ['French (native)', 'English (professional)'],
                            response_time: 'Usually within 24h, Mon\u2013Fri',
                            preferred_intake_channels: { brief: 'contact@mathieuhaye.fr', intro: 'https://www.linkedin.com/in/mathieu-haye/', call: '+33661513289' }
                        })
                    },
                    {
                        name: 'site_map',
                        description: 'Return a structured list of all addressable resources of the site (HTML, Markdown, JSON, RSS, agent metadata).',
                        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
                        execute: async () => ({
                            html: {
                                home: 'https://mathieuhaye.fr/',
                                journal_fr: 'https://mathieuhaye.fr/blog/',
                                journal_en: 'https://mathieuhaye.fr/blog/en/'
                            },
                            markdown: {
                                portfolio: 'https://mathieuhaye.fr/index.md',
                                journal_index: 'https://mathieuhaye.fr/blog.md',
                                article_pattern: 'https://mathieuhaye.fr/blog/{slug}.md or https://mathieuhaye.fr/blog/en/{slug}.md'
                            },
                            text: { llms_summary: 'https://mathieuhaye.fr/llms.txt' },
                            feeds: {
                                rss: 'https://mathieuhaye.fr/feed.xml',
                                json: 'https://mathieuhaye.fr/feed.json'
                            },
                            sitemap: 'https://mathieuhaye.fr/sitemap.xml',
                            downloads: {
                                'juice-jacking-guard': {
                                    platform: 'Windows 10 / 11',
                                    zip: { url: 'https://mathieuhaye.fr/downloads/JuiceJackingGuard-Setup.zip', sha256: 'e37364564f1eed9af699b85a40dae6e5fdbf9f25efba72f3002f6d0e0b41ffac', size_bytes: 23816756, recommended: true },
                                    exe: { url: 'https://mathieuhaye.fr/downloads/JuiceJackingGuard-Setup.exe', sha256: '1132af4c3a2158f17806a7720b0a46d4c477799bae78b6a81d3a315cfa30812a', size_bytes: 24377850 },
                                    sha256_sidecars: ['https://mathieuhaye.fr/downloads/JuiceJackingGuard-Setup.zip.sha256', 'https://mathieuhaye.fr/downloads/JuiceJackingGuard-Setup.exe.sha256']
                                }
                            },
                            agent_discovery: {
                                api_catalog: 'https://mathieuhaye.fr/.well-known/api-catalog',
                                agent_skills: 'https://mathieuhaye.fr/.well-known/agent-skills/index.json',
                                mcp_server_card: 'https://mathieuhaye.fr/.well-known/mcp/server-card.json',
                                oauth_protected_resource: 'https://mathieuhaye.fr/.well-known/oauth-protected-resource',
                                nlweb: 'https://mathieuhaye.fr/.well-known/nlweb.json',
                                security: 'https://mathieuhaye.fr/.well-known/security.txt'
                            },
                            negotiation: 'Send Accept: text/markdown to any HTML URL to receive the Markdown variant when available.'
                        })
                    }
                ]
            });
        } catch (e) {
            // Silent: WebMCP may not be fully supported yet.
        }
    }

    /* ========== I18N (FR / EN) ========== */
    const i18n = {
        // ===== v5.1 « Olive & Terracotta » — port exact du zip handoff =====
        'nav5.services':  { en: 'Services', fr: 'Services' },
        'nav5.approach':  { en: 'Approach', fr: 'Approche' },
        'nav5.projects':  { en: 'Projects', fr: 'Projets' },
        'nav5.contact':   { en: 'Contact', fr: 'Contact' },
        'hero5.title':    { en: 'Custom <em>software</em><br>that simplifies<br>your teams’ work.', fr: 'Les logiciels <em>sur mesure</em><br>qui simplifient<br>le travail de vos équipes.' },
        'hero.cta2':      { en: 'See the services', fr: 'Voir les services' },
        'col5.crmtitle':  { en: 'Custom CRM |<br>Sales pipeline', fr: 'CRM sur-mesure |<br>Pipeline commercial' },
        'col5.m1':        { en: '👤 Client<br><b>SME / Scale-up</b>', fr: '👤 Client<br><b>PME / Scale-up</b>' },
        'col5.m2':        { en: '⏱ Delivery<br><b>4–6 weeks</b>', fr: '⏱ Livraison<br><b>4–6 semaines</b>' },
        'col5.m3':        { en: '⚙ Stack<br><b>Next.js + Supabase</b>', fr: '⚙ Stack<br><b>Next.js + Supabase</b>' },
        'col5.l1':        { en: 'One unified multichannel queue', fr: 'File unique multicanale' },
        'col5.s1':        { en: '• Chat, email, WhatsApp, phone — one single screen', fr: '• Tchat, e-mail, WhatsApp, téléphone — un seul écran' },
        'col5.l2':        { en: 'AI scoring & prioritisation', fr: 'Scoring & priorisation IA' },
        'col5.s2':        { en: '• Automatic detection of priority signals<br>• Deal created and assigned in the pipeline', fr: '• Détection automatique des signaux prioritaires<br>• Deal créé et assigné dans le pipeline' },
        'col5.t1':        { en: '[09:12] 93 nodes loaded · webhook active', fr: '[09:12] 93 nœuds chargés · webhook actif' },
        'col5.t2':        { en: '[09:12] Claude API → lead score: 87/100', fr: '[09:12] Claude API → score lead : 87/100' },
        'col5.t3':        { en: '[09:13] CRM updated → deal created · Slack notified', fr: '[09:13] CRM mis à jour → deal créé · Slack notifié' },
        'col5.t4':        { en: '✓ 214 tasks automated this week', fr: '✓ 214 tâches automatisées cette semaine' },
        'col5.typing':    { en: 'AI agent typing a reply…', fr: 'Agent IA en train de répondre…' },
        'col5.agent':     { en: 'AI agent · 24/7 support', fr: 'Agent IA · Support 24h/24' },
        'col5.integ':     { en: 'Integration · 🔌 CRM + Slack', fr: 'Intégration · 🔌 CRM + Slack' },
        'col5.tickets':   { en: '65% of tickets handled solo', fr: '65% des tickets traités seuls' },
        'col5.resp':      { en: 'Reply in progress…', fr: 'Réponse en cours…' },
        'band.title':     { en: 'The software that <u>saves time</u><br>for your whole company.', fr: 'Le logiciel qui <u>fait gagner du temps</u><br>à toute votre entreprise.' },
        'band.l1':        { en: 'Save hours every week', fr: 'Gagnez des heures chaque semaine' },
        'band.l2':        { en: 'Kill the repetitive tasks', fr: 'Supprimez les tâches répétitives' },
        'band.l3':        { en: 'Plugged into your existing stack', fr: 'Connecté à votre stack existante' },
        'svc5.eyebrow':   { en: 'Our services', fr: 'Nos services' },
        'svc5.title':     { en: 'Deploy<br>the right tools<br>at the right time.', fr: 'Déployez<br>les bons outils<br>au bon moment.' },
        'svc5.note':      { en: 'Chat with my AI <b style="display:inline-block;font-weight:400">↴</b>', fr: 'Discutez avec mon IA <b style="display:inline-block;font-weight:400">↴</b>' },
        'typed.q1':       { en: 'What should we set up to answer our clients 24/7?', fr: 'Que mettre en place pour répondre à vos clients 24h/24 ?' },
        'bento5.t1':      { en: 'AI agents', fr: 'Agents IA' },
        'bento5.d1':      { en: 'Smart assistants that answer your clients, qualify your leads and execute tasks 24/7. Connected to your tools, in production within weeks.', fr: 'Des assistants intelligents qui répondent à vos clients, qualifient vos leads et exécutent des tâches 24h/24. Connectés à vos outils, en production en quelques semaines.' },
        'bento5.t2':      { en: 'n8n automations', fr: 'Automatisations n8n' },
        'bento5.d2':      { en: 'The repetitive tasks disappear. Your teams don’t. Your tools finally talk to each other.', fr: 'Les tâches répétitives disparaissent. Pas vos équipes. Vos outils se parlent enfin, sans copier-coller.' },
        'bento5.t3':      { en: 'Custom CRM', fr: 'CRM sur-mesure' },
        'bento5.d3':      { en: 'Your team deserves a CRM it actually opens. Built around your sales process, not the other way around.', fr: 'Votre équipe mérite un CRM qu’elle ouvre vraiment. Construit autour de votre process de vente, pas l’inverse.' },
        'bento5.t4':      { en: 'Web apps & MVPs', fr: 'Apps web & MVP' },
        'bento5.d4':      { en: 'When no software on the market fits your business, we build yours. In production within 4 to 6 weeks.', fr: 'Quand aucun logiciel du marché ne correspond à votre métier, on construit le vôtre. En production en 4 à 6 semaines.' },
        'bento5.t5':      { en: 'Websites', fr: 'Sites web' },
        'bento5.d5':      { en: 'A website that brings in clients and that AI engines can actually cite. Live within weeks.', fr: 'Un site qui ramène des clients et que les IA savent citer. En ligne en quelques semaines.' },
        'bento5.t6':      { en: 'Not sure what you should set up?', fr: 'Vous n’êtes pas sûr de ce qu’il faut mettre en place ?' },
        'bento5.d6':      { en: '30 minutes, free, no strings attached. And if a simple solution is enough, I will tell you so.', fr: '30 minutes, gratuit, sans engagement. Et si une solution simple suffit, je vous le dis.' },
        'bento.more':     { en: 'Learn more →', fr: 'En savoir plus →' },
        'bento.cta.more': { en: '> Book your free call', fr: '> Réserver votre appel gratuit' },
        'voie5.title':    { en: 'The <em>third way</em> between<br>the agency and no-code.', fr: 'La <em>3e voie</em> entre<br>l’agence et le no-code.' },
        'voie5.label':    { en: 'Contents', fr: 'Sommaire' },
        'voie5.hint':     { en: 'Scroll to compare ↓', fr: 'Scrollez pour comparer ↓' },
        'voie5.t1':       { en: 'No-code alone', fr: 'No-code seul' },
        'voie5.t2':       { en: 'Agency', fr: 'Agence' },
        'voie5.t3':       { en: 'The solution: Mathieu Haye', fr: 'La solution : Mathieu Haye' },
        'voie5.k1':       { en: 'MVP timeline', fr: 'Délai MVP' },
        'voie5.k2':       { en: 'Typical cost', fr: 'Coût typique' },
        'voie5.k3':       { en: 'Technical ceiling', fr: 'Plafond technique' },
        'voie5.k4':       { en: 'Point of contact', fr: 'Interlocuteur' },
        'voie5.k5':       { en: 'When something breaks', fr: 'En cas de problème' },
        'voie5.k6':       { en: 'Iterations', fr: 'Évolutions' },
        'voie5.p1.k':     { en: 'Option 1 — DIY', fr: 'Option 1 — DIY' },
        'voie5.p1.t':     { en: 'No-code alone: fast, but quickly capped', fr: 'No-code seul : rapide, mais vite limité' },
        'voie5.p1.d':     { en: 'Perfect to get started, but as soon as your process leaves the template you stack subscriptions and duct tape. And nobody is accountable when it breaks.', fr: 'Parfait pour démarrer, mais dès que votre process sort du cadre, vous empilez les abonnements et les rustines. Et personne n’est responsable quand ça casse.' },
        'voie5.p1.s1':    { en: '4–12 weeks', fr: '4–12 semaines' },
        'voie5.p1.s2':    { en: '0–5 k€', fr: '0–5 k€' },
        'voie5.p1.s3':    { en: 'Capped', fr: 'Limité' },
        'voie5.p1.s4':    { en: 'Yourself', fr: 'Vous-même' },
        'voie5.p1.s5':    { en: 'You are on your own', fr: 'Vous êtes seul' },
        'voie5.p1.s6':    { en: 'Quick ceiling', fr: 'Plafond rapide' },
        'voie5.p2.k':     { en: 'Option 2 — Heavy machinery', fr: 'Option 2 — Artillerie lourde' },
        'voie5.p2.t':     { en: 'The agency: solid, but heavy and expensive', fr: 'L’agence : solide, mais lourde et chère' },
        'voie5.p2.d':     { en: 'Full teams, endless specs, back-and-forth through a project manager. The budget explodes before the first useful line of code.', fr: 'Des équipes complètes, des specs interminables, des allers-retours par chef de projet interposé. Le budget explose avant la première ligne de code utile.' },
        'voie5.p2.s1':    { en: '4–6 months', fr: '4–6 mois' },
        'voie5.p2.s2':    { en: '50–150 k€', fr: '50–150 k€' },
        'voie5.p2.s3':    { en: 'Unlimited', fr: 'Infini' },
        'voie5.p2.s4':    { en: '4+ people', fr: '4+ personnes' },
        'voie5.p2.s5':    { en: 'Support ticket', fr: 'Ticket support' },
        'voie5.p2.s6':    { en: 'New quote', fr: 'Nouveau devis' },
        'voie5.p3.k':     { en: 'The third way', fr: 'La 3e voie' },
        'voie5.p3.t':     { en: 'One partner, from scoping to production', fr: 'Un partenaire unique, du cadrage à la prod' },
        'voie5.p3.d':     { en: 'A consultant who understands your business, recommends the simplest solution that fits, and custom-builds only what deserves it. Delivered in weeks, maintained continuously.', fr: 'Un consultant qui comprend votre métier, recommande la solution la plus simple qui répond au besoin, et ne développe sur mesure que ce qui le justifie. Livré en semaines, maintenu en continu.' },
        'voie5.p3.s1':    { en: '1–6 weeks', fr: '1–6 semaines' },
        'voie5.p3.s2':    { en: '1–12 k€', fr: '1–12 k€' },
        'voie5.p3.s3':    { en: 'Custom', fr: 'Sur-mesure' },
        'voie5.p3.s5':    { en: 'Direct support', fr: 'Support direct' },
        'voie5.p3.s6':    { en: 'Continuous', fr: 'En continu' },
        'ways5.title':    { en: 'Three ways<br>to work together.', fr: 'Trois façons<br>de travailler ensemble.' },
        'ways5.lead':     { en: 'From a one-week sprint to a full build. The budget depends on your project — we scope it together in 30 minutes.', fr: 'Du sprint d’une semaine au build complet. Le budget dépend de votre projet, on le cadre ensemble en 30 min.' },
        'ways5.c1.t':     { en: '<em>Express</em> sprint', fr: 'Sprint <em>express</em>' },
        'ways5.c1.tier':  { en: '1 week', fr: '1 semaine' },
        'ways5.c1.d':     { en: 'One focused automation or agent, shipped and plugged in within 5 days.', fr: 'Une automatisation ou un agent ciblé, livré et branché en 5 jours.' },
        'ways5.c1.f':     { en: 'Ideal to test →', fr: 'Idéal pour tester →' },
        'ways5.c2.t':     { en: 'Full <em>build</em>', fr: 'Build <em>complet</em>' },
        'ways5.c2.tier':  { en: '4–8 weeks', fr: '4–8 semaines' },
        'ways5.c2.d':     { en: 'A CRM, internal app or custom platform, from scoping to production.', fr: 'CRM, app interne ou plateforme sur-mesure, du cadrage à la mise en prod.' },
        'ways5.flag':     { en: 'Most requested', fr: 'Le plus demandé' },
        'ways5.c2.f':     { en: 'From idea to production →', fr: 'De l’idée à la prod →' },
        'ways5.c3.t':     { en: '<em>Ongoing</em> support', fr: 'Accompagnement <em>continu</em>' },
        'ways5.c3.tier':  { en: 'Monthly', fr: 'Au mois' },
        'ways5.c3.d':     { en: 'Improvements, maintenance and new workflows as your needs evolve.', fr: 'Évolutions, maintenance et nouveaux workflows au fil de vos besoins.' },
        'ways5.c3.f':     { en: 'Limited spots →', fr: 'Places limitées →' },
        'logos5.label':   { en: 'They already trust me:', fr: 'Ils me font déjà confiance :' },
        'proj5.title':    { en: 'Pipelines, agents,<br><span class="proj-hl"><span class="star">*</span>systems that ship.</span>', fr: 'Pipelines, agents,<br><span class="proj-hl"><span class="star">*</span>des systèmes qui livrent.</span>' },
        'proj5.lead':     { en: 'Four flagship projects. Click a card for details, or browse <a href="/en/projects">the full list</a>.', fr: 'Quatre projets phares. Cliquez sur une carte pour le détail, ou parcourez <a href="/projets">la liste complète</a>.' },
        'proj5.sel':      { en: '★ Selected', fr: '★ Sélection' },
        'proj5.all':      { en: 'See more projects', fr: 'Voir plus de projets' },
        'proj5.read':     { en: 'Read', fr: 'Lire' },
        'proj5.salesforce.t': { en: 'e-Enfance / 3018, Emma custom CRM', fr: 'e-Enfance / 3018, Emma CRM sur-mesure' },
        'proj5.salesforce.d': { en: 'Before, the 3018 counsellors juggled several tools. Today, one single workstation that prioritises urgent cases.', fr: 'Avant, les écoutants du 3018 jonglaient entre plusieurs outils. Aujourd’hui, un poste de travail unique qui priorise les situations urgentes.' },
        'proj5.iabrew.t': { en: 'IA Brew, AI newsletter', fr: 'IA Brew, newsletter IA' },
        'proj5.iabrew.d': { en: 'Fully automated weekly newsletter: 20+ sources, Claude scoring, Brevo delivery. Runs alone, zero humans.', fr: 'Newsletter hebdo 100% automatisée : 20+ sources, scoring Claude, envoi Brevo. Tourne seule, zéro humain.' },
        'proj5.jobs.t':   { en: 'Job scorer + ATS CV/cover-letter generator', fr: 'Scorer d’offres + générateur CV/LM ATS' },
        'proj5.jobs.d':   { en: 'Aggregates offers via API, scores them against my profile and generates an ATS CV + cover letter PDF for every good match.', fr: 'Agrège les offres via API, les score sur mon profil et génère CV + lettre ATS en PDF pour chaque bon match.' },
        'proj5.usbguard.t': { en: 'Juice Jacking Guard, USB monitoring', fr: 'Juice Jacking Guard, surveillance USB' },
        'proj5.usbguard.d': { en: 'Windows app that intercepts USB devices before the OS: BadUSB, O.MG, juice jacking blocked.', fr: 'App Windows qui intercepte les périphériques USB avant l’OS : BadUSB, O.MG, juice jacking bloqués.' },
        'proj5.chip.scoring': { en: 'Weighted scoring', fr: 'Scoring pondéré' },
        'proj5.chip.ats': { en: 'ATS CV as PDF', fr: 'CV ATS en PDF' },
        'quote5.title':   { en: 'I build the software your company<br>wishes it had found on the market.', fr: 'Je construis les logiciels que votre entreprise<br>aurait aimé trouver sur le marché.' },
        'chat.mail':      { en: 'Write an email', fr: 'Écrire un e-mail' },
        'chat.note':      { en: 'Free · No signup · Instant reply', fr: 'Gratuit · Sans inscription · Réponse immédiate' },
        'footer5.line':   { en: '© 2026 Mathieu Haye · AI & automation consultant', fr: '© 2026 Mathieu Haye · Consultant IA & automatisation' },
        // Nav + menu
        'nav.menu':              { en: 'Menu',                                 fr: 'Menu' },
        'nav.close':             { en: 'Close',                                fr: 'Fermer' },
        // Menu overlay: services navigation
        'menu.col.services':     { en: 'Services',                             fr: 'Services' },
        'menu.svc.crm':          { en: 'Custom CRM',              fr: 'CRM sur-mesure' },
        'menu.svc.agent':        { en: 'AI agent developer',                   fr: 'D\u00e9veloppeur d\u2019agents IA' },
        'menu.svc.n8n':          { en: 'n8n automation',                       fr: 'Automatisation n8n' },
        'menu.svc.app':          { en: 'Custom app & MVP',                     fr: 'Application & MVP sur-mesure' },
        'menu.svc.pme':          { en: 'AI agent for SMEs',                    fr: 'Agent IA pour PME' },
        'menu.svc.all':          { en: 'All services \u2192',                  fr: 'Toutes les prestations \u2192' },
        'menu.col.explore':      { en: 'Explore',                              fr: 'Explorer' },
        'menu.exp.offer':        { en: 'Offers & approach',                    fr: 'Offres & approche' },
        'menu.exp.projects':     { en: 'Projects',                             fr: 'Projets' },
        'menu.exp.about':        { en: 'About',                                fr: '\u00c0 propos' },
        'menu.exp.journal':      { en: 'Journal',                              fr: 'Journal' },
        'menu.exp.contact':      { en: 'Contact',                              fr: 'Contact' },
        'menu.col.project':      { en: 'Got a project?',                       fr: 'Un projet ?' },
        'menu.cta.text':         { en: 'Describe your need. In 30 minutes I\u2019ll tell you if and how I can ship it, and by when.', fr: 'D\u00e9crivez votre besoin. En 30 minutes, je vous dis si et comment je peux le livrer, et sous quel d\u00e9lai.' },
        'menu.tagline':          { en: 'Freelance CRM, AI & automation. Paris.', fr: 'Freelance CRM, IA & automatisation. Paris.' },
        'menu.exp.geo':          { en: 'AI visibility test',                   fr: 'Test visibilit\u00e9 IA' },
        'menu.exp.maturity':     { en: 'AI maturity test',                     fr: 'Test maturit\u00e9 IA' },
        // Launch overlay
        'launch.tag':            { en: 'DATA \u00b7 AI \u00b7 BUSINESS',       fr: 'DATA \u00b7 IA \u00b7 BUSINESS' },
        // Hero v4 (papier & vin)
        'hero4.title':           { en: 'The custom software your SaaS stack <em>doesn\u2019t cover</em>. Shipped in weeks.', fr: 'Le logiciel sur-mesure que votre stack SaaS <em>ne couvre pas</em>. Livr\u00e9 en semaines.' },
        'hero4.m1':              { en: '<strong>10+</strong> projects shipped', fr: '<strong>10+</strong> projets livr\u00e9s' },
        'hero4.m2':              { en: '<strong>4</strong> active clients',     fr: '<strong>4</strong> clients actifs' },
        'hero4.m3':              { en: 'MVP in <strong>4\u20136 weeks</strong>', fr: 'MVP en <strong>4\u20136 semaines</strong>' },
        'clients.label':         { en: 'They trust me',                        fr: 'Ils me font confiance' },
        'services.title4':       { en: 'What I <em>build</em> for you.',       fr: 'Ce que je <em>construis</em> pour vous.' },
        'svcfoot.note':          { en: 'Not sure which format fits? <em>30 minutes, free</em>, and you\u2019ll know.', fr: 'Pas s\u00fbr du format qu\u2019il vous faut ? <em>30 minutes, gratuit</em>, et vous saurez.' },
        'svcfoot.title':         { en: 'Not sure which format fits?',           fr: 'Pas s\u00fbr du format qu\u2019il vous faut ?' },
        'svcfoot.desc':          { en: '30 minutes, free, and you\u2019ll know whether and how I can ship it, and by when.', fr: '30 minutes, gratuit, et vous saurez si et comment je peux le livrer, et sous quel d\u00e9lai.' },
        'way.mine.sub':          { en: 'MVP delivery, one builder',             fr: 'D\u00e9lai MVP, un seul builder' },
        'approach.eyebrow':      { en: 'The approach',                         fr: 'L\u2019approche' },
        'way.nocode.tag':        { en: 'DIY',                                  fr: 'DIY' },
        'way.agency.tag':        { en: 'Heavy machinery',                      fr: 'Artillerie lourde' },
        'way.mine.name':         { en: 'Me, <em>one builder</em>',             fr: 'Moi, <em>un seul builder</em>' },
        'offer.sprint.hint':     { en: 'from \u20ac400',                       fr: 'd\u00e8s 400 \u20ac' },
        'offer.quote':           { en: 'priced on quote',                      fr: 'sur devis' },
        'lab.eyebrow':           { en: 'Test me',                              fr: 'Testez-moi' },
        'lab.note':              { en: 'Free \u00b7 No signup \u00b7 Instant results', fr: 'Gratuit \u00b7 Sans inscription \u00b7 R\u00e9sultat imm\u00e9diat' },
        'journal.note':          { en: 'New post every two days',              fr: 'Nouvel article tous les deux jours' },
        'stack.next':            { en: 'Next article',                         fr: 'Article suivant' },
        'stack.read':            { en: 'Read',                                 fr: 'Lire' },
        'about4.eyebrow':        { en: 'Behind the code',                      fr: 'Derri\u00e8re le code' },
        'contact.badge':         { en: 'Available now',                        fr: 'Disponible actuellement' },
        'contact.title4':        { en: 'A project?<br><span class="t-dim">Let\u2019s talk.</span>', fr: 'Un projet ?<br><span class="t-dim">Parlons-en.</span>' },
        'contact.alt':           { en: 'Prefer writing?',                      fr: 'Vous pr\u00e9f\u00e9rez \u00e9crire ?' },
        'footer.privacy':        { en: 'Privacy',                              fr: 'Confidentialit\u00e9' },
        // Hero (sales)
        'hero.l1':               { en: 'The custom software',                  fr: 'Le logiciel sur-mesure' },
        'hero.l2':               { en: 'your SaaS stack <em>doesn\u2019t cover</em>.', fr: 'que votre stack SaaS <em>ne couvre pas</em>.' },
        'hero.l3':               { en: 'Shipped in weeks, not months.',        fr: 'Livr\u00e9 en semaines, pas en mois.' },
        'hero.sub':              { en: 'CRM, automations, AI agents and business applications designed around your processes, not a SaaS vendor’s. One point of contact, from scoping to production.', fr: 'CRM, automatisations, agents IA et applications métier conçus autour de vos processus, pas de ceux d’un éditeur SaaS. Un seul interlocuteur, du cadrage à la mise en production.' },
        'hero.meta':             { en: 'Freelance Builder &middot; AI apps, automations &amp; custom CRM &middot; Paris.', fr: 'Freelance Builder &middot; Apps IA, automatisations &amp; CRM sur-mesure &middot; Paris.' },
        'hero.cta':              { en: 'See my projects',                      fr: 'Voir mes projets' },
        'hero.cta.blog':         { en: 'Read the journal',                     fr: 'Lire le journal' },
        'hero.cta.offers':       { en: 'See offers & pricing',                 fr: 'Voir les offres et tarifs' },
        // Hero trust card
        'hero.trust.eyebrow':    { en: 'Freelance builder, Paris',             fr: 'Freelance builder, Paris' },
        'hero.trust.shipped':    { en: 'Projects shipped',                     fr: 'Projets livrés' },
        'hero.trust.clients':    { en: 'Active clients',                       fr: 'Clients actifs' },
        'hero.trust.bilingual':  { en: 'Bilingual',                            fr: 'Bilingue' },
        'hero.trust.builtwith':  { en: 'Built with',                           fr: 'Construit avec' },
        'hero.badge':            { en: 'Freelance · Paris · FR / EN',          fr: 'Freelance · Paris · FR / EN' },
        'hero.card.scope':       { en: 'End-to-end',                           fr: 'De bout en bout' },
        'hero.card.scopeval':    { en: 'Spec → production',                    fr: 'Cadrage → production' },
        'hero.card.scopenote':   { en: 'One builder across the whole chain, no handoffs.', fr: 'Un seul builder sur toute la chaîne, sans intermédiaire.' },
        'hero.card.based':       { en: 'Based in',                             fr: 'Basé à' },
        'hero.tag.available':    { en: 'Available',                            fr: 'Disponible' },
        'hero.tag.bespoke':      { en: 'Bespoke',                              fr: 'Sur-mesure' },
        // Reassurance strip
        'reassure.code':         { en: 'You own the code',                     fr: 'Vous possédez le code' },
        'reassure.nda':          { en: 'NDA on request',                       fr: 'NDA possible' },
        'reassure.support':      { en: '2 weeks support included',             fr: '2 semaines de support inclus' },
        'reassure.call':         { en: 'Free scoping call',                    fr: 'Appel de cadrage gratuit' },
        // Booking CTA
        'cta.book':              { en: 'Book a call',                          fr: 'Réserver un appel' },
        'cta.services':          { en: 'See services',                         fr: 'Voir les services' },
        // Services section
        'services.eyebrow':      { en: 'Services',                             fr: 'Services' },
        'services.title':        { en: 'What I <span class="hero-accent">build</span> for you.', fr: 'Ce que je <span class="hero-accent">construis</span> pour vous.' },
        'services.subtitle':     { en: 'AI agents and automations that save your teams time, shipped in weeks.', fr: 'Des agents IA et des automatisations qui font gagner du temps à vos équipes, livrés en semaines.' },
        'services.cta':          { en: 'Learn more',                           fr: 'En savoir plus' },
        'services.agent.eyebrow':{ en: 'AI agent',                             fr: 'Agent IA' },
        'services.agent.title':  { en: 'AI agent developer',                   fr: 'Développeur d’agents IA' },
        'services.agent.desc':   { en: 'An agent that answers your customers, qualifies leads or handles tickets around the clock. Connected to your tools, in production within weeks.', fr: 'Un agent qui répond à vos clients, qualifie vos leads ou traite vos tickets 24h/24. Connecté à vos outils, en production en quelques semaines.' },
        'services.n8n.eyebrow':  { en: 'Automation',                           fr: 'Automatisation' },
        'services.n8n.title':    { en: 'n8n automation',                       fr: 'Automatisation n8n' },
        'services.n8n.desc':     { en: 'I connect your tools and remove repetitive manual tasks. Robust n8n workflows (up to 90+ nodes), tested and monitored.', fr: 'Je relie vos outils et supprime les tâches manuelles répétitives. Workflows n8n robustes (jusqu’à 90+ nœuds), testés et surveillés.' },
        'services.crm.eyebrow':  { en: 'Custom CRM',                           fr: 'CRM sur-mesure' },
        'services.crm.title':    { en: 'Custom CRM',              fr: 'CRM sur-mesure' },
        'services.crm.desc':     { en: 'A CRM that fits your team instead of forcing it into a template. A sovereign custom build, hosted where your data belongs.', fr: 'Un CRM qui colle à vos équipes au lieu de les forcer dans un template. Un build sur-mesure souverain, hébergé où vos données doivent l’être.' },
        'services.app.eyebrow':  { en: 'Web app',                              fr: 'App web' },
        'services.app.title':    { en: 'Custom web app & MVP',                 fr: 'Application & MVP sur-mesure' },
        'services.app.desc':     { en: 'Your product idea shipped as a production web app in 4 to 6 weeks: users, payments, AI if needed. You own the code.', fr: 'Votre idée livrée en app web de production en 4 à 6 semaines : utilisateurs, paiements, IA si besoin. Le code vous appartient.' },
        'services.pme.eyebrow':  { en: 'SMEs',                                 fr: 'PME' },
        'services.pme.title':    { en: 'AI agent for SMEs',                    fr: 'Agent IA pour PME' },
        'services.pme.desc':     { en: 'AI made concrete for a small business: one first profitable use case, scoped in 30 min, no jargon and no endless project.', fr: 'L’IA rendue concrète pour une PME : un premier cas d’usage rentable, cadré en 30 min, sans jargon ni projet à rallonge.' },
        'services.hub.eyebrow':  { en: 'AI freelance',                         fr: 'Freelance IA' },
        'services.hub.title':    { en: 'AI freelance',                         fr: 'Freelance IA' },
        'services.hub.desc':     { en: 'One single point of contact for your AI and automation projects, from scoping to production. Explore every service.', fr: 'Un seul interlocuteur pour vos projets IA et automatisation, du cadrage à la production. Découvrez toutes les prestations.' },
        // Offer teaser
        'offer.eyebrow':         { en: 'Offers',                               fr: 'Offres' },
        'offer.title':           { en: 'Three ways to <span class="hero-accent">work together</span>.', fr: 'Trois façons de <span class="hero-accent">travailler ensemble</span>.' },
        'offer.subtitle':        { en: 'From a one-week sprint to a full build. The budget depends on your project, we scope it together in 30 min.', fr: 'Du sprint d’une semaine au build complet. Le budget dépend de votre projet, on le cadre ensemble en 30 min.' },
        'offer.badge':           { en: 'Most requested',                       fr: 'Le plus demandé' },
        'offer.sprint.name':     { en: '1-week Sprint',                        fr: 'Sprint 1 semaine' },
        'offer.sprint.tag':      { en: 'Small scope',                          fr: 'Petit périmètre' },
        'offer.sprint.desc':     { en: 'One n8n workflow, one AI agent, one CRM integration. Scoped, shipped, deployed in 5 days.', fr: 'Un workflow n8n, un agent IA, une intégration CRM. Cadré, livré, déployé en 5 jours.' },
        'offer.mvp.name':        { en: 'MVP 4 to 6 weeks',                     fr: 'MVP 4 à 6 semaines' },
        'offer.mvp.tag':         { en: 'Full product',                         fr: 'Produit complet' },
        'offer.mvp.desc':        { en: 'Full web app: users, payments, AI agent. Deployed to production.', fr: 'App web complète, base utilisateurs, paiement, agent IA. Déployée en production.' },
        'offer.retainer.name':   { en: 'Monthly retainer',                     fr: 'Retainer mensuel' },
        'offer.retainer.tag':    { en: 'Ongoing support',                      fr: 'Suivi continu' },
        'offer.retainer.desc':   { en: 'Ongoing presence on an existing product: features, maintenance, support.', fr: 'Présence régulière sur un produit existant : évolutions, maintenance, support.' },
        'offer.cta':             { en: 'See full offer details',               fr: 'Voir le détail des offres' },
        'offer.go':              { en: 'See details',                          fr: 'Voir le détail' },
        // Sticky CTA
        'sticky.cta':            { en: 'Discuss your project',                 fr: 'Discuter de votre projet' },
        'journal.eyebrow':       { en: 'Journal',                              fr: 'Journal' },
        'journal.title':         { en: '<em>Field</em> notes.',                fr: '<em>Notes</em> de terrain.' },
        'journal.lead':          { en: 'Daily watch on Business \u00d7 AI \u00d7 Data. What I read, what I test, what I ship. New post every two days.', fr: 'Veille quotidienne Business \u00d7 IA \u00d7 Data. Ce que je lis, ce que je teste, ce que je construis. Nouvel article tous les deux jours.' },
        'journal.cta':           { en: 'Read the journal',                     fr: 'Lire le journal' },
        'latest.eyebrow':        { en: 'Latest posts',                         fr: 'Articles récents' },
        'la1.cat': { en: 'Regulation', fr: 'Régulation' },
        'la1.date': { en: 'Jul 19, 2026', fr: '19 juillet 2026' },
        'la1.title': { en: 'EU forces Google to open Android to rival AI agents', fr: 'L\'UE force Google à ouvrir Android aux agents IA rivaux' },
        'la1.lead': { en: 'On July 16, 2026, the EU ordered Google to open 11 Android features to rival AI assistants, on par with Gemini. Why distribution is the real fight.', fr: 'Le 16 juillet 2026, l\'UE a ordonné à Google d\'ouvrir 11 fonctions d\'Android aux assistants IA rivaux, au même niveau que Gemini. Ce que ça change.' },
        'la2.cat': { en: 'Data & Analytics', fr: 'Data & Analytics' },
        'la2.date': { en: 'Jul 19, 2026', fr: '19 juillet 2026' },
        'la2.title': { en: 'SAP bets $1.16bn on tabular AI, not another LLM', fr: 'SAP boucle Prior Labs : le pari de l\'IA tabulaire' },
        'la2.lead': { en: 'On July 17, 2026, SAP closed its Prior Labs acquisition and is investing over €1 billion in tabular AI, built to predict on structured business data.', fr: 'Le 17 juillet 2026, SAP a bouclé le rachat de Prior Labs et investit plus d\'un milliard d\'euros dans l\'IA tabulaire, taillée pour les données métier structurées.' },
        'la3.cat': { en: 'Data & Analytics', fr: 'Data & Analytics' },
        'la3.date': { en: 'Jul 15, 2026', fr: '15 juillet 2026' },
        'la3.title': { en: 'Enterprise AI agents: the data isn\'t ready', fr: 'Agents IA en entreprise : la donnée n\'est pas prête' },
        'la3.lead': { en: 'On July 14, 2026, Xebia launched Axis, an agentic data foundation. The real bottleneck for enterprise AI agents isn\'t the model; it\'s data that isn\'t AI-ready.', fr: 'Le 14 juillet 2026, Xebia lance Axis, une fondation data agentique. Le vrai frein des agents IA en entreprise n\'est pas le modèle, c\'est la donnée.' },
        'hero.scroll':           { en: 'SCROLL',                               fr: 'SCROLL' },
        // Intro / About
        'intro.pitch':           { en: 'I build with AI as a daily reflex: agentic workflows, scoring pipelines, automations that move business KPIs. Freelance consultant since 2025, four active clients, French and English.', fr: 'Je construis avec l\u2019IA en r\u00e9flexe quotidien : workflows agentiques, pipelines de scoring, automations qui bougent les KPI business. Consultant freelance depuis 2025, quatre clients actifs, fran\u00e7ais et anglais.' },
        'intro.stat1':           { en: 'Projects shipped',                    fr: 'Projets livr\u00e9s' },
        'intro.stat2':           { en: 'n8n nodes (max)',                     fr: 'N\u0153uds n8n (max)' },
        'intro.stat3':           { en: 'Active clients',                      fr: 'Clients actifs' },
        'portrait.badge':        { en: 'Freelance. Paris. 2026.',             fr: 'Freelance. Paris. 2026.' },
        // About section
        'about.eyebrow':         { en: '01. Profile',                         fr: '01. Profil' },
        'about.title':           { en: 'A <span class="hero-accent">builder</span> who ships with AI.', fr: 'Un <span class="hero-accent">builder</span> qui livre avec l\u2019IA.' },
        'about.lead1':           { en: 'I am <strong>Mathieu Haye</strong>, based in the Paris region. Freelance consultant in CRM, data engineering and applied AI since October 2025. Now building full-time for my clients.', fr: 'Je suis <strong>Mathieu Haye</strong>, r\u00e9gion parisienne. Consultant freelance en CRM, data engineering et IA appliqu\u00e9e depuis octobre 2025. Aujourd\u2019hui je construis \u00e0 plein temps pour mes clients.' },
        'about.lead2':           { en: 'I build with AI as a daily reflex: agentic workflows, LLM scoring pipelines, AI-powered automations, decision dashboards, CRM and sales orchestration. Multi-client freelance practice, four active engagements, hands-on with Claude API, n8n (93+ nodes), Brevo, HubSpot, Pipedrive. I ship tools that move business KPIs, not slides.', fr: 'Je construis avec l\u2019IA en r\u00e9flexe quotidien : workflows agentiques, pipelines de scoring LLM, automations IA, dashboards de d\u00e9cision, orchestration CRM et commerciale. Pratique freelance multi-clients, quatre missions actives, \u00e0 l\u2019aise sur API Claude, n8n (93+ n\u0153uds), Brevo, HubSpot, Pipedrive. Je livre des outils qui bougent des KPI business, pas des slides.' },
        'skill1.title':          { en: 'Business literacy',                  fr: 'Lecture business' },
        'skill1.desc':           { en: 'Commercial pitching, business reading, multi-client account handling, sector watch. Bloomberg BMC certified, side curiosity: ETF and crypto investing.', fr: 'Pitch commercial, lecture business, gestion de comptes multi-clients, veille sectorielle. Bloomberg BMC certifi\u00e9, curiosit\u00e9 perso : investissement ETF et crypto.' },
        'skill2.title':          { en: 'Python &amp; Data',                   fr: 'Python &amp; Data' },
        'skill2.desc':           { en: 'pandas, numpy, scipy, scikit-learn, SQL, ETL, APIs, scraping. Power BI, Looker Studio.', fr: 'pandas, numpy, scipy, scikit-learn, SQL, ETL, APIs, scraping. Power BI, Looker Studio.' },
        'skill3.title':          { en: 'AI &amp; Automation',                 fr: 'IA &amp; Automatisation' },
        'skill3.desc':           { en: 'Claude API as a daily reflex, agentic workflows, AI scoring pipelines, prompt engineering, n8n (93+ node workflows), Make, Apps Script.', fr: 'API Claude en r\u00e9flexe quotidien, workflows agentiques, pipelines de scoring IA, prompt engineering, n8n (93+ n\u0153uds), Make, Apps Script.' },
        'skill4.title':          { en: 'CRM &amp; Platforms',                 fr: 'CRM &amp; Plateformes' },
        'skill4.desc':           { en: 'Pipedrive, HubSpot, Brevo, Odoo.', fr: 'Pipedrive, HubSpot, Brevo, Odoo.' },
        // Projects section
        'projects.eyebrow':      { en: '02. Projects',                        fr: '02. Projets' },
        'projects.title':        { en: 'Pipelines, agents, <span class="hero-accent">things that ship</span>.', fr: 'Pipelines, agents, <span class="hero-accent">des trucs qui livrent</span>.' },
        'projects.subtitle':     { en: 'Four flagship builds. Click a card for the full story, or browse the complete list.', fr: 'Quatre projets phares. Cliquez sur une carte pour le détail, ou parcourez la liste complète.' },
        'projects.all':          { en: 'See all projects',                    fr: 'Voir tous les projets' },
        'filter.all':            { en: 'All',                                 fr: 'Tous' },
        'filter.finance':        { en: 'Finance',                             fr: 'Finance' },
        'filter.ia':             { en: 'AI &amp; Automation',                 fr: 'IA &amp; Auto' },
        'filter.data':           { en: 'Data Pipelines',                      fr: 'Pipelines data' },
        'filter.security':       { en: 'Security',                            fr: 'Sécurité' },
        'tag.featured':          { en: '\u2605 Featured',                     fr: '\u2605 S\u00e9lection' },
        'tag.paper':             { en: '\u2605 Paper tested',                 fr: '\u2605 Test\u00e9 en paper' },
        'proj.open':             { en: 'Open details',                        fr: 'Voir les d\u00e9tails' },
        // Project cards
        'p.mexc.title':          { en: 'Crypto Trading Bot',                  fr: 'Bot de trading crypto' },
        'p.mexc.desc':           { en: 'Mean reversion on BTC and ETH with RSI + Bollinger entries. Paper ran +3.2% over 90 days. Live pilot ended at <strong>-2.1%</strong>: taker fees plus slippage ate the edge. Next iteration on maker-rebate orders.', fr: 'Mean reversion sur BTC et ETH, signaux RSI + Bandes de Bollinger. Paper +3,2% sur 90 jours. Pilote live : <strong>-2,1%</strong>. Les frais taker + le slippage ont mang\u00e9 l\u2019edge. Prochaine it\u00e9ration en ordres limite maker-rebate.' },
        'p.bloomberg.title':     { en: 'Bloomberg-Style Dashboard',           fr: 'Dashboard Bloomberg-like' },
        'p.bloomberg.desc':      { en: 'Personal multi-asset tracker (crypto, stocks, ETF) with technical indicators, AI-generated commentary on market open/close, DCA tracker and Telegram alerts.', fr: 'Tracker personnel multi-actifs (crypto, actions, ETF) avec indicateurs techniques, commentaires IA \u00e0 l\u2019ouverture/cl\u00f4ture, DCA tracker et alertes Telegram.' },
        'p.ichimoku.title':      { en: 'IchimokuSignal (Backtested)',         fr: 'IchimokuSignal (backtest\u00e9)' },
        'p.ichimoku.desc':       { en: 'TradingView indicator for long-term stock picking: bounce detection, trailing 15% stop loss, higher timeframe candles. Backtest on AAOI (5y): +187%, 54% WR, PF 1.62, MaxDD 24%. Trades return for drawdown protection, not alpha.', fr: 'Indicateur TradingView pour stock picking long terme : d\u00e9tection de rebond, stop suiveur 15%, bougies HTF. Backtest AAOI (5 ans) : +187%, WR 54%, PF 1,62, MaxDD 24%. Protection du drawdown plut\u00f4t que sur-performance.' },
        'p.realestate.title':    { en: 'Real Estate Investment Model',        fr: 'Mod\u00e8le d\u2019investissement immobilier' },
        'p.realestate.desc':     { en: 'Tooling to compare SCI / IS vs LMNP regimes, model mortgage scenarios, and rank French cities on a rental yield index. Used to size my own portfolio.', fr: 'Outil pour comparer SCI/IS vs LMNP, mod\u00e9liser les sc\u00e9narios d\u2019emprunt et classer les villes fran\u00e7aises sur un indice de rendement locatif. Utilis\u00e9 pour dimensionner mon propre patrimoine.' },
        'p.iabrew.title':        { en: 'IA Brew, AI Newsletter',              fr: 'IA Brew, newsletter IA' },
        'p.iabrew.desc':         { en: 'Fully automated weekly newsletter: ingest from 20+ sources, AI scoring &amp; summarisation, HTML rendering, delivery via Brevo. Runs on autopilot, no human in the loop.', fr: 'Newsletter hebdo enti\u00e8rement automatis\u00e9e : ingestion de 20+ sources, scoring &amp; r\u00e9sum\u00e9 par IA, rendu HTML, envoi via Brevo. Tourne seule, sans humain dans la boucle.' },
        'p.jobs.title':          { en: 'Multi-source Job Scorer + ATS PDF Generator', fr: 'Scorer d\u2019offres + g\u00e9n\u00e9rateur CV/LM ATS en PDF' },
        'p.jobs.desc':           { en: 'Aggregates WTTJ, JobTeaser and LinkedIn via APIs, applies a weighted scoring algorithm against my profile. For each high-scoring offer, auto-generates an <strong>ATS-optimised CV and cover letter in PDF</strong>, tailored to the job description.', fr: 'Agr\u00e8ge WTTJ, JobTeaser et LinkedIn via API, applique un scoring pond\u00e9r\u00e9 sur mon profil. Pour chaque offre au score \u00e9lev\u00e9, g\u00e9n\u00e8re automatiquement un <strong>CV et une lettre de motivation ATS en PDF</strong>, adapt\u00e9s au poste.' },
        'p.salesforce.title':    { en: 'e-Enfance / 3018, Emma custom CRM',        fr: 'e-Enfance / 3018, Emma CRM sur-mesure' },
        'p.salesforce.desc':     { en: 'Worked on their existing market CRM first, then designed and shipped Emma, a custom CRM that replaced it: the 3018 listeners\u2019 workstation, with a single queue merging every channel (chat, phone, email, WhatsApp, Messenger), automatic distress-signal detection with suicide-risk prioritization, an exportable case file, real-time supervision and reporting. Sovereign build, hosted in France, on sensitive data.', fr: 'D\u2019abord intervenu sur leur CRM du march\u00e9, puis conception et livraison d\u2019Emma, un CRM sur-mesure qui l\u2019a remplac\u00e9 : le poste de travail des \u00e9coutants du 3018, avec une file unique qui r\u00e9unit tous les canaux (tchat, t\u00e9l\u00e9phone, e-mail, WhatsApp, Messenger), la d\u00e9tection automatique des signaux de d\u00e9tresse avec priorisation du risque suicidaire, un dossier structur\u00e9 et exportable, la supervision en temps r\u00e9el et le reporting. Build souverain, h\u00e9berg\u00e9 en France, sur donn\u00e9es sensibles.' },
        'p.usbguard.title':      { en: 'Juice Jacking Guard. USB Threat Monitor (Windows)', fr: 'Juice Jacking Guard. Surveillance USB (Windows)' },
        'p.usbguard.desc':       { en: 'Windows desktop app that intercepts USB devices <strong>before</strong> they can talk to the OS. Blocks BadUSB, Rubber Ducky, O.MG cables, juice-jacking and removable-media payloads via Raw Input keyboard challenges, composite-device detection, on-insert read-only scan and optional VirusTotal lookup. Python + Tkinter, ~4,900 lines, single-file installer.', fr: 'Application desktop Windows qui intercepte les p\u00e9riph\u00e9riques USB <strong>avant</strong> qu\u2019ils ne parlent \u00e0 l\u2019OS. Bloque BadUSB, Rubber Ducky, c\u00e2bles O.MG, juice jacking et payloads sur cl\u00e9 via un challenge clavier Raw Input, la d\u00e9tection des devices composites, un scan read-only \u00e0 l\u2019insertion et un lookup VirusTotal optionnel. Python + Tkinter, ~4 900 lignes, installeur single-file.' },
        // Timeline / Journey
        'journey.eyebrow':       { en: '03. Background',                     fr: '03. Parcours' },
        'journey.title':         { en: 'Economics, code, <span class="hero-accent">AI</span>.', fr: '\u00c9conomie, code, <span class="hero-accent">IA</span>.' },
        // Timeline items (roles + orgs + bodies)
        't.bmc.date':            { en: '2026',                                fr: '2026' },
        't.bmc.role':            { en: 'Bloomberg Market Concepts (BMC)',    fr: 'Bloomberg Market Concepts (BMC)' },
        't.bmc.org':             { en: 'Certification',                       fr: 'Certification' },
        't.bmc.body':            { en: 'Certified. Covers economic indicators, currencies, fixed income, interest rate risk and equities. The shared language for any business-and-markets conversation.', fr: 'Certifi\u00e9. Indicateurs \u00e9conomiques, devises, produits de taux, risque de taux et actions. Le vocabulaire partag\u00e9 pour toute discussion business-et-march\u00e9s.' },
        't.bmc.verify':          { en: 'Verify certificate \u2192',            fr: 'V\u00e9rifier le certificat \u2192' },
        't.free.date':           { en: 'Oct 2025 \u2192 present',              fr: 'Oct. 2025 \u2192 auj.' },
        't.free.role':           { en: 'Freelance Consultant. CRM, Data, Applied AI', fr: 'Consultant freelance. CRM, Data, IA appliqu\u00e9e' },
        't.free.org':            { en: 'Clients: e-Enfance / 3018, Fromagerie Ermitage, Horus Condition Report, Profile Club', fr: 'Clients : e-Enfance / 3018, Fromagerie Ermitage, Horus Condition Report, Profile Club' },
        't.free.m1':             { en: '<strong>e-Enfance / 3018, custom CRM.</strong> Worked on their existing market CRM first; then designed and shipped an all-in-one custom CRM that fits the teams, replacing their market CRM. Full sovereign build, hosted in France.', fr: '<strong>e-Enfance / 3018, CRM sur-mesure.</strong> D\u2019abord intervenu sur leur CRM du march\u00e9 ; puis conception et livraison d\u2019un CRM tout-en-un sur-mesure qui colle aux \u00e9quipes, en remplacement de leur CRM du march\u00e9. Build souverain complet, h\u00e9berg\u00e9 en France.' },
        't.free.m2':             { en: '<strong>Data monitoring, Fromagerie Ermitage.</strong> 93-node n8n workflow for automated press and social media monitoring. 19-indicator keyword scoring, temporal filtering, weekly reports auto-generated.', fr: '<strong>Veille, Fromagerie Ermitage.</strong> Workflow n8n de 93 n\u0153uds pour la veille presse et r\u00e9seaux sociaux. Scoring mots-cl\u00e9s sur 19 indicateurs, filtrage temporel, rapports hebdo auto-g\u00e9n\u00e9r\u00e9s.' },
        't.free.m3':             { en: '<strong>CRM restructuring, Horus Condition Report.</strong> Pipedrive migration and bilingual (FR / EN) sales automations.', fr: '<strong>CRM, Horus Condition Report.</strong> Migration Pipedrive et automations commerciales bilingues (FR / EN).' },
        't.free.m4':             { en: '<strong>Data &amp; analytics, Profile Club.</strong> 146-record member database, cohort analysis, campaign segmentation, KPI dashboards on Google Apps Script.', fr: '<strong>Data &amp; analytics, Profile Club.</strong> Base de 146 membres, analyse de cohorte, segmentation des campagnes, dashboards KPI sur Google Apps Script.' },
        't.conc.date':           { en: 'Sep 2024 \u2192 Sep 2025',             fr: 'Sept. 2024 \u2192 Sept. 2025' },
        't.conc.role':           { en: 'Digital Project Coordinator',        fr: 'Coordinateur de projets digitaux' },
        't.conc.org':            { en: 'Concilium, Paris. Digital project management agency, 150+ projects / year', fr: 'Concilium, Paris. Agence de gestion de projets digitaux, 150+ projets / an' },
        't.conc.m1':             { en: '<strong>Project coordination.</strong> Backlog management, steering committee prep, deliverable tracking, client reporting across 150+ digital projects.', fr: '<strong>Coordination projet.</strong> Gestion de backlog, pr\u00e9paration de comit\u00e9s de pilotage, suivi des livrables, reporting client sur 150+ projets.' },
        't.conc.m2':             { en: '<strong>CRM admin.</strong> OHME and Pipedrive deployment, contact data structuring, segmentation, campaign exports.', fr: '<strong>Admin CRM.</strong> D\u00e9ploiement OHME et Pipedrive, structuration des donn\u00e9es contacts, segmentation, exports de campagnes.' },
        't.conc.m3':             { en: '<strong>Automated reporting.</strong> Sector monitoring newsletter and internal AI newsletter built on n8n + Brevo.', fr: '<strong>Reporting automatis\u00e9.</strong> Newsletter de veille sectorielle et newsletter IA interne construites sur n8n + Brevo.' },
        't.l3.date':             { en: '2024 \u2192 2025',                    fr: '2024 \u2192 2025' },
        't.l3.role':             { en: 'BSc Digital Innovation &amp; IT (L3 MITIC)', fr: 'Licence 3 MITIC (Num\u00e9rique &amp; Innovation)' },
        't.l3.org':              { en: 'Universit\u00e9 Gustave Eiffel, Serris', fr: 'Universit\u00e9 Gustave Eiffel, Serris' },
        't.l3.body':             { en: 'Information systems, digital innovation, project management, quantitative methods.', fr: 'Syst\u00e8mes d\u2019information, innovation num\u00e9rique, gestion de projet, m\u00e9thodes quantitatives.' },
        't.l12.date':            { en: '2022 \u2192 2024',                    fr: '2022 \u2192 2024' },
        't.l12.role':            { en: 'BSc Economics &amp; Management (L1-L2)', fr: 'Licence 1 &amp; 2 \u00c9conomie-Gestion' },
        't.l12.org':             { en: 'Universit\u00e9 Gustave Eiffel, Serris', fr: 'Universit\u00e9 Gustave Eiffel, Serris' },
        't.l12.body':            { en: 'Macro, micro, corporate finance, financial analysis, econometrics, applied statistics.', fr: 'Macro, micro, finance d\u2019entreprise, analyse financi\u00e8re, \u00e9conom\u00e9trie, statistiques appliqu\u00e9es.' },
        't.esgi.date':           { en: '2021 \u2192 2022',                    fr: '2021 \u2192 2022' },
        't.esgi.role':           { en: 'BSc Computer Science (L1)',          fr: 'Licence 1 Informatique' },
        't.esgi.org':            { en: 'ESGI, Paris',                         fr: 'ESGI, Paris' },
        't.esgi.body':           { en: 'Programming fundamentals, algorithms, object-oriented design.', fr: 'Bases de la programmation, algorithmique, conception orient\u00e9e objet.' },
        // Compare (Solo augmenté vs Agence vs No-code)
        'compare.eyebrow':       { en: '01b. Approach',                       fr: '01b. Approche' },
        'compare.title':         { en: 'The <span class="hero-accent">third way</span> between agencies and no-code.', fr: 'La <span class="hero-accent">3e voie</span> entre l’agence et le no-code.' },
        'compare.subtitle':      { en: 'An augmented solo builder ships an MVP in 1 to 6 weeks for €1-12k, where an agency bills €50-150k over 4 to 6 months.', fr: 'Un builder solo augmenté livre un MVP en 1 à 6 semaines pour 1 à 12 k€, là où une agence facture 50 à 150 k€ en 4 à 6 mois.' },
        'compare.col.nocode':    { en: 'No-code only',                        fr: 'No-code seul' },
        'compare.col.agency':    { en: 'Agency',                              fr: 'Agence' },
        'compare.col.mine':      { en: 'Me',                                  fr: 'Moi' },
        'compare.col.mine_badge':{ en: 'Augmented solo',                      fr: 'Solo augmenté' },
        'compare.row.time':      { en: 'MVP delivery',                        fr: 'Délai MVP' },
        'compare.row.cost':      { en: 'Typical cost',                        fr: 'Coût typique' },
        'compare.row.ceiling':   { en: 'Technical ceiling',                   fr: 'Plafond technique' },
        'compare.row.contact':   { en: 'Point of contact',                    fr: 'Interlocuteur' },
        'compare.row.bug':       { en: 'When things break',                   fr: 'En cas de problème' },
        'compare.row.evolve':    { en: 'Evolutions',                          fr: 'Évolutions' },
        'compare.nocode.time':   { en: '4-12 weeks',                          fr: '4-12 sem' },
        'compare.agency.time':   { en: '4-6 months',                          fr: '4-6 mois' },
        'compare.mine.time':     { en: '1-6 weeks',                           fr: '1-6 sem' },
        'compare.nocode.cost':   { en: '0-5k€',                               fr: '0-5k€' },
        'compare.agency.cost':   { en: '50-150k€',                            fr: '50-150k€' },
        'compare.mine.cost':     { en: '1-12k€',                              fr: '1-12k€' },
        'compare.nocode.ceiling':{ en: 'Limited',                             fr: 'Limité' },
        'compare.agency.ceiling':{ en: 'Unlimited',                           fr: 'Infini' },
        'compare.mine.ceiling':  { en: 'Unlimited',                           fr: 'Infini' },
        'compare.nocode.contact':{ en: 'Yourself',                            fr: 'Vous-même' },
        'compare.agency.contact':{ en: '4+ people',                           fr: '4+ personnes' },
        'compare.mine.contact':  { en: 'A single contact',                    fr: 'Interlocuteur unique' },
        'compare.nocode.bug':    { en: 'You are on your own',                 fr: 'Vous êtes seul' },
        'compare.agency.bug':    { en: 'Support ticket',                      fr: 'Ticket support' },
        'compare.mine.bug':      { en: 'Direct support',                      fr: 'Support direct' },
        'compare.nocode.evolve': { en: 'Quick ceiling',                       fr: 'Plafond rapide' },
        'compare.agency.evolve': { en: 'New quote',                           fr: 'Nouveau devis' },
        'compare.mine.evolve':   { en: 'Monthly retainer',                    fr: 'Retainer mensuel' },
        'compare.cta_pricing':   { en: 'See detailed packages',               fr: 'Voir les packages détaillés' },
        'compare.cta_chat':      { en: 'Talk to my agent',                    fr: 'Échanger avec mon agent' },
        // Agent chat
        'agent.eyebrow':         { en: '04b. Agent',                          fr: '04b. Agent' },
        'agent.title':           { en: 'Are we a <em>good fit</em>?',         fr: 'Est-on fait pour <em>travailler ensemble</em> ?' },
        'agent.lead':            { en: 'Talk to me directly. Tell me about your project, your team, what you’re trying to build. If it fits what I do, we’ll take the conversation off the page.', fr: 'Parlez-moi directement. Dites-moi votre projet, votre équipe, ce que vous cherchez à construire. Si cela correspond à ce que je fais, nous poursuivons la discussion hors de la page.' },
        'agent.greeting':        { en: 'Hello, this is Mathieu. Tell me in a few sentences what you are working on or what you need: a freelance mission, a brief on CRM / n8n / a custom build, a partnership idea, or simple curiosity.', fr: 'Bonjour, ici Mathieu. Dites-moi en quelques phrases sur quoi vous travaillez ou ce que vous cherchez : une mission freelance, un brief CRM / n8n / un build sur-mesure, une idée de partenariat, ou simple curiosité.' },
        'agent.placeholder':     { en: 'Describe your project in a few sentences...', fr: 'Décrivez votre projet en quelques phrases...' },
        'agent.input_label':     { en: 'Your message',                        fr: 'Votre message' },
        'agent.send_aria':       { en: 'Send',                                fr: 'Envoyer' },
        'agent.foot':            { en: 'You’re talking to an AI version of me, powered by Claude. I read every contact request myself.', fr: 'Vous discutez avec une version IA de moi, propulsée par Claude. Je lis chaque demande de contact moi-même.' },
        'agent.cta_recontact':   { en: 'Can I get back to you?',              fr: 'Je peux vous recontacter ?' },
        'agent.contact_title':   { en: 'Leave your details',                  fr: 'Laissez vos coordonnées' },
        'agent.contact_lead':    { en: 'I’ll get back to you within 24h. Our conversation summary will be attached automatically.', fr: 'Je vous recontacte sous 24h. Le résumé de notre échange est joint automatiquement.' },
        'agent.contact_intro':   { en: 'Very good. Leave your details below and I will get back to you within 24h:', fr: 'Très bien. Laissez-moi vos coordonnées ci-dessous, je reviens vers vous sous 24h :' },
        'agent.contact_first':   { en: 'First name',                          fr: 'Prénom' },
        'agent.contact_last':    { en: 'Last name',                           fr: 'Nom' },
        'agent.contact_email':   { en: 'email@example.com',                   fr: 'email@exemple.com' },
        'agent.contact_phone':   { en: 'Phone (optional)',                    fr: 'Téléphone (optionnel)' },
        'agent.contact_submit':  { en: 'Send my details',                     fr: 'Envoyer mes coordonnées' },
        'agent.contact_success': { en: 'Got it, thanks. I’ll reach out within 24h on the channel you left.', fr: 'Reçu, merci. Je reviens vers vous sous 24h sur le canal que vous avez laissé.' },
        'agent.contact_error':   { en: 'Could not send. Please email me directly at mathieu.haye03@gmail.com.', fr: 'Envoi impossible. Merci de m’écrire directement à mathieu.haye03@gmail.com.' },
        'agent.contact_invalid_email': { en: 'Please enter a valid email.',   fr: 'Merci d’entrer un email valide.' },
        'agent.contact_consent': { en: 'I agree to be contacted about my request. My data is never sold. <a href="/confidentialite" target="_blank" rel="noopener">Privacy policy</a>.', fr: 'J’accepte d’être recontacté(e) au sujet de ma demande. Mes données ne sont jamais revendues. <a href="/confidentialite" target="_blank" rel="noopener">Confidentialité</a>.' },
        'agent.contact_consent_required': { en: 'Please tick the consent box.', fr: 'Merci de cocher la case de consentement.' },
        'agent.error_generic':   { en: 'Something went wrong. Please try again.', fr: 'Une erreur est survenue. Merci de réessayer.' },
        'agent.error_rate':      { en: 'Too many messages. Please try again in an hour.', fr: 'Trop de messages. Réessayez dans une heure.' },
        // Contact
        'contact.eyebrow':       { en: '05. Contact',                         fr: '05. Contact' },
        'contact.title':         { en: 'Let&rsquo;s <span class="contact-headline-accent"><em>talk</em></span>.', fr: '<span class="contact-headline-accent"><em>Discutons</em></span>.' },
        'contact.lead':          { en: 'Freelance briefs, business and AI conversations, partnership ideas, or a coffee to talk shop. Pick the channel that fits.', fr: 'Briefs freelance, \u00e9changes business et IA, id\u00e9es de partenariat ou un caf\u00e9 pour parler shop. Choisis le canal qui te convient.' },
        'avail.main':            { en: 'Available for conversations',         fr: 'Dispo pour \u00e9changer' },
        'avail.sub':             { en: 'Usually answer within 24h, Mon\u2013Fri.', fr: 'R\u00e9ponse sous 24h, lun\u2013ven.' },
        'channel.email':         { en: 'Best for detailed briefs',            fr: 'Id\u00e9al pour un brief d\u00e9taill\u00e9' },
        'channel.linkedin':      { en: 'Best for a quick intro',              fr: 'Id\u00e9al pour une prise de contact' },
        'channel.phone':         { en: 'Best for a fast call',                fr: 'Id\u00e9al pour un appel rapide' },
        'meta.based':            { en: 'Based in',                            fr: 'Bas\u00e9 \u00e0' },
        'meta.based.value':      { en: 'Paris, France',                       fr: 'Paris, France' },
        'meta.lang':             { en: 'Languages',                           fr: 'Langues' },
        'meta.lang.value':       { en: 'French native \u00b7 English professional', fr: 'Fran\u00e7ais natif \u00b7 Anglais professionnel' },
        'meta.mob':              { en: 'Mobility',                            fr: 'Mobilit\u00e9' },
        'meta.mob.value':        { en: 'Driver licence \u00b7 \u00cele-de-France', fr: 'Permis B \u00b7 \u00cele-de-France' },
        'meta.status':           { en: 'Status',                              fr: 'Statut' },
        'meta.status.value':     { en: 'Freelance \u00b7 Available now', fr: 'Freelance \u00b7 Disponible' },
        // Footer
        'footer.lead':           { en: 'Freelance Builder \u00b7 AI apps, automations &amp; custom CRM \u00b7 Paris', fr: 'Freelance Builder \u00b7 Apps IA, automatisations &amp; CRM sur-mesure \u00b7 Paris' },
        'footer.col1.label':     { en: 'Explore',                             fr: 'Naviguer' },
        'footer.col1.1':         { en: 'Projects',                            fr: 'Projets' },
        'footer.col1.2':         { en: 'Background',                          fr: 'Parcours' },
        'footer.col1.offers':    { en: 'Offers',                             fr: 'Offres' },
        'footer.col1.collab':    { en: 'Collaboration',                      fr: 'Collaboration' },
        'footer.col1.quiz':      { en: 'AI maturity test',                  fr: 'Test maturité IA' },
        'footer.col1.3':         { en: 'Visible by AI?',                     fr: 'Visible par les IA ?' },
        'tools.eyebrow':         { en: 'Free diagnostics',                  fr: 'Diagnostics gratuits' },
        'tools.title':           { en: 'Where do you stand? <span class="hero-accent">Test it free</span>.', fr: 'Où en êtes-vous ? <span class="hero-accent">Testez gratuitement</span>.' },
        'tools.geo.eyebrow':     { en: 'GEO score',                         fr: 'Score GEO' },
        'tools.geo.title':       { en: 'Is your site visible to AI?',       fr: 'Votre site est-il visible par les IA ?' },
        'tools.geo.desc':        { en: 'ChatGPT, Perplexity, Google AI: a score out of 100, a clear verdict, and the score you could reach. 30 seconds.', fr: 'ChatGPT, Perplexity, Google AI : un score sur 100, un verdict clair, et le score que vous pouvez atteindre. 30 secondes.' },
        'tools.geo.cta':         { en: 'Run the test →',                     fr: 'Lancer le test →' },
        'tools.maturity.eyebrow':{ en: 'AI maturity',                       fr: 'Maturité IA' },
        'tools.maturity.title':  { en: 'What is your AI maturity level?',    fr: 'Quel est votre niveau de maturité IA ?' },
        'tools.maturity.desc':   { en: '6 or 20 questions, your level, your priority levers and the time you could save with AI and automation.', fr: '6 ou 20 questions, votre niveau, vos leviers prioritaires et le temps que vous pourriez gagner avec l’IA et l’automatisation.' },
        'tools.maturity.cta':    { en: 'Take the test →',                    fr: 'Faire le test →' },
        'footer.col1.4':         { en: 'Contact',                             fr: 'Contact' },
        'footer.col1.blog':      { en: 'Journal',                             fr: 'Journal' },
        'footer.col2.label':     { en: 'Get in touch',                        fr: 'Me joindre' },
        'footer.col3.label':     { en: 'Based in',                            fr: 'Bas\u00e9 \u00e0' },
        'footer.col3.1':         { en: 'Paris region, France',                fr: 'R\u00e9gion parisienne, France' },
        'footer.col3.2':         { en: 'Driver licence \u00b7 Mobile IDF',    fr: 'Permis B \u00b7 Mobile IDF' },
        'footer.col3.3':         { en: 'French native \u00b7 English professional', fr: 'Fran\u00e7ais natif \u00b7 Anglais professionnel' },
        'footer.col4.label':     { en: 'Currently',                           fr: 'Actuellement' },
        'footer.col4.1':         { en: 'Freelance consultant',                fr: 'Consultant freelance' },
        'footer.col4.2':         { en: 'Bloomberg BMC certified',             fr: 'Bloomberg BMC certifi\u00e9' },
        'footer.col4.3':         { en: 'Available for projects',        fr: 'Disponible pour missions' },
        'footer.rights':         { en: '\u00a9 2026 Mathieu Haye. All rights reserved.', fr: '\u00a9 2026 Mathieu Haye. Tous droits r\u00e9serv\u00e9s.' },
        'footer.backToTop':      { en: 'Back to top',                         fr: 'Retour en haut' },
        // Newsletter
        'nl.preview.label':      { en: 'Latest issue preview',                fr: 'Aper\u00e7u du dernier num\u00e9ro' },
        'nl.badge':              { en: 'IA BREW \u00b7 WEEKLY',                fr: 'IA BREW \u00b7 HEBDO' },
        'nl.heading':            { en: 'Get the Brew in your inbox.',         fr: 'Recevez le Brew dans votre bo\u00eete.' },
        'nl.subtitle':           { en: 'AI picks from 20+ sources, scored and summarised by Claude. One clean email every Monday.', fr: 'S\u00e9lection IA de 20+ sources, scor\u00e9e et r\u00e9sum\u00e9e par Claude. Un e-mail propre chaque lundi.' },
        'nl.firstName':          { en: 'First name',                          fr: 'Pr\u00e9nom' },
        'nl.lastName':           { en: 'Last name',                           fr: 'Nom' },
        'nl.email':              { en: 'Email',                               fr: 'E-mail' },
        'nl.placeholder.first':  { en: 'Jane',                                fr: 'Marie' },
        'nl.placeholder.last':   { en: 'Doe',                                 fr: 'Dupont' },
        'nl.placeholder.email':  { en: 'you@company.com',                     fr: 'vous@entreprise.com' },
        'nl.submit':             { en: 'Subscribe',                           fr: 'S\u2019inscrire' },
        'nl.success':            { en: 'You\u2019re in. Check your inbox to confirm.', fr: 'Inscription confirm\u00e9e. V\u00e9rifiez votre bo\u00eete pour confirmer.' },
        'nl.error':              { en: 'Something went wrong. Please check your details and try again.', fr: 'Une erreur est survenue. V\u00e9rifiez vos informations et r\u00e9essayez.' }
    };

    const applyLang = (lang) => {
        document.documentElement.lang = lang;
        // Swap hrefs on multilingual links (Journal, etc.)
        document.querySelectorAll('[data-en-href]').forEach(a => {
            if (!a.dataset.frHref) a.dataset.frHref = a.getAttribute('href');
            a.setAttribute('href', lang === 'en' ? a.dataset.enHref : a.dataset.frHref);
        });
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const entry = i18n[key];
            if (!entry || !entry[lang]) return;
            if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = entry[lang];
            } else {
                el.textContent = entry[lang];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const entry = i18n[key];
            if (entry && entry[lang]) el.placeholder = entry[lang];
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.dataset.i18nAria;
            const entry = i18n[key];
            if (entry && entry[lang]) el.setAttribute('aria-label', entry[lang]);
        });
        document.querySelectorAll('.lang-btn[data-lang]').forEach(b => {
            b.classList.toggle('active', b.dataset.lang === lang);
        });
        // Re-render an open project modal so its content tracks the language.
        const openProjectKey = document.getElementById('projectModal')?.dataset.openProject;
        if (openProjectKey && document.getElementById('projectModal')?.classList.contains('open') && typeof window.__rerenderModal === 'function') {
            window.__rerenderModal(openProjectKey);
        }
    };

    // P5 : la langue vient de la page servie (home FR statique /, miroir EN /en/).
    // Plus d'auto-détection ni de localStorage : le switch de langue est un lien.
    const initialLang = (document.documentElement.lang || 'fr').toLowerCase().indexOf('en') === 0 ? 'en' : 'fr';

    // Expose for modal re-render + initial apply after DOM ready
    window.__applyLang = () => applyLang(document.documentElement.lang || initialLang);
    applyLang(initialLang);

    /* ========== LAUNCH ANIMATION ========== */
    const launchWordmark = document.getElementById('launchWordmark');
    if (launchWordmark) {
        const text = launchWordmark.textContent;
        launchWordmark.innerHTML = text.split('').map((c, i) => {
            const display = c === ' ' ? '&nbsp;' : c;
            const delay = 200 + i * 50;
            return '<span class="launch-char" style="animation-delay: ' + delay + 'ms">' + display + '</span>';
        }).join('');
    }
    const finishLaunch = () => {
        document.body.classList.remove('launching');
        document.body.classList.add('launch-done');
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finishLaunch();
    } else {
        setTimeout(finishLaunch, 2500);
    }

    /* ========== PROJECTS DATA ========== */
    const projectsData = {
        mexc: {
            title: 'Crypto Trading Bot (MEXC)',
            eyebrow: '01. Quant trading',
            tech: ['Python', 'MEXC API', 'pandas', 'numpy', 'Streamlit', 'TA-Lib'],
            meta: [
                { label: 'Strategy', value: 'Mean reversion, BTC + ETH' },
                { label: 'Paper P&L', value: '+3.2% over 90 days' },
                { label: 'Live P&L', value: '-2.1% over 30 days' },
                { label: 'Win rate', value: '46% (214 trades)' }
            ],
            sections: [
                {
                    heading: 'Hypothesis',
                    body: `Short-term crypto pairs often overshoot. When RSI dips below a band and price breaks below the lower Bollinger envelope, a snap-back is more likely than a trend continuation. The bot fades that move with a tight stop.`
                },
                {
                    heading: 'Architecture',
                    list: [
                        '<strong>Indicator engine</strong>: RSI(14) + Bollinger (20, 2&sigma;) on rolling 1m and 5m candles.',
                        '<strong>Entry filter</strong>: both signals agree + volume spike above 1.5x average.',
                        '<strong>Position sizing</strong>: fixed fractional, capped per pair.',
                        '<strong>Exit</strong>: take-profit at mid-band, hard stop 1.5%, time stop after 30 candles.',
                        '<strong>Dashboard</strong>: live equity curve, per-trade log, kill switch.'
                    ]
                },
                {
                    heading: 'Results (honest numbers)',
                    list: [
                        'Paper (90 days): <strong>+3.2%</strong>, PF 1.18, MaxDD -8.4%.',
                        'Live pilot (30 days, 10% of paper size): <strong>-2.1%</strong>, WR 46%.',
                        'Delta: paper did not model <strong>taker fees (0.1%)</strong> and real slippage on illiquid pairs.',
                        'Fees alone explain roughly 4 percentage points of the gap.'
                    ]
                },
                {
                    heading: 'What I changed next',
                    body: `Pivoted to a maker-rebate version using limit orders at the Bollinger edges. Lower fill rate, but when it fills, fees turn negative. That is still running in paper. The real lesson: never trust a backtest that does not model friction costs tick by tick.`
                }
            ]
        },
        bloomberg: {
            title: 'Bloomberg-Style Dashboard',
            eyebrow: '02. Multi-asset tracker',
            tech: ['Next.js 14', 'TypeScript', 'Claude API', 'Recharts', 'CoinGecko', 'Yahoo Finance', 'Telegram'],
            meta: [
                { label: 'Scope', value: '6 assets (crypto, stocks, ETF)' },
                { label: 'AI', value: 'Claude Haiku 4.5' },
                { label: 'Alerts', value: 'Telegram, 3 tiers' },
                { label: 'Schedule', value: '08:50 / 13:00 / 17:30 Paris' }
            ],
            sections: [
                {
                    heading: 'Goal',
                    body: `A personal terminal I actually use every morning. Follows BTC, ETH, SOL, NVDA, TTE and CW8. Pulls prices, runs technicals, asks Claude for a short take at market-relevant hours, pushes everything to Telegram.`
                },
                {
                    heading: 'Features',
                    list: [
                        '<strong>Scheduled AI analysis</strong> before open, at midday, after close.',
                        '<strong>Technicals</strong>: RSI, MACD, Bollinger, ATR across 1D / 1W / 1M / 3M.',
                        '<strong>What-If simulator</strong> with 10-day Monte Carlo (median / worst / best).',
                        '<strong>Correlation heatmap</strong> (Pearson 6x6) + diversification score.',
                        '<strong>DCA tracker</strong>: cost basis per asset, P&amp;L %, budget progress.',
                        '<strong>Events calendar</strong>: earnings, dividends, ECB, Fed with J-N countdown.',
                        '<strong>Trade journal</strong>: logs reasoning + emotional state per trade.'
                    ]
                },
                {
                    heading: 'Why it matters',
                    body: `This project hits every junior quant touchpoint: data ingestion, feature engineering, Monte Carlo, production LLM calls, scheduling. It is the kind of tool I want to learn to build <em>with proper math</em>.`
                }
            ]
        },
        ichimoku: {
            title: 'IchimokuSignal Pro',
            eyebrow: '03. Pine Script + backtest',
            tech: ['Pine Script v6', 'TradingView', 'Python', 'yfinance', 'pandas', 'numpy'],
            meta: [
                { label: 'Type', value: 'Indicator + backtester' },
                { label: 'Version', value: 'v3.3 (Bounce + 15% SL)' },
                { label: 'Net return (AAOI, 5y)', value: '+187% vs +1088% B&H' },
                { label: 'Win rate / PF / MaxDD', value: '54% / 1.62 / 24%' }
            ],
            sections: [
                {
                    heading: 'Problem',
                    body: `Most Ichimoku setups on TradingView fire too often on long-term stock charts. I wanted a single-shot "GO" / "WAIT" signal for buy-and-hold style stock picking, validated with a Python backtest that includes commissions and slippage.`
                },
                {
                    heading: 'Approach',
                    list: [
                        '<strong>Primary signal</strong>: Kijun / Tenkan bounce detection.',
                        '<strong>Risk</strong>: trailing 15% stop loss drawn as a dotted line, exit on score drop below 2.',
                        '<strong>Enhanced Chikou</strong>: checked against the cloud at the Chikou position.',
                        '<strong>Higher timeframe candles</strong>: engulfing, hammer, doji, marubozu. Anti-repaint.',
                        '<strong>Composite score</strong>: 10 criteria, up to 13 points.',
                        '<strong>Python backtester</strong>: reproduces the Pine logic candle by candle, now with 0.1% round-trip fees and 1-tick slippage.'
                    ]
                },
                {
                    heading: 'Honest results (AAOI, 5y)',
                    list: [
                        'Strategy: <strong>+187%</strong>, 54% WR, PF 1.62, MaxDD -24%.',
                        'Buy &amp; Hold baseline: <strong>+1088%</strong>, MaxDD -62%.',
                        'So the strategy <em>loses</em> to B&amp;H in absolute terms, but cuts drawdown by more than half.',
                        'Single-stock backtest. Forward-testing on a 15-ticker basket is next.'
                    ]
                },
                {
                    heading: 'What it taught me',
                    body: `Two things. First, single-asset backtests are always partly overfit, so out-of-sample testing is non-negotiable. Second, a strategy that underperforms B&amp;H on return but halves drawdown is still a valid product for a risk-averse investor. Choosing a strategy is choosing a risk profile.`
                }
            ]
        },
        realestate: {
            title: 'Real Estate Investment Model',
            eyebrow: '04. Finance modeling',
            tech: ['Python', 'pandas', 'Notion', 'INSEE open data', 'Google Sheets'],
            meta: [
                { label: 'Scope', value: 'SCI/IS vs LMNP, mortgage' },
                { label: 'Data', value: 'INSEE, notary stats, rental yields' },
                { label: 'Cities ranked', value: '34 French metros' },
                { label: 'Purpose', value: 'Size my own portfolio' }
            ],
            sections: [
                {
                    heading: 'What it does',
                    body: `A working model to choose between SCI at IS (corporate tax) and LMNP (furnished rental, BIC regime) on a per-deal basis. Includes mortgage scenarios, 10-year IRR, tax impact, exit strategy and a city-level index to rank rental attractiveness across France.`
                },
                {
                    heading: 'Components',
                    list: [
                        '<strong>Regime comparator</strong>: SCI/IS vs LMNP, cash flow year by year, IRR, net equity at exit.',
                        '<strong>Mortgage simulator</strong>: amortisation, interest curve, break-even rent.',
                        '<strong>City index</strong>: rental yield, vacancy risk, price momentum, notarial tax.',
                        '<strong>Macro overlay</strong>: rate scenarios, inflation, salary growth.',
                        '<strong>Notion dashboard</strong>: I use it on actual deals I underwrite.'
                    ]
                },
                {
                    heading: 'Why it matters',
                    body: `Real estate is the asset class where I learned that the tax wrapper matters more than the price. Modelling it forced me to understand how corporate vs personal tax regimes interact with financing. The same reasoning applies to any structured instrument in finance.`
                }
            ]
        },
        iabrew: {
            title: 'IA Brew. AI Newsletter',
            eyebrow: '05. AI product',
            tech: ['n8n', 'Claude API', 'Apify', 'Brevo', 'HTML templating'],
            meta: [
                { label: 'Type', value: 'Automated newsletter' },
                { label: 'Workflow', value: '93+ nodes n8n' },
                { label: 'Frequency', value: 'Weekly, unattended' },
                { label: 'Stack', value: 'Apify + Claude + Brevo' }
            ],
            sections: [
                {
                    heading: 'The pipeline',
                    body: `A newsletter that writes itself. 20+ sources (RSS, APIs, scraped sites) feed into an n8n workflow. Claude scores every item for relevance, clusters duplicates, summarises the top picks, and renders an HTML email. Brevo ships it every week.`
                },
                {
                    heading: 'Stages',
                    list: [
                        '<strong>Ingest</strong>: Apify actors + n8n HTTP nodes pull raw items.',
                        '<strong>Dedupe</strong>: content fingerprinting to collapse same-story items across sources.',
                        '<strong>Score &amp; summarise</strong>: Claude API with a tuned prompt (relevance + signal extraction).',
                        '<strong>Render</strong>: HTML template assembled from scored blocks.',
                        '<strong>Send</strong>: Brevo campaign creation + dispatch to list.',
                        '<strong>Observability</strong>: per-step logging in Google Sheets for post-mortem.'
                    ]
                },
                {
                    heading: 'Take-away',
                    body: `Same pattern applies to any research-desk workflow: ingest, score, cluster, render, distribute. The difference between a toy and a product is the observability and the scoring rigor.`
                }
            ]
        },
        jobs: {
            title: 'Multi-source Job Scorer + ATS PDF Generator',
            eyebrow: '06. Data pipeline + GenAI',
            tech: ['Python', 'WTTJ API', 'JobTeaser', 'Claude API', 'ReportLab', 'HTML / JS', 'SQLite'],
            meta: [
                { label: 'Sources', value: 'WTTJ, JobTeaser, LinkedIn' },
                { label: 'Jobs scored', value: '240+' },
                { label: 'Auto-generated', value: 'ATS CV + cover letter in PDF' },
                { label: 'Scoring', value: 'Weighted, profile-aware' }
            ],
            sections: [
                {
                    heading: 'What it does',
                    body: `Pulls job postings from three platforms via their APIs, normalises the schema, scores each posting against my profile on a weighted set of criteria (stack match, industry fit, location, seniority), and renders a filterable HTML dashboard. For every high-scoring offer, the pipeline auto-generates a <strong>CV and a cover letter tailored to the job description</strong>, both exported as clean <strong>ATS-optimised PDFs</strong>.`
                },
                {
                    heading: 'Build',
                    list: [
                        '<strong>Per-source scrapers</strong> with rate limits and caching.',
                        '<strong>Unified schema</strong> so I compare like for like.',
                        '<strong>Scoring engine</strong>: manual weights tuned over 2 iterations.',
                        '<strong>Tailored CV generator</strong>: Claude reshuffles the sections of my master CV to match the job keywords, then ReportLab renders a pixel-clean PDF.',
                        '<strong>Cover letter generator</strong>: same pattern, with a structured prompt that enforces tone, structure and length.',
                        '<strong>ATS rules</strong>: single-column layout, no tables, no images behind text, real font files (not image-based), standard section names, machine-parseable headings.',
                        '<strong>UI</strong>: vanilla HTML / JS dashboard with filterable table and one-click download of the two PDFs per offer.'
                    ]
                },
                {
                    heading: 'Why ATS matters',
                    body: `Most CVs today are first read by Applicant Tracking Systems before any human sees them. A beautiful two-column design or a CV exported as an image silently drops your score to zero. This pipeline respects the ATS constraints by construction: every CV it outputs is parsed correctly by Workday, Greenhouse, Lever and friends.`
                },
                {
                    heading: 'What I got from it',
                    body: `Clean case study in ETL discipline plus applied GenAI: if the schema is wrong, the scoring is meaningless; if the CV prompt is sloppy, the PDF reads like filler. Both disciplines reward rigor more than creativity.`
                }
            ]
        },
        usbguard: {
            title: 'Juice Jacking Guard. USB Threat Monitor (Windows)',
            eyebrow: '04. Desktop security app',
            tech: ['Python 3.10+', 'Tkinter', 'WMI (Win32_PnPEntity)', 'Raw Input API (ctypes)', 'pnputil', 'PyInstaller', 'Inno Setup', 'VirusTotal API v3'],
            meta: [
                { label: 'Platform', value: 'Windows 10 / 11' },
                { label: 'Threats covered', value: 'BadUSB, Rubber Ducky, O.MG Cable, juice jacking, USB payloads' },
                { label: 'Size', value: '~4,900 lines, 20 modules, 11 subsystems' },
                { label: 'Distribution', value: 'Single-file .exe installer (23.3 MB)' }
            ],
            download: {
                primary: {
                    url: '/downloads/JuiceJackingGuard-Setup.zip',
                    label: 'Download .zip (recommended, 22.7 MB)',
                    size: '22.7 MB',
                    sha256: 'e37364564f1eed9af699b85a40dae6e5fdbf9f25efba72f3002f6d0e0b41ffac'
                },
                secondary: {
                    url: '/downloads/JuiceJackingGuard-Setup.exe',
                    label: 'Direct .exe (23.3 MB)',
                    size: '23.3 MB',
                    sha256: '1132af4c3a2158f17806a7720b0a46d4c477799bae78b6a81d3a315cfa30812a'
                },
                platform: 'Windows 10 / 11',
                note: 'The installer is <strong>unsigned</strong> (no €400/year code-signing certificate), so Chrome / Edge and Windows SmartScreen will warn before download and at first launch. The <strong>.zip is recommended</strong> because browsers trust archives more than raw executables. After extraction, Windows will show "Windows protected your PC", click <em>More info → Run anyway</em>. Verify the SHA-256 before running. The app is local-first, no telemetry, only reaches out to VirusTotal if you enable the optional hash lookup feature.'
            },
            sections: [
                {
                    heading: 'Why it exists',
                    body: `A USB device is never just a USB. When you plug something in, Windows trusts whatever it declares, a Rubber Ducky that announces itself as a keyboard can type 200 commands in a few seconds with no prompt. An O.MG cable looks like a normal Lightning cable but hides a chip that exfiltrates data. No antivirus catches this in time. Juice Jacking Guard intercepts the device <strong>before</strong> it can speak to Windows.`
                },
                {
                    heading: 'Detection and blocking',
                    list: [
                        '<strong>WMI background monitor</strong>: scans <code>Win32_PnPEntity</code> in a dedicated thread, immediate block via <code>pnputil</code> on insertion.',
                        '<strong>Classifier</strong>: VID/PID, USB classes, vendor, composite multi-interfaces. Four risk levels (low → critical) with per-category policies.',
                        '<strong>Composite trap</strong>: a device that exposes HID + mass storage simultaneously is the classic BadUSB / O.MG signature → flagged CRITICAL automatically.',
                        '<strong>Block-first, ask-after</strong> policy: minimal exposure window, the device is disabled at OS level until the user explicitly trusts it.'
                    ]
                },
                {
                    heading: 'The Anti-BadUSB challenge (killer feature)',
                    list: [
                        '<strong>Raw Input API via ctypes</strong>: I use <code>hDevice</code> from <code>WM_INPUT</code> to identify the exact physical keyboard sending each keystroke.',
                        '<strong>Interactive challenge</strong>: every new keyboard pops a modal asking "press key X on the new keyboard", a Rubber Ducky cannot read a prompt and respond, so it unmasks itself.',
                        '<strong>Burst detection</strong>: ≥ 3 keystrokes in &lt; 30 ms is the signature of a payload dump → automatic block.',
                        '<strong>Dedicated message-only window</strong> for Raw Input, running in its own thread, communicates with the UI via <code>Queue</code> + <code>threading.Event</code>.'
                    ]
                },
                {
                    heading: 'Scanning and reputation',
                    list: [
                        '<strong>On-insert read-only scan</strong> of mass storage: <code>autorun.inf</code>, 23 executable extensions, hidden files, suspicious shortcuts.',
                        '<strong>SHA-256</strong> computed locally for every finding.',
                        '<strong>VirusTotal lookup (optional, free tier)</strong>: hash-only API v3 calls, no file upload, token-bucket rate limiter to respect 4 req/min.',
                        '<strong>Live verdict</strong> in the alert popup, with per-finding evidence.'
                    ]
                },
                {
                    heading: 'Engineering highlights',
                    list: [
                        '<strong>Multi-threading</strong>: WMI monitor thread + event dispatcher thread + Raw Input thread (own message-only window) + Tk main thread, all wired through <code>Queue</code> and <code>threading.Event</code>.',
                        '<strong>UAC self-elevation</strong>: if not admin at launch, re-launch via <code>ShellExecuteW</code> with the <code>runas</code> verb.',
                        '<strong>Task Scheduler boot hook</strong>: <code>Register-ScheduledTask</code> with <code>RunLevel Highest</code> = silent admin boot, no UAC prompt every session.',
                        '<strong>Modern dark UI</strong>: full custom Tkinter theme, Windows dark title bar via <code>DwmSetWindowAttribute(DWMWA_USE_IMMERSIVE_DARK_MODE)</code>, sidebar nav (Dashboard / Whitelist / Journal / Preferences), system tray, toast notifications.',
                        '<strong>Installer</strong>: Inno Setup script, Program Files install, Desktop + Start Menu shortcuts, scheduled task, Defender exclusion, clean uninstall.',
                        '<strong>Build</strong>: PyInstaller single-file + Inno Setup, chained in <code>build.bat</code> (PowerShell alt in <code>setup.bat</code>).'
                    ]
                },
                {
                    heading: 'Why it is on this portfolio',
                    body: `Juice Jacking Guard is the project where the builder reflex meets real systems programming: ctypes calls into the Windows API, threading discipline that does not deadlock, an installer that survives Defender, a security model that defaults to "deny". It also shows that I can take a niche, half-understood threat (USB payloads) and ship a defence that actually works on the machine you are reading this on.`
                }
            ]
        },
        salesforce: {
            title: 'e-Enfance / 3018, Emma custom CRM',
            eyebrow: '07. Custom CRM build',
            tech: ['Emma (custom CRM)', 'Full-stack TS', 'Realtime', 'Market CRM (prior)', 'Unified multichannel queue', 'FR-hosted'],
            meta: [
                { label: 'Client', value: 'e-Enfance / 3018' },
                { label: 'Product', value: 'Emma, listeners’ workstation' },
                { label: 'Scope', value: 'All-in-one custom CRM' },
                { label: 'Channels', value: 'Chat, phone, email, WhatsApp, Messenger' },
                { label: 'Role', value: 'Freelance consultant' }
            ],
            sections: [
                {
                    heading: 'The brief',
                    body: `3018 is the French national hotline for protecting minors online, run by the e-Enfance association. I first worked on their existing market CRM. That experience showed me exactly what the listeners needed day to day, and where their market CRM reached its limits for this need.`
                },
                {
                    heading: 'What I built',
                    list: [
                        'Designed and shipped <strong>Emma</strong>, a custom CRM that replaced their market CRM: the <strong>workstation for the 3018 listeners</strong>.',
                        'A <strong>single unified queue</strong> that merges every channel: chat, phone, email, WhatsApp and Messenger.',
                        '<strong>Automatic distress-signal detection</strong> with <strong>suicide-risk prioritization</strong>.',
                        'A <strong>structured, exportable case file</strong> for each situation.',
                        '<strong>Real-time supervision</strong> and <strong>reporting</strong> for the team.',
                        '<strong>Full-stack TypeScript</strong>, <strong>sovereign and France-hosted</strong>, on sensitive data, with an audit trail.'
                    ]
                },
                {
                    heading: 'Why it is on this portfolio',
                    body: `Proof I can design and ship a real, all-in-one operations platform end to end, on sensitive data, not just configure an existing tool. That is exactly what a commercial operations platform needs.`
                }
            ]
        }
    };

    /* ========== PROJECTS DATA, FR overlay (merged onto projectsData when lang=fr) ========== */
    const projectsDataFr = {
        mexc: {
            title: 'Bot de trading crypto (MEXC)',
            eyebrow: '01. Trading quant',
            meta: [
                { label: 'Stratégie', value: 'Mean reversion, BTC + ETH' },
                { label: 'P&L paper', value: '+3,2 % sur 90 jours' },
                { label: 'P&L live', value: '-2,1 % sur 30 jours' },
                { label: 'Win rate', value: '46 % (214 trades)' }
            ],
            sections: [
                {
                    heading: 'Hypothèse',
                    body: `Les paires crypto court terme dépassent souvent leur niveau d’équilibre. Quand le RSI passe sous une bande basse et que le prix casse l’enveloppe inférieure de Bollinger, un retour à la moyenne est plus probable qu’une continuation. Le bot prend cette respiration à contre-pied avec un stop serré.`
                },
                {
                    heading: 'Architecture',
                    list: [
                        '<strong>Moteur d’indicateurs</strong> : RSI(14) + Bollinger (20, 2&sigma;) sur bougies 1m et 5m glissantes.',
                        '<strong>Filtre d’entrée</strong> : les deux signaux s’accordent + pic de volume supérieur à 1,5× la moyenne.',
                        '<strong>Sizing</strong> : fraction fixe du capital, plafond par paire.',
                        '<strong>Sortie</strong> : take-profit à la bande médiane, stop dur à 1,5 %, time stop après 30 bougies.',
                        '<strong>Dashboard</strong> : courbe d’equity live, log par trade, kill switch.'
                    ]
                },
                {
                    heading: 'Résultats (les vrais chiffres)',
                    list: [
                        'Paper (90 jours) : <strong>+3,2 %</strong>, PF 1,18, MaxDD -8,4 %.',
                        'Pilote live (30 jours, 10 % de la taille paper) : <strong>-2,1 %</strong>, WR 46 %.',
                        'Écart : le paper n’intégrait pas les <strong>frais taker (0,1 %)</strong> ni le slippage réel sur paires peu liquides.',
                        'Les frais expliquent à eux seuls près de 4 points de pourcentage de l’écart.'
                    ]
                },
                {
                    heading: 'Ce que j’ai changé ensuite',
                    body: `Bascule vers une version maker-rebate via ordres limite aux bords des Bollinger. Taux de remplissage plus faible, mais quand ça remplit les frais deviennent négatifs. Toujours en paper. Vraie leçon : ne jamais croire un backtest qui ne modélise pas les coûts de friction tick par tick.`
                }
            ]
        },
        bloomberg: {
            title: 'Dashboard Bloomberg-like',
            eyebrow: '02. Tracker multi-actifs',
            meta: [
                { label: 'Portée', value: '6 actifs (crypto, actions, ETF)' },
                { label: 'IA', value: 'Claude Haiku 4.5' },
                { label: 'Alertes', value: 'Telegram, 3 niveaux' },
                { label: 'Planning', value: '08h50 / 13h00 / 17h30 Paris' }
            ],
            sections: [
                {
                    heading: 'Objectif',
                    body: `Un terminal perso que j’utilise vraiment chaque matin. Suivi de BTC, ETH, SOL, NVDA, TTE et CW8. Récupère les prix, calcule les indicateurs techniques, demande à Claude un point court aux heures de marché, pousse le tout sur Telegram.`
                },
                {
                    heading: 'Fonctionnalités',
                    list: [
                        '<strong>Analyse IA planifiée</strong> avant l’ouverture, à midi, après la clôture.',
                        '<strong>Indicateurs</strong> : RSI, MACD, Bollinger, ATR sur 1J / 1S / 1M / 3M.',
                        '<strong>Simulateur What-If</strong> avec Monte Carlo 10 jours (médian / pire / meilleur).',
                        '<strong>Heatmap de corrélation</strong> (Pearson 6×6) + score de diversification.',
                        '<strong>DCA tracker</strong> : coût d’entrée par actif, P&amp;L %, suivi du budget.',
                        '<strong>Calendrier d’événements</strong> : résultats, dividendes, BCE, Fed, avec compte à rebours en J-N.',
                        '<strong>Journal de trading</strong> : log du raisonnement et de l’état émotionnel par trade.'
                    ]
                },
                {
                    heading: 'Pourquoi ça compte',
                    body: `Ce projet coche toutes les cases d’un junior quant : ingestion de données, feature engineering, Monte Carlo, appels LLM en production, scheduling. C’est typiquement le genre d’outil que j’ai envie d’apprendre à construire <em>avec les bonnes maths derrière</em>.`
                }
            ]
        },
        ichimoku: {
            title: 'IchimokuSignal Pro',
            eyebrow: '03. Pine Script + backtest',
            meta: [
                { label: 'Type', value: 'Indicateur + backtester' },
                { label: 'Version', value: 'v3.3 (rebond + SL 15 %)' },
                { label: 'Rendement net (AAOI, 5 ans)', value: '+187 % vs +1088 % B&H' },
                { label: 'WR / PF / MaxDD', value: '54 % / 1,62 / 24 %' }
            ],
            sections: [
                {
                    heading: 'Problème',
                    body: `La plupart des setups Ichimoku sur TradingView déclenchent trop souvent sur des charts long terme. Je voulais un signal "GO" / "WAIT" unique pour du stock picking type buy-and-hold, validé par un backtest Python qui inclut commissions et slippage.`
                },
                {
                    heading: 'Approche',
                    list: [
                        '<strong>Signal principal</strong> : détection de rebond Kijun / Tenkan.',
                        '<strong>Risque</strong> : stop suiveur 15 % en pointillés, sortie quand le score passe sous 2.',
                        '<strong>Chikou renforcé</strong> : vérifié contre le nuage à la position du Chikou.',
                        '<strong>Bougies HTF</strong> : englobante, marteau, doji, marubozu. Anti-repaint.',
                        '<strong>Score composite</strong> : 10 critères, jusqu’à 13 points.',
                        '<strong>Backtester Python</strong> : reproduit la logique Pine bougie par bougie, frais aller-retour 0,1 % et slippage 1 tick inclus.'
                    ]
                },
                {
                    heading: 'Résultats honnêtes (AAOI, 5 ans)',
                    list: [
                        'Stratégie : <strong>+187 %</strong>, WR 54 %, PF 1,62, MaxDD -24 %.',
                        'Buy &amp; Hold de référence : <strong>+1088 %</strong>, MaxDD -62 %.',
                        'Donc la stratégie <em>perd</em> contre le B&amp;H en absolu, mais coupe le drawdown de plus de moitié.',
                        'Backtest mono-titre. Forward-test sur un panier de 15 tickers à venir.'
                    ]
                },
                {
                    heading: 'Ce que ça m’a appris',
                    body: `Deux choses. Premièrement, un backtest mono-actif est toujours en partie overfitté, donc le out-of-sample n’est pas négociable. Deuxièmement, une stratégie qui sous-performe le B&amp;H en rendement mais divise le drawdown par deux reste un produit valable pour un investisseur averse au risque. Choisir une stratégie, c’est choisir un profil de risque.`
                }
            ]
        },
        realestate: {
            title: 'Modèle d’investissement immobilier',
            eyebrow: '04. Modélisation financière',
            meta: [
                { label: 'Portée', value: 'SCI/IS vs LMNP, financement' },
                { label: 'Données', value: 'INSEE, stats notariales, rendements locatifs' },
                { label: 'Villes classées', value: '34 métropoles françaises' },
                { label: 'Usage', value: 'Dimensionner mon propre patrimoine' }
            ],
            sections: [
                {
                    heading: 'Ce que ça fait',
                    body: `Un modèle opérationnel pour choisir entre SCI à l’IS (impôt société) et LMNP (location meublée, régime BIC) par deal. Inclut scénarios d’emprunt, TRI à 10 ans, impact fiscal, stratégie de sortie et un indice par ville pour classer l’attractivité locative en France.`
                },
                {
                    heading: 'Composants',
                    list: [
                        '<strong>Comparateur de régime</strong> : SCI/IS vs LMNP, cash flow année par année, TRI, valeur nette à la sortie.',
                        '<strong>Simulateur d’emprunt</strong> : amortissement, courbe d’intérêts, loyer break-even.',
                        '<strong>Indice villes</strong> : rendement locatif, risque de vacance, momentum prix, fiscalité notariale.',
                        '<strong>Overlay macro</strong> : scénarios de taux, inflation, croissance des salaires.',
                        '<strong>Dashboard Notion</strong> : je l’utilise sur les vrais deals que je souscris.'
                    ]
                },
                {
                    heading: 'Pourquoi ça compte',
                    body: `L’immobilier est la classe d’actifs où j’ai appris que l’enveloppe fiscale compte plus que le prix. Le modéliser m’a forcé à comprendre comment les régimes corporate vs perso interagissent avec le financement. Le même raisonnement s’applique à tout instrument structuré en finance.`
                }
            ]
        },
        iabrew: {
            title: 'IA Brew. Newsletter IA',
            eyebrow: '05. Produit IA',
            meta: [
                { label: 'Type', value: 'Newsletter automatisée' },
                { label: 'Workflow', value: '93+ nœuds n8n' },
                { label: 'Fréquence', value: 'Hebdo, sans humain' },
                { label: 'Stack', value: 'Apify + Claude + Brevo' }
            ],
            sections: [
                {
                    heading: 'Le pipeline',
                    body: `Une newsletter qui s’écrit toute seule. 20+ sources (RSS, APIs, sites scrapés) alimentent un workflow n8n. Claude score chaque item sur sa pertinence, regroupe les doublons, résume les meilleurs picks, et rend un mail HTML. Brevo l’envoie chaque semaine.`
                },
                {
                    heading: 'Étapes',
                    list: [
                        '<strong>Ingestion</strong> : acteurs Apify + nodes HTTP n8n récupèrent les items bruts.',
                        '<strong>Déduplication</strong> : empreinte de contenu pour fusionner les items qui couvrent la même histoire.',
                        '<strong>Score &amp; résumé</strong> : API Claude avec un prompt calibré (pertinence + extraction de signal).',
                        '<strong>Rendu</strong> : template HTML assemblé à partir des blocs scorés.',
                        '<strong>Envoi</strong> : création de la campagne Brevo + dispatch à la liste.',
                        '<strong>Observabilité</strong> : logging par étape dans Google Sheets pour post-mortem.'
                    ]
                },
                {
                    heading: 'Take-away',
                    body: `Le même pattern s’applique à n’importe quel workflow d’équipe research : ingestion, score, cluster, rendu, distribution. La différence entre un toy et un produit, c’est l’observabilité et la rigueur du scoring.`
                }
            ]
        },
        jobs: {
            title: 'Scorer d’offres + générateur CV/LM ATS en PDF',
            eyebrow: '06. Pipeline data + GenIA',
            meta: [
                { label: 'Sources', value: 'WTTJ, JobTeaser, LinkedIn' },
                { label: 'Offres scorées', value: '240+' },
                { label: 'Auto-généré', value: 'CV ATS + lettre de motivation en PDF' },
                { label: 'Scoring', value: 'Pondéré, profile-aware' }
            ],
            sections: [
                {
                    heading: 'Ce que ça fait',
                    body: `Récupère les offres de trois plateformes via leurs API, normalise le schéma, score chaque offre contre mon profil sur un ensemble de critères pondérés (match stack, secteur, localisation, séniorité), et rend un dashboard HTML filtrable. Pour chaque offre au score élevé, le pipeline génère automatiquement un <strong>CV et une lettre de motivation taillés pour l’offre</strong>, tous deux exportés en <strong>PDF ATS-optimisés</strong>.`
                },
                {
                    heading: 'Build',
                    list: [
                        '<strong>Scrapers par source</strong> avec rate limits et cache.',
                        '<strong>Schéma unifié</strong> pour comparer ce qui est comparable.',
                        '<strong>Moteur de scoring</strong> : poids manuels calibrés sur 2 itérations.',
                        '<strong>Générateur CV taillé</strong> : Claude réordonne les sections de mon master CV pour matcher les mots-clés de l’offre, puis ReportLab rend un PDF au pixel près.',
                        '<strong>Générateur de LM</strong> : même pattern, avec un prompt structuré qui impose ton, structure et longueur.',
                        '<strong>Règles ATS</strong> : layout single-column, pas de tableaux, pas d’images derrière le texte, vraies polices (pas d’images), noms de sections standards, titres parseables machine.',
                        '<strong>UI</strong> : dashboard HTML / JS vanilla avec table filtrable et téléchargement en un clic des deux PDF par offre.'
                    ]
                },
                {
                    heading: 'Pourquoi l’ATS compte',
                    body: `La plupart des CVs aujourd’hui sont lus d’abord par des Applicant Tracking Systems avant qu’un humain ne les voie. Un beau design two-column ou un CV exporté en image fait silencieusement chuter le score à zéro. Ce pipeline respecte les contraintes ATS par construction : chaque CV qu’il sort est parsé correctement par Workday, Greenhouse, Lever et compagnie.`
                },
                {
                    heading: 'Ce que j’en retiens',
                    body: `Un cas d’étude propre en discipline ETL + GenIA appliquée : si le schéma est mauvais, le scoring n’a aucun sens ; si le prompt CV est sale, le PDF lit comme du filler. Les deux disciplines récompensent la rigueur plus que la créativité.`
                }
            ]
        },
        salesforce: {
            title: 'e-Enfance / 3018, Emma CRM sur-mesure',
            eyebrow: '07. Build CRM sur-mesure',
            tech: ['Emma (CRM sur-mesure)', 'Full-stack TS', 'Temps réel', 'CRM du marché (avant)', 'File unique multicanale', 'Hébergé en France'],
            meta: [
                { label: 'Client', value: 'e-Enfance / 3018' },
                { label: 'Produit', value: 'Emma, poste des écoutants' },
                { label: 'Portée', value: 'CRM tout-en-un sur-mesure' },
                { label: 'Canaux', value: 'Tchat, téléphone, e-mail, WhatsApp, Messenger' },
                { label: 'Rôle', value: 'Consultant freelance' }
            ],
            sections: [
                {
                    heading: 'Le brief',
                    body: `Le 3018 est la ligne d’écoute nationale française pour la protection des mineurs en ligne, gérée par l’association e-Enfance. J’y suis d’abord intervenu sur leur CRM du marché. Cette expérience m’a montré exactement ce dont les écoutants avaient besoin au quotidien, et là où leur CRM du marché atteignait ses limites pour ce besoin.`
                },
                {
                    heading: 'Ce que j’ai livré',
                    list: [
                        'Conception et livraison d’<strong>Emma</strong>, un CRM sur-mesure qui a remplacé leur CRM du marché : le <strong>poste de travail des écoutants du 3018</strong>.',
                        'Une <strong>file unique</strong> qui réunit tous les canaux : tchat, téléphone, e-mail, WhatsApp et Messenger.',
                        'La <strong>détection automatique des signaux de détresse</strong> avec <strong>priorisation du risque suicidaire</strong>.',
                        'Un <strong>dossier structuré et exportable</strong> pour chaque situation.',
                        'La <strong>supervision en temps réel</strong> et le <strong>reporting</strong> pour l’équipe.',
                        'Un build <strong>full-stack TypeScript</strong>, <strong>souverain et hébergé en France</strong>, sur données sensibles, avec audit trail.'
                    ]
                },
                {
                    heading: 'Pourquoi c’est sur ce portfolio',
                    body: `La preuve que je sais concevoir et livrer une vraie plateforme d’opérations tout-en-un de bout en bout, sur données sensibles, pas seulement configurer un outil existant.`
                }
            ]
        },
        usbguard: {
            title: 'Juice Jacking Guard. Surveillance USB (Windows)',
            eyebrow: '04. Application desktop sécurité',
            meta: [
                { label: 'Plateforme', value: 'Windows 10 / 11' },
                { label: 'Menaces couvertes', value: 'BadUSB, Rubber Ducky, câble O.MG, juice jacking, payloads USB' },
                { label: 'Taille', value: '~4 900 lignes, 20 modules, 11 sous-systèmes' },
                { label: 'Distribution', value: 'Installeur .exe single-file (23,3 Mo)' }
            ],
            download: {
                primary: { label: 'Télécharger .zip (recommandé, 22,7 Mo)' },
                secondary: { label: '.exe direct (23,3 Mo)' },
                note: 'L’installeur est <strong>non signé</strong> (pas de certificat code-signing à 400 €/an), donc Chrome / Edge et Windows SmartScreen vont prévenir avant le téléchargement et au premier lancement. Le <strong>.zip est recommandé</strong> parce que les navigateurs font plus confiance aux archives qu’aux exécutables bruts. Après extraction, Windows affichera "Windows a protégé votre PC", cliquez sur <em>Informations complémentaires → Exécuter quand même</em>. Vérifiez le SHA-256 avant exécution. L’app est locale, pas de télémétrie, ne contacte VirusTotal que si vous activez la fonctionnalité optionnelle de lookup.'
            },
            sections: [
                {
                    heading: 'Pourquoi ça existe',
                    body: `Un device USB n’est jamais juste un USB. Quand on branche quelque chose, Windows fait confiance à ce qu’il déclare, un Rubber Ducky qui s’annonce comme clavier peut taper 200 commandes en quelques secondes sans la moindre permission. Un câble O.MG ressemble à un Lightning normal mais cache une puce qui exfiltre des données. Aucun antivirus n’attrape ça à temps. Juice Jacking Guard intercepte le device <strong>avant</strong> qu’il puisse parler à Windows.`
                },
                {
                    heading: 'Détection et blocage',
                    list: [
                        '<strong>Monitoring WMI en background</strong> : scan de <code>Win32_PnPEntity</code> dans un thread dédié, blocage immédiat via <code>pnputil</code> à l’insertion.',
                        '<strong>Classifier</strong> : VID/PID, classes USB, fabricant, composite multi-interfaces. Quatre niveaux de risque (faible → critique) avec politiques par catégorie.',
                        '<strong>Piège composite</strong> : un device qui expose HID + mass storage en même temps = signature classique BadUSB / O.MG → classé CRITIQUE automatiquement.',
                        '<strong>Politique "bloque-d’abord, demande-après"</strong> : fenêtre d’exposition minimale, le device est désactivé au niveau OS jusqu’à validation explicite.'
                    ]
                },
                {
                    heading: 'Le challenge Anti-BadUSB (killer feature)',
                    list: [
                        '<strong>Raw Input API via ctypes</strong> : j’utilise <code>hDevice</code> depuis <code>WM_INPUT</code> pour identifier le clavier physique exact qui envoie chaque frappe.',
                        '<strong>Challenge interactif</strong> : chaque nouveau clavier ouvre une modale "appuie sur la touche X sur le nouveau clavier", un Rubber Ducky ne peut pas lire le prompt et répondre, donc il se démasque.',
                        '<strong>Détection des rafales</strong> : ≥ 3 frappes en &lt; 30 ms = signature de payload dump → blocage automatique.',
                        '<strong>Fenêtre message-only dédiée</strong> pour Raw Input, dans son propre thread, qui communique avec l’UI via <code>Queue</code> + <code>threading.Event</code>.'
                    ]
                },
                {
                    heading: 'Scan et réputation',
                    list: [
                        '<strong>Scan read-only à l’insertion</strong> du mass storage : <code>autorun.inf</code>, 23 extensions exécutables, fichiers cachés, raccourcis suspects.',
                        '<strong>SHA-256</strong> calculé localement pour chaque finding.',
                        '<strong>Lookup VirusTotal (optionnel, free tier)</strong> : appels API v3 sur les hashs uniquement, jamais d’upload de fichier, rate limiter token-bucket pour respecter les 4 req/min.',
                        '<strong>Verdict live</strong> dans le popup d’alerte, avec preuves par finding.'
                    ]
                },
                {
                    heading: 'Highlights techniques',
                    list: [
                        '<strong>Multi-threading</strong> : thread monitor WMI + thread dispatcher d’événements + thread Raw Input (sa propre fenêtre message-only) + thread main Tk, communication via <code>Queue</code> et <code>threading.Event</code>.',
                        '<strong>Self-elevation UAC</strong> : si pas admin au lancement, relance via <code>ShellExecuteW</code> avec le verbe <code>runas</code>.',
                        '<strong>Boot hook via Task Scheduler</strong> : <code>Register-ScheduledTask</code> avec <code>RunLevel Highest</code> = boot admin silencieux, pas de prompt UAC à chaque session.',
                        '<strong>UI dark moderne</strong> : theme Tkinter custom complet, dark title bar Windows via <code>DwmSetWindowAttribute(DWMWA_USE_IMMERSIVE_DARK_MODE)</code>, sidebar nav (Dashboard / Whitelist / Journal / Préférences), system tray, notifications toast.',
                        '<strong>Installeur</strong> : script Inno Setup, install dans Program Files, raccourcis Bureau + Menu Démarrer, tâche planifiée, exclusion Defender, désinstallation propre.',
                        '<strong>Build</strong> : PyInstaller single-file + Inno Setup, chaînés dans <code>build.bat</code> (alternative PowerShell dans <code>setup.bat</code>).'
                    ]
                },
                {
                    heading: 'Pourquoi c’est sur ce portfolio',
                    body: `Juice Jacking Guard est le projet où le réflexe builder rencontre le vrai systems programming : appels ctypes dans l’API Windows, discipline de threading qui ne deadlock pas, installeur qui survit à Defender, modèle de sécurité qui défaut sur "deny". Il montre aussi que je peux prendre une menace de niche, à moitié comprise (les payloads USB), et livrer une défense qui marche réellement sur la machine que vous utilisez pour lire ce texte.`
                }
            ]
        }
    };

    /* ========== SCROLL PROGRESS ========== */
    const progressBar = document.getElementById('scrollProgressBar');
    const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    /* ========== NAV: scrolled + active link ========== */
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const updateNav = () => {
        if (!nav) return;
        nav.classList.toggle('scrolled', window.scrollY > 20);
        // Keep the dark nav treatment while it sits over the dark hero (home only),
        // revert to light once the hero has scrolled past the nav.
        if (nav.classList.contains('nav-over-dark')) {
            const heroEl = document.getElementById('hero');
            const pastHero = heroEl ? window.scrollY >= heroEl.offsetHeight - 90 : true;
            nav.classList.toggle('nav-on-hero', !pastHero);
        }
    };

    const updateActiveLink = () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 120;
        let current = '';
        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
                current = sec.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', () => {
        updateNav();
        updateActiveLink();
    }, { passive: true });
    updateNav();

    /* ========== MENU OVERLAY (burger + full-screen sentence) ========== */
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        if (!menuOverlay || !menuToggle) return;
        menuOverlay.classList.add('open');
        menuOverlay.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close menu');
        document.body.classList.add('menu-open');
    };
    const closeMenu = () => {
        if (!menuOverlay || !menuToggle) return;
        menuOverlay.classList.remove('open');
        menuOverlay.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('menu-open');
    };
    const toggleMenu = () => {
        if (menuOverlay.classList.contains('open')) closeMenu();
        else openMenu();
    };

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);

    // Close on any link click inside overlay
    document.querySelectorAll('[data-menu-link]').forEach(link => {
        link.addEventListener('click', () => {
            // small delay so the click has time to trigger anchor scroll
            setTimeout(closeMenu, 60);
        });
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay?.classList.contains('open')) closeMenu();
    });

    /* ========== REVEAL ON SCROLL ========== */
    const revealEls = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
                    setTimeout(() => entry.target.classList.add('revealed'), delay);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('revealed'));
    }

    /* ========== COUNT UP ========== */
    const counterEls = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window) {
        const countObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    const duration = 1400;
                    const start = performance.now();
                    const startVal = 0;
                    const step = (now) => {
                        const t = Math.min(1, (now - start) / duration);
                        // easeOutCubic
                        const eased = 1 - Math.pow(1 - t, 3);
                        el.textContent = Math.round(startVal + (target - startVal) * eased);
                        if (t < 1) requestAnimationFrame(step);
                        else el.textContent = target;
                    };
                    requestAnimationFrame(step);
                    countObs.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        counterEls.forEach(el => countObs.observe(el));
    }

    /* ========== PROJECT FILTERS (null-safe: the home page no longer renders filter buttons) ========== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                projectCards.forEach(card => {
                    const cats = card.dataset.category || '';
                    const show = filter === 'all' || cats.includes(filter);
                    card.classList.toggle('hidden', !show);
                });
            });
        });
    }

    /* ========== CAROUSEL (auto-probing multi-image) ========== */
    // Probe an image URL. Returns the URL only if the server returns
    // status 200 AND a real image Content-Type, with NO redirect.
    // IONOS's mod_speling redirects missing files to similar ones
    // (e.g. realestate5.webp -> realestate.webp), so redirect:'error'
    // throws and we correctly return null.
    async function probeImage(url) {
        try {
            const res = await fetch(url, {
                method: 'HEAD',
                cache: 'no-store',
                redirect: 'error'
            });
            if (!res.ok) return null;
            const ct = (res.headers.get('content-type') || '').toLowerCase();
            if (ct.startsWith('image/') || ct === 'application/octet-stream') {
                return url;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async function findProjectImages(key) {
        const found = [];
        for (let i = 0; i < 20; i++) {
            const suffix = i === 0 ? '' : String(i);
            // Try .webp first, then .png
            const webp = await probeImage(`/assets/projects/${key}${suffix}.webp`);
            if (webp) { found.push(webp); continue; }
            const png = await probeImage(`/assets/projects/${key}${suffix}.png`);
            if (png) { found.push(png); continue; }
            // No image at this index, stop (but keep trying if base was missing)
            if (i > 0) break;
        }
        return found;
    }

    async function buildCarousel(key, container) {
        if (!container) return;
        const images = await findProjectImages(key);
        if (images.length === 0) {
            container.style.display = 'none';
            return;
        }

        // Single image, no controls needed
        if (images.length === 1) {
            container.innerHTML = `
                <div class="carousel">
                    <div class="carousel-track">
                        <img class="carousel-slide" src="${images[0]}" alt="Screenshot" loading="lazy">
                    </div>
                </div>`;
            return;
        }

        // Multiple images, full carousel
        const slidesHtml = images.map((src, i) => `
            <img class="carousel-slide${i === 0 ? ' active' : ''}" src="${src}" alt="Screenshot ${i + 1}" loading="lazy">`
        ).join('');

        const dotsHtml = images.map((_, i) => `
            <button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Image ${i + 1}"></button>`
        ).join('');

        container.innerHTML = `
            <div class="carousel" style="--slides:${images.length}" data-total="${images.length}">
                <div class="carousel-viewport">
                    <div class="carousel-track">
                        ${slidesHtml}
                    </div>
                </div>
                <button class="carousel-btn carousel-prev" aria-label="Previous">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button class="carousel-btn carousel-next" aria-label="Next">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>
                </button>
                <div class="carousel-footer">
                    <div class="carousel-dots">${dotsHtml}</div>
                    <div class="carousel-counter"><span class="carousel-current">1</span> / ${images.length}</div>
                </div>
            </div>`;

        // Wire up controls
        const carousel = container.querySelector('.carousel');
        const track = carousel.querySelector('.carousel-track');
        const viewport = carousel.querySelector('.carousel-viewport');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const counter = carousel.querySelector('.carousel-current');
        let current = 0;
        const total = images.length;

        const goTo = (idx) => {
            current = ((idx % total) + total) % total;
            const slideWidth = viewport.offsetWidth;
            track.style.transform = `translateX(-${current * slideWidth}px)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
            if (counter) counter.textContent = current + 1;
        };

        carousel.querySelector('.carousel-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(current - 1);
        });
        carousel.querySelector('.carousel-next').addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(current + 1);
        });
        dots.forEach(dot => dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(parseInt(dot.dataset.index));
        }));

        // Keyboard arrows (only when modal is open)
        const keyHandler = (e) => {
            if (e.key === 'ArrowLeft') goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
        };
        document.addEventListener('keydown', keyHandler);
        // Store cleanup reference on the container
        container._cleanupCarousel = () => document.removeEventListener('keydown', keyHandler);

        // Touch swipe support
        let touchStartX = 0;
        const swipeArea = carousel.querySelector('.carousel-viewport');
        swipeArea.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        swipeArea.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) goTo(dx > 0 ? current - 1 : current + 1);
        }, { passive: true });
    }

    /* ========== PROJECT MODAL ========== */
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');

    // Merge the FR overlay onto the EN base, per-index for arrays.
    const mergeProjectData = (base, overlay) => {
        if (!overlay) return base;
        const out = { ...base, ...overlay };
        if (overlay.meta && base.meta) {
            out.meta = base.meta.map((m, i) => ({ ...m, ...(overlay.meta[i] || {}) }));
        }
        if (overlay.sections && base.sections) {
            out.sections = base.sections.map((s, i) => {
                const o = overlay.sections[i] || {};
                const merged = { ...s, ...o };
                if (o.list && s.list) merged.list = s.list.map((it, j) => (o.list[j] !== undefined ? o.list[j] : it));
                return merged;
            });
        }
        if (overlay.download && base.download) {
            out.download = { ...base.download, ...overlay.download };
            if (overlay.download.primary && base.download.primary) out.download.primary = { ...base.download.primary, ...overlay.download.primary };
            if (overlay.download.secondary && base.download.secondary) out.download.secondary = { ...base.download.secondary, ...overlay.download.secondary };
        }
        return out;
    };

    const openModal = (key, isRerender = false) => {
        const baseData = projectsData[key];
        if (!baseData || !modal) return;
        const lang = (document.documentElement.lang === 'fr') ? 'fr' : 'en';
        const data = lang === 'fr' ? mergeProjectData(baseData, projectsDataFr[key]) : baseData;

        // Localised UI labels used inside the modal template
        const ui = lang === 'fr'
            ? { platform: 'Plateforme.', shaZip: 'SHA-256 (.zip).', shaExe: 'SHA-256 (.exe).', sha: 'SHA-256.' }
            : { platform: 'Platform.', shaZip: 'SHA-256 (.zip).', shaExe: 'SHA-256 (.exe).', sha: 'SHA-256.' };

        // Remember which project is open so we can re-render on language switch
        modal.dataset.openProject = key;

        // Build HTML
        let sectionsHtml = '';
        data.sections.forEach(sec => {
            sectionsHtml += `<h3>${sec.heading}</h3>`;
            if (sec.body) sectionsHtml += `<p>${sec.body}</p>`;
            if (sec.list) {
                sectionsHtml += '<ul>';
                sec.list.forEach(item => sectionsHtml += `<li>${item}</li>`);
                sectionsHtml += '</ul>';
            }
        });

        let metaHtml = '';
        data.meta.forEach(m => {
            metaHtml += `
                <div class="modal-meta-item">
                    <div class="modal-meta-label">${m.label}</div>
                    <div class="modal-meta-value">${m.value}</div>
                </div>`;
        });

        let techHtml = '';
        data.tech.forEach(t => techHtml += `<span>${t}</span>`);

        // Download block (any project that defines a `download` object)
        const renderDl = (d, primary) => d ? `
            <a class="modal-download-btn ${primary ? 'modal-download-btn-primary' : 'modal-download-btn-ghost'}" href="${d.url}" download rel="nofollow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>${d.label}</span>
            </a>` : '';
        const downloadHtml = data.download ? `
            <div class="modal-download">
                <div class="modal-download-buttons">
                    ${renderDl(data.download.primary || data.download, true)}
                    ${renderDl(data.download.secondary, false)}
                </div>
                <div class="modal-download-meta">
                    <div><strong>${ui.platform}</strong> ${data.download.platform || ''}</div>
                    ${data.download.primary ? `<div><strong>${ui.shaZip}</strong> <code>${data.download.primary.sha256}</code></div>` : ''}
                    ${data.download.secondary ? `<div><strong>${ui.shaExe}</strong> <code>${data.download.secondary.sha256}</code></div>` : ''}
                    ${(!data.download.primary && data.download.sha256) ? `<div><strong>${ui.sha}</strong> <code>${data.download.sha256}</code></div>` : ''}
                </div>
                <p class="modal-download-note">${data.download.note || ''}</p>
            </div>
        ` : '';

        // Newsletter preview + form (iabrew only)
        const iabrewExtra = key === 'iabrew' ? `
            <div class="newsletter-preview">
                <div class="newsletter-preview-bar">
                    <div class="preview-dots"><span></span><span></span><span></span></div>
                    <span class="preview-url" data-i18n="nl.preview.label">Latest issue preview</span>
                </div>
                <iframe src="assets/newsletter-preview.html" class="newsletter-preview-frame" loading="lazy" title="IA Brew newsletter preview" sandbox="allow-same-origin"></iframe>
            </div>
            <div id="modalFormPlaceholder" class="modal-form-placeholder"></div>
        ` : '';
        const formPlaceholder = key !== 'iabrew' ? '' : '';

        modalContent.innerHTML = `
            <div class="modal-hero">
                <div class="modal-hero-content">
                    <div class="modal-hero-eyebrow">${data.eyebrow}</div>
                    <h2>${data.title}</h2>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-meta">${metaHtml}</div>
                <div class="modal-tech">${techHtml}</div>
                ${downloadHtml}
                <div class="carousel-placeholder" data-project-key="${key}"></div>
                ${sectionsHtml}
                ${iabrewExtra}
            </div>`;

        // Build carousel for this project
        buildCarousel(key, modalContent.querySelector('.carousel-placeholder'));

        // Move the newsletter form into the placeholder (for iabrew only)
        if (key === 'iabrew') {
            const placeholder = document.getElementById('modalFormPlaceholder');
            const wrap = document.getElementById('newsletterWrap');
            if (placeholder && wrap) {
                wrap.hidden = false;
                placeholder.appendChild(wrap);
                if (typeof window.__loadBrevoForm === 'function') window.__loadBrevoForm();
            }
        }
        // Re-apply translations to newly-injected modal content (skip during a re-render
        // triggered by applyLang itself to avoid infinite recursion).
        if (!isRerender && window.__applyLang) window.__applyLang();

        if (!isRerender) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    // Expose a re-render hook for applyLang() to call when the modal is already open.
    window.__rerenderModal = (key) => openModal(key, true);

    const closeModal = () => {
        if (!modal) return;
        // Cleanup carousel keyboard listener
        const cp = modal.querySelector('.carousel-placeholder');
        if (cp && cp._cleanupCarousel) { cp._cleanupCarousel(); cp._cleanupCarousel = null; }
        // If the newsletter form is inside the modal, move it back to body before wiping content
        const wrap = document.getElementById('newsletterWrap');
        if (wrap && wrap.parentElement && wrap.parentElement.id === 'modalFormPlaceholder') {
            wrap.hidden = true;
            document.body.appendChild(wrap);
        }
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.project;
            if (key) openModal(key);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    /* ========== PORTRAIT IMAGE FALLBACK ========== */
    const portraitImg = document.getElementById('portraitImg');
    if (portraitImg) {
        portraitImg.addEventListener('error', () => {
            portraitImg.style.display = 'none';
        });
    }

    /* ========== SMOOTH SCROLL ========== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || !href) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 90;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ========== 3D TILT ON PROJECT CARDS (mouse tracking) ========== */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const tiltCards = document.querySelectorAll('.project-card');
        tiltCards.forEach(card => {
            const maxRotate = 6;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                const rx = -y * maxRotate;
                const ry = x * maxRotate;
                card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ========== MAGNETIC BUTTONS, disabled (no mouse-follow on buttons) ========== */
    if (false) {
        const magnets = document.querySelectorAll('.btn-inline, .menu-toggle, .footer-top-link, .newsletter-submit');
        magnets.forEach(el => {
            const strength = 0.25;
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    /* ========== MOUSE PARALLAX ON HERO (desktop only) ========== */
    if (window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) {
        const portrait = document.querySelector('.portrait-frame');
        const hero = document.querySelector('.hero');
        if (portrait && hero) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                portrait.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
            });
            hero.addEventListener('mouseleave', () => {
                portrait.style.transform = 'translate(0, 0)';
            });
        }
    }

    /* ========== STICKY CTA ========== */
    (function initStickyCta() {
        var cta = document.getElementById('stickyCta');
        if (!cta) return;
        var hero = document.getElementById('hero');
        var pastHero = !hero;
        var nearTarget = false;
        var visible = (typeof Set !== 'undefined') ? new Set() : null;

        function update() {
            var show = pastHero && !nearTarget;
            cta.classList.toggle('is-visible', show);
            cta.setAttribute('aria-hidden', show ? 'false' : 'true');
            cta.tabIndex = show ? 0 : -1;
        }

        if (!('IntersectionObserver' in window)) return;

        if (hero) {
            new IntersectionObserver(function (e) {
                pastHero = !e[0].isIntersecting;
                update();
            }, { threshold: 0 }).observe(hero);
        }

        // Hide the sticky CTA when the chat or contact block is on screen
        var targets = ['agent', 'contact', 'offer'].map(function (id) {
            return document.getElementById(id);
        }).filter(Boolean);

        if (visible && targets.length) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) visible.add(en.target);
                    else visible.delete(en.target);
                });
                nearTarget = visible.size > 0;
                update();
            }, { threshold: 0.12 });
            targets.forEach(function (t) { io.observe(t); });
        }
    })();

    /* ========== JOURNAL CARD STACK (vanilla port of 21st.dev animate-card-animation) ==========
       Builds the stack from the hidden .latest-articles block (kept intact for the
       blog cron, step 9) so new articles feed the stack automatically. Clones keep
       their data-i18n attributes so the language switch updates them in place. */
    (function initJournalStack() {
        var stack = document.getElementById('journalStack');
        var nextBtn = document.getElementById('journalStackNext');
        var source = document.querySelectorAll('.latest-articles .latest-card');
        if (!stack || !source.length) return;

        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var arrowSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M9.5 18L15.5 12L9.5 6"/></svg>';

        function attr(el, name) {
            return el && el.dataset.i18n ? ' data-i18n="' + el.dataset.i18n + '"' : '';
        }
        function txt(el) { return el ? el.textContent : ''; }

        /* Cover image per category (the reference card shows a real image panel). */
        function coverFor(catText) {
            var c = (catText || '').toLowerCase();
            if (c.indexOf('crm') !== -1) return '/assets/img/covers/crm.svg';
            if (c.indexOf('visibilit') !== -1 || c.indexOf('visibility') !== -1 || c.indexOf('geo') !== -1) return '/assets/img/covers/geo.svg';
            if (c.indexOf('data') !== -1) return '/assets/img/covers/data.svg';
            if (c.indexOf('business') !== -1 || c.indexOf('growth') !== -1) return '/assets/img/covers/business.svg';
            if (c.indexOf('ia') !== -1 || c.indexOf('ai') !== -1 || c.indexOf('agent') !== -1) return '/assets/img/covers/ia.svg';
            return '/assets/img/covers/default.svg';
        }

        var cards = [];
        source.forEach(function (src, i) {
            var card = document.createElement('a');
            card.className = 'mh-stack-card';
            card.setAttribute('href', src.getAttribute('href'));
            if (src.dataset.enHref) card.setAttribute('data-en-href', src.dataset.enHref);
            var cat = src.querySelector('.latest-card-cat');
            var date = src.querySelector('.latest-card-date');
            var title = src.querySelector('.latest-card-title');
            card.innerHTML =
                '<span class="mh-stack-visual" aria-hidden="true"><img src="' + coverFor(txt(cat)) + '" alt="" loading="lazy" decoding="async"></span>' +
                '<span class="mh-stack-body">' +
                    '<span class="mh-stack-text">' +
                        '<span class="mh-stack-title"' + attr(title) + '>' + txt(title) + '</span>' +
                        '<span class="mh-stack-date"><span' + attr(cat) + '>' + txt(cat) + '</span> &middot; <span' + attr(date) + '>' + txt(date) + '</span></span>' +
                    '</span>' +
                    '<span class="mh-stack-read"><span data-i18n="stack.read">Read</span>' + arrowSvg + '</span>' +
                '</span>';
            stack.appendChild(card);
            cards.push(card);
        });

        // The stack clones were added after the initial applyLang pass: re-apply
        // so their text and hrefs match the active language right away.
        if (typeof window.__applyLang === 'function') window.__applyLang();

        var order = cards.slice();
        var animating = false;

        function paint() {
            order.forEach(function (card, i) {
                card.classList.remove('pos-0', 'pos-1', 'pos-2');
                card.classList.add('pos-' + Math.min(i, 2));
            });
        }
        paint();

        function advance() {
            if (animating || order.length < 2) return;
            animating = true;
            var front = order.shift();
            order.push(front);
            if (reduced) {
                front.classList.remove('pos-0');
                paint();
                animating = false;
                return;
            }
            front.classList.remove('pos-0');
            front.classList.add('is-exiting');
            paint();
            setTimeout(function () {
                front.classList.remove('is-exiting');
                front.classList.add('is-entering');
                paint();
                // force reflow so the entering card lands instantly at the back...
                void front.offsetWidth;
                // ...then re-enable transitions for the next cycle.
                front.classList.remove('is-entering');
                animating = false;
            }, 640);
        }

        if (nextBtn) nextBtn.addEventListener('click', advance);

        // Auto-advance every 5s: paused on hover, off-screen, hidden tab, reduced motion.
        if (!reduced) {
            var hovered = false;
            var visible = true;
            stack.addEventListener('mouseenter', function () { hovered = true; });
            stack.addEventListener('mouseleave', function () { hovered = false; });
            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) {
                    visible = entries[0].isIntersecting;
                }, { threshold: 0.25 }).observe(stack);
            }
            setInterval(function () {
                if (visible && !hovered && !document.hidden) advance();
            }, 5000);
        }
    })();

    /* ========== v5.1 : QUESTION AUTO-TYPÉE (maquette : 42ms/char, pause 3200ms, retape) ========== */
    (function initTypedCard() {
        var out = document.getElementById('typedText');
        if (!out) return;
        function msg() {
            var lang = (document.documentElement.lang || 'fr').indexOf('en') === 0 ? 'en' : 'fr';
            var e = (typeof i18n !== 'undefined' && i18n['typed.q1']) || null;
            return (e && e[lang]) || out.textContent;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            out.textContent = msg();
            return;
        }
        var ci = 0;
        (function type() {
            var full = msg();
            if (ci <= full.length) {
                out.textContent = full.slice(0, ci);
                ci++;
                setTimeout(type, 42);
            } else {
                setTimeout(function () { ci = 0; type(); }, 3200);
            }
        })();
    })();

    /* ========== v5.1 : SLIDER DU BANDEAU (boucle infinie sans couture) ========== */
    (function initBandSlider() {
        var track = document.getElementById('bandTrack');
        if (!track) return;
        var lines = track.children;
        if (lines.length < 4) return;
        var LINE_H = 52;
        var pos = 0;
        function paint(p, noTrans) {
            track.classList.toggle('no-trans', !!noTrans);
            track.style.transform = 'translateY(' + (-p * LINE_H) + 'px)';
            for (var i = 0; i < lines.length; i++) {
                lines[i].classList.toggle('is-active', i === p + 1);
            }
        }
        paint(pos, false);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setInterval(function () {
            if (document.hidden) return;
            pos += 1;
            if (pos > 3) {
                // Les 3 phrases sont doublees : l'etat pos 3 est visuellement
                // identique a pos 0. On se recale donc en silence (sans transition)
                // puis on anime vers la ligne suivante : boucle sans fin visible.
                pos -= 3;
                paint(pos - 1, true);
                void track.offsetWidth;
            }
            paint(pos, false);
        }, 2600);
    })();

    /* ========== v5.1 : MARQUEE LOGOS PILOTE PAR LE BACK OFFICE ========== */
    // Le bandeau lit assets/data/logos.json (gere depuis /admin, onglet Logos).
    // En cas d'echec ou de liste vide, le HTML bake reste tel quel.
    (function initLogosMarquee() {
        var track = document.querySelector('.v5-logos-track');
        if (!track || !window.fetch) return;
        fetch('/assets/data/logos.json', { cache: 'no-cache' }).then(function (r) {
            if (!r.ok) throw new Error('http ' + r.status);
            return r.json();
        }).then(function (data) {
            var list = data && data.logos;
            if (!Array.isArray(list) || !list.length) return;
            var groups = track.querySelectorAll('.v5-logos-group');
            if (!groups.length) return;
            var html = '';
            var names = [];
            for (var i = 0; i < list.length; i++) {
                var l = list[i];
                if (!l || typeof l.file !== 'string' || l.file.indexOf('/assets/') !== 0) continue;
                var h = Math.max(20, Math.min(80, parseInt(l.h, 10) || 46));
                if (l.alt) names.push(String(l.alt));
                var img = '<img src="' + encodeURI(l.file) + '" alt="" style="height:' + h + 'px' +
                          (l.white ? ';filter:brightness(.35)' : '') + '" loading="lazy" decoding="async">';
                if (typeof l.href === 'string' && /^https?:\/\//.test(l.href)) {
                    img = '<a href="' + encodeURI(l.href) + '" target="_blank" rel="noopener nofollow" tabindex="-1">' + img + '</a>';
                }
                html += img + '<span class="sep" aria-hidden="true">&#10035;</span>';
            }
            if (!html) return;
            // Le marquee boucle sur -50% de la piste : chaque groupe doit etre au
            // moins aussi large que l'ecran, sinon un trou apparait en fin de cycle.
            // On mesure une passe puis on repete la sequence autant que necessaire.
            track.setAttribute('aria-hidden', 'true');
            var sr = document.getElementById('logosSr');
            if (sr && names.length) sr.textContent = names.join(', ') + '.';
            groups[0].innerHTML = html;
            var gw = groups[0].scrollWidth;
            var need = Math.max(window.innerWidth * 1.15, 1600);
            var times = (gw > 40) ? Math.max(1, Math.ceil(need / gw)) : 1;
            var full = html;
            for (var r = 1; r < times; r++) full += html;
            for (var gi = 0; gi < groups.length; gi++) {
                groups[gi].innerHTML = full;
            }
            // Vitesse constante (~55 px/s, le rythme de la maquette) quelle que soit
            // la largeur de la piste : sans cela, repeter les logos accelere le defilement
            // (l'animation parcourt -50% de piste en une duree fixe).
            var gw2 = groups[0].scrollWidth;
            if (gw2 > 0) {
                track.style.animationDuration = Math.max(20, Math.round(gw2 / 55)) + 's';
            }
        }).catch(function () { /* fallback : marquee bake */ });
    })();


    /* ========== v5.1 : BENTO SERVICES EXPANSIBLE (flex 1 → 2.4 au survol) ========== */
    (function initBento() {
        var cards = document.querySelectorAll('[data-bento]');
        if (!cards.length) return;
        function activate(card) {
            var row = card.closest('.v5-bento-row');
            if (!row) return;
            row.querySelectorAll('[data-bento]').forEach(function (c) {
                c.classList.toggle('is-active', c === card);
            });
        }
        cards.forEach(function (c) {
            c.addEventListener('mouseenter', function () { activate(c); });
            c.addEventListener('focusin', function () { activate(c); });
        });
    })();

    /* ========== v5.1 : SCROLLYTELLING 3E VOIE (wrap 340vh épinglé) ========== */
    (function initVoie() {
        var wrap = document.getElementById('voieWrap');
        if (!wrap) return;
        var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[data-voie-tab]'));
        var panels = Array.prototype.slice.call(wrap.querySelectorAll('[data-voie-panel]'));
        var n = panels.length;
        if (!n) return;
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var current = 0;
        function setActive(i) {
            if (i === current) return;
            current = i;
            panels.forEach(function (p, k) {
                p.classList.toggle('is-active', k === i);
                p.classList.toggle('is-before', k < i);
            });
            tabs.forEach(function (t, k) {
                t.classList.toggle('is-active', k === i);
                t.setAttribute('aria-selected', k === i ? 'true' : 'false');
            });
        }
        function pinned() {
            // Le scrollytelling est actif a toutes les largeurs (mobile compris) ;
            // seul prefers-reduced-motion bascule sur les panneaux statiques.
            return !reduced;
        }
        tabs.forEach(function (t, k) {
            t.addEventListener('click', function () {
                if (pinned()) {
                    var total = wrap.offsetHeight - window.innerHeight;
                    var top = window.scrollY + wrap.getBoundingClientRect().top;
                    window.scrollTo({ top: top + (total * (k + 0.5)) / n, behavior: 'smooth' });
                } else {
                    setActive(k);
                }
            });
        });
        var ticking = false;
        function update() {
            var total = wrap.offsetHeight - window.innerHeight;
            if (total <= 0) return;
            var p = Math.min(0.999, Math.max(0, -wrap.getBoundingClientRect().top / total));
            setActive(Math.min(n - 1, Math.floor(p * n)));
        }
        function onScroll() {
            if (!pinned() || ticking) return;
            ticking = true;
            var done = false;
            function run() {
                if (done) return;
                done = true;
                ticking = false;
                update();
            }
            // rAF pour caler la mise a jour sur le rendu, setTimeout en filet
            // (onglet en arriere-plan : le rAF peut rester gele, pas le timer).
            requestAnimationFrame(run);
            setTimeout(run, 120);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    })();

    /* ========== AGENT CHAT ========== */
    (function initAgentChat() {
        const chat       = document.getElementById('agent-chat');
        const form       = document.getElementById('agent-form');
        const textarea   = document.getElementById('agent-text');
        const sendBtn    = form ? form.querySelector('.agent-send') : null;
        const contactBox = document.getElementById('agent-contact');
        let contactSent  = false; // prevent multiple sends

        if (!chat || !form || !textarea) return;

        // Conversation state
        const history = []; // [{role:'user'|'assistant', content:string}, ...]

        const tr = (key, fallback) => {
            const cur = (typeof window.currentLang === 'string') ? window.currentLang
                       : (localStorage.getItem('mh_lang') || 'fr');
            const entry = (typeof i18n === 'object' && i18n && i18n[key]) ? i18n[key] : null;
            return entry ? (entry[cur] || entry.fr || fallback) : fallback;
        };

        const currentLang = () => (localStorage.getItem('mh_lang') || 'fr') === 'en' ? 'en' : 'fr';

        // Auto-resize textarea
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
        });

        // Submit on Enter (Shift+Enter = newline)
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                form.requestSubmit();
            }
        });

        // Escape HTML then convert a tiny subset of markdown (**bold**, *italic*, line breaks, simple links)
        const escapeHtml = (s) => s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const formatReply = (text) => {
            let s = escapeHtml(text);
            // **bold** (non-greedy, must not span newlines)
            s = s.replace(/\*\*([^\n*]+?)\*\*/g, '<strong>$1</strong>');
            // *italic* (only when not adjacent to another *, to avoid clobbering bold leftovers)
            s = s.replace(/(^|[^*])\*([^\n*]+?)\*(?!\*)/g, '$1<em>$2</em>');
            // bare URLs -> links (open in new tab, rel safe)
            s = s.replace(/(https?:\/\/[^\s<]+?)([.,!?:;]*)(?=\s|<|$)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>$2');
            // line breaks
            s = s.replace(/\n/g, '<br>');
            return s;
        };

        const addMsg = (role, text) => {
            const wrap = document.createElement('div');
            wrap.className = 'agent-msg agent-msg-' + (role === 'user' ? 'user' : 'bot');
            const bubble = document.createElement('div');
            bubble.className = 'agent-bubble';
            if (role === 'user') {
                bubble.textContent = text; // never trust visitor input
            } else {
                bubble.innerHTML = formatReply(text);
            }
            wrap.appendChild(bubble);
            chat.appendChild(wrap);
            chat.scrollTop = chat.scrollHeight;
            return wrap;
        };

        const addTyping = () => {
            const wrap = document.createElement('div');
            wrap.className = 'agent-msg agent-msg-bot';
            wrap.dataset.typing = '1';
            wrap.innerHTML = '<div class="agent-bubble"><span class="agent-typing"><span></span><span></span><span></span></span></div>';
            chat.appendChild(wrap);
            chat.scrollTop = chat.scrollHeight;
            return wrap;
        };

        const addCtaBtn = (bubbleEl) => {
            if (!bubbleEl || contactSent) return;
            if (bubbleEl.querySelector('.agent-cta-btn')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'agent-cta-btn';
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' + tr('agent.cta_recontact', 'Je peux vous recontacter ?');
            btn.addEventListener('click', () => {
                btn.remove();
                showInlineContactForm();
            });
            bubbleEl.appendChild(document.createElement('br'));
            bubbleEl.appendChild(btn);
        };

        // Injects the contact form directly inside a bot bubble (in-chat UX)
        const showInlineContactForm = () => {
            if (contactSent) return;
            const wrap = document.createElement('div');
            wrap.className = 'agent-msg agent-msg-bot';
            const bubble = document.createElement('div');
            bubble.className = 'agent-bubble';

            const intro = document.createElement('p');
            intro.className = 'agent-inline-intro';
            intro.textContent = tr('agent.contact_intro', 'Très bien. Laissez-moi vos coordonnées ci-dessous, je reviens vers vous sous 24h :');
            bubble.appendChild(intro);

            const f = document.createElement('form');
            f.className = 'agent-inline-form';
            f.autocomplete = 'on';
            f.innerHTML = `
                <div class="agent-inline-row">
                    <input type="text" name="first_name" required maxlength="60"
                           placeholder="${tr('agent.contact_first','Prénom')}" autocomplete="given-name">
                    <input type="text" name="last_name" required maxlength="60"
                           placeholder="${tr('agent.contact_last','Nom')}" autocomplete="family-name">
                </div>
                <input type="email" name="email" required maxlength="120"
                       placeholder="${tr('agent.contact_email','email@exemple.com')}" autocomplete="email">
                <input type="tel" name="phone" maxlength="30"
                       placeholder="${tr('agent.contact_phone','Téléphone (optionnel)')}" autocomplete="tel">
                <input type="text" name="website" tabindex="-1" autocomplete="off"
                       style="position:absolute;left:-9999px;opacity:0;pointer-events:none" aria-hidden="true">
                <label class="agent-inline-consent" style="display:flex;gap:8px;align-items:flex-start;margin:2px 0 4px;font-size:11.5px;line-height:1.45;color:var(--ink-500,#6b6b6b);text-align:left;">
                    <input type="checkbox" class="agent-consent" required style="margin-top:2px;flex:0 0 auto;width:15px;height:15px;accent-color:var(--albert-royal,#8B1A2F);">
                    <span>${tr('agent.contact_consent','J’accepte d’être recontacté(e). <a href="/confidentialite" target="_blank" rel="noopener">Confidentialité</a>.')}</span>
                </label>
                <button type="submit" class="agent-inline-submit">
                    ${tr('agent.contact_submit','Envoyer mes coordonnées')}
                </button>
                <p class="agent-inline-error" role="alert" aria-live="polite"></p>
            `;
            bubble.appendChild(f);
            wrap.appendChild(bubble);
            chat.appendChild(wrap);
            chat.scrollTop = chat.scrollHeight;

            const errEl = f.querySelector('.agent-inline-error');
            const submit = f.querySelector('.agent-inline-submit');
            setTimeout(() => f.querySelector('input[name="first_name"]')?.focus(), 250);

            f.addEventListener('submit', async (ev) => {
                ev.preventDefault();
                const fd = new FormData(f);
                const payload = {
                    first_name: (fd.get('first_name') || '').toString().trim(),
                    last_name:  (fd.get('last_name')  || '').toString().trim(),
                    email:      (fd.get('email')      || '').toString().trim(),
                    phone:      (fd.get('phone')      || '').toString().trim(),
                    website:    (fd.get('website')    || '').toString(),
                    summary:    buildSummary() + '\n\nConsentement RGPD / GDPR consent: YES (' + new Date().toISOString() + ')',
                    consent:    true,
                    lang:       currentLang()
                };

                errEl.textContent = '';

                // Quick client-side email check
                const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
                if (!payload.first_name || !payload.last_name || !okEmail) {
                    errEl.textContent = tr('agent.contact_invalid_email', 'Merci d’entrer un email valide.');
                    return;
                }
                const consentBox = f.querySelector('.agent-consent');
                if (consentBox && !consentBox.checked) {
                    errEl.textContent = tr('agent.contact_consent_required', 'Merci de cocher la case de consentement.');
                    return;
                }

                submit.disabled = true;
                submit.textContent = '...';

                try {
                    const res = await fetch('/api/contact.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await res.json().catch(() => ({}));
                    if (res.ok && data.ok) {
                        // Replace the form bubble with a confirmation bubble
                        contactSent = true;
                        bubble.innerHTML = '';
                        const ok = document.createElement('div');
                        ok.className = 'agent-inline-success';
                        ok.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg><span>' + tr('agent.contact_success', 'Reçu, merci. Je vous recontacte sous 24h.') + '</span>';
                        bubble.appendChild(ok);
                        chat.scrollTop = chat.scrollHeight;
                    } else {
                        errEl.textContent = tr('agent.contact_error', 'Envoi impossible. Merci de m’écrire directement.');
                        submit.disabled = false;
                        submit.textContent = tr('agent.contact_submit','Envoyer mes coordonnées');
                    }
                } catch (err) {
                    errEl.textContent = tr('agent.contact_error', 'Envoi impossible. Merci de m’écrire directement.');
                    submit.disabled = false;
                    submit.textContent = tr('agent.contact_submit','Envoyer mes coordonnées');
                    console.error('[agent contact]', err);
                }
            });
        };

        const buildSummary = () => {
            return history.map(m => (m.role === 'user' ? 'Visiteur : ' : 'Agent : ') + m.content).join('\n\n');
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = textarea.value.trim();
            if (!text) return;

            // Lock UI
            sendBtn.disabled = true;
            textarea.disabled = true;

            // Visitor bubble
            addMsg('user', text);
            history.push({ role: 'user', content: text });
            textarea.value = '';
            textarea.style.height = 'auto';

            // Typing indicator
            const typingEl = addTyping();

            try {
                const res = await fetch('/api/chat.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: history,
                        lang: currentLang()
                    })
                });

                typingEl.remove();

                if (res.status === 429) {
                    const wrap = addMsg('bot', tr('agent.error_rate', 'Trop de messages. Réessayez dans une heure.'));
                    return;
                }
                if (!res.ok) {
                    addMsg('bot', tr('agent.error_generic', 'Une erreur est survenue. Merci de réessayer.'));
                    return;
                }

                const data = await res.json();
                const reply = (data.reply || '').trim();
                if (!reply) {
                    addMsg('bot', tr('agent.error_generic', 'Une erreur est survenue. Merci de réessayer.'));
                    return;
                }
                const botWrap = addMsg('bot', reply);
                history.push({ role: 'assistant', content: reply });

                if (data.suggest_contact) {
                    addCtaBtn(botWrap.querySelector('.agent-bubble'));
                }
            } catch (err) {
                typingEl.remove();
                addMsg('bot', tr('agent.error_generic', 'Une erreur est survenue. Merci de réessayer.'));
                console.error('[agent]', err);
            } finally {
                sendBtn.disabled = false;
                textarea.disabled = false;
                textarea.focus();
            }
        });

    })();

})();
