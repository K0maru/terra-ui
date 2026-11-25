<script lang="ts" module>
  const FORE_U = 13
  const FORE_V = 9
  const HIND_U = 11
  const HIND_V = 8
  const QUADS_PER_WING_FORE = FORE_U * FORE_V
  const QUADS_PER_WING_HIND = HIND_U * HIND_V
  const TOTAL_QUADS = 2 * (QUADS_PER_WING_FORE + QUADS_PER_WING_HIND)
  const MAX_VERTS = (FORE_U + 1) * (FORE_V + 1)
  const ASCII_RAMP = ' .·:;-=+*#%@'

  interface WingTemplate {
    uSteps: number
    vSteps: number
    uCount: number
    vCount: number
    lx: Float32Array
    lz: Float32Array
    uArr: Float32Array
    quadUMid: Float32Array
    quadVein: Float32Array
    quadEdge: Float32Array
    quadMargin: Uint8Array
  }

  function buildWingTemplate(isFore: boolean, side: -1 | 1): WingTemplate {
    const uSteps = isFore ? FORE_U : HIND_U
    const vSteps = isFore ? FORE_V : HIND_V
    const uCount = uSteps + 1
    const vCount = vSteps + 1
    const totalVerts = uCount * vCount
    const totalQuads = uSteps * vSteps

    const lx = new Float32Array(totalVerts)
    const lz = new Float32Array(totalVerts)
    const uArr = new Float32Array(uCount)

    for (let iu = 0; iu < uCount; iu++) {
      const u = iu / uSteps
      uArr[iu] = u
      for (let iv = 0; iv < vCount; iv++) {
        const v = iv / vSteps
        const idx = iu * vCount + iv
        if (isFore) {
          const tipTaper = 1 - 0.16 * Math.pow(2 * v - 1, 2) * Math.pow(u, 2.2)
          lx[idx] = side * (0.045 + u * 1.16 * tipTaper)
          const halfChord = 0.16 + 0.33 * Math.sin(Math.pow(u, 0.72) * Math.PI * 0.86)
          const forwardSweep = 0.38 * Math.pow(u, 0.82)
          const scallop = 0.018 * Math.sin(v * Math.PI * 5) * Math.pow(u, 3)
          lz[idx] = forwardSweep + (v - 0.5) * 2 * halfChord + scallop
        } else {
          const spanCurve = 0.55 + 0.45 * Math.sin(v * Math.PI * 0.72 + 0.25)
          lx[idx] = side * (0.04 + u * 0.84 * spanCurve)
          const lobe = 0.42 + 0.58 * Math.sin(u * Math.PI * 0.88)
          const tail = 0.13 * Math.exp(-Math.pow((u - 0.44) / 0.13, 2)) * (1 - v)
          lz[idx] = -0.1 - (1 - v) * (0.62 * lobe + tail) + v * 0.1
        }
      }
    }

    const quadUMid = new Float32Array(totalQuads)
    const quadVein = new Float32Array(totalQuads)
    const quadEdge = new Float32Array(totalQuads)
    const quadMargin = new Uint8Array(totalQuads)

    for (let iu = 0; iu < uSteps; iu++) {
      const uMid = (iu + 0.5) / uSteps
      for (let iv = 0; iv < vSteps; iv++) {
        const vMid = (iv + 0.5) / vSteps
        const qIdx = iu * vSteps + iv
        quadUMid[qIdx] = uMid
        quadVein[qIdx] = Math.pow(Math.abs(Math.sin(vMid * Math.PI * 5.5 + uMid * 1.4)), 12)
        quadEdge[qIdx] = Math.max(uMid, isFore ? 0 : 1 - vMid)
        quadMargin[qIdx] =
          uMid > 0.87 || (isFore && vMid > 0.91) || (!isFore && vMid < 0.11) ? 1 : 0
      }
    }

    return {
      uSteps,
      vSteps,
      uCount,
      vCount,
      lx,
      lz,
      uArr,
      quadUMid,
      quadVein,
      quadEdge,
      quadMargin
    }
  }

  const WING_TEMPLATES: Array<{ tpl: WingTemplate; isFore: boolean; side: -1 | 1 }> = [
    { tpl: buildWingTemplate(false, -1), isFore: false, side: -1 },
    { tpl: buildWingTemplate(false, 1), isFore: false, side: 1 },
    { tpl: buildWingTemplate(true, -1), isFore: true, side: -1 },
    { tpl: buildWingTemplate(true, 1), isFore: true, side: 1 }
  ]
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { Pause, Play } from 'lucide-svelte'
  import { i18n } from '../i18n'
  import { stepSpring, type SpringState } from '../motion'

  interface Props {
    density?: 'fine' | 'bold'
    splitMode?: 'cursor' | 'sweep' | 'half'
    class?: string
  }

  let {
    density: initialDensity = 'fine',
    splitMode: initialSplitMode = 'cursor',
    class: className = ''
  }: Props = $props()

  type SplitBehavior = 'cursor' | 'sweep' | 'half'
  type GlyphDensity = 'fine' | 'bold'

  let splitOverride = $state<SplitBehavior | null>(null)
  let densityOverride = $state<GlyphDensity | null>(null)
  let running = $state(true)

  const splitBehavior = $derived<SplitBehavior>(splitOverride ?? initialSplitMode)
  const density = $derived<GlyphDensity>(densityOverride ?? initialDensity)
  const isZh = $derived(i18n.locale === 'zh')

  let containerEl: HTMLDivElement | undefined = $state()
  let mainCanvas: HTMLCanvasElement | undefined = $state()

  let cssW = 520
  let cssH = 440
  let dpr = 1
  let gridCols = 75
  let gridRows = 44
  let cellW = 7
  let cellH = 10

  let isInView = true
  let isTabVisible = true
  let pointerActive = false
  let splitState: SpringState = { x: 0.52, v: 0 }
  let parallaxXState: SpringState = { x: 0, v: 0 }
  let parallaxYState: SpringState = { x: 0, v: 0 }
  let targetSplitRatio = 0.52
  let currentSplitRatio = 0.52
  let targetParallaxX = 0
  let targetParallaxY = 0
  let curParallaxX = 0
  let curParallaxY = 0
  let reducedMotion = false
  let simTime = 1.05
  let rafId = 0
  let lastTimestamp = 0

  let wakeRender: (() => void) | null = null

  interface PaletteSnapshot {
    bgHex: string
    inkHex: string
    mutedHex: string
    accentHex: string
    accentSoftHex: string
    ruleColor: string
    isDark: boolean
    inkRgb: [number, number, number]
    accentRgb: [number, number, number]
    softRgb: [number, number, number]
    bucketStyles: string[]
  }

  function parseCssColor(
    color: string,
    fallback: [number, number, number]
  ): [number, number, number] {
    const trimmed = color.trim()
    if (trimmed.startsWith('#')) {
      const clean = trimmed.slice(1)
      const full =
        clean.length === 3
          ? clean
              .split('')
              .map((c) => c + c)
              .join('')
          : clean.slice(0, 6)
      const num = parseInt(full, 16)
      if (!Number.isNaN(num)) {
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
      }
    }
    const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbMatch) {
      return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])]
    }
    return fallback
  }

  function buildPaletteSnapshot(
    bgHex: string,
    inkHex: string,
    mutedHex: string,
    accentHex: string,
    accentSoftHex: string,
    ruleColor: string,
    isDark: boolean
  ): PaletteSnapshot {
    const inkRgb = parseCssColor(inkHex, [236, 236, 232])
    const accentRgb = parseCssColor(accentHex, [238, 75, 43])
    const softRgb = parseCssColor(accentSoftHex, [255, 139, 106])
    const mixRgb = (
      a: [number, number, number],
      b: [number, number, number],
      t: number
    ): [number, number, number] => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ]

    const bucketStyles: string[] = []
    for (let i = 0; i < 8; i++) {
      const t = i / 7
      const alpha = isDark ? 0.24 + t * 0.76 : 0.96 - t * 0.62
      bucketStyles.push(`rgba(${inkRgb[0]},${inkRgb[1]},${inkRgb[2]},${alpha.toFixed(2)})`)
    }

    const deepShade: [number, number, number] = isDark
      ? [
          Math.round(accentRgb[0] * 0.36),
          Math.round(accentRgb[1] * 0.36),
          Math.round(accentRgb[2] * 0.36)
        ]
      : mixRgb(inkRgb, accentRgb, 0.56)
    const brightHighlight: [number, number, number] = isDark
      ? mixRgb(softRgb, [255, 255, 255], 0.35)
      : mixRgb(accentRgb, softRgb, 0.35)

    for (let i = 0; i < 8; i++) {
      const t = i / 7
      const rgb =
        t <= 0.55
          ? mixRgb(deepShade, accentRgb, t / 0.55)
          : mixRgb(accentRgb, brightHighlight, (t - 0.55) / 0.45)
      const alpha = isDark ? 1 : 0.96 - t * 0.18
      bucketStyles.push(`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(2)})`)
    }

    return {
      bgHex,
      inkHex,
      mutedHex,
      accentHex,
      accentSoftHex,
      ruleColor,
      isDark,
      inkRgb,
      accentRgb,
      softRgb,
      bucketStyles
    }
  }

  let palette = buildPaletteSnapshot(
    '#0d0e10',
    '#ecece8',
    '#8e929b',
    '#ee4b2b',
    '#ff8b6a',
    'rgba(236, 236, 232, 0.14)',
    true
  )

  function readThemePalette() {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const styles = getComputedStyle(root)
    const getVar = (name: string, fb: string) => styles.getPropertyValue(name).trim() || fb
    const mode = root.getAttribute('data-mode') || 'dark'
    palette = buildPaletteSnapshot(
      getVar('--terra-bg-base', '#0d0e10'),
      getVar('--terra-text-primary', '#ecece8'),
      getVar('--terra-text-muted', '#8e929b'),
      getVar('--terra-accent-primary', '#ee4b2b'),
      getVar('--terra-accent-primary-soft', '#ff8b6a'),
      getVar('--terra-border', 'rgba(236, 236, 232, 0.14)'),
      mode !== 'light'
    )
  }

  function handlePointerMove(e: PointerEvent) {
    if (!containerEl) return
    const rect = containerEl.getBoundingClientRect()
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    pointerActive = true
    if (splitBehavior === 'cursor') {
      targetSplitRatio = Math.max(0.08, Math.min(0.92, nx))
    }
    targetParallaxX = (nx - 0.5) * 2
    targetParallaxY = (ny - 0.5) * 2
    wakeRender?.()
  }

  function handlePointerLeave() {
    pointerActive = false
    targetParallaxX = 0
    targetParallaxY = 0
    wakeRender?.()
  }

  $effect(() => {
    void running
    void splitBehavior
    void density
    void isZh
    wakeRender?.()
  })

  interface QuadItem {
    x0: number
    y0: number
    x1: number
    y1: number
    x2: number
    y2: number
    x3: number
    y3: number
    depth: number
    fill: string
  }

  onMount(() => {
    readThemePalette()

    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      running = false
    }

    const mainCtx = mainCanvas?.getContext('2d', { alpha: false }) ?? null
    const offCanvas = document.createElement('canvas')
    const offCtx = offCanvas.getContext('2d')
    const asciiCanvas = document.createElement('canvas')
    const asciiCtx = asciiCanvas.getContext('2d', { willReadFrequently: true })

    const wxBuf = new Float32Array(MAX_VERTS)
    const wyBuf = new Float32Array(MAX_VERTS)
    const wzBuf = new Float32Array(MAX_VERTS)
    const sxBuf = new Float32Array(MAX_VERTS)
    const syBuf = new Float32Array(MAX_VERTS)
    const szBuf = new Float32Array(MAX_VERTS)

    const quads: QuadItem[] = Array.from({ length: TOTAL_QUADS }, () => ({
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      x3: 0,
      y3: 0,
      depth: 0,
      fill: '#000'
    }))

    const bucketMax = 1600
    const bucketCounts = new Int32Array(16)
    const bucketX = Array.from({ length: 16 }, () => new Float32Array(bucketMax))
    const bucketY = Array.from({ length: 16 }, () => new Float32Array(bucketMax))
    const bucketChar = Array.from({ length: 16 }, () => new Uint8Array(bucketMax))

    function syncSize() {
      if (!containerEl || !mainCanvas) return
      const rect = containerEl.getBoundingClientRect()
      cssW = Math.max(240, Math.floor(rect.width))
      cssH = Math.max(300, Math.floor(rect.height))
      dpr = Math.min(2, window.devicePixelRatio || 1)
      mainCanvas.width = Math.floor(cssW * dpr)
      mainCanvas.height = Math.floor(cssH * dpr)
      offCanvas.width = cssW
      offCanvas.height = cssH
      syncAsciiBuffer()
    }

    function syncAsciiBuffer() {
      cellW = density === 'fine' ? 7 : 10
      cellH = density === 'fine' ? 10 : 14
      gridCols = Math.max(1, Math.ceil(cssW / cellW))
      gridRows = Math.max(1, Math.ceil(cssH / cellH))
      if (asciiCanvas.width !== gridCols || asciiCanvas.height !== gridRows) {
        asciiCanvas.width = gridCols
        asciiCanvas.height = gridRows
      }
    }

    function scheduleFrame() {
      if (!isInView || !isTabVisible || rafId !== 0) return
      lastTimestamp = performance.now()
      rafId = requestAnimationFrame(renderFrame)
    }

    wakeRender = () => {
      syncAsciiBuffer()
      scheduleFrame()
    }

    const themeObserver = new MutationObserver(() => {
      readThemePalette()
      scheduleFrame()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mode']
    })

    const viewObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isInView = entry.isIntersecting
          if (isInView) {
            scheduleFrame()
          }
        }
      },
      { rootMargin: '80px' }
    )
    if (containerEl) viewObserver.observe(containerEl)

    function onVisibilityChange() {
      isTabVisible = !document.hidden
      if (isTabVisible) {
        scheduleFrame()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    syncSize()
    const resizeObserver = new ResizeObserver(() => {
      syncSize()
      scheduleFrame()
    })
    if (containerEl) resizeObserver.observe(containerEl)

    function renderFrame(now: number) {
      rafId = 0
      if (!isInView || !isTabVisible) return

      const dt = Math.min(0.04, Math.max(0.001, (now - lastTimestamp) / 1000))
      lastTimestamp = now

      if (running) {
        simTime += dt * 4.2
      }

      if (splitBehavior === 'half' || (!running && !pointerActive && splitBehavior === 'sweep')) {
        targetSplitRatio = 0.5
      } else if (splitBehavior === 'sweep' && running) {
        targetSplitRatio = 0.5 + 0.36 * Math.sin(now * 0.00085)
      } else if (!pointerActive) {
        if (running && !reducedMotion) {
          targetSplitRatio = 0.5 + 0.14 * Math.sin(now * 0.0007)
        } else {
          targetSplitRatio = 0.5
        }
      }

      const splitSettled = stepSpring(splitState, targetSplitRatio, dt, 220, 26)
      const pxSettled = stepSpring(parallaxXState, targetParallaxX, dt, 180, 24)
      const pySettled = stepSpring(parallaxYState, targetParallaxY, dt, 180, 24)
      currentSplitRatio = splitState.x
      curParallaxX = parallaxXState.x
      curParallaxY = parallaxYState.x

      if (mainCtx && offCtx && asciiCtx && cssW > 0 && cssH > 0) {
        drawSpecimen(mainCtx, offCtx, asciiCtx)
      }

      const activeSweep = splitBehavior === 'sweep' && running && !reducedMotion
      const idleSway = splitBehavior === 'cursor' && !pointerActive && running && !reducedMotion
      if (running || activeSweep || idleSway || !splitSettled || !pxSettled || !pySettled) {
        rafId = requestAnimationFrame(renderFrame)
      }
    }

    function drawSpecimen(
      ctx: CanvasRenderingContext2D,
      oCtx: CanvasRenderingContext2D,
      aCtx: CanvasRenderingContext2D
    ) {
      const w = cssW
      const h = cssH
      const ar = palette.accentRgb[0]
      const ag = palette.accentRgb[1]
      const ab = palette.accentRgb[2]
      const sr = palette.softRgb[0]
      const sg = palette.softRgb[1]
      const sb = palette.softRgb[2]

      const baseBlend = palette.isDark ? 0.35 : 0.26
      const baseSeed = palette.isDark ? 28 : 24
      const br = Math.round(baseSeed + (ar - baseSeed) * baseBlend)
      const bg = Math.round(baseSeed + 4 + (ag - (baseSeed + 4)) * baseBlend)
      const bb = Math.round(baseSeed + 10 + (ab - (baseSeed + 10)) * baseBlend)

      const mr = Math.round(ar + (sr - ar) * 0.4)
      const mg = Math.round(ag + (sg - ag) * 0.4)
      const mb = Math.round(ab + (sb - ab) * 0.4)

      const margR = palette.isDark ? 14 : 18
      const margG = palette.isDark ? 16 : 20
      const margB = palette.isDark ? 20 : 24

      oCtx.clearRect(0, 0, w, h)

      const pitch = 0.5 + curParallaxY * 0.18
      const yaw = -0.32 + curParallaxX * 0.26
      const cosP = Math.cos(pitch)
      const sinP = Math.sin(pitch)
      const cosY = Math.cos(yaw)
      const sinY = Math.sin(yaw)

      const camDist = 3.65
      const scale = Math.min(w * 1.05, h * 1.24) * 1.2
      const cx = w * 0.5
      const cy = h * 0.51

      const bodyY = -0.05 * Math.sin(simTime - 0.45)
      const lx = 0.48
      const ly = 0.82
      const lz = 0.31

      let quadWriteIdx = 0

      for (let tIdx = 0; tIdx < WING_TEMPLATES.length; tIdx++) {
        const { tpl, isFore, side } = WING_TEMPLATES[tIdx]
        const phase = isFore ? simTime : simTime - 0.28
        const baseAngle = -0.06 + 0.92 * (Math.sin(phase) - 0.17 * Math.sin(2 * phase))
        const cosPhase = Math.cos(phase)
        const hingeX = side * 0.045

        for (let iu = 0; iu < tpl.uCount; iu++) {
          const u = tpl.uArr[iu]
          const angle = baseAngle - 0.25 * cosPhase * u * u
          const cosA = Math.cos(angle)
          const sinA = Math.sin(angle)

          for (let iv = 0; iv < tpl.vCount; iv++) {
            const idx = iu * tpl.vCount + iv
            const dx = Math.abs(tpl.lx[idx] - hingeX)
            const wx = hingeX + side * dx * cosA
            const wy = bodyY + dx * sinA
            const wz = tpl.lz[idx]

            wxBuf[idx] = wx
            wyBuf[idx] = wy
            wzBuf[idx] = wz

            const x1 = wx * cosY - wz * sinY
            const z1 = wx * sinY + wz * cosY
            const y2 = wy * cosP - z1 * sinP
            const z2 = wy * sinP + z1 * cosP
            const persp = scale / (camDist - z2)

            sxBuf[idx] = cx + x1 * persp
            syBuf[idx] = cy - y2 * persp
            szBuf[idx] = z2
          }
        }

        for (let iu = 0; iu < tpl.uSteps; iu++) {
          for (let iv = 0; iv < tpl.vSteps; iv++) {
            const i0 = iu * tpl.vCount + iv
            const i1 = (iu + 1) * tpl.vCount + iv
            const i2 = i1 + 1
            const i3 = i0 + 1
            const qMetaIdx = iu * tpl.vSteps + iv

            const ax = wxBuf[i1] - wxBuf[i0]
            const ay = wyBuf[i1] - wyBuf[i0]
            const az = wzBuf[i1] - wzBuf[i0]
            const bx = wxBuf[i3] - wxBuf[i0]
            const by = wyBuf[i3] - wyBuf[i0]
            const bz = wzBuf[i3] - wzBuf[i0]

            let nx = ay * bz - az * by
            let ny = az * bx - ax * bz
            let nz = ax * by - ay * bx
            const nLen = Math.hypot(nx, ny, nz) || 1
            nx /= nLen
            ny /= nLen
            nz /= nLen

            const diffuse = Math.abs(nx * lx + ny * ly + nz * lz)
            const rim = Math.pow(1 - Math.min(1, Math.abs(nz)), 2.2)

            const uMid = tpl.quadUMid[qMetaIdx]
            const vein = tpl.quadVein[qMetaIdx]
            const edgeFactor = tpl.quadEdge[qMetaIdx]
            const isMargin = tpl.quadMargin[qMetaIdx] === 1

            const baseMix = Math.min(1, 0.25 + 0.65 * diffuse * (1 - uMid * 0.35))
            let r = br + (mr - br) * baseMix
            let g = bg + (mg - bg) * baseMix
            let b = bb + (mb - bb) * baseMix

            if (isMargin) {
              r += (margR - r) * 0.68
              g += (margG - g) * 0.68
              b += (margB - b) * 0.68
            } else {
              const softMix = Math.min(1, 0.35 * rim + 0.22 * diffuse * (1 - vein * 0.6))
              r += (sr - r) * softMix
              g += (sg - g) * softMix
              b += (sb - b) * softMix
            }

            const veinMix = vein * 0.38 * edgeFactor
            const fr = Math.round(r + (margR - r) * veinMix)
            const fg = Math.round(g + (margG - g) * veinMix)
            const fb = Math.round(b + (margB - b) * veinMix)

            const q = quads[quadWriteIdx++]
            q.x0 = sxBuf[i0]
            q.y0 = syBuf[i0]
            q.x1 = sxBuf[i1]
            q.y1 = syBuf[i1]
            q.x2 = sxBuf[i2]
            q.y2 = syBuf[i2]
            q.x3 = sxBuf[i3]
            q.y3 = syBuf[i3]
            q.depth = (szBuf[i0] + szBuf[i1] + szBuf[i2] + szBuf[i3]) * 0.25
            q.fill = `rgb(${fr},${fg},${fb})`
          }
        }
      }

      quads.sort((a, b) => a.depth - b.depth)

      oCtx.lineWidth = 0.6
      for (let i = 0; i < TOTAL_QUADS; i++) {
        const q = quads[i]
        oCtx.beginPath()
        oCtx.moveTo(q.x0, q.y0)
        oCtx.lineTo(q.x1, q.y1)
        oCtx.lineTo(q.x2, q.y2)
        oCtx.lineTo(q.x3, q.y3)
        oCtx.closePath()
        oCtx.fillStyle = q.fill
        oCtx.fill()
        oCtx.strokeStyle = q.fill
        oCtx.stroke()
      }

      const bodyR = Math.round(margR + (ar - margR) * 0.15)
      const bodyG = Math.round(margG + (ag - margG) * 0.15)
      const bodyB = Math.round(margB + (ab - margB) * 0.15)
      oCtx.strokeStyle = `rgb(${bodyR},${bodyG},${bodyB})`
      oCtx.lineCap = 'round'

      const projectPoint = (px: number, py: number, pz: number): [number, number] => {
        const x1 = px * cosY - pz * sinY
        const z1 = px * sinY + pz * cosY
        const y2 = py * cosP - z1 * sinP
        const z2 = py * sinP + z1 * cosP
        const persp = scale / (camDist - z2)
        return [cx + x1 * persp, cy - y2 * persp]
      }

      for (let i = 0; i < 9; i++) {
        const t0 = i / 9
        const t1 = (i + 1) / 9
        const [xA, yA] = projectPoint(0, bodyY - 0.03 * Math.sin(t0 * Math.PI), 0.24 - t0 * 0.72)
        const [xB, yB] = projectPoint(0, bodyY - 0.03 * Math.sin(t1 * Math.PI), 0.24 - t1 * 0.72)
        oCtx.lineWidth = Math.max(
          2.5,
          (i < 3 ? 0.055 : 0.038 * (1 - (i - 3) * 0.08)) * scale * 0.36
        )
        oCtx.beginPath()
        oCtx.moveTo(xA, yA)
        oCtx.lineTo(xB, yB)
        oCtx.stroke()
      }

      oCtx.lineWidth = 1.8
      for (const side of [-1, 1] as const) {
        const [ax0, ay0] = projectPoint(side * 0.02, bodyY + 0.02, 0.24)
        const [ax1, ay1] = projectPoint(side * 0.14, bodyY + 0.14, 0.44)
        const [ax2, ay2] = projectPoint(side * 0.24, bodyY + 0.18, 0.58)
        oCtx.beginPath()
        oCtx.moveTo(ax0, ay0)
        oCtx.quadraticCurveTo(ax1, ay1, ax2, ay2)
        oCtx.stroke()
      }

      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = palette.bgHex
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = palette.ruleColor
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, Math.round(h * 0.5) + 0.5)
      ctx.lineTo(w, Math.round(h * 0.5) + 0.5)
      ctx.stroke()

      const splitX = Math.round(w * currentSplitRatio)

      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, splitX, h)
      ctx.clip()
      ctx.drawImage(offCanvas, 0, 0, w, h)
      ctx.restore()

      syncAsciiBuffer()
      aCtx.clearRect(0, 0, gridCols, gridRows)
      aCtx.drawImage(offCanvas, 0, 0, gridCols, gridRows)

      const startCol = Math.max(0, Math.floor(splitX / cellW))
      const readWidth = Math.max(1, gridCols - startCol)
      const imgData = aCtx.getImageData(startCol, 0, readWidth, gridRows).data

      bucketCounts.fill(0)
      for (let row = 0; row < gridRows; row++) {
        const py = row * cellH + cellH * 0.5
        for (let localCol = 0; localCol < readWidth; localCol++) {
          const idx = (row * readWidth + localCol) * 4
          if (imgData[idx + 3] < 22) continue

          const r = imgData[idx]
          const g = imgData[idx + 1]
          const b = imgData[idx + 2]
          const maxC = r > g ? (r > b ? r : b) : g > b ? g : b
          const minC = r < g ? (r < b ? r : b) : g < b ? g : b
          const chroma = (maxC - minC) / 255

          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          const tone = Math.pow(Math.max(0, Math.min(1, (lum - 0.04) / 0.72)), 0.85)
          const densityFactor = palette.isDark ? 0.12 + tone * 0.88 : 1 - tone * 0.76
          const charIdx = Math.min(
            ASCII_RAMP.length - 1,
            Math.max(1, Math.round(densityFactor * (ASCII_RAMP.length - 1)))
          )

          const bIdx = (chroma > 0.08 ? 8 : 0) + Math.min(7, Math.floor(tone * 7.99))
          const count = bucketCounts[bIdx]
          if (count < bucketMax) {
            bucketX[bIdx][count] = (startCol + localCol) * cellW + cellW * 0.5
            bucketY[bIdx][count] = py
            bucketChar[bIdx][count] = charIdx
            bucketCounts[bIdx] = count + 1
          }
        }
      }

      ctx.save()
      ctx.beginPath()
      ctx.rect(splitX, 0, w - splitX, h)
      ctx.clip()
      ctx.font = `${density === 'fine' ? '600 10px' : '700 13px'} "JetBrains Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let b = 0; b < 16; b++) {
        const len = bucketCounts[b]
        if (len === 0) continue
        ctx.fillStyle = palette.bucketStyles[b]
        const xs = bucketX[b]
        const ys = bucketY[b]
        const cs = bucketChar[b]
        for (let i = 0; i < len; i++) {
          ctx.fillText(ASCII_RAMP[cs[i]], xs[i], ys[i])
        }
      }
      ctx.restore()

      ctx.strokeStyle = palette.accentHex
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(splitX + 0.5, 0)
      ctx.lineTo(splitX + 0.5, h)
      ctx.stroke()

      ctx.fillStyle = palette.accentHex
      ctx.fillRect(splitX - 2, Math.round(h * 0.5) - 10, 5, 20)

      ctx.font = '500 10px "JetBrains Mono", monospace'
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillStyle = palette.mutedHex
      ctx.fillText(isZh ? '光学 3D' : 'OPTICAL 3D', 14, 12)

      ctx.textAlign = 'right'
      ctx.fillStyle = palette.accentHex
      ctx.fillText(isZh ? '字符场' : 'ASCII FIELD', w - 14, 12)

      ctx.restore()
    }

    scheduleFrame()
    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      viewObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      wakeRender = null
    }
  })
</script>

<div class="flex flex-col h-full justify-between bg-[var(--terra-bg-surface)] {className}">
  <div
    bind:this={containerEl}
    onpointermove={handlePointerMove}
    onpointerleave={handlePointerLeave}
    role="region"
    aria-label={isZh
      ? '半真实半 ASCII 3D 振翅蝴蝶图版'
      : 'Half-real half-ASCII 3D butterfly specimen'}
    class="relative flex-1 min-h-[380px] sm:min-h-[450px] w-full cursor-ew-resize select-none bg-[var(--terra-bg-base)]"
  >
    <canvas bind:this={mainCanvas} class="block w-full h-full"></canvas>
  </div>

  <div
    class="px-4 py-2.5 border-t border-[var(--terra-border)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono"
  >
    <div class="flex items-center gap-1">
      <span class="mr-1 text-[var(--terra-text-muted)] uppercase">
        {isZh ? '分割:' : 'SPLIT:'}
      </span>
      {#each [{ id: 'cursor', zh: '光标', en: 'Cursor' }, { id: 'sweep', zh: '扫掠', en: 'Sweep' }, { id: 'half', zh: '对半', en: '50/50' }] as item (item.id)}
        <button
          type="button"
          onclick={() => (splitOverride = item.id as SplitBehavior)}
          class="terra-t-color px-2 py-0.5 border cursor-pointer {splitBehavior === item.id
            ? 'border-[var(--terra-accent-primary)] text-[var(--terra-accent-primary)]'
            : 'border-[var(--terra-border)] text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}"
        >
          {isZh ? item.zh : item.en}
        </button>
      {/each}
    </div>

    <div class="flex items-center gap-1.5">
      <button
        type="button"
        onclick={() => (densityOverride = density === 'fine' ? 'bold' : 'fine')}
        class="terra-t-color px-2 py-0.5 border border-[var(--terra-border)] text-[var(--terra-text-primary)] cursor-pointer hover:border-[var(--terra-border-strong)]"
      >
        {isZh ? '字粒: ' : 'Grid: '}
        {density === 'fine' ? (isZh ? '细腻' : 'Fine') : isZh ? '粗犷' : 'Bold'}
      </button>

      <button
        type="button"
        onclick={() => (running = !running)}
        aria-label={running ? 'Pause specimen' : 'Play specimen'}
        class="terra-t-color inline-flex items-center gap-1 px-2 py-0.5 border border-[var(--terra-border)] text-[var(--terra-text-primary)] cursor-pointer hover:border-[var(--terra-border-strong)]"
      >
        {#if running}
          <Pause class="w-3 h-3" />
          <span>{isZh ? '暂停' : 'Pause'}</span>
        {:else}
          <Play class="w-3 h-3" />
          <span>{isZh ? '播放' : 'Play'}</span>
        {/if}
      </button>
    </div>
  </div>
</div>
