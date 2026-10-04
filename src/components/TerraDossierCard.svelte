<script lang="ts">
  import TerraBadge from './TerraBadge.svelte'
  import TerraStatusBeacon from './TerraStatusBeacon.svelte'
  import TerraBarcode from './TerraBarcode.svelte'
  import TerraButton from './TerraButton.svelte'

  interface Props {
    codename: string
    nameZh?: string
    archetype: string
    rarity?: number
    clearance?: string
    status?: 'online' | 'standby' | 'alert' | 'offline'
    statusLabel?: string
    uid?: string
    class?: string
    ondeploy?: () => void
    ontelemetry?: () => void
  }

  let {
    codename,
    nameZh = '',
    archetype,
    rarity = 6,
    clearance = 'LEVEL-04',
    status = 'online',
    statusLabel = 'READY',
    uid = 'OP-0842',
    class: className = '',
    ondeploy,
    ontelemetry
  }: Props = $props()

  // Generate star string based on rarity (clamped 1-6)
  const starDisplay = $derived(
    '★'.repeat(Math.max(1, Math.min(6, rarity)))
  )
</script>

<div
  class="relative p-5 sm:p-6 bg-[var(--terra-bg-surface)] border border-[var(--terra-border)] terra-cut-tr-bl shadow-lg flex flex-col justify-between overflow-hidden transition-all duration-200 select-none {className}"
