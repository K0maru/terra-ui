# SPEC-0017: Bold Heavy-Armour Visual Scale for TerraPanel

## 1. Metadata
- **Status**: Approved
- **Author**: Antigravity (AI Architect)
- **Target Branch**: `feat/bold-heavy-armor-panel-decorations`
- **Target Components**: `src/components/TerraPanel.svelte`
- **Zero-Dependency Constraint**: 100% Svelte 5 Native Runes, pure SVG vector rendering, zero external libraries.

---

## 2. Problem Statement & Motivation
In SPEC-0016, while the mathematical structure of the continuous 1px vector chamfer border and the 5 modular presets were technically established, the visual scale was overly subtle:
- 8px bracket arm length with 1.5px stroke width was nearly imperceptible on standard 1080P/2K displays.
- Chamfer runners were fixed-pixel lines that shrank to a couple of pixels when `cutSize` was small.
- Fasteners and micro-ticks lacked geometric contrast and structural presence.

To authentically capture the heavy-machinery and aerospace industrial aesthetics of *Arknights* and *Arknights: Endfield*, the decorations must have bold visual weight, high tactile contrast, and authentic hard-surface engineering proportions.

---

## 3. Visual Scale Upgrades

### 3.1 `endfield` (Talos-II AIC Heavy-Armour)
1. **Bold 45° Chamfer Armor Band**:
   - The chamfer edge itself is accented with a **2.5px ~ 3px heavy armor rail** (`stroke="var(--terra-accent-primary)"`).
   - A parallel inner guide line is rendered at a clean 5px offset.
   - At both chamfer vertices, solid rectangular locking lug teeth (`4px × 4px`) anchor the diagonal plate to the main chassis.
2. **Heavy-Duty 90° L-Bracket Plates**:
   - Arm length expanded from 8px to **22px**.
   - Stroke width increased from 1.5px to **2.5px** with sharp square caps (`stroke-linecap="square"`).
   - Inset at 3px from perimeter with a subtle glow drop-shadow.

### 3.2 `rhodes` (PRTS Tactical Calibration)
1. **5-Stage Tactical Comb Caliper Rulers**:
   - Replaces 3 faint lines with **5 high-density precision scale teeth** on intact corners.
   - Alternating heights (`10px, 6px, 10px, 6px, 10px`) with 3.5px spacing.
   - Accompanying high-contrast mono serial stamp (e.g. `// PRTS` or `// 01`) etched beside the scale.
2. **Chamfer Stepped Lug Joints**:
   - 45° chamfer cut features stepped dual-tooth notches at both transition vertices.

### 3.3 `industrial` (Chassis Hex Fasteners)
1. **Heavy-Duty 10px Chassis Bolts**:
   - Fastener diameter enlarged from 3px to **10px**.
   - Outer recessed counter-bore socket: `r=5px`, filled with dark chassis shade and 1px metallic rim.
   - Inner hex bolt/fastener core: `r=2px` filled with high-contrast accent color and specular dot.
2. **Chamfer Edge Bevel Band**:
   - Reinforced diagonal double-line runner with high structural presence.

### 3.4 `brackets` (Tactical HUD)
1. **22px × 22px High-Contrast HUD Brackets**:
   - Arm length **22px**, stroke-width **2.5px**, with outer crosshair anchor ticks.

---

## 4. Verification Criteria
- `npm run check && npm run build` passes with 0 errors and 0 warnings.
- Real-time reactivity when changing `cutSize` via the slider in Section 03 Parametric Lab.
- Visual presence is immediately noticeable and distinct across both Dark Mode and Light Mode.
