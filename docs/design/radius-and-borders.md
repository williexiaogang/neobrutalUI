# 2.4 圆角、边框与组件分类

> 本规范定义 Neo-Brutal UI 组件库中所有组件的圆角（border-radius）与边框（border）Token 体系。核心原则：**按组件类别定义 Token，而非使用单一全局变量**；默认圆角为 0px（直角），仅在特定功能性组件中允许例外。

---

## 目录

1. [设计哲学](#设计哲学)
2. [Token 命名体系](#token-命名体系)
3. [按组件类别定义的 Token](#按组件类别定义的-token)
4. [例外组件完整列表](#例外组件完整列表)
5. [组件清单与 CSS 变量值表](#组件清单与-css-变量值表)
6. [各组件示例代码](#各组件示例代码)
7. [Token 速查表](#token-速查表)
8. [与 Tailwind CSS 的映射关系](#与-tailwind-css-的映射关系)
9. [主题覆盖规则](#主题覆盖规则)

---

## 设计哲学

Neo-Brutalism 的视觉识别建立在**直角、实线边框、硬阴影**三大支柱之上。圆角会破坏这种"粗野"的美学，因此：

- **默认圆角为 0px**：所有组件的基准状态是直角，没有任何过渡的圆角。
- **边框宽度为 2px**：这是默认的、标准的边框宽度，在绝大多数组件中保持一致。
- **边框样式为 solid**：使用 `border-style: solid`，不采用 `dashed`、`dotted` 或 `double`（除非在特定状态如 Dragging 中）。
- **边框颜色为语义化 mix**：边框颜色不是固定值（如 `#000000`），而是使用 `color-mix(in oklch, currentColor 20%, transparent)` 或对应的 CSS 变量，确保在不同主题色下保持一致的视觉重量。
- **例外是功能性的，不是装饰性的**：所有允许圆角或圆形的例外都基于功能性需求（如 Radio 需要圆形表示选中状态，Toggle 需要圆形表示滑块），而非纯粹的美学偏好。

---

## Token 命名体系

Token 命名遵循以下模式：

```
--nb-{属性}-{类别}
```

- **属性**：`radius`（圆角）或 `border`（边框宽度）
- **类别**：`selector`（选择器）、`field`（表单字段）、`box`（容器）、`overlay`（覆盖层）

例外 Token 的命名：

```
--nb-{属性}-{类别}-exception
--nb-{属性}-{组件名}
```

---

## 按组件类别定义的 Token

### 1. Selector 类别

**适用组件**：Checkbox、Radio、Toggle（开关滑块）

**核心 Token**：

```css
:root {
  --nb-radius-selector: 0px;          /* 默认直角 */
  --nb-border-selector: 2px;          /* 标准边框宽度 */
  --nb-border-selector-color: color-mix(in oklch, var(--nb-base-content) 20%, transparent);
}
```

**设计说明**：
- Checkbox 为直角方形，内部放置 Check 图标（SVG 或 Unicode `✓`），表示选中状态。
- Radio 为圆形例外，使用 `border-radius: 50%`，内部放置实心圆点表示选中状态。
- Toggle 的轨道（track）为直角，但滑块（thumb）为圆形例外，使用 `border-radius: 50%`，以明确指示滑动方向。

**例外 Token**：

```css
:root {
  --nb-radius-selector-exception: 50%;  /* Radio 和 Toggle 滑块使用圆形 */
}
```

---

### 2. Field 类别

**适用组件**：Button、Input、Select、Textarea、Search、File Input、Date Picker、Time Picker、Color Picker、Range Slider

**核心 Token**：

```css
:root {
  --nb-radius-field: 0px;             /* 所有表单字段均为直角 */
  --nb-border-field: 2px;             /* 标准边框宽度 */
  --nb-border-field-color: color-mix(in oklch, var(--nb-base-content) 20%, transparent);
}
```

**设计说明**：
- 所有表单字段保持直角，与粗野风格的硬朗美学一致。
- Button 的 Hover 和 Active 状态使用阴影和位移（详见 `shadows-and-motion.md`），但圆角始终为 0px。
- Input 和 Textarea 的 Focus 状态使用 `outline: 2px solid var(--nb-focus)` 配合 `outline-offset: 2px`（详见 `interaction-language.md`），不影响圆角。
- Select 的下拉箭头使用自定义 SVG，不依赖浏览器原生样式，确保与整体风格一致。
- Range Slider 的轨道（track）为直角，滑块（thumb）为圆形例外（`border-radius: 50%`），以符合用户心智模型。

**例外 Token**：

```css
:root {
  --nb-radius-field-exception: 50%;   /* Range Slider 滑块使用圆形 */
}
```

---

### 3. Box 类别

**适用组件**：Card、Alert、Table、Stat、Accordion、Panel、Timeline、List Group、Empty State、Skeleton、Quote、Callout

**核心 Token**：

```css
:root {
  --nb-radius-box: 0px;               /* 默认直角 */
  --nb-border-box: 2px;               /* 标准边框宽度 */
  --nb-border-box-color: color-mix(in oklch, var(--nb-base-content) 20%, transparent);
}
```

**设计说明**：
- Card 作为信息容器，保持直角以维持视觉硬朗感。
- Table 的单元格、表头均为直角，不设置 `border-radius`（在表格容器级别使用 `--nb-radius-box`）。
- Alert 的图标区域和文字区域均为直角，但可以通过 `border-inline-start-width: 3px` 强调左侧边框颜色。
- Stat（统计卡片）的数值和标签区域均为直角。
- Accordion 的面板和标题均为直角，展开/收起时不改变圆角。
- Panel（面板/容器）使用 `border: 2px solid var(--nb-border-box-color)` 和 `background: var(--nb-base-200)`。
- 某些 Card 变体（如"营销卡片"或"展示卡片"）允许使用 4px 圆角作为例外，但这不是默认行为。

**例外 Token**：

```css
:root {
  --nb-radius-box-exception: 4px;     /* 特定 Card 变体允许 4px 圆角 */
}
```

---

### 4. Overlay 类别

**适用组件**：Modal、Dropdown、Tooltip、Drawer、Popover、Toast、Snackbar、Menu、Context Menu

**核心 Token**：

```css
:root {
  --nb-radius-overlay: 0px;           /* 默认直角 */
  --nb-border-overlay: 2px;           /* 标准边框宽度 */
  --nb-border-overlay-color: color-mix(in oklch, var(--nb-base-content) 20%, transparent);
}
```

**设计说明**：
- Modal 的对话框和 Drawer 的侧边面板默认均为直角。
- Dropdown 和 Popover 的菜单列表为直角，菜单项也为直角。
- Tooltip 的提示框为直角，箭头（如果有）使用 CSS 三角形实现，保持风格一致。
- Toast 和 Snackbar 的通知容器为直角。
- Menu 和 Context Menu 的菜单项为直角，选中状态使用背景色变化而非圆角变化。
- 在移动端（`@media (max-width: 768px)`），Modal 底部弹窗（sheet）允许使用 4px 顶部圆角作为例外，以符合移动端设计惯例。

**例外 Token**：

```css
:root {
  --nb-radius-overlay-exception: 4px; /* Modal 在移动端允许 4px 顶部圆角 */
}
```

---

## 例外组件完整列表

以下组件允许使用圆角或圆形，所有例外都有明确的功能性理由：

| 组件 | 允许的形状 | 圆角值 | 理由 | Token / 硬编码 |
|------|-----------|--------|------|---------------|
| **Radio** | 圆形 | `border-radius: 50%` | 圆形是 Radio 的通用视觉标准，表示单选状态 | 硬编码 `50%`，或 `--nb-radius-selector-exception` |
| **Toggle 滑块** | 圆形 | `border-radius: 50%` | 滑块需要明确的方向指示，圆形比直角更直观 | 硬编码 `50%`，或 `--nb-radius-selector-exception` |
| **Avatar** | 圆形 或 圆角方形 | `border-radius: 50%` 或 `4px` | 圆形符合用户头像的心智模型；圆角方形变体用于展示图片或品牌 Logo | 硬编码 `50%` 或 `--nb-radius-box-exception` |
| **状态点（Status Dot）** | 圆形 | `border-radius: 50%` | 小圆点是最直观的状态指示器 | 硬编码 `50%` |
| **Loading 图形（Spinner）** | 圆形 | `border-radius: 50%` | 圆形旋转动画是 Loading 的标准视觉语言 | 硬编码 `50%` 或 0px（几何形 Loader） |
| **Badge** | 胶囊形 | `border-radius: 9999px` | 胶囊形在紧凑空间中容纳数字和文本，且已成为 UI 惯例 | 硬编码 `9999px` 或 0px（取决于变体） |
| **Range Slider 滑块** | 圆形 | `border-radius: 50%` | 圆形滑块是 Range Slider 的标准交互元素 | 硬编码 `50%`，或 `--nb-radius-field-exception` |
| **Progress Bar（进度条）** | 圆角末端 | `border-radius: 0px`（主体）或 4px（末端变体） | 默认直角，但某些变体允许 4px 以柔和视觉 | 默认 0px，变体 4px |
| **Step Indicator（步骤指示器）** | 圆形 | `border-radius: 50%` | 圆形步骤节点是标准设计模式 | 硬编码 `50%` |

---

### 各例外的详细说明

#### 1. Radio（单选框）

```css
/* Radio 的完整 CSS 实现 */
.nb-radio {
  appearance: none;
  -webkit-appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: var(--nb-border-selector) solid var(--nb-border-selector-color);
  border-radius: 50%; /* 圆形例外，硬编码 */
  background-color: var(--nb-base-100);
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.nb-radio:checked {
  background-color: var(--nb-primary);
  border-color: var(--nb-primary);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Ccircle cx='8' cy='8' r='4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.nb-radio:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

.nb-radio:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**为什么允许圆形**：Radio 的圆形是超过 30 年的 GUI 设计惯例，用户已形成强烈的认知关联。改变为直角会造成识别困难和可用性下降。

---

#### 2. Toggle（开关）滑块

```css
/* Toggle 轨道 */
.nb-toggle-track {
  width: 2.5rem;
  height: 1.25rem;
  border: var(--nb-border-selector) solid var(--nb-border-selector-color);
  border-radius: 0; /* 轨道保持直角 */
  background-color: var(--nb-base-200);
  cursor: pointer;
  position: relative;
  transition: background-color 150ms ease, border-color 150ms ease;
}

/* Toggle 滑块 */
.nb-toggle-thumb {
  width: 1rem;
  height: 1rem;
  border: var(--nb-border-selector) solid var(--nb-border-selector-color);
  border-radius: 50%; /* 滑块圆形例外，硬编码 */
  background-color: var(--nb-base-100);
  position: absolute;
  top: 1px;
  left: 1px;
  transition: transform 150ms ease;
  box-shadow: var(--nb-shadow-xs);
}

.nb-toggle:checked + .nb-toggle-track .nb-toggle-thumb {
  transform: translateX(1.25rem);
}

.nb-toggle:checked + .nb-toggle-track {
  background-color: var(--nb-primary);
  border-color: var(--nb-primary);
}
```

**为什么允许圆形**：滑块在轨道中滑动，圆形边缘能更清晰地暗示"可移动"和"方向性"，直角滑块在视觉上会产生"卡住"的错觉。

---

#### 3. Avatar（头像）

```css
/* Avatar 圆形变体（默认） */
.nb-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  border-radius: 50%; /* 圆形，硬编码 */
  object-fit: cover;
  background-color: var(--nb-base-200);
}

/* Avatar 圆角方形变体 */
.nb-avatar--rounded {
  border-radius: var(--nb-radius-box-exception); /* 4px */
}

/* Avatar 直角变体（粗野风格） */
.nb-avatar--square {
  border-radius: 0;
}
```

**为什么允许圆形/圆角**：头像的圆形是社交媒体和操作系统长期建立的用户心智模型。圆角方形变体用于特定场景（如品牌 Logo 展示、产品图片）。

---

#### 4. 状态点（Status Dot）

```css
.nb-status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%; /* 圆形，硬编码 */
  display: inline-block;
}

.nb-status-dot--success { background-color: var(--nb-success); }
.nb-status-dot--warning { background-color: var(--nb-warning); }
.nb-status-dot--error   { background-color: var(--nb-error); }
.nb-status-dot--info    { background-color: var(--nb-info); }
.nb-status-dot--neutral { background-color: var(--nb-neutral); }
```

**为什么允许圆形**：小圆点是状态指示的最简洁形式，直角小方块在视觉上会产生"像素错误"的错觉，圆形则更自然。

---

#### 5. Loading 图形（Spinner）

```css
/* 圆形 Spinner */
.nb-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--nb-base-200);
  border-top-color: var(--nb-primary);
  border-radius: 50%; /* 圆形，硬编码 */
  animation: nb-spin 1s linear infinite;
}

@keyframes nb-spin {
  to { transform: rotate(360deg); }
}

/* 几何形 Loader（粗野风格变体） */
.nb-loader--geometric {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--nb-primary);
  border-radius: 0; /* 直角，符合粗野风格 */
  animation: nb-spin 1s linear infinite;
}
```

**为什么允许圆形**：旋转加载动画的标准形式是圆形。但允许几何形直角变体作为 Neo-Brutalism 的特色替代方案。

---

#### 6. Badge（徽标/标签）

```css
/* Badge 胶囊形变体（默认） */
.nb-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--nb-tracking-wide); /* 0.05em */
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  border-radius: 9999px; /* 胶囊形，硬编码 */
  background-color: var(--nb-base-200);
  color: var(--nb-base-content);
  line-height: 1;
}

/* Badge 直角变体（粗野风格） */
.nb-badge--square {
  border-radius: 0;
}
```

**为什么允许胶囊形**：Badge 通常需要容纳不同长度的文本（如数字、状态词），胶囊形能在保持紧凑的同时容纳内容，且已成为 UI 设计惯例。直角变体作为粗野风格替代方案提供。

---

#### 7. Range Slider 滑块

```css
.nb-range-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.5rem;
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  border-radius: 0; /* 轨道直角 */
  background-color: var(--nb-base-200);
  cursor: pointer;
}

/* Webkit 滑块 */
.nb-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  border-radius: 50%; /* 圆形，硬编码 */
  background-color: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
  cursor: grab;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.nb-range-slider::-webkit-slider-thumb:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--nb-shadow-md);
}

