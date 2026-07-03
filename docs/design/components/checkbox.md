# Checkbox 组件设计基准稿

> 本文档定义 Neo-Brutal UI 中 Checkbox（复选框）组件的完整设计规范、DOM 契约、状态矩阵、CSS 实现及可访问性要求。本文档是 Checkbox 组件进入开发阶段前的唯一权威参考源。
>
> **适用范围**：Checkbox 单选、Checkbox 组、带标签的 Checkbox 组合。
> **关联全局文档**：`brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md`。

---

## 1. 组件概述

### 1.1 名称与用途

| 属性 | 值 |
|------|-----|
| **组件名称** | Checkbox（复选框） |
| **用途** | 允许用户从一组选项中选择一个或多个独立项。每个 Checkbox 之间互不影响，状态为布尔值（checked / unchecked）。 |
| **语义 HTML 元素** | `<input type="checkbox">` |
| **类名** | `nb-checkbox`（原生控件） / `nb-checkbox-group`（组合容器） / `nb-checkbox-label`（标签文本） |
| **对应全局类别** | Selector 类别（详见 `radius-and-borders.md` §3.1） |

### 1.2 设计原则

- Checkbox 是**直角方形**，内部放置 Check 图标（SVG 或 Unicode），表示选中状态。拒绝圆角，以维持新粗野主义的硬朗视觉。
- 每个 Checkbox 必须附带文本标签，标签与控件之间保持清晰的视觉关联。
- Checkbox 的交互状态（Hover、Active、Checked）必须配合**位移、阴影、边框**三重反馈，不能只通过颜色区分。

---

## 2. DOM Contract

### 2.1 推荐的 HTML 结构

#### 单选模式（最简结构）

```html
<label class="nb-checkbox-wrapper">
  <input
    type="checkbox"
    class="nb-checkbox"
    name="terms"
    value="accepted"
    aria-checked="false"
  />
  <span class="nb-checkbox__control" aria-hidden="true">
    <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
    </svg>
  </span>
  <span class="nb-checkbox__label">我同意服务条款</span>
</label>
```

#### 带描述文本的增强结构

```html
<label class="nb-checkbox-wrapper nb-checkbox-wrapper--stacked">
  <input
    type="checkbox"
    class="nb-checkbox"
    name="newsletter"
    value="weekly"
    aria-describedby="newsletter-desc"
  />
  <span class="nb-checkbox__control" aria-hidden="true">
    <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
    </svg>
  </span>
  <span class="nb-checkbox__text">
    <span class="nb-checkbox__label">每周订阅</span>
    <span class="nb-checkbox__description" id="newsletter-desc">
      每周一上午发送最新产品动态，可随时取消。
    </span>
  </span>
</label>
```

#### 无标签（仅图标，用于表格行选择等场景）

```html
<label class="nb-checkbox-wrapper nb-checkbox-wrapper--bare" aria-label="选择此行">
  <input type="checkbox" class="nb-checkbox" />
  <span class="nb-checkbox__control" aria-hidden="true">
    <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
    </svg>
  </span>
</label>
```

### 2.2 子元素清单

| 元素 | 类名 | 必需 | 说明 |
|------|------|------|------|
| `<input type="checkbox">` | `.nb-checkbox` | ✅ 是 | 原生控件，隐藏但可交互。所有状态由原生 `checked` / `disabled` 驱动。 |
| 控件容器 | `.nb-checkbox__control` | ✅ 是 | 视觉上的 Checkbox 方形，包含边框、阴影、背景。 |
| Check 图标 | `.nb-checkbox__icon` | ✅ 是 | SVG 对勾图标，默认隐藏，选中时显示。 |
| 标签文本 | `.nb-checkbox__label` | ⚠️ 推荐 | 控件右侧的主标签文本。 |
| 描述文本 | `.nb-checkbox__description` | ❌ 可选 | 标签下方的辅助描述，仅增强结构使用。 |
| 组合容器 | `.nb-checkbox-group` | ❌ 可选 | 多个 Checkbox 的垂直/水平排列容器。 |

### 2.3 ARIA 属性要求

| 属性 | 值 | 说明 |
|------|-----|------|
| `aria-checked` | `"true"` / `"false"` / `"mixed"` | 由 JS 或原生 `indeterminate` 状态控制。`mixed` 用于"部分选中"（如全选/半选场景）。 |
| `aria-disabled` | `"true"` | 当 Checkbox 被禁用但需保持可聚焦时（替代 HTML `disabled`）。 |
| `aria-invalid` | `"true"` | 当 Checkbox 所在表单验证失败时设置。 |
| `aria-describedby` | `id` 引用 | 指向错误消息或描述文本元素。 |
| `aria-labelledby` | `id` 引用 | 当标签文本不在 `<label>` 内时使用（复杂布局）。 |
| `role="checkbox"` | — | 仅在**自定义 Checkbox**（非原生 `<input>`）时使用。原生 `<input>` 无需此角色。 |

### 2.4 键盘行为

| 按键 | 行为 | 说明 |
|------|------|------|
| `Tab` | 聚焦到 Checkbox | 按文档顺序获得焦点，显示 `:focus-visible` 焦点环。 |
| `Space` | 切换选中状态 | 按下 Space 切换 `checked` 状态；与 Button 的 Enter 行为区分。 |
| `Enter` | **不触发** | Checkbox 不响应 Enter 键，防止表单意外提交。 |
| `Arrow Up/Down` | 在组内移动焦点 | 当 Checkbox 位于 `.nb-checkbox-group` 内时，使用方向键在组内导航。 |

---

## 3. 尺寸与变体

### 3.1 尺寸阶梯

| 尺寸 | 类名后缀 | 控件尺寸 | 图标尺寸 | 标签字号 | 标签行高 | 最小触控区域 |
|------|----------|----------|----------|----------|----------|-------------|
| **xs** | `--xs` | 0.875rem (14px) | 10px | 0.75rem (12px) | 1.25 | 44×44px |
| **sm** | `--sm` | 1rem (16px) | 12px | 0.875rem (14px) | 1.375 | 44×44px |
| **md** | *(默认)* | 1.25rem (20px) | 14px | 1rem (16px) | 1.5 | 44×44px |
| **lg** | `--lg` | 1.5rem (24px) | 16px | 1.125rem (18px) | 1.5 | 48×48px |
| **xl** | `--xl` | 1.75rem (28px) | 20px | 1.25rem (20px) | 1.5 | 48×48px |

#### 尺寸 CSS 规则

