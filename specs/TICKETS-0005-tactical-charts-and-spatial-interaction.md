# TICKETS-0005 // 3D 空间悬浮交互与战术动效图表套件实现工单

## 📋 工单概览

- 关联规格：[SPEC-0005](./SPEC-0005-tactical-charts-and-spatial-interaction.md)
- 目标分支：`feat/tactical-charts-and-spatial-interaction` -> 合并到 `dev`

---

### 🎫 TICKET-01: 新增 3D 空间鼠标悬浮物理卡片 (`<TerraSpatialCard.svelte>`)
- **目标文件**：
  - `src/components/TerraSpatialCard.svelte` (新创建)
  - `src/components/index.ts` (导出新组件)
- **实现要求**：
  1. 真实物理 3D 悬浮交互：
     - 监听 `pointermove`、`pointerleave`，计算鼠标在卡片矩形内的相对坐标百分比；
     - 结合 CSS `perspective(1000px)`、`rotateX(...)`、`rotateY(...)` 驱动卡片三维姿态倾斜；
     - 包含径向反射高光（Sheen）跟随鼠标光标，增强硬朗金属/碳纤维材质感；
     - 设置 `transform-style: preserve-3d`，内部子元素可通过 CSS 或类名实现多层 Z 轴悬浮（`translateZ(20px)` / `translateZ(40px)`），鼠标晃动时产生强烈的视差深度；
     - 鼠标离开时光滑回弹至初始平整状态（零卡顿）。
  2. 属性支持：
     - `cut?: 'none' | 'tr' | 'tl-br' | 'tr-bl'`
     - `maxRotation?: number` (默认 16)
     - `perspective?: number` (默认 1000)
     - `sheen?: boolean` (默认 true)
     - `class?: string`
     - `children?: Snippet`
- **验收标准 (DoD)**：
  - 鼠标在卡片上移动时，肉眼可显著感受到卡片三维倾斜与内部多层深度悬浮。

---

### 🎫 TICKET-02: 新增原生战术动效图表套件 (Donut, Line, Bar)
- **目标文件**：
  - `src/components/TerraDonutChart.svelte` (新创建)
  - `src/components/TerraLineChart.svelte` (新创建)
  - `src/components/TerraBarChart.svelte` (新创建)
  - `src/components/index.ts` (导出新组件)
- **实现要求**：
  1. **零第三方库**：纯 Svelte 5 + 原生 SVG + CSS GPU 合成层动画。
  2. **`<TerraDonutChart>`**：
     - 战术圆环展开动画（`stroke-dasharray` / `stroke-dashoffset`）；
     - 悬浮扇区时扇区微凸发光，中心动态实时刷新显示当前项数值与标签；
     - 外围装饰性极坐标刻度与战术指示角标。
  3. **`<TerraLineChart>`**：
     - 平滑曲线/折线路径描边生长动画；
     - 发光渐变区域底衬（Area Fill Gradient）；
     - CAD 辅助网格线，鼠标悬浮时十字丝扫描探针显示坐标与具体数值。
  4. **`<TerraBarChart>`**：
     - 45° 斜切角柱体，交错向上升起动效（`transform: scaleY(...)`）；
     - 战术阈值告警分色（正常高亮、预警橙黄、危险朱红）；
     - 数值标签与类别文字。
- **验收标准 (DoD)**：
  - 所有图表完全响应当前主题色与亮暗模式，动画流畅不掉帧。

---

### 🎫 TICKET-03: 彻底去游戏专有名词，重构战术通用语义
- **目标文件**：
  - `src/components/TerraTacticalProfile.svelte` (替代原档案卡)
  - `src/components/TerraDossierCard.svelte` (平稳重构/重命名)
  - `src/styles/tokens.css` (主题重命名为色谱语义)
  - `src/App.svelte` (全面去除特定游戏专有词)
- **实现要求**：
  1. 移除所有人名（陈、阿米娅、凯尔希、德克萨斯）与专有名词（罗德岛、塔卫二、帝江、武陵、PRTS）；
  2. 采用通用科技机能战术语义：
     - 单元代号：`UNIT-01 // VANGUARD`, `UNIT-02 // SPECIALIST`, `UNIT-03 // DEFENDER`, `CORE-04 // SENTINEL`
     - 色谱语义：`CYAN // BLUEPRINT`（战术蓝图）, `AMBER // HAZARD`（工业高压）, `EMERALD // BIO-CYBER`（生化监测）
     - 场景语义：`SECTOR // TACTICAL CONSOLE`, `INDUSTRIAL AUTOMATION COMPLEX`, `PARAMETRIC CALIBRATION LAB`
- **验收标准 (DoD)**：
  - 页面无任何特定游戏版权名称，转变为独立自洽的未来机能设计系统。

---

### 🎫 TICKET-04: 页面重排以强化 2D 平面 vs. 3D 空间感官对比
- **目标文件**：
  - `src/App.svelte`
- **实现要求**：
  1. **Section 01 (2D FLAT TACTICAL SYSTEM)**：
     - 纯平面无视角倾斜展示：瑞士网格、等宽排版、战术输入框、权限徽章、通用战术单元档案卡、2D 战术折线图与柱状图。
  2. **Section 02 (3D SPATIAL & INDUSTRIAL COMPLEX)**：
     - 突出 3D 空间立体感：
       - 采用 `<TerraSpatialCard>` 承载核心遥测面板，鼠标划过产生明显的立体视角倾斜与 Z 轴分层视差；
       - 展示 3D 战术环形雷达饼图、-20° 下沉式能量母线、山峦等高线背景与 CAD 坐标网格。
  3. **Section 03 (UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB)**：
     - 左右分列完整陈列 2D 原生组件与 3D 空间组件（包含新加入的图表与空间卡片）；
     - 底部精密垂直滑块控制斜切角与缩放参数。
- **验收标准 (DoD)**：
  - 用户能一目了然区分出 2D 平面的严谨扁平与 3D 空间的交互悬浮物理深度。

---

### 🎫 TICKET-05: 生产构建验证、规范提交与 Bot PR 合并
- **目标**：
  1. 执行 `npm run build`，确保 0 errors, 0 warnings，构建时间 < 400ms。
  2. 读取 `git config --get agent.coauthor`，以标准 Bot 规范提交代码至 `feat/tactical-charts-and-spatial-interaction`。
  3. 推送到远程分支，通过 `gh pr create` 发起包含 `[AI-Agent]` 标识的 PR 并合并到 `dev`。
- **验收标准 (DoD)**：
  - 成功合并 PR 到 `dev` 分支，本地及远端同步。
