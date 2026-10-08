<script lang="ts">
  export interface StatusDayRecord {
    /** 日期，ISO 格式 'YYYY-MM-DD' */
    date: string
    /** 状态等级：'operational' | 'degraded' | 'outage' | 'empty' */
    status: 'operational' | 'degraded' | 'outage' | 'empty'
    /** 可用率百分比，如 99.98 */
    uptime?: number
    /** 故障或事件简要说明 */
    description?: string
  }

  interface Props {
    /** 每日状态数据集合 */
    data?: StatusDayRecord[]
    /** 服务或节点名称，如 'API_CORE_ROUTER' */
    serviceName?: string
    /** 监控天数周期，默认 90 */
    days?: number
    /** 单根细条高度（px），默认 30 */
    barHeight?: number
    /** 是否展示顶部状态与可用率统计栏，默认 true */
    showSummary?: boolean
    /** 是否展示底部时间轴刻度（90 DAYS AGO / TODAY），默认 true */
    showTimelineLabels?: boolean
    /** 点击细条时的回调函数 */
    onbarclick?: (day: StatusDayRecord) => void
    /** 自定义 CSS 类 */
    class?: string
  }

  let {
    data,
    serviceName = 'CLUSTER_SERVICE_GATEWAY',
    days = 90,
    barHeight = 30,
    showSummary = true,
    showTimelineLabels = true,
    onbarclick,
    class: className = ''
  }: Props = $props()

  // 默认模拟数据生成（保证即使不传 data 也能立刻展示真实效果）
  function generateDefaultDays(count: number): StatusDayRecord[] {
    const list: StatusDayRecord[] = []
    const now = new Date()

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]

      // 绝大多数为 operational，极少数为 degraded 或 outage
      let status: 'operational' | 'degraded' | 'outage' | 'empty' = 'operational'
      let uptime = +(99.8 + Math.random() * 0.2).toFixed(2)
      let description = '100% OPERATIONAL // NO INCIDENTS'

      if (i === 14) {
        status = 'degraded'
        uptime = 98.42
        description = 'MINOR LATENCY SPIKE (RESOLVED)'
      } else if (i === 48) {
        status = 'outage'
        uptime = 94.10
        description = 'PARTIAL ROUTING OUTAGE (18m)'
      }

      list.push({ date: dateStr, status, uptime, description })
    }
    return list
  }

  // 规范化数据序列
  const records = $derived(
    data && data.length > 0 ? data.slice(-days) : generateDefaultDays(days)
  )

  // 计算周期内总平均可用率
  const overallUptime = $derived.by(() => {
    if (records.length === 0) return '100.00%'
    const valid = records.filter(r => r.uptime !== undefined)
    if (valid.length === 0) return '100.00%'
    const sum = valid.reduce((acc, cur) => acc + (cur.uptime || 100), 0)
    return `${(sum / valid.length).toFixed(2)}%`
  })

  // 最新当前状态
  const latestStatus = $derived(
    records.length > 0 ? records[records.length - 1].status : 'operational'
  )

  // 交互悬浮状态
  let activeIndex = $state<number | null>(null)
  let activeRecord = $derived(activeIndex !== null && records[activeIndex] ? records[activeIndex] : null)
</script>

