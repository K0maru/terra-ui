# SPEC-0010 // 双语 README 文档规范与默认英文架构 (Bilingual README Specification)

## 📌 1. 背景与目标

用户明确指示：
> “且README提供中英文两个版本，默认是英文”

在国际开源社区的标准实践中：
1. **默认英文 (`README.md`)**：作为仓库的默认首页，必须采用纯正、国际化、专业的全英文书写，方便全球开发者与开源社区阅读交流。
2. **中文版本 (`README_zh.md`)**：提供完整、精炼、准确的中文版本，并在两份文档头部互相设立直达跳转链接。
3. **法律免责声明与致敬**：两份文档均在显要位置完整保留法律免责声明（明确灵感源于上海鹰角网络《明日方舟》与《明日方舟：终末地》），并列出 5 大官方与社区参考源链接。
4. **隐私脱敏底线**：严禁出现任何个人私有邮箱、线下真实姓名或本地绝对路径。

---

## 🏗️ 2. 文档结构规划

### 2.1 英文版本 (`README.md`)
- **Header Badge & Language Switcher**：
  ```markdown
  # 🛡️ TERRA UI // Functional Cybernetic Design System

  > **Zero-VDOM // Svelte 5 Native Runes // GPU Composited // Industrial Telemetry Aesthetics**  
  > A high-performance Svelte 5 component library for industrial telemetry, developer tools, and cybernetic interfaces.

  [English](README.md) | [简体中文](README_zh.md)
  ```
- **Section 1: 📜 Disclaimer & Inspiration Attribution (Prominent)**：
  - Acknowledging Hypergryph, Arknights, Endfield.
  - Clear legal IP boundaries, academic/non-commercial research statement, zero official asset extraction.
  - Primary references: Hypergryph Official, Arknights Official, Endfield Official, Designer Shenhai UI Analysis, Atlos.
- **Section 2: 🎨 Dual-Axis Design Philosophy**：
  - 2D Flat Graphic Axis (Swiss Grid, High Density, Zero 3D Clutter).
  - 3D Spatial Topology Axis (Pointer-tracking 3D cards, -20° recessed energy bus, mountain contours, telemetry charts).
- **Section 3: ⚡ Zero-VDOM & Performance Architecture**：
  - Svelte 5 Native Runes (`$state`, `$derived`, `$props`).
  - 100% GPU Compositor acceleration (`transform`, `opacity`, `clip-path`).
- **Section 4: 🧩 Complete Component Inventory**：
  - Categorized list of all 18+ components.
- **Section 5: 🚀 Quick Start & Usage**：
  - Installation, dev server, build command, basic component usage snippet.
- **Section 6: 📄 License & Maintainer**：
  - MIT License, Maintainer: `K0maru` (GitHub: `https://github.com/K0maru/terra-ui`).

### 2.2 中文版本 (`README_zh.md`)
- 结构与英文版严格对齐，提供典雅、严谨、专业的简体中文表述。
- 头部同样保留 `[English](README.md) | [简体中文](README_zh.md)` 导航。

---

## ⚡ 3. 验收标准 (DoD)
1. 仓库根目录存在 `README.md`（纯英文）与 `README_zh.md`（纯中文）。
2. 两份文档头部均包含相互跳转链接，锚点与外部链接全部有效。
3. 全文无任何个人邮箱、无真实姓名、无本地绝对路径。
4. 包含完整的组件清单与鹰角网络版权免责声明。
