<script lang="ts">
  interface Props {
    variant?: 'primary' | 'warning' | 'danger' | 'success' | 'outline'
    label: string
    code?: string
    /** @deprecated Chamfer cuts removed in flat editorial system. */
    cut?: boolean
    class?: string
  }

  let {
    variant = 'primary',
    label,
    code = '',
    cut: _cut = false,
    class: className = ''
  }: Props = $props()
</script>

<span
  class="terra-t-color inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider uppercase px-2 py-0.5 border select-none {className}"
  class:bg-[var(--terra-accent-primary-dim)]={variant === 'primary'}
  class:border-[var(--terra-border-accent)]={variant === 'primary'}
  class:text-[var(--terra-accent-primary)]={variant === 'primary'}
  class:border-[var(--terra-accent-warning)]={variant === 'warning'}
  class:text-[var(--terra-accent-warning)]={variant === 'warning'}
  class:border-[var(--terra-accent-danger)]={variant === 'danger'}
  class:text-[var(--terra-accent-danger)]={variant === 'danger'}
  class:border-[var(--terra-accent-success)]={variant === 'success'}
  class:text-[var(--terra-accent-success)]={variant === 'success'}
  class:border-[var(--terra-border)]={variant === 'outline'}
  class:text-[var(--terra-text-secondary)]={variant === 'outline'}
>
  {#if code}
    <span
      class="text-[10px] px-1 bg-[var(--terra-bg-surface-active)] text-[var(--terra-text-primary)] tracking-tight font-semibold"
    >
      {code}
    </span>
  {/if}
  <span>{label}</span>
</span>
