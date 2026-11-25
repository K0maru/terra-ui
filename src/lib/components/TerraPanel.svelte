<script lang="ts">
  import type { Snippet } from 'svelte'

  /** @deprecated Chamfer cuts have been removed in favor of pure flat 1px editorial rules. */
  export type PanelCut = 'tl-br' | 'tr-bl' | 'tr' | 'br' | 'none'
  /** @deprecated Legacy preset names are accepted as no-ops; all panels render in flat editorial style. */
  export type PanelDecoration = 'endfield' | 'rhodes' | 'industrial' | 'brackets' | 'clean'
  /** @deprecated Legacy focus target kept for API compatibility. */
  export type DecorationFocus = 'auto' | 'chamfer' | 'corner' | 'both'

  interface Props {
    title?: string
    tag?: string
    /** @deprecated No-op kept for API compatibility. */
    cut?: PanelCut
    /** @deprecated No-op kept for API compatibility. */
    cutSize?: number
    /** @deprecated No-op kept for API compatibility. */
    decoration?: PanelDecoration
    /** @deprecated No-op kept for API compatibility. */
    focus?: DecorationFocus
    /** @deprecated No-op kept for API compatibility. */
    chamferBorder?: boolean
    /** @deprecated No-op kept for API compatibility. */
    bracket?: boolean
    /** @deprecated No-op kept for API compatibility. */
    reticle?: boolean
    warning?: boolean
    children?: Snippet
    actions?: Snippet
    class?: string
  }

  let {
    title = '',
    tag = '',
    cut: _cut = 'none',
    cutSize: _cutSize = 0,
    decoration: _decoration = 'clean',
    focus: _focus = 'auto',
    chamferBorder: _chamferBorder = false,
    bracket: _bracket = false,
    reticle: _reticle = false,
    warning = false,
    children,
    actions,
    class: className = ''
  }: Props = $props()
</script>

<div
  class="isolate terra-t-color relative select-none bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] {className}"
>
  {#if warning}
    <div class="h-1 w-full bg-[var(--terra-accent-warning)]"></div>
  {/if}

  {#if title || tag || actions}
    <div
      class="terra-t-color flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[var(--terra-border)] bg-[var(--terra-bg-base)]/40"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        {#if warning}
          <span class="w-1.5 h-3 bg-[var(--terra-accent-warning)] inline-block shrink-0"></span>
        {/if}
        {#if title}
          <h3
            class="font-mono text-xs font-semibold tracking-wider uppercase text-[var(--terra-text-primary)] truncate"
          >
            {title}
          </h3>
        {/if}
        {#if tag}
          <span
            class="font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider shrink-0"
          >
            {tag}
          </span>
        {/if}
      </div>

      {#if actions}
        <div class="flex items-center gap-2 shrink-0">
          {@render actions()}
        </div>
      {/if}
    </div>
  {/if}

  <div class="p-4 sm:p-5">
    {@render children?.()}
  </div>
</div>
