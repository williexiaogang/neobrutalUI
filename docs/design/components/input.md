# Input 组件设计基准稿

> 本文档定义 Neo-Brutal UI 中 Input（文本输入框）组件的完整设计规范。所有 Token、CSS 变量与行为规则必须在此文档中明确后方可进入组件实现阶段。
>
> **适用范围**：Input 组件及其所有变体（尺寸、颜色、外观）、A11y 适配、状态系统。
> **依赖全局规范**：`brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md`。

---

## 1. 组件概述

### 1.1 组件名称和用途

| 属性 | 值 |
|------|-----|
| **组件名称** | Input（文本输入框） |
| **用途** | 接收用户单行文本输入。支持文本、密码、邮箱、数字、搜索等多种 `type` 变体。 |
| **对应语义 HTML 元素** | `<input>` |
| **核心类名** | `nb-input` |
| **修饰类名模式** | `nb-input--{size}`、`nb-input--{variant}`、`nb-input--{state}` |

### 1.2 组件分类

Input 属于 **Field 类别**（详见 `radius-and-borders.md`）。按组件物理层级，Input 承载于 **Surface**（`--nb-base-200`）之上，其自身背景为 **Page**（`--nb-base-100`），以形成"可填写区域"与"容器表面"的层级对比。

---

## 2. DOM Contract

### 2.1 推荐的 HTML 结构

```html
<!-- 基础输入框 -->
<input type="text" class="nb-input" placeholder="请输入内容" />

<!-- 带标签的输入框（推荐包裹结构） -->
<div class="nb-field">
  <label class="nb-label" for="username">用户名</label>
  <input
    type="text"
    id="username"
    class="nb-input"
    placeholder="请输入用户名"
    aria-describedby="username-help"
  />
  <span id="username-help" class="nb-help-text">用户名长度为 3-20 个字符。</span>
</div>

<!-- 错误状态 -->
<div class="nb-field">
  <label class="nb-label" for="email">邮箱</label>
  <input
    type="email"
    id="email"
    class="nb-input nb-input--invalid"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" class="nb-error-text" role="alert">请输入有效的邮箱地址。</span>
</div>

<!-- 带图标的输入框（前置图标） -->
<div class="nb-input-wrapper">
  <span class="nb-input__icon nb-input__icon--start" aria-hidden="true">
    <svg><!-- 搜索图标 --></svg>
  </span>
  <input
    type="search"
    class="nb-input nb-input--has-icon-start"
    placeholder="搜索..."
  />
</div>
```

### 2.2 必需子元素与可选子元素

| 类型 | 元素 | 说明 |
|------|------|------|
| **必需** | `<input>` | 核心输入元素，必须包含 `class="nb-input"` |
| **可选** | `<label>` | 表单标签，通过 `for` 属性与 input `id` 关联 |
| **可选** | 帮助文本（`.nb-help-text`） | 通过 `aria-describedby` 与 input 关联 |
| **可选** | 错误文本（`.nb-error-text`） | 错误状态时通过 `aria-describedby` 与 input 关联，需设置 `role="alert"` |
| **可选** | 图标容器（`.nb-input__icon`） | 前置或后置图标，需配合 `nb-input--has-icon-start` / `nb-input--has-icon-end` 使用 |

### 2.3 ARIA 属性要求

| 属性 | 场景 | 值 |
|------|------|-----|
| `aria-invalid` | 验证失败时 | `"true"` |
| `aria-describedby` | 有关联的帮助/错误文本时 | 指向帮助文本或错误文本的 `id` |
| `aria-required` | 必填字段 | `"true"`（或直接使用 HTML5 `required` 属性） |
| `aria-disabled` | 禁用状态（非原生 `disabled` 时） | `"true"` |
| `aria-readonly` | 只读状态（非原生 `readonly` 时） | `"true"` |
| `aria-busy` | 加载状态 | `"true"` |

### 2.4 键盘行为

| 按键 | 行为 |
|------|------|
| `Tab` | 聚焦到输入框，触发 `:focus-visible` 样式。按 Tab 顺序在表单元素间导航。 |
| `Shift + Tab` | 反向导航，聚焦到上一个可聚焦元素。 |
| `Enter` | 在表单内的 Input 中按 Enter 触发表单提交（默认浏览器行为）。 |
| `Space` | 输入空格字符（不作为激活键）。 |
| `Escape` | 清除输入内容（可选，需 JS 实现）或关闭关联的下拉面板。 |

---

## 3. 尺寸与变体

### 3.1 尺寸定义

Input 提供 5 个尺寸等级。所有尺寸均保持最小可点击区域 ≥ 44×44px（触摸设备 ≥ 48×48px）。

