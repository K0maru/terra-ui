<script lang="ts">
  import { onMount } from 'svelte'
  import {
    TerraButton,
    TerraPanel,
    TerraBadge,
    TerraStatusBeacon,
    TerraBarcode,
    TerraRollingNumber,
    TerraInput,
    TerraSegmentBar,
    TerraContourLines,
    TerraCurtainTransition,
    TerraInitialBootScreen,
    TerraCadPattern,
    TerraCornerBrackets,
    TerraVerticalSlider,
    TerraVerticalTabs,
    type TerraTabItem,
    TerraProfileCard,
    TerraSpatialCard,
    TerraDonutChart,
    TerraLineChart,
    TerraBarChart
  } from './components'
  import TerraDocsView from './docs/TerraDocsView.svelte'
  import { i18n } from './i18n'

  const t = $derived(i18n.t)

  // View Mode: 'demo' (Long-scroll operational showcase) | 'docs' (GitBook-style interactive documentation)
  let viewMode = $state<'demo' | 'docs'>('demo')

  // Functional Color Spectrum Themes: 'cyan' (Blueprint) | 'amber' (Industrial) | 'emerald' (Telemetry)
  let currentTheme = $state<'cyan' | 'amber' | 'emerald'>('cyan')
  // Modes: 'dark' | 'light'
  let currentMode = $state<'dark' | 'light'>('dark')

  // Section Tracking for Vertical Snap Scroll: '01' | '02' | '03'
  let activeSection = $state<'01' | '02' | '03'>('01')

  // Curtain Transition for theme/mode hot-swaps
  let curtainActive = $state(false)
  let transitionLabel = $state('TERRA UI // SYSTEM SYNC')

  // Initial Boot Screen state
  let bootScreenActive = $state(false)

  // Interactive controls
  let contourEnabled = $state(true)
  let cutSize = $state(10)
  let zoomFactor = $state(100)
  let commandInput = $state('QUERY_CLUSTER_METRICS')
  let customMatrixInput = $state('TELEMETRY_SAMPLE_RATE')

  // Operations Terminal Logs
  let dispatchLogs = $state<string[]>([
    'SYS//KERNEL_INIT: SVELTE 5 RUNES COMPOSITOR READY.',
    'NETWORK: BLUEPRINT / INDUSTRIAL DUAL-AXIS SYNCED.',
    'SECURITY: AUTHORIZED SESSION GRANTED TO OPERATIONS DESK.'
  ])

  function logDispatch(action: string) {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false })
    dispatchLogs = [
      `[${timeStr}] ${action}`,
      ...dispatchLogs.slice(0, 4)
    ]
  }

  function handleCommandExecute() {
    if (!commandInput.trim()) return
    logDispatch(`EXEC: QUERY [${commandInput.toUpperCase()}] TRANSMITTED THROUGH CORE BUS.`)
  }

  function handleSyncCluster() {
    logDispatch('CLUSTER: DISTRIBUTED NODES SYNCHRONIZED ACROSS REGIONS.')
  }

  function handleResetBuffer() {
    logDispatch('BUFFER: TELEMETRY AND SHARD CACHE BUFFER RESET.')
  }

  // Clusters for Vertical Tabs derived from i18n
  const sectorTabs: TerraTabItem[] = $derived(t.sectorTabs)
  let selectedSector = $state('us-east')

  const sectorTelemetry = $derived(
    t.sectors[selectedSector] || t.sectors['us-east'] || {
      name: 'US-EAST-01 DATA CLUSTER',
      coord: 'LAT: 39°02\'N // LNG: 77°28\'W // DC-VA',
      status: 'OPTIMAL // 99.99%',
      density: 'THROUGHPUT: 42.8 Tbps // 0.8ms'
    }
  )

  // Live telemetry simulation metrics
  let metricEfficiency = $state(99.14)
  let metricLatency = $state(1.2)
  let metricThroughput = $state(9240)
  let energyBusValue = $state(8)
  let fps = $state(120)

  // Chart Data: Subsystem Allocation Bar Chart (Section 01)
  const subsystemBarData = $state([
    { label: 'CPU-CORE', value: 64, max: 100, status: 'normal' as const },
    { label: 'MEM-POOL', value: 88, max: 100, status: 'warning' as const },
    { label: 'GPU-SHAD', value: 94, max: 100, status: 'critical' as const },
    { label: 'NET-IO', value: 52, max: 100, status: 'normal' as const },
    { label: 'DISK-BUS', value: 78, max: 100, status: 'warning' as const },
    { label: 'CACHE-L3', value: 45, max: 100, status: 'normal' as const }
  ])

  // Chart Data: Telemetry Waveform Line Chart (Section 01)
  const signalTelemetryData = $state([
    { timestamp: '18:00:12', value: 38, label: 'NODE-01' },
    { timestamp: '18:15:30', value: 52, label: 'NODE-03' },
    { timestamp: '18:30:45', value: 86, label: 'PEAK-05' },
    { timestamp: '18:45:10', value: 68, label: 'BAL-07' },
    { timestamp: '18:57:56', value: 92, label: 'NODE-10' },
    { timestamp: '19:12:35', value: 74, label: 'DAMP-12' },
    { timestamp: '19:28:40', value: 59, label: 'STEADY-15' }
  ])

  // Chart Data: Spatial Donut Chart (Section 02)
  const spatialDonutData = $derived([
    { label: t.sec02.donutItems.pwr, value: 42, color: 'var(--terra-accent-primary)', code: 'PWR-01' },
    { label: t.sec02.donutItems.def, value: 28, color: 'var(--terra-accent-secondary)', code: 'DEF-02' },
    { label: t.sec02.donutItems.bus, value: 18, color: 'var(--terra-accent-warning)', code: 'BUS-03' },
    { label: t.sec02.donutItems.env, value: 12, color: 'var(--terra-accent-success)', code: 'ENV-04' }
  ])

  // Section reveal visibility tracking
  let visibleSections = $state<Record<string, boolean>>({
    '01': true,
    '02': true,
    '03': true
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
      { threshold: 0.05, rootMargin: '-10% 0px -10% 0px' }
    )

    function attachObserver() {
      const sections = document.querySelectorAll<HTMLElement>('section[data-section]')
      sections.forEach((sec) => observer.observe(sec))
    }
    attachObserver()

    function checkHashMode() {
      if (window.location.hash.startsWith('#/docs')) {
        viewMode = 'docs'
      } else if (window.location.hash === '#/demo' || !window.location.hash) {
        viewMode = 'demo'
        setTimeout(attachObserver, 50)
      }
    }
    checkHashMode()
    window.addEventListener('hashchange', checkHashMode)

    return () => {
      cancelAnimationFrame(handle)
      observer.disconnect()
      window.removeEventListener('hashchange', checkHashMode)
    }
  })

  function scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function switchTheme(theme: 'cyan' | 'amber' | 'emerald') {
    if (currentTheme === theme) return
    transitionLabel = theme === 'cyan' ? 'BLUEPRINT // CYAN_SPECTRUM' :
                      theme === 'amber' ? 'INDUSTRIAL // AMBER_SPECTRUM' :
                      'TELEMETRY // EMERALD_SPECTRUM'
    triggerCurtain()
    currentTheme = theme
    document.documentElement.setAttribute('data-theme', theme)
  }

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

  $effect(() => {
    document.documentElement.style.setProperty('--terra-cut-size', `${cutSize}px`)
  })

  function cycleMetrics() {
    metricEfficiency = +(94 + Math.random() * 5.9).toFixed(2)
    metricLatency = +(0.6 + Math.random() * 1.8).toFixed(1)
    metricThroughput = Math.floor(7500 + Math.random() * 4000)
    energyBusValue = Math.floor(4 + Math.random() * 7)
    logDispatch(`SIMULATION: TELEMETRY CYCLE ENGAGED [${metricEfficiency}% / ${metricLatency}ms].`)
  }
