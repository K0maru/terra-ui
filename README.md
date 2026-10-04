# 🛡️ TERRA-UI // High-Performance Operator Design System

> **Zero-VDOM // Svelte 5 Runes // GPU Composited // In-Game Hardware Aesthetics**  
> 专为明日方舟（罗德岛 PRTS 瑞士平面战术）与明日方舟：终末地（帝江号重工 / 四号谷地拓荒 / 武陵枢纽 3D 等高线工业）打造的高性能纯粹设计系统与组件库。

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

- `<TerraContourLines />`：**终末地专属** 塔卫二地形等高线测绘图层（带海拔坐标与测绘十字）；
- `<TerraCurtainTransition />`：**对齐终末地官网** 的实心工业装甲卷帘切页（带 0~100% 疾速大字阶百分比倒计时）；
- `<TerraSegmentBar />`：分段式工业电网负荷 / 战术技力储备指示器；
- `<TerraButton />`：支持 45° 几何切角、GPU 悬浮扫光（Shimmer）、四种语义形态；
- `<TerraPanel />`：支持战术线框包角（In-Game Brackets `[ ]`）、四角准星（Reticle `+`）、出厂铭牌标题栏；
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
