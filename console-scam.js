// Paste this into the browser console on bank-demo.html
// Simulates the scam: a fake $2,000 "withdrawal" appears and the balance drops

(async function() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // The new fake transaction row
  const fakeRow = document.createElement('tr');
  fakeRow.innerHTML = `
    <td class="txn-date" style="color:#d93025;font-weight:600">May 11</td>
    <td>
      <div class="txn-desc" style="color:#d93025">EXT TRANSFER - UNKNOWN RECIPIENT</div>
      <div class="txn-category">Wire Transfer Out</div>
    </td>
    <td><span class="txn-status status-pending">Pending</span></td>
    <td class="txn-amount debit" style="color:#d93025;font-size:15px">-$2,000.00</td>
    <td class="txn-balance">$2,285.63</td>
  `;
  fakeRow.style.opacity = '0';
  fakeRow.style.transition = 'opacity 0.6s ease-in';
  fakeRow.style.background = '#fff5f5';

  // Insert at top of transaction table
  const tbody = document.querySelector('.txn-table tbody');
  tbody.insertBefore(fakeRow, tbody.firstChild);

  // Animate the row appearing
  await sleep(100);
  fakeRow.style.opacity = '1';

  // Animate the balance counting down
  await sleep(800);

  const balanceEl = document.getElementById('checkingBalance');
  const availableEl = balanceEl.parentElement.querySelector('.account-available');
  const startBalance = 4285.63;
  const endBalance = 2285.63;
  const steps = 40;
  const stepTime = 30;

  for (let i = 1; i <= steps; i++) {
    const current = startBalance - ((startBalance - endBalance) * (i / steps));
    balanceEl.textContent = '$' + current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    balanceEl.style.color = '#d93025';
    await sleep(stepTime);
  }

  availableEl.textContent = 'Available: $2,285.63';
  availableEl.style.color = '#d93025';
})();
