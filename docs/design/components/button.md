# Button 组件设计基准稿

> **组件名称**：Button（按钮）  
> **适用范围**：Neo-Brutal UI 全部交互式按钮场景（提交、取消、导航、图标按钮等）  
> **依赖文档**：`brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md`  
> **最后更新**：2025 年 6 月  
> **审核状态**：待技术评审（Tech Review）

---

## 1. 组件概述

### 1.1 组件名称和用途

**Button** 是 Neo-Brutal UI 最基础的交互组件，用于触发操作、提交表单、导航或切换状态。其视觉设计必须传达「可按下」的物理感——通过硬阴影、刚性位移和粗边框实现。

### 1.2 对应语义 HTML 元素

| 场景 | 推荐元素 | 理由 |
|------|----------|------|
| 表单提交/操作 | `<button type="submit">` | 原生语义，支持 `disabled`，键盘可访问 |
| 普通操作 | `<button type="button">` | 默认行为安全，JS 绑定事件 |
| 页面导航 | `<a>` | 使用 `href`，必须配合 `role="button"` 当行为非导航时 |
| 切换状态 | `<button>` + `aria-pressed` | Toggle Button 模式 |

**禁止**：使用 `<div>` 或 `<span>` 模拟按钮。

### 1.3 类名

| 类名 | 用途 | 状态 |
|------|------|------|
| `.nb-btn` | 基础按钮类，必需 | 强制 |
| `.nb-btn--{size}` | 尺寸变体：`xs`、`sm`、`md`、`lg`、`xl` | 可选，默认 `md` |
| `.nb-btn--{variant}` | 颜色变体：`primary`、`neutral`、`secondary`、`accent`、`info`、`success`、`warning`、`error` | 可选，默认 `neutral` |
| `.nb-btn--{style}` | 外观变体：`solid`（默认）、`outline`、`ghost`、`link` | 可选，默认 `solid` |
| `.nb-btn--full` | 宽度占满父容器 | 可选 |
| `.nb-btn--square` | 宽高相等，用于图标按钮 | 可选 |
| `.nb-btn--loading` | 加载状态修饰类 | 状态类 |
| `.nb-btn--selected` | 选中/激活状态修饰类 | 状态类 |

---

## 2. DOM Contract

### 2.1 推荐 HTML 结构

```html
<!-- 基础按钮 -->
<button class="nb-btn" type="button">
  <span class="nb-btn__icon" aria-hidden="true">
    <svg>...</svg>
  </span>
  <span class="nb-btn__label">按钮文本</span>
</button>

<!-- 图标-only 按钮（必须保留 aria-label） -->
<button class="nb-btn nb-btn--square" type="button" aria-label="关闭">
  <span class="nb-btn__icon" aria-hidden="true">
    <svg>...</svg>
  </span>
</button>

<!-- 加载状态按钮 -->
<button class="nb-btn nb-btn--loading" type="button" aria-busy="true" disabled>
  <span class="nb-btn__spinner" aria-hidden="true"></span>
  <span class="nb-btn__label">加载中...</span>
</button>

<!-- 链接样式按钮（实际导航） -->
<a class="nb-btn nb-btn--link" href="/target" role="button">
  <span class="nb-btn__label">前往页面</span>
</a>
```

### 2.2 子元素说明

| 元素 | 类名 | 必需/可选 | 说明 |
|------|------|-----------|------|
| 根元素 | `.nb-btn` | **必需** | 只能是 `<button>` 或 `<a>` |
| 图标容器 | `.nb-btn__icon` | 可选 | 位于文本左侧或独立存在（图标按钮） |
| 文本标签 | `.nb-btn__label` | 图标按钮外**必需** | 承载可见文本 |
| Loading 指示器 | `.nb-btn__spinner` | 可选 | 加载状态替代内容，使用几何形 pulse 动画 |

### 2.3 ARIA 属性要求

| 属性 | 场景 | 值 | 说明 |
|------|------|-----|------|
| `type` | `<button>` | `"button"` / `"submit"` / `"reset"` | 明确按钮类型，避免默认 submit 行为 |
| `aria-label` | 图标按钮（无文本） | 描述操作 | 替代无文本的语义 |
| `aria-pressed` | Toggle Button | `"true"` / `"false"` | 表示切换状态 |
| `aria-busy` | Loading 状态 | `"true"` | 告知正在处理 |
| `aria-disabled` | 禁用状态（非表单元素） | `"true"` | 对 `<a>` 使用，配合 `pointer-events: none` |
| `aria-expanded` | 菜单/下拉按钮 | `"true"` / `"false"` | 表示展开状态 |

### 2.4 键盘行为

| 按键 | 行为 | 说明 |
|------|------|------|
| `Tab` | 聚焦到下一个可聚焦元素 | 遵循文档 Tab 顺序 |
| `Shift + Tab` | 聚焦到上一个可聚焦元素 | — |
| `Enter` / `Space` | 触发按钮点击 | 标准激活行为；`Enter` 在 `<a>` 上触发导航 |
| `Esc` | 无（默认） | 不处理，留给上层组件（如 Modal） |

---

## 3. 尺寸与变体

### 3.1 尺寸变体

按钮属于 **Field** 类别，所有尺寸均使用 `Default` 密度（`padding` 不随密度模式变化，由尺寸类控制）。

| 尺寸 | 类名 | `padding` (inline / block) | `font-size` | `min-height` | `min-width` | 图标尺寸 | 阴影 Token |
|------|------|---------------------------|-------------|--------------|-------------|----------|-----------|
| **xs** | `.nb-btn--xs` | `0.375rem 0.5rem` | `0.75rem` (12px) | `28px` | `auto` | `0.875rem` | `--nb-shadow-xs` |
| **sm** | `.nb-btn--sm` | `0.5rem 0.75rem` | `0.8125rem` (13px) | `32px` | `auto` | `1rem` | `--nb-shadow-sm` |
| **md** | `.nb-btn--md` (默认) | `0.75rem 1.25rem` | `0.875rem` (14px) | `40px` | `auto` | `1.125rem` | `--nb-shadow-md` |
| **lg** | `.nb-btn--lg` | `1rem 1.75rem` | `1rem` (16px) | `48px` | `auto` | `1.25rem` | `--nb-shadow-md` |
| **xl** | `.nb-btn--xl` | `1.25rem 2.25rem` | `1.125rem` (18px) | `56px` | `auto` | `1.5rem` | `--nb-shadow-lg` |

