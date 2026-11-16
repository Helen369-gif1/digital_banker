/* Screen 6 - background video: the camera moves from a close-up of banknotes back to the
   bank hall and holds on the last frame. It plays once per visit, when the screen is half in view.
   Loads only near the viewport. Small screens and reduced motion show the still of the last frame. */
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

  let played = false;

  function load() {
    if (video.src) return;
    video.preload = 'auto';
    video.src = video.dataset.src;
  }

  // Load ahead of time, once the screen is within 1.5 screens.
  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting) return;
    load();
    io.disconnect();
  }, { rootMargin: '150% 0px' }).observe(video);

  // Play once at 50% visibility; rewind only after the visitor has fully left.
  new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.intersectionRatio >= 0.5 && !played) {
      played = true;
      load();
      video.play().catch(() => {});
    } else if (!entry.isIntersecting && played) {
      played = false;
      video.pause();
      video.currentTime = 0;
    }
  }, { threshold: [0, 0.5] }).observe(video);
})();
