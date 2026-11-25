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
  featuresZh?: string[]
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
        titleZh: '平面编辑部 × 动态字符架构',
        tag: 'ARCHITECTURE // CORE',
        category: 'getting-started',
        description:
          'Terra-UI is a Svelte 5 component system uniting Swiss flat editorial grid discipline with parametric kinetic ASCII specimens and spring-physics motion tokens.',
        descriptionZh:
          'Terra-UI 是基于 Svelte 5 Runes 构建的组件设计系统，以「平面编辑部排印 × 动态字符场」为核心美学：纯平 1px 网格、4 套校色矿物颜料与帧率无关的物理弹簧动效体系。',
        features: [
          'Zero-VDOM Svelte 5 Runes ($state, $derived, $props) with Spring physics',
          '1px architectural borders & tonal ink/paper elevation without heavy glow or chamfer cuts',
          'Calibrated 4 mineral pigments (vermilion, viridian, cyanotype, citron) × dark/light modes',
          'GPU-composited clip-path, transform, opacity transitions and View Transitions API'
        ],
        featuresZh: [
          '零 VDOM 的 Svelte 5 原生 Runes 驱动，结合帧率无关的 dt 物理弹簧算法',
          '纯平 1px 结构网格与纸墨明暗对比，彻底剔除廉价发光与厚重斜切角',
          '4 套校色矿物颜料（朱砂、铬绿、普鲁士蓝、酸性柠）× 深/浅双模完整适配',
          '全合成层（transform / opacity / clip-path）动效并遵循 prefers-reduced-motion'
        ]
      },
      {
        id: 'installation',
        title: 'Installation & Setup',
        titleZh: '依赖安装与工程配置',
        tag: 'SETUP // GUIDE',
        category: 'getting-started',
        description: 'Set up Terra-UI in any Vite + Svelte 5 project with Tailwind CSS support.',
        descriptionZh: '在基于 Vite + Svelte 5 + Tailwind CSS 的前端工程中快速集成 Terra-UI。',
        codeSnippet: `npm install @k0maru/terra-ui

import '@k0maru/terra-ui/css'

<script lang="ts">
  import { TerraButton, TerraLineChart } from '@k0maru/terra-ui'
</script>

<TerraButton variant="primary">EXECUTE</TerraButton>`
      },
      {
        id: 'tokens',
        title: 'Design & Motion Tokens',
        titleZh: '视觉与物理动效 Tokens',
        tag: 'THEMING // PHYSICS',
        category: 'getting-started',
        description:
          'Governed by CSS custom properties for 4 mineral pigment themes, z-index layering, layout geometry, and script-solved CSS linear() spring curves.',
        descriptionZh:
          '全站颜色、层叠刻度、布局高度与物理弹簧曲线均收敛于 tokens.css，确保主题同步切换零撕裂与全站统一动效手感。',
        codeSnippet: `<html data-theme="vermilion" data-mode="dark">

--terra-bg-base: #0d0e10;
--terra-accent-primary: #ee4b2b;
--terra-on-accent: #ffffff;

--terra-dur-instant: 90ms;
--terra-dur-fast: 150ms;
--terra-dur-base: 300ms;
--terra-dur-slow: 420ms;
--terra-spring-snappy: linear(0, 0.054, ... 1);
--terra-spring-smooth: linear(0, 0.081, ... 1);`
      }
    ]
  },
  {
    id: 'kinetic',
    title: '02 // KINETIC ASCII & SPATIAL',
    titleZh: '02 // 动态字符与空间交互',
    items: [
      {
        id: 'ascii-stage',
        title: 'TerraAsciiStage',
        titleZh: '3D 实时动态字符标本台',
        tag: 'CANVAS // ASCII 3D',
        componentName: 'TerraAsciiStage',
        category: 'kinetic',
        description:
          'Real-time 3D articulated Papilio specimen dissolving along an interactive divider into a 16-bucket chroma × luminance ASCII glyph field.',
        descriptionZh:
          '实时参数化 3D 凤蝶在可拖拽分割线两侧呈现光学立体渲染与 16 桶「色度 × 明度」字符场，支持深浅双模极性自动反转与视口离屏休眠。',
        codeSnippet: `<script lang="ts">
  import { TerraAsciiStage } from '@k0maru/terra-ui'
</script>

<TerraAsciiStage density="fine" splitMode="cursor" />`,
        props: [
          {
            name: 'density',
            type: "'fine' | 'bold'",
            default: "'fine'",
            description: 'Initial glyph grid density'
          },
          {
            name: 'splitMode',
            type: "'cursor' | 'sweep' | 'half'",
            default: "'cursor'",
            description: 'Initial optical vs ASCII split controller mode'
          },
          { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes' }
        ]
      },
      {
        id: 'ambient-field',
        title: 'TerraAmbientField',
        titleZh: '开放点阵字符微场',
        tag: 'CANVAS // AMBIENT',
        componentName: 'TerraAmbientField',
        category: 'kinetic',
        description:
          'Fixed-viewport interactive dot-lattice Canvas synchronized 1:1 with the 36px background matrix, waking ASCII glyphs near the cursor and ripple waves on click with zero idle CPU burn.',
        descriptionZh:
          '与背景 36px 开放点阵严格 1:1 对齐的轻量视口 Canvas：仅重绘光标局部与点击波纹范围内的字符，静止即停帧零功耗。',
        codeSnippet: `<script lang="ts">
  import { TerraAmbientField } from '@k0maru/terra-ui'
</script>

<div class="terra-editorial-canvas relative min-h-screen">
  <TerraAmbientField />
</div>`,
        props: []
      },
      {
        id: 'spatial-card',
        title: 'TerraSpatialCard',
        titleZh: '物理倾角悬浮卡片',
        tag: 'PHYSICS // 3D',
        componentName: 'TerraSpatialCard',
        category: 'kinetic',
        description:
          'Pointer-driven 3D perspective card backed by dt-independent spring integration, Z-depth parallax layers, and subtle hairline accent border.',
        descriptionZh:
          '基于 dt 无关物理弹簧驱动的多轴 3D 透视交互卡片，纯平 1px 线框与微弱颜料高光响应光标位置，触摸端与减弱动效自动降级。',
        codeSnippet: `<script lang="ts">
  import { TerraSpatialCard, TerraBadge } from '@k0maru/terra-ui'
</script>

<TerraSpatialCard maxRotation={12} perspective={1000}>
  <div class="space-y-3">
    <div class="flex justify-between items-center" style="transform: translateZ(20px);">
      <h4 class="font-mono text-sm font-bold text-[var(--terra-text-primary)]">
        SPATIAL SENSOR NODE
      </h4>
      <TerraBadge label="NOMINAL" variant="primary" />
    </div>
    <p class="text-xs text-[var(--terra-text-secondary)]" style="transform: translateZ(12px);">
      Spring-damped perspective tracking.
    </p>
  </div>
</TerraSpatialCard>`,
        props: [
          {
            name: 'maxRotation',
            type: 'number',
            default: '12',
            description: 'Maximum tilt angle in degrees along X and Y axes'
          },
          {
            name: 'perspective',
            type: 'number',
            default: '1000',
            description: 'CSS 3D perspective depth in pixels'
          },
          {
            name: 'sheen',
            type: 'boolean',
            default: 'true',
            description: 'Render subtle cursor-following specular accent sheen'
          },
          {
            name: 'borderGlow',
            type: 'boolean',
            default: 'true',
            description: 'Highlight border with accent primary on hover'
          },
          { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes' }
        ]
      }
    ]
  },
  {
    id: 'charts',
    title: '03 // OBSERVABILITY CHARTS',
    titleZh: '03 // 扁平矢量可观测图表',
    items: [
      {
        id: 'line-chart',
        title: 'TerraLineChart',
        titleZh: '时序数据折线图',
        tag: 'SVG // STREAM',
        componentName: 'TerraLineChart',
        category: 'charts',
        description:
          'Native SVG waveform chart with Spring-interpolated crosshair tracking, HTML crisp tooltip, baseline pinning, and keyboard navigation.',
        descriptionZh:
          '原生矢量折线图，十字准星由 Spring 连续追踪插值，HTML 浮动提示框保持移动端清晰字号，支持单点锚定对比与完整键盘导航。',
        codeSnippet: `<script lang="ts">
  import { TerraLineChart } from '@k0maru/terra-ui'

  const data = [
    { timestamp: '18:00', value: 38, label: 'NODE-01' },
    { timestamp: '18:15', value: 52, label: 'NODE-03' },
    { timestamp: '18:30', value: 86, label: 'PEAK-05' },
    { timestamp: '18:45', value: 68, label: 'BAL-07' },
    { timestamp: '19:00', value: 92, label: 'NODE-10' }
  ]
</script>

<TerraLineChart {data} height={160} unit="GB/s" />`,
        props: [
          {
            name: 'data',
            type: 'Array<{ timestamp?: string; value: number; label?: string }>',
            default: '[]',
            required: true,
            description: 'Time-series data points array'
          },
          { name: 'height', type: 'number', default: '160', description: 'SVG viewBox height' },
          { name: 'unit', type: 'string', default: "''", description: 'Measurement unit suffix' },
          {
            name: 'color',
            type: 'string',
            default: "'var(--terra-accent-primary)'",
            description: 'Stroke and accent color'
          },
          {
            name: 'showGrid',
            type: 'boolean',
            default: 'true',
            description: 'Render dashed grid lines and axis ticks'
          },
          {
            name: 'showCrosshair',
            type: 'boolean',
            default: 'true',
            description: 'Enable spring-tracked crosshair and tooltip inspection'
          }
        ]
      },
      {
        id: 'bar-chart',
        title: 'TerraBarChart',
        titleZh: '分段资源柱状图',
        tag: 'SVG // LOAD',
        componentName: 'TerraBarChart',
        category: 'charts',
        description:
          'Flat histogram bar chart with gap-free container hover tracking, staggered smooth spring growth, and exact coordinate reference line comparison.',
        descriptionZh:
          '纯平分段柱状图，容器级连续指针追踪消除柱间空隙闪烁，参考虚线与柱体共用精确轨道坐标系，支持平滑数字滚表与对比参考线。',
        codeSnippet: `<script lang="ts">
  import { TerraBarChart } from '@k0maru/terra-ui'

  const barData = [
    { label: 'CPU-01', value: 64, max: 100, status: 'normal' },
    { label: 'MEM-02', value: 88, max: 100, status: 'warning' },
    { label: 'GPU-03', value: 94, max: 100, status: 'critical' }
  ]
</script>

<TerraBarChart data={barData} height={160} barWidth={24} unit="%" />`,
        props: [
          {
            name: 'data',
            type: 'Array<{ label: string; value: number; max?: number; status?: "normal" | "warning" | "critical" }>',
            default: '[]',
            required: true,
            description: 'Bar chart data items'
          },
          { name: 'height', type: 'number', default: '180', description: 'Chart height in pixels' },
          { name: 'barWidth', type: 'number', default: '36', description: 'Base bar track width' },
          { name: 'unit', type: 'string', default: "'%'", description: 'Value unit string' }
        ]
      },
      {
        id: 'status-strip',
        title: 'TerraStatusStrip',
        titleZh: '服务可用率状态细条',
        tag: 'SLA // STATUS',
        componentName: 'TerraStatusStrip',
        category: 'charts',
        description:
          'Continuous 1D uptime strip with gap-free container pointer tracking, Gaussian opacity falloff, roving keyboard navigation, and Spring-interpolated tooltip.',
        descriptionZh:
          '90 天连续服务健康度细条：容器坐标反算与高斯透明度彻底消除横扫间隙闪烁，支持方向键单焦点巡检与 Spring 跟随提示框。',
        codeSnippet: `<script lang="ts">
  import { TerraStatusStrip } from '@k0maru/terra-ui'
</script>

<TerraStatusStrip serviceName="CORE_GATEWAY_ROUTER" days={60} />`,
        props: [
          {
            name: 'data',
            type: 'StatusDayRecord[]',
            default: 'generated',
            description: 'Daily uptime records'
          },
          {
            name: 'serviceName',
            type: 'string',
            default: "'GLOBAL_EDGE_ROUTER'",
            description: 'Service identifier'
          },
          { name: 'days', type: 'number', default: '90', description: 'Number of day bars' },
          {
            name: 'barHeight',
            type: 'number',
            default: '30',
            description: 'Bar strip height in pixels'
          }
        ]
      },
      {
        id: 'donut-chart',
        title: 'TerraDonutChart',
        titleZh: '环形资源分布图',
        tag: 'SVG // POLAR',
        componentName: 'TerraDonutChart',
        category: 'charts',
        description:
          'Polar allocation ring using theme-derived color-mix palette, smooth spring stroke reveal, container legend hover, and damped central numeric readout.',
        descriptionZh:
          '极坐标环形资源分布图，采用主题派生梯度配色与临界阻尼中心读数，图例容器级防闪烁追踪。',
        codeSnippet: `<script lang="ts">
  import { TerraDonutChart } from '@k0maru/terra-ui'

  const donutData = [
    { label: 'CORE LOAD', value: 46, code: 'PWR-01' },
    { label: 'SHIELD BUS', value: 34, code: 'DEF-02' },
    { label: 'INVERTER', value: 20, code: 'BUS-03' }
  ]
</script>

<TerraDonutChart data={donutData} size={200} thickness={20} title="ALLOCATION" unit="%" />`,
        props: [
          {
            name: 'data',
            type: 'Array<{ label: string; value: number; color?: string; code?: string }>',
            default: '[]',
            required: true,
            description: 'Sector distribution items'
          },
          { name: 'size', type: 'number', default: '200', description: 'Outer diameter in pixels' },
          { name: 'thickness', type: 'number', default: '22', description: 'Ring stroke width' },
          { name: 'title', type: 'string', default: "'SYSTEM LOAD'", description: 'Center label' },
          { name: 'unit', type: 'string', default: "'%'", description: 'Metric unit' }
        ]
      },
      {
        id: 'activity-heatmap',
        title: 'TerraActivityHeatmap',
        titleZh: '时序活动矩阵热力图',
        tag: 'SVG // MATRIX',
        componentName: 'TerraActivityHeatmap',
        category: 'charts',
        description:
          '2D calendar activity matrix with continuous SVG grid coordinate tracking and Spring-positioned tooltip.',
        descriptionZh:
          '高密度 2D 时序活动热力矩阵，直接在 SVG 坐标系反算行列定位并由 Spring 驱动悬浮读数框，跨格移动零闪动。',
        codeSnippet: `<script lang="ts">
  import { TerraActivityHeatmap } from '@k0maru/terra-ui'
</script>

<TerraActivityHeatmap weeks={38} cellSize={11} cellGap={3} />`,
        props: [
          { name: 'data', type: 'ActivityRecord[]', default: 'generated', description: 'Records' },
          { name: 'weeks', type: 'number', default: '52', description: 'Week column count' },
          { name: 'cellSize', type: 'number', default: '11', description: 'Cell size in pixels' },
          { name: 'cellGap', type: 'number', default: '3', description: 'Cell gap in pixels' }
        ]
      },
      {
        id: 'sparkline',
        title: 'TerraSparkline',
        titleZh: '微型行内走势波形',
        tag: 'SVG // INLINE',
        componentName: 'TerraSparkline',
        category: 'charts',
        description:
          'Lightweight inline waveform with smooth spline interpolation and motion-safe terminal indicator.',
        descriptionZh: '轻量行内趋势折线图，内置渐变阴影与遵守全局减弱动效协议的末端呼吸指示器。',
        codeSnippet: `<script lang="ts">
  import { TerraSparkline } from '@k0maru/terra-ui'
</script>

<TerraSparkline data={[20, 28, 42, 35, 58, 48, 72, 64]} height={28} variant="accent" />`,
        props: [
          {
            name: 'data',
            type: 'number[]',
            default: '[24, 38, ...]',
            description: 'Numeric array'
          },
          { name: 'height', type: 'number', default: '32', description: 'Height in pixels' },
          {
            name: 'variant',
            type: "'accent' | 'success' | 'warning' | 'danger'",
            default: "'accent'",
            description: 'Theme token variant'
          }
        ]
      }
    ]
  },
  {
    id: 'controls',
    title: '04 // PRECISION CONTROLS',
    titleZh: '04 // 精密控制器与仪表',
    items: [
      {
        id: 'vernier-meter',
        title: 'TerraVernierMeter',
        titleZh: '游标微刻度尺指示器',
        tag: 'PRECISION // METER',
        componentName: 'TerraVernierMeter',
        category: 'controls',
        description:
          'Spring-driven precision caliper slider and meter aligned exactly to padded tick geometry via GPU scaleX/translate3d compositing.',
        descriptionZh:
          '全合成层驱动的精密游标卡尺与可拖拽微调器，指针与填充条与刻度槽精确对齐且无边缘错位，松手后呈自然阻尼落位。',
        codeSnippet: `<script lang="ts">
  import { TerraVernierMeter } from '@k0maru/terra-ui'
  let val = $state(74)
</script>

<TerraVernierMeter bind:value={val} interactive={true} min={0} max={100} ticks={21} />`,
        props: [
          { name: 'value', type: 'number', default: '0', description: 'Current numeric value' },
          { name: 'min', type: 'number', default: '0', description: 'Scale minimum' },
          { name: 'max', type: 'number', default: '100', description: 'Scale maximum' },
          { name: 'ticks', type: 'number', default: '21', description: 'Tick count' },
          {
            name: 'interactive',
            type: 'boolean',
            default: 'false',
            description: 'Enable drag/keys'
          },
          { name: 'hazard', type: 'boolean', default: 'false', description: 'Overload accent' }
        ]
      },
      {
        id: 'vertical-tabs',
        title: 'TerraVerticalTabs',
        titleZh: '垂直游标索引标签',
        tag: 'NAVIGATION // TABS',
        componentName: 'TerraVerticalTabs',
        category: 'controls',
        description:
          'Vertical tablist whose sliding rail scales duration with jump distance under a snappy 2% overshoot spring curve.',
        descriptionZh: '垂直索引标签栏，激活游标随跳转跨度自适应时长与 2% 微过冲回弹落位。',
        codeSnippet: `<script lang="ts">
  import { TerraVerticalTabs } from '@k0maru/terra-ui'
  let selected = $state('us-east')
</script>

<TerraVerticalTabs items={tabs} bind:selectedKey={selected} />`,
        props: [
          {
            name: 'items',
            type: 'TerraTabItem[]',
            default: '[]',
            required: true,
            description: 'Tab definitions'
          },
          { name: 'selectedKey', type: 'string', default: "''", description: 'Bindable active key' }
        ]
      },
      {
        id: 'rolling-number',
        title: 'TerraRollingNumber',
        titleZh: '临界阻尼数字计数器',
        tag: 'TELEMETRY // NUMERIC',
        componentName: 'TerraRollingNumber',
        category: 'controls',
        description:
          'Critically damped spring numeric counter (zero overshoot) for bounded KPI readouts and percentages.',
        descriptionZh: '严格临界阻尼数字滚表（ζ=1.0，绝不过冲越界），确保有界百分比不闪烁超限值。',
        codeSnippet: `<script lang="ts">
  import { TerraRollingNumber } from '@k0maru/terra-ui'
</script>

<TerraRollingNumber value={99.98} decimals={2} suffix="%" />`,
        props: [
          { name: 'value', type: 'number', required: true, description: 'Target numeric value' },
          { name: 'decimals', type: 'number', default: '0', description: 'Decimal places' },
          {
            name: 'duration',
            type: 'number',
            default: '420',
            description: 'Nominal settle time (ms)'
          },
          { name: 'suffix', type: 'string', default: "''", description: 'Trailing unit text' }
        ]
      }
    ]
  },
  {
    id: 'primitives',
    title: '05 // EDITORIAL PRIMITIVES',
    titleZh: '05 // 编辑部基础图元',
    items: [
      {
        id: 'button',
        title: 'TerraButton',
        titleZh: '磁吸与反色擦除按钮',
        tag: 'ATOMIC // BUTTON',
        componentName: 'TerraButton',
        category: 'primitives',
        description:
          'Flat tactile trigger with outer-button spring magnetic pull, synchronized clip-path ink inversion for outline variants, and spring release.',
        descriptionZh:
          '全按钮范围磁吸触发器，outline 变体通过同步 clip-path 文字层消除擦除过程反色闪烁，按下瞬态与松开回弹手感分明。',
        codeSnippet: `<script lang="ts">
  import { TerraButton } from '@k0maru/terra-ui'
</script>

<div class="flex gap-3">
  <TerraButton variant="primary" magneticPull={true}>EXECUTE</TerraButton>
  <TerraButton variant="outline">STANDBY</TerraButton>
  <TerraButton variant="ghost">RESET</TerraButton>
  <TerraButton variant="danger">ABORT</TerraButton>
</div>`,
        props: [
          {
            name: 'variant',
            type: "'primary' | 'outline' | 'ghost' | 'danger'",
            default: "'primary'",
            description: 'Button semantic style'
          },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size scale' },
          {
            name: 'magneticPull',
            type: 'boolean',
            default: 'false',
            description: 'Enable pointer spring pull'
          },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable button' }
        ]
      },
      {
        id: 'input',
        title: 'TerraInput',
        titleZh: '底线指令输入框',
        tag: 'ATOMIC // INPUT',
        componentName: 'TerraInput',
        category: 'primitives',
        description:
          'Minimal baseline terminal input with asymmetric enter/exit focus rail timing and bilingual default placeholder.',
        descriptionZh:
          '纯平底线指令输入框，聚焦时以弹簧曲线中心展开，失焦时快速收敛，内置清除操作。',
        codeSnippet: `<script lang="ts">
  import { TerraInput } from '@k0maru/terra-ui'
  let cmd = $state('deploy --env=production')
</script>

<TerraInput bind:value={cmd} prefix="CMD>" />`,
        props: [
          { name: 'value', type: 'string', default: "''", description: 'Bindable text value' },
          { name: 'prefix', type: 'string', default: "''", description: 'Prompt prefix label' },
          { name: 'clearable', type: 'boolean', default: 'true', description: 'Show clear button' }
        ]
      },
      {
        id: 'panel',
        title: 'TerraPanel',
        titleZh: '纯平 1px 档案容器',
        tag: 'ATOMIC // SURFACE',
        componentName: 'TerraPanel',
        category: 'primitives',
        description:
          'Flat 1px architectural container bounded cleanly by paper/ink borders, optional header rail, and warning accent band.',
        descriptionZh: '遵循 1px 结构网格约束的纯平编辑部档案容器，去除切角与重投影。',
        codeSnippet: `<script lang="ts">
  import { TerraPanel } from '@k0maru/terra-ui'
</script>

<TerraPanel title="SYSTEM STATUS" tag="// SEC-01">
  <p class="text-xs text-[var(--terra-text-secondary)]">All nodes operational.</p>
</TerraPanel>`,
        props: [
          { name: 'title', type: 'string', default: "''", description: 'Panel title' },
          { name: 'tag', type: 'string', default: "''", description: 'Right-aligned tag' },
          {
            name: 'warning',
            type: 'boolean',
            default: 'false',
            description: 'Top warning accent bar'
          }
        ]
      },
      {
        id: 'status-beacon',
        title: 'TerraStatusBeacon',
        titleZh: '正弦呼吸状态信标',
        tag: 'ATOMIC // STATUS',
        componentName: 'TerraStatusBeacon',
        category: 'primitives',
        description:
          'Status indicator with sinusoidal breathe ring honoring motion pause settings.',
        descriptionZh: '状态信标指示器，采用平滑正弦呼吸节律并接入全局动效暂停控制。',
        codeSnippet: `<script lang="ts">
  import { TerraStatusBeacon } from '@k0maru/terra-ui'
</script>

<TerraStatusBeacon status="online" label="ACTIVE" />`,
        props: [
          {
            name: 'status',
            type: "'online' | 'standby' | 'alert' | 'offline'",
            default: "'online'",
            description: 'Health state'
          },
          { name: 'label', type: 'string', default: "''", description: 'Status text' },
          { name: 'pulse', type: 'boolean', default: 'true', description: 'Animate outer halo' }
        ]
      },
      {
        id: 'profile-card',
        title: 'TerraProfileCard',
        titleZh: '开发者档案名片',
        tag: 'IDENTITY // CARD',
        componentName: 'TerraProfileCard',
        category: 'primitives',
        description:
          'Swiss typographic maintainer profile card displaying public GitHub metadata, UID barcode, and dual-mode tokens.',
        descriptionZh: '纯平瑞士排印开发者档案卡，完整兼容深/浅双模配色。',
        codeSnippet: `<script lang="ts">
  import { TerraProfileCard } from '@k0maru/terra-ui'
</script>

<TerraProfileCard />`,
        props: [
          { name: 'username', type: 'string', default: "'K0maru'", description: 'GitHub handle' },
          { name: 'uid', type: 'string', default: "'UID-93422639'", description: 'Public UID code' }
        ]
      }
    ]
  },
  {
    id: 'legal',
    title: '06 // ATTRIBUTION & LICENSE',
    titleZh: '06 // 开源协议与致敬声明',
    items: [
      {
        id: 'attribution',
        title: 'Disclaimer & Attribution',
        titleZh: '开源协议与设计演进说明',
        tag: 'LEGAL // MIT',
        category: 'legal',
        description:
          'Terra-UI is an independent MIT-licensed clean-room Svelte 5 component library. Earlier aesthetic explorations referenced Arknights and Arknights: Endfield by HYPERGRYPH; the system has since evolved into an original flat editorial and kinetic ASCII design system.',
        descriptionZh:
          'Terra-UI 是一套遵循 MIT 协议的独立开源 Svelte 5 组件库（Clean-Room Implementation）。项目早期灵感曾参考鹰角网络《明日方舟》与《明日方舟：终末地》相关界面美学，现已演进为独立的平面编辑部与动态字符设计系统。',
        features: [
          'Trademarks & Game IP belong exclusively to Shanghai HYPERGRYPH Network Technology Co., Ltd.',
          '100% independent clean-room Svelte 5, CSS Token, and procedural Canvas/SVG implementation.',
          'Zero extracted or proprietary game assets are distributed in this repository.'
        ],
        featuresZh: [
          '所有与《明日方舟》及《明日方舟：终末地》相关的商标与美术著作权归上海鹰角网络科技有限公司所有。',
          '全量组件、CSS Tokens 与程序化 Canvas/SVG 均为从零独立编写的干净实现。',
          '本仓库不包含任何解包、提取或分发的专有游戏资源。'
        ]
      }
    ]
  }
]
