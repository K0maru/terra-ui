import type { PropItem } from './components/TerraPropsTable.svelte'

export interface DocPage {
  id: string
  title: string
  titleZh: string
  tag: string
  category: string
  description: string
  descriptionZh: string
  componentName?: string
  codeSnippet?: string
  props?: PropItem[]
  features?: string[]
  notes?: string
}

export interface DocCategory {
  id: string
  title: string
  titleZh: string
  items: DocPage[]
}

export const docCategories: DocCategory[] = [
  {
    id: 'getting-started',
    title: '01 // GETTING STARTED',
    titleZh: '01 // 快速入门与架构',
    items: [
      {
        id: 'overview',
        title: 'System Architecture',
        titleZh: '系统架构与双轴机能哲学',
        tag: 'ARCHITECTURE // CORE',
        category: 'getting-started',
        description: 'Terra-UI is a high-performance Svelte 5 functional cybernetic design system built for telemetry dashboards and developer tools. It pioneers a dual-axis design philosophy: 2D Flat Graphic Primitives (Swiss Typographic Grid) and 3D Spatial Topology.',
        descriptionZh: 'Terra-UI 是专为系统遥测大盘、开发者中枢与赛博机能控制台打造的 Svelte 5 高性能设计系统。首创双轴设计哲学：2D 纯平面图形图元（瑞士高密度排印网格）与 3D 空间交互拓扑。',
        features: [
          'Zero-VDOM: Pure native Svelte 5 reactive compile-time runes ($state, $derived, $props)',
          '100% GPU Hardware Accelerated Compositing (clip-path, transform, opacity)',
          'Dual-Axis IP Aesthetic: 2D Swiss Graphic Grid vs 3D Industrial Complex',
          'Zero External Dependencies: Native SVG Telemetry charts and physics calculations'
        ]
      },
      {
        id: 'installation',
        title: 'Installation & Setup',
        titleZh: '依赖安装与工程配置',
        tag: 'SETUP // GUIDE',
        category: 'getting-started',
        description: 'Set up Terra-UI in any Vite + Svelte 5 project with Tailwind CSS support.',
        descriptionZh: '在任何基于 Vite + Svelte 5 + Tailwind CSS 的前端工程中集成 Terra-UI。',
        codeSnippet: `// 1. Install dependencies
npm install svelte@latest tailwindcss @tailwindcss/vite

// 2. Import design tokens in your main entry (src/main.ts or app.css)
import '@terra-ui/styles/tokens.css'

// 3. Import and use any component in Svelte 5
<script lang="ts">
  import { TerraButton, TerraLineChart } from 'terra-ui'
</script>

<TerraButton variant="primary">LAUNCH CONSOLE</TerraButton>`
      },
      {
        id: 'tokens',
        title: 'Design Tokens & Themes',
        titleZh: 'Design Tokens 视觉变量',
        tag: 'THEMING // TOKENS',
        category: 'getting-started',
        description: 'Terra-UI provides 3 functional themes (Blueprint Cyan, Industrial Hazard Amber, Telemetry Emerald) across both Dark Mode and Light Mode, governed by CSS custom properties.',
        descriptionZh: 'Terra-UI 提供 3 大功能主题（工程蓝图青光、工业高压琥珀、系统遥测绿晶），全面支持深色与浅色双模切换，全量由 CSS 自定义属性驱动。',
        codeSnippet: `/* Toggle themes via data-theme and data-mode attributes */
<html data-theme="cyan" data-mode="dark">
  ...
</html>

/* Core variables defined in tokens.css */
--terra-bg-base: #090b0e;
--terra-bg-surface: #11141c;
--terra-accent-primary: #00d8ff;
--terra-border: rgba(255, 255, 255, 0.15);
--terra-font-mono: 'Fira Code', 'JetBrains Mono', monospace;`
      }
    ]
  },
  {
    id: 'spatial',
    title: '02 // 3D SPATIAL & INDUSTRIAL',
    titleZh: '02 // 3D 空间拓扑与工业母线',
    items: [
      {
        id: 'spatial-card',
        title: 'TerraSpatialCard',
        titleZh: '3D 物理悬浮卡片',
        tag: 'PHYSICS // 3D',
        componentName: 'TerraSpatialCard',
        category: 'spatial',
        description: 'Physical 3D interactive card that calculates multi-axis tilt and dynamic specular reflection sheen in response to cursor pointer position. Supports internal Z-depth parallax.',
        descriptionZh: '光标驱动的多轴 3D 透视物理卡片，动态跟踪光标倾角与镜面高光反射（Sheen），子元素支持 translateZ 真实空间视差浮空。',
        codeSnippet: `<script lang="ts">
  import { TerraSpatialCard, TerraBadge } from 'terra-ui'
</script>

<TerraSpatialCard maxRotation={16} perspective={1000} cut="tr-bl">
  <div class="space-y-3">
    <div class="flex justify-between items-center" style="transform: translateZ(25px);">
      <h3 class="font-bold text-white">SPATIAL SENSOR NODE</h3>
      <TerraBadge label="NOMINAL" variant="primary" />
    </div>
    <p class="text-xs text-slate-400" style="transform: translateZ(15px);">
      Multi-axis hardware compositor tilt tracking.
    </p>
  </div>
</TerraSpatialCard>`,
        props: [
          { name: 'cut', type: "'none' | 'tr' | 'tl-br' | 'tr-bl'", default: "'tr-bl'", description: '45° geometric chamfer corner cut style' },
          { name: 'maxRotation', type: 'number', default: '16', description: 'Maximum tilt angle in degrees along X and Y axes' },
          { name: 'perspective', type: 'number', default: '1000', description: 'CSS 3D perspective depth in pixels' },
          { name: 'sheen', type: 'boolean', default: 'true', description: 'Whether to render dynamic cursor-following specular sheen' },
          { name: 'class', type: 'string', default: "''", description: 'Additional CSS utility classes' }
        ]
      },
      {
        id: 'segment-bar',
        title: 'TerraSegmentBar',
        titleZh: '下沉式工业能量母线',
        tag: 'INDUSTRIAL // BUS',
        componentName: 'TerraSegmentBar',
        category: 'spatial',
        description: 'Industrial recessed energy rail chassis with -20° slanted segmented slots and real-time charging leading-edge spark pulse.',
        descriptionZh: '下沉式工业金属外槽能量母线，采用 -20° 平行斜切卡槽，充能末端带有实时高亮脉冲光波。',
        codeSnippet: `<script lang="ts">
  import { TerraSegmentBar } from 'terra-ui'
</script>

<TerraSegmentBar
  label="AIC_MAIN_GRID (自动化工业主干网负荷)"
  sublabel="⚡ 480V THREE-PHASE // LOAD 70%"
  value={7}
  total={10}
  animated={true}
  variant="nominal"
/>`,
        props: [
          { name: 'value', type: 'number', default: '7', description: 'Current active segments count' },
          { name: 'total', type: 'number', default: '10', description: 'Total capacity segments count' },
          { name: 'label', type: 'string', default: "''", description: 'Primary telemetry label' },
          { name: 'sublabel', type: 'string', default: "''", description: 'Secondary status/voltage readout' },
          { name: 'variant', type: "'nominal' | 'warning' | 'danger' | 'success'", default: "'nominal'", description: 'Color semantics profile' },
          { name: 'slant', type: 'number', default: '-20', description: 'Slash slant angle in degrees' },
          { name: 'animated', type: 'boolean', default: 'true', description: 'Enable leading-edge charging pulse animation' }
        ]
      },
      {
        id: 'contour-lines',
        title: 'TerraContourLines',
        titleZh: '山峦等高线地形图层',
        tag: 'TOPOGRAPHY // CAD',
        componentName: 'TerraContourLines',
        category: 'spatial',
        description: 'Realistic geographic mountainous elevation contours with dual-peak elevation labels, saddle passes, and canyon basins.',
        descriptionZh: '真实地理山峦等高线图层，包含双主峰、鞍部、峡谷与海拔标定 crosshairs。',
        codeSnippet: `<script lang="ts">
  import { TerraContourLines } from 'terra-ui'
</script>

<div class="relative w-full h-64 bg-black overflow-hidden">
  <TerraContourLines opacity={0.25} />
</div>`,
        props: [
          { name: 'opacity', type: 'number', default: '0.22', description: 'Overall contour line opacity' },
          { name: 'class', type: 'string', default: "''", description: 'Custom CSS classes' }
        ]
      }
    ]
  },
  {
    id: 'charts',
    title: '03 // TELEMETRY SVG CHARTS',
    titleZh: '03 // 零依赖原生遥测矢量图表',
    items: [
      {
        id: 'line-chart',
        title: 'TerraLineChart',
        titleZh: '波形遥测折线图',
        tag: 'SVG // TELEMETRY',
        componentName: 'TerraLineChart',
        category: 'charts',
        description: 'Native SVG telemetry line and area waveform chart. Features smooth cubic bezier curves, gradient area fill, CAD crosshair inspection, adaptive X-axis tick sampling, and high-contrast HUD tooltip pin box.',
        descriptionZh: '纯原生矢量遥测折线图，包含贝塞尔平滑波形、渐变网格、十字准星探针、自适应 X 轴刻度抽样与高对比度悬浮读数提示框。',
        codeSnippet: `<script lang="ts">
  import { TerraLineChart } from 'terra-ui'

  const data = [
    { timestamp: '18:00:12', value: 38, label: 'NODE-01' },
    { timestamp: '18:15:30', value: 52, label: 'NODE-03' },
    { timestamp: '18:30:45', value: 86, label: 'PEAK-05' },
    { timestamp: '18:45:10', value: 68, label: 'BAL-07' },
    { timestamp: '18:57:56', value: 92, label: 'NODE-10' }
  ]
</script>

<TerraLineChart
  {data}
  height={160}
  unit="MB/s"
  showCrosshair={true}
  showGrid={true}
/>`,
        props: [
          { name: 'data', type: 'Array<{ timestamp?: string; value: number; label?: string }>', default: '[]', required: true, description: 'Telemetry time-series data points array' },
          { name: 'height', type: 'number', default: '160', description: 'SVG canvas height in pixels' },
          { name: 'unit', type: 'string', default: "'VAL'", description: 'Custom measurement unit displayed in the tooltip pin box' },
          { name: 'color', type: 'string', default: "'var(--terra-accent-primary)'", description: 'Stroke and accent color' },
          { name: 'fillOpacity', type: 'number', default: '0.18', description: 'Gradient area fill opacity' },
          { name: 'showGrid', type: 'boolean', default: 'true', description: 'Render CAD background grid lines and ticks' },
          { name: 'showCrosshair', type: 'boolean', default: 'true', description: 'Enable pointer crosshair and tooltip pin box inspection' }
        ]
      },
      {
        id: 'donut-chart',
        title: 'TerraDonutChart',
        titleZh: '环形度量分布图',
        tag: 'SVG // POLAR',
        componentName: 'TerraDonutChart',
        category: 'charts',
        description: 'Circular polar telemetry donut chart with polar guide reticles, dynamic haloPadding safety margin (no square clipping), and center readout.',
        descriptionZh: '极坐标环形资源度量分布图，配备外层引导刻度、动态安全内边距（杜绝光晕方形硬切）与中心度量读数。',
        codeSnippet: `<script lang="ts">
  import { TerraDonutChart } from 'terra-ui'

  const donutData = [
    { label: 'PRIMARY CORE', value: 42, color: 'var(--terra-accent-primary)', code: 'PWR-01' },
    { label: 'DEFENSE SHIELD', value: 28, color: 'var(--terra-accent-secondary)', code: 'DEF-02' },
    { label: 'BUS BUFFER', value: 18, color: 'var(--terra-accent-warning)', code: 'BUS-03' }
  ]
</script>

<TerraDonutChart
  data={donutData}
  size={220}
  thickness={22}
  title="ENERGY ALLOCATION"
  unit="MW"
/>`,
        props: [
          { name: 'data', type: 'Array<{ label: string; value: number; color?: string; code?: string }>', default: '[]', required: true, description: 'Sector distribution data items' },
          { name: 'size', type: 'number', default: '200', description: 'Outer diameter in pixels' },
          { name: 'thickness', type: 'number', default: '20', description: 'Stroke ring thickness in pixels' },
          { name: 'title', type: 'string', default: "'ALLOCATION'", description: 'Center title label' },
          { name: 'unit', type: 'string', default: "'%'", description: 'Metric unit for center value display' }
        ]
      },
      {
        id: 'bar-chart',
        title: 'TerraBarChart',
        titleZh: '分段直方柱状图',
        tag: 'SVG // HISTOGRAM',
        componentName: 'TerraBarChart',
        category: 'charts',
        description: 'Segmented histogram bar chart with 45° chamfer cut tops, multi-tier threshold color coding (normal/warning/critical), and staggered entry animation.',
        descriptionZh: '分段直方柱状图，顶部采用 45° 切角几何，支持阈值语义警示分色与交错进场动效。',
        codeSnippet: `<script lang="ts">
  import { TerraBarChart } from 'terra-ui'

  const barData = [
    { label: 'CPU-01', value: 64, max: 100, status: 'normal' },
    { label: 'MEM-02', value: 88, max: 100, status: 'warning' },
    { label: 'GPU-03', value: 94, max: 100, status: 'critical' }
  ]
</script>

<TerraBarChart data={barData} height={160} barWidth={24} unit="%" />`,
        props: [
          { name: 'data', type: 'Array<{ label: string; value: number; max?: number; status?: "normal" | "warning" | "critical" }>', default: '[]', required: true, description: 'Bar chart data items' },
          { name: 'height', type: 'number', default: '160', description: 'Chart canvas height' },
          { name: 'barWidth', type: 'number', default: '22', description: 'Width of each individual bar' },
          { name: 'unit', type: 'string', default: "'%'", description: 'Value unit string' }
        ]
      }
    ]
  },
  {
    id: 'controls',
    title: '04 // CONTROLS & HUD',
    titleZh: '04 // 精密控制与 HUD 标定',
    items: [
      {
        id: 'vertical-slider',
        title: 'TerraVerticalSlider',
        titleZh: '精密垂直滑块控制台',
        tag: 'CONTROL // SLIDER',
        componentName: 'TerraVerticalSlider',
        category: 'controls',
        description: 'High-contrast tactile vertical scale with GPU-composited scaleY fill, stepped frame buttons (+/-), pointer drag tracking, and keyboard arrow navigation.',
        descriptionZh: '工业精密垂直滑块控制器，100% 由 GPU scaleY 合成层驱动，配备微切角步进按键与全套无障碍滑块语义。',
        codeSnippet: `<script lang="ts">
  import { TerraVerticalSlider } from 'terra-ui'
  let zoom = $state(1.2)
</script>

<TerraVerticalSlider
  bind:value={zoom}
  min={0.5}
  max={2.5}
  step={0.1}
  label="ZOOM"
  unit="x"
  showButtons={true}
  height={180}
/>`,
        props: [
          { name: 'value', type: 'number', default: '1.0', description: 'Bound slider value (supports bind:value)' },
          { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value' },
          { name: 'max', type: 'number', default: '100', description: 'Maximum allowed value' },
          { name: 'step', type: 'number', default: '1', description: 'Step increment per click or drag step' },
          { name: 'label', type: 'string', default: "''", description: 'Telemetry label text' },
          { name: 'unit', type: 'string', default: "''", description: 'Unit abbreviation' },
          { name: 'showButtons', type: 'boolean', default: 'true', description: 'Render [+] and [-] tactile step buttons' },
          { name: 'height', type: 'number', default: '180', description: 'Track height in pixels' }
        ]
      },
      {
        id: 'vertical-tabs',
        title: 'TerraVerticalTabs',
        titleZh: '垂直悬浮游标标签页',
        tag: 'NAVIGATION // TABS',
        componentName: 'TerraVerticalTabs',
        category: 'controls',
        description: 'Vertical tab switcher with a flying animated indicator pill driven by GPU translateY using official Atlos easing curves.',
        descriptionZh: '垂直悬浮游标标签页，激活项指示滑块由 GPU translateY 驱动，采用官方精密缓动贝塞尔曲线。',
        codeSnippet: `<script lang="ts">
  import { TerraVerticalTabs } from 'terra-ui'

  let selected = $state('us-east')
  const tabs = [
    { key: 'us-east', label: 'US-EAST-01 CLUSTER', shortCode: 'VA-01' },
    { key: 'ap-east', label: 'AP-EAST-02 REGION', shortCode: 'HK-02' },
    { key: 'eu-west', label: 'EU-WEST-03 CORE', shortCode: 'DE-03' }
  ]
</script>

<TerraVerticalTabs items={tabs} bind:selectedKey={selected} />`,
        props: [
          { name: 'items', type: 'Array<{ key: string; label: string; shortCode?: string; badge?: string; disabled?: boolean }>', default: '[]', required: true, description: 'Tab item specifications' },
          { name: 'selectedKey', type: 'string', default: "''", description: 'Currently active tab key (supports bind:selectedKey)' }
        ]
      },
      {
        id: 'corner-brackets',
        title: 'TerraCornerBrackets',
        titleZh: '四角包角线框容器',
        tag: 'HUD // BRACKETS',
        componentName: 'TerraCornerBrackets',
        category: 'controls',
        description: 'Four-corner brackets wrapping container with optional status label and glowing reticle accents.',
        descriptionZh: '四角包角聚焦外框，支持头部状态标签与发光强调角标。',
        codeSnippet: `<script lang="ts">
  import { TerraCornerBrackets } from 'terra-ui'
</script>

<TerraCornerBrackets label="[SEC-01 // TELEMETRY]">
  <div class="p-4 bg-black/40 text-white font-mono text-sm">
    TARGET LOCKED: AIC-GRID-09
  </div>
</TerraCornerBrackets>`,
        props: [
          { name: 'label', type: 'string', default: "''", description: 'Optional HUD title tag placed on top-left bracket' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Corner bracket line thickness and size' },
          { name: 'glow', type: 'boolean', default: 'false', description: 'Enable neon accent glow on corner ticks' }
        ]
      }
    ]
  },
  {
    id: 'primitives',
    title: '05 // ATOMIC PRIMITIVES',
    titleZh: '05 // 原子控制图元与人员卡',
    items: [
      {
        id: 'button',
        title: 'TerraButton',
        titleZh: '45° 几何切角流光按键',
        tag: 'ATOMIC // BUTTON',
        componentName: 'TerraButton',
        category: 'primitives',
        description: 'Signature 45° chamfer cut button with GPU hardware-accelerated shimmer light sweep on hover, multiple semantic variants, and loading state.',
        descriptionZh: '标志性 45° 几何切角按钮，悬浮时触发 GPU 硬件加速的流光扫光（Shimmer），具备四种语义变体与加载态。',
        codeSnippet: `<script lang="ts">
  import { TerraButton } from 'terra-ui'
</script>

<div class="flex gap-3">
  <TerraButton variant="primary">EXECUTE</TerraButton>
  <TerraButton variant="outline">STANDBY</TerraButton>
  <TerraButton variant="ghost">PURGE</TerraButton>
  <TerraButton variant="danger">TERMINATE</TerraButton>
</div>`,
        props: [
          { name: 'variant', type: "'primary' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: 'Button visual and semantic style' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding and font scale' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disabled interaction state' },
          { name: 'loading', type: 'boolean', default: 'false', description: 'Displays scanning spinner' }
        ]
      },
      {
        id: 'panel',
        title: 'TerraPanel',
        titleZh: '机能装甲面板',
        tag: 'ATOMIC // CONTAINER',
        componentName: 'TerraPanel',
        category: 'primitives',
        description: 'Armor panel container featuring 45° corner cuts, industrial title bar with telemetry tags, and optional reticle brackets.',
        descriptionZh: '机能装甲面板容器，支持对角 45° 切角、出厂铭牌标题栏与四角瞄准准星。',
        codeSnippet: `<script lang="ts">
  import { TerraPanel } from 'terra-ui'
</script>

<TerraPanel title="SYSTEM STATUS" tag="// SEC-01" cut="tl-br" bracket={true}>
  <p class="text-sm font-mono text-slate-300">All nodes operational.</p>
</TerraPanel>`,
        props: [
          { name: 'title', type: 'string', default: "''", description: 'Panel header title' },
          { name: 'tag', type: 'string', default: "''", description: 'Secondary telemetry tag' },
          { name: 'cut', type: "'none' | 'tr' | 'tl-br' | 'tr-bl'", default: "'tl-br'", description: 'Chamfer corner cut geometry' },
          { name: 'bracket', type: 'boolean', default: 'false', description: 'Render four corner targeting reticles' }
        ]
      },
      {
        id: 'profile-card',
        title: 'TerraProfileCard',
        titleZh: '开发者中枢与人员卡',
        tag: 'IDENTITY // CARD',
        componentName: 'TerraProfileCard',
        category: 'primitives',
        description: 'Swiss typographic identity card displaying authentic GitHub maintainer information (K0maru), public UID barcode, role badges, and direct repository links.',
        descriptionZh: '极简瑞士排印风格的真实 GitHub 开发者档案卡（主创 K0maru），带有官方公开 UID 条码与仓库直达外链。',
        codeSnippet: `<script lang="ts">
  import { TerraProfileCard } from 'terra-ui'
</script>

<TerraProfileCard />`,
        props: [
          { name: 'username', type: 'string', default: "'K0maru'", description: 'Public GitHub handle' },
          { name: 'role', type: 'string', default: "'Lead Maintainer & Architect'", description: 'Project role label' },
          { name: 'uid', type: 'string', default: "'UID-93422639'", description: 'Public UID code' }
        ]
      }
    ]
  },
  {
    id: 'legal',
    title: '06 // LEGAL & ATTRIBUTION',
    titleZh: '06 // 免责声明与设计致敬',
    items: [
      {
        id: 'attribution',
        title: 'Disclaimer & Attribution',
        titleZh: '免责声明与设计致敬来源',
        tag: 'LEGAL // HYPERGRYPH',
        category: 'legal',
        description: 'Terra-UI is an independent open-source frontend research project. Its aesthetic style, typography density, and interactive patterns are inspired by Shanghai HYPERGRYPH Network Technology Co., Ltd. (上海鹰角网络科技有限公司) works "Arknights" (明日方舟) and "Arknights: Endfield" (明日方舟：终末地).',
        descriptionZh: '本项目为独立研发的开源学术与前端技术探索项目。美学风格、排版逻辑及交互灵感直接汲取并参考自上海鹰角网络科技有限公司（HYPERGRYPH）开发的作品《明日方舟》与《明日方舟：终末地》。',
        features: [
          'All trademarks, trade dress, and intellectual property belong to Shanghai HYPERGRYPH Network Technology Co., Ltd.',
          'Non-commercial & Academic Exploration: Created strictly for open-source UI/UX showcase and Svelte 5 component architecture exploration.',
          'Clean-Room Implementation: 100% of code, SVGs, and CSS written independently from scratch. Zero proprietary assets, decrypted code, audio, or game models extracted or redistributed.'
        ]
      }
    ]
  }
]
