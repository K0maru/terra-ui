# 设计参考素材库 (References)

本目录分类整理了三个顶级参考来源的核心代码、设计资产与设计规范。

---

## 1. 莱茵生命 UI 档案系统 (`references/rhine-lab/`)
* **来源**：
  * [LBEILC/RhineLabUI-Workflow](https://github.com/LBEILC/RhineLabUI-Workflow) (复刻工作流与提示词复盘)
  * [LBEILC/RhineLabUI](https://github.com/LBEILC/RhineLabUI) (完整项目代码)
* **核心价值**：
  * 完整的 Three.js 3D 档案阵列、抽取透视相机阻尼。
  * `DESIGN.md`：详细记录了 1920×1080 舞台、MiSans / DIN 字体层级、暗调黑白、暖杏金信号、磨砂透射材质参数。
  * `AGENTS.md`：规范了如何用 AI 辅助进行像素级 UI 迭代。

---

## 2. 终末地官网风格博客主题 (`references/cloud09-endfield/`)
* **来源**：
  * [cloud09.space](https://cloud09.space/)
  * NotionNext 官方 `themes/endspace`（终末地 Light Industrial 主题源码）
* **核心价值**：
  * 完整的 CSS Custom Properties：
    * 主背景：`#FAFAFA` (Light) / `#09090B` (Dark)
    * 终末地标志高亮黄：`#FBFB45` / `#FFDE00`
    * 边框：`#E4E4E7`
    * 柔和工业阴影与 1px 黄色悬浮发光边框 (`0 0 0 1px var(--endspace-accent-yellow)`)
  * 移动端与桌面端自适应视口缩放规范 (`clamp` 排版)。
  * 完整的工业风卡片、导航栏、侧边栏排版逻辑。

---

## 3. 鹰角风格沉浸式体验站 (`references/ignored-one/`)
* **来源**：
  * [ignoredone.space](https://www.ignoredone.space/)
* **核心价值**：
  * 提取的纯 CSS 与动效资产：`extracted_styles.css`
  * **三层呼吸点阵背景 (`.dot-matrix-bg`)**：极低开销但高级感十足的径向点阵，带错峰微幅呼吸动画。
  * **液态毛玻璃悬浮导航栏 (`.glass-bar`)**：带悬浮光效滑动扫光 (`transform: translateX(100%)`)。
  * **超大字号打字机标题 (`.typewriter-line`)**：9vw 紧凑字间距，强烈的现代杂志版式。
