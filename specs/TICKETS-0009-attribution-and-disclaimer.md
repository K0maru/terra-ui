# TICKETS-0009 // 版权免责声明与设计灵感致敬来源工单

## 📋 工单概览

- 关联规格：[SPEC-0009](./SPEC-0009-attribution-and-disclaimer.md)
- 目标分支：`feat/attribution-and-disclaimer` -> 合并到 `dev`

---

### 🎫 TICKET-01: 重构 `README.md` 加入显要法律免责与灵感致谢
- **目标文件**：
  - `README.md`
- **实现要求**：
  1. 在项目概览显要位置增加独立章节：`## 📜 免责声明与致敬来源 (Disclaimer & Legal Attribution)`；
  2. 明确指出美学风格与交互灵感源于上海鹰角网络科技有限公司（HYPERGRYPH）的《明日方舟》与《明日方舟：终末地》；
  3. 声明知识产权界限：所有商标、世界观与美术风格归鹰角网络所有；本项目纯属学术研究与开源技术探索，不含任何官方私有解包资源；
  4. 完整罗列 5 大参考源链接：鹰角网络官网、明日方舟官网、终末地官网、B站@设计师深海（`BV142zkBbEL6`）、开源项目 Atlos；
  5. 同步更新核心组件库清单（加入 3D 空间物理卡片、折线图、柱状图、环形图、开发者卡片等）。
- **验收标准 (DoD)**：
  - 文档表述中立、客观、严谨，Markdown 语法规范无死链。

---

### 🎫 TICKET-02: 扩展双语词典支持免责声明条目 (`src/i18n/dict.ts`)
- **目标文件**：
  - `src/i18n/dict.ts`
- **实现要求**：
  1. 为 `translations.en` 与 `translations.zh` 扩充字段：
     - `nav.legal`: `'LEGAL / ATTRIBUTION'` / `'版权与致敬声明'`
     - `footer.disclaimerTag`: `'LEGAL NOTICE // ATTRIBUTION & INSPIRATION'` / `'法律声明 // 设计灵感与致敬来源'`
     - `footer.disclaimerText`: 完整的知识产权与非商业研究说明；
     - `footer.refTitle`: `'PRIMARY DESIGN INSPIRATION & REFERENCES'` / `'核心设计灵感与参考源'`
     - `footer.refLinks`: 包含鹰角官网、明日方舟官网、终末地官网、深海设计美学解析、Atlos 开源项目的双语链接标题。
- **验收标准 (DoD)**：
  - 类型检查无报错，双语切换自然流畅。

---

### 🎫 TICKET-03: Demo 展示页面增加显要免责与参考源展示台 (`src/App.svelte`)
- **目标文件**：
  - `src/App.svelte`
- **实现要求**：
  1. 在页脚（Footer）上方创建专门的 `<TerraCornerBrackets>` 免责声明展示专栏；
  2. 呈现结构化排版：
     - 左侧：双语免责声明正文，明确指出非官方、学术与非商业开源属性；
     - 右侧：交互式参考外链矩阵（使用 `<TerraButton variant="outline" size="sm">`），链接至鹰角网络、明日方舟、终末地官网、深海 B 站解析视频及 Atlos 仓库；
  3. 顶部 Header 增加跳转按钮：`[LEGAL / 声明]`，点击平滑滚动至免责专栏。
- **验收标准 (DoD)**：
  - 页面美观严谨，所有外链均以安全模式打开新标签页。

---

### 🎫 TICKET-04: 生产构建验证、规范提交与 Bot PR 合并
- **目标**：
  1. 执行 `npm run build`，确保 0 errors, 0 warnings，构建时间 < 400ms。
  2. 读取 `git config --get agent.coauthor`，以标准 Bot 规范提交代码至 `feat/attribution-and-disclaimer`。
  3. 推送到远程分支，通过 `gh pr create` 发起包含 `[AI-Agent]` 标识的 PR 并合并到 `dev`。
- **验收标准 (DoD)**：
  - 成功合并 PR 到 `dev` 分支，本地及远端同步。
