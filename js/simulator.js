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

// ── Rebuild all sections ───────────────────────────────────────────────────
function rebuildAll() {
  const container = document.getElementById('sem-panels');
  container.innerHTML = '';

  for (let y = 1; y <= 4; y++) {
    const block = document.createElement('div');
    block.className = 'sim-year-block';
    block.id = `section-y${y}`;

    let html = `<div class="sim-year-heading">
      <span class="sim-year-num">Year ${y}</span>
      <span class="sim-year-line"></span>
    </div>`;

    html += buildSemSection(y, 1);
    html += buildSemSection(y, 2);

    const trails = getYearTrails(y);
    if (trails.length > 0) html += buildResitSection(y, trails);

    block.innerHTML = html;
    container.appendChild(block);
  }

  updateNavButtons();
  recalc();
}

// ── Regular semester section ───────────────────────────────────────────────
function buildSemSection(year, sem) {
  const courses = semData[year][sem];

  // Stats
  let crReg = 0, crObt = 0, crCalc = 0, totWP = 0, trailList = [];
  courses.forEach(c => {
    crReg   += c.cr;
    crCalc  += c.cr;
    totWP   += +c.score * c.cr;
    if (+c.score >= 40) crObt += c.cr;
    else trailList.push(c.code + '(F)');
  });
  const semWA = crCalc > 0 ? totWP / crCalc : 0;
  const cum   = getCumulativeUpTo(year, sem);

  const rows = courses.map((c, i) => regularRow(year, sem, c, i)).join('');
  const summary = semSummary(crReg, crObt, crCalc, totWP, semWA, cum, trailList);

  return `
    <div class="sim-sem-section" id="section-y${year}-s${sem}">
      <div class="sim-sem-heading">
        <span class="sim-sem-label">Semester ${sem}</span>
        ${trailList.length > 0 ? `<span class="sim-trail-badge">${trailList.length} Trail${trailList.length > 1 ? 's' : ''}</span>` : '<span class="sim-clear-badge">All Clear</span>'}
      </div>
      <div class="sim-table-wrap">
        <table class="sim-courses">
          <thead>
            <tr>
              <th class="col-code">Course Code</th>
              <th class="col-name">Course Name</th>
              <th class="col-cr">Credits</th>
              <th class="col-score">Score</th>
              <th class="col-grade">Grade</th>
              <th class="col-del"></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${summary}
      <button class="add-course-btn" onclick="addRow(${year},${sem})">+ Add Course</button>
    </div>`;
}

function regularRow(year, sem, c, i) {
  const isTrail = +c.score < 40;
  const grade   = scoreToGrade(+c.score);
  return `<tr class="${isTrail ? 'trail-row' : ''}">
    <td class="col-code">
      <input value="${c.code}" onchange="semData[${year}][${sem}][${i}].code=this.value"
        class="sim-input sim-input-code${isTrail ? ' trail-text' : ''}">
    </td>
    <td class="col-name">
      <input value="${c.name}" onchange="semData[${year}][${sem}][${i}].name=this.value"
        class="sim-input sim-input-name${isTrail ? ' trail-text' : ''}">
    </td>
    <td class="col-cr">
      <input type="number" value="${c.cr}" min="1" max="6" step="1"
        onchange="semData[${year}][${sem}][${i}].cr=+this.value;rebuildAll()"
        class="sim-input sim-input-num">
    </td>
    <td class="col-score">
      <input type="number" value="${c.score}" min="0" max="100" step="1"
        onchange="semData[${year}][${sem}][${i}].score=+this.value;rebuildAll()"
        class="sim-input sim-input-num${isTrail ? ' trail-score' : ''}">
    </td>
    <td class="col-grade">
      <span class="sim-grade${isTrail ? ' grade-f' : ''}">${grade}</span>
    </td>
    <td class="col-del">
      <button class="del-btn" onclick="semData[${year}][${sem}].splice(${i},1);rebuildAll()">✕</button>
    </td>
  </tr>`;
}