.nb-range-slider::-webkit-slider-thumb:active {
  transform: translate(2px, 2px);
  box-shadow: var(--nb-shadow-none);
  cursor: grabbing;
}

/* Firefox 滑块 */
.nb-range-slider::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  border-radius: 50%; /* 圆形，硬编码 */
  background-color: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
  cursor: grab;
}

.nb-range-slider::-moz-range-thumb:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--nb-shadow-md);
}

.nb-range-slider::-moz-range-thumb:active {
  transform: translate(2px, 2px);
  box-shadow: var(--nb-shadow-none);
  cursor: grabbing;
}
```

**为什么允许圆形**：Range Slider 的滑块需要指示可拖拽方向，圆形是标准交互设计模式。同时，圆形滑块在轨道上滑动时不会产生"边缘碰撞"的视觉错觉。

---

#### 8. Progress Bar（进度条）

```css
/* Progress Bar 默认直角 */
.nb-progress {
  width: 100%;
  height: 0.75rem;
  border: var(--nb-border-box) solid var(--nb-border-box-color);
  border-radius: 0; /* 直角 */
  background-color: var(--nb-base-200);
  overflow: hidden;
}

.nb-progress__bar {
  height: 100%;
  background-color: var(--nb-primary);
  transition: width 250ms ease;
}