| 尺寸 | 类名 | 高度（min-height） | 纵向 Padding（block） | 横向 Padding（inline） | 字体大小 | 图标大小 |
|------|------|---------------------|------------------------|-------------------------|----------|----------|
| **xs** | `nb-input--xs` | `1.75rem`（28px） | `0.25rem`（4px） | `0.5rem`（8px） | `0.75rem`（12px） | `0.875rem` |
| **sm** | `nb-input--sm` | `2rem`（32px） | `0.375rem`（6px） | `0.625rem`（10px） | `0.8125rem`（13px） | `1rem` |
| **md**（默认） | `nb-input--md` | `2.5rem`（40px） | `0.5rem`（8px） | `0.75rem`（12px） | `0.875rem`（14px） | `1.125rem` |
| **lg** | `nb-input--lg` | `3rem`（48px） | `0.625rem`（10px） | `1rem`（16px） | `1rem`（16px） | `1.25rem` |
| **xl** | `nb-input--xl` | `3.5rem`（56px） | `0.75rem`（12px） | `1.25rem`（20px） | `1.125rem`（18px） | `1.5rem` |

### 3.2 颜色变体

| 变体 | 类名 | 背景色 | 文本色 | 边框色 | Focus 边框色 |
|------|------|--------|--------|--------|--------------|
| **默认** | `nb-input` | `--nb-base-100` | `--nb-base-content` | `--nb-border-field-color` | `--nb-primary` |
| **Primary** | `nb-input--primary` | `--nb-primary` | `--nb-primary-content` | `color-mix(in oklch, var(--nb-primary-content) 20%, transparent)` | `--nb-primary` |
| **Secondary** | `nb-input--secondary` | `--nb-secondary` | `--nb-secondary-content` | `color-mix(in oklch, var(--nb-secondary-content) 20%, transparent)` | `--nb-secondary` |
| **Neutral** | `nb-input--neutral` | `--nb-neutral` | `--nb-neutral-content` | `color-mix(in oklch, var(--nb-neutral-content) 20%, transparent)` | `--nb-neutral` |

### 3.3 外观变体

| 变体 | 类名 | 说明 |
|------|------|------|
| **Solid**（默认） | `nb-input` | 标准填充背景（`--nb-base-100`），适用于绝大多数场景。 |
| **Outline** | `nb-input--outline` | 透明背景，仅边框可见。Hover 时背景填充为 `--nb-base-100`。 |
| **Ghost** | `nb-input--ghost` | 完全透明背景，无边框或仅 1px 边框。Hover 时显示完整边框。 |
| **Link** | N/A | **Input 组件不适用** Link 外观。 |

### 3.4 布局变体

| 变体 | 类名 | 说明 |
|------|------|------|
| **Full Width** | `nb-input--full` | `width: 100%`，默认即为 `display: block` + `width: 100%`。 |
| **Square** | N/A | **Input 不适用** Square 布局（所有 Input 本质均为矩形）。 |
| **Inline** | `nb-input--inline` | `display: inline-block`，`width: auto`，用于行内表单场景。 |

### 3.5 各变体的 CSS 规则

```css
/* =============================================
   Input — 尺寸变体
   ============================================= */

.nb-input--xs {
  min-height: 1.75rem;
  padding-block: 0.25rem;
  padding-inline: 0.5rem;
  font-size: 0.75rem;
}

.nb-input--sm {
  min-height: 2rem;
  padding-block: 0.375rem;
  padding-inline: 0.625rem;
  font-size: 0.8125rem;
}

.nb-input--md {
  min-height: 2.5rem;
  padding-block: 0.5rem;
  padding-inline: 0.75rem;
  font-size: 0.875rem;
}

.nb-input--lg {
  min-height: 3rem;
  padding-block: 0.625rem;
  padding-inline: 1rem;
  font-size: 1rem;
}

.nb-input--xl {
  min-height: 3.5rem;
  padding-block: 0.75rem;
  padding-inline: 1.25rem;
  font-size: 1.125rem;
}

/* =============================================
   Input — 颜色变体
   ============================================= */

.nb-input--primary {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
}

.nb-input--primary::placeholder {
  color: color-mix(in oklch, var(--nb-primary-content) 60%, transparent);
}

.nb-input--secondary {
  background-color: var(--nb-secondary);
  color: var(--nb-secondary-content);
  border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
}

.nb-input--secondary::placeholder {
  color: color-mix(in oklch, var(--nb-secondary-content) 60%, transparent);
}

.nb-input--neutral {
  background-color: var(--nb-neutral);
  color: var(--nb-neutral-content);
  border-color: color-mix(in oklch, var(--nb-neutral-content) 20%, transparent);
}

.nb-input--neutral::placeholder {
  color: color-mix(in oklch, var(--nb-neutral-content) 60%, transparent);
}

/* =============================================
   Input — 外观变体
   ============================================= */

.nb-input--outline {
  background-color: transparent;
  border-color: var(--nb-border-field-color);
}

.nb-input--outline:hover {
  background-color: var(--nb-base-100);
}

.nb-input--ghost {
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
}

.nb-input--ghost:hover {
  border-color: var(--nb-border-field-color);
  box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
}

/* =============================================
   Input — 布局变体
   ============================================= */

.nb-input--inline {
  display: inline-block;
  width: auto;
  vertical-align: middle;
}
```

---

## 4. 状态矩阵

以下列出 Input 组件所有适用状态。对于不适用本组件的状态，明确标记为 **N/A**。

