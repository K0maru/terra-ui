# TICKETS-0021: 跨媒介字体矩阵与战术遥测仪表箱工单拆解

## 📌 关联
- **SPEC**: `specs/SPEC-0021-typography-matrix-and-telemetry-box.md`
- **特性分支**: `feat/typography-matrix-and-telemetry-box`
- **目标里程碑**: `v0.2.0-milestone`

---

## 📋 工单拆解

### 🎫 TICKET-01: 5 级字体矩阵、增四度字阶与透明度降噪令牌 (`tokens.css`)
- **内容**：
  - 在 `src/lib/styles/tokens.css` 中注入：
    - `--terra-font-display`, `--terra-font-tactical`, `--terra-font-telemetry`, `--terra-font-body`, `--terra-font-code`；
    - `--terra-type-scale: 1.414`；
    - 工具类 `.font-display`, `.font-tactical`, `.font-telemetry`, `.font-code`；
    - 工具类 `.terra-text-dim` 与 `.terra-text-anchor`；
- **验收标准 (DoD)**：
  - `npm run build:css` 编译成功，样式表中包含完整的字体工具类与降噪变量。

---

### 🎫 TICKET-02: 研发游标微刻度尺指示器 (`<TerraVernierMeter.svelte>`)
- **内容**：
  - 创建 `src/lib/components/TerraVernierMeter.svelte`；
  - 10 刻度精密物理滑槽，长刻度 6px、副刻度 3px；
  - 指针 `meter-needle`（`translate3d(ratio * 100%, 0, 0)`）平滑滑动；
  - 激活分段变色与告警阈值分色；
  - WAI-ARIA `role="meter"` 支持；
  - 导出于 `src/lib/index.ts`。
- **验收标准 (DoD)**：
  - 组件支持 `value`, `min`, `max`, `ticks`, `hazard`；
  - 硬件加速动效流畅无卡顿。

---

### 🎫 TICKET-03: 研发高集成度战术遥测仪表箱 (`<TerraTelemetryBox.svelte>`)
- **内容**：
  - 创建 `src/lib/components/TerraTelemetryBox.svelte`；
  - 顶部 Header：站点标识、协议号与自动派生十六进制状态码；
  - 中部 Body：指标标签、大字阶数值读数（大字号 + 醒目单位符号）、内嵌 `<TerraVernierMeter>`；
  - 底部 Footer：微型条码与状态标签；
  - 45° 几何切角与左侧战术导轨边线；
  - 导出于 `src/lib/index.ts`。
- **验收标准 (DoD)**：
  - 支持所有定义的 Props；
  - 与当前色谱（cyan, amber, emerald）及明暗双模完美自适应。

---

### 🎫 TICKET-04: 展示台 Section 02 集成与 GitBook 文档同步
- **内容**：
  - 在 `src/App.svelte` Section 02（工业拓扑复合体）中集成 `<TerraTelemetryBox>`，并与动态时钟/负载模拟联动；
  - 在 `src/docs/docsData.ts` 增加 `<TerraVernierMeter>` 与 `<TerraTelemetryBox>` 的组件 API 规范与 Playground 演示；
  - 运行 `npm run check`（0 errors, 0 warnings）；
  - 运行 `npm run build` 与 `npm run package`（0 errors, 0 warnings）；
  - 检查脱敏与 Bot 署名提交；
  - 发起 PR 并合入 `dev` 与 `main`。
- **验收标准 (DoD)**：
  - 演示台交互丝滑，文档试玩可用，双主干构建通过。
