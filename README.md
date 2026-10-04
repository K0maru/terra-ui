# 🛡️ TERRA UI // Functional Cybernetic Design System

> **Zero-VDOM // Svelte 5 Native Runes // GPU Hardware Composited // Industrial Telemetry Aesthetics**  
> A high-performance Svelte 5 component library and design system for industrial telemetry, developer tools, observability dashboards, and cybernetic interfaces.

[English](README.md) | [简体中文](README_zh.md)

---

## 📜 Disclaimer & Design Inspiration Attribution

> **IMPORTANT NOTICE**:  
> **Terra-UI** is an independent, non-commercial open-source engineering research and UI/UX design exploration project.  
> The visual aesthetics, typography layout, geometric chamfers, and interaction paradigms of this design system are directly inspired by and reference **"Arknights" (明日方舟)** and **"Arknights: Endfield" (明日方舟：终末地)**, developed and published by **Shanghai HYPERGRYPH Network Technology Co., Ltd. (上海鹰角网络科技有限公司)**.

- **Intellectual Property Rights**: All trademarks, copyrights, trade dress, graphic assets, and world-building concepts related to *Arknights* and *Arknights: Endfield* remain the sole property of **Shanghai HYPERGRYPH Network Technology Co., Ltd.** and its affiliates.
- **Academic & Non-Commercial Purpose**: This project is developed strictly for frontend architectural research, Svelte 5 reactive performance benchmarks, and open-source UI/UX showcase. It is not intended for commercial monetization or production deployment of third-party intellectual property.
- **Clean-Room Implementation**: All components, SVG glyphs, layout engines, and CSS token systems are authored from scratch. **No proprietary game packages were unpacked, extracted, reverse-engineered, or distributed in this repository.**

### 🔗 Primary References & Design Credits

