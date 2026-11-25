<script lang="ts">
  interface Props {
    code?: string
    serial?: string
    height?: number
    class?: string
  }

  let {
    code = 'TERRA-SYS-2026',
    serial = '04-0982-SYS',
    height = 24,
    class: className = ''
  }: Props = $props()

  const bars = $derived(
    Array.from(code + serial).map((char, i) => {
      const charCode = char.charCodeAt(0)
      return {
        width: (charCode % 3) + 1.2,
        opacity: i % 5 === 0 ? 0.95 : 0.75
      }
    })
  )
</script>

<div
  class="inline-flex flex-col gap-1 font-mono text-[10px] text-[var(--terra-text-muted)] select-none {className}"
>
  <svg {height} class="w-auto overflow-visible" preserveAspectRatio="none">
    <g fill="currentColor">
      {#each bars as bar, idx (idx)}
        <rect x={idx * 4.2} y="0" width={bar.width} {height} opacity={bar.opacity} />
      {/each}
    </g>
  </svg>
  <div class="flex items-center justify-between tracking-tight text-[10px] uppercase gap-2">
    <span>{code}</span>
    <span>{serial}</span>
  </div>
</div>
