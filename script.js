(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsIO = 'IntersectionObserver' in window;

  // Hero: one orchestrated entrance on load, staggered top to bottom
  const heroBits = document.querySelectorAll('.hero .reveal');
  heroBits.forEach((el, i) => { if (!reduce) el.style.transitionDelay = `${i * 110}ms`; el.classList.add('is-visible'); });
  const heroVisual = document.querySelector('.hero__visual');
  if (heroVisual) heroVisual.classList.add('is-visible');

  // Everything else reveals as it scrolls into view
  const rest = document.querySelectorAll('.reveal:not(.hero .reveal)');
  if (reduce || !supportsIO) {
    rest.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    rest.forEach((el) => io.observe(el));
  }

  // Mobile sticky CTA: after the hero, hidden while plans / final CTA are in view
  const bar = document.getElementById('mobileCta');
  const hero = document.querySelector('.hero');
  const plans = document.getElementById('plans');
  const finalCta = document.getElementById('start');
  if (bar && hero && plans && finalCta && supportsIO) {
    let pastHero = false, atPlans = false, atFinal = false;
    const update = () => bar.classList.toggle('is-on', pastHero && !atPlans && !atFinal);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.bottom < 0; update(); }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(([e]) => { atPlans = e.isIntersecting; update(); }, { threshold: 0.1 }).observe(plans);
    new IntersectionObserver(([e]) => { atFinal = e.isIntersecting; update(); }, { threshold: 0.2 }).observe(finalCta);
  }

  // Mobile menu
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (btn && nav) {
    const close = () => { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target) && !btn.contains(e.target)) close(); });
  }

  // Intro video: swap the poster for the YouTube player on press.
  // If the page's security policy blocks the embed, fall back to opening YouTube.
  const video = document.getElementById('introVideo');
  if (video) {
    let embedBlocked = false;
    let player = null;
    const showPoster = () => { if (player) { player.remove(); player = null; } video.hidden = false; };
    document.addEventListener('securitypolicyviolation', (e) => {
      if (/frame|child/.test(e.effectiveDirective || e.violatedDirective || '') && /youtube/.test(e.blockedURI || '')) {
        const wasPlaying = !!player;
        embedBlocked = true;
        showPoster();
        // still within the click's user activation, so the new tab is allowed
        if (wasPlaying) window.open(video.href, '_blank', 'noopener');
      }
    });
    video.addEventListener('click', (e) => {
      if (embedBlocked) return; // let the link open YouTube in a new tab
      e.preventDefault();
      player = document.createElement('iframe');
      player.src = `https://www.youtube-nocookie.com/embed/${video.dataset.video}?rel=0&autoplay=1&playsinline=1`;
      player.title = 'تعرّف على أسلوب Xnote في التعليم';
      player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      player.allowFullscreen = true;
      video.hidden = true;
      video.parentNode.appendChild(player);
      player.focus();
    });
  }

  // FAQ accordion: one open at a time, animated height, keyboard accessible
  const questions = document.querySelectorAll('.faq__q');
  questions.forEach((q) => {
    const panel = document.getElementById(q.getAttribute('aria-controls'));
    q.addEventListener('click', () => {
      const willOpen = q.getAttribute('aria-expanded') !== 'true';
      questions.forEach((o) => {
        o.setAttribute('aria-expanded', 'false');
        document.getElementById(o.getAttribute('aria-controls')).classList.remove('is-open');
      });
      if (willOpen) { q.setAttribute('aria-expanded', 'true'); panel.classList.add('is-open'); }
    });
  });
})();
