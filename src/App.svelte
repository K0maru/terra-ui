<script lang="ts">
  import { onMount } from 'svelte'
  import { Spring } from 'svelte/motion'
  import { ArrowUpRight, Check, Crosshair, Moon, Pause, Play, RotateCcw, Sun } from 'lucide-svelte'
  import {
    TerraAmbientField,
    TerraAsciiStage,
    TerraBadge,
    TerraBarChart,
    TerraButton,
    TerraInput,
    TerraLineChart,
    TerraPanel,
    TerraRollingNumber,
    TerraStatusBeacon,
    TerraStatusStrip,
    TerraVernierMeter,
    TerraVerticalTabs,
    TERRA_THEMES,
    i18n,
    magnetic,
    scrollReveal,
    stepSpring,
    withThemeSwitch,
    withViewTransition,
    type SpringState,
    type TerraColorMode,
    type TerraThemeId
  } from './lib'
  import TerraDocsView from './docs/TerraDocsView.svelte'

  const t = $derived(i18n.t)
  const isZh = $derived(i18n.locale === 'zh')

  let viewMode = $state<'demo' | 'docs'>('demo')
  let currentTheme = $state<TerraThemeId>('vermilion')
  let currentMode = $state<TerraColorMode>('dark')
  let headlineKey = $state(0)
  let marqueeRunning = $state(true)
  let crosshairEnabled = $state(true)

  const currentThemeMeta = $derived(
    TERRA_THEMES.find((item) => item.id === currentTheme) ?? TERRA_THEMES[0]
  )

  let throughput = $state(42.8)
  let latency = $state(1.4)
  let uptime = $state(99.98)

  function sampleMetrics() {
    throughput = +(36 + Math.random() * 18).toFixed(1)
    latency = +(0.9 + Math.random() * 1.4).toFixed(1)
    uptime = +(99.88 + Math.random() * 0.11).toFixed(2)
  }

  let scrollFallbackRatio = $state(0)
  let supportsScrollTimeline = $state(true)

  let crosshairEl: HTMLDivElement | undefined = $state()
  let pointerHoverInteractive = $state(false)

  let targetMouseX = -200
  let targetMouseY = -200
  const crosshairX: SpringState = { x: -200, v: 0 }
  const crosshairY: SpringState = { x: -200, v: 0 }
  let crosshairRaf = 0
  let lastCrosshairNow = 0

  function stepCrosshair(now: number) {
    crosshairRaf = 0
    if (!crosshairEnabled || viewMode !== 'demo' || document.hidden || !crosshairEl) {
      return
    }
    const dt = lastCrosshairNow ? (now - lastCrosshairNow) / 1000 : 1 / 60
    lastCrosshairNow = now

    const sx = stepSpring(crosshairX, targetMouseX, dt, 420, 30)
    const sy = stepSpring(crosshairY, targetMouseY, dt, 420, 30)
    crosshairEl.style.transform = `translate3d(${crosshairX.x.toFixed(1)}px, ${crosshairY.x.toFixed(1)}px, 0)`
    crosshairEl.style.opacity = '1'

    if (!sx || !sy) {
      crosshairRaf = requestAnimationFrame(stepCrosshair)
    }
  }

  function handleWindowPointerMove(e: PointerEvent) {
    if (e.pointerType === 'touch' || !crosshairEnabled || viewMode !== 'demo') return
    if (crosshairX.x < -100) {
      crosshairX.x = e.clientX
      crosshairY.x = e.clientY
      crosshairX.v = 0
      crosshairY.v = 0
    }
    targetMouseX = e.clientX
    targetMouseY = e.clientY
    const el = e.target as HTMLElement | null
    pointerHoverInteractive = Boolean(
      el?.closest('button, a, input, [role="tab"], [role="slider"]')
    )
    if (crosshairRaf === 0) {
      lastCrosshairNow = performance.now()
      crosshairRaf = requestAnimationFrame(stepCrosshair)
    }
  }

  function handleWindowPointerLeave() {
    if (crosshairEl) {
      crosshairEl.style.opacity = '0'
    }
    if (crosshairRaf !== 0) {
      cancelAnimationFrame(crosshairRaf)
      crosshairRaf = 0
    }
  }

  function handleWindowMouseOut(e: MouseEvent) {
    if (e.relatedTarget === null) {
      handleWindowPointerLeave()
    }
  }

  function applyTheme(next: TerraThemeId) {
    if (next === currentTheme) return
    withThemeSwitch(() => {
      currentTheme = next
      document.documentElement.setAttribute('data-theme', next)
    })
  }

  function toggleMode(origin?: { x: number; y: number }) {
    const next: TerraColorMode = currentMode === 'dark' ? 'light' : 'dark'
    withViewTransition(
      () => {
        currentMode = next
        document.documentElement.setAttribute('data-mode', next)
      },
      origin,
      'sweep'
    )
  }

  function switchView(next: 'demo' | 'docs') {
    if (next === viewMode) return
    withViewTransition(
      () => {
        viewMode = next
        window.location.hash = next === 'docs' ? '#/docs/overview' : ''
      },
      undefined,
      'fade'
    )
  }

  type SpecimenId = 'button' | 'tabs' | 'meter' | 'input' | 'surface'
  let highlightedSpecimen = $state<SpecimenId>('button')
  let activeSpecimen = $state<SpecimenId>('button')
  const currentSpecimen = $derived(
    t.editorial.specimens.find((s) => s.id === activeSpecimen) ?? t.editorial.specimens[0]
  )

  let indexListEl: HTMLDivElement | undefined = $state()
  let rowEls: Array<HTMLButtonElement | null> = $state([null, null, null, null, null])
  const lensTop = new Spring(0, { stiffness: 0.14, damping: 0.78 })
  const lensBottom = new Spring(360, { stiffness: 0.14, damping: 0.78 })
  let lensInitialized = false

  function syncLens(instant = false) {
    if (!indexListEl) return
    const listH = indexListEl.clientHeight
    const idx = Math.max(
      0,
      t.editorial.specimens.findIndex((s) => s.id === highlightedSpecimen)
    )
    const el = rowEls[idx]
    if (!el || listH <= 0) return
    const nextTop = el.offsetTop
    const nextBottom = Math.max(0, listH - (el.offsetTop + el.offsetHeight))
    if (!lensInitialized || instant) {
      lensTop.set(nextTop, { instant: true })
      lensBottom.set(nextBottom, { instant: true })
      lensInitialized = true
    } else {
      lensTop.target = nextTop
      lensBottom.target = nextBottom
    }
  }

  $effect(() => {
    void highlightedSpecimen
    void isZh
    syncLens(false)
  })

  let hoverIntentTimer: ReturnType<typeof setTimeout> | null = null

  function cancelHoverIntent() {
    if (hoverIntentTimer !== null) {
      clearTimeout(hoverIntentTimer)
      hoverIntentTimer = null
    }
  }

  function handleSpecimenEnter(id: SpecimenId, e: PointerEvent) {
    if (e.pointerType === 'touch') return
    highlightedSpecimen = id
    if (id === activeSpecimen) {
      cancelHoverIntent()
      return
    }
    cancelHoverIntent()
    hoverIntentTimer = setTimeout(() => {
      activeSpecimen = id
      hoverIntentTimer = null
    }, 75)
  }

  function handleIndexListLeave() {
    cancelHoverIntent()
    highlightedSpecimen = activeSpecimen
  }

  function selectSpecimenImmediate(id: SpecimenId) {
    cancelHoverIntent()
    highlightedSpecimen = id
    activeSpecimen = id
  }

  let clickCount = $state(0)
  let selectedSector = $state('us-east')
  let meterValue = $state(72)
  let commandInput = $state('deploy --env=production')
  let toastMessage = $state<string | null>(null)

  const currentSector = $derived(t.sectors[selectedSector] ?? t.sectors['us-east'])

  function submitCommand() {
    if (!commandInput.trim()) return
    toastMessage = isZh
      ? `已下发指令: ${commandInput.trim()}`
      : `Dispatched: ${commandInput.trim()}`
    setTimeout(() => {
      toastMessage = null
    }, 2800)
  }

  const subsystemBarData = [
    { label: 'CPU-CORE', value: 64, max: 100, status: 'normal' as const },
    { label: 'MEM-POOL', value: 84, max: 100, status: 'warning' as const },
    { label: 'GPU-COMP', value: 92, max: 100, status: 'critical' as const },
    { label: 'NET-IO', value: 52, max: 100, status: 'normal' as const },
    { label: 'DISK-BUS', value: 74, max: 100, status: 'warning' as const }
  ]

  const signalTelemetryData = [
    { timestamp: '18:00', value: 38, label: 'NODE-01' },
    { timestamp: '18:15', value: 52, label: 'NODE-03' },
    { timestamp: '18:30', value: 86, label: 'PEAK-05' },
    { timestamp: '18:45', value: 68, label: 'BAL-07' },
    { timestamp: '19:00', value: 92, label: 'NODE-10' },
    { timestamp: '19:15', value: 74, label: 'DAMP-12' },
    { timestamp: '19:30', value: 61, label: 'STEADY-15' }
  ]

  const brandLetters = 'TERRA'.split('')

  $effect(() => {
    if (typeof document === 'undefined') return
    if (marqueeRunning) {
      delete document.documentElement.dataset.motion
    } else {
      document.documentElement.dataset.motion = 'paused'
    }
  })

  onMount(() => {
    document.documentElement.setAttribute('data-theme', currentTheme)
    document.documentElement.setAttribute('data-mode', currentMode)

    supportsScrollTimeline = CSS.supports('animation-timeline: scroll()')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      marqueeRunning = false
      crosshairEnabled = false
    }

    function checkHashMode() {
      viewMode = window.location.hash.startsWith('#/docs') ? 'docs' : 'demo'
    }
    checkHashMode()
    window.addEventListener('hashchange', checkHashMode)
    document.addEventListener('pointerleave', handleWindowPointerLeave)

    function onScroll() {
      if (supportsScrollTimeline) return
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      scrollFallbackRatio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const indexResizeObserver = new ResizeObserver(() => {
      syncLens(true)
    })
    if (indexListEl) {
      indexResizeObserver.observe(indexListEl)
      syncLens(true)
    }

    return () => {
      cancelHoverIntent()
      indexResizeObserver.disconnect()
      window.removeEventListener('hashchange', checkHashMode)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerleave', handleWindowPointerLeave)
      if (crosshairRaf !== 0) cancelAnimationFrame(crosshairRaf)
    }
  })
