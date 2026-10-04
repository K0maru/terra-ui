# SPEC-0007 // 专业中立语义重塑与真实开发者档案接入 (Professional Neutral Rebranding)

## 📌 1. 背景与核心诉求

用户明确指出：
> “中立专业就好，不要用一些中二词汇，记住这是用于展现组件库的demo。你要放人员卡，可以放我github的信息”

这一反馈直击痛点：
1. **去中二化 (De-Chuunibyou)**：`terra-ui` 是一个通用的高性能 Svelte 5 工业与未来科技设计系统，展示页面的本质是组件库的 **Demo 演示与 Kitchen Sink**，绝非角色扮演或军事游戏。必须彻底清理诸如“战术控制台”、“肃清腐蚀”、“战备状态”、“战区切换”等中二、战斗色彩浓厚的词汇，全面替换为**真实、中立、专业的软件工程、系统运维与工业数据可视化术语**。
2. **接入真实 GitHub 开发者档案**：
   - 移除虚拟编造的战斗人员卡片；
   - 真实呈现仓库作者/主创开发者的 GitHub 公开档案信息（`K0maru`），展示组件库在真实用户/团队成员信息展示场景下的排版与功能；
   - 提供真实可点击的 GitHub Profile 与 Repository 外链。

---

## 🏗️ 2. 真实开发者档案模型 (`K0maru`)

| 属性 | 实际数据 | UI 呈现 |
|---|---|---|
| **头像** | `https://avatars.githubusercontent.com/u/93422639?v=4` | 斜切角相框，带微缩十字瞄准与扫描线 |
| **用户名** | `K0maru` | 大号加粗等宽显示 |
| **角色 / 职能** | `Lead Maintainer // 核心主创 & 架构师` | 身份资质徽章 |
| **项目** | `terra-ui` | 关联开源项目标签 |
| **用户标识** | `UID: 93422639` | Code-128 工业条形码 |
| **开源统计** | `9 Public Repositories` | 统计数据标签 |
| **状态** | `Active // 在线维护` | 绿色状态灯标 |
| **外链按钮** | GitHub 个人主页与项目仓库 | 实体点击跳转 |

---

## 📝 3. 全局语义中立化对照映射 (Terminology Mapping)

### 3.1 导航与整体定位
- **原标题**：`TERRA // TACTICAL FUNCTIONAL DESIGN SYSTEM`
- **重构后**：**`TERRA UI // FUNCTIONAL DESIGN SYSTEM` (泰拉设计系统)**
- **副标题**：`A high-performance Svelte 5 component library for industrial telemetry, developer tools & cybernetic interfaces.` (基于 Svelte 5 的高性能工业遥测与系统控制台组件库)
- **色谱配置**：
  - `CYAN // BLUEPRINT` (工程蓝图青)
  - `AMBER // INDUSTRIAL` (工业工程黄)
  - `EMERALD // TELEMETRY` (系统遥测绿)

### 3.2 Section 01: 2D 平面界面与数据系统
- **原名称**：`2D FLAT TACTICAL SYSTEM` (战术控制台)
- **重构后**：**`01 // 2D FLAT INTERFACE & DATA SYSTEM` (2D 平面界面与数据系统)**
- **操作按钮体系**：
  - `EXECUTE COMMAND` -> **`SUBMIT QUERY` (提交查询)**
  - `OVERRIDE LINK` -> **`SYNC CLUSTER` (同步集群)**
  - `STANDBY` -> **`STANDBY` (待机就绪)**
  - `PURGE CORROSION` -> **`RESET BUFFER` (重置缓存)**
- **权限与状态标签**：
  - `[ADM] AUTHORIZED` (已授权)
  - `[SEC] VERIFIED` (已验证)
  - `[SYS] PRODUCTION` (生产环境)
  - `[API] V2_STABLE` (接口稳定)
- **数据图表**：
  - 柱状图：**`SYSTEM RESOURCE ALLOCATION` (系统计算与内存资源分配)**
  - 折线图：**`NETWORK TELEMETRY STREAM` (实时网络遥测吞吐量)**

### 3.3 Section 02: 3D 空间交互与遥测复合体
- **原名称**：`3D SPATIAL & INDUSTRIAL COMPLEX`
- **重构后**：**`02 // 3D SPATIAL & TELEMETRY COMPLEX` (3D 空间交互与遥测复合体)**
- **悬浮卡片内容**：
  - 卡片 1：**`GPU COMPOSITOR OBSERVABILITY` (GPU 合成层实时监视)**
  - 卡片 2：**`SPATIAL SENSOR TELEMETRY` (空间遥测与深度感知)**
  - 能量母线：**`MAIN POWER GRID LOAD` (主供电网络负荷)**
  - 环形图：**`STORAGE ALLOCATION RATIO` (存储资源配比分布)**

### 3.4 Section 03: 全量组件矩阵与参数实验室
- **集群切换（原战区切换）**：
  - `US-EAST-01` (北美节点)
  - `AP-EAST-02` (亚太枢纽)
  - `EU-CENTRAL-03` (欧洲集群)
- **参数控制**：
  - `CHAMFER RADIUS` (斜切角半径)
  - `VIEWPORT SCALE` (视口缩放比例)

---

## ⚡ 4. 验收标准 (DoD)
1. 全站无任何中二、战斗色彩词汇（无“战术”、“肃清”、“战备”、“腐蚀”等）。
2. 人员卡真实展示 GitHub 用户 `K0maru` 的信息与头像，外链可正常点击。
3. 中英双语词典同步更新，英文地道专业，中文规范凝练。
4. `npm run check` 0 错误 0 警告，`npm run build` < 400ms。
