<script lang="ts">
  import { Spring } from 'svelte/motion'
  import { SPRING } from '../motion'

  interface Props {
    value?: number
    min?: number
    max?: number
    ticks?: number
    step?: number
    hazard?: boolean
    interactive?: boolean
    onchange?: (value: number) => void
    class?: string
  }

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    ticks = 21,
    step = 1,
    hazard = false,
    interactive = false,
    onchange,
    class: className = ''
  }: Props = $props()

  const INSET = 6

  const safeMin = $derived(Number.isFinite(min) ? min : 0)
  const safeMax = $derived(Number.isFinite(max) && max > safeMin ? max : safeMin + 100)
  const safeRange = $derived(safeMax - safeMin)
  const safeTicks = $derived(Math.max(3, Math.floor(ticks)))
  const safeStep = $derived(step > 0 ? step : 1)

  const ratio = $derived(Math.max(0, Math.min(1, (value - safeMin) / safeRange)))

  let trackEl: HTMLDivElement | undefined = $state()
  let trackWidth = $state(240)
  let dragging = $state(false)
  let hoverRatio = $state<number | null>(null)
  let cachedRect: { left: number; width: number } | null = null

  const visualRatio = new Spring(0, SPRING.indicator)
  const visualFocus = new Spring(0, SPRING.pointer)

  $effect(() => {
    if (dragging) {
      visualRatio.stiffness = 0.45
      visualRatio.damping = 0.85
    } else {
      visualRatio.stiffness = SPRING.indicator.stiffness
      visualRatio.damping = SPRING.indicator.damping
    }
    visualRatio.target = ratio
  })

  $effect(() => {
    visualFocus.target = hoverRatio ?? ratio
  })

  const clampedVisualRatio = $derived(Math.max(0, Math.min(1, visualRatio.current)))
  const usableWidth = $derived(Math.max(1, trackWidth - INSET * 2))
  const needleTranslateX = $derived(INSET + clampedVisualRatio * usableWidth - 1)

  function updateFromClientX(clientX: number) {
    if (!trackEl) return
    const rect = cachedRect ?? trackEl.getBoundingClientRect()
    const usable = Math.max(1, rect.width - INSET * 2)
    const rawRatio = Math.max(0, Math.min(1, (clientX - rect.left - INSET) / usable))
    const rawVal = safeMin + rawRatio * safeRange
    const snapped = Math.round((rawVal - safeMin) / safeStep) * safeStep + safeMin
    const clamped = Math.max(safeMin, Math.min(safeMax, Number(snapped.toFixed(4))))
    if (clamped !== value) {
      value = clamped
      onchange?.(clamped)
    }
  }

  function onPointerEnter() {
    if (!trackEl) return
    const r = trackEl.getBoundingClientRect()
    cachedRect = { left: r.left, width: r.width }
  }

  function onPointerDown(e: PointerEvent) {
    if (!interactive || !trackEl) return
    const r = trackEl.getBoundingClientRect()
    cachedRect = { left: r.left, width: r.width }
    dragging = true
    trackEl.setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
  }

  function onPointerMove(e: PointerEvent) {
    if (!interactive || !trackEl) return
    const rect = cachedRect ?? trackEl.getBoundingClientRect()
    const usable = Math.max(1, rect.width - INSET * 2)
    hoverRatio = Math.max(0, Math.min(1, (e.clientX - rect.left - INSET) / usable))
    if (dragging) {
      updateFromClientX(e.clientX)
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (!interactive || !trackEl) return
    dragging = false
    if (trackEl.hasPointerCapture(e.pointerId)) {
      trackEl.releasePointerCapture(e.pointerId)
    }
  }

  function onPointerLeave() {
    hoverRatio = null
    cachedRect = null
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!interactive) return
    const largeStep = Math.max(safeStep, Math.round(safeRange / 10))
    let next = value
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      next = Math.min(safeMax, value + safeStep)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      next = Math.max(safeMin, value - safeStep)
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      next = Math.min(safeMax, value + largeStep)
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      next = Math.max(safeMin, value - largeStep)
    } else if (e.key === 'Home') {
      e.preventDefault()
      next = safeMin
    } else if (e.key === 'End') {
      e.preventDefault()
      next = safeMax
    }
    if (next !== value) {
      value = next
      onchange?.(next)
    }
  }
