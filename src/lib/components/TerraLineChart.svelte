<script lang="ts">
  import { onMount } from 'svelte'
  import { Spring } from 'svelte/motion'
  import { i18n } from '../i18n'
  import { SPRING } from '../motion'

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
    fillOpacity = 0.14,
    showGrid = true,
    showCrosshair = true,
    animated = true,
    unit = '',
    class: className = ''
  }: Props = $props()

  const isZh = $derived(i18n.locale === 'zh')
  const chartId = Math.random().toString(36).slice(2, 9)
  const width = 600
  const padLeft = 44
  const padRight = 16
  const padTop = 18
  const padBottom = 26

  let isMounted = $state(false)
  let hoveredPointIndex = $state<number | null>(null)
  let pinnedPointIndex = $state<number | null>(null)
  let pinPulseCount = $state(0)
  let svgElement = $state<SVGSVGElement | null>(null)
  let plotWidthPx = $state(600)
  let plotHeightPx = $state(160)
  let tipContentW = $state(0)
  let tipContentH = $state(0)
  let snapNextTipSize = true
  let cachedSvgRect: { left: number; width: number } | null = null

  const crosshairXSpring = new Spring(padLeft, SPRING.pointer)
  const crosshairYSpring = new Spring(padTop, SPRING.pointer)
  const tipW = new Spring(132, SPRING.pointer)
  const tipH = new Spring(44, SPRING.pointer)

  onMount(() => {
    if (!animated) {
      isMounted = true
      return
    }
    const timer = setTimeout(() => {
      isMounted = true
    }, 40)
    return () => clearTimeout(timer)
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
        timestamp: d.timestamp || `T+${i}`,
        label: d.label || `N-${i + 1}`
      }
    })
  })

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
    return `${linePath} L ${points[points.length - 1].x},${bottomY} L ${points[0].x},${bottomY} Z`
  })

  const yTicks = $derived([
    { val: maxVal, y: padTop },
    { val: Math.round((maxVal + minVal) / 2), y: padTop + plotHeight / 2 },
    { val: minVal, y: padTop + plotHeight }
  ])

  const xTicks = $derived.by(() => {
    if (points.length === 0) return []
    if (points.length === 1) return [{ pt: points[0], anchor: 'middle' as const }]
    const minGap = 75
    const sampled: Array<{ pt: (typeof points)[0]; anchor: 'start' | 'middle' | 'end' }> = [
      { pt: points[0], anchor: 'start' }
    ]
    const lastPt = points[points.length - 1]
    let prevX = points[0].x
    for (let i = 1; i < points.length - 1; i++) {
      const pt = points[i]
      if (pt.x - prevX >= minGap && lastPt.x - pt.x >= minGap) {
        sampled.push({ pt, anchor: 'middle' })
        prevX = pt.x
      }
    }
    if (lastPt.x - prevX >= minGap * 0.5) {
      sampled.push({ pt: lastPt, anchor: 'end' })
    }
    return sampled
  })

  function setHoverIndex(idx: number | null) {
    const wasNull = hoveredPointIndex === null
    hoveredPointIndex = idx
    if (idx !== null && points[idx]) {
      const pt = points[idx]
      if (wasNull) {
        crosshairXSpring.set(pt.x, { instant: true })
        crosshairYSpring.set(pt.y, { instant: true })
      } else {
        crosshairXSpring.target = pt.x
        crosshairYSpring.target = pt.y
      }
    }
  }

  function handlePointerEnter() {
    if (!svgElement) return
    const rect = svgElement.getBoundingClientRect()
    cachedSvgRect = { left: rect.left, width: Math.max(1, rect.width) }
  }

  function handlePointerMove(e: PointerEvent) {
    if (!svgElement || points.length === 0) return
    if (!cachedSvgRect) {
      const rect = svgElement.getBoundingClientRect()
      cachedSvgRect = { left: rect.left, width: Math.max(1, rect.width) }
    }
    const mouseX = ((e.clientX - cachedSvgRect.left) / cachedSvgRect.width) * width
    let closestIdx = 0
    let minDiff = Infinity
    for (let i = 0; i < points.length; i++) {
      const diff = Math.abs(points[i].x - mouseX)
      if (diff < minDiff) {
        minDiff = diff
        closestIdx = i
      }
    }
    setHoverIndex(closestIdx)
  }

  function handlePointerLeave() {
    cachedSvgRect = null
    setHoverIndex(null)
  }

  function togglePin(idx: number | null) {
    if (idx === null) return
    pinnedPointIndex = pinnedPointIndex === idx ? null : idx
    if (pinnedPointIndex !== null) {
      pinPulseCount += 1
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (points.length === 0) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setHoverIndex(
        hoveredPointIndex === null ? 0 : Math.min(points.length - 1, hoveredPointIndex + 1)
      )
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setHoverIndex(
        hoveredPointIndex === null ? points.length - 1 : Math.max(0, hoveredPointIndex - 1)
      )
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      togglePin(hoveredPointIndex)
    } else if (e.key === 'Escape') {
      pinnedPointIndex = null
    }
  }

  const activePoint = $derived(
    hoveredPointIndex !== null && points[hoveredPointIndex] ? points[hoveredPointIndex] : null
  )
  const pinnedPoint = $derived(
    pinnedPointIndex !== null && points[pinnedPointIndex] ? points[pinnedPointIndex] : null
  )
  const deltaText = $derived.by(() => {
    if (!activePoint || !pinnedPoint || hoveredPointIndex === pinnedPointIndex) return ''
    const diff = activePoint.val - pinnedPoint.val
    const sign = diff >= 0 ? '+' : ''
    return `${sign}${diff.toFixed(1)}${unit ? ` ${unit}` : ''}`
  })

  $effect(() => {
    if (!activePoint) {
      snapNextTipSize = true
      return
    }
    if (tipContentW > 0 && tipContentH > 0) {
      if (snapNextTipSize) {
        tipW.set(tipContentW, { instant: true })
        tipH.set(tipContentH, { instant: true })
        snapNextTipSize = false
      } else {
        tipW.target = tipContentW
        tipH.target = tipContentH
      }
    }
  })

  const tipPixelX = $derived((crosshairXSpring.current / width) * plotWidthPx)
  const tipPixelY = $derived((crosshairYSpring.current / height) * plotHeightPx)
  const effectiveTipW = $derived(tipContentW > 0 ? tipContentW : tipW.current)
  const tipLeftPx = $derived(
    Math.max(8, Math.min(plotWidthPx - effectiveTipW - 8, tipPixelX - effectiveTipW * 0.5))
  )
  const tipTopPx = $derived(tipPixelY < 54 ? tipPixelY + 12 : Math.max(4, tipPixelY - 52))
