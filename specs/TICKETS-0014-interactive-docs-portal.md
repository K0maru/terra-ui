# TICKETS-0014: Terra-UI 原生内嵌交互文档系统原子工单清单

## TICKET-01: 创建文档基础组件 (<TerraCodePlayground.svelte> 与 <TerraPropsTable.svelte>)
- **关联文件**：
  - `src/docs/components/TerraPropsTable.svelte`
  - `src/docs/TerraCodePlayground.svelte`
- **执行内容**：
  1. `TerraPropsTable.svelte`：
     - 展示 `name`, `type`, `default`, `description` 表格；
     - 45° 战术切角边框，瑞士高对比等宽字体，支持暗色与浅色模式；
  2. `TerraCodePlayground.svelte`：
     - 上下结构或 Tab 结构：`[LIVE PREVIEW]` 预览区与 `[SOURCE CODE]` 代码区；
     - 右上角配备战术「COPY」按钮，点击带触感微震与 1.5s「COPIED!」文本反馈；
     - 预览区具备背景 CAD 点阵或微网格，自适应主题变化。
- **验收标准 (DoD)**：
  - 复制按钮可将代码内容写入剪贴板；
  - 预览区完全正确渲染子组件（`Snippet`），可自由点击交互。

---

## TICKET-02: 构建结构化文档源与目录定义 (`src/docs/docsData.ts`)
- **关联文件**：`src/docs/docsData.ts`
- **执行内容**：
  1. 定义 `DocCategory` 与 `DocPage` 接口；
  2. 搭建 6 大分类：`GETTING STARTED`, `3D SPATIAL`, `TELEMETRY CHARTS`, `CONTROLS & HUD`, `ATOMIC PRIMITIVES`, `LEGAL`；
  3. 为核心组件（如 `line-chart`, `spatial-card`, `segment-bar`, `button`, `vertical-slider`, `donut-chart`）提供完整的 Props 参数表、说明文案与官方 Svelte 5 代码示例。
- **验收标准 (DoD)**：
  - 数据类型安全，包含完整参数定义。

---

## TICKET-03: 打造 GitBook 风格文档主框架 (<TerraDocsView.svelte>)
- **关联文件**：`src/docs/TerraDocsView.svelte`
- **执行内容**：
  1. 左侧可收折导航树（响应式移动端支持与桌面端 260px 宽度）；
  2. 支持检索过滤（Search / Filter components）；
  3. 右侧主工作区：
     - 面包屑导航与页面大标题；
     - 架构与特性标签；
     - `<TerraCodePlayground>` 交互试玩台；
     - `<TerraPropsTable>` 参数表；
     - 底部 `[← 上一篇]` / `[下一篇 →]` 线性导航器。
- **验收标准 (DoD)**：
  - 切换不同组件页面时瞬间切换，无闪烁；
  - 页面滚动位置自动复位到顶部。

---

## TICKET-04: 主入口与顶栏集成 (`src/App.svelte`)
- **关联文件**：`src/App.svelte`
- **执行内容**：
  1. 在顶栏导航区添加 `[DEMO // 展台]` 与 `[DOCS // 文档]` 切换开关；
  2. 联动 URL hash：访问 `#/docs` 自动切换到文档模式；
  3. 保留语言切换、主题切换与暗色模式对文档全局生效。
- **验收标准 (DoD)**：
  - `npm run check` 0 警告 0 错误；
  - `npm run build` < 500ms 通过。
