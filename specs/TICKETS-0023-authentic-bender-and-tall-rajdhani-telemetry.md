# TICKETS-0023: 本地内嵌正统 Bender 字体与高挺机能数字矩阵重构工单

## TICKET-01: 本地内置正统 Bender 字体文件与 `@font-face` 声明
- [x] 将 `Bender-Regular.woff` 与 `Bender-Bold.woff` 放置于 `src/lib/fonts/` 与 `public/fonts/`。
- [x] 在 `src/lib/styles/tokens.css` 顶部添加 `@font-face` 声明，指向 `../fonts/Bender-*.woff`。
- [x] 确保构建产物能正确提取并在相对路径正常加载。

## TICKET-02: 废黜 Chakra Petch，引入 Rajdhani 与 Barlow Condensed
- [x] 在 `index.html` 移除 `Chakra Petch`，加入 `Rajdhani:wght@500;600;700` 与 `Barlow Condensed:wght@600;700;800`。
- [x] 在 `tokens.css` 中重构三套主题的 `--terra-font-telemetry` 回退栈：
  `--terra-font-telemetry: 'Bender', 'Rajdhani', 'Barlow Condensed', 'Share Tech Mono', monospace;`

## TICKET-03: 数字排印微调与字距优化
- [x] 检查 `<TerraTelemetryBox>`、`<TerraVernierMeter>`、`<TerraRollingNumber>` 的数字样式，确保数字不再受到紧贴压缩约束，呈现高挺修长、机械切角的骨架。

## TICKET-04: 构建验证与双主干 PR 交付
- [x] 运行 `npm run check` 确保 0 errors, 0 warnings。
- [x] 运行 `npm run build` 确保字体资源正确哈希打包至 `dist/assets/`。
- [x] 运行 `npm run package` 确保 npm 包构建无误。
- [x] 提交并合入 `dev`，同步快进至 `main` 触发 GitHub Pages 自动部署。
