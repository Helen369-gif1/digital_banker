(function () {
  'use strict';

  var BALANCE = 4520;
  var FEE = 2.5;

  var amountInput = document.getElementById('amount');
  var remainingEl = document.getElementById('remaining');
  var memo = document.getElementById('memo');
  var memoCount = document.getElementById('memo-count');

  function money(value) {
    var sign = value < 0 ? '-' : '';
    var abs = Math.abs(value);
    var hasCents = Math.round(abs * 100) % 100 !== 0;
    return sign + '$' + abs.toLocaleString('en-US', {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2
    });
  }

  function readAmount() {
    var digits = amountInput.value.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }

  function updateAmount() {
    var n = readAmount();
    amountInput.value = n ? n.toLocaleString('en-US') : '';
    remainingEl.textContent = money(BALANCE - n - FEE);
  }

  amountInput.addEventListener('input', updateAmount);

  // "When" toggle
  var whenButtons = document.querySelectorAll('.btn-when');
  whenButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      whenButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    });
  });

  // Memo counter
  function updateMemo() {
    memoCount.textContent = memo.value.length + '/100';
  }
  memo.addEventListener('input', updateMemo);

  // Prototype only: no submit
  document.getElementById('amount-form').addEventListener('submit', function (e) {
    e.preventDefault();
  });

  updateAmount();
  updateMemo();
})();
