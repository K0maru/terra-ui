# TICKETS-0019: Pure Minimalist Chamfer Geometry & Configurable Sealed/Open Border

## 📋 Ticket Summary Table

| Ticket ID | Title | Target File | DoD (Definition of Done) |
| :--- | :--- | :--- | :--- |
| **TICKET-01** | Strip All Tooth/Lug Clutter from Cut Corners | `src/components/TerraPanel.svelte` | Remove all `<rect>` lug teeth and double dashed clutter; cut edges are 100% smooth, razor-sharp vector lines. |
| **TICKET-02** | Implement `chamferBorder` (Sealed vs Open Cut) Toggle | `src/components/TerraPanel.svelte` | Add `chamferBorder?: boolean` (default `true`); when false, 1px stroke omits diagonal cut. |
| **TICKET-03** | Interactive Toggle in Section 03 Lab & Docs | `src/App.svelte`, `src/docs/docsData.ts`, `src/docs/TerraDocsView.svelte` | Add `[BORDER: SEALED / OPEN]` toggle in Section 03 Lab and Docs for immediate live comparison. |
| **TICKET-04** | Verification, Build Check & Bot PR to `dev` | Build, Git, GitHub PR | 0 error, 0 warning build; git commit with bot attribution; PR created and merged into `dev`. |
