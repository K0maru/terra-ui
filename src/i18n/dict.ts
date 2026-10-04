export type Locale = 'en' | 'zh'

export interface UnitProfile {
  codename: string
  designation: string
  archetype: string
  tier: number
  clearance: string
  status: 'online' | 'standby' | 'alert' | 'offline'
  statusLabel: string
  uid: string
  assignment: string
}

export interface SectorInfo {
  name: string
  coord: string
  status: string
  density: string
}

export interface SectorTabItem {
  key: string
  label: string
  shortCode: string
  badge: string
}

export interface TranslationSchema {
  nav: {
    brandTitle: string
    brandSubtitle: string
    sec01: string
    sec02: string
    sec03: string
    legal: string
    replayBoot: string
    dark: string
    light: string
    fps: string
    nominal: string
    themes: {
      cyan: string
      amber: string
      emerald: string
    }
  }
  boot: {
    title: string
    sub: string
    status1: string
    status2: string
    status3: string
    status4: string
    status5: string
    statusReady: string
    slogan: string
    busNominal: string
    shutter: string
    freq: string
    footerProtocol: string
    footerDesignSystem: string
  }
  sec01: {
    tag: string
    deskTag: string
    swissGridTag: string
    title: string
    sub: string
    badgeFlat: string
    badgeZeroClutter: string
    unitsTitle: string
    unitsSub: string
    profileTitle: string
    directiveDispatch: string
    queryPlaceholder: string
    executeCmd: string
    clearanceTitle: string
    clearAuthorized: string
    clearHighVolt: string
    clearCorrosion: string
    clearLinked: string
    clearV2: string
    actuatorsTitle: string
    executeFull: string
    overrideLink: string
    standby: string
    purgeCorrosion: string
    beaconsTitle: string
    nominal: string
    idle: string
    alert: string
    offline: string
    logTitle: string
    logStream: string
    chart1Title: string
    chart1Sub: string
    chart2Title: string
    chart2Sub: string
    gpuNote: string
    scrollDown: string
  }
  sec02: {
    tag: string
    title: string
    sub: string
    cycleBtn: string
    spatialHint: string
    radarTitle: string
    radarBadge: string
    radarTilt: string
    radarSheen: string
    dialsTitle: string
    dialsActive: string
    flowTitle: string
    flowBadge: string
    latencyTitle: string
    latencyBadge: string
    refreshTelemetry: string
    donutTitle: string
    donutCenter: string
    donutItems: {
      pwr: string
      def: string
      bus: string
      env: string
    }
    busTitle: string
    busMain: string
    busBurst: string
    busBurstSub: string
    busNotes: string[]
    scrollDown: string
  }
  sec03: {
    tag: string
    title: string
    sub: string
    panel2DTitle: string
    panel3DTitle: string
    btnMatrixTitle: string
    btnPrimary: string
    btnOutline: string
    btnGhost: string
    btnDanger: string
    btnMedium: string
    btnLarge: string
    btnDisabled: string
    badgeMatrixTitle: string
    badgePrimary: string
    badgeWarning: string
    badgeDanger: string
    badgeSuccess: string
    badgeOutline: string
    beaconMatrixTitle: string
    beaconOnline: string
    beaconStandby: string
    beaconAlert: string
    beaconOffline: string
    barcodeMatrixTitle: string
    inputMatrixTitle: string
    inputPlaceholder: string
    oscTitle: string
    spatialCardTitle: string
    tiltChassis: string
    parallaxDesc: string
    segBarTitle: string
    segBarLabel: string
    segBarSub: string
    vtabsTitle: string
    bracketsTitle: string
    bracketsHud: string
    labTitle: string
    sectorsTitle: string
    contourLabel: string
    contourSub: string
    visible: string
    hidden: string
    sliderTitle: string
    chamferLabel: string
    zoomLabel: string
    gpuHint: string
    viewportTitle: string
    statusLabel: string
    chamferVal: string
    zoomVal: string
    themeVal: string
  }
  footer: {
    systemName: string
    themes: string
    transition: string
    interaction: string
    disclaimerTag: string
    disclaimerText: string
    refTitle: string
    refLinks: Array<{
      label: string
      url: string
      badge: string
    }>
  }
  units: UnitProfile[]
  sectors: Record<string, SectorInfo>
  sectorTabs: SectorTabItem[]
  profileCard: {
    divisionRole: string
    biometricStatus: string
    serialIdentifier: string
    actuationReady: string
    telemetryLink: string
    actuateUnit: string
    profileVersion: string
    synchronized: string
  }
}

