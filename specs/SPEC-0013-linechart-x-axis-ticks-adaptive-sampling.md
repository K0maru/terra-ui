# SPEC-0013: TerraLineChart X 轴刻度自适应采样与首尾截断防溢出重构

## 1. 问题背景 (Problem Statement)

上游业务与实盘监控系统（如 `okx-funding-arbitrage` 资金费率与套利监控大盘）在接入 `<TerraLineChart />` 折线图时反馈了以下严重的 X 轴时间戳排印缺陷：
1. **抽样步长失效导致刻度严重堆叠**：
   - 现存采样逻辑为 `i % Math.max(1, Math.floor(points.length / 5)) === 0`；
   - 当初始阶段或短周期数据点较少（如 2~4 个点）时，`Math.floor(points.length / 5)` 恒等于 0，`Math.max(1, 0)` 结果为 1，导致所有数据点均触发刻度渲染；
   - 每一个点均渲染 8 位字符时间戳（`HH:mm:ss`），在 X 轴较小像素跨度内发生严重的文字横向挤压与重叠穿插；
2. **两端刻度被 SVG 视口硬生生截断**：
   - 所有刻度一律强制 `text-anchor="middle"`；
   - 末尾点位于 `width - padRight`（即 X=584），居中对齐导致后半截字符（如 `:33` 秒数）超出 `600px` 的 SVG viewBox，被外层 `overflow-hidden` 裁切成 `19:13`；首点同理可能向左溢出；
3. **文字属性对比度不稳**：
   - X 轴与 Y 轴刻度使用了不可靠的 Tailwind `fill-[var(--terra-text-muted)]` 语法，部分环境下回退为黑色，需加固为 SVG 标准 Presentation 属性。

---

## 2. 解决方案与算法设计 (Technical Solution)

### 2.1 像素级自适应间距抽样算法 (`xTicks`)
在 Svelte 5 Native Runes 中引入 `$derived.by` 驱动的自适应刻度提取器：
- **安全像素阈值**：设定单刻度最小视觉间隙 `minGap = 75`（像素）；
- **首尾保真**：
  - 始终保留首个点（`index === 0`），锚点设为 `text-anchor="start"`；
  - 始终保留末尾点（`index === points.length - 1`），锚点设为 `text-anchor="end"`（只要其与前序刻度的像素差不小于 `minGap * 0.6`）；
- **中间点动态步进筛选**：
  - 遍历中间点（`1 <= i < points.length - 1`）；
  - 仅当该点与上一个已选刻度的 X 轴距离 `>= minGap`，且距离最后一个数据点的 X 轴距离 `>= minGap` 时，才纳入刻度数组；
  - 中间点锚点设为 `text-anchor="middle"`；
- **小数据量退化保护**：
  - 若总数据量为 0，返回空数组；
  - 若总数据量为 1，直接在中心单点渲染（`text-anchor="middle"`）。

### 2.2 SVG Presentation 属性与对比度加固
- X 轴刻度文本：
  - `fill="var(--terra-text-secondary, #94a3b8)"`
  - `font-family="var(--terra-font-mono, monospace)"`
  - `font-size="8.5px"`
  - `letter-spacing="0.02em"`
- Y 轴刻度文本同步加固：
  - `fill="var(--terra-text-secondary, #94a3b8)"`
  - `font-family="var(--terra-font-mono, monospace)"`
  - `font-size="9px"`
  - `font-weight="600"`

---

## 3. 验收标准与测试矩阵 (Acceptance Criteria)

1. **零横向重叠**：无论传入 2 个点、5 个点还是 100 个点，X 轴各刻度文本之间均保持至少 15px 的清晰留白，绝不产生物理重叠；
2. **零边界裁切截断**：
   - 最后一个时间戳末尾与右侧边界对齐（`text-anchor="end"`），完整显示 `HH:mm:ss`，杜绝 `19:13` 截断；
   - 第一个时间戳向右延伸（`text-anchor="start"`），不超出左侧 `padLeft`；
3. **视觉高对比度**：在深色模式与浅色模式下，X/Y 轴刻度文字清晰可辨，对比度大于 7:1。
