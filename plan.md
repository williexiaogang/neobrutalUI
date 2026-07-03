# Neo-Brutal UI 下一步构建计划

## 当前状态诊断

### 已完成
- 产品契约（阶段0）✅
- 项目架构与 ADR（阶段1大部分）✅
- 视觉规范文档（阶段2）✅
- support-policy.md 完整 ✅
- 单体 CSS index.css（948行，包含 tokens + base + 15+ 组件）

### 关键阻塞/不一致
1. **index.css 未模块化** — 所有内容在一个文件，packages/core/src/{tokens,base,components,utilities}/ 下只有 .gitkeep
2. **components.ts 数据问题** — Modal 重复条目（in-progress + planned），且 Modal CSS 已实现大半应标记为 beta
3. **阶段3 API 契约缺失** — 没有独立的类名/DOM契约文档
4. **todo 进度未更新** — 很多已完成项仍标记为 `[ ]`

---

## 执行阶段

### Stage 1 — 并行：CSS 架构重构 + API 契约 + 数据修复

**Worker A — CSS 架构重构**
- 将 index.css 拆分为 packages/core/src/ 下的模块：
  - `tokens/colors.css` — Primitive + Semantic color tokens
  - `tokens/spacing.css` — Space, typography tokens
  - `tokens/motion.css` — Duration, easing tokens
  - `tokens/shadows.css` — Shadow tokens
  - `tokens/z-index.css` — Z-index tokens
  - `base/reset.css` — Minimal reset, box-sizing, selection, focus-visible
  - `components/button.css` — Button component
  - `components/card.css` — Card component
  - `components/field.css` — Input, Textarea, Select, Field
  - `components/selector.css` — Checkbox, Radio, Toggle
  - `components/badge.css` — Badge
  - `components/alert.css` — Alert
  - `components/divider.css` — Divider
  - `components/loading.css` — Loading, Skeleton
  - `components/modal.css` — Modal
  - `utilities/sr-only.css` — Screen reader utility
  - `index.css` — 用 `@import` 聚合以上所有文件
- 保持所有现有样式不变，只做物理拆分

**Worker B — API 契约文档 + 命名词典**
- 创建 `docs/api-contract.md`：
  - 类名分类表（Component/Part/Variant/Color/Size/State/Layout/Placement）
  - 公共命名词典（统一 size: xs/sm/md/lg/xl, 统一颜色语义）
  - 每个 MVP 组件的 DOM Contract 草案
  - 状态矩阵（哪些组件支持哪些状态）
- 创建 `docs/components/api/` 下的各组件 API 草案

**Worker C — Showcase 数据修复 + Todo 更新**
- 修复 components.ts：
  - 删除重复的 planned Modal 条目
  - 将 Modal 状态从 in-progress 改为 beta（CSS 已实现大部分）
  - 更新 Modal 的 available 为 true
  - 更新 notes/knownIssues 以反映真实状态
- 更新 neo-brutal-ui-todo.md：
  - 将阶段1所有已完成项标记为 `[x]`
  - 将阶段2所有已完成项标记为 `[x]`
  - 标记阶段3中已确立的内容
  - 标记阶段4中已在 CSS 中实现的内容
  - 标记阶段5中已在 CSS 中实现的内容
  - 标记阶段6中已实现 CSS 的组件

### Stage 2 — 验证与集成

- 验证所有 `@import` 路径正确
- 验证 showcase 网站仍能正确引用 index.css
- 确认 components.ts 数据一致性
- 确认 todo 更新后的可读性

---

## 输出物清单

| 文件 | 责任人 | 说明 |
|------|--------|------|
| `packages/core/src/tokens/*.css` | Worker A | Token 层拆分 |
| `packages/core/src/base/reset.css` | Worker A | Base reset |
| `packages/core/src/components/*.css` | Worker A | 各组件独立文件 |
| `packages/core/src/utilities/*.css` | Worker A | 工具类 |
| `packages/core/src/index.css` | Worker A | 聚合入口 |
| `docs/api-contract.md` | Worker B | API 契约总纲 |
| `docs/components/api/*.md` | Worker B | 各组件 API 草案 |
| `apps/showcase/src/data/components.ts` | Worker C | 修复数据 |
| `neo-brutal-ui-todo.md` | Worker C | 更新进度 |
