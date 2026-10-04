<script lang="ts">
  export interface ActivityRecord {
    /** 日期，ISO 格式 'YYYY-MM-DD' */
    date: string
    /** 提交或活动频次 */
    count: number
    /** 可选自定义标签 */
    label?: string
    /** 可选元数据对象 */
    meta?: Record<string, any>
  }

  interface Props {
    /** 核心时序活动数据 */
    data?: ActivityRecord[]
    /** 结束日期（默认当天） */
    endDate?: string | Date
    /** 统计周数（默认 52 周） */
    weeks?: number
    /** 单元格尺寸（px），默认 11 */
    cellSize?: number
    /** 单元格间距（px），默认 3 */
    cellGap?: number
    /** 是否展示顶部月份刻度（JAN ~ DEC），默认 true */
    showMonthLabels?: boolean
    /** 是否展示左侧星期刻度（MON, WED, FRI），默认 true */
    showWeekdayLabels?: boolean
    /** 是否展示右下角能级标尺（LESS / MORE），默认 true */
    showLegend?: boolean
    /** 是否展示顶部战术数据概览条，默认 true */
    showOverview?: boolean
    /** 标题说明 */
    title?: string
    /** 单元格点击事件回调 */
    oncellclick?: (cell: { date: string; count: number; level: number }) => void
    /** 自定义 CSS 类 */
    class?: string
  }

  let {
    data,
    endDate = new Date(),
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

  // 默认模拟数据生成（保证开箱即用呈现出高频与斑驳交织的专业矩阵）
  function generateDefaultActivities(): ActivityRecord[] {
    const list: ActivityRecord[] = []
    const end = new Date()
    const totalDays = 52 * 7

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(end)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]

      // 模拟研发规律：工作日更高、周末较低、周期性冲刺
      const dayOfWeek = d.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const rand = Math.random()

      let count = 0
      if (!isWeekend && rand > 0.18) {
        count = Math.floor(1 + Math.random() * 8)
        if (rand > 0.88) count += Math.floor(Math.random() * 12) // 冲刺峰值
      } else if (isWeekend && rand > 0.65) {
        count = Math.floor(1 + Math.random() * 4)
      }

      list.push({ date: dateStr, count })
    }
    return list
  }

  // 内部数据映射表
  const records = $derived(data && data.length > 0 ? data : generateDefaultActivities())

  const dateMap = $derived.by(() => {
    const map = new Map<string, ActivityRecord>()
    for (const r of records) {
      map.set(r.date, r)
    }
    return map
  })

  // 峰值
  const maxCount = $derived.by(() => {
    let m = 1
    for (const r of records) {
      if (r.count > m) m = r.count
    }
    return m
  })

  // 总计与统计
  const totalCount = $derived(records.reduce((acc, cur) => acc + (cur.count || 0), 0))
  const activeDays = $derived(records.filter(r => r.count > 0).length)

  // 5 阶梯度计算函数
  function getLevel(count: number, max: number): number {
    if (!count || count <= 0) return 0
    if (count <= max * 0.25) return 1
    if (count <= max * 0.50) return 2
    if (count <= max * 0.75) return 3
    return 4
  }

  // 生成矩阵格子坐标与月份
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

  const { cells, monthLabels } = $derived.by(() => {
    const end = typeof endDate === 'string' ? new Date(endDate) : new Date(endDate)
    const endDayOfWeek = end.getDay() // 0 is Sun, 6 is Sat

    // 计算起始周日
    const totalDays = weeks * 7
    const startDate = new Date(end)
    startDate.setDate(startDate.getDate() - (totalDays - 1) + (6 - endDayOfWeek))

    const gridCells: GridCell[] = []
    const months: MonthLabel[] = []
    let lastMonth = -1

    for (let c = 0; c < weeks; c++) {
      for (let r = 0; r < 7; r++) {
        const curDate = new Date(startDate)
        curDate.setDate(curDate.getDate() + (c * 7 + r))

        if (curDate > end) continue

        const dateStr = curDate.toISOString().split('T')[0]
        const rec = dateMap.get(dateStr)
        const count = rec ? rec.count : 0
        const level = getLevel(count, maxCount)

        const x = padLeft + c * (cellSize + cellGap)
        const y = padTop + r * (cellSize + cellGap)

        gridCells.push({
          date: dateStr,
          col: c,
          row: r,
          x,
          y,
          count,
          level
        })

        // 月份标签记录（每月第一周）
        const m = curDate.getMonth()
        if (m !== lastMonth && r === 0) {
          const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
          months.push({ label: monthNames[m], x })
          lastMonth = m
        }
      }
    }

    return { cells: gridCells, monthLabels: months }
  })

  // 悬浮聚焦单元格
  let hoveredCell = $state<GridCell | null>(null)
