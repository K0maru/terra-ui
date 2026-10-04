<script lang="ts">
  interface Props {
    opacity?: number
    elevation?: string
    zone?: string
    animated?: boolean
    class?: string
  }

  let {
    opacity = 0.28,
    elevation = '+2680m',
    zone = 'VALLEY_IV // MOUNTAIN_RIDGE_SURVEY',
    animated = true,
    class: className = ''
  }: Props = $props()
</script>

<div
  class="pointer-events-none select-none overflow-hidden absolute inset-0 {className}"
  style="opacity: {opacity};"
>
  <!-- SVG Topographic Mountainous Contour Elevation Vector Field -->
  <svg
    class="w-full h-full object-cover"
    viewBox="0 0 1600 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <!-- Dual-tone Mountain Gradient linked to Theme Accent -->
      <linearGradient id="mountainContourGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--terra-accent-primary)" stop-opacity="0.9" />
        <stop offset="45%" stop-color="var(--terra-accent-primary)" stop-opacity="0.4" />
        <stop offset="100%" stop-color="var(--terra-accent-secondary, var(--terra-accent-primary))" stop-opacity="0.75" />
      </linearGradient>

      <linearGradient id="indexContourGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="var(--terra-accent-primary)" stop-opacity="1" />
        <stop offset="100%" stop-color="var(--terra-accent-primary)" stop-opacity="0.6" />
      </linearGradient>
    </defs>

    <!-- ====================================================================
         1. BASE REGIONAL ESCARPMENT & CANYON DRAINAGE (+980m -> +1420m)
         Lowland drainage valley lines with V-notches pointing upstream
         ==================================================================== -->
    <!-- +850m Base lowland fringe -->
    <path
      d="M -100 920 C 240 960 480 880 720 940 C 960 1000 1280 890 1700 950"
      stroke="url(#mountainContourGrad)"
      stroke-width="0.9"
      stroke-dasharray="4 4"
    />

    <!-- +980m Index Contour: Canyon Mouth -->
    <path
      d="M -100 840 C 220 890 420 780 660 840 C 900 900 1200 810 1700 860"
      stroke="url(#indexContourGrad)"
      stroke-width="1.8"
    />

    <!-- +1120m Alluvial fan intermediate -->
    <path
      d="M -100 770 C 180 810 380 710 610 760 C 850 810 1150 730 1700 780"
      stroke="url(#mountainContourGrad)"
      stroke-width="1"
    />

    <!-- +1260m Intermediate contour -->
    <path
      d="M -100 700 C 150 740 340 640 570 690 C 810 740 1100 660 1700 700"
      stroke="url(#mountainContourGrad)"
      stroke-width="1"
    />

    <!-- +1420m Major Index Contour: Valley IV Basin Threshold -->
    <path
      d="M -100 620 C 140 660 320 560 540 610 C 760 660 1050 580 1700 630"
      stroke="url(#indexContourGrad)"
      stroke-width="2"
    />

    <!-- +1560m Valley canyon transition -->
    <path
      d="M -100 550 C 120 580 300 490 510 540 C 720 590 1000 520 1700 560"
      stroke="url(#mountainContourGrad)"
      stroke-width="1"
    />

    <!-- +1700m Sub-mountain plateau contour -->
    <path
      d="M -100 480 C 120 510 280 430 480 470 C 690 510 950 450 1700 500"
      stroke="url(#mountainContourGrad)"
      stroke-width="1"
      stroke-dasharray="6 3"
    />

    <!-- ====================================================================
         2. SADDLE PASS & HYPERBOLIC FLANKING CONTOURS (+1640m -> +1850m)
         Hourglass saddle pass connecting Alpha and Beta massifs
         ==================================================================== -->
    <!-- Saddle lower hyperbolic contour -->
    <path
      d="M 280 460 C 440 440 620 480 740 440 C 860 400 1020 450 1260 440"
      stroke="url(#mountainContourGrad)"
      stroke-width="1.2"
    />
    <!-- Saddle upper hyperbolic contour -->
    <path
      d="M 320 400 C 460 380 640 420 740 380 C 840 340 1000 390 1220 390"
      stroke="url(#mountainContourGrad)"
      stroke-width="1.2"
    />

    <!-- +1850m Major Ridge Index Contour (Encompassing both peaks) -->
    <path
      d="M 220 380 C 310 230 520 180 680 250 C 780 290 850 260 960 210 C 1140 160 1340 250 1320 430 C 1300 560 1100 580 940 550 C 820 520 740 550 630 540 C 460 520 280 500 220 380 Z"
      stroke="url(#indexContourGrad)"
      stroke-width="2.2"
    />

    <!-- ====================================================================
         3. MOUNTAIN PEAK ALPHA (PRIMARY SUMMIT: +2680m)
         Concentric closed organic loops located in right sector (x~1060, y~350)
         ==================================================================== -->
    <!-- Alpha +2020m Closed Loop -->
    <path
      d="M 850 370 C 870 270 980 230 1090 240 C 1200 250 1270 320 1260 410 C 1250 490 1160 530 1060 520 C 950 510 840 450 850 370 Z"
      stroke="url(#mountainContourGrad)"
      stroke-width="1.2"
    />

    <!-- Alpha +2240m Major Index Contour Loop -->
    <path
      d="M 890 360 C 910 280 1000 250 1090 260 C 1180 270 1230 330 1220 400 C 1210 470 1130 500 1050 490 C 970 480 880 430 890 360 Z"
      stroke="url(#indexContourGrad)"
      stroke-width="2"
      class:animate-pulse={animated}
    />

    <!-- Alpha +2380m Intermediate Loop -->
    <path
      d="M 940 360 C 950 300 1020 280 1090 290 C 1150 300 1190 340 1180 390 C 1170 440 1110 470 1050 460 C 990 450 930 410 940 360 Z"
      stroke="url(#mountainContourGrad)"
      stroke-width="1.2"
    />

    <!-- Alpha +2520m Summit Shoulders -->
    <path
      d="M 980 360 C 990 320 1040 300 1090 310 C 1140 320 1160 350 1150 380 C 1140 420 1100 440 1050 430 C 1010 420 970 390 980 360 Z"
      stroke="url(#mountainContourGrad)"
      stroke-width="1.4"
      stroke-dasharray="6 3"
    />

    <!-- Alpha +2680m Summit Peak Crown -->
    <path
      d="M 1030 360 C 1040 335 1070 325 1100 335 C 1125 345 1135 365 1125 385 C 1115 405 1085 415 1060 405 C 1040 395 1025 380 1030 360 Z"
      stroke="url(#indexContourGrad)"
      stroke-width="2.4"
    />

    <!-- ====================================================================
         4. MOUNTAIN PEAK BETA (SECONDARY SUMMIT: +2360m)
         Concentric closed organic loops in left sector (x~490, y~320)
         ==================================================================== -->
    <!-- Beta +2020m Closed Loop -->
    <path
      d="M 330 330 C 350 240 440 210 540 220 C 640 230 690 300 680 370 C 670 440 600 470 510 460 C 420 450 320 400 330 330 Z"
      stroke="url(#mountainContourGrad)"
      stroke-width="1.2"
    />

    <!-- Beta +2160m Closed Intermediate -->
    <path
      d="M 380 325 C 395 255 465 235 540 245 C 615 255 650 305 640 360 C 630 415 575 440 510 430 C 445 420 370 380 380 325 Z"
      stroke="url(#mountainContourGrad)"
      stroke-width="1.2"
    />

    <!-- Beta +2360m Summit Crest -->
    <path
      d="M 430 320 C 445 275 490 260 540 270 C 585 280 610 315 600 350 C 590 385 555 405 510 395 C 470 385 420 355 430 320 Z"
      stroke="url(#indexContourGrad)"
      stroke-width="2"
    />

    <!-- ====================================================================
         5. PLATEAU RIDGELINES (STRUCTURAL WATERSHED DIVIDES)
         ==================================================================== -->
    <path
      d="M 220 380 Q 380 310 520 330 T 740 380 T 1070 360 T 1320 430"
      stroke="var(--terra-accent-primary)"
      stroke-width="1.2"
      stroke-dasharray="8 6"
      opacity="0.8"
    />

    <!-- ====================================================================
         6. GEODETIC BENCHMARK SURVEY CROSSHAIRS
         ==================================================================== -->
    <g stroke="var(--terra-accent-primary)" stroke-width="1.2" opacity="0.9">
      <!-- Benchmark BM-01: Alpha Summit (+2680m) -->
      <path d="M 1060 350 L 1080 350 M 1070 340 L 1070 360" />
      <circle cx="1070" cy="350" r="12" stroke="var(--terra-accent-primary)" stroke-width="0.8" stroke-dasharray="3 3" />

      <!-- Benchmark BM-02: Beta Summit (+2360m) -->
      <path d="M 510 320 L 530 320 M 520 310 L 520 330" />
      <circle cx="520" cy="320" r="10" stroke="var(--terra-accent-primary)" stroke-width="0.8" stroke-dasharray="3 3" />

      <!-- Benchmark BM-03: Saddle Pass (+1640m) -->
      <path d="M 730 380 L 750 380 M 740 370 L 740 390" />

      <!-- Benchmark BM-04: Valley IV Basin (+980m) -->
      <path d="M 650 840 L 670 840 M 660 830 L 660 850" />
    </g>

    <!-- Geographic Benchmark Text Labels in SVG coordinate space -->
    <g font-family="monospace" font-size="10" fill="var(--terra-accent-primary)" opacity="0.85">
      <text x="1090" y="345" font-weight="bold">+2680m (PEAK ALPHA)</text>
      <text x="1090" y="358" font-size="8" fill="var(--terra-text-muted)">TRIANGULATION BENCHMARK BM-01</text>

      <text x="540" y="315" font-weight="bold">+2360m (PEAK BETA)</text>
      <text x="540" y="328" font-size="8" fill="var(--terra-text-muted)">TRIANGULATION BENCHMARK BM-02</text>

      <text x="755" y="375" font-size="9">+1640m (SADDLE PASS)</text>
      <text x="675" y="835" font-weight="bold">+980m (TALOS-II LOWLAND)</text>
    </g>
  </svg>

  <!-- ====================================================================
       7. CARTOGRAPHIC ELEVATION INDEX LABELS & TELEMETRY OVERLAYS
       ==================================================================== -->
  <!-- Top Right: Alpha Massif Index -->
  <div class="absolute top-[22%] right-[14%] font-mono text-[9px] tracking-widest text-[var(--terra-accent-primary)] opacity-85 flex flex-col items-end">
    <div class="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--terra-bg-surface,#18181b)] border border-[var(--terra-accent-primary)]/40 shadow-sm">
      <span class="w-1.5 h-1.5 bg-[var(--terra-accent-primary)]"></span>
      <span class="font-bold">+2680m (PEAK ALPHA)</span>
    </div>
    <span class="mt-0.5 text-[8px] text-[var(--terra-text-muted)]">SECTOR_TALOS_II // HIGH_CREST</span>
  </div>

  <!-- Mid Left: Beta Crest Index -->
  <div class="absolute top-[26%] left-[22%] font-mono text-[9px] tracking-widest text-[var(--terra-accent-primary)] opacity-75 hidden sm:flex flex-col items-start">
    <div class="flex items-center gap-1.5 px-1.5 py-0.5 bg-[var(--terra-bg-surface,#18181b)] border border-[var(--terra-border)]">
      <span class="font-bold">+2240m</span>
    </div>
    <span class="text-[8px] text-[var(--terra-text-muted)]">CONTOUR_INDEX // WEST_SLOPE</span>
  </div>

  <!-- Saddle Ridge Index -->
  <div class="absolute top-[42%] left-[45%] font-mono text-[9px] tracking-widest text-[var(--terra-accent-primary)] opacity-70 hidden md:block">
    <span class="px-1.5 py-0.5 bg-[var(--terra-bg-surface,#18181b)] border border-[var(--terra-border)] font-bold">
      +1850m
    </span>
  </div>

  <!-- Bottom Left: Valley IV Basin Index -->
  <div class="absolute bottom-[28%] left-[10%] sm:left-[16%] font-mono text-[9px] tracking-widest text-[var(--terra-accent-primary)] opacity-85">
    <div class="flex items-center gap-2 px-2 py-0.5 bg-[var(--terra-bg-surface,#18181b)] border border-[var(--terra-accent-primary)]/40">
      <span class="w-1.5 h-1.5 rounded-full bg-[var(--terra-accent-primary)]"></span>
      <span class="font-bold">+1420m (VALLEY IV BASIN)</span>
    </div>
    <span class="block mt-0.5 text-[8px] text-[var(--terra-text-muted)]">ALLUVIAL MINING DRAINAGE</span>
  </div>

  <!-- Bottom Far Lowland Index -->
  <div class="absolute bottom-[10%] left-[8%] sm:left-[12%] font-mono text-[9px] tracking-widest text-[var(--terra-accent-primary)] opacity-70">
    <span class="px-1.5 py-0.5 bg-[var(--terra-bg-surface,#18181b)] border border-[var(--terra-border)] font-bold">
      +980m
    </span>
  </div>

  <!-- Footer Survey Coordinate Legend -->
  <div class="absolute bottom-8 right-8 font-mono text-[9px] tracking-widest text-[var(--terra-text-muted)] opacity-75 hidden sm:flex flex-col items-end">
    <div class="flex items-center gap-2">
      <span class="text-[var(--terra-accent-primary)] font-bold">TOPOGRAPHIC SURVEY</span>
      <span>//</span>
      <span>{zone}</span>
    </div>
    <div class="text-[8px] mt-0.5 text-[var(--terra-text-muted)]">
      DATUM: TALOS-II GEODETIC // CONTOUR INTERVAL: 50m // INDEX: 200m
    </div>
  </div>
</div>