| 状态 | 边框 | 阴影 | 位移（transform） | 颜色 | 透明度 | 动画 | 光标 | 说明 |
|------|------|------|-------------------|------|--------|------|------|------|
| **Default** | 2px solid `var(--nb-border-field-color)` | `var(--nb-shadow-sm)` | `none` | 背景 `--nb-base-100`，文本 `--nb-base-content` | 1.0 | — | `text` | 基准状态 |
| **Hover** | 2px solid `color-mix(in oklch, var(--nb-base-content) 40%, transparent)` | `var(--nb-shadow-sm)` | `none` | 背景不变 | 1.0 | `border-color` 100ms standard | `text` | 边框加亮，无位移（保持输入定位稳定） |
| **Active / Pressed** | 2px solid `color-mix(in oklch, var(--nb-border) 120%, var(--nb-base-300))` | `var(--nb-shadow-none)` | `translate(2px, 2px)` | 背景微调至 `--nb-base-200` | 1.0 | `transform` 100ms brutal, `box-shadow` 100ms brutal | `text` | 阴影归零，轻微位移（对应 sm 阴影的 2px） |
| **Focus Visible** | 2px solid `var(--nb-primary)` | `var(--nb-shadow-md)` | `none` | 外框 2px solid `var(--nb-focus)`, `outline-offset: 2px` | 1.0 | `border-color` 100ms standard, `box-shadow` 100ms standard | `text` | 核心状态：边框变主色，阴影提升一级，显示焦点环 |
| **Disabled** | 2px solid `color-mix(in oklch, var(--nb-border) 50%, transparent)` | `var(--nb-shadow-none)` | `none` | 背景 `color-mix(in oklch, var(--nb-base-100) 50%, transparent)` | 0.5 | instant | `not-allowed` | 需设置 `disabled` 或 `aria-disabled="true"` |
| **Loading / Busy** | 2px solid `var(--nb-border-field-color)` | `var(--nb-shadow-sm)` | `none` | 内容被 skeleton 遮罩覆盖 | 1.0 | skeleton 扫光动画 | `wait` | 需设置 `aria-busy="true"`，尺寸不变 |
| **Invalid** | 2px solid `var(--nb-error)` + 3px `inline-start` 强调 | 可选 `var(--nb-shadow-error)` | `none` | 背景 `color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100))` | 1.0 | `border-color` 100ms standard | `text` | 需设置 `aria-invalid="true"` |
| **Valid** | 2px solid `var(--nb-success)` | `var(--nb-shadow-sm)` | `none` | 背景 `color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100))` | 1.0 | `border-color` 100ms standard | `text` | 可选状态，不强制显示 |
| **Selected / Checked** | **N/A** | — | — | — | — | — | — | Input 为自由文本输入，无 Selected/Checked 语义 |
| **Open / Expanded** | **N/A** | — | — | — | — | — | — | Input 无 Open/Expanded 状态；关联的 Dropdown/Select 单独定义 |
| **Readonly** | 2px solid `color-mix(in oklch, var(--nb-border) 50%, transparent)` | `var(--nb-shadow-xs)` | `none` | 背景 `var(--nb-base-200)` | 1.0 | instant | `default` | 内容可见但不可编辑，参与表单提交 |

---

## 5. 阴影与位移规则

### 5.1 阴影阶梯选择

Input 属于 **Field 类别** 中的标准小型组件，遵循以下阴影规则：

| 状态 | 阴影 Token | 阴影值 | 说明 |
|------|-----------|--------|------|
| **Default** | `--nb-shadow-sm` | `2px 2px 0 var(--nb-shadow-color)` | 小型组件默认阴影 |
| **Hover** | `--nb-shadow-sm` | `2px 2px 0 var(--nb-shadow-color)` | 保持不变，Input 不需悬浮提升 |
| **Focus** | `--nb-shadow-md` | `4px 4px 0 var(--nb-shadow-color)` | 阴影升一级，提示"已激活" |
| **Active** | `--nb-shadow-none` | `0px 0px 0` | 阴影归零 |
| **Readonly** | `--nb-shadow-xs` | `1px 1px 0 var(--nb-shadow-color)` | 微弱阴影，表示非交互 |
| **Disabled** | `--nb-shadow-none` | `0px 0px 0` | 无阴影 |

### 5.2 位移规则

Input 的位移规则与按钮不同：**Hover 时不位移**，仅在 Active 时轻微位移，以提示"物理按下"但不干扰光标定位。

| 状态 | `transform` | 位移公式 | 说明 |
|------|-------------|----------|------|
| **Default** | `translate(0, 0)` | — | 无位移 |
| **Hover** | `none` | — | **无位移**（输入框 Hover 位移会导致光标定位困难） |
| **Active** | `translate(2px, 2px)` | `shadow_default` | 等于默认阴影偏移量（2px） |
| **Focus** | `none` | — | 无位移（保持输入稳定性） |
| **Disabled** | `none` | — | 无位移 |

### 5.3 过渡定义

```css
.nb-input {
  transition: border-color var(--nb-duration-fast) var(--nb-ease-standard),
              box-shadow var(--nb-duration-fast) var(--nb-ease-standard),
              transform var(--nb-duration-fast) var(--nb-ease-brutal),
              background-color var(--nb-duration-fast) var(--nb-ease-standard);
}

/* 使用 transform 而非 margin/position，避免重排 */
```

### 5.4 布局稳定性保障

