# 5.1 Alert 设计基准稿

> 本文档定义 Neo-Brutal UI 中 **Alert** 组件的完整设计规范、DOM 契约、尺寸变体、状态矩阵、阴影位移、圆角边框、颜色策略、可访问性要求及实现代码。所有 Token 引用自全局设计系统。
>
> **适用范围**：Alert 组件的 CSS 实现、HTML 结构、ARIA 属性、交互行为。  
> **组件类别**：`Box`（容器类）。  
> **类名前缀**：`nb-`。

---

## 1. 组件概述

### 1.1 组件名称与用途

**Alert**（警告/提示框）是一个**静态信息容器**，用于向用户传达重要、紧迫或辅助性的信息。它不承载复杂交互，核心职责是**吸引注意力、传递语义、引导行动**。Alert 常用于表单验证反馈、操作结果通知、系统状态提示、营销信息展示等场景。

在 Neo-Brutal UI 中，Alert 的视觉特征为：**直角边框、硬阴影、左侧强调色带（3px inline-start）、语义化背景色**。风格硬朗，拒绝圆角，信息传达直接。

### 1.2 语义 HTML 元素

Alert 的语义基础是 `<div>`，因其本质是通用容器。当 Alert 包含可交互内容（如操作按钮或链接）时，**可以**使用 `<section>` 或 `<article>`，但默认使用 `<div>`。

> ⚠️ **注意**：Alert **不是**交互式控件（如 Button、Input），它不可被按下、不可被选中、不可提交表单。因此绝大多数交互状态（如 Active、Disabled、Checked）对 Alert 本身**不适用**。但 Alert 内部可以包含交互元素（如关闭按钮、操作链接），这些内部元素遵循各自的交互规范。

### 1.3 类名定义

| 类名 | 用途 | 说明 |
|------|------|------|
| `.nb-alert` | 组件根元素 | 必需。Alert 的基础容器。 |
| `.nb-alert__icon` | 图标区域 | 可选。语义图标，如 `!`、`✓`、`i`。 |
| `.nb-alert__content` | 内容包装器 | 可选。包含标题和描述的 Flex 容器。 |
| `.nb-alert__title` | 标题文本 | 可选。Alert 的主标题。 |
| `.nb-alert__description` | 描述文本 | 可选。Alert 的详细说明。 |
| `.nb-alert__actions` | 操作区域 | 可选。放置按钮、链接等操作元素。 |
| `.nb-alert__close` | 关闭按钮 | 可选。独立关闭按钮，语义为 `<button>`。 |

#### 尺寸修饰符

| 类名 | 尺寸 |
|------|------|
| `.nb-alert--xs` | 超小 |
| `.nb-alert--sm` | 小 |
| `.nb-alert--md` | 默认（无修饰符时） |
| `.nb-alert--lg` | 大 |
| `.nb-alert--xl` | 超大 |

#### 颜色/语义修饰符

| 类名 | 语义 |
|------|------|
| `.nb-alert--primary` | 主色（品牌/强调） |
| `.nb-alert--secondary` | 次色 |
| `.nb-alert--neutral` | 中性色（默认） |
| `.nb-alert--info` | 信息提示 |
| `.nb-alert--success` | 成功状态 |
| `.nb-alert--warning` | 警告状态 |
| `.nb-alert--error` | 错误状态 |

#### 外观修饰符

| 类名 | 外观 |
|------|------|
| `.nb-alert--solid` | 实色背景（默认） |
| `.nb-alert--soft` | 柔和背景（低饱和度） |
| `.nb-alert--outline` | 仅边框，无背景色 |

#### 布局修饰符

| 类名 | 布局 |
|------|------|
| `.nb-alert--full-width` | 宽度 100%，撑满父容器 |
| `.nb-alert--interactive` | 可交互模式（整体可点击/悬停） |
| `.nb-alert--dismissible` | 可关闭（显示关闭按钮） |
| `.nb-alert--no-icon` | 无图标 |

---

## 2. DOM Contract

### 2.1 推荐 HTML 结构

```html
<!-- 基础 Alert -->
<div class="nb-alert nb-alert--info" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">
    <svg><!-- info icon --></svg>
  </div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">操作提示</div>
    <div class="nb-alert__description">您的修改已成功保存，将在 5 秒后自动刷新页面。</div>
  </div>
</div>

<!-- 带操作的 Alert -->
<div class="nb-alert nb-alert--warning nb-alert--dismissible" role="alert" aria-live="polite">
  <div class="nb-alert__icon" aria-hidden="true">⚠</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">存储空间不足</div>
    <div class="nb-alert__description">您的账户存储空间已使用 92%，建议立即清理。</div>
  </div>
  <div class="nb-alert__actions">
    <button class="nb-btn nb-btn--sm">立即清理</button>
  </div>
  <button class="nb-alert__close" aria-label="关闭提示" type="button">
    <span aria-hidden="true">✕</span>
  </button>
</div>

<!-- 可交互 Alert（整体可点击） -->
<a class="nb-alert nb-alert--interactive nb-alert--primary" href="/upgrade" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">🚀</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">升级至 Pro 版本</div>
    <div class="nb-alert__description">解锁更多高级功能，首月五折优惠。</div>
  </div>
  <div class="nb-alert__actions">
    <span class="nb-btn nb-btn--primary nb-btn--sm">立即升级 →</span>
  </div>
</a>

<!-- 仅标题的紧凑 Alert -->
<div class="nb-alert nb-alert--sm nb-alert--success" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">✓</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">保存成功</div>
  </div>
</div>

<!-- 无边框/纯文本的 minimal Alert（outline 变体） -->
<div class="nb-alert nb-alert--error nb-alert--outline" role="alert" aria-live="assertive">
  <div class="nb-alert__content">
    <div class="nb-alert__description">表单提交失败，请检查网络连接后重试。</div>
  </div>
</div>
```

### 2.2 必需子元素与可选子元素

| 子元素 | 必需 | 说明 |
|--------|------|------|
| `.nb-alert`（根元素） | ✅ 是 | 唯一必需元素。 |
| `.nb-alert__icon` | ❌ 否 | 语义图标。若不存在，Alert 自动无图标布局。 |
| `.nb-alert__content` | ❌ 否 | 内容容器。若无标题/描述，可直接在根元素中放文本。 |
| `.nb-alert__title` | ❌ 否 | 标题。若存在，必须位于 `.nb-alert__content` 内。 |
| `.nb-alert__description` | ❌ 否 | 描述文本。若仅有标题，可省略。 |
| `.nb-alert__actions` | ❌ 否 | 操作区域。通常包含按钮或链接。 |
| `.nb-alert__close` | ❌ 否 | 关闭按钮。当使用 `.nb-alert--dismissible` 时建议存在。 |

**结构约束**：
- 当 `.nb-alert__title` 和 `.nb-alert__description` 同时存在时，它们必须位于 `.nb-alert__content` 内。
- `.nb-alert__actions` 可以是根元素的直接子元素，也可以位于 `.nb-alert__content` 内（取决于布局需求）。
- `.nb-alert__close` 必须是根元素的直接子元素，且语义为 `<button>`。

### 2.3 ARIA 属性要求

| 属性 | 必需 | 值 | 说明 |
|------|------|-----|------|
| `role="alert"` | ✅ 强烈推荐 | `"alert"` | 标识这是一个提示区域。 |
| `aria-live` | 条件 | `"polite"` / `"assertive"` | 动态内容时使用。`assertive` 用于错误/紧急；`polite` 用于一般提示。 |
| `aria-atomic` | 可选 | `"true"` | 当 Alert 内容整体更新时，屏幕阅读器应读出完整内容。 |
| `aria-label` | 条件 | 字符串 | 当关闭按钮使用图标时，必须提供 `aria-label="关闭提示"`。 |
| `aria-hidden="true"` | 推荐 | `"true"` | 图标元素应标记，避免屏幕阅读器重复读取。 |
| `aria-busy="true"` | 条件 | `"true"` | 当 Alert 处于 Loading 状态时。 |

