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
    /** Tab items list */
    items: TerraTabItem[]
    /** Currently selected key, supports 2-way binding bind:selectedKey */
    selectedKey?: string
    /** Height of each item, default '2.5rem' */
    itemHeight?: string
    /** Gap between items, default '0.5rem' */
    itemGap?: string
    /** Change callback */
    onchange?: (key: string) => void
    /** Custom class name */
    class?: string
  }

  let {
    items = [],
    selectedKey = $bindable(items[0]?.key ?? ''),
    itemHeight = '2.5rem',
    itemGap = '0.5rem',
    onchange,
    class: className = ''
  }: Props = $props()

  const selectedIndex = $derived(
    items.findIndex(item => item.key === selectedKey)
  )

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
        // Wrap around
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
        // Wrap around
        for (let i = items.length - 1; i >= index; i--) {
          if (!items[i].disabled) {
            targetIndex = i
            break
          }
        }
      }
    } else if (e.key === 'Home') {
      e.preventDefault()
      targetIndex = items.findIndex(item => !item.disabled)
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
      // Focus target element
      const el = document.getElementById(`terra-tab-${items[targetIndex].key}`)
      el?.focus()
    }
  }
</script>

<div
  role="tablist"
  aria-orientation="vertical"
  class="terra-vtabs-container relative flex flex-col p-1.5 select-none bg-[var(--terra-bg-surface,#12151b)]/70 backdrop-blur-md border border-[var(--terra-border,rgba(255,240,0,0.22))] shadow-lg rounded-sm {className}"
  style="--item-h: {itemHeight}; --item-g: {itemGap}; gap: {itemGap};"
>
  <!-- Flying High-Visibility Floating Indicator -->
  {#if selectedIndex >= 0}
    <div
      class="terra-vtabs-indicator absolute left-1.5 right-1.5 z-0 pointer-events-none"
      style="
        height: var(--item-h);
        transform: translateY(calc({selectedIndex} * (var(--item-h) + var(--item-g))));
      "
      aria-hidden="true"
    >
      <!-- Leading tactical notch -->
      <span class="terra-vtabs-notch"></span>
    </div>
  {/if}

  <!-- Tab items -->
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
      class="terra-vtab-item relative z-10 flex items-center justify-between px-3.5 w-full font-mono text-xs transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[var(--terra-accent-primary,#fff000)]"
      class:terra-vtab-selected={isSelected}
      class:terra-vtab-disabled={item.disabled}
      style="height: var(--item-h);"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <!-- Sector Short Code Tag -->
        {#if item.shortCode}
          <span
            class="px-1.5 py-0.5 text-[10px] font-bold tracking-wider rounded-xs transition-colors {isSelected ? 'bg-black text-[var(--terra-accent-primary,#fff000)] shadow-xs' : 'bg-[var(--terra-bg-surface-active)] text-[var(--terra-text-primary)] border border-[var(--terra-border)]'}"
          >
            {item.shortCode}
          </span>
        {/if}

        <!-- Tab Label -->
        <span
          class="font-display font-bold uppercase tracking-wider truncate text-sm transition-colors {isSelected ? 'text-black' : 'text-[var(--terra-text-primary,#ffffff)]'}"
        >
          {item.label}
        </span>
      </div>

      <!-- Optional Status Badge -->
      {#if item.badge}
        <span
          class="ml-2 px-1.5 py-0.2 border text-[9px] font-bold tracking-widest uppercase transition-colors {isSelected ? 'text-black border-black' : 'text-[var(--terra-accent-primary,#fff000)] border-[var(--terra-border,#fff000)]'}"
        >
          {item.badge}
        </span>
      {/if}
    </button>
  {/each}
</div>

<style>
  /* Atlos Official Easing for Floating Indicator */
  .terra-vtabs-indicator {
    top: 0.375rem; /* Matches p-1.5 */
    background-color: var(--terra-accent-primary, #fff000);
    clip-path: polygon(
      0 0,
      calc(100% - 8px) 0,
      100% 8px,
      100% 100%,
      0 100%
    );
    box-shadow: 0 0 12px var(--terra-accent-primary-dim, rgba(255, 240, 0, 0.35));
    will-change: transform;
    transition: transform 0.32s cubic-bezier(0.8, 0.2, 0.35, 0.7);
  }

  .terra-vtabs-notch {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background-color: #000000;
  }

  .terra-vtab-item {
    cursor: pointer;
    background: transparent;
    border: 1px solid transparent;
  }

  .terra-vtab-item:not(.terra-vtab-selected):not(.terra-vtab-disabled):hover {
    background-color: var(--terra-bg-surface-hover, rgba(255, 255, 255, 0.05));
    border-color: var(--terra-border, rgba(255, 240, 0, 0.2));
  }

  .terra-vtab-disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
</style>
