<script lang="ts">
  interface Props {
    data?: number[]
    width?: number | string
    height?: number
    color?: string
    variant?: 'accent' | 'success' | 'warning' | 'danger'
    strokeWidth?: number
    fill?: boolean
    smooth?: boolean
    showPulse?: boolean
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

  const gradId = `spark-grad-${Math.random().toString(36).slice(2, 9)}`

  const strokeColor = $derived.by(() => {
    if (color) return color
    switch (variant) {
      case 'success':
        return 'var(--terra-accent-success)'
      case 'warning':
        return 'var(--terra-accent-warning)'
      case 'danger':
        return 'var(--terra-accent-danger)'
      default:
        return 'var(--terra-accent-primary)'
    }
  })

  const vbWidth = 120
  const padY = 4

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

  function generateLinearPath(pts: Array<{ x: number; y: number }>): string {
    if (pts.length <= 1) return ''
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  }

  const linePath = $derived.by(() => {
    if (points.length <= 1) return ''
    return smooth ? generateSmoothPath(points) : generateLinearPath(points)
  })

  const areaPath = $derived.by(() => {
    if (!linePath || points.length <= 1) return ''
    const first = points[0]
    const last = points[points.length - 1]
    return `${linePath} L ${last.x.toFixed(1)} ${height} L ${first.x.toFixed(1)} ${height} Z`
  })

  const lastPoint = $derived(points.length > 0 ? points[points.length - 1] : null)
</script>

<div
  class="isolate relative inline-flex items-center select-none overflow-visible {className}"
  style="width: {typeof width === 'number' ? `${width}px` : width}; height: {height}px;"
>
  <svg
    viewBox="0 0 {vbWidth} {height}"
    preserveAspectRatio="none"
    class="w-full h-full overflow-visible"
  >
    <defs>
      {#if fill}
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={strokeColor} stop-opacity="0.32" />
          <stop offset="100%" stop-color={strokeColor} stop-opacity="0.0" />
        </linearGradient>
      {/if}
    </defs>

    {#if fill && areaPath}
      <path d={areaPath} fill="url(#{gradId})" class="terra-t-opacity" />
    {/if}

    {#if linePath}
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
        class="terra-t-color"
      />
    {/if}

    {#if showPulse && lastPoint}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="5"
        fill="none"
        stroke={strokeColor}
        stroke-width="1"
        class="terra-spark-halo"
      />
      <circle cx={lastPoint.x} cy={lastPoint.y} r="2.5" fill={strokeColor} />
    {/if}
  </svg>
</div>

<style>
  @keyframes terraSparkHalo {
    0%,
    100% {
      opacity: 0.22;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.78;
      transform: scale(1.25);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .terra-spark-halo {
      transform-box: fill-box;
      transform-origin: center;
      animation: terraSparkHalo 2.6s var(--terra-ease-in-out) infinite;
    }
  }
</style>