</script>

{#if interactive}
  <div
    bind:this={trackEl}
    bind:clientWidth={trackWidth}
    role="slider"
    tabindex="0"
    aria-label="Precision vernier caliper"
    aria-valuenow={value}
    aria-valuemin={safeMin}
    aria-valuemax={safeMax}
    onpointerenter={onPointerEnter}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointerleave={onPointerLeave}
    onkeydown={onKeyDown}
    class="isolate relative h-10 w-full bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] select-none cursor-ew-resize touch-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra-accent-primary)] {className}"
  >
    <div
      aria-hidden="true"
      class="absolute inset-y-0 left-[6px] right-[6px] overflow-hidden pointer-events-none"
    >
      <div
        class="h-full w-full origin-left bg-[var(--terra-accent-primary-dim)]"
        style="transform: scaleX({clampedVisualRatio.toFixed(4)});"
      ></div>
    </div>

    <div
      class="relative z-[1] flex justify-between items-end h-full px-[6px] pb-1 pointer-events-none"
    >
      {#each Array(safeTicks) as _, index (index)}
        {@const tickRatio = index / (safeTicks - 1)}
        {@const isMajor = index % 5 === 0}
        {@const isActive = clampedVisualRatio >= tickRatio - 0.002}
        {@const dist = Math.abs(tickRatio - visualFocus.current)}
        {@const waveScale = 1 + 0.85 * Math.exp(-dist * dist * 55)}
        <span
          class="terra-t-color w-[1px] origin-bottom {isMajor ? 'h-4' : 'h-2'}"
          style="
            transform: scaleY({waveScale.toFixed(3)});
            background-color: {isActive
            ? hazard
              ? 'var(--terra-accent-warning)'
              : 'var(--terra-accent-primary)'
            : isMajor
              ? 'var(--terra-border-strong)'
              : 'var(--terra-border)'};
          "
        ></span>
      {/each}
    </div>

    <div
      aria-hidden="true"
      class="terra-t-color absolute inset-y-0 left-0 w-[2px] z-[2] pointer-events-none {hazard
        ? 'bg-[var(--terra-accent-warning)]'
        : 'bg-[var(--terra-accent-primary)]'}"
      style="transform: translate3d({needleTranslateX.toFixed(2)}px, 0, 0);"
    ></div>
  </div>
{:else}
  <div
    bind:clientWidth={trackWidth}
    role="meter"
    aria-valuenow={value}
    aria-valuemin={safeMin}
    aria-valuemax={safeMax}
    class="isolate relative h-5 w-full bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] overflow-hidden select-none {className}"
  >
    <div class="flex justify-between items-end h-full px-[6px] pb-0.5 pointer-events-none">
      {#each Array(safeTicks) as _, index (index)}
        {@const tickRatio = index / (safeTicks - 1)}
        {@const isMajor = index % 5 === 0}
        {@const isActive = clampedVisualRatio >= tickRatio - 0.002}
        <span
          class="terra-t-color w-[1px] {isMajor ? 'h-3' : 'h-1.5'}"
          style="background-color: {isActive
            ? hazard
              ? 'var(--terra-accent-warning)'
              : 'var(--terra-accent-primary)'
            : 'var(--terra-border)'};"
        ></span>
      {/each}
    </div>

    <div
      aria-hidden="true"
      class="terra-t-color absolute inset-y-0 left-0 w-[2px] pointer-events-none {hazard
        ? 'bg-[var(--terra-accent-warning)]'
        : 'bg-[var(--terra-text-primary)]'}"
      style="transform: translate3d({needleTranslateX.toFixed(2)}px, 0, 0);"
    ></div>
  </div>
{/if}
