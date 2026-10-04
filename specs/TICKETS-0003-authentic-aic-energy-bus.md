# TICKETS-0003: 终末地正统工业能量母线组件原子工单拆解

- **关联规格**：[`specs/SPEC-0003-authentic-aic-energy-bus.md`](file:///Users/k0maru3/workspace/terra-ui/specs/SPEC-0003-authentic-aic-energy-bus.md)
- **目标分支**：`feat/authentic-aic-energy-bus`
- **执行方式**：Subagent 隔离测试先行实施

---

## 🎫 工单列表

### 1. TICKET-01: 重构 `<TerraSegmentBar.svelte>` 为工业下沉倾斜母线 [COMPLETED]
- **目标**：
  - 重写 `src/components/TerraSegmentBar.svelte`：
    - 外部下沉式外壳（金属底槽、内凹阴影、端头限位块）；
    - 分段槽整体以 `-20deg` 倾斜（`transform: skewX(-20deg)`），`3px` 紧凑微间距；
    - 激活能量格实体填充与锐利 1px 内边框，消除大面积模糊发散发光；
    - 未激活空置插槽带有暗色物理卡槽内凹质感；
    - 最高激活格挂载能量前锋脉冲（`Leading Edge Pulse`）；
    - 支持 `label`、`sublabel`（电压与状态）、`showValue` 与 `variant`（`nominal`, `warning`, `danger` 等）。
- **验收标准 (DoD)**：
  - [x] 呈现出纯正的《终末地》工业母线质感，无论在 Light Mode 还是 Dark Mode 下均锐利清晰。

---

### 2. TICKET-02: 展示台第二板块综合集成与动态交互验证 [COMPLETED]
- **目标**：
  - 更新 `src/App.svelte` 第二板块中的 `AIC INDUSTRIAL ENERGY BUS`：
    - 主网母线：绑定动态 `energyBusValue`（如 7/10），附带 `⚡ 480V THREE-PHASE // AIC-BUS LOAD 70%` 遥测注脚；
    - 战术技力储备矩阵：展示 12 格高密度电池组，附带 `⚡ TACTICAL_BURST_CELL // OVERCLOCK BUFFER`；
    - 配合 `CYCLE SIMULATION` 按键触发真实能量升降与前锋脉冲位移动态；
  - 运行 `npm run build`，确保 0 错误、0 警告。
- **验收标准 (DoD)**：
  - [x] 交互测试无顿挫，生产构建通过。
