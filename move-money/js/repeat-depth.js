/* Screen 3 - depth on scroll. The two product screens drift at different speeds while the stage
   crosses the viewport, so they read as separate layers. Off with reduced motion. */
(() => {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const stage = document.querySelector('.repeat__layers');
  if (!stage) return;

  const receipt = stage.querySelector('.repeat__layer--receipt');
  const amount = stage.querySelector('.repeat__layer--amount');
  const SHIFT = { receipt: -48, amount: 40 };   // px of travel, in opposite directions

  let ticking = false;

  function update() {
    ticking = false;
    const r = stage.getBoundingClientRect();
    const vh = window.innerHeight;
    // -1 when the stage is entering from below, 0 centred, 1 leaving at the top
    const p = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2)));
    receipt.style.setProperty('--py', (p * SHIFT.receipt).toFixed(1) + 'px');
    amount.style.setProperty('--py', (p * SHIFT.amount).toFixed(1) + 'px');
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