### 2.4 键盘行为

Alert 作为容器组件，本身**不接收键盘焦点**（除非是可交互 Alert）。键盘行为由内部元素承担：

| 元素 | 键盘行为 | 说明 |
|------|----------|------|
| 关闭按钮 (`.nb-alert__close`) | `Enter` / `Space` 触发关闭 | 关闭按钮必须是 `<button>`，确保键盘可访问。 |
| 操作按钮 (`.nb-alert__actions` 内) | 遵循 Button 规范 | 见 `button.md` 文档。 |
| 链接 (`.nb-alert--interactive`) | `Enter` / `Space` 导航 | 可交互 Alert 整体使用 `<a>` 或 `<button>`，确保键盘可访问。 |
| 可交互 Alert 整体 | `Tab` 聚焦 | 获得焦点时显示 `:focus-visible` 样式。 |

---

## 3. 尺寸与变体

### 3.1 尺寸定义

Alert 的尺寸通过 `padding`、`font-size`、`gap`、`min-height` 和 `icon-size` 控制。所有尺寸保持 `border: 2px solid` 不变。

| 尺寸 | 类名 | `padding` | `font-size`（标题） | `font-size`（描述） | `gap`（图标与内容） | `min-height` | 图标尺寸 | 阴影 |
|------|------|-----------|---------------------|---------------------|---------------------|--------------|----------|------|
| **xs** | `.nb-alert--xs` | `0.5rem 0.75rem` | `0.75rem` (12px) | `0.75rem` (12px) | `0.5rem` | `2rem` (32px) | `0.875rem` | `--nb-shadow-sm` |
| **sm** | `.nb-alert--sm` | `0.625rem 1rem` | `0.8125rem` (13px) | `0.8125rem` (13px) | `0.625rem` | `2.5rem` (40px) | `1rem` | `--nb-shadow-sm` |
| **md** | `.nb-alert`（默认） | `0.75rem 1.25rem` | `0.875rem` (14px) | `0.875rem` (14px) | `0.75rem` | `3rem` (48px) | `1.125rem` | `--nb-shadow-md` |
| **lg** | `.nb-alert--lg` | `1rem 1.5rem` | `1rem` (16px) | `0.875rem` (14px) | `1rem` | `3.5rem` (56px) | `1.25rem` | `--nb-shadow-md` |
| **xl** | `.nb-alert--xl` | `1.25rem 2rem` | `1.125rem` (18px) | `1rem` (16px) | `1.25rem` | `4rem` (64px) | `1.5rem` | `--nb-shadow-lg` |

> **密度说明**：上述尺寸基于 **Default** 密度模式。若父容器使用 `.nb-density-compact`，padding 和 gap 按密度 Token 等比例压缩；使用 `.nb-density-comfortable` 则等比例扩展。密度变化不影响边框、阴影、字体大小。

### 3.2 颜色变体（语义变体）

每个语义变体定义了**背景色、文本色、边框色、左侧强调色（accent）**四组颜色。所有颜色均使用语义 Token，禁止硬编码。

| 变体 | 类名 | 背景色 | 文本色 | 边框色 | 左侧强调色 | 说明 |
|------|------|--------|--------|--------|------------|------|
| **Primary** | `.nb-alert--primary` | `--nb-primary` | `--nb-primary-content` | `color-mix(...)` | `--nb-primary` | 品牌主色，用于强调性提示 |
| **Secondary** | `.nb-alert--secondary` | `--nb-secondary` | `--nb-secondary-content` | `color-mix(...)` | `--nb-secondary` | 次色，用于中性强调 |
| **Neutral** | `.nb-alert--neutral` | `--nb-base-200` | `--nb-base-content` | `var(--nb-border)` | `--nb-base-content` | 默认中性色，无特殊语义 |
| **Info** | `.nb-alert--info` | `--nb-info` | `--nb-info-content` | `color-mix(...)` | `--nb-info` | 信息提示，蓝色系 |
| **Success** | `.nb-alert--success` | `--nb-success` | `--nb-success-content` | `color-mix(...)` | `--nb-success` | 成功状态，绿色系 |
| **Warning** | `.nb-alert--warning` | `--nb-warning` | `--nb-warning-content` | `color-mix(...)` | `--nb-warning` | 警告状态，黄色/橙色系 |
| **Error** | `.nb-alert--error` | `--nb-error` | `--nb-error-content` | `color-mix(...)` | `--nb-error` | 错误状态，红色系 |

> **边框色计算规则**：对于彩色变体，边框色使用 `color-mix(in oklch, var(--{variant}-content) 20%, transparent)`。对于 Neutral，直接使用 `var(--nb-border)`。

### 3.3 外观变体

#### 3.3.1 Solid（实色，默认）

使用完整语义背景色，文字使用对比色（`--nb-{variant}-content`）。视觉冲击力最强，用于需要立即引起注意的 Alert。

```css
.nb-alert--solid.nb-alert--primary {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  border-inline-start-color: var(--nb-primary);
  border-inline-start-width: 3px;
}
```

#### 3.3.2 Soft（柔和）

使用 `color-mix` 将语义色与背景色混合，生成低饱和度的柔和背景。文字仍使用标准内容色，保持可读性。适合需要减少视觉侵略性的场景（如页面顶部常驻提示）。

```css
.nb-alert--soft.nb-alert--primary {
  background-color: color-mix(in oklch, var(--nb-primary) 10%, var(--nb-base-100));
  color: var(--nb-base-content);
  border-color: var(--nb-border);
  border-inline-start-color: var(--nb-primary);
  border-inline-start-width: 3px;
}
```

#### 3.3.3 Outline（仅边框）

无背景色（或背景与页面底色一致），仅通过边框和左侧强调色区分。最轻量，适合信息密度高的页面。

```css
.nb-alert--outline.nb-alert--primary {
  background-color: transparent;
  color: var(--nb-base-content);
  border-color: var(--nb-border);
  border-inline-start-color: var(--nb-primary);
  border-inline-start-width: 3px;
}
```

### 3.4 布局变体

| 变体 | 类名 | 规则 |
|------|------|------|
| **Full Width** | `.nb-alert--full-width` | `display: flex; width: 100%;` 撑满父容器。 |
| **Interactive** | `.nb-alert--interactive` | 添加 Hover/Active 阴影和位移效果（见第5节）。光标变为 `pointer`。 |
| **Dismissible** | `.nb-alert--dismissible` | 显示关闭按钮，内部预留关闭按钮空间。 |
| **No Icon** | `.nb-alert--no-icon` | 强制隐藏图标，内容左对齐。 |

---

## 4. 状态矩阵

> **核心原则**：Alert 是**信息容器**，不是交互控件。因此绝大多数交互状态对 Alert 本身**不适用**，但内部元素（如关闭按钮、操作按钮）遵循各自的组件规范。下表中，**适用于 Alert 容器本身**的状态给出详细规则；**不适用**的状态明确标记为 **N/A**。

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 光标 | 适用性 |
|------|------|------|------|------|--------|------|------|--------|
| **Default** | `2px solid` 变体边框色 | `--nb-shadow-md`（默认尺寸） | `none` | 变体背景+文本色 | `1.0` | — | `default` | ✅ 适用 |
| **Hover** | 边框不变 | 升至 `--nb-shadow-lg` | `translate(-2px, -2px)` | 背景微调（`color-mix` 90% 混合） | `1.0` | `150ms brutal` | `pointer` | ⚠️ 仅 `.nb-alert--interactive` |
| **Active / Pressed** | 边框不变 | `--nb-shadow-none` | `translate(4px, 4px)` | 背景微调（`color-mix` 110% 混合） | `1.0` | `150ms brutal` | `pointer` | ⚠️ 仅 `.nb-alert--interactive` |
| **Focus Visible** | 不变 | 保留 Default | `none` | 外框 `outline: 2px solid var(--nb-focus)`，`outline-offset: 2px` | `1.0` | `100ms standard` | `default` | ✅ 适用（可聚焦时） |
| **Disabled** | 变淡 50% | `none` | `none` | 变淡 50% | `0.5` | `instant` | `not-allowed` | ❌ **N/A**（Alert 不可禁用） |
| **Loading / Busy** | 不变 | `--nb-shadow-md` | `none` | 内容替换为 spinner 或 skeleton | `1.0` | loading 动画 | `wait` | ✅ 适用 |
| **Invalid** | 变 `--nb-error`，3px inline-start | 不变 | `none` | 背景微调 | `1.0` | `100ms standard` | `default` | ❌ **N/A**（Alert 不用于表单验证；应使用 `.nb-alert--error` 变体） |
| **Valid** | 变 `--nb-success` | 不变 | `none` | 背景微调 | `1.0` | `100ms standard` | `default` | ❌ **N/A** |
| **Selected / Checked** | 变 `--nb-primary` | 降低 | `none` | 主色+对比色 | `1.0` | `100ms standard` | `pointer` | ❌ **N/A**（Alert 不是选择控件） |
| **Open / Expanded** | 不变 | 不变 | `none` | 不变 | `1.0` | 进入动画 `250ms` | `default` | ❌ **N/A**（Alert 默认即展开；若需折叠，使用 Accordion 组件） |
| **Readonly** | 变淡 | 降低 | `none` | 不变 | `1.0` | `instant` | `default` | ❌ **N/A**（Alert 不是输入控件） |