/* Progress Bar 圆角末端变体 */
.nb-progress--rounded-ends .nb-progress__bar {
  border-radius: 0 4px 4px 0; /* 仅右侧圆角，或根据进度方向调整 */
}
```

---

#### 9. Step Indicator（步骤指示器）

```css
.nb-step {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  border-radius: 50%; /* 圆形，硬编码 */
  background-color: var(--nb-base-100);
  font-weight: 600;
  font-size: 0.875rem;
}

.nb-step--active {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  border-color: var(--nb-primary);
}

.nb-step--completed {
  background-color: var(--nb-success);
  color: var(--nb-success-content);
  border-color: var(--nb-success);
}
```

**为什么允许圆形**：步骤指示器的圆形节点是标准设计模式，表示流程中的"点"或"阶段"。

---

## 组件清单与 CSS 变量值表

### Selector 类别

| 组件 | 圆角 | 边框宽度 | 边框样式 | 边框颜色 | 例外说明 |
|------|------|----------|----------|----------|----------|
| Checkbox | `var(--nb-radius-selector)` = 0px | `var(--nb-border-selector)` = 2px | solid | `color-mix(...)` | 无 |
| Radio | `50%`（硬编码） | `var(--nb-border-selector)` = 2px | solid | `color-mix(...)` | 圆形例外 |
| Toggle（轨道） | `var(--nb-radius-selector)` = 0px | `var(--nb-border-selector)` = 2px | solid | `color-mix(...)` | 无 |
| Toggle（滑块） | `50%`（硬编码） | `var(--nb-border-selector)` = 2px | solid | `color-mix(...)` | 圆形例外 |

### Field 类别

| 组件 | 圆角 | 边框宽度 | 边框样式 | 边框颜色 | 例外说明 |
|------|------|----------|----------|----------|----------|
| Button | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Input | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Textarea | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Select | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Search | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| File Input | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Date Picker | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Time Picker | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Color Picker | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Range Slider（轨道） | `var(--nb-radius-field)` = 0px | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 无 |
| Range Slider（滑块） | `50%`（硬编码） | `var(--nb-border-field)` = 2px | solid | `color-mix(...)` | 圆形例外 |

### Box 类别

| 组件 | 圆角 | 边框宽度 | 边框样式 | 边框颜色 | 例外说明 |
|------|------|----------|----------|----------|----------|
| Card | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 营销变体允许 4px |
| Alert | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Table | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Stat | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Accordion | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Panel | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Timeline | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| List Group | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Empty State | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Skeleton | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Quote | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |
| Callout | `var(--nb-radius-box)` = 0px | `var(--nb-border-box)` = 2px | solid | `color-mix(...)` | 无 |

### Overlay 类别

| 组件 | 圆角 | 边框宽度 | 边框样式 | 边框颜色 | 例外说明 |
|------|------|----------|----------|----------|----------|
| Modal | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 移动端底部弹窗允许 4px 顶部圆角 |
| Dropdown | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 无 |
| Tooltip | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 无 |
| Drawer | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 无 |
| Popover | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 无 |
| Toast | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 无 |
| Snackbar | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 无 |
| Menu | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 无 |
| Context Menu | `var(--nb-radius-overlay)` = 0px | `var(--nb-border-overlay)` = 2px | solid | `color-mix(...)` | 无 |

---

## 各组件示例代码

### Button（Field 类别）

```css
.nb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--nb-base-content);
  background-color: var(--nb-base-100);
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  border-radius: var(--nb-radius-field); /* 0px */
  box-shadow: var(--nb-shadow-md);
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease;
  text-transform: none;
  letter-spacing: var(--nb-tracking-normal);
}

