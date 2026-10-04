<script lang="ts">
  interface Props {
    value: number
    decimals?: number
    duration?: number
    prefix?: string
    suffix?: string
    class?: string
  }

  let {
    value = 0,
    decimals = 0,
    duration = 600,
    prefix = '',
    suffix = '',
    class: className = ''
  }: Props = $props()

  let displayed = $state(0)
  let startValue = 0
  let startTime = 0
  let animFrameId: number | null = null
  let initialized = false

  $effect(() => {
    const target = value
    if (!initialized) {
      displayed = target
      initialized = true
      return
    }

    startValue = displayed
    startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3)

      displayed = startValue + (target - startValue) * ease

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step)
      } else {
        displayed = target
      }
    }

    if (animFrameId) cancelAnimationFrame(animFrameId)
    animFrameId = requestAnimationFrame(step)

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId)
    }
  })

  const formatted = $derived(
    displayed.toFixed(decimals)
  )
</script>

<span class="inline-flex items-baseline font-mono font-bold tracking-tight select-none {className}">
  {#if prefix}
    <span class="text-[0.7em] opacity-70 mr-0.5">{prefix}</span>
  {/if}
  <span>{formatted}</span>
  {#if suffix}
    <span class="text-[0.7em] opacity-70 ml-0.5">{suffix}</span>
  {/if}
</span>
