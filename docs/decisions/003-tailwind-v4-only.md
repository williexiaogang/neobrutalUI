# ADR-003: 仅支持 Tailwind CSS v4+，不兼容 v3，不提供 CDN 构建

- 日期：2025-01-15
- 状态：accepted

---

## 背景（Context）

Tailwind CSS 在 v4 版本中进行了重大架构变革：从基于 JavaScript 的配置文件（`tailwind.config.js`）转向 CSS 原生配置（在 CSS 文件中使用 `@theme`、`@import` 等指令）。v4 全面拥抱现代 CSS 能力，包括：

- CSS 原生导入（`@import`）和层叠层（`@layer`）
- CSS 嵌套（原生支持，无需 PostCSS 插件）
- 改进的 `color-mix()` 支持
- 对 OKLCH 颜色空间的优化支持
- 更快的构建性能（基于 Rust 的 Lightning CSS 引擎）

本项目从一开始就以现代 CSS 能力为基线（如使用 OKLCH 颜色、CSS 自定义属性、逻辑属性等），这些能力在 Tailwind v4 中得到了最佳支持。然而，这一决策意味着我们必须在"支持更广泛的用户群（包括 v3 用户）"和"采用最新的技术基线"之间做出权衡。

此外，CDN 构建（直接通过 `<script src>` 引入的浏览器版本）是另一种需要考虑的分发形式。它不需要构建工具，但会增加维护复杂度和包体积。

## 决策（Decision）

**Neo-Brutal UI 仅支持 Tailwind CSS v4+，不兼容 v3，第一版不提供 CDN 构建。** 具体包括：

1. **Tailwind CSS v4 为最低要求**：
   - 所有 CSS 代码基于 v4 的语法（`@theme` 变量、`@import` 路径解析、`@layer` 组织）。
   - 不使用任何 v3 的兼容语法（如 `@tailwind base` 指令已被 v4 废弃）。
   - 文档和示例全部使用 v4 的导入方式：`@import "neo-brutal-ui";`

2. **不兼容 Tailwind CSS v3**：
   - 不在源码中编写任何 v3 兼容代码或 polyfill。
   - 不在文档中提供 v3 的使用说明或变通方案。
   - 如果 v3 用户尝试使用，应在安装时通过 `peerDependencies` 或文档明确提示不兼容。

3. **第一版不提供 CDN 构建**：
   - 不发布预编译的独立 CSS 文件到 CDN（如 unpkg、jsDelivr）。
   - 用户必须通过构建工具（Vite、Webpack、Parcel 等）和 Tailwind CSS v4 的 CSS 导入机制使用。
   - 此决策在第一版中严格执行，后续版本可能根据需求评估是否提供 CDN 构建（见后续工作）。

## 替代方案（Alternatives）

### 替代方案 1：同时支持 Tailwind CSS v3 和 v4

- **描述**：通过条件编译或双入口文件，同时提供 v3 和 v4 兼容的代码。
- **未采纳原因**：
  - 增加大量兼容代码和条件分支，维护成本极高。
  - v3 使用 `tailwind.config.js` 配置主题，v4 使用 CSS 中的 `@theme` 配置，两者机制完全不同，无法优雅兼容。
  - v3 的 JIT 引擎和 v4 的 Lightning CSS 引擎对 CSS 语法的解析差异大，容易产生不可预期的问题。
  - 项目定位是面向现代前端，v3 已在逐步被社区淘汰，投入兼容的 ROI 过低。
  - 阻碍使用 v4 独有的现代 CSS 能力（如 `@property` 用于动画）。

### 替代方案 2：提供独立 CSS 构建（不依赖 Tailwind）