- **使用 `transform: translate()`**：Input 的 Active 状态位移仅使用 `transform`，不修改 `margin`、`padding`、`top`、`left` 等会触发布局重排的属性。
- **可点击区域**：Active 位移量（2px）等于默认阴影偏移量（2px），位移后元素仍覆盖原阴影区域，用户不会"丢失"目标。
- **触摸设备**：通过 `-webkit-tap-highlight-color: transparent` 移除浏览器默认触摸高亮，避免与自定义 Active 样式冲突。

---

## 6. 圆角与边框

### 6.1 圆角 Token

Input 属于 **Field 类别**，使用 Field 类别圆角 Token：

```css
.nb-input {
  border-radius: var(--nb-radius-field); /* 0px */
}
```

**Input 不适用任何圆角例外**。所有 Input 变体（包括 outline、ghost）均保持 `0px` 直角。

### 6.2 边框规则

| 属性 | 值 | 说明 |
|------|-----|------|
| **边框宽度** | `var(--nb-border-field)` = `2px` | 标准 Field 边框 |
| **边框样式** | `solid` | 实线边框 |
| **边框颜色** | `var(--nb-border-field-color)` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` |

### 6.3 例外情况

Input 组件**无圆角例外**。所有尺寸、颜色、外观变体均保持直角。

---

## 7. 颜色策略

### 7.1 语义颜色 Token

| 用途 | Token | 说明 |
|------|-------|------|
| 背景 | `--nb-base-100` | 输入框默认背景（Page 层级） |
| Hover 背景 | `--nb-base-200` | Active 时微调背景 |
| 文本 | `--nb-base-content` | 输入文本颜色 |
| 占位符 | `color-mix(in oklch, var(--nb-base-content) 60%, transparent)` | 占位符文本颜色 |
| 边框 | `--nb-border-field-color` | 默认边框 |
| 主色 | `--nb-primary` | Focus 边框、Primary 变体背景 |
| 主色对比 | `--nb-primary-content` | Primary 变体文本 |
| 错误 | `--nb-error` | Invalid 边框 |
| 成功 | `--nb-success` | Valid 边框 |
| 焦点色 | `--nb-focus` | Focus Visible outline 颜色 |

### 7.2 每个变体的颜色规则

| 变体 | 背景色 | 文本色 | 边框色 | Hover 边框 | Focus 边框 | Active 背景 |
|------|--------|--------|--------|------------|------------|-------------|
| **默认** | `--nb-base-100` | `--nb-base-content` | `--nb-border-field-color` | `color-mix(... 40% ...)` | `--nb-primary` | `--nb-base-200` |
| **Primary** | `--nb-primary` | `--nb-primary-content` | `color-mix(in oklch, var(--nb-primary-content) 20%, transparent)` | `color-mix(... 40% ...)` | `--nb-primary` | `color-mix(in oklch, var(--nb-primary) 90%, black)` |
| **Secondary** | `--nb-secondary` | `--nb-secondary-content` | `color-mix(in oklch, var(--nb-secondary-content) 20%, transparent)` | `color-mix(... 40% ...)` | `--nb-secondary` | `color-mix(in oklch, var(--nb-secondary) 90%, black)` |
| **Neutral** | `--nb-neutral` | `--nb-neutral-content` | `color-mix(in oklch, var(--nb-neutral-content) 20%, transparent)` | `color-mix(... 40% ...)` | `--nb-neutral` | `color-mix(in oklch, var(--nb-neutral) 90%, black)` |
| **Outline** | `transparent` | `--nb-base-content` | `--nb-border-field-color` | `color-mix(... 40% ...)` | `--nb-primary` | `--nb-base-100` |
| **Ghost** | `transparent` | `--nb-base-content` | `transparent` | `var(--nb-border-field-color)` | `--nb-primary` | `transparent` |

### 7.3 使用 `color-mix` 的状态色微调

```css
/* Hover 边框加亮：默认变体 */
.nb-input:hover {
  border-color: color-mix(in oklch, var(--nb-base-content) 40%, transparent);
}

/* Hover 边框加亮：Primary 变体 */
.nb-input--primary:hover {
  border-color: color-mix(in oklch, var(--nb-primary-content) 40%, transparent);
}

/* Active 背景微调 */
.nb-input:active {
  background-color: var(--nb-base-200);
}

/* Invalid 背景微红 */
.nb-input[aria-invalid="true"],
.nb-input.nb-input--invalid {
  background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
}

/* Valid 背景微绿 */
.nb-input.nb-input--valid {
  background-color: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
}
```

### 7.4 禁止硬编码

```css
/* ❌ 禁止：硬编码 hex 颜色 */
.nb-input {
  border: 2px solid #000000;        /* 禁止 */
  background: #ffffff;              /* 禁止 */
  box-shadow: 2px 2px 0 #000000;    /* 禁止 */
}

/* ❌ 禁止：未经批准的 oklch() 值 */
.nb-input:focus {
  border-color: oklch(60% 0.2 250); /* 禁止：必须使用 Token */
}

