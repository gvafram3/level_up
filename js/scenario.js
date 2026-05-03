function calcScenario() {
  const prevCWA  = parseFloat(document.getElementById('sc-prev-cwa').value) || 0;
  const prevCr   = parseFloat(document.getElementById('sc-prev-cr').value)  || 1;
  const trailCr  = parseFloat(document.getElementById('sc-cr').value)       || 3;
  const resitScore = parseFloat(document.getElementById('sc-resit-score').value) || 55;

  const prevWP       = prevCWA * prevCr;
  const totCr        = prevCr + trailCr;
  const cwaWithTrail = (prevWP + 0)              / totCr;
  const cwaWithResit = (prevWP + resitScore * trailCr) / totCr;
  const cwaWithA     = (prevWP + 85 * trailCr)  / totCr;

  const scenarios = [
    { label: 'Original Trail (F — score 0)',          cwa: cwaWithTrail, color: '#ff5555' },
    { label: `Resit Cleared (score ${resitScore}%)`,  cwa: cwaWithResit, color: classColor(cwaWithResit) },
    { label: 'Best Resit (A — score 85%)',            cwa: cwaWithA,     color: '#6bff9e' },
  ];

  document.getElementById('trail-bars').innerHTML = scenarios.map(s => `
    <div class="trail-bar-row">
      <span class="trail-bar-label">${s.label}</span>
      <div class="trail-bar-track">
        <div class="trail-bar-fill" style="width:${Math.min(100,(s.cwa)).toFixed(1)}%;background:${s.color}"></div>
      </div>
      <span class="trail-bar-val">${s.cwa.toFixed(1)}%</span>
      <span style="font-size:10px;color:rgba(255,255,255,.4);margin-left:8px;width:160px">${classify(s.cwa)}</span>
    </div>
  `).join('');
}