```css
/* 默认 md 尺寸 */
.nb-checkbox__control {
  width: 1.25rem;
  height: 1.25rem;
}

.nb-checkbox__icon {
  width: 14px;
  height: 14px;
}

.nb-checkbox__label {
  font-size: 1rem;
  line-height: 1.5;
}

/* xs */
.nb-checkbox-wrapper--xs .nb-checkbox__control {
  width: 0.875rem;
  height: 0.875rem;
}
.nb-checkbox-wrapper--xs .nb-checkbox__icon {
  width: 10px;
  height: 10px;
}
.nb-checkbox-wrapper--xs .nb-checkbox__label {
  font-size: 0.75rem;
  line-height: 1.25;
}

/* sm */
.nb-checkbox-wrapper--sm .nb-checkbox__control {
  width: 1rem;
  height: 1rem;
}
.nb-checkbox-wrapper--sm .nb-checkbox__icon {
  width: 12px;
  height: 12px;
}
.nb-checkbox-wrapper--sm .nb-checkbox__label {
  font-size: 0.875rem;
  line-height: 1.375;
}

/* lg */
.nb-checkbox-wrapper--lg .nb-checkbox__control {
  width: 1.5rem;
  height: 1.5rem;
}
.nb-checkbox-wrapper--lg .nb-checkbox__icon {
  width: 16px;
  height: 16px;
}
.nb-checkbox-wrapper--lg .nb-checkbox__label {
  font-size: 1.125rem;
  line-height: 1.5;
}

/* xl */
.nb-checkbox-wrapper--xl .nb-checkbox__control {
  width: 1.75rem;
  height: 1.75rem;
}
.nb-checkbox-wrapper--xl .nb-checkbox__icon {
  width: 20px;
  height: 20px;
}
.nb-checkbox-wrapper--xl .nb-checkbox__label {
  font-size: 1.25rem;
  line-height: 1.5;
}
```

### 3.2 颜色变体

| 变体 | 类名后缀 | 背景色（Default） | 背景色（Checked） | 边框色 | 文本色 | 使用场景 |
|------|----------|------------------|------------------|--------|--------|----------|
| **neutral** | *(默认)* | `--nb-base-100` | `--nb-base-300` | `--nb-border` | `--nb-base-content` | 通用场景，无色彩倾向 |
| **primary** | `--primary` | `--nb-base-100` | `--nb-primary` | `--nb-primary` | `--nb-primary-content` | 主操作，强调选中 |
| **secondary** | `--secondary` | `--nb-base-100` | `--nb-secondary` | `--nb-secondary` | `--nb-secondary-content` | 次操作 |
| **accent** | `--accent` | `--nb-base-100` | `--nb-accent` | `--nb-accent` | `--nb-accent-content` | 强调色 |
| **success** | `--success` | `--nb-base-100` | `--nb-success` | `--nb-success` | `--nb-success-content` | 成功/确认状态 |
| **warning** | `--warning` | `--nb-base-100` | `--nb-warning` | `--nb-warning` | `--nb-warning-content` | 警告/提醒状态 |
| **error** | `--error` | `--nb-base-100` | `--nb-error` | `--nb-error` | `--nb-error-content` | 错误/危险状态 |

#### 颜色变体 CSS 规则

```css
/* 默认 neutral */
.nb-checkbox-wrapper {
  --nb-checkbox-bg: var(--nb-base-100);
  --nb-checkbox-border: var(--nb-border);
  --nb-checkbox-checked-bg: var(--nb-base-300);
  --nb-checkbox-checked-border: var(--nb-base-content);
  --nb-checkbox-checked-text: var(--nb-base-content);
  --nb-checkbox-shadow-color: var(--nb-shadow-color);
}

/* primary */
.nb-checkbox-wrapper--primary {
  --nb-checkbox-checked-bg: var(--nb-primary);
  --nb-checkbox-checked-border: var(--nb-primary);
  --nb-checkbox-checked-text: var(--nb-primary-content);
}

/* secondary */
.nb-checkbox-wrapper--secondary {
  --nb-checkbox-checked-bg: var(--nb-secondary);
  --nb-checkbox-checked-border: var(--nb-secondary);
  --nb-checkbox-checked-text: var(--nb-secondary-content);
}

/* accent */
.nb-checkbox-wrapper--accent {
  --nb-checkbox-checked-bg: var(--nb-accent);
  --nb-checkbox-checked-border: var(--nb-accent);
  --nb-checkbox-checked-text: var(--nb-accent-content);
}

/* success */
.nb-checkbox-wrapper--success {
  --nb-checkbox-checked-bg: var(--nb-success);
  --nb-checkbox-checked-border: var(--nb-success);
  --nb-checkbox-checked-text: var(--nb-success-content);
}

/* warning */
.nb-checkbox-wrapper--warning {
  --nb-checkbox-checked-bg: var(--nb-warning);
  --nb-checkbox-checked-border: var(--nb-warning);
  --nb-checkbox-checked-text: var(--nb-warning-content);
}

/* error */
.nb-checkbox-wrapper--error {
  --nb-checkbox-checked-bg: var(--nb-error);
  --nb-checkbox-checked-border: var(--nb-error);
  --nb-checkbox-checked-text: var(--nb-error-content);
}
```

### 3.3 布局变体

| 变体 | 类名 | 说明 |
|------|------|------|
| **horizontal** | `.nb-checkbox-group--horizontal` | 水平排列，控件与标签 inline 排列。 |
| **vertical** | *(默认)* | 垂直排列，每个 Checkbox 独占一行。 |
| **stacked** | `.nb-checkbox-wrapper--stacked` | 标签和描述垂直堆叠，控件在左侧。 |
| **reverse** | `.nb-checkbox-wrapper--reverse` | 控件在标签右侧（RTL 默认适配）。 |
| **bare** | `.nb-checkbox-wrapper--bare` | 无标签，仅控件（用于表格等）。 |

#### 布局变体 CSS 规则

```css
/* 默认：水平 inline */
.nb-checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

/* 堆叠：标签和描述垂直 */
.nb-checkbox-wrapper--stacked {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.nb-checkbox-wrapper--stacked .nb-checkbox__text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nb-checkbox-wrapper--stacked .nb-checkbox__description {
  font-size: 0.875rem;
  color: color-mix(in oklch, var(--nb-base-content) 60%, transparent);
  line-height: 1.375;
}

/* 反向：控件在右侧 */
.nb-checkbox-wrapper--reverse {
  flex-direction: row-reverse;
}

/* bare：无标签 */
.nb-checkbox-wrapper--bare {
  gap: 0;
}

/* 组容器 */
.nb-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nb-checkbox-group--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}
```

---

## 4. 状态矩阵

以下状态矩阵适用于 Checkbox 控件（`.nb-checkbox__control`）及其交互行为。