</script>

<!-- ======================================================================
     0. AUTHENTIC INITIAL BOOT / LOADING SCREEN
     ====================================================================== -->
<TerraInitialBootScreen bind:active={bootScreenActive} />

<!-- Industrial Curtain Wipe Transition -->
<TerraCurtainTransition
  active={curtainActive}
  label={transitionLabel}
  oncomplete={() => curtainActive = false}
/>

<!-- ======================================================================
     0. BACKGROUND OVERLAYS
     ====================================================================== -->
{#if (currentTheme === 'amber' || currentTheme === 'emerald') && contourEnabled}
  <TerraContourLines
    elevation="+2680m"
    zone={currentTheme === 'emerald' ? 'TELEMETRY // GREEN_RIDGE' : 'INDUSTRIAL // HIGH_LOAD_ZONE'}
    opacity={currentMode === 'dark' ? 0.32 : 0.18}
    class="fixed inset-0 z-0"
  />
{/if}

{#if currentTheme === 'cyan'}
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
     1. STICKY TOP COMMAND BAR // BRANDING RESTRUCTURED (TICKET-03 & 04)
     ====================================================================== -->
<header class="sticky top-0 z-40 bg-[var(--terra-bg-base)]/90 backdrop-blur-md border-b border-[var(--terra-border)] transition-colors duration-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
    
    <!-- Brand Title & Subtitle -->
    <div class="flex items-center gap-3">
      <div class="w-2.5 h-8 bg-[var(--terra-accent-primary)] terra-cut-tr shadow-md"></div>
      <div>
        <h1 class="font-mono font-bold tracking-widest text-sm sm:text-base uppercase text-[var(--terra-text-primary)] flex items-center gap-2">
          <span>{t.nav.brandTitle}</span>
          <span class="text-[10px] px-1.5 py-0.2 bg-[var(--terra-accent-primary-dim)] text-[var(--terra-accent-primary)] border border-[var(--terra-border-strong)] font-semibold">v0.8.0</span>
        </h1>
        <p class="font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider">
          {t.nav.brandSubtitle}
        </p>
      </div>
    </div>

    <!-- View Mode Switcher: [LIVE DEMO | DOCS // PLAYPEN] -->
    <div class="flex items-center p-0.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border-strong)] terra-cut-tr shadow-sm">
      <button
        type="button"
        onclick={() => { viewMode = 'demo'; if (window.location.hash.startsWith('#/docs')) window.location.hash = '' }}
        class="px-2.5 py-1 text-xs font-mono font-bold tracking-wider transition-all {viewMode === 'demo' ? 'bg-[var(--terra-accent-primary)] text-black shadow-xs' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
      >
        {i18n.locale === 'zh' ? '实机展台' : 'LIVE DEMO'}
      </button>
      <button
        type="button"
        onclick={() => { viewMode = 'docs'; window.location.hash = '#/docs/overview' }}
        class="px-2.5 py-1 text-xs font-mono font-bold tracking-wider transition-all {viewMode === 'docs' ? 'bg-[var(--terra-accent-primary)] text-black shadow-xs' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
      >
        {i18n.locale === 'zh' ? '交互文档' : 'DOCS // PLAYPEN'}
      </button>
    </div>

    <!-- Quick Jump Section Navigation Links (Only in Demo Mode) -->
    {#if viewMode === 'demo'}
      <nav class="hidden md:flex items-center gap-1 bg-[var(--terra-bg-surface)] p-1 border border-[var(--terra-border)] terra-cut-tr">
        <button
          type="button"
          onclick={() => scrollToSection('section-01')}
          class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '01' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          {t.nav.sec01}
        </button>
        <button
          type="button"
          onclick={() => scrollToSection('section-02')}
          class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '02' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          {t.nav.sec02}
        </button>
        <button
          type="button"
          onclick={() => scrollToSection('section-03')}
          class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all {activeSection === '03' ? 'bg-[var(--terra-accent-primary)] text-black' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          {t.nav.sec03}
        </button>
        <button
          type="button"
          onclick={() => scrollToSection('section-legal')}
          class="px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-all text-[var(--terra-accent-primary)] hover:bg-[var(--terra-accent-primary)] hover:text-black border-l border-[var(--terra-border)] ml-1 pl-2"
          title="View Legal Disclaimer & Attribution"
        >
          [{t.nav.legal}]
        </button>
      </nav>
    {/if}

    <!-- Theme, Mode, Language & Replay Controls -->
    <div class="flex flex-wrap items-center gap-2">
      
      <!-- Legal Disclaimer Quick Jump Button -->
      <button
        type="button"
        onclick={() => scrollToSection('section-legal')}
        title="View Legal Disclaimer & Attribution"
        class="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] hover:border-[var(--terra-accent-primary)] font-mono text-xs font-bold text-[var(--terra-accent-primary)] terra-cut-tr shadow-sm transition-all active:scale-95"
      >
        <span class="text-xs">📜</span>
        <span class="hidden xl:inline">{t.nav.legal}</span>
        <span class="xl:hidden">LEGAL</span>
      </button>

      <!-- Replay Boot Button -->
      <button
        type="button"
        onclick={replayBootSequence}
        title="Replay authentic 2.2s initial boot sequence"
        class="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] hover:border-[var(--terra-border-accent)] font-mono text-xs font-bold text-[var(--terra-text-primary)] terra-cut-tr shadow-sm transition-all active:scale-95"
      >
        <span class="text-[var(--terra-accent-primary)] text-sm">↺</span>
        <span class="hidden sm:inline">{t.nav.replayBoot}</span>
      </button>

      <!-- Language Switcher [EN | 中文] (TICKET-02) -->
      <div class="flex items-center p-0.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr shadow-sm">
        <button
          type="button"
          onclick={() => i18n.setLocale('en')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {i18n.locale === 'en' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          EN
        </button>
        <button
          type="button"
          onclick={() => i18n.setLocale('zh')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {i18n.locale === 'zh' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          中文
        </button>
      </div>

      <!-- Color Spectrum Switcher -->
      <div class="flex items-center p-0.5 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr shadow-sm">
        <button
          type="button"
          onclick={() => switchTheme('cyan')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'cyan' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          CYAN // {t.nav.themes.cyan}
        </button>
        <button
          type="button"
          onclick={() => switchTheme('amber')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'amber' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          AMBER // {t.nav.themes.amber}
        </button>
        <button
          type="button"
          onclick={() => switchTheme('emerald')}
          class="px-2 py-0.5 text-xs font-mono font-bold transition-all {currentTheme === 'emerald' ? 'bg-[var(--terra-accent-primary)] text-black shadow-sm' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)]'}"
        >
          EMERALD // {t.nav.themes.emerald}
        </button>
      </div>

      <!-- Dark / Light Mode Toggle -->
      <button
        type="button"
        onclick={toggleMode}
        class="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] font-mono text-xs font-bold text-[var(--terra-text-primary)] hover:border-[var(--terra-border-accent)] terra-cut-tr shadow-sm transition-all active:scale-95"
      >
        {#if currentMode === 'dark'}
          <span>{t.nav.dark}</span>
        {:else}
          <span>{t.nav.light}</span>
        {/if}
      </button>

      <!-- Real-time Performance Indicator -->
      <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] font-mono text-[11px] terra-cut-tr shadow-sm">
        <TerraStatusBeacon status="online" label={t.nav.nominal} />
        <span class="text-[var(--terra-text-muted)]">|</span>
        <span class="text-[var(--terra-text-secondary)]">{t.nav.fps}: <strong class="text-[var(--terra-accent-primary)]">{fps}</strong></span>
      </div>
    </div>

  </div>
</header>

{#if viewMode === 'docs'}
  <TerraDocsView
    locale={i18n.locale}
    onSwitchToDemo={() => {
      viewMode = 'demo'
      if (window.location.hash.startsWith('#/docs')) {
        window.location.hash = ''
      }
    }}
  />
{:else}
<!-- ======================================================================
     2. RIGHT-SIDE FIXED VERTICAL INDICATOR TRACK (Snap Scroll Rail)
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
        {t.nav.sec01}
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
        {t.nav.sec02}
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
        {t.nav.sec03}
      </span>
    </button>
  </div>

  <div class="text-[9px] text-[var(--terra-text-muted)] tracking-tighter">NAV</div>
</aside>

<!-- ======================================================================
     3. VERTICAL SNAP-SCROLL MAIN CONTAINER
     ====================================================================== -->
<main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 snap-y snap-proximity">

  <!-- ====================================================================
       SECTION 01: 2D FLAT TACTICAL SYSTEM
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
      <span>{t.sec01.tag}</span>
    </div>

    <!-- Hero Display Title -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--terra-border)]">
      <div class="space-y-2">
        <div class="flex items-center gap-2 font-mono text-xs text-[var(--terra-accent-primary)] tracking-widest uppercase">
          <span>{t.sec01.deskTag}</span>
          <span>•</span>
          <span>{t.sec01.swissGridTag}</span>
          <span>•</span>
          <span class="font-bold">[{currentMode.toUpperCase()}]</span>
        </div>
        
        <h2 class="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-none text-[var(--terra-text-primary)]">
          {t.sec01.title}
        </h2>
        <p class="font-mono text-xs text-[var(--terra-text-secondary)] tracking-wide">
          {t.sec01.sub}
        </p>
      </div>

      <div class="flex flex-col items-start md:items-end gap-2">
        <TerraBarcode
          code="TERRA-SYS-01"
          serial="K0MARU-ARCH"
          height={28}
        />
        <div class="flex gap-2">
          <TerraBadge label={t.sec01.badgeFlat} code="GRID" variant="primary" />
          <TerraBadge label={t.sec01.badgeZeroClutter} code="MIN" variant="outline" />
        </div>
      </div>
    </div>

    <!-- Developer & Engineering Info Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 p-3 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr">
      <div class="flex items-center gap-2 font-mono text-xs">
        <span class="text-[var(--terra-accent-primary)] font-bold">{t.sec01.unitsTitle}</span>
        <span class="text-[var(--terra-text-muted)]">{t.sec01.unitsSub}</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="px-3 py-1 font-mono text-xs font-bold bg-[var(--terra-accent-primary)] text-black border border-[var(--terra-accent-primary)] shadow-sm">
          [K0maru] <span class="text-[10px] opacity-80">// Lead Maintainer</span>
        </span>
        <span class="px-2.5 py-1 font-mono text-xs text-[var(--terra-text-muted)] border border-[var(--terra-border)]">
          9 Repositories // Open Source
        </span>
      </div>
    </div>

    <!-- 2D Operations Command Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Developer Profile Card (6 cols) -->
      <div class="lg:col-span-6 flex flex-col justify-between">
        <TerraProfileCard class="h-full" />
      </div>

      <!-- Swiss Operations Command Bay (6 cols) -->
      <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
        <TerraPanel title={t.sec01.profileTitle} tag="// SYS.OPS" cut="tr-bl" bracket={false}>
          <div class="space-y-4">
            
            <!-- Directive Input & Execution -->
            <div class="space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec01.directiveDispatch}
              </span>
              <div class="flex flex-col sm:flex-row gap-2">
                <div class="flex-1">
                  <TerraInput
                    bind:value={commandInput}
                    placeholder={t.sec01.queryPlaceholder}
                    prefix="SYS//OPS>"
                  />
                </div>
                <TerraButton variant="primary" size="md" cut="tr" onclick={handleCommandExecute}>
                  {t.sec01.executeCmd}
                </TerraButton>
              </div>
            </div>

            <!-- Clearance & Security Badges Matrix -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec01.clearanceTitle}
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <TerraBadge label={t.sec01.clearAuthorized} code="ADM" variant="primary" />
                <TerraBadge label={t.sec01.clearHighVolt} code="SYS" variant="warning" />
                <TerraBadge label={t.sec01.clearCorrosion} code="SEC" variant="danger" />
                <TerraBadge label={t.sec01.clearLinked} code="API" variant="success" />
                <TerraBadge label={t.sec01.clearV2} code="VER" variant="outline" />
              </div>
            </div>

            <!-- System Operations Actions -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec01.actuatorsTitle}
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <TerraButton variant="primary" size="sm" cut="tr-bl" onclick={handleCommandExecute}>
                  {t.sec01.executeFull}
                </TerraButton>
                <TerraButton variant="outline" size="sm" cut="tl-br" onclick={handleSyncCluster}>
                  {t.sec01.overrideLink}
                </TerraButton>
                <TerraButton variant="danger" size="sm" cut="tr" onclick={handleResetBuffer}>
                  {t.sec01.purgeCorrosion}
                </TerraButton>
              </div>
            </div>

            <!-- Status Beacon Diagnostics -->
            <div class="pt-3 border-t border-[var(--terra-border)] grid grid-cols-2 sm:grid-cols-4 gap-3">
              <TerraStatusBeacon status="online" label={t.sec01.nominal} />
              <TerraStatusBeacon status="standby" label={t.sec01.idle} />
              <TerraStatusBeacon status="alert" label={t.sec01.alert} />
              <TerraStatusBeacon status="offline" label={t.sec01.offline} pulse={false} />
            </div>

            <!-- Terminal Output Log Stream -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-1 bg-black/30 p-2.5 font-mono text-[10px] border border-[var(--terra-border)]">
              <div class="text-[var(--terra-accent-primary)] font-bold flex items-center justify-between pb-1 border-b border-[var(--terra-border)]">
                <span>{t.sec01.logTitle}</span>
                <span class="text-[8px] text-[var(--terra-text-muted)]">{t.sec01.logStream}</span>
              </div>
              <div class="space-y-1 pt-1 h-24 overflow-y-auto">
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

    <!-- 2D Tactical Native Charts Display (TICKET-02 in Section 01) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
      <!-- 2D Histogram Bar Chart (6 cols) -->
      <div class="lg:col-span-6">
        <TerraPanel title={t.sec01.chart1Title} tag={t.sec01.chart1Sub} cut="tr-bl">
          <TerraBarChart
            data={subsystemBarData}
            height={160}
            unit="%"
          />
        </TerraPanel>
      </div>

      <!-- 2D Waveform Line Chart (6 cols) -->
      <div class="lg:col-span-6">
        <TerraPanel title={t.sec01.chart2Title} tag={t.sec01.chart2Sub} cut="tl-br">
          <TerraLineChart
            data={signalTelemetryData}
            height={160}
            unit="MB/s"
          />
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
        <span>{t.sec01.scrollDown}</span>
        <span class="animate-bounce">↓</span>
      </button>
    </div>
  </section>

  <!-- ====================================================================
       SECTION 02: 3D SPATIAL & INDUSTRIAL COMPLEX
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
      <span>{t.sec02.tag}</span>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[var(--terra-border)]">
      <div>
        <h3 class="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[var(--terra-text-primary)]">
          {t.sec02.title}
        </h3>
        <p class="font-mono text-xs text-[var(--terra-text-muted)] mt-1">
          {t.sec02.sub}
        </p>
      </div>
      <TerraButton variant="outline" size="sm" onclick={cycleMetrics}>
        {t.sec02.cycleBtn}
      </TerraButton>
    </div>

    <!-- 3D Spatial Cards Grid: Prominently Showcasing TerraSpatialCard -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Card A: 3D Tactical Donut Radar Chart in Spatial Card (7 cols) -->
      <div class="lg:col-span-7">
        <TerraSpatialCard
          cut="tr-bl"
          maxRotation={16}
          perspective={1000}
          sheen={true}
          class="h-full"
        >
          <!-- Floating Title Header in 3D Space -->
          <div class="flex items-center justify-between pb-3 mb-4 border-b border-[var(--terra-border)]" style="transform: translateZ(30px);">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-[var(--terra-accent-primary)] animate-pulse"></span>
              <h4 class="font-mono text-xs font-bold tracking-widest uppercase text-[var(--terra-text-primary)]">
                {t.sec02.radarTitle}
              </h4>
            </div>
            <TerraBadge label={t.sec02.radarBadge} code="Z-DEPTH" variant="primary" />
          </div>

          <!-- Donut Chart component with interactive hover & center readout -->
          <div class="py-2" style="transform: translateZ(40px);">
            <TerraDonutChart
              data={spatialDonutData}
              size={220}
              thickness={22}
              title={t.sec02.donutTitle}
              unit="%"
            />
          </div>

          <!-- Bottom Micro-specifications Floating in 3D Space -->
          <div class="pt-3 mt-4 border-t border-[var(--terra-border)] flex items-center justify-between font-mono text-[9px] text-[var(--terra-text-muted)]" style="transform: translateZ(20px);">
            <span>{t.sec02.radarTilt}</span>
            <span class="text-[var(--terra-accent-primary)] font-semibold">{t.sec02.radarSheen}</span>
          </div>
        </TerraSpatialCard>
      </div>

      <!-- Card B: 3D Industrial Telemetry & Rolling Dials (5 cols) -->
      <div class="lg:col-span-5 flex flex-col justify-between gap-6">
        <TerraSpatialCard
          cut="tl-br"
          maxRotation={18}
          perspective={950}
          sheen={true}
          class="h-full flex flex-col justify-between"
        >
          <div style="transform: translateZ(32px);">
            <div class="flex items-center justify-between pb-2 mb-3 border-b border-[var(--terra-border)]">
              <span class="font-mono text-xs font-bold tracking-wider text-[var(--terra-text-primary)] uppercase">
                {t.sec02.dialsTitle}
              </span>
              <TerraStatusBeacon status="online" label={t.sec02.dialsActive} />
            </div>

            <!-- Rolling Numbers in 3D Space -->
            <div class="space-y-4 my-2">
              <div class="p-3 bg-[var(--terra-bg-base)]/60 border border-[var(--terra-border)]">
                <span class="font-mono text-[10px] text-[var(--terra-text-muted)] block">{t.sec02.flowTitle}</span>
                <div class="flex items-baseline justify-between mt-1">
                  <TerraRollingNumber value={metricEfficiency} decimals={2} suffix="%" class="text-3xl font-black text-[var(--terra-accent-primary)]" />
                  <TerraBadge label={t.sec02.flowBadge} variant="primary" />
                </div>
              </div>

              <div class="p-3 bg-[var(--terra-bg-base)]/60 border border-[var(--terra-border)]">
                <span class="font-mono text-[10px] text-[var(--terra-text-muted)] block">{t.sec02.latencyTitle}</span>
                <div class="flex items-baseline justify-between mt-1">
                  <TerraRollingNumber value={metricLatency} decimals={1} suffix="ms" class="text-3xl font-black text-[var(--terra-accent-secondary)]" />
                  <TerraBadge label={t.sec02.latencyBadge} variant="success" />
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom floating action trigger -->
          <div class="pt-3 border-t border-[var(--terra-border)] flex items-center justify-between" style="transform: translateZ(38px);">
            <TerraBarcode code="SPATIAL-BUS-3D" serial="Z40-SHEEN" height={18} />
            <TerraButton variant="primary" size="sm" cut="tr" onclick={cycleMetrics}>
              {t.sec02.refreshTelemetry}
            </TerraButton>
          </div>
        </TerraSpatialCard>
      </div>

    </div>

    <!-- Energy Bus Section (Recessed Industrial Chassis) -->
    <div>
      <TerraPanel title={t.sec02.busTitle} tag="// BUS.POWER" cut="tr-bl" bracket={true} warning={true}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div class="space-y-4">
            <TerraSegmentBar
              bind:value={energyBusValue}
              total={10}
              label={t.sec02.busMain}
              sublabel={`⚡ 480V THREE-PHASE // MAIN BUS LOAD ${Math.round((energyBusValue / 10) * 100)}% // NOMINAL`}
            />
            <TerraSegmentBar
              value={9}
              total={12}
              label={t.sec02.busBurst}
              sublabel={t.sec02.busBurstSub}
            />
          </div>
          <div class="font-mono text-xs text-[var(--terra-text-muted)] space-y-1">
            {#each t.sec02.busNotes as note}
              <p>{note}</p>
            {/each}
          </div>
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
        <span>{t.sec02.scrollDown}</span>
        <span class="animate-bounce">↓</span>
      </button>
    </div>
  </section>

  <!-- ====================================================================
       SECTION 03: UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB
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
      <span>{t.sec03.tag}</span>
    </div>

    <div class="pb-4 border-b border-[var(--terra-border)]">
      <h3 class="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[var(--terra-text-primary)]">
        {t.sec03.title}
      </h3>
      <p class="font-mono text-xs text-[var(--terra-text-muted)] mt-1">
        {t.sec03.sub}
      </p>
    </div>

    <!-- Dual-Track Primitives Matrix (Left: 2D Flat / Right: 3D Spatial) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Track A: 2D Graphic Primitives & Charts (6 cols) -->
      <div class="lg:col-span-6 space-y-6">
        <TerraPanel title={t.sec03.panel2DTitle} tag="// AXIS-2D" cut="tr-bl" bracket={false}>
          <div class="space-y-5">
            
            <!-- 1. Buttons Matrix -->
            <div class="space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.btnMatrixTitle}
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <TerraButton variant="primary" cut="tr-bl" size="sm">{t.sec03.btnPrimary}</TerraButton>
                <TerraButton variant="outline" cut="tl-br" size="sm">{t.sec03.btnOutline}</TerraButton>
                <TerraButton variant="ghost" cut="none" size="sm">{t.sec03.btnGhost}</TerraButton>
                <TerraButton variant="danger" cut="tr" size="sm">{t.sec03.btnDanger}</TerraButton>
                <TerraButton variant="primary" size="md">{t.sec03.btnMedium}</TerraButton>
                <TerraButton variant="outline" size="lg" cut="tr">{t.sec03.btnLarge}</TerraButton>
                <TerraButton variant="outline" size="sm" disabled>{t.sec03.btnDisabled}</TerraButton>
              </div>
            </div>

            <!-- 2. Badges Matrix -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.badgeMatrixTitle}
              </span>
              <div class="flex flex-wrap items-center gap-2">
                <TerraBadge label={t.sec03.badgePrimary} code="PRM" variant="primary" />
                <TerraBadge label={t.sec03.badgeWarning} code="WRN" variant="warning" />
                <TerraBadge label={t.sec03.badgeDanger} code="DNG" variant="danger" />
                <TerraBadge label={t.sec03.badgeSuccess} code="SUC" variant="success" />
                <TerraBadge label={t.sec03.badgeOutline} code="OUT" variant="outline" />
              </div>
            </div>

            <!-- 3. Status Beacons -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.beaconMatrixTitle}
              </span>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <TerraStatusBeacon status="online" label={t.sec03.beaconOnline} />
                <TerraStatusBeacon status="standby" label={t.sec03.beaconStandby} />
                <TerraStatusBeacon status="alert" label={t.sec03.beaconAlert} />
                <TerraStatusBeacon status="offline" label={t.sec03.beaconOffline} pulse={false} />
              </div>
            </div>

            <!-- 4. Barcodes -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.barcodeMatrixTitle}
              </span>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <TerraBarcode code="TERRA-2D-STD" serial="SER-8492" height={22} />
                <TerraBarcode code="SYSTEM-SECURITY" serial="LV-04" height={22} />
              </div>
            </div>

            <!-- 5. Inputs -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.inputMatrixTitle}
              </span>
              <TerraInput bind:value={customMatrixInput} prefix="AXIS-2D//>" placeholder={t.sec03.inputPlaceholder} />
            </div>

            <!-- 6. Compact Line Chart -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.oscTitle}
              </span>
              <TerraLineChart
                data={signalTelemetryData.slice(0, 5)}
                height={120}
              />
            </div>

          </div>
        </TerraPanel>
      </div>

      <!-- Track B: 3D Spatial & Industrial Primitives (6 cols) -->
      <div class="lg:col-span-6 space-y-6">
        <TerraPanel title={t.sec03.panel3DTitle} tag="// AXIS-3D" cut="tl-br" bracket={true}>
          <div class="space-y-5">
            
            <!-- 1. Mini Spatial Card Demonstration -->
            <div class="space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.spatialCardTitle}
              </span>
              <TerraSpatialCard cut="tr-bl" maxRotation={15} perspective={800} class="p-1">
                <div class="flex items-center justify-between" style="transform: translateZ(25px);">
                  <div>
                    <span class="font-mono text-xs font-bold text-[var(--terra-text-primary)] block">
                      {t.sec03.tiltChassis}
                    </span>
                    <span class="font-mono text-[10px] text-[var(--terra-text-muted)]">
                      {t.sec03.parallaxDesc}
                    </span>
                  </div>
                  <TerraBadge label="3D HOVER" code="ACT" variant="primary" />
                </div>
              </TerraSpatialCard>
            </div>

            <!-- 2. Recessed Energy Segment Bar -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.segBarTitle}
              </span>
              <TerraSegmentBar
                value={energyBusValue}
                total={10}
                label={t.sec03.segBarLabel}
                sublabel={t.sec03.segBarSub}
              />
            </div>

            <!-- 3. Vertical Tabs & Floating Cursor -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.vtabsTitle}
              </span>
              <TerraVerticalTabs
                items={sectorTabs}
                bind:selectedKey={selectedSector}
                itemHeight="2.4rem"
                itemGap="0.3rem"
              />
            </div>

            <!-- 4. Corner Brackets & Cad Pattern Preview -->
            <div class="pt-3 border-t border-[var(--terra-border)] space-y-2">
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider block">
                {t.sec03.bracketsTitle}
              </span>
              <TerraCornerBrackets label="[HUD.CAD // TARGET_GRID]" size="sm" active={true}>
                <TerraCadPattern patternSize={40} opacity={0.25} hoverHighlight={true}>
                  <div class="p-3 bg-black/40 text-center font-mono text-[10px] text-[var(--terra-text-secondary)]">
                    {t.sec03.bracketsHud}
                  </div>
                </TerraCadPattern>
              </TerraCornerBrackets>
            </div>

          </div>
        </TerraPanel>
      </div>

    </div>

    <!-- Interactive Parametric Calibration Lab -->
    <div>
      <TerraCornerBrackets label="[SEC-03 // PARAMETRIC CALIBRATION LAB]" glow={true} active={true}>
        <TerraCadPattern patternSize={110} opacity={0.14}>
          <TerraPanel title={t.sec03.labTitle} tag="// HUD.DEBUG" cut="tr-bl" bracket={false}>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              <!-- Sector Navigation: 4 cols -->
              <div class="md:col-span-4 space-y-4">
                <div class="flex items-center justify-between font-mono text-xs">
                  <span class="text-[var(--terra-text-muted)]">{t.sec03.sectorsTitle}</span>
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
                    <span class="font-mono text-xs text-[var(--terra-text-primary)] block">{t.sec03.contourLabel}</span>
                    <span class="font-mono text-[10px] text-[var(--terra-text-muted)]">{t.sec03.contourSub}</span>
                  </div>
                  <TerraButton
                    size="sm"
                    variant={contourEnabled ? 'primary' : 'outline'}
                    onclick={() => contourEnabled = !contourEnabled}
                  >
                    {contourEnabled ? t.sec03.visible : t.sec03.hidden}
                  </TerraButton>
                </div>
              </div>

              <!-- Vertical Tactical Sliders Bay: 3 cols -->
              <div class="md:col-span-3 flex flex-col items-center justify-between p-5 bg-[var(--terra-bg-surface-active)]/30 border border-[var(--terra-border)] rounded-xs self-stretch min-h-[19rem]">
                <span class="font-mono text-[10px] text-[var(--terra-text-muted)] uppercase tracking-wider mb-2 text-center">
                  {t.sec03.sliderTitle}
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
                    label={t.sec03.chamferLabel}
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
                    label={t.sec03.zoomLabel}
                    unit="%"
                    fluidDecorations={true}
                  />
                </div>
                <span class="font-mono text-[9px] text-[var(--terra-text-muted)] mt-2 text-center">
                  {t.sec03.gpuHint}
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
                            {t.sec03.statusLabel} <strong class="text-[var(--terra-text-primary)]">{sectorTelemetry.status}</strong>
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
                          {t.sec03.chamferVal} <span class="text-[var(--terra-accent-primary)] font-bold">{cutSize}px</span> |
                          {t.sec03.zoomVal} <span class="text-[var(--terra-accent-primary)] font-bold">{zoomFactor}%</span>
                        </div>
                        <div class="text-[var(--terra-text-muted)] uppercase">
                          {t.sec03.themeVal} <span class="text-[var(--terra-text-primary)] font-bold">{currentTheme}</span>
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
         LEGAL DISCLAIMER & INSPIRATION ATTRIBUTION PANEL (TICKET-03)
         ================================================================== -->
    <div id="section-legal" class="pt-8 scroll-mt-24">
      <TerraCornerBrackets label="[LEGAL & INSPIRATION ATTRIBUTION]" size="sm" active={true}>
        <div class="p-6 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tl-br shadow-xl space-y-6">
          
          <!-- Top Tag & Clearance Level -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--terra-border)] pb-4">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-6 bg-[var(--terra-accent-primary)] terra-cut-tr"></span>
              <div>
                <h3 class="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-[var(--terra-text-primary)]">
                  {t.footer.disclaimerTag}
                </h3>
                <span class="font-mono text-[10px] text-[var(--terra-text-muted)] tracking-wider">
                  NON-COMMERCIAL // ACADEMIC RESEARCH & UI/UX EXPLORATION ONLY
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <TerraBadge variant="outline" label="ZERO RUNTIME CLUTTER" code="OK" />
              <TerraBadge variant="primary" label="NO ASSET UNPACKING" code="SEC" />
            </div>
          </div>

          <!-- Main Legal Disclaimer Text -->
          <div class="bg-[var(--terra-bg-base)]/70 border-l-2 border-[var(--terra-accent-primary)] p-4 font-mono text-xs sm:text-sm text-[var(--terra-text-secondary)] leading-relaxed space-y-2">
            <div class="text-[11px] font-bold text-[var(--terra-accent-primary)] uppercase tracking-wider">
              ◤ NOTICE // INTELLECTUAL PROPERTY & ETHICAL BOUNDARY ◢
            </div>
            <p class="text-[var(--terra-text-primary)] leading-relaxed">
              {t.footer.disclaimerText}
            </p>
          </div>

          <!-- Primary References & Citation Links -->
          <div class="space-y-3 pt-1">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span class="font-mono text-xs font-bold uppercase tracking-wider text-[var(--terra-accent-primary)] flex items-center gap-2">
                <span>🔗</span>
                <span>{t.footer.refTitle}</span>
              </span>
              <span class="font-mono text-[10px] text-[var(--terra-text-muted)]">
                EXTERNAL VERIFICATION (OPENS NEW WINDOW)
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {#each t.footer.refLinks as ref}
                <TerraButton
                  variant="outline"
                  size="sm"
                  onclick={() => window.open(ref.url, '_blank', 'noopener,noreferrer')}
                  class="w-full justify-between text-left py-2 hover:border-[var(--terra-accent-primary)]"
                >
                  <span class="truncate font-mono text-xs font-semibold">{ref.label}</span>
                  <span class="text-[9px] px-1.5 py-0.5 bg-[var(--terra-bg-base)] text-[var(--terra-accent-primary)] border border-[var(--terra-border)] shrink-0 ml-2">
                    {ref.badge} ↗
                  </span>
                </TerraButton>
              {/each}
            </div>
          </div>

        </div>
      </TerraCornerBrackets>
    </div>

    <!-- ==================================================================
         FOOTER
         ================================================================== -->
    <footer class="pt-8 border-t border-[var(--terra-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--terra-text-muted)]">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[var(--terra-accent-primary)]"></span>
        <span>{t.footer.systemName}</span>
      </div>
      <div class="flex items-center gap-4">
        <span>{t.footer.themes}</span>
        <span>{t.footer.transition}</span>
        <span>{t.footer.interaction}</span>
      </div>
    </footer>
  </section>

</main>
{/if}
