/* Screen 6 - background video. Loads only near the viewport, plays only while visible.
   Reduced motion and small screens keep the poster frame as a still background. */
(() => {
  'use strict';

  const video = document.getElementById('cta-video');
  if (!video) return;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || window.matchMedia('(max-width: 767px)').matches;
  if (still) {
    video.hidden = true;
    return;
  }

  new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      if (!video.src) video.src = video.dataset.src;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, { rootMargin: '150% 0px' }).observe(video);
})();