1. [HYPERGRYPH Official Website](https://www.hypergryph.com/)
2. [Arknights Official Website](https://ak.hypergryph.com/)
3. [Arknights: Endfield Official Website](https://endfield.hypergryph.com/)
4. [Bilibili @设计师深海: Endfield UI Design Analysis (BV142zkBbEL6)](https://www.bilibili.com/video/BV142zkBbEL6/)
5. [GitHub Open Source: Terra-Online/Atlos (Endfield Map Interface Reference)](https://github.com/Terra-Online/Atlos)

---

## 🎨 Dual-Axis Design Architecture

Terra-UI synthesizes two distinct cybernetic visual philosophies into a unified design token system:

| Design Axis | Visual Metaphor | Core Design Characteristics & Artifacts |
| :--- | :--- | :--- |
| **2D Flat Graphic Axis** | **PRTS Tactical Terminal** (`prts`) | Swiss International Style grid discipline, high typography density, asymmetric coordinate alignments, strict monochrome contrast, and zero 3D clutter. Tailored for data-dense developer tools and tactical feeds. |
| **3D Spatial Topology Axis** | **Endfield Industrial Grid** (`dijiang` / `wuling`) | Real-time pointer-tracking 3D perspective cards (`<TerraSpatialCard />`), Talos-II topographic contour maps (`<TerraContourLines />`), -20° recessed AIC industrial power bus (`<TerraSegmentBar />`), and CAD vector reticles (`[ ]`, `+`). |

---

## ⚡ Performance Architecture

1. **Zero Virtual DOM Overhead**: Built natively on Svelte 5 Runes (`$state`, `$derived`, `$props`). Updates execute directly through granular DOM operations without runtime component tree reconciliation.
2. **GPU Compositor Acceleration**: All 3D rotations, tactical curtain sweeps (`scaleX` + `cubic-bezier(1, 0, 0.7, 1)`), 45° chamfers (`clip-path`), and shimmer waves run entirely on the hardware compositor thread, delivering rock-solid 120 FPS telemetry animations.
3. **Orthogonal Theme & Mode System**: Native support for dark and light color modes (`[data-mode="dark"]`, `[data-mode="light"]`) across multi-faction industrial themes (`dijiang`, `wuling`, `prts`).

---

## 🧩 Component Inventory

### 1. 3D Spatial & Physical Interaction
- `<TerraSpatialCard />`: Multi-axis 3D hover card with real-time pointer perspective tilt, Z-axis parallax depth, and GPU specular sheen.
- `<TerraContourLines />`: Talos-II topographic contour overlay with dynamic elevation coordinates and CAD survey crosshairs.
- `<TerraSegmentBar />`: -20° recessed industrial AIC energy bus and tactical skill capacity indicator with dynamic charge pulse.

### 2. Native Telemetry SVG Charts
- `<TerraDonutChart />`: Tactical circular resource breakdown chart with center focal readout and 4-channel allocation.
- `<TerraLineChart />`: Zero-dependency SVG telemetry line chart with dual-stream waveforms, gradient fills, and dynamic peak callouts.
- `<TerraBarChart />`: Segmented histogram bar chart with dual comparative metrics and smooth transitions.

### 3. Precision Controls & HUD
- `<TerraVerticalSlider />`: Industrial precision vertical slider with calibration ticks and bidirectional setpoint adjustments.
- `<TerraVerticalTabs />`: Tactical floating-cursor vertical tab navigation with fluid indicator tracking.
- `<TerraCornerBrackets />`: Tactical wireframe corner framing with HUD status flags and extended corner guides.
- `<TerraCadPattern />`: Interactive CAD coordinate grid layer with cursor proximity highlight.

### 4. Identity & Dossier
- `<TerraProfileCard />`: Swiss typographic developer and operator credential card.
- `<TerraTacticalProfile />`: High-fidelity tactical dossier card with security clearance badges and operational serial tags.
- `<TerraDossierCard />`: Multi-state intelligence dossier docket.

### 5. Atomic Primitives & Systems
- `<TerraButton />`: 45° chamfered industrial button with GPU shimmer wave and four semantic states.
- `<TerraPanel />`: Tactical container panel supporting corner brackets (`[ ]`), reticle crosshairs (`+`), and industrial equipment nameplates.
- `<TerraBadge />`: Industrial status badge with micro security clearance codes (`ADM`, `AIC`, `GRID`, `OK`).
- `<TerraStatusBeacon />`: Multi-state breathing beacon with GPU pulse glow.
- `<TerraRollingNumber />`: Spring-physics rolling odometer counter for high-frequency telemetry.
- `<TerraBarcode />`: Pure vector industrial barcode with manufactured serial numbers.
- `<TerraInput />`: Chamfered industrial terminal input with cursor indicators.
- `<TerraInitialBootScreen />`: Game-accurate diagnostic POST kernel boot sequence (2.2s fast check).
- `<TerraCurtainTransition />`: Solid industrial armor curtain wipe transition with high-speed 0-100% telemetry countdown.

---

## 🚀 Quick Start & Usage

### Installation & Development Server

```bash
# Clone the repository
git clone https://github.com/K0maru/terra-ui.git
cd terra-ui

# Install dependencies
npm install

# Launch interactive showcase dev server
npm run dev

# Fast production build
npm run build
```

### Component Usage Example (Svelte 5)

```svelte
<script lang="ts">
  import {
    TerraSpatialCard,
    TerraButton,
    TerraSegmentBar,
    TerraDonutChart,
    TerraStatusBeacon
  } from './components'

  let energyLevel = $state(76)
  let status = $state<'online' | 'warning' | 'critical'>('online')
</script>

<div class="p-8 bg-zinc-950 text-white min-h-screen">
  <TerraSpatialCard glare={true} maxTilt={8} class="p-6 max-w-md">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-mono text-sm tracking-wider uppercase">AIC BUS 04 // MONITOR</h3>
      <TerraStatusBeacon state={status} />
    </div>

    <!-- -20° Recessed Energy Bus -->
    <TerraSegmentBar
      totalSegments={24}
      activeSegments={Math.round((energyLevel / 100) * 24)}
      accentColor="var(--terra-amber)"
    />

    <!-- Telemetry Allocation Chart -->
    <div class="mt-6 flex justify-center">
      <TerraDonutChart
        segments={[
          { label: 'Core Load', value: 45, color: '#f59e0b' },
          { label: 'Sub-Grid', value: 30, color: '#3b82f6' },
          { label: 'Auxiliary', value: 25, color: '#10b981' }
        ]}
        centerValue="{energyLevel}%"
        centerLabel="OUTPUT"
      />
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <TerraButton variant="secondary" onclick={() => energyLevel = Math.max(0, energyLevel - 10)}>
        DECREMENT
      </TerraButton>
      <TerraButton variant="primary" onclick={() => energyLevel = Math.min(100, energyLevel + 10)}>
        RECHARGE
      </TerraButton>
    </div>
  </TerraSpatialCard>
</div>
```

---

## 📄 License & Maintainer

- **License**: [MIT License](LICENSE)
- **Maintainer**: [K0maru](https://github.com/K0maru) (Project Repository: [https://github.com/K0maru/terra-ui](https://github.com/K0maru/terra-ui))
- **Design Inspiration**: [Shanghai HYPERGRYPH Network Technology Co., Ltd.](https://www.hypergryph.com/)
