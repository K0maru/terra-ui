<script lang="ts">
  import { stepSpring, type SpringState } from '../motion'

  interface Props {
    value: number
    decimals?: number
    duration?: number
    prefix?: string
    suffix?: string
    unit?: string
    class?: string
  }

  let {
    value = 0,
    decimals = 0,
    duration = 420,
    prefix = '',
    suffix = '',
    unit = '',
    class: className = ''
  }: Props = $props()

  let display = $state(0)
  const springState: SpringState = { x: 0, v: 0 }
  let initialized = false

  $effect(() => {
    const target = Number.isFinite(value) ? value : 0

    if (!initialized) {
      initialized = true
      springState.x = target
      springState.v = 0
      display = target
      return
    }

    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      duration <= 0
    ) {
      springState.x = target
      springState.v = 0
      display = target
      return
    }

    const omega0 = Math.max(10, Math.min(36, 8400 / duration))
    const k = omega0 * omega0
    const c = 2 * omega0

    let rafId = 0
    let last = performance.now()

    function step(now: number) {
      const dt = (now - last) / 1000
      last = now
      const settled = stepSpring(springState, target, dt, k, c)
      display = springState.x
      if (!settled) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  })

  const formatted = $derived(display.toFixed(decimals))
  const trailing = $derived(suffix || unit)
</script>

<span
  class="inline-flex items-baseline font-display font-bold tracking-tight tabular-nums select-none {className}"
>
  {#if prefix}
    <span class="text-[0.7em] text-[var(--terra-text-muted)] mr-0.5">{prefix}</span>
  {/if}
  <span>{formatted}</span>
  {#if trailing}
    <span class="text-[0.7em] text-[var(--terra-text-muted)] ml-0.5">{trailing}</span>
  {/if}
</span>