.nb-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--nb-shadow-lg);
  background-color: var(--nb-base-200);
}

.nb-btn:active {
  transform: translate(4px, 4px);
  box-shadow: var(--nb-shadow-none);
  background-color: var(--nb-base-300);
}

.nb-btn:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

.nb-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: var(--nb-shadow-none);
  transform: none;
}

.nb-btn:disabled:hover,
.nb-btn:disabled:active {
  transform: none;
  box-shadow: var(--nb-shadow-none);
  background-color: var(--nb-base-100);
}

/* 变体 */
.nb-btn--primary {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
}

.nb-btn--primary:hover {
  background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
}
```

---

### Input（Field 类别）

```css
.nb-input {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25;
  color: var(--nb-base-content);
  background-color: var(--nb-base-100);
  border: var(--nb-border-field) solid var(--nb-border-field-color);
  border-radius: var(--nb-radius-field); /* 0px */
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.nb-input:hover {
  border-color: color-mix(in oklch, var(--nb-base-content) 40%, transparent);
}

.nb-input:focus {
  outline: none;
  border-color: var(--nb-primary);
  box-shadow: 0 0 0 2px var(--nb-focus); /* 使用 focus ring 替代默认 outline */
}

.nb-input:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

.nb-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--nb-base-200);
}

.nb-input[aria-invalid="true"] {
  border-color: var(--nb-error);
  border-inline-start-width: 3px; /* 左侧强调边框 */
}

