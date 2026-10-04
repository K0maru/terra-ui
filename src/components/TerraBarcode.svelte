<script lang="ts">
  interface Props {
    code?: string
    serial?: string
    height?: number
    class?: string
  }

  let {
    code = 'TERRA-SYS-2026',
    serial = '04-0982-AIC',
    height = 24,
    class: className = ''
  }: Props = $props()

  // Generate stylized barcode bars deterministically from string
  const bars = $derived(
    Array.from(code + serial).map((char, i) => {
      const charCode = char.charCodeAt(0)
      return {
        width: (charCode % 3) + 1.2,
        space: (charCode % 2) + 1.5,
        opacity: (i % 5 === 0) ? 0.95 : 0.75
      }
    })
  )
</script>

<div class="inline-flex flex-col gap-1 font-mono text-[9px] text-[var(--terra-text-muted)] select-none {className}">
  <svg height={height} class="w-auto overflow-visible" preserveAspectRatio="none">
    <g fill="currentColor">
      {#each bars as bar, idx}
        <rect
          x={idx * 4.2}
          y="0"
          width={bar.width}
          height={height}
          opacity={bar.opacity}
        />
      {/each}
    </g>
  </svg>
  <div class="flex items-center justify-between tracking-tighter text-[8px] uppercase">
    <span>{code}</span>
    <span>{serial}</span>
  </div>
</div>