/* ✅ 正确：使用语义 Token */
.nb-input {
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
}
```

---

## 8. 可访问性要求

### 8.1 键盘可操作性

| 要求 | 实现 |
|------|------|
| **Tab 顺序** | Input 必须通过 Tab 键可聚焦。使用原生 `<input>` 元素即可自动满足。 |
| **Enter 行为** | 在表单内的 Input 按 Enter 应触发表单提交（默认行为）。 |
| **Space 行为** | Space 键输入空格字符，不作为激活键。 |
| **焦点可见** | 键盘导航时显示 `:focus-visible` 样式（2px 实线 outline）。鼠标点击不显示 focus-visible。 |

### 8.2 `:focus-visible` 样式

```css
.nb-input:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  border-color: var(--nb-primary);
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
}

/* Focus + Hover 共存时 */
.nb-input:hover:focus-visible {
  border-color: var(--nb-primary);
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
}
```

### 8.3 `aria-*` 属性

```html
<!-- 必填字段 -->
<input class="nb-input" required aria-required="true" />

<!-- 禁用状态 -->
<input class="nb-input" disabled aria-disabled="true" />

<!-- 只读状态 -->
<input class="nb-input" readonly aria-readonly="true" />

<!-- 错误状态 -->
<input class="nb-input" aria-invalid="true" aria-describedby="error-id" />

<!-- 加载状态 -->
<input class="nb-input nb-input--loading" aria-busy="true" readonly />
```

### 8.4 RTL 适配

使用 **Logical Properties** 确保 RTL（从右到左）布局下表现正确：

```css
.nb-input {
  /* 使用 padding-inline 替代 padding-left/right */
  padding-inline: 0.75rem;

  /* 使用 padding-block 替代 padding-top/bottom */
  padding-block: 0.5rem;

  /* 使用 text-align: start 替代 text-align: left */
  text-align: start;
}

/* Invalid 状态的 3px 强调边框使用 inline-start */
.nb-input[aria-invalid="true"],
.nb-input.nb-input--invalid {
  border-inline-start-width: 3px;
}

/* 图标位置使用 inset-inline-start/end */
.nb-input__icon--start {
  inset-inline-start: 0.75rem;
}

.nb-input__icon--end {
  inset-inline-end: 0.75rem;
}
```

### 8.5 `prefers-reduced-motion`

当用户启用系统级"减少动画"时，取消所有位移动画，保留即时阴影和颜色切换：

```css
@media (prefers-reduced-motion: reduce) {
  .nb-input,
  .nb-input:hover,
  .nb-input:active,
  .nb-input:focus-visible {
    /* 取消 transform 位移 */
    transform: none !important;
    /* 保留即时状态切换，但无过渡动画 */
    transition: none;
  }

  /* 保留即时阴影切换（无过渡） */
  .nb-input:focus-visible {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-input:active {
    box-shadow: var(--nb-shadow-none);
  }

  /* 取消 Loading 动画 */
  .nb-input.nb-input--loading,
  .nb-input[aria-busy="true"] {
    animation: none;
    background-image: none;
    background-color: color-mix(in oklch, var(--nb-base-200) 80%, transparent);
  }
}
```

### 8.6 `forced-colors`（高对比度模式）

在 Windows 高对比度模式或其他 `forced-colors` 环境下：

```css
@media (forced-colors: active) {
  .nb-input {
    /* 边框始终可见，使用 currentColor */
    border: 2px solid currentColor;
    /* 移除阴影，避免高对比度下的视觉噪音 */
    box-shadow: none;
    /* 强制使用系统颜色 */
    background: Canvas;
    color: CanvasText;
  }

  .nb-input:focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }

  .nb-input[aria-invalid="true"] {
    border-inline-start-width: 3px;
    border-inline-start-color: Mark;
  }
}
```

### 8.7 320px 移动端可用性

```css
/* 最小视口适配 */
@media (max-width: 320px) {
  .nb-input,
  .nb-input--md,
  .nb-input--lg,
  .nb-input--xl {
    /* 确保最小触摸目标 */
    min-height: 2.75rem; /* 44px */
    padding-block: 0.5rem;
    padding-inline: 0.625rem;
    font-size: 1rem; /* 防止 iOS 缩放 */
  }
}
```

### 8.8 200% 缩放测试通过

```css
/* 确保 200% 缩放时布局不崩 */
.nb-input {
  /* 使用 rem 单位，随根字体缩放 */
  /* 最小高度保证可点击区域 */
  min-height: 2.5rem;
}

/* 高密度屏幕下边框保持可见 */
@media (resolution >= 2dppx) {
  .nb-input {
    /* 2px 边框在 Retina 屏幕上仍清晰可见 */
    border-width: max(2px, 0.125rem);
  }
}
```

---

## 9. 完整 CSS 示例

### 9.1 完整 CSS 代码（使用 CSS 变量和 `@layer`）

```css
/* =============================================
   Neo-Brutal UI — Input Component
   @layer: components
   ============================================= */