| 状态 | 边框 | 阴影 | 位移 | 背景色 | 文本色 | 透明度 | 动画 | 光标 | 备注 |
|------|------|------|------|--------|--------|--------|------|------|------|
| **Default** | 2px solid `var(--nb-border)` | `--nb-shadow-sm` | none | `var(--nb-base-100)` | — | 1.0 | — | pointer | 基准状态 |
| **Hover** | 2px solid `color-mix(in oklch, var(--nb-border) 80%, var(--nb-base-100))` | `--nb-shadow-md` | `translate(-1px, -1px)` | `var(--nb-base-100)` | — | 1.0 | 150ms brutal | pointer | 仅控件悬浮，标签悬浮同步 |
| **Active / Pressed** | 2px solid `color-mix(in oklch, var(--nb-border) 120%, var(--nb-base-300))` | `--nb-shadow-none` | `translate(2px, 2px)` | `var(--nb-base-100)` | — | 1.0 | 100ms brutal | pointer | 按下时控件"陷入"表面 |
| **Focus Visible** | 不变 | 不变 | none | 不变 | — | 1.0 | 100ms standard | default | `outline: 2px solid var(--nb-focus); outline-offset: 2px` |
| **Disabled** | 2px solid `color-mix(in oklch, var(--nb-border) 50%, transparent)` | `--nb-shadow-none` | none | `color-mix(in oklch, var(--nb-base-200) 50%, transparent)` | `color-mix(in oklch, var(--nb-base-content) 50%, transparent)` | 0.5 | instant | not-allowed | `aria-disabled="true"` 或 `disabled` |
| **Loading / Busy** | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | **标记为 N/A** — Checkbox 作为简单布尔控件，不实现 Loading 状态。如需异步提交，由父级按钮承载 Loading。 |
| **Invalid** | 2px solid `var(--nb-error)`; `border-inline-start-width: 3px` | `--nb-shadow-error` (若定义) 或 `--nb-shadow-sm` | none | `color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100))` | — | 1.0 | 100ms standard | default | `aria-invalid="true"` |
| **Valid** | 2px solid `var(--nb-success)` | `--nb-shadow-sm` | none | `color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100))` | — | 1.0 | 100ms standard | default | 可选，仅在需要积极反馈时启用 |
| **Selected / Checked** | 2px solid `var(--nb-checkbox-checked-border)` | `--nb-shadow-xs` | none | `var(--nb-checkbox-checked-bg)` | `var(--nb-checkbox-checked-text)` | 1.0 | 100ms standard | pointer | 显示 Check 图标；图标使用 `var(--nb-checkbox-checked-text)` |
| **Indeterminate / Mixed** | 2px solid `var(--nb-checkbox-checked-border)` | `--nb-shadow-xs` | none | `var(--nb-checkbox-checked-bg)` | `var(--nb-checkbox-checked-text)` | 1.0 | 100ms standard | pointer | 显示横线（—）而非对勾；`aria-checked="mixed"` |
| **Open / Expanded** | **N/A** | — | — | — | — | — | — | — | **标记为 N/A** — Checkbox 无展开/收起语义。 |
| **Readonly** | **N/A** | — | — | — | — | — | — | — | **标记为 N/A** — Checkbox 无 Readonly 语义。使用 `disabled` 或 `aria-disabled` 替代。 |
| **Dragging** | **N/A** | — | — | — | — | — | — | — | **标记为 N/A** — Checkbox 不可拖拽。 |

### 4.1 状态冲突优先级

Checkbox 的状态优先级遵循全局规范（详见 `interaction-language.md` §6）：

```
Disabled > Invalid > Checked/Indeterminate > Active > Hover > Focus Visible > Default
```

**组合状态示例：**
- `Checked + Hover`：保持 Checked 背景色，阴影提升至 `--nb-shadow-md`，位移 `(-1px, -1px)`。
- `Checked + Active`：阴影归零，位移 `(2px, 2px)`，背景保持 Checked 色。
- `Invalid + Hover`：边框保持 `var(--nb-error)`，阴影提升，位移生效。
- `Disabled + Checked`：降低透明度至 0.5，阴影归零，无位移，背景保持 Checked 色但变淡。

---

## 5. 阴影与位移规则

### 5.1 阴影 Token 使用

Checkbox 作为小型 Selector 组件，默认阴影使用 `--nb-shadow-sm`（2px 2px），而非标准组件的 `--nb-shadow-md`（4px 4px）。这是因为 Checkbox 控件尺寸较小（1.25rem），过大的阴影会显得笨重。

| 状态 | 阴影 Token | 阴影值 | 说明 |
|------|-----------|--------|------|
| **Default** | `--nb-shadow-sm` | `2px 2px 0 var(--nb-shadow-color)` | 小型组件的基准阴影 |
| **Hover** | `--nb-shadow-md` | `4px 4px 0 var(--nb-shadow-color)` | 升一级，提供"浮起"感 |
| **Active** | `--nb-shadow-none` | `0 0 0 transparent` | 按下时阴影归零 |
| **Disabled** | `--nb-shadow-none` | `0 0 0 transparent` | 无阴影 |
| **Checked** | `--nb-shadow-xs` | `1px 1px 0 var(--nb-shadow-color)` | 轻微阴影，表示选中后的"实体感" |

### 5.2 位移规则

Checkbox 的位移量按比例缩放（默认阴影为 2px，故位移量为 1px/2px，而非标准组件的 2px/4px）：

| 状态 | `transform` | 位移公式 | 说明 |
|------|-------------|----------|------|
| **Default** | `translate(0, 0)` | — | 无位移 |
| **Hover** | `translate(-1px, -1px)` | `-(hover_shadow - default_shadow)` = -(4-2) = -2px → 取 -1px | 控件向左上浮起 |
| **Active** | `translate(2px, 2px)` | `default_shadow` | 控件向右下移动，阴影归零 |

> **注**：Hover 位移量为 `-1px`（而非 `-2px`），是因为 Checkbox 控件尺寸较小（1.25rem），过大的位移会导致视觉上的"漂移感"。-1px 的位移配合 `--nb-shadow-md` 的阴影提升，已足以传达"浮起"的物理感。

### 5.3 过渡定义

```css
.nb-checkbox__control {
  transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
              box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
              border-color var(--nb-duration-fast) var(--nb-easing-standard),
              background-color var(--nb-duration-fast) var(--nb-easing-standard);
  will-change: transform, box-shadow;
}

.nb-checkbox__icon {
  transition: opacity var(--nb-duration-fast) var(--nb-easing-standard),
              transform var(--nb-duration-fast) var(--nb-easing-standard);
}
```

