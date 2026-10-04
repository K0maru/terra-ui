# TICKETS-0008 // 饼图光晕隐形切割缺陷修复工单

## 📋 工单概览

- 关联规格：[SPEC-0008](./SPEC-0008-donut-glow-clipping-fix.md)
- 目标分支：`fix/donut-chart-glow-clipping` -> 合并到 `dev`

---

### 🎫 TICKET-01: 优化 `<TerraDonutChart.svelte>` 几何内边距与无损溢出
- **目标文件**：
  - `src/components/TerraDonutChart.svelte`
- **实现要求**：
  1. 引入动态发光安全内边距 `haloPadding = Math.max(16, thickness * 0.75)`；
  2. 修正圆环半径公式：`radius = (size - thickness - haloPadding * 2) / 2`，消除贴边与越界；
  3. 为两个 `<svg>` 元素均配置 `class="... overflow-visible"` 与 `style="overflow: visible;"`；
  4. 外围极坐标 HUD 虚线与刻度十字丝精准对齐 `center - 4`；
  5. 优化发光滤镜：`drop-shadow(0 0 10px ${seg.color})`，使其在激活时展现柔和完整的同心光晕。
- **验收标准 (DoD)**：
  - 悬浮激活任一扇区，发光完整圆润扩散，上下左右绝无被画布直边切平的痕迹。

---

### 🎫 TICKET-02: 联动验证与细节打磨 (`src/App.svelte`)
- **目标文件**：
  - `src/App.svelte`
- **实现要求**：
  1. 检查 Section 02 中的 `<TerraDonutChart>`，调整 `size={220}` 或 `thickness={22}`，保持空间比例匀称；
  2. 确保在 3D 空间倾斜与光标移动时，光晕与卡片内层 Z 轴深度完美融合，无层叠穿模。
- **验收标准 (DoD)**：
  - 在暗色与亮色模式下测试所有扇区的悬浮效果均表现优异。

---

### 🎫 TICKET-03: 生产构建验证、规范提交与 Bot PR 合并
- **目标**：
  1. 执行 `npm run build`，确保 0 errors, 0 warnings，构建时间 < 400ms。
  2. 读取 `git config --get agent.coauthor`，以标准 Bot 规范提交代码至 `fix/donut-chart-glow-clipping`。
  3. 推送到远程分支，通过 `gh pr create` 发起包含 `[AI-Agent]` 标识的 PR 并合并到 `dev`。
- **验收标准 (DoD)**：
  - 成功合并 PR 到 `dev` 分支，本地及远端同步。