**说明：**

- `min-height` 保证触摸设备可点击区域（≥ 44px 推荐，md 及以上 ≥ 48px）。
- `font-weight` 所有尺寸统一为 `var(--nb-weight-bold)`（700）。
- `line-height` 统一为 `1.25`。
- `letter-spacing` 默认 `var(--nb-tracking-normal)`（0）；可选 `uppercase` 变体使用 `var(--nb-tracking-wide)`。

### 3.2 颜色变体（语义变体）

| 变体 | 类名 | 背景色 | 文本色 | 边框色 | 用途 |
|------|------|--------|--------|--------|------|
| **neutral** (默认) | `.nb-btn--neutral` | `var(--nb-base-200)` | `var(--nb-base-content)` | `var(--nb-border)` | 次要操作、取消 |
| **primary** | `.nb-btn--primary` | `var(--nb-primary)` | `var(--nb-primary-content)` | `color-mix(in oklch, var(--nb-primary-content) 20%, transparent)` | 主要操作、提交 |
| **secondary** | `.nb-btn--secondary` | `var(--nb-secondary)` | `var(--nb-secondary-content)` | `color-mix(in oklch, var(--nb-secondary-content) 20%, transparent)` | 替代主色 |
| **accent** | `.nb-btn--accent` | `var(--nb-accent)` | `var(--nb-accent-content)` | `color-mix(in oklch, var(--nb-accent-content) 20%, transparent)` | 强调 |
| **info** | `.nb-btn--info` | `var(--nb-info)` | `var(--nb-info-content)` | `color-mix(in oklch, var(--nb-info-content) 20%, transparent)` | 信息提示 |
| **success** | `.nb-btn--success` | `var(--nb-success)` | `var(--nb-success-content)` | `color-mix(in oklch, var(--nb-success-content) 20%, transparent)` | 成功操作 |
| **warning** | `.nb-btn--warning` | `var(--nb-warning)` | `var(--nb-warning-content)` | `color-mix(in oklch, var(--nb-warning-content) 20%, transparent)` | 警告操作 |
| **error** | `.nb-btn--error` | `var(--nb-error)` | `var(--nb-error-content)` | `color-mix(in oklch, var(--nb-error-content) 20%, transparent)` | 危险操作、删除 |

### 3.3 外观变体

| 变体 | 类名 | 背景 | 边框 | 阴影 | 说明 |
|------|------|------|------|------|------|
| **solid** (默认) | `.nb-btn--solid` | 对应语义色 | 2px solid | 有 | 标准填充按钮 |
| **outline** | `.nb-btn--outline` | `transparent` | 2px solid（语义色） | 无 | 空心按钮，无阴影 |
| **ghost** | `.nb-btn--ghost` | `transparent` | 2px solid `var(--nb-border)` | 无 | 幽灵按钮，Hover 时填充 |
| **link** | `.nb-btn--link` | `transparent` | `none` | 无 | 纯文本链接样式，下划线 |

### 3.4 布局变体

| 变体 | 类名 | 规则 | 说明 |
|------|------|------|------|
| **full-width** | `.nb-btn--full` | `display: flex; width: 100%;` | 占满父容器宽度 |
| **square** | `.nb-btn--square` | `aspect-ratio: 1; padding: 0;` | 正方形图标按钮，内部内容居中 |
| **block** | `.nb-btn--block` | `display: block; width: 100%;` | 与 full 相同，保留别名 |

### 3.5 各变体 CSS 规则

```css
/* =============================================
   Button — 颜色变体（Solid）
   ============================================= */

.nb-btn--neutral {
  background-color: var(--nb-base-200);
  color: var(--nb-base-content);
  border-color: var(--nb-border);
}

.nb-btn--primary {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
}

.nb-btn--secondary {
  background-color: var(--nb-secondary);
  color: var(--nb-secondary-content);
  border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
}

.nb-btn--accent {
  background-color: var(--nb-accent);
  color: var(--nb-accent-content);
  border-color: color-mix(in oklch, var(--nb-accent-content) 20%, transparent);
}

.nb-btn--info {
  background-color: var(--nb-info);
  color: var(--nb-info-content);
  border-color: color-mix(in oklch, var(--nb-info-content) 20%, transparent);
}

.nb-btn--success {
  background-color: var(--nb-success);
  color: var(--nb-success-content);
  border-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
}

.nb-btn--warning {
  background-color: var(--nb-warning);
  color: var(--nb-warning-content);
  border-color: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
}

.nb-btn--error {
  background-color: var(--nb-error);
  color: var(--nb-error-content);
  border-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
}

/* =============================================
   Button — 外观变体
   ============================================= */

.nb-btn--outline {
  background-color: transparent;
  box-shadow: none;
}

.nb-btn--outline.nb-btn--primary {
  border-color: var(--nb-primary);
  color: var(--nb-primary);
}

.nb-btn--outline.nb-btn--neutral {
  border-color: var(--nb-border);
  color: var(--nb-base-content);
}

.nb-btn--ghost {
  background-color: transparent;
  border-color: var(--nb-border);
  box-shadow: none;
}

.nb-btn--ghost:hover {
  background-color: var(--nb-base-200);
}

.nb-btn--link {
  background-color: transparent;
  border: none;
  box-shadow: none;
  text-decoration: underline;
  text-underline-offset: 2px;
  padding-inline: 0.25rem;
}

.nb-btn--link:hover {
  text-decoration-thickness: 2px;
}

.nb-btn--link:active {
  transform: translate(2px, 2px);
}

/* =============================================
   Button — 布局变体
   ============================================= */

.nb-btn--full,
.nb-btn--block {
  display: flex;
  width: 100%;
}

.nb-btn--square {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  padding: 0;
  min-width: auto;
}
```

---

## 4. 状态矩阵

