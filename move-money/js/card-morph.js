/* Screens 4 -> 5: the approval card is the same object as the card Gia prepares.
   It appears in the Gia card's place and size, stays in view while the page scrolls on, and lands in
   the approval layout, where the remaining rows and the two choices open.
   Only on wide screens without reduced motion; otherwise each screen keeps its own static card. */
(() => {
  'use strict';

  const root = document.documentElement;
  const card = document.getElementById('approve-card');
  const extra = document.getElementById('approve-extra');
  const giaCard = document.querySelector('.gia__card');
  const stage = card && card.closest('.approve__stage');
  if (!card || !extra || !giaCard || !stage) return;

  const labelA = card.querySelector('.approve__label-a');
  const labelB = card.querySelector('.approve__label-b');
  const header = () => parseFloat(getComputedStyle(root).getPropertyValue('--mm-header-h')) || 72;

  const wide = window.matchMedia('(min-width: 901px)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  const clamp01 = (n) => Math.max(0, Math.min(1, n));
  const ease = (t) => t * t * (3 - 2 * t);

  let on = false;
  let finalH = 0;       // card height when fully open, at its final width
  let ticking = false;

  function reset() {
    card.style.removeProperty('width');
    card.style.removeProperty('top');
    card.style.removeProperty('translate');
    extra.style.removeProperty('height');
    extra.style.removeProperty('opacity');
    labelA.style.removeProperty('opacity');
    labelB.style.removeProperty('opacity');
    card.classList.remove('is-live');
    extra.inert = false;
  }

  function measure() {
    // Final size: full width of the approval layout, extra block fully open
    card.style.width = Math.min(stage.clientWidth, 500) + 'px';
    extra.style.height = 'auto';
    finalH = card.offsetHeight;
  }

  function update() {
    ticking = false;
    if (!on) return;

    const vh = window.innerHeight;
    const sRect = stage.getBoundingClientRect();
    const aRect = giaCard.getBoundingClientRect();
    const wB = Math.min(stage.clientWidth, 500);
    const wA = aRect.width;

    // Final place: left edge of the stage, bottom edge of the stage
    const topPx = Math.max(0, stage.offsetHeight - finalH);
    card.style.top = topPx + 'px';

    const A = { x: aRect.left + window.scrollX, y: aRect.top + window.scrollY };
    const N = { x: sRect.left + window.scrollX, y: sRect.top + window.scrollY + topPx };

    // While travelling the card holds one place on screen, just below the header
    const hold = Math.max(header() + 24, (vh - finalH) / 2);
    const s0 = A.y - hold;
    const s1 = N.y - hold;
    const p = s1 > s0 ? clamp01((window.scrollY - s0) / (s1 - s0)) : 1;

    const k = 1 - p;
    card.style.translate = `${(k * (A.x - N.x)).toFixed(1)}px ${(k * (A.y - N.y)).toFixed(1)}px`;
    card.style.width = (wA + (wB - wA) * p).toFixed(1) + 'px';

    // The extra rows and the choices open over the last part of the trip
    const q = ease(clamp01((p - 0.55) / 0.45));
    const fullExtra = extra.scrollHeight;
    extra.style.height = q >= 1 ? 'auto' : (fullExtra * q).toFixed(1) + 'px';
    extra.style.opacity = q.toFixed(2);
    extra.inert = q < 0.98;

    // Title swaps from "Transfer prepared by Gia" to "Prepared by Gia" around the middle
    const t = ease(clamp01((p - 0.35) / 0.3));
    labelA.style.opacity = (1 - t).toFixed(2);
    labelB.style.opacity = t.toFixed(2);

    // On its way or landed (also after a reload or a menu link, when screen 4 never played): show it
    if (p > 0.02 &&!card.classList.contains('is-live')) card.classList.add('is-live');
  }

  function request() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function enable() {
    on = true;
    root.classList.add('morph');
    measure();
    update();
  }

  function disable() {
    on = false;
    root.classList.remove('morph');
    reset();
  }

  function sync() {
    const want = wide.matches && !calm.matches;
    if (want && !on) enable();
    else if (!want && on) disable();
    else if (on) { measure(); update(); }
  }

  // The card shows as soon as Gia's own card appears on screen 4
  new MutationObserver(() => {
    if (on && giaCard.classList.contains('is-in')) card.classList.add('is-live');
  }).observe(giaCard, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', sync);
  window.addEventListener('load', sync);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  wide.addEventListener('change', sync);
  calm.addEventListener('change', sync);
  sync();
})();
