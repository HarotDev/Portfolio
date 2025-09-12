(function () {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();

function boot() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Header offset (så inget hamnar under nav)
    (function headerOffset() {
        const header = document.querySelector('.site-header'); if (!header) return;
        const set = () => document.documentElement.style.setProperty('--header-offset', (header.offsetHeight + 12) + 'px');
        set(); window.addEventListener('resize', set, { passive: true });
    })();

    // Smooth anchor + aktiv knapp
    const navButtons = Array.from(document.querySelectorAll('.nav-pills .button'));
    const sectionIdsFromNav = navButtons.map(a => (a.getAttribute('href') || '').replace('/', '')).filter(h => /^#\w/.test(h));

    document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href'); if (!href) return;
            const id = href.replace('/', '');
            const target = document.querySelector(id); if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', id);
            setActiveNavByHash(id);
        });
    });

    function setActiveNavByHash(hash) {
        navButtons.forEach(btn => {
            const h = (btn.getAttribute('href') || '').replace('/', '');
            btn.classList.toggle('is-active', h === hash);
        });
    }

    // Dölj/visa header vid scrollriktning
    (function hideHeaderOnScroll() {
        const header = document.querySelector('.site-header'); if (!header) return;
        let lastY = window.scrollY || 0, hidden = false;
        const THRESHOLD = 6, SHOW_AT_TOP = 40;
        const onScroll = () => {
            const y = window.scrollY || 0, dy = y - lastY;
            if (y < SHOW_AT_TOP && hidden) { header.classList.remove('is-hidden'); hidden = false; }
            else if (dy > THRESHOLD && y > SHOW_AT_TOP) { if (!hidden) { header.classList.add('is-hidden'); hidden = true; } }
            else if (dy < -THRESHOLD) { if (hidden) { header.classList.remove('is-hidden'); hidden = false; } }
            lastY = y;
        };
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
        }, { passive: true });
        onScroll();
    })();

    // Aktiv länk via IntersectionObserver
    (function observeActiveSection() {
        if (!sectionIdsFromNav.length) return;
        const targets = sectionIdsFromNav.map(id => document.querySelector(id)).filter(Boolean);
        if (!targets.length) return;
        const io = new IntersectionObserver(entries => {
            const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            const id = '#' + (visible.target.id || ''); setActiveNavByHash(id);
        }, { threshold: [0.2, 0.5, 0.8], rootMargin: '-30% 0% -50% 0%' });
        targets.forEach(t => io.observe(t));
        if (location.hash) setActiveNavByHash(location.hash);
    })();

    // Reveal
    (function reveal() {
        const els = [...document.querySelectorAll('.reveal')]; if (!els.length) return;
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                const el = en.target, section = el.closest('section') || document.body;
                const key = '__stagger__'; if (!section[key]) section[key] = 0;
                const index = section[key]++; const delay = Math.min(index, 6) * 90;
                el.style.setProperty('--delay', delay + 'ms');
                el.style.setProperty('--dur', '900ms');
                el.classList.add('slide-up-fade');
                io.unobserve(el);
            });
        }, { threshold: 0.14, rootMargin: '10% 0% -6% 0%' });
        document.querySelectorAll('.hero .reveal').forEach(el => {
            el.classList.add('slide-up-fade'); el.style.setProperty('--delay', '0ms'); el.style.setProperty('--dur', '800ms');
        });
        els.forEach(el => io.observe(el));
    })();



    // Tilt + glare (projektkort)
    (function tilt() {
        document.querySelectorAll('.tilt').forEach(card => {
            let glare = card.querySelector('.glare');
            if (!glare) { glare = document.createElement('span'); glare.className = 'glare'; card.appendChild(glare); }
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - .5;
                const py = (e.clientY - r.top) / r.height - .5;
                card.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${py * -12}deg)`;
                glare.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
                glare.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
            });
            card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(900px) rotateY(0) rotateX(0)'; });
        });
    })();

    // ===== Site-wide dots + lätt parallax =====
    (function siteDots() {
        const canvas = document.getElementById('siteDots'); if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let w = 0, h = 0, dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
        let points = [], lastScrollY = window.scrollY || 0;

        function resize() {
            w = canvas.clientWidth = window.innerWidth;
            h = canvas.clientHeight = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.round((w * h) / 22000);
            points = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - .5) * .35,
                vy: (Math.random() - .5) * .35,
            }));
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        function draw(scrollY) {
            ctx.clearRect(0, 0, w, h);

            // Parallax offset
            const offsetY = (scrollY * 0.12) % h;

            // Dots
            ctx.globalAlpha = .9;
            points.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;

                ctx.beginPath();
                ctx.arc(p.x, (p.y + offsetY) % h, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#8b5cf6';
                ctx.fill();
            });

            // Lines
            ctx.globalAlpha = .14;
            ctx.strokeStyle = '#a78bfa';
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const a = points[i], b = points[j];
                    const dx = a.x - b.x, dy = (a.y - b.y);
                    const dist = Math.hypot(dx, dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, (a.y + offsetY) % h);
                        ctx.lineTo(b.x, (b.y + offsetY) % h);
                        ctx.stroke();
                    }
                }
            }
        }

        function loop() {
            const scrollY = window.scrollY || 0;
            lastScrollY += (scrollY - lastScrollY) * 0.08;
            draw(lastScrollY);
            requestAnimationFrame(loop);
        }
        loop();
    })();

    // ===== Typing-effekt: mjuk & lite långsammare =====
    (function typeHero() {
        const nameEl = document.getElementById('typeName');
        const caret = document.querySelector('.type-line .caret');
        if (!nameEl) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const name = 'Harot Aziz';
        const speed = 100; 

        nameEl.classList.add('grad-name');
        nameEl.textContent = '';

        if (prefersReduced) {
            nameEl.textContent = name;
            if (caret) caret.classList.add('done');
            return;
        }

        const chars = [...name];
        let i = 0;

        function step() {
            if (i < chars.length) {
                const span = document.createElement('span');
                span.className = 'glyph';
                span.textContent = chars[i] === ' ' ? '\u00A0' : chars[i];
                nameEl.appendChild(span);

                requestAnimationFrame(() => {
                    span.style.transition = 'opacity .42s ease, transform .42s ease, filter .42s ease';
                    span.style.opacity = '1';
                    span.style.transform = 'none';
                    span.style.filter = 'none';
                });

                i++;
                setTimeout(step, speed);
            } else {
                if (caret) caret.classList.add('done');
            }
        }

        // Start
        step();
    })();

    // Till toppen
    (function toTop() {
        const btn = document.getElementById('toTop'); if (!btn) return;
        let ticking = false;
        const toggle = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            if (y > 300) btn.classList.add('is-visible'); else btn.classList.remove('is-visible');
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { window.requestAnimationFrame(toggle); ticking = true; }
        }, { passive: true });
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        btn.addEventListener('click', e => {
            e.preventDefault();
            if (prefersReduced) window.scrollTo(0, 0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
            document.activeElement && document.activeElement.blur && document.activeElement.blur();
        });
        toggle();
    })();

    // === About line-draw: starta först när sektionen syns ===
    (function lineDrawAbout() {
        const stage = document.getElementById('aboutStage');
        const svg = document.getElementById('aboutSvg');
        if (!stage || !svg) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const rootStyles = getComputedStyle(document.documentElement);
        const dur = parseFloat(rootStyles.getPropertyValue('--duration')) || 3.2;
        const stagger = parseFloat(rootStyles.getPropertyValue('--stagger')) || 0.08;

        function start() {
            const paths = svg.querySelectorAll('path');
            let delay = 0;
            paths.forEach(p => {
                // säkerställ stroke följer variablerna
                p.style.stroke = rootStyles.getPropertyValue('--stroke') || '#fff';
                p.style.strokeWidth = rootStyles.getPropertyValue('--stroke-width') || '4.3';
                p.style.fill = 'none';
                p.style.strokeLinecap = 'round';
                p.style.strokeLinejoin = 'round';

                let len = 0;
                try { len = p.getTotalLength(); } catch { len = 1200; }
                p.style.strokeDasharray = len;
                p.style.strokeDashoffset = len;

                if (!prefersReduced) {
                    const jitter = (Math.random() * 0.35 - 0.15); // liten variation
                    p.classList.add('draw');
                    p.style.animationDuration = (dur + jitter).toFixed(2) + 's';
                    p.style.animationDelay = delay.toFixed(2) + 's';
                    delay += stagger;
                } else {
                    p.style.strokeDasharray = 'none';
                    p.style.strokeDashoffset = 0;
                }
            });
        }

        const io = new IntersectionObserver((entries) => {
            for (const en of entries) {
                if (en.isIntersecting) { start(); io.disconnect(); break; }
            }
        }, { threshold: 0.2 });
        io.observe(stage);
    })();

    (() => {
        const cvs = document.getElementById('caseHeroWaves');
        if (!cvs) return;

        const ctx = cvs.getContext('2d');
        let raf, t = 0;
        const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

        function size() {
            const wrap = cvs.parentElement;
            const w = wrap.clientWidth;
            const h = Math.max(220, wrap.clientHeight * 0.6);
            cvs.style.width = w + 'px';
            cvs.style.height = h + 'px';
            cvs.width = Math.floor(w * DPR);
            cvs.height = Math.floor(h * DPR);
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }

        function wave(yBase, amp, len, speed, hueFrom, hueTo) {
            const w = cvs.clientWidth, h = cvs.clientHeight;
            const grd = ctx.createLinearGradient(0, 0, w, 0);
            grd.addColorStop(0, `hsla(${hueFrom},90%,60%,.18)`);
            grd.addColorStop(1, `hsla(${hueTo},90%,60%,.08)`);
            ctx.strokeStyle = grd;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 0; x <= w; x += 2) {
                const y = yBase + Math.sin((x / len) + t * speed) * amp;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        function tick() {
            const w = cvs.clientWidth, h = cvs.clientHeight;
            ctx.clearRect(0, 0, w, h);
            wave(h * 0.35, 16, 120, 0.8, 260, 200);
            wave(h * 0.55, 22, 180, 0.6, 220, 190);
            wave(h * 0.75, 28, 240, 0.5, 210, 180);
            t += 0.02;
            raf = requestAnimationFrame(tick);
        }

        size(); window.addEventListener('resize', size, { passive: true });
        tick();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(raf); else tick();
        });
    })();

}
