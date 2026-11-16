/* Screen 1 - scroll-scrubbed hero scene.
   Scroll progress through the runway drives: the video time, the copy fade-out,
   the example interface on the laptop screen, and the veil that carries the
   page into the dark colour. Nothing here touches the other screens. */
(() => {
  'use strict';

  const section = document.getElementById('screen-1');
  if (!section) return;

  const video = document.getElementById('hero-video');
  const copy = document.getElementById('hero-copy');
  const ui = document.getElementById('hero-ui');
  const veil = document.getElementById('hero-veil');
  const src = video.dataset.src;

  // Reduced motion: static composition (poster, copy visible, no pin).
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Phases, as fractions of the runway.
  const VIDEO_END = 0.72;            // video reaches its last frame
  const COPY_OUT = [0.03, 0.2];      // copy fades out
  const UI_IN = [0.55, 0.64];        // interface lights up on the laptop screen
  const SINK = [0.74, 0.92];         // interface sinks, veil takes over

  const SMOOTHING_BASE = 0.001;      // ~90% of any gap closes in ~0.3s

  let duration = 0;
  let latest = 0;
  let smoothed = 0;
  let last = null;
  let inView = true;

  const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
  const range = (p, [a, b]) => clamp((p - a) / (b - a));
  const ease = (t) => t * t * (3 - 2 * t);

  // Load the video fully into memory so seeking is instant. Fall back to a
  // direct link when fetch is not possible (for example over file://).
  function loadVideo() {
    if (!src) return;
    fetch(src)
      .then((r) => { if (!r.ok) throw new Error('video'); return r.blob(); })
      .then((blob) => { video.src = URL.createObjectURL(blob); })
      .catch(() => { video.src = src; });
  }

  video.addEventListener('loadedmetadata', () => {
    duration = video.duration || 0;
  });

  function progress() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return clamp(-rect.top / scrollable);
  }

  function apply(p) {
    // Copy
    const c = ease(range(p, COPY_OUT));
    copy.style.opacity = String(1 - c);
    copy.style.transform = `translateY(${-c * 28}px)`;
    copy.style.pointerEvents = c > 0.95 ? 'none' : '';
    copy.style.visibility = c >= 1 ? 'hidden' : '';

    // Interface
    const a = ease(range(p, UI_IN));
    const s = ease(range(p, SINK));
    const scale = (0.94 + 0.06 * a) * (1 - 0.12 * s);
    ui.style.opacity = String(a * (1 - s));
    ui.style.transform = `translateY(${-s * 3}vh) scale(${scale})`;

    // Veil
    veil.style.opacity = String(s);
  }

  function frame(ts) {
    const dt = last === null ? 0 : (ts - last) / 1000;
    last = ts;

    if (inView) {
      const factor = 1 - Math.pow(SMOOTHING_BASE, dt);
      smoothed += (latest - smoothed) * factor;

      if (duration && !video.seeking) {
        const t = clamp(smoothed / VIDEO_END) * duration;
        if (Math.abs(video.currentTime - t) > 1 / 48) video.currentTime = t;
      }
      apply(smoothed);
    }
    requestAnimationFrame(frame);
  }

  function onScroll() {
    latest = progress();
  }

  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView) onScroll();
  }, { rootMargin: '10% 0px' }).observe(section);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  onScroll();
  smoothed = latest;
  apply(smoothed);
  loadVideo();
  requestAnimationFrame(frame);
})();
