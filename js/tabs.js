function showTab(id, el) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn, nav a').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll to a year+semester section anchor
function scrollToSection(year, sem) {
  const id = sem === 3 ? `section-y${year}-resit` : `section-y${year}-s${sem}`;
  const el = document.getElementById(id);
  if (!el) return;
  // Offset for sticky nav (~48px) + sim-header (~80px)
  const top = el.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({ top, behavior: 'smooth' });
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

// Kept for compatibility — no longer hides/shows panels
function renderSemTabs() {}
function renderSemPanel() {}
function switchYear(y, btn) {
  activeYear = y; activeSem = 1;
  scrollToSection(y, 1);
}
function switchSem(s, btn) {
  activeSem = s;
  scrollToSection(activeYear, s);
}
