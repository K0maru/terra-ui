<script lang="ts">
  interface Props {
    status?: 'online' | 'standby' | 'alert' | 'offline'
    label?: string
    pulse?: boolean
    class?: string
  }

  let {
    status = 'online',
    label = '',
    pulse = true,
    class: className = ''
  }: Props = $props()

  const colorClass = $derived(
    status === 'online' ? 'bg-[var(--terra-accent-success)]' :
    status === 'alert' ? 'bg-[var(--terra-accent-danger)]' :
    status === 'standby' ? 'bg-[var(--terra-accent-warning)]' :
    'bg-[var(--terra-text-muted)]'
  )
</script>

<div class="inline-flex items-center gap-2 font-mono text-xs tracking-wider {className}">
  <span class="relative flex h-2.5 w-2.5">
    {#if pulse && status !== 'offline'}
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 {colorClass}"></span>
    {/if}
    <span class="relative inline-flex rounded-full h-2.5 w-2.5 {colorClass}"></span>
  </span>

  {#if label}
    <span class="text-[var(--terra-text-secondary)] uppercase text-[11px] font-medium">
      {label}
    </span>
  {/if}
</div>
