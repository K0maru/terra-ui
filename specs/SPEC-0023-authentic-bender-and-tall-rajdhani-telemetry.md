# SPEC-0023: 本地内嵌正统 Bender 字体与高挺机能数字矩阵重构 (Authentic Bender & Tall Rajdhani Telemetry)

## 1. 背景与用户反馈诊断 (Context & Problem Diagnosis)
用户在实机预览后反馈：“我感觉我看到的这个字体和你说的不太一样啊，数字又瘪又矮”。

经深度排查字符解剖学（Glyph Anatomy）与排印回退机制，发现症结如下：
1. **Chakra Petch 的字符比例缺陷（又瘪又矮的元凶）**：
   - `Chakra Petch` 原初设计为泰文/拉丁两用展示字体，其拉丁数字（0-9）设计偏向正方形甚至扁平矩形（宽高比约为 0.85:1~0.9:1），x-height 低、横向笔画笨重、纵向无拉伸感；
   - 在高密遥测箱（`<TerraTelemetryBox>`）中渲染大数值（如 `94.2%`、`0.8ms`）时，数字呈现严重的“扁平矮方块”钝感，完全违背了明日方舟与终末地工业UI所追求的“高挺修长、紧凑、垂直张力极强（Tall, Slender, High Tension）”的机能美学。
2. **正统 Bender 商业开源字体未本地打包**：
   - 明日方舟与终末地官方原版使用的数字字体是 **`Bender`**（由 Jovanny Lemonad & Oleg Zhuravlev 操刀设计）；
   - 此前项目依赖系统预装或外部 CDN，但由于 Google Fonts 并无 Bender，导致降级到了矮瘪的 Chakra Petch。

## 2. 解决方案设计 (Solution Design)

### 2.1 本地直装内嵌正统 Bender 字体 (`@font-face`)
将 Jovanny Lemonad 官方开源发布的 `Bender-Regular.woff` 与 `Bender-Bold.woff`（各约 23KB）直接内置到项目 `src/lib/fonts/` 中：
```css
@font-face {
  font-family: 'Bender';
  src: url('../fonts/Bender-Regular.woff') format('woff');
  font-weight: 400 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Bender';
  src: url('../fonts/Bender-Bold.woff') format('woff');
  font-weight: 600 700 800;
  font-style: normal;
  font-display: swap;
}
```
- 通过 Vite 资源管线进行相对路径编译与哈希追踪，保证在 GitHub Pages（`/terra-ui/` 子路径）、本地开发、NPM 独立发包场景下均 100% 成功加载！
- 访客浏览器无需安装任何本地字体，直接加载官方原生 Bender！

### 2.2 彻底清退 Chakra Petch，引入高挺锐利 Rajdhani 与 Barlow Condensed
- 从 `index.html` 与 `tokens.css` 中彻底废黜扁平矮胖的 `Chakra Petch`；
- 在 Google Fonts 引入 **`Rajdhani:wght@500;600;700`** 与 **`Barlow Condensed:wght@600;700;800`**：
  - `Rajdhani`（Indian Type Foundry 研发）：专为硬核机能与 HUD 设计的方圆折角高挺字体，数字修长匀称、垂直张力极佳；
  - `Barlow Condensed` / `Oswald`：紧凑型 DIN 工业无衬线，字身狭长高耸。
- `--terra-font-telemetry` 顺序固化为：
  `'Bender', 'Rajdhani', 'Barlow Condensed', 'Share Tech Mono', monospace;`

## 3. 验收标准 (DoD)
1. 网络面板确认 `Bender-Bold.woff` 成功以 200/304 命中加载。
2. 页面中所有战术数字（遥测大字、时钟频率、游标卡尺读数）呈现正统 Bender 的高挺骨架与标志性 45° 倒角。
3. 彻底告别“又瘪又矮”的视觉钝感。
4. `npm run check` 与 `npm run build` 保持 0 errors, 0 warnings。
