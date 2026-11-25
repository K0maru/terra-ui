<script lang="ts" module>
  export interface StatusDayRecord {
    date: string
    status: 'operational' | 'degraded' | 'outage' | 'empty'
    uptime?: number
    description?: string
  }

  function generateDefaultDays(count: number): StatusDayRecord[] {
    const list: StatusDayRecord[] = []
    const baseMs = Date.UTC(2026, 10, 25)

    for (let i = count - 1; i >= 0; i--) {
      const dateStr = new Date(baseMs - i * 86_400_000).toISOString().slice(0, 10)
      let status: StatusDayRecord['status'] = 'operational'
      let uptime = 99.96
      let description = '100% OPERATIONAL'

      if (i === 14) {
        status = 'degraded'
        uptime = 98.42
        description = 'LATENCY ELEVATED (RESOLVED)'
      } else if (i === 48) {
        status = 'outage'
        uptime = 94.1
        description = 'PARTIAL ROUTING OUTAGE (18m)'
      } else if (i % 7 === 0) {
        uptime = 99.89
      }

      list.push({ date: dateStr, status, uptime, description })
    }
    return list
  }
</script>

<script lang="ts">
  import { Spring } from 'svelte/motion'
  import { i18n } from '../i18n'
  import { SPRING } from '../motion'

  interface Props {
    data?: StatusDayRecord[]
    serviceName?: string
    days?: number
    barHeight?: number
    showSummary?: boolean
    showTimelineLabels?: boolean
    onbarclick?: (day: StatusDayRecord) => void
    class?: string
  }

  let {
    data,
    serviceName = 'GLOBAL_EDGE_ROUTER',
    days = 90,
    barHeight = 30,
    showSummary = true,
    showTimelineLabels = true,
    onbarclick,
    class: className = ''
  }: Props = $props()

  const isZh = $derived(i18n.locale === 'zh')
  const records = $derived(data && data.length > 0 ? data.slice(-days) : generateDefaultDays(days))

  const overallUptime = $derived.by(() => {
    if (records.length === 0) return '100.00%'
    const valid = records.filter((r) => r.uptime !== undefined)
    if (valid.length === 0) return '100.00%'
    const sum = valid.reduce((acc, cur) => acc + (cur.uptime ?? 100), 0)
    return `${(sum / valid.length).toFixed(2)}%`
  })

  const latestStatus = $derived(
    records.length > 0 ? records[records.length - 1].status : 'operational'
  )

  let stripEl: HTMLDivElement | undefined = $state()
  let stripWidth = $state(400)
  let activeIndex = $state<number | null>(null)
  let lastRecord = $state<StatusDayRecord | null>(null)
  let tipContentW = $state(0)
  let tipContentH = $state(0)
  let snapNextSize = true

  const tipX = new Spring(200, SPRING.pointer)
  const tipW = new Spring(140, SPRING.pointer)
  const tipH = new Spring(44, SPRING.pointer)
  let cachedRect: { left: number; width: number } | null = null
  let pendingX = 0
  let rafId = 0

  const activeRecord = $derived(
    activeIndex !== null && records[activeIndex] ? records[activeIndex] : null
  )
  const displayRecord = $derived(activeRecord ?? lastRecord)

  $effect(() => {
    if (activeRecord) {
      lastRecord = activeRecord
    }
  })

  $effect(() => {
    if (!activeRecord) {
      snapNextSize = true
      return
    }
    if (tipContentW > 0 && tipContentH > 0) {
      if (snapNextSize) {
        tipW.set(tipContentW, { instant: true })
        tipH.set(tipContentH, { instant: true })
        snapNextSize = false
      } else {
        tipW.target = tipContentW
        tipH.target = tipContentH
      }
    }
  })

  function setIndex(nextIdx: number | null) {
    if (nextIdx === null) {
      activeIndex = null
      return
    }
    const wasNull = activeIndex === null
    activeIndex = nextIdx
    const ratio = (nextIdx + 0.5) / Math.max(1, records.length)
    const effectiveW = tipContentW > 0 ? tipContentW : tipW.current
    const halfTip = Math.min(stripWidth * 0.45, Math.max(56, effectiveW * 0.5 + 4))
    const nextPx = Math.max(halfTip, Math.min(stripWidth - halfTip, ratio * stripWidth))
    if (wasNull) {
      tipX.set(nextPx, { instant: true })
    } else {
      tipX.target = nextPx
    }
  }

  function indexFromClientX(clientX: number): number {
    if (!stripEl || records.length === 0) return 0
    if (!cachedRect) {
      const r = stripEl.getBoundingClientRect()
      cachedRect = { left: r.left, width: Math.max(1, r.width) }
    }
    const ratio = Math.max(0, Math.min(0.9999, (clientX - cachedRect.left) / cachedRect.width))
    return Math.floor(ratio * records.length)
  }

  function handlePointerEnter(e: PointerEvent) {
    if (stripEl) {
      const r = stripEl.getBoundingClientRect()
      cachedRect = { left: r.left, width: Math.max(1, r.width) }
    }
    setIndex(indexFromClientX(e.clientX))
  }

  function handlePointerMove(e: PointerEvent) {
    pendingX = e.clientX
    if (rafId !== 0) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      setIndex(indexFromClientX(pendingX))
    })
  }

  function handlePointerLeave() {
    if (rafId !== 0) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
    cachedRect = null
    setIndex(null)
  }

  function handleClick(e: MouseEvent) {
    if (records.length === 0) return
    const idx = activeIndex ?? indexFromClientX(e.clientX)
    const target = records[idx]
    if (target) onbarclick?.(target)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (records.length === 0) return
    const cur = activeIndex ?? records.length - 1
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex(Math.min(records.length - 1, cur + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex(Math.max(0, cur - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setIndex(records.length - 1)
    } else if (e.key === 'Escape') {
      setIndex(null)
    } else if ((e.key === 'Enter' || e.key === ' ') && activeRecord) {
      e.preventDefault()
      onbarclick?.(activeRecord)
    }
  }

  function statusLabel(status: StatusDayRecord['status']) {
    if (status === 'operational') return isZh ? '正常' : 'OPERATIONAL'
    if (status === 'degraded') return isZh ? '降级' : 'DEGRADED'
    if (status === 'outage') return isZh ? '中断' : 'OUTAGE'
    return isZh ? '无数据' : 'EMPTY'
  }
</script>

<div class="isolate space-y-3 select-none {className}">
  {#if showSummary}
    <div
      class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--terra-border)]"
    >
      <div class="flex items-center gap-2">
        <span
          class="w-1.5 h-1.5 rounded-full {latestStatus === 'operational'
            ? 'bg-[var(--terra-accent-success)]'
            : latestStatus === 'degraded'
              ? 'bg-[var(--terra-accent-warning)]'
              : 'bg-[var(--terra-accent-danger)]'}"
        ></span>
        <span
          class="font-mono text-xs font-semibold text-[var(--terra-text-primary)] uppercase tracking-wider"
        >
          {serviceName}
        </span>
        <span
          class="px-1.5 py-0.5 border border-[var(--terra-border)] font-mono text-[10px] text-[var(--terra-text-secondary)]"
        >
          {statusLabel(latestStatus)}
        </span>
      </div>

      <div class="flex items-center gap-2 font-mono text-xs">
        <span class="text-[var(--terra-text-muted)] text-[10px] uppercase">
          {isZh ? '平均可用率:' : 'UPTIME:'}
        </span>
        <span class="font-semibold text-[var(--terra-accent-primary)] tabular-nums"
          >{overallUptime}</span
        >
      </div>
    </div>
  {/if}

  <div class="relative py-2">
    <div
      bind:this={stripEl}
      bind:clientWidth={stripWidth}
      role="slider"
      tabindex="0"
      aria-label={isZh ? '服务历史可用率状态条' : 'Service uptime strip'}
      aria-valuemin={0}
      aria-valuemax={Math.max(0, records.length - 1)}
      aria-valuenow={activeIndex ?? Math.max(0, records.length - 1)}
      aria-valuetext={activeRecord
        ? `${activeRecord.date}: ${activeRecord.uptime ?? 100}%`
        : overallUptime}
      onpointerenter={handlePointerEnter}
      onpointermove={handlePointerMove}
      onpointerleave={handlePointerLeave}
      onblur={handlePointerLeave}
      onclick={handleClick}
      onkeydown={handleKeyDown}
      class="flex items-end gap-[2px] sm:gap-[3px] w-full cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--terra-accent-primary)]"
    >
      {#each records as rec, i (rec.date)}
        {@const dist = activeIndex === null ? 0 : Math.abs(i - activeIndex)}
        {@const focusOpacity =
          activeIndex === null ? 0.85 : 0.4 + 0.6 * Math.exp(-(dist * dist) / 10)}
        {@const waveScale = activeIndex === null ? 1 : 1 + 0.32 * Math.exp(-(dist * dist) / 3.2)}
        <span
          class="terra-strip-bar flex-1 min-w-[2px] pointer-events-none"
          style="
            height: {barHeight}px;
            background-color: {rec.status === 'operational'
            ? 'var(--terra-accent-success)'
            : rec.status === 'degraded'
              ? 'var(--terra-accent-warning)'
              : rec.status === 'outage'
                ? 'var(--terra-accent-danger)'
                : 'var(--terra-border)'};
            --bar-o: {focusOpacity.toFixed(3)};
            --bar-s: {waveScale.toFixed(3)};
          "
        ></span>
      {/each}
    </div>

    <div
      aria-hidden={!activeRecord}
      class="terra-strip-tip pointer-events-none absolute left-0 bottom-full mb-2 z-[9] overflow-hidden bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)] border-l-2 border-[var(--terra-accent-primary)]"
      style="
        opacity: {activeRecord ? 1 : 0};
        width: {tipW.current > 0 ? `${tipW.current.toFixed(1)}px` : 'auto'};
        height: {tipH.current > 0 ? `${tipH.current.toFixed(1)}px` : 'auto'};
        transform: translate3d({tipX.current.toFixed(1)}px, {activeRecord
        ? '0px'
        : '4px'}, 0) translateX(-50%);
      "
    >
      {#if displayRecord}
        <div
          bind:clientWidth={tipContentW}
          bind:clientHeight={tipContentH}
          class="w-max px-2.5 py-1.5 font-mono text-left whitespace-nowrap"
        >
          <div class="flex items-center justify-between gap-3 text-[10px] opacity-80">
            <span>{displayRecord.date}</span>
            <span class="font-bold tabular-nums">{displayRecord.uptime ?? 100}%</span>
          </div>
          <div class="text-[10px] font-semibold mt-0.5">
            {displayRecord.description || '100% OPERATIONAL'}
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if showTimelineLabels}
    <div
      class="flex items-center justify-between font-mono text-[10px] text-[var(--terra-text-muted)]"
    >
      <span>{isZh ? `过去 ${days} 天` : `${days} DAYS AGO`}</span>
      <div class="flex-1 mx-3 border-b border-dashed border-[var(--terra-border)]"></div>
      <span class="text-[var(--terra-text-secondary)] font-medium">{isZh ? '今日' : 'TODAY'}</span>
    </div>
  {/if}
</div>

<style>
  .terra-strip-bar {
    opacity: var(--bar-o, 0.85);
    transform: scaleY(var(--bar-s, 1));
    transform-origin: bottom;
    transition:
      opacity var(--terra-dur-fast) var(--terra-ease-out),
      transform var(--terra-dur-base) var(--terra-spring-snappy);
  }

  .terra-strip-tip {
    transition: opacity var(--terra-dur-fast) var(--terra-ease-out);
  }
</style>
