# TICKETS-0015 // 现代开发者与系统可观测性数据套件原子工单

- **关联规范**：`specs/SPEC-0015-observability-activity-suite.md`
- **特性分支**：`feat/observability-activity-suite`

---

### TICKET-01: 实现 <TerraSparkline.svelte> (微型行内走势图)
- [ ] 创建 `src/components/TerraSparkline.svelte`；
- [ ] 支持纯原生 SVG 平滑贝塞尔曲线或折线绘制；
- [ ] 支持渐变半透明填充（`<linearGradient>`）；
- [ ] 末端点支持动态呼吸闪烁脉冲点（Live Pulse Dot）；
- [ ] 支持 `variant`（accent / success / warning / danger）和自定义 `color`；
- [ ] 在 `src/components/index.ts` 中导出；
- [ ] 验收标准：0 外部依赖，编译无警告，暗色/浅色模式自适应。

---

### TICKET-02: 实现 <TerraStatusStrip.svelte> (1D 服务可用率细条)
- [ ] 创建 `src/components/TerraStatusStrip.svelte`；
- [ ] 支持按天数（默认 60/90 天）排列紧凑状态细条；
- [ ] 支持 4 档状态（operational / degraded / outage / empty）；
- [ ] 顶部渲染服务名称、健康状态指示灯与周期总可用率统计；
- [ ] 底部渲染时间轴刻度（如 `90 DAYS AGO` 与 `TODAY`）；
- [ ] 实现高对比度战术悬浮提示框（显示日期、SLA 百分比与事件）；
- [ ] 在 `src/components/index.ts` 中导出；
- [ ] 验收标准：支持 `onbarclick`，支持浅色/暗色双模，无文字截断。

---

### TICKET-03: 实现 <TerraActivityHeatmap.svelte> (2D 时序活动热力图)
- [ ] 创建 `src/components/TerraActivityHeatmap.svelte`；
- [ ] 纯原生 JS 日期运算：生成 52 周 × 7 天网格矩阵；
- [ ] 5 阶梯度单元格着色（Level 0 内陷底槽，Level 1~4 主题色透明度梯次，Level 4 高亮微辉光）；
- [ ] 顶部月份标尺（JAN~DEC）与左侧星期标尺（MON, WED, FRI）；
- [ ] 底部活动能级标度尺（LESS [0~4] MORE）与可选顶部统计总览；
- [ ] 战术 HUD 悬浮读数提示框（日期、频次、状态、元数据）；
- [ ] 在 `src/components/index.ts` 中导出 `<TerraActivityHeatmap>` 与别名 `<TerraHeatmap>`；
- [ ] 验收标准：0 外部依赖，移动鼠标流畅无卡顿，主题切换即时响应。

---

### TICKET-04: 文档中心 Playground 与实机站台集成
- [ ] 在 `src/docs/docsData.ts` 中注册这 3 个组件的 API Props、核心特性与交互代码示例；
- [ ] 在 `src/App.svelte` 实机站台展示区中集成这 3 个新组件：
  - 展示 `<TerraStatusStrip />` 作为集群实时可用性监控；
  - 展示 `<TerraActivityHeatmap />` 作为全年中枢调度与提交热力；
  - 在性能指标卡中嵌入 `<TerraSparkline />`；
- [ ] 运行 `npm run check && npm run build` 确保 **0 errors, 0 warnings**。

---

### TICKET-05: 验证、代码审查与 PR 提交
- [ ] 运行脱敏检查 `git diff | grep -inE "(foxmail|qq\.com|/Users/)"`；
- [ ] 动态读取 `git config --get agent.coauthor` 获取协同作者标识；
- [ ] 提交代码并推送分支 `feat/observability-activity-suite`；
- [ ] 使用 `gh pr create` 创建合并至 `dev` 的 PR（标题包含 `[AI-Agent]`）；
- [ ] 等待用户验收与审查。
