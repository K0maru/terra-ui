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
    class: className = ''
  }: Props = $props()

  const chartId = Math.random().toString(36).substring(2, 9)
  const width = 600
  const padLeft = 46
  const padRight = 16
  const padTop = 18
  const padBottom = 26

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
          class="font-mono text-[9px] fill-[var(--terra-text-muted)] font-semibold"
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

      <!-- Vertical CAD Ticks -->
      {#each points as pt, i}
        {#if i % Math.max(1, Math.floor(points.length / 5)) === 0}
          <line
            x1={pt.x}
            y1={padTop}
            x2={pt.x}
            y2={padTop + plotHeight}
            stroke="var(--terra-border)"
            stroke-width="1"
            stroke-dasharray="1 5"
            opacity="0.3"
          />
          <text
            x={pt.x}
            y={padTop + plotHeight + 14}
            text-anchor="middle"
            class="font-mono text-[8px] fill-[var(--terra-text-muted)]"
          >
            {pt.timestamp}
          </text>
        {/if}
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
      <g transform="translate({Math.min(Math.max(activePoint.x - 45, padLeft), width - padRight - 90)}, {Math.max(activePoint.y - 42, padTop)})">
        <rect
          width="90"
          height="32"
          fill="var(--terra-bg-surface)"
          stroke="var(--terra-border-accent)"
          stroke-width="1"
          class="shadow-lg"
        />
        <text x="6" y="13" class="font-mono text-[8px] fill-[var(--terra-text-muted)] tracking-wider">
          {activePoint.timestamp} // {activePoint.label}
        </text>
        <text x="6" y="26" class="font-mono text-[11px] font-bold fill-[var(--terra-text-primary)]">
          {activePoint.val.toFixed(1)} <tspan class="text-[8px] fill-[var(--terra-accent-primary)] font-normal">VAL</tspan>
        </text>
      </g>
    {/if}
  </svg>
</div>
