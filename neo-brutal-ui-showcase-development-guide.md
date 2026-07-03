# Neo-Brutal UI Showcase 网站开发指南

> **用途**：指导开发一个用于展示 Neo-Brutal UI 组件库的首版网站。  
> **当前阶段定位**：Showcase / Preview Site，而不是完整文档站。  
> **核心目标**：让用户快速理解组件库的视觉风格、当前开发进度、哪些组件已经可用，以及如何安装。  
> **建议技术栈**：Astro + TypeScript + 组件库自身 CSS。  
> **后续演进方向**：组件文档站、Playground、Token 编辑器、版本化文档。

---

# 1. 项目目标

首版网站需要让用户在 30 秒内回答以下问题：

1. 这是什么组件库？
2. 它的视觉风格是什么？
3. 它适合什么项目？
4. 哪些组件已经可以使用？
5. 哪些组件仍在开发？
6. 如何安装？
7. 去哪里查看源码或项目进度？

首版不追求完整 API 文档，也不追求在线编辑器或复杂交互。

---

# 2. 产品定位

网站名称暂定：

```text
Neo-Brutal UI Showcase
```

网站定位：

> 一个展示 Neo-Brutal UI 组件库视觉效果和开发进度的预览站。

展示站不是完整文档站，因此首版应优先保证：

- 视觉冲击力。
- 信息清晰。
- 组件状态真实。
- 页面加载快速。
- 移动端可用。
- 易于后续扩展。

---

# 3. 非目标

首版不需要实现：

- 完整组件 API 文档。
- 在线代码编辑器。
- 在线 Token 编辑器。
- 多框架代码示例。
- 文档全文搜索。
- 版本切换。
- 用户账号。
- 收藏组件。
- 在线主题生成器。
- 复杂 Playground。
- 自动生成完整组件文档。
- 组件依赖关系可视化。

这些功能可以在组件库 API 稳定后逐步增加。

---

# 4. 技术方案

## 4.1 推荐技术栈

```text
Astro
TypeScript
Neo-Brutal UI 自身 CSS
少量原生 JavaScript
```

选择 Astro 的原因：

- 首屏静态输出，加载速度快。
- 适合内容型网站。
- 后续可以平滑扩展 MDX 文档。
- 不需要为简单筛选功能引入完整客户端框架。
- 可部署到 GitHub Pages、Vercel 或 Cloudflare Pages。
- 可以让展示站直接使用组件库自身 CSS。

## 4.2 不建议首版采用

- 重型 React SPA。
- 复杂状态管理。
- 全量 Storybook 作为正式用户入口。
- 单独引入另一个 UI 框架。
- 在展示站中复制一套与组件库不同的视觉系统。

展示站本身应尽量使用 Neo-Brutal UI 组件完成。

---

# 5. 建议项目结构

```text
apps/showcase/
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Section.astro
│   │   ├── showcase/
│   │   │   ├── Hero.astro
│   │   │   ├── StatusSummary.astro
│   │   │   ├── StatusBadge.astro
│   │   │   ├── FilterBar.astro
│   │   │   ├── ComponentCard.astro
│   │   │   ├── ComponentGallery.astro
│   │   │   ├── InstallBlock.astro
│   │   │   ├── DesignPrinciples.astro
│   │   │   └── RoadmapPreview.astro
│   │   └── demos/
│   │       ├── ButtonDemo.astro
│   │       ├── InputDemo.astro
│   │       ├── CardDemo.astro
│   │       └── ...
│   ├── data/
│   │   ├── components.ts
│   │   ├── statuses.ts
│   │   └── site.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── scripts/
│   │   ├── component-filter.ts
│   │   └── copy-install.ts
│   ├── styles/
│   │   ├── global.css
│   │   └── showcase.css
│   └── types/
│       └── component.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

# 6. 页面信息架构

首版建议只做一个首页。

```text
Header
Hero
Status Overview
Component Gallery
Design Principles
Install
Roadmap Preview
Footer
```

---

# 7. Header

## 7.1 内容

Header 包含：

- Logo 或文字标识。
- Components 锚点。
- Progress 锚点。
- Install 锚点。
- GitHub 链接。
- 当前版本状态 Badge，例如 `Alpha`。
- 可选主题切换按钮。

## 7.2 行为

- 桌面端水平导航。
- 移动端折叠为简化导航。
- Header 可以 sticky，但不是首版强制要求。
- 所有外部链接需要明确可识别。
- GitHub 图标按钮必须有 `aria-label`。

## 7.3 验收

- 320px 宽度下不溢出。
- 键盘可访问。
- Focus 状态清晰。
- 导航锚点正确。

---

# 8. Hero

## 8.1 目标

Hero 需要第一时间展示组件库的风格，而不是只依赖文案。

## 8.2 内容

建议包含：

```text
Neo-Brutal UI

