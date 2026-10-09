# TICKETS-0022: 首屏视觉冲击力与核心 WebFonts 落地工单

## TICKET-01: 在 `index.html` 中引入核心 Google WebFonts
- [x] 更新 `index.html` 中的 `<link rel="stylesheet">`，引入：
  - `Chakra Petch:wght@400;500;600;700`
  - `Syne:wght@700;800`
  - `Barlow Condensed:wght@600;700;800`
  - `Noto Sans SC:wght@400;500;700;900`
  - `Oswald:wght@500;600;700`
  - `Fira Code:wght@400;600;700`
  - `Inter:wght@400;600;700;800`
  - `Share Tech Mono`

## TICKET-02: 在 `tokens.css` 中重构字体回退栈
- [x] 修改 `tokens.css` 中的 `cyan`、`amber`、`emerald` 三大主题字体栈：
  - `--terra-font-display`: 增加 `'Syne'`
  - `--terra-font-tactical`: 增加 `'Barlow Condensed'`
  - `--terra-font-telemetry`: 将 `'Chakra Petch'` 提至 `'Share Tech Mono'` 之前
  - `--terra-font-body`: 将 `'Noto Sans SC'` 提至前列

## TICKET-03: 重构 Section 01 (Hero & First Viewport)
- [x] 在 `src/App.svelte` Section 01 顶部构建 **战术遥测数据缎带 (Tactical Telemetry Ticker Ribbon)**，嵌入 `<TerraVernierMeter>` 与高密时钟/主频状态。
- [x] 升级 Hero 标题为 `font-display text-5xl sm:text-7xl font-extrabold uppercase tracking-tight`。
- [x] 在 Section 01 主控制台区域上方或并排嵌入 3 组 `<TerraTelemetryBox>`（Alpha-01 Turbine Efficiency, Beta-02 Industrial Bus Load, Gamma-03 Neural Latency），让用户一进入页面即产生强烈的机能视觉冲击。
- [x] 实施语义变暗与锚点高亮（`.terra-text-dim` 与 `.terra-text-anchor`）。

## TICKET-04: 构建验证与发布
- [x] 运行 `npm run check` 确保零错误。
- [x] 运行 `npm run build` 确保演示站构建成功。
- [x] 运行 `npm run package` 确保 npm 库构建成功。
- [x] 提交并合入 `dev` 分支，快进同步至 `main` 触发 GitHub Pages 自动部署。
