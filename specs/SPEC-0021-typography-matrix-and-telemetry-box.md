# SPEC-0021: 跨媒介字体矩阵、增四度字阶与高集成战术遥测仪表箱 (v0.2.0)

## 📌 元数据 (Metadata)
- **ID**: SPEC-0021
- **标题**: 跨媒介字体矩阵、增四度字阶与高集成战术遥测仪表箱
- **状态**: Approved (用户已授权“去吧”)
- **作者**: Antigravity (AI-Agent)
- **版本**: v0.2.0-milestone
- **关联设计智库**: [[99_Attachments/Arknights UI Design System|《明日方舟》與《明日方舟：終末地》視覺設計系統工程深度分析報告]]
- **前序规范**: SPEC-0020 (Library Packaging & Multi-Target Distribution v0.1.0)

---

## 🎯 1. 目标与背景 (Context & Goals)

### 1.1 现状与痛点
- 在完成 v0.1.0 独立打包分发体系后，通过对深度研究报告《明日方舟与终末地视觉设计系统工程深度分析》的系统解构，发现了当前组件库的几个核心演进差距：
  1. **字体缺乏语义分工**：目前 `tokens.css` 仅配置了通用 sans/mono，缺乏报告中权威定义的 5 级跨媒介字体矩阵（Display, Tactical, Telemetry, Body, Code）；
  2. **字阶梯度依赖通用 Tailwind**：缺乏鹰角标志性的**增四度（1.414）大字阶数理断差**，导致宏观视觉冲击力与微观参数读数的反差感不足；
  3. **缺乏语义透明度降噪工具**：未建立 25%~35%（非交互代码/协议底纹）与 100%（交互核心/告警）的层级过虑机制；
  4. **缺乏高集成度复合仪表箱图元**：目前有单独的 `TerraSegmentBar` 与 `TerraSparkline`，但缺乏如报告中所示集成了出厂协议、十六进制状态、大字阶读数、游标卡尺与微条码的高密度战术仪表箱。

### 1.2 核心交付目标
1. **跨媒介 5 级字体矩阵与增四度字阶令牌**：
   - 在 `src/lib/styles/tokens.css` 中注入官方级字族回退序列与 `--terra-type-scale: 1.414` 模数梯度；
   - 提供实用工具类：`.font-display`、`.font-tactical`、`.font-telemetry`、`.font-code`、`.terra-text-dim`（25%~35% 极细字重降噪）与 `.terra-text-anchor`；
2. **游标微刻度尺指示器 (`<TerraVernierMeter.svelte>`)**：
   - 10 段式精密游标卡尺物理槽，带长短主副刻度线（长刻度 6px、副刻度 3px）与滑动指示针（Needle）；
   - 随数值动态点亮激活分段，超阈值自动告警分色；
   - 完整 WAI-ARIA `role="meter"` 支持；
3. **高集成度战术遥测仪表箱 (`<TerraTelemetryBox.svelte>`)**：
   - 顶部 Header：站点标识（`ALPHA-01`）、协议号（`PROT_AIC.09`）与实时十六进制代码（`0x4F2A`）；
   - 中部 Body：参数标题、大字阶数值读数与单位符号、内嵌 `<TerraVernierMeter>` 游标卡尺；
   - 底部 Footer：微型条形码矩阵与高危/正常状态文字；
   - 左侧战术导轨边框与 45° 几何切角；
4. **展示台与 GitBook 文档全量对齐**：
   - 在 `src/App.svelte` Section 02 实时演示；
   - 在 `src/docs/docsData.ts` 补充组件 API 文档与 Playground 试玩。

---

## 📐 2. 技术设计与组件规范 (Technical Design)

### 2.1 字体矩阵设计令牌与 CSS 变量
```css
:root {
  /* 5 级语义化字体矩阵 (Semantic Font Hierarchy) */
  --terra-font-display: 'Novecento Sans Wide', 'Druk Wide', 'Oswald', sans-serif;
  --terra-font-tactical: 'Oswald', 'DIN Condensed', 'Bebas Neue', sans-serif;
  --terra-font-telemetry: 'Bender', 'Share Tech Mono', 'Chakra Petch', monospace;
  --terra-font-body: 'DIN 1451', 'DIN Next', 'Source Han Sans SC', 'Noto Sans SC', 'Inter', sans-serif;
  --terra-font-code: 'JetBrains Mono', 'Fira Code', monospace;

  /* 增四度数理字阶比率 (Augmented Fourth: 1.414) */
  --terra-type-scale: 1.414;
}

/* 语义透明度降噪工具 */
.terra-text-dim {
  color: var(--terra-text-muted);
  opacity: 0.35;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.terra-text-anchor {
  color: var(--terra-text-primary);
  opacity: 1;
  font-weight: 700;
}
```

### 2.2 `<TerraVernierMeter.svelte>` API 设计
```svelte
<script lang="ts">
  interface Props {
    value: number; // 当前值
    min?: number; // 最小值，默认 0
    max?: number; // 最大值，默认 100
    ticks?: number; // 刻度数量，默认 10
    hazard?: boolean; // 是否处于告警状态
    class?: string;
  }
</script>
```

### 2.3 `<TerraTelemetryBox.svelte>` API 设计
```svelte
<script lang="ts">
  interface Props {
    stationId?: string; // 站点标识，如 "STATION-01"
    protocolTag?: string; // 协议标识，如 "AIC.09"
    label: string; // 读数指标名称，如 "POWER_OUTPUT_METRICS"
    value: number; // 当前数值
    min?: number; // 最小值，默认 0
    max?: number; // 最大值，默认 100
    unit?: string; // 单位符号，如 "%", "MW", "GHz"
    frequencyHz?: number; // 频率 (自动派生十六进制协议码)
    hazard?: boolean; // 手动指定是否告警
    hazardThreshold?: number; // 自动判定告警比例 (默认 0.85)
    showBarcode?: boolean; // 是否显示微型条码
    cut?: 'tr' | 'tl-br' | 'tr-bl' | 'none'; // 切角模式
    class?: string;
  }
</script>
```

---

## ⚡ 3. 验收标准与质量门禁 (DoD)

1. **零警告编译**：`npm run check` 0 errors, 0 warnings；
2. **打包产物健全**：`npm run package` 生成 `dist-lib/`，新组件与其 `.svelte.d.ts` 完整无缺；
3. **展示台与文档**：`npm run build` 耗时 < 650ms，主展示台与 GitBook 文档正常交互；
4. **脱敏合规**：0 个人邮箱与本地绝对路径泄露；
5. **Git 双主干交付**：通过 PR 闭环合入 `dev` 与 `main`。
