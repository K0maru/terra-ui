<script lang="ts">
  import type { Snippet } from 'svelte'

  export type PanelCut = 'tl-br' | 'tr-bl' | 'tr' | 'br' | 'none'
  export type PanelDecoration = 'endfield' | 'rhodes' | 'industrial' | 'brackets' | 'clean'

  interface Props {
    title?: string
    tag?: string
    cut?: PanelCut
    /** Chamfer cut size in pixels, default 16 */
    cutSize?: number
    /** Modular decoration preset: 'endfield' (default), 'rhodes', 'industrial', 'brackets', 'clean' */
    decoration?: PanelDecoration
    /** Legacy alias for 'brackets' */
    bracket?: boolean
    /** Legacy alias for reticle crosshairs (auto-migrated) */
    reticle?: boolean
    warning?: boolean
    children?: Snippet
    actions?: Snippet
    class?: string
  }

  let {
    title = '',
    tag = '',
    cut = 'tr',
    cutSize = 16,
    decoration,
    bracket = false,
    reticle = false,
    warning = false,
    children,
    actions,
    class: className = ''
  }: Props = $props()

  let w = $state(0)
  let h = $state(0)

  // Resolve active decoration preset
  const activeDecoration = $derived<PanelDecoration>(
    decoration ?? (bracket ? 'brackets' : 'endfield')
  )

  const cutClass = $derived(
    cut === 'tl-br' ? 'terra-cut-tl-br' :
    cut === 'tr-bl' ? 'terra-cut-tr-bl' :
    cut === 'tr' ? 'terra-cut-tr' :
    cut === 'br' ? 'terra-cut-br' : ''
  )

  const c = $derived(Math.max(8, cutSize))

  // Calculate polygon perimeter path points for 1px continuous vector border
  const polygonPath = $derived.by(() => {
    if (!w || !h) return ''
    if (cut === 'tr') {
      return `M 0,0 L ${w - c},0 L ${w},${c} L ${w},${h} L 0,${h} Z`
    }
    if (cut === 'br') {
      return `M 0,0 L ${w},0 L ${w},${h - c} L ${w - c},${h} L 0,${h} Z`
    }
    if (cut === 'tr-bl') {
      return `M 0,0 L ${w - c},0 L ${w},${c} L ${w},${h} L ${c},${h} L 0,${h - c} Z`
    }
    if (cut === 'tl-br') {
      return `M ${c},0 L ${w},0 L ${w},${h - c} L ${w - c},${h} L 0,${h} L 0,${c} Z`
    }
    return `M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z`
  })

  // Identify which corners are cut and which are intact 90° corners
  const isCutTL = $derived(cut === 'tl-br')
  const isCutTR = $derived(cut === 'tr' || cut === 'tr-bl')
  const isCutBR = $derived(cut === 'tl-br' || cut === 'br')
  const isCutBL = $derived(cut === 'tr-bl')

  // Header safe insets to prevent actions or title clipping
  const headerLeftPad = $derived(isCutTL ? 'pl-7' : 'pl-4')
  const headerRightPad = $derived(isCutTR ? 'pr-7' : 'pr-4')
</script>

<div
  bind:clientWidth={w}
  bind:clientHeight={h}
  class="relative select-none transition-colors duration-200 {className}"
