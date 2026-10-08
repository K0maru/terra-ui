<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    /** Pattern tile size in pixels, default 100 */
    patternSize?: number
    /** Pattern opacity, default 0.15 */
    opacity?: number
    /** Whether to increase visibility and accent color on hover, default true */
    hoverHighlight?: boolean
    /** Optional content to wrap */
    children?: Snippet
    /** Custom container class */
    class?: string
  }

  let {
    patternSize = 100,
    opacity = 0.15,
    hoverHighlight = true,
    children,
    class: className = ''
  }: Props = $props()

  // Unique pattern ID per instance to prevent SVG mask collisions
  const patternId = `terra-cad-${Math.random().toString(36).slice(2, 9)}`
</script>

<div
  class="terra-cad-container relative {className}"
  class:terra-cad-hover={hoverHighlight}
  style="--cad-opacity: {opacity}; --cad-size: {patternSize}px;"
>
  <!-- Background CAD Pattern Layer -->
  <div class="terra-cad-pattern-overlay absolute inset-0 pointer-events-none overflow-hidden select-none">
    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id={patternId}
          width={patternSize}
          height={patternSize}
          patternUnits="userSpaceOnUse"
        >
          <!-- Grid Boundary (Subtle cell frame) -->
          <rect
            x="0.5"
            y="0.5"
            width={patternSize - 1}
            height={patternSize - 1}
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-opacity="0.25"
          />

          <!-- 4 Corner Precision Brackets -->
          <path
            d="M 2 8 V 2 H 8 M {patternSize - 8} 2 H {patternSize - 2} V 8 M 2 {patternSize - 8} V {patternSize - 2} H 8 M {patternSize - 8} {patternSize - 2} H {patternSize - 2} V {patternSize - 8}"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-opacity="0.8"
          />

          <!-- 45-Degree Corner Chamfer Ticks -->
          <path
            d="M 6 16 L 16 6 M {patternSize - 16} 6 L {patternSize - 6} 16 M 6 {patternSize - 16} L 16 {patternSize - 6} M {patternSize - 16} {patternSize - 6} L {patternSize - 6} {patternSize - 16}"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="square"
            stroke-opacity="0.65"
          />

          <!-- Dotted Diagonal Atlos Navigation Lines -->
          <line
            x1="18"
            y1="18"
            x2={patternSize - 18}
            y2={patternSize - 18}
            stroke="currentColor"
            stroke-width="1"
            stroke-dasharray="2 4"
            stroke-opacity="0.45"
          />
          <line
            x1={patternSize - 18}
            y1="18"
            x2="18"
            y2={patternSize - 18}
            stroke="currentColor"
            stroke-width="1"
            stroke-dasharray="2 4"
            stroke-opacity="0.45"
          />

          <!-- Center Crosshair & Precision Reticle Box -->
          <g transform="translate({patternSize / 2}, {patternSize / 2})">
            <line x1="-7" y1="0" x2="7" y2="0" stroke="currentColor" stroke-width="1" stroke-opacity="0.8" />
            <line x1="0" y1="-7" x2="0" y2="7" stroke="currentColor" stroke-width="1" stroke-opacity="0.8" />
            <rect x="-2" y="-2" width="4" height="4" fill="currentColor" fill-opacity="0.9" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#{patternId})" />
    </svg>
  </div>

  <!-- Content Slot -->
  {#if children}
    <div class="relative z-10 w-full h-full">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .terra-cad-container {
    color: var(--terra-text-muted, #718096);
  }

  .terra-cad-pattern-overlay {
    opacity: var(--cad-opacity, 0.15);
    transition: opacity 0.35s cubic-bezier(0.8, 0.2, 0.35, 0.7),
                color 0.35s cubic-bezier(0.8, 0.2, 0.35, 0.7);
  }

  .terra-cad-hover:hover .terra-cad-pattern-overlay {
    opacity: calc(var(--cad-opacity, 0.15) * 2.2);
    color: var(--terra-accent-primary, #fff000);
  }
</style>
