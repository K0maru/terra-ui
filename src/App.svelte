<script lang="ts">
  import { onMount } from 'svelte'
  import TerraButton from './components/TerraButton.svelte'
  import TerraPanel from './components/TerraPanel.svelte'
  import TerraBadge from './components/TerraBadge.svelte'
  import TerraStatusBeacon from './components/TerraStatusBeacon.svelte'
  import TerraBarcode from './components/TerraBarcode.svelte'
  import TerraRollingNumber from './components/TerraRollingNumber.svelte'
  import TerraInput from './components/TerraInput.svelte'

  // Themes: 'prts' | 'endfield' | 'rhine'
  let currentTheme = $state<'prts' | 'endfield' | 'rhine'>('prts')
  let dotMatrixEnabled = $state(true)
  let cutSize = $state(10)
  let customLabel = $state('OPERATIONAL_READY')

  // Live telemetry simulation for Rolling Numbers
  let metricEfficiency = $state(98.42)
  let metricLatency = $state(1.4)
  let metricThroughput = $state(8420)
  let fps = $state(120)

  // Real FPS meter
  onMount(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let handle: number

    function updateFps(now: number) {
      frameCount++
      if (now - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastTime))
        frameCount = 0
        lastTime = now
      }
      handle = requestAnimationFrame(updateFps)
    }
    handle = requestAnimationFrame(updateFps)

    return () => cancelAnimationFrame(handle)
  })

  // Theme switcher handler
  function switchTheme(theme: 'prts' | 'endfield' | 'rhine') {
    currentTheme = theme
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Update dynamic cut size
  $effect(() => {
    document.documentElement.style.setProperty('--terra-cut-size', `${cutSize}px`)
  })

  function cycleMetrics() {
    metricEfficiency = +(90 + Math.random() * 9.9).toFixed(2)
    metricLatency = +(0.8 + Math.random() * 2.5).toFixed(1)
    metricThroughput = Math.floor(6000 + Math.random() * 5000)
  }
</script>

<!-- Breathing GPU Dot Matrix Background (From ignoredone.space reverse-engineering) -->
{#if dotMatrixEnabled}
  <div class="terra-dot-matrix"></div>
  <div class="terra-dot-matrix-secondary"></div>
{/if}

<main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
  
  <!-- ======================================================================
       1. TOP COMMAND BAR // CONTROL HUB
       ====================================================================== -->
  <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--terra-border)]">
    <div class="flex items-center gap-3">
      <div class="w-2.5 h-7 bg-[var(--terra-accent-primary)] terra-cut-tr"></div>
      <div>
        <h1 class="font-mono font-bold tracking-widest text-base sm:text-lg uppercase text-[var(--terra-text-primary)] flex items-center gap-2">
          <span>TERRA // OPERATOR UI</span>
          <span class="text-[10px] px-1.5 py-0.5 bg-[var(--terra-accent-primary-dim)] text-[var(--terra-text-primary)] border border-[var(--terra-border-strong)]">v0.1.0</span>
        </h1>
        <p class="font-mono text-[11px] text-[var(--terra-text-muted)] tracking-wider">
          ZERO-VDOM // SVELTE 5 RUNES // GPU COMPOSITOR ENGINE
        </p>
      </div>
    </div>

    <!-- Theme Hot-Switching Tabs -->
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center p-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr">
        <button
          type="button"
          onclick={() => switchTheme('prts')}
          class="px-2.5 py-1 text-xs font-mono font-semibold transition-all {currentTheme === 'prts' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          PRTS (DARK)
        </button>
        <button
          type="button"
          onclick={() => switchTheme('endfield')}
          class="px-2.5 py-1 text-xs font-mono font-semibold transition-all {currentTheme === 'endfield' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          ENDFIELD (LIGHT)
        </button>
        <button
          type="button"
          onclick={() => switchTheme('rhine')}
          class="px-2.5 py-1 text-xs font-mono font-semibold transition-all {currentTheme === 'rhine' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          RHINE LAB (WARM)
        </button>
      </div>

      <!-- Real-time Performance Indicator -->
      <div class="hidden md:flex items-center gap-3 px-3 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] font-mono text-[11px]">
        <TerraStatusBeacon status="online" label="ACTIVE" />
        <span class="text-[var(--terra-text-muted)]">|</span>
        <span class="text-[var(--terra-text-secondary)]">FPS: <strong class="text-[var(--terra-text-primary)]">{fps}</strong></span>
      </div>
    </div>
  </header>

  <!-- ======================================================================
       2. HERO // SWISS STYLE TYPOGRAPHIC LANDMARK
       ====================================================================== -->
  <section class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2 font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest uppercase">
          <span>// SPECIFICATION_DISPATCH</span>
          <span>•</span>
          <span>HIGH-EFFICIENCY DESIGN SYSTEM</span>
        </div>
        <h2 class="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-none text-[var(--terra-text-primary)]">
          PURE HARDWARE<br/>AESTHETICS
        </h2>
      </div>

      <div class="flex flex-col items-start md:items-end gap-2">
        <TerraBarcode code="TERRA-SPEC-01" serial="AIC-ENG-2026" height={28} />
        <div class="flex gap-2">
          <TerraBadge label="ZERO RUNTIME VDOM" code="L0" variant="primary" />
          <TerraBadge label="GPU COMPOSITED" code="L1" variant="outline" />
        </div>
      </div>
    </div>
    <p class="max-w-3xl text-sm sm:text-base text-[var(--terra-text-secondary)] leading-relaxed font-sans">
      专为明日方舟与终末地极客项目提炼的高性能纯粹设计系统。不依赖重型框架虚拟 DOM 递归，所有切角几何、多层呼吸点阵与流光交互均运行于 GPU 硬件合成层，确保 120fps 极限流畅度与毫秒级首屏加载。
    </p>
  </section>

  <!-- ======================================================================
       3. ATOMIC PRIMITIVES SHOWCASE (BUTTONS, BADGES, BEACONS, INPUTS)
       ====================================================================== -->
  <section class="space-y-6">
    <div class="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--terra-text-primary)]">
      <span class="w-1.5 h-3 bg-[var(--terra-accent-primary)]"></span>
      <span>01 // ATOMIC PRIMITIVES (基础原子组件)</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Button Showcase -->
      <TerraPanel title="BUTTON SYSTEM" tag="// COMP-01" cut="tr">
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <TerraButton variant="primary" cut="tr-bl">PRIMARY BUTTON</TerraButton>
            <TerraButton variant="outline" cut="tl-br">OUTLINE BUTTON</TerraButton>
            <TerraButton variant="ghost" cut="none">GHOST ACTION</TerraButton>
            <TerraButton variant="danger" cut="tr">ALERT ACTION</TerraButton>
          </div>

          <div class="pt-3 border-t border-[var(--terra-border)] flex flex-wrap items-center gap-3">
            <TerraButton size="sm" variant="primary">SMALL</TerraButton>
            <TerraButton size="md" variant="primary">MEDIUM</TerraButton>
            <TerraButton size="lg" variant="primary">LARGE</TerraButton>
            <TerraButton size="sm" variant="outline" disabled>DISABLED</TerraButton>
          </div>
          <p class="font-mono text-[10px] text-[var(--terra-text-muted)]">
            * 悬浮带有 GPU 级液体光泽扫过（Shimmer），点击微幅缩放 0.98，无额外 JS 动画开销。
          </p>
        </div>
      </TerraPanel>

      <!-- Badge & Beacon Showcase -->
      <TerraPanel title="BADGES & STATUS BEACONS" tag="// COMP-02" cut="tr">
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <TerraBadge label="ONLINE" code="SYS" variant="primary" />
            <TerraBadge label="WARNING" code="WRN" variant="warning" />
            <TerraBadge label="CRITICAL" code="ERR" variant="danger" />
            <TerraBadge label="RESOLVED" code="OK" variant="success" />
            <TerraBadge label="PROTOCOL" code="REF" variant="outline" />
          </div>

          <div class="pt-3 border-t border-[var(--terra-border)] grid grid-cols-2 sm:grid-cols-4 gap-3">
            <TerraStatusBeacon status="online" label="STABLE" />
            <TerraStatusBeacon status="standby" label="STANDBY" />
            <TerraStatusBeacon status="alert" label="ALERT" />
            <TerraStatusBeacon status="offline" label="OFFLINE" pulse={false} />
          </div>

          <div class="pt-3 border-t border-[var(--terra-border)]">
            <TerraInput bind:value={customLabel} placeholder="TEST TERMINAL INPUT..." prefix="CMD>" />
          </div>
        </div>
      </TerraPanel>
    </div>
  </section>

  <!-- ======================================================================
       4. INDUSTRIAL DATA PANELS & ROLLING NUMBERS (TELEMETRY)
       ====================================================================== -->
  <section class="space-y-6">
    <div class="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--terra-text-primary)]">
      <span class="w-1.5 h-3 bg-[var(--terra-accent-primary)]"></span>
      <span>02 // HIGH-DENSITY TELEMETRY & ROLLING NUMBERS (数据与仪表面板)</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Rolling Number Metric 1 -->
      <TerraPanel title="SYSTEM EFFICIENCY" tag="// METRIC.01" cut="tr-bl" warning={true}>
        {#snippet actions()}
          <TerraButton size="sm" variant="outline" cut="none" onclick={cycleMetrics}>
            REFRESH
          </TerraButton>
        {/snippet}
        <div class="space-y-2">
          <div class="flex items-baseline justify-between">
            <TerraRollingNumber value={metricEfficiency} decimals={2} suffix="%" class="text-3xl sm:text-4xl text-[var(--terra-accent-primary)]" />
            <TerraBadge label="NOMINAL" variant="success" />
          </div>
          <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
            平滑弹簧插值滚动计数器，无外部沉重类库依赖。
          </p>
        </div>
      </TerraPanel>

      <!-- Rolling Number Metric 2 -->
      <TerraPanel title="EXECUTION LATENCY" tag="// METRIC.02" cut="tr">
        <div class="space-y-2">
          <div class="flex items-baseline justify-between">
            <TerraRollingNumber value={metricLatency} decimals={1} suffix="ms" class="text-3xl sm:text-4xl text-[var(--terra-text-primary)]" />
            <TerraBadge label="ULTRA-FAST" variant="primary" />
          </div>
          <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
            GPU 合成层排队延迟保持在毫秒级，规避主线程卡顿。
          </p>
        </div>
      </TerraPanel>

      <!-- Rolling Number Metric 3 -->
      <TerraPanel title="DATA THROUGHPUT" tag="// METRIC.03" cut="tl-br">
        <div class="space-y-2">
          <div class="flex items-baseline justify-between">
            <TerraRollingNumber value={metricThroughput} decimals={0} suffix="req/s" class="text-3xl sm:text-4xl text-[var(--terra-text-primary)]" />
            <TerraBadge label="STREAMING" variant="outline" />
          </div>
          <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
            支持无感知平滑递增，契合工业监控与数据流。
          </p>
        </div>
      </TerraPanel>
    </div>
  </section>

  <!-- ======================================================================
       5. INTERACTIVE GEOMETRY PLAYGROUND (实时参数调节台)
       ====================================================================== -->
  <section class="space-y-6">
    <div class="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--terra-text-primary)]">
      <span class="w-1.5 h-3 bg-[var(--terra-accent-primary)]"></span>
      <span>03 // GEOMETRIC TUNING PLAYGROUND (几何与背景微调台)</span>
    </div>

    <TerraPanel title="PARAMETRIC CALIBRATION" tag="// LAB.01" cut="all">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div class="space-y-5">
          <div class="space-y-2">
            <div class="flex justify-between font-mono text-xs text-[var(--terra-text-primary)]">
              <span>CHAMFER CUT SIZE (切角几何比率):</span>
              <strong class="text-[var(--terra-accent-primary)]">{cutSize}px</strong>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              bind:value={cutSize}
              class="w-full h-1.5 bg-[var(--terra-border)] appearance-none cursor-pointer accent-[var(--terra-accent-primary)]"
            />
            <p class="font-mono text-[10px] text-[var(--terra-text-muted)]">
              实时修改全局 CSS 变量 <code>--terra-cut-size</code>，所有带切角属性的组件无缝形变。
            </p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-[var(--terra-border)]">
            <span class="font-mono text-xs text-[var(--terra-text-primary)]">BREATHING DOT MATRIX (背景呼吸点阵):</span>
            <TerraButton
              size="sm"
              variant={dotMatrixEnabled ? 'primary' : 'outline'}
              onclick={() => dotMatrixEnabled = !dotMatrixEnabled}
            >
              {dotMatrixEnabled ? 'ENABLED' : 'DISABLED'}
            </TerraButton>
          </div>
        </div>

        <!-- Live Morphing Preview Box -->
        <div class="p-6 bg-[var(--terra-bg-surface-hover)] border border-[var(--terra-border-strong)] terra-cut-tl-br terra-reticle-corner flex flex-col justify-between h-48">
          <div class="flex justify-between items-start">
            <span class="font-mono text-xs text-[var(--terra-accent-primary)] font-bold">// REAL-TIME MORPH TARGET</span>
            <TerraBarcode code="MORPH-TEST" serial={`${cutSize}PX-CUT`} height={18} />
          </div>
          <div class="space-y-1">
            <h4 class="font-display text-2xl font-bold uppercase tracking-wider text-[var(--terra-text-primary)]">
              {customLabel || 'DYNAMIC SPEC'}
            </h4>
            <p class="font-mono text-xs text-[var(--terra-text-secondary)]">
              CURRENT THEME: <span class="uppercase font-bold text-[var(--terra-accent-primary)]">{currentTheme}</span>
            </p>
          </div>
        </div>
      </div>
    </TerraPanel>
  </section>

  <!-- ======================================================================
       FOOTER // SYSTEM METADATA
       ====================================================================== -->
  <footer class="pt-6 border-t border-[var(--terra-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--terra-text-muted)]">
    <div class="flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--terra-accent-primary)]"></span>
      <span>TERRA-UI // LIGHTWEIGHT OPERATOR DESIGN SYSTEM</span>
    </div>
    <div class="flex items-center gap-4">
      <span>PERF: ZERO-VDOM SVELTE 5</span>
      <span>GPU: COMPOSITOR-ONLY</span>
      <span>SPEC: 2026.10</span>
    </div>
  </footer>

</main>
