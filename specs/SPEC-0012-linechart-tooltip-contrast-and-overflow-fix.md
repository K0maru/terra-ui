# SPEC-0012: TerraLineChart Tooltip 溢出截断与深色模式对比度缺陷修复

## 1. 背景与缺陷分析 (Problem Statement)

上游业务与实盘监控系统（如 `okx-funding-arbitrage` 资金费率与套利大盘）在集成 `<TerraLineChart />` 呈现高频遥测波形时反馈了以下缺陷：
1. **时间戳与节点标签文字溢出截断**：
   - 现存 Tooltip 外框固定为 `width="90"`、`height="32"`；
   - 当上游传入真实时间戳（如 `18:57:56 // NODE-10`）时，字符长度达到 20+，宽度超出 90px，导致文字溢出框体或与图表右侧硬切；
2. **SVG Text 颜色解析异常与背景融为一体**：
   - 现存代码在 `<text>` 上使用 Tailwind 实用类 `class="fill-[var(--terra-text-muted)]"` 与 `fill-[var(--terra-text-primary)]`；
   - 在部分浏览器与 SVG 渲染环境下，CSS 实用类未按预期覆盖 SVG 内部 presentation 属性，导致 `<text>` 默认回退到浏览器的黑色（`#000000`）；
   - 在深色模式下，暗黑底色（`--terra-bg-surface: #11141c`）上叠加黑色文字几乎完全隐形，导致用户无法辨识数值；
3. **字号与比例粗糙**：
   - 缺少 PRTS 硬核战术 HUD 的层级修饰（无战术指示微标、缺少阴影层滤镜、字号与内边距拥挤）。

---

## 2. 架构设计与解决方案 (Technical Solution)

### 2.1 尺寸拓展与动态防遮挡边界计算
- **Tooltip 规格升级**：
  - 宽度从 `90px` 拓宽至 `140px`，高度从 `32px` 调整至 `38px`；
  - 充裕容纳 `HH:mm:ss // LABEL` 以及高精度数值（如 `-0.0245%` 或 `1280.5 VAL`）；
- **动态坐标反转与边界夹持**：
  - `boxX`：`Math.min(Math.max(activePoint.x - tooltipWidth / 2, padLeft), width - padRight - tooltipWidth)`，确保不超出画布左右边界；
  - `boxY`：当数据点靠近图表顶部（`activePoint.y - tooltipHeight - 10 < padTop`）时，自适应翻转至数据点下方（`activePoint.y + 12`），否则默认居于上方（`activePoint.y - tooltipHeight - 10`），彻底杜绝 Tooltip 顶框溢出或遮挡准星。

### 2.2 SVG 原生属性注入与 100% 对比度保证
- 彻底摒弃不可靠的 Tailwind `fill-[...]` 语法，直接采用 SVG 标准 Presentation Attributes：
  - 标题行：`fill="var(--terra-text-secondary, #94a3b8)"`，字号 `8.5px`，字母间距 `0.05em`；
  - 数值行：`fill="var(--terra-text-primary, #ffffff)"`，字号 `12px`，加粗 `700`；
  - 单位标签：`fill="var(--terra-accent-primary, #00d8ff)"`，字号 `8px`；
- 在 `<defs>` 中注入原生 `<feDropShadow>` 滤镜，为 Tooltip 提供沉浸式物理投影。

### 2.3 PRTS 战术 HUD 视觉重塑
- 左侧边框嵌入 `width="3"` 的高亮主题色竖条指示器（`var(--terra-accent-primary)`）；
- 右上角追加 45° 几何微切角或装饰标尺线；
- 新增 `unit?: string` Prop（默认为 `'VAL'`），支持上游自定义单位（如 `USDT`、`%`、`ms`、`bps`）。

---

## 3. API 变更与向后兼容性

```ts
interface Props {
  data: DataPoint[]
  height?: number
  color?: string
  fillOpacity?: number
  showGrid?: boolean
  showCrosshair?: boolean
  animated?: boolean
  unit?: string // [新增] 自定义数值单位，默认 'VAL'
  class?: string
}
```

向后完全兼容，无任何破坏性变动（Zero Breaking Changes）。
