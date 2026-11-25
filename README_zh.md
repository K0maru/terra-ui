# Terra-UI

基于 Svelte 5 的平面瑞士编辑部与动态字符 UI 组件库（`@k0maru/terra-ui`）。

- [在线展台与文档](https://k0maru.github.io/terra-ui/)
- [AI / Agent 规格索引（`llms.txt`）](public/llms.txt)
- 语言：[English](README.md) | [简体中文](README_zh.md)

---

## 设计与架构

- **平面编辑部 × 动态字符**：以 `1px` 结构细线、`36px` 开放点阵纸墨材质与实时 3D 字符化标本构建视觉秩序，剔除磨砂堆砌、廉价发光与厚重切角。
- **四套矿物颜料 × 深浅双模**：提供 `vermilion`（朱砂，默认）、`viridian`（铬绿）、`cyanotype`（普鲁士蓝）、`citron`（酸性柠）四套校色主题，支持 `dark`（炭墨）与 `light`（纸白）切换及 View Transitions 过渡。
- **物理弹簧动效与零空转功耗**：内置与帧率无关的 `stepSpring` 积分器、CSS `linear()` 弹簧曲线（`snappy` / `smooth` / `bouncy`）、数值类临界阻尼零过冲，以及离屏自动停帧休眠。
- **零 VDOM 运行时**：完全使用 Svelte 5 Runes（`$state`、`$derived`、`$props`）直接编译为细粒度 DOM 更新。

| 主题 ID | 色彩定位 | 主色调（深色 / 浅色） |
| :--- | :--- | :--- |
| `vermilion` | 建筑冷灰 × 朱砂（默认） | `#ee4b2b` / `#c9341b` |
| `viridian` | 矿石青灰 × 氧化铬绿 | `#3fd1a0` / `#186a52` |
| `cyanotype` | 制图冷银 × 普鲁士蓝 | `#5b86ff` / `#1b4dff` |
| `citron` | 纯炭墨 × 冷酸性柠 | `#d2ff28` / `#4d6600` |

---

## 导出组件清单（19 个组件）

| 分类 | 组件 | 核心特性 |
| :--- | :--- | :--- |
| **动态字符与空间** | `TerraAsciiStage`、`TerraAmbientField`、`TerraSpatialCard` | 16 桶色度 × 明度 3D 凤蝶字符场、`36px` 视口交互微场、弹簧阻尼 3D 倾角 |
| **可观测图表** | `TerraLineChart`、`TerraBarChart`、`TerraStatusStrip`、`TerraDonutChart`、`TerraActivityHeatmap`（别名 `TerraHeatmap`）、`TerraSparkline` | 容器级连续指针追踪（无间隙闪烁）、`Spring` 准星与宽高自适应形变 Tooltip、键盘巡检 |
| **精密控制与数字** | `TerraVernierMeter`、`TerraVerticalTabs`、`TerraRollingNumber` | 合成层卡尺滑块、随步距缩放的游标导轨、严格临界阻尼零过冲滚表 |
| **基础图元与档案** | `TerraButton`、`TerraPanel`、`TerraInput`、`TerraBadge`、`TerraStatusBeacon`、`TerraProfileCard`、`TerraBarcode` | 全域磁吸与同步 `clip-path` 反色擦除、`1px` 纯平容器、双语底线指令输入 |

完整组件 Props、CSS Token 命名与导出符号，请查阅 [`public/llms.txt`](public/llms.txt) 或 [`tokens.css`](src/lib/styles/tokens.css)。

---

## 快速开始

安装依赖包：

```bash
npm install @k0maru/terra-ui
```

在 Svelte 5 中引入样式与组件：

```svelte
<script lang="ts">
  import {
    TerraPanel,
    TerraButton,
    TerraStatusStrip,
    TerraVernierMeter,
    TerraRollingNumber
  } from '@k0maru/terra-ui'
  import '@k0maru/terra-ui/css'

  let load = $state(74)
</script>

<TerraPanel title="边缘路由 // NODE-01" tag="SLA // 60D">
  <div class="space-y-4">
    <div class="flex items-baseline justify-between">
      <TerraRollingNumber value={load} decimals={0} suffix="%" class="text-3xl" />
      <TerraButton variant="primary" magneticPull={true} onclick={() => (load = 88)}>
        标定负载
      </TerraButton>
    </div>

    <TerraVernierMeter bind:value={load} interactive={true} hazard={load >= 85} />
    <TerraStatusStrip serviceName="GLOBAL_EDGE_ROUTER" days={60} />
  </div>
</TerraPanel>
```

---

## 本地开发与 CI/CD

```bash
git clone https://github.com/K0maru/terra-ui.git
cd terra-ui
npm install
npm run dev
```

| 命令 / 工作流 | 触发条件 / 用途 | 适用范围 |
| :--- | :--- | :--- |
| `npm run lint && npm run check` | 运行 ESLint（零警告）、[`lint-taste.mjs`](scripts/lint-taste.mjs)、Prettier 与 `svelte-check` | 本地与 CI |
| `npm run build && npm run package` | 构建演示站点（`dist/`）与独立组件库产物（`dist-lib/`） | 本地与 CI |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | 自动校验 Lint、类型、站点构建与组件库打包 | PR 合入 `main` / `dev` |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | 全量校验通过后部署静态演示站与 `llms.txt` | 推送至 `main` / `dev` |
| [`.github/workflows/release.yml`](.github/workflows/release.yml) | 运行全量门禁、打包并发布 GitHub Release / Packages | 推送 `v*` 标签 |

---

## 开源协议与致敬

- **开源协议**：[MIT](LICENSE)
- **维护者**：[K0maru](https://github.com/K0maru)（`UID-93422639`）
- **干净重写与灵感声明**：本项目所有代码与图形均为独立开源实现，不含任何专有解包资源；早期视觉探索曾参考[鹰角网络](https://www.hypergryph.com/)作品《明日方舟》与《明日方舟：终末地》（相关商标归原作者所有）以及开源项目 [Terra-Online/Atlos](https://github.com/Terra-Online/Atlos)。