>
  <!-- Background watermark / tactical PRTS grid -->
  <div class="absolute -right-6 -bottom-8 pointer-events-none opacity-5 font-display text-8xl font-black text-[var(--terra-text-primary)] uppercase select-none">
    {codename}
  </div>

  <!-- Top Header Row: Clearance, Status, Rarity -->
  <div class="flex items-center justify-between gap-2 pb-3 border-b border-[var(--terra-border)]">
    <div class="flex items-center gap-2">
      <TerraBadge label={clearance} code="SEC" variant="primary" />
      <TerraBadge label="PRTS-VERIFIED" code="SYS" variant="outline" />
    </div>

    <div class="flex items-center gap-3">
      <TerraStatusBeacon {status} label={statusLabel} />
      <span class="font-mono text-xs text-[var(--terra-accent-secondary)] tracking-widest font-bold" title={`${rarity} Star Operator`}>
        {starDisplay}
      </span>
    </div>
  </div>

  <!-- Middle Dossier Body: Photo frame + Typographic Data -->
  <div class="grid grid-cols-1 sm:grid-cols-12 gap-5 my-4 items-center">
    
    <!-- Operator Silhouette / Tactical Portrait Chamber (4 cols) -->
    <div class="sm:col-span-4 flex justify-center">
      <div class="relative w-full aspect-[4/5] max-w-[160px] bg-black/40 border border-[var(--terra-border-strong)] terra-cut-tr-bl overflow-hidden flex flex-col items-center justify-center group shadow-inner">
        <!-- CRT Scanline Texture -->
        <div class="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_3px)]"></div>
        
        <!-- Reticle Crosshairs in frame -->
        <span class="absolute top-1 left-1.5 font-mono text-[9px] text-[var(--terra-accent-primary)] opacity-80">+</span>
        <span class="absolute top-1 right-1.5 font-mono text-[9px] text-[var(--terra-accent-primary)] opacity-80">+</span>
        <span class="absolute bottom-1 left-1.5 font-mono text-[9px] text-[var(--terra-accent-primary)] opacity-80">+</span>
        <span class="absolute bottom-1 right-1.5 font-mono text-[9px] text-[var(--terra-accent-primary)] opacity-80">+</span>

        <!-- Abstract Stylized Operator Silhouette / Emblem -->
        <div class="relative z-10 flex flex-col items-center justify-center text-[var(--terra-accent-primary)]">
          <svg class="w-14 h-14 opacity-85 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
            <!-- Diamond HUD outer -->
            <polygon points="24,4 44,24 24,44 4,24" stroke="currentColor" stroke-dasharray="2 2" opacity="0.6" />
            <!-- Tactical Head / Torso silhouette abstraction -->
            <circle cx="24" cy="18" r="6" stroke="currentColor" stroke-width="2" />
            <path d="M14 36 C14 28, 34 28, 34 36" stroke="currentColor" stroke-width="2" />
            <!-- Inner crosshair -->
            <line x1="24" y1="8" x2="24" y2="12" stroke="currentColor" />
            <line x1="24" y1="24" x2="24" y2="28" stroke="currentColor" />
          </svg>
          <span class="font-mono text-[8px] tracking-widest text-[var(--terra-text-muted)] mt-1 uppercase">
            // BIOMETRIC_ID
          </span>
        </div>

        <!-- Frame Lower Label -->
        <div class="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 px-1 flex items-center justify-between font-mono text-[8px] text-[var(--terra-text-muted)] border-t border-[var(--terra-border)]">
          <span>{uid}</span>
          <span class="text-[var(--terra-accent-primary)] font-bold">PRTS-CAM</span>
        </div>
      </div>
    </div>

    <!-- Operator Data Bay & Typography (8 cols) -->
    <div class="sm:col-span-8 flex flex-col justify-between space-y-3">
      <div>
        <div class="flex items-baseline gap-2">
          <h3 class="font-display text-3xl sm:text-4xl font-black tracking-tight uppercase text-[var(--terra-text-primary)] leading-none">
            {codename}
          </h3>
          {#if nameZh}
            <span class="font-mono text-sm tracking-wider text-[var(--terra-text-secondary)] font-bold">
              // {nameZh}
            </span>
          {/if}
        </div>
        
        <div class="mt-1 font-mono text-xs font-semibold tracking-wider text-[var(--terra-accent-primary)] uppercase flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-[var(--terra-accent-primary)]"></span>
          <span>{archetype}</span>
        </div>
      </div>

      <!-- Swiss Grid Micro-specifications -->
      <div class="grid grid-cols-2 gap-2 py-2 px-3 bg-[var(--terra-bg-base)]/50 border border-[var(--terra-border)] font-mono text-[10px]">
        <div>
          <span class="text-[var(--terra-text-muted)] block">ORGANIZATION</span>
          <span class="text-[var(--terra-text-primary)] font-semibold">RHODES ISLAND PHARM.</span>
        </div>
        <div>
          <span class="text-[var(--terra-text-muted)] block">ORIGINIUM INFECTION</span>
          <span class="text-[var(--terra-text-primary)] font-semibold">PRTS-MONITORED</span>
        </div>
        <div>
          <span class="text-[var(--terra-text-muted)] block">ASSIGNMENT CODE</span>
          <span class="text-[var(--terra-text-primary)] font-semibold">{uid}</span>
        </div>
        <div>
          <span class="text-[var(--terra-text-muted)] block">COMBAT READINESS</span>
          <span class="text-[var(--terra-accent-primary)] font-semibold uppercase">{statusLabel}</span>
        </div>
      </div>

      <!-- Barcode identifier -->
      <div class="flex items-center justify-between pt-1">
        <TerraBarcode code={uid} serial={`PRTS-${codename}`} height={20} />
      </div>
    </div>

  </div>

  <!-- Bottom Action Bar: Deploy & Telemetry Buttons -->
  <div class="pt-3 border-t border-[var(--terra-border)] flex flex-wrap items-center justify-between gap-3">
    <div class="font-mono text-[9px] text-[var(--terra-text-muted)] tracking-wider">
      PRTS // OPERATOR DOSSIER SPEC V0.6.0
    </div>
    <div class="flex items-center gap-2">
      <TerraButton
        variant="outline"
        size="sm"
        cut="none"
        onclick={ontelemetry}
      >
        VIEW TELEMETRY
      </TerraButton>
      <TerraButton
        variant="primary"
        size="sm"
        cut="tr"
        onclick={ondeploy}
      >
        DEPLOY OPERATOR
      </TerraButton>
    </div>
  </div>

</div>
