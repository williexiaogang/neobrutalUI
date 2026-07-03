# ADR-004: CSS 核心零运行时依赖，复杂交互通过可选原生 JS 包提供

- 日期：2025-01-15
- 状态：accepted

---

## 背景（Context）

组件库通常分为两个层次：

1. **视觉层（CSS）**：提供颜色、布局、边框、阴影、排版等纯样式。理论上，仅导入 CSS 就可以让组件在视觉上正确渲染。
2. **交互层（JS）**：提供动态行为，如 Modal 的打开/关闭、Dropdown 的菜单展开、Tabs 的切换、Tooltip 的定位计算等。

在组件库设计中，一个常见的架构决策是：JS 是否是必需的？对于像按钮、卡片、徽章、输入框等简单组件，纯 CSS 即可完整表达其视觉状态（包括 hover、focus、disabled 等，均通过 CSS 伪类实现）。但对于 Modal、Dropdown、Toast、Carousel 等复杂组件，纯 CSS 难以实现全部交互逻辑（如点击外部关闭、键盘导航、焦点管理、动画过渡控制）。

本项目的核心设计原则之一是"最小侵入"——用户应能仅导入 CSS 就获得可用的组件，不应被强制引入任何 JavaScript 运行时。同时，对于需要 JS 的组件，交互逻辑应该：

- 不依赖特定前端框架（React、Vue、Svelte 等）。
- 可 Tree-shake，用户只引入需要的交互逻辑。
- 对无障碍（Accessibility）友好，自动处理键盘操作和 ARIA 属性。

## 决策（Decision）

**Neo-Brutal UI 采用"CSS 核心 + 可选原生 JS 交互"的架构模式**：

### 1. 核心 CSS 包（`@neo-brutal-ui/core`）零运行时依赖

- 所有组件的视觉样式和基础状态（hover、focus、active、disabled）完全由 CSS 实现。
- CSS 包不依赖任何 JavaScript 代码，也不依赖任何框架。
- 用户通过 `@import "@neo-brutal-ui/core";` 即可获得全部视觉组件。

### 2. 可选的交互 JS 包（`@neo-brutal-ui/interactions`）

- 为需要动态交互的组件提供原生 JavaScript 逻辑。
- 采用原生 DOM API（`querySelector`、`addEventListener`、`MutationObserver` 等），不依赖 React、Vue、Angular 等框架。
- 通过数据属性（`data-nb-*`）自动初始化，也支持手动 API 调用。
- 每个组件的交互逻辑独立导出，支持 Tree-shaking。
- 示例：
  ```js
  import { initDropdowns, initModals } from '@neo-brutal-ui/interactions';
  
  // 自动初始化页面上所有带有 data-nb-dropdown 的元素
  initDropdowns();
  
  // 手动初始化特定元素
  const modal = initModals('#my-modal');
  modal.open();
  ```

### 3. CSS 包与 JS 包之间无依赖关系

- CSS 包不知道 JS 包的存在。
- JS 包只依赖 DOM 结构和 CSS 类名（通过添加/移除类名或修改 `data-*` 属性来驱动样式变化），不依赖 CSS 包的具体实现细节。
- 这种解耦意味着：
  - 用户可以只使用 CSS 包（无需 JS）。
  - 用户可以只使用 JS 包（配合自己的 CSS，虽然这种情况少见）。
  - 用户可以两个包一起使用（标准用法）。

### 4. 组件分类：CSS-only vs JS-enhanced

| 组件 | 类型 | 说明 |
|------|------|------|
| Button | CSS-only | 所有状态由 CSS 伪类处理 |
| Card | CSS-only | 静态布局，无交互逻辑 |
| Badge | CSS-only | 纯视觉 |
| Input / Textarea | CSS-only | 聚焦状态由 `:focus` 处理 |
| Alert | CSS-only | 关闭按钮可通过 CSS 实现（`details/summary` 或 Checkbox Hack） |
| Modal | JS-enhanced | 需要 JS 控制显示/隐藏、焦点管理、ESC 关闭、滚动锁定 |
| Dropdown | JS-enhanced | 需要 JS 控制菜单展开/收起、键盘导航、点击外部关闭 |
| Tabs | JS-enhanced | 需要 JS 切换面板、更新 ARIA 属性 |
| Tooltip | JS-enhanced | 需要 JS 计算定位（虽然纯 CSS 可实现简单 Tooltip，但复杂定位需 JS） |
| Toast / Notification | JS-enhanced | 需要 JS 控制生命周期、堆叠、自动关闭 |
| Carousel | JS-enhanced | 需要 JS 控制滑动、自动播放、指示器 |

### 5. 对 CSS-only 组件的交互增强策略

对于 Alert（可关闭提示）这类组件，优先尝试纯 CSS 方案：

- **首选方案**：使用原生的 `<details>` / `<summary>` 元素实现可关闭，无 JS 依赖。
- **备选方案**：使用 Checkbox Hack（隐藏的 checkbox + `:checked` 伪类），无 JS 依赖。
- **降级方案**：如果以上方案在可访问性或灵活性上不满足需求，才引入 JS 逻辑。

## 替代方案（Alternatives）

### 替代方案 1：所有组件自带 JS（强制 JS 依赖）