### 5.4 触摸设备策略

```css
/* 默认：所有设备都有 Active 反馈 */
.nb-checkbox-wrapper:active .nb-checkbox__control {
  box-shadow: var(--nb-shadow-none);
  transform: translate(2px, 2px);
  transition-duration: var(--nb-duration-fast);
}

/* 桌面端增强：Hover 提升 */
@media (hover: hover) and (pointer: fine) {
  .nb-checkbox-wrapper:hover .nb-checkbox__control {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: translate(-1px, -1px);
  }

  .nb-checkbox-wrapper:hover:active .nb-checkbox__control {
    box-shadow: var(--nb-shadow-none);
    transform: translate(2px, 2px);
  }
}

/* 触摸端：禁用 Hover 样式 */
@media (hover: none) and (pointer: coarse) {
  .nb-checkbox-wrapper:hover .nb-checkbox__control {
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
    transform: none;
  }
}

/* 清除浏览器默认触摸高亮 */
.nb-checkbox-wrapper {
  -webkit-tap-highlight-color: transparent;
}
```

---

## 6. 圆角与边框

### 6.1 圆角 Token

Checkbox 属于 **Selector 类别**，使用该类别的圆角 Token：

```css
.nb-checkbox__control {
  border-radius: var(--nb-radius-selector); /* 0px — 直角 */
}
```

> **设计说明**：Checkbox 为直角方形，这是 Neo-Brutalism 的核心特征。与 Radio 的圆形例外不同，Checkbox 的方形是新粗野风格中最直观、最一致的表达。

### 6.2 边框规则

| 属性 | 值 | 说明 |
|------|-----|------|
| 边框宽度 | `2px` | 标准 Selector 边框宽度 |
| 边框样式 | `solid` | 实线 |
| 边框颜色 | `var(--nb-border)` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` |
| 强调边框（Invalid） | `3px` on `inline-start` | 左侧加粗，指向错误源 |

#### 边框颜色动态计算

```css
.nb-checkbox__control {
  border: 2px solid var(--nb-border);
}

/* Hover：边框加亮 */
.nb-checkbox-wrapper:hover .nb-checkbox__control {
  border-color: color-mix(in oklch, var(--nb-border) 80%, var(--nb-base-100));
}

/* Active：边框加深 */
.nb-checkbox-wrapper:active .nb-checkbox__control {
  border-color: color-mix(in oklch, var(--nb-border) 120%, var(--nb-base-300));
}

/* Checked：边框变为主色 */
.nb-checkbox:checked + .nb-checkbox__control,
.nb-checkbox__control.is-checked {
  border-color: var(--nb-checkbox-checked-border);
}

/* Invalid：边框变为错误色 */
.nb-checkbox[aria-invalid="true"] + .nb-checkbox__control,
.nb-checkbox-wrapper.is-invalid .nb-checkbox__control {
  border: 2px solid var(--nb-error);
  border-inline-start-width: 3px;
}

/* Valid：边框变为成功色 */
.nb-checkbox[aria-valid="true"] + .nb-checkbox__control,
.nb-checkbox-wrapper.is-valid .nb-checkbox__control {
  border: 2px solid var(--nb-success);
}

/* Disabled：边框变淡 */
.nb-checkbox:disabled + .nb-checkbox__control,
.nb-checkbox[aria-disabled="true"] + .nb-checkbox__control {
  border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
}
```

### 6.3 例外情况

Checkbox **无圆角例外**。始终保持 `border-radius: 0`。

---

## 7. 颜色策略

### 7.1 语义颜色 Token 使用

| 用途 | Token | 说明 |
|------|-------|------|
| 默认背景 | `--nb-base-100` | 页面底层，Checkbox 控件的默认底色 |
| 默认边框 | `--nb-border` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` |
| 选中背景 | `--nb-checkbox-checked-bg` | 映射到对应变体的主色（默认 `--nb-base-300`） |
| 选中文本色 | `--nb-checkbox-checked-text` | 映射到对应变体的对比色 |
| 焦点色 | `--nb-focus` | `oklch(70% 0.15 250)` — 亮蓝 |
| 错误色 | `--nb-error` | 表单验证错误 |
| 成功色 | `--nb-success` | 表单验证通过 |

### 7.2 颜色状态映射

```css
/* Default */
.nb-checkbox__control {
  background-color: var(--nb-base-100);
  border-color: var(--nb-border);
}

/* Hover（背景微调） */
.nb-checkbox-wrapper:hover .nb-checkbox__control {
  background-color: color-mix(in oklch, var(--nb-base-100) 90%, var(--nb-base-200));
}

/* Checked */
.nb-checkbox:checked + .nb-checkbox__control,
.nb-checkbox__control.is-checked {
  background-color: var(--nb-checkbox-checked-bg);
  border-color: var(--nb-checkbox-checked-border);
  color: var(--nb-checkbox-checked-text);
}

/* Checked + Hover */
.nb-checkbox-wrapper:hover .nb-checkbox__control.is-checked,
.nb-checkbox-wrapper:hover .nb-checkbox:checked + .nb-checkbox__control {
  background-color: color-mix(in oklch, var(--nb-checkbox-checked-bg) 90%, black);
}

/* Invalid */
.nb-checkbox[aria-invalid="true"] + .nb-checkbox__control,
.nb-checkbox-wrapper.is-invalid .nb-checkbox__control {
  background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
}

/* Valid */
.nb-checkbox[aria-valid="true"] + .nb-checkbox__control,
.nb-checkbox-wrapper.is-valid .nb-checkbox__control {
  background-color: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
}

/* Disabled */
.nb-checkbox:disabled + .nb-checkbox__control,
.nb-checkbox[aria-disabled="true"] + .nb-checkbox__control {
  background-color: color-mix(in oklch, var(--nb-base-200) 50%, transparent);
}

/* Disabled + Checked */
.nb-checkbox:disabled:checked + .nb-checkbox__control {
  background-color: color-mix(in oklch, var(--nb-checkbox-checked-bg) 50%, transparent);
  border-color: color-mix(in oklch, var(--nb-checkbox-checked-border) 50%, transparent);
}
```

### 7.3 颜色混合规则

- **Hover 背景微调**：使用 `color-mix(in oklch, var(--nb-base-100) 90%, var(--nb-base-200))`，向 base-200 混合 10%，提供微妙的 hover 背景变化。
- **Checked + Hover**：使用 `color-mix(in oklch, var(--nb-checkbox-checked-bg) 90%, black)`，向黑色混合 10%，使选中状态在 Hover 时略微加深。
- **Disabled**：统一使用 `color-mix(..., 50%, transparent)` 降低饱和度。