@layer components {
  /* ---- 基础 Input 样式 ---- */
  .nb-input {
    /* 盒模型 */
    display: block;
    width: 100%;
    margin: 0;

    /* 尺寸（默认 md） */
    min-height: 2.5rem;
    padding-block: 0.5rem;
    padding-inline: 0.75rem;

    /* 字体 */
    font-family: var(--nb-font-sans);
    font-size: 0.875rem;
    font-weight: var(--nb-weight-normal);
    line-height: 1.25;
    color: var(--nb-base-content);
    text-align: start;

    /* 背景与边框 */
    background-color: var(--nb-base-100);
    border: var(--nb-border-field) solid var(--nb-border-field-color);
    border-radius: var(--nb-radius-field); /* 0px */

    /* 阴影 */
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);

    /* 交互 */
    cursor: text;
    -webkit-tap-highlight-color: transparent;

    /* 过渡 */
    transition: border-color var(--nb-duration-fast) var(--nb-ease-standard),
                box-shadow var(--nb-duration-fast) var(--nb-ease-standard),
                transform var(--nb-duration-fast) var(--nb-ease-brutal),
                background-color var(--nb-duration-fast) var(--nb-ease-standard);

    /* 占位符 */
    &::placeholder {
      color: color-mix(in oklch, var(--nb-base-content) 60%, transparent);
      opacity: 1; /* 覆盖 Firefox 默认 */
    }

    /* 清除 Webkit 自动填充背景 */
    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px var(--nb-base-100) inset;
      -webkit-text-fill-color: var(--nb-base-content);
    }
  }

  /* ---- Hover 状态 ---- */
  .nb-input:hover {
    border-color: color-mix(in oklch, var(--nb-base-content) 40%, transparent);
  }

  /* ---- Active / Pressed 状态 ---- */
  .nb-input:active {
    box-shadow: var(--nb-shadow-none);
    transform: translate(2px, 2px);
    background-color: var(--nb-base-200);
  }

  /* ---- Focus Visible 状态 ---- */
  .nb-input:focus {
    outline: none; /* 移除默认 outline，由 focus-visible 控制 */
  }

  .nb-input:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
    border-color: var(--nb-primary);
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  /* ---- Disabled 状态 ---- */
  .nb-input:disabled,
  .nb-input[aria-disabled="true"] {
    opacity: 0.5;
    box-shadow: var(--nb-shadow-none);
    border-color: color-mix(in oklch, var(--nb-border-field-color) 50%, transparent);
    background-color: color-mix(in oklch, var(--nb-base-100) 50%, transparent);
    color: color-mix(in oklch, var(--nb-base-content) 50%, transparent);
    cursor: not-allowed;
    pointer-events: none;
  }

  .nb-input:disabled::placeholder,
  .nb-input[aria-disabled="true"]::placeholder {
    color: color-mix(in oklch, var(--nb-base-content) 30%, transparent);
  }

  /* ---- Readonly 状态 ---- */
  .nb-input[readonly] {
    border-color: color-mix(in oklch, var(--nb-border-field-color) 50%, transparent);
    background-color: var(--nb-base-200);
    box-shadow: var(--nb-shadow-xs) var(--nb-shadow-color);
    cursor: default;
  }

  /* ---- Invalid 状态 ---- */
  .nb-input[aria-invalid="true"],
  .nb-input.nb-input--invalid,
  .nb-input:invalid:not(:placeholder-shown) {
    border-color: var(--nb-error);
    border-inline-start-width: 3px;
    background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
  }

  .nb-input[aria-invalid="true"]:focus-visible,
  .nb-input.nb-input--invalid:focus-visible {
    border-color: var(--nb-error);
    box-shadow: 0 0 0 2px color-mix(in oklch, var(--nb-error) 30%, transparent);
  }

  /* ---- Valid 状态 ---- */
  .nb-input.nb-input--valid,
  .nb-input:valid:not(:invalid):not(:placeholder-shown) {
    border-color: var(--nb-success);
    background-color: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
  }

  /* ---- Loading / Busy 状态 ---- */
  .nb-input.nb-input--loading,
  .nb-input[aria-busy="true"] {
    position: relative;
    pointer-events: none;
    cursor: wait;
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in oklch, var(--nb-primary) 10%, transparent) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: nb-input-loading 1.5s steps(3) infinite;
  }

  @keyframes nb-input-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* =============================================
     Input — 尺寸变体
     ============================================= */

  .nb-input--xs {
    min-height: 1.75rem;
    padding-block: 0.25rem;
    padding-inline: 0.5rem;
    font-size: 0.75rem;
  }

  .nb-input--sm {
    min-height: 2rem;
    padding-block: 0.375rem;
    padding-inline: 0.625rem;
    font-size: 0.8125rem;
  }

  .nb-input--lg {
    min-height: 3rem;
    padding-block: 0.625rem;
    padding-inline: 1rem;
    font-size: 1rem;
  }

  .nb-input--xl {
    min-height: 3.5rem;
    padding-block: 0.75rem;
    padding-inline: 1.25rem;
    font-size: 1.125rem;
  }

  /* =============================================
     Input — 颜色变体
     ============================================= */

  .nb-input--primary {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  }

  .nb-input--primary::placeholder {
    color: color-mix(in oklch, var(--nb-primary-content) 60%, transparent);
  }

  .nb-input--primary:hover {
    border-color: color-mix(in oklch, var(--nb-primary-content) 40%, transparent);
  }

  .nb-input--primary:focus-visible {
    border-color: var(--nb-primary);
    outline-color: var(--nb-focus);
  }

  .nb-input--primary:active {
    background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
  }

  .nb-input--secondary {
    background-color: var(--nb-secondary);
    color: var(--nb-secondary-content);
    border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
  }

  .nb-input--secondary::placeholder {
    color: color-mix(in oklch, var(--nb-secondary-content) 60%, transparent);
  }

  .nb-input--secondary:hover {
    border-color: color-mix(in oklch, var(--nb-secondary-content) 40%, transparent);
  }

  .nb-input--secondary:focus-visible {
    border-color: var(--nb-secondary);
  }

  .nb-input--secondary:active {
    background-color: color-mix(in oklch, var(--nb-secondary) 90%, black);
  }

  .nb-input--neutral {
    background-color: var(--nb-neutral);
    color: var(--nb-neutral-content);
    border-color: color-mix(in oklch, var(--nb-neutral-content) 20%, transparent);
  }

  .nb-input--neutral::placeholder {
    color: color-mix(in oklch, var(--nb-neutral-content) 60%, transparent);
  }

  .nb-input--neutral:hover {
    border-color: color-mix(in oklch, var(--nb-neutral-content) 40%, transparent);
  }

  .nb-input--neutral:focus-visible {
    border-color: var(--nb-neutral);
  }

  .nb-input--neutral:active {
    background-color: color-mix(in oklch, var(--nb-neutral) 90%, black);
  }

  /* =============================================
     Input — 外观变体
     ============================================= */

  .nb-input--outline {
    background-color: transparent;
  }

  .nb-input--outline:hover {
    background-color: var(--nb-base-100);
  }

  .nb-input--ghost {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }

  .nb-input--ghost:hover {
    border-color: var(--nb-border-field-color);
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }

  .nb-input--ghost:focus-visible {
    background-color: var(--nb-base-100);
  }

  /* =============================================
     Input — 布局变体
     ============================================= */

  .nb-input--inline {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }

  /* =============================================
     可访问性：减少动画
     ============================================= */

  @media (prefers-reduced-motion: reduce) {
    .nb-input,
    .nb-input:hover,
    .nb-input:active,
    .nb-input:focus-visible {
      transform: none !important;
      transition: none;
    }

    .nb-input.nb-input--loading,
    .nb-input[aria-busy="true"] {
      animation: none;
      background-image: none;
      background-color: color-mix(in oklch, var(--nb-base-200) 80%, transparent);
    }
  }

  /* =============================================
     可访问性：高对比度模式
     ============================================= */

  @media (forced-colors: active) {
    .nb-input {
      border: 2px solid currentColor;
      box-shadow: none;
      background: Canvas;
      color: CanvasText;
    }

    .nb-input:focus-visible {
      outline: 2px solid Highlight;
      outline-offset: 2px;
    }

    .nb-input[aria-invalid="true"] {
      border-inline-start-width: 3px;
      border-inline-start-color: Mark;
    }
  }

  /* =============================================
     移动端适配
     ============================================= */

  @media (max-width: 320px) {
    .nb-input {
      min-height: 2.75rem; /* 44px */
      font-size: 1rem; /* 防止 iOS 缩放 */
    }
  }
}
```

### 9.2 HTML 示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neo-Brutal UI — Input 示例</title>
  <link rel="stylesheet" href="neo-brutal-ui.css">
</head>
<body>
  <div class="nb-container" style="padding: 2rem; max-width: 600px;">

    <h2 class="nb-heading" style="margin-bottom: 1.5rem;">Input 组件示例</h2>

    <!-- 基础输入框 -->
    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label" for="basic">基础输入框</label>
      <input type="text" id="basic" class="nb-input" placeholder="请输入内容" />
    </div>

    <!-- 不同尺寸 -->
    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label">尺寸变体</label>
      <input type="text" class="nb-input nb-input--xs" placeholder="xs 尺寸" style="margin-bottom: 0.5rem;" />
      <input type="text" class="nb-input nb-input--sm" placeholder="sm 尺寸" style="margin-bottom: 0.5rem;" />
      <input type="text" class="nb-input nb-input--md" placeholder="md 尺寸（默认）" style="margin-bottom: 0.5rem;" />
      <input type="text" class="nb-input nb-input--lg" placeholder="lg 尺寸" style="margin-bottom: 0.5rem;" />
      <input type="text" class="nb-input nb-input--xl" placeholder="xl 尺寸" />
    </div>

    <!-- 颜色变体 -->
    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label">颜色变体</label>
      <input type="text" class="nb-input nb-input--primary" placeholder="Primary 变体" style="margin-bottom: 0.5rem;" />
      <input type="text" class="nb-input nb-input--secondary" placeholder="Secondary 变体" style="margin-bottom: 0.5rem;" />
      <input type="text" class="nb-input nb-input--neutral" placeholder="Neutral 变体" />
    </div>

    <!-- 外观变体 -->
    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label">外观变体</label>
      <input type="text" class="nb-input nb-input--outline" placeholder="Outline 变体" style="margin-bottom: 0.5rem;" />
      <input type="text" class="nb-input nb-input--ghost" placeholder="Ghost 变体" />
    </div>

    <!-- 状态示例 -->
    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label" for="disabled">禁用状态</label>
      <input type="text" id="disabled" class="nb-input" value="禁用内容" disabled aria-disabled="true" />
    </div>

    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label" for="readonly">只读状态</label>
      <input type="text" id="readonly" class="nb-input" value="只读内容" readonly />
    </div>

    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label" for="invalid">错误状态</label>
      <input type="email" id="invalid" class="nb-input nb-input--invalid" value="invalid-email" aria-invalid="true" aria-describedby="invalid-error" />
      <span id="invalid-error" class="nb-error-text" role="alert">邮箱格式不正确。</span>
    </div>

    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label" for="loading">加载状态</label>
      <input type="text" id="loading" class="nb-input nb-input--loading" placeholder="加载中..." aria-busy="true" readonly />
    </div>

    <!-- 行内输入框 -->
    <div class="nb-field" style="margin-bottom: 1rem;">
      <label class="nb-label">行内布局</label>
      <span>文本前缀</span>
      <input type="text" class="nb-input nb-input--inline" placeholder="行内输入" style="width: 150px;" />
      <span>文本后缀</span>
    </div>

  </div>
</body>
</html>
```

