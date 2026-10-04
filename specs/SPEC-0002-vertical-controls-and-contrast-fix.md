# SPEC-0002: 修复垂直控制器 UI 重叠脱节与亮色模式短码对比度缺陷

- **创建日期**：2026-10-04
- **状态**：Draft -> In Review
- **特性分支**：`fix/vertical-controls-layout-and-light-mode-contrast`
- **关联组件**：`TerraVerticalSlider.svelte`, `TerraVerticalTabs.svelte`, `App.svelte`

---

## 🎯 一、 问题根因诊断 (Root Cause Analysis)

### 1. 垂直标尺控制器重叠与脱节 (Vertical Slider Collision)
- **根因**：
  在 `TerraVerticalSlider.svelte` 中，流体装饰耳翼（`.terra-fluid-fin-top` 与 `.terra-fluid-fin-bottom`）采用了固定的绝对定位与位移：
  `position: absolute; top: 0; transform: translateY(-98%); width: 1.5rem; height: 1.5rem;`
  但上方和下方的步进按键（`[+]` 与 `[-]`）仅有 `mb-1.5`（约 6px）的外边距。
  高达 24px 的装饰耳翼向上位移后，**直接物理重叠并遮盖了 `[+]` 和 `[-]` 按键**；同时耳翼使用固定绝对像素 `clip-path: path(...)`，与滑槽边框无缝隙衔接，导致视觉上严重脱节、杂乱交叉。
- **解法**：
  - 复刻 Atlos 原版架构：在有步进按键（`showButtons=true`）的标准桌面模式下，采用独立的战术按键外框（`buttonFrame`）与滑槽结构，杜绝耳翼重叠；
  - 仅在无按键的纯滑槽标尺场景下才挂载端部流体耳翼；
  - 优化滑块整体布局与间距，确保轨道、读数、按键在任何容器内绝对对齐且无形变。

### 2. 战区切换短码在亮色模式下对比度过低 (Light Mode Low Contrast)
- **根因**：
  在 `TerraVerticalTabs.svelte` 中，未选中项的短码标签样式为：
  `bg-black/40 text-[var(--terra-text-muted,#718096)]`。
  在亮色模式下，背景是浅灰底色（`#f4f6f8` 或 `#ffffff`），中灰文字在半透明黑底上对比度不足 2:1，导致 `VL-04`、`DJ-01` 等字样极度模糊难辨。
- **解法**：
  - 将未选中短码样式重构为语义化 Token：
    `bg-[var(--terra-bg-surface-active)] text-[var(--terra-text-primary)] border border-[var(--terra-border)]`；
  - 亮色模式下为白底深深灰/黑色文字（对比度 > 10:1 AAA 级）；
  - 暗色模式下为深轧钢底纯白文字（对比度 > 12:1 AAA 级）；
  - 选中状态保持终末地标志高反差：`bg-black text-[var(--terra-accent-primary)]`。

---

## 📐 二、 详细技术方案与规格定义

### 1. `TerraVerticalSlider.svelte` 结构升级
```svelte
<!-- 结构重构：清晰流式布局，零绝对重叠 -->
<div class="terra-vslider-root ...">
  {#if label || unit}
    <div class="terra-slider-readout">...</div>
  {/if}

  {#if showButtons}
    <button class="terra-slider-btn ...">+</button>
  {/if}

  <div class="terra-slider-track-box ...">
    {#if fluidDecorations && !showButtons}
      <div class="terra-fluid-fin terra-fluid-fin-top"></div>
    {/if}

    <div class="terra-slider-track ...">
      <!-- 刻度线与 100% GPU scaleY 填充条 -->
    </div>

    {#if fluidDecorations && !showButtons}
      <div class="terra-fluid-fin terra-fluid-fin-bottom"></div>
    {/if}
  </div>

  {#if showButtons}
    <button class="terra-slider-btn ...">-</button>
  {/if}
</div>
```

### 2. `TerraVerticalTabs.svelte` 短码高反差规范
```svelte
<!-- Sector Short Code Tag -->
{#if item.shortCode}
  <span
    class="px-1.5 py-0.5 text-[10px] font-bold tracking-wider rounded-xs transition-colors {
      isSelected
        ? 'bg-black text-[var(--terra-accent-primary)] shadow-xs'
        : 'bg-[var(--terra-bg-surface-active)] text-[var(--terra-text-primary)] border border-[var(--terra-border)]'
    }"
  >
    {item.shortCode}
  </span>
{/if}
```

### 3. `App.svelte` 第三板块卡片网格优化
- 优化 `PRECISION VERTICAL CONTROLS` 容器，设置充足的 `min-height`、`gap-6` 与居中对齐，杜绝元素拥挤挤压。