> **禁止**：任何场景下不得硬编码 `#hex` 或未经批准的 `oklch()` 值。所有颜色必须通过 CSS 变量或 `color-mix` 动态计算。

---

## 8. 可访问性要求

### 8.1 键盘可操作性

| 交互 | 要求 | 说明 |
|------|------|------|
| `Tab` 顺序 | 可聚焦 | 原生 `<input type="checkbox">` 默认可聚焦。若使用自定义 Checkbox，必须设置 `tabindex="0"`。 |
| `Space` 切换 | 必须支持 | 按下 `Space` 切换 `checked` 状态。这是 Checkbox 的标准键盘行为。 |
| `Enter` 不触发 | 必须禁止 | Checkbox 不响应 `Enter` 键，防止表单意外提交。 |
| 组内导航 | 推荐支持 | 当 Checkbox 位于 `.nb-checkbox-group` 时，支持 `Arrow Up/Down` 在组内移动焦点。 |

### 8.2 Focus Visible 样式

```css
.nb-checkbox:focus-visible + .nb-checkbox__control {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

/* 当 Focus 与 Hover 同时发生 */
.nb-checkbox-wrapper:hover .nb-checkbox:focus-visible + .nb-checkbox__control {
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  transform: translate(-1px, -1px);
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

/* Disabled 时无焦点环 */
.nb-checkbox:disabled:focus-visible + .nb-checkbox__control,
.nb-checkbox[aria-disabled="true"]:focus-visible + .nb-checkbox__control {
  outline: none;
}
```

### 8.3 ARIA 属性

```html
<!-- 基础 Checkbox -->
<input type="checkbox" class="nb-checkbox" aria-checked="false" />

<!-- 禁用状态 -->
<input type="checkbox" class="nb-checkbox" disabled aria-disabled="true" />

<!-- 无效状态 -->
<input type="checkbox" class="nb-checkbox" aria-invalid="true" aria-describedby="error-msg" />
<div id="error-msg" class="nb-error-text">必须同意服务条款才能继续</div>

<!-- Indeterminate 状态（需 JS 设置） -->
<input type="checkbox" class="nb-checkbox" aria-checked="mixed" data-indeterminate="true" />
```

```css
/* Indeterminate 样式：显示横线而非对勾 */
.nb-checkbox[data-indeterminate="true"]:checked + .nb-checkbox__control .nb-checkbox__icon,
.nb-checkbox__control.is-indeterminate .nb-checkbox__icon {
  display: none;
}

.nb-checkbox[data-indeterminate="true"]:checked + .nb-checkbox__control::after,
.nb-checkbox__control.is-indeterminate::after {
  content: "";
  display: block;
  width: 60%;
  height: 2px;
  background-color: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 8.4 RTL 适配（逻辑属性）

```css
.nb-checkbox-wrapper {
  /* 使用逻辑属性，确保 RTL 自动翻转 */
  padding-inline-start: 0;
  padding-inline-end: 0;
}

.nb-checkbox__label {
  margin-inline-start: 0.5rem;
  margin-inline-end: 0;
}

/* Invalid 状态的强调边框使用逻辑属性 */
.nb-checkbox[aria-invalid="true"] + .nb-checkbox__control,
.nb-checkbox-wrapper.is-invalid .nb-checkbox__control {
  border-inline-start-width: 3px;
  border-inline-start-color: var(--nb-error);
}

/* 组内水平布局的 gap 使用逻辑属性 */
.nb-checkbox-group--horizontal {
  gap: 1rem;
}
```

### 8.5 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-checkbox__control,
  .nb-checkbox__icon {
    transition: none !important;
  }

  .nb-checkbox-wrapper:hover .nb-checkbox__control,
  .nb-checkbox-wrapper:active .nb-checkbox__control {
    transform: none !important;
  }

  /* 保留即时阴影切换，但无动画 */
  .nb-checkbox-wrapper:hover .nb-checkbox__control {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-checkbox-wrapper:active .nb-checkbox__control {
    box-shadow: var(--nb-shadow-none);
  }
}
```

### 8.6 forced-colors（高对比度模式）

```css
@media (forced-colors: active) {
  .nb-checkbox__control {
    border: 2px solid currentColor;
    forced-color-adjust: none;
  }

  .nb-checkbox:checked + .nb-checkbox__control,
  .nb-checkbox__control.is-checked {
    background-color: Highlight;
    border-color: Highlight;
    color: HighlightText;
  }

  .nb-checkbox:focus-visible + .nb-checkbox__control {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .nb-checkbox__icon {
    color: currentColor;
  }
}
```

### 8.7 移动端可用性（320px 视口）

| 检查项 | 要求 | 实现方式 |
|--------|------|----------|
| 最小触控区域 | 44×44px | 控件本身 1.25rem (20px) + 标签点击区域 + wrapper 的 padding。确保 `.nb-checkbox-wrapper` 的点击区域 ≥ 44px 高。 |
| 字号可读性 | 16px 基准 | 默认 `md` 尺寸使用 1rem (16px) 标签字号，避免 iOS 自动放大。 |
| 间距 | 不拥挤 | 垂直组内 gap 0.75rem，确保手指不会误触相邻项。 |
| 200% 缩放 | 布局不崩坏 | 所有尺寸使用 rem 单位，布局使用 flex 而非固定像素。 |

```css
/* 确保 wrapper 最小点击区域 */
.nb-checkbox-wrapper {
  min-height: 44px;
  min-width: 44px;
}

/* 在极小屏幕上调整 */
@media (max-width: 320px) {
  .nb-checkbox-wrapper {
    gap: 0.375rem;
  }

  .nb-checkbox-group {
    gap: 0.5rem;
  }

  .nb-checkbox__label {
    font-size: 0.875rem;
  }
}
```

---

## 9. 完整 CSS 示例

### 9.1 CSS 实现（使用 @layer）