>
  <!-- Background Chassis Plate with Polygon Clip-Path & Shadow -->
  <div
    class="absolute inset-0 bg-[var(--terra-bg-surface)] shadow-[var(--terra-shadow)] pointer-events-none {cutClass}"
  ></div>

  <!-- Continuous 1px Vector Perimeter Border & Architectural Corner Decorators -->
  {#if w > 0 && h > 0}
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <!-- Continuous 1px Border along all edges including 45° chamfer -->
      <path
        d={polygonPath}
        fill="none"
        stroke="var(--terra-border)"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />

      <!-- ===================================================================
           PRESET 1: ENDFIELD (Talos-II AIC Industrial Heavy-Armour)
           =================================================================== -->
      {#if activeDecoration === 'endfield'}
        <!-- 45° Chamfer Accent Runners on cut corners -->
        {#if isCutTR}
          <!-- TR 45° Parallel Accent Runner -->
          <line
            x1={w - c + 5}
            y1={4}
            x2={w - 4}
            y2={c - 5}
            stroke="var(--terra-accent-primary)"
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.9"
          />
          <!-- TR Joint Notch -->
          <circle cx={w - c} cy={0} r="1.5" fill="var(--terra-accent-primary)" />
          <circle cx={w} cy={c} r="1.5" fill="var(--terra-accent-primary)" />
        {/if}

        {#if isCutBL}
          <!-- BL 45° Parallel Accent Runner -->
          <line
            x1={4}
            y1={h - c + 5}
            x2={c - 5}
            y2={h - 4}
            stroke="var(--terra-accent-primary)"
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.9"
          />
          <!-- BL Joint Notch -->
          <circle cx={c} cy={h} r="1.5" fill="var(--terra-accent-primary)" />
          <circle cx={0} cy={h - c} r="1.5" fill="var(--terra-accent-primary)" />
        {/if}

        {#if isCutTL}
          <!-- TL 45° Parallel Accent Runner -->
          <line
            x1={4}
            y1={c - 5}
            x2={c - 5}
            y2={4}
            stroke="var(--terra-accent-primary)"
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.9"
          />
          <!-- TL Joint Notch -->
          <circle cx={0} cy={c} r="1.5" fill="var(--terra-accent-primary)" />
          <circle cx={c} cy={0} r="1.5" fill="var(--terra-accent-primary)" />
        {/if}

        {#if isCutBR}
          <!-- BR 45° Parallel Accent Runner -->
          <line
            x1={w - c + 5}
            y1={h - 4}
            x2={w - 4}
            y2={h - c + 5}
            stroke="var(--terra-accent-primary)"
            stroke-width="2"
            stroke-linecap="round"
            opacity="0.9"
          />
          <!-- BR Joint Notch -->
          <circle cx={w - c} cy={h} r="1.5" fill="var(--terra-accent-primary)" />
          <circle cx={w} cy={h - c} r="1.5" fill="var(--terra-accent-primary)" />
        {/if}

        <!-- Dual-Layer L-Brackets on intact 90° corners -->
        {#if !isCutTL}
          <path
            d="M 3,11 L 3,3 L 11,3"
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="1.5"
            stroke-linecap="square"
            opacity="0.85"
          />
        {/if}
        {#if !isCutTR}
          <path
            d={`M ${w - 11},3 L ${w - 3},3 L ${w - 3},11`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="1.5"
            stroke-linecap="square"
            opacity="0.85"
          />
        {/if}
        {#if !isCutBL}
          <path
            d={`M 3,${h - 11} L 3,${h - 3} L 11,${h - 3}`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="1.5"
            stroke-linecap="square"
            opacity="0.85"
          />
        {/if}
        {#if !isCutBR}
          <path
            d={`M ${w - 11},${h - 3} L ${w - 3},${h - 3} L ${w - 3},${h - 11}`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="1.5"
            stroke-linecap="square"
            opacity="0.85"
          />
        {/if}

      <!-- ===================================================================
           PRESET 2: RHODES (PRTS Tactical Calibration Micro-Ticks)
           =================================================================== -->
      {:else if activeDecoration === 'rhodes'}
        <!-- 3 Precision Milled Micro-Ticks on intact corners -->
        {#if !isCutTL}
          <line x1="6" y1="0" x2="6" y2="4" stroke="var(--terra-accent-primary)" stroke-width="1" />
          <line x1="9" y1="0" x2="9" y2="4" stroke="var(--terra-accent-primary)" stroke-width="1" />
          <line x1="12" y1="0" x2="12" y2="4" stroke="var(--terra-accent-primary)" stroke-width="1" />
        {/if}
        {#if !isCutTR}
          <line x1={w - 6} y1="0" x2={w - 6} y2="4" stroke="var(--terra-accent-primary)" stroke-width="1" />
          <line x1={w - 9} y1="0" x2={w - 9} y2="4" stroke="var(--terra-accent-primary)" stroke-width="1" />
          <line x1={w - 12} y1="0" x2={w - 12} y2="4" stroke="var(--terra-accent-primary)" stroke-width="1" />
        {/if}
        {#if !isCutBL}
          <line x1="6" y1={h} x2="6" y2={h - 4} stroke="var(--terra-accent-primary)" stroke-width="1" />
          <line x1="9" y1={h} x2="9" y2={h - 4} stroke="var(--terra-accent-primary)" stroke-width="1" />
          <line x1="12" y1={h} x2="12" y2={h - 4} stroke="var(--terra-accent-primary)" stroke-width="1" />
        {/if}
        {#if !isCutBR}
          <line x1={w - 6} y1={h} x2={w - 6} y2={h - 4} stroke="var(--terra-accent-primary)" stroke-width="1" />
          <line x1={w - 9} y1={h} x2={w - 9} y2={h - 4} stroke="var(--terra-accent-primary)" stroke-width="1" />
          <line x1={w - 12} y1={h} x2={w - 12} y2={h - 4} stroke="var(--terra-accent-primary)" stroke-width="1" />
        {/if}

        <!-- Chamfer joint notch points -->
        {#if isCutTR}
          <rect x={w - c - 1} y="-1" width="3" height="3" fill="var(--terra-accent-primary)" />
          <rect x={w - 2} y={c - 1} width="3" height="3" fill="var(--terra-accent-primary)" />
        {/if}
        {#if isCutBL}
          <rect x="-1" y={h - c - 1} width="3" height="3" fill="var(--terra-accent-primary)" />
          <rect x={c - 1} y={h - 2} width="3" height="3" fill="var(--terra-accent-primary)" />
        {/if}
        {#if isCutTL}
          <rect x="-1" y={c - 1} width="3" height="3" fill="var(--terra-accent-primary)" />
          <rect x={c - 1} y="-1" width="3" height="3" fill="var(--terra-accent-primary)" />
        {/if}
        {#if isCutBR}
          <rect x={w - 2} y={h - c - 1} width="3" height="3" fill="var(--terra-accent-primary)" />
          <rect x={w - c - 1} y={h - 2} width="3" height="3" fill="var(--terra-accent-primary)" />
        {/if}

      <!-- ===================================================================
           PRESET 3: INDUSTRIAL (Heavy Chassis Fastener Screws)
           =================================================================== -->
      {:else if activeDecoration === 'industrial'}
        <!-- Recessed 4px Chassis Fastener Rivet Dots on intact corners -->
        {#if !isCutTL}
          <circle cx="9" cy="9" r="3" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1" />
          <circle cx="9" cy="9" r="1" fill="var(--terra-accent-primary)" opacity="0.9" />
        {/if}
        {#if !isCutTR}
          <circle cx={w - 9} cy="9" r="3" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1" />
          <circle cx={w - 9} cy="9" r="1" fill="var(--terra-accent-primary)" opacity="0.9" />
        {/if}
        {#if !isCutBL}
          <circle cx="9" cy={h - 9} r="3" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1" />
          <circle cx="9" cy={h - 9} r="1" fill="var(--terra-accent-primary)" opacity="0.9" />
        {/if}
        {#if !isCutBR}
          <circle cx={w - 9} cy={h - 9} r="3" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1" />
          <circle cx={w - 9} cy={h - 9} r="1" fill="var(--terra-accent-primary)" opacity="0.9" />
        {/if}

      <!-- ===================================================================
           PRESET 4: BRACKETS (Classic HUD Tactical Brackets - Unclipped)
           =================================================================== -->
      {:else if activeDecoration === 'brackets'}
        {#if !isCutTL}
          <path
            d="M 0,10 L 0,0 L 10,0"
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2"
            stroke-linecap="square"
          />
        {/if}
        {#if !isCutTR}
          <path
            d={`M ${w - 10},0 L ${w},0 L ${w},10`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2"
            stroke-linecap="square"
          />
        {/if}
        {#if !isCutBL}
          <path
            d={`M 0,${h - 10} L 0,${h} L 10,${h}`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2"
            stroke-linecap="square"
          />
        {/if}
        {#if !isCutBR}
          <path
            d={`M ${w - 10},${h} L ${w},${h} L ${w},${h - 10}`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2"
            stroke-linecap="square"
          />
        {/if}
      {/if}
    </svg>
  {/if}

  <!-- Inner Clipped Content Container (Clips header background and warning stripes cleanly) -->
  <div class="relative z-10 w-full h-full {cutClass}">
    {#if warning}
      <!-- Industrial Hazard Stripe Top Bar -->
      <div class="h-1.5 w-full terra-warning-stripe opacity-90"></div>
    {/if}

    {#if title || tag || actions}
      <div
        class="flex items-center justify-between py-2.5 border-b border-[var(--terra-border)] bg-black/10 dark:bg-white/5 transition-colors {headerLeftPad} {headerRightPad}"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          {#if warning}
            <span class="w-1.5 h-3 bg-[var(--terra-accent-primary)] inline-block"></span>
          {/if}
          {#if title}
            <h3 class="font-mono text-xs font-bold tracking-widest uppercase text-[var(--terra-text-primary)] truncate">
              {title}
            </h3>
          {/if}
          {#if tag}
            <span class="font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider">
              {tag}
            </span>
          {/if}
        </div>

        {#if actions}
          <div class="flex items-center gap-2">
            {@render actions()}
          </div>
        {/if}
      </div>
    {/if}

    <div class="p-4 sm:p-5">
      {@render children?.()}
    </div>
  </div>
</div>