---

## 10. 检查清单

以下验收项必须与全局规范文档（`brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md`）对齐，全部通过方可进入组件实现阶段。

### 10.1 品牌与命名

- [ ] 类名使用 `nb-` 前缀，无裸露通用类名。
- [ ] 组件核心类名为 `nb-input`，修饰类名使用 `nb-input--{modifier}` 格式。
- [ ] 私有工具类（如有）使用 `nbu-` 前缀（保留，未启用）。

### 10.2 视觉铁律

- [ ] 边框宽度为 `2px`，样式为 `solid`。
- [ ] 边框颜色使用 `color-mix(in oklch, ...)` 动态计算，无硬编码 `#000` 或 `black`。
- [ ] 圆角为 `0px`（直角），使用 `var(--nb-radius-field)`。
- [ ] 阴影使用 `box-shadow` 硬阴影，无模糊（blur = 0），无扩散（spread = 0）。
- [ ] 背景使用纯色，无渐变、无噪点/纹理。
- [ ] 所有颜色使用语义 Token，无未经批准的 `oklch()` 或 `#hex`。

### 10.3 阴影与位移

- [ ] 默认阴影使用 `var(--nb-shadow-sm)`（2px 2px）。
- [ ] Hover 状态边框加亮，阴影保持不变（Input 不需悬浮提升）。
- [ ] Active 状态阴影归零，使用 `transform: translate(2px, 2px)`。
- [ ] Focus 状态阴影提升到 `var(--nb-shadow-md)`。
- [ ] 位移使用 `transform` 而非 `margin` 或 `position`。
- [ ] 过渡时长 ≤ 150ms（标准状态），使用 `cubic-bezier(0.4, 0, 0.2, 1)` 或 `cubic-bezier(0.25, 0.1, 0.25, 1.0)`。
- [ ] 触摸设备通过 `:active` 提供反馈，不依赖 Hover。
- [ ] 实现 `@media (prefers-reduced-motion: reduce)` 并取消位移。