```css
/* =============================================
   Neo-Brutal UI — Checkbox Component
   ============================================= */

@layer nb-components {
  /* ---- 根变量映射 ---- */
  .nb-checkbox-wrapper {
    --nb-checkbox-bg: var(--nb-base-100);
    --nb-checkbox-border: var(--nb-border);
    --nb-checkbox-checked-bg: var(--nb-base-300);
    --nb-checkbox-checked-border: var(--nb-base-content);
    --nb-checkbox-checked-text: var(--nb-base-content);
  }

  /* ---- 基础 Wrapper ---- */
  .nb-checkbox-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    position: relative;
  }

  /* 隐藏原生 input（但保持可交互） */
  .nb-checkbox {
    position: absolute;
    inset: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 1;
    margin: 0;
  }

  /* ---- 视觉控件 ---- */
  .nb-checkbox__control {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    background-color: var(--nb-checkbox-bg);
    border: 2px solid var(--nb-checkbox-border);
    border-radius: var(--nb-radius-selector); /* 0px */
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
    transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
                box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
                border-color var(--nb-duration-fast) var(--nb-easing-standard),
                background-color var(--nb-duration-fast) var(--nb-easing-standard);
    will-change: transform, box-shadow;
  }

  /* ---- Check 图标 ---- */
  .nb-checkbox__icon {
    width: 14px;
    height: 14px;
    color: var(--nb-checkbox-checked-text);
    opacity: 0;
    transform: scale(0.8);
    transition: opacity var(--nb-duration-fast) var(--nb-easing-standard),
                transform var(--nb-duration-fast) var(--nb-easing-standard);
    pointer-events: none;
  }

  /* ---- 标签 ---- */
  .nb-checkbox__label {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--nb-base-content);
    font-weight: var(--nb-weight-normal);
    user-select: none;
  }

  .nb-checkbox__description {
    font-size: 0.875rem;
    line-height: 1.375;
    color: color-mix(in oklch, var(--nb-base-content) 60%, transparent);
    user-select: none;
  }

  /* =============================================
     状态规则
     ============================================= */

  /* Hover */
  @media (hover: hover) and (pointer: fine) {
    .nb-checkbox-wrapper:hover .nb-checkbox__control {
      box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
      transform: translate(-1px, -1px);
      border-color: color-mix(in oklch, var(--nb-checkbox-border) 80%, var(--nb-base-100));
      background-color: color-mix(in oklch, var(--nb-checkbox-bg) 90%, var(--nb-base-200));
    }
  }

  /* Active / Pressed */
  .nb-checkbox-wrapper:active .nb-checkbox__control {
    box-shadow: var(--nb-shadow-none);
    transform: translate(2px, 2px);
    border-color: color-mix(in oklch, var(--nb-checkbox-border) 120%, var(--nb-base-300));
    transition-duration: var(--nb-duration-fast);
  }

  /* Checked */
  .nb-checkbox:checked + .nb-checkbox__control,
  .nb-checkbox__control.is-checked {
    background-color: var(--nb-checkbox-checked-bg);
    border-color: var(--nb-checkbox-checked-border);
    box-shadow: var(--nb-shadow-xs) var(--nb-shadow-color);
  }

  .nb-checkbox:checked + .nb-checkbox__control .nb-checkbox__icon,
  .nb-checkbox__control.is-checked .nb-checkbox__icon {
    opacity: 1;
    transform: scale(1);
  }

  /* Checked + Hover */
  @media (hover: hover) and (pointer: fine) {
    .nb-checkbox-wrapper:hover .nb-checkbox:checked + .nb-checkbox__control,
    .nb-checkbox-wrapper:hover .nb-checkbox__control.is-checked {
      background-color: color-mix(in oklch, var(--nb-checkbox-checked-bg) 90%, black);
      box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
      transform: translate(-1px, -1px);
    }
  }

  /* Checked + Active */
  .nb-checkbox-wrapper:active .nb-checkbox:checked + .nb-checkbox__control,
  .nb-checkbox-wrapper:active .nb-checkbox__control.is-checked {
    box-shadow: var(--nb-shadow-none);
    transform: translate(2px, 2px);
  }

  /* Focus Visible */
  .nb-checkbox:focus-visible + .nb-checkbox__control {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  /* Focus + Hover */
  @media (hover: hover) and (pointer: fine) {
    .nb-checkbox-wrapper:hover .nb-checkbox:focus-visible + .nb-checkbox__control {
      box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
      transform: translate(-1px, -1px);
    }
  }

  /* Disabled */
  .nb-checkbox:disabled,
  .nb-checkbox[aria-disabled="true"] {
    cursor: not-allowed;
  }

  .nb-checkbox:disabled + .nb-checkbox__control,
  .nb-checkbox[aria-disabled="true"] + .nb-checkbox__control {
    opacity: 0.5;
    box-shadow: var(--nb-shadow-none);
    transform: none;
    border-color: color-mix(in oklch, var(--nb-checkbox-border) 50%, transparent);
    background-color: color-mix(in oklch, var(--nb-base-200) 50%, transparent);
    cursor: not-allowed;
  }

  .nb-checkbox:disabled + .nb-checkbox__control .nb-checkbox__icon,
  .nb-checkbox[aria-disabled="true"] + .nb-checkbox__control .nb-checkbox__icon {
    opacity: 0.5;
  }

  /* Disabled + Checked */
  .nb-checkbox:disabled:checked + .nb-checkbox__control {
    background-color: color-mix(in oklch, var(--nb-checkbox-checked-bg) 50%, transparent);
    border-color: color-mix(in oklch, var(--nb-checkbox-checked-border) 50%, transparent);
  }

  .nb-checkbox:disabled:checked + .nb-checkbox__control .nb-checkbox__icon {
    opacity: 0.5;
    transform: scale(1);
  }

  /* Invalid */
  .nb-checkbox[aria-invalid="true"] + .nb-checkbox__control,
  .nb-checkbox-wrapper.is-invalid .nb-checkbox__control {
    border: 2px solid var(--nb-error);
    border-inline-start-width: 3px;
    background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
  }

  .nb-checkbox[aria-invalid="true"]:focus-visible + .nb-checkbox__control,
  .nb-checkbox-wrapper.is-invalid .nb-checkbox:focus-visible + .nb-checkbox__control {
    outline-color: var(--nb-error);
  }

  /* Valid */
  .nb-checkbox[aria-valid="true"] + .nb-checkbox__control,
  .nb-checkbox-wrapper.is-valid .nb-checkbox__control {
    border: 2px solid var(--nb-success);
    background-color: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
  }

  /* Indeterminate */
  .nb-checkbox[data-indeterminate="true"]:checked + .nb-checkbox__control .nb-checkbox__icon,
  .nb-checkbox__control.is-indeterminate .nb-checkbox__icon {
    opacity: 0;
    transform: scale(0.8);
  }

  .nb-checkbox[data-indeterminate="true"]:checked + .nb-checkbox__control::after,
  .nb-checkbox__control.is-indeterminate::after {
    content: "";
    display: block;
    width: 60%;
    height: 2px;
    background-color: currentColor;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /* =============================================
     尺寸变体
     ============================================= */

  .nb-checkbox-wrapper--xs .nb-checkbox__control { width: 0.875rem; height: 0.875rem; }
  .nb-checkbox-wrapper--xs .nb-checkbox__icon { width: 10px; height: 10px; }
  .nb-checkbox-wrapper--xs .nb-checkbox__label { font-size: 0.75rem; line-height: 1.25; }

  .nb-checkbox-wrapper--sm .nb-checkbox__control { width: 1rem; height: 1rem; }
  .nb-checkbox-wrapper--sm .nb-checkbox__icon { width: 12px; height: 12px; }
  .nb-checkbox-wrapper--sm .nb-checkbox__label { font-size: 0.875rem; line-height: 1.375; }

  .nb-checkbox-wrapper--lg .nb-checkbox__control { width: 1.5rem; height: 1.5rem; }
  .nb-checkbox-wrapper--lg .nb-checkbox__icon { width: 16px; height: 16px; }
  .nb-checkbox-wrapper--lg .nb-checkbox__label { font-size: 1.125rem; line-height: 1.5; }

  .nb-checkbox-wrapper--xl .nb-checkbox__control { width: 1.75rem; height: 1.75rem; }
  .nb-checkbox-wrapper--xl .nb-checkbox__icon { width: 20px; height: 20px; }
  .nb-checkbox-wrapper--xl .nb-checkbox__label { font-size: 1.25rem; line-height: 1.5; }

  /* =============================================
     布局变体
     ============================================= */

  .nb-checkbox-wrapper--stacked {
    align-items: flex-start;
  }

  .nb-checkbox-wrapper--stacked .nb-checkbox__text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nb-checkbox-wrapper--reverse {
    flex-direction: row-reverse;
  }

  .nb-checkbox-wrapper--bare {
    gap: 0;
  }

  .nb-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .nb-checkbox-group--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  /* =============================================
     颜色变体
     ============================================= */

  .nb-checkbox-wrapper--primary {
    --nb-checkbox-checked-bg: var(--nb-primary);
    --nb-checkbox-checked-border: var(--nb-primary);
    --nb-checkbox-checked-text: var(--nb-primary-content);
  }

  .nb-checkbox-wrapper--secondary {
    --nb-checkbox-checked-bg: var(--nb-secondary);
    --nb-checkbox-checked-border: var(--nb-secondary);
    --nb-checkbox-checked-text: var(--nb-secondary-content);
  }

  .nb-checkbox-wrapper--accent {
    --nb-checkbox-checked-bg: var(--nb-accent);
    --nb-checkbox-checked-border: var(--nb-accent);
    --nb-checkbox-checked-text: var(--nb-accent-content);
  }

  .nb-checkbox-wrapper--success {
    --nb-checkbox-checked-bg: var(--nb-success);
    --nb-checkbox-checked-border: var(--nb-success);
    --nb-checkbox-checked-text: var(--nb-success-content);
  }

  .nb-checkbox-wrapper--warning {
    --nb-checkbox-checked-bg: var(--nb-warning);
    --nb-checkbox-checked-border: var(--nb-warning);
    --nb-checkbox-checked-text: var(--nb-warning-content);
  }

  .nb-checkbox-wrapper--error {
    --nb-checkbox-checked-bg: var(--nb-error);
    --nb-checkbox-checked-border: var(--nb-error);
    --nb-checkbox-checked-text: var(--nb-error-content);
  }
}

@layer nb-utilities {
  /* =============================================
     可访问性增强
     ============================================= */

  @media (prefers-reduced-motion: reduce) {
    .nb-checkbox__control,
    .nb-checkbox__icon {
      transition: none !important;
    }

    .nb-checkbox-wrapper:hover .nb-checkbox__control,
    .nb-checkbox-wrapper:active .nb-checkbox__control {
      transform: none !important;
    }

    .nb-checkbox-wrapper:hover .nb-checkbox__control {
      box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    }

    .nb-checkbox-wrapper:active .nb-checkbox__control {
      box-shadow: var(--nb-shadow-none);
    }
  }

  @media (forced-colors: active) {
    .nb-checkbox__control {
      border: 2px solid currentColor;
      forced-color-adjust: none;
    }

    .nb-checkbox:checked + .nb-checkbox__control,
    .nb-checkbox__control.is-checked {
      background-color: Highlight;
      border-color: Highlight;
      color: HighlightText;
    }

    .nb-checkbox:focus-visible + .nb-checkbox__control {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  }

  @media (max-width: 320px) {
    .nb-checkbox-wrapper {
      gap: 0.375rem;
      min-height: auto;
    }

    .nb-checkbox-group {
      gap: 0.5rem;
    }

    .nb-checkbox__label {
      font-size: 0.875rem;
    }
  }
}
```

