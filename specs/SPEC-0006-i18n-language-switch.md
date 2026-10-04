# SPEC-0006 // 国际化多语言切换系统 (Zero-Overhead i18n System)

## 📌 1. 背景与目标

用户明确提出：
> “做语言切换，默认英文，支持中文，这样介绍界面就不用中英混杂了”

在之前的展示页面中，部分标题、徽章、说明文字和辅助注释中英夹杂（例如“// 明日方舟 IP 泰拉全域机能设计系统 // 2D 平面战术与 3D 空间拓扑”、“CHAMFER // 斜切角”、“GPU 硬件合成层”等），削弱了专业感与纯粹性。

### 核心目标：
1. **默认英文 (Default: `en`)**：初次加载默认使用纯正的近未来硬核科技/机能战术英文（无任何中文侵入），确保国际化高水准质感。
2. **支持中文 (Support: `zh`)**：一键切换为精炼、纯粹的未来科幻战术中文术语（避免生硬机器翻译，杜绝中英乱炖）。
3. **极简零额外依赖 (Zero-Dependency & Zero-VDOM)**：
   - 不引入庞大的第三方 i18n 运行时；
   - 基于 Svelte 5 原生响应式状态（`$state` / `$derived`）与 TypeScript 类型推导，编译时强类型约束，运行耗时 0ms。
4. **持久化与响应式**：
   - 导航栏设置高辨识度战术语言切换按钮（`[EN | 中文]`）；
   - 支持 `localStorage` 本地状态记忆（若已设置则恢复，无设置则默认 `en`）。

---

## 🏗️ 2. 架构设计与词典结构

### 2.1 目录组织
在 `src/i18n/` 下建立模块：
```
src/i18n/
├── index.ts        // 导出 i18n 单例状态、切换函数与字典
└── dict.ts         // en / zh 强类型词条定义
```

### 2.2 词典结构示例
```typescript
export type Locale = 'en' | 'zh'

export const dictionaries = {
  en: {
    nav: {
      brandTitle: 'TERRA // TACTICAL DESIGN SYSTEM',
      brandSubtitle: 'DUAL-AXIS FUNCTIONAL SYSTEM: 2D FLAT GRAPHIC & 3D SPATIAL INTERACTION',
      sec01: '01 // 2D TACTICAL',
      sec02: '02 // 3D SPATIAL',
      sec03: '03 // MATRIX & LAB',
      replayBoot: 'REPLAY BOOT',
      dark: '🌙 DARK',
      light: '☀️ LIGHT',
      fps: 'FPS',
      nominal: 'NOMINAL',
      themes: {
        cyan: 'BLUEPRINT',
        amber: 'HAZARD',
        emerald: 'BIO-CYBER'
      }
    },
    // ... sec01, sec02, sec03, footer, boot, profile
  },
  zh: {
    nav: {
      brandTitle: 'TERRA // 泰拉全域机能设计系统',
      brandSubtitle: '双轴机能系统：2D 平面战术排版与 3D 空间交互拓扑',
      sec01: '01 // 2D 平面战术',
      sec02: '02 // 3D 空间交互',
      sec03: '03 // 组件矩阵与实验室',
      replayBoot: '重放引导',
      dark: '🌙 暗色',
      light: '☀️ 亮色',
      fps: '帧率',
      nominal: '正常',
      themes: {
        cyan: '战术蓝图',
        amber: '工业高压',
        emerald: '生化遥测'
      }
    },
    // ...
  }
}
```

---

## 🎨 3. 界面交互与细节规范

1. **导航栏控制器**：
   - 增加战术切角语言切换按键：
     - 未选中项呈暗色高透，激活项呈当前主题高亮色；
     - 切换时触发轻微战术过渡动效。
2. **Section 01 (2D Flat Tactical System)**：
   - 彻底区分英文与中文词条：
     - `en`: "SYSTEM RESOURCE ALLOCATION", "VANGUARD OPERATIONAL SPEC", "SECURITY CLEARANCE & PROTOCOLS", "EXECUTE COMMAND", "OVERRIDE LINK"
     - `zh`: "系统资源配置矩阵", "先锋战术单元规格", "安全权限与协议代码", "执行指令", "链接覆写"
3. **Section 02 (3D Spatial & Industrial Complex)**：
   - 3D 空间物理卡片悬浮引导：
     - `en`: "HOVER MOUSE OVER CARDS TO EXPERIENCE MULTI-AXIS 3D PERSPECTIVE TILT AND PARALLAX Z-DEPTH"
     - `zh`: "鼠标滑过卡片可体验多轴 3D 透视倾斜与多层 Z 轴空间视差"
   - 环形图与能量母线：
     - `en`: "MAIN GRID LOAD", "TACTICAL BUFFER CELL", "CORE TELEMETRY BUS"
     - `zh`: "主电网工业负荷", "战术缓冲蓄能阵列", "核心遥测总线"
4. **Section 03 (Universal Matrix & Parametric Lab)**：
   - `en`: "PRECISION VERTICAL CONTROLS", "CHAMFER CUT", "VIEWPORT ZOOM", "2D FLAT PRIMITIVES", "3D SPATIAL PRIMITIVES"
   - `zh`: "精密垂直标尺控制台", "斜切角尺寸", "视口缩放", "2D 平面原子组件", "3D 空间原子组件"

---

## ⚡ 4. 验收指标 (DoD)
1. 默认进入页面为纯英文显示，无任何中文碎片。
2. 点击语言切换按钮后立即平滑切换为纯正战术中文，无中英混杂。
3. 刷新页面保持用户的语言选择（`localStorage` 记忆）。
4. 运行 `npm run check` 0 错误 0 警告，`npm run build` < 400ms。
