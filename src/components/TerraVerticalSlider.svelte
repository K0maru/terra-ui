<script lang="ts">
  interface Props {
    /** Current numeric value, supports 2-way binding bind:value */
    value?: number
    /** Minimum value, default 0 */
    min?: number
    /** Maximum value, default 100 */
    max?: number
    /** Increment step, default 1 */
    step?: number
    /** Track height, default '10rem' */
    height?: string
    /** Track width, default '1.5rem' */
    width?: string
    /** Top header label e.g. 'SCALE' / 'ZOOM' / 'PARAM' */
    label?: string
    /** Unit suffix e.g. '%' / 'px' / 'm' */
    unit?: string
    /** Whether to show [+] and [-] micro step buttons, default true */
    showButtons?: boolean
    /** Disabled state, default false */
    disabled?: boolean
    /** Whether to enable Atlos fluid curved decoration fins, default true */
    fluidDecorations?: boolean
    /** Change callback */
    onchange?: (val: number) => void
    /** Custom class name */
    class?: string
  }

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    height = '10rem',
    width = '1.5rem',
    label = '',
    unit = '',
    showButtons = true,
    disabled = false,
    fluidDecorations = true,
    onchange,
    class: className = ''
  }: Props = $props()

  let trackEl: HTMLDivElement | null = $state(null)
  let isDragging = $state(false)

  // Clamp & compute GPU progress (0 to 1)
  const range = $derived(max - min || 1)
  const progress = $derived(
    Math.max(0, Math.min(1, (value - min) / range))
  )

  function updateValue(nextVal: number) {
    if (disabled) return
    let clamped = Math.max(min, Math.min(max, nextVal))
    if (step > 0) {
      const steps = Math.round((clamped - min) / step)
      clamped = min + steps * step
      const stepDecimals = step.toString().split('.')[1]?.length || 0
      clamped = Number(clamped.toFixed(stepDecimals))
    }
    if (clamped !== value) {
      value = clamped
      onchange?.(clamped)
    }
  }

  function stepUp() {
    updateValue(value + step)
  }

  function stepDown() {
    updateValue(value - step)
  }

  function updateFromPointer(e: PointerEvent) {
    if (!trackEl) return
    const rect = trackEl.getBoundingClientRect()
    const clientY = Math.max(rect.top, Math.min(rect.bottom, e.clientY))
    // Vertical slider: bottom is min, top is max
    const ratio = 1 - (clientY - rect.top) / rect.height
    const nextVal = min + ratio * (max - min)
    updateValue(nextVal)
  }

  function handlePointerDown(e: PointerEvent) {
    if (disabled || e.button !== 0) return
    isDragging = true
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    updateFromPointer(e)
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return
    updateFromPointer(e)
  }

  function handlePointerUp(e: PointerEvent) {
    if (isDragging) {
      isDragging = false
      try {
        const target = e.currentTarget as HTMLElement
        target.releasePointerCapture(e.pointerId)
      } catch {}
    }
  }

  function handleWheel(e: WheelEvent) {
    if (disabled) return
    e.preventDefault()
    if (e.deltaY < 0) {
      stepUp()
    } else if (e.deltaY > 0) {
      stepDown()
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (disabled) return
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      stepUp()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      stepDown()
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      updateValue(value + step * 5)
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      updateValue(value - step * 5)
    } else if (e.key === 'Home') {
      e.preventDefault()
      updateValue(min)
    } else if (e.key === 'End') {
      e.preventDefault()
      updateValue(max)
    }
  }
</script>

<div
  class="terra-vslider-root inline-flex flex-col items-center select-none {className}"
  class:opacity-50={disabled}
  class:cursor-not-allowed={disabled}
  style="--slider-width: {width}; --slider-height: {height};"
