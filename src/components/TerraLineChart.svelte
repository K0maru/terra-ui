<script lang="ts">
  import { onMount } from 'svelte'

  interface DataPoint {
    timestamp?: string
    value: number
    label?: string
  }

  interface Props {
    data: DataPoint[]
    height?: number
    color?: string
    fillOpacity?: number
    showGrid?: boolean
    showCrosshair?: boolean
    animated?: boolean
    unit?: string
    class?: string
  }

  let {
    data = [],
    height = 160,
    color = 'var(--terra-accent-primary)',
    fillOpacity = 0.18,
    showGrid = true,
    showCrosshair = true,
    animated = true,
    unit = 'VAL',
    class: className = ''
  }: Props = $props()

  const chartId = Math.random().toString(36).substring(2, 9)
  const width = 600
  const padLeft = 46
  const padRight = 16
  const padTop = 18
  const padBottom = 26
  const tooltipWidth = 140
  const tooltipHeight = 38

  let isMounted = $state(false)
  let hoveredPointIndex = $state<number | null>(null)
  let svgElement = $state<SVGSVGElement | null>(null)

  onMount(() => {
    if (animated) {
      const timer = setTimeout(() => {
        isMounted = true
      }, 50)
      return () => clearTimeout(timer)
    } else {
      isMounted = true
    }
  })

  const isExpanded = $derived(!animated || isMounted)

  const values = $derived(data.map((d) => d.value))
  const rawMin = $derived(values.length > 0 ? Math.min(...values) : 0)
  const rawMax = $derived(values.length > 0 ? Math.max(...values) : 100)
  const range = $derived(rawMax - rawMin || 1)
  const minVal = $derived(Math.floor(rawMin - range * 0.08))
  const maxVal = $derived(Math.ceil(rawMax + range * 0.08))
  const span = $derived(maxVal - minVal || 1)

  const plotWidth = $derived(width - padLeft - padRight)
  const plotHeight = $derived(height - padTop - padBottom)

  const points = $derived.by(() => {
    if (data.length === 0) return []
    return data.map((d, i) => {
      const x = padLeft + (i / Math.max(data.length - 1, 1)) * plotWidth
      const y = padTop + plotHeight - ((d.value - minVal) / span) * plotHeight
      return {
        x,
        y,
        val: d.value,
        timestamp: d.timestamp || `T+${i}s`,
        label: d.label || `NODE-${i + 1}`
      }
    })
  })

  // Smooth bezier curve path generation
  const linePath = $derived.by(() => {
    if (points.length === 0) return ''
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

    let d = `M ${points[0].x},${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const mx = (p0.x + p1.x) / 2
      d += ` C ${mx},${p0.y} ${mx},${p1.y} ${p1.x},${p1.y}`
    }
    return d
  })

  const areaPath = $derived.by(() => {
    if (points.length === 0) return ''
    const bottomY = padTop + plotHeight
    const firstX = points[0].x
    const lastX = points[points.length - 1].x
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`
  })

  // Y-axis grid ticks
  const yTicks = $derived([
    { val: maxVal, y: padTop },
    { val: Math.round((maxVal + minVal) / 2), y: padTop + plotHeight / 2 },
    { val: minVal, y: padTop + plotHeight }
  ])

  // X-axis adaptive sampled ticks (prevents label overlap and edge clipping)
  const xTicks = $derived.by(() => {
    if (points.length === 0) return []
    if (points.length === 1) {
      return [{ pt: points[0], anchor: 'middle' as const }]
    }

    const minGap = 75 // Minimum pixel distance between adjacent tick labels
    const sampled: Array<{
      pt: (typeof points)[0]
      anchor: 'start' | 'middle' | 'end'
    }> = []

    // 1. First tick (aligned to start of text to avoid left edge clipping)
    sampled.push({ pt: points[0], anchor: 'start' })

    const lastPt = points[points.length - 1]
    let prevX = points[0].x

    // 2. Intermediate ticks (spaced by minGap from prev and from last point)
    for (let i = 1; i < points.length - 1; i++) {
      const pt = points[i]
      if (pt.x - prevX >= minGap && lastPt.x - pt.x >= minGap) {
        sampled.push({ pt, anchor: 'middle' })
        prevX = pt.x
      }
    }

    // 3. Last tick (aligned to end of text to avoid right edge clipping)
    if (lastPt.x - prevX >= minGap * 0.5) {
      sampled.push({ pt: lastPt, anchor: 'end' })
    }

    return sampled
  })

  function handlePointerMove(e: PointerEvent) {
    if (!svgElement || points.length === 0) return
    const rect = svgElement.getBoundingClientRect()
    const mouseX = ((e.clientX - rect.left) / rect.width) * width

    // Find point with minimal distance on X
    let closestIdx = 0
    let minDiff = Infinity
    for (let i = 0; i < points.length; i++) {
      const diff = Math.abs(points[i].x - mouseX)
      if (diff < minDiff) {
        minDiff = diff
        closestIdx = i
      }
    }
    hoveredPointIndex = closestIdx
  }

  function handlePointerLeave() {
    hoveredPointIndex = null
  }

  const activePoint = $derived(
    hoveredPointIndex !== null && points[hoveredPointIndex]
      ? points[hoveredPointIndex]
      : null
  )
