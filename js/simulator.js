// ── Grade helpers ──────────────────────────────────────────────────────────
function scoreToGrade(s) {
  if (s >= 70) return 'A';
  if (s >= 60) return 'B';
  if (s >= 50) return 'C';
  if (s >= 40) return 'D';
  return 'F';
}
function classify(c) {
  if (c >= 70) return 'First Class';
  if (c >= 60) return 'Second Class Upper';
  if (c >= 50) return 'Second Class Lower';
  if (c >= 45) return 'Pass';
  return 'No Certificate — Trails Accumulated';
}
function classColor(c) {
  if (c >= 70) return '#6bff9e';
  if (c >= 60) return '#f0d070';
  if (c >= 50) return '#ffa55c';
  if (c >= 45) return '#ff9966';
  return '#ff5555';
}

// ── Input style helpers ────────────────────────────────────────────────────
const iStyle = (color) =>
  `background:transparent;border:none;color:${color};font-family:'Instrument Sans',sans-serif;font-size:12px;width:100%;padding:9px 10px;outline:none`;
const monoStyle = (color) =>
  `background:transparent;border:none;color:${color};font-family:'JetBrains Mono',monospace;font-size:12px;width:100%;padding:9px 10px;outline:none;text-align:center`;

// ── Build rows for a regular semester (1 or 2) ─────────────────────────────
function buildRows(year, sem) {
  const panelId = `sem-panel-${year}-${sem}`;
  let panel = document.getElementById(panelId);
  if (!panel) {
    panel = document.createElement('div');
    panel.id = panelId;
    panel.style.display = 'none';
    document.getElementById('sem-panels').appendChild(panel);
  }

  const courses = semData[year][sem];
  let totCr = 0, totWP = 0, trails = 0;
  courses.forEach(c => { totCr += c.cr; totWP += +c.score * c.cr; if (+c.score < 40) trails++; });
  const semWA = totCr > 0 ? totWP / totCr : 0;
  const cum   = getCumulativeUpTo(year, sem);

  panel.innerHTML = `
    <table class="sim-courses">
      <thead><tr>
        <th style="width:32%">Course Name</th>
        <th style="width:10%">Code</th>
        <th style="width:8%">Credits</th>
        <th style="width:11%">Score (/100)</th>
        <th style="width:7%">Grade</th>
        <th style="width:13%">Weighted Score</th>
        <th style="width:9%">Status</th>
        <th style="width:4%"></th>
      </tr></thead>
      <tbody>${courses.map((c, i) => regularRow(year, sem, c, i)).join('')}</tbody>
      <tfoot>${semFooter(totCr, totWP, semWA, cum)}</tfoot>
    </table>
    <button class="add-course-btn" onclick="addRow(${year},${sem})">+ Add Course</button>
  `;
}

function regularRow(year, sem, c, i) {
  const isTrail = +c.score < 40;
  const grade   = scoreToGrade(+c.score);
  const wp      = +c.score * c.cr;
  return `<tr class="${isTrail ? 'trail-row' : ''}">
    <td><input value="${c.name}" onchange="semData[${year}][${sem}][${i}].name=this.value"
      style="${iStyle('rgba(255,255,255,.85)')}"></td>
    <td><input value="${c.code}" onchange="semData[${year}][${sem}][${i}].code=this.value"
      style="${iStyle('rgba(255,255,255,.5)')}"></td>
    <td><input type="number" value="${c.cr}" min="1" max="6" step="1"
      onchange="semData[${year}][${sem}][${i}].cr=+this.value;rebuildAll()"
      style="${monoStyle('rgba(255,255,255,.85)')}"></td>
    <td><input type="number" value="${c.score}" min="0" max="100" step="1"
      onchange="semData[${year}][${sem}][${i}].score=+this.value;rebuildAll()"
      style="${monoStyle(isTrail ? '#ff9966' : 'rgba(255,255,255,.85)')}"></td>
    <td class="grade-cell" style="color:${isTrail ? '#ff9966' : 'var(--gold)'}">${grade}</td>
    <td class="wp-cell">${wp.toFixed(1)}</td>
    <td class="status-cell ${isTrail ? 'status-trail' : 'status-clear'}">${isTrail ? 'TRAIL' : 'Clear'}</td>
    <td><button class="del-btn" onclick="semData[${year}][${sem}].splice(${i},1);rebuildAll()">✕</button></td>
  </tr>`;
}