状态冲突优先级（从高到低）：`Loading` > `Disabled` > `Invalid` > `Active` > `Hover` > `Focus Visible` > `Default`。

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 其他 |
|------|------|------|------|------|--------|------|------|
| **Default** | 2px solid（语义色或 `var(--nb-border)`） | `--nb-shadow-md`（尺寸相关） | `none` | 对应变体标准色 | `1.0` | — | `cursor: pointer` |
| **Hover** | 加亮（`color-mix` 80%） | 升一级（`lg`） | `translate(-2px, -2px)` | 背景色微调（`color-mix` 90% + 黑） | `1.0` | `150ms` `brutal` | `cursor: pointer` |
| **Active / Pressed** | 加深（`color-mix` 120%） | `--nb-shadow-none` | `translate(4px, 4px)` | 背景色微调（`color-mix` 80% + 黑） | `1.0` | `150ms` `brutal` | `cursor: pointer` |
| **Focus Visible** | 不变 | 不变 | `none` | `outline: 2px solid var(--nb-focus); outline-offset: 2px` | `1.0` | `100ms` standard | 不覆盖 Hover 阴影和位移 |
| **Disabled** | 变淡（`color-mix` 50%） | `--nb-shadow-none` | `none` | 全部变淡（`color-mix` 50%） | `0.5` | `instant` | `cursor: not-allowed; pointer-events: none`；需 `aria-disabled="true"` 或 `disabled` |
| **Loading / Busy** | 不变 | 不变 | `none` | 内容隐藏，显示 spinner | `1.0` | `1s steps(2)` pulse | `cursor: wait; pointer-events: none`；需 `aria-busy="true"`；尺寸不变 |
| **Invalid** | `var(--nb-error)`；`border-inline-start-width: 3px` | 可选 `--nb-shadow-error` | `none` | 背景微红：`color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100))` | `1.0` | `100ms` standard | 需配合 `aria-invalid="true"` |
| **Valid** | `var(--nb-success)` | 不变 | `none` | 背景微绿：`color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100))` | `1.0` | `100ms` standard | **可选**，不强制默认使用 |
| **Selected / Checked** | `var(--nb-primary)` | `--nb-shadow-sm` | `none` | 背景 `var(--nb-primary)`，文本 `var(--nb-primary-content)` | `1.0` | `100ms` standard | 需配合 `aria-pressed="true"` 或 `.nb-btn--selected` |
| **Open / Expanded** | — | — | — | — | — | — | **N/A**（Button 不承载 Open/Expanded 语义） |
| **Readonly** | — | — | — | — | — | — | **N/A**（Button 无 Readonly 状态） |
| **Dragging** | — | — | — | — | — | — | **N/A**（Button 不参与拖拽） |

**状态冲突处理说明：**

- **Hover + Focus Visible**：同时存在时，保留 Hover 的位移和阴影提升，叠加 Focus Visible 的 outline。
- **Invalid + Hover**：Hover 时保留错误边框色，阴影正常提升，位移正常发生。
- **Disabled + Hover/Active**：Disabled 优先级最高，强制覆盖所有 Hover/Active 效果。
- **Loading + Disabled**：Loading 优先于 Disabled（通常 Loading 已包含 `disabled` 属性）。

---

## 5. 阴影与位移规则

### 5.1 全局阴影 Token 使用

Button 使用 Field 类别的阴影策略。标准尺寸（`md`、`lg`）使用 `--nb-shadow-md` 为默认；小型（`xs`、`sm`）降级为 `--nb-shadow-sm`；超大型（`xl`）使用 `--nb-shadow-lg` 为默认。

| 尺寸 | 默认阴影 | Hover 阴影 | Active 阴影 |
|------|----------|------------|-------------|
| xs | `--nb-shadow-xs` | `--nb-shadow-sm` | `--nb-shadow-none` |
| sm | `--nb-shadow-sm` | `--nb-shadow-md` | `--nb-shadow-none` |
| md / lg (标准) | `--nb-shadow-md` | `--nb-shadow-lg` | `--nb-shadow-none` |
| xl | `--nb-shadow-lg` | `--nb-shadow-xl` | `--nb-shadow-none` |

### 5.2 状态位移详细规则

以标准尺寸（md，默认阴影 `md` = `4px 4px`）为例：

| 状态 | 阴影 | `transform` | 位移公式 |
|------|------|-------------|----------|
| Default | `var(--nb-shadow-md) var(--nb-shadow-color)` | `translate(0, 0)` | — |
| Hover | `var(--nb-shadow-lg) var(--nb-shadow-color)` | `translate(-2px, -2px)` | 阴影增大 2px，元素反向移动 2px |
| Active | `var(--nb-shadow-none)` | `translate(4px, 4px)` | 阴影归零，元素移向原阴影位置 |
| Focus Visible | 保留 Default / Hover | 不覆盖 | 仅添加 outline |

### 5.3 使用 `transform` 避免重排

```css
.nb-btn {
  /* ✅ 正确：使用 transform，不触发 reflow */
  transform: translate(0, 0);
  transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
              box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
              background-color var(--nb-duration-fast) var(--nb-easing-standard);
  will-change: transform, box-shadow;
}

.nb-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
}

.nb-btn:active {
  transform: translate(4px, 4px);
  box-shadow: var(--nb-shadow-none);
}
```

**禁止：**

```css
/* ❌ 错误：使用 margin 或 position 导致重排 */
.nb-btn:hover {
  margin-top: -2px;
  margin-left: -2px;
}

.nb-btn:active {
  position: relative;
  top: 4px;
  left: 4px;
}
```

### 5.4 过渡规则

| 属性 | 时长 | 缓动 | 说明 |
|------|------|------|------|
| `transform` | `var(--nb-duration-normal)` (150ms) | `var(--nb-easing-standard)` (`cubic-bezier(0.4, 0, 0.2, 1)`) | 位移过渡 |
| `box-shadow` | `var(--nb-duration-normal)` (150ms) | `var(--nb-easing-standard)` | 阴影过渡 |
| `background-color` | `var(--nb-duration-fast)` (100ms) | `var(--nb-easing-standard)` | 颜色微调 |
| `border-color` | `var(--nb-duration-fast)` (100ms) | `var(--nb-easing-standard)` | 边框微调 |

