/* Automatic product demo of the Send funds screen. Controlled by the parent page via postMessage:
   'demo-play' starts it from the beginning, 'demo-stop' halts it and resets the screen.
   Nothing here performs a real action: this page has no click handlers, "clicks" are only visual.
   Posts to the parent: 'demo-ready', and 'demo-scrolled' (true/false) so the parent can hide
   overlays that point at rows of the unscrolled screen. */
(() => {
  'use strict';

  const root = document.documentElement;
  const cursor = document.getElementById('demo-cursor');
  const ring = document.getElementById('demo-ring');
  const q = (s) => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  const navHover = [...document.querySelectorAll('.nav__item')].find((n) => /Payees/.test(n.textContent));
  const download = q('[data-action="download"]');
  const email = q('[data-action="email"]');
  const details = q('[data-action="details"]');

  const END = 8600;                 // one loop, ms
  const SCROLL_DOWN = [1300, 3300]; // reveal the bottom of the screen
  const SCROLL_UP = [5900, 7400];   // glide back to the top

  // Waypoints: cursor arrives at `t`, stays `hold` ms (hover), clicks at t + hold/2 if `click`.
  // `el` = element to hover; `pt` = fixed viewport point (fractions of the window).
  const WP = [
    { t: 0, hold: 0, pt: [0.86, 0.14] },
    { t: 800, hold: 450, el: navHover },
    { t: 1900, hold: 0, pt: [0.55, 0.62] },
    { t: 3300, hold: 700, el: download, click: true },
    { t: 4250, hold: 400, el: email },
    { t: 5000, hold: 800, el: details, click: true },
    { t: 7200, hold: 0, pt: [0.86, 0.14] },
  ];

  const clamp = (v) => Math.max(0, Math.min(1, v));
  const prog = (t, [a, b]) => clamp((t - a) / (b - a));
  const ease = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lerp = (a, b, x) => a + (b - a) * x;

  let raf = 0, start = 0, running = false, maxScroll = 0, pts = [], scrolled = false;

  const scrollAt = (t) => {
    if (t < SCROLL_DOWN[0]) return 0;
    if (t < SCROLL_DOWN[1]) return maxScroll * ease(prog(t, SCROLL_DOWN));
    if (t < SCROLL_UP[0]) return maxScroll;
    return maxScroll * (1 - ease(prog(t, SCROLL_UP)));
  };

  function measure() {
    root.scrollTop = 0;
    maxScroll = Math.max(0, root.scrollHeight - innerHeight);
    pts = WP.map((w) => {
      let x, y;
      if (w.el) {
        const r = w.el.getBoundingClientRect(); // measured at scroll 0, so add scroll back
        x = r.left + r.width * .55;
        y = r.top + r.height * .55 + 0 - scrollAt(w.t) + 0;
      } else {
        x = innerWidth * w.pt[0];
        y = innerHeight * w.pt[1];
      }
      return { ...w, x, y };
    });
  }

  function setHover(el, on) { if (el) el.classList.toggle('is-hover', on); }
  function press(el, on) { if (el) el.classList.toggle('is-pressed', on); }

  function pulse(x, y) {
    ring.animate(
      [{ transform: `translate(${x}px,${y}px) scale(.35)`, opacity: .95 },
       { transform: `translate(${x}px,${y}px) scale(1.7)`, opacity: 0 }],
      { duration: 560, easing: 'ease-out' }
    );
  }

  function resetState() {
    [navHover, download, email, details].forEach((el) => { setHover(el, false); press(el, false); });
    pts.forEach((w) => { w.clicked = false; });
  }

  function frame(now) {
    if (!running) return;
    const t = now - start;
    if (t >= END) { begin(); return; }

    root.scrollTop = scrollAt(t);
    const isScrolled = root.scrollTop > 2;
    if (isScrolled !== scrolled) {
      scrolled = isScrolled;
      parent.postMessage({ type: 'demo-scrolled', value: scrolled }, '*');
    }

    // cursor position: hold at a waypoint, then travel to the next one
    let x = pts[0].x, y = pts[0].y;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[i + 1];
      const leave = a.t + a.hold;
      if (!b || t < leave) { x = a.x; y = a.y; break; }
      if (t < b.t) {
        const k = ease(prog(t, [leave, b.t]));
        x = lerp(a.x, b.x, k); y = lerp(a.y, b.y, k);
        break;
      }
      x = b.x; y = b.y;
    }

    // hover and click feedback
    let s = 1;
    pts.forEach((w) => {
      if (!w.el) return;
      const on = t >= w.t && t < w.t + w.hold;
      setHover(w.el, on);
      if (w.click) {
        const c = w.t + w.hold * .5, d = t - c;
        if (d >= 0 && !w.clicked) { w.clicked = true; press(w.el, true); pulse(x, y); setTimeout(() => press(w.el, false), 240); }
        if (d > 0 && d < 240) s = 1 - .16 * Math.sin(Math.PI * d / 240);
      }
    });

    const op = prog(t, [0, 350]) * (1 - prog(t, [7300, 7800]));
    cursor.style.opacity = op;
    cursor.style.transform = `translate(${x}px,${y}px) scale(${s})`;
    raf = requestAnimationFrame(frame);
  }

  function begin() {
    cancelAnimationFrame(raf);
    resetState();
    measure();
    resetState();
    cursor.style.opacity = 0;
    start = performance.now();
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    resetState();
    cursor.style.opacity = 0;
    root.scrollTop = 0;
    if (scrolled) { scrolled = false; parent.postMessage({ type: 'demo-scrolled', value: false }, '*'); }
  }

  addEventListener('message', (e) => {
    if (e.source !== parent) return;
    const type = e.data && e.data.type;
    if (type === 'demo-play' && !reduce.matches) begin();
    else if (type === 'demo-stop') stop();
  });

  const ready = () => parent.postMessage({ type: 'demo-ready' }, '*');
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ready, ready);
})();