// ── Build rows for resit semester (sem 3) ──────────────────────────────────
function buildResitRows(year) {
  const panelId = `sem-panel-${year}-3`;
  let panel = document.getElementById(panelId);
  if (!panel) {
    panel = document.createElement('div');
    panel.id = panelId;
    panel.style.display = 'none';
    document.getElementById('sem-panels').appendChild(panel);
  }

  const trails = getYearTrails(year);
  if (trails.length === 0) {
    panel.innerHTML = `<div style="padding:24px;color:rgba(255,255,255,.4);font-size:13px;text-align:center">
      No trails in Year ${year} — Resit Semester not required.</div>`;
    return;
  }

  // Sync semData[year][3] to match current trails (preserve existing resit scores)
  const existing = {};
  (semData[year][3] || []).forEach(r => { existing[r.code] = r.score; });
  semData[year][3] = trails.map(t => ({
    name:      t.course.name,
    code:      t.course.code,
    cr:        t.course.cr,
    score:     existing[t.course.code] !== undefined ? existing[t.course.code] : '',
    semOrigin: t.semOrigin,
    origIdx:   t.idx,
  }));

  const resitCourses = semData[year][3];
  let totCr = 0, totWP = 0;
  resitCourses.forEach(c => {
    if (c.score !== '' && +c.score >= 0) { totCr += c.cr; totWP += +c.score * c.cr; }
  });
  const semWA = totCr > 0 ? totWP / totCr : 0;
  const cum   = getCumulativeUpTo(year, 3);

  panel.innerHTML = `
    <div class="callout warn" style="margin-bottom:12px">
      <span style="font-size:16px">⚠️</span>
      <div><p>These courses are automatically pulled from trails in Semester 1 &amp; 2 of Year ${year}. Enter the resit score for each.</p></div>
    </div>
    <table class="sim-courses">
      <thead><tr>
        <th style="width:32%">Course Name</th>
        <th style="width:10%">Code</th>
        <th style="width:8%">Credits</th>
        <th style="width:11%">Resit Score (/100)</th>
        <th style="width:7%">Grade</th>
        <th style="width:13%">Weighted Score</th>
        <th style="width:9%">Origin</th>
      </tr></thead>
      <tbody>${resitCourses.map((c, i) => resitRow(year, c, i)).join('')}</tbody>
      <tfoot>${semFooter(totCr, totWP, semWA, cum)}</tfoot>
    </table>
  `;
}

function resitRow(year, c, i) {
  const hasScore = c.score !== '' && c.score !== null;
  const isPass   = hasScore && +c.score >= 40;
  const grade    = hasScore ? scoreToGrade(+c.score) : '—';
  const wp       = hasScore ? (+c.score * c.cr).toFixed(1) : '—';
  const scoreColor = !hasScore ? 'rgba(255,255,255,.4)' : isPass ? '#88ccff' : '#ff9966';
  return `<tr class="${hasScore && !isPass ? 'trail-row' : ''}">
    <td style="padding:9px 10px;color:rgba(255,255,255,.7);font-size:12px">${c.name}</td>
    <td style="padding:9px 10px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace;font-size:11px">${c.code}</td>
    <td style="padding:9px 10px;color:rgba(255,255,255,.5);font-family:'JetBrains Mono',monospace;font-size:12px;text-align:center">${c.cr}</td>
    <td><input type="number" value="${hasScore ? c.score : ''}" min="0" max="100" step="1" placeholder="—"
      onchange="semData[${year}][3][${i}].score=this.value===''?'':+this.value;rebuildAll()"
      style="${monoStyle(scoreColor)}"></td>
    <td class="grade-cell" style="color:${!hasScore ? 'rgba(255,255,255,.3)' : isPass ? 'var(--gold)' : '#ff9966'}">${grade}</td>
    <td class="wp-cell">${wp}</td>
    <td style="padding:9px 10px;font-size:10px;color:rgba(255,255,255,.35);letter-spacing:.08em">Sem ${c.semOrigin}</td>
  </tr>`;
}

// ── Semester footer: totals + cumulative row ───────────────────────────────
function semFooter(totCr, totWP, semWA, cum) {
  return `
    <tr style="background:#1a1a1a;border-top:2px solid #333">
      <td colspan="2" style="padding:8px 10px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4)">Semester Totals</td>
      <td style="padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--gold);text-align:center;font-weight:600">${totCr}</td>
      <td colspan="2" style="padding:8px 10px;font-size:10px;color:rgba(255,255,255,.35)">cr hrs</td>
      <td style="padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--gold);font-weight:600">${totWP.toFixed(1)}</td>
      <td colspan="2" style="padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:13px;color:${classColor(semWA)};font-weight:700">SWA: ${totCr > 0 ? semWA.toFixed(1) + '%' : '—'}</td>
    </tr>
    <tr style="background:#111;border-top:1px solid #222">
      <td colspan="2" style="padding:8px 10px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3)">Cumulative (all sems)</td>
      <td style="padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.6);text-align:center">${cum.totCr}</td>
      <td colspan="2" style="padding:8px 10px;font-size:10px;color:rgba(255,255,255,.3)">cr hrs</td>
      <td style="padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(255,255,255,.6)">${cum.totWP.toFixed(1)}</td>
      <td colspan="2" style="padding:8px 10px;font-family:'JetBrains Mono',monospace;font-size:13px;color:${classColor(cum.cwa)};font-weight:700">CWA: ${cum.totCr > 0 ? cum.cwa.toFixed(1) + '%' : '—'}</td>
    </tr>`;
}