.nb-input[aria-invalid="true"]:focus {
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--nb-error) 30%, transparent);
}
```

---

### Card（Box 类别）

```css
.nb-card {
  display: flex;
  flex-direction: column;
  background-color: var(--nb-base-100);
  border: var(--nb-border-box) solid var(--nb-border-box-color);
  border-radius: var(--nb-radius-box); /* 0px */
  box-shadow: var(--nb-shadow-md);
  overflow: hidden;
}

.nb-card__header {
  padding: 1rem 1.25rem;
  border-bottom: 2px solid var(--nb-border-box-color);
  background-color: var(--nb-base-200);
  font-weight: 600;
  font-size: 1rem;
}

.nb-card__body {
  padding: 1.25rem;
  flex: 1 1 auto;
}

.nb-card__footer {
  padding: 1rem 1.25rem;
  border-top: 2px solid var(--nb-border-box-color);
  background-color: var(--nb-base-200);
}

/* Card 营销变体（4px 圆角例外） */
.nb-card--marketing {
  border-radius: var(--nb-radius-box-exception); /* 4px */
}

/* Card 悬停效果 */
.nb-card--interactive:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--nb-shadow-lg);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.nb-card--interactive:active {
  transform: translate(4px, 4px);
  box-shadow: var(--nb-shadow-none);
}
```

---

### Table（Box 类别）

```css
.nb-table-wrapper {
  border: var(--nb-border-box) solid var(--nb-border-box-color);
  border-radius: var(--nb-radius-box); /* 0px */
  overflow: hidden;
  box-shadow: var(--nb-shadow-md);
}