A bold, accessible component library for Tailwind CSS v4.

Independent component API.
Hard borders.
Tactile interactions.
Theme-ready.
```

操作按钮：

- View Components。
- Install。
- GitHub。

安装命令：

```bash
npm install @scope/neo-brutal-ui
```

## 8.3 Hero 组件组合 Demo

建议在 Hero 右侧或下方放一个真实组件组合：

- Card。
- Badge。
- Input。
- Button。
- Toggle。
- Alert。

示例结构：

```html
<div class="nb-card">
  <div class="nb-card-header">
    <span class="nb-badge nb-badge-primary">Preview</span>
  </div>

  <div class="nb-card-body">
    <label class="nb-field">
      <span class="nb-field-label">Project name</span>
      <input class="nb-input" value="Neo-Brutal App" />
    </label>

    <label>
      <input class="nb-toggle" type="checkbox" checked />
      Enable bold mode
    </label>
  </div>

  <div class="nb-card-footer">
    <button class="nb-btn nb-btn-primary">Create project</button>
  </div>
</div>
```

## 8.4 要求

- 必须使用真实组件库 CSS。
- 禁止为 Hero 单独伪造一套组件样式。
- 未完成组件不能在 Hero 中伪装为 Ready。
- Demo 在移动端可正常收缩。

---

# 9. 组件状态系统

这是首版网站最重要的数据规则。

## 9.1 状态定义

统一使用以下五种状态：

### Ready

含义：

- 主要视觉完成。
- 主要变体完成。
- 基本可访问性完成。
- 移动端可用。
- API 暂时稳定。
- 可以建议用户试用。

### Beta

含义：

- 基础功能已经可用。
- 仍存在已知问题。
- API 可能发生小幅调整。
- 可以用于测试项目，但需谨慎用于生产。

### In Progress

含义：

- 已有部分实现。
- 视觉或交互仍未完成。
- 不建议用户使用。

### Planned

含义：

- 已进入路线图。
- 暂无可用实现。
- 展示站只显示信息，不显示伪造 Demo。

### Experimental

含义：

- 用于探索新的视觉或交互方案。
- API 可能随时变化。
- 不建议用于生产环境。

## 9.2 状态命名

代码中统一使用：

```ts
type ComponentStatus =
  | "ready"
  | "beta"
  | "in-progress"
  | "planned"
  | "experimental";
```

展示文案统一为：

```text
Ready
Beta
In Progress
Planned
Experimental
```

禁止混用：

```text
Done
Finished
Initial
Developing
Coming Soon
WIP
```

除非作为辅助说明，而不是主状态。

## 9.3 状态颜色

状态不能只依赖颜色表达，应同时包含文字。

建议视觉方向：

| 状态 | 视觉建议 |
|---|---|
| Ready | 高对比成功色 |
| Beta | 主色或强调色 |
| In Progress | 警告色 |
| Planned | 中性色 |
| Experimental | 次要强调色 |

## 9.4 状态升级规则

推荐流程：

```text
Planned
→ In Progress
→ Beta
→ Ready
```

Experimental 可以独立存在，也可以后续转入 Beta。

## 9.5 Ready 最低标准

组件标记为 Ready 前至少满足：

- [ ] 基础视觉完成。
- [ ] 主要变体完成。
- [ ] Focus 状态完成。
- [ ] Disabled 状态完成（适用时）。
- [ ] 移动端可用。
- [ ] RTL 无明显错误。
- [ ] 示例可以运行。
- [ ] 没有已知阻塞问题。
- [ ] API 不预计近期大改。

---

# 10. 组件数据模型

组件列表必须由数据生成，不要手工在页面重复写死。

## 10.1 类型定义

```ts
export type ComponentStatus =
  | "ready"
  | "beta"
  | "in-progress"
  | "planned"
  | "experimental";