### 9.2 HTML 使用示例

```html
<!-- 基础 Checkbox -->
<label class="nb-checkbox-wrapper">
  <input type="checkbox" class="nb-checkbox" name="terms" />
  <span class="nb-checkbox__control" aria-hidden="true">
    <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
    </svg>
  </span>
  <span class="nb-checkbox__label">我同意服务条款</span>
</label>

<!-- Primary 变体 -->
<label class="nb-checkbox-wrapper nb-checkbox-wrapper--primary">
  <input type="checkbox" class="nb-checkbox" name="subscribe" checked />
  <span class="nb-checkbox__control" aria-hidden="true">
    <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
    </svg>
  </span>
  <span class="nb-checkbox__label">订阅邮件通知</span>
</label>

<!-- 带描述文本 -->
<label class="nb-checkbox-wrapper nb-checkbox-wrapper--stacked">
  <input type="checkbox" class="nb-checkbox" name="newsletter" aria-describedby="newsletter-desc" />
  <span class="nb-checkbox__control" aria-hidden="true">
    <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
    </svg>
  </span>
  <span class="nb-checkbox__text">
    <span class="nb-checkbox__label">每周订阅</span>
    <span class="nb-checkbox__description" id="newsletter-desc">每周一上午发送最新产品动态，可随时取消。</span>
  </span>
</label>

<!-- 禁用状态 -->
<label class="nb-checkbox-wrapper">
  <input type="checkbox" class="nb-checkbox" name="disabled" disabled aria-disabled="true" />
  <span class="nb-checkbox__control" aria-hidden="true">
    <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
    </svg>
  </span>
  <span class="nb-checkbox__label">不可用选项</span>
</label>

<!-- 无效状态 -->
<label class="nb-checkbox-wrapper is-invalid">
  <input type="checkbox" class="nb-checkbox" name="required" aria-invalid="true" aria-describedby="error-msg" />
  <span class="nb-checkbox__control" aria-hidden="true">
    <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
    </svg>
  </span>
  <span class="nb-checkbox__label">必须勾选此项</span>
</label>
<div id="error-msg" class="nb-error-text" style="color: var(--nb-error); font-size: 0.875rem; margin-top: 0.25rem;">
  您必须同意服务条款才能继续
</div>

<!-- Checkbox 组 -->
<fieldset class="nb-checkbox-group">
  <legend class="nb-label" style="margin-bottom: 0.75rem;">选择偏好</legend>
  <label class="nb-checkbox-wrapper nb-checkbox-wrapper--primary">
    <input type="checkbox" class="nb-checkbox" name="prefs" value="email" />
    <span class="nb-checkbox__control" aria-hidden="true">
      <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
      </svg>
    </span>
    <span class="nb-checkbox__label">邮件通知</span>
  </label>
  <label class="nb-checkbox-wrapper nb-checkbox-wrapper--secondary">
    <input type="checkbox" class="nb-checkbox" name="prefs" value="sms" />
    <span class="nb-checkbox__control" aria-hidden="true">
      <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
      </svg>
    </span>
    <span class="nb-checkbox__label">短信提醒</span>
  </label>
  <label class="nb-checkbox-wrapper nb-checkbox-wrapper--accent">
    <input type="checkbox" class="nb-checkbox" name="prefs" value="push" />
    <span class="nb-checkbox__control" aria-hidden="true">
      <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
      </svg>
    </span>
    <span class="nb-checkbox__label">推送通知</span>
  </label>
</fieldset>

<!-- 水平排列组 -->
<fieldset class="nb-checkbox-group nb-checkbox-group--horizontal">
  <label class="nb-checkbox-wrapper nb-checkbox-wrapper--sm">
    <input type="checkbox" class="nb-checkbox" name="tags" value="design" />
    <span class="nb-checkbox__control" aria-hidden="true">
      <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
      </svg>
    </span>
    <span class="nb-checkbox__label">设计</span>
  </label>
  <label class="nb-checkbox-wrapper nb-checkbox-wrapper--sm">
    <input type="checkbox" class="nb-checkbox" name="tags" value="dev" />
    <span class="nb-checkbox__control" aria-hidden="true">
      <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
      </svg>
    </span>
    <span class="nb-checkbox__label">开发</span>
  </label>
  <label class="nb-checkbox-wrapper nb-checkbox-wrapper--sm">
    <input type="checkbox" class="nb-checkbox" name="tags" value="product" />
    <span class="nb-checkbox__control" aria-hidden="true">
      <svg class="nb-checkbox__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="3 8 6.5 11.5 13 4.5" stroke-linecap="square" stroke-linejoin="miter" />
      </svg>
    </span>
    <span class="nb-checkbox__label">产品</span>
  </label>
</fieldset>
```