- **描述**：将组件库编译为纯 CSS 文件，用户通过 `<link>` 引入，无需任何构建工具或 Tailwind CSS。
- **未采纳原因**：
  - 新粗野风格严重依赖 CSS 自定义属性（Token）进行主题化，纯 CSS 文件需要内联所有 token 的默认值，无法利用 Tailwind v4 的 `@theme` 系统。
  - 无法享受 Tailwind 的 utility 类组合（用户失去了 `nb-btn` + Tailwind utility 的组合能力）。
  - 编译后的 CSS 体积会远大于按需导入的 Tailwind 构建产物。
  - 与项目"基于 Tailwind CSS v4"的技术定位不符。
  - 维护独立的 CSS 构建管道增加了工程复杂度。
  - **注**：此方案未来可能作为独立构建产物重新评估，但不作为第一版的官方支持形式。

### 替代方案 3：提供 CDN 构建（浏览器直接引入）

- **描述**：发布预编译的 CSS 文件到 CDN，用户通过 `<script src>` 或 `<link href>` 直接引入。
- **未采纳原因**：
  - 预编译 CSS 需要包含所有组件的全部样式，体积巨大（无法 Tree-shake）。
  - 无法支持自定义主题（除非通过 CSS 覆盖，但体验差）。
  - CDN 构建需要额外的 CI/CD 管道和版本管理，增加维护负担。
  - 目标用户群体（现代前端开发者）通常已有构建工具链，CDN 引入的吸引力有限。
  - **注**：未来可能提供精简版 CDN 构建（仅基础组件），但不在第一版中实现。

## 影响（Consequences）

### 正面影响

- **代码简洁**：无需兼容代码，所有实现可以直接使用 v4 语法和现代 CSS 能力。
- **维护成本低**：只需维护一套代码和一套文档，无需测试 v3 兼容性。
- **性能最优**：利用 Tailwind v4 的 Lightning CSS 引擎，构建速度比 v3 快数倍。
- **现代 CSS 能力全开**：可以放心使用 `@layer`、`@property`、CSS 嵌套、OKLCH 颜色等，无需考虑 fallback。
- **包体积最优**：用户通过构建工具按需导入，未使用的组件样式不会进入最终产物（Tree-shaking）。
- **主题系统更强大**：利用 v4 的 `@theme` 系统，主题配置可以在 CSS 中直接完成，无需 JavaScript 配置文件。

### 负面影响 / 风险

- **缩小潜在用户群**：仍在使用 Tailwind v3 的项目无法直接使用，需要升级至 v4。
  - 缓解措施：Tailwind v4 的升级路径相对平滑（主要是配置方式变更），且 v4 已正式发布。
- **生态工具滞后**：部分 v3 时代的 Tailwind 插件和工具可能尚未更新到 v4，导致用户工具链不完整。
  - 缓解措施：项目自身不依赖外部插件，核心功能自给自足。
- **无法服务"无构建工具"场景**：纯 HTML 文件（如静态页面、邮件模板、简单演示）无法直接引入使用。
  - 缓解措施：未来评估是否提供 CDN 构建或独立 CSS 文件作为补充分发形式。
- **学习曲线**：v4 的 CSS 原生配置方式对习惯了 `tailwind.config.js` 的开发者需要适应。
  - 缓解措施：文档提供详细的 v4 配置指南和从 v3 迁移的要点说明。

### 技术债务 / 后续工作

- 在 `package.json` 中通过 `peerDependencies` 明确声明 `tailwindcss: ">=4.0.0"`。
- 文档首页必须明确标注"Requires Tailwind CSS v4+"，并在安装指南中说明如何检查版本。
- 持续跟踪 Tailwind CSS v4 的更新日志，确保项目代码跟随最新最佳实践。
- **后续评估项**：在 v1.0 之后的版本中，评估是否提供以下补充分发形式：
  1. 预编译的独立 CSS 文件（`neo-brutal-ui.css`），供无 Tailwind 项目使用。
  2. CDN 构建（`neo-brutal-ui.min.css`），供快速原型和演示使用。
  3. 以上两种形式必须在明确的技术可行性评估后，通过新的 ADR 决策才能实施。

---

> 本记录已被接受。关于 CSS 零运行时依赖和 JS 交互的架构决策，见 ADR-004。