export type ComponentCategory =
  | "actions"
  | "forms"
  | "data-display"
  | "feedback"
  | "navigation"
  | "overlay"
  | "layout";

export interface ShowcaseComponent {
  name: string;
  slug: string;
  category: ComponentCategory;
  status: ComponentStatus;
  description: string;
  available: boolean;
  featured?: boolean;
  demo?: string;
  notes?: string;
  knownIssues?: string[];
  tags?: string[];
}
```

## 10.2 数据示例

```ts
export const components: ShowcaseComponent[] = [
  {
    name: "Button",
    slug: "button",
    category: "actions",
    status: "ready",
    description: "Bold actions with tactile press feedback.",
    available: true,
    featured: true,
    demo: "ButtonDemo",
    tags: ["form", "action"],
  },
  {
    name: "Input",
    slug: "input",
    category: "forms",
    status: "beta",
    description: "Strong form fields with clear focus and validation states.",
    available: true,
    demo: "InputDemo",
    knownIssues: ["Browser autofill styling still needs refinement."],
  },
  {
    name: "Modal",
    slug: "modal",
    category: "overlay",
    status: "in-progress",
    description: "Dialog styling and accessible interaction primitives.",
    available: false,
    notes: "Visual styling is available. Focus management is still in progress.",
  },
  {
    name: "Toast",
    slug: "toast",
    category: "feedback",
    status: "planned",
    description: "Temporary feedback messages for application events.",
    available: false,
  },
];
```

## 10.3 数据规则

- `available: true` 只用于存在真实可用代码的组件。
- `status: planned` 时不得设置 `available: true`。
- 只有存在真实 Demo 时才能填写 `demo`。
- Known Issues 必须真实、简洁。
- 不要为了页面好看隐藏仍存在的已知问题。
- 首页统计必须从组件数据自动计算。

---

# 11. Status Overview

## 11.1 内容

展示组件数量：

```text
Ready
Beta
In Progress
Planned
Experimental
```

示例：

```text
8 Ready
4 Beta
3 In Progress
15 Planned
1 Experimental
```

## 11.2 数据来源

禁止手工写死数量。

应通过：

```ts
const counts = components.reduce(...)
```

自动计算。

## 11.3 交互

点击状态统计卡片后，可直接筛选组件列表。

## 11.4 验收

- 统计与组件数据一致。
- 状态为 0 时仍能正常展示。
- 移动端自动换行。
- 每个状态有文字，不只显示颜色。

---

# 12. 组件展示区

## 12.1 组件卡片内容

每张组件卡片包含：

- 组件名称。
- 状态 Badge。
- 分类。
- 一句说明。
- 真实 Demo 或开发状态说明。
- 可选 Known Issues。
- 可选 View Source / View Details 链接。

## 12.2 Ready / Beta 卡片

可以显示真实 Demo。

示例：

```text
Button                         Ready

Bold actions with tactile press feedback.

[ Primary ] [ Outline ] [ Disabled ]
```

## 12.3 In Progress 卡片

只展示当前真实完成部分。

示例：

```text
Modal                    In Progress

Visual styling is ready.
Focus management and keyboard behavior are still under development.
```

如果视觉实现已存在，可以展示静态预览，但必须明确：

```text
Preview only
Not ready for production
```

## 12.4 Planned 卡片

不展示伪造组件。

建议显示：

- 简单占位图。
- 组件名称。
- 规划说明。
- Planned Badge。

## 12.5 卡片视觉

- 卡片使用 Neo-Brutal UI 自身 Card。
- 状态 Badge 使用真实 Badge 组件。
- Demo 区域使用统一最小高度，减少页面跳动。
- 卡片高度不要求完全一致，但视觉应整齐。
- 不要把所有 Demo 都强制居中。
- 表单类 Demo 应保持真实使用方式。

---

# 13. 组件筛选

## 13.1 状态筛选

提供：

```text
All
Ready
Beta
In Progress
Planned
Experimental
```

## 13.2 分类筛选

建议：

```text
All Categories
Actions
Forms
Data Display
Feedback
Navigation
Overlay
Layout
```

## 13.3 第一版交互范围

首版只需：

- 单状态筛选。
- 单分类筛选。
- 状态与分类组合筛选。
- 显示匹配数量。
- 无结果提示。

暂不需要：

- 全文搜索。
- 多标签组合。
- URL Query 同步。
- 排序系统。
- 用户保存筛选条件。

## 13.4 实现方式

使用少量原生 TypeScript。

推荐：

```html
<article
  data-component-card
  data-status="ready"
  data-category="forms"
