# TICKETS-0006 // 国际化多语言切换系统实现工单

## 📋 工单概览

- 关联规格：[SPEC-0006](./SPEC-0006-i18n-language-switch.md)
- 目标分支：`feat/i18n-language-switch` -> 合并到 `dev`

---

### 🎫 TICKET-01: 创建原生轻量 i18n 响应式模块 (`src/i18n/`)
- **目标文件**：
  - `src/i18n/dict.ts` (中英双语词典定义)
  - `src/i18n/index.ts` (状态管理与导出)
- **实现要求**：
  1. 纯 Svelte 5 Runes 架构（`$state`），支持 `'en'` 与 `'zh'`，默认 `'en'`；
  2. 初始化时优先读取 `localStorage.getItem('terra_locale')`，若无则默认 `'en'`；
  3. 提供 `setLocale(newLocale)` 函数，自动同步更新 `localStorage`；
  4. 提供强类型 `t` 字典访问器，保证完全类型安全。
- **验收标准 (DoD)**：
  - TypeScript 类型完备，无 `any`，编译期自动检查缺失键名。

---

### 🎫 TICKET-02: 导航栏集成战术语言切换器 (`src/App.svelte`)
- **目标文件**：
  - `src/App.svelte` (顶部 Header)
- **实现要求**：
  1. 在 Header 工具区新增语言切换开关：`EN` / `中文`；
  2. 采用战术切角样式（`terra-cut-tr`），激活态呈现主题强调色高亮；
  3. 点击即时生效，无需刷新页面。
- **验收标准 (DoD)**：
  - 在移动端与桌面端均能清晰操作，不挤占其他控制按钮。

---

### 🎫 TICKET-03: 全面重构 Section 01, 02, 03 双语文本
- **目标文件**：
  - `src/App.svelte`
- **实现要求**：
  1. 替换所有散落的中英混杂字符串为 `$derived` / `t` 词典绑定；
  2. 英文模式 (`en`)：
     - 彻底去除页面中出现的任何零散中文字符；
     - 采用国际化标准的机能战术英文（如 "HOVER MOUSE OVER CARDS TO EXPERIENCE MULTI-AXIS 3D PERSPECTIVE TILT"、"SYSTEM RESOURCE ALLOCATION"、"NOMINAL" 等）；
  3. 中文模式 (`zh`)：
     - 纯正的科幻工业与机能战术语境（如“空间物理悬浮互动复合体”、“战术指令调度中枢”、“主电网工业负荷”等），杜绝中英乱炖。
- **验收标准 (DoD)**：
  - 切换至 `en` 时，整站无任何汉字；切换至 `zh` 时，结构与术语纯粹统一。

---

### 🎫 TICKET-04: 适配启动屏幕与战术档案卡
- **目标文件**：
  - `src/components/TerraInitialBootScreen.svelte`
  - `src/components/TerraTacticalProfile.svelte`
- **实现要求**：
  1. `<TerraInitialBootScreen>` 根据当前语言展示英文或中文标语及系统诊断状态；
  2. `<TerraTacticalProfile>` 单元属性（战备状态、分支职能、动作按钮）根据语言响应切换。
- **验收标准 (DoD)**：
  - 启动画面与干员卡片在对应语言下自然呈现。

---

### 🎫 TICKET-05: 生产构建验证、规范提交与 Bot PR 合并
- **目标**：
  1. 执行 `npm run build`，确保 0 errors, 0 warnings，构建时间 < 400ms。
  2. 读取 `git config --get agent.coauthor`，以标准 Bot 规范提交代码至 `feat/i18n-language-switch`。
  3. 推送到远程分支，通过 `gh pr create` 发起包含 `[AI-Agent]` 标识的 PR 并合并到 `dev`。
- **验收标准 (DoD)**：
  - 成功合并 PR 到 `dev` 分支，本地及远端同步。
