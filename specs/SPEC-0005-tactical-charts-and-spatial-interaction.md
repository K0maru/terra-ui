# SPEC-0005 // 纯粹机能美学重塑：3D 空间鼠标悬浮交互与战术动效图表套件

## 📌 1. 需求背景与核心演进

根据用户的明确反馈与指导，本次重构聚焦于三大核心演变：

1. **彻底去特定游戏内容，仅保留纯粹风格与设计美学**：
   - 移除特定人名（陈、阿米娅、凯尔希、德克萨斯）与专有世界观词汇（罗德岛、塔卫二、帝江号、武陵城等）；
   - 转向通用的**近未来机能工业与战术指挥语义系统**（例如：`SECTOR // ALPHA`, `UNIT-01 // SENTINEL`, `CORE-BUS // LOAD`, `SYSTEM // TELEMETRY`, `BLUEPRINT CYAN`, `HAZARD AMBER`, `BIO EMERALD`）；
   - 将原档案组件升级为通用的战术单元档案卡（`<TerraTacticalProfile.svelte>`）。

2. **强化 2D 平面与 3D 空间的感官差异（赋予 3D 真实的物理悬浮与鼠标交互）**：
   - **2D 平面轴 (Flat Tactical)**：纯粹的平面二维排版、严格非对称瑞士网格、单色高反差色块、等宽字符密度，绝无视角倾斜与 Z 轴伪景深。
   - **3D 空间轴 (Spatial Interactive)**：新增 **`<TerraSpatialCard.svelte>`** 空间悬浮物理卡片：
     - **鼠标悬浮多维倾角**：实时捕捉指针在卡片内的相对坐标 `(x, y)`，通过 CSS 3D 透视驱动 `rotateX` 与 `rotateY`（平滑插值）；
     - **多层 Z 轴视差悬浮 (Z-Depth Parallax)**：卡片内部的元素（标题、徽章、指示线、图表）分别配置 `translateZ(20px)`、`translateZ(40px)` 等空间分层，随鼠标晃动呈现真实三维悬浮深度；
     - **动态漫反射高光镜面 (Dynamic Specular Sheen)**：卡片表面覆盖随光标移动的径向高光反射遮罩，赋予实体金属与磨砂舱板的触感。

3. **新增全套轻量原生战术动效图表组件 (Tactical Animated Charts)**：
   - 拒绝重型第三方图表库（如 ECharts/Chart.js 带来的沉重运行时），采用纯 **Svelte 5 Runes + SVG + GPU 合成层动画**：
     - **`<TerraDonutChart.svelte>`**：战术环形/饼图，动态圆环展开动效、弧段高亮悬浮聚焦、中心数据实时滚动计数；
     - **`<TerraLineChart.svelte>`**：战术折线/面积图，动态曲线描边绘制（`stroke-dashoffset`）、发光渐变填充底衬、十字丝瞄准标与数据吸附探针；
     - **`<TerraBarChart.svelte>`**：战术柱状/直方图，45° 斜切角顶部、逐条阶梯式向上拔升动画、阈值预警分色（标称/高载/告警）。

---

## 🏗️ 2. 组件接口规格 (Component Specifications)

### 2.1 `<TerraSpatialCard.svelte>` (3D 空间悬浮物理卡片)
- **Props**:
  - `class?: string`
  - `perspective?: number` (默认 `1000px`)
  - `maxRotation?: number` (默认 `16deg`)
  - `sheen?: boolean` (默认 `true`，是否启用随鼠标移动的高光)
  - `cut?: 'none' | 'tr' | 'tl-br' | 'tr-bl'` (默认 `'tr-bl'`)
  - `borderGlow?: boolean` (默认 `true`)
  - `children?: Snippet`
- **实现原理**：
  - 监听 `pointermove` 与 `pointerleave` 事件；
  - 计算卡片中心相对偏移：`rx = ((y - centerY) / height) * -maxRotation`，`ry = ((x - centerX) / width) * maxRotation`；
  - 内部容器声明 `transform-style: preserve-3d`，子元素可使用 `data-z="high"` 或 `style="transform: translateZ(30px)"` 呈现分层漂浮；
  - 光标离开时通过 spring/cubic-bezier 平滑回弹原点。

