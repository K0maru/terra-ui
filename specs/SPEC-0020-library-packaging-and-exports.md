# SPEC-0020: Terra-UI 独立组件库打包与多目标分发体系 (v0.1.0)

## 📌 元数据 (Metadata)
- **ID**: SPEC-0020
- **标题**: Terra-UI 独立组件库打包与多目标分发体系
- **状态**: Approved (用户已授权“允许”)
- **作者**: Antigravity (AI-Agent)
- **版本**: v0.1.0-milestone
- **关联规范**: SPEC-0010 (Bilingual Readme), SPEC-0014 (Interactive Docs Portal), SPEC-0019 (Pure Minimal Chamfer Border)

---

## 🎯 1. 目标与背景 (Context & Goals)

### 1.1 现状与痛点
- `terra-ui` 经过 30+ 轮敏捷迭代，现已沉淀 **24+ 高性能 Svelte 5 原生机能组件**、完整主题令牌系统（3 战术色谱 × 2 明暗双模）、零外部依赖 i18n 字典以及原生内嵌 GitBook 交互式文档系统；
- 但目前根目录 `package.json` 被标记为 `"private": true`，且仅有 `vite build` 输出 SPA 演示站（部署于 GitHub Pages）；
- 外部业务项目（如 `okx-funding-arbitrage` 监控 WebUI、量化分析工具或社区外部应用）目前无法通过标准 `npm install @k0maru/terra-ui` 或本地 `npm link` / `pnpm` workspace 方式进行模块化消费。

### 1.2 核心目标 (Key Deliverables)
1. **构建双轨制架构 (Dual Output Architecture)**：
   - **App Track (展示台与文档)**：保持 `npm run build`，输出 SPA 静态站至 `dist/`，供 GitHub Pages 自动部署；
   - **Library Track (独立分发包)**：新增 `npm run package`，输出纯净的组件库产物至 `dist-lib/`（或 `package/`），支持 npm 发布与 monorepo/本地消费；
2. **规范化包命名与命名空间**：
   - NPM 公开包名定为 `@k0maru/terra-ui`（与 GitHub 仓库 `https://github.com/K0maru/terra-ui` 保持严格对应，规避已被占用的非作用域名称）；
   - 初始发布版本定为 `0.1.0`；
3. **原生 Svelte 5 细粒度分发 + 完整 TypeScript 类型 (.d.ts)**：
   - 引入 `@sveltejs/package`，输出保留 Svelte 5 原生 Runes 细粒度编译能力的 `.svelte` 源组件，并在编译期自动生成所有组件的 `.svelte.d.ts` 与主入口 `index.d.ts`；
4. **双形态样式分发 (Dual CSS Distribution)**：
   - **形态 A (编译产物)**：`dist-lib/terra-ui.css`，预编译包含全部 Tailwind 工具类、关键帧动画与 CSS 变量的独立样式表，外部项目 `@import "@k0maru/terra-ui/css"` 即可直接使用，无需配置 Tailwind；
   - **形态 B (原生令牌)**：`dist-lib/tokens.css`，仅包含 `:root` 与 `[data-theme]` 变量及动画，适合已有自身 Tailwind v4 配置的外部项目无缝混合；
5. **现代 `package.json` Exports 契约**：
   - 遵循 Svelte 官方标准导出规范，支持 `types`, `svelte`, `default` 以及 CSS 子路径；
6. **发布验证与本地打包自检 (Pre-pack Verification)**：
   - 配置 `npm run prepack` 与本地 `npm pack` 自检流程，验证解压包体积、文件完整度与引用自洽性。

---

## 📐 2. 技术设计与架构方案 (Technical Design)

### 2.1 目录组织重构 (Source Layout)
为了兼顾 SPA 展示台与纯净库导出的解耦，建立标准源码结构：
```
src/
├── lib/                     <-- 库导出根目录 (Library Input)
│   ├── index.ts             <-- 库对外统一主入口 (导出所有组件、类型与辅助函数)
│   ├── components/          <-- 24+ 全量机能组件
│   ├── styles/              <-- tokens.css 与样式资产
│   └── i18n/                <-- 零依赖响应式语言字典 (可选导出)
├── docs/                    <-- GitBook 交互式文档 (仅供 App Track)
├── App.svelte               <-- SPA 官网长卷展示台 (仅供 App Track)
└── main.ts                  <-- SPA 入口 (仅供 App Track)
```

### 2.2 构建脚本编排 (Scripts Workflow)
```json
{
  "name": "@k0maru/terra-ui",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "build:css": "tailwindcss -i src/lib/styles/tokens.css -o dist-lib/terra-ui.css --minify",
    "build:package": "svelte-package -i src/lib -o dist-lib",
    "package": "npm run build:package && npm run build:css",
    "prepack": "npm run package"
  }
}
```

### 2.3 `package.json` 导出契约定义
```json
{
  "name": "@k0maru/terra-ui",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist-lib/index.js",
  "module": "./dist-lib/index.js",
  "types": "./dist-lib/index.d.ts",
  "svelte": "./dist-lib/index.js",
  "exports": {
    ".": {
      "types": "./dist-lib/index.d.ts",
      "svelte": "./dist-lib/index.js",
      "default": "./dist-lib/index.js"
    },
    "./css": "./dist-lib/terra-ui.css",
    "./tokens.css": "./dist-lib/tokens.css",
    "./package.json": "./package.json"
  },
  "files": [
    "dist-lib",
    "README.md",
    "README_zh.md",
    "LICENSE"
  ],
  "peerDependencies": {
    "svelte": ">=5.0.0"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-svelte": "^0.475.0"
  }
}
```

---

## ⚡ 3. 验收标准与质量门禁 (DoD)

1. **打包产物健全性**：
   - 运行 `npm run package` 成功产出 `dist-lib/`；
   - 包含 `index.js`, `index.d.ts`，每个 `.svelte` 组件均对应生成 `.svelte.d.ts`；
   - 包含独立编译压缩的 `terra-ui.css`（体积合理，包含全部切角、阴影与动画）；
2. **SPA 展示台零回归**：
   - 运行 `npm run check` 零错误、零警告（Zero-warning）；
   - 运行 `npm run build` 成功产出 `dist/`，耗时 < 700ms，GitHub Pages 持续正常部署；
3. **本地打包校验 (npm pack)**：
   - 运行 `npm pack --dry-run` 验证打包文件清单（Tarball contents），确保无多余本地临时文件，必要文档（`README.md`, `LICENSE`）在列；
4. **分支与提交规范**：
   - 在 `feat/library-packaging-and-exports` 特性分支中落地；
   - 包含动态 Bot 身份署名；
   - 严格通过脱敏检查（0 违规私有邮箱与本地绝对路径）。
