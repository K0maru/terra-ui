<script lang="ts">
  import { onMount } from 'svelte'
  import TerraRollingNumber from './TerraRollingNumber.svelte'

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
    'var(--terra-text-primary)',
    'color-mix(in srgb, var(--terra-accent-primary) 55%, var(--terra-text-primary))',
    'var(--terra-accent-success)',
    'var(--terra-accent-warning)',
    'var(--terra-text-muted)'
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
  const haloPadding = $derived(Math.max(16, thickness * 0.75))
  const center = $derived(size / 2)
  const radius = $derived((size - thickness - haloPadding * 2) / 2)
  const circumference = $derived(2 * Math.PI * radius)
  const outerReticleRadius = $derived(center - 4)

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

<div class="isolate flex flex-col md:flex-row items-center gap-6 select-none {className}">
  <div
    class="relative shrink-0 flex items-center justify-center"
    style="width: {size}px; height: {size}px;"
  >
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none opacity-45 overflow-visible"
      viewBox="0 0 {size} {size}"
    >
      <circle
        cx={center}
        cy={center}
        r={outerReticleRadius}
        fill="none"
        stroke="var(--terra-border)"
        stroke-width="1"
        stroke-dasharray="3 3"
      />
      <line
        x1={center}
        y1={center - outerReticleRadius}
        x2={center}
        y2={center - outerReticleRadius + 6}
        stroke="var(--terra-accent-primary)"
        stroke-width="1.5"
      />
      <line
        x1={center}
        y1={center + outerReticleRadius - 6}
        x2={center}
        y2={center + outerReticleRadius}
        stroke="var(--terra-accent-primary)"
        stroke-width="1.5"
      />
      <line
        x1={center - outerReticleRadius}
        y1={center}
        x2={center - outerReticleRadius + 6}
        y2={center}
        stroke="var(--terra-accent-primary)"
        stroke-width="1.5"
      />
      <line
        x1={center + outerReticleRadius - 6}
        y1={center}
        x2={center + outerReticleRadius}
        y2={center}
        stroke="var(--terra-accent-primary)"
        stroke-width="1.5"
      />
    </svg>

    <svg
      role="region"
      aria-label={title}
      class="w-full h-full transform -rotate-90 overflow-visible"
      viewBox="0 0 {size} {size}"
      onpointerleave={() => (activeIndex = null)}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--terra-border)"
        stroke-width={thickness}
        opacity="0.25"
      />

      {#each segments as seg (seg.index)}
        {@const isActive = activeIndex === seg.index}
        {@const dimmed = activeIndex !== null && !isActive}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={seg.color}
          stroke-width={isActive ? thickness + 3 : thickness}
          stroke-dasharray={seg.strokeDasharray}
          stroke-dashoffset={seg.strokeDashoffset}
          stroke-linecap="butt"
          opacity={dimmed ? 0.42 : 1}
          class="terra-donut-seg cursor-pointer"
          onpointerenter={() => (activeIndex = seg.index)}
          role="presentation"
        />
      {/each}
    </svg>

    <div
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4"
    >
      <span
        class="font-mono text-[10px] uppercase tracking-wider text-[var(--terra-text-muted)] leading-none mb-1"
      >
        {currentDisplay.code}
      </span>
      <div class="text-2xl sm:text-3xl leading-none text-[var(--terra-text-primary)]">
        <TerraRollingNumber value={currentDisplay.value} decimals={0} {unit} />
      </div>
      <div
        class="terra-t-color font-mono text-[10px] font-bold tracking-wider mt-1 truncate max-w-[110px]"
        style="color: {currentDisplay.color};"
      >
        {currentDisplay.label}
      </div>
      <div class="font-mono text-[10px] text-[var(--terra-text-muted)] mt-0.5">
        {currentDisplay.sub}
      </div>
    </div>
  </div>

  {#if showLegend}
    <div
      role="region"
      aria-label={title}
      class="flex-1 w-full flex flex-col gap-1.5 font-mono text-xs min-w-[180px]"
      onpointerleave={() => (activeIndex = null)}
    >
      <div
        class="flex items-center justify-between pb-1 border-b border-[var(--terra-border)] text-[10px] text-[var(--terra-text-muted)] tracking-wider"
      >
        <span>SECTOR / TARGET</span>
        <span>LOAD / RATIO</span>
      </div>

      {#each segments as seg (seg.index)}
        {@const isActive = activeIndex === seg.index}
        <button
          type="button"
          class="terra-t-color flex items-center justify-between px-2.5 py-1.5 border text-left w-full cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)] {isActive
            ? 'border-[var(--terra-border-strong)] bg-[var(--terra-bg-surface-hover)]'
            : 'border-transparent hover:border-[var(--terra-border)] hover:bg-[var(--terra-bg-surface-hover)]/50'}"
          onpointerenter={() => (activeIndex = seg.index)}
          onfocus={() => (activeIndex = seg.index)}
          onblur={() => {
            if (activeIndex === seg.index) activeIndex = null
          }}
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="terra-t-snappy w-2.5 h-2.5 shrink-0"
              style="background-color: {seg.color}; transform: scale({isActive ? 1.25 : 1});"
            ></span>
            <div class="flex flex-col min-w-0">
              <span class="font-bold text-[11px] truncate text-[var(--terra-text-primary)]">
                {seg.label}
              </span>
              <span class="text-[10px] text-[var(--terra-text-muted)]">
                {seg.code}
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end shrink-0 pl-2">
            <span class="font-bold text-[var(--terra-text-primary)] tabular-nums">
              {seg.value}{unit}
            </span>
            <span class="text-[10px] text-[var(--terra-text-secondary)] tabular-nums">
              {seg.percent}%
            </span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .terra-donut-seg {
    transition:
      stroke-dasharray var(--terra-dur-chart) var(--terra-spring-smooth),
      stroke-dashoffset var(--terra-dur-chart) var(--terra-spring-smooth),
      stroke-width var(--terra-dur-fast) var(--terra-ease-out),
      opacity var(--terra-dur-fast) var(--terra-ease-out);
  }
</style>
