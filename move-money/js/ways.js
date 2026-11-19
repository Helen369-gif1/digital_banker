/* Screen 2 - one open item at a time; the product panel follows the open item.
   Wide screens: the section is pinned and scrolling steps through the three items.
   Narrow screens and reduced motion: no pin, the items open on click only. */
(() => {
  'use strict';

  const section = document.getElementById('screen-2');
  const list = document.getElementById('ways-list');
  const frame = document.getElementById('ways-frame');
  if (!section || !list || !frame) return;

  const items = Array.from(list.querySelectorAll('.way'));
  const images = Array.from(frame.querySelectorAll('img'));
  const count = items.length;

  const wide = window.matchMedia('(min-width: 901px)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pinned = () => wide.matches && !calm.matches;

  let current = 0;

  function open(index) {
    if (index === current) return;
    // Moving down the list: the new screen comes up from below; moving up: from above.
    frame.style.setProperty('--from', index > current ? '28px' : '-28px');
    items.forEach((item, i) => {
      const on = i === index;
      item.classList.toggle('is-open', on);
      item.querySelector('.way__btn').setAttribute('aria-expanded', String(on));
    });
    images.forEach((img, i) => {
      img.classList.toggle('is-leaving', i === current);
      img.classList.toggle('is-active', i === index);
    });
    current = index;
  }

  // Scroll distance inside the pinned section, from "just pinned" to "about to release"
  const travel = () => section.clientHeight - parseFloat(getComputedStyle(section).paddingBottom) - window.innerHeight;
  const top = () => section.getBoundingClientRect().top + window.scrollY;

  function onScroll() {
    if (!pinned()) return;
    const span = travel();
    if (span <= 0) return;
    const p = Math.max(0, Math.min(0.9999, (window.scrollY - top()) / span));
    open(Math.floor(p * count));
  }

  function sync() {
    section.classList.toggle('is-pinned', pinned());
    onScroll();
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.way__btn');
    if (!btn) return;
    const index = Number(btn.dataset.way);
    if (pinned()) {
      // Scroll to the middle of that item's stretch, so the page and the open item stay in step
      window.scrollTo({ top: top() + ((index + 0.5) / count) * travel(), behavior: 'smooth' });
    } else {
      open(index);
    }
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll(); });
  }, { passive: true });

  wide.addEventListener('change', sync);
  calm.addEventListener('change', sync);
  window.addEventListener('resize', onScroll);
  sync();
})();
