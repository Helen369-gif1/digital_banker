/* Reveal for screens below the hero: fade and rise each time the item comes into view. */
(() => {
  'use strict';

  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  // Plays when the item comes into view; resets once it has fully left, so it plays again on return.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.12) entry.target.classList.add('is-in');
      else if (!entry.isIntersecting) entry.target.classList.remove('is-in');
    });
  }, { threshold: [0, 0.12] });

  items.forEach((el) => io.observe(el));
})();
