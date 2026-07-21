/* =========================================================================
   ui.js - shared UI layer v5.1 « Olive & Terracotta » (2026-07, zip handoff)
   1. Injects the liquid-glass SVG filter (#lg-filter) used by .btn-liquid.
   2. Normalizes the nav on interior pages: MH monogram wordmark + the same
      4 anchor links as the handoff home (Services / Approche / Projets /
      Contact). No burger menu in v5 (.menu-toggle/.menu-overlay hidden).
   3. Injects the permanent booking CTA in the nav on interior pages.
   4. Animates [data-dither] layers: EXACT port of the handoff mock dither
      (Mathieu Portfolio.dc.html _ensureDither): 440x276 canvas stretched to
      the card, coarse warped-fbm stripe field on a 4px lattice, bilinear
      upsample, sigmoid cut, 4x4 ordered Bayer, ~33fps. Speed 0.55 and
      density 20 (mock defaults) via data-dither-speed / data-dither-density;
      color from data-dither-color or CSS --dither-color (#C95E27).
   ES5-friendly: no arrow fns, no template literals, no let/const.
   ========================================================================= */
(function () {
    'use strict';

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function isEN() {
        var lang = (document.documentElement.getAttribute('lang') || 'fr').toLowerCase();
        return lang.indexOf('en') === 0;
    }

    /* ---------- 1. Liquid-glass SVG filter (literal GlassFilter port) ---------- */
    function injectGlassFilter() {
        if (document.getElementById('lg-filter')) return;
        var holder = document.createElement('div');
        holder.setAttribute('aria-hidden', 'true');
        holder.style.position = 'absolute';
        holder.style.width = '0';
        holder.style.height = '0';
        holder.style.overflow = 'hidden';
        holder.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" focusable="false">' +
            '<defs><filter id="lg-filter" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence"/>' +
            '<feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise"/>' +
            '<feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced"/>' +
            '<feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur"/>' +
            '<feComposite in="finalBlur" in2="finalBlur" operator="over"/>' +
            '</filter></defs></svg>';
        document.body.appendChild(holder);
    }

    /* ---------- 2. Nav v5.1 : monogramme MH + liens d'ancres (pages intérieures) ---------- */
    function normalizeNav() {
        var en = isEN();

        /* Wordmark : l'ancien « mathieu haye. » devient le monogramme MH */
        var marks = document.querySelectorAll('.nav-logo-wordmark, .footer-wordmark');
        for (var m = 0; m < marks.length; m++) {
            var txt = (marks[m].textContent || '').toLowerCase();
            if (txt.indexOf('mathieu') !== -1 || txt.replace(/\s/g, '') === 'mh') {
                if (marks[m].className.indexOf('footer') !== -1) {
                    marks[m].innerHTML = 'MH.';
                } else {
                    marks[m].innerHTML = '<img src="/assets/img/logo-mh.svg" alt="MH" width="34" height="34">';
                }
            }
        }

        /* Liens d'ancres vers les sections de la home (la home a les siens en dur) */
        if (document.querySelector('.nav-links') || document.querySelector('.v51-nav')) return;
        var slot = document.querySelector('.nav-container');
        if (!slot) return;
        var home = en ? '/en/' : '/';
        /* [hrefFR, hrefEN, labelFR, labelEN] — vraies pages pour le maillage interne */
        var L = [
            [home + '#services', home + '#services', 'Services', 'Services'],
            ['/projets', '/en/projects', 'Projets', 'Projects'],
            ['/blog/', '/blog/en/', 'Journal', 'Journal'],
            ['/discuter-avec-mon-ia', '/en/chat-with-my-ai', 'Mon IA', 'My AI'],
            [home + '#contact', home + '#contact', 'Contact', 'Contact']
        ];
        var div = document.createElement('div');
        div.className = 'nav-links';
        div.setAttribute('aria-label', 'Navigation');
        var html = '';
        for (var i = 0; i < L.length; i++) {
            if (i === 0) {
                html += '<span class="nav-drop">' +
                    '<a class="nav-drop-trigger" href="' + (en ? L[i][1] : L[i][0]) + '" aria-haspopup="true" aria-expanded="false">' + (en ? L[i][3] : L[i][2]) + '</a>' +
                    '<svg class="nav-drop-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                    svcMenuHtml(en) + '</span>';
            } else {
                html += '<a href="' + (en ? L[i][1] : L[i][0]) + '">' + (en ? L[i][3] : L[i][2]) + '</a>';
            }
        }
        div.innerHTML = html;
        var actions = slot.querySelector('.nav-actions');
        if (actions) slot.insertBefore(div, actions);
        else slot.appendChild(div);
    }

    /* ---------- 3. Permanent booking CTA in the nav (interior pages) ---------- */
    function injectNavBook() {
        if (document.querySelector('.nav-book') || document.querySelector('.v51-nav')) return;
        var slot = document.querySelector('.nav-actions');
        if (!slot) return;
        var a = document.createElement('a');
        a.className = 'nav-book';
        a.href = 'https://calendly.com/mathieu-haye/30min';
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML =
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' +
            '<span>' + (isEN() ? 'Book a call' : 'Réserver un appel') + '</span>';
        slot.appendChild(a);
    }

    /* ---------- 4. Dither maquette ([data-dither]) — port exact du zip ---------- */
    function initDither() {
        var els = document.querySelectorAll('[data-dither]');
        if (!els.length || !window.HTMLCanvasElement) return;

        var reduced = false;
        try {
            reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        } catch (err) { /* noop */ }
        if (!window.requestAnimationFrame) reduced = true;

        var BAYER = [
            [0, 8, 2, 10],
            [12, 4, 14, 6],
            [3, 11, 1, 9],
            [15, 7, 13, 5]
        ];

        /* Parse #rgb / #rrggbb / rgb(a) -> [r,g,b] */
        function parseColor(s) {
            if (!s) return null;
            s = String(s).replace(/\s+/g, '');
            var m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(s);
            if (m) {
                return [
                    parseInt(m[1] + m[1], 16),
                    parseInt(m[2] + m[2], 16),
                    parseInt(m[3] + m[3], 16)
                ];
            }
            m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(s);
            if (m) {
                return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
            }
            m = /^rgba?\((\d+),(\d+),(\d+)/.exec(s);
            if (m) {
                return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
            }
            return null;
        }

        function resolveColor(el) {
            var rgb = parseColor(el.getAttribute('data-dither-color'));
            if (!rgb) {
                try {
                    var cs = window.getComputedStyle(el);
                    rgb = parseColor(cs.getPropertyValue('--dither-color'));
                } catch (err) { /* noop */ }
            }
            return rgb || [201, 94, 39]; /* terracotta #C95E27 */
        }

        function setup(el) {
            var canvas = document.createElement('canvas');
            canvas.setAttribute('aria-hidden', 'true');
            el.appendChild(canvas);
            var ctx = canvas.getContext('2d');
            if (!ctx) return;

            var rgb = resolveColor(el);
            var cR = rgb[0], cG = rgb[1], cB = rgb[2];
            var SPEED = parseFloat(el.getAttribute('data-dither-speed'));
            if (!SPEED || SPEED !== SPEED) SPEED = 0.55;   /* défaut maquette */
            var DENSITY = parseFloat(el.getAttribute('data-dither-density'));
            if (!DENSITY || DENSITY !== DENSITY) DENSITY = 20; /* défaut maquette */
            var cut = 1.066 - 0.0086 * DENSITY;
            var blendAttr = el.getAttribute('data-dither-blend');
            if (blendAttr) el.style.mixBlendMode = blendAttr;

            /* mode « fin » de la maquette : 440 de large, ratio 0.627, étiré en CSS */
            var W = 440, H = Math.round(W * 0.627);
            canvas.width = W;
            canvas.height = H;
            var ST = 4, CW = Math.ceil(W / ST) + 1, CH = Math.ceil(H / ST) + 1;
            var F = new Float32Array(CW * CH);
            var img = ctx.createImageData(W, H);

            /* value-noise + fbm + double domain warp (copie du DCLogic) */
            var T = new Float32Array(64 * 64);
            var seed = 1;
            for (var ti = 0; ti < T.length; ti++) {
                seed = seed * 16807 % 2147483647;
                T[ti] = seed / 2147483647;
            }
            function noise(x, y) {
                var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
                var i00 = (ix & 63) + ((iy & 63) << 6), i10 = ((ix + 1) & 63) + ((iy & 63) << 6),
                    i01 = (ix & 63) + (((iy + 1) & 63) << 6), i11 = ((ix + 1) & 63) + (((iy + 1) & 63) << 6);
                var u = fx * fx * (3 - 2 * fx), w = fy * fy * (3 - 2 * fy);
                return T[i00] * (1 - u) * (1 - w) + T[i10] * u * (1 - w) + T[i01] * (1 - u) * w + T[i11] * u * w;
            }
            function fbm(x, y) {
                return (noise(x, y) + 0.5 * noise(x * 2 + 13.1, y * 2 + 7.7) + 0.25 * noise(x * 4 + 29.3, y * 4 + 17.9)) / 1.75;
            }

            var st = { t: 2.3, last: 0, acc: 0, speed: 1, visible: true };

            function draw() {
                var t = st.t, cx, cy, x, y;
                /* champ grossier : rayures pliées par un fbm double-warpé = veines marbrées */
                for (cy = 0; cy < CH; cy++) {
                    for (cx = 0; cx < CW; cx++) {
                        var px = cx * ST * 0.007, py = cy * ST * 0.008;
                        var w1 = fbm(px + t * 0.10, py);
                        var u = fbm(px + 2.2 * w1 + t * 0.05, py + 1.4 + 0.8 * w1);
                        F[cy * CW + cx] = 0.5 + 0.5 * Math.sin(px * 1.8 + py * 1.0 + 10 * u + t * 0.06);
                    }
                }
                var d = img.data;
                for (y = 0; y < H; y++) {
                    var gy = y / ST, cy0 = Math.floor(gy), fy = gy - cy0;
                    var row0 = cy0 * CW, row1 = Math.min(cy0 + 1, CH - 1) * CW;
                    var brow = BAYER[y & 3];
                    for (x = 0; x < W; x++) {
                        var gx = x / ST, cx0 = Math.floor(gx), fx = gx - cx0;
                        var cx1 = Math.min(cx0 + 1, CW - 1);
                        var v = (F[row0 + cx0] * (1 - fx) + F[row0 + cx1] * fx) * (1 - fy)
                              + (F[row1 + cx0] * (1 - fx) + F[row1 + cx1] * fx) * fy;
                        var sg = 1 / (1 + Math.exp(-(v - cut) * 22));
                        var on = sg > (brow[x & 3] + 0.5) / 16;
                        var i = (y * W + x) * 4;
                        d[i] = cR; d[i + 1] = cG; d[i + 2] = cB; d[i + 3] = on ? 255 : 0;
                    }
                }
                ctx.putImageData(img, 0, 0);
            }

            draw(); /* première frame immédiate (la boucle prend le relais ensuite) */
            if (reduced) return;

            /* Pause hors écran */
            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) {
                    st.visible = entries[0].isIntersecting;
                }, { threshold: 0 }).observe(el);
            }

            /* Survol de la carte hôte : accélération x3 */
            var host = (el.closest ? el.closest('[data-dither-host]') : null) || el.parentNode;
            if (host && host.addEventListener) {
                host.addEventListener('mouseenter', function () { st.speed = 3; });
                host.addEventListener('mouseleave', function () { st.speed = 1; });
            }

            function frame(now) {
                window.requestAnimationFrame(frame);
                if (!st.visible) { st.last = now; return; }
                var dt = st.last ? Math.min(80, now - st.last) : 16;
                st.last = now;
                st.t += dt * 0.001 * SPEED * 3 * st.speed;
                st.acc += dt;
                if (st.acc < 30) return; /* ~33fps (maquette) */
                st.acc = 0;
                draw();
            }
            window.requestAnimationFrame(frame);
        }

        for (var k = 0; k < els.length; k++) setup(els[k]);
    }


    /* ---------- Consentement (CMP maison, consent mode v2) + Calendly mesurable ---------- */
    /* Renseigner l'ID de conversion Google Ads quand il existera : 'AW-XXXXXXXXX/label' */
    var MH_ADS_CONV = '';
    var CONSENT_KEY = 'mh-consent';

    function gtagSafe() { if (typeof window.gtag === 'function') window.gtag.apply(null, arguments); }

    function consentRead() {
        try {
            var raw = localStorage.getItem(CONSENT_KEY);
            if (!raw) return null;
            var o = JSON.parse(raw);
            /* CNIL : choix valable 13 mois maximum, ensuite on redemande */
            if (!o || typeof o.g !== 'boolean' || (Date.now() - (o.t || 0)) > 395 * 864e5) return null;
            return o;
        } catch (e) { return null; }
    }

    function consentStore(granted) {
        try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: 1, g: granted, t: Date.now() })); } catch (e) { /* noop */ }
    }

    function consentApply(granted) {
        gtagSafe('consent', 'update', {
            ad_storage: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: granted ? 'granted' : 'denied'
        });
        gtagSafe('set', 'ads_data_redaction', !granted);
    }

    function consentBanner() {
        if (document.querySelector('.mh-consent')) return;
        var en = isEN();
        var el = document.createElement('div');
        el.className = 'mh-consent';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-label', en ? 'Cookies' : 'Cookies');
        el.innerHTML =
            '<p>' + (en
                ? 'This site measures its audience and ad conversions (Google Analytics / Ads) only if you accept.'
                : 'Ce site mesure son audience et ses conversions publicitaires (Google Analytics / Ads) uniquement si vous l\u2019acceptez.') +
            ' <a href="/confidentialite">' + (en ? 'Learn more' : 'En savoir plus') + '</a></p>' +
            '<div class="mh-consent-row">' +
            '<button type="button" class="mh-consent-btn mh-consent-ok">' + (en ? 'Accept' : 'Accepter') + '</button>' +
            '<button type="button" class="mh-consent-btn mh-consent-no">' + (en ? 'Decline' : 'Refuser') + '</button>' +
            '</div>';
        document.body.appendChild(el);
        function done(granted) {
            consentStore(granted);
            consentApply(granted);
            el.parentNode && el.parentNode.removeChild(el);
        }
        el.querySelector('.mh-consent-ok').addEventListener('click', function () { done(true); });
        el.querySelector('.mh-consent-no').addEventListener('click', function () { done(false); });
    }

    function initConsent() {
        var c = consentRead();
        if (c) consentApply(c.g);
        else consentBanner();
        window.mhConsentOpen = consentBanner;
        document.addEventListener('click', function (e) {
            var t = e.target.closest ? e.target.closest('[data-consent-open]') : null;
            if (t) { e.preventDefault(); consentBanner(); }
        });
        /* Lien « Cookies » a cote de chaque lien Confidentialite des footers */
        var priv = document.querySelectorAll('footer a[href*="confidentialite"], .footer-min a[href*="confidentialite"]');
        for (var i = 0; i < priv.length; i++) {
            if (priv[i].parentNode.querySelector('[data-consent-open]')) continue;
            var sep = document.createTextNode(' \u00b7 ');
            var a = document.createElement('a');
            a.href = '#';
            a.setAttribute('data-consent-open', '');
            a.textContent = 'Cookies';
            priv[i].parentNode.insertBefore(sep, priv[i].nextSibling);
            priv[i].parentNode.insertBefore(a, sep.nextSibling);
        }
    }

    /* ---------- Calendly : popup + conversion « appel reserve » ---------- */
    function initCalendly() {
        /* Charge le tag Google Ads des que l'ID de conversion est renseigne */
        if (MH_ADS_CONV) gtagSafe('config', MH_ADS_CONV.split('/')[0]);
        /* gclid capture sur l'atterrissage, transmis a Calendly en utm_content */
        try {
            var qs = new URLSearchParams(location.search);
            var g = qs.get('gclid') || qs.get('gbraid') || qs.get('wbraid');
            if (g) sessionStorage.setItem('mh-gclid', g);
        } catch (e) { /* noop */ }

        var loading = false;
        function calendlyUrl(base) {
            var url = base.split('?')[0];
            var params = ['utm_source=mathieuhaye.fr', 'utm_medium=site',
                'utm_campaign=' + encodeURIComponent(location.pathname)];
            try {
                var g = sessionStorage.getItem('mh-gclid');
                if (g) params.push('utm_content=gclid_' + encodeURIComponent(g));
            } catch (e) { /* noop */ }
            return url + '?' + params.join('&');
        }
        function openPopup(href) {
            if (window.Calendly) {
                window.Calendly.initPopupWidget({ url: calendlyUrl(href) });
                return;
            }
            if (loading) return;
            loading = true;
            var css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://assets.calendly.com/assets/external/widget.css';
            document.head.appendChild(css);
            var s = document.createElement('script');
            s.src = 'https://assets.calendly.com/assets/external/widget.js';
            var fallback = setTimeout(function () { window.open(href, '_blank', 'noopener'); }, 2500);
            s.onload = function () {
                clearTimeout(fallback);
                if (window.Calendly) window.Calendly.initPopupWidget({ url: calendlyUrl(href) });
                else window.open(href, '_blank', 'noopener');
            };
            s.onerror = function () { clearTimeout(fallback); window.open(href, '_blank', 'noopener'); };
            document.head.appendChild(s);
        }
        document.addEventListener('click', function (e) {
            var a = e.target.closest ? e.target.closest('a[href*="calendly.com"]') : null;
            if (!a) return;
            e.preventDefault();
            gtagSafe('event', 'calendly_click', { link_url: a.href, page_path: location.pathname });
            openPopup(a.href);
        });
        /* Page /reserver : widget Calendly embarque (inline, memes UTM/gclid) */
        var slot = document.getElementById('mh-booking');
        if (slot) {
            var base = slot.getAttribute('data-calendly') || 'https://calendly.com/mathieu-haye/30min';
            var icss = document.createElement('link');
            icss.rel = 'stylesheet';
            icss.href = 'https://assets.calendly.com/assets/external/widget.css';
            document.head.appendChild(icss);
            var isc = document.createElement('script');
            isc.src = 'https://assets.calendly.com/assets/external/widget.js';
            isc.onload = function () {
                if (!window.Calendly) return;
                slot.innerHTML = '';
                window.Calendly.initInlineWidget({ url: calendlyUrl(base), parentElement: slot });
            };
            document.head.appendChild(isc);
        }

        window.addEventListener('message', function (e) {
            if (!e.origin || e.origin.indexOf('calendly.com') === -1) return;
            if (e.data && e.data.event === 'calendly.event_scheduled') {
                gtagSafe('event', 'book_call_scheduled', { page_path: location.pathname });
                if (MH_ADS_CONV) gtagSafe('event', 'conversion', { send_to: MH_ADS_CONV });
            }
        });
    }


    /* ---------- Fond de nav au scroll (pages intérieures : .nav est fixe) ---------- */
    function initNavScrolled() {
        var nav = document.querySelector('.nav') || document.querySelector('.v51-header');
        if (!nav) return;
        function onScroll() {
            nav.classList.toggle('scrolled', (window.scrollY || window.pageYOffset || 0) > 20);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }


    /* ---------- URLs propres : retire les params de linker GA (_gl, _ga...) ---------- */
    function initUrlCleaner() {
        window.addEventListener('load', function () {
            setTimeout(function () {
                try {
                    var url = new URL(window.location.href);
                    var dirty = false;
                    var kill = [];
                    url.searchParams.forEach(function (v, k) {
                        if (k === '_gl' || k === '_ga' || k.indexOf('_ga_') === 0) kill.push(k);
                    });
                    for (var i = 0; i < kill.length; i++) { url.searchParams.delete(kill[i]); dirty = true; }
                    if (dirty) history.replaceState(history.state, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash);
                } catch (e) { /* noop */ }
            }, 1200);
        });
    }


    /* ---------- Cartes réalisation : iframe cliquable -> modale <dialog> ---------- */
    function initEmbedCards() {
        var hits = document.querySelectorAll('.embed-hit');
        for (var i = 0; i < hits.length; i++) (function (btn) {
            var dlg = document.getElementById(btn.getAttribute('aria-controls'));
            if (!dlg || typeof dlg.showModal !== 'function') return;
            btn.addEventListener('click', function () { dlg.showModal(); });
            var close = dlg.querySelector('.embed-close');
            if (close) close.addEventListener('click', function () { dlg.close(); });
            dlg.addEventListener('click', function (e) {
                if (e.target === dlg) { dlg.close(); return; }
                /* La popup Calendly vit sous le top-layer du <dialog> : on ferme d'abord. */
                var a = e.target.closest ? e.target.closest('a[href*="calendly.com"]') : null;
                if (a) dlg.close();
            });
        })(hits[i]);
    }


    /* ---------- Menu déroulant Services (v5.5) ---------- */
    function svcMenuHtml(en) {
        var items = en ? [
            ['/en/custom-crm', 'Custom CRM', 'A CRM your team actually opens'],
            ['/en/ai-agent-for-smes', 'AI agents for SMEs', 'Repetitive work, handled by agents'],
            ['/en/n8n-automation', 'n8n automation', 'Repetitive tasks disappear'],
            ['/en/custom-web-app', 'Custom web app', 'When nothing on the market fits'],
            ['/en/website-creation', 'Website creation', 'A website that brings in clients'],
            ['/en/ai-visibility', 'Visible by AI', 'Get recommended by ChatGPT and friends']
        ] : [
            ['/crm-sur-mesure', 'CRM sur-mesure', 'Un CRM que votre équipe ouvre vraiment'],
            ['/agent-ia-pme', 'Agents IA pour PME', 'Le travail répétitif, traité par des agents'],
            ['/automatisation-n8n', 'Automatisation n8n', 'Les tâches répétitives disparaissent'],
            ['/application-sur-mesure', 'Application sur mesure', 'Quand rien sur le marché ne colle'],
            ['/creation-site-web', 'Création de site web', 'Un site qui ramène des clients'],
            ['/visible-par-les-ia', 'Visible par les IA', 'Être recommandé par ChatGPT et consorts']
        ];
        var all = en ? ['/en/collaboration', 'How we work together'] : ['/collaboration', 'Comment on travaille ensemble'];
        var h = '<div class="nav-drop-panel">';
        for (var i = 0; i < items.length; i++) {
            h += '<a href="' + items[i][0] + '"><strong>' + items[i][1] + '</strong><span>' + items[i][2] + '</span></a>';
        }
        return h + '<a class="nav-drop-all" href="' + all[0] + '">' + all[1] + ' &rarr;</a></div>';
    }

    function initNavDrop() {
        var drops = document.querySelectorAll('.nav-drop');
        if (!drops.length) return;
        function closeAll() {
            for (var i = 0; i < drops.length; i++) {
                drops[i].classList.remove('open');
                var t = drops[i].querySelector('.nav-drop-trigger');
                if (t) t.setAttribute('aria-expanded', 'false');
            }
        }
        for (var i = 0; i < drops.length; i++) (function (d) {
            var t = d.querySelector('.nav-drop-trigger');
            if (!t) return;
            t.addEventListener('click', function (e) {
                e.preventDefault();
                var open = d.classList.toggle('open');
                t.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            d.addEventListener('mouseleave', function () {
                d.classList.remove('open');
                t.setAttribute('aria-expanded', 'false');
            });
        })(drops[i]);
        document.addEventListener('click', function (e) {
            for (var i = 0; i < drops.length; i++) if (drops[i].contains(e.target)) return;
            closeAll();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeAll();
        });
    }


    /* ---------- 5. Pages services : dither du CTA final + révélation au scroll ---------- */
    function enhanceServicePages() {
        /* La carte CTA finale reçoit la même couche dither que le contact de la home. */
        var cards = document.querySelectorAll('.final-cta-card');
        for (var i = 0; i < cards.length; i++) {
            if (!cards[i].querySelector('[data-dither]')) {
                var layer = document.createElement('div');
                layer.className = 'dither-layer';
                layer.setAttribute('data-dither', '');
                layer.setAttribute('aria-hidden', 'true');
                cards[i].insertBefore(layer, cards[i].firstChild);
            }
        }
    }

    function initRevealInterior() {
        if (!('IntersectionObserver' in window)) return;
        var reduced = false;
        try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* noop */ }
        if (reduced) return;
        var els = document.querySelectorAll('.package-card, .method-card, .faq-item, .final-cta-card, .explore-card, .method-head, .embed-card');
        if (!els.length) return;
        var io = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('ui-revealed');
                    io.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.12 });
        var counters = {};
        for (var k = 0; k < els.length; k++) {
            var el = els[k];
            /* Ne jamais masquer ce qui est déjà à l'écran au chargement. */
            if (el.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
            var key = el.parentNode && el.parentNode.className ? String(el.parentNode.className) : 'x';
            counters[key] = (counters[key] || 0) + 1;
            el.style.transitionDelay = (((counters[key] - 1) % 4) * 80) + 'ms';
            el.className += ' ui-reveal';
            io.observe(el);
        }
    }

    ready(function () {
        injectGlassFilter();
        normalizeNav();
        initNavScrolled();
        initUrlCleaner();
        injectNavBook();
        initNavDrop();
        initEmbedCards();
        initConsent();
        initCalendly();
        enhanceServicePages();
        initRevealInterior();
        initDither();
    });
}());