### 5.5 触摸设备策略

```css
/* 所有设备：Active 按下反馈 */
.nb-btn:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
  transition-duration: var(--nb-duration-fast); /* 触摸端更快 */
}

/* 桌面端：Hover 提升 */
@media (hover: hover) and (pointer: fine) {
  .nb-btn:hover {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  .nb-btn:hover:active {
    /* 从 Hover 直接按下：直接归零，无中间态 */
    box-shadow: var(--nb-shadow-none);
    transform: translate(4px, 4px);
  }
}

/* 触摸端：禁用 Hover 样式 */
@media (hover: none) and (pointer: coarse) {
  .nb-btn:hover {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: none;
  }
}

/* 清除浏览器默认触摸高亮 */
.nb-btn {
  -webkit-tap-highlight-color: transparent;
}
```

---

## 6. 圆角与边框

### 6.1 圆角 Token

Button 属于 **Field** 类别，使用 `--nb-radius-field`。

| 属性 | Token | 值 | 说明 |
|------|-------|-----|------|
| 默认圆角 | `--nb-radius-field` | `0px` | 直角，符合新粗野主义美学 |
| 胶囊形例外 | — | **不适用** | Button 不允许胶囊形，保留直角 |

```css
.nb-btn {
  border-radius: var(--nb-radius-field); /* 0px */
}
```

### 6.2 边框规则

| 属性 | 规则 | 值 |
|------|------|-----|
| 宽度 | 2px | `var(--nb-border-field)` = `2px` |
| 样式 | solid | `solid` |
| 颜色 | 动态计算 | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)`（neutral）或语义变体对应色 |

```css
.nb-btn {
  border: var(--nb-border-field) solid var(--nb-border-field-color);
}

/* 语义变体覆盖边框色 */
.nb-btn--primary {
  border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
}
```

### 6.3 边框动态计算（`color-mix`）

所有边框色必须使用 `color-mix(in oklch, ...)` 动态计算，禁止硬编码 `#hex` 或 `oklch()`：

```css
/* 默认边框：基于当前内容色 20% 混合 */
--nb-border-field-color: color-mix(in oklch, var(--nb-base-content) 20%, transparent);

/* 强调边框：基于当前内容色 40% 混合 */
--nb-border-field-strong: color-mix(in oklch, var(--nb-base-content) 40%, transparent);
```

### 6.4 例外情况

Button **无圆角例外**。所有变体（包括 `.nb-btn--square` 图标按钮）保持 `0px` 圆角。圆形/胶囊形仅适用于 Radio、Toggle、Badge 等功能性组件，Button 不在此列。

---

## 7. 颜色策略

### 7.1 语义颜色 Token 使用

| Token | 用途 | 说明 |
|-------|------|------|
| `--nb-primary` | 主色背景 | 主要操作按钮填充 |
| `--nb-primary-content` | 主色对比文本 | 主色按钮上的文字和图标 |
| `--nb-secondary` | 次色背景 | 替代主色场景 |
| `--nb-secondary-content` | 次色对比文本 | — |
| `--nb-accent` | 强调色背景 | 高亮操作 |
| `--nb-accent-content` | 强调色对比文本 | — |
| `--nb-info` | 信息色背景 | 提示类操作 |
| `--nb-info-content` | 信息色对比文本 | — |
| `--nb-success` | 成功色背景 | 成功操作 |
| `--nb-success-content` | 成功色对比文本 | — |
| `--nb-warning` | 警告色背景 | 警告操作 |
| `--nb-warning-content` | 警告色对比文本 | — |
| `--nb-error` | 错误色背景 | 危险操作 |
| `--nb-error-content` | 错误色对比文本 | — |
| `--nb-base-100` | 页面底层 | outline/ghost 按钮 Hover 背景 |
| `--nb-base-200` | 默认表面 | neutral 按钮背景 |
| `--nb-base-300` | 凸起表面 | neutral 按钮 Active 背景 |
| `--nb-base-content` | 默认文本色 | neutral 按钮文本 |
| `--nb-border` | 默认边框 | neutral 按钮边框 |
| `--nb-focus` | 焦点色 | `outline` 颜色，高对比 |

### 7.2 禁止硬编码

```css
/* ❌ 禁止：硬编码 hex */
.nb-btn--primary {
  background-color: #ff6b00;
}

/* ❌ 禁止：未经批准的 oklch() */
.nb-btn--primary {
  background-color: oklch(60% 0.2 30);
}

/* ✅ 正确：使用语义 Token */
.nb-btn--primary {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
}
```

### 7.3 各变体颜色详细规则

#### Solid 变体（默认）

| 变体 | 背景色 | 文本色 | 边框色 | Hover 背景 | Active 背景 |
|------|--------|--------|--------|------------|-------------|
| neutral | `var(--nb-base-200)` | `var(--nb-base-content)` | `var(--nb-border)` | `var(--nb-base-300)` | `var(--nb-base-100)` |
| primary | `var(--nb-primary)` | `var(--nb-primary-content)` | `color-mix(20%)` | `color-mix(in oklch, var(--nb-primary) 90%, black)` | `color-mix(in oklch, var(--nb-primary) 80%, black)` |
| secondary | `var(--nb-secondary)` | `var(--nb-secondary-content)` | `color-mix(20%)` | `color-mix(in oklch, var(--nb-secondary) 90%, black)` | `color-mix(in oklch, var(--nb-secondary) 80%, black)` |
| accent | `var(--nb-accent)` | `var(--nb-accent-content)` | `color-mix(20%)` | `color-mix(in oklch, var(--nb-accent) 90%, black)` | `color-mix(in oklch, var(--nb-accent) 80%, black)` |
| info | `var(--nb-info)` | `var(--nb-info-content)` | `color-mix(20%)` | `color-mix(in oklch, var(--nb-info) 90%, black)` | `color-mix(in oklch, var(--nb-info) 80%, black)` |
| success | `var(--nb-success)` | `var(--nb-success-content)` | `color-mix(20%)` | `color-mix(in oklch, var(--nb-success) 90%, black)` | `color-mix(in oklch, var(--nb-success) 80%, black)` |
| warning | `var(--nb-warning)` | `var(--nb-warning-content)` | `color-mix(20%)` | `color-mix(in oklch, var(--nb-warning) 90%, black)` | `color-mix(in oklch, var(--nb-warning) 80%, black)` |
| error | `var(--nb-error)` | `var(--nb-error-content)` | `color-mix(20%)` | `color-mix(in oklch, var(--nb-error) 90%, black)` | `color-mix(in oklch, var(--nb-error) 80%, black)` |

