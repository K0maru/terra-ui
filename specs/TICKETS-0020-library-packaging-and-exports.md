# TICKETS-0020: Terra-UI 独立组件库打包与多目标分发任务清单

## 📌 关联
- **SPEC**: `specs/SPEC-0020-library-packaging-and-exports.md`
- **特性分支**: `feat/library-packaging-and-exports`
- **目标里程碑**: `v0.1.0-milestone`

---

## 📋 工单拆解

### 🎫 TICKET-01: 源码目录结构重构与 Lib 统一导出层 (`src/lib/`)
- **内容**：
  - 创建 `src/lib/` 目录；
  - 将 `src/components/` 迁移至 `src/lib/components/`（或创建软链/直导，保持组件目录整洁）；
  - 将 `src/styles/` 迁移至 `src/lib/styles/`；
  - 将 `src/i18n/` 迁移至 `src/lib/i18n/`；
  - 创建 `src/lib/index.ts`，作为独立组件库的官方唯一入口，导出全部 24+ 原生 Svelte 5 组件与核心 TypeScript 类型；
  - 更新 `src/App.svelte`、`src/main.ts` 与 `src/docs/` 中的引用路径，确保展示台引用路径完全自洽。
- **验收标准 (DoD)**：
  - `npm run check` 零错误、零警告；
  - 展示台页面与 GitBook 文档在本地与生产预览中 100% 正常渲染。

---

### 🎫 TICKET-02: 接入 `@sveltejs/package` 与 `@tailwindcss/cli` 打包流水线
- **内容**：
  - 安装开发依赖：`@sveltejs/package` 与 `@tailwindcss/cli`；
  - 配置 `npm run build:package`：执行 `svelte-package -i src/lib -o dist-lib`，生成 `.svelte` 细粒度组件代码与全套 `.d.ts` 类型声明；
  - 配置 `npm run build:css`：执行 `tailwindcss -i src/lib/styles/tokens.css -o dist-lib/terra-ui.css --minify`，生成独立编译压缩的样式包；
  - 复制原始 `tokens.css` 到 `dist-lib/tokens.css`，支持轻量级主题变量导入；
  - 聚合命令 `npm run package`：一键全量构建库产物至 `dist-lib/`。
- **验收标准 (DoD)**：
  - 运行 `npm run package` 成功产出 `dist-lib/`；
  - `dist-lib/index.js`, `dist-lib/index.d.ts`, `dist-lib/terra-ui.css`, `dist-lib/tokens.css` 完整生成，无编译错误。

---

### 🎫 TICKET-03: `package.json` 规范化、Exports 契约与发布自检
- **内容**：
  - 修改 `package.json`：
    - 包名更名为 `@k0maru/terra-ui`；
    - 版本号标记为 `0.1.0`；
    - 移除 `"private": true`；
    - 配置 `description`, `author`, `license`, `repository`, `homepage`, `keywords`；
    - 声明 `peerDependencies: { "svelte": ">=5.0.0" }`；
    - 配置规范的 `main`, `module`, `types`, `svelte`, `exports` 与 `files` 字段；
    - 配置 `prepack: "npm run package"`。
  - 编写/确保根目录具有标准的 `LICENSE` 文件（MIT）；
  - 更新 `README.md` 与 `README_zh.md` 中的安装使用示例：
    ```bash
    npm install @k0maru/terra-ui
    ```
    ```svelte
    <script>
      import { TerraPanel, TerraButton } from '@k0maru/terra-ui'
      import '@k0maru/terra-ui/css'
    </script>
    ```
- **验收标准 (DoD)**：
  - 运行 `npm pack --dry-run` 校验打包 Tarball，输出整洁，无任何冗余垃圾文件；
  - `README.md` 与 `README_zh.md` 双语同步更新。

---

### 🎫 TICKET-04: 全链路质量门禁、脱敏自检与 Bot PR 归档
- **内容**：
  - 运行 `npm run check`（0 errors, 0 warnings）；
  - 运行 `npm run build`（验证 SPA 展示台与 GitHub Pages 构建不受任何影响，耗时 < 700ms）；
  - 运行 `npm run package`（验证库产物与样式完整编译）；
  - 运行脱敏自检：`git grep -inE "(foxmail|qq\.com|/Users/)"`；
  - 遵循规约提交特性分支并推送到 GitHub 远端；
  - 使用 `gh pr create` 发起 `[AI-Agent]` PR 至 `dev`；
  - 使用 `gh pr merge --merge` 闭环合入 `dev`；
  - 同步 PR 合入 `main`，触发 GitHub Pages 自动化更新。
- **验收标准 (DoD)**：
  - 全套验证通过，PR 成功合入并清理分支。