</script>

<div class="space-y-3 select-none {className}">
  <!-- 顶部概览统计条 -->
  {#if showOverview}
    <div class="flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b border-[var(--terra-border)]">
      <div class="space-y-0.5">
        <span class="font-mono text-[9px] text-[var(--terra-accent-primary)] tracking-widest uppercase block">
          // TELEMETRY.MATRIX
        </span>
        <h4 class="font-mono text-xs sm:text-sm font-bold text-[var(--terra-text-primary)] tracking-wide uppercase">
          {title}
        </h4>
      </div>

      <div class="flex items-center gap-4 font-mono text-xs">
        <div>
          <span class="text-[10px] text-[var(--terra-text-muted)] block">TOTAL</span>
          <span class="font-bold text-[var(--terra-accent-primary)]">{totalCount.toLocaleString()}</span>
        </div>
        <div class="border-l border-[var(--terra-border)] pl-4">
          <span class="text-[10px] text-[var(--terra-text-muted)] block">ACTIVE DAYS</span>
          <span class="font-bold text-[var(--terra-text-primary)]">{activeDays} / {weeks * 7}</span>
        </div>
        <div class="border-l border-[var(--terra-border)] pl-4">
          <span class="text-[10px] text-[var(--terra-text-muted)] block">PEAK SURGE</span>
          <span class="font-bold text-[var(--terra-accent-secondary,#3b82f6)]">{maxCount} / DAY</span>
        </div>
      </div>
    </div>
  {/if}

  <!-- 核心 SVG 矩阵容器 -->
  <div class="relative w-full overflow-x-auto p-1 border border-[var(--terra-border)] bg-[var(--terra-bg-surface,#11141c)] terra-cut-tr">
    <svg
      viewBox="0 0 {svgWidth} {svgHeight}"
      class="w-full h-auto min-w-[620px] overflow-visible"
    >
      <!-- 月份标尺标签 -->
      {#if showMonthLabels}
        {#each monthLabels as ml}
          <text
            x={ml.x}
            y={padTop - 8}
            class="font-mono text-[9px] font-semibold"
            fill="var(--terra-text-muted, #718096)"
          >
            {ml.label}
          </text>
        {/each}
      {/if}

      <!-- 星期标尺标签 (MON, WED, FRI) -->
      {#if showWeekdayLabels}
        <text
          x={padLeft - 6}
          y={padTop + 1 * (cellSize + cellGap) + cellSize - 2}
          text-anchor="end"
          class="font-mono text-[8px]"
          fill="var(--terra-text-muted, #718096)"
        >
          MON
        </text>
        <text
          x={padLeft - 6}
          y={padTop + 3 * (cellSize + cellGap) + cellSize - 2}
          text-anchor="end"
          class="font-mono text-[8px]"
          fill="var(--terra-text-muted, #718096)"
        >
          WED
        </text>
        <text
          x={padLeft - 6}
          y={padTop + 5 * (cellSize + cellGap) + cellSize - 2}
          text-anchor="end"
          class="font-mono text-[8px]"
          fill="var(--terra-text-muted, #718096)"
        >
          FRI
        </text>
      {/if}

      <!-- 单元格矩阵 -->
      {#each cells as cell}
        {@const isHovered = hoveredCell === cell}
        <rect
          x={cell.x}
          y={cell.y}
          width={cellSize}
          height={cellSize}
          rx="1.5"
          fill={
            cell.level === 0 ? 'var(--terra-bg-surface-active, rgba(255, 255, 255, 0.05))' :
            cell.level === 1 ? 'color-mix(in srgb, var(--terra-accent-primary, #00d8ff) 25%, transparent)' :
            cell.level === 2 ? 'color-mix(in srgb, var(--terra-accent-primary, #00d8ff) 50%, transparent)' :
            cell.level === 3 ? 'color-mix(in srgb, var(--terra-accent-primary, #00d8ff) 75%, transparent)' :
            'var(--terra-accent-primary, #00d8ff)'
          }
          stroke={
            isHovered ? 'var(--terra-text-primary, #ffffff)' :
            cell.level === 0 ? 'var(--terra-border-subtle, rgba(255, 255, 255, 0.08))' :
            'var(--terra-accent-primary, #00d8ff)'
          }
          stroke-width={isHovered ? '1.5' : cell.level === 0 ? '1' : '0.5'}
          stroke-opacity={cell.level === 0 ? '0.6' : '0.4'}
          role="button"
          tabindex="0"
          aria-label="{cell.date}: {cell.count} activities"
          class="transition-all duration-150 cursor-pointer focus:outline-hidden"
          style={isHovered && cell.level > 0 ? 'filter: drop-shadow(0 0 6px var(--terra-accent-primary, #00d8ff));' : ''}
          onmouseenter={() => hoveredCell = cell}
          onmouseleave={() => hoveredCell = null}
          onclick={() => oncellclick?.(cell)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              oncellclick?.(cell)
            }
          }}
        />
      {/each}

      <!-- 底部能级标尺 (LESS ... MORE) -->
      {#if showLegend}
        <g transform="translate({svgWidth - padRight - 150}, {svgHeight - 12})">
          <text
            x="-8"
            y={cellSize - 2}
            text-anchor="end"
            class="font-mono text-[8px]"
            fill="var(--terra-text-muted, #718096)"
          >
            LESS
          </text>
          
          {#each [0, 1, 2, 3, 4] as lvl, idx}
            <rect
              x={idx * (cellSize + 3)}
              y="0"
              width={cellSize}
              height={cellSize}
              rx="1.5"
              fill={
                lvl === 0 ? 'var(--terra-bg-surface-active, rgba(255, 255, 255, 0.05))' :
                lvl === 1 ? 'color-mix(in srgb, var(--terra-accent-primary, #00d8ff) 25%, transparent)' :
                lvl === 2 ? 'color-mix(in srgb, var(--terra-accent-primary, #00d8ff) 50%, transparent)' :
                lvl === 3 ? 'color-mix(in srgb, var(--terra-accent-primary, #00d8ff) 75%, transparent)' :
                'var(--terra-accent-primary, #00d8ff)'
              }
              stroke="var(--terra-border)"
              stroke-width="0.5"
            />
          {/each}

          <text
            x={5 * (cellSize + 3) + 6}
            y={cellSize - 2}
            text-anchor="start"
            class="font-mono text-[8px]"
            fill="var(--terra-text-muted, #718096)"
          >
            MORE
          </text>
        </g>
      {/if}

      <!-- 战术 HUD 悬浮指示提示框 (Tooltip Pin Box) -->
      {#if hoveredCell}
        {@const tipWidth = 140}
        {@const tipHeight = 36}
        {@const tipX = Math.max(padLeft, Math.min(hoveredCell.x - tipWidth / 2, svgWidth - padRight - tipWidth))}
        {@const tipY = Math.max(2, hoveredCell.y - tipHeight - 8)}

        <g transform="translate({tipX}, {tipY})" class="pointer-events-none transition-transform duration-75">
          <rect
            width={tipWidth}
            height={tipHeight}
            fill="var(--terra-bg-surface, #11141c)"
            stroke="var(--terra-accent-primary, #00d8ff)"
            stroke-width="1"
            class="shadow-xl"
          />
          <text
            x="8"
            y="14"
            class="font-mono text-[9px]"
            fill="var(--terra-text-muted, #94a3b8)"
          >
            {hoveredCell.date}
          </text>
          <text
            x="8"
            y="28"
            class="font-mono text-[11px] font-bold"
            fill="var(--terra-text-primary, #ffffff)"
          >
            {hoveredCell.count} <tspan font-size="9" font-weight="normal" fill="var(--terra-accent-primary, #00d8ff)">ACTIVITIES</tspan>
            {#if hoveredCell.count === 0}
              <tspan font-size="8" fill="var(--terra-text-muted, #718096)"> // IDLE</tspan>
            {/if}
          </text>
        </g>
      {/if}
    </svg>
  </div>
</div>
