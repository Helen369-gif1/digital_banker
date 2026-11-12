/* ======================================================================
   BACK TO ATRIUM — общая кнопка-стрелка «Назад в Атриум»
   Одна на все сайты. Стоит слева, сразу под верхней панелью сайта.

   КАК ПОДКЛЮЧИТЬ К СТРАНИЦЕ (в самом конце index.html, перед </body>):
     <script src="../shared/atrium-back.js" defer></script>

   КУДА ВЕДЁТ: по умолчанию на ../atrium-site/index.html.
   Если нужно другое место (например, после публикации в интернете),
   поменяйте строку DEFAULT_HREF ниже — изменится сразу на всех сайтах.
   Для одной страницы можно задать своё: <script ... data-href="https://...">
   ====================================================================== */
(function () {
  'use strict';
  if (document.getElementById('atrium-back')) return;

  var DEFAULT_HREF = '../atrium-site/index.html';
  var script = document.currentScript;
  var href = (script && script.getAttribute('data-href')) || DEFAULT_HREF;

  var style = document.createElement('style');
  style.textContent =
    '#atrium-back{position:fixed;left:16px;top:16px;z-index:900;display:flex;align-items:center;justify-content:center;' +
    'width:44px;height:44px;border-radius:50%;color:#fff;text-decoration:none;' +
    'background:rgba(14,12,20,.62);border:1px solid rgba(255,255,255,.35);box-shadow:0 2px 14px rgba(0,0,0,.28);' +
    '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);-webkit-tap-highlight-color:transparent;' +
    'transition:background .2s ease,transform .2s ease}' +
    '#atrium-back:hover{background:rgba(14,12,20,.82);transform:translateX(-2px)}' +
    '#atrium-back:focus-visible{outline:2px solid #c9a24a;outline-offset:3px}' +
    '@media (max-width:600px){#atrium-back{left:10px}}' +
    '@media (prefers-reduced-motion:reduce){#atrium-back{transition:none}#atrium-back:hover{transform:none}}';
  document.head.appendChild(style);

  var a = document.createElement('a');
  a.id = 'atrium-back';
  a.href = href;
  a.setAttribute('aria-label', 'Back to Atrium');
  a.title = 'Back to Atrium';
  a.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' +
    '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(a);

  // Ставим кнопку прямо под закреплённой верхней панелью страницы (если она есть).
  function place() {
    var bottom = 0;
    var bars = document.querySelectorAll('header, #top');
    for (var i = 0; i < bars.length; i++) {
      var pos = getComputedStyle(bars[i]).position;
      if (pos !== 'fixed' && pos !== 'sticky') continue;
      var r = bars[i].getBoundingClientRect();
      if (r.top <= 24 && r.height > 0 && r.bottom < 220 && r.bottom > bottom) bottom = r.bottom;
    }
    a.style.top = bottom
      ? Math.round(bottom + 12) + 'px'
      : 'calc(16px + env(safe-area-inset-top, 0px))';
  }
  place();
  window.addEventListener('resize', place);
  window.addEventListener('load', function () { place(); setTimeout(place, 600); });
})();
