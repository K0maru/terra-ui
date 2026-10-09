# SPEC-0022: 首屏视觉冲击力与核心 WebFonts 落地 (Hero Visual Shock & WebFonts Loading)

## 1. 背景与问题定义 (Context & Problem)
在 SPEC-0021 中，我们完成了 5 级排印矩阵定义与 `<TerraTelemetryBox>`、`<TerraVernierMeter>` 两个组件的研发与 npm 包构建。但在实机运行中，用户反馈“怎么没感觉有什么变化”。

经深度排查，存在以下三大根本症结：
1. **字体缺失导致静默降级**：`tokens.css` 中指向 `'Bender'` 与 `'Novecento Sans Wide'`，但系统未预装该字体，且 `index.html` 未载入 Google Fonts 对应的平替字体（`Chakra Petch` 与 `Syne`）。浏览器降级为 Arial / 默认 monospace，导致最具标志性的 45° 倒角机械数字（Bender 基因）完全消失。
2. **首屏未暴露高密战术遥测组件**：新组件被放置于 Section 02，首屏（Section 01）维持旧版静态布局，初次进入页面无法形成视觉冲击。
3. **首屏缺乏层次对比**：缺乏终末地/明日方舟特有的高密状态数据缎带（Telemetry Ticker Ribbon）、1.414 字阶标题冲击力以及 35% 语义变暗（Semantic Dimming）对比。

## 2. 核心架构设计 (Architecture Design)

### 2.1 WebFonts 引入方案
在 `index.html` 中通过 Google Fonts 加载以下高性能字体切片：
- **`Chakra Petch:wght@400;500;600;700`**：Bender 工业机械数字孪生体，带有 45° 斜切角。
- **`Syne:wght@700;800`**：Novecento Sans Wide 平替，极宽现代几何粗体，用于 Hero 标题。
- **`Barlow Condensed:wght@600;700`**：DIN 战术紧凑字。
- **`Noto Sans SC:wght@400;500;700;900`**：锐利中文无衬线体。
- 保留 `Fira Code`、`Inter`、`Oswald`、`Share Tech Mono`。

### 2.2 CSS 字体回退栈重构
在 `src/lib/styles/tokens.css` 中将 `Chakra Petch` 置于首位：
```css
--terra-font-display: 'Novecento Sans Wide', 'Druk Wide', 'Syne', 'Oswald', sans-serif;
--terra-font-tactical: 'Oswald', 'Barlow Condensed', 'DIN Condensed', 'Bebas Neue', sans-serif;
--terra-font-telemetry: 'Bender', 'Chakra Petch', 'Share Tech Mono', monospace;
--terra-font-body: 'DIN 1451', 'DIN Next', 'Noto Sans SC', 'Source Han Sans SC', 'Inter', sans-serif;
```

### 2.3 Section 01 首屏改造 (Hero Visual Shock)
1. **战术遥测数据缎带 (Tactical Telemetry Ticker Ribbon)**：
   在 Section 01 顶部全宽铺开：
   - 包含动态核心指标（`SYS_CLK: 120Hz`、`FPS: 60`、`LATENCY: 0.8ms`、`PROTOCOL: AIC.SPEC-0022`）。
   - 嵌入一条实时的 `<TerraVernierMeter>` 游标标尺，随系统主频/FPS 实时浮动。
2. **Hero 主标题与字阶强化**：
   - 应用 `font-display`（Syne 800）极宽超粗体，字号升级为 `text-5xl sm:text-7xl`，配合 1.414 字阶比率。
   - 附带明日方舟标志性的斜切编号徽章 `[ SEC_01 // SYS.OPS ]` 与警示斜纹装饰。
3. **首屏直接部署 `<TerraTelemetryBox>` 矩阵**：
   - 将原 Section 02 中的战术遥测仪表箱引入 Section 01，与控制台主网格形成并排联动（Turbine Efficiency、Industrial Bus Load、Neural Bus Latency）。
   - 用户打开页面即刻看到真实跳动的 Bender 倒角数字、游标卡尺与高密状态码。

## 3. 验收标准 (DoD)
1. 打开页面，数字字体显式呈现 45° 倒角机械风格（Chakra Petch）。
2. 首屏直接展现高密战术遥测缎带、大字阶机能标题与 3 组 `<TerraTelemetryBox>`。
3. 生产构建（`npm run check`、`npm run build`、`npm run package`）零错误、零警告。
