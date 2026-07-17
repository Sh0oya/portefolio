/* ================================================
   GSAP ENHANCE v4 (safe mode)
   Layer only NON-DESTRUCTIVE animations on top of
   the vanilla reveal system in script.js.
   Never uses gsap.from() on content elements that
   already have their own reveal (data-reveal).
   Respects prefers-reduced-motion.
   ================================================ */

(() => {
    'use strict';

    const init = () => {
        if (!window.gsap || !window.ScrollTrigger) {
            return setTimeout(init, 50);
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const { gsap, ScrollTrigger } = window;
        gsap.registerPlugin(ScrollTrigger);

        /* ==========================================
           1. Hero polaroids: scroll parallax drift
           (réf. granola « For the doers » floats)
           ========================================== */
        gsap.utils.toArray('.mh-float').forEach(card => {
            const speed = parseFloat(card.dataset.floatSpeed || '0.06');
            gsap.to(card, {
                y: () => -window.innerHeight * speed * 4,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.mh-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.1,
                },
            });
        });

        /* Mouse drift on the polaroids (desktop only) */
        if (window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
            const hero = document.querySelector('.mh-hero');
            const floats = document.querySelectorAll('.mh-float');
            if (hero && floats.length) {
                hero.addEventListener('mousemove', (e) => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 14;
                    const y = (e.clientY / window.innerHeight - 0.5) * 14;
                    floats.forEach((f, i) => {
                        const depth = (i + 1) * 0.55;
                        gsap.to(f, {
                            x: x * depth,
                            ease: 'power2.out',
                            duration: 1.4,
                            overwrite: 'auto',
                        });
                    });
                });
            }
        }

        /* ==========================================
           2. Portrait: subtle parallax on scroll
           ========================================== */
        const portraitFrame = document.querySelector('.mh-portrait .portrait-frame');
        if (portraitFrame) {
            gsap.to(portraitFrame, {
                y: -34,
                scrollTrigger: {
                    trigger: portraitFrame,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                },
            });
        }

        /* ==========================================
           3. Giant serif section titles: slow drift
           (subtle editorial slide, desktop only)
           ========================================== */
        if (window.matchMedia('(min-width: 1024px)').matches) {
            gsap.utils.toArray('.section-title').forEach(title => {
                gsap.fromTo(title, { y: 26 }, {
                    y: -14,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.4,
                    },
                });
            });
        }

        /* ==========================================
           4. Section glows: scroll-linked drift
           ========================================== */
        gsap.utils.toArray('.section-glow, .mh-hero-bg-glow-1, .mh-hero-bg-glow-2').forEach(glow => {
            gsap.to(glow, {
                y: '+=46',
                scrollTrigger: {
                    trigger: glow.closest('section') || glow.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                },
            });
        });

        /* Legacy ambient orbs (pages intérieures) */
        gsap.utils.toArray('.orb').forEach(orb => {
            const intensity = 20 + Math.random() * 40;
            gsap.to(orb, {
                y: `+=${intensity}`,
                scrollTrigger: {
                    trigger: orb.closest('section') || orb.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                },
            });
        });

        /* ==========================================
           5. Reading progress bar on blog articles
           ========================================== */
        const articleBody = document.querySelector('.article-body');
        if (articleBody) {
            const bar = document.createElement('div');
            bar.className = 'reading-progress';
            bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;background:linear-gradient(90deg,var(--wine-hi,#8E1D33),var(--orange,#EC4E02));z-index:1000;transition:none;box-shadow:0 0 10px rgba(236,78,2,0.45);will-change:width';
            document.body.appendChild(bar);
            ScrollTrigger.create({
                trigger: articleBody,
                start: 'top 30%',
                end: 'bottom 80%',
                onUpdate: self => {
                    bar.style.width = (self.progress * 100) + '%';
                },
            });
        }

        /* ==========================================
           6. Dither CTA: gentle zoom-settle on entry
           ========================================== */
        const ditherCta = document.querySelector('.dither-cta');
        if (ditherCta) {
            gsap.fromTo(ditherCta, { scale: 0.965 }, {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: ditherCta,
                    start: 'top 92%',
                    end: 'top 44%',
                    scrub: 0.8,
                },
            });
        }

        // Refresh once fonts + images loaded
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    };

    init();
})();
