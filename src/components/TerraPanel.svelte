<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title?: string
    tag?: string
    cut?: 'tl-br' | 'tr-bl' | 'tr' | 'br' | 'none'
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
    reticle = true,
    warning = false,
    children,
    actions,
    class: className = ''
  }: Props = $props()

  const cutClass = $derived(
    cut === 'tl-br' ? 'terra-cut-tl-br' :
    cut === 'tr-bl' ? 'terra-cut-tr-bl' :
    cut === 'tr' ? 'terra-cut-tr' :
    cut === 'br' ? 'terra-cut-br' : ''
  )
</script>

<div
  class="relative bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] shadow-[var(--terra-shadow)] transition-colors duration-200 {cutClass} {className}"
  class:terra-reticle-corner={reticle}
>
  {#if warning}
    <!-- Industrial Hazard Stripe Top Bar -->
    <div class="h-1.5 w-full terra-warning-stripe opacity-80"></div>
  {/if}

  {#if title || tag || actions}
    <div class="flex items-center justify-between px-4 py-2.5 border-b border-[var(--terra-border)] bg-black/5 dark:bg-white/5">
      <div class="flex items-center gap-2.5 min-w-0">
        {#if warning}
          <span class="w-1.5 h-3 bg-[var(--terra-accent-warning)] inline-block"></span>
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
