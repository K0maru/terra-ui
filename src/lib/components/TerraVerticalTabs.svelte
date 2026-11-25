<script lang="ts" module>
  export interface TerraTabItem {
    key: string
    label: string
    shortCode?: string
    badge?: string
    disabled?: boolean
    tooltip?: string
  }
</script>

<script lang="ts">
  interface Props {
    items: TerraTabItem[]
    selectedKey?: string
    itemHeight?: string
    itemGap?: string
    onchange?: (key: string) => void
    class?: string
  }

  let {
    items = [],
    selectedKey = $bindable(items[0]?.key ?? ''),
    itemHeight = '2.5rem',
    itemGap = '0.25rem',
    onchange,
    class: className = ''
  }: Props = $props()

  const selectedIndex = $derived(items.findIndex((item) => item.key === selectedKey))
  let prevIndex = $state(0)
  let travelDist = $state(1)

  $effect(() => {
    const cur = selectedIndex >= 0 ? selectedIndex : 0
    if (cur !== prevIndex) {
      travelDist = Math.abs(cur - prevIndex)
      prevIndex = cur
    }
  })

  const indicatorDurMs = $derived(260 + Math.round(40 * Math.sqrt(Math.max(1, travelDist))))

  function selectKey(key: string, disabled?: boolean) {
    if (disabled || key === selectedKey) return
    selectedKey = key
    onchange?.(key)
  }

  function handleKeyDown(e: KeyboardEvent, index: number) {
    let targetIndex = -1

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      for (let i = index + 1; i < items.length; i++) {
        if (!items[i].disabled) {
          targetIndex = i
          break
        }
      }
      if (targetIndex === -1) {
        for (let i = 0; i <= index; i++) {
          if (!items[i].disabled) {
            targetIndex = i
            break
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      for (let i = index - 1; i >= 0; i--) {
        if (!items[i].disabled) {
          targetIndex = i
          break
        }
      }
      if (targetIndex === -1) {
        for (let i = items.length - 1; i >= index; i--) {
          if (!items[i].disabled) {
            targetIndex = i
            break
          }
        }
      }
    } else if (e.key === 'Home') {
      e.preventDefault()
      targetIndex = items.findIndex((item) => !item.disabled)
    } else if (e.key === 'End') {
      e.preventDefault()
      for (let i = items.length - 1; i >= 0; i--) {
        if (!items[i].disabled) {
          targetIndex = i
          break
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectKey(items[index].key, items[index].disabled)
      return
    }

    if (targetIndex !== -1 && targetIndex !== index) {
      selectKey(items[targetIndex].key, items[targetIndex].disabled)
      document.getElementById(`terra-tab-${items[targetIndex].key}`)?.focus()
    }
  }
</script>

<div
  role="tablist"
  aria-orientation="vertical"
  class="isolate relative flex flex-col p-1 select-none bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] {className}"
  style="--item-h: {itemHeight}; --item-g: {itemGap}; gap: {itemGap};"
>
  {#if selectedIndex >= 0}
    <div
      class="terra-vtabs-indicator absolute left-1 right-1 z-0 pointer-events-none bg-[var(--terra-bg-surface-hover)] border border-[var(--terra-border-strong)]"
      style="
        height: var(--item-h);
        transform: translate3d(0, calc({selectedIndex} * (var(--item-h) + var(--item-g))), 0);
        --tab-dur: {indicatorDurMs}ms;
      "
      aria-hidden="true"
    >
      <span class="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--terra-accent-primary)]"></span>
    </div>
  {/if}

  {#each items as item, index (item.key)}
    {@const isSelected = item.key === selectedKey}
    <button
      type="button"
      id="terra-tab-{item.key}"
      role="tab"
      aria-selected={isSelected}
      tabindex={isSelected ? 0 : -1}
      disabled={item.disabled}
      title={item.tooltip || item.label}
      onclick={() => selectKey(item.key, item.disabled)}
      onkeydown={(e) => handleKeyDown(e, index)}
      class="terra-t-color relative z-[1] flex items-center justify-between px-3 w-full font-mono text-xs cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--terra-accent-primary)] {isSelected
        ? ''
        : 'hover:bg-[var(--terra-bg-surface-hover)]/60'}"
      style="height: var(--item-h);"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        {#if item.shortCode}
          <span
            class="terra-t-color px-1.5 py-0.5 text-[10px] font-semibold tracking-wider border {isSelected
              ? 'border-[var(--terra-accent-primary)] text-[var(--terra-accent-primary)] bg-[var(--terra-accent-primary-dim)]'
              : 'border-[var(--terra-border)] text-[var(--terra-text-muted)]'}"
          >
            {item.shortCode}
          </span>
        {/if}

        <span
          class="terra-t-color font-sans font-semibold tracking-tight truncate text-xs {isSelected
            ? 'text-[var(--terra-text-primary)]'
            : 'text-[var(--terra-text-secondary)]'}"
        >
          {item.label}
        </span>
      </div>

      {#if item.badge}
        <span
          class="terra-t-color ml-2 px-1.5 py-0.5 border text-[10px] font-medium tracking-wider uppercase {isSelected
            ? 'text-[var(--terra-accent-primary)] border-[var(--terra-accent-primary)]'
            : 'text-[var(--terra-text-muted)] border-[var(--terra-border)]'}"
        >
          {item.badge}
        </span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .terra-vtabs-indicator {
    top: 0.25rem;
    will-change: transform;
    transition: transform var(--tab-dur, var(--terra-dur-base)) var(--terra-spring-snappy);
  }
</style>