### 4.1 状态详细说明

#### 4.1.1 Default

Alert 的基础显示状态。所有视觉属性由变体（颜色 + 外观）和尺寸决定。

```css
.nb-alert {
  border: 2px solid var(--nb-border);
  border-inline-start-width: 3px;
  border-inline-start-color: var(--nb-base-content); /* Neutral 默认 */
  background-color: var(--nb-base-200);
  color: var(--nb-base-content);
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  transform: translate(0, 0);
  transition: transform var(--nb-duration-normal) var(--nb-ease-brutal),
              box-shadow var(--nb-duration-normal) var(--nb-ease-brutal),
              background-color var(--nb-duration-fast) var(--nb-ease-standard);
}
```

#### 4.1.2 Hover（仅 `.nb-alert--interactive`）

仅当 Alert 标记为可交互时（`.nb-alert--interactive`），Hover 状态生效。提供物理上升感，引导用户点击。

```css
.nb-alert--interactive:hover {
  box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  transform: translate(-2px, -2px);
  background-color: color-mix(in oklch, var(--nb-alert-bg) 90%, var(--nb-base-100));
}
```

> **非交互式 Alert**：普通 Alert 不响应 Hover，光标保持 `default`，阴影不变。

#### 4.1.3 Active / Pressed（仅 `.nb-alert--interactive`）

仅可交互 Alert 响应。物理下沉感，阴影归零，元素移向原阴影位置。

```css
.nb-alert--interactive:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
  background-color: color-mix(in oklch, var(--nb-alert-bg) 110%, var(--nb-base-300));
}
```

#### 4.1.4 Focus Visible

当 Alert 或其内部可交互元素获得键盘焦点时显示。对于普通 Alert（非交互），Focus Visible 通常不生效；但如果 Alert 包含 `tabindex`（如动态更新的 Alert 需要焦点管理），则适用。

```css
.nb-alert:focus-visible,
.nb-alert--interactive:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  /* 不修改 transform 或 box-shadow，避免与 Hover 冲突 */
}

.nb-alert--interactive:hover:focus-visible {
  box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  transform: translate(-2px, -2px);
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}
```

#### 4.1.5 Disabled — N/A

Alert 作为信息容器，不存在"禁用"语义。若需要展示"某项功能不可用"的信息，使用 `.nb-alert--neutral` 或 `.nb-alert--warning` 变体，而非 Disabled 状态。

#### 4.1.6 Loading / Busy

当 Alert 内容正在加载（如异步获取通知内容）时，显示 Loading 状态。保持 Alert 尺寸不变，内容区域替换为 spinner。

```css
.nb-alert.is-loading,
.nb-alert[aria-busy="true"] {
  position: relative;
  pointer-events: none;
  cursor: wait;
}

.nb-alert.is-loading .nb-alert__content,
.nb-alert[aria-busy="true"] .nb-alert__content {
  visibility: hidden;
}

.nb-alert.is-loading::after,
.nb-alert[aria-busy="true"]::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--nb-base-200);
  border-top-color: var(--nb-alert-accent, var(--nb-primary));
  border-radius: 50%; /* Spinner 圆形例外，符合 Loading 标准 */
  animation: nb-spin 1s linear infinite;
  transform: translate(-50%, -50%);
}

@keyframes nb-spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

#### 4.1.7 Invalid — N/A

Alert 本身不进入 Invalid 状态。若需要展示验证错误，使用 `.nb-alert--error` 变体，并配合 `aria-live="assertive"` 确保屏幕阅读器立即朗读。

#### 4.1.8 Valid — N/A

同理，使用 `.nb-alert--success` 变体替代。

#### 4.1.9 Selected / Checked — N/A

Alert 不是选择控件，不进入 Selected 状态。若需要选择列表项，使用 List Group 或 Checkbox 组件。

#### 4.1.10 Open / Expanded — N/A

Alert 默认即为展开状态。若需要可折叠的内容面板，使用 Accordion 组件。Alert 可以包含进入动画（从上方滑入），但这不是"Open 状态"，而是入场动画。

#### 4.1.11 Readonly — N/A

Alert 不是输入控件，无 Readonly 语义。

---

## 5. 阴影与位移规则

### 5.1 阴影阶梯应用

Alert 作为 **Box 类别** 容器，使用以下阴影阶梯：

| 尺寸 | Default 阴影 | Hover 阴影（仅 interactive） | Active 阴影（仅 interactive） |
|------|--------------|------------------------------|-------------------------------|
| `xs` / `sm` | `--nb-shadow-sm` | `--nb-shadow-md` | `--nb-shadow-none` |
| `md` / `lg`（默认） | `--nb-shadow-md` | `--nb-shadow-lg` | `--nb-shadow-none` |
| `xl` | `--nb-shadow-lg` | `--nb-shadow-xl` | `--nb-shadow-none` |

> **非交互式 Alert**：Hover 和 Active 阴影不生效，阴影始终保持 Default 级别。

### 5.2 位移规则

**仅 `.nb-alert--interactive` 适用位移。** 普通 Alert 无位移。

| 状态 | 位移公式 | 计算结果 | 视觉隐喻 |
|------|----------|----------|----------|
| **Default** | `translate(0, 0)` | `none` | 平放于桌面 |
| **Hover** | `-(hover_shadow - default_shadow)` | `translate(-2px, -2px)` | 被光标向上轻推 |
| **Active** | `default_shadow_offset` | `translate(4px, 4px)`（md 默认） | 被按下至桌面平面 |

```css
/* 标准交互式 Alert（默认 md 尺寸） */
.nb-alert--interactive {
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  transform: translate(0, 0);
  transition: var(--nb-motion-transition);
  will-change: transform, box-shadow;
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) and (pointer: fine) {
  .nb-alert--interactive:hover {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }
}

