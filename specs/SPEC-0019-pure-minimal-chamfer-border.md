# SPEC-0019: Pure Minimalist Chamfer Geometry & Configurable Sealed/Open Border

## 1. Metadata
- **Status**: Approved
- **Author**: Antigravity (AI Architect)
- **Target Branch**: `feat/pure-minimal-chamfer-border`
- **Target Components**: `src/components/TerraPanel.svelte`, `src/App.svelte`, `src/docs/docsData.ts`, `src/docs/TerraDocsView.svelte`
- **Zero-Dependency Constraint**: 100% Svelte 5 Native Runes, pure SVG vector paths, zero external libraries.

---

## 2. Problem Statement & Aesthetic Directives

### 2.1 Stripping Outer Artifacts on Cut Corners (被切的角零毛刺外饰)
- When a corner is chamfered, the original 90° vertex is physically removed.
- Any lingering teeth (`rect` lugs), double-stacked dashed lines, or corner tabs hanging onto the outer edges disrupt the crisp, razor-sharp 45° diagonal angle.
- Directive: **Completely remove all lug teeth and extraneous jagged shapes along chamfer edges.** The chamfer cut must be pristine and sleek.

### 2.2 Configurable Chamfer Border: Sealed (包边) vs Open (不包边)
- **Sealed (`chamferBorder = true`, Default)**:
  The 1px structural metal perimeter continues seamlessly across the 45° diagonal cut, providing complete mechanical enclosure and high background adaptability.
- **Open (`chamferBorder = false`)**:
  The 1px border terminates right where the 45° cut starts, leaving the diagonal completely open without any stroke, exposing the raw cutaway plate.
- Both styles serve distinct aesthetic preferences and can be toggled via `chamferBorder?: boolean`.

---

## 3. Component Specification: `<TerraPanel.svelte>`

```typescript
interface Props {
  title?: string
  tag?: string
  cut?: PanelCut
  cutSize?: number
  decoration?: PanelDecoration
  focus?: DecorationFocus
  /** Whether the 45° chamfer cut has a 1px border (true = sealed, false = open cut) */
  chamferBorder?: boolean
  warning?: boolean
  children?: Snippet
  actions?: Snippet
  class?: string
}
```

### 3.1 Path Calculations
- **When `chamferBorder === true`**:
  A single closed path `polygonPath` draws the entire perimeter including the chamfer diagonals.
- **When `chamferBorder === false`**:
  The background remains filled via `polygonPath`, but the border stroke path `openBorderSegments` draws only the orthogonal segments (e.g. `M w,c L w,h L c,h` and `M 0,h-c L 0,0 L w-c,0`), omitting the diagonal connections.

---

## 4. Verification
- `npm run check && npm run build` passes with 0 errors and 0 warnings.
- Chamfer edges are completely smooth and free of any tooth/lug clutter.
- Switching between `chamferBorder={true}` and `chamferBorder={false}` cleanly toggles the 1px diagonal border.
