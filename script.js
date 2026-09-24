(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal (also triggers hand-drawn underline/circle animations)
  const targets = document.querySelectorAll('.reveal, .underline-hand');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    targets.forEach((el) => io.observe(el));
  }

  // Mobile sticky CTA: show after hero, hide near the final CTA
  const bar = document.getElementById('mobileCta');
  const hero = document.querySelector('.hero');
  const plans = document.getElementById('plans');
  const finalCta = document.getElementById('start');
  if (bar && hero && plans && finalCta && 'IntersectionObserver' in window) {
    let pastHero = false, atPlans = false, atFinal = false;
    const update = () => bar.classList.toggle('is-on', pastHero && !atPlans && !atFinal);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.bottom < 0; update(); }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(([e]) => { atPlans = e.isIntersecting; update(); }, { threshold: 0.1 }).observe(plans);
    new IntersectionObserver(([e]) => { atFinal = e.isIntersecting; update(); }, { threshold: 0.2 }).observe(finalCta);
  }

  // FAQ: keep one item open at a time
  const items = document.querySelectorAll('.faq__item');
  items.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
  }));
})();

// Mobile menu
(function () {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;
  const close = () => { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
