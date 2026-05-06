# Tech — Level Up Academy

## Stack Overview
Fully static, zero-dependency, zero-build-step web project. Runs directly in any browser via a local server or file hosting.

## Languages
| Language | Usage |
|----------|-------|
| HTML5 | index.html entry point + 7 partial files |
| CSS3 | Single stylesheet (main.css) with custom properties |
| Vanilla JavaScript (ES2017+) | Tab switching, CWA engine, simulator, data, projections |

## JavaScript Features Used
- `async/await` — partial loader in index.html
- `fetch` API — loading HTML partials at runtime
- `insertAdjacentHTML` — injecting partials into DOM
- ES6 modules pattern (separate JS files per concern)
- No frameworks, no npm, no bundler

## Fonts (Google Fonts CDN)
| Font | Weights | Usage |
|------|---------|-------|
| Syne | 400, 600, 700, 800 | Headings, brand, day numbers |
| Instrument Sans | 400, 500, 600 (+ italic) | Body text, UI labels |
| JetBrains Mono | 400, 500 | Code, grades, CWA values, formulas |

## External Dependencies
| Resource | Type | Purpose |
|----------|------|---------|
| fonts.googleapis.com | CDN | Font loading |
| my-cwa.vercel.app | Iframe embed | Full CWA simulator app |

## CSS Design Tokens (`:root`)
```css
--ink: #0a0a0f        /* near-black background */
--paper: #f4efe6      /* warm off-white page background */
--gold: #c8941a       /* primary accent */
--gold-l: #f0d070     /* light gold */
--gold-d: #8a6010     /* dark gold */
--rust: #bf3f18       /* trail/warning colour */
--forest: #175232     /* success/ok colour */
--forest-l: #1e6a40
--slate: #1e2d3d
--mist: #e2dcd0       /* subtle border colour */
--white: #ffffff
--alt: #f8f4ee        /* alternate row background */
--lr / --ly / --lg / --lb  /* light red/yellow/green/blue tints for callouts */
--d1–d5               /* day accent colours (gold, rust, forest, navy, purple) */
```

## Development Commands
No build system. To run locally:
```
# Any static file server works, e.g.:
npx serve .
# or
python -m http.server 8080
# or VS Code Live Server extension
```
Partials are loaded via `fetch()` so the page must be served over HTTP — opening index.html directly as a `file://` URL will fail due to CORS on fetch.

## Deployment
Static hosting — any CDN or static host (Vercel, Netlify, GitHub Pages, etc.) works. The external simulator is already deployed at my-cwa.vercel.app.

## Browser Requirements
- Modern browser with `fetch`, `async/await`, CSS custom properties support
- No IE11 support needed
- Iframe `allow="clipboard-write"` for the simulator embed
