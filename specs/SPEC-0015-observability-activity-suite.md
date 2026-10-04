# SPEC-0015 // 现代开发者与系统可观测性数据套件 (Developer & Observability Suite)

- **状态**：APPROVED
- **特性分支**：`feat/observability-activity-suite`
- **主要目标**：为 Terra-UI 新增 3 个高频、硬核的时序与可观测性图表组件：
  1. `<TerraActivityHeatmap />`：2D 时序活动矩阵热力图（GitHub 贡献图同款工业机能版）
  2. `<TerraStatusStrip />`：1D 服务可用率与 SLA 健康度状态条（GitHub / Cloudflare Status 同款）
  3. `<TerraSparkline />`：微型行内无轴波形走势图（Mini Trend Waveform）

---

## 1. 架构原则与非功能约束 (Non-Negotiable Constraints)

1. **Zero-Dependency & Zero-VDOM**：
   - 100% 原生 Svelte 5 Runes（`$state`, `$derived`, `$props`）；
   - 100% 原生 SVG 矢量渲染，严禁引入 D3、ECharts、dayjs、moment 等任何第三方重型依赖；
   - 内置无依赖的纯原生日期时间序列运算（Date Math）。
2. **GPU 硬件合成加速**：
   - 悬浮发光、脉冲点闪烁、状态条 Hover 放大均限定在 `transform`、`opacity` 与 `filter: drop-shadow`；
   - 严禁 JS 主线程逐帧计算样式。
3. **Design Tokens 纯正自适应**：
   - 严格响应 `--terra-accent-primary`、`--terra-bg-surface`、`--terra-border`；
   - 在 Dark / Light 双模及三大色彩谱系（CYAN / AMBER / EMERALD）下 0ms 实时自适应变色。
4. **高对比度战术悬浮提示框 (Tactical Tooltip Pin Box)**：
   - 采用标准原生 SVG 属性与高对比度文字样式，杜绝颜色融底或溢出裁切缺陷。

---

## 2. 组件详细规格

### 2.1 <TerraActivityHeatmap /> (2D 时序活动热力图)
- **文件路径**：`src/components/TerraActivityHeatmap.svelte`
- **别名**：`src/components/index.ts` 中同时导出 `<TerraActivityHeatmap>` 与 `<TerraHeatmap>`。
- **视觉架构**：
  - 顶部月份刻度（`JAN` 到 `DEC`），左侧星期刻度（`MON`, `WED`, `FRI`）；
  - 7 行 × ~53 列单元格（`rect`），默认尺寸 11px，间距 3px；
  - 5 阶能级梯度：
    - `Level 0`：深色底座内陷插槽（`bg-white/5` 搭配微妙边框）
    - `Level 1`：25% 主题色透明度
    - `Level 2`：50% 主题色透明度
    - `Level 3`：75% 主题色透明度
    - `Level 4`：100% 饱和高亮，附带微辉光
  - 底部右侧活动标尺：`LESS [ 0 | 1 | 2 | 3 | 4 ] MORE`；
  - 可选顶部概览栏：`TOTAL ACTIVITIES`、`STREAK DAYS`、`PEAK COUNT`；
  - 战术 HUD 悬浮读数提示框，跟随鼠标吸附显示日期与频次。
- **Props API**：
  ```typescript
  export interface ActivityRecord {
    date: string // 'YYYY-MM-DD'
    count: number
    label?: string
    meta?: Record<string, any>
  }

  export interface HeatmapProps {
    data?: ActivityRecord[]
    startDate?: string | Date
    endDate?: string | Date
    cellSize?: number
    cellGap?: number
    cut?: 'none' | 'tr' | 'tl-br'
    showMonthLabels?: boolean
    showWeekdayLabels?: boolean
    showLegend?: boolean
    showOverview?: boolean
    oncellclick?: (cell: { date: string; count: number; level: number }) => void
    class?: string
  }
  ```

---

### 2.2 <TerraStatusStrip /> (1D 服务可用率细条)
- **文件路径**：`src/components/TerraStatusStrip.svelte`
- **视觉架构**：
  - 水平排列的一排紧凑状态微条（默认 60 根或 90 根，代表近 60/90 天）；
  - 4 种健康等级：
    - `operational`（正常 100%，系统主题色或 `#00f076`）
    - `degraded`（性能降级/偶发延迟，警告琥珀 `#f59e0b`）
    - `outage`（中断宕机，危险高亮 `#ef4444`）
    - `empty`（无数据采集，透明金属底座）
  - 顶部信息栏：服务名称、当前健康 Beacon 标签、计算得出的周期总可用率（如 `99.98% UPTIME`）；
  - 底部标尺：左侧 `90 DAYS AGO`，中央标线，右侧 `TODAY`；
  - 悬浮探针框：显示具体日期、SLA 百分比与事件描述。
- **Props API**：
  ```typescript
  export interface StatusDayRecord {
    date: string // 'YYYY-MM-DD'
    status: 'operational' | 'degraded' | 'outage' | 'empty'
    uptime?: number // 0 ~ 100
    description?: string
  }

  export interface StatusStripProps {
    data?: StatusDayRecord[]
    serviceName?: string
    days?: number // 默认 60 或 90
    barWidth?: number // 默认 4
    barHeight?: number // 默认 28
    gap?: number // 默认 3
    showSummary?: boolean
    showTimelineLabels?: boolean
    onbarclick?: (day: StatusDayRecord) => void
    class?: string
  }
  ```

---

### 2.3 <TerraSparkline /> (微型行内无轴走势图)
- **文件路径**：`src/components/TerraSparkline.svelte`
- **视觉架构**：
  - 紧凑型无轴 SVG 矢量波形，适合嵌入指标卡片、表格行与头部微读数；
  - 贝塞尔平滑波形或硬朗 CAD 折线，平滑渐变透明填充；
  - 末端动态呼吸高光点（Live Pulse Dot），表示实时活跃采集；
  - 支持变体：`accent`（当前主题色）、`success`（绿色）、`warning`（琥珀）、`danger`（红色）。
- **Props API**：
  ```typescript
  export interface SparklineProps {
    data: number[]
    width?: number | string // 默认 '100%' 或 120
    height?: number // 默认 32
    color?: string
    variant?: 'accent' | 'success' | 'warning' | 'danger'
    fill?: boolean // 默认 true (带渐变底衬)
    smooth?: boolean // 默认 true (贝塞尔曲线 vs CAD折线)
    showPulse?: boolean // 默认 true (末端呼吸点)
    class?: string
  }
  ```

---

## 3. 页面与文档中心集成规划

1. **导出清单 (`src/components/index.ts`)**：
   - 导出 `TerraActivityHeatmap`, `TerraHeatmap`, `TerraStatusStrip`, `TerraSparkline`；
2. **交互式文档中心 (`src/docs/docsData.ts`)**：
   - 在 `03 // TELEMETRY SVG CHARTS` 目录中新增：
     - `TerraActivityHeatmap` 交互式 Playground、Props 表与文档；
     - `TerraStatusStrip` 交互式 Playground、Props 表与文档；
     - `TerraSparkline` 交互式 Playground、Props 表与文档；
3. **双轴实机站台集成 (`src/App.svelte`)**：
   - 在 Section 01 瑞士平面控制台中挂载 `<TerraStatusStrip />` 作为集群健康监视器；
   - 在 Section 01 开发者卡片旁或指标区域挂载 `<TerraActivityHeatmap />` 展现全年中枢提交与调度热力；
   - 在 KPI / RollingNumber 旁嵌入 `<TerraSparkline />`。