// ── Resit semester section ─────────────────────────────────────────────────
function buildResitSection(year, trails) {
  const existing = {};
  (semData[year][3] || []).forEach(r => { existing[r.code] = r.score; });
  semData[year][3] = trails.map(t => ({
    name: t.course.name, code: t.course.code, cr: t.course.cr,
    score: existing[t.course.code] !== undefined ? existing[t.course.code] : '',
    semOrigin: t.semOrigin, origIdx: t.idx,
  }));

  const resitCourses = semData[year][3];
  let crReg = 0, crObt = 0, crCalc = 0, totWP = 0, stillTrailing = [];
  resitCourses.forEach(c => {
    if (c.score !== '' && c.score !== null) {
      crReg  += c.cr; crCalc += c.cr;
      totWP  += +c.score * c.cr;
      if (+c.score >= 40) crObt += c.cr;
      else stillTrailing.push(c.code + '(F)');
    }
  });
  const semWA = crCalc > 0 ? totWP / crCalc : 0;
  const cum   = getCumulativeUpTo(year, 3);

  const rows = resitCourses.map((c, i) => resitRow(year, c, i)).join('');
  const summary = semSummary(crReg, crObt, crCalc, totWP, semWA, cum, stillTrailing, true);

  return `
    <div class="sim-sem-section sim-resit-section" id="section-y${year}-resit">
      <div class="sim-sem-heading resit-heading">
        <span class="sim-sem-label">Resit Semester</span>
        <span class="sim-resit-note">Trailed courses from Sem 1 &amp; 2 — enter resit score</span>
      </div>
      <div class="sim-table-wrap">
        <table class="sim-courses">
          <thead>
            <tr>
              <th class="col-code">Course Code</th>
              <th class="col-name">Course Name</th>
              <th class="col-cr">Credits</th>
              <th class="col-score">Resit Score</th>
              <th class="col-grade">Grade</th>
              <th class="col-origin">Origin</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${summary}
    </div>`;
}

function resitRow(year, c, i) {
  const hasScore = c.score !== '' && c.score !== null;
  const isPass   = hasScore && +c.score >= 40;
  const grade    = hasScore ? scoreToGrade(+c.score) : '—';
  return `<tr class="${hasScore && !isPass ? 'trail-row' : ''}">
    <td class="col-code">
      <span class="sim-static-code">${c.code}</span>
    </td>
    <td class="col-name">
      <span class="sim-static-name">${c.name}</span>
    </td>
    <td class="col-cr">
      <span class="sim-static-num">${c.cr}</span>
    </td>
    <td class="col-score">
      <input type="number" value="${hasScore ? c.score : ''}" min="0" max="100" step="1" placeholder="—"
        onchange="semData[${year}][3][${i}].score=this.value===''?'':+this.value;rebuildAll()"
        class="sim-input sim-input-num${hasScore && !isPass ? ' trail-score' : hasScore ? ' resit-score' : ''}">
    </td>
    <td class="col-grade">
      <span class="sim-grade${!hasScore ? ' grade-empty' : isPass ? '' : ' grade-f'}">${grade}</span>
    </td>
    <td class="col-origin">
      <span class="sim-origin">Sem ${c.semOrigin}</span>
    </td>
  </tr>`;
}

