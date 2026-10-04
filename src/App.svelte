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
  import TerraDossierCard from './components/TerraDossierCard.svelte'

  // Color Space Profiles: 'prts' (Rhodes Island) | 'dijiang' (Talos-II) | 'wuling' (Wuling Citadel)
  let currentTheme = $state<'prts' | 'dijiang' | 'wuling'>('prts')
  // Modes: 'dark' | 'light'
  let currentMode = $state<'dark' | 'light'>('dark')
  
  // Section Tracking for Vertical Snap Scroll: '01' | '02' | '03'
  let activeSection = $state<'01' | '02' | '03'>('01')

  // Official Curtain Transition for theme/mode hot-swaps
  let curtainActive = $state(false)
  let transitionLabel = $state('TERRA // LOADING PROTOCOL')

  // Initial Boot Screen state (Shows once on mount; replayable anytime via header button)
  let bootScreenActive = $state(false)

  // Interactive controls
  let contourEnabled = $state(true)
  let cutSize = $state(10)
  let zoomFactor = $state(100)
  let commandInput = $state('DISPATCH_DIRECTIVE_S04')
  let customMatrixInput = $state('AIC_SYSTEM_PARAM')

  // Section 01: Operator Dossier Roster
  interface OperatorProfile {
    codename: string
    nameZh: string
    archetype: string
    rarity: number
    clearance: string
    status: 'online' | 'standby' | 'alert' | 'offline'
    statusLabel: string
    uid: string
    assignment: string
  }

  const operators: OperatorProfile[] = [
    {
      codename: "CH'EN",
      nameZh: '陈',
      archetype: 'GUARD // 近卫干员',
      rarity: 6,
      clearance: 'ELITE-2 // ALPHA',
      status: 'online',
      statusLabel: 'COMBAT READY',
      uid: 'LD-01-CHEN',
      assignment: 'Special Inspection Unit // 特别督察组'
    },
    {
      codename: "KAL'TSIT",
      nameZh: '凯尔希',
      archetype: 'MEDIC // 医疗干员',
      rarity: 6,
      clearance: 'COMMANDER // OMEGA',
      status: 'online',
      statusLabel: 'AUTHORITY',
      uid: 'RI-00-KALTSIT',
      assignment: 'Rhodes Island Command // 医疗及最高指挥'
    },
    {
      codename: 'TEXAS',
      nameZh: '德克萨斯',
      archetype: 'SPECIALIST // 特种干员',
      rarity: 6,
      clearance: 'ELITE-2 // VANGUARD',
      status: 'standby',
      statusLabel: 'STANDBY',
      uid: 'PL-02-TEXAS',
      assignment: 'Penguin Logistics // 企鹅物流'
    },
    {
      codename: 'AMIYA',
      nameZh: '阿米娅',
      archetype: 'CASTER // 术师干员',
      rarity: 5,
      clearance: 'LEADER // ALPHA',
      status: 'online',
      statusLabel: 'ACTIVE',
      uid: 'RI-01-AMIYA',
      assignment: 'Rhodes Island Executive // 公开领袖'
    }
  ]

  let selectedOpIndex = $state(0)
  const currentOperator = $derived(operators[selectedOpIndex])

  // Tactical Dispatch Terminal Logs
  let dispatchLogs = $state<string[]>([
    'PRTS//KERNEL_INIT: TACTICAL PROTOCOL V0.6.0 READY.',
    'NETWORK: RHODES-ISLAND / TALOS-II DUAL-AXIS SYNCED.',
    'SECURITY: LEVEL-04 CLEARANCE GRANTED TO OPERATOR DESK.'
  ])

  function logDispatch(action: string) {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false })
    dispatchLogs = [
      `[${timeStr}] ${action}`,
      ...dispatchLogs.slice(0, 4)
    ]
  }

  function handleDeployOperator() {
    logDispatch(`DEPLOY: OPERATOR [${currentOperator.codename}] DISPATCHED TO ACTIVE FRONT.`)
  }

  function handleViewTelemetry() {
    logDispatch(`TELEMETRY: BIOMETRIC LINK ESTABLISHED FOR [${currentOperator.uid}].`)
  }

  function handleCommandExecute() {
    if (!commandInput.trim()) return
    logDispatch(`EXEC: COMMAND [${commandInput.toUpperCase()}] TRANSMITTED THROUGH PRTS.`)
  }

  function handleOverrideLink() {
    logDispatch('OVERRIDE: SYSTEM BUS OVERRIDE LINK ENGAGED.')
  }

  function handlePurgeCorrosion() {
    logDispatch('PURGE: ORIGINIUM CORROSION SCRUB COMPLETE.')
  }

  // Tactical Sectors for Vertical Tabs (Section 02 & Section 03)
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
  function switchTheme(theme: 'prts' | 'dijiang' | 'wuling') {
    if (currentTheme === theme) return
    transitionLabel = theme === 'prts' ? 'RHODES_ISLAND // PRTS_REBOOT' :
                      theme === 'wuling' ? 'WULING_CITADEL // JADE_SYNC' :
                      'TALOS_II // DIJIANG_COMMENCE'
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
    logDispatch(`SIMULATION: AIC METRIC CYCLE ENGAGED [${metricEfficiency}% / ${metricLatency}ms].`)
  }
