/* Live interface fragments for screens 2 to 5 (see css/fragments.css).
   Every fragment is written in HTML in its final state. Here each scene is armed (hidden beats), then
   played once when 40% visible, on its own clock that pauses while off screen. It always ends on the
   markup's final frame. With reduced motion, under 768px, or without JS, the final frame is shown at once.
   If anything fails, the old picture (.fx-fallback) stays. */
(() => {
  'use strict';

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 767px)');
  const animated = () => !calm.matches && !narrow.matches;

  const $ = (r, s) => r.querySelector(s);
  const $$ = (r, s) => Array.from(r.querySelectorAll(s));
  const clamp01 = (n) => Math.max(0, Math.min(1, n));

  /* ---------- Timeline: steps on a clock that stops while the scene is off screen ---------- */
  class Timeline {
    constructor() { this.items = []; this.t = 0; this.run = false; this.vis = true; this.done = false; this.raf = 0; this.last = 0; }
    at(ms, fn) { this.items.push({ a: ms, b: ms, fn, d: false }); return this; }
    span(ms, dur, fn) { this.items.push({ a: ms, b: ms + dur, fn, d: false }); return this; }
    start() { this.run = true; this.kick(); }
    kick() {
      if (this.raf || !this.run || !this.vis) return;
      this.last = performance.now();
      this.raf = requestAnimationFrame((n) => this.tick(n));
    }
    setVisible(v) { this.vis = v; if (v) this.kick(); }
    tick(now) {
      this.raf = 0;
      if (!this.run) return;
      this.t += Math.min(now - this.last, 100);
      this.last = now;
      for (const it of this.items) {
        if (it.d || this.t < it.a) continue;
        if (it.b > it.a) {
          const p = clamp01((this.t - it.a) / (it.b - it.a));
          it.fn(p);
          if (p >= 1) it.d = true;
        } else { it.fn(1); it.d = true; }
      }
      if (this.items.every((i) => i.d)) { this.run = false; this.done = true; return; }
      if (this.vis) this.raf = requestAnimationFrame((n) => this.tick(n));
    }
    finish() {
      this.items.forEach((it) => { if (!it.d) { it.fn(1); it.d = true; } });
      this.run = false; this.done = true;
    }
  }

  const show = (r, n) => $$(r, `[data-b="${n}"]`).forEach((el) => el.classList.add('is-on'));
  const typeTo = (el, p) => {
    const full = el.dataset.full;
    $(el, '.ty__live').textContent = full.slice(0, Math.round(p * full.length));
    el.classList.toggle('is-typing', p > 0 && p < 1);
  };
  const setActive = (items, i) => items.forEach((el, k) => el.classList.toggle('is-active', k === i));

  /* ---------- Scenes. init() sets the first frame; build() lays out the beats ---------- */
  const scenes = {};

  scenes.send = {
    init(r) {
      const ty = $(r, '.ty'); $(ty, '.ty__live').textContent = '';
      $(r, '.fx__steps').classList.remove('is-review');
      $(r, '[data-btn]').classList.remove('is-done');
    },
    build(tl, r) {
      const ty = $(r, '.ty'), amount = $(r, '.fx__amount'), seg = $$(r, '[data-seg]');
      const date = $(r, '[data-date]'), btn = $(r, '[data-btn]'), steps = $(r, '.fx__steps');
      tl.at(200, () => show(r, 1)).at(900, () => show(r, 2));
      tl.span(1500, 800, (p) => { typeTo(ty, p); amount.classList.toggle('is-typing', p < 1); });
      tl.at(2700, () => show(r, 3));
      tl.at(3500, () => { setActive(seg, 1); date.classList.remove('is-dim'); });
      tl.at(4700, () => { setActive(seg, 0); date.classList.add('is-dim'); });
      tl.at(5200, () => show(r, 4)).at(5900, () => show(r, 5));
      tl.at(6700, () => btn.classList.add('is-press'));
      tl.at(6900, () => { btn.classList.remove('is-press'); btn.classList.add('is-done'); steps.classList.add('is-review'); });
    }
  };

  scenes.recv = {
    init(r) { $(r, '[data-req]').dataset.state = '0'; },
    build(tl, r) {
      const req = $(r, '[data-req]'), qr = $(r, '[data-qr]');
      tl.at(200, () => show(r, 1)).at(700, () => show(r, 2));
      tl.at(1200, () => qr.classList.add('is-drawn'));
      tl.at(2700, () => show(r, 3));
      tl.at(4200, () => { req.dataset.state = '1'; });
      tl.at(5800, () => { req.dataset.state = '2'; });
      tl.at(6400, () => show(r, 4));
    }
  };

  scenes.add = {
    init(r) {
      setTab(r, 0);
      $$(r, '[data-ach]').forEach((el) => el.classList.remove('is-active'));
      $(r, '.fx__details').classList.remove('is-open');
    },
    build(tl, r) {
      const fills = $$(r, '[data-fill]');
      tl.at(200, () => show(r, 1)).at(700, () => show(r, 2)).at(900, () => show(r, 3));
      tl.at(2600, () => setTab(r, 2));
      tl.at(4200, () => setTab(r, 1));
      fills.forEach((el, i) => tl.at(4500 + i * 450, () => el.classList.add('is-on')));
      tl.at(5200, () => $(r, '[data-ach]').classList.add('is-active'));
      tl.at(7000, () => $(r, '.fx__details').classList.add('is-open'));
    }
  };

  /* Screen 3: four chips light up in turn and change the interface behind them; then a transaction opens a receipt */
  function chipTo(r, i) {
    setActive($$(r, '[data-chip-li]'), i);
    $$(r, '[data-rp]').forEach((p) => p.classList.toggle('is-active', Number(p.dataset.rp) === i));
  }
  function txTo(r, name) {
    $$(r, '[data-tp]').forEach((p) => p.classList.toggle('is-active', p.dataset.tp === name));
  }

  scenes.repeat = {
    init(r) { chipTo(r, 0); txTo(r, 'list'); $(r, '[data-tx]').classList.remove('is-hl'); },
    build(tl, r) {
      [200, 500, 800, 1100].forEach((ms, k) => tl.at(ms, () => show(r, k + 1)));
      [700, 2800, 4900, 7000].forEach((ms, k) => tl.at(ms, () => chipTo(r, k)));
      tl.at(9000, () => $(r, '[data-tx]').classList.add('is-hl'));
      tl.at(9800, () => txTo(r, 'receipt'));
      tl.at(10000, () => show(r, 6)).at(10300, () => show(r, 7)).at(10800, () => show(r, 8));
    }
  };

  function setTab(r, i) {
    const names = ['add', 'withdraw', 'convert'];   // tab order as written in the markup
    $(r, '.fx__tabs').dataset.active = String(i);
    setActive($$(r, '.fx__tabs > span'), i);
    $$(r, '.fx__panel').forEach((p) => p.classList.toggle('is-active', p.dataset.panel === names[i]));
  }

  /* ---------- QR placeholder: a deterministic pattern that draws in cell by cell ---------- */
  function buildQR(el) {
    const N = 21;
    let seed = 7;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const finder = (x, y) => {
      const inBox = (ox, oy) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
      for (const [ox, oy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
        if (inBox(ox, oy)) {
          const dx = x - ox, dy = y - oy;
          const ring = dx === 0 || dy === 0 || dx === 6 || dy === 6;
          const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
          return ring || core ? 1 : 0;
        }
        if (x >= ox - 1 && x <= ox + 7 && y >= oy - 1 && y <= oy + 7) return 0;
      }
      return -1;
    };
    let rects = '';
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let v = finder(x, y);
        if (v < 0) v = rnd() > 0.52 ? 1 : 0;
        if (v) rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02" style="--d:${Math.round(((y * N + x) / (N * N)) * 1200)}ms"/>`;
      }
    }
    el.innerHTML = `<svg viewBox="0 0 ${N} ${N}" aria-hidden="true" shape-rendering="crispEdges">${rects}</svg>`;
  }

  /* ---------- Screen 4: Gia's steps drive the card, the bubble and the funds check.
     js/gia-steps.js stays in charge of the sequence; this only listens to the classes it sets. ---------- */
  function watchClass(el, fn) {
    new MutationObserver(() => fn(el)).observe(el, { attributes: true, attributeFilter: ['class'] });
  }

  function tween(dur, fn) {
    const t0 = performance.now();
    const f = (now) => { const p = clamp01((now - t0) / dur); fn(p); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }

  function giaLive() {
    const stage = document.getElementById('gia-stage');
    if (!stage) return;
    // Reduced motion: gia-steps.js shows everything at once, including "Thinking…" beside finished steps
    if (calm.matches) { const th = $(stage, '.gia__thinking'); if (th) th.hidden = true; }
    if (!animated()) return;

    const steps = $$(stage, '.gia__steps li');
    const bubble = $(stage, '.gia__bubble');
    const back = $(stage, '.gia__back');
    const card = $(stage, '.gia__card');
    const appr = document.getElementById('approve-card');
    if (!steps.length || !bubble || !card) return;

    const ROWS = [[0], [1], [2, 3], [4]];     // card rows that arrive when step i is done
    const rowsOf = (c, sel) => $$(c, sel);
    const giaRows = rowsOf(card, '.gia__rows > div');
    const apRows = appr ? rowsOf(appr, ':scope > .approve__rows > div') : [];
    card.classList.add('is-building');

    // Bubble: the words type in once it appears
    const ty = $(bubble, '.ty');
    $(ty, '.ty__live').textContent = '';
    let typed = false;
    watchClass(bubble, () => {
      if (typed || !bubble.classList.contains('is-in')) return;
      typed = true;
      tween(1000, (p) => typeTo(ty, p));
    });

    // Funds check (the back screen): its two ticks arrive after the screen does
    if (back) {
      const ticks = $$(back, '.fx__ok');
      ticks.forEach((t) => t.classList.add('is-off'));
      let ran = false;
      watchClass(back, () => {
        if (ran || !back.classList.contains('is-in')) return;
        ran = true;
        ticks.forEach((t, k) => setTimeout(() => t.classList.remove('is-off'), 500 + k * 600));
      });
    }

    // The card builds row by row as each step is done. On screen 5 the same card is carried in by
    // js/card-morph.js; while it travels, its first five rows build in the same way.
    steps.forEach((li, i) => {
      let seen = false;
      watchClass(li, () => {
        if (seen || !li.classList.contains('is-done')) return;
        seen = true;
        if (i === 0) {
          const withApproval = appr && document.documentElement.classList.contains('morph');
          if (withApproval) {
            appr.classList.add('is-snap', 'is-building');
            void appr.offsetWidth;
            requestAnimationFrame(() => appr.classList.remove('is-snap'));
          }
          card.classList.add('is-in');
        }
        ROWS[i].forEach((k) => {
          if (giaRows[k]) giaRows[k].classList.add('is-on');
          if (apRows[k]) apRows[k].classList.add('is-on');
        });
      });
    });
  }

  /* ---------- Screen 5: the triad lights up with the card; Approve shows a short completion state ---------- */
  function approveLive() {
    const card = document.getElementById('approve-card');
    const stage = card && card.closest('.approve__stage');
    const triad = document.querySelector('.approve__triad');
    if (!card || !stage || !triad) return;

    // Completion works with or without the animation
    card.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-choice]');
      if (!btn) return;
      card.classList.toggle('is-approved', btn.dataset.choice === 'approve');
    });

    if (!animated() || !('IntersectionObserver' in window)) return;

    const items = $$(triad, 'li');
    const mainRows = $$(card, ':scope > .approve__rows > div');
    const extraRows = $$(card, '.approve__extra .approve__rows > div');
    const ticks = $$(card, '[data-activity] .fx__ok');
    const actions = $(card, '.approve__actions');
    const hl = (rows, k) => rows.forEach((r, j) => r.classList.toggle('is-hl', j === k));

    triad.classList.add('is-sync');
    ticks.forEach((t) => t.classList.add('is-off'));

    const tl = new Timeline();
    tl.at(400, () => items[0].classList.add('is-lit'));
    mainRows.forEach((_, k) => tl.at(500 + k * 320, () => hl(mainRows, k)));
    tl.at(2500, () => { hl(mainRows, -1); items[1].classList.add('is-lit'); });
    extraRows.forEach((_, k) => tl.at(2700 + k * 350, () => hl(extraRows, k)));
    ticks.forEach((t, k) => tl.at(3500 + k * 400, () => t.classList.remove('is-off')));
    tl.at(5300, () => { hl(extraRows, -1); items[2].classList.add('is-lit'); actions.classList.add('is-ready'); });

    let started = false;
    new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      tl.setVisible(e.isIntersecting);
      if (!started && e.isIntersecting && (e.intersectionRatio >= 0.4 || e.intersectionRect.height >= window.innerHeight * 0.6)) { started = true; tl.start(); }
    }, { threshold: [0, 0.2, 0.4, 0.6] }).observe(stage);
  }

  /* ---------- Mounting ---------- */
  function mountFx(scope) {
    const list = scope.matches('.fx[hidden]') ? [scope] : $$(scope, '.fx[hidden]');
    list.forEach((fx) => {
      fx.hidden = false;
      const fb = fx.parentElement && $(fx.parentElement, ':scope > .fx-fallback');
      if (fb) fb.hidden = true;
    });
  }

  function play(scene, def) {
    scene.classList.add('is-armed');
    if (def.init) def.init(scene);
    const tl = new Timeline();
    def.build(tl, scene);
    scene._tl = tl;
    let started = false;
    new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      tl.setVisible(e.isIntersecting);
      const enough = e.intersectionRatio >= 0.4 || e.intersectionRect.height >= window.innerHeight * 0.6;
      if (!started && e.isIntersecting && enough) { started = true; tl.start(); }
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] }).observe(scene);
  }

  function init() {
    $$(document, '[data-qr]').forEach(buildQR);
    // Fragments outside the timed scenes (the back screens on screens 4 and 5)
    $$(document, '.fx[hidden]').filter((fx) => !fx.closest('[data-scene]') && !fx.matches('[data-scene]')).forEach(mountFx);
    giaLive();
    approveLive();
    $$(document, '[data-scene]').forEach((scene) => {
      const def = scenes[scene.dataset.scene];
      try {
        mountFx(scene);
        if (def && animated() && 'IntersectionObserver' in window) play(scene, def);
        // Chips work with or without the animation; a click stops the autoplay at its end state
        $$(scene, '[data-chip]').forEach((b) => b.addEventListener('click', () => {
          if (scene._tl && !scene._tl.done) scene._tl.finish();
          chipTo(scene, Number(b.dataset.chip));
        }));
      } catch (err) {
        // Keep the old picture where a fragment fails
        (scene.matches('.fx') ? [scene] : $$(scene, '.fx')).forEach((fx) => { fx.hidden = true; const fb = fx.parentElement && $(fx.parentElement, ':scope > .fx-fallback'); if (fb) fb.hidden = false; });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
