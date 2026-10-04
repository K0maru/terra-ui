# TICKETS-0018: Elimination of Chamfer/Border Overlaps, Bolt Symmetry & Mutually Exclusive Corner Decorators

## 📋 Ticket Summary Table

| Ticket ID | Title | Target File | DoD (Definition of Done) |
| :--- | :--- | :--- | :--- |
| **TICKET-01** | Unified SVG Background & Perimeter Stroke | `src/components/TerraPanel.svelte` | Remove separate background div; SVG path fills background and strokes border simultaneously; inner clip-path uses identical coordinates; zero desync. |
| **TICKET-02** | Polar Trigonometry Center-Symmetric Hex Fasteners | `src/components/TerraPanel.svelte` | Strict polar $(cx + R\cos\theta, cy + R\sin\theta)$ regular hex bolts, equidistant $(14, 14)$ from edges, 100% center-symmetric. |
| **TICKET-03** | Mutually Exclusive Chamfer vs Corner Decorators (`focus='auto'`) | `src/components/TerraPanel.svelte` | When `cut !== 'none'`, only chamfers are decorated; when `cut === 'none'`, only 90° corners are decorated; zero internal clashing. |
| **TICKET-04** | Remove Redundant `<TerraCornerBrackets>` Wrap in App.svelte | `src/App.svelte` | Remove outer `<TerraCornerBrackets>` around `<TerraPanel>` in Section 03 Lab to eliminate outer-inner double-bracket stacking. |
| **TICKET-05** | Verification, Build Check & Bot PR to `dev` | Build, Git, GitHub PR | 0 error, 0 warning build; git commit with bot attribution; PR created and merged into `dev`. |
