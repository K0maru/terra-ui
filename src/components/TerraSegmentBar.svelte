<script lang="ts">
  interface Props {
    value?: number // Current level (e.g. 7)
    total?: number // Total segments (e.g. 10)
    label?: string
    showValue?: boolean
    class?: string
  }

  let {
    value = 7,
    total = 10,
    label = 'AIC_ENERGY_BUS',
    showValue = true,
    class: className = ''
  }: Props = $props()

  const safeValue = $derived(Math.max(0, Math.min(value, total)))
</script>

<div class="space-y-1.5 font-mono text-xs select-none {className}">
  {#if label || showValue}
    <div class="flex items-center justify-between text-[10px] tracking-wider text-[var(--terra-text-secondary)] uppercase">
      <span>{label}</span>
      {#if showValue}
        <span class="text-[var(--terra-accent-primary)] font-bold">
          {safeValue} / {total}
        </span>
      {/if}
    </div>
  {/if}

  <div class="flex items-center gap-1 w-full">
    {#each Array(total) as _, i}
      <div
        class="h-2.5 flex-1 transition-all duration-200 terra-cut-tr"
        class:bg-[var(--terra-accent-primary)]={i < safeValue}
        class:shadow-[0_0_8px_var(--terra-accent-primary)]={i < safeValue}
        class:bg-[var(--terra-border)]={i >= safeValue}
        class:opacity-40={i >= safeValue}
      ></div>
    {/each}
  </div>
</div>
