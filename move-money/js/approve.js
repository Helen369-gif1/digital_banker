/* Screen 5 - the example approval card. The person's click is the only thing that decides;
   either choice can be changed by clicking the other button. */
(() => {
  'use strict';

  const card = document.getElementById('approve-card');
  const status = document.getElementById('approve-status');
  if (!card || !status) return;

  const buttons = Array.from(card.querySelectorAll('[data-choice]'));
  const text = { approve: 'Approved by you.', decline: 'Declined by you.' };

  card.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-choice]');
    if (!btn) return;
    const choice = btn.dataset.choice;
    buttons.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('app-btn--solid', on);
      b.setAttribute('aria-pressed', String(on));
    });
    status.textContent = text[choice];
  });
})();