### 2.2 `<TerraDonutChart.svelte>` (战术环形饼状图)
- **Props**:
  - `data: Array<{ label: string; value: number; color?: string; code?: string }>`
  - `size?: number` (默认 `200`)
  - `thickness?: number` (默认 `24`)
  - `title?: string`
  - `unit?: string`
  - `animated?: boolean` (默认 `true`)
  - `showLegend?: boolean` (默认 `true`)
- **交互与动效**：
  - SVG 弧段通过 `stroke-dasharray` 计算占比，初次加载与数据变更时平滑过渡；
  - 鼠标悬浮特定扇区时，该扇区放大并呈现发光投影，中心动态显示该项数值与标签。

### 2.3 `<TerraLineChart.svelte>` (战术折线与面积趋势图)
- **Props**:
  - `data: Array<{ timestamp?: string; value: number; label?: string }>`
  - `height?: number` (默认 `160`)
  - `color?: string` (默认当前主题强调色)
  - `fillOpacity?: number` (默认 `0.18`)
  - `showGrid?: boolean` (默认 `true`)
  - `showCrosshair?: boolean` (默认 `true`)
  - `animated?: boolean` (默认 `true`)
- **交互与动效**：
  - SVG Path 贝塞尔平滑曲线或折线，初始化加载路径描边生长；
  - 鼠标移入时显示战术十字丝交叉辅助线与动态悬浮浮标，显示当前坐标与具体数值。

### 2.4 `<TerraBarChart.svelte>` (战术斜切直方柱状图)
- **Props**:
  - `data: Array<{ label: string; value: number; max?: number; status?: 'normal' | 'warning' | 'critical' }>`
  - `height?: number` (默认 `180`)
  - `barWidth?: number` (默认 `24`)
  - `animated?: boolean` (默认 `true`)
  - `unit?: string`
- **交互与动效**：
  - 柱体顶部采用 45° 斜切角造型；
  - `scaleY` 级联交错延迟生长（CSS 硬件加速）；
  - 支持随数值超限自动呈现警告色与脉冲警报标。

---

## 🎨 3. 页面布局重塑 (`src/App.svelte`)

### 彻底去专有名词后的三大主题色谱：
1. **`CYAN // BLUEPRINT` (战术蓝图青光 · 默认)**：原 PRTS 冰蓝，纯粹高科技工程制图感；
2. **`AMBER // HAZARD` (工业高压金黄)**：原工业重型工程黄色，高对比度安全警戒；
3. **`EMERALD // BIO-CYBER` (生化微晶翡翠)**：原东方冷玉翡翠绿，前哨监控感。

### 页面三大板块清晰对照：
- **Header**：`TERRA // TACTICAL FUNCTIONAL DESIGN SYSTEM` v0.7.0。
- **Section 01: 2D FLAT TACTICAL SYSTEM (纯平面战术系统 · 瑞士排版)**
  - 纯粹 2D 平面：零视角倾斜、非对称排版网格；
  - 战术操作单元档案（`<TerraTacticalProfile>`：Unit-01 Vanguard, Unit-02 Specialist, etc.）；
  - 全套 2D 原生战术折线图与柱状图组件展示。
- **Section 02: 3D SPATIAL & INDUSTRIAL COMPLEX (空间拓扑与鼠标悬浮互动)**
  - 突出 3D 空间交互：
    - 多张 `<TerraSpatialCard>` 空间悬浮物理卡片，随鼠标指针大幅度三维倾斜，内部组件多层 Z 轴悬浮；
    - 3D 空间环形仪表盘（`<TerraDonutChart>`）与遥测总线；
    - 山峦等高线（`<TerraContourLines>`）与 -20° 下沉式能量母线（`<TerraSegmentBar>`）。
- **Section 03: UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB**
  - 左栏：2D 平面组件矩阵（按钮、标签、灯标、条码、输入框、折线图）；
  - 右栏：3D 空间组件矩阵（悬浮物理卡片、环形图、垂直标尺滑块、悬浮标签页、角括号 HUD、下沉能量槽）；
  - 底部：精密垂直标尺控制视口与参数。

---

## ⚡ 4. 性能与质量指标
- 零第三方图表依赖，纯原生 Svelte 5 SVG 实现。
- `npm run build` < 400ms，0 错误，0 警告。
- 鼠标 3D 交互使用 `requestAnimationFrame` 或直接 CSS 变量驱动，稳固 120 FPS。
- 完整包含 Bot 协同作者提交标识。
