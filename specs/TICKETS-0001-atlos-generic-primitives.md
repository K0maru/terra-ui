# TICKETS-0001: 终末地 Atlos 基因通用战术组件原子拆解工单

- **关联规格**：[`specs/SPEC-0001-atlos-generic-primitives.md`](./SPEC-0001-atlos-generic-primitives.md)
- **目标分支**：`feat/atlos-generic-primitives`
- **执行方式**：Subagent 隔离测试先行实施

---

## 🎫 工单列表

### 1. TICKET-01: 基础测绘层 `<TerraCadPattern />` 与 `<TerraCornerBrackets />`
- **目标**：
  - 封装 `src/components/TerraCadPattern.svelte`：
    - 采用内联 SVG 数据或 CSS Mask 实现 Atlos 45° 斜角 CAD 网格模式；
    - 自动继承主题暗色/浅色配色，支持通过插槽包裹任意内容或作为绝对定位底纹。
  - 封装 `src/components/TerraCornerBrackets.svelte`：
    - 实现四角战术取景框（`tl`, `tr`, `bl`, `br`），支持可选 `label` 遥测标语与呼吸辉光；
    - 纯 CSS `clip-path` 与 `border` 实现，零多余节点开销。
- **验收标准 (DoD)**：
  - 独立渲染正常，明暗双模式下对比度清晰且不影响前景可读性。

---

### 2. TICKET-02: 战术精密垂直滑块 `<TerraVerticalSlider />`
- **目标**：
  - 封装 `src/components/TerraVerticalSlider.svelte`：
    - 复刻 Atlos 垂直能量标尺结构：顶部微方块 `[+]` 步进键、中间垂直轨道、底部微方块 `[-]` 步进键；
    - 顶部与底部搭载流体倒角装饰（`clip-path: path(...)`）；
    - 内部填充条采用 `transform: scaleY(progress)`，完全运行于 GPU Compositor 线程；
    - 完整支持：指针拖拽滑动（Pointer Capture）、鼠标滚轮调节、上下方向键调节；
    - 完善无障碍属性：`role="slider"`, `aria-valuenow`, `aria-orientation="vertical"`。
- **验收标准 (DoD)**：
  - `bind:value` 双向绑定可靠，拖拽流畅无顿挫，60/120fps 满帧运行。

---

### 3. TICKET-03: 战术悬浮指示滑块切换器 `<TerraVerticalTabs />`
- **目标**：
  - 封装 `src/components/TerraVerticalTabs.svelte`：
    - 垂直导航轨道与 Tab 按钮项；
    - 独立悬浮的高亮工装指示滑块（Floating Indicator），使用 `transform: translateY(index * (height + gap))` 沿轨道顺滑飞行；
    - 采用 Atlos 官方缓动曲线 `$moderato-curve: cubic-bezier(0.8, 0.2, 0.35, 0.7)`；
    - 键盘上下键轮换支持与选中反馈。
- **验收标准 (DoD)**：
  - 切换选项时滑块飞行精准，文字与图标在滑块经过时产生高反差对比，支持双向绑定 `bind:selectedKey`。

---

### 4. TICKET-04: Showcase 场景编排集成与生产构建
- **目标**：
  - 在 `src/App.svelte` 第三板块（`03 // PARAMETRIC LAB`）挂载全新组件：
    - 用 `<TerraVerticalSlider />` 替代原生 input[type=range]，联动调节切角像素与缩放；
    - 引入 `<TerraVerticalTabs />` 实现三战区（谷地 IV / 帝江号 / 武陵枢纽）快速视图选择；
    - 遥测监控面板统一装配 `<TerraCornerBrackets />` 与 `<TerraCadPattern />`；
  - 执行 `npm run build`，确保 0 错误、0 警告，单页面构建耗时 < 350ms。
- **验收标准 (DoD)**：
  - 生产构建无任何警告，展示台操作丝滑顺畅。
