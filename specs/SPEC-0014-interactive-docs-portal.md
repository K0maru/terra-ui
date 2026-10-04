# SPEC-0014: Terra-UI 原生内嵌 GitBook 风格交互式文档系统 (Interactive Docs Portal)

## 1. 目标与设计原则 (Objectives & Principles)

为 `terra-ui` 构建兼具 **GitBook 结构化长文教程体验** 与 **Svelte 5 组件实时试玩/代码演练 (Live Preview & Code Playpen)** 的原生内嵌文档系统：
1. **零多余框架负担**：基于现有的 Vite + Svelte 5 + Tailwind 原生编译，不引入笨重的 Storybook 或 Astro，构建耗时保持在 < 500ms；
2. **视口无缝切换**：顶栏提供 `[DEMO // 展台]` 与 `[DOCS // 文档]` 瞬态模式切换，支持 URL Hash（`#/docs` 与 `#/docs/:componentId`）直接书签导航；
3. **真实可交互演练场 (`<TerraCodePlayground />`)**：
   - 实时挂载真实 Svelte 5 组件，完全支持鼠标物理悬停、动态换肤、光标倾角感知与实时数据更新；
   - 附带对应组件的高保真 Svelte 5 示例代码，配备「一键复制 (Copy Code)」；
   - 附带实时参数调谐器（Props Tuner），动态调节参数并双向联动预览与代码；
4. **完整 API 规约与多语言**：
   - 全面收录 21 项组件的 Props、Events、Snippets 参数表；
   - 继承 `en`（默认）与 `zh` 双语切换。

---

## 2. 系统拓扑与目录架构

```text
src/
├── docs/                                # 👈 文档系统模块
│   ├── TerraDocsView.svelte             # 文档工作台顶层 Shell (左侧树 + 顶栏 + 右侧主区)
│   ├── TerraCodePlayground.svelte       # 核心：实时组件预览 + 示例代码 + 一键复制 + 调参器
│   ├── docsData.ts                      # 结构化文档数据源 (章节树、组件元数据、API 表格、示例代码)
│   └── components/                      # 文档专用子组件 (如 PropsTable, NavLinks)
│       └── TerraPropsTable.svelte       # 参数规格展示表格
```

---

## 3. 核心图元规格说明

### 3.1 导航与模式切换 (`App.svelte`)
- 顶栏控件区新增模式开关：
  - `viewMode = 'demo' | 'docs'`；
  - 监听 `hashchange` 事件，支持从外部链接或文档目录直接锚定 `#/docs/line-chart`；
- 进入 `docs` 模式时，挂载 `<TerraDocsView />`。

### 3.2 交互演练场 (`<TerraCodePlayground.svelte>`)
- **Props**:
  - `title?: string`
  - `description?: string`
  - `code: string` (Svelte 5 示例代码)
  - `children: Snippet` (实时挂载的目标组件)
- **功能特性**：
  - 顶部 Tab：`[LIVE PREVIEW]` 预览视口与 `[SOURCE CODE]` 代码视口；
  - 复制反馈：点击「COPY」后 1.5s 提示「COPIED!」；
  - 战术外观：CAD 微网格背景底板、45° 几何包角、暗色/浅色自适应。

### 3.3 文档目录树拓扑 (`docsData.ts`)
1. **01 // GETTING STARTED**：
   - `overview` (架构理念与双轴体系)
   - `installation` (安装引入与 Tailwind / Svelte 5 依赖)
   - `tokens` (色彩空间与 Design Tokens)
2. **02 // 3D SPATIAL & INDUSTRIAL**：
   - `spatial-card` (`<TerraSpatialCard />`)
   - `segment-bar` (`<TerraSegmentBar />`)
   - `contour-lines` (`<TerraContourLines />`)
3. **03 // TELEMETRY SVG CHARTS**：
   - `line-chart` (`<TerraLineChart />`)
   - `donut-chart` (`<TerraDonutChart />`)
   - `bar-chart` (`<TerraBarChart />`)
4. **04 // CONTROLS & HUD**：
   - `vertical-slider` (`<TerraVerticalSlider />`)
   - `vertical-tabs` (`<TerraVerticalTabs />`)
   - `corner-brackets` (`<TerraCornerBrackets />`)
   - `cad-pattern` (`<TerraCadPattern />`)
5. **05 // ATOMIC PRIMITIVES**：
   - `buttons` (`<TerraButton />`)
   - `panels` (`<TerraPanel />`)
   - `badges` (`<TerraBadge />`, `<TerraStatusBeacon />`)
   - `rolling-number` (`<TerraRollingNumber />`)
   - `inputs` (`<TerraInput />`, `<TerraBarcode />`)
   - `profiles` (`<TerraProfileCard />`, `<TerraTacticalProfile />`)
   - `boot` (`<TerraInitialBootScreen />`, `<TerraCurtainTransition />`)
6. **06 // LEGAL & ATTRIBUTION**：
   - `legal` (知识产权界限与鹰角网络致谢)

---

## 4. 阶段性研发计划 (Sub-Features)

1. **Phase 1: `feat/docs-shell-and-playground`**
   - 落地 `TerraCodePlayground.svelte`、`TerraPropsTable.svelte`；
   - 落地 `docsData.ts` 核心数据结构与首批核心组件规格；
   - 落地 `TerraDocsView.svelte` GitBook 风格三栏/两栏机能框架；
   - 在 `App.svelte` 顶栏接入 `[DEMO | DOCS]` 双向无缝切换；
2. **Phase 2: `feat/docs-full-component-catalog`**
   - 补全全部 21 项组件的详细中英参数、交互演练用例与最佳实践指南；
3. **Phase 3: 整体集成与主干归档**
   - 验证生产打包与零警告；
   - 发起从 `docs/interactive-gitbook-system` 到 `dev` 的 PR 供主创审核。