>
</article>
```

筛选后使用 `hidden` 属性控制显示：

```ts
card.hidden = !matches;
```

## 13.5 可访问性

- Filter Button 使用原生 `<button>`。
- 当前筛选使用 `aria-pressed="true"`。
- 筛选结果数量通过可见文本更新。
- 不需要使用复杂 ARIA live，除非用户测试发现有必要。
- 无结果时显示明确说明。

---

# 14. Design Principles

用四到六张简洁卡片展示组件库原则。

建议内容：

## Hard Borders

```text
Strong outlines make structure and interaction states immediately visible.
```

## Tactile Shadows

```text
Hard shadows and press states create a physical, responsive feeling.
```

## Accessible States

```text
Focus, disabled, validation, and selected states remain clearly distinguishable.
```

## Tailwind CSS v4

```text
Built for modern Tailwind projects without legacy v3 compatibility.
```

## Theme Ready

```text
Scoped data-theme tokens allow multiple visual themes on one page.
```

## Zero-JS Core

```text
Core visual components work without JavaScript. Complex interactions are optional.
```

---

# 15. Install 区域

## 15.1 内容

展示：

```bash
npm install @scope/neo-brutal-ui
```

CSS 导入：

```css
@import "@scope/neo-brutal-ui";
```

交互包导入：

```ts
import { createDialog } from "@scope/neo-brutal-ui/interactions";
```

## 15.2 当前包名未确定时

如果正式 npm 包名未确定，必须使用明显占位符：

```bash
npm install @your-scope/neo-brutal-ui
```

并显示：

```text
Package name is provisional.
```

禁止展示一个尚未注册但看起来已可安装的真实包名。

## 15.3 复制按钮

- 使用 Clipboard API。
- 成功后显示 `Copied`。
- 失败时允许用户手动选择。
- 图标按钮有 accessible name。
- 状态在短时间后恢复。

---

# 16. Roadmap Preview

首版只展示简短路线图。

推荐分组：

## Available Now

自动列出 Ready 和 Beta。

## Building Next

自动列出 In Progress。

## Planned

只展示部分 Planned 组件，并提供总数。

不要在首页铺满全部长期路线图。

示例：

```text
Available Now
Button, Card, Input, Badge

Building Next
Modal, Tabs, Dropdown

Planned
Toast, Drawer, Accordion, Progress and 12 more
```

数据仍然来自 `components.ts`。

---

# 17. Footer

包含：

- 项目名称。
- 当前版本，例如 `v0.1.0-alpha`。
- GitHub。
- npm。
- License。
- Build status 或 Last updated（可选）。

如果 npm 尚未发布，不显示无效 npm 链接。

---

# 18. 主题能力

## 18.1 首版范围

至少支持：

```html
<body data-theme="neo-brutal">
```

可选增加：

- Theme Toggle。
- `neo-brutal-dark` 占位预览。

## 18.2 多主题展示

为了体现库支持嵌套主题，可以在展示页加入一个简单区域：

```html
<section data-theme="neo-brutal">
  ...
  <div data-theme="future-theme">
    ...
  </div>
