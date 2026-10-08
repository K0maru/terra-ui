# 🛡️ TERRA UI // Functional Cybernetic Design System

> **Zero-VDOM // Svelte 5 Native Runes // GPU 硬件合成加速 // 机能监控美学**  
> 专为系统指标监控、开发者基础设施、可观测性仪表盘与机能赛博界面打造的高性能 Svelte 5 组件库与设计系统。

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-00f076?style=flat&logo=githubpages&logoColor=white)](https://k0maru.github.io/terra-ui/)

> 🔗 **Live Demo**: [https://k0maru.github.io/terra-ui/](https://k0maru.github.io/terra-ui/)

[English](README.md) | [简体中文](README_zh.md)

---

## 📜 免责声明与设计灵感致敬 (Disclaimer & Design Inspiration)

> **重要声明 (IMPORTANT NOTICE)**:  
> **Terra-UI** 为独立研发的非商业开源学术研究与前端技术探索项目。  
> 本系统的美学风格、排版逻辑、几何切角及交互范式直接汲取并参考自上海鹰角网络科技有限公司（Shanghai HYPERGRYPH Network Technology Co., Ltd.）开发的作品 **《明日方舟》（Arknights）** 与 **《明日方舟：终末地》（Arknights: Endfield）**。

- **知识产权归属**：所有与《明日方舟》及《明日方舟：终末地》相关的商标、Logo、游戏名称、官方美术原案与世界观设计均完全归属于 **上海鹰角网络科技有限公司 (Shanghai HYPERGRYPH Network Technology Co., Ltd.)** 及其关联方。
- **独立原创与干净重写 (Clean-Room Implementation)**：Terra-UI 是一套从零独立编写的开源 UI 组件库（遵循 MIT 许可证）。所有组件代码、CSS 设计令牌与 SVG 矢量图元均为自主实现，仅在视觉美学与排版风格上汲取灵感作为设计参考，**未提取、未解包、未分发任何官方私有美术切片、音频模型或专有加密资源**。
- **非官方与无商业关联**：本项目纯粹用于开源社区前端工程技术研究与 UI/UX 美学呈现，非官方产品，亦未获得鹰角网络的商业赞助、授权或背书，不包含任何商业变现或侵权使用。

### 🔗 核心参考源与设计致谢 (Primary References)

1. [鹰角网络官网 (HYPERGRYPH Official)](https://www.hypergryph.com/)
2. [《明日方舟》官方网站 (Arknights Official)](https://ak.hypergryph.com/)
3. [《明日方舟：终末地》官方网站 (Arknights: Endfield Official)](https://endfield.hypergryph.com/)
4. [Bilibili @设计师深海: 《明日方舟：终末地》UI设计美学深度解析 (BV142zkBbEL6)](https://www.bilibili.com/video/BV142zkBbEL6/)
5. [GitHub 开源参考: Terra-Online/Atlos (明日方舟终末地地图界面参考)](https://github.com/Terra-Online/Atlos)

---

## 🎨 双轴机能设计哲学 (Dual-Axis Design Architecture)

Terra-UI 将两种截然不同但互相呼应的机能视觉哲学融合为一套正交的设计令牌系统：

| 设计轴线 | 阵营与视觉隐喻 | 核心视觉特征与表现载体 |
| :--- | :--- | :--- |
| **2D 极简瑞士平面轴** | **PRTS 战术终端** (`prts`) | 克制严谨的瑞士国际主义平面排版、高信息密度坐标网格、非对称布局对齐、大字阶黑白强对比、无浮夸 3D 冗余。专为数据密集的开发工具与战术监控流定制。 |
| **3D 拓扑空间工业轴** | **终末地工业电网** (`dijiang` / `wuling`) | 实时光标跟踪的 3D 透视悬浮卡片 (`<TerraSpatialCard />`)、塔卫二地形等高线测绘底衬 (`<TerraContourLines />`)、-20° 下沉式工业 AIC 电网负荷母线 (`<TerraSegmentBar />`) 与 CAD 测绘准星 (`[ ]`, `+`)。 |

---

## ⚡ 极限性能架构 (Performance Architecture)

1. **零 Virtual DOM 开销（Zero-VDOM）**：基于 Svelte 5 Native Runes（`$state`, `$derived`, `$props`）构建，所有状态变化直接编译为细粒度的微观 DOM 更新，完全省去组件树递归 Diff 的计算损耗。
2. **GPU 硬件合成层加速（Compositor Acceleration）**：全量 3D 物理倾斜、装甲卷帘切换（`scaleX` + `cubic-bezier(1, 0, 0.7, 1)`）、45° 几何切角（`clip-path`）与光效扫光完全由 GPU Compositor 线程独立驱动，实测 120 FPS 满帧丝滑。
3. **正交主题与色彩模式引擎**：全量支持深色与浅色双模（`[data-mode="dark"]`, `[data-mode="light"]`），无缝适配多个阵营工业主题（`dijiang` 帝江号、`wuling` 武陵枢纽、`prts` 罗德岛）。

---

## 🧩 核心原子组件清单 (Component Inventory)

### 1. 3D 空间与物理交互组件
- `<TerraSpatialCard />`：多轴 3D 物理悬浮卡片，带实时光标透视倾斜、Z 轴视差景深与 GPU 动态镜面反射光泽。
- `<TerraContourLines />`：终末地塔卫二地形等高线测绘底衬，带动态海拔坐标与 CAD 测绘十字准星。
- `<TerraSegmentBar />`：-20° 下沉式工业 AIC 电网负荷母线 / 战术技能储备指示器，支持动态充能脉冲波。

### 2. 原生数据图表套件 (Zero-Dependency SVG)
- `<TerraDonutChart />`：战术环形资源分布图，支持中心聚焦度量与四通道配比。
- `<TerraLineChart />`：零依赖纯原生矢量数据流折线图，支持双数据流波形、渐变填充与动态极值标注。
- `<TerraBarChart />`：分段直方柱状图，支持双向柱状对比与平滑更新。

### 3. 现代开发者与系统可观测性套件 (Developer & Observability Suite)
- `<TerraActivityHeatmap />` / `<TerraHeatmap />`：GitHub 同款 2D 时序活动与提交频率热力图，带 5 阶能级梯度与战术 HUD 悬浮读数提示框。
- `<TerraStatusStrip />`：GitHub / Cloudflare Status 同款 1D 连续服务可用率状态细条，支持 4 档健康等级与事件探针。
- `<TerraSparkline />`：超轻量零边距行内走势波形图，适用于 KPI 指标卡片、数据表格与头部读数，带末端动态呼吸脉冲点。

### 4. 战术标尺、HUD 与精密控制
- `<TerraVerticalSlider />`：工业精密垂直滑块控制台，支持刻度标记与双向参数标定。
- `<TerraVerticalTabs />`：悬浮游标垂直标签导航，平滑跟踪当前激活项。
- `<TerraCornerBrackets />`：战术线框包角聚焦器，带 HUD 状态标签与角标延伸线。
- `<TerraCadPattern />`：交互式 CAD 坐标栅格层，支持光标悬浮高亮反馈。

### 5. 机能人员档案与技术简报
- `<TerraProfileCard />`：极简瑞士排印风格的开发者与运维人员凭证卡。
- `<TerraTacticalProfile />`：高仿真战术干员档案简报卡，带安全权限徽章与序列号。
- `<TerraDossierCard />`：多状态情报档案卷宗展示卡。

### 6. 系统引导与原子控制图元
- `<TerraButton />`：支持 45° 几何切角、GPU 悬浮扫光（Shimmer）与四种语义形态的机能按钮。
- `<TerraPanel />`：支持 100% 全闭合 1px 矢量斜切金属边框、工业警示斑马条、出厂铭牌标题栏与 5 种官方级边角装饰预设（`endfield` 终末地加强筋、`rhodes` 罗德岛微刻度、`industrial` 重工铆钉、`brackets` 战术包角、`clean` 极简纯净）的机能装甲容器面板。
- `<TerraBadge />`：带微型安全等级标识（`ADM`, `AIC`, `GRID`, `OK`）的工业标签。
- `<TerraStatusBeacon />`：多态呼吸脉冲状态指示灯。
- `<TerraRollingNumber />`：平滑弹簧滚动数字计数器，适用于高频数据跳变展示。
- `<TerraBarcode />`：纯矢量工业条形码与出厂序列号微组件。
- `<TerraInput />`：终端命令行样式的切角输入框。
- `<TerraInitialBootScreen />`：对齐游戏启动体验的高仿真自检内核引导序列（2.2s 极速自检）。
- `<TerraCurtainTransition />`：实心工业装甲卷帘切页（带 0~100% 疾速大字阶百分比倒计时）。

---

## 🚀 快速启动与使用示例 (Quick Start & Usage)

### 1. 通过 npm 安装

```bash
npm install @k0maru/terra-ui
```

### 2. 组件使用示例 (Svelte 5)

在 Svelte 5 项目中直接导入组件与样式：

```svelte
<script lang="ts">
  import {
    TerraSpatialCard,
    TerraButton,
    TerraSegmentBar,
    TerraDonutChart,
    TerraStatusBeacon
  } from '@k0maru/terra-ui'
  import '@k0maru/terra-ui/css'

  let energyLevel = $state(76)
  let status = $state<'online' | 'warning' | 'critical'>('online')
</script>

<div class="p-8 bg-zinc-950 text-white min-h-screen">
  <TerraSpatialCard glare={true} maxTilt={8} class="p-6 max-w-md">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-mono text-sm tracking-wider uppercase">AIC BUS 04 // 状态监控</h3>
      <TerraStatusBeacon state={status} />
    </div>

    <!-- -20° 下沉式电网负荷母线 -->
    <TerraSegmentBar
      totalSegments={24}
      activeSegments={Math.round((energyLevel / 100) * 24)}
      accentColor="var(--terra-amber)"
    />

    <!-- 环形数据分布图 -->
    <div class="mt-6 flex justify-center">
      <TerraDonutChart
        segments={[
          { label: '核心负荷', value: 45, color: '#f59e0b' },
          { label: '次级电网', value: 30, color: '#3b82f6' },
          { label: '辅助回路', value: 25, color: '#10b981' }
        ]}
        centerValue="{energyLevel}%"
        centerLabel="OUTPUT"
      />
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <TerraButton variant="secondary" onclick={() => energyLevel = Math.max(0, energyLevel - 10)}>
        负荷降低
      </TerraButton>
      <TerraButton variant="primary" onclick={() => energyLevel = Math.min(100, energyLevel + 10)}>
        快速充能
      </TerraButton>
    </div>
  </TerraSpatialCard>
</div>
```

### 3. 仓库本地开发与打包

```bash
# 克隆仓库代码
git clone https://github.com/K0maru/terra-ui.git
cd terra-ui

# 安装依赖
npm install

# 启动交互式展示台开发服务器
npm run dev

# 极速 SPA 生产构建（供 GitHub Pages 部署）
npm run build

# 独立组件库打包（产出至 dist-lib/）
npm run package
```

---

## 📄 开源许可证与维护者 (License & Maintainer)

- **开源协议**: [MIT License](LICENSE)
- **项目维护者**: [K0maru](https://github.com/K0maru) (开源仓库: [https://github.com/K0maru/terra-ui](https://github.com/K0maru/terra-ui))
- **设计灵感致敬**: [上海鹰角网络科技有限公司 (Shanghai HYPERGRYPH Network Technology Co., Ltd.)](https://www.hypergryph.com/)
