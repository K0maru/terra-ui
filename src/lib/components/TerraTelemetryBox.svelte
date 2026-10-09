<script lang="ts">
  import type { Snippet } from 'svelte'
  import TerraVernierMeter from './TerraVernierMeter.svelte'

  interface Props {
    /** Station identifier, e.g. 'STATION-01' or 'ALPHA-01' */
    stationId?: string
    /** Protocol tag, e.g. 'AIC.09' */
    protocolTag?: string
    /** Indicator label description */
    label: string
    /** Current telemetry numeric value */
    value: number
    /** Minimum value in range, default 0 */
    min?: number
    /** Maximum value in range, default 100 */
    max?: number
    /** Metric unit symbol, default '%' */
    unit?: string
    /** Frequency in Hz (used to compute 0x hex status code), default 60 */
    frequencyHz?: number
    /** Explicit override for hazard state */
    hazard?: boolean
    /** Ratio threshold (0.0 - 1.0) above which hazard activates, default 0.85 */
    hazardThreshold?: number
    /** Whether to display the micro barcode matrix in the footer, default true */
    showBarcode?: boolean
    /** 45° geometric chamfer cut pattern, default 'tr-bl' */
    cut?: 'tr' | 'tl-br' | 'tr-bl' | 'none'
    /** Additional CSS classes */
    class?: string
    /** Optional custom slot snippet */
    children?: Snippet
  }

  let {
    stationId = 'STATION-01',
    protocolTag = 'AIC.09',
    label,
    value,
    min = 0,
    max = 100,
    unit = '%',
    frequencyHz = 60,
    hazard,
    hazardThreshold = 0.85,
    showBarcode = true,
    cut = 'tr-bl',
    class: className = '',
    children
  }: Props = $props()

  const safeMin = $derived(Number.isFinite(min) ? min : 0)
  const safeMax = $derived(Number.isFinite(max) && max > safeMin ? max : safeMin + 100)
  const range = $derived(safeMax - safeMin)
  const ratio = $derived(Math.max(0, Math.min(1, (value - safeMin) / range)))

  // Computed hazard state: explicit prop or ratio threshold
  const isHazard = $derived(hazard !== undefined ? hazard : ratio >= hazardThreshold)

  // Hexadecimal status code derived from frequency
  const hexCode = $derived(`0x${Math.floor(frequencyHz).toString(16).toUpperCase()}`)

  // Formatted numeric readout
  const formattedValue = $derived(Number.isInteger(value) ? value.toString() : value.toFixed(1))

  // Cut class resolution
  const cutClass = $derived(
    cut === 'tr-bl' ? 'terra-cut-tr-bl' :
    cut === 'tl-br' ? 'terra-cut-tl-br' :
    cut === 'tr' ? 'terra-cut-tr' : ''
  )
</script>

<div
  class="terra-telemetry-box relative p-3.5 backdrop-blur-md bg-[var(--terra-bg-surface)]/90 border-y border-r border-[var(--terra-border)] border-l-2 select-none transition-colors duration-200 {cutClass} {className}"
  class:border-l-[var(--terra-accent-primary)]={!isHazard}
  class:border-l-[var(--terra-accent-warning,#f59e0b)]={isHazard}
  data-hazard={isHazard}
>
  <!-- Header: Station ID & Protocol + Hex code -->
  <div class="flex items-center justify-between pb-1.5 mb-2.5 border-b border-dashed border-[var(--terra-border)]">
    <span class="font-telemetry text-[9px] tracking-wider text-[var(--terra-text-secondary)] uppercase">
      {stationId} // PROT_{protocolTag}
    </span>
    <span class="font-mono text-[9px] terra-text-dim">
      {hexCode}
    </span>
  </div>

  <!-- Body: Label, Big Bold Value, Unit, Vernier Meter -->
  <div class="space-y-1">
    <div class="font-tactical text-[10px] tracking-widest terra-text-dim uppercase">
      {label}
    </div>

    <div class="font-telemetry text-3xl font-bold tracking-tight text-[var(--terra-text-primary)] flex items-baseline leading-none">
      <span>{formattedValue}</span>
      <span
        class="unit-symbol text-sm font-normal ml-1 transition-colors duration-150"
        style="color: {isHazard ? 'var(--terra-accent-warning, #f59e0b)' : 'var(--terra-accent-primary)'};"
      >
        {unit}
      </span>
    </div>

    <!-- Embedded Precision Vernier Meter -->
    <TerraVernierMeter
      value={value}
      min={safeMin}
      max={safeMax}
      hazard={isHazard}
      class="my-2"
    />

    {#if children}
      <div class="pt-1">
        {@render children()}
      </div>
    {/if}
  </div>

  <!-- Footer: Micro Barcode Matrix & Tactical Status Label -->
  <div class="flex items-center justify-between mt-2 pt-1 border-t border-[var(--terra-border)]/50">
    {#if showBarcode}
      <div
        class="barcode-matrix w-11 h-2"
        aria-hidden="true"
        style="background: repeating-linear-gradient(90deg, var(--terra-text-muted) 0px, var(--terra-text-muted) 2px, transparent 2px, transparent 4px); opacity: 0.6;"
      ></div>
    {:else}
      <div></div>
    {/if}

    <span
      class="font-tactical text-[9px] uppercase tracking-wider transition-colors duration-150"
      style="color: {isHazard ? 'var(--terra-accent-warning, #f59e0b)' : 'var(--terra-text-muted)'};"
    >
      {isHazard ? 'STATUS: OVERLOAD // WARNING' : 'STATUS: NOMINAL'}
    </span>
  </div>
</div>

<style>
  .terra-telemetry-box {
    transform: translateZ(0);
    will-change: transform;
  }
</style>
