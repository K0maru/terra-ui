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
      brandTitle: 'TERRA // TACTICAL FUNCTIONAL DESIGN SYSTEM',
      brandSubtitle: 'DUAL-AXIS FUNCTIONAL SYSTEM: 2D FLAT GRAPHIC & 3D SPATIAL INTERACTION',
      sec01: '01 // 2D FLAT TACTICAL',
      sec02: '02 // 3D SPATIAL INTERACTIVE',
      sec03: '03 // COMPONENT MATRIX',
      replayBoot: 'REPLAY BOOT',
      dark: '🌙 DARK',
      light: '☀️ LIGHT',
      fps: 'FPS',
      nominal: 'NOMINAL',
      themes: {
        cyan: 'BLUEPRINT',
        amber: 'HAZARD',
        emerald: 'BIO-CYBER'
      }
    },
    boot: {
      title: 'TERRA TACTICAL // INTEGRATED AUTOMATION SYSTEM',
      sub: 'TERRA TACTICAL SYSTEM // AIC_INITIAL_LOADER',
      status1: 'AIC // KERNEL_LOAD',
      status2: 'TERRA // GEODETIC_SURVEY_INIT',
      status3: 'SECTOR_ALPHA // TOPOGRAPHIC_CONTOUR_SYNC',
      status4: 'ENERGY_BUS // 480V_NOMINAL',
      status5: 'TELEMETRY // ACTUATOR_ARRAY_ONLINE',
      statusReady: 'SYSTEM_READY // COMMENCE_OPERATION',
      slogan: 'COMMENCE_EXPEDITION',
      busNominal: '◤ AIC_BUS_NOMINAL ◢',
      shutter: 'SHUTTER: ARMORED_SCALE_X',
      freq: 'FREQ: 120Hz',
      footerProtocol: 'PROTOCOL_04_STABLE',
      footerDesignSystem: 'FUNCTIONAL DESIGN SYSTEM'
    },
    sec01: {
      tag: 'SECTION 01 // 2D FLAT TACTICAL SYSTEM (SWISS TYPOGRAPHY)',
      deskTag: '// SECTOR // TACTICAL_COMMAND_DESK',
      swissGridTag: 'STRICT_SWISS_GRID',
      title: 'FLAT PLANAR // COMMAND CONSOLE',
      sub: 'STRICT ASYMMETRIC SWISS GRID // ZERO PERSPECTIVE DISTORTION, HIGH-CONTRAST MONOSPACE DENSITY & 2D COMPOSITOR CHARTS',
      badgeFlat: '2D FLAT SWISS',
      badgeZeroClutter: 'ZERO 3D CLUTTER',
      unitsTitle: '// TACTICAL UNITS:',
      unitsSub: 'SELECT UNIT PROFILE',
      profileTitle: 'TACTICAL DISPATCH CONTROL BAY',
      directiveDispatch: 'TERMINAL DIRECTIVE DISPATCH // DISPATCH',
      queryPlaceholder: 'ENTER DIRECTIVE...',
      executeCmd: 'EXECUTE',
      clearanceTitle: 'CLEARANCE PROTOCOL MATRIX // SECURITY',
      clearAuthorized: 'AUTHORIZED',
      clearHighVolt: 'HIGH_VOLTAGE',
      clearCorrosion: 'HAZARD_CRIT',
      clearLinked: 'NETWORK_LINK',
      clearV2: 'PROTOCOL_V7',
      actuatorsTitle: 'TACTICAL ACTUATORS // ACTIONS',
      executeFull: 'EXECUTE COMMAND',
      overrideLink: 'OVERRIDE LINK',
      standby: 'STANDBY',
      purgeCorrosion: 'PURGE RADIATION',
      beaconsTitle: 'STATUS BEACONS',
      nominal: 'NOMINAL',
      idle: 'IDLE',
      alert: 'ALERT',
      offline: 'OFFLINE',
      logTitle: 'SYS // REAL-TIME DISPATCH LOG',
      logStream: 'STREAM ACTIVE',
      chart1Title: 'SUBSYSTEM RESOURCE LOAD ALLOCATION',
      chart1Sub: '// CHART.HISTOGRAM',
      chart2Title: 'SIGNAL THROUGHPUT & TELEMETRY STREAM',
      chart2Sub: '// CHART.WAVEFORM',
      gpuNote: 'ZERO-VDOM // SVELTE 5 NATIVE RUNES',
      scrollDown: 'SCROLL DOWN // 3D SPATIAL INTERACTION'
    },
    sec02: {
      tag: 'SECTION 02 // 3D SPATIAL & INDUSTRIAL COMPLEX (SPATIAL TOPOLOGY)',
      title: '3D SPATIAL TOPOLOGY & RADAR TELEMETRY',
      sub: 'CURSOR-DRIVEN 3D PHYSICAL TILT & SPECULAR SHEEN · MULTI-LAYER Z-AXIS PARALLAX · NATIVE DONUT CHARTS & ENERGY BUS',
      cycleBtn: 'CYCLE SIMULATION',
      spatialHint: 'HOVER MOUSE OVER CARDS TO EXPERIENCE MULTI-AXIS 3D PERSPECTIVE TILT AND PARALLAX Z-DEPTH',
      radarTitle: 'SPATIAL RADAR // SUBSYSTEM TELEMETRY',
      radarBadge: '3D HOVER ACTIVE',
      radarTilt: 'TILT AXIS: ROTATE_X/Y REALTIME',
      radarSheen: 'DYNAMIC SPECULAR SHEEN',
      dialsTitle: '// TELEMETRY DIALS',
      dialsActive: 'ACTIVE',
      flowTitle: 'CONVEYOR FLOW EFFICIENCY',
      flowBadge: 'HIGH-LOAD',
      latencyTitle: 'PROTOCOL REACTION LATENCY',
      latencyBadge: 'REALTIME',
      refreshTelemetry: 'REFRESH TELEMETRY',
      donutTitle: 'SYS ALLOCATION',
      donutCenter: 'ALLOCATION',
      donutItems: {
        pwr: 'PRIMARY PROPULSION',
        def: 'SHIELD DEFLECTION',
        bus: 'TELEMETRY BUS',
        env: 'LIFE SUPPORT ARRAY'
      },
      busTitle: 'INDUSTRIAL ENERGY BUS & RECESSED CHASSIS',
      busMain: 'MAIN_CHASSIS_GRID (MAIN BUS LOAD)',
      busBurst: 'TACTICAL_BURST_CELL (BUFFER CAPACITOR ARRAY)',
      busBurstSub: '⚡ DUAL-INVERTER BUFFER // 1000V CAPACITOR BANK',
      busNotes: [
        '• 480V three-phase industrial main grid load maintained within safety thresholds.',
        '• -20° recessed industrial chassis & charging pulse operate 100% on GPU Compositor thread.',
        '• Topographic contour backdrop and 3D suspended cards create multi-dimensional topological depth.'
      ],
      scrollDown: 'SCROLL DOWN // COMPONENT MATRIX'
    },
    sec03: {
      tag: 'SECTION 03 // UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB',
      title: 'UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB',
      sub: '2D FLAT TACTICAL & 3D SPATIAL TOPOLOGICAL ATOMIC PRIMITIVES // REAL-TIME PARAMETRIC CALIBRATION & TACTILE TUNING',
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
      badgeMatrixTitle: '<TerraBadge> // SECURITY CLEARANCE BADGES',
      badgePrimary: 'PRIMARY',
      badgeWarning: 'WARNING',
      badgeDanger: 'DANGER',
      badgeSuccess: 'SUCCESS',
      badgeOutline: 'OUTLINE',
      beaconMatrixTitle: '<TerraStatusBeacon> // 4 STATES PULSE',
      beaconOnline: 'ONLINE',
      beaconStandby: 'STANDBY',
      beaconAlert: 'ALERT',
      beaconOffline: 'OFFLINE',
      barcodeMatrixTitle: '<TerraBarcode> // HIGH-DENSITY IDENTIFIER',
      inputMatrixTitle: '<TerraInput> // TACTICAL CONSOLE INPUT',
      inputPlaceholder: 'EDITABLE MATRIX PARAMETER...',
      oscTitle: '<TerraLineChart> // REALTIME OSCILLOSCOPE',
      spatialCardTitle: '<TerraSpatialCard> // PHYSICAL 3D SUSPENSION',
      tiltChassis: 'TILT-RESPONSE CHASSIS',
      parallaxDesc: 'MOVE CURSOR TO FEEL PARALLAX DEPTH',
      segBarTitle: '<TerraSegmentBar> // -20° INDUSTRIAL RECESSED BUS',
      segBarLabel: 'ENERGY_BUS_CHASSIS',
      segBarSub: '⚡ RECESSED INDUSTRIAL CAVITY // CHARGING PULSE',
      vtabsTitle: '<TerraVerticalTabs> // TACTICAL FLOATING CURSOR',
      bracketsTitle: '<TerraCornerBrackets> & <TerraCadPattern> // HUD FOCUS',
      bracketsHud: 'CROSSHAIR FOCUS // INTERACTIVE CAD COORD LAYER',
      labTitle: 'PARAMETRIC CALIBRATION & REALTIME VIEWPORT',
      sectorsTitle: 'TACTICAL SECTORS:',
      contourLabel: 'CONTOUR OVERLAY',
      contourSub: 'TOPOGRAPHIC MOUNTAIN MAPPING LAYER',
      visible: 'VISIBLE',
      hidden: 'HIDDEN',
      sliderTitle: 'PRECISION VERTICAL CONTROLS',
      chamferLabel: 'CHAMFER',
      zoomLabel: 'ZOOM',
      gpuHint: 'GPU HARDWARE COMPOSITOR (60+ FPS)',
      viewportTitle: 'REALTIME VIEWPORT',
      statusLabel: 'STATUS:',
      chamferVal: 'CHAMFER:',
      zoomVal: 'ZOOM:',
      themeVal: 'THEME:'
    },
    footer: {
      systemName: 'TERRA-UI // TACTICAL FUNCTIONAL DESIGN SYSTEM (v0.7.0)',
      themes: 'THEMES: CYAN / AMBER / EMERALD',
      transition: 'AXES: 2D FLAT TACTICAL + 3D SPATIAL INDUSTRIAL',
      interaction: 'ZERO-VDOM // SVELTE 5 NATIVE RUNES'
    },
    units: [
      {
        codename: 'VANGUARD-01',
        designation: 'RECON LEAD',
        archetype: 'VANGUARD // FORWARD COMBAT',
        tier: 6,
        clearance: 'LEVEL-04 // ALPHA',
        status: 'online',
        statusLabel: 'COMBAT READY',
        uid: 'SEC-01-VGD',
        assignment: 'TACTICAL RECON SECTOR // ALPHA'
      },
      {
        codename: 'SPECIALIST-02',
        designation: 'BIO PROTOCOL',
        archetype: 'SPECIALIST // TELEMETRY & BIO',
        tier: 6,
        clearance: 'DIRECTOR // OMEGA',
        status: 'online',
        statusLabel: 'SYNCHRONIZED',
        uid: 'SEC-02-SPC',
        assignment: 'CENTRAL TELEMETRY & BIO-MONITOR'
      },
      {
        codename: 'DEFENDER-03',
        designation: 'HEAVY CHASSIS',
        archetype: 'DEFENDER // BARRIER INTERCEPTION',
        tier: 5,
        clearance: 'LEVEL-03 // TACTICAL',
        status: 'standby',
        statusLabel: 'STANDBY',
        uid: 'SEC-03-DFN',
        assignment: 'PERIMETER DEFENSE // GRID SECTOR'
      },
      {
        codename: 'SENTINEL-04',
        designation: 'NETWORK C4ISR',
        archetype: 'SENTINEL // ELECTRONIC WARFARE',
        tier: 5,
        clearance: 'CONTROLLER // PRIME',
        status: 'online',
        statusLabel: 'TRANSMITTING',
        uid: 'SEC-04-SNT',
        assignment: 'HIGH-BANDWIDTH RADAR LINK'
      }
    ],
    sectors: {
      sector4: {
        name: 'SECTOR ALPHA-04 BASIN',
        coord: 'LAT: 32°14\'N // LNG: 104°58\'E // ELEV: +1420M',
        status: 'SURVEY IN PROGRESS',
        density: 'HIGH FLUX EM FIELD // 420 kV'
      },
      nexus: {
        name: 'NEXUS LANDSHIP MOBILE HQ',
        coord: 'VECTOR: 284° // SPEED: 14.2 KT // HULL: SEALED',
        status: 'EXPEDITION TRANSIT',
        density: 'FUSION CORE // 98.4% STABLE'
      },
      citadel: {
        name: 'SENTINEL CITADEL COMPLEX',
        coord: 'GRID: CT-9901 // DEFENSE: MAXIMUM',
        status: 'SHIELD ACTIVE',
        density: 'EM BARRIER // ZERO DRIFT'
      }
    },
    sectorTabs: [
      { key: 'sector4', label: 'SECTOR ALPHA-04', shortCode: 'SC-04', badge: 'SECTOR-04' },
      { key: 'nexus', label: 'NEXUS MOBILE HQ', shortCode: 'NX-01', badge: 'MOBILE-HQ' },
      { key: 'citadel', label: 'SENTINEL CITADEL', shortCode: 'CT-09', badge: 'CORE-HUB' }
    ],
    profileCard: {
      divisionRole: 'DIVISION // ROLE',
      biometricStatus: 'BIOMETRIC STATUS',
      serialIdentifier: 'SERIAL IDENTIFIER',
      actuationReady: 'ACTUATION READY',
      telemetryLink: 'TELEMETRY LINK',
      actuateUnit: 'ACTUATE UNIT',
      profileVersion: 'TERRA // TACTICAL UNIT PROFILE V0.7.0',
      synchronized: 'SYNCHRONIZED'
    }
  },
  zh: {
    nav: {
      brandTitle: 'TERRA // 泰拉全域机能设计系统',
      brandSubtitle: '双轴机能系统：2D 平面战术排版与 3D 空间交互拓扑',
      sec01: '01 // 2D 平面战术',
      sec02: '02 // 3D 空间交互',
      sec03: '03 // 组件矩阵与实验室',
      replayBoot: '重放引导',
      dark: '🌙 暗色',
      light: '☀️ 亮色',
      fps: '帧率',
      nominal: '正常',
      themes: {
        cyan: '战术蓝图',
        amber: '工业高压',
        emerald: '生化遥测'
      }
    },
    boot: {
      title: '泰拉战术 // 全域一体化自动化系统',
      sub: '泰拉战术系统 // AIC 初始化引导',
      status1: 'AIC // 内核协议加载',
      status2: '泰拉全域 // 大地测量拓扑初始化',
      status3: '阿尔法扇区 // 地形等高线测绘同步',
      status4: '动力母线 // 480V 工业三相标称稳态',
      status5: '遥测总线 // 执行器阵列就绪',
      statusReady: '系统就绪 // 指令调度开始',
      slogan: '开启全域拓扑勘探',
      busNominal: '◤ AIC 核心总线稳态 ◢',
      shutter: '快门装甲: 标称横向展开',
      freq: '刷新率: 120Hz',
      footerProtocol: '协议版本 04 稳定态',
      footerDesignSystem: '机能工业设计系统'
    },
    sec01: {
      tag: '01 战术分区 // 2D 平面战术系统 (瑞士现代排版)',
      deskTag: '// 扇区 // 战术指挥控制台',
      swissGridTag: '严谨瑞士网格',
      title: '平面战术 // 指令调度中枢',
      sub: '严谨二维非对称瑞士网格 // 零透视畸变、高反差等宽字符密度与 2D 合成层动效图表',
      badgeFlat: '2D 平面瑞士',
      badgeZeroClutter: '纯净无杂质',
      unitsTitle: '// 战术单元序列:',
      unitsSub: '选择单元档案',
      profileTitle: '战术调度控制舱',
      directiveDispatch: '终端指令下达 // 战术指令调度',
      queryPlaceholder: '输入战术指令...',
      executeCmd: '执行',
      clearanceTitle: '安全权限协议矩阵 // 权限矩阵',
      clearAuthorized: '已授权',
      clearHighVolt: '工业高压',
      clearCorrosion: '危废暴击',
      clearLinked: '网络链路',
      clearV2: '协议 V7',
      actuatorsTitle: '战术执行器 // 动作控制',
      executeFull: '执行指令',
      overrideLink: '链接覆写',
      standby: '待命备战',
      purgeCorrosion: '辐射洗脱',
      beaconsTitle: '状态信标',
      nominal: '正常',
      idle: '待机',
      alert: '告警',
      offline: '离线',
      logTitle: '系统 // 实时调度日志',
      logStream: '实时数据流',
      chart1Title: '子系统资源负载分配矩阵',
      chart1Sub: '// 图表.直方图',
      chart2Title: '信号吞吐率与遥测波形流',
      chart2Sub: '// 图表.波形图',
      gpuNote: '零虚拟DOM // SVELTE 5 原生响应式',
      scrollDown: '向下滚动 // 3D 空间交互'
    },
    sec02: {
      tag: '02 空间分区 // 3D 空间拓扑与工业复合体 (光标视差互动)',
      title: '3D 空间拓扑与雷达遥测矩阵',
      sub: '光标驱动 3D 物理倾角与漫反射高光 · 多层 Z 轴空间视差 · 原生圆环图表与能量母线',
      cycleBtn: '周期模拟',
      spatialHint: '鼠标滑过卡片可体验多轴 3D 透视倾斜与多层 Z 轴空间视差',
      radarTitle: '空间雷达 // 子系统遥测总线',
      radarBadge: '3D 悬浮激活',
      radarTilt: '倾斜轴: 实时 X/Y 轴旋转',
      radarSheen: '动态镜面漫反射',
      dialsTitle: '// 遥测仪表盘',
      dialsActive: '运行中',
      flowTitle: '传送通道流转效率',
      flowBadge: '重载工况',
      latencyTitle: '协议响应往返延迟',
      latencyBadge: '实时响应',
      refreshTelemetry: '刷新遥测数据',
      donutTitle: '系统资源分配',
      donutCenter: '资源占比',
      donutItems: {
        pwr: '主动力推进',
        def: '偏转护盾阵列',
        bus: '核心遥测总线',
        env: '维生保障阵列'
      },
      busTitle: '工业能量母线与下沉式机箱',
      busMain: '主干电网母线负荷 (MAIN BUS LOAD)',
      busBurst: '备用储能电容矩阵 (BUFFER CAPACITOR ARRAY)',
      busBurstSub: '⚡ 双逆变器缓冲阵列 // 1000V 超级电容组',
      busNotes: [
        '• 480V 工业三相主干网负荷保持在安全阈值区间。',
        '• -20° 下沉式倾斜嵌槽与前端高能脉冲完全运行于 GPU 合成层线程。',
        '• 结合顶部山峦等高线背景与 3D 空间悬浮物理卡片，呈现多维拓扑景深。'
      ],
      scrollDown: '向下滚动 // 组件矩阵'
    },
    sec03: {
      tag: '03 矩阵分区 // 全域组件矩阵与参数化实验室',
      title: '全域组件矩阵与参数化实验室',
      sub: '2D 平面战术轴与 3D 空间拓扑轴原子组件全览 // 实时形态参数标定与触感调优',
      panel2DTitle: '2D 平面图元与战术图表',
      panel3DTitle: '3D 空间与工业机能图元',
      btnMatrixTitle: '<TerraButton> // 按钮变体与尺寸',
      btnPrimary: '主动作',
      btnOutline: '描边',
      btnGhost: '幽灵',
      btnDanger: '危险',
      btnMedium: '中号',
      btnLarge: '大号',
      btnDisabled: '禁用',
      badgeMatrixTitle: '<TerraBadge> // 安全权限徽章矩阵',
      badgePrimary: '主要权限',
      badgeWarning: '警告提示',
      badgeDanger: '危废警告',
      badgeSuccess: '正常就绪',
      badgeOutline: '辅助说明',
      beaconMatrixTitle: '<TerraStatusBeacon> // 4 态脉冲状态信标',
      beaconOnline: '在线',
      beaconStandby: '待命',
      beaconAlert: '告警',
      beaconOffline: '离线',
      barcodeMatrixTitle: '<TerraBarcode> // 高密度识别条码',
      inputMatrixTitle: '<TerraInput> // 战术终端输入框',
      inputPlaceholder: '可编辑矩阵参数...',
      oscTitle: '<TerraLineChart> // 实时示波器折线图',
      spatialCardTitle: '<TerraSpatialCard> // 物理 3D 空间悬浮',
      tiltChassis: '倾斜感应底盘',
      parallaxDesc: '移动光标体验视差深度',
      segBarTitle: '<TerraSegmentBar> // -20° 工业下沉母线',
      segBarLabel: '能量母线机箱',
      segBarSub: '⚡ 工业下沉腔体 // 充电脉冲',
      vtabsTitle: '<TerraVerticalTabs> // 战术悬浮游标标签',
      bracketsTitle: '<TerraCornerBrackets> 与 <TerraCadPattern> // HUD 准星聚焦',
      bracketsHud: '十字准星聚焦 // 交互式 CAD 坐标栅格层',
      labTitle: '参数化校准与实时视口',
      sectorsTitle: '战术扇区:',
      contourLabel: '等高线底衬',
      contourSub: '山峦等高线测绘底衬',
      visible: '显示',
      hidden: '隐藏',
      sliderTitle: '精密垂直标尺控制台',
      chamferLabel: '斜切角',
      zoomLabel: '缩放',
      gpuHint: 'GPU 硬件合成层 (60+ 帧率)',
      viewportTitle: '实时视口',
      statusLabel: '状态:',
      chamferVal: '切角:',
      zoomVal: '缩放:',
      themeVal: '主题:'
    },
    footer: {
      systemName: 'TERRA-UI // 泰拉全域机能战术设计系统 (v0.7.0)',
      themes: '主题谱系: 战术蓝图 / 工业高压 / 生化遥测',
      transition: '设计双轴: 2D 平面战术 + 3D 空间拓扑',
      interaction: '零虚拟 DOM // SVELTE 5 原生响应式'
    },
    units: [
      {
        codename: 'VANGUARD-01',
        designation: '侦察先锋',
        archetype: '先锋 // 前线突击',
        tier: 6,
        clearance: '4级权限 // 阿尔法',
        status: 'online',
        statusLabel: '战备就绪',
        uid: 'SEC-01-VGD',
        assignment: '战术侦察扇区 // 阿尔法前哨'
      },
      {
        codename: 'SPECIALIST-02',
        designation: '生化协议',
        archetype: '特种 // 遥测与生化',
        tier: 6,
        clearance: '总监级 // 欧米伽',
        status: 'online',
        statusLabel: '链路同步',
        uid: 'SEC-02-SPC',
        assignment: '中央遥测与生物监控中心'
      },
      {
        codename: 'DEFENDER-03',
        designation: '重型装甲',
        archetype: '重装 // 屏障阻截',
        tier: 5,
        clearance: '3级权限 // 战术级',
        status: 'standby',
        statusLabel: '待命备战',
        uid: 'SEC-03-DFN',
        assignment: '外围防线 // 电网扇区'
      },
      {
        codename: 'SENTINEL-04',
        designation: '网络指挥',
        archetype: '哨兵 // 电子战',
        tier: 5,
        clearance: '主控级 // 普莱姆',
        status: 'online',
        statusLabel: '高速传输',
        uid: 'SEC-04-SNT',
        assignment: '高带宽雷达通讯干线'
      }
    ],
    sectors: {
      sector4: {
        name: '阿尔法-04 盆地扇区',
        coord: '纬度: 32°14\'N // 经度: 104°58\'E // 高程: +1420M',
        status: '勘探作业中',
        density: '高通量电磁场 // 420 kV'
      },
      nexus: {
        name: '枢纽陆行舰移动指挥部',
        coord: '航向: 284° // 航速: 14.2 节 // 舰体: 气密',
        status: '远征航行中',
        density: '聚变核心 // 98.4% 稳定'
      },
      citadel: {
        name: '哨兵要塞防御复合体',
        coord: '网格: CT-9901 // 防御级别: 极限',
        status: '防护力场激活',
        density: '电磁屏障 // 零频偏'
      }
    },
    sectorTabs: [
      { key: 'sector4', label: '阿尔法-04 扇区', shortCode: 'SC-04', badge: '扇区-04' },
      { key: 'nexus', label: '枢纽移动指挥部', shortCode: 'NX-01', badge: '移动指挥部' },
      { key: 'citadel', label: '哨兵要塞复合体', shortCode: 'CT-09', badge: '核心中枢' }
    ],
    profileCard: {
      divisionRole: '编制 // 战术职责',
      biometricStatus: '体征遥测状态',
      serialIdentifier: '序列唯一标识',
      actuationReady: '动作执行就绪',
      telemetryLink: '遥测链接',
      actuateUnit: '部署单元',
      profileVersion: 'TERRA // 泰拉战术单元档案 V0.7.0',
      synchronized: '生命体征同步'
    }
  }
}

export type Translations = TranslationSchema