</script>

<div
  class="isolate relative w-full bg-[var(--terra-bg-base)] border border-[var(--terra-border)] p-3.5 select-none {className}"
>
  <div
    class="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider mb-2 pb-2 border-b border-[var(--terra-border)]"
  >
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--terra-accent-primary)]"></span>
      <span class="text-[var(--terra-text-primary)] font-semibold">
        {isZh ? '时序波形采样' : 'SERIES STREAM'}
      </span>
    </div>

    <div class="flex items-center gap-3">
      {#if pinnedPoint}
        <button
          type="button"
          onclick={() => (pinnedPointIndex = null)}
          class="text-[var(--terra-accent-primary)] hover:underline cursor-pointer"
        >
          {isZh
            ? `基线: ${pinnedPoint.val.toFixed(1)} (清除)`
            : `PIN: ${pinnedPoint.val.toFixed(1)} (CLEAR)`}
        </button>
      {:else}
        <span>{isZh ? '点击节点锚定基线' : 'CLICK NODE TO PIN'}</span>
      {/if}

      {#if activePoint}
        <span class="text-[var(--terra-text-primary)] font-semibold tabular-nums">
          {activePoint.val.toFixed(1)}{unit ? ` ${unit}` : ''}
          {#if deltaText}
            <span class="text-[var(--terra-accent-primary)] ml-1">({deltaText})</span>
          {/if}
        </span>
      {/if}
    </div>
  </div>

  <div
    class="relative w-full focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)] cursor-crosshair"
    bind:clientWidth={plotWidthPx}
    bind:clientHeight={plotHeightPx}
    role="slider"
    tabindex="0"
    aria-roledescription="chart"
    aria-label={isZh ? '交互式时序折线图' : 'Interactive line chart'}
    aria-valuemin={0}
    aria-valuemax={Math.max(0, points.length - 1)}
    aria-valuenow={hoveredPointIndex ?? 0}
    aria-valuetext={activePoint ? `${activePoint.timestamp}: ${activePoint.val}${unit}` : undefined}
    onpointerenter={handlePointerEnter}
    onpointermove={handlePointerMove}
    onpointerleave={handlePointerLeave}
    onclick={() => togglePin(hoveredPointIndex)}
    onkeydown={handleKeyDown}
  >
    <svg
      bind:this={svgElement}
      viewBox="0 0 {width} {height}"
      class="w-full h-auto overflow-visible pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="area-grad-{chartId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={color} stop-opacity={fillOpacity} />
          <stop offset="100%" stop-color={color} stop-opacity="0" />
        </linearGradient>
      </defs>

      {#if showGrid}
        {#each yTicks as tick (tick.val)}
          <line
            x1={padLeft}
            y1={tick.y}
            x2={width - padRight}
            y2={tick.y}
            stroke="var(--terra-border)"
            stroke-width="1"
            stroke-dasharray="2 4"
          />
          <text
            x={padLeft - 8}
            y={tick.y + 3}
            text-anchor="end"
            fill="var(--terra-text-muted)"
            font-family="var(--terra-font-mono)"
            font-size="10px"
          >
            {tick.val}
          </text>
        {/each}

        <line
          x1={padLeft}
          y1={padTop + plotHeight}
          x2={width - padRight}
          y2={padTop + plotHeight}
          stroke="var(--terra-border-strong)"
          stroke-width="1"
        />

        {#each xTicks as tick (tick.pt.timestamp)}
          <line
            x1={tick.pt.x}
            y1={padTop}
            x2={tick.pt.x}
            y2={padTop + plotHeight}
            stroke="var(--terra-border)"
            stroke-width="1"
            stroke-dasharray="1 5"
          />
          <text
            x={tick.pt.x}
            y={padTop + plotHeight + 14}
            text-anchor={tick.anchor}
            fill="var(--terra-text-muted)"
            font-family="var(--terra-font-mono)"
            font-size="10px"
          >
            {tick.pt.timestamp}
          </text>
        {/each}
      {/if}

      {#if areaPath}
        <path
          d={areaPath}
          fill="url(#area-grad-{chartId})"
          class="terra-t-opacity"
          style="opacity: {isExpanded ? 1 : 0};"
        />
      {/if}

      {#if linePath}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="terra-line-stroke"
          style="
            stroke-dasharray: 2000;
            stroke-dashoffset: {isExpanded ? 0 : 2000};
          "
        />
      {/if}

      {#if showCrosshair && activePoint}
        <line
          x1={crosshairXSpring.current}
          y1={padTop}
          x2={crosshairXSpring.current}
          y2={padTop + plotHeight}
          stroke="var(--terra-border-strong)"
          stroke-width="1"
          stroke-dasharray="3 3"
        />
        <line
          x1={padLeft}
          y1={crosshairYSpring.current}
          x2={width - padRight}
          y2={crosshairYSpring.current}
          stroke="var(--terra-border-strong)"
          stroke-width="1"
          stroke-dasharray="3 3"
        />
      {/if}

      {#if pinnedPoint}
        <line
          x1={padLeft}
          y1={pinnedPoint.y}
          x2={width - padRight}
          y2={pinnedPoint.y}
          stroke="var(--terra-text-primary)"
          stroke-width="1"
          stroke-dasharray="4 3"
          opacity="0.7"
        />
        {#key pinPulseCount}
          <circle
            cx={pinnedPoint.x}
            cy={pinnedPoint.y}
            r="6"
            fill="var(--terra-bg-base)"
            stroke="var(--terra-text-primary)"
            stroke-width="2"
            class="terra-pin-ring"
          />
        {/key}
      {/if}

      {#each points as pt, idx (idx)}
        {@const isCurrent = hoveredPointIndex === idx}
        <g class="pointer-events-none">
          <circle
            cx={pt.x}
            cy={pt.y}
            r="2.8"
            fill={isCurrent ? color : 'var(--terra-bg-base)'}
            stroke={color}
            stroke-width="1.5"
            class="terra-line-dot"
            style="transform: scale({isCurrent ? 1.45 : 1});"
          />
        </g>
      {/each}
    </svg>

    {#if showCrosshair}
      <div
        aria-hidden={!activePoint}
        class="terra-line-tooltip pointer-events-none absolute top-0 left-0 z-[9] overflow-hidden bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)] border-l-2 border-[var(--terra-accent-primary)] font-mono whitespace-nowrap"
        style="
          opacity: {activePoint ? 1 : 0};
          width: {tipW.current > 0 ? `${tipW.current.toFixed(1)}px` : 'auto'};
          height: {tipH.current > 0 ? `${tipH.current.toFixed(1)}px` : 'auto'};
          transform: translate3d({tipLeftPx.toFixed(1)}px, {tipTopPx.toFixed(1)}px, 0);
        "
      >
        {#if activePoint}
          <div
            bind:clientWidth={tipContentW}
            bind:clientHeight={tipContentH}
            class="w-max px-2.5 py-1.5"
          >
            <div class="text-[10px] opacity-80 leading-tight">
              {activePoint.timestamp} · {activePoint.label}
            </div>
            <div class="text-xs font-bold tabular-nums leading-tight mt-0.5">
              {activePoint.val.toFixed(1)}{unit ? ` ${unit}` : ''}{deltaText
                ? ` (${deltaText})`
                : ''}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .terra-line-stroke {
    transition: stroke-dashoffset var(--terra-dur-chart) var(--terra-ease-out);
  }

  .terra-line-dot {
    transform-box: fill-box;
    transform-origin: center;
    transition:
      transform var(--terra-dur-base) var(--terra-spring-snappy),
      fill var(--terra-dur-fast) var(--terra-ease-out);
  }

  .terra-line-tooltip {
    transition: opacity var(--terra-dur-fast) var(--terra-ease-out);
  }

  @keyframes terraPinPop {
    from {
      transform: scale(0.5);
    }
    to {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .terra-pin-ring {
      transform-box: fill-box;
      transform-origin: center;
      animation: terraPinPop var(--terra-dur-slow) var(--terra-spring-bouncy) both;
    }
  }
</style>
