# TICKETS-0016: Panel Chamfer Edge & Modular Corner Decoration Suite

## 📋 Ticket Summary Table

| Ticket ID | Title | Component / Target | DoD (Definition of Done) |
| :--- | :--- | :--- | :--- |
| **TICKET-01** | Redesign `<TerraPanel.svelte>` Core & Continuous 1px Chamfer Border | `src/components/TerraPanel.svelte`, `src/styles/tokens.css` | Continuous 1px border along all polygon edges including 45° cut; zero border dropouts; header safe padding. |
| **TICKET-02** | Implement 5 Modular Decoration Presets (`endfield`, `rhodes`, `industrial`, `brackets`, `clean`) | `src/components/TerraPanel.svelte` | All 5 presets render correctly on any `cut` combination without truncation or clipping; backwards compatible with `bracket={true}`. |
| **TICKET-03** | Interactive Showcase & Docs Integration | `src/App.svelte`, `src/docs/docsData.ts`, `src/docs/TerraDocsView.svelte` | Add interactive decoration selector to Section 03 & Docs view; update all panels across showcase with authentic presets. |
| **TICKET-04** | Verification, Build Check & Bot PR to `dev` | Build, Git, GitHub PR | 0 error, 0 warning build; git commit with bot attribution; PR created and merged into `dev`. |

---

### TICKET-01: Redesign `<TerraPanel.svelte>` Core & Continuous 1px Chamfer Border
- **Description**:
  Overhaul `<TerraPanel.svelte>` internal DOM structure so the outer container establishes boundaries, while an inner SVG/chassis layer renders a continuous, pixel-perfect 1px border along the entire polygon perimeter (including the 45° diagonal cut).
- **Tasks**:
  1. Calculate polygon perimeter coordinates dynamically based on element dimensions (`bind:clientWidth`, `bind:clientHeight`) and cut configuration (`tr-bl`, `tl-br`, `tr`, `br`, `none`).
  2. Render SVG polygon outline with `stroke="var(--terra-border)"` and `stroke-width="1"` (or high-contrast accent when active/hovered).
  3. Apply safe right padding on the header when `cut === 'tr'` or `cut === 'tr-bl'` to avoid action button collision with the diagonal cut.

### TICKET-02: Implement 5 Modular Decoration Presets
- **Description**:
  Implement the 5 official-grade decoration presets:
  1. `endfield`: 45° Parallel Chamfer Accent Runner (`stroke="var(--terra-accent-primary)"`) + Dual-layer L-bracket on 90° corners.
  2. `rhodes`: Chamfer vertex notches + 3 Milled calibration micro-ticks (`|||`) on intact 90° corners.
  3. `industrial`: Reinforced chamfer bevel + recessed 4px chassis fastener rivet dots on 90° corners.
  4. `brackets`: Classic 90° HUD brackets on intact corners without clipping.
  5. `clean`: Zero decorations, pure crisp 1px metal chamfer outline.
- **Tasks**:
  1. Add `decoration?: 'endfield' | 'rhodes' | 'industrial' | 'brackets' | 'clean'` prop with default `'endfield'`.
  2. Map legacy `bracket={true}` to `'brackets'`.
  3. Eliminate old clipped pseudo-element classes (`.terra-reticle-corner`, `.terra-bracket-corner`).

### TICKET-03: Interactive Showcase & Docs Integration
- **Description**:
  Update Section 03 of `src/App.svelte` and `src/docs/docsData.ts` to showcase the new decoration presets, allowing live switching.
- **Tasks**:
  1. Update `src/docs/docsData.ts` with updated `TerraPanel` props table and interactive demo with decoration selector.
  2. Update `src/docs/TerraDocsView.svelte` if needed.
  3. In `src/App.svelte`, update panels to use authentic presets and add a decoration switcher in Section 03 Parametric Lab.

### TICKET-04: Verification, Build Check & Bot PR
- **Tasks**:
  1. Run `npm run check && npm run build` (0 errors, 0 warnings).
  2. Run privacy check: `git grep -inE "(foxmail|qq\.com|/Users/)"`.
  3. Commit with Bot Co-Author trailer.
  4. Push branch and open PR to `dev` using `gh pr create`.
  5. Merge PR to `dev`.
