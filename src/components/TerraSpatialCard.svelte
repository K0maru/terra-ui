<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    cut?: 'none' | 'tr' | 'tl-br' | 'tr-bl'
    maxRotation?: number
    perspective?: number
    sheen?: boolean
    borderGlow?: boolean
    class?: string
    children?: Snippet
  }

  let {
    cut = 'tr-bl',
    maxRotation = 16,
    perspective = 1000,
    sheen = true,
    borderGlow = true,
    class: className = '',
    children
  }: Props = $props()

  let rx = $state(0)
  let ry = $state(0)
  let sheenX = $state(50)
  let sheenY = $state(50)
  let isHovered = $state(false)

  const cutClass = $derived(
    cut === 'tl-br' ? 'terra-cut-tl-br' :
    cut === 'tr-bl' ? 'terra-cut-tr-bl' :
    cut === 'tr' ? 'terra-cut-tr' : ''
  )

  function handlePointerMove(e: PointerEvent) {
    const card = e.currentTarget as HTMLElement
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (-maxRotation to +maxRotation)
    rx = ((y - centerY) / rect.height) * -maxRotation
    ry = ((x - centerX) / rect.width) * maxRotation
    sheenX = Math.round((x / rect.width) * 100)
    sheenY = Math.round((y / rect.height) * 100)
    isHovered = true
  }

  function handlePointerLeave() {
    rx = 0
    ry = 0
    isHovered = false
  }
</script>

<div
  class="relative select-none {className}"
  style="perspective: {perspective}px;"
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  role="region"
  aria-label="3D Spatial Card"
>
  <!-- 3D Tilting Inner Plate -->
  <div
    class="relative w-full h-full will-change-transform"
    style="
      transform-style: preserve-3d;
      transform: rotateX({rx}deg) rotateY({ry}deg);
      transition: {isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'};
    "
  >
    <!-- Background Chassis with Chamfer Cut and Specular Sheen -->
    <div
      class="absolute inset-0 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] transition-shadow duration-300 pointer-events-none {cutClass}"
      class:shadow-[0_12px_40px_rgba(0,0,0,0.6)]={!isHovered}
      class:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_var(--terra-accent-primary-dim)]={isHovered && borderGlow}
    >
      <!-- Sub-surface CAD circuit texture -->
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(var(--terra-text-muted)_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <!-- Specular Reflection Sheen Layer (follows pointer) -->
      {#if sheen}
        <div
          class="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style="
            background: radial-gradient(circle at {sheenX}% {sheenY}%, rgba(255, 255, 255, 0.18), transparent 60%);
            opacity: {isHovered ? 1 : 0};
          "
        ></div>
      {/if}

      <!-- Corner Reticle Markers -->
      <span class="absolute top-1 left-2 font-mono text-[9px] text-[var(--terra-accent-primary)] opacity-60">+</span>
      <span class="absolute top-1 right-2 font-mono text-[9px] text-[var(--terra-accent-primary)] opacity-60">+</span>
      <span class="absolute bottom-1 left-2 font-mono text-[9px] text-[var(--terra-accent-primary)] opacity-60">+</span>
      <span class="absolute bottom-1 right-2 font-mono text-[9px] text-[var(--terra-accent-primary)] opacity-60">+</span>
    </div>

    <!-- 3D Spatial Content Layer (Preserves 3D depth for floating children) -->
    <div
      class="relative z-10 w-full h-full p-5 sm:p-6"
      style="transform-style: preserve-3d;"
    >
      {@render children?.()}
    </div>
  </div>
</div>
