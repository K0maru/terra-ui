<script lang="ts">
  export interface PropItem {
    name: string
    type: string
    default?: string
    description: string
    required?: boolean
  }

  interface Props {
    items: PropItem[]
    class?: string
  }

  let { items = [], class: className = '' }: Props = $props()
</script>

<div class="w-full overflow-x-auto border border-[var(--terra-border)] bg-[var(--terra-bg-surface)]/60 my-4 {className}">
  <table class="w-full text-left font-mono text-[11px] border-collapse">
    <thead>
      <tr class="border-b border-[var(--terra-border-strong)] bg-[var(--terra-bg-surface-hover)] text-[var(--terra-text-muted)] tracking-wider">
        <th class="py-2.5 px-3 uppercase text-[10px] font-bold">Property</th>
        <th class="py-2.5 px-3 uppercase text-[10px] font-bold">Type</th>
        <th class="py-2.5 px-3 uppercase text-[10px] font-bold">Default</th>
        <th class="py-2.5 px-3 uppercase text-[10px] font-bold">Description</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-[var(--terra-border)]">
      {#each items as item}
        <tr class="hover:bg-[var(--terra-bg-surface-hover)]/40 transition-colors">
          <td class="py-2 px-3 whitespace-nowrap">
            <span class="font-bold text-[var(--terra-accent-primary)] font-mono">{item.name}</span>
            {#if item.required}
              <span class="ml-1 text-[9px] px-1 py-0.2 bg-[var(--terra-accent-danger)]/20 text-[var(--terra-accent-danger)] border border-[var(--terra-accent-danger)]/40 rounded-xs">REQ</span>
            {/if}
          </td>
          <td class="py-2 px-3 whitespace-nowrap">
            <span class="text-[10px] px-1.5 py-0.5 bg-[var(--terra-bg-surface-active)] text-[var(--terra-text-secondary)] border border-[var(--terra-border)] font-mono">
              {item.type}
            </span>
          </td>
          <td class="py-2 px-3 whitespace-nowrap font-mono text-[10px] text-[var(--terra-text-muted)]">
            {item.default ?? '—'}
          </td>
          <td class="py-2 px-3 text-[11px] font-sans text-[var(--terra-text-secondary)]">
            {item.description}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
