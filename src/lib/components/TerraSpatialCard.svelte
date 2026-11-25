<script lang="ts">
  import type { Snippet } from 'svelte'
  import { stepSpring, type SpringState } from '../motion'

  interface Props {
    /** @deprecated Chamfer cuts removed in flat editorial system. */
    cut?: 'none' | 'tr' | 'tl-br' | 'tr-bl'
    maxRotation?: number
    perspective?: number
    sheen?: boolean
    borderGlow?: boolean
    class?: string
    children?: Snippet
  }

  let {
    cut: _cut = 'none',
    maxRotation = 12,
    perspective = 1000,
    sheen = true,
    borderGlow = true,
    class: className = '',
    children
  }: Props = $props()

  let rx = $state(0)
  let ry = $state(0)
  let sheenX = $state(50)
  let sheenY = $state(50)
  let isHovered = $state(false)

  let targetRx = 0
  let targetRy = 0
  const rxState: SpringState = { x: 0, v: 0 }
  const ryState: SpringState = { x: 0, v: 0 }
  let cachedRect: { left: number; top: number; width: number; height: number } | null = null
  let rafId = 0
  let lastNow = 0

  function kickSpring() {
    if (rafId !== 0) return
    lastNow = performance.now()
    rafId = requestAnimationFrame(stepTilt)
  }

  function stepTilt(now: number) {
    rafId = 0
    const dt = (now - lastNow) / 1000
    lastNow = now
    const s1 = stepSpring(rxState, targetRx, dt, 300, 24)
    const s2 = stepSpring(ryState, targetRy, dt, 300, 24)
    rx = rxState.x
    ry = ryState.x
    if (!s1 || !s2) {
      rafId = requestAnimationFrame(stepTilt)
    }
  }

  function handlePointerEnter(e: PointerEvent) {
    if (e.pointerType === 'touch') return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const card = e.currentTarget as HTMLElement
    const r = card.getBoundingClientRect()
    cachedRect = {
      left: r.left,
      top: r.top,
      width: Math.max(1, r.width),
      height: Math.max(1, r.height)
    }
    isHovered = true
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerType === 'touch') return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    if (!cachedRect) {
      const card = e.currentTarget as HTMLElement
      const r = card.getBoundingClientRect()
      cachedRect = {
        left: r.left,
        top: r.top,
        width: Math.max(1, r.width),
        height: Math.max(1, r.height)
      }
    }
    const x = e.clientX - cachedRect.left
    const y = e.clientY - cachedRect.top
    const centerX = cachedRect.width / 2
    const centerY = cachedRect.height / 2

    targetRx = ((y - centerY) / cachedRect.height) * -maxRotation
    targetRy = ((x - centerX) / cachedRect.width) * maxRotation
    sheenX = Math.round((x / cachedRect.width) * 100)
    sheenY = Math.round((y / cachedRect.height) * 100)
    isHovered = true
    kickSpring()
  }

  function handlePointerLeave() {
    cachedRect = null
    targetRx = 0
    targetRy = 0
    isHovered = false
    kickSpring()
  }
</script>

<div
  class="isolate relative select-none {className}"
  style="perspective: {perspective}px;"
  onpointerenter={handlePointerEnter}
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  role="region"
  aria-label="3D Spatial Card"
>
  <div
    class="relative w-full h-full will-change-transform"
    style="
      transform-style: preserve-3d;
      transform: rotateX({rx.toFixed(2)}deg) rotateY({ry.toFixed(2)}deg);
    "
  >
    <div
      class="terra-t-color absolute inset-0 bg-[var(--terra-bg-surface)] border pointer-events-none"
      class:border-[var(--terra-border)]={!isHovered}
      class:border-[var(--terra-accent-primary)]={isHovered && borderGlow}
    >
      <div
        class="absolute inset-0 opacity-15 bg-[radial-gradient(var(--terra-text-muted)_1px,transparent_1px)] [background-size:16px_16px]"
      ></div>

      <span
        class="terra-t-snappy absolute top-1 left-2 font-mono text-[10px] text-[var(--terra-accent-primary)] select-none"
        style="opacity: {isHovered ? 1 : 0.35}; transform: scale({isHovered ? 1.2 : 1});">+</span
      >
      <span
        class="terra-t-snappy absolute top-1 right-2 font-mono text-[10px] text-[var(--terra-accent-primary)] select-none"
        style="opacity: {isHovered ? 1 : 0.35}; transform: scale({isHovered ? 1.2 : 1});">+</span
      >
      <span
        class="terra-t-snappy absolute bottom-1 left-2 font-mono text-[10px] text-[var(--terra-accent-primary)] select-none"
        style="opacity: {isHovered ? 1 : 0.35}; transform: scale({isHovered ? 1.2 : 1});">+</span
      >
      <span
        class="terra-t-snappy absolute bottom-1 right-2 font-mono text-[10px] text-[var(--terra-accent-primary)] select-none"
        style="opacity: {isHovered ? 1 : 0.35}; transform: scale({isHovered ? 1.2 : 1});">+</span
      >
    </div>

    <div class="relative z-[1] w-full h-full p-5 sm:p-6" style="transform-style: preserve-3d;">
      {@render children?.()}
    </div>

    {#if sheen}
      <div
        class="terra-t-opacity absolute inset-0 pointer-events-none z-[5] overflow-hidden"
        style="
          background: radial-gradient(circle at {sheenX}% {sheenY}%, rgba(var(--terra-dot-rgb), 0.14), transparent 62%);
          opacity: {isHovered ? 1 : 0};
          transform: translateZ(20px);
        "
      ></div>
    {/if}
  </div>
</div>