export const translations: Record<Locale, TranslationSchema> = {
  en: {
    nav: {
      brandTitle: 'TERRA UI // FUNCTIONAL DESIGN SYSTEM',
      brandSubtitle: 'A high-performance Svelte 5 component library for industrial telemetry & cybernetic interfaces.',
      sec01: '01 // 2D FLAT INTERFACE',
      sec02: '02 // 3D SPATIAL COMPLEX',
      sec03: '03 // MATRIX & LAB',
      legal: 'LEGAL / ATTRIBUTION',
      replayBoot: 'REPLAY BOOT',
      dark: '🌙 DARK',
      light: '☀️ LIGHT',
      fps: 'FPS',
      nominal: 'NOMINAL',
      themes: {
        cyan: 'BLUEPRINT',
        amber: 'INDUSTRIAL',
        emerald: 'TELEMETRY'
      }
    },
    boot: {
      title: 'TERRA UI // SYSTEM INITIALIZATION & KERNEL SELF-TEST',
      sub: 'TERRA UI DESIGN SYSTEM // KERNEL_LOADER_V0.8.0',
      status1: 'KERNEL // SVELTE_RUNES_CORE_INIT',
      status2: 'DISPLAY // GPU_COMPOSITOR_PIPELINE_INIT',
      status3: 'TOKENS // DESIGN_TOKENS_SPECTRUM_SYNC',
      status4: 'ENERGY_BUS // INDUSTRIAL_TELEMETRY_CALIBRATED',
      status5: 'COMPONENTS // ATOMIC_PRIMITIVES_READY',
      statusReady: 'SYSTEM_ALL_CLEAR // RUNTIME_ACTIVE',
      slogan: 'TERRA UI // SYSTEM INITIALIZATION & KERNEL SELF-TEST',
      busNominal: '◤ BUS_TELEMETRY_NOMINAL ◢',
      shutter: 'SHUTTER: COMPOSITOR_SCALE_X',
      freq: 'FREQ: 120Hz',
      footerProtocol: 'PROTOCOL_V8_PRODUCTION',
      footerDesignSystem: 'FUNCTIONAL DESIGN SYSTEM'
    },
    sec01: {
      tag: 'SECTION 01 // 2D FLAT INTERFACE & DATA SYSTEM',
      deskTag: '// OPERATIONS // SYSTEM_CONTROL_DESK',
      swissGridTag: 'SWISS_GRID_LAYOUT',
      title: 'SYSTEM OPERATIONS & DATA CONSOLE',
      sub: 'High-density typography, Swiss layout grid, forms, badges, and flat telemetry charts.',
      badgeFlat: '2D FLAT SWISS',
      badgeZeroClutter: 'ZERO RUNTIME CLUTTER',
      unitsTitle: '// DEVELOPER PROFILE:',
      unitsSub: 'CORE REPOSITORY ARCHITECT',
      profileTitle: 'SYSTEM OPERATIONS & DISPATCH BAY',
      directiveDispatch: 'TERMINAL COMMAND & QUERY DISPATCH',
      queryPlaceholder: 'ENTER SYSTEM QUERY / PARAMETER...',
      executeCmd: 'SUBMIT',
      clearanceTitle: 'SECURITY CLEARANCE & SERVICE STATUS',
      clearAuthorized: 'AUTHORIZED',
      clearHighVolt: 'PRODUCTION',
      clearCorrosion: 'VERIFIED',
      clearLinked: 'STABLE_API',
      clearV2: 'PROTOCOL_V8',
      actuatorsTitle: 'SYSTEM OPERATIONS // ACTIONS',
      executeFull: 'SUBMIT QUERY',
      overrideLink: 'SYNC CLUSTER',
      standby: 'STANDBY',
      purgeCorrosion: 'RESET BUFFER',
      beaconsTitle: 'SERVICE STATUS BEACONS',
      nominal: 'ACTIVE',
      idle: 'STANDBY',
      alert: 'WARNING',
      offline: 'OFFLINE',
      logTitle: 'SYS // REAL-TIME DISPATCH LOG',
      logStream: 'STREAM ACTIVE',
      chart1Title: 'SYSTEM RESOURCE ALLOCATION',
      chart1Sub: '// METRIC.HISTOGRAM',
      chart2Title: 'NETWORK TELEMETRY STREAM',
      chart2Sub: '// TELEMETRY.WAVEFORM',
      gpuNote: 'ZERO-VDOM // SVELTE 5 NATIVE RUNES',
      scrollDown: 'SCROLL DOWN // 3D SPATIAL COMPLEX'
    },
    sec02: {
      tag: 'SECTION 02 // 3D SPATIAL & TELEMETRY COMPLEX',
      title: 'SPATIAL INTERACTION & TELEMETRY COMPLEX',
      sub: 'Pointer-driven multi-axis 3D perspective, dynamic specular sheen, and industrial energy telemetry.',
      cycleBtn: 'CYCLE TELEMETRY',
      spatialHint: 'HOVER POINTER OVER CARDS TO EXPERIENCE MULTI-AXIS 3D PERSPECTIVE TILT AND Z-DEPTH PARALLAX',
      radarTitle: 'GPU COMPOSITOR OBSERVABILITY',
      radarBadge: '3D HOVER ACTIVE',
      radarTilt: 'TILT AXIS: ROTATE_X/Y REALTIME',
      radarSheen: 'SPECULAR SHEEN: ACCELERATED',
      dialsTitle: 'SPATIAL SENSOR TELEMETRY',
      dialsActive: 'STREAMING',
      flowTitle: 'STREAM PROCESSING EFFICIENCY',
      flowBadge: 'HIGH-LOAD',
      latencyTitle: 'PROTOCOL ROUNDTRIP LATENCY',
      latencyBadge: 'REALTIME',
      refreshTelemetry: 'REFRESH TELEMETRY',
      donutTitle: 'STORAGE ALLOCATION RATIO',
      donutCenter: 'ALLOCATION',
      donutItems: {
        pwr: 'COMPUTE SHARDS',
        def: 'MEMORY POOL',
        bus: 'IO BUS CACHE',
        env: 'INGRESS GATEWAY'
      },
      busTitle: 'INDUSTRIAL ENERGY BUS & RECESSED CHASSIS',
      busMain: 'MAIN POWER GRID LOAD (THREE-PHASE 480V)',
      busBurst: 'CAPACITOR BUFFER ARRAY (BURST STORAGE)',
      busBurstSub: '⚡ DUAL-INVERTER BUFFER // 1000V CAPACITOR BANK',
      busNotes: [
        '• 480V three-phase industrial main grid load maintained within safety thresholds.',
        '• -20° recessed industrial chassis & charging pulse operate 100% on GPU Compositor thread.',
        '• Multi-axis 3D suspended cards and hardware accelerated lighting create genuine topological depth.'
      ],
      scrollDown: 'SCROLL DOWN // COMPONENT MATRIX'
    },
    sec03: {
      tag: 'SECTION 03 // UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB',
      title: 'UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB',
      sub: '2D flat interfaces and 3D spatial interactive primitives // Real-time parametric tuning & tactile feedback.',
      panel2DTitle: '2D FLAT GRAPHIC PRIMITIVES & CHARTS',
      panel3DTitle: '3D SPATIAL & INDUSTRIAL PRIMITIVES',
      btnMatrixTitle: '<TerraButton> // VARIANTS & SIZES',
      btnPrimary: 'PRIMARY',
      btnOutline: 'OUTLINE',
      btnGhost: 'GHOST',
      btnDanger: 'DANGER',
      btnMedium: 'MEDIUM',
      btnLarge: 'LARGE',
      btnDisabled: 'DISABLED',
      badgeMatrixTitle: '<TerraBadge> // SYSTEM STATUS BADGES',
      badgePrimary: 'PRIMARY',
      badgeWarning: 'WARNING',
      badgeDanger: 'CRITICAL',
      badgeSuccess: 'SUCCESS',
      badgeOutline: 'OUTLINE',
      beaconMatrixTitle: '<TerraStatusBeacon> // 4-STATE STATUS BEACONS',
      beaconOnline: 'ONLINE',
      beaconStandby: 'STANDBY',
      beaconAlert: 'ALERT',
      beaconOffline: 'OFFLINE',
      barcodeMatrixTitle: '<TerraBarcode> // HIGH-DENSITY IDENTIFIERS',
      inputMatrixTitle: '<TerraInput> // CONSOLE INPUT',
      inputPlaceholder: 'EDITABLE MATRIX PARAMETER...',
      oscTitle: '<TerraLineChart> // REALTIME TELEMETRY',
      spatialCardTitle: '<TerraSpatialCard> // PHYSICAL 3D SUSPENSION',
      tiltChassis: 'TILT-RESPONSE CHASSIS',
      parallaxDesc: 'MOVE CURSOR TO FEEL PARALLAX DEPTH',
      segBarTitle: '<TerraSegmentBar> // -20° INDUSTRIAL RECESSED BUS',
      segBarLabel: 'ENERGY_BUS_LOAD',
      segBarSub: '⚡ RECESSED INDUSTRIAL CAVITY // CHARGING PULSE',
      vtabsTitle: '<TerraVerticalTabs> // FLOATING CURSOR TABS',
      bracketsTitle: '<TerraCornerBrackets> & <TerraCadPattern> // HUD FOCUS',
      bracketsHud: 'FOCUS RETICLE // INTERACTIVE CAD COORDINATE LAYER',
      labTitle: 'PARAMETRIC CALIBRATION & REALTIME VIEWPORT',
      sectorsTitle: 'DATA CLUSTERS:',
      contourLabel: 'CONTOUR OVERLAY',
      contourSub: 'TOPOGRAPHIC ELEVATION LAYER',
      visible: 'VISIBLE',
      hidden: 'HIDDEN',
      sliderTitle: 'PRECISION VERTICAL CONTROLS',
      chamferLabel: 'CHAMFER RADIUS',
      zoomLabel: 'VIEWPORT SCALE',
      gpuHint: 'GPU HARDWARE COMPOSITOR (60+ FPS)',
      viewportTitle: 'REALTIME VIEWPORT',
      statusLabel: 'STATUS:',
      chamferVal: 'CHAMFER:',
      zoomVal: 'ZOOM:',
      themeVal: 'THEME:'
    },
    footer: {
      systemName: 'TERRA-UI // FUNCTIONAL DESIGN SYSTEM (v0.8.0)',
      themes: 'THEMES: BLUEPRINT / INDUSTRIAL / TELEMETRY',
      transition: 'AXES: 2D FLAT INTERFACE + 3D SPATIAL COMPLEX',
      interaction: 'ZERO-VDOM // SVELTE 5 NATIVE RUNES',
      disclaimerTag: 'LEGAL NOTICE // ATTRIBUTION & INSPIRATION',
      disclaimerText: 'Terra-UI is an independent, non-commercial open-source design system. The visual aesthetics, typography, and interaction patterns are inspired by "Arknights" and "Arknights: Endfield", developed and owned by Shanghai HYPERGRYPH Network Technology Co., Ltd. All related trademarks, trade dress, and intellectual property belong to HYPERGRYPH. This project is created strictly for academic research, engineering exploration, and design system demonstration. No official proprietary assets, code, or artwork are extracted, redistributed, or claimed as our own.',
      refTitle: 'PRIMARY DESIGN INSPIRATION & REFERENCES',
      refLinks: [
        { label: 'HYPERGRYPH OFFICIAL', url: 'https://www.hypergryph.com/', badge: 'CORPORATE' },
        { label: 'ARKNIGHTS OFFICIAL', url: 'https://ak.hypergryph.com/', badge: 'IP OWNER' },
        { label: 'ENDFIELD OFFICIAL', url: 'https://endfield.hypergryph.com/', badge: 'GAME DESIGN' },
        { label: 'DESIGN AESTHETICS // BV142zkBbEL6', url: 'https://www.bilibili.com/video/BV142zkBbEL6/', badge: 'BILIBILI' },
        { label: 'ATLOS GITHUB REPO', url: 'https://github.com/Terra-Online/Atlos', badge: 'OPEN SOURCE' }
      ]
    },
    units: [
      {
        codename: 'K0MARU',
        designation: 'LEAD MAINTAINER',
        archetype: 'CORE ARCHITECT // SYSTEM DESIGN',
        tier: 6,
        clearance: 'MAINTAINER // CORE',
        status: 'online',
        statusLabel: 'ACTIVE',
        uid: 'UID-93422639',
        assignment: 'TERRA-UI // CORE DESIGN SYSTEM'
      }
    ],
    sectors: {
      'us-east': {
        name: 'US-EAST-01 DATA CLUSTER',
        coord: 'LAT: 39°02\'N // LNG: 77°28\'W // DC-VA',
        status: 'OPTIMAL // 99.99%',
        density: 'THROUGHPUT: 42.8 Tbps // 0.8ms'
      },
      'ap-east': {
        name: 'AP-EAST-02 TELEMETRY HUB',
        coord: 'LAT: 22°18\'N // LNG: 114°10\'E // HK-01',
        status: 'ACTIVE // BALANCED',
        density: 'THROUGHPUT: 38.4 Tbps // 1.1ms'
      },
      'eu-central': {
        name: 'EU-CENTRAL-03 CORE NODE',
        coord: 'LAT: 50°06\'N // LNG: 08°40\'E // FRA-02',
        status: 'STANDBY // SYNCED',
        density: 'THROUGHPUT: 29.6 Tbps // 1.4ms'
      }
    },
    sectorTabs: [
      { key: 'us-east', label: 'US-EAST-01 // NORTH AMERICA', shortCode: 'US-01', badge: 'AMERICA' },
      { key: 'ap-east', label: 'AP-EAST-02 // ASIA PACIFIC', shortCode: 'AP-02', badge: 'ASIA-PAC' },
      { key: 'eu-central', label: 'EU-CENTRAL-03 // EUROPE CORE', shortCode: 'EU-03', badge: 'EUROPE' }
    ],
    profileCard: {
      divisionRole: 'ROLE // RESPONSIBILITY',
      biometricStatus: 'SERVICE STATUS',
      serialIdentifier: 'IDENTIFIER',
      actuationReady: 'ACTIVE STATUS',
      telemetryLink: 'GITHUB PROFILE',
      actuateUnit: 'REPOSITORY',
      profileVersion: 'TERRA UI // DEVELOPER PROFILE V0.8.0',
      synchronized: 'ACTIVE'
    }
  },
  zh: {
    nav: {
      brandTitle: 'TERRA UI // 泰拉全域机能设计系统',
      brandSubtitle: '基于 Svelte 5 的高性能系统监控与开发者控制台设计系统',
      sec01: '01 // 2D 平面界面系统',
      sec02: '02 // 3D 空间交互系统',
      sec03: '03 // 组件矩阵与实验室',
      legal: '版权与致敬声明',
      replayBoot: '重放引导',
      dark: '🌙 暗色',
      light: '☀️ 亮色',
      fps: '帧率',
      nominal: '正常',
      themes: {
        cyan: '工程蓝图',
        amber: '工业高压',
        emerald: '指标监控'
      }
    },
    boot: {
      title: 'TERRA UI // 系统初始化与内核自检序列',
      sub: '泰拉设计系统 // 核心引导程序 V0.8.0',
      status1: '内核 // Svelte 5 原生响应式运行时初始化',
      status2: '显示 // GPU 合成层硬件加速管线挂载',
      status3: '设计系统 // 全局机能设计令牌拓扑同步',
      status4: '指标总线 // 工业能耗感知矩阵标定完成',
      status5: '组件矩阵 // 2D/3D 原子图元全量就绪',
      statusReady: '自检完成 // 生产运行时已就绪',
      slogan: 'TERRA UI // 系统初始化与内核自检序列',
      busNominal: '◤ 系统监控总线稳态 ◢',
      shutter: '快门硬件: 横向展开',
      freq: '刷新率: 120Hz',
      footerProtocol: '标准生产协议 V8',
      footerDesignSystem: '机能工业设计系统'
    },
    sec01: {
      tag: '第 01 板块 // 2D 平面界面与数据系统',
      deskTag: '// 运维 // 系统运维控制台',
      swissGridTag: '瑞士排印网格',
      title: '系统运维与数据控制中枢',
      sub: '高密度排印、瑞士布局网格、表单、状态标签与扁平图表。',
      badgeFlat: '2D 平面网格',
      badgeZeroClutter: '零多余运行时',
      unitsTitle: '// 开发者档案:',
      unitsSub: '核心仓库架构师',
      profileTitle: '系统运维与指令调度舱',
      directiveDispatch: '终端运维指令与数据查询调度',
      queryPlaceholder: '输入系统查询指令或参数...',
      executeCmd: '提交',
      clearanceTitle: '安全权限与服务状态矩阵',
      clearAuthorized: '已授权',
      clearHighVolt: '生产环境',
      clearCorrosion: '已验证',
      clearLinked: '接口稳定',
      clearV2: '协议 V8',
      actuatorsTitle: '系统操作 // 动作执行',
      executeFull: '提交查询',
      overrideLink: '同步集群',
      standby: '待机就绪',
      purgeCorrosion: '重置缓存',
      beaconsTitle: '服务状态信标',
      nominal: '正常运行',
      idle: '待机',
      alert: '警告',
      offline: '离线',
      logTitle: '系统 // 实时运维调度日志',
      logStream: '实时数据流',
      chart1Title: '系统计算与内存资源分配',
      chart1Sub: '// 图表.资源分配直方图',
      chart2Title: '实时网络指标吞吐量',
      chart2Sub: '// 图表.吞吐量波形图',
      gpuNote: '零虚拟DOM // SVELTE 5 原生响应式',
      scrollDown: '向下滚动 // 3D 空间交互'
    },
    sec02: {
      tag: '第 02 板块 // 3D 空间交互与指标监控复合体',
      title: '空间交互与指标监控复合体',
      sub: '光标驱动多轴 3D 透视、动态镜面反射与工业指标监控。',
      cycleBtn: '刷新监控指标',
      spatialHint: '鼠标滑过卡片可体验多轴 3D 透视倾斜与 Z 轴空间视差',
      radarTitle: 'GPU 合成层实时监视',
      radarBadge: '3D 交互激活',
      radarTilt: '倾斜轴: 实时 X/Y 旋转',
      radarSheen: '高光反射: 硬件加速',
      dialsTitle: '实时指标与深度感知',
      dialsActive: '实时采集中',
      flowTitle: '流处理通道吞吐能效',
      flowBadge: '高负荷稳态',
      latencyTitle: '网络往返通讯延迟',
      latencyBadge: '微秒级',
      refreshTelemetry: '刷新指标',
      donutTitle: '存储与资源配比分布',
      donutCenter: '配比分布',
      donutItems: {
        pwr: '计算分片',
        def: '内存缓冲池',
        bus: 'IO 总线缓存',
        env: '网络入口网关'
      },
      busTitle: '工业供电网络负荷与下沉式机箱',
      busMain: '主供电网络负荷 (480V 工业三相)',
      busBurst: '高能电容缓冲阵列 (瞬态蓄能)',
      busBurstSub: '⚡ 双逆变器缓冲阵列 // 1000V 超级电容组',
      busNotes: [
        '• 480V 工业三相主干网负荷保持在安全标称区间。',
        '• -20° 下沉式倾斜嵌槽与高能脉冲完全运行于 GPU 合成层线程。',
        '• 多轴 3D 悬浮卡片结合硬件加速光泽，呈现纯粹的物理空间景深。'
      ],
      scrollDown: '向下滚动 // 组件矩阵'
    },
    sec03: {
      tag: '第 03 板块 // 全量组件矩阵与参数实验室',
      title: '全量组件矩阵与参数实验室',
      sub: '2D 平面界面与 3D 空间交互原子组件全览 // 实时形态参数标定与触感调优。',
      panel2DTitle: '2D 平面图元与数据图表',
      panel3DTitle: '3D 空间与工业机能图元',
      btnMatrixTitle: '<TerraButton> // 按钮变体与尺寸',
      btnPrimary: '主要操作',
      btnOutline: '描边线框',
      btnGhost: '幽灵按钮',
      btnDanger: '警示/危险',
      btnMedium: '中号',
      btnLarge: '大号',
      btnDisabled: '禁用状态',
      badgeMatrixTitle: '<TerraBadge> // 系统状态徽章矩阵',
      badgePrimary: '主要标识',
      badgeWarning: '警告提示',
      badgeDanger: '紧急告警',
      badgeSuccess: '正常就绪',
      badgeOutline: '辅助说明',
      beaconMatrixTitle: '<TerraStatusBeacon> // 4 态脉冲状态信标',
      beaconOnline: '在线',
      beaconStandby: '待机',
      beaconAlert: '告警',
      beaconOffline: '离线',
      barcodeMatrixTitle: '<TerraBarcode> // 高密度识别条码',
      inputMatrixTitle: '<TerraInput> // 运维控制台输入框',
      inputPlaceholder: '可编辑参数...',
      oscTitle: '<TerraLineChart> // 数据流折线图',
      spatialCardTitle: '<TerraSpatialCard> // 物理 3D 空间悬浮',
      tiltChassis: '倾斜感应底盘',
      parallaxDesc: '移动光标体验视差深度',
      segBarTitle: '<TerraSegmentBar> // -20° 工业下沉母线',
      segBarLabel: '电网母线负荷',
      segBarSub: '⚡ 工业下沉腔体 // 充电脉冲',
      vtabsTitle: '<TerraVerticalTabs> // 悬浮游标垂直标签',
      bracketsTitle: '<TerraCornerBrackets> 与 <TerraCadPattern> // 准星聚焦',
      bracketsHud: '聚焦准星 // 交互式 CAD 坐标栅格层',
      labTitle: '参数化校准与实时视口',
      sectorsTitle: '数据集群:',
      contourLabel: '等高线底衬',
      contourSub: '地形等高线测绘底衬',
      visible: '显示',
      hidden: '隐藏',
      sliderTitle: '精密垂直标尺控制台',
      chamferLabel: '斜切角半径',
      zoomLabel: '视口缩放比例',
      gpuHint: 'GPU 硬件合成层 (60+ 帧率)',
      viewportTitle: '实时视口',
      statusLabel: '状态:',
      chamferVal: '切角:',
      zoomVal: '缩放:',
      themeVal: '主题:'
    },
    footer: {
      systemName: 'TERRA-UI // 泰拉全域机能设计系统 (v0.8.0)',
      themes: '主题谱系: 工程蓝图 / 工业高压 / 指标监控',
      transition: '设计双轴: 2D 平面界面 + 3D 空间交互',
      interaction: '零虚拟 DOM // SVELTE 5 原生响应式',
      disclaimerTag: '法律声明 // 设计灵感与致敬来源',
      disclaimerText: 'Terra-UI 是一套独立研发的开源机能设计系统与组件库。本项目的美学风格、排印规范与交互逻辑灵感来源于上海鹰角网络科技有限公司（HYPERGRYPH）开发的作品《明日方舟》与《明日方舟：终末地》。相关游戏商标、商业外观及知识产权均归属于鹰角网络所有。本项目仅用于前端工程技术验证、学术交流与非商业展示，全量代码均为独立重构编写，未提取、未分发任何官方私有美术切片、音频或工程资产。',
      refTitle: '核心设计灵感与参考源',
      refLinks: [
        { label: '鹰角网络官网', url: 'https://www.hypergryph.com/', badge: '公司主页' },
        { label: '《明日方舟》官方网站', url: 'https://ak.hypergryph.com/', badge: '原作官网' },
        { label: '《明日方舟：终末地》官方网站', url: 'https://endfield.hypergryph.com/', badge: '设计参考' },
        { label: 'B站@设计师深海: 终末地美学解析', url: 'https://www.bilibili.com/video/BV142zkBbEL6/', badge: '设计解析' },
        { label: 'GitHub 开源参考: Terra-Online/Atlos', url: 'https://github.com/Terra-Online/Atlos', badge: '开源项目' }
      ]
    },
    units: [
      {
        codename: 'K0MARU',
        designation: 'K0MARU // 核心主创',
        archetype: '首席架构师 // 系统设计',
        tier: 6,
        clearance: '核心维护者 // 准入',
        status: 'online',
        statusLabel: '在线维护',
        uid: 'UID-93422639',
        assignment: 'TERRA-UI // 全域机能设计系统'
      }
    ],
    sectors: {
      'us-east': {
        name: 'US-EAST-01 北美数据集群',
        coord: '纬度: 39°02\'N // 经度: 77°28\'W // 弗吉尼亚',
        status: '标称负载 // 99.99%',
        density: '吞吐带宽: 42.8 Tbps // 0.8ms'
      },
      'ap-east': {
        name: 'AP-EAST-02 亚太数据中枢',
        coord: '纬度: 22°18\'N // 经度: 114°10\'E // 香港核心',
        status: '链路活跃 // 负载均衡',
        density: '吞吐带宽: 38.4 Tbps // 1.1ms'
      },
      'eu-central': {
        name: 'EU-CENTRAL-03 欧洲核心节点',
        coord: '纬度: 50°06\'N // 经度: 08°40\'E // 法兰克福',
        status: '数据热备 // 状态同步',
        density: '吞吐带宽: 29.6 Tbps // 1.4ms'
      }
    },
    sectorTabs: [
      { key: 'us-east', label: 'US-EAST-01 // 北美集群', shortCode: 'US-01', badge: '北美' },
      { key: 'ap-east', label: 'AP-EAST-02 // 亚太枢纽', shortCode: 'AP-02', badge: '亚太' },
      { key: 'eu-central', label: 'EU-CENTRAL-03 // 欧洲节点', shortCode: 'EU-03', badge: '欧洲' }
    ],
    profileCard: {
      divisionRole: '架构定位 // 职能',
      biometricStatus: '在线服务状态',
      serialIdentifier: '用户唯一标识',
      actuationReady: '维护状态',
      telemetryLink: 'GITHUB 主页',
      actuateUnit: '项目仓库',
      profileVersion: 'TERRA UI // 开发者档案 V0.8.0',
      synchronized: '在线维护'
    }
  }
}

export type Translations = TranslationSchema
