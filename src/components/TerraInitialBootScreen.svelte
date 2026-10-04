<script lang="ts">
  import { onMount } from 'svelte'
  import { i18n } from '../i18n'

  interface Props {
    active?: boolean
    oncomplete?: () => void
  }

  let {
    active = $bindable(false),
    oncomplete
  }: Props = $props()

  let progress = $state(0)
  let curtainScale = $state(0)
  let screenOpacity = $state(1)
  let isRunning = $state(false)

  // Status message sequence corresponding to progress thresholds
  const statusMilestones = $derived([
    { at: 0, text: i18n.t.boot.status1 },
    { at: 18, text: i18n.t.boot.status2 },
    { at: 42, text: i18n.t.boot.status3 },
    { at: 68, text: i18n.t.boot.status4 },
    { at: 88, text: i18n.t.boot.status5 },
    { at: 100, text: i18n.t.boot.statusReady }
  ])

  let currentMilestoneIndex = $state(0)
  let statusText = $derived(
    progress >= 100
      ? `${i18n.t.boot.statusReady} // ${i18n.t.boot.slogan}`
      : statusMilestones[currentMilestoneIndex]?.text || i18n.t.boot.status1
  )

  export function triggerBoot() {
    active = true
    startBootSequence()
  }

  function startBootSequence() {
    if (isRunning) return
    isRunning = true
    progress = 0
    curtainScale = 0
    screenOpacity = 1
    currentMilestoneIndex = 0

    const startTime = performance.now()
    const targetDuration = 2200 // ~2.2s deliberate authentic boot sequence

    function tick(now: number) {
      const elapsed = now - startTime
      const rawRatio = Math.min(1, elapsed / targetDuration)

      // Non-linear realistic loading curve with slight industrial cadence
      let calculatedProgress: number
      if (rawRatio < 0.25) {
        calculatedProgress = (rawRatio / 0.25) * 22
      } else if (rawRatio < 0.6) {
        calculatedProgress = 22 + ((rawRatio - 0.25) / 0.35) * 44
      } else if (rawRatio < 0.85) {
        calculatedProgress = 66 + ((rawRatio - 0.6) / 0.25) * 24
      } else {
        calculatedProgress = 90 + ((rawRatio - 0.85) / 0.15) * 10
      }

      progress = Math.min(100, Math.floor(calculatedProgress))

      // Update milestone status
      for (let i = statusMilestones.length - 1; i >= 0; i--) {
        if (progress >= statusMilestones[i].at) {
          currentMilestoneIndex = i
          break
        }
      }

      if (rawRatio < 1) {
        requestAnimationFrame(tick)
      } else {
        progress = 100
        finishBoot()
      }
    }

    requestAnimationFrame(tick)
  }

  function finishBoot() {
    // Hold at 100% briefly, then trigger solid curtain wipe
    setTimeout(() => {
      curtainScale = 1

      // Curtain reaches full wipe in 350ms, then fade out boot screen
      setTimeout(() => {
        screenOpacity = 0

        // Clean unmount after fade
        setTimeout(() => {
          active = false
          isRunning = false
          oncomplete?.()
        }, 320)
      }, 360)
    }, 120)
  }

  onMount(() => {
    // Check sessionStorage to show once on initial visit, unless active is explicitly set
    const hasBooted = sessionStorage.getItem('terra_ui_booted')
    if (!hasBooted || active) {
      sessionStorage.setItem('terra_ui_booted', 'true')
      active = true
      startBootSequence()
    } else {
      active = false
    }
  })

  // React to external replay trigger
  $effect(() => {
    if (active && !isRunning) {
      startBootSequence()
    }
  })
</script>

