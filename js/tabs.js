function showTab(id, el) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn, nav a').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Switch active year — resets to sem 1 of that year
function switchYear(y, btn) {
  activeYear = y;
  activeSem  = 1;
  document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSemTabs();
  switchSem(1, null);
}

// Switch active semester within the current year
function switchSem(s, btn) {
  activeSem = s;
  document.querySelectorAll('.sem-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSemPanel();
  recalc();
}

// Rebuild the semester tab bar for the active year
function renderSemTabs() {
  const trails = getYearTrails(activeYear);
  const hasSem3 = trails.length > 0;
  const container = document.getElementById('sem-tab-bar');
  container.innerHTML = `
    <button class="sem-tab${activeSem === 1 ? ' active' : ''}" onclick="switchSem(1,this)">Semester 1</button>
    <button class="sem-tab${activeSem === 2 ? ' active' : ''}" onclick="switchSem(2,this)">Semester 2</button>
    ${hasSem3 ? `<button class="sem-tab resit-tab${activeSem === 3 ? ' active' : ''}" onclick="switchSem(3,this)">Resit Semester</button>` : ''}
  `;
}

// Show only the active sem panel, hide others
function renderSemPanel() {
  [1, 2, 3].forEach(s => {
    const el = document.getElementById(`sem-panel-${activeYear}-${s}`);
    if (el) el.style.display = (s === activeSem) ? 'block' : 'none';
  });
}

// Returns all trailed courses from sem 1 & 2 of a given year
function getYearTrails(year) {
  const trails = [];
  [1, 2].forEach(s => {
    (semData[year][s] || []).forEach((c, i) => {
      if (+c.score < 40) trails.push({ semOrigin: s, idx: i, course: c });
    });
  });
  return trails;
}
