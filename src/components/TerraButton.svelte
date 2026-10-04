<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger'
    cut?: 'tl-br' | 'tr-bl' | 'tr' | 'br' | 'none'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    scanline?: boolean
    children?: Snippet
    onclick?: (e: MouseEvent) => void
    class?: string
  }

  let {
    variant = 'primary',
    cut = 'tr-bl',
    size = 'md',
    disabled = false,
    scanline = true,
    children,
    onclick,
    class: className = ''
  }: Props = $props()

  const cutClass = $derived(
    cut === 'tl-br' ? 'terra-cut-tl-br' :
    cut === 'tr-bl' ? 'terra-cut-tr-bl' :
    cut === 'tr' ? 'terra-cut-tr' :
    cut === 'br' ? 'terra-cut-br' : ''
  )

  const sizeClass = $derived(
    size === 'sm' ? 'px-3 py-1 text-xs' :
    size === 'lg' ? 'px-6 py-3 text-base' :
    'px-4 py-2 text-sm'
  )

  const variantClass = $derived(
    variant === 'primary' ? 'bg-[var(--terra-accent-primary)] text-[var(--terra-bg-base)] hover:brightness-110' :
    variant === 'outline' ? 'border border-[var(--terra-border-strong)] text-[var(--terra-text-primary)] bg-transparent hover:border-[var(--terra-accent-primary)] hover:text-[var(--terra-accent-primary)] hover:bg-[var(--terra-accent-primary-dim)]' :
    variant === 'ghost' ? 'text-[var(--terra-text-secondary)] bg-transparent hover:text-[var(--terra-text-primary)] hover:bg-[var(--terra-accent-primary-dim)]' :
    'bg-[var(--terra-accent-danger)] text-white hover:brightness-110'
  )
</script>

<button
  type="button"
  {disabled}
  {onclick}
  class="relative inline-flex items-center justify-center font-mono font-semibold tracking-wider uppercase select-none transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none overflow-hidden group {cutClass} {sizeClass} {variantClass} {className}"
>
  {#if scanline}
    <!-- GPU-Accelerated Shimmer Light Effect -->
    <span
      class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none bg-gradient-to-r from-transparent via-white/35 to-transparent"
    ></span>
  {/if}

  <span class="relative z-10 flex items-center gap-2">
    {@render children?.()}
  </span>
</button>
