# SPEC-0009 // 版权免责声明与设计灵感致敬来源规范 (Attribution & Legal Disclaimer)

## 📌 1. 背景与法律/伦理诉求

用户明确要求：
> “为避免侵权和被指控抄袭，我要你明确在README还有Demo上说明我们的参考来源，和指出就是参考明日方舟/明日方舟终末地风格”

作为一项前沿的开源前端机能设计系统，必须保持**极其严谨、透明、尊重的知识产权伦理界限**：
1. **明确声明灵感与风格来源**：明确指出本项目的美学风格、设计规范与交互逻辑汲取自上海鹰角网络科技有限公司（HYPERGRYPH）的代表作《明日方舟》（Arknights）及《明日方舟：终末地》（Arknights: Endfield）。
2. **界定法律与知识产权归属 (IP & Copyright Boundaries)**：
   - 明示相关游戏商标、美术风格原案与世界观资产均属于 **HYPERGRYPH（鹰角网络）** 及其关联方所有；
   - 强调 `terra-ui` 为**完全由社区独立研发的非商业化、学术研究与前端交互技术验证项目**；
   - 严正声明：本项目**未反编译、未提取、未分发任何官方私有美术切片、音频、3D模型或加密工程资产**，全部组件（按钮、滑块、能量母线、图表、卡片等）均为基于 Svelte 5 + SVG + 原生 CSS 的全新代码独立实现。
3. **公开致敬与参考来源索引 (References & Citations)**：
   - 官方游戏与官网：`ak.hypergryph.com` / `endfield.hypergryph.com` / `hypergryph.com`
   - 专业美学解析：B 站 UP 主「设计师深海」关于终末地 UI 视觉设计的深度剖析（`BV142zkBbEL6`）
   - 社区开源先驱：`Terra-Online/Atlos`（`https://github.com/Terra-Online/Atlos`）

---

## 🏗️ 2. 呈现位置与落地方案

### 2.1 仓库核心文档 (`README.md`)
在项目根目录 `README.md` 的显要位置（头部徽章下方及独立章节）设立双语格式的法律与免责声明专栏：
- **标题**：`## 📜 免责声明与致敬来源 (Disclaimer & Legal Attribution)`
- **内容要求**：
  1. 风格归属与致敬致谢；
  2. 知识产权与商标保护声明；
  3. 非商业学术研究性质声明；
  4. 完整参考源链接清单。

### 2.2 展示网站底部 (`src/App.svelte`)
在网站底部的 Footer 设立高辨识度的 **`DISCLAIMER & INSPIRATION ATTRIBUTION`** 专栏：
- 采用微缩战术边框与角标；
- 包含中英双语的免责声明正文，并随 Header 的语言切换（`en` / `zh`）自适应呈现；
- 提供整洁的外链矩阵按钮（直达鹰角官网、明日方舟官网、终末地官网、深海设计解析、Atlos 开源仓库）。

### 2.3 导航栏快速锚点 (`src/App.svelte`)
在 Header 右侧或控制栏中加入紧凑的免责声明链接（如 `[LEGAL / 致敬声明]`），点击平滑滚动至 Footer 免责声明专区，确保任何访客均可第一眼看到该声明。

---

## 📝 3. 双语文案定义 (`src/i18n/dict.ts`)

### 英文版 (`en`)
```
DISCLAIMER // DESIGN INSPIRATION & ATTRIBUTION
Terra-UI is an independent, non-commercial open-source design system.
The visual aesthetics, typography, and interaction patterns are inspired by "Arknights" and "Arknights: Endfield", developed and owned by Shanghai HYPERGRYPH Network Technology Co., Ltd.
All related trademarks, trade dress, and intellectual property belong to HYPERGRYPH.
This project is created strictly for academic research, engineering exploration, and design system demonstration. No official proprietary assets, code, or artwork are extracted, redistributed, or claimed as our own.
```

### 中文版 (`zh`)
```
免责声明 // 设计灵感与致敬来源
Terra-UI 是一套独立研发的开源机能设计系统与组件库。
本项目的美学风格、排印规范与交互逻辑灵感来源于上海鹰角网络科技有限公司（HYPERGRYPH）开发的作品《明日方舟》与《明日方舟：终末地》。
相关游戏商标、商业外观及知识产权均归属于鹰角网络所有。
本项目仅用于前端工程技术验证、学术交流与非商业展示，全量代码均为独立重构编写，未提取、未分发任何官方私有美术切片、音频或工程资产。
```

---

## ⚡ 4. 验收标准 (DoD)
1. `README.md` 包含完整中立、规范的免责声明与参考源列表。
2. Demo 展示页底部有醒目的免责声明区域，支持中英双语切换，且所有参考外链均可正常点击并以 `target="_blank" rel="noopener noreferrer"` 打开。
3. 导航栏提供直达免责声明的跳转提示。
4. `npm run check` 0 错误 0 警告，生产构建正常。
