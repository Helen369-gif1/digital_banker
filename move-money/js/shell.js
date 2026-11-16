/* Shell: mobile menu, call-to-action buttons, placeholder links, email form.
   Every call-to-action button leads to the email form in the footer.
   The form is client-only for now: no request is sent and nothing is stored. */
(() => {
  'use strict';

  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const header = document.querySelector('.site-header');

  // ---- Mobile menu ----
  function setMenu(open, returnFocus) {
    if (!toggle || !menu) return;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(menu.hidden));

    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) setMenu(false, true);
    });

    document.addEventListener('click', (e) => {
      if (!menu.hidden && !header.contains(e.target)) setMenu(false);
    });

    window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
  }

  // ---- Placeholder links do nothing until their destination is supplied ----
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-placeholder]');
    if (link) e.preventDefault();
  });

  // ---- Call-to-action buttons: go to the form, then put the cursor in the email field ----
  const form = document.getElementById('register-form');
  const input = document.getElementById('register-email');
  const msg = document.getElementById('register-msg');

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-register]');
    if (!link || !input) return;
    setTimeout(() => input.focus({ preventScroll: true }), 50);
  });

  if (!form || !input || !msg) return;

  input.addEventListener('input', () => { msg.textContent = ''; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.validity.valid || !input.value.trim()) {
      msg.textContent = 'Enter a valid email address.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    // TODO: wire up the real registration endpoint
    msg.textContent = 'Demo only. Nothing has been sent.';
    input.value = '';
  });
})();