</script>

<!-- ======================================================================
     0. AUTHENTIC INITIAL BOOT / LOADING SCREEN
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
     1. STICKY TOP COMMAND BAR // BRANDING RESTRUCTURED (TICKET-02)
     ====================================================================== -->
<header class="sticky top-0 z-40 bg-[var(--terra-bg-base)]/90 backdrop-blur-md border-b border-[var(--terra-border)] transition-colors duration-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
    
    <!-- Brand Title & Subtitle -->
    <div class="flex items-center gap-3">
      <div class="w-2.5 h-8 bg-[var(--terra-accent-primary)] terra-cut-tr shadow-md"></div>
      <div>
        <h1 class="font-mono font-bold tracking-widest text-sm sm:text-base uppercase text-[var(--terra-text-primary)] flex items-center gap-2">
          <span>TERRA // DUAL-AXIS HUD</span>
          <span class="text-[10px] px-1.5 py-0.2 bg-[var(--terra-accent-primary-dim)] text-[var(--terra-accent-primary)] border border-[var(--terra-border-strong)] font-semibold">v0.6.0</span>
        </h1>
        <p class="font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider">
          明日方舟 IP 泰拉全域机能设计系统 // 2D 平面战术与 3D 空间拓扑
        </p>
      </div>
    </div>

    <!-- Quick Jump Section Navigation Links -->
    <nav class="hidden md:flex items-center gap-1 bg-[var(--terra-bg-surface)] p-1 border border-[var(--terra-border)] terra-cut-tr">
      <button
        type="button"
        onclick={() => scrollToSection('section-01')}
        class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '01' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
      >
        01 // 2D TACTICAL
      </button>
      <button
        type="button"
        onclick={() => scrollToSection('section-02')}
        class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '02' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
      >
        02 // 3D SPATIAL
      </button>
      <button
        type="button"
        onclick={() => scrollToSection('section-03')}
        class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '03' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
      >
        03 // COMPONENT MATRIX
      </button>
    </nav>

    <!-- Theme, Mode & Replay Boot Controls -->
    <div class="flex flex-wrap items-center gap-2">
      
      <!-- Replay Boot Button -->
      <button
        type="button"
        onclick={replayBootSequence}
        title="Replay authentic 2.2s initial boot sequence"
        class="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] hover:border-[var(--terra-border-accent)] font-mono text-xs font-bold text-[var(--terra-text-primary)] terra-cut-tr shadow-sm transition-all active:scale-95"
      >
        <span class="text-[var(--terra-accent-primary)] text-sm">↺</span>
        <span class="hidden sm:inline">REPLAY BOOT</span>
      </button>

      <!-- Color Space Profiles Switcher -->
      <div class="flex items-center p-0.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr shadow-sm">
        <button
          type="button"
          onclick={() => switchTheme('prts')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'prts' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          RHODES // 罗德岛
        </button>
        <button
          type="button"
          onclick={() => switchTheme('dijiang')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'dijiang' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          TALOS // 终末地
        </button>
        <button
          type="button"
          onclick={() => switchTheme('wuling')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'wuling' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          WULING // 武陵城
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
  <div class="text-[10px] text-[var(--terra-text-muted)] font-bold">⊕</div>

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
        2D FLAT TACTICAL
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
        3D SPATIAL INDUSTRIAL
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
        COMPONENT MATRIX & LAB
      </span>
    </button>
  </div>

  <div class="text-[9px] text-[var(--terra-text-muted)] tracking-tighter">NAV</div>
</aside>

<!-- ======================================================================
     3. VERTICAL FULL-PAGE SNAP-SCROLL MAIN CONTAINER
     ====================================================================== -->
<main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 snap-y snap-proximity">

  <!-- ====================================================================
       SECTION 01: 2D FLAT TACTICAL COMMAND CONSOLE (TICKET-03)
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
      <span>2D FLAT TACTICAL COMMAND CONSOLE</span>
    </div>

    <!-- Hero Display Title -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--terra-border)]">
      <div class="space-y-2">
        <div class="flex items-center gap-2 font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest uppercase">
          <span>// RHODES_ISLAND // PRTS_TACTICAL_TERMINAL</span>
          <span>•</span>
          <span>SWISS_STYLE_EDITORIAL</span>
          <span>•</span>
          <span class="font-bold">[{currentMode.toUpperCase()}]</span>
        </div>
        
        <h2 class="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-none text-[var(--terra-text-primary)]">
          RHODES ISLAND // TACTICAL DISPATCH
        </h2>
        <p class="font-mono text-xs text-[var(--terra-text-secondary)] tracking-wide">
          明日方舟 PRTS 战术指挥中枢 // 纯平面瑞士排印、干员名录档案与实战调度台
        </p>
      </div>

      <div class="flex flex-col items-start md:items-end gap-2">
        <TerraBarcode
          code="RHODES-PRTS-01"
          serial={`${currentOperator.codename}-SYS`}
          height={28}
        />
        <div class="flex gap-2">
          <TerraBadge label="2D FLAT SWISS" code="GRID" variant="primary" />
          <TerraBadge label="ZERO 3D CLUTTER" code="MIN" variant="outline" />
        </div>
      </div>
    </div>

    <!-- Operator Switcher Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 p-3 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr">
      <div class="flex items-center gap-2 font-mono text-xs">
        <span class="text-[var(--terra-accent-primary)] font-bold">// ROSTER:</span>
        <span class="text-[var(--terra-text-muted)]">SELECT OPERATOR DOSSIER</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        {#each operators as op, idx}
          <button
            type="button"
            onclick={() => selectedOpIndex = idx}
            class="px-3 py-1 font-mono text-xs font-bold border transition-all {selectedOpIndex === idx ? 'bg-[var(--terra-accent-primary)] text-black border-[var(--terra-accent-primary)] shadow-sm' : 'bg-[var(--terra-bg-base)] text-[var(--terra-text-secondary)] border-[var(--terra-border)] hover:border-[var(--terra-border-strong)] hover:text-[var(--terra-text-primary)]'}"
          >
            [{op.codename}] <span class="text-[10px] opacity-80">{op.nameZh}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- 2D Tactical Command Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-700 {visibleSections['01'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
      
      <!-- Operator Dossier Card (6 cols) -->
      <div class="lg:col-span-6 flex flex-col justify-between">
        <TerraDossierCard
          codename={currentOperator.codename}
          nameZh={currentOperator.nameZh}
          archetype={currentOperator.archetype}
          rarity={currentOperator.rarity}
          clearance={currentOperator.clearance}
          status={currentOperator.status}
          statusLabel={currentOperator.statusLabel}
          uid={currentOperator.uid}
          ondeploy={handleDeployOperator}
          ontelemetry={handleViewTelemetry}
          class="h-full"
        />
      </div>

      <!-- Swiss Tactical Command Bay (6 cols) -->
      <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
        <TerraPanel title="TACTICAL DISPATCH CONTROL BAY" tag="// PRTS.CMD" cut="tr-bl" bracket={false}>
          <div class="space-y-4">
            
            <!-- Directive Input & Execution -->
            <div class="space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                TERMINAL DIRECTIVE DISPATCH // 指令下达
              </span>
              <div class="flex flex-col sm:flex-row gap-2">
                <div class="flex-1">
                  <TerraInput
                    bind:value={commandInput}
                    placeholder="ENTER PRTS DIRECTIVE..."
                    prefix="PRTS//DISPATCH>"
                  />
                </div>
                <TerraButton variant="primary" size="md" cut="tr" onclick={handleCommandExecute}>
                  EXECUTE
                </TerraButton>
              </div>
            </div>

            <!-- Clearance & Security Badges Matrix -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                CLEARANCE PROTOCOL MATRIX // 权限矩阵
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <TerraBadge label="AUTHORIZED" code="ADM" variant="primary" />
                <TerraBadge label="HIGH_VOLTAGE" code="AIC" variant="warning" />
                <TerraBadge label="CORROSION" code="CRIT" variant="danger" />
                <TerraBadge label="PRTS-LINKED" code="OK" variant="success" />
                <TerraBadge label="PROTOCOL_V2" code="SYS" variant="outline" />
              </div>
            </div>

            <!-- Tactical Actuator Actions -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                TACTICAL ACTUATORS // 战术操作
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <TerraButton variant="primary" size="sm" cut="tr-bl" onclick={handleCommandExecute}>
                  EXECUTE COMMAND
                </TerraButton>
                <TerraButton variant="outline" size="sm" cut="tl-br" onclick={handleOverrideLink}>
                  OVERRIDE LINK
                </TerraButton>
                <TerraButton variant="danger" size="sm" cut="tr" onclick={handlePurgeCorrosion}>
                  PURGE CORROSION
                </TerraButton>
              </div>
            </div>

            <!-- Status Beacon Diagnostics -->
            <div class="pt-3 border-t border-[var(--terra-border)] grid grid-cols-2 sm:grid-cols-4 gap-3">
              <TerraStatusBeacon status="online" label="NOMINAL" />
              <TerraStatusBeacon status="standby" label="IDLE" />
              <TerraStatusBeacon status="alert" label="ALERT" />
              <TerraStatusBeacon status="offline" label="OFFLINE" pulse={false} />
            </div>

            <!-- Terminal Output Log Stream -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-1 bg-black/30 p-2.5 font-mono text-[10px] border border-[var(--terra-border)]">
              <div class="text-[var(--terra-accent-primary)] font-bold flex items-center justify-between pb-1 border-b border-[var(--terra-border)]">
                <span>PRTS // REAL-TIME DISPATCH LOG</span>
                <span class="text-[8px] text-[var(--terra-text-muted)]">STREAM ACTIVE</span>
              </div>
              <div class="space-y-1 pt-1 max-h-24 overflow-y-auto">
                {#each dispatchLogs as log}
                  <div class="text-[var(--terra-text-secondary)] tracking-tight">
                    {log}
                  </div>
                {/each}
              </div>
            </div>

          </div>
        </TerraPanel>
      </div>

    </div>

    <!-- Scroll Down Prompt -->
    <div class="flex items-center justify-center pt-4">
      <button
        type="button"
        onclick={() => scrollToSection('section-02')}
        class="flex flex-col items-center gap-1 font-mono text-[11px] text-[var(--terra-text-muted)] hover:text-[var(--terra-accent-primary)] transition-colors"
      >
        <span>SCROLL DOWN // 3D SPATIAL</span>
        <span class="animate-bounce">↓</span>
      </button>
    </div>
  </section>

  <!-- ====================================================================
       SECTION 02: 3D SPATIAL & INDUSTRIAL COMPLEX (TICKET-04)
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
      <span>3D SPATIAL & INDUSTRIAL COMPLEX</span>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[var(--terra-border)]">
      <div>
        <h3 class="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[var(--terra-text-primary)]">
          TALOS-II // AUTOMATION INDUSTRIAL COMPLEX
        </h3>
        <p class="font-mono text-xs text-[var(--terra-text-muted)] mt-1">
          塔卫二工业自动化采矿负荷、空间地理遥测与高能母线调度
        </p>
      </div>
      <TerraButton variant="outline" size="sm" onclick={cycleMetrics}>
        CYCLE SIMULATION
      </TerraButton>
    </div>

    <!-- Energy Bus Section (Endfield In-game Feature) -->
    <div class="transition-all duration-700 {visibleSections['02'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
      <TerraPanel title="AIC INDUSTRIAL ENERGY BUS" tag="// AIC.POWER" cut="tr-bl" bracket={true} warning={true}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="space-y-4">
            <TerraSegmentBar
              bind:value={energyBusValue}
              total={10}
              label="AIC_MAIN_GRID (自动化工业主干网负荷)"
              sublabel={`⚡ 480V THREE-PHASE // AIC-BUS LOAD ${Math.round((energyBusValue / 10) * 100)}% // NOMINAL`}
            />
            <TerraSegmentBar
              value={9}
              total={12}
              label="TACTICAL_BURST_CELL (战术技力储备矩阵)"
              sublabel="⚡ DUAL-INVERTER BUFFER // 1000V CAPACITOR BANK"
            />
          </div>
          <div class="font-mono text-xs text-[var(--terra-text-muted)] space-y-1">
            <p>• 480V 工业三相主干网负荷保持在安全阈值区间。</p>
            <p>• -20° 下沉式倾斜嵌槽与前端高能充电脉冲已校准。</p>
            <p>• 谷地四号拓荒枢纽采矿矩阵与高能聚合物产线全负荷运转。</p>
          </div>
        </div>
      </TerraPanel>
    </div>

    <!-- Metric Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-100 {visibleSections['02'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
      <TerraPanel title="CONVEYOR FLOW" tag="// AIC.BUS-01" cut="tr-bl" bracket={true}>
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

      <TerraPanel title="PROTOCOL LATENCY" tag="// AIC.PING-02" cut="tr" bracket={true}>
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

      <TerraPanel title="RESOURCE EXTRACTION" tag="// AIC.VOL-03" cut="tl-br" bracket={true}>
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
        <span>SCROLL DOWN // COMPONENT MATRIX</span>
        <span class="animate-bounce">↓</span>
      </button>
    </div>
  </section>

  <!-- ====================================================================
       SECTION 03: UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB (TICKET-04)
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
      <span>UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB</span>
    </div>

    <div class="pb-4 border-b border-[var(--terra-border)]">
      <h3 class="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[var(--terra-text-primary)]">
        UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB
      </h3>
      <p class="font-mono text-xs text-[var(--terra-text-muted)] mt-1">
        2D 平面战术轴与 3D 空间拓扑轴原子组件全览 // 实时形态参数标定与触感调优
      </p>
    </div>

    <!-- Dual-Track Primitives Matrix (Left: 2D Flat / Right: 3D Spatial) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-700 {visibleSections['03'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
      
      <!-- Track A: 2D Graphic Primitives (6 cols) -->
      <div class="lg:col-span-6 space-y-6">
        <TerraPanel title="2D FLAT GRAPHIC PRIMITIVES" tag="// AXIS-2D" cut="tr-bl" bracket={false}>
          <div class="space-y-5">
            
            <!-- 1. Buttons Matrix -->
            <div class="space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                &lt;TerraButton&gt; // VARIANTS & SIZES
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <TerraButton variant="primary" cut="tr-bl" size="sm">PRIMARY</TerraButton>
                <TerraButton variant="outline" cut="tl-br" size="sm">OUTLINE</TerraButton>
                <TerraButton variant="ghost" cut="none" size="sm">GHOST</TerraButton>
                <TerraButton variant="danger" cut="tr" size="sm">DANGER</TerraButton>
                <TerraButton variant="primary" size="md">MEDIUM</TerraButton>
                <TerraButton variant="outline" size="lg" cut="tr">LARGE</TerraButton>
                <TerraButton variant="outline" size="sm" disabled>DISABLED</TerraButton>
              </div>
            </div>

            <!-- 2. Badges Matrix -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                &lt;TerraBadge&gt; // SECURITY CLEARANCE BADGES
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <TerraBadge label="PRIMARY" code="PRM" variant="primary" />
                <TerraBadge label="WARNING" code="WRN" variant="warning" />
                <TerraBadge label="DANGER" code="DNG" variant="danger" />
                <TerraBadge label="SUCCESS" code="SUC" variant="success" />
                <TerraBadge label="OUTLINE" code="OUT" variant="outline" />
              </div>
            </div>

            <!-- 3. Status Beacons -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                &lt;TerraStatusBeacon&gt; // 4 STATES PULSE
              </span>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <TerraStatusBeacon status="online" label="ONLINE" />
                <TerraStatusBeacon status="standby" label="STANDBY" />
                <TerraStatusBeacon status="alert" label="ALERT" />
                <TerraStatusBeacon status="offline" label="OFFLINE" pulse={false} />
              </div>
            </div>

            <!-- 4. Barcodes -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                &lt;TerraBarcode&gt; // HIGH-DENSITY IDENTIFIER
              </span>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <TerraBarcode code="TERRA-2D-STD" serial="SER-8492" height={22} />
                <TerraBarcode code="RHODES-SECURITY" serial="LV-04" height={22} />
              </div>
            </div>

            <!-- 5. Inputs -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                &lt;TerraInput&gt; // TACTICAL CONSOLE INPUT
              </span>
              <TerraInput bind:value={customMatrixInput} prefix="AXIS-2D//>" placeholder="EDITABLE MATRIX PARAMETER..." />
            </div>

          </div>
        </TerraPanel>
      </div>

      <!-- Track B: 3D Spatial & Industrial Primitives (6 cols) -->
      <div class="lg:col-span-6 space-y-6">
        <TerraPanel title="3D SPATIAL & INDUSTRIAL PRIMITIVES" tag="// AXIS-3D" cut="tl-br" bracket={true}>
          <div class="space-y-5">
            
            <!-- 1. Recessed Energy Segment Bar -->
            <div class="space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                &lt;TerraSegmentBar&gt; // -20° INDUSTRIAL RECESSED BUS
              </span>
              <TerraSegmentBar
                value={energyBusValue}
                total={10}
                label="ENERGY_BUS_CHASSIS"
                sublabel="⚡ RECESSED INDUSTRIAL CAVITY // CHARGING PULSE"
              />
            </div>

            <!-- 2. Vertical Tabs & Floating Cursor -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                &lt;TerraVerticalTabs&gt; // TACTICAL FLOATING CURSOR
              </span>
              <TerraVerticalTabs
                items={sectorTabs}
                bind:selectedKey={selectedSector}
                itemHeight="2.4rem"
                itemGap="0.3rem"
              />
            </div>

            <!-- 3. Corner Brackets & Cad Pattern Preview -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                &lt;TerraCornerBrackets&gt; &amp; &lt;TerraCadPattern&gt; // HUD FOCUS
              </span>
              <TerraCornerBrackets label="[HUD.CAD // TARGET_GRID]" size="sm" active={true}>
                <TerraCadPattern patternSize={40} opacity={0.25} hoverHighlight={true}>
                  <div class="p-3 bg-black/40 text-center font-mono text-[10px] text-[var(--terra-text-secondary)]">
                    CROSSHAIR FOCUS // INTERACTIVE CAD COORD LAYER
                  </div>
                </TerraCadPattern>
              </TerraCornerBrackets>
            </div>

          </div>
        </TerraPanel>
      </div>

    </div>

    <!-- Interactive Parametric Calibration Lab -->
    <div class="transition-all duration-700 {visibleSections['03'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}">
      <TerraCornerBrackets label="[SEC-03 // PARAMETRIC CALIBRATION LAB]" glow={true} active={true}>
        <TerraCadPattern patternSize={110} opacity={0.14}>
          <TerraPanel title="PARAMETRIC CALIBRATION & REALTIME VIEWPORT" tag="// HUD.DEBUG" cut="tr-bl" bracket={false}>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              <!-- Sector Navigation: 4 cols -->
              <div class="md:col-span-4 space-y-4">
                <div class="flex items-center justify-between font-mono text-xs">
                  <span class="text-[var(--terra-text-muted)]">TACTICAL SECTORS:</span>
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
              <div class="md:col-span-3 flex flex-col items-center justify-between p-5 bg-[var(--terra-bg-surface-active)]/30 border border-[var(--terra-border)] rounded-xs self-stretch min-h-[19rem]">
                <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider mb-2 text-center">
                  PRECISION VERTICAL CONTROLS
                </span>
                <div class="flex items-center justify-around w-full gap-6 px-3 my-auto">
                  <!-- Chamfer Cut Slider -->
                  <TerraVerticalSlider
                    bind:value={cutSize}
                    min={4}
                    max={24}
                    step={1}
                    height="10.5rem"
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
                    height="10.5rem"
                    width="1.6rem"
                    label="ZOOM"
                    unit="%"
                    fluidDecorations={true}
                  />
                </div>
                <span class="font-mono text-[9px] text-[var(--terra-text-muted)] mt-2 text-center">
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
        <span>TERRA-UI // DUAL-AXIS FUNCTIONAL DESIGN SYSTEM (v0.6.0)</span>
      </div>
      <div class="flex items-center gap-4">
        <span>PROFILES: RHODES / TALOS / WULING</span>
        <span>AXES: 2D FLAT TACTICAL + 3D SPATIAL INDUSTRIAL</span>
        <span>ZERO-VDOM // SVELTE 5 NATIVE RUNES</span>
      </div>
    </footer>
  </section>

</main>