{#if active}
  <div
    class="fixed inset-0 z-[10000] bg-[#0c0d0e] text-[#f4f4f5] select-none overflow-hidden transition-opacity duration-300"
    style="opacity: {screenOpacity}; pointer-events: {isRunning ? 'all' : 'none'};"
  >
    <!-- Background subtle coordinate grid -->
    <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>

    <!-- ====================================================================
         1. LEFT-SIDE FULL-HEIGHT VERTICAL PROGRESS BAR
         `width: 0.8rem; height: 100%` filling from bottom to top
         ==================================================================== -->
    <div class="absolute left-0 top-0 bottom-0 w-[0.8rem] bg-white/5 border-r border-white/10 z-20 flex flex-col justify-end">
      <!-- Fill element: bottom to top -->
      <div
        class="w-full bg-[var(--terra-accent-primary,#ffde00)] transition-[height] duration-75 ease-out shadow-[0_0_12px_var(--terra-accent-primary)]"
        style="height: {progress}%;"
      ></div>

      <!-- Tick marks along the track -->
      <div class="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-40">
        {#each Array(11) as _, i}
          <div class="w-full flex items-center justify-end pr-0.5">
            <span class="w-1.5 h-[1px] bg-white"></span>
          </div>
        {/each}
      </div>
    </div>

    <!-- ====================================================================
         2. TOP INDUSTRIAL COMMAND BANNER
         ==================================================================== -->
    <header class="absolute top-6 left-8 sm:left-12 right-6 sm:right-10 flex items-center justify-between z-10 font-mono text-xs text-white/60">
      <div class="flex items-center gap-3">
        <span class="text-[var(--terra-accent-primary,#ffde00)] font-bold text-sm">◆</span>
        <span class="tracking-widest font-bold text-white">TERRA UI // SYSTEM BOOT</span>
        <span class="hidden sm:inline text-white/30">//</span>
        <span class="hidden sm:inline tracking-wider">{i18n.t.boot.sub}</span>
      </div>

      <div class="flex items-center gap-4 text-[11px] tracking-widest">
        <span class="hidden md:inline">[ HARDWARE // GPU_COMPOSITOR ]</span>
        <span class="px-2 py-0.5 bg-white/10 text-white font-bold border border-white/20">TERRA_RUNES</span>
      </div>
    </header>

    <!-- ====================================================================
         3. MAIN CORE LOADING CENTERPIECE
         Huge 5rem+ Percentage + Official Vertical Status Block
         ==================================================================== -->
    <main class="absolute inset-0 flex flex-col items-center justify-center pl-4 z-10">
      <div class="flex flex-col items-start space-y-4 max-w-xl w-full px-6">
        
        <!-- Slogan & Classification -->
        <div class="flex items-center gap-2 font-mono text-xs tracking-widest text-[var(--terra-accent-primary,#ffde00)] font-bold uppercase">
          <span class="w-2 h-2 bg-[var(--terra-accent-primary,#ffde00)] inline-block"></span>
          <span>{i18n.t.boot.title}</span>
        </div>

        <!-- Huge Core Percentage Countdown -->
        <div class="flex items-baseline gap-2 font-display select-none">
          <span class="font-black text-7xl sm:text-9xl tracking-tighter text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            {String(progress).padStart(2, '0')}
          </span>
          <span class="text-3xl sm:text-5xl font-bold text-[var(--terra-accent-primary,#ffde00)]">%</span>
        </div>

        <!-- Official Status Block with micro bars -->
        <div class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/15 font-mono">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[var(--terra-accent-primary,#ffde00)] animate-ping"></span>
            <span class="text-xs sm:text-sm font-bold tracking-wider text-white uppercase">{statusText}</span>
          </div>

          <div class="flex items-center gap-1">
            {#each Array(8) as _, i}
              <span
                class="w-2 h-3 border border-white/20 transition-colors duration-100 {progress >= (i + 1) * 12 ? 'bg-[var(--terra-accent-primary,#ffde00)] border-[var(--terra-accent-primary,#ffde00)]' : 'bg-white/5'}"
              ></span>
            {/each}
            <span class="text-[10px] text-white/50 ml-2">CH-08</span>
          </div>
        </div>

        <!-- Decorative Diamond Triangles & Geodetic Brackets -->
        <div class="flex items-center gap-4 text-white/40 font-mono text-[10px] tracking-widest pt-2">
          <span>{i18n.t.boot.busNominal}</span>
          <span>•</span>
          <span>{i18n.t.boot.shutter}</span>
          <span>•</span>
          <span>{i18n.t.boot.freq}</span>
        </div>

      </div>
    </main>

    <!-- ====================================================================
         4. CORNER INDUSTRIAL DECORS & FOOTER
         ==================================================================== -->
    <footer class="absolute bottom-6 left-8 sm:left-12 right-6 sm:right-10 flex items-center justify-between z-10 font-mono text-[10px] text-white/40 tracking-wider">
      <div>
        <span class="font-bold text-white/70">TERRA-UI</span> // {i18n.t.boot.footerProtocol}
      </div>
      <div>
        TERRA-UI // {i18n.t.boot.footerDesignSystem}
      </div>
    </footer>

    <!-- ====================================================================
         5. SOLID ARMORED CURTAIN WIPE AT 100%
         `scaleX(0) -> scaleX(1)` with cubic-bezier(1, 0, 0.7, 1)
         ==================================================================== -->
    <div
      class="absolute inset-0 bg-[var(--terra-accent-primary,#ffde00)] z-50 pointer-events-none transition-transform duration-350"
      style="
        transform-origin: left;
        transform: scaleX({curtainScale});
        transition-timing-function: cubic-bezier(1, 0, 0.7, 1);
      "
    >
      <div class="w-full h-full flex items-center justify-center text-black font-display font-black text-6xl tracking-tight uppercase opacity-90">
        TERRA-UI
      </div>
    </div>

  </div>
{/if}
