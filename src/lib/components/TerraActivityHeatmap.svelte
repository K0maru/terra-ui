<script lang="ts">
  import { Spring } from 'svelte/motion'
  import { SPRING } from '../motion'

  export interface ActivityRecord {
    date: string
    count: number
    label?: string
    meta?: Record<string, string | number | boolean>
  }

  interface Props {
    data?: ActivityRecord[]
    endDate?: string | Date
    weeks?: number
    cellSize?: number
    cellGap?: number
    showMonthLabels?: boolean
    showWeekdayLabels?: boolean
    showLegend?: boolean
    showOverview?: boolean
    title?: string
    oncellclick?: (cell: { date: string; count: number; level: number }) => void
    class?: string
  }

  let {
    data,
    endDate,
    weeks = 52,
    cellSize = 11,
    cellGap = 3,
    showMonthLabels = true,
    showWeekdayLabels = true,
    showLegend = true,
    showOverview = true,
    title = 'ANNUAL ACTIVITY & COMMIT MATRIX',
    oncellclick,
    class: className = ''
  }: Props = $props()

  function generateDefaultActivities(): ActivityRecord[] {
    const list: ActivityRecord[] = []
    const baseMs = Date.UTC(2026, 10, 25)
    const totalDays = 52 * 7

    for (let i = totalDays - 1; i >= 0; i--) {
      const ms = baseMs - i * 86_400_000
      const d = new Date(ms)
      const dateStr = d.toISOString().slice(0, 10)
      const dayOfWeek = d.getUTCDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const seed = ((i * 73 + 19) % 97) / 97

      let count = 0
      if (!isWeekend && seed > 0.18) {
        count = 1 + Math.floor(seed * 9)
        if (seed > 0.86) count += 8
      } else if (isWeekend && seed > 0.68) {
        count = 1 + Math.floor(seed * 4)
      }

      list.push({ date: dateStr, count })
    }
    return list
  }

  const records = $derived(data && data.length > 0 ? data : generateDefaultActivities())

  const dateLookup = $derived.by(() => {
    const dict: Record<string, ActivityRecord> = {}
    for (const r of records) {
      dict[r.date] = r
    }
    return dict
  })

  const maxCount = $derived.by(() => {
    let m = 1
    for (const r of records) {
      if (r.count > m) m = r.count
    }
    return m
  })

  const totalCount = $derived(records.reduce((acc, cur) => acc + (cur.count || 0), 0))
  const activeDays = $derived(records.filter((r) => r.count > 0).length)

  function getLevel(count: number, max: number): number {
    if (!count || count <= 0) return 0
    if (count <= max * 0.25) return 1
    if (count <= max * 0.5) return 2
    if (count <= max * 0.75) return 3
    return 4
  }

  const padLeft = $derived(showWeekdayLabels ? 30 : 8)
  const padTop = $derived(showMonthLabels ? 22 : 6)
  const padBottom = $derived(showLegend ? 26 : 8)
  const padRight = 10

  const svgWidth = $derived(padLeft + weeks * (cellSize + cellGap) + padRight)
  const svgHeight = $derived(padTop + 7 * (cellSize + cellGap) + padBottom)

  interface GridCell {
    date: string
    col: number
    row: number
    x: number
    y: number
    count: number
    level: number
  }

  interface MonthLabel {
    label: string
    x: number
  }

  const { cells, cellGrid, monthLabels } = $derived.by(() => {
    const endMs = endDate
      ? typeof endDate === 'string'
        ? Date.parse(endDate)
        : endDate.getTime()
      : Date.UTC(2026, 10, 25)
    const endDayOfWeek = new Date(endMs).getUTCDay()
    const totalDays = weeks * 7
    const startMs = endMs - (totalDays - 1 - (6 - endDayOfWeek)) * 86_400_000

    const gridCells: GridCell[] = []
    const byCoord: Record<string, GridCell> = {}
    const months: MonthLabel[] = []
    const monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC'
    ]
    let lastMonth = -1

    for (let c = 0; c < weeks; c++) {
      for (let r = 0; r < 7; r++) {
        const curMs = startMs + (c * 7 + r) * 86_400_000
        if (curMs > endMs) continue

        const cur = new Date(curMs)
        const dateStr = cur.toISOString().slice(0, 10)
        const rec = dateLookup[dateStr]
        const count = rec ? rec.count : 0
        const level = getLevel(count, maxCount)

        const x = padLeft + c * (cellSize + cellGap)
        const y = padTop + r * (cellSize + cellGap)

        const cell: GridCell = { date: dateStr, col: c, row: r, x, y, count, level }
        gridCells.push(cell)
        byCoord[`${c}:${r}`] = cell

        const m = cur.getUTCMonth()
        if (m !== lastMonth && r === 0) {
          months.push({ label: monthNames[m], x })
          lastMonth = m
        }
      }
    }

    return { cells: gridCells, cellGrid: byCoord, monthLabels: months }
  })

  let svgEl: SVGSVGElement | undefined = $state()
  let hoveredCell = $state<GridCell | null>(null)
  let lastCell = $state<GridCell | null>(null)
  let cachedRect: { left: number; top: number; width: number; height: number } | null = null
  const tipXSpring = new Spring(0, SPRING.pointer)
  const tipYSpring = new Spring(0, SPRING.pointer)
  let rafId = 0
  let pendingClientX = 0
  let pendingClientY = 0

  $effect(() => {
    if (hoveredCell) lastCell = hoveredCell
  })

  const displayCell = $derived(hoveredCell ?? lastCell)

  function cellFill(level: number): string {
    if (level === 0) return 'var(--terra-bg-surface-active)'
    if (level === 1) return 'color-mix(in srgb, var(--terra-accent-primary) 26%, transparent)'
    if (level === 2) return 'color-mix(in srgb, var(--terra-accent-primary) 50%, transparent)'
    if (level === 3) return 'color-mix(in srgb, var(--terra-accent-primary) 75%, transparent)'
    return 'var(--terra-accent-primary)'
  }

  function updateCellFromPointer(clientX: number, clientY: number) {
    if (!svgEl) return
    if (!cachedRect) {
      const r = svgEl.getBoundingClientRect()
      cachedRect = {
        left: r.left,
        top: r.top,
        width: Math.max(1, r.width),
        height: Math.max(1, r.height)
      }
    }
    const vx = ((clientX - cachedRect.left) / cachedRect.width) * svgWidth
    const vy = ((clientY - cachedRect.top) / cachedRect.height) * svgHeight
    const step = cellSize + cellGap
    const col = Math.floor((vx - padLeft + cellGap * 0.5) / step)
    const row = Math.floor((vy - padTop + cellGap * 0.5) / step)

    if (col < 0 || col >= weeks || row < 0 || row >= 7) {
      hoveredCell = null
      return
    }
    const found = cellGrid[`${col}:${row}`] ?? null
    const wasNull = hoveredCell === null
    hoveredCell = found
    if (found) {
      const nextTipX = Math.max(padLeft, Math.min(found.x - 70, svgWidth - padRight - 144))
      const nextTipY = Math.max(2, found.y - 42)
      if (wasNull) {
        tipXSpring.set(nextTipX, { instant: true })
        tipYSpring.set(nextTipY, { instant: true })
      } else {
        tipXSpring.target = nextTipX
        tipYSpring.target = nextTipY
      }
    }
  }

  function handlePointerEnter(e: PointerEvent) {
    if (svgEl) {
      const r = svgEl.getBoundingClientRect()
      cachedRect = {
        left: r.left,
        top: r.top,
        width: Math.max(1, r.width),
        height: Math.max(1, r.height)
      }
    }
    updateCellFromPointer(e.clientX, e.clientY)
  }

  function handlePointerMove(e: PointerEvent) {
    pendingClientX = e.clientX
    pendingClientY = e.clientY
    if (rafId !== 0) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      updateCellFromPointer(pendingClientX, pendingClientY)
    })
  }

  function handlePointerLeave() {
    if (rafId !== 0) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
    cachedRect = null
    hoveredCell = null
  }
