# AGENTS.md — Terra-UI Repository Guide

Repository guidance for coding agents working in `terra-ui`. Keep every meaning in one authoritative place: consult [`public/llms.txt`](public/llms.txt) for component/API inventory, [`package.json`](package.json) for scripts, and [`scripts/lint-taste.mjs`](scripts/lint-taste.mjs) + [`eslint.config.js`](eslint.config.js) for machine-enforced rules.

## Context Pointers

- **API & Design Surface**: Read [`public/llms.txt`](public/llms.txt) before adding, renaming, or documenting any component, prop, theme, or motion token.
- **Design Tokens & Motion**: Define colors, z-index layers, layout heights, durations, and `linear()` spring curves in [`src/lib/styles/tokens.css`](src/lib/styles/tokens.css) and [`src/lib/motion/index.ts`](src/lib/motion/index.ts); reference `--terra-*` custom properties and `.terra-*` utilities across components.
- **Chinese Technical Style & i18n**: Default locale is `zh` (`src/lib/i18n/dict.ts`). Keep Chinese and English dictionaries symmetric, insert a half-width space between CJK characters and ASCII/numbers, and wrap technical symbols in backticks.

## Coding Standards

- Write native Svelte 5 Runes (`$state`, `$derived`, `$effect`, `$props`) with `isolate` on component roots that position internal overlays.
- Drive pointer motion and dynamic UI sizing through `Spring` (`svelte/motion`) or dt-independent `stepSpring`, using critical damping (`ζ = 1.0`) for bounded numeric counters.
- Gate animations behind `prefers-reduced-motion`, honor `html[data-motion='paused']`, and sleep offscreen canvas loops.
- Keep components flat (`1px` structural borders, zero chamfer cuts, zero drop-shadow glow) and use `lucide-svelte` icons for UI chrome.
- Rely on actual type fixes and git history rather than suppression directives or multi-line banner/changelog comments.

## Workflow & Privacy Boundaries

- **Branch Flow**: Develop on `feat/...` or `fix/...`, open a PR into `dev`, and promote cleanly to `main`. Keep `main` and `dev` protected without force-pushes or deletions.
- **Public Identity**: Keep commits and files free of private emails, local machine paths, or private vault references; attribute authorship strictly as `K0maru` (`UID-93422639`).
- **Clean-Room Attribution**: Retain the MIT clean-room notice and HYPERGRYPH attribution in [`README.md`](README.md), [`README_zh.md`](README_zh.md), and footer copy.

## Completion Gates

Run and observe all checks passing with `0` errors, `0` warnings, and `0` violations before committing or opening a PR:

1. `npm run format`
2. `npm run lint` (`eslint src scripts`, `scripts/lint-taste.mjs` with empty baseline, `prettier --check`)
3. `npm run check` (`svelte-check`)
4. `npm run build && npm run package` (verifies `dist/llms.txt`, SPA bundle, and `dist-lib/`)
5. `k0maru guard check --diff` (privacy & architectural invariants)
