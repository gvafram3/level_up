function calcTarget() {
  const cum    = getCumulativeUpTo(activeYear, activeSem);
  const totCr  = cum.totCr;
  const totWP  = cum.totWP;

  const tgtCWA = parseFloat(document.getElementById('tgt-cwa').value) || 65;
  const nextCr = parseFloat(document.getElementById('tgt-cr').value)  || 20;

  if (!totCr) { document.getElementById('target-score').textContent = '—'; return; }

  const neededScore = (tgtCWA * (totCr + nextCr) - totWP) / nextCr;
  const el  = document.getElementById('target-score');
  const msg = document.getElementById('target-msg');

  if (neededScore < 0) {
    el.textContent = '0%'; el.style.color = '#6bff9e';
    msg.textContent = 'You already exceed your target!';
  } else if (neededScore > 100) {
    el.textContent = '> 100%'; el.style.color = '#ff5555';
    msg.textContent = 'Target not reachable this semester alone — adjust target or add more semesters.';
  } else {
    el.textContent = neededScore.toFixed(1) + '%';
    el.style.color = classColor(neededScore);
    msg.textContent = `You need an average score of ${neededScore.toFixed(1)}% next semester.`;
  }

  const rows = [
    ["All A's",          'A', 85],
    ["Mostly B's",       'B', 65],
    ["Mostly C's",       'C', 55],
    ["Mostly D's",       'D', 45],
    ["All F's (Trails)", 'F', 20],
  ];
  const tbl = `<table class="gtable" style="font-size:12px">
    <tr><th>Scenario</th><th>Grade</th><th>Avg Score</th><th>Projected CWA</th><th>Classification</th><th>Meets Target?</th></tr>
    ${rows.map(([s, g, sc]) => {
      const proj  = (totWP + sc * nextCr) / (totCr + nextCr);
      const meets = proj >= tgtCWA;
      return `<tr>
        <td>${s}</td>
        <td style="text-align:center">${g}</td>
        <td style="text-align:center">${sc}%</td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${classColor(proj)};text-align:center">${proj.toFixed(1)}%</td>
        <td>${classify(proj)}</td>
        <td style="font-weight:700;color:${meets ? '#6bff9e' : '#ff6b6b'};text-align:center">${meets ? '✓ Yes' : '✗ Not yet'}</td>
      </tr>`;
    }).join('')}
  </table>`;
  document.getElementById('proj-table-wrap').innerHTML = tbl;
}

function printContract() {
  window.print();
}


