# Product — Level Up Academy

## Project Purpose
Level Up Academy is a single-page, static web seminar resource built for KNUST (Kwame Nkrumah University of Science and Technology) undergraduate students. It delivers a structured five-day online seminar covering academic performance, CWA management, AI study tools, and digital skills — all in one self-contained HTML page with no backend.

## Value Proposition
- Everything a student needs for the seminar lives in one URL — no app install, no login
- The CWA Simulator (hosted at my-cwa.vercel.app) is embedded as an iframe and also linked as a standalone tool
- Facilitators get a complete session guide; students get interactive tools and reference content

## Key Features
- **Live CWA Simulator** — embedded iframe to my-cwa.vercel.app; calculates Semester Weighted Average and Cumulative Weighted Average in real time, flags trails, models resit impact
- **Tab navigation** — seven tabs (Overview, Simulator, Day 1–5) rendered from HTML partials loaded via fetch
- **Day-by-day session guides** — timed session plans, teaching content, callouts, task boxes, and facilitator notes
- **KNUST Grade Scale reference** — letter grades, score ranges, trail status, and degree classification tables
- **Trail Scenario tool** — shows CWA impact of a trail vs. a cleared resit
- **AI study tools directory** — curated list of tools (Claude, ChatGPT, NotebookLM, quiz platforms) with practical prompts
- **MS Word skills guide** — styles, references, TOC, PDF export
- **Semester Contract** — a printable/fillable commitment form for students
- **Responsive layout** — single breakpoint at 860px for mobile

## Target Users
- **Primary:** All KNUST undergraduate students attending the seminar
- **Secondary:** Seminar facilitators who use the page as a live presentation and reference guide

## Use Cases
1. Student opens the page on a phone/laptop during the seminar and uses the CWA Simulator to enter real scores
2. Facilitator projects the page and walks through each Day tab as a session guide
3. Student revisits the page after the seminar for the Trail Recovery Plan, AI prompts, or Semester Contract
4. Student clicks "Open Full Screen" to use the standalone CWA simulator at my-cwa.vercel.app

## Seminar Structure (5 Days)
| Day | Topic |
|-----|-------|
| 1 | Understanding Your CWA — formula, grade scale, simulator walk-through |
| 2 | Trails — what they are, compounding effect, recovery strategy |
| 3 | AI for Study — Claude, ChatGPT, NotebookLM, responsible use |
| 4 | MS Word & Digital Organisation — styles, references, file systems |
| 5 | Preparing for Next Semester — timetable, past questions, Semester Contract |
