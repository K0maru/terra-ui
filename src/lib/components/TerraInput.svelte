<script lang="ts">
  interface Props {
    value?: string
    placeholder?: string
    prefix?: string
    disabled?: boolean
    oninput?: (e: Event) => void
    class?: string
  }

  let {
    value = $bindable(''),
    placeholder = 'ENTER PARAMETER...',
    prefix = '>',
    disabled = false,
    oninput,
    class: className = ''
  }: Props = $props()
</script>

<div class="relative inline-flex items-center w-full font-mono text-xs terra-cut-tr border border-[var(--terra-border)] bg-[var(--terra-bg-surface)] focus-within:border-[var(--terra-border-accent)] focus-within:ring-1 focus-within:ring-[var(--terra-border-accent)] transition-all duration-150 {className}">
  {#if prefix}
    <span class="pl-3 pr-1 text-[var(--terra-accent-primary)] font-bold select-none text-[11px]">
      {prefix}
    </span>
  {/if}
  <input
    type="text"
    bind:value
    {placeholder}
    {disabled}
    {oninput}
    class="w-full py-2 px-2 bg-transparent text-[var(--terra-text-primary)] placeholder-[var(--terra-text-muted)] focus:outline-none disabled:opacity-50 text-xs tracking-wider"
  />
</div>
