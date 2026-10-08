<script lang="ts">
  import { onMount } from 'svelte'

  interface BarItem {
    label: string
    value: number
    max?: number
    status?: 'normal' | 'warning' | 'critical'
  }

  interface Props {
    data: BarItem[]
    height?: number
    barWidth?: number
    animated?: boolean
    unit?: string
    class?: string
  }

  let {
    data = [],
    height = 180,
    barWidth = 28,
    animated = true,
    unit = '%',
    class: className = ''
  }: Props = $props()

  let isMounted = $state(false)
  let hoveredBarIndex = $state<number | null>(null)

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

  const maxVal = $derived.by(() => {
    if (data.length === 0) return 100
    const explicitMax = Math.max(...data.map((d) => d.max ?? 0))
    if (explicitMax > 0) return explicitMax
    const highestVal = Math.max(...data.map((d) => d.value))
    return Math.ceil(highestVal * 1.25) || 100
  })

  function getStatusColor(status?: 'normal' | 'warning' | 'critical', value?: number) {
    if (status === 'critical') return 'var(--terra-accent-danger)'
    if (status === 'warning') return 'var(--terra-accent-warning)'
    if (status === 'normal') return 'var(--terra-accent-primary)'

    // Auto status by percentage if not explicitly provided
    if (value !== undefined) {
      const pct = (value / maxVal) * 100
      if (pct >= 85) return 'var(--terra-accent-danger)'
      if (pct >= 65) return 'var(--terra-accent-warning)'
    }
    return 'var(--terra-accent-primary)'
  }

  function getStatusLabel(status?: 'normal' | 'warning' | 'critical', value?: number) {
    if (status) return status.toUpperCase()
    if (value !== undefined) {
      const pct = (value / maxVal) * 100
      if (pct >= 85) return 'CRIT'
      if (pct >= 65) return 'WARN'
    }
    return 'NOM'
  }
</script>

<div class="relative w-full bg-[var(--terra-bg-base)]/40 border border-[var(--terra-border)] p-4 select-none overflow-hidden {className}">
  <!-- Top Metric Bar -->
  <div class="flex items-center justify-between font-mono text-[9px] text-[var(--terra-text-muted)] tracking-wider mb-3 pb-2 border-b border-[var(--terra-border)]">
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 bg-[var(--terra-accent-primary)]"></span>
      <span class="text-[var(--terra-text-primary)] font-bold">HISTOGRAM // RESOURCE_LOAD</span>
    </div>
    <div class="flex items-center gap-3">
      <span>MAX: {maxVal}{unit}</span>
      {#if hoveredBarIndex !== null && data[hoveredBarIndex]}
        {@const hb = data[hoveredBarIndex]}
        <span class="text-[var(--terra-accent-primary)] font-bold">
          SELECTED: {hb.label} ({hb.value}{unit})
        </span>
      {:else}
        <span>GRID: 4-STAGE</span>
      {/if}
    </div>
  </div>

  <!-- Chart Area with Threshold Grid Lines -->
  <div class="relative flex items-end justify-between gap-2 px-2" style="height: {height}px;">
    <!-- Horizontal Threshold Guide Lines -->
    <div class="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-25">
      <div class="border-b border-dashed border-[var(--terra-accent-danger)] w-full"></div>
      <div class="border-b border-dashed border-[var(--terra-accent-warning)] w-full"></div>
      <div class="border-b border-dashed border-[var(--terra-border)] w-full"></div>
      <div class="border-b border-solid border-[var(--terra-border-strong)] w-full"></div>
    </div>

    <!-- Bars Loop -->
    {#each data as item, index}
      {@const barPercent = Math.min(100, Math.max(0, (item.value / maxVal) * 100))}
      {@const barColor = getStatusColor(item.status, item.value)}
      {@const statusTag = getStatusLabel(item.status, item.value)}
      {@const isHovered = hoveredBarIndex === index}

      <div
        class="relative flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-pointer"
        onpointerenter={() => (hoveredBarIndex = index)}
        onpointerleave={() => (hoveredBarIndex = null)}
        role="presentation"
      >
        <!-- Bar Hover Value Tag -->
        <div
          class="font-mono text-[10px] font-bold tracking-tight mb-1 transition-all duration-200"
          style="
            color: {barColor};
            transform: {isHovered ? 'translateY(-3px)' : 'none'};
          "
        >
          {item.value}<span class="text-[8px] font-normal">{unit}</span>
        </div>

        <!-- Bar Track & Fill with 45° Chamfer Cut -->
        <div
          class="relative w-full bg-black/20 dark:bg-white/5 border-x border-[var(--terra-border)] flex items-end justify-center overflow-hidden"
          style="max-width: {barWidth * 1.5}px; height: 100%;"
        >
          <!-- Internal Bar Column -->
          <div
            class="w-full transition-all duration-700 ease-out"
            style="
              height: {isExpanded ? barPercent : 0}%;
              background-color: {barColor};
              clip-path: polygon(0% 0%, calc(100% - 6px) 0%, 100% 6px, 100% 100%, 0% 100%);
              transition-delay: {index * 50}ms;
              opacity: {isHovered ? 1 : 0.85};
              filter: {isHovered ? `drop-shadow(0 0 10px ${barColor})` : 'none'};
            "
          >
            <!-- Tactical Inner Bar Hazard Stripes on Warning/Critical -->
            {#if item.status === 'critical' || item.status === 'warning'}
              <div class="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.5)_0px,rgba(0,0,0,0.5)_3px,transparent_3px,transparent_6px)]"></div>
            {/if}
          </div>
        </div>

        <!-- Bottom Axis Label -->
        <div class="mt-2 text-center w-full">
          <div class="font-mono text-[9px] font-bold text-[var(--terra-text-secondary)] uppercase truncate">
            {item.label}
          </div>
          <div class="font-mono text-[8px] text-[var(--terra-text-muted)] tracking-tighter">
            {statusTag}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
