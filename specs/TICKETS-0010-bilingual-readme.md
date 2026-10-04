# TICKETS-0010 // 双语 README 文档落地工单

## 📋 工单概览

- 关联规格：[SPEC-0010](./SPEC-0010-bilingual-readme.md)
- 目标分支：`feat/bilingual-readme` -> 合并到 `dev`

---

### 🎫 TICKET-01: 编写默认英文版 `README.md`
- **目标文件**：
  - `README.md`
- **实现要求**：
  1. 采用全英文规范撰写，作为仓库默认呈现文档；
  2. 头部提供双语导航：`[English](README.md) | [简体中文](README_zh.md)`；
  3. 显要位置包含 `## 📜 Disclaimer & Inspiration Attribution`，明确提及上海鹰角网络（HYPERGRYPH）、《明日方舟》（Arknights）与《明日方舟：终末地》（Arknights: Endfield）；
  4. 完整列出 5 个参考源（Hypergryph, Arknights, Endfield, Bilibili @设计师深海, Atlos）；
  5. 涵盖完整的双轴机能设计哲学、性能指标、组件矩阵、快速上手与使用示例代码；
  6. 严格检查：杜绝个人邮箱、本地机器绝对路径及私人姓名。
- **验收标准 (DoD)**：
  - 英文地道专业，排版遵循 GitHub Flavored Markdown。

---

### 🎫 TICKET-02: 编写简体中文版 `README_zh.md`
- **目标文件**：
  - `README_zh.md`
- **实现要求**：
  1. 结构与内容与英文版保持 100% 对齐；
  2. 头部提供双语导航：`[English](README.md) | [简体中文](README_zh.md)`；
  3. 包含完整的免责声明、组件清单与技术规格；
  4. 确保所有外链与交叉文档链接有效。
- **验收标准 (DoD)**：
  - 中文术语规范严肃，排版整洁。

---

### 🎫 TICKET-03: 隐私扫描、规范提交与 Bot PR 合并
- **目标**：
  1. 执行 `git grep -inE "(foxmail|qq\.com|/Users/)" README.md README_zh.md` 确保 0 隐私暴露。
  2. 读取 `git config --get agent.coauthor`，以标准 Bot 规范提交代码至 `feat/bilingual-readme`。
  3. 推送到远程分支，通过 `gh pr create` 发起包含 `[AI-Agent]` 标识的 PR 并合并到 `dev`。
- **验收标准 (DoD)**：
  - 成功合并 PR 到 `dev` 分支，本地及远端同步。