</section>
```

如果第二个主题尚未完成，不要为了演示而制作临时假主题。

首版可以只在代码结构中预留主题切换能力。

---

# 19. 响应式设计

## 19.1 断点目标

至少测试：

```text
320px
390px
768px
1024px
1440px
```

## 19.2 移动端规则

- Header 不应横向溢出。
- Hero 改为单列。
- 安装命令可横向滚动。
- 状态统计卡片自动换行。
- Filter Bar 可以横向滚动或换行。
- Component Gallery 使用单列。
- Demo 不应超出卡片。
- Table Demo 使用横向滚动容器。
- Modal Demo 不应真的阻塞整个首页浏览。

## 19.3 桌面端规则

- Hero 可使用双列。
- Component Gallery 建议 2–3 列。
- 最大内容宽度保持一致。
- 页面不要无限拉宽。

---

# 20. 可访问性

首版也必须满足基本可访问性。

- [ ] 所有 Button 使用原生按钮。
- [ ] 所有 Link 使用原生链接。
- [ ] Focus Visible 清晰。
- [ ] 页面层级只有一个 `<h1>`。
- [ ] Section 标题顺序合理。
- [ ] 状态不只依赖颜色。
- [ ] 图标按钮有 `aria-label`。
- [ ] 安装代码区域可键盘访问。
- [ ] 筛选按钮使用 `aria-pressed`。
- [ ] Hidden Card 使用 `hidden`，避免屏幕阅读器继续读取。
- [ ] Hero Demo 中的表单有 Label。
- [ ] 动画遵守 `prefers-reduced-motion`。
- [ ] 200% 缩放后页面可用。
- [ ] 颜色对比度满足基本要求。

---

# 21. 性能要求

首版页面应保持轻量。

- [ ] 静态页面优先。
- [ ] 不加载无必要的客户端框架。
- [ ] JavaScript 只用于筛选和复制。
- [ ] 图片使用现代格式。
- [ ] Hero 不使用大型背景视频。
- [ ] 避免大量 Web Font 字重。
- [ ] 字体加载失败时使用合理 fallback。
- [ ] 不为未展示组件加载大型 JavaScript。
- [ ] Lighthouse Performance 建议达到 90+。
- [ ] 避免 Layout Shift。

---

# 22. SEO 与分享

首版至少包含：

- [ ] Title。
- [ ] Meta Description。
- [ ] Canonical URL。
- [ ] Open Graph Title。
- [ ] Open Graph Description。
- [ ] Open Graph Image。
- [ ] Twitter Card。
- [ ] Favicon。
- [ ] 合理的 heading 结构。
- [ ] `lang` 属性。
- [ ] sitemap。
- [ ] robots.txt。

建议描述：

```text
Neo-Brutal UI is a bold, accessible component library built for Tailwind CSS v4.
Explore available components, current development status, and upcoming releases.
```

---

# 23. 数据真实性规则

展示站必须真实反映组件库状态。

- [ ] 不为了页面完整而伪造未开发组件。
- [ ] 不把静态截图标记为可用组件。
- [ ] 不把只有视觉样式的复杂组件标记为 Ready。
- [ ] Modal、Dropdown、Tabs 等必须在交互与可访问性达到标准后才能标记 Ready。
- [ ] Beta 必须列出关键已知限制。
- [ ] 每次组件状态变化时同步更新数据。
- [ ] 状态数据应进入 Code Review。
- [ ] 网站统计不得手工维护。

---

# 24. 开发步骤

## Milestone 1：基础页面

- [ ] 创建 Astro 项目。
- [ ] 配置 TypeScript。
- [ ] 引入组件库 CSS。
- [ ] 创建 BaseLayout。
- [ ] 创建 Header。
- [ ] 创建 Hero。
- [ ] 创建 Footer。
- [ ] 完成基本响应式布局。

## Milestone 2：组件状态数据

- [ ] 创建组件类型。
- [ ] 创建状态类型。
- [ ] 创建 `components.ts`。
- [ ] 添加首批组件状态。
- [ ] 自动计算状态数量。
- [ ] 创建 StatusBadge。
- [ ] 创建 StatusSummary。

## Milestone 3：组件 Gallery

- [ ] 创建 ComponentCard。
- [ ] 创建真实 Demo 组件。
- [ ] Ready / Beta 显示真实 Demo。
- [ ] In Progress 显示真实完成部分。
- [ ] Planned 显示规划占位。
- [ ] 创建响应式 Gallery。

## Milestone 4：筛选和复制

- [ ] 状态筛选。
- [ ] 分类筛选。
- [ ] 匹配数量。
- [ ] 无结果状态。
- [ ] 安装命令复制。
- [ ] 键盘和 Focus 测试。

## Milestone 5：完善与部署

- [ ] Design Principles。
- [ ] Install。
- [ ] Roadmap Preview。
- [ ] SEO。
- [ ] OG Image。
- [ ] Lighthouse。
- [ ] 可访问性检查。
- [ ] 移动端检查。
- [ ] 部署。
- [ ] 配置自定义域名（如需要）。

---

# 25. 第一批展示组件建议

优先展示：

## Ready 或 Beta 候选

- Button。
- Card。
- Input。
- Textarea。
- Select。
- Checkbox。
- Radio。
- Toggle。
- Badge。
- Alert。
- Divider。
- Loading。
- Skeleton。

## In Progress 候选

- Tabs。
- Dropdown。
- Modal。
- Tooltip。
- Table。
- Navbar。

## Planned 候选

- Drawer。
- Toast。
- Accordion。
- Progress。
- Avatar。
- Stat。
- Steps。
- Breadcrumbs。
- Pagination。
- Hero。
- Timeline。
- Rating。
- Chat。
- Kbd。

实际状态必须根据真实代码调整，不能直接照抄以上分类。

---

# 26. 首版页面验收标准

## 用户理解

- [ ] 用户 30 秒内能理解项目定位。
- [ ] 用户能分辨哪些组件可用。
- [ ] 用户能看出哪些组件还在开发。
- [ ] 用户能找到安装命令。
- [ ] 用户能进入 GitHub。

## 视觉

- [ ] 页面明显体现新粗野风格。
- [ ] 展示页主要使用组件库自身组件。
- [ ] 没有与组件库风格冲突的第三方 UI。
- [ ] Hero 有真实组件组合。
- [ ] 状态 Badge 视觉统一。

## 功能

- [ ] 状态统计自动生成。
- [ ] 状态筛选有效。
- [ ] 分类筛选有效。
- [ ] 复制安装命令有效。
- [ ] 无 JavaScript 时核心内容仍可阅读。

## 响应式

- [ ] 320px 可用。
- [ ] 390px 可用。
- [ ] 平板可用。
- [ ] 桌面可用。
- [ ] 不出现意外横向滚动。

## 可访问性

- [ ] 键盘可操作。
- [ ] Focus Visible 清晰。
- [ ] 状态不只通过颜色表达。
- [ ] 页面标题结构合理。
- [ ] reduced-motion 生效。
- [ ] axe 无 Critical 问题。

## 性能

- [ ] 首屏静态输出。
- [ ] 没有无必要的大型 JavaScript。
- [ ] Lighthouse Performance 目标 90+。
- [ ] 无明显 CLS。

---

# 27. 后续演进路线

当组件库逐渐稳定后，可以按顺序升级：

## Phase 2：组件详情页

```text
/components/button
/components/input
/components/modal
```

增加：

- 完整变体。
- 类名列表。
- HTML 示例。
- Accessibility。
- Known Issues。

## Phase 3：在线 Playground

增加：

- 状态切换。
- 尺寸切换。
- 主题切换。
- RTL。
- 代码复制。
- Token 修改。

## Phase 4：完整文档站

增加：

- 搜索。
- 版本切换。
- API 文档。
- 迁移指南。
- 多框架示例。
- Changelog。

## Phase 5：主题生成器

增加：

- 主色输入。
- OKLCH 调整。
- 实时预览。
- Theme CSS 导出。

---

# 28. Codex 执行要求

将本文件交给 Codex 开发时，应同时强调：

1. 不要引入其他 UI 框架。
2. 页面优先使用 Neo-Brutal UI 自身组件。
3. 不要硬编码状态统计。
4. 不要伪造未完成组件 Demo。
5. 不要擅自改变组件公共类名。
6. 不要把复杂功能提前塞进首版。
7. 保持 TypeScript strict。
8. 所有可复用数据放入独立数据文件。
9. 所有交互优先使用原生 HTML 和少量原生 JavaScript。
10. 完成后运行构建、类型检查和基本可访问性检查。

---

# 29. Definition of Done

首版 Showcase 网站只有满足以下条件才算完成：

- [ ] 页面可构建。
- [ ] 页面可部署。
- [ ] Hero 使用真实组件。
- [ ] 组件状态由数据驱动。
- [ ] 状态统计自动计算。
- [ ] 筛选可用。
- [ ] 安装命令可复制。
- [ ] Ready / Beta / In Progress / Planned 清晰区分。
- [ ] 没有伪造的可用状态。
- [ ] 移动端可用。
- [ ] 键盘可操作。
- [ ] Reduced Motion 生效。
- [ ] SEO 基础信息完成。
- [ ] Lighthouse 基础检查通过。
- [ ] GitHub 和安装入口清晰。
- [ ] 后续可扩展为完整文档站。

---

*文档版本：v1.0*  
*最后更新：2026-07-03*  
*适用项目：Neo-Brutal UI Showcase*