>
  <!-- Header Telemetry Readout -->
  {#if label || unit}
    <div class="mb-1 flex flex-col items-center font-mono text-[9px] tracking-widest uppercase text-[var(--terra-text-muted,#718096)] pointer-events-none">
      {#if label}
        <span class="font-bold text-[var(--terra-text-secondary,#a0aec0)]">{label}</span>
      {/if}
      <span class="text-[var(--terra-accent-primary,#fff000)] font-bold">{value}{unit}</span>
    </div>
  {/if}

  <!-- Step Up Button [+] -->
  {#if showButtons}
    <button
      type="button"
      onclick={stepUp}
      disabled={disabled || value >= max}
      aria-label="Increase {label || 'value'}"
      class="terra-slider-btn mb-1.5 flex items-center justify-center font-mono text-xs font-bold transition-all"
    >
      +
    </button>
  {/if}

  <!-- Vertical Track Wrapper with Optional Fluid Fins -->
  <div class="relative flex flex-col items-center">
    {#if fluidDecorations}
      <!-- Atlos Top Fluid Fin -->
      <div class="terra-fluid-fin terra-fluid-fin-top" aria-hidden="true"></div>
    {/if}

    <!-- Main Interactive Track -->
    <div
      bind:this={trackEl}
      role="slider"
      tabindex={disabled ? -1 : 0}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-orientation="vertical"
      aria-label={label || 'Vertical Slider'}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerUp}
      onwheel={handleWheel}
      onkeydown={handleKeyDown}
      class="terra-slider-track relative flex flex-col justify-end p-0.5 overflow-hidden cursor-pointer touch-none focus:outline-none focus:ring-1 focus:ring-[var(--terra-accent-primary,#fff000)]"
      class:dragging={isDragging}
      style="--progress: {progress};"
    >
      <!-- Notch Ticks along Track -->
      <div class="absolute inset-y-1 right-1 flex flex-col justify-between pointer-events-none z-10 opacity-40">
        <span class="w-1.5 h-[1px] bg-white"></span>
        <span class="w-1 h-[1px] bg-white"></span>
        <span class="w-1.5 h-[1px] bg-white"></span>
        <span class="w-1 h-[1px] bg-white"></span>
        <span class="w-1.5 h-[1px] bg-white"></span>
      </div>

      <!-- 100% GPU Compositor Filled Progress Bar -->
      <div
        class="terra-slider-fill w-full rounded-sm"
        aria-hidden="true"
      >
        <!-- Glowing Laser Head -->
        <div class="terra-slider-laser-head"></div>
      </div>
    </div>

    {#if fluidDecorations}
      <!-- Atlos Bottom Fluid Fin -->
      <div class="terra-fluid-fin terra-fluid-fin-bottom" aria-hidden="true"></div>
    {/if}
  </div>

  <!-- Step Down Button [-] -->
  {#if showButtons}
    <button
      type="button"
      onclick={stepDown}
      disabled={disabled || value <= min}
      aria-label="Decrease {label || 'value'}"
      class="terra-slider-btn mt-1.5 flex items-center justify-center font-mono text-xs font-bold transition-all"
    >
      -
    </button>
  {/if}
</div>

<style>
  .terra-slider-btn {
    width: var(--slider-width, 1.5rem);
    height: var(--slider-width, 1.5rem);
    background-color: var(--terra-bg-surface, #12151b);
    border: 1.5px solid var(--terra-border, rgba(255, 240, 0, 0.22));
    color: var(--terra-text-primary, #ffffff);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    border-radius: 3px;
    cursor: pointer;
  }

  .terra-slider-btn:not(:disabled):hover {
    background-color: var(--terra-accent-primary, #fff000);
    color: #000000;
    border-color: var(--terra-accent-primary, #fff000);
    box-shadow: 0 0 8px var(--terra-accent-primary-dim, rgba(255, 240, 0, 0.3));
  }

  .terra-slider-btn:not(:disabled):active {
    transform: scale(0.94);
  }

  .terra-slider-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .terra-slider-track {
    width: var(--slider-width, 1.5rem);
    height: var(--slider-height, 10rem);
    background-color: var(--terra-bg-surface, rgba(18, 21, 27, 0.85));
    border: 1.5px solid var(--terra-border, rgba(255, 240, 0, 0.22));
    border-radius: 4px;
    backdrop-filter: blur(8px);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5), 0 0 6px rgba(0, 0, 0, 0.3);
  }

  .terra-slider-track:hover {
    border-color: var(--terra-border-strong, rgba(255, 240, 0, 0.55));
  }

  /* GPU-Accelerated Compositor Fill */
  .terra-slider-fill {
    height: 100%;
    background-color: var(--terra-accent-primary, #fff000);
    transform: scaleY(var(--progress));
    transform-origin: bottom;
    will-change: transform;
    transition: transform 0.15s cubic-bezier(0.8, 0.2, 0.35, 0.7);
    position: relative;
    box-shadow: 0 0 6px var(--terra-accent-primary-dim, rgba(255, 240, 0, 0.3));
  }

  .terra-slider-track.dragging .terra-slider-fill {
    transition: none; /* Instant zero-latency tracking while dragging */
  }

  .terra-slider-laser-head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ffffff;
    box-shadow: 0 0 4px #ffffff, 0 0 8px var(--terra-accent-primary, #fff000);
  }

  /* Atlos Official Fluid Decoration Fins */
  .terra-fluid-fin {
    position: absolute;
    width: var(--slider-width, 1.5rem);
    height: var(--slider-width, 1.5rem);
    background-color: var(--terra-bg-surface, #12151b);
    backdrop-filter: blur(8px);
    pointer-events: none;
    z-index: 5;
    opacity: 0.85;
  }

  .terra-fluid-fin-top {
    top: 0;
    transform: translateY(-98%);
    clip-path: path("M0 24h24V0c0 6.2388-10.4322 23.871-24 24Z");
  }

  .terra-fluid-fin-bottom {
    bottom: 0;
    transform: translateY(98%);
    clip-path: path("M0 0h24v24C24 17.7612 13.5678.129 0 0Z");
  }
</style>