.nb-alert--interactive:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
}
```

### 5.3 过渡定义

```css
.nb-alert {
  transition: transform var(--nb-duration-normal) var(--nb-ease-brutal),
              box-shadow var(--nb-duration-normal) var(--nb-ease-brutal),
              background-color var(--nb-duration-fast) var(--nb-ease-standard),
              border-color var(--nb-duration-fast) var(--nb-ease-standard);
}
```

- **transform + box-shadow**：`150ms`，`cubic-bezier(0.25, 0.1, 0.25, 1.0)`（`--nb-ease-brutal`），提供直接硬朗的物理感。
- **background-color + border-color**：`100ms`，`cubic-bezier(0.4, 0, 0.2, 1)`（`--nb-ease-standard`），快速但不突兀。

### 5.4 布局稳定性

- 使用 `transform: translate()` 而非 `margin` 或 `position` 实现位移，避免重排（reflow）。
- 位移前后元素布局占位不变，周围文档流不受影响。
- Active 位移量（4px）等于默认阴影偏移量（4px），确保视觉上元素"落回原平面"，用户不会丢失目标。

---

## 6. 圆角与边框

### 6.1 圆角 Token

Alert 属于 **Box 类别**，使用 `--nb-radius-box`：

```css
.nb-alert {
  border-radius: var(--nb-radius-box); /* 0px，直角 */
}
```

> **无例外**：Alert 不允许任何圆角变体。即使是胶囊形、营销变体，Alert 也保持直角。这是 Neo-Brutalism 的核心识别特征。

### 6.2 边框规则

#### 6.2.1 默认边框

```css
.nb-alert {
  border: 2px solid var(--nb-border); /* 或变体对应的边框色 */
}
```

- **边框宽度**：`2px`（全局标准）。
- **边框样式**：`solid`。
- **边框颜色**：使用 `color-mix(in oklch, ...)` 动态计算，非硬编码。

#### 6.2.2 左侧强调边框（Accent Border）

每个 Alert 变体使用 `3px` 的 `inline-start` 强调边框，作为语义颜色的视觉锚点：

```css
.nb-alert {
  border-inline-start-width: 3px;
  border-inline-start-color: var(--nb-alert-accent, var(--nb-base-content));
}
```

- **为什么是 3px**：比标准 2px 更粗，形成视觉层级，明确标识 Alert 的语义类型。
- **为什么是 inline-start**：支持 RTL 布局。在 LTR 中显示在左侧，在 RTL 中自动切换至右侧。
- **颜色规则**：使用变体的语义色（如 `.nb-alert--error` 使用 `--nb-error`）。

#### 6.2.3 各变体的边框色

| 变体 | 主边框色 | 左侧强调色 | 说明 |
|------|----------|------------|------|
| Neutral | `var(--nb-border)` | `var(--nb-base-content)` | 默认，最轻量 |
| Primary | `color-mix(in oklch, var(--nb-primary-content) 20%, transparent)` | `var(--nb-primary)` | 主色边框 |
| Secondary | `color-mix(in oklch, var(--nb-secondary-content) 20%, transparent)` | `var(--nb-secondary)` | 次色边框 |
| Info | `color-mix(in oklch, var(--nb-info-content) 20%, transparent)` | `var(--nb-info)` | 信息边框 |
| Success | `color-mix(in oklch, var(--nb-success-content) 20%, transparent)` | `var(--nb-success)` | 成功边框 |
| Warning | `color-mix(in oklch, var(--nb-warning-content) 20%, transparent)` | `var(--nb-warning)` | 警告边框 |
| Error | `color-mix(in oklch, var(--nb-error-content) 20%, transparent)` | `var(--nb-error)` | 错误边框 |

### 6.3 内部边框（子元素分隔）

当 Alert 包含多个子区域（如图标、内容、操作按钮），各区域之间使用 `gap` 而非边框分隔。Alert 内部**不添加额外边框**，保持表面整洁。

> 唯一例外：当 `.nb-alert__actions` 位于内容区域下方时，可以使用 `border-top: 2px solid var(--nb-border)` 分隔，但这不是默认行为。

---

## 7. 颜色策略

### 7.1 颜色 Token 映射

所有 Alert 颜色严格使用语义 Token，禁止硬编码 `#hex` 或未经批准的 `oklch()`。

```css
:root {
  /* 语义颜色 Token（全局定义，此处引用） */
  --nb-primary: oklch(60% 0.2 250);
  --nb-primary-content: oklch(98% 0.01 250);
  --nb-secondary: oklch(60% 0.15 300);
  --nb-secondary-content: oklch(98% 0.01 300);
  --nb-info: oklch(60% 0.15 220);
  --nb-info-content: oklch(98% 0.01 220);
  --nb-success: oklch(60% 0.15 150);
  --nb-success-content: oklch(98% 0.01 150);
  --nb-warning: oklch(70% 0.15 80);
  --nb-warning-content: oklch(30% 0.05 80);
  --nb-error: oklch(55% 0.2 25);
  --nb-error-content: oklch(98% 0.01 25);
  --nb-base-100: #ffffff;
  --nb-base-200: #f3f3f3;
  --nb-base-300: #e8e8e8;
  --nb-base-content: #1a1a1a;
  --nb-border: color-mix(in oklch, var(--nb-base-content) 20%, transparent);
  --nb-focus: oklch(70% 0.15 250);
}
```

### 7.2 各变体的完整颜色定义

#### 7.2.1 Solid 外观（默认）

```css
/* Primary */
.nb-alert--primary.nb-alert--solid {
  --nb-alert-bg: var(--nb-primary);
  --nb-alert-fg: var(--nb-primary-content);
  --nb-alert-accent: var(--nb-primary);
  --nb-alert-border: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
  border-inline-start-color: var(--nb-alert-accent);
}

/* Success */
.nb-alert--success.nb-alert--solid {
  --nb-alert-bg: var(--nb-success);
  --nb-alert-fg: var(--nb-success-content);
  --nb-alert-accent: var(--nb-success);
  --nb-alert-border: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
  border-inline-start-color: var(--nb-alert-accent);
}

/* Warning */
.nb-alert--warning.nb-alert--solid {
  --nb-alert-bg: var(--nb-warning);
  --nb-alert-fg: var(--nb-warning-content);
  --nb-alert-accent: var(--nb-warning);
  --nb-alert-border: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
  border-inline-start-color: var(--nb-alert-accent);
}

/* Error */
.nb-alert--error.nb-alert--solid {
  --nb-alert-bg: var(--nb-error);
  --nb-alert-fg: var(--nb-error-content);
  --nb-alert-accent: var(--nb-error);
  --nb-alert-border: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
  border-inline-start-color: var(--nb-alert-accent);
}

/* Info */
.nb-alert--info.nb-alert--solid {
  --nb-alert-bg: var(--nb-info);
  --nb-alert-fg: var(--nb-info-content);
  --nb-alert-accent: var(--nb-info);
  --nb-alert-border: color-mix(in oklch, var(--nb-info-content) 20%, transparent);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
  border-inline-start-color: var(--nb-alert-accent);
}

/* Secondary */
.nb-alert--secondary.nb-alert--solid {
  --nb-alert-bg: var(--nb-secondary);
  --nb-alert-fg: var(--nb-secondary-content);
  --nb-alert-accent: var(--nb-secondary);
  --nb-alert-border: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
  border-inline-start-color: var(--nb-alert-accent);
}

/* Neutral（默认） */
.nb-alert--neutral,
.nb-alert:not([class*="nb-alert--"]) {
  --nb-alert-bg: var(--nb-base-200);
  --nb-alert-fg: var(--nb-base-content);
  --nb-alert-accent: var(--nb-base-content);
  --nb-alert-border: var(--nb-border);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
  border-inline-start-color: var(--nb-alert-accent);
}
```

#### 7.2.2 Soft 外观

```css
.nb-alert--soft.nb-alert--primary {
  --nb-alert-bg: color-mix(in oklch, var(--nb-primary) 10%, var(--nb-base-100));
  --nb-alert-fg: var(--nb-base-content);
  --nb-alert-accent: var(--nb-primary);
  --nb-alert-border: var(--nb-border);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
  border-inline-start-color: var(--nb-alert-accent);
}

.nb-alert--soft.nb-alert--success {
  --nb-alert-bg: color-mix(in oklch, var(--nb-success) 10%, var(--nb-base-100));
  --nb-alert-accent: var(--nb-success);
}

.nb-alert--soft.nb-alert--warning {
  --nb-alert-bg: color-mix(in oklch, var(--nb-warning) 10%, var(--nb-base-100));
  --nb-alert-accent: var(--nb-warning);
}

.nb-alert--soft.nb-alert--error {
  --nb-alert-bg: color-mix(in oklch, var(--nb-error) 10%, var(--nb-base-100));
  --nb-alert-accent: var(--nb-error);
}

.nb-alert--soft.nb-alert--info {
  --nb-alert-bg: color-mix(in oklch, var(--nb-info) 10%, var(--nb-base-100));
  --nb-alert-accent: var(--nb-info);
}

.nb-alert--soft.nb-alert--secondary {
  --nb-alert-bg: color-mix(in oklch, var(--nb-secondary) 10%, var(--nb-base-100));
  --nb-alert-accent: var(--nb-secondary);
}

.nb-alert--soft.nb-alert--neutral {
  --nb-alert-bg: var(--nb-base-100);
  --nb-alert-accent: var(--nb-base-content);
}
```

