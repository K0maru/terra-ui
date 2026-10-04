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

  // Enforce a solid minimal chamfer depth so decorations are always bold and discernible
  const c = $derived(Math.max(14, cutSize))

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
  const headerLeftPad = $derived(isCutTL ? 'pl-8' : 'pl-4')
  const headerRightPad = $derived(isCutTR ? 'pr-8' : 'pr-4')
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
      <defs>
        <!-- Subtle Glow Filter for High-Impact Armor Highlights -->
        <filter id="terra-armor-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="var(--terra-accent-primary)" flood-opacity="0.4" />
        </filter>
      </defs>

      <!-- Continuous 1px Border along all edges including 45° chamfer -->
      <path
        d={polygonPath}
        fill="none"
        stroke="var(--terra-border)"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />

      <!-- ===================================================================
           PRESET 1: ENDFIELD (Talos-II AIC Industrial Heavy-Armour · High Impact)
           =================================================================== -->
      {#if activeDecoration === 'endfield'}
        <!-- 45° Bold Chamfer Armor Rails & Locking Lug Teeth -->
        {#if isCutTR}
          <!-- TR Main Armor Rail (2.5px bold) -->
          <line
            x1={w - c + 2}
            y1={2}
            x2={w - 2}
            y2={c - 2}
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <!-- TR Inner Parallel Guide -->
          {#if c >= 16}
            <line
              x1={w - c + 6}
              y1={6}
              x2={w - 6}
              y2={c - 6}
              stroke="var(--terra-accent-primary)"
              stroke-width="1"
              stroke-dasharray="3 2"
              opacity="0.75"
            />
          {/if}
          <!-- TR Locking Lug Teeth -->
          <rect x={w - c - 2} y="-1.5" width="5" height="3" fill="var(--terra-accent-primary)" />
          <rect x={w - 1.5} y={c - 2} width="3" height="5" fill="var(--terra-accent-primary)" />
        {/if}

        {#if isCutBL}
          <!-- BL Main Armor Rail -->
          <line
            x1={c - 2}
            y1={h - 2}
            x2={2}
            y2={h - c + 2}
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          {#if c >= 16}
            <line
              x1={c - 6}
              y1={h - 6}
              x2={6}
              y2={h - c + 6}
              stroke="var(--terra-accent-primary)"
              stroke-width="1"
              stroke-dasharray="3 2"
              opacity="0.75"
            />
          {/if}
          <rect x={c - 3} y={h - 1.5} width="5" height="3" fill="var(--terra-accent-primary)" />
          <rect x="-1.5" y={h - c - 3} width="3" height="5" fill="var(--terra-accent-primary)" />
        {/if}

        {#if isCutTL}
          <!-- TL Main Armor Rail -->
          <line
            x1={2}
            y1={c - 2}
            x2={c - 2}
            y2={2}
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          {#if c >= 16}
            <line
              x1={6}
              y1={c - 6}
              x2={c - 6}
              y2={6}
              stroke="var(--terra-accent-primary)"
              stroke-width="1"
              stroke-dasharray="3 2"
              opacity="0.75"
            />
          {/if}
          <rect x="-1.5" y={c - 2} width="3" height="5" fill="var(--terra-accent-primary)" />
          <rect x={c - 3} y="-1.5" width="5" height="3" fill="var(--terra-accent-primary)" />
        {/if}

        {#if isCutBR}
          <!-- BR Main Armor Rail -->
          <line
            x1={w - c + 2}
            y1={h - 2}
            x2={w - 2}
            y2={h - c + 2}
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          {#if c >= 16}
            <line
              x1={w - c + 6}
              y1={h - 6}
              x2={w - 6}
              y2={h - c + 6}
              stroke="var(--terra-accent-primary)"
              stroke-width="1"
              stroke-dasharray="3 2"
              opacity="0.75"
            />
          {/if}
          <rect x={w - c - 2} y={h - 1.5} width="5" height="3" fill="var(--terra-accent-primary)" />
          <rect x={w - 1.5} y={h - c - 3} width="3" height="5" fill="var(--terra-accent-primary)" />
        {/if}

        <!-- Heavy-Duty 22px L-Bracket Plates on intact 90° corners -->
        {#if !isCutTL}
          <path
            d="M 2,22 L 2,2 L 22,2"
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <rect x="5" y="5" width="3" height="3" fill="var(--terra-accent-primary)" opacity="0.8" />
        {/if}
        {#if !isCutTR}
          <path
            d={`M ${w - 22},2 L ${w - 2},2 L ${w - 2},22`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <rect x={w - 8} y="5" width="3" height="3" fill="var(--terra-accent-primary)" opacity="0.8" />
        {/if}
        {#if !isCutBL}
          <path
            d={`M 2,${h - 22} L 2,${h - 2} L 22,${h - 2}`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <rect x="5" y={h - 8} width="3" height="3" fill="var(--terra-accent-primary)" opacity="0.8" />
        {/if}
        {#if !isCutBR}
          <path
            d={`M ${w - 22},${h - 2} L ${w - 2},${h - 2} L ${w - 2},${h - 22}`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <rect x={w - 8} y={h - 8} width="3" height="3" fill="var(--terra-accent-primary)" opacity="0.8" />
        {/if}

      <!-- ===================================================================
           PRESET 2: RHODES (PRTS Tactical Calibration Caliper & Stamp)
           =================================================================== -->
      {:else if activeDecoration === 'rhodes'}
        <!-- 5-Stage Caliper Ticks + Stamp on intact corners -->
        {#if !isCutTL}
          <line x1="6" y1="0" x2="6" y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="10" y1="0" x2="10" y2="6" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="14" y1="0" x2="14" y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="18" y1="0" x2="18" y2="6" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="22" y1="0" x2="22" y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <text x="26" y="9" font-family="var(--terra-font-mono)" font-size="8" font-weight="bold" fill="var(--terra-accent-primary)" letter-spacing="0.1em" opacity="0.9">// 01</text>
        {/if}
        {#if !isCutTR}
          <line x1={w - 6} y1="0" x2={w - 6} y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w - 10} y1="0" x2={w - 10} y2="6" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w - 14} y1="0" x2={w - 14} y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w - 18} y1="0" x2={w - 18} y2="6" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w - 22} y1="0" x2={w - 22} y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <text x={w - 48} y="9" font-family="var(--terra-font-mono)" font-size="8" font-weight="bold" fill="var(--terra-accent-primary)" letter-spacing="0.1em" opacity="0.9">PRTS //</text>
        {/if}
        {#if !isCutBL}
          <line x1="6" y1={h} x2="6" y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="10" y1={h} x2="10" y2={h - 6} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="14" y1={h} x2="14" y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="18" y1={h} x2="18" y2={h - 6} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="22" y1={h} x2="22" y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <text x="26" y={h - 3} font-family="var(--terra-font-mono)" font-size="8" font-weight="bold" fill="var(--terra-accent-primary)" letter-spacing="0.1em" opacity="0.9">// SEC</text>
        {/if}
        {#if !isCutBR}
          <line x1={w - 6} y1={h} x2={w - 6} y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w - 10} y1={h} x2={w - 10} y2={h - 6} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w - 14} y1={h} x2={w - 14} y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w - 18} y1={h} x2={w - 18} y2={h - 6} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w - 22} y1={h} x2={w - 22} y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
        {/if}

        <!-- Chamfer stepped notches -->
        {#if isCutTR}
          <rect x={w - c - 3} y="-2" width="6" height="4" fill="var(--terra-accent-primary)" />
          <rect x={w - 2} y={c - 3} width="4" height="6" fill="var(--terra-accent-primary)" />
        {/if}
        {#if isCutBL}
          <rect x="-2" y={h - c - 3} width="4" height="6" fill="var(--terra-accent-primary)" />
          <rect x={c - 3} y={h - 2} width="6" height="4" fill="var(--terra-accent-primary)" />
        {/if}
        {#if isCutTL}
          <rect x="-2" y={c - 3} width="4" height="6" fill="var(--terra-accent-primary)" />
          <rect x={c - 3} y="-2" width="6" height="4" fill="var(--terra-accent-primary)" />
        {/if}
        {#if isCutBR}
          <rect x={w - 2} y={h - c - 3} width="4" height="6" fill="var(--terra-accent-primary)" />
          <rect x={w - c - 3} y={h - 2} width="6" height="4" fill="var(--terra-accent-primary)" />
        {/if}

      <!-- ===================================================================
           PRESET 3: INDUSTRIAL (Heavy 10px Hex Fasteners & Bevel Reinforcement)
           =================================================================== -->
      {:else if activeDecoration === 'industrial'}
        <!-- 10px Recessed Hex Bolts on intact corners -->
        {#if !isCutTL}
          <circle cx="13" cy="13" r="6" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1.5" />
          <polygon points="13,8.5 16.5,10.5 16.5,14.5 13,16.5 9.5,14.5 9.5,10.5" fill="var(--terra-bg-surface)" stroke="var(--terra-border-strong)" stroke-width="1" />
          <circle cx="13" cy="13" r="1.8" fill="var(--terra-accent-primary)" />
        {/if}
        {#if !isCutTR}
          <circle cx={w - 13} cy="13" r="6" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1.5" />
          <polygon points={`${w-13},8.5 ${w-9.5},10.5 ${w-9.5},14.5 ${w-13},16.5 ${w-16.5},14.5 ${w-16.5},10.5`} fill="var(--terra-bg-surface)" stroke="var(--terra-border-strong)" stroke-width="1" />
          <circle cx={w - 13} cy="13" r="1.8" fill="var(--terra-accent-primary)" />
        {/if}
        {#if !isCutBL}
          <circle cx="13" cy={h - 13} r="6" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1.5" />
          <polygon points={`13,${h-16.5} 16.5,${h-14.5} 16.5,${h-10.5} 13,${h-8.5} 9.5,${h-10.5} 9.5,${h-14.5}`} fill="var(--terra-bg-surface)" stroke="var(--terra-border-strong)" stroke-width="1" />
          <circle cx="13" cy={h - 13} r="1.8" fill="var(--terra-accent-primary)" />
        {/if}
        {#if !isCutBR}
          <circle cx={w - 13} cy={h - 13} r="6" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1.5" />
          <polygon points={`${w-13},${h-16.5} ${w-9.5},${h-14.5} ${w-9.5},${h-10.5} ${w-13},${h-8.5} ${w-16.5},${h-10.5} ${w-16.5},${h-14.5}`} fill="var(--terra-bg-surface)" stroke="var(--terra-border-strong)" stroke-width="1" />
          <circle cx={w - 13} cy={h - 13} r="1.8" fill="var(--terra-accent-primary)" />
        {/if}

        <!-- Industrial Bevel Reinforcement Line on Chamfers -->
        {#if isCutTR}
          <line x1={w - c + 4} y1={4} x2={w - 4} y2={c - 4} stroke="var(--terra-accent-primary)" stroke-width="2" />
        {/if}
        {#if isCutBL}
          <line x1={c - 4} y1={h - 4} x2={4} y2={h - c + 4} stroke="var(--terra-accent-primary)" stroke-width="2" />
        {/if}
        {#if isCutTL}
          <line x1={4} y1={c - 4} x2={c - 4} y2={4} stroke="var(--terra-accent-primary)" stroke-width="2" />
        {/if}
        {#if isCutBR}
          <line x1={w - c + 4} y1={h - 4} x2={w - 4} y2={h - c + 4} stroke="var(--terra-accent-primary)" stroke-width="2" />
        {/if}

      <!-- ===================================================================
           PRESET 4: BRACKETS (Classic HUD Tactical Brackets · 22px Heavy-Duty)
           =================================================================== -->
      {:else if activeDecoration === 'brackets'}
        {#if !isCutTL}
          <path
            d="M 0,22 L 0,0 L 22,0"
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
        {/if}
        {#if !isCutTR}
          <path
            d={`M ${w - 22},0 L ${w},0 L ${w},22`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <line x1={w - 3} y1="0" x2={w + 3} y2="0" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w} y1="-3" x2={w} y2="3" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
        {/if}
        {#if !isCutBL}
          <path
            d={`M 0,${h - 22} L 0,${h} L 22,${h}`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <line x1="-3" y1={h} x2="3" y2={h} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1="0" y1={h - 3} x2="0" y2={h + 3} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
        {/if}
        {#if !isCutBR}
          <path
            d={`M ${w - 22},${h} L ${w},${h} L ${w},${h - 22}`}
            fill="none"
            stroke="var(--terra-accent-primary)"
            stroke-width="2.5"
            stroke-linecap="square"
            filter="url(#terra-armor-glow)"
          />
          <line x1={w - 3} y1={h} x2={w + 3} y2={h} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          <line x1={w} y1={h - 3} x2={w} y2={h + 3} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
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
