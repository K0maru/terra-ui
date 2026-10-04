<script lang="ts">
  import type { Snippet } from 'svelte'

  export type PanelCut = 'tl-br' | 'tr-bl' | 'tr' | 'br' | 'none'
  export type PanelDecoration = 'endfield' | 'rhodes' | 'industrial' | 'brackets' | 'clean'
  export type DecorationFocus = 'auto' | 'chamfer' | 'corner' | 'both'

  interface Props {
    title?: string
    tag?: string
    cut?: PanelCut
    /** Chamfer cut size in pixels, default 16 */
    cutSize?: number
    /** Modular decoration preset: 'endfield' (default), 'rhodes', 'industrial', 'brackets', 'clean' */
    decoration?: PanelDecoration
    /** Focus for decorations: 'auto' (mutually exclusive), 'chamfer', 'corner', 'both' */
    focus?: DecorationFocus
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
    focus = 'auto',
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

  // Enforce a solid minimal chamfer depth
  const c = $derived(Math.max(14, cutSize))

  // Calculate polygon perimeter path points for continuous vector border and background fill
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

  // CSS clip-path for inner content (synchronously shares the exact same c)
  const innerClipPath = $derived.by(() => {
    if (cut === 'tr') {
      return `polygon(0% 0%, calc(100% - ${c}px) 0%, 100% ${c}px, 100% 100%, 0% 100%)`
    }
    if (cut === 'br') {
      return `polygon(0% 0%, 100% 0%, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, 0% 100%)`
    }
    if (cut === 'tr-bl') {
      return `polygon(0% 0%, calc(100% - ${c}px) 0%, 100% ${c}px, 100% 100%, ${c}px 100%, 0% calc(100% - ${c}px))`
    }
    if (cut === 'tl-br') {
      return `polygon(${c}px 0%, 100% 0%, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, 0% 100%, 0% ${c}px)`
    }
    return 'none'
  })

  // Identify which corners are cut and which are intact 90° corners
  const isCutTL = $derived(cut === 'tl-br')
  const isCutTR = $derived(cut === 'tr' || cut === 'tr-bl')
  const isCutBR = $derived(cut === 'tl-br' || cut === 'br')
  const isCutBL = $derived(cut === 'tr-bl')

  // Mutually exclusive decoration logic
  const shouldDecorateChamfer = $derived(
    activeDecoration !== 'clean' &&
    (focus === 'both' || focus === 'chamfer' || (focus === 'auto' && cut !== 'none'))
  )
  const shouldDecorateCorner = $derived(
    activeDecoration !== 'clean' &&
    (focus === 'both' || focus === 'corner' || (focus === 'auto' && cut === 'none'))
  )

  // Header safe insets to prevent actions or title clipping
  const headerLeftPad = $derived(isCutTL ? 'pl-8' : 'pl-4')
  const headerRightPad = $derived(isCutTR ? 'pr-8' : 'pr-4')

  // Generate 100% center-symmetric regular hexagon points
  function getHexPoints(cx: number, cy: number, r: number = 3.8): string {
    const pts: string[] = []
    for (let i = 0; i < 6; i++) {
      const rad = (i * 60 * Math.PI) / 180
      pts.push(`${(cx + r * Math.cos(rad)).toFixed(2)},${(cy + r * Math.sin(rad)).toFixed(2)}`)
    }
    return pts.join(' ')
  }
</script>

<div
  bind:clientWidth={w}
  bind:clientHeight={h}
  class="relative select-none transition-colors duration-200 {className}"
>
  <!-- Unified SVG Vector Chassis: Background Fill + 1px Vector Perimeter Border + Decorators -->
  {#if w > 0 && h > 0}
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="terra-armor-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="var(--terra-accent-primary)" flood-opacity="0.4" />
        </filter>
      </defs>

      <!-- 1. Unified Background Fill & Continuous 1px Perimeter Border (Zero Desync) -->
      <path
        d={polygonPath}
        fill="var(--terra-bg-surface)"
        stroke="var(--terra-border)"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />

      <!-- ===================================================================
           PRESET 1: ENDFIELD (Talos-II AIC Industrial Heavy-Armour)
           =================================================================== -->
      {#if activeDecoration === 'endfield'}
        <!-- 45° Chamfer Armor Rails (Decorated when shouldDecorateChamfer) -->
        {#if shouldDecorateChamfer}
          {#if isCutTR}
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
            <rect x={w - c - 1} y="0" width="4" height="2" fill="var(--terra-accent-primary)" />
            <rect x={w - 2} y={c - 3} width="2" height="4" fill="var(--terra-accent-primary)" />
          {/if}

          {#if isCutBL}
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
            <rect x={c - 3} y={h - 2} width="4" height="2" fill="var(--terra-accent-primary)" />
            <rect x="0" y={h - c - 1} width="2" height="4" fill="var(--terra-accent-primary)" />
          {/if}

          {#if isCutTL}
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
            <rect x="0" y={c - 3} width="2" height="4" fill="var(--terra-accent-primary)" />
            <rect x={c - 3} y="0" width="4" height="2" fill="var(--terra-accent-primary)" />
          {/if}

          {#if isCutBR}
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
            <rect x={w - c - 1} y={h - 2} width="4" height="2" fill="var(--terra-accent-primary)" />
            <rect x={w - 2} y={h - c - 3} width="2" height="4" fill="var(--terra-accent-primary)" />
          {/if}
        {/if}

        <!-- 90° Intact Corner Brackets (Decorated only when shouldDecorateCorner) -->
        {#if shouldDecorateCorner}
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
        {/if}

      <!-- ===================================================================
           PRESET 2: RHODES (PRTS Tactical Calibration Caliper & Stamp)
           =================================================================== -->
      {:else if activeDecoration === 'rhodes'}
        {#if shouldDecorateChamfer}
          {#if isCutTR}
            <line x1={w - c + 3} y1={3} x2={w - 3} y2={c - 3} stroke="var(--terra-accent-primary)" stroke-width="2" />
            <rect x={w - c - 1} y="0" width="3" height="2" fill="var(--terra-accent-primary)" />
            <rect x={w - 2} y={c - 2} width="2" height="3" fill="var(--terra-accent-primary)" />
          {/if}
          {#if isCutBL}
            <line x1={c - 3} y1={h - 3} x2={3} y2={h - c + 3} stroke="var(--terra-accent-primary)" stroke-width="2" />
            <rect x={c - 2} y={h - 2} width="3" height="2" fill="var(--terra-accent-primary)" />
            <rect x="0" y={h - c - 1} width="2" height="3" fill="var(--terra-accent-primary)" />
          {/if}
          {#if isCutTL}
            <line x1={3} y1={c - 3} x2={c - 3} y2={3} stroke="var(--terra-accent-primary)" stroke-width="2" />
            <rect x="0" y={c - 2} width="2" height="3" fill="var(--terra-accent-primary)" />
            <rect x={c - 2} y="0" width="3" height="2" fill="var(--terra-accent-primary)" />
          {/if}
          {#if isCutBR}
            <line x1={w - c + 3} y1={h - 3} x2={w - 3} y2={h - c + 3} stroke="var(--terra-accent-primary)" stroke-width="2" />
            <rect x={w - c - 1} y={h - 2} width="3" height="2" fill="var(--terra-accent-primary)" />
            <rect x={w - 2} y={h - c - 2} width="2" height="3" fill="var(--terra-accent-primary)" />
          {/if}
        {/if}

        {#if shouldDecorateCorner}
          {#if !isCutTL}
            <line x1="6" y1="0" x2="6" y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1="10" y1="0" x2="10" y2="6" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1="14" y1="0" x2="14" y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1="18" y1="0" x2="18" y2="6" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1="22" y1="0" x2="22" y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          {/if}
          {#if !isCutTR}
            <line x1={w - 6} y1="0" x2={w - 6} y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1={w - 10} y1="0" x2={w - 10} y2="6" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1={w - 14} y1="0" x2={w - 14} y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1={w - 18} y1="0" x2={w - 18} y2="6" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1={w - 22} y1="0" x2={w - 22} y2="10" stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          {/if}
          {#if !isCutBL}
            <line x1="6" y1={h} x2="6" y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1="10" y1={h} x2="10" y2={h - 6} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1="14" y1={h} x2="14" y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1="18" y1={h} x2="18" y2={h - 6} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1="22" y1={h} x2="22" y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          {/if}
          {#if !isCutBR}
            <line x1={w - 6} y1={h} x2={w - 6} y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1={w - 10} y1={h} x2={w - 10} y2={h - 6} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1={w - 14} y1={h} x2={w - 14} y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1={w - 18} y1={h} x2={w - 18} y2={h - 6} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
            <line x1={w - 22} y1={h} x2={w - 22} y2={h - 10} stroke="var(--terra-accent-primary)" stroke-width="1.5" />
          {/if}
        {/if}

      <!-- ===================================================================
           PRESET 3: INDUSTRIAL (Center-Symmetric 10px Hex Fasteners)
           =================================================================== -->
      {:else if activeDecoration === 'industrial'}
        {#if shouldDecorateChamfer}
          {#if isCutTR}
            <line x1={w - c + 3} y1={3} x2={w - 3} y2={c - 3} stroke="var(--terra-accent-primary)" stroke-width="2" />
          {/if}
          {#if isCutBL}
            <line x1={c - 3} y1={h - 3} x2={3} y2={h - c + 3} stroke="var(--terra-accent-primary)" stroke-width="2" />
          {/if}
          {#if isCutTL}
            <line x1={3} y1={c - 3} x2={c - 3} y2={3} stroke="var(--terra-accent-primary)" stroke-width="2" />
          {/if}
          {#if isCutBR}
            <line x1={w - c + 3} y1={h - 3} x2={w - 3} y2={h - c + 3} stroke="var(--terra-accent-primary)" stroke-width="2" />
          {/if}
        {/if}

        <!-- 100% Center-Symmetric Hex Bolts on Intact 90° Corners (Equidistant 14px from edges) -->
        {#if shouldDecorateCorner}
          {#if !isCutTL}
            <circle cx="14" cy="14" r="5.5" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1.2" />
            <polygon points={getHexPoints(14, 14, 3.8)} fill="var(--terra-bg-surface)" stroke="var(--terra-border-strong)" stroke-width="1" />
            <circle cx="14" cy="14" r="1.5" fill="var(--terra-accent-primary)" />
          {/if}
          {#if !isCutTR}
            <circle cx={w - 14} cy="14" r="5.5" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1.2" />
            <polygon points={getHexPoints(w - 14, 14, 3.8)} fill="var(--terra-bg-surface)" stroke="var(--terra-border-strong)" stroke-width="1" />
            <circle cx={w - 14} cy="14" r="1.5" fill="var(--terra-accent-primary)" />
          {/if}
          {#if !isCutBL}
            <circle cx="14" cy={h - 14} r="5.5" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1.2" />
            <polygon points={getHexPoints(14, h - 14, 3.8)} fill="var(--terra-bg-surface)" stroke="var(--terra-border-strong)" stroke-width="1" />
            <circle cx="14" cy={h - 14} r="1.5" fill="var(--terra-accent-primary)" />
          {/if}
          {#if !isCutBR}
            <circle cx={w - 14} cy={h - 14} r="5.5" fill="var(--terra-bg-surface-active)" stroke="var(--terra-border-strong)" stroke-width="1.2" />
            <polygon points={getHexPoints(w - 14, h - 14, 3.8)} fill="var(--terra-bg-surface)" stroke="var(--terra-border-strong)" stroke-width="1" />
            <circle cx={w - 14} cy={h - 14} r="1.5" fill="var(--terra-accent-primary)" />
          {/if}
        {/if}

      <!-- ===================================================================
           PRESET 4: BRACKETS (Classic HUD Tactical Brackets · Mutually Exclusive)
           =================================================================== -->
      {:else if activeDecoration === 'brackets'}
        {#if shouldDecorateCorner}
          {#if !isCutTL}
            <path d="M 0,20 L 0,0 L 20,0" fill="none" stroke="var(--terra-accent-primary)" stroke-width="2.5" stroke-linecap="square" />
          {/if}
          {#if !isCutTR}
            <path d={`M ${w - 20},0 L ${w},0 L ${w},20`} fill="none" stroke="var(--terra-accent-primary)" stroke-width="2.5" stroke-linecap="square" />
          {/if}
          {#if !isCutBL}
            <path d={`M 0,${h - 20} L 0,${h} L 20,${h}`} fill="none" stroke="var(--terra-accent-primary)" stroke-width="2.5" stroke-linecap="square" />
          {/if}
          {#if !isCutBR}
            <path d={`M ${w - 20},${h} L ${w},${h} L ${w},${h - 20}`} fill="none" stroke="var(--terra-accent-primary)" stroke-width="2.5" stroke-linecap="square" />
          {/if}
        {/if}

        {#if shouldDecorateChamfer}
          {#if isCutTR}
            <line x1={w - c + 2} y1={2} x2={w - 2} y2={c - 2} stroke="var(--terra-accent-primary)" stroke-width="2" />
          {/if}
          {#if isCutBL}
            <line x1={c - 2} y1={h - 2} x2={2} y2={h - c + 2} stroke="var(--terra-accent-primary)" stroke-width="2" />
          {/if}
          {#if isCutTL}
            <line x1={2} y1={c - 2} x2={c - 2} y2={2} stroke="var(--terra-accent-primary)" stroke-width="2" />
          {/if}
          {#if isCutBR}
            <line x1={w - c + 2} y1={h - 2} x2={w - 2} y2={h - c + 2} stroke="var(--terra-accent-primary)" stroke-width="2" />
          {/if}
        {/if}
      {/if}
    </svg>
  {/if}

  <!-- Inner Clipped Content Container (Synchronized with exact same c value) -->
  <div
    class="relative z-10 w-full h-full"
    style="clip-path: {innerClipPath};"
  >
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
