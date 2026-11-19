/* Automatic product demo. Controlled from the parent page by postMessage:
   'demo-play' starts it from the beginning, 'demo-stop' halts it.
   Nothing here performs a real action: clicks are only visual. */
(() => {
  'use strict';

  const root = document.documentElement;
  const cursor = document.getElementById('demo-cursor');
  const ring = document.getElementById('demo-ring');
  const btnA = document.querySelector('[data-action="email"]');
  const btnB = document.querySelector('[data-action="details"]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // Timeline in ms
  const T = {
    fadeIn: [0, 700],
    cursorIn: [800, 1200],
    toA: [1200, 2700], clickA: 3000,
    scroll: [3500, 5600],
    toB: [4600, 6000], clickB: 6400,
    cursorOut: [7000, 7400],
    fadeOut: [7500, 8200],
    end: 9400, // short pause, then loop
  };

  const clamp = (v) => Math.max(0, Math.min(1, v));
  const prog = (t, [a, b]) => clamp((t - a) / (b - a));
  const ease = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lerp = (a, b, x) => a + (b - a) * x;

  let raf = 0, start = 0, running = false;
  let geo = null;

  function center(el, scrollY) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width * .55, y: r.top + scrollY + r.height * .55 };
  }

  function measure() {
    root.scrollTop = 0;
    const max = Math.max(0, root.scrollHeight - innerHeight);
    const a = center(btnA, 0), b = center(btnB, 0);
    geo = {
      max,
      origin: { x: innerWidth * .8, y: innerHeight * .2 },
      a: { x: a.x, y: a.y },
      b: { x: b.x, y: b.y - max }, // viewport position once scrolled
    };
  }

  function press(el, on) { el.classList.toggle('is-pressed', on); }

  function pulse(x, y) {
    ring.animate(
      [{ transform: `translate(${x}px,${y}px) scale(.4)`, opacity: .9 },
       { transform: `translate(${x}px,${y}px) scale(1.5)`, opacity: 0 }],
      { duration: 520, easing: 'ease-out' }
    );
  }

  let doneA = false, doneB = false;

  function frame(now) {
    if (!running) return;
    const t = now - start;
    if (t >= T.end) { begin(); return; }

    root.classList.toggle('demo-visible', t >= T.fadeIn[0] && t < T.fadeOut[0]);

    // scroll
    root.scrollTop = geo.max * ease(prog(t, T.scroll));

    // cursor position (viewport coordinates)
    let x, y;
    if (t < T.toB[0]) {
      const k = ease(prog(t, T.toA));
      x = lerp(geo.origin.x, geo.a.x, k);
      y = lerp(geo.origin.y, geo.a.y, k);
      // while scrolling, the cursor stays put on screen
    } else {
      const k = ease(prog(t, T.toB));
      x = lerp(geo.a.x, geo.b.x, k);
      y = lerp(geo.a.y, geo.b.y, k);
    }

    const vis = prog(t, T.cursorIn) * (1 - prog(t, T.cursorOut));
    let s = 1;
    const dA = t - T.clickA, dB = t - T.clickB;
    if (dA > 0 && dA < 220) s = 1 - .14 * Math.sin(Math.PI * dA / 220);
    if (dB > 0 && dB < 220) s = 1 - .14 * Math.sin(Math.PI * dB / 220);
    cursor.style.opacity = vis;
    cursor.style.transform = `translate(${x}px,${y}px) scale(${s})`;

    if (!doneA && t >= T.clickA) {
      doneA = true; press(btnA, true); pulse(x, y);
      setTimeout(() => press(btnA, false), 260);
    }
    if (!doneB && t >= T.clickB) {
      doneB = true; press(btnB, true); pulse(x, y);
      setTimeout(() => press(btnB, false), 260);
    }
    raf = requestAnimationFrame(frame);
  }

  function begin() {
    cancelAnimationFrame(raf);
    doneA = doneB = false;
    root.classList.remove('demo-visible');
    cursor.style.opacity = 0;
    measure();
    start = performance.now();
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    root.classList.remove('demo-visible');
    cursor.style.opacity = 0;
    press(btnA, false); press(btnB, false);
    root.scrollTop = 0;
  }

  addEventListener('message', (e) => {
    if (e.source !== parent) return;
    const type = e.data && e.data.type;
    if (type === 'demo-play' && !reduce.matches) {
      // jump to a hidden frame without animating, so the first fade-in is clean
      root.classList.add('demo-instant', 'demo-run');
      void root.offsetWidth;
      root.classList.remove('demo-instant');
      begin();
    } else if (type === 'demo-stop') {
      stop();
    }
  });

  // Reduced motion: static state, nothing runs.
  reduce.addEventListener?.('change', () => { if (reduce.matches) stop(); });
})();