---

## 10. 检查清单

以下检查清单与全局文档阶段 2.7 的验收标准对齐。Checkbox 组件在进入开发阶段前必须逐项通过。

### 10.1 视觉与风格

- [ ] 所有边框是否使用 `2px solid` 且颜色为 `color-mix(in oklch, var(--nb-base-content) 20%, transparent)`？
- [ ] 控件是否使用 `var(--nb-radius-selector)`（即 `0px`）作为圆角，无圆角例外？
- [ ] 阴影是否使用 `box-shadow` 且 `blur = 0`、`spread = 0`？
- [ ] 阴影颜色是否使用 `color-mix(in oklch, ...)` 而非固定 `#000`？
- [ ] 是否无渐变、无纹理、无模糊阴影？

### 10.2 交互与状态

- [ ] Hover 状态是否使用 `transform: translate(-1px, -1px)` 而非 `margin` 或 `position`？
- [ ] Active 状态位移量是否 ≤ 默认阴影偏移量（2px ≤ 2px）？
- [ ] 过渡时长是否 ≤ 150ms（标准状态）？
- [ ] 是否实现 `:focus-visible` 的 `2px solid var(--nb-focus)` 外框 + `outline-offset: 2px`？
- [ ] Disabled 状态是否设置 `opacity: 0.5`、`box-shadow: none`、`cursor: not-allowed`？
- [ ] Disabled 状态是否同时阻断 Hover 和 Active 的视觉效果？
- [ ] Checked 状态是否显示 Check 图标，且背景/边框色正确映射到对应变体？
- [ ] Indeterminate 状态是否显示横线（—）而非对勾？
- [ ] Invalid 状态是否设置 `border-inline-start-width: 3px` 并使用 `var(--nb-error)`？
- [ ] 状态冲突时是否遵循正确的优先级（Disabled > Invalid > Checked > Active > Hover > Focus）？

### 10.3 可访问性

- [ ] 是否支持 `Tab` 键聚焦和 `Space` 键切换？
- [ ] 是否设置了正确的 `aria-checked`（`true`/`false`/`mixed`）？
- [ ] 禁用状态是否使用 `aria-disabled="true"` 或原生 `disabled`？
- [ ] 无效状态是否使用 `aria-invalid="true"` 并关联 `aria-describedby`？
- [ ] 是否使用逻辑属性（`inline-start`、`inline-end`）支持 RTL？
- [ ] 是否实现 `@media (prefers-reduced-motion: reduce)` 并取消位移？
- [ ] 是否实现 `@media (forced-colors: active)` 并确保边框可见？
- [ ] 最小触控区域是否 ≥ 44×44px？
- [ ] 200% 缩放时布局是否不崩坏（所有尺寸使用 rem）？
- [ ] 320px 视口下是否可用（字体不缩小到不可读）？

### 10.4 代码质量

- [ ] 是否使用 CSS 变量而非硬编码值？
- [ ] 是否使用 `@layer` 组织代码？
- [ ] 是否使用 `color-mix(in oklch, ...)` 进行颜色计算？
- [ ] 是否使用 `transform` 而非触发重排的属性？
- [ ] 是否清除 `-webkit-tap-highlight-color` 避免浏览器默认高亮冲突？
- [ ] 是否实现触摸设备策略（`@media (hover: hover)` 精准判断）？
- [ ] 类名是否以 `nb-` 为前缀？
- [ ] 是否存在未使用的选择器或冗余代码？

---

> **文档版本**：v1.0
> **最后更新**：2025 年 6 月
> **维护者**：Neo-Brutal UI 设计系统团队
> **审核状态**：待技术评审（Tech Review）
> **关联文档**：`brand-and-tenets.md`（§2.2.3 硬阴影、§2.2.7 密度）、`shadows-and-motion.md`（§2.1 阴影阶梯、§2.2 位移公式）、`radius-and-borders.md`（§3.1 Selector 类别）、`interaction-language.md`（§1.9 Selected/Checked、§1.7 Invalid）