.nb-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  text-align: left;
  font-size: 0.875rem;
}

.nb-table thead {
  background-color: var(--nb-base-200);
  border-bottom: 2px solid var(--nb-border-box-color);
}

.nb-table th {
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--nb-tracking-wide); /* 0.05em */
  font-size: 0.75rem;
  border-right: 1px solid var(--nb-border-box-color);
}

.nb-table th:last-child {
  border-right: none;
}

.nb-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--nb-border-box-color);
  border-right: 1px solid var(--nb-border-box-color);
}

.nb-table td:last-child {
  border-right: none;
}

.nb-table tbody tr:last-child td {
  border-bottom: none;
}

.nb-table tbody tr:hover {
  background-color: var(--nb-base-200);
  transition: background-color 100ms ease;
}

.nb-table tbody tr:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: -2px;
}
```

---

### Modal（Overlay 类别）

```css
/* Modal Backdrop */
.nb-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--nb-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

/* Modal Dialog */
.nb-modal {
  width: 100%;
  max-width: 32rem;
  background-color: var(--nb-base-100);
  border: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
  border-radius: var(--nb-radius-overlay); /* 0px */
  box-shadow: var(--nb-shadow-xl);
  overflow: hidden;
  animation: nb-modal-enter 150ms ease-out;
}

@keyframes nb-modal-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.nb-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 2px solid var(--nb-border-overlay-color);
  background-color: var(--nb-base-200);
}

.nb-modal__title {
  font-weight: 600;
  font-size: 1.125rem;
  margin: 0;
}

.nb-modal__close {
  padding: 0.25rem;
  background: none;
  border: 2px solid var(--nb-border-overlay-color);
  border-radius: 0;
  cursor: pointer;
  color: var(--nb-base-content);
  line-height: 1;
  transition: background-color 150ms ease;
}

.nb-modal__close:hover {
  background-color: var(--nb-base-300);
}

.nb-modal__body {
  padding: 1.25rem;
}

.nb-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 2px solid var(--nb-border-overlay-color);
  background-color: var(--nb-base-200);
}

/* 移动端底部弹窗变体（4px 顶部圆角例外） */
@media (max-width: 768px) {
  .nb-modal--sheet {
    border-radius: var(--nb-radius-overlay-exception) var(--nb-radius-overlay-exception) 0 0; /* 4px 顶部圆角 */
    max-width: 100%;
    margin-top: auto;
    margin-bottom: 0;
    animation: nb-modal-sheet-enter 250ms ease-out;
  }

  @keyframes nb-modal-sheet-enter {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .nb-modal-backdrop:has(.nb-modal--sheet) {
    align-items: flex-end;
  }
}
```

---

### Dropdown（Overlay 类别）

```css
.nb-dropdown {
  position: relative;
  display: inline-block;
}

.nb-dropdown__menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 12rem;
  margin-top: 0.25rem;
  padding: 0.25rem 0;
  background-color: var(--nb-base-100);
  border: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
  border-radius: var(--nb-radius-overlay); /* 0px */
  box-shadow: var(--nb-shadow-lg);
  z-index: 40;
  animation: nb-dropdown-enter 150ms ease-out;
}

@keyframes nb-dropdown-enter {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nb-dropdown__item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--nb-base-content);
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 100ms ease;
}

.nb-dropdown__item:hover {
  background-color: var(--nb-base-200);
}

.nb-dropdown__item:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: -2px;
}

.nb-dropdown__item--active {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
}

.nb-dropdown__divider {
  height: 2px;
  margin: 0.25rem 0;
  background-color: var(--nb-border-overlay-color);
  border: none;
}
```

---

### Tooltip（Overlay 类别）

```css
.nb-tooltip {
  position: relative;
  display: inline-block;
}

.nb-tooltip__content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--nb-base-content);
  background-color: var(--nb-base-200);
  border: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
  border-radius: var(--nb-radius-overlay); /* 0px */
  box-shadow: var(--nb-shadow-md);
  white-space: nowrap;
  z-index: 30;
  opacity: 0;
  visibility: hidden;
  transition: opacity 150ms ease, visibility 150ms ease;
  margin-bottom: 0.5rem;
}

.nb-tooltip:hover .nb-tooltip__content,
.nb-tooltip:focus-visible .nb-tooltip__content,
.nb-tooltip[aria-describedby]:focus .nb-tooltip__content {
  opacity: 1;
  visibility: visible;
}

