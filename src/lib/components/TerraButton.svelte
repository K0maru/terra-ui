<script lang="ts">
  import type { Snippet } from 'svelte'
  import { magnetic } from '../motion'

  interface Props {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger'
    cut?: 'tl-br' | 'tr-bl' | 'tr' | 'br' | 'none'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    scanline?: boolean
    magneticPull?: boolean
    children?: Snippet
    onclick?: (e: MouseEvent) => void
    class?: string
  }

  let {
    variant = 'primary',
    cut: _cut = 'none',
    size = 'md',
    type = 'button',
    disabled = false,
    scanline = false,
    magneticPull = false,
    children,
    onclick,
    class: className = ''
  }: Props = $props()

  const sizeClass = $derived(
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : size === 'lg'
        ? 'px-6 py-3 text-sm'
        : 'px-4 py-2 text-xs'
  )

  const variantClass = $derived(
    variant === 'primary'
      ? 'bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)] border border-transparent hover:bg-[var(--terra-accent-primary)] hover:text-[var(--terra-on-accent)]'
      : variant === 'outline'
        ? 'border border-[var(--terra-border-strong)] text-[var(--terra-text-primary)] bg-transparent hover:border-[var(--terra-text-primary)]'
        : variant === 'ghost'
          ? 'text-[var(--terra-text-secondary)] border border-transparent bg-transparent hover:text-[var(--terra-text-primary)] hover:bg-[var(--terra-bg-surface-hover)]'
          : 'bg-[var(--terra-accent-danger)] text-[var(--terra-on-accent)] border border-transparent hover:brightness-110'
  )
</script>

<button
  {type}
  {disabled}
  {onclick}
  use:magnetic={{ strength: 0.2, disabled: !magneticPull || disabled }}
  class="terra-pressable relative inline-flex items-center justify-center font-mono font-semibold tracking-wider uppercase select-none disabled:opacity-40 disabled:pointer-events-none overflow-hidden group cursor-pointer {sizeClass} {variantClass} {className}"
>
  {#if scanline}
    <span
      aria-hidden="true"
      class="terra-btn-scanline absolute inset-0 -translate-x-full group-hover:translate-x-full pointer-events-none bg-gradient-to-r from-transparent via-[var(--terra-on-accent)]/20 to-transparent"
    ></span>
  {/if}

  <span class="relative z-[1] inline-flex items-center gap-2">
    {@render children?.()}
  </span>

  {#if variant === 'outline'}
    <span
      aria-hidden="true"
      class="terra-btn-wipe absolute inset-0 z-[2] inline-flex items-center justify-center gap-2 bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)] pointer-events-none"
    >
      {@render children?.()}
    </span>
  {/if}
</button>

<style>
  .terra-btn-wipe {
    clip-path: inset(0 100% 0 0);
    transition: clip-path var(--terra-dur-fast) var(--terra-ease-exit);
  }

  .group:hover .terra-btn-wipe,
  .group:focus-visible .terra-btn-wipe {
    clip-path: inset(0 0 0 0);
    transition: clip-path var(--terra-dur-base) var(--terra-ease-out);
  }

  .terra-btn-scanline {
    transition: transform var(--terra-dur-chart) var(--terra-ease-out);
  }
</style>
