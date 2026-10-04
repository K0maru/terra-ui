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
  import TerraInitialBootScreen from './components/TerraInitialBootScreen.svelte'
  import TerraCadPattern from './components/TerraCadPattern.svelte'
  import TerraCornerBrackets from './components/TerraCornerBrackets.svelte'
  import TerraVerticalSlider from './components/TerraVerticalSlider.svelte'
  import TerraVerticalTabs, { type TerraTabItem } from './components/TerraVerticalTabs.svelte'

  // Themes: 'dijiang' | 'wuling' | 'prts'
  let currentTheme = $state<'dijiang' | 'wuling' | 'prts'>('dijiang')
  // Modes: 'dark' | 'light'
  let currentMode = $state<'dark' | 'light'>('dark')
  
  // Section Tracking for Vertical Snap Scroll: '01' | '02' | '03'
  let activeSection = $state<'01' | '02' | '03'>('01')

  // Official Curtain Transition for theme/mode hot-swaps
  let curtainActive = $state(false)
  let transitionLabel = $state('ENDFIELD // LOADING PROTOCOL')

  // Initial Boot Screen state (Shows once on mount; replayable anytime via header button)
  let bootScreenActive = $state(false)

  // Interactive controls
  let contourEnabled = $state(true)
  let cutSize = $state(10)
  let zoomFactor = $state(100)
  let customLabel = $state('AIC_SYSTEM_NORMAL')

  // Tactical Sectors for Vertical Tabs
  const sectorTabs: TerraTabItem[] = [
    { key: 'valley4', label: 'VALLEY IV BASIN', shortCode: 'VL-04', badge: 'SECTOR-04' },
    { key: 'dijiang', label: 'DIJIANG EXPEDITION', shortCode: 'DJ-01', badge: 'MOBILE-HQ' },
    { key: 'wuling', label: 'WULING CITADEL', shortCode: 'WL-09', badge: 'CORE-HUB' }
  ]
  let selectedSector = $state('valley4')

  const sectorTelemetry = $derived({
    valley4: {
      name: 'FOURTH VALLEY BASIN',
      coord: 'LAT: 32°14\'N // LNG: 104°58\'E // ELEV: +1420M',
      status: 'SURVEY IN PROGRESS',
      density: 'HIGH AIC FIELD // 420 kV'
    },
    dijiang: {
      name: 'DIJIANG LANDSHIP MOBILE HQ',
      coord: 'VECTOR: 284° // SPEED: 14.2 KT // HULL: SEALED',
      status: 'EXPEDITION TRANSIT',
      density: 'FUSION CORE // 98.4% STABLE'
    },
    wuling: {
      name: 'WULING CITADEL FORTIFICATION',
      coord: 'GRID: WL-9901 // DEFENSE: MAXIMUM',
      status: 'SHIELD ACTIVE',
      density: 'EM BARRIER // ZERO DRIFT'
    }
  }[selectedSector] || {
    name: 'TALOS-II SECTOR',
    coord: 'LAT: 00°00\'N // LNG: 00°00\'E',
    status: 'NORMAL',
    density: 'STABLE'
  })

  // Live telemetry simulation
  let metricEfficiency = $state(99.14)
  let metricLatency = $state(1.2)
  let metricThroughput = $state(9240)
  let energyBusValue = $state(8)
  let fps = $state(120)

  // Section reveal visibility tracking
  let visibleSections = $state<Record<string, boolean>>({
    '01': true,
    '02': false,
    '03': false
  })

  // Real FPS meter & IntersectionObserver
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

    // IntersectionObserver for vertical snap-scroll tracking
    const sections = document.querySelectorAll<HTMLElement>('section[data-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const sec = entry.target.getAttribute('data-section') as '01' | '02' | '03' | null
          if (entry.isIntersecting && sec) {
            activeSection = sec
            visibleSections[sec] = true
          }
        }
      },
      { threshold: 0.3 }
    )

    sections.forEach((sec) => observer.observe(sec))

    return () => {
      cancelAnimationFrame(handle)
      observer.disconnect()
    }
  })

  // Smooth scroll to target section
  function scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

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

  function triggerCurtain() {
    curtainActive = false
    setTimeout(() => {
      curtainActive = true
    }, 10)
  }

  function replayBootSequence() {
    bootScreenActive = true
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

<!-- ======================================================================
     0. AUTHENTIC INITIAL BOOT / LOADING SCREEN (Ticket 01)
     Shows once on initial visit via sessionStorage; replayable anytime via header
     ====================================================================== -->
<TerraInitialBootScreen bind:active={bootScreenActive} />

<!-- Official Endfield Industrial Curtain Wipe (Page/Theme Turn) -->
<TerraCurtainTransition
  active={curtainActive}
  label={transitionLabel}
  oncomplete={() => curtainActive = false}
/>

<!-- ======================================================================
     0. BACKGROUND OVERLAYS
     Mountain Topographic Contours for Endfield / Swiss Flat Grid for PRTS
     ====================================================================== -->
{#if (currentTheme === 'dijiang' || currentTheme === 'wuling') && contourEnabled}
  <TerraContourLines
    elevation={currentTheme === 'wuling' ? '+2680m' : '+2680m'}
    zone={currentTheme === 'wuling' ? 'WULING_CITADEL // JADE_RIDGE' : 'TALOS-II // VALLEY_IV_RIDGE'}
    opacity={currentMode === 'dark' ? 0.32 : 0.18}
    class="fixed inset-0 z-0"
  />
{/if}

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

<!-- ======================================================================
     1. STICKY TOP COMMAND BAR // CONTROL HUB
     ====================================================================== -->
<header class="sticky top-0 z-40 bg-[var(--terra-bg-base)]/85 backdrop-blur-md border-b border-[var(--terra-border)] transition-colors duration-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
    
    <div class="flex items-center gap-3">
      <div class="w-2.5 h-7 bg-[var(--terra-accent-primary)] terra-cut-tr shadow-md"></div>
      <div>
        <h1 class="font-mono font-bold tracking-widest text-sm sm:text-base uppercase text-[var(--terra-text-primary)] flex items-center gap-2">
          <span>TERRA // OPERATOR HUD</span>
          <span class="text-[10px] px-1.5 py-0.2 bg-[var(--terra-accent-primary-dim)] text-[var(--terra-accent-primary)] border border-[var(--terra-border-strong)]">v0.5.0</span>
        </h1>
        <p class="font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider">
          {#if currentTheme === 'prts'}
            明日方舟 // 瑞士平面战术终端 // 2D SWISS GRAPHIC
          {:else}
            终末地 // 塔卫二拓荒 // 3D TOPOGRAPHIC INDUSTRIAL
          {/if}
        </p>
      </div>
    </div>

    <!-- Quick Jump Section Tabs in Header -->
    <nav class="hidden md:flex items-center gap-1 bg-[var(--terra-bg-surface)] p-1 border border-[var(--terra-border)] terra-cut-tr">
      <button
        type="button"
        onclick={() => scrollToSection('section-01')}
        class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '01' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
      >
        01 // PRIMITIVES
      </button>
      <button
        type="button"
        onclick={() => scrollToSection('section-02')}
        class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '02' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
      >
        02 // TELEMETRY
      </button>
      <button
        type="button"
        onclick={() => scrollToSection('section-03')}
        class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '03' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
      >
        03 // CALIBRATION
      </button>
    </nav>

    <!-- Theme, Mode & Replay Boot Controls -->
    <div class="flex flex-wrap items-center gap-2">
      
      <!-- Replay Boot Button (Allows user to re-watch the authentic 2.2s loading sequence) -->
      <button
        type="button"
        onclick={replayBootSequence}
        title="Replay authentic 2.2s initial boot sequence"
        class="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] hover:border-[var(--terra-border-accent)] font-mono text-xs font-bold text-[var(--terra-text-primary)] terra-cut-tr shadow-sm transition-all active:scale-95"
      >
        <span class="text-[var(--terra-accent-primary)] text-sm">↺</span>
        <span class="hidden sm:inline">REPLAY BOOT</span>
      </button>

      <!-- Theme Switcher -->
      <div class="flex items-center p-0.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr shadow-sm">
        <button
          type="button"
          onclick={() => switchTheme('dijiang')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'dijiang' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          帝江号
        </button>
        <button
          type="button"
          onclick={() => switchTheme('wuling')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'wuling' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          武陵
        </button>
        <button
          type="button"
          onclick={() => switchTheme('prts')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'prts' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          PRTS
        </button>
      </div>

      <!-- Dark / Light Mode Toggle -->
      <button
        type="button"
        onclick={toggleMode}
        class="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] font-mono text-xs font-bold text-[var(--terra-text-primary)] hover:border-[var(--terra-border-accent)] terra-cut-tr shadow-sm transition-all active:scale-95"
      >
        {#if currentMode === 'dark'}
          <span>🌙 DARK</span>
        {:else}
          <span>☀️ LIGHT</span>
        {/if}
      </button>

      <!-- Real-time Performance Indicator -->
      <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] font-mono text-[11px] terra-cut-tr shadow-sm">
        <TerraStatusBeacon status="online" label="NOMINAL" />
        <span class="text-[var(--terra-text-muted)]">|</span>
        <span class="text-[var(--terra-text-secondary)]">FPS: <strong class="text-[var(--terra-accent-primary)]">{fps}</strong></span>
      </div>
    </div>

  </div>
</header>

<!-- ======================================================================
     2. RIGHT-SIDE FIXED VERTICAL INDICATOR TRACK (Official Snap Scroll Rail)
     ====================================================================== -->
<aside class="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-8 font-mono select-none">
  <!-- Top decorative crosshair -->
  <div class="text-[10px] text-[var(--terra-text-muted)] font-bold">⊕</div>

  <!-- Vertical rail line with interactive markers -->
  <div class="relative flex flex-col items-center gap-7">
    <div class="absolute top-2 bottom-2 w-[1px] bg-[var(--terra-border)] z-0"></div>

    <!-- 01 Marker -->
    <button
      type="button"
      onclick={() => scrollToSection('section-01')}
      class="group relative z-10 flex items-center gap-2 transition-all"
    >
      <div class="px-2 py-1 bg-[var(--terra-bg-surface)] border text-[11px] font-bold terra-cut-tr transition-all {activeSection === '01' ? 'border-[var(--terra-accent-primary)] text-[var(--terra-accent-primary)] shadow-[0_0_8px_var(--terra-accent-primary-dim)] scale-110' : 'border-[var(--terra-border)] text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}">
        [ 01 ]
      </div>
      <span class="absolute right-full mr-3 px-2 py-0.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        OVERVIEW & PRIMITIVES
      </span>
    </button>

    <!-- 02 Marker -->
    <button
      type="button"
      onclick={() => scrollToSection('section-02')}
      class="group relative z-10 flex items-center gap-2 transition-all"
    >
      <div class="px-2 py-1 bg-[var(--terra-bg-surface)] border text-[11px] font-bold terra-cut-tr transition-all {activeSection === '02' ? 'border-[var(--terra-accent-primary)] text-[var(--terra-accent-primary)] shadow-[0_0_8px_var(--terra-accent-primary-dim)] scale-110' : 'border-[var(--terra-border)] text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}">
        [ 02 ]
      </div>
      <span class="absolute right-full mr-3 px-2 py-0.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        AIC TELEMETRY
      </span>
    </button>

    <!-- 03 Marker -->
    <button
      type="button"
      onclick={() => scrollToSection('section-03')}
      class="group relative z-10 flex items-center gap-2 transition-all"
    >
      <div class="px-2 py-1 bg-[var(--terra-bg-surface)] border text-[11px] font-bold terra-cut-tr transition-all {activeSection === '03' ? 'border-[var(--terra-accent-primary)] text-[var(--terra-accent-primary)] shadow-[0_0_8px_var(--terra-accent-primary-dim)] scale-110' : 'border-[var(--terra-border)] text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}">
        [ 03 ]
      </div>
      <span class="absolute right-full mr-3 px-2 py-0.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        PARAMETRIC LAB
      </span>
    </button>
  </div>

  <!-- Bottom coordinate mark -->
  <div class="text-[9px] text-[var(--terra-text-muted)] tracking-tighter">NAV</div>
</aside>

<!-- ======================================================================
     3. VERTICAL FULL-PAGE SNAP-SCROLL MAIN CONTAINER
     ====================================================================== -->
<main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 snap-y snap-proximity">

  <!-- ====================================================================
       SECTION 01: TACTICAL OVERVIEW & PRIMITIVES
       ==================================================================== -->
  <section
    id="section-01"
    data-section="01"
    class="min-h-[calc(100vh-4rem)] snap-start flex flex-col justify-center py-12 space-y-8 scroll-mt-16"
  >
    <!-- Section Header Tagline -->
    <div class="flex items-center gap-2 font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest uppercase">
      <span class="px-2 py-0.5 bg-[var(--terra-accent-primary)] text-black font-bold">SECTION 01</span>
      <span>//</span>
      <span>TACTICAL OVERVIEW & PRIMITIVES</span>
    </div>

    <!-- Hero Display Title -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--terra-border)]">
      <div class="space-y-2">
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
        <TerraBarcode
          code={currentTheme === 'wuling' ? 'WL-HUB-2026' : currentTheme === 'prts' ? 'RHODES-PRTS' : 'ENDFIELD-04'}
          serial={`${currentMode.toUpperCase()}-SYS`}
          height={28}
        />
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

    <!-- Primitives Showcase Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 {visibleSections['01'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
      <!-- Tactical Actuators (Buttons) -->
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

    <!-- Scroll Down Prompt -->
    <div class="flex items-center justify-center pt-4">
      <button
        type="button"
        onclick={() => scrollToSection('section-02')}
        class="flex flex-col items-center gap-1 font-mono text-[11px] text-[var(--terra-text-muted)] hover:text-[var(--terra-accent-primary)] transition-colors"
      >
        <span>SCROLL DOWN // TELEMETRY</span>
        <span class="animate-bounce">↓</span>
      </button>
    </div>
  </section>

  <!-- ====================================================================
       SECTION 02: AIC INDUSTRIAL TELEMETRY
       ==================================================================== -->
  <section
    id="section-02"
    data-section="02"
    class="min-h-[calc(100vh-4rem)] snap-start flex flex-col justify-center py-12 space-y-8 scroll-mt-16"
  >
    <!-- Section Header Tagline -->
    <div class="flex items-center gap-2 font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest uppercase">
      <span class="px-2 py-0.5 bg-[var(--terra-accent-primary)] text-black font-bold">SECTION 02</span>
      <span>//</span>
      <span>AIC INDUSTRIAL TELEMETRY & CONTOURS</span>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[var(--terra-border)]">
      <div>
        <h3 class="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[var(--terra-text-primary)]">
          AUTOMATION INDUSTRIAL COMPLEX
        </h3>
        <p class="font-mono text-xs text-[var(--terra-text-muted)] mt-1">
          塔卫二工业自动化采矿负荷、实时通讯与等高线测绘监控
        </p>
      </div>
      <TerraButton variant="outline" size="sm" onclick={cycleMetrics}>
        CYCLE SIMULATION
      </TerraButton>
    </div>

    <!-- Energy Bus Section (Endfield In-game Feature) -->
    <div class="transition-all duration-700 {visibleSections['02'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
      <TerraPanel title="AIC INDUSTRIAL ENERGY BUS" tag="// AIC.POWER" cut="tr-bl" bracket={currentTheme !== 'prts'} warning={true}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="space-y-3">
            <TerraSegmentBar value={energyBusValue} total={10} label="AIC_MAIN_GRID (自动化工业主干网负荷)" />
            <TerraSegmentBar value={9} total={12} label="TACTICAL_BURST_CELL (战术技力储备矩阵)" />
          </div>
          <div class="font-mono text-xs text-[var(--terra-text-muted)] space-y-1">
            <p>• 480V 工业三相主干网负荷保持在安全阈值区间。</p>
            <p>• 谷地四号拓荒枢纽采矿矩阵与高能聚合物产线全负荷运转。</p>
          </div>
        </div>
      </TerraPanel>
    </div>

    <!-- Metric Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-100 {visibleSections['02'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
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

    <!-- Scroll Down Prompt -->
    <div class="flex items-center justify-center pt-4">
      <button
        type="button"
        onclick={() => scrollToSection('section-03')}
        class="flex flex-col items-center gap-1 font-mono text-[11px] text-[var(--terra-text-muted)] hover:text-[var(--terra-accent-primary)] transition-colors"
      >
        <span>SCROLL DOWN // CALIBRATION</span>
        <span class="animate-bounce">↓</span>
      </button>
    </div>
  </section>

  <!-- ====================================================================
       SECTION 03: PARAMETRIC LAB & CALIBRATION
       ==================================================================== -->
  <section
    id="section-03"
    data-section="03"
    class="min-h-[calc(100vh-4rem)] snap-start flex flex-col justify-center py-12 space-y-8 scroll-mt-16"
  >
    <!-- Section Header Tagline -->
    <div class="flex items-center gap-2 font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest uppercase">
      <span class="px-2 py-0.5 bg-[var(--terra-accent-primary)] text-black font-bold">SECTION 03</span>
      <span>//</span>
      <span>PARAMETRIC LAB & CALIBRATION</span>
    </div>

    <div class="pb-4 border-b border-[var(--terra-border)]">
      <h3 class="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[var(--terra-text-primary)]">
        DESIGN SYSTEM PARAMETRICS
      </h3>
      <p class="font-mono text-xs text-[var(--terra-text-muted)] mt-1">
        动态斜切角、地形图层控制与三维容器实时重塑
      </p>
    </div>

    <div class="transition-all duration-700 {visibleSections['03'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
      <TerraCornerBrackets label="[SEC-03 // PARAMETRIC LAB]" glow={true} active={true}>
        <TerraCadPattern patternSize={110} opacity={0.14}>
          <TerraPanel title="PARAMETRIC CALIBRATION & TACTICAL LAB" tag="// HUD.DEBUG" cut="tr-bl" bracket={false}>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <!-- Sector Navigation: 4 cols -->
              <div class="md:col-span-4 space-y-4">
                <div class="flex items-center justify-between font-mono text-xs">
                  <span class="text-[var(--terra-text-muted)]">TACTICAL SECTORS // 战区切换:</span>
                  <span class="text-[var(--terra-accent-primary)] font-bold">[{selectedSector.toUpperCase()}]</span>
                </div>
                <TerraVerticalTabs
                  items={sectorTabs}
                  bind:selectedKey={selectedSector}
                  itemHeight="2.6rem"
                  itemGap="0.4rem"
                />

                <div class="flex items-center justify-between pt-4 border-t border-[var(--terra-border)]">
                  <div>
                    <span class="font-mono text-xs text-[var(--terra-text-primary)] block">CONTOUR OVERLAY</span>
                    <span class="font-mono text-[10px] text-[var(--terra-text-muted)]">终末地山峦等高线测绘</span>
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

              <!-- Vertical Tactical Sliders Bay: 3 cols -->
              <div class="md:col-span-3 flex flex-col items-center justify-center p-4 bg-black/20 dark:bg-black/30 border border-[var(--terra-border)] rounded-xs">
                <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider mb-3">
                  PRECISION VERTICAL CONTROLS
                </span>
                <div class="flex items-center justify-around w-full gap-4">
                  <!-- Chamfer Cut Slider -->
                  <TerraVerticalSlider
                    bind:value={cutSize}
                    min={4}
                    max={24}
                    step={1}
                    height="10rem"
                    width="1.6rem"
                    label="CHAMFER"
                    unit="px"
                    fluidDecorations={true}
                  />

                  <!-- Zoom Factor Slider -->
                  <TerraVerticalSlider
                    bind:value={zoomFactor}
                    min={50}
                    max={150}
                    step={5}
                    height="10rem"
                    width="1.6rem"
                    label="ZOOM"
                    unit="%"
                    fluidDecorations={true}
                  />
                </div>
                <span class="font-mono text-[9px] text-[var(--terra-text-muted)] mt-3 text-center">
                  GPU 硬件合成层 (Compositor 60fps)
                </span>
              </div>

              <!-- Live Morphing Viewport Card: 5 cols -->
              <div class="md:col-span-5">
                <TerraCornerBrackets label="[{selectedSector.toUpperCase()} // REALTIME VIEWPORT]" size="sm" active={true}>
                  <TerraCadPattern patternSize={60} opacity={0.25} hoverHighlight={true}>
                    <div
                      class="p-6 bg-[var(--terra-bg-surface-hover)] border border-[var(--terra-border-strong)] terra-cut-tl-br flex flex-col justify-between min-h-[16rem] shadow-xl overflow-hidden transition-all duration-200"
                    >
                      <div class="flex justify-between items-start">
                        <div class="space-y-0.5">
                          <span class="font-mono text-xs text-[var(--terra-accent-primary)] font-bold block">
                            // {sectorTelemetry.name}
                          </span>
                          <span class="font-mono text-[9px] text-[var(--terra-text-muted)] tracking-wider">
                            STATUS: <strong class="text-[var(--terra-text-primary)]">{sectorTelemetry.status}</strong>
                          </span>
                        </div>
                        <TerraBarcode code={selectedSector.toUpperCase()} serial={`${cutSize}PX-${zoomFactor}%`} height={18} />
                      </div>

                      <!-- Interactive Zoomed Inner Frame -->
                      <div
                        class="my-3 p-3 bg-black/30 border border-dashed border-[var(--terra-border)] flex flex-col items-center justify-center transition-transform duration-150 origin-center"
                        style="transform: scale({zoomFactor / 100});"
                      >
                        <div class="font-display text-xl font-bold tracking-widest text-[var(--terra-text-primary)] uppercase text-center">
                          {sectorTelemetry.name}
                        </div>
                        <div class="font-mono text-[10px] text-[var(--terra-accent-primary)] tracking-tight mt-1 text-center">
                          {sectorTelemetry.coord}
                        </div>
                        <div class="font-mono text-[9px] text-[var(--terra-text-secondary)] mt-0.5 text-center">
                          FIELD: {sectorTelemetry.density}
                        </div>
                      </div>

                      <div class="flex justify-between items-end border-t border-[var(--terra-border)] pt-2 font-mono text-[10px] text-[var(--terra-text-secondary)]">
                        <div>
                          CHAMFER: <span class="text-[var(--terra-accent-primary)] font-bold">{cutSize}px</span> |
                          ZOOM: <span class="text-[var(--terra-accent-primary)] font-bold">{zoomFactor}%</span>
                        </div>
                        <div class="text-[var(--terra-text-muted)] uppercase">
                          THEME: <span class="text-[var(--terra-text-primary)] font-bold">{currentTheme}</span>
                        </div>
                      </div>
                    </div>
                  </TerraCadPattern>
                </TerraCornerBrackets>
              </div>
            </div>
          </TerraPanel>
        </TerraCadPattern>
      </TerraCornerBrackets>
    </div>

    <!-- ==================================================================
         FOOTER
         ================================================================== -->
    <footer class="pt-8 border-t border-[var(--terra-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--terra-text-muted)]">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[var(--terra-accent-primary)]"></span>
        <span>TERRA-UI // TALOS-II EXPEDITION DESIGN SYSTEM</span>
      </div>
      <div class="flex items-center gap-4">
        <span>THEMES: DIJIANG / WULING / PRTS</span>
        <span>TRANSITION: OFFICIAL SCALE-X CURTAIN</span>
        <span>TERRAIN: DUAL-PEAK MOUNTAIN CONTOURS</span>
      </div>
    </footer>
  </section>

</main>
