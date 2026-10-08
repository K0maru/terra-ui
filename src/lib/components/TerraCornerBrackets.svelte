<script lang="ts">
  import type { Snippet } from 'svelte'

  type Corner = 'tl' | 'tr' | 'bl' | 'br'

  interface Props {
    /** Corners to render, default all 4 corners */
    corners?: Corner[]
    /** Size preset: sm (8px), md (12px), lg (18px) */
    size?: 'sm' | 'md' | 'lg'
    /** Bracket line thickness, default '2px' */
    thickness?: string
    /** Optional telemetry HUD label */
    label?: string
    /** Whether to enable breathing glow animation, default false */
    glow?: boolean
    /** Whether the bracket is currently active / locked on, default false */
    active?: boolean
    /** Optional wrapped content */
    children?: Snippet
    /** Custom class name */
    class?: string
  }

  let {
    corners = ['tl', 'tr', 'bl', 'br'],
    size = 'md',
    thickness = '2px',
    label = '',
    glow = false,
    active = false,
    children,
    class: className = ''
  }: Props = $props()

  const armLength = $derived(
    size === 'sm' ? '8px' : size === 'lg' ? '18px' : '12px'
  )
</script>

<div
  class="terra-corner-container relative {className}"
  class:terra-corner-active={active}
  class:terra-corner-glow={glow}
  style="--bracket-arm: {armLength}; --bracket-thick: {thickness};"
>
  <!-- HUD Telemetry Label Tag -->
  {#if label}
    <div class="terra-corner-label absolute -top-2.5 right-2 px-1.5 py-0.2 bg-[var(--terra-bg-surface,#12151b)] border border-[var(--terra-border,rgba(255,240,0,0.22))] text-[var(--terra-accent-primary,#fff000)] font-mono text-[9px] font-bold tracking-widest uppercase shadow-sm pointer-events-none select-none z-20">
      {label}
    </div>
  {/if}

  <!-- Tactical HUD Bracket Corners -->
  {#if corners.includes('tl')}
    <span class="terra-bracket terra-bracket-tl pointer-events-none" aria-hidden="true"></span>
  {/if}
  {#if corners.includes('tr')}
    <span class="terra-bracket terra-bracket-tr pointer-events-none" aria-hidden="true"></span>
  {/if}
  {#if corners.includes('bl')}
    <span class="terra-bracket terra-bracket-bl pointer-events-none" aria-hidden="true"></span>
  {/if}
  {#if corners.includes('br')}
    <span class="terra-bracket terra-bracket-br pointer-events-none" aria-hidden="true"></span>
  {/if}

  <!-- Slot Content -->
  {#if children}
    <div class="relative z-10 w-full h-full">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .terra-bracket {
    position: absolute;
    width: var(--bracket-arm);
    height: var(--bracket-arm);
    border-color: var(--terra-accent-primary, #fff000);
    z-index: 15;
    transition: all 0.25s cubic-bezier(0.8, 0.2, 0.35, 0.7);
    opacity: 0.85;
  }

  .terra-bracket-tl {
    top: -1px;
    left: -1px;
    border-top: var(--bracket-thick) solid;
    border-left: var(--bracket-thick) solid;
  }

  .terra-bracket-tr {
    top: -1px;
    right: -1px;
    border-top: var(--bracket-thick) solid;
    border-right: var(--bracket-thick) solid;
  }

  .terra-bracket-bl {
    bottom: -1px;
    left: -1px;
    border-bottom: var(--bracket-thick) solid;
    border-left: var(--bracket-thick) solid;
  }

  .terra-bracket-br {
    bottom: -1px;
    right: -1px;
    border-bottom: var(--bracket-thick) solid;
    border-right: var(--bracket-thick) solid;
  }

  /* Active State: Full brightness & subtle scale */
  .terra-corner-active .terra-bracket {
    opacity: 1;
    filter: drop-shadow(0 0 5px var(--terra-accent-primary, #fff000));
  }

  /* Glow / Pulse Animation */
  .terra-corner-glow .terra-bracket {
    animation: bracketPulse 2.8s ease-in-out infinite;
  }

  @keyframes bracketPulse {
    0%, 100% {
      opacity: 0.6;
      filter: drop-shadow(0 0 2px var(--terra-accent-primary-dim, rgba(255, 240, 0, 0.2)));
    }
    50% {
      opacity: 1;
      filter: drop-shadow(0 0 6px var(--terra-accent-primary, #fff000));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .terra-corner-glow .terra-bracket {
      animation: none !important;
    }
  }
</style>
