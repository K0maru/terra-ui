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
  import TerraContourLines from './components/TerraContourLines.svelte'
  import TerraCurtainTransition from './components/TerraCurtainTransition.svelte'

  // Themes: 'dijiang' | 'wuling' | 'prts'
  let currentTheme = $state<'dijiang' | 'wuling' | 'prts'>('dijiang')
  // Modes: 'dark' | 'light'
  let currentMode = $state<'dark' | 'light'>('dark')
  
  // Navigation tabs for official website page-turning demo
  let activeTab = $state<'primitives' | 'telemetry' | 'spec'>('primitives')
  let curtainActive = $state(false)
  let transitionLabel = $state('ENDFIELD // LOADING PROTOCOL')

  let contourEnabled = $state(true)
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

    document.documentElement.setAttribute('data-theme', currentTheme)
    document.documentElement.setAttribute('data-mode', currentMode)

    return () => cancelAnimationFrame(handle)
  })

  // Theme switcher handler with official Endfield curtain transition
  function switchTheme(theme: 'dijiang' | 'wuling' | 'prts') {
    if (currentTheme === theme) return
    transitionLabel = theme === 'prts' ? 'RHODES_ISLAND // PRTS_REBOOT' :
                      theme === 'wuling' ? 'WULING_CITADEL // JADE_SYNC' :
                      'ENDFIELD // DIJIANG_COMMENCE'
    triggerCurtain()
    currentTheme = theme
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Light / Dark mode switcher handler
  function toggleMode() {
    transitionLabel = currentMode === 'dark' ? 'SYSTEM // LIGHT_MODE_INIT' : 'SYSTEM // DARK_MODE_INIT'
    triggerCurtain()
    currentMode = currentMode === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-mode', currentMode)
  }

  // Tab switcher with page-turning curtain
  function setTab(tab: 'primitives' | 'telemetry' | 'spec') {
    if (activeTab === tab) return
    transitionLabel = tab === 'primitives' ? 'AIC // ACTUATOR_MATRIX' :
                      tab === 'telemetry' ? 'TALOS-II // TELEMETRY_STREAM' :
                      'CALIBRATION // PARAMETRIC_LAB'
    triggerCurtain()
    activeTab = tab
  }

  function triggerCurtain() {
    curtainActive = false
    setTimeout(() => {
      curtainActive = true
    }, 10)
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

<!-- Official Endfield Industrial Curtain Wipe (Reproduced from official site) -->
<TerraCurtainTransition
  active={curtainActive}
  label={transitionLabel}
  oncomplete={() => curtainActive = false}
/>

<!-- Endfield Specific: Topographic Contour Elevation Overlay (Replaces generic global dots) -->
{#if (currentTheme === 'dijiang' || currentTheme === 'wuling') && contourEnabled}
  <TerraContourLines
    elevation={currentTheme === 'wuling' ? '+2180m' : '+1420m'}
    zone={currentTheme === 'wuling' ? 'WULING_CITADEL // SECTOR_EAST' : 'VALLEY_IV // MINING_BASIN'}
    opacity={currentMode === 'dark' ? 0.3 : 0.18}
  />
{/if}

<!-- PRTS Specific: Focused 2D Swiss Grid & Targeted Coordinates (Not cluttered everywhere) -->
{#if currentTheme === 'prts'}
  <div class="pointer-events-none fixed inset-0 z-0 opacity-15 overflow-hidden">
    <div class="w-full h-full border-r border-b border-[var(--terra-accent-primary)] grid grid-cols-6 grid-rows-6">
      {#each Array(36) as _, i}
        <div class="border-t border-l border-[var(--terra-accent-primary)] flex items-start justify-start p-1 text-[8px] font-mono text-[var(--terra-accent-primary)]">
          {#if i % 7 === 0}
            <span>[{String(i).padStart(2, '0')}]</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

<main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
  
  <!-- ======================================================================
       1. TOP COMMAND BAR // CONTROL HUB
       ====================================================================== -->
  <header class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[var(--terra-border)]">
    <div class="flex items-center gap-3">
      <div class="w-3 h-8 bg-[var(--terra-accent-primary)] terra-cut-tr shadow-md"></div>
      <div>
        <h1 class="font-mono font-bold tracking-widest text-base sm:text-lg uppercase text-[var(--terra-text-primary)] flex items-center gap-2">
          <span>TERRA // OPERATOR HUD</span>
          <span class="text-[10px] px-1.5 py-0.5 bg-[var(--terra-accent-primary-dim)] text-[var(--terra-accent-primary)] border border-[var(--terra-border-strong)]">v0.4.0</span>
        </h1>
        <p class="font-mono text-[11px] text-[var(--terra-text-muted)] tracking-wider">
          {#if currentTheme === 'prts'}
            明日方舟 // 瑞士平面战术终端 // 2D SWISS GRAPHIC
          {:else}
            终末地 // 塔卫二拓荒 // 3D TOPOGRAPHIC INDUSTRIAL
          {/if}
        </p>
      </div>
    </div>

    <!-- Theme & Mode Hot-Switching Control Group -->
    <div class="flex flex-wrap items-center gap-3">
      
      <!-- Theme Switcher -->
      <div class="flex items-center p-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr shadow-md">
        <button
          type="button"
          onclick={() => switchTheme('dijiang')}
          class="px-2.5 py-1 text-xs font-mono font-bold transition-all {currentTheme === 'dijiang' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          终末地·帝江号
        </button>
        <button
          type="button"
          onclick={() => switchTheme('wuling')}
          class="px-2.5 py-1 text-xs font-mono font-bold transition-all {currentTheme === 'wuling' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          终末地·武陵
        </button>
        <button
          type="button"
          onclick={() => switchTheme('prts')}
          class="px-2.5 py-1 text-xs font-mono font-bold transition-all {currentTheme === 'prts' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          方舟·PRTS (平面)
        </button>
      </div>

      <!-- Dark / Light Mode Toggle -->
      <button
        type="button"
        onclick={toggleMode}
        class="flex items-center gap-2 px-3 py-1.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] font-mono text-xs font-bold text-[var(--terra-text-primary)] hover:border-[var(--terra-border-accent)] terra-cut-tr shadow-sm transition-all active:scale-95"
      >
        {#if currentMode === 'dark'}
          <span>🌙 DARK MODE</span>
        {:else}
          <span>☀️ LIGHT MODE</span>
        {/if}
      </button>

      <!-- Real-time Performance Indicator -->
      <div class="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] font-mono text-[11px] terra-cut-tr shadow-sm">
        <TerraStatusBeacon status="online" label="STABLE" />
        <span class="text-[var(--terra-text-muted)]">|</span>
        <span class="text-[var(--terra-text-secondary)]">FPS: <strong class="text-[var(--terra-accent-primary)]">{fps}</strong></span>
      </div>
    </div>
  </header>

  <!-- ======================================================================
       2. OFFICIAL WEBSITE STYLE TABS
       ====================================================================== -->
  <nav class="flex items-center gap-2 border-b border-[var(--terra-border)] pb-2 overflow-x-auto select-none">
    <button
      type="button"
      onclick={() => setTab('primitives')}
      class="px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all relative border-b-2 {activeTab === 'primitives' ? 'border-[var(--terra-accent-primary)] text-[var(--terra-accent-primary)] bg-[var(--terra-accent-primary-dim)]' : 'border-transparent text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
    >
      01 // TACTICAL PRIMITIVES (基础战术原子)
    </button>
    <button
      type="button"
      onclick={() => setTab('telemetry')}
      class="px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all relative border-b-2 {activeTab === 'telemetry' ? 'border-[var(--terra-accent-primary)] text-[var(--terra-accent-primary)] bg-[var(--terra-accent-primary-dim)]' : 'border-transparent text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
    >
      02 // AIC TELEMETRY & CONTOURS (工业遥测与等高线)
    </button>
    <button
      type="button"
      onclick={() => setTab('spec')}
      class="px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all relative border-b-2 {activeTab === 'spec' ? 'border-[var(--terra-accent-primary)] text-[var(--terra-accent-primary)] bg-[var(--terra-accent-primary-dim)]' : 'border-transparent text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
    >
      03 // PARAMETRIC PLAYGROUND (参数调节与几何)
    </button>
  </nav>

  <!-- ======================================================================
       3. HERO // DISCIPLINED TYPOGRAPHY
       ====================================================================== -->
  <section class="space-y-3">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2 font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest uppercase">
          {#if currentTheme === 'dijiang'}
            <span>// ENDFIELD_INDUSTRIES // LANDSHIP_DIJIANG</span>
            <span>•</span>
            <span>TOPOGRAPHIC_VALLEY_IV</span>
          {:else if currentTheme === 'wuling'}
            <span>// WULING_HUB // EASTERN_INDUSTRIAL_DISTRICT</span>
            <span>•</span>
            <span>JADE_ELEVATION_SURVEY</span>
          {:else}
            <span>// RHODES_ISLAND // PRTS_TACTICAL_TERMINAL</span>
            <span>•</span>
            <span>SWISS_STYLE_EDITORIAL</span>
          {/if}
          <span>•</span>
          <span class="font-bold">[{currentMode.toUpperCase()}]</span>
        </div>
        
        <h2 class="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-none text-[var(--terra-text-primary)]">
          {#if currentTheme === 'dijiang'}
            ENDFIELD // DIJIANG
          {:else if currentTheme === 'wuling'}
            WULING // CITADEL
          {:else}
            RHODES // SWISS 2D
          {/if}
        </h2>
      </div>

      <div class="flex flex-col items-start md:items-end gap-2">
        <TerraBarcode code={currentTheme === 'wuling' ? 'WL-HUB-2026' : currentTheme === 'prts' ? 'RHODES-PRTS' : 'ENDFIELD-04'} serial={`${currentMode.toUpperCase()}-SYS`} height={28} />
        <div class="flex gap-2">
          {#if currentTheme === 'prts'}
            <TerraBadge label="2D FLAT SWISS" code="GRID" variant="primary" />
            <TerraBadge label="ZERO 3D CLUTTER" code="MIN" variant="outline" />
          {:else}
            <TerraBadge label="3D TOPOGRAPHIC" code="CONTOUR" variant="primary" />
            <TerraBadge label="AIC PIPELINE" code="AIC" variant="outline" />
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- ======================================================================
       4. TAB CONTENT: 01 PRIMITIVES
       ====================================================================== -->
  {#if activeTab === 'primitives'}
    <section class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Button Showcase -->
        <TerraPanel title="TACTICAL ACTUATORS" tag="// COMP-01" cut="tr" bracket={currentTheme !== 'prts'}>
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
              * GPU 合成层流光扫描，100% 避免主线程 Layout 强制重排。
            </p>
          </div>
        </TerraPanel>

        <!-- Badge & Status Matrix -->
        <TerraPanel title="SECURITY CLEARANCE & TAGS" tag="// COMP-02" cut="tr" bracket={currentTheme !== 'prts'}>
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <TerraBadge label="AUTHORIZED" code="ADM" variant="primary" />
              <TerraBadge label="HIGH_VOLTAGE" code="AIC" variant="warning" />
              <TerraBadge label="CORROSION" code="CRIT" variant="danger" />
              <TerraBadge label="SYNCHRONIZED" code="OK" variant="success" />
              <TerraBadge label="PROTOCOL_V2" code="SYS" variant="outline" />
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
  {/if}

  <!-- ======================================================================
       5. TAB CONTENT: 02 TELEMETRY & CONTOUR SURVEY
       ====================================================================== -->
  {#if activeTab === 'telemetry'}
    <section class="space-y-6">
      
      <!-- Energy Bus Section (Endfield In-game Feature) -->
      <TerraPanel title="AIC INDUSTRIAL ENERGY BUS" tag="// AIC.POWER" cut="tr-bl" bracket={currentTheme !== 'prts'} warning={true}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="space-y-3">
            <TerraSegmentBar value={energyBusValue} total={10} label="AIC_MAIN_GRID (自动化工业主干网负荷)" />
            <TerraSegmentBar value={9} total={12} label="TACTICAL_BURST_CELL (战术技力储备矩阵)" />
          </div>
          <div class="flex items-center justify-end gap-3">
            <TerraButton variant="outline" size="sm" onclick={cycleMetrics}>
              CYCLE SIMULATION
            </TerraButton>
          </div>
        </div>
      </TerraPanel>

      <!-- Metric Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TerraPanel title="CONVEYOR FLOW" tag="// AIC.BUS-01" cut="tr-bl" bracket={currentTheme !== 'prts'}>
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

        <TerraPanel title="PROTOCOL LATENCY" tag="// AIC.PING-02" cut="tr" bracket={currentTheme !== 'prts'}>
          <div class="space-y-2">
            <div class="flex items-baseline justify-between">
              <TerraRollingNumber value={metricLatency} decimals={1} suffix="ms" class="text-3xl sm:text-4xl text-[var(--terra-accent-primary)]" />
              <TerraBadge label="NEAR_ZERO" variant="success" />
            </div>
            <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
              帝江号中枢与异星前哨站实时通讯延迟。
            </p>
          </div>
        </TerraPanel>

        <TerraPanel title="RESOURCE EXTRACTION" tag="// AIC.VOL-03" cut="tl-br" bracket={currentTheme !== 'prts'}>
          <div class="space-y-2">
            <div class="flex items-baseline justify-between">
              <TerraRollingNumber value={metricThroughput} decimals={0} suffix="t/h" class="text-3xl sm:text-4xl text-[var(--terra-accent-primary)]" />
              <TerraBadge label="PIPELINE" variant="outline" />
            </div>
            <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
              源石矿床与聚合物产线实时产能速率。
            </p>
          </div>
        </TerraPanel>
      </div>
    </section>
  {/if}

  <!-- ======================================================================
       6. TAB CONTENT: 03 PARAMETRIC PLAYGROUND
       ====================================================================== -->
  {#if activeTab === 'spec'}
    <section class="space-y-6">
      <TerraPanel title="PARAMETRIC CALIBRATION" tag="// HUD.DEBUG" cut="all" bracket={currentTheme !== 'prts'}>
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
                实时修改全局 CSS 变量 <code>--terra-cut-size</code>，所有工业斜切角容器瞬间平滑重塑。
              </p>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-[var(--terra-border)]">
              <div>
                <span class="font-mono text-xs text-[var(--terra-text-primary)] block">ENDFIELD CONTOUR LINES</span>
                <span class="font-mono text-[10px] text-[var(--terra-text-muted)]">终末地地形等高线测绘图层</span>
              </div>
              <TerraButton
                size="sm"
                variant={contourEnabled ? 'primary' : 'outline'}
                onclick={() => contourEnabled = !contourEnabled}
              >
                {contourEnabled ? 'VISIBLE' : 'HIDDEN'}
              </TerraButton>
            </div>
          </div>

          <!-- Live Morphing Preview Box -->
          <div class="p-6 bg-[var(--terra-bg-surface-hover)] border border-[var(--terra-border-strong)] terra-cut-tl-br {currentTheme !== 'prts' ? 'terra-bracket-corner' : ''} flex flex-col justify-between h-48 shadow-xl">
            <div class="flex justify-between items-start">
              <span class="font-mono text-xs text-[var(--terra-accent-primary)] font-bold">
                {currentTheme === 'prts' ? '// SWISS_FLAT_SPEC' : '// 3D_CONTOUR_TARGET'}
              </span>
              <TerraBarcode code={currentTheme.toUpperCase()} serial={`${cutSize}PX-CHAMFER`} height={18} />
            </div>
            <div class="space-y-1">
              <h4 class="font-display text-2xl font-bold uppercase tracking-wider text-[var(--terra-text-primary)]">
                {customLabel || 'AIC_ACTIVE'}
              </h4>
              <p class="font-mono text-xs text-[var(--terra-text-secondary)]">
                MODE: <span class="uppercase font-bold text-[var(--terra-accent-primary)]">{currentMode}</span> | 
                THEME: <span class="uppercase font-bold text-[var(--terra-accent-primary)]">{currentTheme}</span>
              </p>
            </div>
          </div>
        </div>
      </TerraPanel>
    </section>
  {/if}

  <!-- ======================================================================
       FOOTER
       ====================================================================== -->
  <footer class="pt-6 border-t border-[var(--terra-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--terra-text-muted)]">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-[var(--terra-accent-primary)]"></span>
      <span>TERRA-UI // TALOS-II EXPEDITION DESIGN SYSTEM</span>
    </div>
    <div class="flex items-center gap-4">
      <span>THEMES: DIJIANG / WULING / PRTS</span>
      <span>TRANSITION: OFFICIAL SCALE-X CURTAIN</span>
      <span>TERRAIN: TOPOGRAPHIC CONTOURS</span>
    </div>
  </footer>

</main>
