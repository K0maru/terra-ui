<script lang="ts">
  interface Props {
    active?: boolean
    oncomplete?: () => void
  }

  let {
    active = false,
    oncomplete
  }: Props = $props()

  $effect(() => {
    if (active) {
      const timer = setTimeout(() => {
        oncomplete?.()
      }, 450)
      return () => clearTimeout(timer)
    }
  })
</script>

{#if active}
  <div class="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none">
    <!-- Tactical Laser Shutter Wipe -->
    <div class="absolute inset-y-0 w-32 -translate-x-full animate-laser-wipe flex items-center justify-center">
      <!-- High energy glowing laser blade -->
      <div class="w-1 h-full bg-[var(--terra-accent-primary)] shadow-[0_0_24px_var(--terra-accent-primary),0_0_48px_var(--terra-accent-primary)]"></div>
      <!-- Tactical trailing scanlines -->
      <div class="w-28 h-full bg-gradient-to-r from-transparent to-[var(--terra-accent-primary-dim)] opacity-40"></div>
    </div>
  </div>
{/if}
