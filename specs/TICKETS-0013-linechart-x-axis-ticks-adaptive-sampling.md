# TICKETS-0013: TerraLineChart X 轴刻度自适应采样与首尾截断防溢出原子工单

## TICKET-01: <TerraLineChart.svelte> 自适应刻度抽样与首尾锚点对齐
- **关联文件**：`src/components/TerraLineChart.svelte`
- **执行内容**：
  1. 在 `<script lang="ts">` 中构建响应式派生 `xTicks`：
     - 基于像素间距阈值（`minGap = 75`）进行智能步长过滤；
     - 自动标定锚点：首点为 `'start'`，末点为 `'end'`，中间点为 `'middle'`；
     - 包含小样本（0~2 点）的边界安全保护；
  2. 重构 SVG 中 X 轴网格线与时间戳渲染模板：
     - 遍历 `xTicks` 而非原始 `points`；
     - 使用计算出的 `anchor` 设置 `text-anchor={tick.anchor}`；
     - 使用 SVG 原生 Presentation 属性 `fill="var(--terra-text-secondary, #94a3b8)"`、`font-family`、`font-size`；
  3. 加固 Y 轴刻度文本：
     - 将 Tailwind `class="... fill-[var(--terra-text-muted)] ..."` 改用原生 `fill="var(--terra-text-secondary, #94a3b8)"`。
- **验收标准 (DoD)**：
  - 末尾时间戳完整展示（包含秒数），不被右侧边界截断；
  - 数据点密集时自动稀疏抽样，绝无文字重叠堆积；
  - `npm run check` 0 错误 0 警告。

---

## TICKET-02: 边界用例覆盖与生产构建验证
- **关联文件**：`src/App.svelte`
- **执行内容**：
  1. 在 `src/App.svelte` 中验证正常 7 点数据集以及稀疏数据集；
  2. 运行 `npm run check` 与 `npm run build`，验证 0 errors, 0 warnings；
  3. 执行脱敏自检，合并 PR。
- **验收标准 (DoD)**：
  - 静态隐私检查通过；
  - 生产打包耗时 < 500ms。
