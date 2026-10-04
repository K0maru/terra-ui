<script lang="ts">
  interface Props {
    opacity?: number
    elevation?: string
    zone?: string
    animated?: boolean
    class?: string
  }

  let {
    opacity = 0.25,
    elevation = '+1420m',
    zone = 'VALLEY_IV // SECTOR_03',
    animated = true,
    class: className = ''
  }: Props = $props()
</script>

<div
  class="pointer-events-none select-none overflow-hidden absolute inset-0 {className}"
  style="opacity: {opacity};"
>
  <!-- SVG Topographic Contour Elevation Lines -->
  <svg
    class="w-full h-full object-cover"
    viewBox="0 0 1440 900"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="contourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--terra-accent-primary)" stop-opacity="0.8" />
        <stop offset="50%" stop-color="var(--terra-accent-primary)" stop-opacity="0.3" />
        <stop offset="100%" stop-color="var(--terra-accent-secondary, var(--terra-accent-primary))" stop-opacity="0.6" />
      </linearGradient>
    </defs>

    <!-- Base Terrain Contours (Layer 1 - Deep Valley) -->
    <path
      d="M -100 200 C 300 260 500 120 800 220 C 1100 320 1300 180 1600 240"
      stroke="url(#contourGrad)"
      stroke-width="1.2"
      stroke-dasharray="4 4"
      class:animate-pulse={animated}
    />
    <path
      d="M -100 260 C 280 320 520 180 820 280 C 1120 380 1280 240 1600 300"
      stroke="url(#contourGrad)"
      stroke-width="1"
    />

    <!-- Layer 2 - Major Ridge Line -->
    <path
      d="M -100 340 C 260 410 490 270 790 370 C 1090 470 1260 320 1600 390"
      stroke="url(#contourGrad)"
      stroke-width="1.8"
    />
    <path
      d="M -100 420 C 240 500 470 360 760 460 C 1050 560 1240 410 1600 480"
      stroke="url(#contourGrad)"
      stroke-width="1.2"
    />

    <!-- Layer 3 - Plateau Elevation Circles -->
    <ellipse
      cx="980"
      cy="420"
      rx="240"
      ry="120"
      stroke="url(#contourGrad)"
      stroke-width="1.5"
    />
    <ellipse
      cx="980"
      cy="420"
      rx="170"
      ry="80"
      stroke="url(#contourGrad)"
      stroke-width="1.2"
      stroke-dasharray="6 3"
    />
    <ellipse
      cx="980"
      cy="420"
      rx="100"
      ry="45"
      stroke="url(#contourGrad)"
      stroke-width="1.8"
    />
    <ellipse
      cx="980"
      cy="420"
      rx="40"
      ry="18"
      stroke="url(#contourGrad)"
      stroke-width="2"
    />

    <!-- Layer 4 - Riverbed Basin -->
    <path
      d="M -100 520 C 300 620 600 480 900 580 C 1200 680 1400 560 1600 620"
      stroke="url(#contourGrad)"
      stroke-width="1.5"
    />
    <path
      d="M -100 610 C 280 710 580 570 880 670 C 1180 770 1380 650 1600 710"
      stroke="url(#contourGrad)"
      stroke-width="1.2"
    />
    <path
      d="M -100 720 C 260 820 560 680 860 780 C 1160 880 1360 760 1600 820"
      stroke="url(#contourGrad)"
      stroke-width="1"
      stroke-dasharray="8 4"
    />

    <!-- Geodetic Benchmark Crosshairs -->
    <g stroke="var(--terra-accent-primary)" stroke-width="1">
      <path d="M 970 420 L 990 420 M 980 410 L 980 430" />
      <path d="M 410 320 L 430 320 M 420 310 L 420 330" />
      <path d="M 1250 680 L 1270 680 M 1260 670 L 1260 690" />
    </g>
  </svg>

  <!-- Elevation Coordinates Micro-Labels -->
  <div class="absolute top-1/4 right-[28%] font-mono text-[9px] tracking-widest text-[var(--terra-accent-primary)] opacity-70 flex flex-col items-end">
    <span>ELEV: {elevation}</span>
    <span>PEAK_SURVEY // INDEX-04</span>
  </div>

  <div class="absolute bottom-16 left-8 font-mono text-[9px] tracking-widest text-[var(--terra-text-muted)] opacity-60">
    <span>ZONE: {zone}</span>
    <span class="block">CONTOUR_INTERVAL: 50m // DATUM_TALOS_II</span>
  </div>
</div>