#### 7.2.3 Outline 外观

```css
.nb-alert--outline {
  --nb-alert-bg: transparent;
  --nb-alert-fg: var(--nb-base-content);
  --nb-alert-border: var(--nb-border);
  
  background-color: var(--nb-alert-bg);
  color: var(--nb-alert-fg);
  border-color: var(--nb-alert-border);
}

.nb-alert--outline.nb-alert--primary { border-inline-start-color: var(--nb-primary); }
.nb-alert--outline.nb-alert--success { border-inline-start-color: var(--nb-success); }
.nb-alert--outline.nb-alert--warning { border-inline-start-color: var(--nb-warning); }
.nb-alert--outline.nb-alert--error { border-inline-start-color: var(--nb-error); }
.nb-alert--outline.nb-alert--info { border-inline-start-color: var(--nb-info); }
.nb-alert--outline.nb-alert--secondary { border-inline-start-color: var(--nb-secondary); }
.nb-alert--outline.nb-alert--neutral { border-inline-start-color: var(--nb-base-content); }
```

### 7.3 Hover 颜色微调（仅可交互 Alert）

使用 `color-mix` 实现 hover/active 状态的背景色微调，避免硬编码颜色：

```css
.nb-alert--interactive:hover {
  background-color: color-mix(in oklch, var(--nb-alert-bg) 90%, var(--nb-base-100));
}

.nb-alert--interactive:active {
  background-color: color-mix(in oklch, var(--nb-alert-bg) 110%, var(--nb-base-300));
}
```

- **Hover**：向浅色（`--nb-base-100`）混合 10%，产生轻微提亮效果。
- **Active**：向深色（`--nb-base-300`）混合 10%，产生轻微压暗效果。
- 所有变体共用同一套 `color-mix` 公式，无需逐个定义。

---

## 8. 可访问性要求

### 8.1 键盘可操作性

| 要求 | 实现 | 说明 |
|------|------|------|
| **Tab 顺序** | 关闭按钮和操作按钮可聚焦 | 普通 Alert 本身不可聚焦，除非使用 `tabindex="0"`（动态内容时使用）。 |
| **Enter / Space** | 关闭按钮触发关闭 | 关闭按钮使用 `<button>` 元素，确保键盘触发。 |
| **方向键** | N/A | Alert 不是导航组件，不响应方向键。 |
| **Esc** | 可选 | 可关闭 Alert（`.nb-alert--dismissible`）时，按 `Esc` 关闭整个 Alert。 |

```javascript
// Esc 关闭示例（JS 辅助）
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeAlert = document.querySelector('.nb-alert--dismissible:focus-within');
    if (activeAlert) {
      activeAlert.remove(); // 或隐藏
    }
  }
});
```

### 8.2 Focus Visible 样式

```css
.nb-alert:focus-visible,
.nb-alert--interactive:focus-visible,
.nb-alert__close:focus-visible,
.nb-alert__actions button:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

/* 内部按钮遵循 Button 规范 */
.nb-alert__actions .nb-btn:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

/* 关闭按钮独立焦点样式 */
.nb-alert__close:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  background-color: var(--nb-base-300);
}
```

### 8.3 ARIA 属性

```html
<!-- 静态提示（非紧急） -->
<div class="nb-alert nb-alert--info" role="alert" aria-live="polite">
  ...
</div>

<!-- 错误提示（紧急，需立即朗读） -->
<div class="nb-alert nb-alert--error" role="alert" aria-live="assertive" aria-atomic="true">
  ...
</div>

<!-- 可关闭提示 -->
<div class="nb-alert nb-alert--warning nb-alert--dismissible" role="alert" aria-live="polite">
  <button class="nb-alert__close" aria-label="关闭警告提示" type="button">✕</button>
  ...
</div>

<!-- 加载中提示 -->
<div class="nb-alert nb-alert--info" role="alert" aria-live="polite" aria-busy="true">
  ...
</div>
```

### 8.4 RTL 适配

使用 **Logical Properties**（逻辑属性）确保 Alert 在 RTL 布局下自动适配：

```css
.nb-alert {
  border-inline-start-width: 3px; /* 替代 border-left-width */
  border-inline-start-color: var(--nb-alert-accent); /* 替代 border-left-color */
  padding-inline-start: 1.25rem; /* 替代 padding-left */
  padding-inline-end: 1.25rem; /* 替代 padding-right */
}

.nb-alert__icon {
  margin-inline-end: 0.75rem; /* 替代 margin-right */
}

.nb-alert__actions {
  margin-inline-start: auto; /* 替代 margin-left: auto（在 LTR 中靠右） */
}

.nb-alert__close {
  margin-inline-start: 0.75rem; /* 替代 margin-left */
}
```

在 RTL 模式下（`dir="rtl"` 或 `html[dir="rtl"]`），`inline-start` 自动映射到右侧，`inline-end` 自动映射到左侧，左侧强调边框（accent）正确出现在右侧。

### 8.5 prefers-reduced-motion

当用户启用减少动画时，取消 Alert 的所有位移动画，保留即时阴影和颜色切换：

```css
@media (prefers-reduced-motion: reduce) {
  .nb-alert,
  .nb-alert--interactive,
  .nb-alert--interactive:hover,
  .nb-alert--interactive:active {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }

  .nb-alert--interactive:hover {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color); /* 即时切换，无过渡 */
  }

  .nb-alert--interactive:active {
    box-shadow: var(--nb-shadow-none); /* 即时切换 */
  }

  /* Loading 动画替换为静态 */
  .nb-alert.is-loading::after,
  .nb-alert[aria-busy="true"]::after {
    animation: none;
    opacity: 1;
  }
}
```

### 8.6 forced-colors（高对比度模式）

在 `forced-colors: active`（Windows 高对比度模式）下：

```css
@media (forced-colors: active) {
  .nb-alert {
    border: 2px solid currentColor; /* 边框始终可见 */
    box-shadow: none; /* 阴影在高对比度模式下消失 */
  }

  .nb-alert--soft,
  .nb-alert--solid {
    background-color: Canvas; /* 使用系统背景色 */
    color: CanvasText; /* 使用系统文本色 */
  }

  .nb-alert:focus-visible,
  .nb-alert--interactive:focus-visible,
  .nb-alert__close:focus-visible {
    outline: 2px solid Highlight; /* 使用系统高对比焦点色 */
    outline-offset: 2px;
  }

  .nb-alert__icon {
    forced-color-adjust: none; /* 保留图标颜色 */
  }
}
```

### 8.7 移动端可用性（320px）

| 检查项 | 要求 | 实现 |
|--------|------|------|
| 最小宽度 | 320px 视口下不溢出 | `min-width: 0; max-width: 100%;` |
| 文本换行 | 长文本自动换行 | `word-wrap: break-word; overflow-wrap: break-word;` |
| 图标尺寸 | 触摸目标 ≥ 44×44px | 图标区域 `min-width: 44px; min-height: 44px;` |
| 关闭按钮 | 触摸目标 ≥ 44×44px | 关闭按钮 `min-width: 44px; min-height: 44px;` |
| 操作按钮 | 触摸目标 ≥ 44×44px | 遵循 Button 规范 |