// ── Cumulative calculation up to (year, sem) ───────────────────────────────
// Walk order: Y1S1 → Y1S2 → Y1S3 → Y2S1 → Y2S2 → Y2S3 → ...
// The resit semester is ADDITIVE — the original F score stays in full,
// and the resit adds its own credits + weighted scores on top.
// e.g. Trail: 3cr × 25 = 75 stays. Resit: 3cr × 50 = 150 added on top.
// CWA = (75 + 150 + all other WP) / (3 + 3 + all other cr)
function getCumulativeUpTo(targetYear, targetSem) {
  let totCr = 0, totWP = 0;

  for (let y = 1; y <= 4; y++) {
    for (let s = 1; s <= 3; s++) {
      if (y === targetYear && s > targetSem) break;
      if (y > targetYear) break;

      const courses = semData[y][s] || [];

      if (s === 3) {
        // Resit semester: each entered resit score adds its own cr + WP
        courses.forEach(c => {
          if (c.score !== '' && c.score !== null) {
            totCr += c.cr;
            totWP += +c.score * c.cr;
          }
        });
      } else {
        // Regular semester: every course contributes its original score as-is
        courses.forEach(c => {
          totCr += c.cr;
          totWP += +c.score * c.cr;
        });
      }
    }
  }

  return { totCr, totWP, cwa: totCr > 0 ? totWP / totCr : 0 };
}

// ── Per-semester stats (for dashboard) ────────────────────────────────────
function getSemStats(year, sem) {
  const courses = semData[year][sem] || [];
  let totCr = 0, totWP = 0, trails = 0;
  if (sem === 3) {
    courses.forEach(c => {
      if (c.score !== '' && c.score !== null) {
        totCr += c.cr; totWP += +c.score * c.cr;
        if (+c.score < 40) trails++;
      }
    });
  } else {
    courses.forEach(c => {
      totCr += c.cr; totWP += +c.score * c.cr;
      if (+c.score < 40) trails++;
    });
  }
  return { totCr, totWP, trails, semWA: totCr > 0 ? totWP / totCr : 0 };
}

// ── Add a new course row ───────────────────────────────────────────────────
function addRow(year, sem) {
  semData[year][sem].push({ name: 'New Course', code: '', cr: 3, score: 65 });
  rebuildAll();
}

// ── Rebuild all panels and recalc ─────────────────────────────────────────
function rebuildAll() {
  for (let y = 1; y <= 4; y++) {
    buildRows(y, 1);
    buildRows(y, 2);
    buildResitRows(y);
  }
  renderSemTabs();
  renderSemPanel();
  recalc();
}

// ── Main recalc: update dashboard + bar chart ─────────────────────────────
function recalc() {
  const stats  = getSemStats(activeYear, activeSem);
  const cum    = getCumulativeUpTo(activeYear, activeSem);

  // Dashboard
  document.getElementById('sem-cwa').textContent   = stats.semWA.toFixed(1) + '%';
  document.getElementById('sem-class').textContent  = classify(stats.semWA);
  document.getElementById('sem-class').style.color  = classColor(stats.semWA);

  const cvaEl = document.getElementById('cum-cwa');
  cvaEl.textContent = cum.cwa.toFixed(1) + '%';
  cvaEl.style.color = classColor(cum.cwa);
  document.getElementById('cum-class').textContent = classify(cum.cwa);
  document.getElementById('cum-class').style.color = classColor(cum.cwa);

  document.getElementById('trail-count').textContent = stats.trails;
  document.getElementById('trail-msg').textContent   = stats.trails > 0 ? 'Resit semester unlocked' : 'No trails this semester';
  document.querySelector('.cwa-card.trail-card .cwa-val').style.color = stats.trails > 0 ? '#ff6b6b' : '#6bff9e';

  // Bar chart — one bar per semester that has data
  buildBarChart();

  calcTarget();
  calcScenario();
}

// ── Bar chart: all semesters with data ────────────────────────────────────
function buildBarChart() {
  const timeline = document.getElementById('cum-timeline');
  timeline.innerHTML = '';

  const order = [];
  for (let y = 1; y <= 4; y++) {
    for (let s = 1; s <= 3; s++) {
      const courses = semData[y][s] || [];
      const hasData = s < 3
        ? courses.length > 0
        : courses.some(c => c.score !== '' && c.score !== null);
      if (!hasData) continue;
      const cum = getCumulativeUpTo(y, s);
      if (cum.totCr === 0) continue;
      order.push({ y, s, cwa: cum.cwa });
    }
  }

  order.forEach(({ y, s, cwa }) => {
    const isActive = y === activeYear && s === activeSem;
    const h = Math.max(4, Math.round((cwa / 100) * 80));
    const label = s === 3 ? `Y${y} Resit` : `Y${y} S${s}`;
    const bar = document.createElement('div');
    bar.className = 'cum-bar' + (isActive ? ' active' : '');
    bar.style.height = h + 'px';
    bar.style.background = isActive ? classColor(cwa) : 'rgba(200,148,26,0.3)';
    bar.innerHTML = `<span class="cum-bar-label">${label}</span><span class="cum-bar-val">${cwa.toFixed(1)}%</span>`;
    timeline.appendChild(bar);
  });
}
