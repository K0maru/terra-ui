<script lang="ts">
  import { onMount } from 'svelte'

  interface DonutSegment {
    label: string
    value: number
    color?: string
    code?: string
  }

  interface Props {
    data: DonutSegment[]
    size?: number
    thickness?: number
    title?: string
    unit?: string
    animated?: boolean
    showLegend?: boolean
    class?: string
  }

  let {
    data = [],
    size = 200,
    thickness = 22,
    title = 'SYSTEM LOAD',
    unit = '%',
    animated = true,
    showLegend = true,
    class: className = ''
  }: Props = $props()

  const defaultColors = [
    'var(--terra-accent-primary)',
    'var(--terra-accent-secondary)',
    'var(--terra-accent-warning)',
    'var(--terra-accent-success)',
    '#a855f7',
    '#ec4899'
  ]

  let isMounted = $state(false)
  let activeIndex = $state<number | null>(null)

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
  const total = $derived(data.reduce((sum, item) => sum + item.value, 0))
  const radius = $derived((size - thickness) / 2)
  const circumference = $derived(2 * Math.PI * radius)
  const center = $derived(size / 2)

  // Compute SVG segment stroke offsets
  const segments = $derived.by(() => {
    let accumulated = 0
    return data.map((item, index) => {
      const fraction = total > 0 ? item.value / total : 0
      const strokeLength = isExpanded ? fraction * circumference : 0
      const gapLength = circumference - strokeLength
      const offset = -accumulated * circumference
      const color = item.color || defaultColors[index % defaultColors.length]
      const code = item.code || `SEC-${String(index + 1).padStart(2, '0')}`
      const percent = (fraction * 100).toFixed(1)

      accumulated += fraction

      return {
        ...item,
        index,
        color,
        code,
        percent,
        strokeDasharray: `${strokeLength} ${gapLength}`,
        strokeDashoffset: offset
      }
    })
  })

  const currentDisplay = $derived.by(() => {
    if (activeIndex !== null && segments[activeIndex]) {
      const item = segments[activeIndex]
      return {
        value: item.value,
        label: item.label,
        code: item.code,
        sub: `${item.percent}%`,
        color: item.color
      }
    }
    return {
      value: total,
      label: title,
      code: 'SYS // ALL',
      sub: `${data.length} NODES`,
      color: 'var(--terra-text-primary)'
    }
  })
</script>

<div class="flex flex-col md:flex-row items-center gap-6 select-none {className}">
  <!-- Donut SVG Radar Instrument -->
  <div class="relative shrink-0 flex items-center justify-center" style="width: {size}px; height: {size}px;">
    <!-- Outer Polar HUD Ring -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 {size} {size}">
      <!-- Outer dashed guide circle -->
      <circle
        cx={center}
        cy={center}
        r={center - 2}
        fill="none"
        stroke="var(--terra-border)"
        stroke-width="1"
        stroke-dasharray="3 3"
      />
      <!-- Polar crosshairs -->
      <line x1={center} y1={2} x2={center} y2={8} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
      <line x1={center} y1={size - 8} x2={center} y2={size - 2} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
      <line x1={2} y1={center} x2={8} y2={center} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
      <line x1={size - 8} y1={center} x2={size - 2} y2={center} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
    </svg>

    <!-- Interactive Segments Circle -->
    <svg
      class="w-full h-full transform -rotate-90"
      viewBox="0 0 {size} {size}"
    >
      <!-- Background Track Circle -->
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--terra-border)"
        stroke-width={thickness}
        opacity="0.25"
      />

      <!-- Segments -->
      {#each segments as seg (seg.index)}
        {@const isActive = activeIndex === seg.index}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={seg.color}
          stroke-width={isActive ? thickness + 4 : thickness}
          stroke-dasharray={seg.strokeDasharray}
          stroke-dashoffset={seg.strokeDashoffset}
          stroke-linecap="butt"
          class="cursor-pointer transition-all duration-300"
          style="
            filter: {isActive ? `drop-shadow(0 0 8px ${seg.color})` : 'none'};
            transition: stroke-dasharray 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.2s ease;
          "
          onpointerenter={() => activeIndex = seg.index}
          onpointerleave={() => activeIndex = null}
          role="presentation"
        />
      {/each}
    </svg>

    <!-- Center Telemetry Readout -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4"
      style="transform-style: preserve-3d;"
    >
      <span class="font-mono text-[9px] uppercase tracking-wider text-[var(--terra-text-muted)] leading-none mb-1">
        {currentDisplay.code}
      </span>
      <div class="font-display font-black text-2xl sm:text-3xl tracking-tight leading-none text-[var(--terra-text-primary)]">
        {currentDisplay.value}<span class="font-mono text-xs font-normal text-[var(--terra-text-secondary)] ml-0.5">{unit}</span>
      </div>
      <div class="font-mono text-[10px] font-bold tracking-wider mt-1 truncate max-w-[110px]" style="color: {currentDisplay.color};">
        {currentDisplay.label}
      </div>
      <div class="font-mono text-[9px] text-[var(--terra-text-muted)] mt-0.5">
        {currentDisplay.sub}
      </div>
    </div>
  </div>

  <!-- Tactical Legend Bay -->
  {#if showLegend}
    <div class="flex-1 w-full flex flex-col gap-2 font-mono text-xs min-w-[180px]">
      <div class="flex items-center justify-between pb-1 border-b border-[var(--terra-border)] text-[9px] text-[var(--terra-text-muted)] tracking-wider">
        <span>SECTOR / TARGET</span>
        <span>LOAD / RATIO</span>
      </div>

      {#each segments as seg (seg.index)}
        {@const isActive = activeIndex === seg.index}
        <button
          type="button"
          class="flex items-center justify-between px-2.5 py-1.5 border transition-all duration-150 text-left w-full cursor-pointer {isActive ? 'border-[var(--terra-border-strong)] bg-white/5' : 'border-transparent hover:border-[var(--terra-border)] hover:bg-white/[0.02]'}"
          onpointerenter={() => activeIndex = seg.index}
          onpointerleave={() => activeIndex = null}
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="w-2.5 h-2.5 shrink-0 transition-transform duration-200"
              style="background-color: {seg.color}; transform: {isActive ? 'scale(1.3)' : 'scale(1)'};"
            ></span>
            <div class="flex flex-col min-w-0">
              <span class="font-bold text-[11px] truncate text-[var(--terra-text-primary)]">
                {seg.label}
              </span>
              <span class="text-[9px] text-[var(--terra-text-muted)]">
                {seg.code}
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end shrink-0 pl-2">
            <span class="font-bold text-[var(--terra-text-primary)]">
              {seg.value}{unit}
            </span>
            <span class="text-[10px] text-[var(--terra-accent-secondary)]">
              {seg.percent}%
            </span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