```css
.nb-alert {
  min-width: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.nb-alert__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem; /* 44px */
  min-height: 2.75rem; /* 44px */
}

.nb-alert__close {
  min-width: 2.75rem; /* 44px */
  min-height: 2.75rem; /* 44px */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### 8.8 200% 缩放测试

- 浏览器缩放至 200% 时，Alert 文本可读性保持正常。
- 最小可点击区域在缩放后仍 ≥ 44×44px（CSS 像素）。
- 阴影和边框在缩放后保持清晰，无模糊。
- 使用 `rem` 单位确保随字体缩放而缩放。

---

## 9. 完整 CSS 示例

以下代码可直接复制到 Neo-Brutal UI 组件库的 `@layer` 中。包含所有状态、变体、尺寸和可访问性支持。

```css
/* =============================================
   Neo-Brutal UI — Alert Component
   ============================================= */

@layer nb-components {
  /* -----------------------------------------
     1. 基础结构与默认尺寸（md）
     ----------------------------------------- */
  .nb-alert {
    /* 布局 */
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    
    /* 尺寸（md 默认） */
    padding: 0.75rem 1.25rem;
    min-height: 3rem;
    
    /* 字体 */
    font-family: var(--nb-font-sans);
    font-size: 0.875rem;
    line-height: 1.5;
    
    /* 颜色（Neutral 默认） */
    --nb-alert-bg: var(--nb-base-200);
    --nb-alert-fg: var(--nb-base-content);
    --nb-alert-accent: var(--nb-base-content);
    --nb-alert-border: var(--nb-border);
    
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    
    /* 边框 */
    border: 2px solid var(--nb-alert-border);
    border-inline-start-width: 3px;
    border-inline-start-color: var(--nb-alert-accent);
    border-radius: var(--nb-radius-box); /* 0px */
    
    /* 阴影 */
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    
    /* 过渡 */
    transition: transform var(--nb-duration-normal) var(--nb-ease-brutal),
                box-shadow var(--nb-duration-normal) var(--nb-ease-brutal),
                background-color var(--nb-duration-fast) var(--nb-ease-standard),
                border-color var(--nb-duration-fast) var(--nb-ease-standard);
    
    /* 文本 */
    word-wrap: break-word;
    overflow-wrap: break-word;
    
    /* 重置 */
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* -----------------------------------------
     2. 子元素
     ----------------------------------------- */
  .nb-alert__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    min-width: 2.75rem; /* 44px 触摸目标 */
    min-height: 2.75rem;
    font-size: 1.125rem;
    line-height: 1;
    color: inherit;
  }

  .nb-alert__icon svg {
    width: 1.125rem;
    height: 1.125rem;
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 2px;
  }

  .nb-alert__content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1 1 auto;
    min-width: 0; /* 防止 flex 子元素溢出 */
  }

  .nb-alert__title {
    font-weight: var(--nb-weight-semibold); /* 600 */
    font-size: 0.875rem;
    line-height: 1.25;
    color: inherit;
  }

  .nb-alert__description {
    font-weight: var(--nb-weight-normal); /* 400 */
    font-size: 0.875rem;
    line-height: 1.5;
    color: inherit;
    opacity: 0.9; /* 描述文本稍淡 */
  }

  .nb-alert__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    margin-inline-start: auto; /* 靠右对齐 */
  }

  .nb-alert__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.75rem; /* 44px 触摸目标 */
    min-height: 2.75rem;
    padding: 0;
    margin-inline-start: 0.75rem;
    background: none;
    border: 2px solid transparent;
    border-radius: var(--nb-radius-field); /* 0px */
    color: inherit;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    transition: background-color var(--nb-duration-fast) var(--nb-ease-standard),
                border-color var(--nb-duration-fast) var(--nb-ease-standard);
    flex-shrink: 0;
  }

  .nb-alert__close:hover {
    background-color: var(--nb-base-300);
    border-color: var(--nb-border);
  }

  .nb-alert__close:active {
    background-color: var(--nb-base-200);
    transform: translate(1px, 1px); /* 轻微按下反馈 */
  }

  .nb-alert__close:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  /* -----------------------------------------
     3. 尺寸变体
     ----------------------------------------- */
  .nb-alert--xs {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
    min-height: 2rem;
    font-size: 0.75rem;
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }
  .nb-alert--xs .nb-alert__icon {
    min-width: 2rem;
    min-height: 2rem;
    font-size: 0.875rem;
  }
  .nb-alert--xs .nb-alert__icon svg {
    width: 0.875rem;
    height: 0.875rem;
  }
  .nb-alert--xs .nb-alert__title,
  .nb-alert--xs .nb-alert__description {
    font-size: 0.75rem;
  }
  .nb-alert--xs .nb-alert__close {
    min-width: 2rem;
    min-height: 2rem;
    font-size: 0.875rem;
  }

  .nb-alert--sm {
    padding: 0.625rem 1rem;
    gap: 0.625rem;
    min-height: 2.5rem;
    font-size: 0.8125rem;
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }
  .nb-alert--sm .nb-alert__icon {
    min-width: 2.25rem;
    min-height: 2.25rem;
    font-size: 1rem;
  }
  .nb-alert--sm .nb-alert__icon svg {
    width: 1rem;
    height: 1rem;
  }
  .nb-alert--sm .nb-alert__title,
  .nb-alert--sm .nb-alert__description {
    font-size: 0.8125rem;
  }
  .nb-alert--sm .nb-alert__close {
    min-width: 2.25rem;
    min-height: 2.25rem;
    font-size: 0.875rem;
  }

  .nb-alert--lg {
    padding: 1rem 1.5rem;
    gap: 1rem;
    min-height: 3.5rem;
  }
  .nb-alert--lg .nb-alert__icon {
    min-width: 3rem;
    min-height: 3rem;
    font-size: 1.25rem;
  }
  .nb-alert--lg .nb-alert__icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .nb-alert--lg .nb-alert__title {
    font-size: 1rem;
  }

  .nb-alert--xl {
    padding: 1.25rem 2rem;
    gap: 1.25rem;
    min-height: 4rem;
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  }
  .nb-alert--xl .nb-alert__icon {
    min-width: 3.5rem;
    min-height: 3.5rem;
    font-size: 1.5rem;
  }
  .nb-alert--xl .nb-alert__icon svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  .nb-alert--xl .nb-alert__title {
    font-size: 1.125rem;
  }
  .nb-alert--xl .nb-alert__description {
    font-size: 1rem;
  }

  /* -----------------------------------------
     4. 颜色变体 — Solid（默认）
     ----------------------------------------- */
  .nb-alert--primary.nb-alert--solid {
    --nb-alert-bg: var(--nb-primary);
    --nb-alert-fg: var(--nb-primary-content);
    --nb-alert-accent: var(--nb-primary);
    --nb-alert-border: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    border-color: var(--nb-alert-border);
    border-inline-start-color: var(--nb-alert-accent);
  }

  .nb-alert--secondary.nb-alert--solid {
    --nb-alert-bg: var(--nb-secondary);
    --nb-alert-fg: var(--nb-secondary-content);
    --nb-alert-accent: var(--nb-secondary);
    --nb-alert-border: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    border-color: var(--nb-alert-border);
    border-inline-start-color: var(--nb-alert-accent);
  }

  .nb-alert--info.nb-alert--solid {
    --nb-alert-bg: var(--nb-info);
    --nb-alert-fg: var(--nb-info-content);
    --nb-alert-accent: var(--nb-info);
    --nb-alert-border: color-mix(in oklch, var(--nb-info-content) 20%, transparent);
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    border-color: var(--nb-alert-border);
    border-inline-start-color: var(--nb-alert-accent);
  }

  .nb-alert--success.nb-alert--solid {
    --nb-alert-bg: var(--nb-success);
    --nb-alert-fg: var(--nb-success-content);
    --nb-alert-accent: var(--nb-success);
    --nb-alert-border: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    border-color: var(--nb-alert-border);
    border-inline-start-color: var(--nb-alert-accent);
  }

  .nb-alert--warning.nb-alert--solid {
    --nb-alert-bg: var(--nb-warning);
    --nb-alert-fg: var(--nb-warning-content);
    --nb-alert-accent: var(--nb-warning);
    --nb-alert-border: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    border-color: var(--nb-alert-border);
    border-inline-start-color: var(--nb-alert-accent);
  }

  .nb-alert--error.nb-alert--solid {
    --nb-alert-bg: var(--nb-error);
    --nb-alert-fg: var(--nb-error-content);
    --nb-alert-accent: var(--nb-error);
    --nb-alert-border: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    border-color: var(--nb-alert-border);
    border-inline-start-color: var(--nb-alert-accent);
  }

  /* -----------------------------------------
     5. 颜色变体 — Soft
     ----------------------------------------- */
  .nb-alert--soft {
    --nb-alert-bg: var(--nb-base-100);
    --nb-alert-fg: var(--nb-base-content);
    --nb-alert-border: var(--nb-border);
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    border-color: var(--nb-alert-border);
  }

  .nb-alert--soft.nb-alert--primary {
    --nb-alert-bg: color-mix(in oklch, var(--nb-primary) 10%, var(--nb-base-100));
    --nb-alert-accent: var(--nb-primary);
  }
  .nb-alert--soft.nb-alert--secondary {
    --nb-alert-bg: color-mix(in oklch, var(--nb-secondary) 10%, var(--nb-base-100));
    --nb-alert-accent: var(--nb-secondary);
  }
  .nb-alert--soft.nb-alert--info {
    --nb-alert-bg: color-mix(in oklch, var(--nb-info) 10%, var(--nb-base-100));
    --nb-alert-accent: var(--nb-info);
  }
  .nb-alert--soft.nb-alert--success {
    --nb-alert-bg: color-mix(in oklch, var(--nb-success) 10%, var(--nb-base-100));
    --nb-alert-accent: var(--nb-success);
  }
  .nb-alert--soft.nb-alert--warning {
    --nb-alert-bg: color-mix(in oklch, var(--nb-warning) 10%, var(--nb-base-100));
    --nb-alert-accent: var(--nb-warning);
  }
  .nb-alert--soft.nb-alert--error {
    --nb-alert-bg: color-mix(in oklch, var(--nb-error) 10%, var(--nb-base-100));
    --nb-alert-accent: var(--nb-error);
  }
  .nb-alert--soft.nb-alert--neutral {
    --nb-alert-bg: var(--nb-base-100);
    --nb-alert-accent: var(--nb-base-content);
  }

  /* -----------------------------------------
     6. 颜色变体 — Outline
     ----------------------------------------- */
  .nb-alert--outline {
    --nb-alert-bg: transparent;
    --nb-alert-fg: var(--nb-base-content);
    --nb-alert-border: var(--nb-border);
    background-color: var(--nb-alert-bg);
    color: var(--nb-alert-fg);
    border-color: var(--nb-alert-border);
  }

  .nb-alert--outline.nb-alert--primary { border-inline-start-color: var(--nb-primary); }
  .nb-alert--outline.nb-alert--secondary { border-inline-start-color: var(--nb-secondary); }
  .nb-alert--outline.nb-alert--info { border-inline-start-color: var(--nb-info); }
  .nb-alert--outline.nb-alert--success { border-inline-start-color: var(--nb-success); }
  .nb-alert--outline.nb-alert--warning { border-inline-start-color: var(--nb-warning); }
  .nb-alert--outline.nb-alert--error { border-inline-start-color: var(--nb-error); }
  .nb-alert--outline.nb-alert--neutral { border-inline-start-color: var(--nb-base-content); }

  /* -----------------------------------------
     7. 布局变体
     ----------------------------------------- */
  .nb-alert--full-width {
    width: 100%;
  }

  .nb-alert--no-icon .nb-alert__icon {
    display: none;
  }

  .nb-alert--dismissible {
    padding-inline-end: 0.5rem; /* 为关闭按钮预留空间 */
  }

  /* -----------------------------------------
     8. 交互状态（仅 .nb-alert--interactive）
     ----------------------------------------- */
  .nb-alert--interactive {
    cursor: pointer;
    text-decoration: none;
  }

  @media (hover: hover) and (pointer: fine) {
    .nb-alert--interactive:hover {
      box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
      transform: translate(-2px, -2px);
      background-color: color-mix(in oklch, var(--nb-alert-bg) 90%, var(--nb-base-100));
    }
  }

  .nb-alert--interactive:active {
    box-shadow: var(--nb-shadow-none);
    transform: translate(4px, 4px);
    background-color: color-mix(in oklch, var(--nb-alert-bg) 110%, var(--nb-base-300));
  }

  .nb-alert--interactive:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  .nb-alert--interactive:hover:focus-visible {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  /* -----------------------------------------
     9. Loading 状态
     ----------------------------------------- */
  .nb-alert.is-loading,
  .nb-alert[aria-busy="true"] {
    position: relative;
    pointer-events: none;
    cursor: wait;
  }

  .nb-alert.is-loading .nb-alert__content,
  .nb-alert[aria-busy="true"] .nb-alert__content {
    visibility: hidden;
  }

  .nb-alert.is-loading::after,
  .nb-alert[aria-busy="true"]::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--nb-base-200);
    border-top-color: var(--nb-alert-accent, var(--nb-primary));
    border-radius: 50%;
    animation: nb-spin 1s linear infinite;
    transform: translate(-50%, -50%);
  }

  @keyframes nb-spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  /* -----------------------------------------
     10. 可访问性增强
     ----------------------------------------- */
  
  /* prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    .nb-alert,
    .nb-alert--interactive,
    .nb-alert--interactive:hover,
    .nb-alert--interactive:active {
      transition: none !important;
      transform: none !important;
      animation: none !important;
    }

    .nb-alert--interactive:hover {
      box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    }

    .nb-alert--interactive:active {
      box-shadow: var(--nb-shadow-none);
    }

    .nb-alert.is-loading::after,
    .nb-alert[aria-busy="true"]::after {
      animation: none;
      opacity: 1;
    }
  }

  /* forced-colors */
  @media (forced-colors: active) {
    .nb-alert {
      border: 2px solid currentColor;
      box-shadow: none;
    }

    .nb-alert--soft,
    .nb-alert--solid {
      background-color: Canvas;
      color: CanvasText;
    }

    .nb-alert:focus-visible,
    .nb-alert--interactive:focus-visible,
    .nb-alert__close:focus-visible {
      outline: 2px solid Highlight;
      outline-offset: 2px;
    }

    .nb-alert__icon {
      forced-color-adjust: none;
    }
  }
}
```

### 9.1 HTML 示例代码

```html
<!-- =======================================
     1. 基础 Alert — 信息提示
     ======================================= -->
