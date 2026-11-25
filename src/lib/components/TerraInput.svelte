<script lang="ts">
  import { CornerDownLeft, X } from 'lucide-svelte'
  import { i18n } from '../i18n'

  interface Props {
    value?: string
    placeholder?: string
    prefix?: string
    disabled?: boolean
    clearable?: boolean
    oninput?: (e: Event) => void
    class?: string
  }

  let {
    value = $bindable(''),
    placeholder,
    prefix = '',
    disabled = false,
    clearable = true,
    oninput,
    class: className = ''
  }: Props = $props()

  let focused = $state(false)
  let inputEl: HTMLInputElement | undefined = $state()

  const resolvedPlaceholder = $derived(
    placeholder ?? (i18n.locale === 'zh' ? '输入指令或参数...' : 'Enter instruction or params...')
  )

  function clearValue() {
    value = ''
    inputEl?.focus()
  }
</script>

<div
  class="isolate relative inline-flex items-center gap-1.5 w-full font-mono text-xs bg-transparent border-b border-[var(--terra-border-strong)] {className}"
>
  {#if prefix}
    <span
      class="terra-t-color pr-1 font-semibold select-none text-[11px] shrink-0 {focused
        ? 'text-[var(--terra-accent-primary)]'
        : 'text-[var(--terra-text-muted)]'}"
    >
      {prefix}
    </span>
  {/if}

  <input
    bind:this={inputEl}
    type="text"
    bind:value
    placeholder={resolvedPlaceholder}
    {disabled}
    {oninput}
    onfocus={() => (focused = true)}
    onblur={() => (focused = false)}
    class="w-full py-2.5 bg-transparent text-[var(--terra-text-primary)] placeholder-[var(--terra-text-muted)] focus:outline-none disabled:opacity-50 text-xs tracking-wide"
  />

  {#if clearable && value.length > 0 && !disabled}
    <button
      type="button"
      onclick={clearValue}
      aria-label="Clear input"
      class="terra-t-color p-1 text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)] cursor-pointer shrink-0 focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)]"
    >
      <X class="w-3.5 h-3.5" />
    </button>
  {/if}

  <span
    aria-hidden="true"
    class="terra-t-color p-1 shrink-0 {focused
      ? 'text-[var(--terra-accent-primary)]'
      : 'text-[var(--terra-text-muted)] opacity-45'}"
  >
    <CornerDownLeft class="w-3.5 h-3.5" />
  </span>

  <span
    aria-hidden="true"
    class="terra-input-rail pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--terra-accent-primary)] origin-center"
    data-focused={focused}
  ></span>
</div>

<style>
  .terra-input-rail {
    transform: scaleX(0);
    transition: transform calc(var(--terra-dur-base) * 0.5) var(--terra-ease-exit);
  }

  .terra-input-rail[data-focused='true'] {
    transform: scaleX(1);
    transition: transform var(--terra-dur-base) var(--terra-spring-snappy);
  }
</style>
