/* Screen 2 - one open item at a time; the product panel follows the open item. */
(() => {
  'use strict';

  const list = document.getElementById('ways-list');
  const frame = document.getElementById('ways-frame');
  if (!list || !frame) return;

  const items = Array.from(list.querySelectorAll('.way'));
  const images = Array.from(frame.querySelectorAll('img'));

  function open(index) {
    items.forEach((item, i) => {
      const on = i === index;
      item.classList.toggle('is-open', on);
      item.querySelector('.way__btn').setAttribute('aria-expanded', String(on));
    });
    images.forEach((img, i) => img.classList.toggle('is-active', i === index));
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.way__btn');
    if (!btn) return;
    open(Number(btn.dataset.way));
  });
})();
