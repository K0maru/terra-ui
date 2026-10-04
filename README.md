# 🛡️ TERRA-UI // High-Performance Operator Design System

> **Zero-VDOM // Svelte 5 Runes // GPU Composited // In-Game Hardware Aesthetics**  
> 专为明日方舟（罗德岛 PRTS 战术终端）与明日方舟：终末地（帝江号重工 / 四号谷地开拓 / 武陵枢纽）打造的高性能纯粹设计系统与组件库。

---

## 🎨 三大核心世界观配色 (In-Game Themes)

在 HTML 根节点通过 `data-theme` 属性实现毫秒级瞬切：

| 主题标识 | 游戏内所属区域 / 阵营 | 视觉特征与色值 |
| :--- | :--- | :--- |
| `data-theme="dijiang"` | **终末地 · 帝江号工程舰 / 四号谷地** | 重轧冷钢碳黑底 (`#0A0C0F`)、高电压工装荧光黄 (`#FFF000`)、AIC 工业电网青蓝 (`#00E5FF`)、黑黄安全警示斜纹 |
| `data-theme="wuling"` | **终末地 · 武陵枢纽 (东方未来工业)** | 苍山冷砚墨黑底 (`#060B0D`)、武陵高纯度翡翠翠光 (`#00F5B8`)、汉白冷金砂 (`#D4AF37`)、丹砂朱印 (`#FF3B30`) |
| `data-theme="prts"` | **明日方舟 · 罗德岛 PRTS 战术终端** | 极深冷黑战术底 (`#090B0E`)、罗德岛冷蓝 (`#00D8FF`)、天灾橙色警报 (`#F59E0B`) |

---

## ⚡ 极限性能架构

1. **零 Virtual DOM（Zero-VDOM）**：基于 Svelte 5 Runes 编译，编译期直出精准原生 DOM 赋值，首屏冷启动仅需数十毫秒，彻底规避传统 React/Vue 树递归 Diff 导致的 GC 卡顿。
2. **GPU 硬件合成层加速（Compositor-Only）**：所有切角（`clip-path`）、发光扫光（`shimmer`）、三层呼吸点阵（`.terra-dot-matrix`）、战术线框（`bracket`）全部交由 GPU 独立线程驱动，实测稳定 120fps 满帧运行。
3. **纯粹组件展示台（Pure Kitchen Sink Demo）**：Demo 平台专为测试和展示组件库本身而设计，绝不杂糅任何个人业务代码。

---

## 🧩 核心原子组件清单

- `<TerraButton />`：支持 45° 几何切角、GPU 悬浮扫光（Shimmer）、四种语义形态（primary, outline, ghost, danger）；
- `<TerraPanel />`：支持四角准星（Reticle `+`）、战术线框包角（In-Game Brackets `[ ]`）、出厂铭牌标题栏、斜纹警示条；
- `<TerraSegmentBar />`：**终末地游戏内专属**分段式能耗槽 / 战术技力储备指示器；
- `<TerraBadge />`：带微型安全等级标识（`ADM`, `AIC`, `CRIT`, `OK`）的工业标签；
- `<TerraStatusBeacon />`：多态呼吸脉冲状态指示灯（online, standby, alert, offline）；
- `<TerraRollingNumber />`：平滑弹簧滚动数字计数器，适合工业遥测与高频数据指标；
- `<TerraBarcode />`：纯矢量的工业条形码与出厂序列号微组件；
- `<TerraInput />`：终端命令行样式的切角输入框（带 `AIC//>` 前缀）。

---

## 🚀 快速启动

```bash
# 启动本地交互展示台
npm run dev

# 极速生产构建 (约 270ms 完成构建)
npm run build
```

---

## 📚 关联文档与知识网络
- **SecondBrain 项目主案**：`SecondBrain/10_Projects/Terra-UI.md`
- **立项架构与性能日志**：`SecondBrain/01_AI_Logs/2026-10-04-terra-ui-architecture-and-implementation-plan.md`
