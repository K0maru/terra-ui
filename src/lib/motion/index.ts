import { flushSync } from 'svelte'
import type { Action } from 'svelte/action'

export type TerraThemeId = 'vermilion' | 'viridian' | 'cyanotype' | 'citron'
export type TerraColorMode = 'dark' | 'light'
export type ViewTransitionStyle = 'iris' | 'sweep' | 'fade'

export interface TerraThemeMeta {
  id: TerraThemeId
  labelZh: string
  labelEn: string
  subtitleZh: string
  subtitleEn: string
  darkSwatch: string
  lightSwatch: string
}

export const TERRA_THEMES: TerraThemeMeta[] = [
  {
    id: 'vermilion',
    labelZh: '朱砂',
    labelEn: 'Vermilion',
    subtitleZh: '建筑冷灰 × 朱砂',
    subtitleEn: 'Mineral Gray × Vermilion',
    darkSwatch: '#EE4B2B',
    lightSwatch: '#C9341B'
  },
  {
    id: 'viridian',
    labelZh: '铬绿',
    labelEn: 'Viridian',
    subtitleZh: '矿石青灰 × 氧化铬绿',
    subtitleEn: 'Stone Gray × Viridian',
    darkSwatch: '#3FD1A0',
    lightSwatch: '#186A52'
  },
  {
    id: 'cyanotype',
    labelZh: '普鲁士蓝',
    labelEn: 'Cyanotype',
    subtitleZh: '制图冷银 × 普鲁士蓝',
    subtitleEn: 'Silver Blueprint × Prussian Blue',
    darkSwatch: '#5B86FF',
    lightSwatch: '#1B4DFF'
  },
  {
    id: 'citron',
    labelZh: '酸性柠',
    labelEn: 'Citron',
    subtitleZh: '纯炭墨 × 冷酸性柠',
    subtitleEn: 'Carbon Ink × Acid Citron',
    darkSwatch: '#D2FF28',
    lightSwatch: '#4D6600'
  }
]

export const SPRING = {
  pointer: { stiffness: 0.22, damping: 0.78 },
  indicator: { stiffness: 0.16, damping: 0.72 },
  value: { stiffness: 0.1, damping: 0.95 }
} as const

export interface SpringState {
  x: number
  v: number
}

export function stepSpring(
  state: SpringState,
  target: number,
  dt: number,
  k = 676,
  c = 40.6
): boolean {
  const clampedDt = Math.min(0.05, Math.max(0.001, dt))
  const a = -k * (state.x - target) - c * state.v
  state.v += a * clampedDt
  state.x += state.v * clampedDt
  const settled = Math.abs(state.x - target) < 1e-3 && Math.abs(state.v) < 1e-3
  if (settled) {
    state.x = target
    state.v = 0
  }
  return settled
}

export function withThemeSwitch(update: () => void): void {
  if (typeof document === 'undefined') {
    update()
    return
  }
  const root = document.documentElement
  root.dataset.themeSwitching = '1'
  flushSync(() => {
    update()
  })
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      delete root.dataset.themeSwitching
    })
  })
}

export function withViewTransition(
  update: () => void,
  origin?: { x: number; y: number },
  style: ViewTransitionStyle = 'sweep',
  focusSelector?: string
): void {
  if (typeof document === 'undefined') {
    update()
    return
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> }
  }

  const routeFocus = () => {
    if (!focusSelector) return
    const target = document.querySelector<HTMLElement>(focusSelector)
    target?.focus({ preventScroll: true })
  }

  if (!doc.startViewTransition || reducedMotion) {
    flushSync(() => {
      update()
    })
    queueMicrotask(routeFocus)
    return
  }

  const root = document.documentElement
  root.style.setProperty('--vt-x', origin ? `${origin.x}px` : '50vw')
  root.style.setProperty('--vt-y', origin ? `${origin.y}px` : '50vh')
  root.dataset.vtStyle = style

  const transition = doc.startViewTransition(() => {
    flushSync(() => {
      update()
    })
  })

  transition.finished.finally(() => {
    delete root.dataset.vtStyle
    routeFocus()
  })
}

export const magnetic: Action<
  HTMLElement,
  { strength?: number; disabled?: boolean } | undefined
