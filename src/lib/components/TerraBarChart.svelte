<script lang="ts">
  import { onMount } from 'svelte'
  import { X } from 'lucide-svelte'
  import { i18n } from '../i18n'
  import TerraRollingNumber from './TerraRollingNumber.svelte'

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
    barWidth = 36,
    animated = true,
    unit = '%',
    class: className = ''
  }: Props = $props()

  const isZh = $derived(i18n.locale === 'zh')
  let isMounted = $state(false)
  let hoveredBarIndex = $state<number | null>(null)
  let pinnedBarIndex = $state<number | null>(null)
  let barsRowEl: HTMLDivElement | undefined = $state()
  let cachedRect: { left: number; width: number } | null = null
  let pendingX = 0
  let rafId = 0

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
    if (status === 'normal') return 'var(--terra-text-primary)'
    if (value !== undefined) {
      const pct = (value / maxVal) * 100
      if (pct >= 85) return 'var(--terra-accent-danger)'
      if (pct >= 65) return 'var(--terra-accent-warning)'
    }
    return 'var(--terra-text-primary)'
  }

  function getStatusLabel(status?: 'normal' | 'warning' | 'critical', value?: number) {
    if (status === 'critical') return isZh ? '高载' : 'CRIT'
    if (status === 'warning') return isZh ? '偏高' : 'WARN'
    if (status === 'normal') return isZh ? '正常' : 'NORM'
    if (value !== undefined) {
      const pct = (value / maxVal) * 100
      if (pct >= 85) return isZh ? '高载' : 'CRIT'
      if (pct >= 65) return isZh ? '偏高' : 'WARN'
    }
    return isZh ? '正常' : 'NORM'
  }

  function indexFromClientX(clientX: number): number {
    if (!barsRowEl || data.length === 0) return 0
    if (!cachedRect) {
      const r = barsRowEl.getBoundingClientRect()
      cachedRect = { left: r.left, width: Math.max(1, r.width) }
    }
    const ratio = Math.max(0, Math.min(0.9999, (clientX - cachedRect.left) / cachedRect.width))
    return Math.floor(ratio * data.length)
  }

  function handlePointerEnter(e: PointerEvent) {
    if (barsRowEl) {
      const r = barsRowEl.getBoundingClientRect()
      cachedRect = { left: r.left, width: Math.max(1, r.width) }
    }
    hoveredBarIndex = indexFromClientX(e.clientX)
  }

  function handlePointerMove(e: PointerEvent) {
    pendingX = e.clientX
    if (rafId !== 0) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      hoveredBarIndex = indexFromClientX(pendingX)
    })
  }

  function handlePointerLeave() {
    if (rafId !== 0) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
    cachedRect = null
    hoveredBarIndex = null
  }

  const pinnedItem = $derived(
    pinnedBarIndex !== null && data[pinnedBarIndex] ? data[pinnedBarIndex] : null
  )
  const pinnedPercent = $derived(
    pinnedItem ? Math.min(100, Math.max(0, (pinnedItem.value / maxVal) * 100)) : 0
  )
</script>

<div
  class="isolate relative w-full bg-[var(--terra-bg-base)] border border-[var(--terra-border)] p-4 select-none {className}"
