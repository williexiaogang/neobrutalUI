# Table 设计基准稿

> 本文档定义 Neo-Brutal UI 中 `Table` 组件的全部视觉规范、交互状态与实现细节。所有描述必须与设计系统全局 Token（`brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md`）严格一致。
> 
> **适用范围**：`Table` 组件的 CSS 实现、HTML 结构、ARIA 属性、可访问性测试。  
> **文档版本**：v1.0  
> **最后更新**：2025 年 6 月  
> **维护者**：Neo-Brutal UI 设计系统团队

---

## 1. 组件概述

| 属性 | 值 |
|------|-----|
| **组件名称** | `Table`（数据表格） |
| **语义 HTML 元素** | `<table>`（主体），`<thead>` / `<tbody>` / `<tfoot>` / `<tr>` / `<th>` / `<td>`（子元素） |
| **类名** | `nb-table`（表格主体）、`nb-table-wrapper`（滚动与阴影容器） |
| **用途** | 展示结构化数据；支持行悬停、行选择、排序、斑马纹、密度切换、可访问性键盘导航。 |
| **类别归属** | Box 类别（参见 `radius-and-borders.md`），使用 `--nb-radius-box` 与 `--nb-border-box` Token。 |
| **阴影默认阶梯** | `--nb-shadow-md`（容器级别）。行本身无阴影。 |

### 核心设计决策

- **Table 本身不是按钮**：Table 是**容器组件**，绝大多数行/单元格在默认状态下不响应 Active/Pressed 位移。只有**可点击行**（`nb-table__row--interactive`）或**行内操作按钮**继承交互位移规则。
- **阴影施加在容器上**：`box-shadow` 作用于 `nb-table-wrapper`，而非表格内部的 `<th>` / `<td>`。
- **直角原则**：所有单元格、表头、行均为 `0px` 圆角，与 Neo-Brutalism 的硬朗美学一致。

---

## 2. DOM Contract

### 2.1 推荐 HTML 结构

```html
<div class="nb-table-wrapper" role="region" aria-labelledby="table-caption" tabindex="0">
  <table class="nb-table" aria-describedby="table-desc">
    <!-- 可选：表格标题与辅助说明 -->
    <caption id="table-caption" class="nb-table__caption">
      订单列表
      <span id="table-desc" class="nb-table__desc">按创建日期排序</span>
    </caption>

    <thead class="nb-table__head">
      <tr class="nb-table__row">
        <th class="nb-table__cell nb-table__cell--header" scope="col">
          <button type="button" class="nb-table__sort-btn" aria-sort="ascending">
            订单号
            <span class="nb-table__sort-icon" aria-hidden="true">▲</span>
          </button>
        </th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">客户</th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">金额</th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">状态</th>
      </tr>
    </thead>

    <tbody class="nb-table__body">
      <tr class="nb-table__row nb-table__row--interactive" tabindex="0">
        <td class="nb-table__cell">#ORD-001</td>
        <td class="nb-table__cell">张三</td>
        <td class="nb-table__cell nb-table__cell--numeric">¥1,250.00</td>
        <td class="nb-table__cell">
          <span class="nb-badge nb-badge--success">已完成</span>
        </td>
      </tr>
      <tr class="nb-table__row nb-table__row--interactive nb-table__row--selected" aria-selected="true">
        <td class="nb-table__cell">#ORD-002</td>
        <td class="nb-table__cell">李四</td>
        <td class="nb-table__cell nb-table__cell--numeric">¥3,400.00</td>
        <td class="nb-table__cell">
          <span class="nb-badge nb-badge--warning">处理中</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### 2.2 必需子元素与可选子元素

| 子元素 | 类名 | 必需 | 说明 |
|--------|------|------|------|
| 表格容器 | `nb-table-wrapper` | ✅ 是 | 提供 `overflow`、阴影、边框、水平滚动。 |
| 表格主体 | `nb-table` | ✅ 是 | 语义 `<table>`，控制 `border-collapse` 与 `width`。 |
| 表头行 | `nb-table__head` + `nb-table__row` | ✅ 是 | `<thead>` + `<tr>`。 |
| 表头单元格 | `nb-table__cell--header` | ✅ 是 | `<th scope="col">`。 |
| 数据行 | `nb-table__row` | ✅ 是 | `<tbody>` 内的 `<tr>`。 |
| 数据单元格 | `nb-table__cell` | ✅ 是 | `<td>`。 |
| 表格标题 | `nb-table__caption` | ❌ 可选 | `<caption>`，强烈建议提供。 |
| 排序按钮 | `nb-table__sort-btn` | ❌ 可选 | 表头内的排序触发器。 |
| 可点击行 | `nb-table__row--interactive` | ❌ 可选 | 使行具有 Hover/Active 反馈。 |
| 选中行 | `nb-table__row--selected` | ❌ 可选 | 视觉标记选中状态。 |
| 数值单元格 | `nb-table__cell--numeric` | ❌ 可选 | 等宽字体右对齐。 |
| 斑马纹行 | `nb-table__row--striped` | ❌ 可选 | 交替背景色（也可由父级 `nb-table--striped` 控制）。 |

### 2.3 ARIA 属性要求

| 属性 | 应用场景 | 值 |
|------|----------|-----|
| `role="region"` | `nb-table-wrapper` | 当表格可横向滚动时，标记为可聚焦区域。 |
| `aria-labelledby` | `nb-table-wrapper` | 指向 `<caption>` 的 `id`，提供区域标签。 |
| `aria-describedby` | `nb-table` | 指向表格辅助说明文本。 |
| `scope="col"` / `scope="row"` | `<th>` | 明确表头单元格的作用域。 |
| `aria-sort` | `nb-table__sort-btn` | `none` / `ascending` / `descending` / `other`。 |
| `aria-selected` | `nb-table__row--selected` | `true` / `false`（行选择模式下）。 |
| `aria-busy` | `nb-table-wrapper` | 数据加载时设为 `true`。 |
| `aria-live="polite"` | 表格更新区域 | 动态数据刷新时用于通知屏幕阅读器。 |

### 2.4 键盘行为

| 按键 | 行为 | 说明 |
|------|------|------|
| `Tab` | 焦点在 `nb-table-wrapper`（横向滚动）→ 进入第一行；焦点在排序按钮 → 进入下一排序按钮；焦点在可交互行 → 按 Tab 进入行内焦点able元素。 | 符合自然 Tab 顺序。 |
| `Shift + Tab` | 反向导航。 | — |
| `Enter` / `Space` | 触发排序按钮；选中可交互行（如行选择模式）。 | — |
| `↑` / `↓` | 在可交互行之间移动焦点（`roving tabindex` 模式）。 | 由 JavaScript 控制，不属于纯 CSS 范畴。 |
| `Home` | 将焦点移至当前行的第一个单元格。 | — |
| `End` | 将焦点移至当前行的最后一个单元格。 | — |
| `Ctrl + Home` | 将焦点移至表格的第一个单元格。 | — |
| `Ctrl + End` | 将焦点移至表格的最后一个单元格。 | — |

---

## 3. 尺寸与变体

### 3.1 密度模式（Density）

Table 的密度通过父级或自身类名控制，影响单元格 `padding` 与行内 `gap`。密度**不改变**边框宽度、阴影大小、字体大小。

| 密度模式 | 类名 | 单元格 Padding（vertical / horizontal） | 表头 Padding | 行 Min-Height | 适用场景 |
|----------|------|----------------------------------------|--------------|---------------|----------|
| **Compact** | `nb-density-compact` | `0.375rem` / `0.75rem`（6px / 12px） | `0.5rem` / `0.75rem` | `36px` | 数据密集后台、仪表盘 |
| **Default** | `nb-density-default`（默认） | `0.75rem` / `1rem`（12px / 16px） | `0.75rem` / `1rem` | `48px` | 标准数据列表 |
| **Comfortable** | `nb-density-comfortable` | `1rem` / `1.25rem`（16px / 20px） | `1rem` / `1.25rem` | `64px` | 营销页、展示页 |

```css
/* 密度模式 Token 映射 */
.nb-table__cell {
  padding: var(--nb-density-default-padding) var(--nb-density-default-padding);
}

