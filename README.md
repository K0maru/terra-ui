# 🛡️ TERRA-UI // High-Performance Operator Design System

> **Zero-VDOM // Svelte 5 Runes // GPU Composited // In-Game Hardware Aesthetics**  
> 专为明日方舟（罗德岛 PRTS 瑞士平面战术）与明日方舟：终末地（帝江号重工 / 四号谷地拓荒 / 武陵枢纽 3D 等高线工业）打造的高性能纯粹设计系统与组件库。

---

## 📜 免责声明与设计灵感致敬 (Disclaimer & Legal Attribution)

> **重要声明 (Important Notice)**:  
> 本项目（Terra-UI）为独立研发的开源学术与前端技术探索项目。  
> 本系统的美学风格、排版逻辑及交互灵感直接汲取并参考自上海鹰角网络科技有限公司（HYPERGRYPH）开发的作品 **《明日方舟》（Arknights）** 与 **《明日方舟：终末地》（Arknights: Endfield）**。

- **知识产权归属**：所有与《明日方舟》及《明日方舟：终末地》相关的商标、著作权、美术风格原案与世界观设计均完全归属于 **上海鹰角网络科技有限公司 (Shanghai HYPERGRYPH Network Technology Co., Ltd.)** 及其关联方。
- **非商业与非官方性质**：本项目纯粹用于开源社区前端工程技术研究、Svelte 5 组件架构探索与 UI/UX 美学呈现，不包含任何商业变现或商业用途。
- **无私有解包资源**：本项目全量代码（Svelte 组件、SVG 图标、CSS 样式）均为全新独立编写实现，**未提取、未解包、未分发任何官方私有美术切片、音频模型或专有加密资源**。

### 🔗 核心参考源与设计致谢 (Primary References)
1. [鹰角网络官网 (HYPERGRYPH Official)](https://www.hypergryph.com/)
2. [《明日方舟》官方网站 (Arknights Official)](https://ak.hypergryph.com/)
3. [《明日方舟：终末地》官方网站 (Arknights: Endfield Official)](https://endfield.hypergryph.com/)
4. [Bilibili @设计师深海: 《明日方舟：终末地》UI设计美学深度解析 (BV142zkBbEL6)](https://www.bilibili.com/video/BV142zkBbEL6/)
5. [GitHub 开源参考: Terra-Online/Atlos (明日方舟终末地地图界面参考)](https://github.com/Terra-Online/Atlos)

---

## 🎨 视觉哲学分化与世界观矩阵

| 风格流派 | 对应阵营 | 视觉语言与核心表现 |
| :--- | :--- | :--- |
| **3D 立体等高线空间工业** | **终末地 · 帝江号/谷地** (`dijiang`)<br>**终末地 · 武陵枢纽** (`wuling`) | 塔卫二探索等高线地形测绘（`<TerraContourLines />`）、AIC 工业分段电网负荷槽（`<TerraSegmentBar />`）、CAD 测绘十字与战术锁定括号（`[ ]`）、官网级实心品牌色装甲卷帘切换（`<TerraCurtainTransition />`）。 |
| **2D 极简瑞士平面战术** | **明日方舟 · 罗德岛 PRTS** (`prts`) | 克制严谨的瑞士国际主义平面排版、非对称坐标网格、大字阶黑白强对比、无浮夸 3D 冗余、克制局部数据点阵。 |

---

## ⚡ 极限性能架构

1. **零 Virtual DOM（Zero-VDOM）**：基于 Svelte 5 Runes 细粒度响应式编译，直接编译为微观原生 DOM 修改，消除组件树递归 Diff 开销。
2. **GPU 硬件合成层加速（Compositor-Only）**：等高线矢量图层、实心工业卷帘（`scaleX` + `cubic-bezier(1,0,.7,1)`）、45° 切角（`clip-path`）全部由 GPU 合成线程独立驱动，实测 120fps 满帧无卡顿。
3. **明暗双模正交支持**：全量主题均支持 `[data-mode="dark"]` 与 `[data-mode="light"]`。

---

## 🧩 核心原子组件清单

### 1. 3D 空间与物理交互组件
- `<TerraSpatialCard />`：多轴 3D 物理悬浮卡片（带光标透视倾斜、Z 轴视差景深与 GPU 动态镜面反射光泽）；
- `<TerraContourLines />`：**终末地专属** 塔卫二地形等高线测绘底衬（带动态海拔坐标与 CAD 测绘十字）；
- `<TerraSegmentBar />`：-20° 下沉式工业电网负荷母线 / 战术技力储备指示器（带充电光效脉冲）；

### 2. 遥测数据图表套件 (Zero-Dependency SVG)
- `<TerraLineChart />`：纯原生矢量机能遥测折线图，支持双数据流波形、渐变填充与动态极值标注；
- `<TerraBarChart />`：分段直方柱状图，支持双向柱状对比与平滑更新；
- `<TerraDonutChart />`：战术环形资源分布图，支持中心聚焦度量与四通道配比；

### 3. 战术标尺、HUD 与导航控制
- `<TerraVerticalSlider />`：工业精密垂直滑块控制台，支持刻度标记与双向参数标定；
- `<TerraVerticalTabs />`：悬浮游标垂直标签导航，平滑跟踪激活项；
- `<TerraCornerBrackets />`：战术线框包角聚焦器，带 HUD 状态标签与角标延伸线；
- `<TerraCadPattern />`：交互式 CAD 坐标栅格层，支持光标悬浮高亮；

### 4. 机能人员档案与技术简报
- `<TerraTacticalProfile />`：高仿真战术干员档案简报卡，带安全权限徽章与序列号；
- `<TerraProfileCard />`：极简瑞士排印风格的开发者与运维人员卡；
- `<TerraDossierCard />`：多状态情报档案卷宗展示卡；

### 5. 系统引导与原子控制图元
- `<TerraInitialBootScreen />`：对齐游戏启动体验的高仿真自检内核引导序列（2.2s 极速自检）；
- `<TerraCurtainTransition />`：实心工业装甲卷帘切页（带 0~100% 疾速大字阶百分比倒计时）；
- `<TerraButton />`：支持 45° 几何切角、GPU 悬浮扫光（Shimmer）、四种语义形态；
- `<TerraPanel />`：支持战术线框包角（Brackets `[ ]`）、四角准星（Reticle `+`）、出厂铭牌标题栏；
- `<TerraBadge />`：带微型安全等级标识（`ADM`, `AIC`, `GRID`, `OK`）的工业标签；
- `<TerraStatusBeacon />`：多态呼吸脉冲状态指示灯；
- `<TerraRollingNumber />`：平滑弹簧滚动数字计数器；
- `<TerraBarcode />`：纯矢量工业条形码与出厂序列号微组件；
- `<TerraInput />`：终端命令行样式的切角输入框。

---

## 🚀 快速启动

```bash
# 启动本地交互展示台
npm run dev

# 极速生产构建 (约 300ms 完成构建)
npm run build
```

---

## 📚 关联文档与知识网络
- **SecondBrain 项目主案**：`SecondBrain/10_Projects/Terra-UI.md`
- **立项架构与性能日志**：`SecondBrain/01_AI_Logs/2026-10-04-terra-ui-architecture-and-implementation-plan.md`
- **免责声明规格文档**：`specs/SPEC-0009-attribution-and-disclaimer.md`
