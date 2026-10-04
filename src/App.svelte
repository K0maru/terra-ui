<script lang="ts">
  import { onMount } from 'svelte'
  import TerraButton from './components/TerraButton.svelte'
  import TerraPanel from './components/TerraPanel.svelte'
  import TerraBadge from './components/TerraBadge.svelte'
  import TerraStatusBeacon from './components/TerraStatusBeacon.svelte'
  import TerraBarcode from './components/TerraBarcode.svelte'
  import TerraRollingNumber from './components/TerraRollingNumber.svelte'
  import TerraInput from './components/TerraInput.svelte'
  import TerraSegmentBar from './components/TerraSegmentBar.svelte'

  // Themes: 'prts' | 'dijiang' | 'wuling'
  let currentTheme = $state<'prts' | 'dijiang' | 'wuling'>('dijiang')
  let dotMatrixEnabled = $state(true)
  let cutSize = $state(10)
  let customLabel = $state('AIC_SYSTEM_NORMAL')

  // Live telemetry simulation
  let metricEfficiency = $state(99.14)
  let metricLatency = $state(1.2)
  let metricThroughput = $state(9240)
  let energyBusValue = $state(8)
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

    // Set default initial theme
    document.documentElement.setAttribute('data-theme', currentTheme)

    return () => cancelAnimationFrame(handle)
  })

  // Theme switcher handler
  function switchTheme(theme: 'prts' | 'dijiang' | 'wuling') {
    currentTheme = theme
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Update dynamic cut size
  $effect(() => {
    document.documentElement.style.setProperty('--terra-cut-size', `${cutSize}px`)
  })

  function cycleMetrics() {
    metricEfficiency = +(94 + Math.random() * 5.9).toFixed(2)
    metricLatency = +(0.6 + Math.random() * 1.8).toFixed(1)
    metricThroughput = Math.floor(7500 + Math.random() * 4000)
    energyBusValue = Math.floor(4 + Math.random() * 7)
  }
</script>

<!-- Breathing GPU Dot Matrix Background -->
{#if dotMatrixEnabled}
  <div class="terra-dot-matrix"></div>
  <div class="terra-dot-matrix-secondary"></div>
{/if}

<main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
  
  <!-- ======================================================================
       1. TOP COMMAND BAR // CONTROL HUB
       ====================================================================== -->
  <header class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[var(--terra-border)]">
    <div class="flex items-center gap-3">
      <div class="w-3 h-8 bg-[var(--terra-accent-primary)] terra-cut-tr"></div>
      <div>
        <h1 class="font-mono font-bold tracking-widest text-base sm:text-lg uppercase text-[var(--terra-text-primary)] flex items-center gap-2">
          <span>TERRA // OPERATOR HUD</span>
          <span class="text-[10px] px-1.5 py-0.5 bg-[var(--terra-accent-primary-dim)] text-[var(--terra-accent-primary)] border border-[var(--terra-border-strong)]">v0.2.0</span>
        </h1>
        <p class="font-mono text-[11px] text-[var(--terra-text-muted)] tracking-wider">
          ZERO-VDOM // SVELTE 5 // TALOS-II EXPEDITION // GPU COMPOSITOR
        </p>
      </div>
    </div>

    <!-- Theme Hot-Switching Tabs -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center p-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr shadow-lg">
        <button
          type="button"
          onclick={() => switchTheme('dijiang')}
          class="px-3 py-1 text-xs font-mono font-bold transition-all {currentTheme === 'dijiang' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          终末地 · 帝江号/谷地
        </button>
        <button
          type="button"
          onclick={() => switchTheme('wuling')}
          class="px-3 py-1 text-xs font-mono font-bold transition-all {currentTheme === 'wuling' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          终末地 · 武陵枢纽
        </button>
        <button
          type="button"
          onclick={() => switchTheme('prts')}
          class="px-3 py-1 text-xs font-mono font-bold transition-all {currentTheme === 'prts' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          方舟 · PRTS战术
        </button>
      </div>

      <!-- Real-time Performance Indicator -->
      <div class="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] font-mono text-[11px] terra-cut-tr">
        <TerraStatusBeacon status="online" label="CORE_LINK" />
        <span class="text-[var(--terra-text-muted)]">|</span>
        <span class="text-[var(--terra-text-secondary)]">FPS: <strong class="text-[var(--terra-accent-primary)]">{fps}</strong></span>
      </div>
    </div>
  </header>

  <!-- ======================================================================
       2. HERO // GAME-ALIGNED HARDWARE TYPOGRAPHY
       ====================================================================== -->
  <section class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2 font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest uppercase">
          {#if currentTheme === 'dijiang'}
            <span>// ENDFIELD_INDUSTRIES // LANDSHIP_DIJIANG</span>
            <span>•</span>
            <span>VALLEY_IV_OPERATIONAL</span>
          {:else if currentTheme === 'wuling'}
            <span>// WULING_HUB // EASTERN_INDUSTRIAL_DISTRICT</span>
            <span>•</span>
            <span>JADE_ENERGY_MATRIX</span>
          {:else}
            <span>// RHODES_ISLAND // PRTS_TACTICAL_TERMINAL</span>
            <span>•</span>
            <span>DOCTOR_AUTHENTICATED</span>
          {/if}
        </div>
        <h2 class="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase leading-none text-[var(--terra-text-primary)]">
          {#if currentTheme === 'dijiang'}
            ENDFIELD // DIJIANG
          {:else if currentTheme === 'wuling'}
            WULING // CITADEL
          {:else}
            RHODES // TACTICAL
          {/if}
        </h2>
      </div>

      <div class="flex flex-col items-start md:items-end gap-2">
        <TerraBarcode code={currentTheme === 'wuling' ? 'WL-HUB-2026' : 'ENDFIELD-04'} serial="TALOS-II-SYS" height={28} />
        <div class="flex gap-2">
          <TerraBadge label="ZERO-VDOM" code="SVELTE5" variant="primary" />
          <TerraBadge label="GPU COMPOSITED" code="120FPS" variant="outline" />
        </div>
      </div>
    </div>
    <p class="max-w-3xl text-sm sm:text-base text-[var(--terra-text-secondary)] leading-relaxed font-sans">
      深度复刻《明日方舟：终末地》与《明日方舟》游戏内硬核工业与战术美学。支持**帝江号/四号谷地重工**（冷轧炭灰底 + 高电压荧光黄 + AIC电网青蓝）与**武陵枢纽**（苍山冷砚黑 + 碧玉翡翠高能翠光 + 汉白金砂）以及经典 PRTS 战术暗黑主题。
    </p>
  </section>

  <!-- ======================================================================
       3. ATOMIC PRIMITIVES SHOWCASE
       ====================================================================== -->
  <section class="space-y-6">
    <div class="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--terra-text-primary)]">
      <span class="w-1.5 h-3 bg-[var(--terra-accent-primary)]"></span>
      <span>01 // ATOMIC OPERATOR PRIMITIVES (基础战术组件)</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Button Showcase -->
      <TerraPanel title="TACTICAL BUTTONS" tag="// ACTUATORS" cut="tr" bracket={true}>
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <TerraButton variant="primary" cut="tr-bl">EXECUTE COMMAND</TerraButton>
            <TerraButton variant="outline" cut="tl-br">OVERRIDE LINK</TerraButton>
            <TerraButton variant="ghost" cut="none">STANDBY</TerraButton>
            <TerraButton variant="danger" cut="tr">PURGE CORROSION</TerraButton>
          </div>

          <div class="pt-3 border-t border-[var(--terra-border)] flex flex-wrap items-center gap-3">
            <TerraButton size="sm" variant="primary">SUB-ROUTINE</TerraButton>
            <TerraButton size="md" variant="primary">NORMAL DISPATCH</TerraButton>
            <TerraButton size="lg" variant="primary">PRIMARY VECTOR</TerraButton>
            <TerraButton size="sm" variant="outline" disabled>LOCKED</TerraButton>
          </div>
          <p class="font-mono text-[10px] text-[var(--terra-text-muted)]">
            * 搭载纯 GPU 硬件流光扫描（Shimmer），点击微反馈缩放，绝无 JS 主线程卡顿。
          </p>
        </div>
      </TerraPanel>

      <!-- Badge, Beacons & Segment Bar -->
      <TerraPanel title="STATUS MATRIX & ENERGY BUS" tag="// AIC.TELEMETRY" cut="tr" bracket={true}>
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <TerraBadge label="AUTHORIZED" code="ADM" variant="primary" />
            <TerraBadge label="HIGH_VOLTAGE" code="AIC" variant="warning" />
            <TerraBadge label="CORROSION" code="CRIT" variant="danger" />
            <TerraBadge label="SYNCHRONIZED" code="OK" variant="success" />
            <TerraBadge label="PROTOCOL_V2" code="SYS" variant="outline" />
          </div>

          <!-- In-game Segment Energy Bus -->
          <div class="pt-3 border-t border-[var(--terra-border)] space-y-3">
            <TerraSegmentBar value={energyBusValue} total={10} label="AIC_GRID_CAPACITY (工业电网负荷)" />
            <TerraSegmentBar value={9} total={12} label="TACTICAL_BURST_CELL (战术技力储备)" />
          </div>

          <div class="pt-3 border-t border-[var(--terra-border)] grid grid-cols-2 sm:grid-cols-4 gap-3">
            <TerraStatusBeacon status="online" label="NOMINAL" />
            <TerraStatusBeacon status="standby" label="IDLE" />
            <TerraStatusBeacon status="alert" label="ALERT" />
            <TerraStatusBeacon status="offline" label="OFFLINE" pulse={false} />
          </div>

          <div class="pt-3 border-t border-[var(--terra-border)]">
            <TerraInput bind:value={customLabel} placeholder="INPUT PROTOCOL STRING..." prefix="AIC//>" />
          </div>
        </div>
      </TerraPanel>
    </div>
  </section>

  <!-- ======================================================================
       4. INDUSTRIAL DATA PANELS & ROLLING NUMBERS
       ====================================================================== -->
  <section class="space-y-6">
    <div class="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--terra-text-primary)]">
      <span class="w-1.5 h-3 bg-[var(--terra-accent-primary)]"></span>
      <span>02 // HIGH-DENSITY AIC DATA PANELS (集成工业与数据流)</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Metric 1 -->
      <TerraPanel title="AIC CONVEYOR FLOW" tag="// AIC.BUS-01" cut="tr-bl" warning={true} bracket={true}>
        {#snippet actions()}
          <TerraButton size="sm" variant="outline" cut="none" onclick={cycleMetrics}>
            REFRESH
          </TerraButton>
        {/snippet}
        <div class="space-y-2">
          <div class="flex items-baseline justify-between">
            <TerraRollingNumber value={metricEfficiency} decimals={2} suffix="%" class="text-3xl sm:text-4xl text-[var(--terra-accent-primary)]" />
            <TerraBadge label="HIGH-LOAD" variant="primary" />
          </div>
          <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
            四号谷地采矿产线综合吞吐负荷率。
          </p>
        </div>
      </TerraPanel>

      <!-- Metric 2 -->
      <TerraPanel title="PROTOCOL LATENCY" tag="// AIC.PING-02" cut="tr" bracket={true}>
        <div class="space-y-2">
          <div class="flex items-baseline justify-between">
            <TerraRollingNumber value={metricLatency} decimals={1} suffix="ms" class="text-3xl sm:text-4xl text-[var(--terra-text-primary)]" />
            <TerraBadge label="NEAR_ZERO" variant="success" />
          </div>
          <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
            帝江号中枢与异星前哨站实时通讯延迟。
          </p>
        </div>
      </TerraPanel>

      <!-- Metric 3 -->
      <TerraPanel title="RESOURCE EXTRACTION" tag="// AIC.VOL-03" cut="tl-br" bracket={true}>
        <div class="space-y-2">
          <div class="flex items-baseline justify-between">
            <TerraRollingNumber value={metricThroughput} decimals={0} suffix="t/h" class="text-3xl sm:text-4xl text-[var(--terra-text-primary)]" />
            <TerraBadge label="PIPELINE" variant="outline" />
          </div>
          <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
            源石矿床与聚合物产线实时产能速率。
          </p>
        </div>
      </TerraPanel>
    </div>
  </section>

  <!-- ======================================================================
       5. INTERACTIVE GEOMETRY PLAYGROUND
       ====================================================================== -->
  <section class="space-y-6">
    <div class="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--terra-text-primary)]">
      <span class="w-1.5 h-3 bg-[var(--terra-accent-primary)]"></span>
      <span>03 // GEOMETRIC TUNING PLAYGROUND (实时切角与交互调试)</span>
    </div>

    <TerraPanel title="PARAMETRIC CALIBRATION" tag="// HUD.DEBUG" cut="all" bracket={true}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div class="space-y-5">
          <div class="space-y-2">
            <div class="flex justify-between font-mono text-xs text-[var(--terra-text-primary)]">
              <span>CHAMFER CUT RATIO (斜切角几何尺寸):</span>
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
              实时修改根级 CSS 变量 <code>--terra-cut-size</code>，所有工业斜切角容器瞬间平滑重塑。
            </p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-[var(--terra-border)]">
            <span class="font-mono text-xs text-[var(--terra-text-primary)]">GPU BREATHING DOT MATRIX (多层呼吸点阵):</span>
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
        <div class="p-6 bg-[var(--terra-bg-surface-hover)] border border-[var(--terra-border-strong)] terra-cut-tl-br terra-bracket-corner flex flex-col justify-between h-48 shadow-xl">
          <div class="flex justify-between items-start">
            <span class="font-mono text-xs text-[var(--terra-accent-primary)] font-bold">// TACTICAL_BRACKET_TARGET</span>
            <TerraBarcode code={currentTheme.toUpperCase()} serial={`${cutSize}PX-CHAMFER`} height={18} />
          </div>
          <div class="space-y-1">
            <h4 class="font-display text-2xl font-bold uppercase tracking-wider text-[var(--terra-text-primary)]">
              {customLabel || 'AIC_ACTIVE'}
            </h4>
            <p class="font-mono text-xs text-[var(--terra-text-secondary)]">
              ACTIVE THEME SPEC: <span class="uppercase font-bold text-[var(--terra-accent-primary)]">{currentTheme}</span>
            </p>
          </div>
        </div>
      </div>
    </TerraPanel>
  </section>

  <!-- ======================================================================
       FOOTER
       ====================================================================== -->
  <footer class="pt-6 border-t border-[var(--terra-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--terra-text-muted)]">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[var(--terra-accent-primary)]"></span>
      <span>TERRA-UI // TALOS-II EXPEDITION DESIGN SYSTEM</span>
    </div>
    <div class="flex items-center gap-4">
      <span>THEMES: PRTS / DIJIANG / WULING</span>
      <span>RUNTIME: ZERO-VDOM</span>
      <span>RENDER: GPU-ONLY</span>
    </div>
  </footer>

</main>
