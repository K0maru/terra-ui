<script lang="ts">
  interface Props {
    /** 走势数值序列 */
    data?: number[]
    /** 宽度，支持像素数值或 CSS 长度字符串，默认 '100%' */
    width?: number | string
    /** 高度（px），默认 32 */
    height?: number
    /** 线条与高光颜色（覆盖 variant） */
    color?: string
    /** 状态主题变体：'accent' | 'success' | 'warning' | 'danger' */
    variant?: 'accent' | 'success' | 'warning' | 'danger'
    /** 线条宽度，默认 1.5 */
    strokeWidth?: number
    /** 是否渲染半透明渐变底衬，默认 true */
    fill?: boolean
    /** 是否启用贝塞尔平滑波形，默认 true */
    smooth?: boolean
    /** 是否在最新数据点展示呼吸脉冲光点，默认 true */
    showPulse?: boolean
    /** 自定义 CSS 类 */
    class?: string
  }

  let {
    data = [24, 38, 30, 45, 62, 55, 78, 68, 92, 85],
    width = '100%',
    height = 32,
    color = '',
    variant = 'accent',
    strokeWidth = 1.5,
    fill = true,
    smooth = true,
    showPulse = true,
    class: className = ''
  }: Props = $props()

  // 唯一渐变 ID
  const gradId = `spark-grad-${Math.random().toString(36).slice(2, 9)}`

  // 解析颜色
  const strokeColor = $derived.by(() => {
    if (color) return color
    switch (variant) {
      case 'success': return 'var(--terra-accent-success, #00f076)'
      case 'warning': return 'var(--terra-accent-warning, #f59e0b)'
      case 'danger': return 'var(--terra-accent-danger, #ef4444)'
      default: return 'var(--terra-accent-primary, #00d8ff)'
    }
  })

  // 内部 viewBox 坐标尺寸
  const vbWidth = 120
  const padY = 4

  // 点集坐标映射
  const points = $derived.by(() => {
    if (!data || data.length === 0) return []
    if (data.length === 1) {
      return [{ x: vbWidth / 2, y: height / 2, val: data[0] }]
    }

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const plotHeight = height - padY * 2

    return data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * vbWidth
      const y = padY + plotHeight - ((val - min) / range) * plotHeight
      return { x, y, val }
    })
  })

  // 贝塞尔曲线算法
  function generateSmoothPath(pts: Array<{ x: number; y: number }>): string {
    if (pts.length <= 1) return ''
    if (pts.length === 2) {
      return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} L ${pts[1].x.toFixed(1)} ${pts[1].y.toFixed(1)}`
    }

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
  }

  // 折线算法
  function generateLinearPath(pts: Array<{ x: number; y: number }>): string {
    if (pts.length <= 1) return ''
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  }

  // 曲线 Path
  const linePath = $derived.by(() => {
    if (points.length <= 1) return ''
    return smooth ? generateSmoothPath(points) : generateLinearPath(points)
  })

  // 闭合区域 Path
  const areaPath = $derived.by(() => {
    if (!linePath || points.length <= 1) return ''
    const first = points[0]
    const last = points[points.length - 1]
    return `${linePath} L ${last.x.toFixed(1)} ${height} L ${first.x.toFixed(1)} ${height} Z`
  })

  // 最后一个数据点
  const lastPoint = $derived(points.length > 0 ? points[points.length - 1] : null)
</script>

<div
  class="relative inline-flex items-center select-none overflow-visible {className}"
  style="width: {typeof width === 'number' ? `${width}px` : width}; height: {height}px;"
>
  <svg
    viewBox="0 0 {vbWidth} {height}"
    preserveAspectRatio="none"
    class="w-full h-full overflow-visible"
  >
    <defs>
      <!-- 渐变阴影 -->
      {#if fill}
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={strokeColor} stop-opacity="0.35" />
          <stop offset="100%" stop-color={strokeColor} stop-opacity="0.0" />
        </linearGradient>
      {/if}
    </defs>

    <!-- 渐变底衬 -->
    {#if fill && areaPath}
      <path
        d={areaPath}
        fill="url(#{gradId})"
        class="transition-all duration-300"
      />
    {/if}

    <!-- 主线条 -->
    {#if linePath}
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-all duration-300"
      />
    {/if}

    <!-- 末端实时脉冲点 -->
    {#if showPulse && lastPoint}
      <!-- 扩散外环 -->
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="4.5"
        fill={strokeColor}
        opacity="0.4"
        class="animate-ping"
      />
      <!-- 中心实心光点 -->
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="2.5"
        fill={strokeColor}
        class="shadow-xs"
      />
    {/if}
  </svg>
</div>
