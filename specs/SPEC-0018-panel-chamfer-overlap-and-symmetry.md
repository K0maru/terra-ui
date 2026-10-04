# SPEC-0018: Elimination of Chamfer/Border Overlaps, Bolt Symmetry & Mutually Exclusive Corner Decorators

## 1. Metadata
- **Status**: Approved
- **Author**: Antigravity (AI Architect)
- **Target Branch**: `fix/panel-chamfer-overlap-and-symmetry`
- **Target Components**: `src/components/TerraPanel.svelte`, `src/App.svelte`
- **Constraint**: Zero-VDOM, Svelte 5 Native Runes, pure SVG vector synchronization, zero overlapping artifacts.

---

## 2. Root Cause Analysis & Problem Statement

### 2.1 Multi-Layer Border/Chamfer/Background Overlap (切角、边线、背景错位重叠)
- **Root Cause**:
  - The background plate `div` used CSS `clip-path` driven by `var(--terra-cut-size)`.
  - The SVG vector border `<path>` used JS-calculated `c = Math.max(14, cutSize)`.
  - The inner content container also used CSS `cutClass`.
  - When `var(--terra-cut-size)` and `c` differed, the background plate was clipped at one diagonal, while the SVG border and chamfer runner were drawn at another, producing ugly double-lines, background bleed, and jagged misalignments.

### 2.2 Bolt/Screw Hole Asymmetry (螺栓孔非中心对称)
- **Root Cause**:
  - The hexagon polygon vertices in the `industrial` preset were handwritten with uneven delta offsets (`3.5` vs `4.5`), causing skewed non-regular hexagons.
  - Bolt socket centers were placed with asymmetric margins relative to the outer borders.

### 2.3 Inner & Outer Corner Decoration Overlap (内边角与外边角装饰重叠冲突)
- **Root Cause**:
  - Within `<TerraPanel>`: Rendering bold 45° chamfer rails on cut corners WHILE simultaneously rendering bold 22px L-brackets on intact corners created visual competition and physical collisions near the transition vertices.
  - In `src/App.svelte`: `<TerraCornerBrackets>` was wrapping `<TerraPanel>` directly, rendering outer brackets right on top of the panel's inner corner decorators.

---

## 3. Architecture & Resolution Strategy

### 3.1 Unified SVG Background & Continuous Vector Border
- Remove the separate background `div`!
- The single SVG `<path d={polygonPath}>` now serves as **both** the background fill and the perimeter stroke:
  ```html
  <path
    d={polygonPath}
    fill="var(--terra-bg-surface)"
    stroke="var(--terra-border)"
    stroke-width="1"
    vector-effect="non-scaling-stroke"
  />
  ```
- Because the background fill and the border line originate from the exact same mathematical path, **it is impossible for the background to bleed or for the border to desync**.
- The inner content container uses an inline `style="clip-path: polygon(...)"` computed from the exact same coordinates.

### 3.2 True Polar Center-Symmetric Hex Fasteners
- Formulate hex bolt vertices strictly via polar trigonometry:
  $$x_i = cx + R \cos\left(i \cdot 60^\circ\right), \quad y_i = cy + R \sin\left(i \cdot 60^\circ\right)$$
- Symmetrically placed at `cx = 14, cy = 14` (and `w - 14, h - 14`), perfectly equidistant from both perpendicular edges.

### 3.3 Mutually Exclusive Decorator Hierarchy (`focus='auto'`)
- Introduce mutually exclusive focus logic:
  - When `cut !== 'none'`: Focus **exclusively** on the 45° chamfer cuts! Clean up the 90° corners so they remain crisp, elegant 1px borders without competing L-brackets.
  - When `cut === 'none'`: Focus **exclusively** on the four 90° corners (rendering L-brackets, caliper ticks, or bolts).
  - Supported via `focus?: 'auto' | 'chamfer' | 'corner' | 'both'` (default `'auto'`).
- In `src/App.svelte`: Remove redundant outer `<TerraCornerBrackets>` wrapping `<TerraPanel>` at Section 03 Lab.

---

## 4. Verification
- 0 errors, 0 warnings from `npm run check && npm run build`.
- Zero visual bleed between chamfer, border, and background fill.
- Hex bolts are visibly and geometrically regular and center-symmetric.
- No overlapping outer and inner corner brackets.