#### Outline 变体

| 变体 | 背景色 | 文本色 | 边框色 | Hover 背景 | Hover 文本 |
|------|--------|--------|--------|------------|------------|
| neutral | `transparent` | `var(--nb-base-content)` | `var(--nb-border)` | `var(--nb-base-200)` | 不变 |
| primary | `transparent` | `var(--nb-primary)` | `var(--nb-primary)` | `var(--nb-primary)` | `var(--nb-primary-content)` |
| error | `transparent` | `var(--nb-error)` | `var(--nb-error)` | `var(--nb-error)` | `var(--nb-error-content)` |

#### Ghost 变体

| 变体 | 背景色 | 文本色 | 边框色 | Hover 背景 | Active 背景 |
|------|--------|--------|--------|------------|-------------|
| neutral | `transparent` | `var(--nb-base-content)` | `var(--nb-border)` | `var(--nb-base-200)` | `var(--nb-base-300)` |
| primary | `transparent` | `var(--nb-primary)` | `var(--nb-border)` | `color-mix(in oklch, var(--nb-primary) 10%, transparent)` | `color-mix(in oklch, var(--nb-primary) 20%, transparent)` |

### 7.4 Hover / Active 颜色微调（`color-mix`）

```css
/* 语义色变体：Hover 时加深 10%，Active 时加深 20% */
.nb-btn--primary:hover {
  background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
}

.nb-btn--primary:active {
  background-color: color-mix(in oklch, var(--nb-primary) 80%, black);
}

/* neutral 变体：Hover 时提升表面层级 */
.nb-btn--neutral:hover {
  background-color: var(--nb-base-300);
}

.nb-btn--neutral:active {
  background-color: var(--nb-base-100);
}

/* outline 变体：Hover 时填充为实色 */
.nb-btn--outline.nb-btn--primary:hover {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
}
```

---

## 8. 可访问性要求

### 8.1 键盘可操作性

| 要求 | 规则 | 实现 |
|------|------|------|
| Tab 顺序 | 遵循文档流顺序 | 不使用 `tabindex` 重排，除非明确需要（如自定义焦点管理） |
| Enter 触发 | 标准按钮行为 | 原生 `<button>` 自动支持 |
| Space 触发 | 标准按钮行为 | 原生 `<button>` 自动支持；`<a>` 需 JS 模拟 |
| 焦点可见 | 必须使用 `:focus-visible` | 不使用 `:focus`（避免鼠标点击时显示 outline） |

### 8.2 `:focus-visible` 样式

```css
.nb-btn:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  /* 不修改 transform 或 box-shadow，避免与 Hover 冲突 */
}

/* Focus + Hover 共存 */
.nb-btn:hover:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  transform: translate(-2px, -2px);
}
```

### 8.3 `aria-*` 属性

```html
<!-- 标准禁用 -->
<button class="nb-btn" disabled>不可点击</button>

<!-- 非表单元素禁用（如 <a>） -->
<a class="nb-btn" role="button" aria-disabled="true" tabindex="-1">不可点击</a>

<!-- 加载状态 -->
<button class="nb-btn nb-btn--loading" aria-busy="true" disabled>
  <span class="nb-btn__spinner" aria-hidden="true"></span>
  <span class="nb-btn__label">处理中...</span>
</button>

<!-- Toggle 按钮 -->
<button class="nb-btn nb-btn--selected" aria-pressed="true">已启用</button>

<!-- 展开按钮 -->
<button class="nb-btn" aria-expanded="false" aria-controls="menu-panel">展开菜单</button>

<!-- 图标按钮（必须有 aria-label） -->
<button class="nb-btn nb-btn--square" aria-label="删除项目">
  <svg aria-hidden="true">...</svg>
</button>
```

### 8.4 RTL 适配（逻辑属性）

所有涉及水平方向的属性必须使用 CSS 逻辑属性：

```css
/* ✅ 正确：使用逻辑属性 */
.nb-btn {
  padding-inline: 1.25rem;
  padding-block: 0.75rem;
  border-inline-start-width: 2px;
  border-inline-end-width: 2px;
}

.nb-btn--invalid {
  border-inline-start-width: 3px; /* 左侧强调（RTL 自动翻转） */
}

.nb-btn__icon {
  margin-inline-end: 0.5rem; /* 图标与文本间距，RTL 自动翻转 */
}

/* ❌ 错误：物理属性 */
.nb-btn {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  border-left-width: 3px;
}

.nb-btn__icon {
  margin-right: 0.5rem;
}
```