- **描述**：即使像 Button、Card 这样的简单组件，也通过 JS 附加事件监听器或动态类名管理。
- **未采纳原因**：
  - 增加不必要的运行时开销（每个按钮都绑定 JS 事件，虽然逻辑简单，但数量多了有性能影响）。
  - 违反"仅导入 CSS 即可使用"的最小侵入原则。
  - 对于静态内容（如纯展示页面），强制引入 JS 毫无必要。
  - 无法用于无 JS 环境（如邮件模板、AMP 页面、某些静态生成场景）。

### 替代方案 2：提供 React / Vue / Svelte 等框架组件包

- **描述**：将组件封装为 React 组件（`<NeoButton>`）、Vue 组件（`<NeoButton>`）等。
- **未采纳原因**：
  - 增加大量框架耦合代码，每个框架需要独立的实现和维护。
  - 用户如果更换框架，需要重新学习对应的组件 API。
  - 与 Tailwind CSS 的"框架无关"哲学不符。
  - 原生 JS 方案通过数据属性初始化（`data-nb-dropdown`），在任何框架中都可以直接使用，框架只需负责渲染 HTML 类名即可。
  - **注**：未来可能通过社区或官方提供框架封装（如 `@neo-brutal-ui/react`），但这属于封装层，不是核心架构的一部分。核心架构始终是无框架的原生 JS。

### 替代方案 3：纯 CSS 实现所有交互（不使用任何 JS）

- **描述**：利用 CSS 的 `:target`、Checkbox Hack、`<details>` / `<summary>` 等技巧，实现 Modal、Dropdown 等复杂交互。
- **未采纳原因**：
  - Modal 的 `:target` 方案会污染 URL 哈希，且无法处理多层嵌套 Modal。
  - Dropdown 的 Checkbox Hack 在可访问性（键盘导航、屏幕阅读器）方面表现差，难以满足 WCAG 标准。
  - 纯 CSS 无法处理焦点管理（Focus Trap）、ESC 键关闭、点击外部关闭等复杂交互逻辑。
  - 体验上的限制使得纯 CSS 方案只能用于简单场景，不适合通用组件库。

## 影响（Consequences）

### 正面影响

- **CSS 包零运行时**：纯展示页面、静态站点、邮件模板等场景可以零成本使用。
  - 最终 CSS 包体积由构建工具的 Tree-shaking 决定，未使用的组件样式不会进入产物。
- **框架无关**：原生 JS 交互包可以在 React、Vue、Svelte、Angular、Solid、Alpine.js 甚至 Vanilla JS 中直接使用。
  - 框架用户只需在模板中写类名，通过 `data-nb-*` 属性或手动调用 JS API 初始化交互。
- **Tree-shakeable**：JS 包按组件导出，用户只引入需要的交互逻辑（如只需要 Modal，就不需要 Dropdown 的代码）。
- **可访问性（A11y）保障**：JS 包负责管理键盘导航、焦点陷阱、ARIA 属性更新，确保复杂组件达到 WCAG 2.1 AA 标准。
- **渐进增强**：页面在无 JS 时仍可渲染基础视觉（虽然复杂交互失效），符合渐进增强原则。
- **维护清晰**：CSS 和 JS 的职责边界明确，CSS 开发者专注视觉，JS 开发者专注交互。

### 负面影响 / 风险

- **需要手动初始化**：JS 交互不像框架组件那样自动挂载，需要用户调用 `initXxx()` 或在 DOM 加载后自动扫描 `data-nb-*` 属性。
  - 缓解措施：提供 `autoInit()` 函数，在 `DOMContentLoaded` 时自动初始化所有组件；同时支持手动初始化以满足框架生命周期（如 React 的 `useEffect`）。
- **重复初始化风险**：在 SPA 框架中，路由切换后新渲染的 DOM 需要重新初始化，用户可能忘记调用。
  - 缓解措施：提供 `MutationObserver` 的自动监听模式（可选开启），检测新添加的 `data-nb-*` 元素并自动初始化。
- **JS 包体积**：虽然 Tree-shakeable，但每个组件的交互逻辑仍有一定体积。
  - 缓解措施：保持 JS 逻辑轻量（不引入大型依赖如 Popper.js，优先使用原生 API；复杂定位使用轻量级 floating-ui 的 dom 包）。
- **与框架的集成文档**：需要为 React、Vue 等框架提供集成示例（如何在 `useEffect` 中初始化，如何清理）。
  - 缓解措施：在文档中提供各框架的集成指南代码片段。

### 技术债务 / 后续工作

- 定义 `@neo-brutal-ui/interactions` 包的 API 规范（初始化函数签名、实例方法、事件系统）。
- 设计 `data-nb-*` 属性的完整命名规范（如 `data-nb-dropdown`、`data-nb-modal-trigger`）。
- 制定可访问性检查清单（Keyboard Trap、Focus Management、ARIA Roles、Live Regions 等）。
- 评估是否引入 `floating-ui/dom`（轻量级，~3KB gzip）作为 Tooltip、Dropdown 的定位引擎，还是使用原生 `Popover API`（浏览器支持率待评估）。
- 为 SPA 框架提供封装示例（React Hook、Vue Composable、Svelte Action），但始终作为文档示例而非官方包。

---

> 本记录已被接受。关于主题作用域的架构决策，见 ADR-005。
