# TICKETS-0012: TerraLineChart Tooltip 缺陷修复原子工单清单

## TICKET-01: <TerraLineChart.svelte> Tooltip 几何重构与原生属性修复
- **关联文件**：`src/components/TerraLineChart.svelte`
- **执行内容**：
  1. 在 `Props` 接口中追加 `unit?: string`（默认 `'VAL'`）；
  2. 提取 Tooltip 尺寸常量：`tooltipWidth = 140`，`tooltipHeight = 38`；
  3. 重构 Tooltip 位置计算公式：
     - 水平边界夹持：`Math.min(Math.max(activePoint.x - tooltipWidth / 2, padLeft), width - padRight - tooltipWidth)`；
     - 垂直防顶遮挡翻转：`activePoint.y - tooltipHeight - 10 < padTop ? activePoint.y + 12 : activePoint.y - tooltipHeight - 10`；
  4. 修复文字颜色 Presentation 属性：
     - 使用 `fill="var(--terra-text-secondary, #94a3b8)"` 与 `fill="var(--terra-text-primary, #ffffff)"`；
     - 替换不可靠的 Tailwind `fill-[...]` 语法；
  5. 战术 HUD 视觉升级：
     - 在 `<defs>` 增加 `<feDropShadow>` 滤镜；
     - 增加左侧 `width="3"` 高亮主题色指示条；
     - 增加右上角装饰切角微标；
- **验收标准 (DoD)**：
  - 文本 `18:57:56 // NODE-10` 完整展示在 Tooltip 内部，左右边距保留至少 8px 安全间隙；
  - 深色模式与浅色模式下文字均清晰可见，对比度大于 10:1；
  - 靠近图表顶端悬浮时，Tooltip 自动翻转至下方，绝不破顶截断。

---

## TICKET-02: 演示大盘用例验证与生产构建校验
- **关联文件**：`src/App.svelte`
- **执行内容**：
  1. 在 `src/App.svelte` 中为 `TerraLineChart` 提供高频长文本时间戳测试样本（如 `'18:57:56'`）；
  2. 运行 `npm run check` 与 `npm run build`，确保 0 警告、0 错误；
  3. 执行脱敏自检与 Bot 署名提交。
- **验收标准 (DoD)**：
  - 构建耗时小于 500ms，全类型检查 0 errors 0 warnings；
  - `git grep -inE "(foxmail|qq\.com|/Users/)"` 验证 0 隐私泄露。