### 8.5 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  .nb-btn,
  .nb-btn:hover,
  .nb-btn:active,
  .nb-btn:focus-visible {
    /* 取消位移 */
    transform: none !important;
    /* 即时切换，无过渡 */
    transition: none;
  }

  .nb-btn:hover {
    /* 无位移，仅阴影即时切换 */
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  }

  .nb-btn:active {
    /* 无位移，仅阴影即时归零 */
    box-shadow: var(--nb-shadow-none);
  }

  /* Loading 动画：停止 pulse，使用静态方块 */
  .nb-btn--loading .nb-btn__spinner {
    animation: none;
  }
}
```

### 8.6 `forced-colors`（高对比度模式）

```css
@media (forced-colors: active) {
  .nb-btn {
    /* 边框始终可见 */
    border: 2px solid currentColor;
    /* 强制使用系统颜色 */
    forced-color-adjust: none;
  }

  .nb-btn:focus-visible {
    /* 使用高对比色 */
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .nb-btn:disabled,
  .nb-btn[aria-disabled="true"] {
    border-color: GrayText;
    color: GrayText;
  }
}
```

### 8.7 移动端可用性（320px 视口）

```css
/* 最小触摸目标：44px × 44px（iOS 推荐）/ 48px × 48px（Material Design） */
.nb-btn {
  min-height: 40px; /* md 默认 */
  min-width: 40px;  /* 图标按钮最小 */
}

@media (max-width: 320px) {
  .nb-btn--lg,
  .nb-btn--xl {
    /* 小屏幕下降级 padding */
    padding-inline: 1rem;
    padding-block: 0.75rem;
  }

  .nb-btn--full {
    /* 全宽按钮在小屏幕上避免边距溢出 */
    width: calc(100% - 2px);
  }
}
```

### 8.8 200% 缩放测试

```css
/* 确保在 200% 缩放时文本不截断、按钮不重叠 */
.nb-btn {
  /* 使用 rem 确保随字体缩放 */
  padding: 0.75rem 1.25rem;
  min-height: 2.5rem; /* 40px 基准 */
  line-height: 1.25;
  /* 确保按钮内文本溢出时优雅处理 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 允许文本按钮换行（可选） */
.nb-btn--wrap {
  white-space: normal;
  min-height: auto;
}
```

---

## 9. 完整 CSS 示例

以下代码可直接复制到 `@layer components` 中使用。

```css
/* =============================================
   Neo-Brutal UI — Button Component
   ============================================= */

@layer components {
  /* ---- 基础样式 ---- */
  .nb-btn {
    /* 布局 */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.25rem;
    gap: 0.5rem;

    /* 字体 */
    font-family: var(--nb-font-sans);
    font-size: 0.875rem;
    font-weight: var(--nb-weight-bold);
    line-height: 1.25;
    letter-spacing: var(--nb-tracking-normal);
    text-transform: none;
    text-decoration: none;
    white-space: nowrap;

    /* 颜色（neutral 默认） */
    color: var(--nb-base-content);
    background-color: var(--nb-base-200);

    /* 边框（Field 类别） */
    border: var(--nb-border-field) solid var(--nb-border-field-color);
    border-radius: var(--nb-radius-field); /* 0px */

    /* 阴影（标准 md） */
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);

    /* 交互 */
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    /* 过渡 */
    transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
                box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
                background-color var(--nb-duration-fast) var(--nb-easing-standard),
                border-color var(--nb-duration-fast) var(--nb-easing-standard);
    will-change: transform, box-shadow;
  }

  /* ---- 尺寸变体 ---- */
  .nb-btn--xs {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    min-height: 28px;
    box-shadow: var(--nb-shadow-xs) var(--nb-shadow-color);
  }

  .nb-btn--sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    min-height: 32px;
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }

  .nb-btn--lg {
    padding: 1rem 1.75rem;
    font-size: 1rem;
    min-height: 48px;
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-btn--xl {
    padding: 1.25rem 2.25rem;
    font-size: 1.125rem;
    min-height: 56px;
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  }

  /* ---- 颜色变体（Solid） ---- */
  .nb-btn--primary {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  }

  .nb-btn--secondary {
    background-color: var(--nb-secondary);
    color: var(--nb-secondary-content);
    border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
  }

  .nb-btn--accent {
    background-color: var(--nb-accent);
    color: var(--nb-accent-content);
    border-color: color-mix(in oklch, var(--nb-accent-content) 20%, transparent);
  }

  .nb-btn--info {
    background-color: var(--nb-info);
    color: var(--nb-info-content);
    border-color: color-mix(in oklch, var(--nb-info-content) 20%, transparent);
  }

  .nb-btn--success {
    background-color: var(--nb-success);
    color: var(--nb-success-content);
    border-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
  }

  .nb-btn--warning {
    background-color: var(--nb-warning);
    color: var(--nb-warning-content);
    border-color: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
  }

  .nb-btn--error {
    background-color: var(--nb-error);
    color: var(--nb-error-content);
    border-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
  }

  /* ---- 外观变体 ---- */
  .nb-btn--outline {
    background-color: transparent;
    box-shadow: none;
  }

  .nb-btn--outline.nb-btn--primary {
    border-color: var(--nb-primary);
    color: var(--nb-primary);
  }

  .nb-btn--outline.nb-btn--neutral {
    border-color: var(--nb-border);
    color: var(--nb-base-content);
  }

  .nb-btn--outline.nb-btn--error {
    border-color: var(--nb-error);
    color: var(--nb-error);
  }

  .nb-btn--ghost {
    background-color: transparent;
    border-color: var(--nb-border);
    box-shadow: none;
  }

  .nb-btn--link {
    background-color: transparent;
    border: none;
    box-shadow: none;
    text-decoration: underline;
    text-underline-offset: 2px;
    padding-inline: 0.25rem;
  }

  .nb-btn--link:hover {
    text-decoration-thickness: 2px;
  }

  .nb-btn--link:active {
    transform: translate(2px, 2px);
  }

  /* ---- 布局变体 ---- */
  .nb-btn--full,
  .nb-btn--block {
    display: flex;
    width: 100%;
  }

  .nb-btn--square {
    aspect-ratio: 1;
    padding: 0;
    min-width: auto;
  }

  /* ---- Hover 状态 ---- */
  @media (hover: hover) and (pointer: fine) {
    .nb-btn:hover {
      box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
      transform: translate(-2px, -2px);
    }

    .nb-btn--neutral:hover {
      background-color: var(--nb-base-300);
    }

    .nb-btn--primary:hover {
      background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
    }

    .nb-btn--secondary:hover {
      background-color: color-mix(in oklch, var(--nb-secondary) 90%, black);
    }

    .nb-btn--accent:hover {
      background-color: color-mix(in oklch, var(--nb-accent) 90%, black);
    }

    .nb-btn--info:hover {
      background-color: color-mix(in oklch, var(--nb-info) 90%, black);
    }

    .nb-btn--success:hover {
      background-color: color-mix(in oklch, var(--nb-success) 90%, black);
    }

    .nb-btn--warning:hover {
      background-color: color-mix(in oklch, var(--nb-warning) 90%, black);
    }

    .nb-btn--error:hover {
      background-color: color-mix(in oklch, var(--nb-error) 90%, black);
    }

    .nb-btn--ghost:hover {
      background-color: var(--nb-base-200);
    }

    .nb-btn--outline.nb-btn--primary:hover {
      background-color: var(--nb-primary);
      color: var(--nb-primary-content);
    }

    .nb-btn--outline.nb-btn--error:hover {
      background-color: var(--nb-error);
      color: var(--nb-error-content);
    }
  }

  /* ---- Active / Pressed 状态 ---- */
  .nb-btn:active,
  .nb-btn[data-active="true"] {
    box-shadow: var(--nb-shadow-none);
    transform: translate(4px, 4px);
  }

  .nb-btn--neutral:active {
    background-color: var(--nb-base-100);
  }

  .nb-btn--primary:active {
    background-color: color-mix(in oklch, var(--nb-primary) 80%, black);
  }

  .nb-btn--secondary:active {
    background-color: color-mix(in oklch, var(--nb-secondary) 80%, black);
  }

  .nb-btn--accent:active {
    background-color: color-mix(in oklch, var(--nb-accent) 80%, black);
  }

  .nb-btn--info:active {
    background-color: color-mix(in oklch, var(--nb-info) 80%, black);
  }

  .nb-btn--success:active {
    background-color: color-mix(in oklch, var(--nb-success) 80%, black);
  }

  .nb-btn--warning:active {
    background-color: color-mix(in oklch, var(--nb-warning) 80%, black);
  }

  .nb-btn--error:active {
    background-color: color-mix(in oklch, var(--nb-error) 80%, black);
  }

  .nb-btn--ghost:active {
    background-color: var(--nb-base-300);
  }

  /* ---- Focus Visible 状态 ---- */
  .nb-btn:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  /* Focus + Hover 共存 */
  .nb-btn:hover:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  /* ---- Disabled 状态 ---- */
  .nb-btn:disabled,
  .nb-btn[aria-disabled="true"] {
    opacity: 0.5;
    box-shadow: var(--nb-shadow-none);
    transform: none;
    border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
    background-color: color-mix(in oklch, var(--nb-base-200) 50%, transparent);
    color: color-mix(in oklch, var(--nb-base-content) 50%, transparent);
    cursor: not-allowed;
    pointer-events: none;
  }

  .nb-btn:disabled:hover,
  .nb-btn:disabled:active,
  .nb-btn[aria-disabled="true"]:hover,
  .nb-btn[aria-disabled="true"]:active {
    transform: none;
    box-shadow: var(--nb-shadow-none);
    background-color: color-mix(in oklch, var(--nb-base-200) 50%, transparent);
  }

  /* ---- Loading / Busy 状态 ---- */
  .nb-btn--loading,
  .nb-btn.is-loading {
    position: relative;
    pointer-events: none;
    cursor: wait;
  }

  .nb-btn--loading > *,
  .nb-btn.is-loading > * {
    visibility: hidden;
  }

  .nb-btn--loading::after,
  .nb-btn.is-loading::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1rem;
    height: 1rem;
    background-color: var(--nb-primary);
    border: 2px solid var(--nb-border);
    animation: nb-loading-pulse 1s steps(2) infinite;
    transform: translate(-50%, -50%);
  }

  @keyframes nb-loading-pulse {
    0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
  }

  /* ---- Invalid 状态 ---- */
  .nb-btn--invalid,
  .nb-btn.is-invalid {
    border-color: var(--nb-error);
    border-inline-start-width: 3px;
    background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
  }

  .nb-btn--invalid:hover,
  .nb-btn.is-invalid:hover {
    border-color: var(--nb-error);
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  }

  /* ---- Valid 状态 ---- */
  .nb-btn--valid,
  .nb-btn.is-valid {
    border-color: var(--nb-success);
    background-color: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
  }

  /* ---- Selected / Checked 状态 ---- */
  .nb-btn--selected,
  .nb-btn.is-selected,
  .nb-btn[aria-pressed="true"] {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    border-color: var(--nb-primary);
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }

  .nb-btn--selected:hover,
  .nb-btn.is-selected:hover {
    background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
  }

  /* ---- 子元素 ---- */
  .nb-btn__icon {
    display: inline-flex;
    flex-shrink: 0;
    width: 1em;
    height: 1em;
  }

  .nb-btn__icon svg {
    width: 100%;
    height: 100%;
  }

  .nb-btn__label {
    display: inline;
  }

  .nb-btn__spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-color: currentColor;
    animation: nb-loading-pulse 1s steps(2) infinite;
  }

  /* ---- prefers-reduced-motion ---- */
  @media (prefers-reduced-motion: reduce) {
    .nb-btn,
    .nb-btn:hover,
    .nb-btn:active,
    .nb-btn:focus-visible {
      transform: none !important;
      transition: none;
    }

    .nb-btn:hover {
      box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    }

    .nb-btn:active {
      box-shadow: var(--nb-shadow-none);
    }

    .nb-btn--loading::after,
    .nb-btn.is-loading::after,
    .nb-btn__spinner {
      animation: none;
    }
  }

  /* ---- forced-colors ---- */
  @media (forced-colors: active) {
    .nb-btn {
      border: 2px solid currentColor;
      forced-color-adjust: none;
    }

    .nb-btn:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    .nb-btn:disabled,
    .nb-btn[aria-disabled="true"] {
      border-color: GrayText;
      color: GrayText;
    }
  }

  /* ---- 小屏幕适配 ---- */
  @media (max-width: 320px) {
    .nb-btn--lg,
    .nb-btn--xl {
      padding-inline: 1rem;
      padding-block: 0.75rem;
    }
  }
}
```

### 9.1 HTML 示例代码

```html
<!-- 基础按钮（neutral） -->
<button class="nb-btn" type="button">默认按钮</button>

