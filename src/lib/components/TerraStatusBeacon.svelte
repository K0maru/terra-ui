<script lang="ts">
  interface Props {
    status?: 'online' | 'standby' | 'alert' | 'offline'
    label?: string
    pulse?: boolean
    class?: string
  }

  let { status = 'online', label = '', pulse = true, class: className = '' }: Props = $props()

  const colorClass = $derived(
    status === 'online'
      ? 'bg-[var(--terra-accent-success)]'
      : status === 'alert'
        ? 'bg-[var(--terra-accent-danger)]'
        : status === 'standby'
          ? 'bg-[var(--terra-accent-warning)]'
          : 'bg-[var(--terra-text-muted)]'
  )

  const ringClass = $derived(
    status === 'online'
      ? 'border-[var(--terra-accent-success)]'
      : status === 'alert'
        ? 'border-[var(--terra-accent-danger)]'
        : status === 'standby'
          ? 'border-[var(--terra-accent-warning)]'
          : 'border-[var(--terra-border)]'
  )
</script>

<div class="inline-flex items-center gap-2 font-mono text-xs tracking-wider {className}">
  <span class="relative inline-flex items-center justify-center w-3 h-3 shrink-0">
    {#if pulse && status !== 'offline'}
      <span
        aria-hidden="true"
        class="terra-beacon-ring absolute inset-0 rounded-full border {ringClass}"
      ></span>
    {/if}
    <span class="relative inline-flex rounded-full w-1.5 h-1.5 {colorClass}"></span>
  </span>

  {#if label}
    <span class="text-[var(--terra-text-secondary)] uppercase text-[11px] font-medium">
      {label}
    </span>
  {/if}
</div>

<style>
  @keyframes terraBeaconBreathe {
    0%,
    100% {
      opacity: 0.28;
      transform: scale(0.86);
    }
    50% {
      opacity: 0.86;
      transform: scale(1.08);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .terra-beacon-ring {
      animation: terraBeaconBreathe 2.8s var(--terra-ease-in-out) infinite;
    }
  }
</style>
