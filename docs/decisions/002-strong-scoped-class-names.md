# ADR-002: 使用强作用域类名（Strong Scoped Class Names）

- 日期：2025-01-15
- 状态：accepted

---

## 背景（Context）

在组件库类名设计中，作用域强度（scoping strength）是一个核心架构决策。弱作用域（Weak Scoping）指组件的不同修饰符作为独立类名存在（如 `nb-btn` + `nb-primary`），而强作用域（Strong Scoping）指修饰符与组件名绑定（如 `nb-btn` + `nb-btn-primary`）。

本项目需要决定采用哪种作用域策略。这一决策直接影响类名的可预测性、与 Tailwind CSS Utility 的共存能力、以及大型项目中的可维护性。

Tailwind CSS v4 引入了更严格的 CSS 优先机制（基于层叠层 `@layer` 和源码顺序），显式命名的重要性进一步提高。此外，新粗野风格的组件通常需要多个视觉修饰符协同工作（如 `nb-btn nb-btn-primary nb-btn-lg nb-btn-shadow-offset`），类名体系必须清晰、无歧义。

## 决策（Decision）

**Neo-Brutal UI 采用强作用域命名（Strong Scoped Class Names）策略**。具体规则如下：

1. **所有组件变体类名必须包含组件前缀**：
   - ✅ `nb-btn-primary`（按钮的主色变体）
   - ✅ `nb-card-bordered`（卡片的边框变体）
   - ❌ `nb-primary`（弱作用域，全局通用，不绑定组件）
   - ❌ `nb-bordered`（弱作用域，含义模糊，不知道属于哪个组件）

2. **组件基础类名与变体类名组合使用**：
   ```html
   <button class="nb-btn nb-btn-primary nb-btn-lg">Click me</button>
   <div class="nb-card nb-card-bordered nb-card-shadow-hard">Content</div>
   ```

3. **工具类（Utility）和组件类严格分离**：组件类名（`nb-*`）不直接替代 Tailwind 的 utility 类（如 `p-4`、`text-center`），两者共存。用户负责组合使用。

4. **状态类名同样遵循强作用域**：
   - ✅ `nb-btn-disabled`
   - ✅ `nb-btn-loading`
   - ❌ `nb-disabled`（弱作用域）

## 替代方案（Alternatives）

### 替代方案 1：弱作用域（Weak Scoping）

- **描述**：修饰符作为独立类名，不绑定组件。例如：`nb-btn` + `nb-primary` + `nb-lg`。
- **未采纳原因**：
  - `nb-primary` 的语义是全局的，但样式实际上是组件相关的（按钮的 primary 颜色可能与卡片的 primary 颜色不同）。
  - 在大型项目中，弱作用域类名容易冲突（如 `nb-primary` 被不同组件定义，导致意外的样式覆盖）。
  - 与 Tailwind CSS 的 utility 类（如 `text-primary`）更容易混淆。
  - 无法通过类名前缀快速识别一个类名属于哪个组件（不利于调试和 IDE 自动补全）。

### 替代方案 2：BEM（Block-Element-Modifier）命名法

- **描述**：使用 BEM 规范，如 `nb-btn`（Block）、`nb-btn__icon`（Element）、`nb-btn--primary`（Modifier）。
- **未采纳原因**：
  - BEM 的 Element 分隔符 `__` 在类名中视觉上较为冗长，不符合 Tailwind 生态的简洁习惯。
  - Tailwind CSS 社区主流采用带前缀的单词组合（如 `btn-primary`）而非 BEM 的 `--` 修饰符。
  - 借鉴 daisyUI 的命名风格（`btn-primary`）可以降低用户迁移成本，添加 `nb-` 前缀后（`nb-btn-primary`）既保持独立性又符合用户习惯。
  - BEM 的 Element 概念在原子化 CSS（Utility-first）的上下文中价值有限，因为子元素样式通常通过组件内部选择器或 Tailwind utility 处理。

### 替代方案 3：CSS Modules（或 Shadow DOM 的 `:host` 封装）

- **描述**：通过构建工具将 CSS 类名哈希化，实现天然的作用域隔离。
- **未采纳原因**：
  - 本项目目标用户直接使用类名（如 `<button class="nb-btn nb-btn-primary">`），哈希化类名会完全破坏这一体验。
  - 用户无法通过浏览器 DevTools 直接读取和调试有意义的类名。
  - 与 Tailwind CSS 的 utility 类共存时，哈希化组件类名会造成配置和维护上的复杂性。

### 替代方案 4：纯原子类（Atomic Classes，如 Tailwind 自身）

- **描述**：不提供组件类名，只提供一组预定义的原子类组合，用户自行组装。
- **未采纳原因**：
  - 这本质上就是 Tailwind CSS 本身，不符合"组件库"的定位。
  - 新粗野风格的组件通常需要复杂的伪元素结构（如 `::before` 和 `::after` 构建双层边框），无法通过原子类直接实现。
  - 没有语义化类名，HTML 会膨胀，可读性差，且维护成本高。

## 影响（Consequences）

### 正面影响

- **高可预测性**：从类名 `nb-btn-primary` 可以立即知道这是"按钮的主色变体"，不会产生歧义。
- **与 Tailwind Utility 共存安全**：`nb-btn-primary` 不会与 Tailwind 的 `text-primary` 或 `bg-primary` 冲突。
- **IDE 和 DevTools 友好**：前缀明确的类名便于自动补全、全局搜索和调试。
- **组件间隔离**：`nb-btn-primary` 和 `nb-badge-primary` 可以独立定义颜色值，互不影响。
- **符合生态习惯**：Tailwind 社区的主流组件库（如 daisyUI、Headless UI）都采用类似的强作用域模式，学习成本低。
- **主题系统友好**：`nb-btn-primary` 可以映射到主题 token `--nb-btn-primary-bg`，命名对应关系清晰。

### 负面影响 / 风险

- **类名稍长**：相比弱作用域，强作用域的类名多了组件前缀（如 `nb-btn-primary` vs `nb-primary`）。但相比于 BEM 的 `nb-btn--primary`，长度可接受。
- **HTML 类名列表可能较长**：当组件有多个变体时，类名数量增加（如 `nb-btn nb-btn-primary nb-btn-lg nb-btn-wide nb-btn-shadow-offset`）。但这正是显式组合设计哲学的体现，利大于弊。
- **生成 CSS 体积稍大**：类名字符串本身在 CSS 文件中会占用更多字节。但 gzip/brotli 压缩后影响极小，且可通过 PurgeCSS 等工具移除未使用的类名。

### 技术债务 / 后续工作

- 制定完整的类名命名规范文档（Naming Convention Guide），明确定义组件名、变体名、状态名、尺寸名的命名规则。
- 在 ESLint / Stylelint 配置中增加规则，禁止弱作用域类名（如自动检测 `nb-primary` 这样的非强作用域模式并报错）。
- 确保所有组件的实现严格遵循本 ADR，在代码审查中作为强制检查项。

---

> 本记录已被接受。类名前缀 `nb-` 的决策，见 ADR-001。