<div class="space-y-2 select-none {className}">
  <!-- 顶部状态概要栏 -->
  {#if showSummary}
    <div class="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-[var(--terra-border-subtle,rgba(255,255,255,0.08))]">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 {latestStatus === 'operational' ? 'bg-[var(--terra-accent-primary)] animate-pulse' : latestStatus === 'degraded' ? 'bg-[var(--terra-accent-warning)] animate-pulse' : 'bg-[var(--terra-accent-danger)] animate-pulse'}"></span>
        <span class="font-mono text-xs font-bold text-[var(--terra-text-primary)] uppercase tracking-wider">
          {serviceName}
        </span>
        <span class="px-1.5 py-0.2 bg-[var(--terra-bg-surface-active)] border border-[var(--terra-border)] font-mono text-[9px] font-semibold {latestStatus === 'operational' ? 'text-[var(--terra-accent-primary)]' : latestStatus === 'degraded' ? 'text-[var(--terra-accent-warning)]' : 'text-[var(--terra-accent-danger)]'} uppercase">
          {latestStatus === 'operational' ? 'OPERATIONAL' : latestStatus === 'degraded' ? 'DEGRADED' : 'OUTAGE'}
        </span>
      </div>

      <div class="flex items-center gap-2 font-mono text-xs">
        <span class="text-[var(--terra-text-muted)] text-[10px] uppercase tracking-wider">UPTIME:</span>
        <span class="font-bold text-[var(--terra-accent-primary)]">{overallUptime}</span>
      </div>
    </div>
  {/if}

  <!-- 1D 细条阵列外容器 -->
  <div class="relative py-1">
    <div
      class="flex items-center gap-[2px] sm:gap-[3px] w-full"
      role="region"
      aria-label="Service uptime strip"
    >
      {#each records as rec, i}
        {@const isHovered = activeIndex === i}
        <button
          type="button"
          class="flex-1 min-w-[2px] transition-all duration-150 rounded-xs focus:outline-hidden cursor-pointer"
          style="
            height: {barHeight}px;
            background-color: {
              rec.status === 'operational' ? 'var(--terra-accent-primary, #00d8ff)' :
              rec.status === 'degraded' ? 'var(--terra-accent-warning, #f59e0b)' :
              rec.status === 'outage' ? 'var(--terra-accent-danger, #ef4444)' :
              'rgba(255, 255, 255, 0.08)'
            };
            opacity: {activeIndex !== null && !isHovered ? 0.35 : isHovered ? 1 : 0.85};
            transform: {isHovered ? 'scaleY(1.15)' : 'scaleY(1)'};
            box-shadow: {isHovered ? '0 0 8px currentColor' : 'none'};
          "
          onmouseenter={() => activeIndex = i}
          onmouseleave={() => activeIndex = null}
          onclick={() => onbarclick?.(rec)}
          aria-label="{rec.date}: {rec.uptime}% uptime"
        ></button>
      {/each}
    </div>

    <!-- 战术 HUD 悬浮指示提示框 (Tooltip Pin) -->
    {#if activeRecord && activeIndex !== null}
      {@const percentX = ((activeIndex + 0.5) / records.length) * 100}
      <div
        class="absolute z-30 bottom-full mb-2 pointer-events-none transition-all duration-75"
        style="left: {Math.max(12, Math.min(percentX, 88))}%; transform: translateX(-50%);"
      >
        <div class="px-2.5 py-1.5 bg-[var(--terra-bg-surface,#11141c)] border border-[var(--terra-accent-primary,#00d8ff)] shadow-lg font-mono text-left whitespace-nowrap terra-cut-tr">
          <div class="flex items-center justify-between gap-3 text-[9px] text-[var(--terra-text-muted)] border-b border-[var(--terra-border)] pb-0.5 mb-1">
            <span>{activeRecord.date}</span>
            <span class="font-bold text-[var(--terra-accent-primary)]">{activeRecord.uptime ?? 100}%</span>
          </div>
          <div class="text-[10px] font-semibold text-[var(--terra-text-primary)]">
            {activeRecord.description || '100% OPERATIONAL // NO INCIDENTS'}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- 底部时间轴刻度 -->
  {#if showTimelineLabels}
    <div class="flex items-center justify-between font-mono text-[9px] text-[var(--terra-text-muted)] pt-0.5">
      <span>{days} DAYS AGO</span>
      <div class="flex-1 mx-3 border-b border-dashed border-[var(--terra-border-subtle,rgba(255,255,255,0.1))]"></div>
      <span class="text-[var(--terra-text-secondary)] font-semibold">TODAY</span>
    </div>
  {/if}
</div>