### 10.4 状态系统

- [ ] Default、Hover、Active、Focus Visible、Disabled、Readonly、Invalid、Valid、Loading 状态均已定义。
- [ ] 不适用状态（Selected/Checked、Open/Expanded）明确标记为 N/A。
- [ ] 状态冲突优先级：Dragging > Loading > Disabled > Invalid > Active > Hover > Focus Visible > Default。
- [ ] Disabled 状态完全阻断 Hover 和 Active 的视觉效果（`pointer-events: none`）。
- [ ] Invalid 状态使用 `border-inline-start-width: 3px` 强调，配合 `aria-invalid="true"`。

### 10.5 可访问性

- [ ] 键盘 Tab 导航可聚焦。
- [ ] `:focus-visible` 使用 `2px solid var(--nb-focus)` + `outline-offset: 2px`。
- [ ] 鼠标点击不触发 focus-visible（仅键盘触发）。
- [ ] 禁用状态使用 `aria-disabled="true"` 或 `disabled` 属性。
- [ ] 错误状态使用 `aria-invalid="true"` 和 `aria-describedby` 关联错误消息。
- [ ] 加载状态使用 `aria-busy="true"`。
- [ ] RTL 适配使用 logical properties（`padding-inline`、`border-inline-start` 等）。
- [ ] `prefers-reduced-motion` 取消 transform 位移，保留即时 box-shadow 切换。
- [ ] `forced-colors` 模式下边框始终可见（`currentColor`），`--nb-focus` 使用高对比色。
- [ ] 320px 移动端最小高度 ≥ 44px，字体大小 ≥ 1rem 防止 iOS 缩放。
- [ ] 200% 缩放测试通过（使用 rem 单位）。

### 10.6 代码质量

- [ ] 使用 `@layer components` 组织 CSS。
- [ ] 所有状态使用 CSS 变量而非硬编码值。
- [ ] 占位符颜色正确覆盖（包括 Firefox）。
- [ ] Webkit 自动填充样式已覆盖（`-webkit-box-shadow: 0 0 0 1000px ...`）。
- [ ] 无 `!important`（除 `prefers-reduced-motion` 中必要的覆盖外）。

---

> **文档版本**：v1.0
> **最后更新**：2025 年 6 月
> **维护者**：Neo-Brutal UI 设计系统团队
> **审核状态**：待技术评审（Tech Review）