<!-- 主色按钮 -->
<button class="nb-btn nb-btn--primary" type="submit">提交</button>

<!-- 危险操作 -->
<button class="nb-btn nb-btn--error" type="button">删除</button>

<!-- 尺寸变体 -->
<button class="nb-btn nb-btn--xs" type="button">超小</button>
<button class="nb-btn nb-btn--sm" type="button">小</button>
<button class="nb-btn nb-btn--lg" type="button">大</button>
<button class="nb-btn nb-btn--xl" type="button">超大</button>

<!-- 外观变体 -->
<button class="nb-btn nb-btn--outline nb-btn--primary" type="button">轮廓主色</button>
<button class="nb-btn nb-btn--ghost" type="button">幽灵按钮</button>
<button class="nb-btn nb-btn--link" type="button">链接样式</button>

<!-- 全宽按钮 -->
<button class="nb-btn nb-btn--primary nb-btn--full" type="button">占满宽度</button>

<!-- 图标按钮 -->
<button class="nb-btn nb-btn--square nb-btn--sm" type="button" aria-label="搜索">
  <span class="nb-btn__icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </span>
</button>

<!-- 带图标文本按钮 -->
<button class="nb-btn nb-btn--primary" type="button">
  <span class="nb-btn__icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  </span>
  <span class="nb-btn__label">前进</span>
