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

export interface EditorialSpecimenCopy {
  id: 'button' | 'tabs' | 'meter' | 'input' | 'surface'
  num: string
  name: string
  category: string
  summary: string
}

export interface TranslationSchema {
  nav: {
    brand: string
    showcase: string
    docs: string
    replayType: string
    paper: string
    ink: string
  }
  editorial: {
    eyebrow: string
    line1: string
    line2: string
    line3: string
    lead: string
    ctaExplore: string
    ctaSample: string
    kpiThroughput: string
    kpiLatency: string
    kpiUptime: string
    plateHeaderLeft: string
    plateHeaderRight: string
    indexTitle: string
    indexCount: string
    stageLabel: string
    stageFooter: string
    specimens: EditorialSpecimenCopy[]
    chartsSectionEyebrow: string
    chartsSectionTitle: string
    chartLineTitle: string
    chartBarTitle: string
    stripTitle: string
    marqueeEyebrow: string
    marqueePause: string
    marqueePlay: string
    marqueeItems: string[]
    principles: Array<{
      code: string
      title: string
      body: string
    }>
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
    clearAuthorized: string
  }
  footer: {
    systemName: string
    disclaimerTag: string
    disclaimerText: string
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
  zh: {
    nav: {
      brand: 'TERRA',
      showcase: '展台',
      docs: '文档',
      replayType: '重放排印',
      paper: '纸白',
      ink: '炭墨'
    },
    editorial: {
      eyebrow: '平面编辑部排印 × 动态字符图版',
      line1: '平面秩序',
      line2: '融解为',
      line3: '流动字符。',
      lead: '克制的 1px 结构网格与博物馆级矿物颜料配色，搭配实时参数化 3D 动态字符标本，在纯平面上呈现高精度设计系统质感。',
      ctaExplore: '浏览组件索引',
      ctaSample: '采样实时指标',
      kpiThroughput: '集群吞吐',
      kpiLatency: '平均往返延迟',
      kpiUptime: '可用性',
      plateHeaderLeft: '图版 01 // 参数化凤蝶',
      plateHeaderRight: '移动光标扫过双翼',
      indexTitle: '核心组件索引（悬停或点击预览）',
      indexCount: '05 组图元',
      stageLabel: '实时交互舞台',
      stageFooter: 'GPU 合成层驱动 · SVELTE 5 RUNES',
      specimens: [
        {
          id: 'button',
          num: '01',
          name: '磁吸触发器',
          category: 'TerraButton',
          summary: '高对比黑白极性反转与微磁吸弹簧反馈。'
        },
        {
          id: 'tabs',
          num: '02',
          name: '游标垂直索引',
          category: 'TerraVerticalTabs',
          summary: '纯 1px 轨道游标滑动切换与节点指标联动。'
        },
        {
          id: 'meter',
          num: '03',
          name: '游标标尺与数字',
          category: 'TerraVernierMeter',
          summary: '胡克定律阻尼弹簧数字与精密刻度条。'
        },
        {
          id: 'input',
          num: '04',
          name: '底线指令输入',
          category: 'TerraInput',
          summary: '聚焦时从中心向两侧展开的高亮底线。'
        },
        {
          id: 'surface',
          num: '05',
          name: '档案平面容器',
          category: 'TerraPanel · Badge',
          summary: '以纸墨色阶和 1px 细线替代厚重投影与切角。'
        }
      ],
      chartsSectionEyebrow: '可观测性图元',
      chartsSectionTitle: '扁平高密度数据可视化组件',
      chartLineTitle: '节点吞吐波形图',
      chartBarTitle: '子系统计算资源分配',
      stripTitle: '60 天服务健康度状态条',
      marqueeEyebrow: '动态信息流',
      marqueePause: '暂停',
      marqueePlay: '播放',
      marqueeItems: [
        'SVELTE 5 原生响应式',
        'VIEW TRANSITIONS 切页',
        'ASCII 3D 实时字符场',
        '四套校色矿物颜料'
      ],
      principles: [
        {
          code: '01',
          title: '纯平面结构纪律',
          body: '摒弃廉价发光阴影与磨砂堆砌，完全依靠 1px 架构细线与字号级差建立空间秩序。'
        },
        {
          code: '02',
          title: '字符即图形语言',
          body: '半真实 3D 光影经实时采样化作等宽 ASCII 矩阵，让立体动态与页面排版同源呼吸。'
        },
        {
          code: '03',
          title: '校色颜料双模系统',
          body: '针对朱砂、铬绿、普鲁士蓝与酸性柠单独调校纸白与炭墨两套对比度基准。'
        }
      ]
    },
    boot: {
      title: 'TERRA UI // 系统初始化序列',
      sub: '核心引导程序',
      status1: '内核 // SVELTE 5 运行时初始化',
      status2: '渲染 // GPU 合成管线挂载',
      status3: '令牌 // 全局矿物颜料变量同步',
      status4: '遥测 // 指标总线标定完成',
      status5: '组件 // 原子图元全量就绪',
      statusReady: '自检完成 // 运行时已就绪',
      slogan: 'TERRA UI // 平面编辑部设计系统',
      busNominal: '总线状态标称',
      shutter: '合成层快门',
      freq: '120Hz',
      footerProtocol: 'STANDARD PROTOCOL',
      footerDesignSystem: 'DESIGN SYSTEM'
    },
    sec01: {
      clearAuthorized: '已授权'
    },
    footer: {
      systemName: 'TERRA UI // SVELTE 5 平面编辑部与动态字符设计系统',
      disclaimerTag: '开源协议与设计演进说明',
      disclaimerText:
        'Terra-UI 是一套遵循 MIT 协议的独立开源 Svelte 5 组件库（Clean-Room Implementation）。项目早期视觉灵感曾参考鹰角网络《明日方舟》与《明日方舟：终末地》相关界面美学，所有官方商标与美术著作权归原作者所有；现已演进为独立的平面编辑部与动态字符设计系统，不含任何解包或专有资产。',
      refLinks: [
        { label: 'GitHub 仓库', url: 'https://github.com/K0maru/terra-ui', badge: 'MIT' },
        { label: '鹰角网络参考致敬', url: 'https://www.hypergryph.com/', badge: '致敬' },
        { label: 'Atlos 开源参考', url: 'https://github.com/Terra-Online/Atlos', badge: '参考' }
      ]
    },
    units: [
      {
        codename: 'K0MARU',
        designation: '核心维护者',
        archetype: '系统设计与组件架构',
        tier: 6,
        clearance: '核心维护',
        status: 'online',
        statusLabel: '在线维护',
        uid: 'UID-93422639',
        assignment: 'TERRA-UI // 设计系统'
      }
    ],
    sectors: {
      'us-east': {
        name: 'IAD-01 北美东部集群',
        coord: '39°02′N // 77°28′W · 弗吉尼亚',
        status: '标称负载 // 99.99%',
        density: '吞吐: 42.8 GB/s // 1.4ms'
      },
      'ap-east': {
        name: 'NRT-03 亚太边缘枢纽',
        coord: '35°41′N // 139°41′E · 东京',
        status: '负载均衡 // 活跃',
        density: '吞吐: 51.2 GB/s // 1.8ms'
      },
      'eu-central': {
        name: 'FRA-02 欧洲中心节点',
        coord: '50°06′N // 08°40′E · 法兰克福',
        status: '同步热备 // 稳态',
        density: '吞吐: 36.4 GB/s // 2.1ms'
      }
    },
    sectorTabs: [
      { key: 'us-east', label: 'IAD-01 // 北美集群', shortCode: 'IAD', badge: '北美' },
      { key: 'ap-east', label: 'NRT-03 // 亚太枢纽', shortCode: 'NRT', badge: '亚太' },
      { key: 'eu-central', label: 'FRA-02 // 欧洲节点', shortCode: 'FRA', badge: '欧洲' }
    ],
    profileCard: {
      divisionRole: '职能定位',
      biometricStatus: '服务状态',
      serialIdentifier: '唯一标识',
      actuationReady: '维护状态',
      telemetryLink: 'GITHUB 主页',
      actuateUnit: '项目仓库',
      profileVersion: 'TERRA UI // 维护者档案',
      synchronized: '在线维护'
    }
  },
  en: {
    nav: {
      brand: 'TERRA',
      showcase: 'Showcase',
      docs: 'Docs',
      replayType: 'Replay Type',
      paper: 'Paper',
      ink: 'Ink'
    },
    editorial: {
      eyebrow: 'FLAT EDITORIAL TYPOGRAPHY × ASCII SPECIMEN',
      line1: 'Flat geometry',
      line2: 'dissolving into',
      line3: 'living type.',
      lead: 'Restrained 1px architectural grids and calibrated mineral pigments paired with a real-time 3D butterfly rendered directly into monospaced glyphs.',
      ctaExplore: 'Explore Index',
      ctaSample: 'Sample Metrics',
      kpiThroughput: 'Throughput',
      kpiLatency: 'Mean Latency',
      kpiUptime: 'Uptime',
      plateHeaderLeft: 'FIG. 01 // PAPILIO PARAMETRIC',
      plateHeaderRight: 'MOVE CURSOR ACROSS WINGS',
      indexTitle: 'Component Index (Hover or Click)',
      indexCount: '05 Primitives',
      stageLabel: 'Live Specimen Stage',
      stageFooter: 'GPU COMPOSITED · SVELTE 5 RUNES',
      specimens: [
        {
          id: 'button',
          num: '01',
          name: 'Magnetic Trigger',
          category: 'TerraButton',
          summary: 'High-contrast ink inversion with subtle magnetic pointer spring.'
        },
        {
          id: 'tabs',
          num: '02',
          name: 'Gliding Index Tabs',
          category: 'TerraVerticalTabs',
          summary: '1px structural rail gliding smoothly across regional telemetry.'
        },
        {
          id: 'meter',
          num: '03',
          name: 'Vernier & Spring Meter',
          category: 'TerraVernierMeter',
          summary: 'Damped spring tabular numerals coupled with precision scale.'
        },
        {
          id: 'input',
          num: '04',
          name: 'Editorial Line Input',
          category: 'TerraInput',
          summary: 'Center-expanding accent hairline triggered on focus.'
        },
        {
          id: 'surface',
          num: '05',
          name: 'Print Plate Surface',
          category: 'TerraPanel · Badge',
          summary: 'Paper/ink tonal elevation bounded strictly by 1px rules.'
        }
      ],
      chartsSectionEyebrow: 'Observability Primitives',
      chartsSectionTitle: 'Flat High-Density Data Visualization',
      chartLineTitle: 'Network Telemetry Stream',
      chartBarTitle: 'Subsystem Resource Allocation',
      stripTitle: '60-Day Service Health Strip',
      marqueeEyebrow: 'Kinetic Telemetry Stream',
      marqueePause: 'Pause',
      marqueePlay: 'Play',
      marqueeItems: [
        'SVELTE 5 RUNES',
        'VIEW TRANSITIONS API',
        'ASCII 3D FIELD',
        'CURATED PIGMENTS'
      ],
      principles: [
        {
          code: '01',
          title: 'Flat Plane Discipline',
          body: 'Zero neon glow or frosted glass clutter; hierarchy comes from 1px rules and typographic scale.'
        },
        {
          code: '02',
          title: 'ASCII as Typography',
          body: '3D shaded wings dissolve into monospaced characters so living motion shares the exact ink language.'
        },
        {
          code: '03',
          title: 'Curated Pigment Pairs',
          body: 'Calibrated mineral papers and carbon inks tuned for sustained technical reading.'
        }
      ]
    },
    boot: {
      title: 'TERRA UI // SYSTEM INITIALIZATION',
      sub: 'KERNEL LOADER',
      status1: 'KERNEL // SVELTE 5 RUNTIME INIT',
      status2: 'DISPLAY // GPU COMPOSITOR PIPELINE',
      status3: 'TOKENS // MINERAL PIGMENT SYNC',
      status4: 'TELEMETRY // BUS CALIBRATED',
      status5: 'COMPONENTS // PRIMITIVES READY',
      statusReady: 'SYSTEM CLEAR // RUNTIME ACTIVE',
      slogan: 'TERRA UI // EDITORIAL DESIGN SYSTEM',
      busNominal: 'BUS TELEMETRY NOMINAL',
      shutter: 'COMPOSITOR SHUTTER',
      freq: '120Hz',
      footerProtocol: 'STANDARD PROTOCOL',
      footerDesignSystem: 'DESIGN SYSTEM'
    },
    sec01: {
      clearAuthorized: 'AUTHORIZED'
    },
    footer: {
      systemName: 'TERRA UI // SVELTE 5 EDITORIAL & ASCII DESIGN SYSTEM',
      disclaimerTag: 'OPEN SOURCE LICENSE & EVOLUTION',
      disclaimerText:
        'Terra-UI is an independent MIT-licensed Svelte 5 component library (Clean-Room Implementation). Earlier aesthetic explorations drew inspiration from Arknights and Arknights: Endfield by HYPERGRYPH (trademarks belong to their respective owners); the system has evolved into an original flat editorial and kinetic ASCII design system with zero proprietary assets.',
      refLinks: [
        { label: 'GitHub Repository', url: 'https://github.com/K0maru/terra-ui', badge: 'MIT' },
        { label: 'HYPERGRYPH Tribute', url: 'https://www.hypergryph.com/', badge: 'INSPIRATION' },
        {
          label: 'Atlos Reference',
          url: 'https://github.com/Terra-Online/Atlos',
          badge: 'OPEN SOURCE'
        }
      ]
    },
    units: [
      {
        codename: 'K0MARU',
        designation: 'LEAD MAINTAINER',
        archetype: 'SYSTEM DESIGN & ARCHITECTURE',
        tier: 6,
        clearance: 'CORE MAINTAINER',
        status: 'online',
        statusLabel: 'ACTIVE',
        uid: 'UID-93422639',
        assignment: 'TERRA-UI // DESIGN SYSTEM'
      }
    ],
    sectors: {
      'us-east': {
        name: 'IAD-01 North America East',
        coord: '39°02′N // 77°28′W · Virginia',
        status: 'NOMINAL // 99.99%',
        density: 'THROUGHPUT: 42.8 GB/s // 1.4ms'
      },
      'ap-east': {
        name: 'NRT-03 Asia Pacific East',
        coord: '35°41′N // 139°41′E · Tokyo',
        status: 'ACTIVE // BALANCED',
        density: 'THROUGHPUT: 51.2 GB/s // 1.8ms'
      },
      'eu-central': {
        name: 'FRA-02 Europe Central',
        coord: '50°06′N // 08°40′E · Frankfurt',
        status: 'STANDBY // SYNCED',
        density: 'THROUGHPUT: 36.4 GB/s // 2.1ms'
      }
    },
    sectorTabs: [
      { key: 'us-east', label: 'IAD-01 // NORTH AMERICA', shortCode: 'IAD', badge: 'US' },
      { key: 'ap-east', label: 'NRT-03 // ASIA PACIFIC', shortCode: 'NRT', badge: 'JP' },
      { key: 'eu-central', label: 'FRA-02 // EUROPE CORE', shortCode: 'FRA', badge: 'DE' }
    ],
    profileCard: {
      divisionRole: 'ROLE',
      biometricStatus: 'STATUS',
      serialIdentifier: 'IDENTIFIER',
      actuationReady: 'STATE',
      telemetryLink: 'GITHUB PROFILE',
      actuateUnit: 'REPOSITORY',
      profileVersion: 'TERRA UI // MAINTAINER PROFILE',
      synchronized: 'ACTIVE'
    }
  }
}

export type Translations = TranslationSchema
