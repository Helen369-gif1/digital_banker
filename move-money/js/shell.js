/* Shell: placeholder links do nothing until their destination is supplied. */
(() => {
  'use strict';

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-placeholder]');
    if (link) e.preventDefault();
  });
})();