</button>

<!-- 加载状态 -->
<button class="nb-btn nb-btn--primary nb-btn--loading" type="button" aria-busy="true" disabled>
  <span class="nb-btn__spinner" aria-hidden="true"></span>
  <span class="nb-btn__label">处理中...</span>
</button>

<!-- 禁用状态 -->
<button class="nb-btn nb-btn--primary" type="button" disabled>不可点击</button>

<!-- Toggle 按钮 -->
<button class="nb-btn nb-btn--selected" type="button" aria-pressed="true">已启用</button>

<!-- 链接样式按钮（实际导航） -->
<a class="nb-btn nb-btn--link" href="/next-page" role="button">前往下一页</a>
```

---

## 10. 检查清单

以下验收项必须与 **阶段 2.7 组件验收标准** 对齐：

### 10.1 视觉一致性

- [ ] 所有尺寸变体（xs/sm/md/lg/xl）的 `padding`、`font-size`、`min-height` 符合本文档 3.1 节规定。
- [ ] 所有颜色变体（neutral/primary/secondary/accent/info/success/warning/error）使用语义 Token，无硬编码 `#hex` 或 `oklch()`。
- [ ] 所有外观变体（solid/outline/ghost/link）的边框、背景、阴影规则符合本文档 3.3 节规定。
- [ ] Button 圆角始终为 `0px`（`var(--nb-radius-field)`），无例外。
- [ ] 边框宽度始终为 `2px`，样式为 `solid`。

### 10.2 阴影与位移

- [ ] Default 状态使用正确的阴影 Token（尺寸相关）。
- [ ] Hover 状态阴影升一级，位移 `translate(-2px, -2px)`。
- [ ] Active 状态阴影归零，位移 `translate(4px, 4px)`。
- [ ] 所有位移使用 `transform: translate()`，未使用 `margin` 或 `position`。
- [ ] 过渡时长使用 `var(--nb-duration-normal)`（150ms）或 `var(--nb-duration-fast)`（100ms）。
- [ ] 缓动使用 `cubic-bezier(0.4, 0, 0.2, 1)`。

### 10.3 状态完整性

- [ ] 状态矩阵包含所有 11 个状态（Default / Hover / Active / Focus Visible / Disabled / Loading / Invalid / Valid / Selected / Open / Readonly）。
- [ ] N/A 状态（Open / Readonly / Dragging）已明确标记。
- [ ] 状态冲突优先级正确（Loading > Disabled > Invalid > Active > Hover > Focus Visible > Default）。
- [ ] Disabled 状态强制覆盖所有 Hover/Active 效果。
- [ ] Loading 状态尺寸不变，内容替换为 spinner，使用 `aria-busy="true"`。

### 10.4 可访问性

- [ ] 键盘 `Tab` 聚焦支持，`Enter` / `Space` 触发。
- [ ] `:focus-visible` 使用 `2px solid var(--nb-focus)` + `outline-offset: 2px`。
- [ ] 鼠标点击不显示 outline（使用 `:focus-visible` 而非 `:focus`）。
- [ ] 图标按钮有 `aria-label`。
- [ ] 禁用状态使用 `disabled` 或 `aria-disabled="true"`。
- [ ] 使用 CSS 逻辑属性（`padding-inline`、`padding-block`、`border-inline-start-width`）支持 RTL。
- [ ] 实现 `@media (prefers-reduced-motion: reduce)`，取消 transform 位移，保留即时 box-shadow 切换。
- [ ] 实现 `@media (forced-colors: active)`，边框使用 `currentColor`，焦点色使用高对比色。
- [ ] 最小触摸目标 ≥ 44px（md 及以上 ≥ 48px）。
- [ ] 使用 `rem` 单位，200% 缩放不截断文本。

### 10.5 代码质量

- [ ] 所有 CSS 包裹在 `@layer components` 中。
- [ ] 所有颜色使用 `color-mix(in oklch, ...)` 动态计算。
- [ ] 所有阴影使用全局 Token（`--nb-shadow-xs` 到 `--nb-shadow-xl`）。
- [ ] 所有圆角使用类别 Token（`--nb-radius-field`）。
- [ ] 无渐变、无拟物、无模糊阴影（blur = 0）。
- [ ] 代码可直接复制使用，无语法错误。

### 10.6 文档质量

- [ ] 文档使用中文编写，CSS 变量名和代码使用英文。
- [ ] DOM Contract 包含推荐结构、子元素说明、ARIA 属性、键盘行为。
- [ ] 包含完整的 HTML 示例代码。
- [ ] 包含可直接复制使用的完整 CSS 代码（使用 `@layer`）。
- [ ] 状态矩阵使用表格形式，每个状态一行。
- [ ] 不适用的状态已明确标记为 N/A。

---

> **文档版本**：v1.0  
> **最后更新**：2025 年 6 月  
> **维护者**：Neo-Brutal UI 设计系统团队  
> **审核状态**：待技术评审（Tech Review）
