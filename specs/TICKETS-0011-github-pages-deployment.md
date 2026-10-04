# TICKETS-0011 // GitHub Pages 自动化公开预览部署工单

## 📋 工单概览

- 关联规格：[SPEC-0011](./SPEC-0011-github-pages-deployment.md)
- 目标分支：`feat/github-pages-deployment` -> 合并到 `dev` -> 合并到 `main`

---

### 🎫 TICKET-01: 适配 Vite 静态子路径 (`vite.config.ts`)
- **目标文件**：
  - `vite.config.ts`
- **实现要求**：
  1. 在 `defineConfig` 中添加 `base: './'`；
  2. 验证执行 `npm run build` 后，`dist/index.html` 中引用的 CSS 与 JS 均为相对路径 `./assets/...`。
- **验收标准 (DoD)**：
  - 本地与子路径下打开无 404 资源错误。

---

### 🎫 TICKET-02: 创建 GitHub Pages 部署工作流 (`.github/workflows/deploy.yml`)
- **目标文件**：
  - `.github/workflows/deploy.yml` (新创建)
- **实现要求**：
  1. 监听 `push` 到 `main` 与 `dev` 分支，以及 `workflow_dispatch`；
  2. 配置 `pages: write`, `id-token: write` 权限；
  3. 执行 `actions/checkout@v4`, `actions/setup-node@v4`, `npm ci`, `npm run build`；
  4. 使用 `actions/upload-pages-artifact@v3`（`path: './dist'`）与 `actions/deploy-pages@v4` 进行部署。
- **验收标准 (DoD)**：
  - 工作流 YAML 语法无误，步骤规范。

---

### 🎫 TICKET-03: 更新文档提供公开演示徽章 (`README.md`, `README_zh.md`)
- **目标文件**：
  - `README.md`
  - `README_zh.md`
- **实现要求**：
  1. 在标题下方添加 Live Demo 徽章与超链接：
     - `[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-00f076?style=flat&logo=githubpages&logoColor=white)](https://k0maru.github.io/terra-ui/)`
     - 显式文本链接：`🔗 Live Demo: https://k0maru.github.io/terra-ui/`
- **验收标准 (DoD)**：
  - 中英文两版文档均完成同步更新。

---

### 🎫 TICKET-04: 构建验证、规范提交、Bot PR 合并与同步至 `main`
- **目标**：
  1. 执行 `npm run build` 确保产物生成成功，耗时 < 400ms。
  2. 读取 `git config --get agent.coauthor`，以标准 Bot 规范提交代码至 `feat/github-pages-deployment`。
  3. 推送到远程分支，通过 `gh pr create` 发起包含 `[AI-Agent]` 标识的 PR 并合并到 `dev`。
  4. 将 `dev` 分支合并至 `main` 并推送到远程，立即触发 GitHub Actions 部署！
- **验收标准 (DoD)**：
  - 成功触发线上部署流程，最终可通过 `https://k0maru.github.io/terra-ui/` 访问。
