# 🛡️ TERRA-UI // High-Performance Operator Design System

> **Zero-VDOM // Svelte 5 Runes // GPU Composited // Multi-Theme**  
> 专为明日方舟（PRTS / 罗德岛 / 莱茵生命）与明日方舟：终末地（Endfield AIC / 开拓工业）风格打造的高性能纯粹设计系统与组件库。

---

## ⚡ 核心架构与极致性能

1. **零 Virtual DOM（Zero-VDOM）**：基于 Svelte 5 Runes 编译，编译期直出精准原生 DOM 赋值，首屏冷启动仅需数十毫秒，彻底规避传统 React/Vue 树递归 Diff 导致的 GC 卡顿。
2. **GPU 硬件合成层加速（Compositor-Only）**：所有切角（`clip-path`）、发光扫光（`shimmer`）、三层呼吸点阵（`.terra-dot-matrix`）全部交由 GPU 独立线程驱动，实测稳定 120fps 满帧运行。
3. **纯粹组件展示台（Pure Kitchen Sink Demo）**：Demo 平台专为测试和展示组件库本身而设计，绝不杂糅任何个人业务代码。

---

## 🎨 三大世界观主题 (Themes)

在 HTML 根节点通过 `data-theme` 属性实现毫秒级瞬切：

| 主题标识 | 灵感世界观 | 视觉特征 |
| :--- | :--- | :--- |
| `data-theme="prts"` | **明日方舟 · PRTS 战术终端** | 深冷战术黑底、罗德岛冷蓝高亮、天灾橙黄警报 |
| `data-theme="endfield"` | **明日方舟：终末地 · AIC 工业开拓** | 工装轻工业浅白底、高能荧光黄、墨黑高对比排版 |
| `data-theme="rhine"` | **莱茵生命 · 科考档案系统** | 暖灰羊皮底色、暖杏金信号、细线瑞士杂志排版 |

---

## 🧩 核心原子组件

- `<TerraButton />`：支持 45° 几何切角、GPU 悬浮扫光（Shimmer）、四种语义形态（primary, outline, ghost, danger）；
- `<TerraPanel />`：带四角十字准星（Reticle）、出厂铭牌标题栏、斜纹警示条的高密工业容器；
- `<TerraBadge />`：带微型安全等级标识（如 `SYS`, `LV.3`）的工业标签；
- `<TerraStatusBeacon />`：多态呼吸脉冲状态指示灯（online, standby, alert, offline）；
- `<TerraRollingNumber />`：平滑弹簧滚动数字计数器，适合工业遥测与高频数据指标；
- `<TerraBarcode />`：纯矢量的工业条形码与出厂序列号微组件；
- `<TerraInput />`：终端命令行样式的切角输入框。

---

## 🚀 快速启动

```bash
# 安装依赖
npm install

# 启动本地开发与交互展示台
npm run dev

# 极速生产构建 (约 270ms 完成构建)
npm run build

# 预览生产构建产物
npm run preview
```

---

## 📚 关联文档与知识网络
- **SecondBrain 项目主案**：`SecondBrain/10_Projects/Terra-UI.md`
- **立项架构与性能日志**：`SecondBrain/01_AI_Logs/2026-10-04-terra-ui-architecture-and-implementation-plan.md`
- **参考素材库**：`terra-ui/references/` (包含莱茵生命、终末地与 ignoredone 氛围站的源码与提取样式)
