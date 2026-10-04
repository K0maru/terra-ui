# TICKETS-0004 // 泰拉全域双轴机能设计系统实现工单

## 📋 工单概览

- 关联规格：[SPEC-0004](./SPEC-0004-dual-axis-ip-restructuring.md)
- 目标分支：`feat/dual-axis-ip-restructuring` -> 合并到 `dev`

---

### 🎫 TICKET-01: 新增 2D 平面战术干员档案组件 (`<TerraDossierCard.svelte>`)
- **目标文件**：
  - `src/components/TerraDossierCard.svelte` (新创建)
  - `src/components/index.ts` (导出新组件)
- **实现要求**：
  1. 遵循瑞士国际排版与罗德岛 PRTS 战术档案美学：
     - 剪切角肖像框架（带微妙的扫描线光栅与网格微缩十字丝）。
     - 干员代号（如 `CH'EN // 陈`, `AMIYA // 阿米娅`）、职能分支（如 `GUARD // 近卫`, `MEDIC // 医疗`）、稀有度星级刻度。
     - 权限等级标（`<TerraBadge>`）、健康/部署状态标（`<TerraStatusBeacon>`）。
     - 物资/身份识别条形码（`<TerraBarcode>`）。
     - 战术指令触发按钮组（`<TerraButton>`：部署/调度/备战）。
  2. 严格 Props 接口：
     - `codename: string`
     - `nameZh?: string`
     - `archetype: string`
     - `clearance: string`
     - `status: 'online' | 'standby' | 'alert' | 'offline'`
     - `uid: string`
     - `class?: string`
  3. 性能：100% Svelte 5 Runes，零重排，仅使用 GPU 合成层滤镜与变换。
- **验收标准 (DoD)**：
  - 组件支持 Dark 和 Light 两种模式的高对比度表现。
  - TypeScript 类型完备无报错。

---

### 🎫 TICKET-02: 导航栏与品牌定位重塑 (`src/App.svelte`)
- **目标文件**：
  - `src/App.svelte` (顶部导航与全局状态)
- **实现要求**：
  1. 彻底移除“孤立模板切换”概念，升级为 **TERRA-UI 泰拉全域机能设计系统**：
     - 标题：`TERRA // DUAL-AXIS HUD` v0.6.0
     - 副标：`明日方舟 IP 泰拉全域机能设计系统 // 2D 平面战术与 3D 空间拓扑`
  2. 色谱切换器语义重构：
     - `RHODES // 罗德岛` (PRTS 青蓝/黑白极简瑞士色谱)
     - `TALOS // 终末地` (帝江号 高压黄色谱)
     - `WULING // 武陵城` (东方未来工业 翡翠绿/金砂色谱)
  3. 锚点导航：
     - `01 // 2D TACTICAL` (平面战术控制台场景)
     - `02 // 3D SPATIAL` (空间拓扑工业场景)
     - `03 // COMPONENT MATRIX` (全量组件矩阵与实验室)
- **验收标准 (DoD)**：
  - 导航在移动端与宽屏下自适应换行，无溢出或文字截断。

---

### 🎫 TICKET-03: 场景一：2D 平面战术控制台模拟场景构建 (Section 01)
- **目标文件**：
  - `src/App.svelte` (Section 01)
- **实现要求**：
  1. 完整模拟罗德岛实战战术调度中心（Operator Dossier & Tactical Dispatch Console）：
     - 顶部：瑞士版式巨幅代号、条形码、操作指令状态流。
     - 左侧：交互式干员选择器（可切换 `CH'EN`, `AMIYA`, `KAL'TSIT`），动态载入对应 `<TerraDossierCard>`！
     - 右侧：高密度战术安全权限矩阵（Clearance Badges Matrix）、战术输入指令检索框（`<TerraInput prefix="PRTS//COMMAND>" />`）与行动控制按钮组。
  2. 纯粹的 2D 平面美学：高反差黑白对比、零 3D 杂乱渐变，凸显文字排印的力量与网格秩序。
- **验收标准 (DoD)**：
  - 切换干员时数据与档案卡平滑响应，交互顺畅。

---

### 🎫 TICKET-04: 场景二与全量组件矩阵升级 (Section 02 & Section 03)
- **目标文件**：
  - `src/App.svelte` (Section 02 & Section 03)
- **实现要求**：
  1. **Section 02 (3D SPATIAL & INDUSTRIAL COMPLEX)**：
     - 模拟塔卫二 AIC 自动化采矿基建：结合双主峰山峦等高线（`<TerraContourLines>`）、-20° 下沉式工业能量总线（`<TerraSegmentBar>`）、CAD 瞄准图层（`<TerraCadPattern>`）与三列滚动遥测数字（`<TerraRollingNumber>`）。
  2. **Section 03 (UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB)**：
     - 满足用户核心要求：“展示页面全面展示所有组件……2D和3D不能是单纯的切换，而是不同方向同时展示”：
       - **左轨展示：2D 平面战术原子组件库**（`<TerraButton>` 各切角与变体、`<TerraBadge>` 全系权限、`<TerraStatusBeacon>` 四态脉冲、`<TerraBarcode>`、`<TerraInput>`）。
       - **右轨展示：3D 空间拓扑原子组件库**（`<TerraVerticalSlider>` 垂直标尺、`<TerraVerticalTabs>` 悬浮标签、`<TerraCornerBrackets>` HUD 包围、`<TerraSegmentBar>` 工业母线、`<TerraCadPattern>` 网格）。
       - **交互实验室**：精密垂直滑块控制动态斜切角与缩放比例，实时驱动视口组件形变。
- **验收标准 (DoD)**：
  - 所有组件均在页面上获得完整陈列与真实渲染。

---

### 🎫 TICKET-05: 生产构建验证、规范提交与 Bot PR 合并
- **目标**：
  1. 执行 `npm run build`，确保 0 errors, 0 warnings，构建时间 < 400ms。
  2. 读取 `git config --get agent.coauthor`，以标准 Bot 规范提交代码至 `feat/dual-axis-ip-restructuring`。
  3. 推送到远程分支，通过 `gh pr create` 发起包含 `[AI-Agent]` 标识的 PR 并合并到 `dev`。
- **验收标准 (DoD)**：
  - `dev` 分支成功集成双轴重构代码。
