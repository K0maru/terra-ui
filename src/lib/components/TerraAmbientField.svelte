<script lang="ts">
  import { onMount } from 'svelte'
  import { stepSpring, type SpringState } from '../motion'

  interface Ripple {
    x: number
    y: number
    radius: number
    alpha: number
  }

  let canvasEl: HTMLCanvasElement | undefined = $state()

  onMount(() => {
    const canvas = canvasEl
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const STEP = 36
    const OFFSET = 18
    const RADIUS = 185
    const GLYPHS = ['·', ':', '+', '×']

    let cssW = window.innerWidth
    let cssH = window.innerHeight
    let dpr = Math.min(2, window.devicePixelRatio || 1)
    let rafId = 0
    let lastNow = 0
    let accentRgb = '238, 75, 43'

    const ptrX: SpringState = { x: -400, v: 0 }
    const ptrY: SpringState = { x: -400, v: 0 }
    const ptrPresence: SpringState = { x: 0, v: 0 }
    let targetX = -400
    let targetY = -400
    let targetPresence = 0
    let pointerInside = false
    const ripples: Ripple[] = []

    function readAccentRgb() {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--terra-dot-rgb')
        .trim()
      if (raw) accentRgb = raw
    }

    function syncSize() {
      cssW = window.innerWidth
      cssH = window.innerHeight
      dpr = Math.min(2, window.devicePixelRatio || 1)
      if (!canvas) return
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)
    }

    function kick() {
      if (rafId !== 0 || document.hidden || document.documentElement.dataset.motion === 'paused') {
        return
      }
      lastNow = performance.now()
      rafId = requestAnimationFrame(renderFrame)
    }

    function drawGlyph(gx: number, gy: number, energy: number, ox: number, oy: number) {
      if (!ctx || energy < 0.08) return
      const gIdx = Math.min(GLYPHS.length - 1, Math.floor(energy * GLYPHS.length))
      const alpha = Math.min(0.72, energy * 0.68)
      ctx.fillStyle = `rgba(${accentRgb}, ${alpha.toFixed(3)})`
      ctx.fillText(GLYPHS[gIdx], gx + ox, gy + oy)
    }

    function renderFrame(now: number) {
      rafId = 0
      if (!ctx || document.hidden || document.documentElement.dataset.motion === 'paused') {
        ctx?.setTransform(1, 0, 0, 1, 0, 0)
        ctx?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0)
        return
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000))
      lastNow = now

      const sx = stepSpring(ptrX, targetX, dt, 340, 28)
      const sy = stepSpring(ptrY, targetY, dt, 340, 28)
      const sp = stepSpring(ptrPresence, targetPresence, dt, 240, 26)

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.radius += dt * 420
        rp.alpha = Math.max(0, 1 - rp.radius / 260)
        if (rp.alpha <= 0.01) {
          ripples.splice(i, 1)
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssW, cssH)

      if (ptrPresence.x > 0.01 || ripples.length > 0) {
        ctx.font = '500 11px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        if (ptrPresence.x > 0.01) {
          const minCol = Math.max(0, Math.floor((ptrX.x - RADIUS - OFFSET) / STEP))
          const maxCol = Math.min(
            Math.ceil(cssW / STEP),
            Math.ceil((ptrX.x + RADIUS - OFFSET) / STEP)
          )
          const minRow = Math.max(0, Math.floor((ptrY.x - RADIUS - OFFSET) / STEP))
          const maxRow = Math.min(
            Math.ceil(cssH / STEP),
            Math.ceil((ptrY.x + RADIUS - OFFSET) / STEP)
          )

          for (let c = minCol; c <= maxCol; c++) {
            const gx = OFFSET + c * STEP
            for (let r = minRow; r <= maxRow; r++) {
              const gy = OFFSET + r * STEP
              const dx = gx - ptrX.x
              const dy = gy - ptrY.x
              const dist = Math.hypot(dx, dy)
              if (dist >= RADIUS) continue

              const falloff = 1 - dist / RADIUS
              const energy = falloff * falloff * ptrPresence.x
              const push = falloff * ptrPresence.x * 2.5
              const inv = dist > 1 ? push / dist : 0
              drawGlyph(gx, gy, energy, dx * inv, dy * inv)
            }
          }
        }

        for (const rp of ripples) {
          const bound = rp.radius + 38
          const minCol = Math.max(0, Math.floor((rp.x - bound - OFFSET) / STEP))
          const maxCol = Math.min(Math.ceil(cssW / STEP), Math.ceil((rp.x + bound - OFFSET) / STEP))
          const minRow = Math.max(0, Math.floor((rp.y - bound - OFFSET) / STEP))
          const maxRow = Math.min(Math.ceil(cssH / STEP), Math.ceil((rp.y + bound - OFFSET) / STEP))

          for (let c = minCol; c <= maxCol; c++) {
            const gx = OFFSET + c * STEP
            for (let r = minRow; r <= maxRow; r++) {
              const gy = OFFSET + r * STEP
              const d = Math.hypot(gx - rp.x, gy - rp.y)
              const ringDist = Math.abs(d - rp.radius)
              if (ringDist < 36) {
                const wave = (1 - ringDist / 36) * rp.alpha * 0.85
                drawGlyph(gx, gy, wave, 0, 0)
              }
            }
          }
        }
      }

      if (!sx || !sy || !sp || ripples.length > 0) {
        rafId = requestAnimationFrame(renderFrame)
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === 'touch') return
      if (!pointerInside) {
        ptrX.x = e.clientX
        ptrY.x = e.clientY
        ptrX.v = 0
        ptrY.v = 0
        pointerInside = true
      }
      targetX = e.clientX
      targetY = e.clientY
      targetPresence = 1
      kick()
    }

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === 'touch') return
      ripples.push({ x: e.clientX, y: e.clientY, radius: 4, alpha: 1 })
      if (ripples.length > 4) ripples.shift()
      kick()
    }

    function onLeave() {
      pointerInside = false
      targetPresence = 0
      kick()
    }

    function onMouseOut(e: MouseEvent) {
      if (e.relatedTarget === null) onLeave()
    }

    const observer = new MutationObserver(() => {
      readAccentRgb()
      kick()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mode', 'data-motion']
    })

    readAccentRgb()
    syncSize()

    window.addEventListener('resize', syncSize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('mouseout', onMouseOut)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', kick)

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', syncSize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('mouseout', onMouseOut)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', kick)
    }
  })
</script>

<canvas
  bind:this={canvasEl}
  class="fixed inset-0 w-full h-full z-[-1] pointer-events-none"
  aria-hidden="true"
></canvas>