</script>

<div class="isolate space-y-3 select-none {className}">
  {#if showOverview}
    <div
      class="flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b border-[var(--terra-border)]"
    >
      <div class="space-y-0.5">
        <span
          class="font-mono text-[10px] text-[var(--terra-accent-primary)] tracking-widest uppercase block"
        >
          // TELEMETRY.MATRIX
        </span>
        <h4
          class="font-mono text-xs sm:text-sm font-bold text-[var(--terra-text-primary)] tracking-wide uppercase"
        >
          {title}
        </h4>
      </div>

      <div class="flex items-center gap-4 font-mono text-xs">
        <div>
          <span class="text-[10px] text-[var(--terra-text-muted)] block">TOTAL</span>
          <span class="font-bold text-[var(--terra-accent-primary)] tabular-nums"
            >{totalCount.toLocaleString()}</span
          >
        </div>
        <div class="border-l border-[var(--terra-border)] pl-4">
          <span class="text-[10px] text-[var(--terra-text-muted)] block">ACTIVE DAYS</span>
          <span class="font-bold text-[var(--terra-text-primary)] tabular-nums"
            >{activeDays} / {weeks * 7}</span
          >
        </div>
        <div class="border-l border-[var(--terra-border)] pl-4">
          <span class="text-[10px] text-[var(--terra-text-muted)] block">PEAK SURGE</span>
          <span class="font-bold text-[var(--terra-text-secondary)] tabular-nums"
            >{maxCount} / DAY</span
          >
        </div>
      </div>
    </div>
  {/if}

  <div
    class="relative w-full overflow-x-auto p-2 border border-[var(--terra-border)] bg-[var(--terra-bg-surface)] cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)]"
    role="slider"
    tabindex="0"
    aria-roledescription="heatmap"
    aria-label={title}
    aria-valuemin={0}
    aria-valuemax={Math.max(0, cells.length - 1)}
    aria-valuenow={hoveredCell ? cells.indexOf(hoveredCell) : Math.max(0, cells.length - 1)}
    aria-valuetext={hoveredCell ? `${hoveredCell.date}: ${hoveredCell.count}` : undefined}
    onpointerenter={handlePointerEnter}
    onpointermove={handlePointerMove}
    onpointerleave={handlePointerLeave}
    onclick={() => {
      if (hoveredCell) oncellclick?.(hoveredCell)
    }}
    onkeydown={(e) => {
      if (cells.length === 0) return
      const curIdx = hoveredCell ? cells.indexOf(hoveredCell) : cells.length - 1
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        hoveredCell = cells[Math.min(cells.length - 1, curIdx + 7)]
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        hoveredCell = cells[Math.max(0, curIdx - 7)]
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        hoveredCell = cells[Math.min(cells.length - 1, curIdx + 1)]
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        hoveredCell = cells[Math.max(0, curIdx - 1)]
      } else if ((e.key === 'Enter' || e.key === ' ') && hoveredCell) {
        e.preventDefault()
        oncellclick?.(hoveredCell)
      } else if (e.key === 'Escape') {
        hoveredCell = null
      }
    }}
  >
    <svg
      bind:this={svgEl}
      viewBox="0 0 {svgWidth} {svgHeight}"
      class="w-full h-auto min-w-[620px] overflow-visible pointer-events-none"
      aria-hidden="true"
    >
      {#if showMonthLabels}
        {#each monthLabels as ml (ml.x)}
          <text
            x={ml.x}
            y={padTop - 8}
            class="font-mono text-[10px] font-semibold"
            fill="var(--terra-text-muted)"
          >
            {ml.label}
          </text>
        {/each}
      {/if}

      {#if showWeekdayLabels}
        <text
          x={padLeft - 6}
          y={padTop + 1 * (cellSize + cellGap) + cellSize - 1}
          text-anchor="end"
          class="font-mono text-[10px]"
          fill="var(--terra-text-muted)"
        >
          MON
        </text>
        <text
          x={padLeft - 6}
          y={padTop + 3 * (cellSize + cellGap) + cellSize - 1}
          text-anchor="end"
          class="font-mono text-[10px]"
          fill="var(--terra-text-muted)"
        >
          WED
        </text>
        <text
          x={padLeft - 6}
          y={padTop + 5 * (cellSize + cellGap) + cellSize - 1}
          text-anchor="end"
          class="font-mono text-[10px]"
          fill="var(--terra-text-muted)"
        >
          FRI
        </text>
      {/if}

      {#each cells as cell (cell.date)}
        {@const isHovered = hoveredCell === cell}
        <rect
          x={cell.x}
          y={cell.y}
          width={cellSize}
          height={cellSize}
          fill={cellFill(cell.level)}
          stroke={isHovered ? 'var(--terra-text-primary)' : 'var(--terra-border)'}
          stroke-width={isHovered ? '1.5' : '0.5'}
          class="terra-t-color pointer-events-none"
        />
      {/each}

      {#if showLegend}
        <g transform="translate({svgWidth - padRight - 150}, {svgHeight - 12})">
          <text
            x="-8"
            y={cellSize - 1}
            text-anchor="end"
            class="font-mono text-[10px]"
            fill="var(--terra-text-muted)"
          >
            LESS
          </text>

          {#each [0, 1, 2, 3, 4] as lvl (lvl)}
            <rect
              x={lvl * (cellSize + 3)}
              y="0"
              width={cellSize}
              height={cellSize}
              fill={cellFill(lvl)}
              stroke="var(--terra-border)"
              stroke-width="0.5"
            />
          {/each}

          <text
            x={5 * (cellSize + 3) + 6}
            y={cellSize - 1}
            text-anchor="start"
            class="font-mono text-[10px]"
            fill="var(--terra-text-muted)"
          >
            MORE
          </text>
        </g>
      {/if}

      {#if displayCell}
        <g
          transform="translate({tipXSpring.current}, {tipYSpring.current})"
          opacity={hoveredCell ? 1 : 0}
          class="terra-t-opacity pointer-events-none"
        >
          <rect
            width="144"
            height="36"
            fill="var(--terra-text-primary)"
            stroke="var(--terra-text-primary)"
            stroke-width="1"
          />
          <rect x="0" y="0" width="3" height="36" fill="var(--terra-accent-primary)" />
          <text
            x="8"
            y="13"
            class="font-mono text-[10px]"
            fill="var(--terra-text-inverse)"
            opacity="0.75"
          >
            {displayCell.date}
          </text>
          <text
            x="8"
            y="28"
            class="font-mono text-[11px] font-bold"
            fill="var(--terra-text-inverse)"
          >
            {displayCell.count} ACTIVITIES
          </text>
        </g>
      {/if}
    </svg>
  </div>
</div>
