<script lang="ts">
  interface Props {
    /** 当前能量格数 (支持动态绑定) */
    value?: number
    /** 总分段格数，默认 10 */
    total?: number
    /** 主标题，如 'AIC_MAIN_GRID (自动化工业主干网负荷)' */
    label?: string
    /** 底部技术遥测微标语，如 '⚡ 480V THREE-PHASE // AIC-BUS LOAD 70% // NOMINAL' */
    sublabel?: string
    /** 状态风格变体：'nominal' | 'warning' | 'danger' | 'success' | 'accent' */
    variant?: 'nominal' | 'warning' | 'danger' | 'success' | 'accent'
    /** 槽位倾斜角度 (deg)，默认 -20 (游戏内标准 -20° skew) */
    slant?: number
    /** 能量条高度，默认 '0.85rem' */
    height?: string
    /** 是否展示数值读数 '7 / 10'，默认 true */
    showValue?: boolean
    /** 是否在能量前锋格激活动态能量呼吸脉冲，默认 true */
    animated?: boolean
    /** 自定义外层 Class */
    class?: string
  }

  let {
    value = $bindable(7),
    total = 10,
    label = '',
    sublabel = '',
    variant = 'nominal',
    slant = -20,
    height = '0.85rem',
    showValue = true,
    animated = true,
    class: className = ''
  }: Props = $props()

  const safeTotal = $derived(Math.max(1, Math.floor(total)))
  const safeValue = $derived(Math.max(0, Math.min(Math.round(value), safeTotal)))

  const variantColors: Record<string, string> = {
    nominal: 'var(--terra-accent-primary)',
    accent: 'var(--terra-accent-primary)',
    warning: 'var(--terra-accent-warning)',
    danger: 'var(--terra-accent-danger)',
    success: 'var(--terra-accent-success)'
  }

  const activeColor = $derived(variantColors[variant] || 'var(--terra-accent-primary)')
</script>

<div
  class="terra-segment-bar font-mono select-none space-y-1.5 {className}"
  style="--segment-color: {activeColor}; --segment-slant: {slant}deg; --segment-height: {height};"
>
  {#if label || showValue}
    <div class="flex items-center justify-between text-[11px] tracking-wider text-[var(--terra-text-secondary)] uppercase">
      <span class="flex items-center gap-1.5 truncate font-semibold">
        <span
          class="inline-block w-1.5 h-1.5 rounded-[0.5px] transition-colors duration-200"
          style="background-color: var(--segment-color);"
          aria-hidden="true"
        ></span>
        <span class="truncate">{label}</span>
      </span>
      {#if showValue}
        <span class="font-bold tracking-tight flex-shrink-0 ml-2" style="color: var(--segment-color)">
          {safeValue} <span class="text-[10px] text-[var(--terra-text-muted)] font-normal">/ {safeTotal}</span>
        </span>
      {/if}
    </div>
  {/if}

  <!-- Recessed Industrial Rail Chassis (下沉式工业金属外槽) -->
  <div
    class="terra-rail-chassis relative flex items-center px-1.5 py-1"
    role="progressbar"
    aria-valuenow={safeValue}
    aria-valuemin={0}
    aria-valuemax={safeTotal}
    aria-label={label || 'AIC Industrial Energy Bus'}
  >
    <!-- Left Tactical End-Stop Bracket (防滑铆接端头挡板) -->
    <div class="terra-end-stop terra-end-stop-left" aria-hidden="true"></div>

    <!-- Slanted Segment Track Container (-20° parallel slashes) -->
    <div class="terra-track-container flex items-center gap-[3px] flex-1 h-full mx-1">
      {#each Array(safeTotal) as _, i}
        {@const isActive = i < safeValue}
        {@const isHead = i === safeValue - 1}
        <div
          class="terra-segment flex-1 transition-all duration-150 rounded-[0.5px]"
          class:terra-segment-active={isActive}
          class:terra-segment-inactive={!isActive}
          class:terra-energy-head={isHead && animated}
          aria-hidden="true"
        >
          {#if isHead && animated}
            <!-- Leading Edge Pulse Spark Line (white hot tip on leading edge) -->
            <span class="terra-energy-spark"></span>
            <!-- GPU-Compositor Breathing Overlay -->
            <span class="terra-energy-pulse-layer"></span>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Right Tactical End-Stop Bracket -->
    <div class="terra-end-stop terra-end-stop-right" aria-hidden="true"></div>
  </div>

  {#if sublabel}
    <div class="flex items-center justify-between text-[9px] tracking-wider text-[var(--terra-text-muted)] uppercase">
      <span class="truncate">{sublabel}</span>
      <span class="flex-shrink-0 font-semibold opacity-70 ml-2" style="color: var(--segment-color)">
        {Math.round((safeValue / safeTotal) * 100)}%
      </span>
    </div>
  {/if}
</div>

<style>
  .terra-rail-chassis {
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid var(--terra-border);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.65), 0 1px 1px rgba(0, 0, 0, 0.2);
    min-height: calc(var(--segment-height) + 8px);
    border-radius: 1px;
  }

  :global([data-mode="light"]) .terra-rail-chassis {
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid var(--terra-border);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(255, 255, 255, 0.6);
  }

  /* Tactical End-Stop Brackets */
  .terra-end-stop {
    width: 2.5px;
    height: var(--segment-height);
    background: var(--terra-border-strong);
    opacity: 0.7;
    flex-shrink: 0;
  }

  .terra-end-stop-left {
    border-radius: 1px 0 0 1px;
  }

  .terra-end-stop-right {
    border-radius: 0 1px 1px 0;
  }

  /* Slanted Segment Base */
  .terra-segment {
    height: var(--segment-height);
    transform: skewX(var(--segment-slant));
    position: relative;
    overflow: hidden;
  }

  /* Inactive Physical Slot */
  .terra-segment-inactive {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
    opacity: 0.45;
  }

  :global([data-mode="light"]) .terra-segment-inactive {
    background: rgba(15, 23, 42, 0.06);
    border: 1px solid rgba(15, 23, 42, 0.14);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
    opacity: 0.55;
  }

  /* Active Segment */
  .terra-segment-active {
    background-color: var(--segment-color);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
  }

  :global([data-mode="light"]) .terra-segment-active {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  /* Leading Edge Pulse & Spark */
  .terra-energy-head {
    filter: brightness(1.15);
  }

  .terra-energy-pulse-layer {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 20%, rgba(255, 255, 255, 0.45) 100%);
    animation: terra-leading-breathe 1.2s ease-in-out infinite alternate;
    pointer-events: none;
  }

  .terra-energy-spark {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 2px;
    background: #ffffff;
    box-shadow: 0 0 4px #ffffff, 0 0 6px var(--segment-color);
    opacity: 0.95;
    animation: terra-leading-spark 0.6s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 2;
  }

  @keyframes terra-leading-breathe {
    0% {
      opacity: 0.2;
      transform: scaleX(0.85);
    }
    100% {
      opacity: 0.75;
      transform: scaleX(1);
    }
  }

  @keyframes terra-leading-spark {
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
</style>
