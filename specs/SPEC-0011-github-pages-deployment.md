# SPEC-0011 // GitHub Pages 自动化公开预览部署规范 (GitHub Pages Automated Deployment)

## 📌 1. 背景与目标

用户确认采用**方案 A（GitHub Pages）**作为 `terra-ui` 的长期公开预览与演示方案：
> “方案A挺好的”

### 核心目标：
1. **公开预览 URL**：`https://k0maru.github.io/terra-ui/`
2. **全自动 CI/CD 交付**：
   - 创建 `.github/workflows/deploy.yml`；
   - 当代码推送到 `main` 或 `dev` 分支，或通过 `workflow_dispatch` 手动触发时，自动运行生产构建（`npm ci` -> `npm run build`）；
   - 使用官方标准 `actions/deploy-pages@v4` 发布至 GitHub Pages。
3. **资源相对路径适配 (`vite.config.ts`)**：
   - 配置 `base: './'`，确保静态资源在子路径 `/terra-ui/` 下及任意宿主环境下均可自适应寻址，消除 404 缺失问题。
4. **README 与展示文档更新**：
   - 在 `README.md` 与 `README_zh.md` 头部显要位置添加 Live Demo 徽章与直达链接。

---

## 🏗️ 2. 工作流定义 (`.github/workflows/deploy.yml`)

```yaml
name: Deploy Terra-UI to GitHub Pages

on:
  push:
    branches:
      - main
      - dev
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Production Assets
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## ⚡ 3. 验收标准 (DoD)
1. `vite.config.ts` 设置 `base: './'`，构建产物 `dist/index.html` 中的资源路径为相对路径 `./assets/...`。
2. GitHub Pages 已在仓库中开启（`build_type: workflow`）。
3. 工作流文件 `.github/workflows/deploy.yml` 语法与权限配置完全符合 GitHub Actions Pages 规范。
4. `README.md` 与 `README_zh.md` 包含直达公开预览链接。
5. `npm run check` 0 错误 0 警告，生产构建正常。
