<script lang="ts">
  import { onMount } from 'svelte'
  import { docCategories, type DocPage } from './docsData'
  import TerraCodePlayground from './TerraCodePlayground.svelte'
  import TerraPropsTable from './components/TerraPropsTable.svelte'

  // Component imports for live playgrounds
  import TerraButton from '../components/TerraButton.svelte'
  import TerraPanel from '../components/TerraPanel.svelte'
  import TerraBadge from '../components/TerraBadge.svelte'
  import TerraStatusBeacon from '../components/TerraStatusBeacon.svelte'
  import TerraSpatialCard from '../components/TerraSpatialCard.svelte'
  import TerraSegmentBar from '../components/TerraSegmentBar.svelte'
  import TerraLineChart from '../components/TerraLineChart.svelte'
  import TerraDonutChart from '../components/TerraDonutChart.svelte'
  import TerraBarChart from '../components/TerraBarChart.svelte'
  import TerraVerticalSlider from '../components/TerraVerticalSlider.svelte'
  import TerraVerticalTabs from '../components/TerraVerticalTabs.svelte'
  import TerraCornerBrackets from '../components/TerraCornerBrackets.svelte'
  import TerraProfileCard from '../components/TerraProfileCard.svelte'

  interface Props {
    locale?: 'en' | 'zh'
    onSwitchToDemo?: () => void
  }

  let { locale = 'en', onSwitchToDemo }: Props = $props()

  // Flattened list for linear prev/next navigation
  const allPages = $derived(docCategories.flatMap((cat) => cat.items))

  let activePageId = $state('overview')
  let searchQuery = $state('')
  let isMobileMenuOpen = $state(false)

  // Sync with URL hash
  onMount(() => {
    function handleHash() {
      const hash = window.location.hash
      if (hash.startsWith('#/docs/')) {
        const id = hash.replace('#/docs/', '')
        if (allPages.some((p) => p.id === id)) {
          activePageId = id
        }
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  })

  function selectPage(id: string) {
    activePageId = id
    window.location.hash = `#/docs/${id}`
    isMobileMenuOpen = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activePage = $derived(
    allPages.find((p) => p.id === activePageId) || allPages[0]
  )

  const activeCategory = $derived(
    docCategories.find((cat) => cat.items.some((p) => p.id === activePage.id))
  )

  const activeIndex = $derived(allPages.findIndex((p) => p.id === activePage.id))
  const prevPage = $derived(activeIndex > 0 ? allPages[activeIndex - 1] : null)
  const nextPage = $derived(
    activeIndex < allPages.length - 1 ? allPages[activeIndex + 1] : null
  )

  // Filtered categories based on search
  const filteredCategories = $derived.by(() => {
    if (!searchQuery.trim()) return docCategories
    const q = searchQuery.toLowerCase()
    return docCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.titleZh.toLowerCase().includes(q) ||
            (p.componentName && p.componentName.toLowerCase().includes(q))
        )
      }))
      .filter((cat) => cat.items.length > 0)
  })

  // Live playground state bindings
  let sliderVal = $state(1.5)
  let activeTabKey = $state('us-east')
  const demoTabs = [
    { key: 'us-east', label: 'US-EAST-01 CLUSTER', shortCode: 'VA-01' },
    { key: 'ap-east', label: 'AP-EAST-02 REGION', shortCode: 'HK-02' },
    { key: 'eu-west', label: 'EU-WEST-03 CORE', shortCode: 'DE-03' }
  ]

  const sampleLineData = [
    { timestamp: '18:00:12', value: 38, label: 'NODE-01' },
    { timestamp: '18:15:30', value: 52, label: 'NODE-03' },
    { timestamp: '18:30:45', value: 86, label: 'PEAK-05' },
    { timestamp: '18:45:10', value: 68, label: 'BAL-07' },
    { timestamp: '18:57:56', value: 92, label: 'NODE-10' }
  ]

  const sampleDonutData = [
    { label: 'CORE LOAD', value: 46, color: 'var(--terra-accent-primary)', code: 'PWR-01' },
    { label: 'SHIELD BUS', value: 34, color: 'var(--terra-accent-secondary)', code: 'DEF-02' },
    { label: 'INVERTER', value: 20, color: 'var(--terra-accent-warning)', code: 'BUS-03' }
  ]

  const sampleBarData = [
    { label: 'CPU-01', value: 64, max: 100, status: 'normal' as const },
    { label: 'MEM-02', value: 88, max: 100, status: 'warning' as const },
    { label: 'GPU-03', value: 94, max: 100, status: 'critical' as const }
  ]
