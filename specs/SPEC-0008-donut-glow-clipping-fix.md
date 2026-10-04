# SPEC-0008 // 饼图光晕隐形切割缺陷修复 (Fix Donut Chart Glow Halo Clipping)

## 📌 1. 缺陷根因定位 (Root Cause Analysis)

用户反馈：
> “我们的饼状图那里，光晕被背景隐形切割了一部分感觉很奇怪，不是圆的了”

经源码深入排查，发现根本原因来自两个方面：

1. **几何无内边距导致的物理边界溢出 (Zero-Margin Geometry)**：
   在 `src/components/TerraDonutChart.svelte` 中，圆环半径计算公式为：
   ```ts
   const radius = (size - thickness) / 2
   ```
   这意味着圆环外轮廓半径为：
   ```ts
   radius + thickness / 2 = size / 2 = center
   ```
   **圆环的外轮廓在无悬浮状态下就已经 100% 紧贴 SVG `viewBox="0 0 {size} {size}"` 的四条物理边缘（0 像素间隙）！**
   当鼠标悬浮特定扇区触发微凸效果（`stroke-width = thickness + 4`）时，线条宽度向外扩展 2px，**物理线条本身就已经越界**。

2. **SVG 默认溢出裁剪机制 (SVG Default Overflow Clipping)**：
   浏览器默认对 `<svg>` 元素应用 `overflow: hidden;`（或 `overflow: clip;`）。
   当扇区激活施加 `filter: drop-shadow(0 0 8px ${seg.color})` 发光效果时，8px~16px 的径向光晕在到达 SVG 画布边缘（上下左右 4 条直线）处被强行切平，导致原本圆润的发光光晕被“隐形切割成方形边缘”，破坏了完整圆形感。

---

## 🛠️ 2. 修复方案设计

### 2.1 引入独立光晕缓冲安全间隙 (Halo Safety Padding)
在圆环与外层 HUD 仪表框之间引入合理的几何安全间隙：
```ts
// 预留 16px~20px 的发光安全内边距，确保放大与发光绝不触碰边缘
const haloPadding = $derived(Math.max(16, thickness * 0.75))
const center = $derived(size / 2)
// 圆环中心线半径：留出 haloPadding
const radius = $derived((size - thickness - haloPadding * 2) / 2)
const circumference = $derived(2 * Math.PI * radius)
// 外围 HUD 虚线指示圈：优雅包裹圆环，间距约为 6px~8px
const outerReticleRadius = $derived(center - 4)
```

以默认尺寸 `size = 210, thickness = 24` 为例：
- `haloPadding = 18px`
- 圆环中心线 `radius = 75px`
- 圆环激活时外边缘 `radius + 14px = 89px`
- 距画布边缘 `105 - 89 = 16px`
- 留出 16px 的完整安全缓冲区域供 `drop-shadow` 柔和渐晕扩散，光晕在到达画布边缘之前已自然衰减。

### 2.2 SVG 显式声明 `overflow: visible`
在所有 SVG 节点上显式追加：
```svelte
<svg
  class="w-full h-full transform -rotate-90 overflow-visible"
  style="overflow: visible;"
  viewBox="0 0 {size} {size}"
>
```
确保无论在任何分辨率、缩放或浮点数计算下，SVG 渲染引擎均不会裁剪向外扩散的发光滤镜。

### 2.3 视觉协调优化
- 调整中心文字面板的最大宽度与内边距，使数值在内径舒适居中；
- 优化外围 HUD 十字丝与刻度线，使其以 `outerReticleRadius` 为基准精准同心对齐。

---

## ⚡ 3. 验收标准 (DoD)
1. 鼠标悬浮在饼图/环形图的任意扇区时，高亮发光光晕（Glow Halo）完整圆润扩散，绝无任何直线型截断或隐形刀切感。
2. 整个图表在浅色与深色模式下均保持同心圆秩序与美感。
3. `npm run check` 0 错误 0 警告，生产构建正常。
