/* Hero live demo: an automatic, non-interactive run of the example interface on the
   laptop screen. hero-scene.js calls heroDemoSet(true/false) as the interface comes
   into / leaves full view. Leaving stops it; coming back starts it from the beginning. */
(() => {
  'use strict';

  const frame = document.getElementById('hero-demo');
  if (!frame) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (matchMedia('(max-width: 768px)').matches) return; // phone view keeps the still image

  const wrap = frame.parentElement;
  const ui = document.getElementById('hero-ui');
  let ready = false;
  let want = false;
  let playing = false;

  function fit() {
    frame.style.transform = 'scale(' + (wrap.clientWidth / 1440) + ')';
  }

  function sync() {
    if (!ready || want === playing) return;
    playing = want;
    frame.contentWindow.postMessage({ type: want ? 'demo-play' : 'demo-stop' }, '*');
    frame.classList.toggle('is-live', want);
    if (!want) ui.classList.remove('demo-scrolled');
  }

  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(wrap);
  else addEventListener('resize', fit);

  addEventListener('message', (e) => {
    if (e.source !== frame.contentWindow || !e.data) return;
    if (e.data.type === 'demo-ready') { ready = true; sync(); }
    else if (e.data.type === 'demo-scrolled') ui.classList.toggle('demo-scrolled', !!e.data.value);
  });

  // Load after the page itself, so the hero is not slowed down
  addEventListener('load', () => { frame.src = frame.dataset.src; });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) { want = false; sync(); }
  });

  window.heroDemoSet = (on) => {
    if (on === want) return;
    want = on;
    sync();
  };
})();
