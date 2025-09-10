(function startNow() {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();

function boot() {
    try {
        const y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();

        const inView = (el, offset = 0) => {
            const r = el.getBoundingClientRect();
            return r.top < window.innerHeight - offset && r.bottom > 0 + offset;
        };

        (function () {
            const bar = document.getElementById('progressBar');
            if (!bar) return;
            let ticking = false;
            const update = () => {
                const h = document.documentElement;
                const max = h.scrollHeight - window.innerHeight;
                const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
                bar.style.transform = `scaleX(${p})`;
                ticking = false;
            };
            window.addEventListener('scroll', () => {
                if (!ticking) { requestAnimationFrame(update); ticking = true; }
            }, { passive: true });
            window.addEventListener('resize', update);
            update();
        })();

        (function () {
            const btn = document.getElementById('backToTop');
            if (!btn) return;
            const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 320);
            btn.addEventListener('click', () => {
                const start = window.scrollY, dur = 650; let t0 = null;
                const step = ts => {
                    if (!t0) t0 = ts;
                    const p = Math.min(1, (ts - t0) / dur);
                    const ease = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
                    window.scrollTo(0, start * (1 - ease));
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            });
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        })();

        (function () {
            document.querySelectorAll('section h2').forEach(h2 => {
                const parent = h2.parentElement;
                if (parent && parent.classList && parent.classList.contains('title-wrap')) return;
                const wrap = document.createElement('span');
                wrap.className = 'title-wrap';
                wrap.style.position = 'relative';
                wrap.style.display = 'inline-block';
                wrap.style.isolation = 'isolate';
                h2.replaceWith(wrap);
                wrap.appendChild(h2);

                const overlay = document.createElement('span');
                overlay.className = 'title-overlay';
                overlay.style.cssText = 'position:absolute;inset:0;border-radius:6px;transform:translateX(-101%);background:linear-gradient(90deg,#161616 0%,#2b2b2b 50%,#161616 100%);mix-blend-mode:soft-light;pointer-events:none;z-index:-1;';
                wrap.appendChild(overlay);
            });
        })();

        (function () {
            const candidates = document.querySelectorAll('.reveal');
            if (!candidates.length) return;

            candidates.forEach(el => {
                if (!inView(el, 40)) el.classList.add('will-reveal');
            });

            const io = new IntersectionObserver(ents => {
                ents.forEach(e => {
                    if (!e.isIntersecting) return;
                    const el = e.target;
                    el.classList.remove('will-reveal');
                    el.animate(
                        [{ transform: 'translateY(14px)', filter: 'blur(2px)' },
                        { transform: 'translateY(0)', filter: 'blur(0)' }],
                        { duration: 420, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'both' }
                    );
                    io.unobserve(el);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

            document.querySelectorAll('.will-reveal').forEach(el => io.observe(el));
        })();

        (function () {
            document.querySelectorAll('.tilt').forEach(card => {
                card.style.transformStyle = 'preserve-3d';
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
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
                });
            });
        })();

        (function () {
            const fig = document.querySelector('.portrait'); if (!fig) return;
            fig.addEventListener('mousemove', e => {
                const r = fig.getBoundingClientRect();
                fig.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
                fig.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
            });
            fig.addEventListener('mouseleave', () => { fig.style.removeProperty('--mx'); fig.style.removeProperty('--my'); });
        })();

        (function () {
            const canvas = document.getElementById('heroCanvas'); if (!canvas) return;
            const ctx = canvas.getContext('2d'); let w, h, ps;
            function init() {
                w = canvas.width = canvas.parentElement.offsetWidth;
                h = canvas.height = 320;
                ps = Array.from({ length: 48 }, () => ({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6
                }));
            }
            window.addEventListener('resize', init); init();
            (function loop() {
                ctx.clearRect(0, 0, w, h);
                ctx.globalAlpha = .85;
                for (const p of ps) {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
                    ctx.fillStyle = '#3de0c1'; ctx.fill();
                }
                ctx.globalAlpha = .18; ctx.strokeStyle = '#3de0c1';
                for (let i = 0; i < ps.length; i++) {
                    for (let j = i + 1; j < ps.length; j++) {
                        const a = ps[i], b = ps[j], d = Math.hypot(a.x - b.x, a.y - b.y);
                        if (d < 110) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
                    }
                }
                requestAnimationFrame(loop);
            })();
        })();

        window.runSectionIntro = function (section) {
            if (!section || section.dataset.entered === '1') return;
            section.dataset.entered = '1';

            const wrap = section.querySelector('.title-wrap');
            const overlay = wrap?.querySelector('.title-overlay');
            if (overlay) {
                overlay.animate(
                    [{ transform: 'translateX(-101%)' }, { transform: 'translateX(0%)' }],
                    { duration: 620, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'both' }
                );
            }

            const items = section.querySelectorAll('.card, .panel, .timeline');
            items.forEach((el, i) => {
                el.animate(
                    [{ transform: 'translateY(10px)', filter: 'blur(1.5px)' },
                    { transform: 'translateY(0)', filter: 'blur(0)' }],
                    { duration: 360, delay: 100 + i * 50, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'both' }
                );
            });
        };

        (function () {
            const nav = document.querySelector('.nav .container nav'); if (!nav) return;

            let underline = document.querySelector('.nav .underline');
            if (!underline) {
                underline = document.createElement('div');
                underline.className = 'underline';
                nav.parentElement.appendChild(underline);
            }

            const links = Array.from(nav.querySelectorAll('a[href^="#"]'));

            function moveUnderlineTo(link) {
                if (!underline || !link) return;
                const wrap = nav.parentElement;
                const rw = wrap.getBoundingClientRect();
                const r = link.getBoundingClientRect();
                underline.style.width = `${r.width}px`;
                underline.style.transform = `translateX(${r.left - rw.left}px)`;
            }
            function setActive(link) {
                links.forEach(l => l.classList.remove('active'));
                if (link) { link.classList.add('active'); moveUnderlineTo(link); }
            }
            function smoothScrollTo(targetY, onDone) {
                const start = window.scrollY, dist = targetY - start, dur = 650; let t0 = null;
                const step = ts => {
                    if (!t0) t0 = ts;
                    const p = Math.min(1, (ts - t0) / dur);
                    const ease = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
                    window.scrollTo(0, start + dist * ease);
                    if (p < 1) requestAnimationFrame(step); else onDone && onDone();
                };
                requestAnimationFrame(step);
            }

            links.forEach(a => {
                a.addEventListener('click', e => {
                    const id = a.getAttribute('href'); if (!id || id === '#') return;
                    const section = document.querySelector(id); if (!section) return;
                    e.preventDefault();
                    setActive(a);
                    const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - 64);
                    smoothScrollTo(top, () => {
                        window.runSectionIntro && window.runSectionIntro(section);
                        history.pushState(null, '', id);
                    });
                });
            });

            const spy = new IntersectionObserver(entries => {
                const mid = window.innerHeight / 2;
                let best = null, dist = Infinity;
                entries.forEach(en => {
                    if (!en.isIntersecting) return;
                    const r = en.target.getBoundingClientRect();
                    const d = Math.abs(r.top - mid);
                    if (d < dist) { dist = d; best = en.target; }
                });
                if (best) {
                    const id = '#' + (best.id || '');
                    const a = links.find(l => l.getAttribute('href') === id);
                    if (a) setActive(a);
                }
            }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

            links.forEach(l => { const sec = document.querySelector(l.getAttribute('href')); if (sec) spy.observe(sec); });

            window.addEventListener('load', () => {
                const hash = location.hash;
                const a = links.find(l => l.getAttribute('href') === hash) || links[0];
                if (a) { setActive(a); const target = document.querySelector(a.getAttribute('href')); if (target) window.runSectionIntro(target); }
            });
            window.addEventListener('resize', () => {
                const a = nav.querySelector('a.active'); moveUnderlineTo(a);
            });
        })();

        (function () {
            const holder = document.getElementById('caseHeroWaves'); if (!holder) return;
            const ctx = holder.getContext('2d');
            const resize = () => { holder.width = holder.clientWidth; holder.height = holder.clientHeight || 380; };
            resize(); window.addEventListener('resize', resize);
            let t = 0; (function draw() {
                t += 0.018; const w = holder.width, h = holder.height;
                ctx.clearRect(0, 0, w, h);
                const grad = ctx.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, '#0c1d1a'); grad.addColorStop(1, '#0b0b0b');
                ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
                function wave(off, amp, a) {
                    ctx.globalAlpha = a; ctx.beginPath();
                    for (let x = 0; x <= w; x += 2) {
                        const y = h * .55 + Math.sin((x * .012) + t + off) * amp + Math.cos((x * .008) + t * .6) * amp * .6;
                        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = '#123730'; ctx.fill();
                }
                wave(0, 18, .25); wave(1.2, 12, .18); wave(2.6, 8, .14);
                ctx.globalAlpha = .55;
                for (let i = 0; i < 60; i++) {
                    const px = (i * 37 + (t * 60)) % w;
                    const py = h * .35 + Math.sin((i * .5) + t) * 60;
                    ctx.fillStyle = '#3de0c1'; ctx.fillRect(px, py, 2, 2);
                }
                requestAnimationFrame(draw);
            })();
        })();

        (function () {
            const rail = document.querySelector('.section-dots'); if (!rail) return;
            const dots = Array.from(rail.querySelectorAll('.dot'));
            const map = dots.map(d => {
                const sel = d.getAttribute('data-target');
                return { btn: d, el: sel ? document.querySelector(sel) : null };
            }).filter(x => x.el);

            function setActiveByEl(el) {
                const found = map.find(m => m.el === el);
                dots.forEach(d => d.classList.remove('active'));
                if (found) found.btn.classList.add('active');
            }
            function smoothTo(y, cb) {
                const start = window.scrollY, dist = y - start, dur = 650; let t0 = null;
                const step = ts => {
                    if (!t0) t0 = ts; const p = Math.min(1, (ts - t0) / dur);
                    const ease = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
                    window.scrollTo(0, start + dist * ease);
                    if (p < 1) requestAnimationFrame(step); else cb && cb();
                };
                requestAnimationFrame(step);
            }
            map.forEach(({ btn, el }) => {
                btn.addEventListener('click', () => {
                    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 64);
                    smoothTo(top, () => {
                        setActiveByEl(el);
                        if (el.id) history.pushState(null, '', '#' + el.id);
                        window.runSectionIntro && window.runSectionIntro(el);
                    });
                });
            });

            const spy = new IntersectionObserver(entries => {
                const mid = window.innerHeight * 0.45;
                let best = null, bestDist = Infinity;
                entries.forEach(en => {
                    if (!en.isIntersecting) return;
                    const r = en.target.getBoundingClientRect();
                    const d = Math.abs(r.top - mid);
                    if (d < bestDist) { bestDist = d; best = en.target; }
                });
                if (best) setActiveByEl(best);
            }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

            map.forEach(x => spy.observe(x.el));
        })();

    } catch (err) {
        console.error('[main.js] boot error ❌', err);
    }
}