</script>

<div class="min-h-screen bg-[var(--terra-bg-base)] text-[var(--terra-text-primary)] font-sans antialiased">
  <!-- Top Docs Sub-header Bar -->
  <div class="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-[var(--terra-bg-surface)]/90 backdrop-blur-md border-b border-[var(--terra-border)] select-none">
    <div class="flex items-center gap-3">
      <!-- Mobile menu toggle -->
      <button
        type="button"
        onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
        class="lg:hidden p-1.5 border border-[var(--terra-border)] text-[var(--terra-text-primary)] hover:border-[var(--terra-accent-primary)]"
        aria-label="Toggle Navigation"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <span class="font-mono text-xs font-bold tracking-widest text-[var(--terra-accent-primary)] flex items-center gap-1.5">
        <span class="w-2 h-2 bg-[var(--terra-accent-primary)]"></span>
        TERRA UI // DOCS & RUNTIME PLAYPEN
      </span>
      <span class="hidden md:inline font-mono text-[10px] text-[var(--terra-text-muted)] border-l border-[var(--terra-border)] pl-3">
        v0.8.0-alpha // SVELTE 5 NATIVE RUNES
      </span>
    </div>

    <!-- Return to Demo button -->
    <div class="flex items-center gap-3">
      {#if onSwitchToDemo}
        <button
          type="button"
          onclick={onSwitchToDemo}
          class="font-mono text-xs font-bold px-3 py-1 bg-[var(--terra-bg-base)] border border-[var(--terra-border)] hover:border-[var(--terra-accent-primary)] text-[var(--terra-text-primary)] hover:text-[var(--terra-accent-primary)] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>←</span>
          <span>{locale === 'zh' ? '返回全屏展台' : 'LIVE DEMO'}</span>
        </button>
      {/if}
    </div>
  </div>

  <!-- Main Container: Sidebar + Content -->
  <div class="max-w-7xl mx-auto flex">
    <!-- Left Sidebar Navigation -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-72 lg:w-64 bg-[var(--terra-bg-surface)] border-r border-[var(--terra-border)] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 pt-16 lg:pt-0 {isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}"
    >
      <!-- Search Filter Input -->
      <div class="p-3 border-b border-[var(--terra-border)]">
        <div class="relative">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder={locale === 'zh' ? '检索组件与规范...' : 'Filter documentation...'}
            class="w-full bg-[var(--terra-bg-base)] border border-[var(--terra-border)] px-2.5 py-1.5 text-xs font-mono text-[var(--terra-text-primary)] placeholder-[var(--terra-text-muted)] focus:outline-none focus:border-[var(--terra-accent-primary)]"
          />
          {#if searchQuery}
            <button
              type="button"
              onclick={() => searchQuery = ''}
              class="absolute right-2 top-1.5 text-xs text-[var(--terra-text-muted)] hover:text-white"
            >
              ×
            </button>
          {/if}
        </div>
      </div>

      <!-- Categories & Items Tree -->
      <div class="flex-1 overflow-y-auto p-3 space-y-6 select-none font-mono">
        {#each filteredCategories as cat}
          <div class="space-y-1.5">
            <h4 class="text-[10px] font-bold text-[var(--terra-text-muted)] uppercase tracking-wider px-2">
              {locale === 'zh' ? cat.titleZh : cat.title}
            </h4>
            <div class="space-y-0.5">
              {#each cat.items as item}
                <button
                  type="button"
                  onclick={() => selectPage(item.id)}
                  class="w-full text-left px-2 py-1.5 text-xs transition-all flex items-center justify-between {activePageId === item.id ? 'bg-[var(--terra-accent-primary)] text-black font-bold shadow-xs' : 'text-[var(--terra-text-secondary)] hover:text-[var(--terra-text-primary)] hover:bg-[var(--terra-bg-surface-hover)]'}"
                >
                  <span class="truncate">
                    {locale === 'zh' ? item.titleZh : item.title}
                  </span>
                  {#if item.componentName}
                    <span class="text-[9px] opacity-75 font-mono">
                      &lt;/&gt;
                    </span>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Sidebar Footer -->
      <div class="p-3 border-t border-[var(--terra-border)] text-[9px] font-mono text-[var(--terra-text-muted)] flex justify-between items-center">
        <span>K0maru // Terra-UI</span>
        <span class="text-[var(--terra-accent-success)]">ONLINE</span>
      </div>
    </aside>

    <!-- Overlay for mobile drawer -->
    {#if isMobileMenuOpen}
      <button
        type="button"
        onclick={() => isMobileMenuOpen = false}
        class="fixed inset-0 bg-black/60 z-30 lg:hidden"
        aria-label="Close Navigation"
      ></button>
    {/if}

    <!-- Right Main Documentation Content -->
    <main class="flex-1 min-w-0 px-4 sm:px-8 py-8 space-y-8">
      <!-- Breadcrumb Bar -->
      <div class="flex items-center gap-2 font-mono text-[11px] text-[var(--terra-text-muted)]">
        <span>TERRA UI</span>
        <span>/</span>
        <span>{activeCategory ? (locale === 'zh' ? activeCategory.titleZh : activeCategory.title) : 'DOCS'}</span>
        <span>/</span>
        <span class="text-[var(--terra-accent-primary)] font-bold">
          {locale === 'zh' ? activePage.titleZh : activePage.title}
        </span>
      </div>

      <!-- Page Header Banner -->
      <div class="space-y-2 pb-4 border-b border-[var(--terra-border)]">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-1.5 py-0.5 font-mono text-[9px] bg-[var(--terra-accent-primary)]/10 text-[var(--terra-accent-primary)] border border-[var(--terra-accent-primary)]/30 font-bold">
            {activePage.tag}
          </span>
          {#if activePage.componentName}
            <span class="px-1.5 py-0.5 font-mono text-[9px] bg-black/40 text-slate-300 border border-white/10">
              &lt;{activePage.componentName} /&gt;
            </span>
          {/if}
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[var(--terra-text-primary)]">
          {locale === 'zh' ? activePage.titleZh : activePage.title}
        </h1>
        <p class="text-sm text-[var(--terra-text-secondary)] font-sans leading-relaxed max-w-3xl">
          {locale === 'zh' ? activePage.descriptionZh : activePage.description}
        </p>
      </div>

      <!-- Features Checklist (If defined) -->
      {#if (locale === 'zh' ? (activePage.featuresZh || activePage.features) : activePage.features)?.length}
        <div class="p-4 border border-[var(--terra-border)] bg-[var(--terra-bg-surface)]/50 space-y-2">
          <h3 class="font-mono text-xs font-bold text-[var(--terra-text-primary)] uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[var(--terra-accent-primary)]"></span>
            {locale === 'zh' ? '核心规约与说明 // SPECIFICATIONS' : 'KEY SPECIFICATIONS // COMPLIANCE'}
          </h3>
          <ul class="space-y-1.5 text-xs text-[var(--terra-text-secondary)] font-sans">
            {#each (locale === 'zh' ? (activePage.featuresZh || activePage.features) : activePage.features) || [] as feature}
              <li class="flex items-start gap-2">
                <span class="text-[var(--terra-accent-primary)] font-mono">▪</span>
                <span>{feature}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <!-- Interactive Playground (For components) -->
      {#if activePage.componentName}
        <section class="space-y-3">
          <h2 class="text-base font-bold font-mono text-[var(--terra-text-primary)] tracking-wide flex items-center gap-2">
            <span class="text-[var(--terra-accent-primary)]">01.</span>
            INTERACTIVE RUNTIME PLAYGROUND // 交互演练场
          </h2>
          <p class="text-xs text-[var(--terra-text-muted)] font-sans">
            {locale === 'zh' ? '下方视口由 Svelte 5 原生渲染，支持即时鼠标物理交互与主题响应；右侧/下方提供随时可用的源代码。' : 'The preview below is rendered natively by Svelte 5. You can interact with it physically, and inspect the copyable code snippet.'}
          </p>

          <TerraCodePlayground
            title="{activePage.componentName} Preview"
            code={activePage.codeSnippet || ''}
            activeView="split"
          >
            <!-- Specific live component rendering per page ID -->
            {#if activePage.id === 'spatial-card'}
              <div class="w-full max-w-md">
                <TerraSpatialCard maxRotation={16} perspective={1000} cut="tr-bl">
                  <div class="space-y-3">
                    <div class="flex justify-between items-center" style="transform: translateZ(25px);">
                      <h4 class="font-mono text-sm font-bold text-white">SPATIAL SENSOR NODE</h4>
                      <TerraBadge label="NOMINAL" variant="primary" />
                    </div>
                    <p class="text-xs text-slate-400 font-sans" style="transform: translateZ(15px);">
                      Move your cursor over this card to observe multi-axis physical tilt and specular sheen.
                    </p>
                  </div>
                </TerraSpatialCard>
              </div>
            {:else if activePage.id === 'line-chart'}
              <div class="w-full max-w-xl">
                <TerraLineChart
                  data={sampleLineData}
                  height={150}
                  unit="MB/s"
                  showCrosshair={true}
                  showGrid={true}
                />
              </div>
            {:else if activePage.id === 'donut-chart'}
              <div class="flex justify-center">
                <TerraDonutChart
                  data={sampleDonutData}
                  size={200}
                  thickness={20}
                  title="ALLOCATION"
                  unit="%"
                />
              </div>
            {:else if activePage.id === 'bar-chart'}
              <div class="w-full max-w-md">
                <TerraBarChart data={sampleBarData} height={140} barWidth={24} unit="%" />
              </div>
            {:else if activePage.id === 'segment-bar'}
              <div class="w-full max-w-md space-y-4">
                <TerraSegmentBar
                  label="AIC_MAIN_GRID (自动化工业主干网负荷)"
                  sublabel="⚡ 480V THREE-PHASE // LOAD 70%"
                  value={7}
                  total={10}
                  animated={true}
                  variant="nominal"
                />
                <TerraSegmentBar
                  label="SECONDARY_POWER_CELL (高能电容缓冲阵列)"
                  sublabel="⚡ DUAL-INVERTER BUFFER // 1000V"
                  value={9}
                  total={12}
                  animated={true}
                  variant="warning"
                />
              </div>
            {:else if activePage.id === 'vertical-slider'}
              <div class="flex items-center gap-8 justify-center">
                <TerraVerticalSlider
                  bind:value={sliderVal}
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  label="SCALE"
                  unit="x"
                  showButtons={true}
                  height="160px"
                />
                <div class="font-mono text-xs text-[var(--terra-text-muted)] space-y-1">
                  <div>VALUE: <span class="text-[var(--terra-accent-primary)] font-bold">{sliderVal.toFixed(1)}x</span></div>
                  <div>GPU SCALEY COMPOSITED</div>
                </div>
              </div>
            {:else if activePage.id === 'vertical-tabs'}
              <div class="w-full max-w-xs">
                <TerraVerticalTabs items={demoTabs} bind:selectedKey={activeTabKey} />
              </div>
            {:else if activePage.id === 'corner-brackets'}
              <TerraCornerBrackets label="[SEC-01 // TELEMETRY]" glow={true}>
                <div class="p-6 bg-black/40 text-[var(--terra-text-primary)] font-mono text-xs space-y-1">
                  <div>CLUSTER LINKED: AIC-NODE-99</div>
                  <div class="text-[var(--terra-accent-primary)]">STATUS: TELEMETRY NOMINAL</div>
                </div>
              </TerraCornerBrackets>
            {:else if activePage.id === 'button'}
              <div class="flex flex-wrap gap-3 items-center justify-center">
                <TerraButton variant="primary">PRIMARY</TerraButton>
                <TerraButton variant="outline">OUTLINE</TerraButton>
                <TerraButton variant="ghost">GHOST</TerraButton>
                <TerraButton variant="danger">DANGER</TerraButton>
              </div>
            {:else if activePage.id === 'panel'}
              <div class="w-full max-w-md">
                <TerraPanel title="SYSTEM STATUS" tag="// SEC-01" cut="tl-br" bracket={true}>
                  <p class="text-xs font-mono text-slate-300">
                    Industrial armor chassis with chamfer corners and corner reticles.
                  </p>
                </TerraPanel>
              </div>
            {:else if activePage.id === 'profile-card'}
              <div class="w-full max-w-md">
                <TerraProfileCard />
              </div>
            {:else}
              <div class="text-xs font-mono text-[var(--terra-text-muted)]">
                COMPONENT DEMO CONTAINER
              </div>
            {/if}
          </TerraCodePlayground>
        </section>
      {/if}

      <!-- Props & API Reference Table -->
      {#if activePage.props && activePage.props.length > 0}
        <section class="space-y-3 pt-4">
          <h2 class="text-base font-bold font-mono text-[var(--terra-text-primary)] tracking-wide flex items-center gap-2">
            <span class="text-[var(--terra-accent-primary)]">02.</span>
            API SPECIFICATION // 属性规约 (PROPS)
          </h2>
          <TerraPropsTable items={activePage.props} />
        </section>
      {/if}

      <!-- Static Code Guide (If no component, e.g. Installation / Tokens) -->
      {#if !activePage.componentName && activePage.codeSnippet}
        <section class="space-y-3 pt-4">
          <h2 class="text-base font-bold font-mono text-[var(--terra-text-primary)] tracking-wide flex items-center gap-2">
            <span class="text-[var(--terra-accent-primary)]">01.</span>
            CODE IMPLEMENTATION // 配置与实现
          </h2>
          <TerraCodePlayground
            title="Implementation Snippet"
            code={activePage.codeSnippet}
            activeView="code"
          />
        </section>
      {/if}

      <!-- Bottom Linear Navigation (Previous / Next) -->
      <div class="pt-10 border-t border-[var(--terra-border)] flex items-center justify-between">
        {#if prevPage}
          <button
            type="button"
            onclick={() => selectPage(prevPage.id)}
            class="text-left group cursor-pointer"
          >
            <div class="font-mono text-[10px] text-[var(--terra-text-muted)] group-hover:text-[var(--terra-accent-primary)]">
              ← PREVIOUS
            </div>
            <div class="font-mono text-sm font-bold text-[var(--terra-text-primary)] group-hover:text-[var(--terra-accent-primary)] transition-colors">
              {locale === 'zh' ? prevPage.titleZh : prevPage.title}
            </div>
          </button>
        {:else}
          <div></div>
        {/if}

        {#if nextPage}
          <button
            type="button"
            onclick={() => selectPage(nextPage.id)}
            class="text-right group cursor-pointer"
          >
            <div class="font-mono text-[10px] text-[var(--terra-text-muted)] group-hover:text-[var(--terra-accent-primary)]">
              NEXT →
            </div>
            <div class="font-mono text-sm font-bold text-[var(--terra-text-primary)] group-hover:text-[var(--terra-accent-primary)] transition-colors">
              {locale === 'zh' ? nextPage.titleZh : nextPage.title}
            </div>
          </button>
        {/if}
      </div>
    </main>
  </div>
</div>