> = (node, initialOpts) => {
  if (typeof window === 'undefined') return {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {}

  let strength = initialOpts?.strength ?? 0.22
  let disabled = initialOpts?.disabled ?? false
  let targetX = 0
  let targetY = 0
  const sx: SpringState = { x: 0, v: 0 }
  const sy: SpringState = { x: 0, v: 0 }
  let cachedRect: { left: number; top: number; width: number; height: number } | null = null
  let rafId = 0
  let lastNow = 0

  function refreshBaseRect() {
    const prevTransform = node.style.transform
    node.style.transform = ''
    const r = node.getBoundingClientRect()
    cachedRect = { left: r.left, top: r.top, width: r.width, height: r.height }
    if (prevTransform) {
      node.style.transform = prevTransform
    }
  }

  function step(now: number) {
    const dt = lastNow ? (now - lastNow) / 1000 : 1 / 60
    lastNow = now
    const settledX = stepSpring(sx, targetX, dt, 420, 30)
    const settledY = stepSpring(sy, targetY, dt, 420, 30)

    if (settledX && settledY && targetX === 0 && targetY === 0) {
      node.style.transform = ''
      rafId = 0
      return
    }

    node.style.transform = `translate3d(${sx.x.toFixed(2)}px, ${sy.x.toFixed(2)}px, 0)`
    if (settledX && settledY) {
      rafId = 0
    } else {
      rafId = requestAnimationFrame(step)
    }
  }

  function kick() {
    if (!rafId) {
      lastNow = performance.now()
      rafId = requestAnimationFrame(step)
    }
  }

  function onPointerEnter(e: PointerEvent) {
    if (disabled || e.pointerType === 'touch') return
    refreshBaseRect()
  }

  function onPointerMove(e: PointerEvent) {
    if (disabled || e.pointerType === 'touch') return
    if (!cachedRect) refreshBaseRect()
    const rect = cachedRect
    if (!rect) return
    targetX = (e.clientX - (rect.left + rect.width / 2)) * strength
    targetY = (e.clientY - (rect.top + rect.height / 2)) * strength
    kick()
  }

  function onPointerLeave() {
    targetX = 0
    targetY = 0
    cachedRect = null
    kick()
  }

  function onInvalidate() {
    cachedRect = null
  }

  node.addEventListener('pointerenter', onPointerEnter)
  node.addEventListener('pointermove', onPointerMove)
  node.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('resize', onInvalidate, { passive: true })
  window.addEventListener('scroll', onInvalidate, { passive: true })

  return {
    update(nextOpts) {
      strength = nextOpts?.strength ?? 0.22
      disabled = nextOpts?.disabled ?? false
      if (disabled) {
        targetX = 0
        targetY = 0
        cachedRect = null
        kick()
      }
    },
    destroy() {
      if (rafId) cancelAnimationFrame(rafId)
      node.removeEventListener('pointerenter', onPointerEnter)
      node.removeEventListener('pointermove', onPointerMove)
      node.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onInvalidate)
      window.removeEventListener('scroll', onInvalidate)
      node.style.transform = ''
    }
  }
}

export const scrollReveal: Action<HTMLElement, { index?: number; delay?: number } | undefined> = (
  node,
  opts
) => {
  if (typeof window === 'undefined') return {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {}

  const applyVars = (nextOpts?: { index?: number; delay?: number }) => {
    if (nextOpts?.index !== undefined) {
      node.style.setProperty('--reveal-index', String(nextOpts.index))
    }
    if (nextOpts?.delay !== undefined) {
      node.style.setProperty('--reveal-delay', `${nextOpts.delay}ms`)
    }
  }
  applyVars(opts)

  const supportsViewTimeline = CSS.supports(
    '(animation-timeline: view()) and (animation-range: entry)'
  )

  if (supportsViewTimeline) {
    node.classList.add('terra-scroll-reveal')
    return {
      update: applyVars,
      destroy() {
        node.classList.remove('terra-scroll-reveal')
      }
    }
  }

  node.classList.add('terra-reveal-fallback')
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.dataset.revealed = 'true'
          observer.unobserve(node)
        }
      }
    },
    { threshold: 0.12 }
  )
  observer.observe(node)

  return {
    update: applyVars,
    destroy() {
      observer.disconnect()
      node.classList.remove('terra-reveal-fallback')
      delete node.dataset.revealed
    }
  }
}

export function animateNumber(
  from: number,
  to: number,
  durationMs: number,
  onUpdate: (val: number) => void
): () => void {
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    durationMs <= 0
  ) {
    onUpdate(to)
    return () => {}
  }

  const start = performance.now()
  let rafId = 0

  function frame(now: number) {
    const t = Math.min(1, (now - start) / durationMs)
    const eased = 1 - Math.pow(1 - t, 3)
    onUpdate(from + (to - from) * eased)
    if (t < 1) {
      rafId = requestAnimationFrame(frame)
    } else {
      onUpdate(to)
    }
  }

  rafId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(rafId)
}