</script>

<svelte:window
  onpointermove={handleWindowPointerMove}
  onblur={handleWindowPointerLeave}
  onmouseout={handleWindowMouseOut}
/>

<div
  class="terra-editorial-canvas relative z-10 min-h-[100dvh] text-[var(--terra-text-primary)] overflow-x-clip"
>
  <TerraAmbientField />
  {#if crosshairEnabled && viewMode === 'demo'}
    <div
      bind:this={crosshairEl}
      class="terra-t-opacity pointer-events-none fixed top-0 left-0 z-[var(--terra-z-cursor)] hidden md:block opacity-0"
      aria-hidden="true"
    >
      <div
        class="terra-t-snappy -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px] rounded-full border border-[var(--terra-accent-primary)]"
        style="
          transform: scale({pointerHoverInteractive ? 1.7 : 1});
          opacity: {pointerHoverInteractive ? 0.9 : 0.45};
        "
      ></div>
    </div>
  {/if}

  {#if supportsScrollTimeline}
    <div
      class="terra-scroll-progress fixed top-0 left-0 right-0 h-[3px] z-[var(--terra-z-progress)] pointer-events-none bg-[var(--terra-accent-primary)]"
      aria-hidden="true"
    ></div>
  {:else}
    <div
      class="fixed top-0 left-0 right-0 h-[3px] z-[var(--terra-z-progress)] pointer-events-none origin-left bg-[var(--terra-accent-primary)]"
      style="transform: scaleX({scrollFallbackRatio});"
      aria-hidden="true"
    ></div>
  {/if}

  <header
    class="sticky top-0 z-[var(--terra-z-sticky-app)] h-[var(--terra-header-h)] border-b border-[var(--terra-border)] bg-[var(--terra-bg-base)]/90 backdrop-blur-md"
  >
    <div class="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-3">
      <div class="flex items-center gap-4 min-w-0">
        <a
          href="#top"
          onclick={(e) => {
            e.preventDefault()
            switchView('demo')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          class="ed-roll-word inline-flex overflow-hidden font-display text-base font-bold tracking-[-0.04em] uppercase shrink-0 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra-accent-primary)]"
        >
          {#each brandLetters as ch, idx (idx)}
            <span class="ed-roll-char relative inline-block" style="--ci: {idx};">
              <span class="block">{ch}</span>
              <span class="block absolute left-0 top-full text-[var(--terra-accent-primary)]"
                >{ch}</span
              >
            </span>
          {/each}
        </a>

        <span class="hidden xl:inline font-mono text-xs text-[var(--terra-text-muted)] truncate">
          {isZh ? currentThemeMeta.subtitleZh : currentThemeMeta.subtitleEn}
        </span>

        <div
          class="flex items-center border border-[var(--terra-border)] bg-[var(--terra-bg-surface)] p-0.5 shrink-0"
        >
          <button
            type="button"
            onclick={() => switchView('demo')}
            class="terra-t-color px-2.5 py-0.5 font-mono text-[11px] font-medium cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)] {viewMode ===
            'demo'
              ? 'bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)]'
              : 'text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}"
          >
            {t.nav.showcase}
          </button>
          <button
            type="button"
            onclick={() => switchView('docs')}
            class="terra-t-color px-2.5 py-0.5 font-mono text-[11px] font-medium cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)] {viewMode ===
            'docs'
              ? 'bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)]'
              : 'text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}"
          >
            {t.nav.docs}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <div
          class="flex items-center gap-0.5 p-0.5 border border-[var(--terra-border)] bg-[var(--terra-bg-surface)]"
        >
          {#each TERRA_THEMES as theme (theme.id)}
            {@const isCurrent = currentTheme === theme.id}
            <button
              type="button"
              onclick={() => applyTheme(theme.id)}
              title={isZh ? theme.subtitleZh : theme.subtitleEn}
              class="terra-t-color inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[11px] font-medium cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)] {isCurrent
                ? 'bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)]'
                : 'text-[var(--terra-text-muted)] hover:text-[var(--terra-text-primary)]'}"
            >
              <span
                class="w-2 h-2 rounded-full shrink-0"
                style="background-color: {currentMode === 'dark'
                  ? theme.darkSwatch
                  : theme.lightSwatch};"
              ></span>
              <span class="hidden lg:inline">{isZh ? theme.labelZh : theme.labelEn}</span>
            </button>
          {/each}
        </div>

        <div
          class="flex items-center border border-[var(--terra-border)] bg-[var(--terra-bg-surface)] p-0.5"
        >
          <button
            type="button"
            onclick={() => i18n.setLocale('zh')}
            class="terra-t-color px-1.5 py-0.5 font-mono text-[11px] font-medium cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)] {isZh
              ? 'bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)]'
              : 'text-[var(--terra-text-muted)]'}"
          >
            中文
          </button>
          <button
            type="button"
            onclick={() => i18n.setLocale('en')}
            class="terra-t-color px-1.5 py-0.5 font-mono text-[11px] font-medium cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--terra-accent-primary)] {!isZh
              ? 'bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)]'
              : 'text-[var(--terra-text-muted)]'}"
          >
            EN
          </button>
        </div>

        {#if viewMode === 'demo'}
          <button
            type="button"
            onclick={() => (crosshairEnabled = !crosshairEnabled)}
            title={isZh ? '切换跟随准星' : 'Toggle pointer crosshair'}
            aria-label="Toggle crosshair"
            class="terra-pressable hidden md:inline-flex items-center p-1.5 border border-[var(--terra-border)] cursor-pointer {crosshairEnabled
              ? 'text-[var(--terra-accent-primary)]'
              : 'text-[var(--terra-text-muted)]'}"
          >
            <Crosshair class="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onclick={() => (headlineKey += 1)}
            title={t.nav.replayType}
            class="terra-pressable hidden sm:inline-flex items-center gap-1 px-2 py-1 border border-[var(--terra-border)] text-xs font-medium text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)] cursor-pointer"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span class="hidden xl:inline">{t.nav.replayType}</span>
          </button>
        {/if}

        <button
          type="button"
          onclick={(e) => toggleMode({ x: e.clientX, y: e.clientY })}
          class="terra-pressable inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--terra-border)] text-xs font-medium cursor-pointer hover:border-[var(--terra-border-strong)]"
        >
          {#if currentMode === 'dark'}
            <Sun class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{t.nav.paper}</span>
          {:else}
            <Moon class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{t.nav.ink}</span>
          {/if}
        </button>
      </div>
    </div>
  </header>

  {#if viewMode === 'docs'}
    <TerraDocsView locale={i18n.locale} onSwitchToDemo={() => switchView('demo')} />
  {:else}
    <main id="top">
      <section class="border-b border-[var(--terra-border)]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          {#key headlineKey}
            <div
              class="lg:col-span-6 flex flex-col justify-between lg:border-r border-[var(--terra-border)]"
            >
              <div class="px-4 sm:px-8 py-10 sm:py-14 space-y-7">
                <div
                  class="terra-stage-enter flex items-center gap-2 font-mono text-xs font-medium tracking-wider uppercase text-[var(--terra-text-muted)]"
                >
                  <span class="w-2 h-2 rounded-full bg-[var(--terra-accent-primary)]"></span>
                  <span>{t.editorial.eyebrow}</span>
                </div>

                <h1
                  class="font-display text-4xl sm:text-5xl xl:text-6xl font-bold tracking-[-0.04em] leading-[1.04]"
                >
                  <span class="block overflow-hidden pb-1">
                    <span class="ed-line-reveal inline-block" style="--d: 0ms;"
                      >{t.editorial.line1}</span
                    >
                  </span>
                  <span class="block overflow-hidden pb-1">
                    <span class="ed-line-reveal inline-block" style="--d: 90ms;"
                      >{t.editorial.line2}</span
                    >
                  </span>
                  <span class="block overflow-hidden pb-1">
                    <span
                      class="ed-line-reveal inline-block text-[var(--terra-accent-primary)]"
                      style="--d: 180ms;"
                    >
                      {t.editorial.line3}
                    </span>
                  </span>
                </h1>

                <p
                  class="text-sm sm:text-base max-w-[46ch] leading-relaxed text-[var(--terra-text-secondary)]"
                >
                  {t.editorial.lead}
                </p>

                <div class="flex flex-wrap items-center gap-3 pt-1">
                  <TerraButton
                    variant="primary"
                    size="md"
                    magneticPull={true}
                    onclick={() =>
                      document.getElementById('ed-index')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span>{t.editorial.ctaExplore}</span>
                    <ArrowUpRight class="w-4 h-4" />
                  </TerraButton>

                  <TerraButton variant="outline" size="md" onclick={sampleMetrics}>
                    {t.editorial.ctaSample}
                  </TerraButton>
                </div>
              </div>

              <div
                class="grid grid-cols-3 border-t border-[var(--terra-border)] divide-x divide-[var(--terra-border)]"
              >
                <div class="px-4 sm:px-6 py-4">
                  <div
                    class="font-mono text-[10px] uppercase tracking-wider text-[var(--terra-text-muted)]"
                  >
                    {t.editorial.kpiThroughput}
                  </div>
                  <div class="mt-0.5 flex items-baseline gap-1">
                    <TerraRollingNumber
                      value={throughput}
                      decimals={1}
                      class="text-xl sm:text-2xl"
                    />
                    <span class="font-mono text-xs text-[var(--terra-text-muted)]">GB/s</span>
                  </div>
                </div>

                <div class="px-4 sm:px-6 py-4">
                  <div
                    class="font-mono text-[10px] uppercase tracking-wider text-[var(--terra-text-muted)]"
                  >
                    {t.editorial.kpiLatency}
                  </div>
                  <div class="mt-0.5 flex items-baseline gap-1">
                    <TerraRollingNumber value={latency} decimals={1} class="text-xl sm:text-2xl" />
                    <span class="font-mono text-xs text-[var(--terra-accent-primary)]">ms</span>
                  </div>
                </div>

                <div class="px-4 sm:px-6 py-4">
                  <div
                    class="font-mono text-[10px] uppercase tracking-wider text-[var(--terra-text-muted)]"
                  >
                    {t.editorial.kpiUptime}
                  </div>
                  <div class="mt-0.5">
                    <TerraRollingNumber
                      value={uptime}
                      decimals={2}
                      suffix="%"
                      class="text-xl sm:text-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          {/key}

          <div
            class="lg:col-span-6 flex flex-col border-t lg:border-t-0 border-[var(--terra-border)]"
          >
            <div
              class="px-4 py-2 border-b border-[var(--terra-border)] bg-[var(--terra-bg-surface)] flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--terra-text-muted)]"
            >
              <span>{t.editorial.plateHeaderLeft}</span>
              <span>{t.editorial.plateHeaderRight}</span>
            </div>
            <div class="flex-1">
              <TerraAsciiStage />
            </div>
          </div>
        </div>
      </section>

      <section id="ed-index" class="border-b border-[var(--terra-border)]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          <div class="lg:col-span-7 lg:border-r border-[var(--terra-border)] flex flex-col">
            <div
              class="px-4 sm:px-8 py-4 border-b border-[var(--terra-border)] flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[var(--terra-text-muted)]"
            >
              <span>{t.editorial.indexTitle}</span>
              <span>{t.editorial.indexCount}</span>
            </div>

            <div
              bind:this={indexListEl}
              role="region"
              aria-label={t.editorial.indexTitle}
              onpointerleave={handleIndexListLeave}
              class="relative divide-y divide-[var(--terra-border)]"
            >
              {#each t.editorial.specimens as item, idx (item.id)}
                {@const selected = activeSpecimen === item.id}
                <button
                  bind:this={rowEls[idx]}
                  type="button"
                  onpointerenter={(e) => handleSpecimenEnter(item.id, e)}
                  onfocus={() => selectSpecimenImmediate(item.id)}
                  onclick={() => selectSpecimenImmediate(item.id)}
                  class="w-full text-left px-4 sm:px-8 py-6 cursor-pointer flex items-center justify-between gap-4 focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--terra-accent-primary)]"
                  aria-current={selected ? 'true' : undefined}
                >
                  <div class="flex items-baseline gap-5 min-w-0">
                    <span
                      class="font-mono text-xs font-medium tabular-nums shrink-0 text-[var(--terra-text-muted)]"
                    >
                      {item.num}
                    </span>
                    <div class="min-w-0">
                      <div
                        class="font-display text-xl sm:text-2xl font-bold tracking-tight truncate text-[var(--terra-text-primary)]"
                      >
                        {item.name}
                      </div>
                      <div class="text-xs mt-0.5 truncate text-[var(--terra-text-muted)]">
                        {item.category} · {item.summary}
                      </div>
                    </div>
                  </div>

                  <ArrowUpRight class="w-5 h-5 shrink-0 text-[var(--terra-text-muted)]" />
                </button>
              {/each}

              <div
                aria-hidden="true"
                class="ed-lens-overlay pointer-events-none absolute inset-0 z-[2] divide-y divide-transparent bg-[var(--terra-text-primary)] text-[var(--terra-text-inverse)]"
                style="clip-path: inset({lensTop.current.toFixed(
                  2
                )}px 0 {lensBottom.current.toFixed(2)}px 0);"
              >
                {#each t.editorial.specimens as item (item.id)}
                  <div
                    class="w-full text-left px-4 sm:px-8 py-6 flex items-center justify-between gap-4"
                  >
                    <div class="flex items-baseline gap-5 min-w-0">
                      <span
                        class="font-mono text-xs font-medium tabular-nums shrink-0 text-[var(--terra-accent-primary)]"
                      >
                        {item.num}
                      </span>
                      <div class="min-w-0">
                        <div
                          class="font-display text-xl sm:text-2xl font-bold tracking-tight truncate"
                        >
                          {item.name}
                        </div>
                        <div class="text-xs mt-0.5 truncate opacity-80">
                          {item.category} · {item.summary}
                        </div>
                      </div>
                    </div>

                    <ArrowUpRight
                      class="w-5 h-5 shrink-0 text-[var(--terra-accent-primary)] translate-x-0.5 -translate-y-0.5"
                    />
                  </div>
                {/each}
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 px-4 sm:px-8 py-8 flex flex-col justify-between">
            <div class="lg:sticky lg:top-[calc(var(--terra-header-h)+24px)] space-y-6">
              <div
                class="flex items-center justify-between border-b border-[var(--terra-border)] pb-3"
              >
                <span
                  class="font-mono text-xs uppercase tracking-wider text-[var(--terra-text-muted)]"
                >
                  {t.editorial.stageLabel} · {currentSpecimen.num}
                </span>
                <span class="text-xs font-semibold text-[var(--terra-accent-primary)]">
                  {currentSpecimen.name}
                </span>
              </div>

              <div class="grid grid-cols-1 grid-rows-1 items-center min-h-[250px] py-2">
                <div
                  class="col-start-1 row-start-1 terra-stage-slot space-y-4"
                  data-active={activeSpecimen === 'button'}
                  inert={activeSpecimen !== 'button'}
                >
                  <div class="flex flex-wrap items-center gap-3">
                    <TerraButton
                      variant="primary"
                      magneticPull={true}
                      onclick={() => (clickCount += 1)}
                    >
                      {isZh ? `触发动作 (${clickCount})` : `Trigger (${clickCount})`}
                    </TerraButton>
                    <TerraButton variant="outline" onclick={() => (clickCount = 0)}>
                      {isZh ? '重置' : 'Reset'}
                    </TerraButton>
                    <TerraButton variant="ghost" onclick={sampleMetrics}>
                      {isZh ? '采样' : 'Sample'}
                    </TerraButton>
                  </div>
                  <p class="text-xs text-[var(--terra-text-muted)]">
                    {t.editorial.specimens[0]?.summary}
                  </p>
                </div>

                <div
                  class="col-start-1 row-start-1 terra-stage-slot space-y-4"
                  data-active={activeSpecimen === 'tabs'}
                  inert={activeSpecimen !== 'tabs'}
                >
                  <TerraVerticalTabs
                    items={t.sectorTabs}
                    bind:selectedKey={selectedSector}
                    itemHeight="2.4rem"
                  />
                  <div
                    class="p-3 border border-[var(--terra-border)] bg-[var(--terra-bg-surface)] space-y-1 text-xs"
                  >
                    <div class="font-semibold text-[var(--terra-text-primary)]">
                      {currentSector.name}
                    </div>
                    <div class="font-mono text-[11px] text-[var(--terra-text-muted)]">
                      {currentSector.coord} · {currentSector.density}
                    </div>
                  </div>
                </div>

                <div
                  class="col-start-1 row-start-1 terra-stage-slot space-y-4"
                  data-active={activeSpecimen === 'meter'}
                  inert={activeSpecimen !== 'meter'}
                >
                  <div class="flex items-baseline justify-between">
                    <span class="font-mono text-xs uppercase text-[var(--terra-text-muted)]">
                      {isZh ? '游标卡尺刻度' : 'Vernier Caliper'}
                    </span>
                    <TerraRollingNumber
                      value={meterValue}
                      decimals={0}
                      suffix="%"
                      class="text-3xl"
                    />
                  </div>
                  <TerraVernierMeter
                    bind:value={meterValue}
                    interactive={true}
                    min={0}
                    max={100}
                    ticks={25}
                    hazard={meterValue >= 88}
                  />
                  <p class="font-mono text-[11px] text-[var(--terra-text-muted)]">
                    {isZh
                      ? '直接拖拽卡尺刻度或使用左右方向键微调'
                      : 'Drag caliper directly or nudge with arrow keys'}
                  </p>
                </div>

                <form
                  onsubmit={(e) => {
                    e.preventDefault()
                    submitCommand()
                  }}
                  class="col-start-1 row-start-1 terra-stage-slot space-y-4"
                  data-active={activeSpecimen === 'input'}
                  inert={activeSpecimen !== 'input'}
                >
                  <TerraInput bind:value={commandInput} prefix="CMD>" />
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-[11px] text-[var(--terra-text-muted)]">
                      {commandInput.length} chars
                    </span>
                    <TerraButton type="submit" size="sm">
                      {isZh ? '执行指令' : 'Execute'}
                    </TerraButton>
                  </div>
                  {#if toastMessage}
                    <div
                      class="terra-toast-enter flex items-center gap-2 px-3 py-2 border border-[var(--terra-border-accent)] bg-[var(--terra-accent-primary-dim)] text-xs font-mono"
                    >
                      <Check class="w-3.5 h-3.5 text-[var(--terra-accent-primary)] shrink-0" />
                      <span class="truncate">{toastMessage}</span>
                    </div>
                  {/if}
                </form>

                <div
                  class="col-start-1 row-start-1 terra-stage-slot"
                  data-active={activeSpecimen === 'surface'}
                  inert={activeSpecimen !== 'surface'}
                >
                  <TerraPanel title={isZh ? '档案平版容器' : 'Editorial Plate'} tag="FLAT 2D">
                    <div class="space-y-4">
                      <div class="flex flex-wrap gap-2">
                        <TerraBadge
                          label={isZh ? '标称运行' : 'NOMINAL'}
                          code="SYS"
                          variant="primary"
                        />
                        <TerraBadge
                          label={isZh ? '高负载' : 'ELEVATED'}
                          code="CPU"
                          variant="warning"
                        />
                        <TerraBadge
                          label={isZh ? '已校验' : 'VERIFIED'}
                          code="OK"
                          variant="success"
                        />
                      </div>
                      <div
                        class="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--terra-border)]"
                      >
                        <TerraStatusBeacon status="online" label={isZh ? '在线' : 'Online'} />
                        <TerraStatusBeacon status="standby" label={isZh ? '待机' : 'Standby'} />
                        <TerraStatusBeacon status="alert" label={isZh ? '告警' : 'Alert'} />
                      </div>
                    </div>
                  </TerraPanel>
                </div>
              </div>

              <div
                class="pt-4 border-t border-[var(--terra-border)] text-xs flex items-center justify-between text-[var(--terra-text-muted)]"
              >
                <span>{currentSpecimen.category}</span>
                <span class="font-mono">{t.editorial.stageFooter}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="terra-deferred-section border-b border-[var(--terra-border)]">
        <div use:scrollReveal class="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-6">
          <div
            class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--terra-border)] pb-4"
          >
            <div>
              <div
                class="font-mono text-xs uppercase tracking-wider text-[var(--terra-accent-primary)]"
              >
                {t.editorial.chartsSectionEyebrow}
              </div>
              <h2 class="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                {t.editorial.chartsSectionTitle}
              </h2>
            </div>
            <button
              type="button"
              use:magnetic={{ strength: 0.2 }}
              onclick={() => switchView('docs')}
              class="terra-pressable inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--terra-text-primary)] hover:text-[var(--terra-accent-primary)] cursor-pointer"
            >
              <span>{isZh ? '查看全量组件文档' : 'Open Full Docs'}</span>
              <ArrowUpRight class="w-4 h-4" />
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-6">
              <TerraPanel title={t.editorial.chartLineTitle} tag="SVG // STREAM">
                <TerraLineChart data={signalTelemetryData} height={170} unit="GB/s" />
              </TerraPanel>
            </div>
            <div class="lg:col-span-6">
              <TerraPanel title={t.editorial.chartBarTitle} tag="SVG // LOAD">
                <TerraBarChart data={subsystemBarData} height={170} unit="%" />
              </TerraPanel>
            </div>
          </div>

          <TerraPanel title={t.editorial.stripTitle} tag="SLA // 60D">
            <TerraStatusStrip serviceName="GLOBAL_EDGE_ROUTER" days={60} />
          </TerraPanel>
        </div>
      </section>

      <section class="py-10 border-b border-[var(--terra-border)] overflow-hidden">
        <div use:scrollReveal>
          <div class="max-w-7xl mx-auto px-4 sm:px-8 mb-4 flex items-center justify-between">
            <span class="font-mono text-xs uppercase tracking-wider text-[var(--terra-text-muted)]">
              {t.editorial.marqueeEyebrow}
            </span>
            <button
              type="button"
              onclick={() => (marqueeRunning = !marqueeRunning)}
              aria-label={marqueeRunning ? t.editorial.marqueePause : t.editorial.marqueePlay}
              class="terra-pressable inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--terra-border)] text-xs font-medium cursor-pointer"
            >
              {#if marqueeRunning}
                <Pause class="w-3 h-3" />
                <span>{t.editorial.marqueePause}</span>
              {:else}
                <Play class="w-3 h-3" />
                <span>{t.editorial.marqueePlay}</span>
              {/if}
            </button>
          </div>

          <div
            class="terra-marquee-track items-center gap-10 whitespace-nowrap"
            data-running={marqueeRunning}
          >
            {#each [0, 1] as copyIdx (copyIdx)}
              <div
                class="flex items-center gap-10 font-display text-2xl sm:text-3xl font-bold tracking-tight pr-10"
              >
                {#each t.editorial.marqueeItems as label, idx (idx)}
                  <span>{label}</span>
                  <span class="text-[var(--terra-accent-primary)]">/</span>
                {/each}
              </div>
            {/each}
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-8 py-14 space-y-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {#each t.editorial.principles as col, i (col.code)}
            <div
              use:scrollReveal={{ index: i, delay: i * 90 }}
              class="border-t border-[var(--terra-border)] pt-4 space-y-2"
            >
              <div class="font-mono text-xs font-semibold text-[var(--terra-accent-primary)]">
                {col.code}
              </div>
              <h3 class="font-display text-lg font-bold tracking-tight">
                {col.title}
              </h3>
              <p class="text-xs leading-relaxed text-[var(--terra-text-muted)]">
                {col.body}
              </p>
            </div>
          {/each}
        </div>

        <footer class="border-t border-[var(--terra-border)] pt-8 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span
              class="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--terra-text-primary)]"
            >
              {t.footer.disclaimerTag}
            </span>
            <span class="font-mono text-[11px] text-[var(--terra-text-muted)]">
              {t.footer.systemName}
            </span>
          </div>

          <p class="text-xs leading-relaxed text-[var(--terra-text-muted)] max-w-4xl">
            {t.footer.disclaimerText}
          </p>

          <div class="flex flex-wrap items-center gap-2 pt-1">
            {#each t.footer.refLinks as link (link.url)}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="terra-t-color inline-flex items-center gap-1.5 px-2.5 py-1 border border-[var(--terra-border)] font-mono text-[11px] text-[var(--terra-text-secondary)] hover:border-[var(--terra-accent-primary)] hover:text-[var(--terra-accent-primary)]"
              >
                <span>{link.label}</span>
                <span class="text-[10px] text-[var(--terra-text-muted)]">[{link.badge}]</span>
              </a>
            {/each}
          </div>
        </footer>
      </section>
    </main>
  {/if}
</div>

<style>
  @keyframes edLineReveal {
    from {
      opacity: 0;
      transform: translate3d(0, 105%, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .ed-line-reveal {
      animation: edLineReveal var(--terra-dur-slow) var(--terra-ease-out) var(--d, 0ms) both;
    }

    .ed-roll-word:hover .ed-roll-char {
      transform: translateY(-100%);
    }

    .ed-roll-char {
      transition: transform var(--terra-dur-base) var(--terra-spring-snappy)
        calc(var(--ci, 0) * 20ms);
    }
  }

  .terra-stage-slot {
    opacity: 0;
    pointer-events: none;
    transform: translate3d(0, 6px, 0);
    transition:
      opacity var(--terra-dur-fast) var(--terra-ease-exit),
      transform var(--terra-dur-fast) var(--terra-ease-exit);
  }

  .terra-stage-slot[data-active='true'] {
    opacity: 1;
    pointer-events: auto;
    transform: translate3d(0, 0, 0);
    transition:
      opacity var(--terra-dur-base) var(--terra-ease-out),
      transform var(--terra-dur-base) var(--terra-spring-smooth);
  }
</style>