>
  <div
    class="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider mb-4 pb-2 border-b border-[var(--terra-border)]"
  >
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--terra-accent-primary)]"></span>
      <span class="text-[var(--terra-text-primary)] font-semibold">
        {isZh ? '子系统资源分布' : 'RESOURCE DISTRIBUTION'}
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span>MAX: {maxVal}{unit}</span>
      {#if pinnedItem}
        <button
          type="button"
          onclick={() => (pinnedBarIndex = null)}
          class="inline-flex items-center gap-1 text-[var(--terra-accent-primary)] hover:underline cursor-pointer"
        >
          <span>
            {isZh
              ? `参考: ${pinnedItem.label} (${pinnedItem.value}${unit})`
              : `REF: ${pinnedItem.label} (${pinnedItem.value}${unit})`}
          </span>
          <X class="w-3 h-3" />
        </button>
      {:else}
        <span>{isZh ? '点击柱体设为参考' : 'CLICK BAR TO COMPARE'}</span>
      {/if}
    </div>
  </div>

  <div
    bind:this={barsRowEl}
    role="region"
    aria-label={isZh ? '子系统资源分布柱状图' : 'Subsystem resource bars'}
    onpointerenter={handlePointerEnter}
    onpointermove={handlePointerMove}
    onpointerleave={handlePointerLeave}
    class="relative flex items-stretch gap-3 px-2"
    style="height: {height}px;"
  >
    <div class="pointer-events-none absolute inset-x-2 top-[30px] bottom-[32px] z-[2]">
      <div class="absolute inset-0 flex flex-col justify-between opacity-35">
        <div class="border-b border-dashed border-[var(--terra-border)] w-full"></div>
        <div class="border-b border-dashed border-[var(--terra-border)] w-full"></div>
        <div class="border-b border-dashed border-[var(--terra-border)] w-full"></div>
        <div class="border-b border-[var(--terra-border-strong)] w-full"></div>
      </div>

      {#if pinnedItem}
        <div
          aria-hidden="true"
          class="terra-bar-ref absolute left-0 right-0 border-t border-dashed border-[var(--terra-accent-primary)]"
          style="bottom: {pinnedPercent}%;"
        ></div>
      {/if}
    </div>

    {#each data as item, index (item.label)}
      {@const barPercent = Math.min(100, Math.max(0, (item.value / maxVal) * 100))}
      {@const barColor = getStatusColor(item.status, item.value)}
      {@const statusTag = getStatusLabel(item.status, item.value)}
      {@const isHovered = hoveredBarIndex === index}
      {@const isPinned = pinnedBarIndex === index}
      {@const dimmed = hoveredBarIndex !== null && !isHovered}
      {@const delta = pinnedItem && !isPinned ? item.value - pinnedItem.value : null}

      <button
        type="button"
        onfocus={() => (hoveredBarIndex = index)}
        onblur={() => {
          if (hoveredBarIndex === index) hoveredBarIndex = null
        }}
        onclick={() => (pinnedBarIndex = isPinned ? null : index)}
        class="terra-t-opacity relative flex-1 grid grid-rows-[30px_1fr_32px] justify-items-center h-full z-[1] cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra-accent-primary)] {dimmed
          ? 'opacity-45'
          : 'opacity-100'}"
      >
        <div
          class="terra-bar-val self-end pb-1 font-mono text-[10px] font-semibold tracking-tight tabular-nums leading-tight"
          style="
            color: {isHovered || isPinned
            ? 'var(--terra-accent-primary)'
            : 'var(--terra-text-primary)'};
            transform: translate3d(0, {isHovered ? '-2px' : '0px'}, 0);
          "
        >
          <TerraRollingNumber value={item.value} decimals={0} {unit} class="text-[10px]" />
          {#if delta !== null}
            <span class="block text-[10px] text-[var(--terra-accent-primary)] leading-none">
              {delta >= 0 ? `+${delta}` : delta}{unit}
            </span>
          {/if}
        </div>

        <div
          class="relative w-full h-full bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] flex items-end justify-center overflow-hidden"
          style="max-width: {barWidth * 1.4}px;"
        >
          <div
            class="terra-bar-fill w-full h-full origin-bottom"
            style="
              transform: scaleY({isExpanded ? barPercent / 100 : 0});
              background-color: {isPinned ? 'var(--terra-accent-primary)' : barColor};
              transition-delay: {Math.min(index * 35, 175)}ms;
            "
          ></div>
        </div>

        <div class="pt-1 text-center w-full leading-tight">
          <div
            class="font-mono text-[10px] font-semibold text-[var(--terra-text-secondary)] uppercase truncate"
          >
            {item.label}
          </div>
          <div class="font-mono text-[10px] text-[var(--terra-text-muted)]">
            {statusTag}
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .terra-bar-fill {
    transition:
      transform var(--terra-dur-chart) var(--terra-spring-smooth),
      background-color var(--terra-dur-fast) var(--terra-ease-out);
  }

  .terra-bar-val {
    transition:
      transform var(--terra-dur-base) var(--terra-spring-snappy),
      color var(--terra-dur-fast) var(--terra-ease-out);
  }

  .terra-bar-ref {
    transition: bottom var(--terra-dur-base) var(--terra-spring-snappy);
  }
</style>