<div class="nb-alert nb-alert--info" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  </div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">系统通知</div>
    <div class="nb-alert__description">新功能已上线，前往设置页面开启体验。</div>
  </div>
</div>

<!-- =======================================
     2. 成功 Alert — 紧凑尺寸
     ======================================= -->
<div class="nb-alert nb-alert--sm nb-alert--success" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">✓</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">保存成功</div>
  </div>
</div>

<!-- =======================================
     3. 警告 Alert — 可关闭 + 操作按钮
     ======================================= -->
<div class="nb-alert nb-alert--warning nb-alert--dismissible" role="alert" aria-live="polite">
  <div class="nb-alert__icon" aria-hidden="true">⚠</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">存储空间即将用尽</div>
    <div class="nb-alert__description">您的账户存储空间已使用 92%，建议立即清理或升级。</div>
  </div>
  <div class="nb-alert__actions">
    <button class="nb-btn nb-btn--sm nb-btn--primary">升级空间</button>
  </div>
  <button class="nb-alert__close" aria-label="关闭警告" type="button">
    <span aria-hidden="true">✕</span>
  </button>
</div>

<!-- =======================================
     4. 错误 Alert — 高优先级
     ======================================= -->
<div class="nb-alert nb-alert--error" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="nb-alert__icon" aria-hidden="true">✕</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">提交失败</div>
    <div class="nb-alert__description">表单验证未通过，请检查以下字段：邮箱格式、密码强度。</div>
  </div>
</div>

