# Terra-UI

Svelte 5 flat Swiss editorial and kinetic ASCII UI component library (`@k0maru/terra-ui`).

- [Live Demo & Docs](https://k0maru.github.io/terra-ui/)
- [Agent Reference (`llms.txt`)](public/llms.txt)
- Languages: [English](README.md) | [简体中文](README_zh.md)

---

## Core Design

- **Flat Editorial × Kinetic ASCII**: `1px` structural borders, `36px` open dot lattice background, and live 3D-to-ASCII rendering without frosted-glass clutter or chamfer cuts.
- **Calibrated Pigment Matrix**: Four color themes (`vermilion` default, `viridian`, `cyanotype`, `citron`) paired with `dark` (ink) and `light` (paper) modes via CSS tokens and View Transitions.
- **Spring Physics & Zero Idle Cost**: Frame-rate-independent `stepSpring` integrator, CSS `linear()` springs (`snappy`, `smooth`, `bouncy`), critical damping for bounded numbers, and `IntersectionObserver` / `visibilitychange` canvas sleep.
- **Zero VDOM**: Native Svelte 5 Runes (`$state`, `$derived`, `$props`) compiled to direct DOM updates.

| Theme ID | Mode Palette | Default Accent (Dark / Light) |
| :--- | :--- | :--- |
| `vermilion` | Mineral Gray × Vermilion | `#ee4b2b` / `#c9341b` |
| `viridian` | Stone Gray × Oxide Viridian | `#3fd1a0` / `#186a52` |
| `cyanotype` | Silver Blueprint × Prussian Blue | `#5b86ff` / `#1b4dff` |
| `citron` | Carbon Ink × Acid Citron | `#d2ff28` / `#4d6600` |

---

## Exported Components (19)

| Category | Components | Highlights |
| :--- | :--- | :--- |
| **Kinetic & Spatial** | `TerraAsciiStage`, `TerraAmbientField`, `TerraSpatialCard` | 16-bucket chroma×luminance 3D ASCII butterfly, 36px viewport glyph field, damped 3D tilt |
| **Charts** | `TerraLineChart`, `TerraBarChart`, `TerraStatusStrip`, `TerraDonutChart`, `TerraActivityHeatmap` (`TerraHeatmap`), `TerraSparkline` | Gap-free container pointer tracking, Spring crosshair & size-morphing tooltips, keyboard navigation |
| **Controls & Numerics** | `TerraVernierMeter`, `TerraVerticalTabs`, `TerraRollingNumber` | Composite-layer caliper slider, distance-scaled tab rail, zero-overshoot numeric counter |
| **Primitives & Identity** | `TerraButton`, `TerraPanel`, `TerraInput`, `TerraBadge`, `TerraStatusBeacon`, `TerraProfileCard`, `TerraBarcode` | Magnetic pull & synchronized `clip-path` ink wipe, `1px` surface panel, bilingual terminal input |

For component props, token names, and exported helpers, read [`public/llms.txt`](public/llms.txt) or [Tokens & Themes](src/lib/styles/tokens.css).

---

## Quick Start

Install the package:

```bash
npm install @k0maru/terra-ui
```

Import styles and components in Svelte 5:

```svelte
<script lang="ts">
  import {
    TerraPanel,
    TerraButton,
    TerraStatusStrip,
    TerraVernierMeter,
    TerraRollingNumber
  } from '@k0maru/terra-ui'
  import '@k0maru/terra-ui/css'

  let load = $state(74)
</script>

<TerraPanel title="EDGE ROUTER // NODE-01" tag="SLA // 60D">
  <div class="space-y-4">
    <div class="flex items-baseline justify-between">
      <TerraRollingNumber value={load} decimals={0} suffix="%" class="text-3xl" />
      <TerraButton variant="primary" magneticPull={true} onclick={() => (load = 88)}>
        CALIBRATE
      </TerraButton>
    </div>

    <TerraVernierMeter bind:value={load} interactive={true} hazard={load >= 85} />
    <TerraStatusStrip serviceName="GLOBAL_EDGE_ROUTER" days={60} />
  </div>
</TerraPanel>
```

---

## Development & CI/CD

```bash
git clone https://github.com/K0maru/terra-ui.git
cd terra-ui
npm install
npm run dev
```

| Workflow / Script | Trigger / Purpose | Target |
| :--- | :--- | :--- |
| `npm run lint && npm run check` | ESLint (`0` warnings), anti-slop rules (`scripts/lint-taste.mjs`), Prettier, `svelte-check` | Local & CI |
| `npm run build && npm run package` | Build showcase site (`dist/`) and Svelte library package (`dist-lib/`) | Local & CI |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Run lint, type check, site build, and package build | Push to `dev` & PRs to `main` / `dev` |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Verify all gates and deploy static site + `llms.txt` | Push to `main` |
| [`.github/workflows/release.yml`](.github/workflows/release.yml) | Run gates, build tarball, and publish GitHub Release / Packages | Tags `v*` |

---

## License & Attribution

- **License**: [MIT](LICENSE)
- **Maintainer**: [K0maru](https://github.com/K0maru) (`UID-93422639`)
- **Attribution**: Clean-room Svelte 5 implementation with zero proprietary game assets. Earlier visual explorations referenced *Arknights* and *Arknights: Endfield* by [HYPERGRYPH](https://www.hypergryph.com/) (trademarks belong to their respective owners) and [Terra-Online/Atlos](https://github.com/Terra-Online/Atlos).