.nb-density-compact .nb-table__cell,
.nb-table.nb-density-compact .nb-table__cell {
  padding: var(--nb-density-compact-padding) var(--nb-density-compact-padding);
}

.nb-density-comfortable .nb-table__cell,
.nb-table.nb-density-comfortable .nb-table__cell {
  padding: var(--nb-density-comfortable-padding) var(--nb-density-comfortable-padding);
}
```

> **注意**：在 Compact 模式下，行内操作按钮（如行尾按钮）仍需保持最小 `44px × 44px` 的可点击区域（WCAG 2.5.5）。

### 3.2 行尺寸变体（Row Size）

当表格需要独立于全局密度 Token 调整时，提供以下行尺寸类：

| 尺寸 | 类名 | 单元格 Padding | 字体大小 | 行 Min-Height |
|------|------|---------------|----------|---------------|
| **xs** | `nb-table--xs` | `0.25rem 0.5rem` | `0.75rem` | `28px` |
| **sm** | `nb-table--sm` | `0.375rem 0.75rem` | `0.875rem` | `36px` |
| **md** | `nb-table--md`（默认） | `0.75rem 1rem` | `0.875rem` | `48px` |
| **lg** | `nb-table--lg` | `1rem 1.25rem` | `1rem` | `64px` |
| **xl** | `nb-table--xl` | `1.25rem 1.5rem` | `1.125rem` | `80px` |

```css
.nb-table--xs .nb-table__cell { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
.nb-table--sm .nb-table__cell { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
.nb-table--lg .nb-table__cell { padding: 1rem 1.25rem; font-size: 1rem; }
.nb-table--xl .nb-table__cell { padding: 1.25rem 1.5rem; font-size: 1.125rem; }
```

### 3.3 颜色变体（Color Variants）

应用于 `nb-table-wrapper` 或 `nb-table` 的修饰类，改变表头背景与强调色。

| 变体 | 类名 | 表头背景 | 表头文本 | 边框强调 | 说明 |
|------|------|----------|----------|----------|------|
| **Primary** | `nb-table--primary` | `--nb-primary` | `--nb-primary-content` | `var(--nb-primary)` | 品牌主色表头 |
| **Neutral** | `nb-table--neutral` | `--nb-base-200` | `--nb-base-content` | `var(--nb-border)` | 默认中性色 |
| **Secondary** | `nb-table--secondary` | `--nb-secondary` | `--nb-secondary-content` | `var(--nb-secondary)` | 次强调色 |

```css
.nb-table--primary .nb-table__head {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  --nb-base-content: var(--nb-primary-content); /* 令边框自动适配 */
}

.nb-table--secondary .nb-table__head {
  background-color: var(--nb-secondary);
  color: var(--nb-secondary-content);
  --nb-base-content: var(--nb-secondary-content);
}
```

### 3.4 外观变体（Appearance Variants）

| 变体 | 类名 | 规则 |
|------|------|------|
| **Zebra（斑马纹）** | `nb-table--zebra` | 偶数行（`:nth-child(even)`）背景为 `var(--nb-base-200)`，奇数行保持 `var(--nb-base-100)`。 |
| **Borders（全边框）** | `nb-table--bordered` | 所有单元格均显示 `2px solid var(--nb-border)`，而非仅底部/右侧分隔线。 |
| **Plain（无阴影）** | `nb-table--plain` | 容器 `box-shadow: none`，边框保留，用于嵌套在其他卡片内。 |
| **Full-Width（全宽）** | `nb-table--full-width` | `width: 100%`（默认已全宽，此类名用于显式覆盖父级约束）。 |
| **Fixed-Header（固定表头）** | `nb-table--fixed-header` | `thead` 使用 `position: sticky; top: 0; z-index: 10;` 固定。 |

```css
/* Zebra */
.nb-table--zebra tbody tr:nth-child(even) {
  background-color: var(--nb-base-200);
}

/* Bordered */
.nb-table--bordered .nb-table__cell,
.nb-table--bordered .nb-table__cell--header {
  border: 2px solid var(--nb-border);
}

/* Plain */
.nb-table--plain .nb-table-wrapper {
  box-shadow: none;
}

/* Fixed Header */
.nb-table--fixed-header .nb-table__head {
  position: sticky;
  inset-block-start: 0;
  z-index: 10;
}
```

---

## 4. 状态矩阵

以下矩阵覆盖 `Table` 组件及其子元素（行、单元格、表头）的所有状态。对于不适用于 Table 的状态，标记为 **N/A**。

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 其他 |
|------|------|------|------|------|--------|------|------|
| **Default** | 容器：`2px solid var(--nb-border)`；单元格：`1px solid var(--nb-border)`（右侧/底部） | 容器：`var(--nb-shadow-md)` | 无 | 表头：`var(--nb-base-200)`；行：`var(--nb-base-100)`；文本：`var(--nb-base-content)` | `1.0` | — | — |
| **Hover（行）** | 不变 | 行无阴影；容器阴影不变 | 行无位移（默认不可交互行）；可交互行：`translate(-2px, -2px)` | 行背景：`var(--nb-base-200)`；可交互行背景：`var(--nb-base-300)` | `1.0` | 背景色 `100ms`；可交互行位移 `150ms` | `cursor: pointer`（可交互行） |
| **Hover（表头排序按钮）** | `border-color: color-mix(in oklch, var(--nb-border) 80%, var(--nb-base-100))` | 无 | 无 | 背景微调：`color-mix(in oklch, var(--nb-base-200) 90%, var(--nb-base-100))` | `1.0` | `100ms` | `cursor: pointer` |
| **Active / Pressed（可交互行）** | 不变 | `var(--nb-shadow-none)` | `translate(4px, 4px)` | 背景：`var(--nb-base-300)` | `1.0` | `150ms` brutal | `cursor: pointer` |
| **Active / Pressed（排序按钮）** | 边框加深 | `var(--nb-shadow-none)` | `translate(4px, 4px)`（按钮级） | 背景：`var(--nb-base-300)` | `1.0` | `150ms` | — |
| **Focus Visible（行）** | 不变 | 不变 | 无 | 不变 | `1.0` | `100ms` | `outline: 2px solid var(--nb-focus); outline-offset: -2px;` |
| **Focus Visible（排序按钮）** | 不变 | 不变 | 无 | 不变 | `1.0` | `100ms` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **Disabled** | **N/A**（Table 本身不 Disabled） | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** |
| **Loading / Busy** | 容器边框不变 | 容器阴影不变 | 无 | 内容区覆盖半透明白色 | 容器 `1.0`；内容区 `0.5` | Loading 脉冲 `1s steps(2)` | `aria-busy="true"`；显示几何 Loading 指示器 |
| **Invalid** | **N/A**（Table 本身不承载验证） | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** |
| **Valid** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** |
| **Selected / Checked（行）** | 行：`2px solid var(--nb-primary)`；左侧强调：`border-inline-start-width: 3px; border-inline-start-color: var(--nb-primary)` | `var(--nb-shadow-sm)` | 无 | 背景：`var(--nb-primary)`；文本：`var(--nb-primary-content)` | `1.0` | `100ms` | `aria-selected="true"` |
| **Open / Expanded** | **N/A**（Table 本身无展开/折叠状态；行展开由子行或 Drawer 处理） | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** |
| **Readonly** | **N/A**（Table 只读是默认行为） | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** |
| **Dragging（行）** | 行边框：`border-style: dashed` | 行：`var(--nb-shadow-xl)` | JS 动态 `translate(x, y)` | 背景不变 | `0.9` | instant | `cursor: grabbing; z-index: var(--nb-z-dragging, 1070)` |
| **Empty State** | 容器边框保留 | 容器阴影保留 | 无 | 背景：`var(--nb-base-100)` | `1.0` | `250ms` fade-in | 居中显示 Empty State 插图与文本 |
| **Sorting（表头激活）** | 表头底部：`2px solid var(--nb-primary)` | 无 | 无 | 表头背景：`color-mix(in oklch, var(--nb-primary) 10%, var(--nb-base-200))` | `1.0` | `100ms` | 排序图标旋转或切换 |

### 状态说明

- **Default**：Table 的基准状态。阴影由容器承载，行与单元格无阴影。
- **Hover（行）**：普通行 Hover 仅背景色变化；**可交互行**（`nb-table__row--interactive`）额外遵循标准交互位移公式（阴影 `md` → `lg`，位移 `(-2px, -2px)`），但阴影作用于**行级别**（通过伪元素或 box-shadow 实现），容器阴影不变。
- **Active / Pressed（可交互行）**：可交互行按下时，阴影归零，位移 `(4px, 4px)`，背景变为 `var(--nb-base-300)`。
- **Focus Visible**：行 Focus 使用 `outline: 2px solid var(--nb-focus)`，`outline-offset: -2px`（内嵌 outline，避免超出表格边界）。排序按钮 Focus 使用 `outline-offset: 2px`（外嵌）。
- **Disabled**：Table 作为容器组件，**本身不进入 Disabled 状态**。行内表单元素（如 `<input>`、`<select>`）的 Disabled 状态遵循 Field 类别规范。
- **Loading / Busy**：整个表格数据加载时，容器显示 `aria-busy="true"`，内容区域被半透明遮罩覆盖，中央显示几何形 Loading 指示器（Neo-Brutal 风格）。
- **Invalid / Valid**：Table 本身不承载表单验证。若单元格内包含表单元素，其 Invalid/Valid 状态遵循 `interaction-language.md` 中的 Field 规范。
- **Selected / Checked（行）**：行选中时，背景变为主色，文本变为主色对比色，左侧增加 `3px` 强调边框（`border-inline-start`），边框色为主色。
- **Open / Expanded**：Table 本身无展开状态。子行展开（Accordion 行）由 Accordion 组件规范处理。
- **Dragging**：行拖拽时，边框变为虚线，阴影提升至 `xl`，透明度 `0.9`，层级提升。

---

## 5. 阴影与位移规则

### 5.1 容器级阴影

Table 的阴影施加在 `nb-table-wrapper`（Box 类别）上，而非内部表格。

| 状态 | 阴影 Token | 阴影值 | `transform` | 适用对象 |
|------|-----------|--------|-------------|----------|
| **Default** | `--nb-shadow-md` | `4px 4px 0 var(--nb-shadow-color)` | `none` | `nb-table-wrapper` |
| **Hover（容器）** | `--nb-shadow-lg` | `6px 6px 0 var(--nb-shadow-color)` | `translate(-2px, -2px)` | `nb-table-wrapper`（仅当容器本身可交互，如点击整表打开详情） |
| **Active（容器）** | `--nb-shadow-none` | `0 0 0 transparent` | `translate(4px, 4px)` | `nb-table-wrapper`（同上） |
| **Plain 变体** | `none` | `0 0 0 transparent` | `none` | `nb-table-wrapper` |

> **核心规则**：Table 的默认阴影不作用于行。行的阴影仅在**可交互行** Hover 时产生，且为**行级别**阴影。

### 5.2 行级阴影（可交互行）

可交互行（`nb-table__row--interactive`）在 Hover 时使用**行级阴影**，避免整个容器位移。

```css
.nb-table__row--interactive {
  transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
              background-color var(--nb-duration-fast) var(--nb-easing-standard);
  cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
  .nb-table__row--interactive:hover {
    transform: translate(-2px, -2px);
    /* 行级阴影：模拟从表格表面浮起 */
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
    background-color: var(--nb-base-300);
    z-index: 1; /* 确保浮起行覆盖相邻行 */
  }
}

.nb-table__row--interactive:active,
.nb-table__row--interactive[data-active="true"] {
  transform: translate(4px, 4px);
  box-shadow: var(--nb-shadow-none);
  background-color: var(--nb-base-300);
  transition-duration: var(--nb-duration-fast); /* 触摸端更快 */
}
```

### 5.3 布局稳定性保障

- **使用 `transform` 而非 `margin`**：行 Hover 位移必须使用 `transform: translate(-2px, -2px)`，避免触发表格重排（reflow）。
- **行 `z-index` 提升**：Hover 时设置 `z-index: 1`，确保浮起行覆盖相邻行的边框，避免视觉断裂。
- **触摸端策略**：无 Hover 设备上，可交互行仅通过 `:active` 提供反馈，Hover 样式不生效。

```css
/* 触摸端：禁用 Hover 位移，避免 sticky hover */
@media (hover: none) and (pointer: coarse) {
  .nb-table__row--interactive:hover {
    transform: none;
    box-shadow: none;
    background-color: var(--nb-base-200); /* 仅保留背景提示 */
  }
}
```

### 5.4 过渡定义

```css
.nb-table-wrapper {
  transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
              box-shadow var(--nb-duration-normal) var(--nb-easing-standard);
}

.nb-table__row--interactive {
  transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
              box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
              background-color var(--nb-duration-fast) var(--nb-easing-standard);
}

.nb-table__sort-btn {
  transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
              box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
              background-color var(--nb-duration-fast) var(--nb-easing-standard);
}
```

---

## 6. 圆角与边框

### 6.1 圆角 Token

Table 属于 **Box 类别**，使用 Box 类别 Token。所有单元格、行、表头均为 **0px 直角**。

| Token | 值 | 用途 |
|-------|-----|------|
| `--nb-radius-box` | `0px` | `nb-table-wrapper` 的圆角（默认 0px） |
| `--nb-border-box` | `2px` | 容器边框宽度 |
| `--nb-border-box-color` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` | 容器边框颜色 |

```css
.nb-table-wrapper {
  border-radius: var(--nb-radius-box); /* 0px */
  border: var(--nb-border-box) solid var(--nb-border-box-color);
  overflow: hidden; /* 确保内部直角不溢出 */
}
```

> **说明**：`overflow: hidden` 在 `0px` 圆角下无视觉影响，但在嵌套于父级容器时确保边界清晰。

### 6.2 单元格边框策略

Table 使用 ** collapsed borders** 策略（`border-collapse: collapse`），避免双边框问题。

```css
.nb-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
```

#### 默认边框模式（分隔线）

```css
/* 表头单元格：底部 2px 实线 + 右侧 1px 分隔线 */
.nb-table__cell--header {
  border-bottom: 2px solid var(--nb-border-box-color);
  border-right: 1px solid var(--nb-border-box-color);
}

.nb-table__cell--header:last-child {
  border-right: none;
}

/* 数据单元格：底部 1px 分隔线 + 右侧 1px 分隔线 */
.nb-table__cell {
  border-bottom: 1px solid var(--nb-border-box-color);
  border-right: 1px solid var(--nb-border-box-color);
}

.nb-table__cell:last-child {
  border-right: none;
}

/* 最后一行去除底部边框 */
.nb-table__body .nb-table__row:last-child .nb-table__cell {
  border-bottom: none;
}
```

#### 全边框模式（`nb-table--bordered`）

```css
.nb-table--bordered .nb-table__cell,
.nb-table--bordered .nb-table__cell--header {
  border: 2px solid var(--nb-border-box-color);
}

.nb-table--bordered .nb-table__cell--header {
  border-bottom: 2px solid var(--nb-border-box-color); /* 保持表头强调 */
}
```

### 6.3 强调边框（选中/错误状态）

```css
/* 选中行：左侧 3px 强调边框 */
.nb-table__row--selected {
  border-inline-start: 3px solid var(--nb-primary);
}

/* 若使用 Full Borders 模式，选中行增加主色边框 */
.nb-table--bordered .nb-table__row--selected .nb-table__cell {
  border-color: var(--nb-primary);
}
```

### 6.4 例外情况

Table 组件**无圆角例外**。所有单元格、行、表头严格为 `0px`。

---

## 7. 颜色策略

### 7.1 颜色 Token 使用映射

| 元素 | 背景色 | 文本色 | 边框色 | 说明 |
|------|--------|--------|--------|------|
| `nb-table-wrapper` | `var(--nb-base-100)` | — | `var(--nb-border-box-color)` | 容器背景 |
| `nb-table__head` | `var(--nb-base-200)` | `var(--nb-base-content)` | — | 表头行背景 |
| `nb-table__cell--header` | 继承 `thead` | 继承 `thead` | `var(--nb-border-box-color)` | 表头单元格 |
| `nb-table__body` | 透明 | `var(--nb-base-content)` | — | 表体 |
| `nb-table__row` | `var(--nb-base-100)` | `var(--nb-base-content)` | — | 默认数据行 |
| `nb-table__row:hover` | `var(--nb-base-200)` | `var(--nb-base-content)` | — | 行 Hover（普通） |
| `nb-table__row--interactive:hover` | `var(--nb-base-300)` | `var(--nb-base-content)` | — | 可交互行 Hover |
| `nb-table__row--selected` | `var(--nb-primary)` | `var(--nb-primary-content)` | `var(--nb-primary)` | 选中行 |
| 斑马纹偶数行 | `var(--nb-base-200)` | `var(--nb-base-content)` | — | `nb-table--zebra` |
| 数值单元格 | 透明 | `var(--nb-base-content)` | — | 使用 `var(--nb-font-mono)` |

### 7.2 颜色变体（Color Variants）

```css
/* Primary 表头 */
.nb-table--primary .nb-table__head {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  --nb-base-content: var(--nb-primary-content); /* 令边框自动适配 */
}

.nb-table--primary .nb-table__cell--header {
  border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
}

/* Secondary 表头 */
.nb-table--secondary .nb-table__head {
  background-color: var(--nb-secondary);
  color: var(--nb-secondary-content);
  --nb-base-content: var(--nb-secondary-content);
}
```

### 7.3 Hover / Active 颜色微调

使用 `color-mix` 实现平滑的状态过渡，**禁止硬编码 `#hex` 或 `oklch()`**。

```css
/* 表头排序按钮 Hover */
.nb-table__sort-btn:hover {
  background-color: color-mix(in oklch, var(--nb-base-200) 90%, var(--nb-base-100));
}

/* 可交互行 Active 背景微调 */
.nb-table__row--interactive:active {
  background-color: color-mix(in oklch, var(--nb-base-300) 95%, var(--nb-base-content));
}

/* 主色表头 Hover 背景微调 */
.nb-table--primary .nb-table__sort-btn:hover {
  background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
}
```

### 7.4 强调色（Accent Colors）

行状态使用语义色 Token：

```css
.nb-table__row--selected {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  border-inline-start: 3px solid var(--nb-primary);
}

.nb-table__row--error {
  background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
  border-inline-start: 3px solid var(--nb-error);
}

.nb-table__row--warning {
  background-color: color-mix(in oklch, var(--nb-warning) 8%, var(--nb-base-100));
  border-inline-start: 3px solid var(--nb-warning);
}

.nb-table__row--success {
  background-color: color-mix(in oklch, var(--nb-success) 8%, var(--nb-base-100));
  border-inline-start: 3px solid var(--nb-success);
}
```

---

## 8. 可访问性要求

### 8.1 键盘可操作性

| 功能 | 要求 | 实现 |
|------|------|------|
| **Tab 顺序** | 表格容器可聚焦（横向滚动时），表头排序按钮可 Tab 到达，可交互行可 Tab 到达。 | `tabindex="0"` 在 `nb-table-wrapper`（当 `overflow-x: auto` 时）；`tabindex="0"` 在 `nb-table__row--interactive`。 |
| **Enter / Space** | 触发排序按钮；选中可交互行。 | 原生 `<button>` 或 JS 监听。 |
| **方向键导航** | 使用 `roving tabindex` 在单元格/行之间移动焦点。 | 由 JavaScript 实现，CSS 提供 `focus-visible` 样式。 |
| **焦点顺序** | 从左到右、从上到下，符合阅读顺序。 | 依赖 DOM 顺序。 |

### 8.2 `:focus-visible` 样式

```css
/* 可交互行焦点 */
.nb-table__row--interactive:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: -2px; /* 内嵌，避免溢出表格 */
  position: relative; /* 确保 outline 在 collapsed border 之上渲染 */
}

/* 表头排序按钮焦点 */
.nb-table__sort-btn:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

/* 表格容器焦点（横向滚动时） */
.nb-table-wrapper:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}
```

### 8.3 `aria-*` 属性

| 属性 | 元素 | 场景 |
|------|------|------|
| `aria-labelledby` | `nb-table-wrapper` | 指向 `<caption>`，提供表格名称。 |
| `aria-describedby` | `nb-table` | 指向表格描述文本。 |
| `aria-sort` | `nb-table__sort-btn` | 指示当前列排序状态：`none` / `ascending` / `descending`。 |
| `aria-selected` | `nb-table__row--selected` | 行选择模式下，标记选中行。 |
| `aria-busy` | `nb-table-wrapper` | 数据加载中。 |
| `aria-live="polite"` | `nb-table__body` 或容器 | 动态数据更新时通知屏幕阅读器。 |
| `scope="col"` | `<th>` | 表头单元格作用域。 |
| `scope="row"` | `<th>` | 行首单元格作为行标题时。 |

### 8.4 RTL 适配（逻辑属性）

Table 必须使用 CSS 逻辑属性，确保在 RTL 布局下自动翻转。

```css
/* 使用逻辑属性替代物理属性 */
.nb-table__cell--header {
  text-align: start; /* 替代 text-align: left */
  padding-inline: 1rem; /* 替代 padding-left / padding-right */
  padding-block: 0.75rem; /* 替代 padding-top / padding-bottom */
}

.nb-table__cell--numeric {
  text-align: end; /* 替代 text-align: right */
}

.nb-table__row--selected {
  border-inline-start-width: 3px; /* 替代 border-left-width */
  border-inline-start-color: var(--nb-primary);
}

.nb-table__cell--header {
  border-inline-end: 1px solid var(--nb-border-box-color); /* 替代 border-right */
}

.nb-table__cell--header:last-child {
  border-inline-end: none;
}

.nb-table__cell {
  border-inline-end: 1px solid var(--nb-border-box-color);
  border-block-end: 1px solid var(--nb-border-box-color); /* 替代 border-bottom */
}

.nb-table__cell:last-child {
  border-inline-end: none;
}

.nb-table__body .nb-table__row:last-child .nb-table__cell {
  border-block-end: none;
}
```

> **验证**：在 `dir="rtl"` 下，强调边框、文本对齐、单元格分隔线必须自动翻转，无需额外 CSS。

### 8.5 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  .nb-table-wrapper,
  .nb-table__row--interactive,
  .nb-table__sort-btn {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }

  .nb-table__row--interactive:hover {
    transform: none;
    box-shadow: none;
  }

  .nb-table__row--interactive:active {
    transform: none;
    box-shadow: none;
  }

  /* 保留即时视觉反馈，无动画 */
  .nb-table__row--interactive:hover {
    background-color: var(--nb-base-300);
  }
}
```

### 8.6 `forced-colors`（高对比度模式）

在 Windows 高对比度模式或 `forced-colors: active` 下：

```css
@media (forced-colors: active) {
  .nb-table-wrapper {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-table__cell--header,
  .nb-table__cell {
    border-color: CanvasText;
  }

  .nb-table__row--interactive:hover,
  .nb-table__row--interactive:active {
    forced-color-adjust: none;
    background-color: Highlight;
    color: HighlightText;
  }

  .nb-table__row--selected {
    background-color: Highlight;
    color: HighlightText;
    border-color: Highlight;
  }

  .nb-table__row--interactive:focus-visible,
  .nb-table__sort-btn:focus-visible,
  .nb-table-wrapper:focus-visible {
    outline: 2px solid Highlight; /* 使用系统高对比色 */
    outline-offset: 2px;
  }

  /* 阴影在高对比度下禁用，依赖边框区分层级 */
  .nb-table-wrapper,
  .nb-table__row--interactive {
    box-shadow: none !important;
  }
}
```

### 8.7 移动端可用性（320px 视口）

```css
/* 最小视口适配 */
@media (max-width: 320px) {
  .nb-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .nb-table {
    min-width: 280px; /* 确保在 320px 视口下仍有可滚动内容 */
  }

  .nb-table__cell,
  .nb-table__cell--header {
    padding-inline: 0.5rem; /* 缩小水平 padding */
    padding-block: 0.5rem;
  }
}

/* 触摸目标最小尺寸 */
.nb-table__sort-btn {
  min-height: 44px; /* WCAG 2.5.5 */
  min-width: 44px;
}

.nb-table__row--interactive {
  min-height: 48px; /* 触摸设备行高 */
}
```

### 8.8 200% 缩放测试

- 在浏览器 200% 缩放（或 `font-size: 200%`）下，表格必须保持可读性。
- 表头文本不应截断；单元格内容应自动换行或保持 `white-space: nowrap`（取决于设计决策）。
- 横向滚动在 200% 缩放下必须正常工作。
- 所有交互元素（排序按钮、可交互行）在放大后仍保持最小 44px 点击区域。

```css
.nb-table__cell {
  /* 默认允许换行，确保 200% 缩放不溢出 */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.nb-table__cell--nowrap {
  /* 可选类：禁止换行，配合横向滚动使用 */
  white-space: nowrap;
}
```

---

## 9. 完整 CSS 示例

以下 CSS 可直接复制到组件库中，使用 `@layer` 包裹，确保与 Tailwind CSS v4 兼容。

```css
/* =============================================
   Neo-Brutal UI — Table Component
   ============================================= */

@layer nb-components {
  /* ---- 容器 ---- */
  .nb-table-wrapper {
    display: block;
    width: 100%;
    background-color: var(--nb-base-100);
    border: var(--nb-border-box) solid var(--nb-border-box-color);
    border-radius: var(--nb-radius-box); /* 0px */
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    overflow: hidden;
    transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
                box-shadow var(--nb-duration-normal) var(--nb-easing-standard);
  }

  .nb-table-wrapper:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  /* ---- 表格主体 ---- */
  .nb-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: start;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--nb-base-content);
  }

  /* ---- 表格标题 ---- */
  .nb-table__caption {
    caption-side: top;
    padding: var(--nb-density-default-padding);
    font-weight: var(--nb-weight-bold);
    font-size: 1rem;
    text-align: start;
    border-bottom: 2px solid var(--nb-border-box-color);
  }

  .nb-table__desc {
    display: block;
    font-weight: var(--nb-weight-normal);
    font-size: 0.875rem;
    color: color-mix(in oklch, var(--nb-base-content) 70%, transparent);
    margin-block-start: 0.25rem;
  }

  /* ---- 表头 ---- */
  .nb-table__head {
    background-color: var(--nb-base-200);
  }

  .nb-table__cell--header {
    padding: 0.75rem 1rem;
    font-weight: var(--nb-weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--nb-tracking-wide); /* 0.05em */
    font-size: 0.75rem;
    text-align: start;
    border-block-end: 2px solid var(--nb-border-box-color);
    border-inline-end: 1px solid var(--nb-border-box-color);
    white-space: nowrap;
  }

  .nb-table__cell--header:last-child {
    border-inline-end: none;
  }

  /* 排序按钮 */
  .nb-table__sort-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    margin: -0.25rem -0.5rem;
    font: inherit;
    color: inherit;
    background: none;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
                background-color var(--nb-duration-fast) var(--nb-easing-standard);
  }

  .nb-table__sort-btn:hover {
    background-color: color-mix(in oklch, var(--nb-base-200) 90%, var(--nb-base-100));
    border-color: var(--nb-border-box-color);
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  .nb-table__sort-btn:active {
    transform: translate(4px, 4px);
    box-shadow: var(--nb-shadow-none);
  }

  .nb-table__sort-btn:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  .nb-table__sort-icon {
    font-size: 0.625rem;
    transition: transform var(--nb-duration-fast) var(--nb-easing-standard);
  }

  .nb-table__sort-btn[aria-sort="descending"] .nb-table__sort-icon {
    transform: rotate(180deg);
  }

  /* ---- 数据行与单元格 ---- */
  .nb-table__row {
    background-color: var(--nb-base-100);
    transition: background-color var(--nb-duration-fast) var(--nb-easing-standard);
  }

  .nb-table__cell {
    padding: 0.75rem 1rem;
    border-block-end: 1px solid var(--nb-border-box-color);
    border-inline-end: 1px solid var(--nb-border-box-color);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .nb-table__cell:last-child {
    border-inline-end: none;
  }

  .nb-table__body .nb-table__row:last-child .nb-table__cell {
    border-block-end: none;
  }

  /* 数值单元格 */
  .nb-table__cell--numeric {
    font-family: var(--nb-font-mono);
    text-align: end;
  }

  /* ---- 行 Hover（默认） ---- */
  .nb-table__body .nb-table__row:hover {
    background-color: var(--nb-base-200);
  }

  /* ---- 可交互行 ---- */
  .nb-table__row--interactive {
    cursor: pointer;
    transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
                box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
                background-color var(--nb-duration-fast) var(--nb-easing-standard);
    -webkit-tap-highlight-color: transparent;
  }

  @media (hover: hover) and (pointer: fine) {
    .nb-table__row--interactive:hover {
      transform: translate(-2px, -2px);
      box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
      background-color: var(--nb-base-300);
      z-index: 1;
      position: relative;
    }
  }

  .nb-table__row--interactive:active,
  .nb-table__row--interactive[data-active="true"] {
    transform: translate(4px, 4px);
    box-shadow: var(--nb-shadow-none);
    background-color: var(--nb-base-300);
  }

  .nb-table__row--interactive:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: -2px;
    position: relative;
  }

  /* ---- 选中行 ---- */
  .nb-table__row--selected {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    border-inline-start: 3px solid var(--nb-primary);
  }

  .nb-table__row--selected .nb-table__cell {
    border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  }

  .nb-table__row--selected:hover {
    background-color: color-mix(in oklch, var(--nb-primary) 95%, black);
  }

  /* ---- 状态行（Error / Warning / Success） ---- */
  .nb-table__row--error {
    background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
    border-inline-start: 3px solid var(--nb-error);
  }

  .nb-table__row--warning {
    background-color: color-mix(in oklch, var(--nb-warning) 8%, var(--nb-base-100));
    border-inline-start: 3px solid var(--nb-warning);
  }

  .nb-table__row--success {
    background-color: color-mix(in oklch, var(--nb-success) 8%, var(--nb-base-100));
    border-inline-start: 3px solid var(--nb-success);
  }

  /* ---- 斑马纹 ---- */
  .nb-table--zebra .nb-table__body .nb-table__row:nth-child(even) {
    background-color: var(--nb-base-200);
  }

  .nb-table--zebra .nb-table__body .nb-table__row:nth-child(even):hover {
    background-color: var(--nb-base-300);
  }

  /* ---- 全边框 ---- */
  .nb-table--bordered .nb-table__cell,
  .nb-table--bordered .nb-table__cell--header {
    border: 2px solid var(--nb-border-box-color);
  }

  .nb-table--bordered .nb-table__cell--header {
    border-block-end: 2px solid var(--nb-border-box-color);
  }

  .nb-table--bordered .nb-table__row--selected .nb-table__cell {
    border-color: var(--nb-primary);
  }

  /* ---- 无阴影 ---- */
  .nb-table--plain .nb-table-wrapper {
    box-shadow: none;
  }

  /* ---- 固定表头 ---- */
  .nb-table--fixed-header .nb-table__head {
    position: sticky;
    inset-block-start: 0;
    z-index: 10;
  }

  /* ---- 行尺寸 ---- */
  .nb-table--xs .nb-table__cell,
  .nb-table--xs .nb-table__cell--header {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  .nb-table--sm .nb-table__cell,
  .nb-table--sm .nb-table__cell--header {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .nb-table--lg .nb-table__cell,
  .nb-table--lg .nb-table__cell--header {
    padding: 1rem 1.25rem;
    font-size: 1rem;
  }

  .nb-table--xl .nb-table__cell,
  .nb-table--xl .nb-table__cell--header {
    padding: 1.25rem 1.5rem;
    font-size: 1.125rem;
  }

  /* ---- 密度模式 ---- */
  .nb-density-compact .nb-table__cell,
  .nb-density-compact .nb-table__cell--header,
  .nb-table.nb-density-compact .nb-table__cell,
  .nb-table.nb-density-compact .nb-table__cell--header {
    padding: var(--nb-density-compact-padding) var(--nb-density-compact-padding);
  }

  .nb-density-comfortable .nb-table__cell,
  .nb-density-comfortable .nb-table__cell--header,
  .nb-table.nb-density-comfortable .nb-table__cell,
  .nb-table.nb-density-comfortable .nb-table__cell--header {
    padding: var(--nb-density-comfortable-padding) var(--nb-density-comfortable-padding);
  }

  /* ---- 颜色变体 ---- */
  .nb-table--primary .nb-table__head {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    --nb-base-content: var(--nb-primary-content);
  }

  .nb-table--secondary .nb-table__head {
    background-color: var(--nb-secondary);
    color: var(--nb-secondary-content);
    --nb-base-content: var(--nb-secondary-content);
  }

  /* ---- Loading 状态 ---- */
  .nb-table-wrapper[aria-busy="true"] {
    position: relative;
    pointer-events: none;
  }

  .nb-table-wrapper[aria-busy="true"] .nb-table {
    opacity: 0.5;
  }

  .nb-table-wrapper[aria-busy="true"]::after {
    content: "";
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: color-mix(in oklch, var(--nb-base-100) 60%, transparent);
    z-index: 20;
  }

  .nb-table-wrapper[aria-busy="true"]::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.5rem;
    height: 1.5rem;
    background-color: var(--nb-primary);
    border: 2px solid var(--nb-border-box-color);
    animation: nb-loading-pulse 1s steps(2) infinite;
    transform: translate(-50%, -50%);
    z-index: 21;
  }

  @keyframes nb-loading-pulse {
    0%, 100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.5;
      transform: translate(-50%, -50%) scale(0.8);
    }
  }

  /* ---- 触摸端适配 ---- */
  @media (hover: none) and (pointer: coarse) {
    .nb-table__row--interactive:hover {
      transform: none;
      box-shadow: none;
      background-color: var(--nb-base-200);
    }

    .nb-table__sort-btn:hover {
      transform: none;
      box-shadow: none;
    }
  }

  /* ---- 减少动画 ---- */
  @media (prefers-reduced-motion: reduce) {
    .nb-table-wrapper,
    .nb-table__row--interactive,
    .nb-table__sort-btn,
    .nb-table__row {
      transition: none !important;
      transform: none !important;
      animation: none !important;
    }

    .nb-table__row--interactive:hover,
    .nb-table__row--interactive:active {
      transform: none;
      box-shadow: none;
    }
  }

  /* ---- 高对比度模式 ---- */
  @media (forced-colors: active) {
    .nb-table-wrapper {
      border: 2px solid CanvasText;
      box-shadow: none !important;
    }

    .nb-table__cell--header,
    .nb-table__cell {
      border-color: CanvasText;
    }

    .nb-table__row--interactive:hover,
    .nb-table__row--interactive:active,
    .nb-table__row--selected {
      forced-color-adjust: none;
      background-color: Highlight;
      color: HighlightText;
    }

    .nb-table__row--interactive:focus-visible,
    .nb-table__sort-btn:focus-visible,
    .nb-table-wrapper:focus-visible {
      outline: 2px solid Highlight;
      outline-offset: 2px;
    }
  }

  /* ---- 320px 移动端 ---- */
  @media (max-width: 320px) {
    .nb-table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .nb-table {
      min-width: 280px;
    }

    .nb-table__cell,
    .nb-table__cell--header {
      padding-inline: 0.5rem;
      padding-block: 0.5rem;
    }
  }
}
```

### 9.1 完整 HTML 示例

```html
<!-- 标准表格 -->
<div class="nb-table-wrapper" role="region" aria-labelledby="orders-caption" tabindex="0">
  <table class="nb-table" aria-describedby="orders-desc">
    <caption id="orders-caption" class="nb-table__caption">
      订单列表
      <span id="orders-desc" class="nb-table__desc">共 128 条记录，按日期倒序排列</span>
    </caption>

    <thead class="nb-table__head">
      <tr class="nb-table__row">
        <th class="nb-table__cell nb-table__cell--header" scope="col">
          <button type="button" class="nb-table__sort-btn" aria-sort="ascending">
            订单号
            <span class="nb-table__sort-icon" aria-hidden="true">▲</span>
          </button>
        </th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">客户</th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">金额</th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">状态</th>
      </tr>
    </thead>

    <tbody class="nb-table__body">
      <tr class="nb-table__row nb-table__row--interactive" tabindex="0">
        <td class="nb-table__cell">#ORD-001</td>
        <td class="nb-table__cell">张三</td>
        <td class="nb-table__cell nb-table__cell--numeric">¥1,250.00</td>
        <td class="nb-table__cell">
          <span class="nb-badge nb-badge--success">已完成</span>
        </td>
      </tr>
      <tr class="nb-table__row nb-table__row--interactive nb-table__row--selected" aria-selected="true" tabindex="0">
        <td class="nb-table__cell">#ORD-002</td>
        <td class="nb-table__cell">李四</td>
        <td class="nb-table__cell nb-table__cell--numeric">¥3,400.00</td>
        <td class="nb-table__cell">
          <span class="nb-badge nb-badge--warning">处理中</span>
        </td>
      </tr>
      <tr class="nb-table__row nb-table__row--interactive nb-table__row--error" tabindex="0">
        <td class="nb-table__cell">#ORD-003</td>
        <td class="nb-table__cell">王五</td>
        <td class="nb-table__cell nb-table__cell--numeric">¥850.00</td>
        <td class="nb-table__cell">
          <span class="nb-badge nb-badge--error">已取消</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- 主色表头 + 斑马纹 + 固定表头 + 全边框 -->
<div class="nb-table-wrapper" role="region" aria-labelledby="users-caption">
  <table class="nb-table nb-table--primary nb-table--zebra nb-table--fixed-header nb-table--bordered nb-table--lg">
    <caption id="users-caption" class="nb-table__caption">用户管理</caption>
    <thead class="nb-table__head">
      <tr class="nb-table__row">
        <th class="nb-table__cell nb-table__cell--header" scope="col">ID</th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">用户名</th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">角色</th>
      </tr>
    </thead>
    <tbody class="nb-table__body">
      <tr class="nb-table__row nb-table__row--interactive">
        <td class="nb-table__cell">001</td>
        <td class="nb-table__cell">admin</td>
        <td class="nb-table__cell">管理员</td>
      </tr>
      <tr class="nb-table__row nb-table__row--interactive">
        <td class="nb-table__cell">002</td>
        <td class="nb-table__cell">editor</td>
        <td class="nb-table__cell">编辑</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- 加载中表格 -->
<div class="nb-table-wrapper" aria-busy="true" role="region" aria-labelledby="loading-caption">
  <table class="nb-table">
    <caption id="loading-caption" class="nb-table__caption">数据加载中...</caption>
    <thead class="nb-table__head">
      <tr class="nb-table__row">
        <th class="nb-table__cell nb-table__cell--header" scope="col">列 A</th>
        <th class="nb-table__cell nb-table__cell--header" scope="col">列 B</th>
      </tr>
    </thead>
    <tbody class="nb-table__body">
      <tr class="nb-table__row"><td class="nb-table__cell">—</td><td class="nb-table__cell">—</td></tr>
    </tbody>
  </table>
</div>
```

---

## 10. 检查清单（与阶段 2.7 验收标准对齐）

以下验收项必须全部通过，方可进入组件实现阶段。

### 10.1 视觉与 Token 合规

- [ ] 类名前缀为 `nb-`，无无前缀类名。
- [ ] 所有边框使用 `2px solid`（默认）或 `1px solid`（分隔线），颜色使用 `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` 或对应语义 Token。
- [ ] 所有阴影使用 `box-shadow`，`blur = 0`，`spread = 0`，颜色通过 `--nb-shadow-color` 注入。
- [ ] 所有圆角为 `0px`（`var(--nb-radius-box)`），无圆角例外。
- [ ] 无硬编码 `#hex` 或未经批准的 `oklch()` 值；所有颜色使用语义 Token（`--nb-primary`、`--nb-base-200` 等）。
- [ ] 表头使用 `text-transform: uppercase` + `letter-spacing: var(--nb-tracking-wide)`，符合字体铁律。
- [ ] 数值单元格使用 `var(--nb-font-mono)`，右对齐（`text-align: end`）。

### 10.2 交互状态合规

- [ ] 可交互行 Hover 时阴影升一级（`sm`），位移 `(-2px, -2px)`，使用 `transform`。
- [ ] 可交互行 Active 时阴影归零，位移 `(4px, 4px)`。
- [ ] 行 Hover 不触发周围布局抖动（`transform` 而非 `margin`/`position`）。
- [ ] 过渡时长：`100ms`（背景色/边框）或 `150ms`（位移/阴影），缓动 `cubic-bezier(0.4, 0, 0.2, 1)`。
- [ ] 选中行背景为 `--nb-primary`，文本为 `--nb-primary-content`，左侧 `3px` 强调边框。
- [ ] 状态行（Error/Warning/Success）使用 `color-mix` 微色调背景，左侧 `3px` 强调边框。
- [ ] Loading 状态保持容器尺寸不变，内容替换为几何形 Loading 指示器。

### 10.3 可访问性合规

- [ ] 键盘 `Tab` 顺序合理：容器 → 表头排序按钮 → 可交互行 → 行内元素。
- [ ] `:focus-visible` 使用 `2px solid var(--nb-focus)`，`outline-offset: 2px`（表头/容器）或 `-2px`（行内嵌）。
- [ ] `aria-sort` 在排序按钮上正确设置。
- [ ] `aria-selected` 在选中行上正确设置。
- [ ] `aria-busy` 在 Loading 状态下正确设置。
- [ ] RTL 适配：使用 `text-align: start/end`、`padding-inline`、`border-inline-start`、`border-block-end` 等逻辑属性。
- [ ] `prefers-reduced-motion: reduce` 下取消所有 `transform` 位移和动画，保留即时阴影/背景切换。
- [ ] `forced-colors: active` 下边框始终可见（使用 `CanvasText`），阴影禁用，选中行使用 `Highlight`/`HighlightText`。
- [ ] 320px 视口下表格可横向滚动，单元格内容不溢出视口。
- [ ] 200% 缩放下文本可读，横向滚动正常，交互元素最小点击区域 ≥ 44px。
- [ ] 表头使用 `<th scope="col">`，行标题使用 `<th scope="row">`（如适用）。

### 10.4 结构与实现合规

- [ ] DOM Contract 中所有子元素类名已定义，HTML 结构语义正确。
- [ ] 密度模式（Compact/Default/Comfortable）通过 CSS 变量或类名切换，不影响边框/阴影/字体。
- [ ] 行尺寸（xs/sm/md/lg/xl）通过 `nb-table--{size}` 类名控制。
- [ ] 颜色变体（Primary/Neutral/Secondary）通过 `nb-table--{color}` 类名控制。
- [ ] 外观变体（Zebra/Bordered/Plain/Fixed-Header/Full-Width）通过修饰类名控制。
- [ ] CSS 使用 `@layer nb-components` 包裹，确保与 Tailwind CSS v4 的 `@layer` 系统兼容。
- [ ] 所有代码可直接复制使用，无语法错误，无未定义变量。

---

> **文档版本**：v1.0  
> **最后更新**：2025 年 6 月  
> **维护者**：Neo-Brutal UI 设计系统团队  
> **审核状态**：待技术评审（Tech Review）
