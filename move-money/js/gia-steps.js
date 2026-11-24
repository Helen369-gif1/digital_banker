/* Screen 4 - Gia works through the transfer, step by step, each time the stage comes into view.
   Elements marked data-seq are revealed in order; each step first spins, then turns into a check. */
(() => {
  'use strict';

  const stage = document.getElementById('gia-stage');
  if (!stage) return;

  const seq = (sel) => stage.querySelector(sel);
  const steps = Array.from(stage.querySelectorAll('.gia__steps li'));
  const all = Array.from(stage.querySelectorAll('[data-seq]'));

  // Reduced motion: complete, static final state.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    all.forEach((el) => el.classList.add('is-in'));
    steps.forEach((el) => el.classList.add('is-done'));
    return;
  }

  const bubble = seq('.gia__bubble');
  const thinking = seq('.gia__thinking');
  const note = seq('.gia__note');
  const portrait = seq('.gia__portrait');
  const back = seq('.gia__back');
  const card = seq('.gia__card');

  const show = (el) => el && el.classList.add('is-in');
  let timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    all.forEach((el) => el.classList.remove('is-in'));
    steps.forEach((el) => el.classList.remove('is-done'));
  }

  function play() {
    const STEP = 700;         // time between steps starting
    const WORK = 450;         // time a step spends spinning
    const first = 600;        // first step starts

    at(0, () => { show(portrait); show(bubble); });
    at(300, () => show(thinking));

    steps.forEach((li, i) => {
      const start = first + i * STEP;
      at(start, () => {
        show(li);
        if (i === 0) thinking.classList.remove('is-in');
        if (i === 1) show(back);
        if (i === 2) show(card);
      });
      at(start + WORK, () => li.classList.add('is-done'));
    });

    at(first + steps.length * STEP + 200, () => show(note));
  }

  // Starts at 40% visible; resets once the stage has fully left, so it plays again on return.
  let running = false;
  new IntersectionObserver((entries) => {
    const e = entries[entries.length - 1];
    if (!running && e.intersectionRatio >= 0.4) { running = true; play(); }
    else if (running && !e.isIntersecting) { running = false; reset(); }
  }, { threshold: [0, 0.4] }).observe(stage);
})();
