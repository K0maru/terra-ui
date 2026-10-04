# SPEC-0016: Panel Chamfer Edge & Modular Corner Decoration Suite

## 1. Metadata
- **Status**: Approved
- **Author**: Antigravity (AI Architect)
- **Target Branch**: `feat/panel-chamfer-and-corner-decorations`
- **Target Components**: `src/components/TerraPanel.svelte`, `src/styles/tokens.css`, `src/docs/docsData.ts`, `src/docs/TerraDocsView.svelte`, `src/App.svelte`
- **Zero-Dependency Constraint**: 100% Svelte 5 Native Runes (`$state`, `$derived`, `$props`), GPU-accelerated Compositor, 0 runtime dependencies.

---

## 2. Background & Problem Statement

In the previous implementation of `<TerraPanel.svelte>`, three significant design and rendering defects were identified:

1. **Border Breakdown on 45° Chamfer Cut (斜边断口)**:
   - CSS `border: 1px solid var(--terra-border)` was applied on the bounding rectangular box, while `clip-path: polygon(...)` trimmed the corner.
   - Consequently, the top and side borders stopped abruptly at the chamfer vertices, leaving the 45° diagonal cut completely borderless and unrendered.
2. **Decoration Truncation by `clip-path` (装饰被物理裁切)**:
   - Decorative corner brackets (`bracket={true}`) and reticle crosshairs (`reticle={true}`) were styled via `::before` and `::after` on the same element holding the `clip-path`.
   - On `cut="tl-br"` (Top-Left and Bottom-Right cut), both the top-left bracket `(0, 0)` and bottom-right bracket `(100%, 100%)` fell 100% inside the 16px trimmed corner, completely erasing all brackets.
3. **Visual Monotony & Geometric Dissonance (十字单调且与斜角几何冲突)**:
   - Floating orthogonal `+` crosshairs in a 45° chamfered corner created geometric conflict (90° orthogonal vs 45° diagonal).
   - Slapping `+` indiscriminately across all panel corners lacked structural cohesion and authentic industrial logic.

---

## 3. Design System & Aesthetics (明日方舟 & 终末地官方设计规范)

Based on Hypergryph's official UI design languages in *Arknights* (PRTS Rhode Island) and *Arknights: Endfield* (Talos-II AIC):

### 3.1 45° Chamfer Cut Treatment (斜切角处理)
- **Continuous 1px Metal Border**: Every segment of the polygon perimeter (including the 45° diagonal cut) must feature a crisp, uninterrupted 1px border stroke.
- **Chamfer Accent Runner (45° 平行装甲加强筋)**: A high-precision parallel accent line running along the inner side of the 45° chamfer, terminating in structural locking notches.
- **Chamfer Joint Notches (切角端点咬合卡槽)**: Microscopic 2px joint teeth at the transition vertices between orthogonal and diagonal edges.

### 3.2 90° Orthogonal Corner Treatment (直角端处理)
- **Milled Micro-Ticks (梳状三联标定微刻度 `|||`)**: Three parallel, ultra-fine vertical/horizontal calibration marks etched along the corner border.
- **Dual-Layer L-Bracket (双层 L 战术加固骨架)**: An outer 1px structural frame paired with an inner high-contrast L-bracket inset.
- **Chassis Fastener Screws (沉头六角铆钉孔)**: Subtle 4px recessed circular fastener cavities with 1px specular highlight rims.
- **Restructured Tactical Brackets**: Intact 90° corners receive classic HUD brackets without clipping.

---

## 4. Component Specification: `<TerraPanel.svelte>`

### 4.1 Props Interface
```typescript
export type PanelCut = 'tl-br' | 'tr-bl' | 'tr' | 'br' | 'none'
export type PanelDecoration = 'endfield' | 'rhodes' | 'industrial' | 'brackets' | 'clean'

interface Props {
  title?: string
  tag?: string
  cut?: PanelCut
  /** Modular decoration preset: 'endfield' (default), 'rhodes', 'industrial', 'brackets', 'clean' */
  decoration?: PanelDecoration
  /** Legacy alias for 'brackets' */
  bracket?: boolean
  /** Legacy alias for reticle crosshairs (auto-migrated to modern decoration) */
  reticle?: boolean
  warning?: boolean
  children?: Snippet
  actions?: Snippet
  class?: string
}
```

### 4.2 Decoration Presets Definition
1. **`endfield` (Default · Talos-II AIC Industrial)**:
   - 45° Chamfer: 45° Parallel Accent Runner with locking joint notches.
   - 90° Corner: Dual-layer L-bracket with high-contrast accent color.
2. **`rhodes` (PRTS Tactical Calibration)**:
   - 45° Chamfer: Dual-end notch joints at chamfer vertices.
   - 90° Corner: Milled micro-ticks (`|||` 3 precision calibration lines) + optional micro serial stamp `//`.
3. **`industrial` (Heavy Machinery Fastener)**:
   - 45° Chamfer: Reinforced chamfer bevel runner.
   - 90° Corner: Recessed 4px chassis fastener rivet dots.
4. **`brackets` (Classic Tactical HUD)**:
   - 45° Chamfer: Clean chamfer with continuous 1px border.
   - 90° Corner: Classic 90° HUD brackets (`┌`, `┐`, `└`, `┘`) only on intact corners (never clipped!).
5. **`clean` (Swiss Minimalist Engineering)**:
   - Zero superfluous ornament, pure 1px continuous chamfered metal border.

### 4.3 Structural Architecture
```html
<div class="relative terra-panel-container {className}">
  <!-- Continuous 1px Perimeter Border & Background Chassis -->
  <div class="absolute inset-0 pointer-events-none terra-panel-chassis {cutClass}">
    <!-- SVG Vector Overlay for Crisp 1px Continuous Border + Chamfer Runners & Ticks -->
    <svg class="absolute inset-0 w-full h-full overflow-visible pointer-events-none" ...>
      ...
    </svg>
  </div>

  <!-- Panel Header (Hazard Stripe, Title, Tag, Actions with safe padding) -->
  {#if title || tag || actions || warning}
    ...
  {/if}

  <!-- Panel Content -->
  <div class="relative z-10 p-4 sm:p-5">
    {@render children?.()}
  </div>
</div>
```

---

## 5. Non-Negotiable Performance & Privacy Constraints
1. **Zero-VDOM**: Native Svelte 5 Runes.
2. **GPU Compositor**: All borders and highlights rendered via hardware-accelerated SVG paths or CSS polygon clipping.
3. **Zero Sensitive Data Leakage**: No personal emails, no local paths.
4. **Zero Build Warnings**: `npm run check && npm run build` must pass cleanly.
