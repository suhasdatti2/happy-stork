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
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 40);
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

})();