// ── Summary block (matches reference image layout) ─────────────────────────
function semSummary(crReg, crObt, crCalc, totWP, semWA, cum, trailList, isResit = false) {
  const trailHTML = trailList.length > 0
    ? trailList.map(t => `<span class="trail-code-tag">${t}</span>`).join('')
    : '<span class="no-trail-tag">None</span>';

  const waColor   = semWA > 0 ? classColor(semWA) : 'rgba(255,255,255,.4)';
  const cumColor  = cum.cwa > 0 ? classColor(cum.cwa) : 'rgba(255,255,255,.4)';

  return `
    <div class="sem-summary">
      <div class="sem-summary-left">
        <div class="summary-trail-label">Courses Trailing:</div>
        <div class="summary-trail-list">${trailHTML}</div>
      </div>
      <div class="sem-summary-right">
        <table class="summary-stats-table">
          <thead>
            <tr>
              <th></th>
              <th>Semester</th>
              <th>Cumulative</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="stat-label">Credits Registered</td>
              <td class="stat-val">${crReg}</td>
              <td class="stat-val">${cum.totCr}</td>
            </tr>
            <tr>
              <td class="stat-label">Credits Obtained</td>
              <td class="stat-val">${crObt}</td>
              <td class="stat-val cum-dim">—</td>
            </tr>
            <tr>
              <td class="stat-label">Credits for Calc.</td>
              <td class="stat-val">${crCalc}</td>
              <td class="stat-val">${cum.totCr}</td>
            </tr>
            <tr>
              <td class="stat-label">Weighted Marks</td>
              <td class="stat-val">${totWP.toFixed(0)}</td>
              <td class="stat-val">${cum.totWP.toFixed(0)}</td>
            </tr>
            <tr class="stat-row-wa">
              <td class="stat-label stat-label-wa">Weighted Average</td>
              <td class="stat-val stat-val-wa" style="color:${waColor}">${crCalc > 0 ? semWA.toFixed(2) + '%' : '—'}</td>
              <td class="stat-val stat-val-wa" style="color:${cumColor}">${cum.totCr > 0 ? cum.cwa.toFixed(2) + '%' : '—'}</td>
            </tr>
            <tr>
              <td class="stat-label">Classification</td>
              <td class="stat-val stat-class" colspan="2" style="color:${cumColor}">${cum.totCr > 0 ? classify(cum.cwa) : '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

// ── Cumulative calculation ─────────────────────────────────────────────────
function getCumulativeUpTo(targetYear, targetSem) {
  let totCr = 0, totWP = 0;
  for (let y = 1; y <= 4; y++) {
    for (let s = 1; s <= 3; s++) {
      if (y === targetYear && s > targetSem) break;
      if (y > targetYear) break;
      const courses = semData[y][s] || [];
      if (s === 3) {
        courses.forEach(c => {
          if (c.score !== '' && c.score !== null) { totCr += c.cr; totWP += +c.score * c.cr; }
        });
      } else {
        courses.forEach(c => { totCr += c.cr; totWP += +c.score * c.cr; });
      }
    }
  }
  return { totCr, totWP, cwa: totCr > 0 ? totWP / totCr : 0 };
}

// ── Per-semester stats (for dashboard cards) ───────────────────────────────
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

function addRow(year, sem) {
  semData[year][sem].push({ name: 'New Course', code: '', cr: 3, score: 65 });
  rebuildAll();
}

// ── Nav buttons ────────────────────────────────────────────────────────────
function updateNavButtons() {
  const nav = document.getElementById('sim-nav-links');
  if (!nav) return;
  nav.innerHTML = '';
  for (let y = 1; y <= 4; y++) {
    const yTrails = getYearTrails(y);
    const group = document.createElement('div');
    group.className = 'sim-nav-group';
    let html = `<button class="sim-nav-year-btn" onclick="scrollToSection(${y},1)">Year ${y}</button>
      <div class="sim-nav-sems">
        <button class="sim-nav-sem-btn" onclick="scrollToSection(${y},1)">S1</button>
        <button class="sim-nav-sem-btn" onclick="scrollToSection(${y},2)">S2</button>`;
    if (yTrails.length > 0) {
      html += `<button class="sim-nav-sem-btn sim-nav-resit" onclick="scrollToSection(${y},3)">Resit</button>`;
    }
    html += `</div>`;
    group.innerHTML = html;
    nav.appendChild(group);
  }
}

// ── Main recalc ────────────────────────────────────────────────────────────
function recalc() {
  const stats = getSemStats(activeYear, activeSem);
  const cum   = getCumulativeUpTo(activeYear, activeSem);

  document.getElementById('sem-cwa').textContent  = stats.semWA.toFixed(1) + '%';
  document.getElementById('sem-class').textContent = classify(stats.semWA);
  document.getElementById('sem-class').style.color = classColor(stats.semWA);

  const cvaEl = document.getElementById('cum-cwa');
  cvaEl.textContent = cum.cwa.toFixed(1) + '%';
  cvaEl.style.color = classColor(cum.cwa);
  document.getElementById('cum-class').textContent = classify(cum.cwa);
  document.getElementById('cum-class').style.color = classColor(cum.cwa);

  document.getElementById('trail-count').textContent = stats.trails;
  document.getElementById('trail-msg').textContent   = stats.trails > 0 ? 'Resit semester unlocked' : 'No trails this semester';
  document.querySelector('.cwa-card.trail-card .cwa-val').style.color = stats.trails > 0 ? '#ff6b6b' : '#6bff9e';

  buildBarChart();
  calcTarget();
  calcScenario();
}

// ── Bar chart ──────────────────────────────────────────────────────────────
function buildBarChart() {
  const timeline = document.getElementById('cum-timeline');
  timeline.innerHTML = '';
  for (let y = 1; y <= 4; y++) {
    for (let s = 1; s <= 3; s++) {
      const courses = semData[y][s] || [];
      const hasData = s < 3 ? courses.length > 0 : courses.some(c => c.score !== '' && c.score !== null);
      if (!hasData) continue;
      const cum = getCumulativeUpTo(y, s);
      if (cum.totCr === 0) continue;
      const isActive = y === activeYear && s === activeSem;
      const h = Math.max(4, Math.round((cum.cwa / 100) * 80));
      const label = s === 3 ? `Y${y} Resit` : `Y${y} S${s}`;
      const bar = document.createElement('div');
      bar.className = 'cum-bar' + (isActive ? ' active' : '');
      bar.style.cssText = `height:${h}px;background:${isActive ? classColor(cum.cwa) : 'rgba(200,148,26,0.25)'};cursor:pointer`;
      bar.title = `${label}: CWA ${cum.cwa.toFixed(2)}%`;
      bar.onclick = () => scrollToSection(y, s);
      bar.innerHTML = `<span class="cum-bar-label">${label}</span><span class="cum-bar-val">${cum.cwa.toFixed(1)}%</span>`;
      timeline.appendChild(bar);
    }
  }
}