</script>

<div class="relative w-full bg-[var(--terra-bg-base)]/40 border border-[var(--terra-border)] p-3 select-none overflow-hidden {className}">
  <!-- Top Telemetry Status Line -->
  <div class="flex items-center justify-between font-mono text-[9px] text-[var(--terra-text-muted)] tracking-wider mb-1 px-1">
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 bg-[var(--terra-accent-primary)] animate-pulse"></span>
      <span class="text-[var(--terra-text-primary)] font-bold">SIGNAL // TELEMETRY_STREAM</span>
    </div>
    <div class="flex items-center gap-3">
      <span>SAMPLING: 100HZ</span>
      {#if activePoint}
        <span class="text-[var(--terra-accent-primary)] font-bold">INSPECT: {activePoint.val.toFixed(1)}</span>
      {:else}
        <span>STATUS: NOMINAL</span>
      {/if}
    </div>
  </div>

  <!-- SVG Chart Canvas -->
  <svg
    bind:this={svgElement}
    viewBox="0 0 {width} {height}"
    class="w-full h-auto overflow-visible cursor-crosshair"
    onpointermove={handlePointerMove}
    onpointerleave={handlePointerLeave}
    role="img"
    aria-label="Tactical Line Chart"
  >
    <defs>
      <!-- Gradient Fill -->
      <linearGradient id="area-grad-{chartId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color={color} stop-opacity={fillOpacity} />
        <stop offset="90%" stop-color={color} stop-opacity="0.02" />
        <stop offset="100%" stop-color={color} stop-opacity="0" />
      </linearGradient>

      <!-- Glow Filter -->
      <filter id="glow-{chartId}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <!-- Tooltip Drop Shadow Filter -->
      <filter id="tooltip-shadow-{chartId}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.65" />
      </filter>
    </defs>

    <!-- CAD Grid Background -->
    {#if showGrid}
      <!-- Horizontal lines & Y Ticks -->
      {#each yTicks as tick}
        <line
          x1={padLeft}
          y1={tick.y}
          x2={width - padRight}
          y2={tick.y}
          stroke="var(--terra-border)"
          stroke-width="1"
          stroke-dasharray="2 4"
          opacity="0.4"
        />
        <text
          x={padLeft - 8}
          y={tick.y + 3}
          text-anchor="end"
          fill="var(--terra-text-secondary, #94a3b8)"
          font-family="var(--terra-font-mono, monospace)"
          font-size="9px"
          font-weight="600"
        >
          {tick.val}
        </text>
      {/each}

      <!-- Bottom X Axis Line -->
      <line
        x1={padLeft}
        y1={padTop + plotHeight}
        x2={width - padRight}
        y2={padTop + plotHeight}
        stroke="var(--terra-border)"
        stroke-width="1"
        opacity="0.7"
      />

      <!-- Vertical CAD Ticks (Adaptive Sampled) -->
      {#each xTicks as tick}
        <line
          x1={tick.pt.x}
          y1={padTop}
          x2={tick.pt.x}
          y2={padTop + plotHeight}
          stroke="var(--terra-border)"
          stroke-width="1"
          stroke-dasharray="1 5"
          opacity="0.3"
        />
        <text
          x={tick.pt.x}
          y={padTop + plotHeight + 14}
          text-anchor={tick.anchor}
          fill="var(--terra-text-secondary, #94a3b8)"
          font-family="var(--terra-font-mono, monospace)"
          font-size="8.5px"
          letter-spacing="0.02em"
        >
          {tick.pt.timestamp}
        </text>
      {/each}
    {/if}

    <!-- Area Gradient Mesh -->
    {#if areaPath}
      <path
        d={areaPath}
        fill="url(#area-grad-{chartId})"
        class="transition-opacity duration-700"
        style="opacity: {isExpanded ? 1 : 0};"
      />
    {/if}

    <!-- Line Path with Drawing Animation -->
    {#if linePath}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#glow-{chartId})"
        style="
          stroke-dasharray: 2000;
          stroke-dashoffset: {isExpanded ? 0 : 2000};
          transition: stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1);
        "
      />
    {/if}

    <!-- Discrete Data Knots -->
    {#each points as pt, idx}
      <circle
        cx={pt.x}
        cy={pt.y}
        r="2.5"
        fill="var(--terra-bg-surface)"
        stroke={color}
        stroke-width="1.5"
        class="opacity-70 transition-transform duration-200"
      />
    {/each}

    <!-- Interactive Crosshair & Inspection Marker -->
    {#if showCrosshair && activePoint}
      <!-- Vertical Scanning Crosshair -->
      <line
        x1={activePoint.x}
        y1={padTop}
        x2={activePoint.x}
        y2={padTop + plotHeight}
        stroke="var(--terra-accent-primary)"
        stroke-width="1"
        stroke-dasharray="3 2"
        opacity="0.8"
      />
      <!-- Horizontal Crosshair -->
      <line
        x1={padLeft}
        y1={activePoint.y}
        x2={width - padRight}
        y2={activePoint.y}
        stroke="var(--terra-accent-primary)"
        stroke-width="1"
        stroke-dasharray="3 2"
        opacity="0.8"
      />

      <!-- Reticle Ring -->
      <circle
        cx={activePoint.x}
        cy={activePoint.y}
        r="6"
        fill="none"
        stroke="var(--terra-accent-primary)"
        stroke-width="2"
        class="animate-ping opacity-75"
      />
      <circle
        cx={activePoint.x}
        cy={activePoint.y}
        r="3.5"
        fill="var(--terra-accent-primary)"
      />

      <!-- Tactical Tooltip Pin Box -->
      {@const tooltipX = Math.min(Math.max(activePoint.x - tooltipWidth / 2, padLeft), width - padRight - tooltipWidth)}
      {@const tooltipY = activePoint.y - tooltipHeight - 10 < padTop ? activePoint.y + 12 : activePoint.y - tooltipHeight - 10}
      <g
        transform="translate({tooltipX}, {tooltipY})"
        filter="url(#tooltip-shadow-{chartId})"
      >
        <!-- Box Chassis -->
        <rect
          width={tooltipWidth}
          height={tooltipHeight}
          fill="var(--terra-bg-surface)"
          stroke="var(--terra-border-strong)"
          stroke-width="1"
        />
        <!-- Left Tactical Indicator Bar -->
        <rect
          x="0"
          y="0"
          width="3"
          height={tooltipHeight}
          fill="var(--terra-accent-primary)"
        />
        <!-- Top-Right Micro Chamfer Accent -->
        <polygon
          points="{tooltipWidth - 8},0 {tooltipWidth},0 {tooltipWidth},8"
          fill="var(--terra-accent-primary)"
          opacity="0.6"
        />
        <!-- Timestamp & Node Label (Row 1) -->
        <text
          x="10"
          y="15"
          fill="var(--terra-text-secondary, #94a3b8)"
          font-family="var(--terra-font-mono, monospace)"
          font-size="8.5px"
          letter-spacing="0.04em"
        >
          {activePoint.timestamp} // {activePoint.label}
        </text>
        <!-- Telemetry Metric Value & Unit (Row 2) -->
        <text
          x="10"
          y="30"
          fill="var(--terra-text-primary, #ffffff)"
          font-family="var(--terra-font-mono, monospace)"
          font-size="12px"
          font-weight="700"
        >
          {activePoint.val.toFixed(1)}
          <tspan
            dx="4"
            font-size="8px"
            font-weight="600"
            fill="var(--terra-accent-primary, #00d8ff)"
          >
            {unit}
          </tspan>
        </text>
      </g>
    {/if}
  </svg>
</div>
