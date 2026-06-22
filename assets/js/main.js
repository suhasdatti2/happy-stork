/* =================================================================
   HAPPY'S STORK LOUNGE — interactions
   Vanilla JS · scroll reveals · parallax · cursor · nav · forms
   ================================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Preloader (dismissal is CSS-driven; this is a fast-path) ---------- */
  window.addEventListener('load', () => {
    const pre = $('.preloader');
    if (pre && reduceMotion) pre.classList.add('is-done');
  });

  /* ---------- Year stamps ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Navbar scroll state + progress ---------- */
  const nav = $('.nav');
  const bar = $('.scroll-bar');
  const strip = $('.top-strip');
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 40);
    if (strip) strip.classList.toggle('is-hidden', y > 40);
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $('.nav__toggle');
  if (toggle) {
    const close = () => document.body.classList.remove('menu-open');
    toggle.addEventListener('click', () => document.body.classList.toggle('menu-open'));
    $$('.menu a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        cio.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1600;
        if (reduceMotion) { el.textContent = target + suffix; return; }
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.round(target * eased);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- Parallax (hero layers + atmosphere) ---------- */
  const parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const run = () => {
      const y = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(run); ticking = true; }
    }, { passive: true });
  }

  /* ---------- Card cursor glow ---------- */
  if (!reduceMotion) {
    $$('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('[data-magnetic]').forEach(btn => {
      const strength = 0.3;
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Custom cursor ---------- */
  const cursor = $('.cursor');
  const dot = $('.cursor-dot');
  if (cursor && dot && window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`; });
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('a, button, .card, .imgcard, input, textarea, [data-magnetic]').forEach(el => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* ---------- Highlight today's hours ---------- */
  $$('[data-days]').forEach(row => {
    const days = row.dataset.days.split(',').map(Number);
    if (days.includes(new Date().getDay())) row.classList.add('is-today');
  });

  /* ---------- Tilt on hero card ---------- */
  const tiltEl = $('[data-tilt]');
  if (tiltEl && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    tiltEl.addEventListener('pointermove', e => {
      const r = tiltEl.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
      tiltEl.style.transform = `translateY(-50%) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    tiltEl.addEventListener('pointerleave', () => { tiltEl.style.transform = 'translateY(-50%)'; });
  }

  /* ---------- Contact form (demo handler) ---------- */
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = $('.form__success', form);
      if (ok) ok.classList.add('show');
      form.querySelector('button[type="submit"]').textContent = 'Reservation Sent';
      setTimeout(() => { form.reset(); }, 400);
    });
  }

  /* ---------- Smooth anchor scroll (offset for fixed nav) ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Hero word roller ---------- */
  const rollerWords = $$('.roller .roller__word');
  if (rollerWords.length > 1 && !reduceMotion) {
    let ri = 0;
    setInterval(() => {
      rollerWords[ri].classList.remove('is-active');
      ri = (ri + 1) % rollerWords.length;
      rollerWords[ri].classList.add('is-active');
    }, 2400);
  }

  /* ---------- Tabs ("What We Carry") ---------- */
  $$('.tabbed').forEach(tabbed => {
    const buttons = $$('.tab', tabbed);
    const panels = $$('.tab-panel', tabbed);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.toggle('is-active', b === btn));
        panels.forEach(p => p.classList.toggle('is-active', p.id === btn.dataset.tab));
      });
    });
  });

  /* ---------- Showcase carousel — continuous smooth drift + arrows/drag ---------- */
  const showcase = $('.showcase');
  if (showcase) {
    const track = $('.showcase__track', showcase);
    const viewport = $('.showcase__viewport', showcase);

    if (track && viewport && track.children.length) {
      // duplicate the set once so the loop is seamless
      const originals = Array.from(track.children);
      originals.forEach(node => track.appendChild(node.cloneNode(true)));

      let setWidth = 0;
      const gapOf = () => {
        const cs = getComputedStyle(track);
        return parseFloat(cs.columnGap || cs.gap) || 0;
      };
      const measure = () => {
        const gap = gapOf();
        let w = 0;
        originals.forEach(n => { w += n.getBoundingClientRect().width + gap; });
        setWidth = w;
      };
      measure();
      window.addEventListener('resize', measure);
      window.addEventListener('load', measure);

      let current = 0;          // px currently applied
      let target = 0;           // px we are easing toward
      const autoSpeed = reduceMotion ? 0 : 0.42;   // continuous drift per frame
      const lerp = 0.08;        // easing → "extremely smooth"
      let hovering = false, dragging = false, paused = false;
      const setPause = () => { paused = hovering || dragging; };

      const stepPx = () => track.children[0].getBoundingClientRect().width + gapOf();

      const frame = () => {
        if (!paused) target -= autoSpeed;
        current += (target - current) * lerp;
        if (setWidth > 0) {
          while (current <= -setWidth) { current += setWidth; target += setWidth; }
          while (current > 0)          { current -= setWidth; target -= setWidth; }
        }
        track.style.transform = `translate3d(${current}px,0,0)`;
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);

      // hover pauses the auto-drift (easing keeps arrow nudges gliding)
      showcase.addEventListener('pointerenter', () => { hovering = true; setPause(); });
      showcase.addEventListener('pointerleave', () => { hovering = false; setPause(); });

      const nudge = dir => { target -= dir * stepPx() * 1.5; };
      const nextBtn = $('.showcase__arrow--next', showcase);
      const prevBtn = $('.showcase__arrow--prev', showcase);
      if (nextBtn) nextBtn.addEventListener('click', () => nudge(1));
      if (prevBtn) prevBtn.addEventListener('click', () => nudge(-1));

      // drag / swipe to scrub through the selection
      let startX = 0, startTarget = 0, moved = false;
      viewport.addEventListener('pointerdown', e => {
        dragging = true; moved = false; setPause();
        startX = e.clientX; startTarget = target;
        viewport.classList.add('is-dragging');
        try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
      });
      viewport.addEventListener('pointermove', e => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 3) moved = true;
        target = startTarget + dx;
      });
      const endDrag = () => {
        if (!dragging) return;
        dragging = false; setPause();
        viewport.classList.remove('is-dragging');
      };
      viewport.addEventListener('pointerup', endDrag);
      viewport.addEventListener('pointercancel', endDrag);
      // swallow the click that follows a real drag so links don't fire
      viewport.addEventListener('click', e => { if (moved) e.preventDefault(); }, true);

      // keyboard support when the carousel is focused
      showcase.setAttribute('tabindex', '0');
      showcase.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { nudge(1); e.preventDefault(); }
        if (e.key === 'ArrowLeft')  { nudge(-1); e.preventDefault(); }
      });
    }
  }

})();
