<script lang="ts">
  interface Props {
    variant?: 'primary' | 'warning' | 'danger' | 'success' | 'outline'
    label: string
    code?: string
    cut?: boolean
    class?: string
  }

  let {
    variant = 'primary',
    label,
    code = '',
    cut = true,
    class: className = ''
  }: Props = $props()
</script>

<span
  class="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 border select-none transition-colors {cut ? 'terra-cut-tr' : ''} {className}"
  class:bg-[var(--terra-accent-primary-dim)]={variant === 'primary'}
  class:border-[var(--terra-border-strong)]={variant === 'primary'}
  class:text-[var(--terra-text-primary)]={variant === 'primary'}
  class:bg-[rgba(245,158,11,0.15)]={variant === 'warning'}
  class:border-[var(--terra-accent-warning)]={variant === 'warning'}
  class:text-[var(--terra-accent-warning)]={variant === 'warning'}
  class:bg-[rgba(239,68,68,0.15)]={variant === 'danger'}
  class:border-[var(--terra-accent-danger)]={variant === 'danger'}
  class:text-[var(--terra-accent-danger)]={variant === 'danger'}
  class:bg-[rgba(16,185,129,0.15)]={variant === 'success'}
  class:border-[var(--terra-accent-success)]={variant === 'success'}
  class:text-[var(--terra-accent-success)]={variant === 'success'}
  class:border-[var(--terra-border)]={variant === 'outline'}
  class:text-[var(--terra-text-secondary)]={variant === 'outline'}
>
  {#if code}
    <span class="text-[9px] px-1 py-0.2 bg-black/15 dark:bg-white/15 tracking-tight font-bold">
      {code}
    </span>
  {/if}
  <span>{label}</span>
</span>
