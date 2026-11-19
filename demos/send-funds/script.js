const toastEl = document.getElementById('toast');
let timer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function receiptText() {
  return [...document.querySelectorAll('.row')]
    .map(r => `${r.querySelector('dt').textContent}: ${r.querySelector('dd').innerText.replace(/\s+/g, ' ').trim()}`)
    .join('\n');
}

const handlers = {
  download() {
    const blob = new Blob([receiptText()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'receipt.txt';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Receipt downloaded');
  },
  email() {
    location.href = 'mailto:?subject=' + encodeURIComponent('Transfer receipt') +
      '&body=' + encodeURIComponent(receiptText());
  },
  print() { window.print(); },
  async share() {
    const data = { title: 'Transfer receipt', text: receiptText() };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.text); toast('Receipt copied to clipboard'); }
    } catch (e) { /* cancelled */ }
  },
  support(e) { e.preventDefault(); toast('Reference ID: ' + document.getElementById('ref').textContent); },
  details() { toast('Opening transfer details…'); },
  done() { toast('Done'); },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (el && handlers[el.dataset.action]) handlers[el.dataset.action](e);
});
