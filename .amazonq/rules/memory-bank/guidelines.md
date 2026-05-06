# Guidelines — Level Up Academy

## Code Quality Standards

### File Responsibility (Single Concern per File)
Each JS file owns exactly one concern — never mix them:
- `data.js` — state only (semData object + activeYear/activeSem)
- `simulator.js` — DOM building and CWA calculation
- `target.js` — target projection and print
- `scenario.js` — trail scenario bar chart
- `tabs.js` — navigation, scroll helpers, trail detection

### Function Size
Keep functions short and focused. Every function in this codebase does one thing:
- `scoreToGrade(s)` — pure score → letter
- `classify(c)` — pure CWA → class string
- `classColor(c)` — pure CWA → hex color
- `getCumulativeUpTo(year, sem)` — pure calculation, returns `{ totCr, totWP, cwa }`
- `buildSemSection` / `buildResitSection` — HTML string builders only

### Pure Helper Functions
Calculation helpers are pure (no DOM access, no side effects). DOM updates happen only in `recalc()` and the `build*` functions. Follow this separation:

```js
// ✅ Pure — no DOM
function scoreToGrade(s) {
  if (s >= 70) return 'A';
  if (s >= 60) return 'B';
  if (s >= 50) return 'C';
  if (s >= 40) return 'D';
  return 'F';
}

// ✅ DOM update isolated to recalc()
function recalc() {
  const stats = getSemStats(activeYear, activeSem);
  document.getElementById('sem-cwa').textContent = stats.semWA.toFixed(1) + '%';
}
```

---

## Naming Conventions

### Variables
- Short, domain-specific abbreviations are standard: `cr` (credits), `WP` (weighted points), `WA` (weighted average), `cum` (cumulative)
- State variables use camelCase: `activeYear`, `activeSem`, `semData`
- Loop counters use `y` (year), `s` (semester), `i` (index), `c` (course)

### Functions
- camelCase, verb-first: `buildSemSection`, `rebuildAll`, `calcTarget`, `calcScenario`, `updateNavButtons`, `scrollToSection`, `getYearTrails`
- Getters prefixed with `get`: `getCumulativeUpTo`, `getSemStats`, `getYearTrails`
- Builders prefixed with `build`: `buildSemSection`, `buildResitSection`, `buildBarChart`
- Updaters prefixed with `update` or `recalc`: `updateNavButtons`, `recalc`

### CSS Classes
- BEM-like with `sim-` prefix for simulator components: `.sim-wrap`, `.sim-header`, `.sim-courses`, `.sim-input`, `.sim-grade`
- State modifier classes appended directly: `.trail-row`, `.trail-text`, `.trail-score`, `.grade-f`, `.grade-empty`, `.active`
- Day-specific accent classes use numeric suffix: `.d1`, `.d2`, `.d3`, `.d4`, `.d5`
- Tool card color classes: `.tc1`–`.tc5`, `.qc1`–`.qc6`

---

## Structural Conventions

### Data Shape
The central state object `semData` uses a nested numeric-key object (not arrays):
```js
semData[year][sem] = [{ name, code, cr, score }]
// year: 1–4, sem: 1 (Sem1), 2 (Sem2), 3 (Resit — auto-populated)
```
Resit semester (`sem === 3`) is always auto-populated from trails — never manually edited by the user for course metadata, only for score.

### HTML Generation Pattern
All dynamic UI is built as template literal strings and injected via `innerHTML` or `insertAdjacentHTML`. Never use `createElement` for complex structures — only for simple wrapper elements:

```js
// ✅ Template literal for complex HTML
const rows = courses.map((c, i) => regularRow(year, sem, c, i)).join('');

// ✅ createElement only for simple containers
const block = document.createElement('div');
block.className = 'sim-year-block';
block.innerHTML = html;
container.appendChild(block);
```

### Inline Event Handlers
All interactive elements use inline `onclick` with direct `semData` mutation followed by `rebuildAll()`:
```js
onchange="semData[${year}][${sem}][${i}].score=+this.value;rebuildAll()"
onchange="semData[${year}][${sem}][${i}].cr=+this.value;rebuildAll()"
onclick="semData[${year}][${sem}].splice(${i},1);rebuildAll()"
```
This is intentional — no event delegation, no data binding library.

### Rebuild Pattern
Any data change triggers a full `rebuildAll()` → `recalc()` cycle. There is no partial update:
```js
function rebuildAll() {
  container.innerHTML = '';   // full wipe
  // rebuild all year blocks
  updateNavButtons();
  recalc();                   // recalculate all stats
}
```

---

## CSS Conventions

### Design Tokens First
Always use CSS custom properties from `:root` — never hardcode colours that have a token equivalent:
```css
/* ✅ */
color: var(--gold);
background: var(--ink);

/* ❌ */
color: #c8941a;
background: #0a0a0f;
```
Exception: inline styles in JS-generated HTML may use hex directly when the value is computed (e.g., `classColor()` return values).

### Section Comments
CSS sections are separated by banner comments:
```css
/* ─── SECTION NAME ───────────────────────────────────────────────────────── */
```
Follow this pattern when adding new sections.

### Utility Grids
Use `.grid2` and `.grid3` for two- and three-column layouts. Do not create one-off grid styles — extend with inline `style` overrides if needed (e.g., `grid-column:1/-1` for full-width cards).

### Responsive
Single breakpoint at `860px`. All responsive overrides live in one `@media(max-width:860px)` block at the bottom of the file.

---

## Semantic Patterns

### Conditional Class Injection
Trail state is reflected by appending class strings in template literals:
```js
const isTrail = +c.score < 40;
`<tr class="${isTrail ? 'trail-row' : ''}">`
`<input class="sim-input sim-input-num${isTrail ? ' trail-score' : ''}">`
`<span class="sim-grade${isTrail ? ' grade-f' : ''}">`
```

### Guard-and-Return
Functions that depend on DOM elements guard with early return:
```js
function updateNavButtons() {
  const nav = document.getElementById('sim-nav-links');
  if (!nav) return;
  // ...
}
```

### Numeric Coercion
Score and credit values are always coerced with unary `+` before arithmetic:
```js
totWP += +c.score * c.cr;
if (+c.score >= 40) crObt += c.cr;
```

### Resit Score Emptiness Check
Resit scores can be empty string (not yet entered). Always check before using:
```js
if (c.score !== '' && c.score !== null) {
  totCr += c.cr;
  totWP += +c.score * c.cr;
}
```

### toFixed Display Convention
- CWA values displayed in summary tables: `.toFixed(2)`
- CWA values in dashboard cards: `.toFixed(1)`
- Weighted marks (integer-ish): `.toFixed(0)`
- Target score output: `.toFixed(1)`

### Partial Loading Pattern
HTML partials are loaded sequentially (not in parallel) to preserve DOM insertion order:
```js
for (const name of partials) {
  const res  = await fetch(`partials/${name}.html`);
  const html = await res.text();
  root.insertAdjacentHTML('beforeend', html);
}
```

### HTML Content Components
Reusable content blocks follow a consistent structure in partials:
```html
<div class="sec-tag">Section Label</div>
<h2 class="page-title">Title</h2>
<p class="intro-p">Description paragraph.</p>
<!-- content: grid2/grid3 of cards, callouts, task-box, formula, timeline -->
```

### Callout Variants
Three semantic callout types — always pick the right one:
- `.callout.warn` — trail risk, danger, important warning (rust border)
- `.callout.info` — tips, how-to instructions (gold border)
- `.callout.ok` — positive outcomes, encouragement (forest/green border)
