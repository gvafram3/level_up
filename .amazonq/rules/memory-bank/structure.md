# Structure — Level Up Academy

## Directory Layout
```
level_up/
├── index.html              # Single entry point — hero, tab nav, partial loader
├── css/
│   └── main.css            # All styles — design tokens, components, simulator, responsive
├── js/
│   ├── tabs.js             # Tab switching logic (showTab function)
│   ├── simulator.js        # CWA calculation engine, course table rendering, trail detection
│   ├── data.js             # Default course data (3 years × 2 semesters)
│   ├── target.js           # Target CWA projection tool
│   └── scenario.js         # Trail scenario bar chart tool
└── partials/
    ├── tab-overview.html   # Programme overview, grade scale tables
    ├── tab-simulator.html  # Simulator iframe embed + instructions
    ├── tab-day1.html       # Day 1 session guide — CWA formula
    ├── tab-day2.html       # Day 2 session guide — Trails
    ├── tab-day3.html       # Day 3 session guide — AI tools
    ├── tab-day4.html       # Day 4 session guide — MS Word
    └── tab-day5.html       # Day 5 session guide — Semester plan
```

## Loading Architecture
index.html uses an async IIFE to fetch all 7 partials sequentially and inject them into `#tab-root` via `insertAdjacentHTML`. No build step — pure browser fetch.

```
index.html
  └── #tab-root (div)
        ├── tab-overview   (fetched partial)
        ├── tab-simulator  (fetched partial)
        ├── tab-day1       (fetched partial)
        ├── tab-day2       (fetched partial)
        ├── tab-day3       (fetched partial)
        ├── tab-day4       (fetched partial)
        └── tab-day5       (fetched partial)
```

## Tab System
- Each partial renders a `<div id="tab-X" class="tab-pane">` element
- `tabs.js` exports `showTab(id, btn)` — hides all `.tab-pane`, shows the target, toggles `.active` on nav buttons
- The Overview tab starts with class `active` (set in the partial itself)
- Tab buttons in index.html call `showTab()` via inline `onclick`

## Simulator Architecture
The simulator tab embeds an external app (my-cwa.vercel.app) via iframe. The local JS files (simulator.js, data.js, target.js, scenario.js) appear to be the source for that external app or an earlier inline version — they are loaded by index.html but the simulator UI is served from the iframe.

## CSS Architecture
All styles live in a single `main.css` file, organised by section comments:
- Design tokens (`--ink`, `--paper`, `--gold`, `--rust`, `--forest`, etc.) in `:root`
- Layout sections: NAV, HERO, AUDIENCE BANNER, TABS, SHARED COMPONENTS
- Feature sections: GRADE TABLE, SIMULATOR, AI TOOLS, quiz platforms, prompts, day headers, timeline, word skills, guest box, semester contract, formula box, domain section
- Responsive block at `@media(max-width:860px)`
- Animations block (`@keyframes fadeUp`)

## Core Components (HTML Patterns)
| Component | Class(es) | Description |
|-----------|-----------|-------------|
| Section tag | `.sec-tag` | Small uppercase label with trailing line |
| Info callout | `.callout.info/.warn/.ok` | Coloured left-border alert box |
| Task box | `.task-box` | Gold-bordered checklist for student tasks |
| Card grid | `.grid2` / `.grid3` | 2 or 3 column card layouts |
| Card | `.card` | White bordered content block |
| Formula box | `.formula` | Dark background, monospace formula display |
| Timeline | `.timeline` / `.tl-row` | Time-coded session plan rows |
| Day header | `.day-hdr` | Dark hero block for each day tab |
| Grade table | `.gtable` | Styled HTML table for grade scales |
| CTA button | `.cta-btn` | Inline action button (primary/default variants) |
