# TICKETS-0002: 垂直控制器与亮色对比度缺陷修复原子工单

- **关联规格**：[`specs/SPEC-0002-vertical-controls-and-contrast-fix.md`](./SPEC-0002-vertical-controls-and-contrast-fix.md)
- **目标分支**：`fix/vertical-controls-layout-and-light-mode-contrast`
- **执行方式**：Subagent 隔离测试先行实施

---

## 🎫 工单列表

### 1. TICKET-01: 消除 `TerraVerticalSlider` 耳翼按键重叠与脱节
- **目标**：
  - 重构 `src/components/TerraVerticalSlider.svelte`：
    - 仅在 `!showButtons && fluidDecorations` 时渲染流体装饰耳翼，彻底消除与 `+` / `-` 按钮的穿插覆盖；
    - 强化 `terra-slider-btn` 战术按键质感（微切角、边框发光、阴影、按压位移反馈）；
    - 优化滑槽与按键之间的垂直间距和容器尺寸，杜绝脱节感；
    - 保留 100% GPU `scaleY` 填充与无障碍属性。
- **验收标准 (DoD)**：
  - 按钮与滑轨层次分明，零遮挡、零穿插，拖拽与按键交互平滑自如。

---

### 2. TICKET-02: 修复 `TerraVerticalTabs` 亮色模式短码对比度
- **目标**：
  - 重构 `src/components/TerraVerticalTabs.svelte` 短码样式：
    - 未选中短码改用 `bg-[var(--terra-bg-surface-active)] text-[var(--terra-text-primary)] border border-[var(--terra-border)]`；
    - 选中短码保持黑底强调色；
    - 验证 `data-mode="light"` 与 `data-mode="dark"` 下 `VL-04`、`DJ-01`、`WL-09` 均达到 WCAG AAA 级高清晰对比度。
- **验收标准 (DoD)**：
  - 亮暗双模式下短码字迹锐利清晰，切换流畅无突兀。

---

### 3. TICKET-03: `App.svelte` 第三板块布局精修与验证
- **目标**：
  - 精修 `src/App.svelte` 第三板块中 `PRECISION VERTICAL CONTROLS` 容器网格与内边距；
  - 运行 `npm run build`，确保 0 错误、0 警告。
- **验收标准 (DoD)**：
  - 生产构建无警告，展示台在不同分辨率下均呈现统一、整洁、高度机能感的排版。
