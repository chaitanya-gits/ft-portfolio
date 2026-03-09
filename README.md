# Fashion Technology Portfolio
### Chaitanya Valluru | CS Graduate -> Fashion Technology

---

## About This Portfolio

This is a fashion-technology portfolio focused on honest early-stage work, now migrated to a TypeScript-first frontend workflow while preserving the original UI design.

---

## Folder Structure

```
portfolio/
|-- index.html
|-- css/
|   `-- style.css
|-- pages/
|   |-- about.html
|   |-- work.html
|   `-- contact.html
|-- projects/
|   |-- moodboard/
|   |-- colorpalette/
|   |-- sizeguide/
|   |-- lookbook/
|   `-- realtimeplanner/          <- Project 005
|-- src/
|   |-- main.ts                   <- shared TypeScript source
|   `-- projects/
|       `-- realtimeplanner.ts    <- Project 005 logic
|-- js/
|   |-- main.js                   <- compiled from src/main.ts
|   `-- projects/
|       `-- realtimeplanner.js    <- compiled from src/projects/realtimeplanner.ts
|-- tsconfig.json
|-- package.json
`-- README.md
```

---

## Projects

| # | Project | What it does | Stack |
|---|---------|--------------|-------|
| 01 | Digital Mood Board Generator | Drag-and-drop fashion mood board tool | HTML, CSS, Vanilla JS |
| 02 | Outfit Colour Palette Analyser | Harmony analysis for outfit colours | Vanilla JS, HSL colour math |
| 03 | India -> Italy Size Guide | Clothing and shoe size conversion tool | HTML Forms, JS lookup tables |
| 04 | VOID - Lookbook Concept | Conceptual fashion lookbook presentation | Figma, HTML/CSS |
| 05 | Realtime Capsule Outfit Planner | Live outfit recommendation by weather/mood/occasion | TypeScript, HTML, CSS |

---

## Commands

Install dependencies:
```bash
npm install
```

Type check:
```bash
npm run typecheck
```

Build TypeScript:
```bash
npm run build
```

Run local server:
```bash
python -m http.server 8000
# visit http://127.0.0.1:8000/
```

---

## Design Direction

- Palette: Black, greys, off-white, white
- Typography: Bebas Neue, IBM Plex Mono, Cormorant Garamond
- Visual style: Minimal, editorial, system-driven

---

## Notes

- Existing HTML page structure is intentionally preserved.
- Shared site behavior is now maintained in TypeScript and compiled to `js/` output.
