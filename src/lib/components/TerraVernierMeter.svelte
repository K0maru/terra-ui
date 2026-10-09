<script lang="ts">
  interface Props {
    /** Current numeric value */
    value: number
    /** Minimum range value, default 0 */
    min?: number
    /** Maximum range value, default 100 */
    max?: number
    /** Number of precision ticks on the scale, default 10 */
    ticks?: number
    /** Whether the meter is in a hazard / overload state */
    hazard?: boolean
    /** Additional CSS classes */
    class?: string
  }

  let {
    value,
    min = 0,
    max = 100,
    ticks = 10,
    hazard = false,
    class: className = ''
  }: Props = $props()

  const safeMin = $derived(Number.isFinite(min) ? min : 0)
  const safeMax = $derived(Number.isFinite(max) && max > safeMin ? max : safeMin + 100)
  const safeRange = $derived(safeMax - safeMin)
  const safeTicks = $derived(Math.max(2, Math.floor(ticks)))

  const ratio = $derived(Math.max(0, Math.min(1, (value - safeMin) / safeRange)))

  // Active accent color (normal cyan/theme vs hazard amber/red)
  const activeColor = $derived(hazard ? 'var(--terra-accent-warning, #f59e0b)' : 'var(--terra-accent-primary)')
</script>

<div
  class="terra-vernier-meter relative h-2 w-full bg-black/40 overflow-hidden select-none border border-[var(--terra-border)] {className}"
  role="meter"
  aria-valuenow={value}
  aria-valuemin={safeMin}
  aria-valuemax={safeMax}
  data-hazard={hazard}
  style="--meter-active-color: {activeColor};"
>
  <!-- Micro vernier track -->
  <div class="meter-track flex justify-between items-end h-full px-0.5">
    {#each Array(safeTicks) as _, index}
      {@const tickRatio = index / (safeTicks - 1)}
      {@const isMajor = index % 5 === 0}
      {@const isActive = ratio >= tickRatio}
      <div
        class="meter-tick w-[1px] transition-colors duration-150 {isMajor ? 'h-[6px] major' : 'h-[3px]'}"
        class:active={isActive}
        style={isActive ? `background-color: var(--meter-active-color); box-shadow: 0 0 3px var(--meter-active-color);` : undefined}
      ></div>
    {/each}
  </div>

  <!-- Sliding indicator needle -->
  <div
    class="meter-needle absolute top-0 w-[2px] h-full pointer-events-none will-change-transform bg-white transition-[transform,left] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
    style="left: calc({ratio} * (100% - 4px)); transform: translate3d({ratio * 100}%, 0, 0); box-shadow: 0 0 4px var(--meter-active-color);"
  ></div>
</div>

<style>
  .meter-tick {
    background: rgba(255, 255, 255, 0.22);
  }
  .meter-tick.major {
    background: rgba(255, 255, 255, 0.45);
  }
  :global([data-mode="light"]) .meter-tick {
    background: rgba(0, 0, 0, 0.18);
  }
  :global([data-mode="light"]) .meter-tick.major {
    background: rgba(0, 0, 0, 0.4);
  }
  :global([data-mode="light"]) .terra-vernier-meter {
    background: rgba(0, 0, 0, 0.06);
  }
  :global([data-mode="light"]) .meter-needle {
    background: #0f172a;
  }
</style>