/* Tooltip 箭头（可选，使用 CSS 三角形） */
.nb-tooltip__content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: var(--nb-border-overlay-color) transparent transparent transparent;
}
```

---

### Alert（Box 类别）

```css
.nb-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background-color: var(--nb-base-100);
  border: var(--nb-border-box) solid var(--nb-border-box-color);
  border-radius: var(--nb-radius-box); /* 0px */
  box-shadow: var(--nb-shadow-sm);
}

/* Alert 强调变体：左侧加粗边框 */
.nb-alert--info {
  border-inline-start-width: 3px;
  border-inline-start-color: var(--nb-info);
}

.nb-alert--success {
  border-inline-start-width: 3px;
  border-inline-start-color: var(--nb-success);
}

.nb-alert--warning {
  border-inline-start-width: 3px;
  border-inline-start-color: var(--nb-warning);
}

.nb-alert--error {
  border-inline-start-width: 3px;
  border-inline-start-color: var(--nb-error);
}

.nb-alert__icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.nb-alert__content {
  flex: 1;
  min-width: 0;
}

.nb-alert__title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.nb-alert__description {
  font-size: 0.875rem;
  color: color-mix(in oklch, var(--nb-base-content) 80%, transparent);
  margin: 0;
}

.nb-alert__close {
  flex-shrink: 0;
  padding: 0.125rem;
  background: none;
  border: 2px solid var(--nb-border-box-color);
  border-radius: 0;
  cursor: pointer;
  color: var(--nb-base-content);
  line-height: 1;
  transition: background-color 150ms ease;
}

.nb-alert__close:hover {
  background-color: var(--nb-base-200);
}
```

---

### Stat（Box 类别）

```css
.nb-stat {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background-color: var(--nb-base-100);
  border: var(--nb-border-box) solid var(--nb-border-box-color);
  border-radius: var(--nb-radius-box); /* 0px */
  box-shadow: var(--nb-shadow-md);
}

.nb-stat__label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--nb-tracking-wide); /* 0.05em */
  color: color-mix(in oklch, var(--nb-base-content) 60%, transparent);
  margin-bottom: 0.5rem;
}

.nb-stat__value {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--nb-base-content);
  margin: 0;
}

