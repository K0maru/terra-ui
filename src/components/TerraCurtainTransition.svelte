<script lang="ts">
  import { onMount } from 'svelte'

  interface Props {
    active?: boolean
    label?: string
    oncomplete?: () => void
  }

  let {
    active = false,
    label = 'TERRA // INITIALIZING',
    oncomplete
  }: Props = $props()

  let phase = $state<'idle' | 'enter' | 'exit'>('idle')
  let count = $state(0)

  $effect(() => {
    if (active) {
      phase = 'enter'
      count = 0
      
      // Fast counter from 0 to 100
      const countTimer = setInterval(() => {
        count += Math.floor(Math.random() * 25) + 15
        if (count >= 100) {
          count = 100
          clearInterval(countTimer)
        }
      }, 40)

      // Phase 2: curtain sweeps out to the right
      const exitTimer = setTimeout(() => {
        phase = 'exit'
      }, 380)

      // Phase 3: complete and cleanup
      const finishTimer = setTimeout(() => {
        phase = 'idle'
        oncomplete?.()
      }, 760)

      return () => {
        clearInterval(countTimer)
        clearTimeout(exitTimer)
        clearTimeout(finishTimer)
      }
    } else {
      phase = 'idle'
    }
  })
</script>

{#if phase !== 'idle'}
  <div class="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none">
    
    <!-- Solid Industrial Curtain Wipe -->
    <div
      class="absolute inset-0 bg-[var(--terra-accent-primary)] transition-transform duration-350"
      style="
        transition-timing-function: cubic-bezier(1, 0, 0.7, 1);
        transform-origin: {phase === 'enter' ? 'left' : 'right'};
        transform: scaleX({phase === 'enter' ? '1' : '0'});
      "
    >
      <!-- Official Loading Centerpiece (Large Percentage Countdown & Brand Text) -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-black font-mono">
        <div class="flex items-baseline gap-1">
          <span class="font-display font-black text-6xl sm:text-8xl tracking-tighter">
            {count}
          </span>
          <span class="font-display font-bold text-3xl sm:text-4xl opacity-80">%</span>
        </div>

        <div class="flex items-center gap-2 mt-2 px-3 py-1 bg-black/10 text-xs font-bold tracking-widest uppercase">
          <span class="w-2 h-2 bg-black inline-block animate-ping"></span>
          <span>{label}</span>
        </div>
      </div>

      <!-- Corner Industrial Decors -->
      <div class="absolute top-6 left-6 font-mono text-xs text-black/60 font-bold tracking-widest uppercase">
        TERRA // SYSTEM PROTOCOL RECOVERY
      </div>
      <div class="absolute bottom-6 right-6 font-mono text-xs text-black/60 font-bold tracking-widest uppercase">
        TERRA-UI // FUNCTIONAL DESIGN SYSTEM
      </div>
    </div>

  </div>
{/if}
