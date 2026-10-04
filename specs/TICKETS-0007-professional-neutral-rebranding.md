# TICKETS-0007 // 专业中立语义重塑与真实开发者档案接入工单

## 📋 工单概览

- 关联规格：[SPEC-0007](./SPEC-0007-professional-neutral-rebranding.md)
- 目标分支：`feat/professional-neutral-rebranding` -> 合并到 `dev`

---

### 🎫 TICKET-01: 创建真实开发者档案卡组件 (`<TerraProfileCard.svelte>`)
- **目标文件**：
  - `src/components/TerraProfileCard.svelte` (新创建)
  - `src/components/index.ts` (导出新组件，保留向后兼容别名)
- **实现要求**：
  1. 真实呈现 GitHub 用户 `K0maru`（不困）的主创开发者档案：
     - 头像：`https://avatars.githubusercontent.com/u/93422639?v=4`，内嵌微缩瞄准角与扫描线；
     - 用户名：`K0maru`（中文昵称：`不困`）；
     - 职责定位：`Lead Maintainer // 核心主创 & 架构师`；
     - 资质认证标签：`<TerraBadge variant="primary" label="MAINTAINER" code="CORE" />`；
     - 活跃状态：`<TerraStatusBeacon status="online" label="ACTIVE" />`；
     - 工业条形码：`UID-93422639`；
     - 外链跳转按钮：`[GITHUB PROFILE]`（链接至 `https://github.com/K0maru`）和 `[REPOSITORY]`（链接至 `https://github.com/K0maru/terra-ui`）；
  2. 纯 Svelte 5 Runes 驱动，响应当前中英语言环境与暗亮色主题。
- **验收标准 (DoD)**：
  - 开发者卡片样式精致硬朗，点击外链可在新标签页正确打开 GitHub。

---

### 🎫 TICKET-02: 全面更新双语词典 (`src/i18n/dict.ts`)
- **目标文件**：
  - `src/i18n/dict.ts`
- **实现要求**：
  1. 彻底清除中二词汇（移除“战术控制台”、“战术部署”、“肃清腐蚀”、“战备状态”、“战区切换”等）；
  2. 确立专业、中立的工程与系统词汇：
     - Section 01：`2D FLAT INTERFACE & DATA SYSTEM` / `2D 平面界面与数据系统`
     - Section 02：`3D SPATIAL & TELEMETRY COMPLEX` / `3D 空间交互与遥测复合体`
     - Section 03：`UNIVERSAL COMPONENT MATRIX & PARAMETRIC LAB` / `全量组件矩阵与参数实验室`
     - 动作触发：`SUBMIT QUERY` (提交查询), `SYNC CLUSTER` (同步集群), `STANDBY` (待机就绪), `RESET BUFFER` (重置缓存)
     - 节点切换：`US-EAST-01` (北美集群), `AP-EAST-02` (亚太枢纽), `EU-CENTRAL-03` (欧洲节点)
- **验收标准 (DoD)**：
  - 词典类型定义无错误，语言切换语义自洽流畅。

---

### 🎫 TICKET-03: 重构展示主界面 (`src/App.svelte`)
- **目标文件**：
  - `src/App.svelte`
- **实现要求**：
  1. 引入 `<TerraProfileCard>` 替代旧的虚拟战斗卡片；
  2. 全局标题更新为：`TERRA UI // FUNCTIONAL DESIGN SYSTEM` v0.8.0；
  3. 副标题更新为：`A high-performance Svelte 5 component library for industrial telemetry, developer tools & cybernetic interfaces.`；
  4. 色谱选项更名为：`BLUEPRINT` (蓝图青), `INDUSTRIAL` (工业黄), `TELEMETRY` (遥测绿)；
  5. 调整图表与遥测卡片标题为真实的工程场景（系统资源分配、网络吞吐量示波监测、存储配比、GPU 合成层监视等）。
- **验收标准 (DoD)**：
  - 页面整体格调纯粹、严肃、专业，彻底洗去中二感。

---

### 🎫 TICKET-04: 更新引导启动序列文案 (`<TerraInitialBootScreen.svelte>`)
- **目标文件**：
  - `src/components/TerraInitialBootScreen.svelte`
- **实现要求**：
  1. 标语更新为标准的系统自检与内核引导序列：`TERRA UI // SYSTEM INITIALIZATION & KERNEL SELF-TEST`；
  2. 诊断步骤规范为：`1. KERNEL COMPOSITOR INITIALIZED`、`2. HARDWARE GPU SHADER LOADED`、`3. TOKENS & SVELTE RUNES READY`、`4. SYSTEM ALL CLEAR`。
- **验收标准 (DoD)**：
  - 引导屏幕播放极具科技工业感，无虚构背景杂质。

---

### 🎫 TICKET-05: 生产构建验证、规范提交与 Bot PR 合并
- **目标**：
  1. 执行 `npm run build`，确保 0 errors, 0 warnings，构建时间 < 400ms。
  2. 读取 `git config --get agent.coauthor`，以标准 Bot 规范提交代码至 `feat/professional-neutral-rebranding`。
  3. 推送到远程分支，通过 `gh pr create` 发起包含 `[AI-Agent]` 标识的 PR 并合并到 `dev`。
- **验收标准 (DoD)**：
  - 成功合并 PR 到 `dev` 分支，本地及远端同步。