.nb-stat__description {
  font-size: 0.875rem;
  color: color-mix(in oklch, var(--nb-base-content) 60%, transparent);
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.nb-stat--trend-up .nb-stat__value {
  color: var(--nb-success);
}

.nb-stat--trend-down .nb-stat__value {
  color: var(--nb-error);
}
```

---

## Token 速查表

### 圆角 Token

| Token | 默认值 | 类别 | 用途 |
|-------|--------|------|------|
| `--nb-radius-selector` | `0px` | Selector | Checkbox、Toggle 轨道 |
| `--nb-radius-selector-exception` | `50%` | Selector | Radio、Toggle 滑块 |
| `--nb-radius-field` | `0px` | Field | Button、Input、Select、Textarea 等 |
| `--nb-radius-field-exception` | `50%` | Field | Range Slider 滑块 |
| `--nb-radius-box` | `0px` | Box | Card、Alert、Table、Stat 等 |
| `--nb-radius-box-exception` | `4px` | Box | 特定 Card 变体（营销卡片） |
| `--nb-radius-overlay` | `0px` | Overlay | Modal、Dropdown、Tooltip 等 |
| `--nb-radius-overlay-exception` | `4px` | Overlay | Modal 移动端底部弹窗顶部圆角 |

### 边框宽度 Token

| Token | 默认值 | 类别 | 用途 |
|-------|--------|------|------|
| `--nb-border-selector` | `2px` | Selector | Checkbox、Radio、Toggle 的边框宽度 |
| `--nb-border-field` | `2px` | Field | Button、Input、Select、Textarea 的边框宽度 |
| `--nb-border-box` | `2px` | Box | Card、Alert、Table、Stat 的边框宽度 |
| `--nb-border-overlay` | `2px` | Overlay | Modal、Dropdown、Tooltip 的边框宽度 |

### 边框颜色 Token（使用 `color-mix`）

| Token | 定义方式 | 用途 |
|-------|----------|------|
| `--nb-border-selector-color` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` | Selector 类别边框颜色 |
| `--nb-border-field-color` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` | Field 类别边框颜色 |
| `--nb-border-box-color` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` | Box 类别边框颜色 |
| `--nb-border-overlay-color` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` | Overlay 类别边框颜色 |

### 硬编码圆角例外

| 组件 | 属性 | 值 | 理由 |
|------|------|-----|------|
| Radio | `border-radius` | `50%` | 单选框标准圆形 |
| Toggle 滑块 | `border-radius` | `50%` | 方向指示 |
| Avatar | `border-radius` | `50%` 或 `4px` | 头像标准/品牌展示 |
| Status Dot | `border-radius` | `50%` | 状态指示最简洁形式 |
| Spinner | `border-radius` | `50%` | 旋转动画标准形式 |
| Badge | `border-radius` | `9999px` | 胶囊形容纳文本 |
| Range Slider 滑块 | `border-radius` | `50%` | 拖拽交互标准 |
| Step Indicator | `border-radius` | `50%` | 步骤节点标准 |

---

## 与 Tailwind CSS 的映射关系

Neo-Brutal UI 的 Token 体系与 Tailwind CSS v4+ 的 `theme()` 函数和 `@theme` 指令兼容：

```css
/* tailwind.css 或 theme.css */
@theme {
  /* 圆角 Token */
  --radius-selector: var(--nb-radius-selector);
  --radius-selector-exception: var(--nb-radius-selector-exception);
  --radius-field: var(--nb-radius-field);
  --radius-field-exception: var(--nb-radius-field-exception);
  --radius-box: var(--nb-radius-box);
  --radius-box-exception: var(--nb-radius-box-exception);
  --radius-overlay: var(--nb-radius-overlay);
  --radius-overlay-exception: var(--nb-radius-overlay-exception);

  /* 边框 Token */
  --border-width-selector: var(--nb-border-selector);
  --border-width-field: var(--nb-border-field);
  --border-width-box: var(--nb-border-box);
  --border-width-overlay: var(--nb-border-overlay);

  /* 颜色 Token */
  --color-border-selector: var(--nb-border-selector-color);
  --color-border-field: var(--nb-border-field-color);
  --color-border-box: var(--nb-border-box-color);
  --color-border-overlay: var(--nb-border-overlay-color);
}
```

在组件中使用 Tailwind 工具类：

```html
<!-- 使用 Tailwind 工具类 + Neo-Brutal UI Token -->
<button class="rounded-[var(--nb-radius-field)] border-[var(--nb-border-field)] border-[var(--nb-border-field-color)] shadow-[var(--nb-shadow-md)]">
  Click me
</button>
```

---

## 主题覆盖规则

### 覆盖方式

用户可以通过以下方式覆盖 Token：

```css
/* 全局覆盖 */
:root {
  --nb-radius-field: 4px; /* 不推荐，破坏粗野风格 */
}

/* 特定组件覆盖 */
.nb-card--custom {
  --nb-radius-box: 4px;
  --nb-border-box: 3px;
}

/* 通过 data-theme 属性覆盖 */
[data-theme="neo-brutal-soft"] {
  --nb-radius-box: 2px;
  --nb-border-box: 1px;
}
```

### 覆盖建议

| 场景 | 建议 |
|------|------|
| 品牌定制 | 允许覆盖 `--nb-border-*-color` 的颜色比例（如从 `20%` 改为 `30%`） |
| 高密度数据场景 | 允许将 `--nb-border-*` 从 `2px` 改为 `1px` |
| 营销/展示页面 | 允许使用 `--nb-radius-box-exception`（4px）的 Card 变体 |
| 移动端优化 | 允许使用 `--nb-radius-overlay-exception`（4px）的 Modal 底部弹窗 |
| **禁止** | 将全局 `--nb-radius-*` 改为 `8px` 或更大，这会破坏 Neo-Brutalism 的核心识别 |

---

## 浏览器兼容性

| 特性 | 支持范围 | 说明 |
|------|----------|------|
| `border-radius: 0px` | 所有现代浏览器 | 无兼容问题 |
| `border-radius: 50%` | 所有现代浏览器 | 无兼容问题 |
| `border-radius: 9999px` | 所有现代浏览器 | 无兼容问题 |
| `color-mix()` | Chrome 111+, Firefox 112+, Safari 16.1+ | 核心特性，需 Modern Browser |
| `border-inline-start-width` | 所有现代浏览器 | 逻辑属性，支持 RTL |
| `outline-offset` | 所有现代浏览器 | Focus 样式 |
| `appearance: none` | 所有现代浏览器 | 表单元素重置 |

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2025-06-01 | 初始版本，定义 Selector、Field、Box、Overlay 四大类别的圆角与边框 Token |

---

> **文档状态**：正式规范 | **适用范围**：Neo-Brutal UI 组件库全组件 | **维护者**：设计系统团队
