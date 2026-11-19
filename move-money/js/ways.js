/* Screen 2 - one open item at a time; the product panel follows the open item.
   The first panel is a live, non-interactive demo that plays while it is on screen. */
(() => {
  'use strict';

  const list = document.getElementById('ways-list');
  const frame = document.getElementById('ways-frame');
  if (!list || !frame) return;

  const items = Array.from(list.querySelectorAll('.way'));
  const images = Array.from(frame.querySelectorAll('img, iframe'));
  const demo = document.getElementById('ways-demo');

  let inView = false;
  let loaded = false;
  let playing = false;

  function sync() {
    if (!demo || !loaded) return;
    const want = inView && demo.classList.contains('is-active') && !document.hidden;
    if (want === playing) return;
    playing = want;
    demo.contentWindow.postMessage({ type: want ? 'demo-play' : 'demo-stop' }, '*');
  }

  function open(index) {
    items.forEach((item, i) => {
      const on = i === index;
      item.classList.toggle('is-open', on);
      item.querySelector('.way__btn').setAttribute('aria-expanded', String(on));
    });
    images.forEach((img, i) => img.classList.toggle('is-active', i === index));
    sync();
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.way__btn');
    if (!btn) return;
    open(Number(btn.dataset.way));
  });

  if (!demo) return;

  // Scale the fixed-size demo page to the frame width.
  function fit() {
    demo.style.transform = 'scale(' + (frame.clientWidth / 880) + ')';
  }
  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(frame);
  else addEventListener('resize', fit);

  demo.addEventListener('load', () => { loaded = true; sync(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      sync();
    }, { threshold: 0.4 }).observe(frame);
  }
  document.addEventListener('visibilitychange', sync);
})();