<!-- =======================================
     5. 可交互 Alert — 营销提示
     ======================================= -->
<a class="nb-alert nb-alert--interactive nb-alert--primary nb-alert--lg" href="/upgrade" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">🚀</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">升级至 Pro 版本</div>
    <div class="nb-alert__description">解锁无限存储、高级分析、团队协作等功能。</div>
  </div>
  <div class="nb-alert__actions">
    <span class="nb-btn nb-btn--primary nb-btn--sm">立即升级 →</span>
  </div>
</a>

<!-- =======================================
     6. Soft 外观 — 柔和信息提示
     ======================================= -->
<div class="nb-alert nb-alert--soft nb-alert--info" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  </div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">温馨提示</div>
    <div class="nb-alert__description">本功能将于下周正式上线，敬请期待。</div>
  </div>
</div>

<!-- =======================================
     7. Outline 外观 — 轻量提示
     ======================================= -->
<div class="nb-alert nb-alert--outline nb-alert--neutral" role="alert">
  <div class="nb-alert__content">
    <div class="nb-alert__description">当前页面数据每小时自动保存一次。</div>
  </div>
</div>

<!-- =======================================
     8. 加载中 Alert
     ======================================= -->
<div class="nb-alert nb-alert--info" role="alert" aria-live="polite" aria-busy="true">
  <div class="nb-alert__content">
    <div class="nb-alert__title">正在加载数据...</div>
    <div class="nb-alert__description">请稍候，预计需要 10-15 秒。</div>
  </div>
</div>

<!-- =======================================
     9. 超大尺寸 — 全宽营销 Banner
     ======================================= -->
<div class="nb-alert nb-alert--xl nb-alert--full-width nb-alert--primary nb-alert--interactive" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">🎉</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">限时优惠：年度订阅五折</div>
    <div class="nb-alert__description">截至 2025 年 12 月 31 日，新老用户均可享受半价优惠。</div>
  </div>
  <div class="nb-alert__actions">
    <button class="nb-btn nb-btn--primary">立即抢购</button>
  </div>
</div>

<!-- =======================================
     10. RTL 适配示例
     ======================================= -->
<div dir="rtl" class="nb-alert nb-alert--success" role="alert">
  <div class="nb-alert__icon" aria-hidden="true">✓</div>
  <div class="nb-alert__content">
    <div class="nb-alert__title">تم الحفظ بنجاح</div>
    <div class="nb-alert__description">تم حفظ التغييرات الخاصة بك.</div>
  </div>
</div>
```

---

## 10. 检查清单

以下验收项必须与全局设计系统（阶段 2.7 验收标准）对齐。Alert 组件实现前必须通过全部检查。

### 10.1 品牌与命名

- [ ] 类名前缀为 `nb-`，无冲突。
- [ ] 组件根类名为 `.nb-alert`，子元素使用 BEM 命名（`__icon`、`__content` 等）。
- [ ] 修饰符类名使用 `--` 连接（`--primary`、`--sm`、`--soft` 等）。
- [ ] 无无前缀的通用类名（如 `.alert`、`.icon`）。

### 10.2 视觉铁律

- [ ] 所有边框为 `2px solid`，无 `1px` 或 `3px`（除 inline-start accent 外）。
- [ ] 左侧强调边框为 `3px solid`（`border-inline-start-width: 3px`）。
- [ ] 圆角为 `0px`（直角），无例外。
- [ ] 阴影使用硬阴影（`blur = 0`、`spread = 0`），无模糊半径。
- [ ] 阴影颜色使用 `color-mix(in oklch, ...)` 而非 `#000`。
- [ ] 无渐变背景（`linear-gradient`、`radial-gradient`），纯色优先。
- [ ] 无噪点/纹理背景。
- [ ] 图标线条宽度 ≥ 2px（若使用 SVG stroke）。

### 10.3 阴影与位移

- [ ] Default 阴影使用 `--nb-shadow-md`（xs/sm 尺寸使用 `--nb-shadow-sm`）。
- [ ] Hover 阴影升至 `--nb-shadow-lg`（xs/sm 升至 `--nb-shadow-md`）。
- [ ] Active 阴影归零（`--nb-shadow-none`）。
- [ ] 位移使用 `transform: translate()`，非 `margin` 或 `position`。
- [ ] Hover 位移为 `(-2px, -2px)`，Active 位移为 `(4px, 4px)`（md 默认）。
- [ ] 过渡时长 ≤ 150ms（标准状态），缓动使用 `cubic-bezier(0.4, 0, 0.2, 1)` 或 `cubic-bezier(0.25, 0.1, 0.25, 1.0)`。
- [ ] 非交互式 Alert 无 Hover/Active 位移。

### 10.4 圆角与边框

- [ ] 使用 `--nb-radius-box`（`0px`）。
- [ ] 边框颜色使用 `color-mix` 动态计算，基于 `var(--nb-base-content)` 或变体内容色。
- [ ] 无圆角例外（Alert 不允许任何圆角）。

### 10.5 颜色策略

- [ ] 所有颜色使用语义 Token（`--nb-primary`、`--nb-error` 等），无硬编码 `#hex`。
- [ ] Hover/Active 背景微调使用 `color-mix(in oklch, ...)`，无硬编码。
- [ ] 每个变体定义了完整的背景色、文本色、边框色、强调色。
- [ ] Soft 外观使用 `color-mix` 生成低饱和度背景（10% 混合）。
- [ ] Outline 外观背景为 `transparent`。

### 10.6 状态矩阵

- [ ] Default 状态完整定义。
- [ ] Hover 状态仅对 `.nb-alert--interactive` 生效，普通 Alert 无 Hover 反馈。
- [ ] Active 状态仅对 `.nb-alert--interactive` 生效。
- [ ] Focus Visible 使用 `2px solid var(--nb-focus)`，`outline-offset: 2px`。
- [ ] Disabled 标记为 **N/A**（Alert 不可禁用）。
- [ ] Loading 状态使用 `aria-busy`，内容隐藏，显示 spinner，尺寸不变。
- [ ] Invalid 标记为 **N/A**（使用 error 变体替代）。
- [ ] Valid 标记为 **N/A**。
- [ ] Selected / Checked 标记为 **N/A**。
- [ ] Open / Expanded 标记为 **N/A**。
- [ ] Readonly 标记为 **N/A**。

### 10.7 可访问性

- [ ] 键盘可操作：关闭按钮和内部按钮可 `Tab` 聚焦，`Enter`/`Space` 触发。
- [ ] 使用 `role="alert"` 标识提示组件。
- [ ] 动态内容使用 `aria-live="polite"` 或 `aria-live="assertive"`。
- [ ] 关闭按钮使用 `aria-label` 描述。
- [ ] 图标使用 `aria-hidden="true"`。
- [ ] RTL 适配：使用 `border-inline-start`、`margin-inline-start` 等逻辑属性。
- [ ] `prefers-reduced-motion`：取消 transform 位移，保留即时 box-shadow 切换。
- [ ] `forced-colors`：边框使用 `currentColor`，背景使用 `Canvas`，焦点使用 `Highlight`。
- [ ] 320px 移动端可用：最小宽度不溢出，文本换行正常，触摸目标 ≥ 44×44px。
- [ ] 200% 缩放测试通过：文本可读，阴影清晰，边框可见。

### 10.8 代码质量

- [ ] 使用 `@layer nb-components` 包裹。
- [ ] 使用 CSS 变量（`--nb-*`），无魔法数字。
- [ ] 使用 `rem` 单位，确保可缩放。
- [ ] 无 `!important`（除 `prefers-reduced-motion` 覆盖外）。
- [ ] 使用 `will-change: transform, box-shadow` 优化性能（仅交互式 Alert）。

---

> **文档版本**：v1.0  
> **组件**：Alert（`nb-alert`）  
> **类别**：Box  
> **最后更新**：2025 年 6 月  
> **维护者**：Neo-Brutal UI 设计系统团队  
> **审核状态**：待技术评审（Tech Review）  
> **依赖规范**：`brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md`
