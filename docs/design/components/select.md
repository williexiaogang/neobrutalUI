# Select 组件设计基准稿

> **组件类别**：Field 表单字段
> **适用文档**：`radius-and-borders.md` § Field 类别、`interaction-language.md` § 表单状态矩阵
> **文档版本**：v1.0
> **最后更新**：设计系统初版

---

## 1. 组件概述

### 1.1 组件名称与用途

Select（下拉选择器）用于在多个互斥选项中选中一项，适用于选项数量较多（通常超过 5 个）或选项文本较长的场景，比 Radio 组更节省空间。作为表单字段，它接受用户输入并参与表单提交。

### 1.2 对应的语义 HTML 元素

| 场景 | 推荐元素 | 说明 |
|------|----------|------|
| 触发器（Trigger） | `<button>` | 自定义样式触发器，必须设置 `type="button"` 避免意外提交表单 |
| 下拉面板（Dropdown Panel） | `<div>` + `role="listbox"` | 自定义选项列表容器，需配合 `aria-expanded` |
| 选项（Option） | `<div>` + `role="option"` | 单个选项，需配合 `aria-selected` |
| 原生降级（可选） | `<select>` | 无 JS 环境下的语义降级方案，使用 `nb-select--native` 类 |

### 1.3 类名体系

| 类名 | 用途 | 前缀 |
|------|------|------|
| `.nb-select` | 组件根容器（相对定位，包裹 trigger + dropdown） | `nb-` |
| `.nb-select__trigger` | 触发按钮（可见的可点击区域） | `nb-` |
| `.nb-select__icon` | 下拉箭头图标（SVG 或 Unicode） | `nb-` |
| `.nb-select__dropdown` | 下拉面板容器（绝对定位） | `nb-` |
| `.nb-select__option` | 单个选项 | `nb-` |
| `.nb-select__option-group` | 选项分组（optgroup 等效） | `nb-` |
| `.nb-select__option-group-label` | 分组标题 | `nb-` |
| `.nb-select__spinner` | Loading 状态指示器 | `nb-` |
| `.nb-select__clear` | 清空按钮（可选） | `nb-` |
| `.nb-select--native` | 原生 `<select>` 降级模式 | `nb-` |
| `.nb-select--[size]` | 尺寸变体（`xs`/`sm`/`md`/`lg`/`xl`） | `nb-` |
| `.nb-select--[variant]` | 外观变体（`primary`/`neutral`/`secondary`/`outline`/`ghost`） | `nb-` |
| `.nb-select--full-width` | 宽度占满父容器 | `nb-` |
| `.nb-select--compact` | 紧凑密度模式 | `nb-` |
| `.nb-select--comfortable` | 舒适密度模式 | `nb-` |

---

## 2. DOM Contract

### 2.1 推荐 HTML 结构（完整自定义实现）

```html
<!-- 完整自定义 Select 组件 -->
<div class="nb-select" data-state="closed" aria-label="选择国家">
  <!-- 触发器：Field 类别，直角，2px 边框 -->
  <button
    class="nb-select__trigger"
    type="button"
    role="combobox"
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-controls="nb-select-dropdown-1"
    aria-activedescendant=""
    tabindex="0"
  >
    <span class="nb-select__value">请选择</span>
    <span class="nb-select__icon" aria-hidden="true">
      <!-- 粗野风格箭头：2px 线条，无圆角 -->
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="square">
        <path d="M2 4 L6 8 L10 4"/>
      </svg>
    </span>
  </button>

  <!-- 下拉面板：Overlay 类别，直角，带阴影 -->
  <div
    class="nb-select__dropdown"
    id="nb-select-dropdown-1"
    role="listbox"
    aria-label="国家选项"
    hidden
  >
    <!-- 选项分组（可选） -->
    <div class="nb-select__option-group" role="group" aria-label="亚洲">
      <div class="nb-select__option-group-label">亚洲</div>
      <div class="nb-select__option" role="option" id="nb-opt-1" aria-selected="false">
        <span class="nb-select__option-text">中国</span>
        <span class="nb-select__option-check" aria-hidden="true">✓</span>
      </div>
      <div class="nb-select__option" role="option" id="nb-opt-2" aria-selected="false">
        <span class="nb-select__option-text">日本</span>
        <span class="nb-select__option-check" aria-hidden="true">✓</span>
      </div>
    </div>

    <!-- 无分组选项 -->
    <div class="nb-select__option" role="option" id="nb-opt-3" aria-selected="false">
      <span class="nb-select__option-text">美国</span>
      <span class="nb-select__option-check" aria-hidden="true">✓</span>
    </div>
    <div class="nb-select__option" role="option" id="nb-opt-4" aria-selected="false">
      <span class="nb-select__option-text">德国</span>
      <span class="nb-select__option-check" aria-hidden="true">✓</span>
    </div>
  </div>
</div>
```

### 2.2 原生降级模式（无 JS 环境）

```html
<!-- 原生 <select> 降级模式 -->
<div class="nb-select nb-select--native">
  <select class="nb-select__native" aria-label="选择国家">
    <option value="">请选择</option>
    <optgroup label="亚洲">
      <option value="cn">中国</option>
      <option value="jp">日本</option>
    </optgroup>
    <option value="us">美国</option>
    <option value="de">德国</option>
  </select>
  <span class="nb-select__icon" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="square">
      <path d="M2 4 L6 8 L10 4"/>
    </svg>
  </span>
</div>
```

### 2.3 必需子元素与可选子元素

| 子元素 | 类型 | 说明 |
|--------|------|------|
| `.nb-select__trigger` | **必需** | 触发按钮，所有可点击交互的入口 |
| `.nb-select__value` | **必需** | 触发器内的当前值显示区域 |
| `.nb-select__icon` | **必需** | 下拉箭头，指示可展开状态 |
| `.nb-select__dropdown` | **必需** | 下拉面板，默认隐藏，展开时显示 |
| `.nb-select__option` | 条件必需 | 每个选项，至少一个；空列表时显示占位符 |
| `.nb-select__option-group` | 可选 | 选项分组（optgroup 等效） |
| `.nb-select__option-group-label` | 可选 | 分组标题，不可选 |
| `.nb-select__option-check` | 可选 | 选中标记，仅选中项显示 |
| `.nb-select__spinner` | 可选 | 异步加载时显示 |
| `.nb-select__clear` | 可选 | 清空已选值的按钮 |

### 2.4 ARIA 属性要求

| 元素 | 属性 | 值 | 说明 |
|------|------|-----|------|
| 根容器 | `aria-label` 或 `aria-labelledby` | 用户提供的标签 | 描述组件用途 |
| 触发器 | `role="combobox"` | 固定 | 标识为组合框控件 |
| 触发器 | `aria-expanded` | `"true"` / `"false"` | 展开/收起状态 |
| 触发器 | `aria-haspopup="listbox"` | 固定 | 指示弹出 listbox |
| 触发器 | `aria-controls` | 对应 dropdown id | 关联下拉面板 |
| 触发器 | `aria-activedescendant` | 当前选项 id | 键盘导航时指向当前选项 |
| 触发器 | `aria-disabled` | `"true"`（禁用态） | 禁用状态 |
| 触发器 | `aria-invalid` | `"true"`（无效态） | 表单验证失败 |
| 触发器 | `aria-busy` | `"true"`（加载态） | 异步加载中 |
| 下拉面板 | `role="listbox"` | 固定 | 选项列表容器 |
| 下拉面板 | `aria-label` | 描述选项列表 | 与 trigger 的 label 不同 |
| 选项 | `role="option"` | 固定 | 每个可选项 |
| 选项 | `aria-selected` | `"true"` / `"false"` | 选中状态 |
| 选项 | `id` | 唯一标识 | 用于 `aria-activedescendant` |
| 分组 | `role="group"` | 固定 | 选项分组 |
| 分组 | `aria-label` | 分组名称 | 描述分组内容 |

### 2.5 键盘行为

| 按键 | 状态 | 行为 |
|------|------|------|
| `Tab` | 聚焦触发器 | 将焦点移至触发器，按 Tab 顺序；若面板已展开则关闭面板后转移焦点 |
| `Enter` / `Space` | 触发器聚焦 | 展开/收起下拉面板；若面板已展开，选中当前高亮选项并关闭面板 |
| `Escape` | 面板展开 | 关闭下拉面板，焦点返回触发器 |
| `ArrowDown` / `ArrowUp` | 面板展开 | 在选项间上下移动焦点，更新 `aria-activedescendant` |
| `ArrowDown` / `ArrowUp` | 面板收起 | 展开面板并移动焦点至第一个/最后一个选项 |
| `Home` | 面板展开 | 焦点移至第一个选项 |
| `End` | 面板展开 | 焦点移至最后一个选项 |
| `PageUp` / `PageDown` | 面板展开 | 向上/向下滚动 5 个选项（可配置） |
| `ArrowRight` / `ArrowLeft` | 面板展开 | 若存在分组，可切换分组（可选实现） |
| `Tab` | 面板展开 | 关闭面板，焦点移至下一个 Tab 可聚焦元素（不选当前高亮选项） |
| `Enter` / `Space` | 选项聚焦 | 选中该选项，关闭面板，焦点返回触发器 |
| `Alphanumeric` | 任意状态 | 触发快速搜索：跳转到匹配的选项（如按 `C` 跳转至"中国"） |
| `Backspace` / `Delete` | 有清空按钮时 | 清空当前选中值（仅当有 `nb-select--clearable` 模式） |

---

## 3. 尺寸与变体

### 3.1 尺寸规格

Select 属于 Field 类别，所有尺寸基于 `--nb-density-*` 体系构建。触发器（`.nb-select__trigger`）必须保持最小可点击区域 ≥ 44×44px。

| 尺寸 | 类名 | 高度（min-height） | 左右 Padding | 字体大小 | 图标尺寸 | 面板最大高度 | 适用场景 |
|------|------|-------------------|-------------|----------|----------|-------------|----------|
| **xs** | `.nb-select--xs` | 1.75rem (28px) | 0.5rem (8px) | 0.75rem (12px) | 10px | 12rem | 极紧凑表格、数据仪表盘 |
| **sm** | `.nb-select--sm` | 2rem (32px) | 0.625rem (10px) | 0.8125rem (13px) | 11px | 14rem | 紧凑表单、工具栏 |
| **md** | `.nb-select--md`（默认） | 2.5rem (40px) | 0.75rem (12px) | 0.875rem (14px) | 12px | 16rem | 标准表单、通用场景 |
| **lg** | `.nb-select--lg` | 3rem (48px) | 1rem (16px) | 1rem (16px) | 14px | 18rem | 营销页、移动端优先表单 |
| **xl** | `.nb-select--xl` | 3.5rem (56px) | 1.25rem (20px) | 1.125rem (18px) | 16px | 20rem | 超大展示、Hero 区域 |

#### 尺寸 CSS 实现

```css
/* 基础尺寸（md 默认） */
.nb-select__trigger {
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  padding-inline-end: 2.5rem; /* 为箭头预留空间 */
  font-size: 0.875rem;
  line-height: 1.25;
}

.nb-select__icon {
  position: absolute;
  inset-inline-end: 0.75rem;
  inset-block-start: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  pointer-events: none;
  transition: transform var(--nb-duration-fast) var(--nb-ease-standard);
}

/* 展开时箭头旋转 */
.nb-select[data-state="open"] .nb-select__icon {
  transform: translateY(-50%) rotate(180deg);
}

/* 尺寸变体 */
.nb-select--xs .nb-select__trigger {
  min-height: 1.75rem;
  padding: 0.25rem 0.5rem;
  padding-inline-end: 2rem;
  font-size: 0.75rem;
}
.nb-select--xs .nb-select__icon { width: 10px; height: 10px; }

.nb-select--sm .nb-select__trigger {
  min-height: 2rem;
  padding: 0.375rem 0.625rem;
  padding-inline-end: 2.25rem;
  font-size: 0.8125rem;
}
.nb-select--sm .nb-select__icon { width: 11px; height: 11px; }

.nb-select--lg .nb-select__trigger {
  min-height: 3rem;
  padding: 0.75rem 1rem;
  padding-inline-end: 3rem;
  font-size: 1rem;
}
.nb-select--lg .nb-select__icon { width: 14px; height: 14px; inset-inline-end: 1rem; }

.nb-select--xl .nb-select__trigger {
  min-height: 3.5rem;
  padding: 1rem 1.25rem;
  padding-inline-end: 3.5rem;
  font-size: 1.125rem;
}
.nb-select--xl .nb-select__icon { width: 16px; height: 16px; inset-inline-end: 1.25rem; }
```

### 3.2 颜色变体

| 变体 | 类名 | 背景色 | 文本色 | 边框色 | 面板背景 | 选中项背景 | 选中项文本色 |
|------|------|--------|--------|--------|----------|------------|-------------|
| **Default**（默认） | 无后缀 | `--nb-base-100` | `--nb-base-content` | `var(--nb-border-field-color)` | `--nb-base-100` | `--nb-primary` | `--nb-primary-content` |
| **Primary** | `.nb-select--primary` | `--nb-primary` | `--nb-primary-content` | `color-mix(in oklch, var(--nb-primary-content) 20%, transparent)` | `--nb-base-100` | `--nb-primary` | `--nb-primary-content` |
| **Secondary** | `.nb-select--secondary` | `--nb-secondary` | `--nb-secondary-content` | `color-mix(in oklch, var(--nb-secondary-content) 20%, transparent)` | `--nb-base-100` | `--nb-secondary` | `--nb-secondary-content` |
| **Neutral** | `.nb-select--neutral` | `--nb-base-200` | `--nb-base-content` | `var(--nb-border-field-color)` | `--nb-base-100` | `--nb-neutral` | `--nb-neutral-content` |
| **Error** | `.nb-select--error` | `--nb-error` | `--nb-error-content` | `color-mix(in oklch, var(--nb-error-content) 20%, transparent)` | `--nb-base-100` | `--nb-error` | `--nb-error-content` |
| **Success** | `.nb-select--success` | `--nb-success` | `--nb-success-content` | `color-mix(in oklch, var(--nb-success-content) 20%, transparent)` | `--nb-base-100` | `--nb-success` | `--nb-success-content` |

#### 颜色变体 CSS 规则

```css
/* 颜色变体：通过 CSS 自定义属性作用域实现 */
.nb-select--primary {
  --nb-select-bg: var(--nb-primary);
  --nb-select-color: var(--nb-primary-content);
  --nb-select-border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  --nb-select-hover-bg: color-mix(in oklch, var(--nb-primary) 90%, black);
  --nb-select-active-bg: color-mix(in oklch, var(--nb-primary) 80%, black);
}

.nb-select--secondary {
  --nb-select-bg: var(--nb-secondary);
  --nb-select-color: var(--nb-secondary-content);
  --nb-select-border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
  --nb-select-hover-bg: color-mix(in oklch, var(--nb-secondary) 90%, black);
  --nb-select-active-bg: color-mix(in oklch, var(--nb-secondary) 80%, black);
}

.nb-select--neutral {
  --nb-select-bg: var(--nb-base-200);
  --nb-select-color: var(--nb-base-content);
  --nb-select-border-color: var(--nb-border-field-color);
  --nb-select-hover-bg: var(--nb-base-300);
  --nb-select-active-bg: color-mix(in oklch, var(--nb-base-300) 90%, black);
}

.nb-select--error {
  --nb-select-bg: var(--nb-error);
  --nb-select-color: var(--nb-error-content);
  --nb-select-border-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
  --nb-select-hover-bg: color-mix(in oklch, var(--nb-error) 90%, black);
  --nb-select-active-bg: color-mix(in oklch, var(--nb-error) 80%, black);
}

.nb-select--success {
  --nb-select-bg: var(--nb-success);
  --nb-select-color: var(--nb-success-content);
  --nb-select-border-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
  --nb-select-hover-bg: color-mix(in oklch, var(--nb-success) 90%, black);
  --nb-select-active-bg: color-mix(in oklch, var(--nb-success) 80%, black);
}

/* 默认变体（未指定颜色变体时的 fallback） */
.nb-select {
  --nb-select-bg: var(--nb-base-100);
  --nb-select-color: var(--nb-base-content);
  --nb-select-border-color: var(--nb-border-field-color);
  --nb-select-hover-bg: var(--nb-base-200);
  --nb-select-active-bg: var(--nb-base-300);
}

/* 应用变量到触发器 */
.nb-select__trigger {
  background-color: var(--nb-select-bg);
  color: var(--nb-select-color);
  border: var(--nb-border-field) solid var(--nb-select-border-color);
}
```

### 3.3 外观变体

| 变体 | 类名 | 说明 | 背景 | 边框 |
|------|------|------|------|------|
| **Solid**（默认） | 无后缀 | 实心背景，标准边框 | 对应颜色变体背景 | 对应颜色变体边框 |
| **Outline** | `.nb-select--outline` | 透明背景，有色边框 | `transparent` | 使用颜色变体色 |
| **Ghost** | `.nb-select--ghost` | 透明背景，无边框，无阴影 | `transparent` | `transparent` |
| **Link** | `.nb-select--link` | 类文本样式，用于低优先级选择 | `transparent` | `transparent` 或底部细线 |

#### 外观变体 CSS 规则

```css
/* Outline 变体：透明背景，有色边框 */
.nb-select--outline .nb-select__trigger {
  background-color: transparent;
  border-color: var(--nb-select-bg); /* 使用颜色变体的背景色作为边框色 */
  color: var(--nb-select-bg); /* 文本使用对应色 */
  box-shadow: none;
}

.nb-select--outline .nb-select__trigger:hover {
  background-color: color-mix(in oklch, var(--nb-select-bg) 8%, transparent);
}

.nb-select--outline .nb-select__trigger:active {
  background-color: color-mix(in oklch, var(--nb-select-bg) 15%, transparent);
}

/* Ghost 变体：透明背景，无边框，无阴影 */
.nb-select--ghost .nb-select__trigger {
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
}

.nb-select--ghost .nb-select__trigger:hover {
  background-color: var(--nb-base-200);
  border-color: var(--nb-base-200);
}

.nb-select--ghost .nb-select__trigger:active {
  background-color: var(--nb-base-300);
  border-color: var(--nb-base-300);
}

/* Link 变体：类文本样式 */
.nb-select--link .nb-select__trigger {
  background-color: transparent;
  border-color: transparent;
  border-bottom: 2px solid var(--nb-border-field-color);
  box-shadow: none;
  padding-inline: 0;
  border-radius: 0;
}

.nb-select--link .nb-select__trigger:hover {
  border-bottom-color: var(--nb-primary);
  background-color: transparent;
}

.nb-select--link .nb-select__trigger:active {
  border-bottom-color: color-mix(in oklch, var(--nb-primary) 80%, black);
  transform: none; /* Link 变体不做位移 */
}
```

### 3.4 布局变体

| 变体 | 类名 | 说明 |
|------|------|------|
| **Full Width** | `.nb-select--full-width` | 触发器宽度占满父容器（`width: 100%`） |
| **Compact Density** | `.nb-select--compact` | 使用 `--nb-density-compact-padding` 和 `--nb-density-compact-gap` |
| **Comfortable Density** | `.nb-select--comfortable` | 使用 `--nb-density-comfortable-padding` 和 `--nb-density-comfortable-gap` |

```css
/* 全宽变体 */
.nb-select--full-width,
.nb-select--full-width .nb-select__trigger {
  width: 100%;
}

/* 密度变体 */
.nb-select--compact .nb-select__dropdown {
  --nb-dropdown-padding: var(--nb-density-compact-padding);
  --nb-dropdown-gap: var(--nb-density-compact-gap);
}

.nb-select--comfortable .nb-select__dropdown {
  --nb-dropdown-padding: var(--nb-density-comfortable-padding);
  --nb-dropdown-gap: var(--nb-density-comfortable-gap);
}
```

---

## 4. 状态矩阵

Select 组件包含触发器（`.nb-select__trigger`）和下拉面板的多个交互状态。以下状态矩阵以触发器为主体，面板状态单独标注。

### 4.1 触发器状态矩阵

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 光标 | 适用性 |
|------|------|------|------|------|--------|------|------|--------|
| **Default** | 2px solid `var(--nb-select-border-color)` | `--nb-shadow-sm` | none | `var(--nb-select-bg)` / `var(--nb-select-color)` | 1.0 | — | `pointer` | ✅ 适用 |
| **Hover** | 2px solid `color-mix(in oklch, var(--nb-select-border-color) 80%, var(--nb-base-100))` | `--nb-shadow-md` | `translate(-2px, -2px)` | 背景微变 | 1.0 | 150ms brutal | `pointer` | ✅ 适用 |
| **Active / Pressed** | 2px solid `color-mix(in oklch, var(--nb-select-border-color) 120%, var(--nb-base-300))` | `--nb-shadow-none` | `translate(2px, 2px)` | 背景微变 | 1.0 | 150ms brutal | `pointer` | ✅ 适用 |
| **Focus Visible** | 不变 | 不变 | none | 不变 | 1.0 | 100ms standard | `default` | ✅ 适用 |
| **Disabled** | 变淡 50% | none | none | 变淡 50% | 0.5 | instant | `not-allowed` | ✅ 适用 |
| **Loading / Busy** | 不变 | 不变 | none | 内容替换为 spinner | 1.0 | loading 动画 | `wait` | ✅ 适用 |
| **Invalid** | `--nb-error` 2px + `border-inline-start-width: 3px` | 可选 `--nb-shadow-error` | none | 微红底色 | 1.0 | 100ms standard | `default` | ✅ 适用 |
| **Valid** | `--nb-success` 2px | 不变 | none | 微绿底色（可选） | 1.0 | 100ms standard | `default` | ✅ 适用 |
| **Selected / Checked** | 触发器本身不适用 | — | — | — | — | — | — | ❌ N/A（由触发器内 `.nb-select__value` 显示值表示） |
| **Open / Expanded** | 不变 | 不变 | none | 触发器背景不变 | 1.0 | 面板展开 150ms | `pointer` | ✅ 适用 |
| **Readonly** | 变淡 50% | `xs` / none | none | 不变 | 1.0 | instant | `default` | ✅ 适用 |

### 4.2 下拉面板状态矩阵

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 说明 |
|------|------|------|------|------|--------|------|------|
| **Closed** | 无 | 无 | — | 无 | 0 | — | 隐藏，不占空间（`display: none` 或 `hidden` 属性） |
| **Opening** | 2px solid `var(--nb-border-overlay-color)` | `--nb-shadow-lg` | `translateY(-4px)` → `translateY(0)` | `--nb-base-100` | 0 → 1 | 150ms ease-out | 从上方展开进入 |
| **Open** | 2px solid `var(--nb-border-overlay-color)` | `--nb-shadow-lg` | none | `--nb-base-100` | 1.0 | — | 完全展开，可交互 |
| **Option Hover** | 无 | 无 | none | `var(--nb-base-200)` | 1.0 | 100ms standard | 选项背景高亮 |
| **Option Selected** | 无 | `sm` | none | `var(--nb-primary)` / `var(--nb-primary-content)` | 1.0 | 100ms standard | 选中项背景变为 primary |
| **Option Focused** | 2px solid `var(--nb-focus)`（outline） | 无 | none | 不变 | 1.0 | instant | `outline: 2px solid var(--nb-focus); outline-offset: -2px` |
| **Closing** | 2px solid `var(--nb-border-overlay-color)` | `--nb-shadow-md` | `translateY(0)` → `translateY(-4px)` | `--nb-base-100` | 1 → 0 | 100ms ease-in | 收起，向 trigger 方向收缩 |

### 4.3 状态冲突优先级

当多个状态同时出现时，按以下优先级（从高到低）应用：

1. **Loading** → 覆盖 Hover、Active、Focus
2. **Disabled** → 覆盖 Hover、Active、Focus，但不覆盖 Loading（Loading 先判断）
3. **Invalid** → 覆盖 Default，Hover 和 Active 仍需生效但保持错误边框色
4. **Open** → 覆盖 Default，不影响 Hover/Active（可组合）
5. **Active** → 覆盖 Hover 和 Default
6. **Hover** → 覆盖 Default
7. **Focus Visible** → 与 Hover、Open 可共存
8. **Default** → 基准状态

```css
/* 高优先级覆盖：Loading + Disabled */
.nb-select__trigger[aria-busy="true"],
.nb-select__trigger:disabled,
.nb-select__trigger[aria-disabled="true"] {
  opacity: 0.5;
  box-shadow: var(--nb-shadow-none);
  transform: none;
  cursor: not-allowed;
  pointer-events: none;
}

/* 组合状态：Invalid + Hover */
.nb-select__trigger[aria-invalid="true"]:hover {
  border-color: var(--nb-error);
  box-shadow: var(--nb-shadow-md);
  transform: translate(-2px, -2px);
}

/* 组合状态：Open + Focus */
.nb-select[data-state="open"] .nb-select__trigger:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}
```

---

## 5. 阴影与位移规则

### 5.1 触发器阴影阶梯

Select 触发器属于 Field 类别，默认阴影小于 Button（Input 使用 `sm`，Select 跟随 Input 一致）。

| 状态 | 阴影 Token | 阴影值 | 使用说明 |
|------|-----------|--------|----------|
| **Default** | `--nb-shadow-sm` | `2px 2px 0 var(--nb-shadow-color)` | 小型组件默认，比 Button 低调（Select 是字段，不是按钮） |
| **Hover** | `--nb-shadow-md` | `4px 4px 0 var(--nb-shadow-color)` | 阴影升一级，从 `sm` 到 `md` |
| **Active** | `--nb-shadow-none` | `0px 0px 0` | 阴影归零 |
| **Open** | `--nb-shadow-sm` | 不变 | 面板展开时 trigger 阴影不变，不抢夺面板焦点 |
| **Disabled** | `--nb-shadow-none` | 无阴影 | 完全移除深度 |
| **Readonly** | `--nb-shadow-none` 或 `xs` | 无或极小阴影 | 不可编辑状态，降低视觉重量 |

### 5.2 位移公式

Select 触发器默认阴影为 `sm (2px 2px)`，遵循通用位移公式：

```
Hover 位移 = -(hover_shadow - default_shadow) = -(4px - 2px) = -2px → translate(-2px, -2px)
Active 位移 = default_shadow_offset = 2px → translate(2px, 2px)
```

| 状态 | transform | 说明 |
|------|-----------|------|
| **Default** | `translate(0, 0)` | 无位移 |
| **Hover** | `translate(-2px, -2px)` | 向左上位移，反方向补偿阴影增量 |
| **Active** | `translate(2px, 2px)` | 向右下位移，等于默认阴影偏移量，形成"按下"感 |
| **Disabled** | `none` | 无位移，无阴影 |

### 5.3 下拉面板阴影

下拉面板属于 Overlay 类别，使用更大的阴影以表示层级提升：

| 状态 | 阴影 Token | 阴影值 | 说明 |
|------|-----------|--------|------|
| **Open** | `--nb-shadow-lg` | `6px 6px 0 var(--nb-shadow-color)` | 面板浮于 trigger 之上，需更强阴影 |
| **Closing** | `--nb-shadow-md` | `4px 4px 0 var(--nb-shadow-color)` | 收起时阴影略小 |
| **Option Hover** | 无 | — | 选项不使用阴影，仅用背景色 |

### 5.4 过渡定义

```css
.nb-select__trigger {
  transition:
    transform var(--nb-duration-normal) var(--nb-easing-standard),
    box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
    border-color var(--nb-duration-fast) var(--nb-easing-standard),
    background-color var(--nb-duration-fast) var(--nb-easing-standard);
  will-change: transform, box-shadow;
}

.nb-select__dropdown {
  transition:
    opacity var(--nb-duration-fast) var(--nb-easing-standard),
    transform var(--nb-duration-fast) var(--nb-easing-standard);
}

.nb-select__option {
  transition: background-color var(--nb-duration-fast) var(--nb-easing-standard);
}

.nb-select__icon {
  transition: transform var(--nb-duration-fast) var(--nb-easing-standard);
}
```

### 5.5 触摸设备策略

```css
/* 默认：所有设备都有 Active 反馈 */
.nb-select__trigger:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(2px, 2px);
  transition-duration: 100ms;
}

/* 桌面端增强：Hover 提升 */
@media (hover: hover) and (pointer: fine) {
  .nb-select__trigger:hover {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  .nb-select__trigger:hover:active {
    box-shadow: var(--nb-shadow-none);
    transform: translate(2px, 2px);
  }
}

/* 触摸端：禁用 Hover 样式，避免 sticky hover 问题 */
@media (hover: none) and (pointer: coarse) {
  .nb-select__trigger:hover {
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
    transform: none;
  }
}

/* 移除浏览器默认触摸高亮 */
.nb-select__trigger {
  -webkit-tap-highlight-color: transparent;
}
```

### 5.6 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-select__trigger,
  .nb-select__trigger:hover,
  .nb-select__trigger:active {
    transform: none !important;
    transition: none;
  }

  .nb-select__trigger:hover {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-select__trigger:active {
    box-shadow: var(--nb-shadow-none);
  }

  .nb-select__dropdown,
  .nb-select__icon {
    transition: none;
    transform: none !important;
  }

  .nb-select__icon {
    /* 箭头仍旋转，但无动画 */
    transition: none;
  }
}
```

---

## 6. 圆角与边框

### 6.1 圆角规则

Select 属于 **Field 类别**，默认使用直角。

| 元素 | 圆角 Token | 值 | 说明 |
|------|-----------|-----|------|
| 触发器 `.nb-select__trigger` | `--nb-radius-field` | `0px` | 标准直角 |
| 下拉面板 `.nb-select__dropdown` | `--nb-radius-overlay` | `0px` | 标准直角 |
| 选项 `.nb-select__option` | `--nb-radius-field` | `0px` | 标准直角 |
| 选项分组标题 `.nb-select__option-group-label` | `--nb-radius-field` | `0px` | 标准直角 |
| 清空按钮 `.nb-select__clear` | `--nb-radius-field` | `0px` | 标准直角 |

> **无圆角例外**：Select 组件没有任何功能性理由需要圆角。所有子元素均为直角，保持 Neo-Brutalism 的硬朗风格。

### 6.2 边框规则

| 元素 | 边框宽度 | 边框样式 | 边框颜色 | 说明 |
|------|----------|----------|--------|------|
| 触发器 | `var(--nb-border-field)` = 2px | `solid` | `var(--nb-select-border-color)` | 动态计算，通过 color-mix |
| 下拉面板 | `var(--nb-border-overlay)` = 2px | `solid` | `var(--nb-border-overlay-color)` | Overlay 类别边框 |
| 选项 | 无 | — | — | 选项之间使用背景色区分，不使用边框分隔 |
| 选项分组标题 | 无底部边框 | — | — | 分组标题与选项之间使用 2px 分割线（`border-bottom`） |
| 分组分割线 | 2px | `solid` | `var(--nb-border-overlay-color)` | 分隔不同分组 |

### 6.3 动态边框色计算

```css
/* 默认边框色：基于当前内容色的 20% 混合 */
.nb-select__trigger {
  border: 2px solid color-mix(in oklch, var(--nb-select-color, var(--nb-base-content)) 20%, transparent);
}

/* Hover 边框微调：加亮 */
.nb-select__trigger:hover {
  border-color: color-mix(in oklch, var(--nb-select-border-color) 80%, var(--nb-base-100));
}

/* Active 边框微调：加深 */
.nb-select__trigger:active {
  border-color: color-mix(in oklch, var(--nb-select-border-color) 120%, var(--nb-base-300));
}

/* Invalid 状态：使用错误色 */
.nb-select__trigger[aria-invalid="true"] {
  border: 2px solid var(--nb-error);
  border-inline-start-width: 3px; /* 左侧 3px 强调 */
}

/* Valid 状态 */
.nb-select__trigger[aria-invalid="false"]:not(:placeholder-shown) {
  border: 2px solid var(--nb-success);
}

/* Disabled 边框：变淡 */
.nb-select__trigger:disabled,
.nb-select__trigger[aria-disabled="true"] {
  border-color: color-mix(in oklch, var(--nb-select-border-color) 50%, transparent);
}

/* Readonly 边框：变淡 */
.nb-select__trigger[readonly] {
  border-color: color-mix(in oklch, var(--nb-select-border-color) 50%, transparent);
}
```

### 6.4 下拉面板边框与位置

```css
.nb-select__dropdown {
  border: 2px solid var(--nb-border-overlay-color);
  border-radius: var(--nb-radius-overlay); /* 0px */
  /* 面板顶部与触发器底部对齐，无缝衔接 */
  margin-block-start: 0;
  /* 面板宽度与触发器一致 */
  min-width: 100%;
}

/* 当面板位于触发器上方时（上方空间不足） */
.nb-select__dropdown[data-placement="top"] {
  margin-block-end: 0;
  margin-block-start: 0;
}
```

---

## 7. 颜色策略

### 7.1 语义颜色 Token 使用规则

| 属性 | Token | 使用位置 | 说明 |
|------|-------|----------|------|
| 触发器背景 | `--nb-base-100` / 变体色 | `.nb-select__trigger` | Default 使用 `--nb-base-100`，颜色变体使用对应语义色 |
| 触发器文本 | `--nb-base-content` / `--nb-primary-content` | `.nb-select__trigger` | 与背景形成对比 |
| 触发器边框 | `color-mix(in oklch, ...)` | `.nb-select__trigger` | 动态计算，不硬编码 |
| 面板背景 | `--nb-base-100` | `.nb-select__dropdown` | 始终使用页面底层色，保证可读性 |
| 面板文本 | `--nb-base-content` | `.nb-select__option` | 选项文本色 |
| 选项 Hover 背景 | `--nb-base-200` | `.nb-select__option:hover` | 普通表面层级 |
| 选项 Selected 背景 | `--nb-primary` | `.nb-select__option[aria-selected="true"]` | 主色填充 |
| 选项 Selected 文本 | `--nb-primary-content` | `.nb-select__option[aria-selected="true"]` | 主色对比色 |
| 分组标题文本 | `color-mix(in oklch, var(--nb-base-content) 60%, transparent)` | `.nb-select__option-group-label` | 次要文本色 |
| 分组标题背景 | `--nb-base-200` | `.nb-select__option-group-label` | 普通表面层级 |
| 焦点色 | `--nb-focus` | `focus-visible` outline | 高对比亮蓝/亮黄 |
| 错误色 | `--nb-error` | Invalid 状态 | 错误指示 |
| 成功色 | `--nb-success` | Valid 状态 | 成功指示 |

### 7.2 禁止硬编码颜色

```css
/* ❌ 错误：硬编码颜色 */
.nb-select__trigger {
  border: 2px solid #000000;
  background: #ffffff;
  color: #000000;
}

/* ✅ 正确：使用语义 Token */
.nb-select__trigger {
  border: 2px solid var(--nb-border-field-color);
  background: var(--nb-select-bg, var(--nb-base-100));
  color: var(--nb-select-color, var(--nb-base-content));
}

/* ❌ 错误：直接写 oklch 无 Token 包裹 */
.nb-select__trigger {
  background: oklch(70% 0.15 250);
}

/* ✅ 正确：通过 CSS 变量引用 */
.nb-select__trigger {
  background: var(--nb-primary); /* 变量内部可以是 oklch，但组件层面只引用变量 */
}
```

### 7.3 各变体完整颜色规则

```css
/* ============================================
   Default 变体（无后缀）
   ============================================ */
.nb-select__trigger {
  background-color: var(--nb-base-100);
  color: var(--nb-base-content);
  border-color: var(--nb-border-field-color);
}

.nb-select__trigger:hover {
  background-color: var(--nb-base-200);
  border-color: color-mix(in oklch, var(--nb-border-field-color) 80%, var(--nb-base-100));
}

.nb-select__trigger:active {
  background-color: var(--nb-base-300);
  border-color: color-mix(in oklch, var(--nb-border-field-color) 120%, var(--nb-base-300));
}

/* ============================================
   Primary 变体
   ============================================ */
.nb-select--primary .nb-select__trigger {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
}

.nb-select--primary .nb-select__trigger:hover {
  background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
  border-color: color-mix(in oklch, var(--nb-primary-content) 30%, transparent);
}

.nb-select--primary .nb-select__trigger:active {
  background-color: color-mix(in oklch, var(--nb-primary) 80%, black);
  border-color: color-mix(in oklch, var(--nb-primary-content) 40%, transparent);
}

/* ============================================
   Secondary 变体
   ============================================ */
.nb-select--secondary .nb-select__trigger {
  background-color: var(--nb-secondary);
  color: var(--nb-secondary-content);
  border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
}

.nb-select--secondary .nb-select__trigger:hover {
  background-color: color-mix(in oklch, var(--nb-secondary) 90%, black);
}

.nb-select--secondary .nb-select__trigger:active {
  background-color: color-mix(in oklch, var(--nb-secondary) 80%, black);
}

/* ============================================
   Neutral 变体
   ============================================ */
.nb-select--neutral .nb-select__trigger {
  background-color: var(--nb-base-200);
  color: var(--nb-base-content);
  border-color: var(--nb-border-field-color);
}

.nb-select--neutral .nb-select__trigger:hover {
  background-color: var(--nb-base-300);
}

.nb-select--neutral .nb-select__trigger:active {
  background-color: color-mix(in oklch, var(--nb-base-300) 90%, black);
}

/* ============================================
   Error 变体（通常用于强调状态，不常用作主色）
   ============================================ */
.nb-select--error .nb-select__trigger {
  background-color: var(--nb-error);
  color: var(--nb-error-content);
  border-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
}

.nb-select--error .nb-select__trigger:hover {
  background-color: color-mix(in oklch, var(--nb-error) 90%, black);
}

/* ============================================
   Success 变体
   ============================================ */
.nb-select--success .nb-select__trigger {
  background-color: var(--nb-success);
  color: var(--nb-success-content);
  border-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
}

.nb-select--success .nb-select__trigger:hover {
  background-color: color-mix(in oklch, var(--nb-success) 90%, black);
}
```

### 7.4 下拉面板颜色

```css
.nb-select__dropdown {
  background-color: var(--nb-base-100);
  border-color: var(--nb-border-overlay-color);
}

.nb-select__option {
  color: var(--nb-base-content);
}

.nb-select__option:hover,
.nb-select__option[data-highlighted="true"] {
  background-color: var(--nb-base-200);
}

.nb-select__option[aria-selected="true"] {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
}

.nb-select__option-group-label {
  background-color: var(--nb-base-200);
  color: color-mix(in oklch, var(--nb-base-content) 60%, transparent);
  font-weight: var(--nb-weight-semibold);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: var(--nb-tracking-wide);
  padding: 0.5rem 0.75rem;
}

.nb-select__option-group + .nb-select__option-group {
  border-top: 2px solid var(--nb-border-overlay-color);
}
```

---

## 8. 可访问性要求

### 8.1 键盘可操作性

```
┌─────────────────────────────────────────────────────────────┐
│  Tab 顺序：                                                   │
│  1. 前一个可聚焦元素 → .nb-select__trigger → 下一个可聚焦元素   │
│  2. 面板展开时：Tab 离开 trigger 关闭面板，不选中高亮项         │
│  3. 面板展开时：Arrow 键在 option 间导航，不触发 Tab 顺序       │
│  4. 选中后：Enter/Space 关闭面板，焦点返回 trigger              │
└─────────────────────────────────────────────────────────────┘
```

- **触发器**必须可通过 `Tab` 键聚焦。
- **面板展开时** `Tab` 键不进入选项列表（与标准 `<select>` 行为不同），而是关闭面板并移至下一个 Tab 可聚焦元素。这是为了简化键盘导航并避免 Tab 陷阱。
- **Arrow 键**用于在选项间导航，使用 `aria-activedescendant` 模式（而非将焦点实际移至选项），保持焦点在 trigger 上。
- **Enter** 或 **Space** 选中当前高亮选项并关闭面板。
- **Escape** 始终关闭面板，焦点返回 trigger，不选中任何选项（除非已使用 Enter/Space 确认）。

### 8.2 Focus Visible 样式

```css
.nb-select__trigger:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  /* 不修改 transform 或 box-shadow，避免与 Hover 冲突 */
}

/* 当 Focus 与 Hover 同时发生 */
.nb-select__trigger:hover:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  transform: translate(-2px, -2px);
}

/* 面板内的选项焦点样式（使用 outline 内部） */
.nb-select__option:focus-visible,
.nb-select__option[data-highlighted="true"] {
  outline: 2px solid var(--nb-focus);
  outline-offset: -2px; /* 内嵌 outline，不破坏布局 */
  background-color: var(--nb-base-200);
}

.nb-select__option[aria-selected="true"]:focus-visible {
  outline-color: var(--nb-focus);
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
}
```

### 8.3 ARIA 属性完整映射

```html
<!-- 展开时 -->
<div class="nb-select" data-state="open">
  <button
    class="nb-select__trigger"
    type="button"
    role="combobox"
    aria-expanded="true"
    aria-haspopup="listbox"
    aria-controls="nb-select-dropdown-1"
    aria-activedescendant="nb-opt-2"
    aria-label="选择国家"
  >
    <span class="nb-select__value">日本</span>
    <span class="nb-select__icon" aria-hidden="true">...</span>
  </button>
  <div
    class="nb-select__dropdown"
    id="nb-select-dropdown-1"
    role="listbox"
    aria-label="国家选项"
  >
    <div class="nb-select__option" role="option" id="nb-opt-1" aria-selected="false">中国</div>
    <div class="nb-select__option" role="option" id="nb-opt-2" aria-selected="true">日本</div>
  </div>
</div>

<!-- 禁用时 -->
<div class="nb-select" data-state="closed">
  <button
    class="nb-select__trigger"
    type="button"
    disabled
    aria-disabled="true"
    aria-expanded="false"
    aria-haspopup="listbox"
  >
    <span class="nb-select__value">请选择</span>
  </button>
</div>

<!-- 无效时 -->
<div class="nb-select" data-state="closed">
  <button
    class="nb-select__trigger"
    type="button"
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-invalid="true"
    aria-describedby="nb-select-error-1"
  >
    <span class="nb-select__value">请选择</span>
  </button>
</div>
<p id="nb-select-error-1" class="nb-error-text" role="alert">请选择一个选项</p>
```

### 8.4 RTL 适配（逻辑属性）

所有与方向相关的属性必须使用逻辑属性，确保在 RTL 语言环境下正确渲染。

```css
.nb-select__trigger {
  padding-inline-start: 0.75rem;
  padding-inline-end: 2.5rem; /* 为箭头预留空间，RTL 自动翻转 */
  text-align: start; /* 代替 text-align: left */
}

.nb-select__icon {
  inset-inline-end: 0.75rem; /* 代替 right: 0.75rem */
  inset-block-start: 50%; /* 代替 top: 50% */
}

.nb-select__dropdown {
  inset-inline-start: 0; /* 代替 left: 0 */
}

.nb-select__trigger[aria-invalid="true"] {
  border-inline-start-width: 3px; /* 代替 border-left-width: 3px */
  border-inline-start-color: var(--nb-error); /* 代替 border-left-color */
}

.nb-select__option {
  padding-inline: 0.75rem; /* 代替 padding-left/right */
  padding-block: 0.5rem; /* 代替 padding-top/bottom */
}

.nb-select__option-group-label {
  padding-inline: 0.75rem;
  padding-block: 0.5rem;
}

/* 面板位置：RTL 时自动翻转 */
.nb-select__dropdown {
  /* 使用 inset 逻辑属性 */
  inset-inline: 0 auto; /* 默认 left: 0, right: auto */
}

/* 选项选中标记位置 */
.nb-select__option-check {
  margin-inline-start: auto; /* 代替 margin-left: auto */
  margin-inline-end: 0;
}
```

### 8.5 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-select__trigger,
  .nb-select__trigger:hover,
  .nb-select__trigger:active,
  .nb-select__dropdown,
  .nb-select__icon,
  .nb-select__option {
    transition: none !important;
    transform: none !important;
  }

  .nb-select__trigger:hover {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-select__trigger:active {
    box-shadow: var(--nb-shadow-none);
  }

  .nb-select__dropdown {
    /* 面板显示/隐藏使用即时切换，不使用动画 */
    animation: none;
  }

  .nb-select__icon {
    /* 箭头方向切换即时生效 */
    transition: none;
  }
}
```

### 8.6 forced-colors（高对比度模式）

```css
@media (forced-colors: active) {
  .nb-select__trigger {
    border: 2px solid currentColor;
    /* 强制颜色模式下，边框使用 currentColor 保证可见 */
  }

  .nb-select__trigger:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .nb-select__dropdown {
    border: 2px solid currentColor;
  }

  .nb-select__option:hover,
  .nb-select__option[data-highlighted="true"] {
    /* 高对比度模式使用系统高亮色 */
    background-color: Highlight;
    color: HighlightText;
    forced-color-adjust: none; /* 允许覆盖系统颜色 */
  }

  .nb-select__option[aria-selected="true"] {
    background-color: Highlight;
    color: HighlightText;
    forced-color-adjust: none;
  }

  /* 阴影在高对比度模式下不可见，使用边框替代 */
  .nb-select__trigger,
  .nb-select__dropdown {
    box-shadow: none;
  }

  .nb-select__trigger:hover {
    transform: none; /* 高对比度下禁用位移，避免视觉混乱 */
  }

  .nb-select__trigger:active {
    transform: none;
  }
}
```

### 8.7 320px 移动端可用性

```css
/* 最小视口 320px 适配 */
@media (max-width: 320px) {
  .nb-select__trigger {
    min-height: 2.75rem; /* 保证 44px 最小触摸目标 */
    padding-inline: 0.5rem;
    padding-inline-end: 2rem;
  }

  .nb-select__dropdown {
    /* 面板在极小屏幕上使用全宽 */
    position: fixed;
    inset-inline: 0.5rem;
    inset-block-start: auto;
    inset-block-end: 0;
    max-height: 60vh;
    border-radius: 0; /* 保持直角 */
  }

  .nb-select__option {
    padding-block: 0.75rem; /* 增大选项点击区域 */
  }
}

/* 200% 缩放测试（约 960px 视口逻辑宽度） */
@media (max-width: 960px) {
  .nb-select__trigger {
    font-size: max(0.875rem, 16px); /* 保证最小 16px，避免 iOS 缩放 */
  }

  .nb-select__option {
    font-size: max(0.875rem, 16px);
  }
}
```

---

## 9. 完整 CSS 示例

### 9.1 核心 CSS（使用 `@layer` 和 CSS 变量）

```css
/* ============================================
   Neo-Brutal UI — Select Component
   ============================================ */

@layer nb.components.select {
  /* ---- 组件局部变量 ---- */
  .nb-select {
    --nb-select-bg: var(--nb-base-100);
    --nb-select-color: var(--nb-base-content);
    --nb-select-border-color: var(--nb-border-field-color);
    --nb-select-hover-bg: var(--nb-base-200);
    --nb-select-active-bg: var(--nb-base-300);

    position: relative;
    display: inline-block;
    vertical-align: middle;
    font-family: var(--nb-font-sans);
  }

  /* ---- 触发器 ---- */
  .nb-select__trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.5rem 0.75rem;
    padding-inline-end: 2.5rem;
    font-size: 0.875rem;
    font-weight: var(--nb-weight-normal);
    line-height: 1.25;
    color: var(--nb-select-color);
    background-color: var(--nb-select-bg);
    border: var(--nb-border-field) solid var(--nb-select-border-color);
    border-radius: var(--nb-radius-field); /* 0px */
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
    cursor: pointer;
    text-align: start;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    transition:
      transform var(--nb-duration-normal) var(--nb-easing-standard),
      box-shadow var(--nb-duration-normal) var(--nb-easing-standard),
      border-color var(--nb-duration-fast) var(--nb-easing-standard),
      background-color var(--nb-duration-fast) var(--nb-easing-standard);
    will-change: transform, box-shadow;

    -webkit-tap-highlight-color: transparent;
  }

  /* ---- 值显示区域 ---- */
  .nb-select__value {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nb-select__value:empty::before {
    content: attr(data-placeholder);
    color: color-mix(in oklch, var(--nb-select-color) 50%, transparent);
  }

  /* ---- 下拉箭头图标 ---- */
  .nb-select__icon {
    position: absolute;
    inset-inline-end: 0.75rem;
    inset-block-start: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    pointer-events: none;
    flex-shrink: 0;
    color: var(--nb-select-color);
    transition: transform var(--nb-duration-fast) var(--nb-easing-standard);
  }

  /* 面板展开时箭头旋转 */
  .nb-select[data-state="open"] .nb-select__icon {
    transform: translateY(-50%) rotate(180deg);
  }

  /* ---- Hover 状态 ---- */
  @media (hover: hover) and (pointer: fine) {
    .nb-select__trigger:hover {
      box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
      transform: translate(-2px, -2px);
      border-color: color-mix(in oklch, var(--nb-select-border-color) 80%, var(--nb-base-100));
      background-color: var(--nb-select-hover-bg);
    }
  }

  /* ---- Active / Pressed 状态 ---- */
  .nb-select__trigger:active,
  .nb-select__trigger[data-active="true"] {
    box-shadow: var(--nb-shadow-none);
    transform: translate(2px, 2px);
    border-color: color-mix(in oklch, var(--nb-select-border-color) 120%, var(--nb-base-300));
    background-color: var(--nb-select-active-bg);
  }

  /* 从 Hover 状态直接按下：无中间态 */
  .nb-select__trigger:hover:active {
    box-shadow: var(--nb-shadow-none);
    transform: translate(2px, 2px);
  }

  /* ---- Focus Visible 状态 ---- */
  .nb-select__trigger:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  .nb-select__trigger:hover:focus-visible {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  /* ---- Open 状态 ---- */
  .nb-select[data-state="open"] .nb-select__trigger {
    /* Open 时不改变 trigger 的阴影和位移，保持视觉稳定 */
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }

  /* ---- Disabled 状态 ---- */
  .nb-select__trigger:disabled,
  .nb-select__trigger[aria-disabled="true"] {
    opacity: 0.5;
    box-shadow: var(--nb-shadow-none);
    transform: none;
    border-color: color-mix(in oklch, var(--nb-select-border-color) 50%, transparent);
    background-color: color-mix(in oklch, var(--nb-select-bg) 50%, transparent);
    color: color-mix(in oklch, var(--nb-select-color) 50%, transparent);
    cursor: not-allowed;
    pointer-events: none;
  }

  .nb-select__trigger:disabled:hover,
  .nb-select__trigger[aria-disabled="true"]:hover {
    transform: none;
    box-shadow: var(--nb-shadow-none);
  }

  /* ---- Readonly 状态 ---- */
  .nb-select__trigger[readonly] {
    border-color: color-mix(in oklch, var(--nb-select-border-color) 50%, transparent);
    background-color: var(--nb-base-100);
    box-shadow: var(--nb-shadow-xs) var(--nb-shadow-color);
    cursor: default;
    pointer-events: none;
  }

  /* ---- Invalid 状态 ---- */
  .nb-select__trigger[aria-invalid="true"] {
    border: 2px solid var(--nb-error);
    border-inline-start-width: 3px;
    background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
  }

  .nb-select__trigger[aria-invalid="true"]:focus-visible {
    outline: 2px solid var(--nb-error);
  }

  .nb-select__trigger[aria-invalid="true"]:hover {
    border-color: var(--nb-error);
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-select__trigger[aria-invalid="true"]:active {
    border-color: color-mix(in oklch, var(--nb-error) 80%, black);
  }

  /* ---- Valid 状态 ---- */
  .nb-select__trigger[aria-invalid="false"] {
    border: 2px solid var(--nb-success);
  }

  .nb-select__trigger[aria-invalid="false"]:focus-visible {
    outline: 2px solid var(--nb-success);
  }

  /* ---- Loading 状态 ---- */
  .nb-select__trigger[aria-busy="true"] {
    position: relative;
    pointer-events: none;
    cursor: wait;
  }

  .nb-select__trigger[aria-busy="true"] .nb-select__value,
  .nb-select__trigger[aria-busy="true"] .nb-select__icon {
    visibility: hidden;
  }

  .nb-select__trigger[aria-busy="true"]::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    width: 1rem;
    height: 1rem;
    background-color: var(--nb-primary);
    border: 2px solid var(--nb-border);
    animation: nb-select-loading-pulse 1s var(--nb-ease-step) infinite;
    transform: translate(-50%, -50%);
  }

  @keyframes nb-select-loading-pulse {
    0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
  }

  /* ============================================
     下拉面板
     ============================================ */
  .nb-select__dropdown {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
    z-index: 40;
    min-width: 100%;
    max-height: 16rem;
    overflow: auto;
    margin-block-start: 0;
    padding: 0.25rem 0;
    background-color: var(--nb-base-100);
    border: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
    border-radius: var(--nb-radius-overlay); /* 0px */
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);

    /* 默认隐藏 */
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px);
    transition:
      opacity var(--nb-duration-fast) var(--nb-ease-standard),
      transform var(--nb-duration-fast) var(--nb-ease-standard),
      visibility var(--nb-duration-fast) var(--nb-ease-standard);
  }

  /* 面板展开 */
  .nb-select[data-state="open"] .nb-select__dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  /* 面板位于上方时 */
  .nb-select__dropdown[data-placement="top"] {
    inset-block-start: auto;
    inset-block-end: 100%;
    transform: translateY(4px);
  }

  .nb-select[data-state="open"] .nb-select__dropdown[data-placement="top"] {
    transform: translateY(0);
  }

  /* ============================================
     选项
     ============================================ */
  .nb-select__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25;
    color: var(--nb-base-content);
    cursor: pointer;
    transition: background-color var(--nb-duration-fast) var(--nb-ease-standard);
    text-align: start;
  }

  .nb-select__option:hover,
  .nb-select__option[data-highlighted="true"] {
    background-color: var(--nb-base-200);
  }

  .nb-select__option:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: -2px;
    background-color: var(--nb-base-200);
  }

  .nb-select__option[aria-selected="true"] {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }

  .nb-select__option[aria-selected="true"]:hover,
  .nb-select__option[aria-selected="true"][data-highlighted="true"] {
    background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
  }

  .nb-select__option[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* 选中标记 */
  .nb-select__option-check {
    display: none;
    flex-shrink: 0;
    font-weight: var(--nb-weight-bold);
  }

  .nb-select__option[aria-selected="true"] .nb-select__option-check {
    display: inline;
  }

  /* ============================================
     选项分组
     ============================================ */
  .nb-select__option-group-label {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: var(--nb-weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--nb-tracking-wide);
    color: color-mix(in oklch, var(--nb-base-content) 60%, transparent);
    background-color: var(--nb-base-200);
    pointer-events: none;
  }

  .nb-select__option-group + .nb-select__option-group {
    border-top: 2px solid var(--nb-border-overlay-color);
    margin-top: 0.25rem;
    padding-top: 0.25rem;
  }

  /* ============================================
     原生降级模式
     ============================================ */
  .nb-select--native {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .nb-select--native .nb-select__native {
    appearance: none;
    -webkit-appearance: none;
    display: block;
    width: 100%;
    min-height: 2.5rem;
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25;
    color: var(--nb-base-content);
    background-color: var(--nb-base-100);
    border: var(--nb-border-field) solid var(--nb-border-field-color);
    border-radius: var(--nb-radius-field);
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
    cursor: pointer;
    transition: border-color var(--nb-duration-fast) var(--nb-ease-standard),
                box-shadow var(--nb-duration-fast) var(--nb-ease-standard);
  }

  .nb-select--native .nb-select__native:hover {
    border-color: color-mix(in oklch, var(--nb-border-field-color) 80%, var(--nb-base-100));
  }

  .nb-select--native .nb-select__native:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
    border-color: var(--nb-primary);
  }

  .nb-select--native .nb-select__native:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--nb-base-200);
  }

  .nb-select--native .nb-select__icon {
    position: absolute;
    inset-inline-end: 0.75rem;
    inset-block-start: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  /* ============================================
     尺寸变体
     ============================================ */
  .nb-select--xs .nb-select__trigger {
    min-height: 1.75rem;
    padding: 0.25rem 0.5rem;
    padding-inline-end: 2rem;
    font-size: 0.75rem;
  }
  .nb-select--xs .nb-select__icon { width: 10px; height: 10px; inset-inline-end: 0.5rem; }
  .nb-select--xs .nb-select__dropdown { max-height: 12rem; }
  .nb-select--xs .nb-select__option { padding: 0.375rem 0.5rem; font-size: 0.75rem; }

  .nb-select--sm .nb-select__trigger {
    min-height: 2rem;
    padding: 0.375rem 0.625rem;
    padding-inline-end: 2.25rem;
    font-size: 0.8125rem;
  }
  .nb-select--sm .nb-select__icon { width: 11px; height: 11px; inset-inline-end: 0.625rem; }
  .nb-select--sm .nb-select__dropdown { max-height: 14rem; }
  .nb-select--sm .nb-select__option { padding: 0.4375rem 0.625rem; font-size: 0.8125rem; }

  .nb-select--lg .nb-select__trigger {
    min-height: 3rem;
    padding: 0.75rem 1rem;
    padding-inline-end: 3rem;
    font-size: 1rem;
  }
  .nb-select--lg .nb-select__icon { width: 14px; height: 14px; inset-inline-end: 1rem; }
  .nb-select--lg .nb-select__dropdown { max-height: 18rem; }
  .nb-select--lg .nb-select__option { padding: 0.75rem 1rem; font-size: 1rem; }

  .nb-select--xl .nb-select__trigger {
    min-height: 3.5rem;
    padding: 1rem 1.25rem;
    padding-inline-end: 3.5rem;
    font-size: 1.125rem;
  }
  .nb-select--xl .nb-select__icon { width: 16px; height: 16px; inset-inline-end: 1.25rem; }
  .nb-select--xl .nb-select__dropdown { max-height: 20rem; }
  .nb-select--xl .nb-select__option { padding: 1rem 1.25rem; font-size: 1.125rem; }

  /* ============================================
     布局变体
     ============================================ */
  .nb-select--full-width {
    display: flex;
    width: 100%;
  }
  .nb-select--full-width .nb-select__trigger {
    width: 100%;
  }

  /* ============================================
     密度变体
     ============================================ */
  .nb-select--compact .nb-select__dropdown {
    padding: 0.125rem 0;
  }
  .nb-select--compact .nb-select__option {
    padding-block: 0.375rem;
  }

  .nb-select--comfortable .nb-select__dropdown {
    padding: 0.5rem 0;
  }
  .nb-select--comfortable .nb-select__option {
    padding-block: 0.75rem;
  }

  /* ============================================
     颜色变体
     ============================================ */
  .nb-select--primary {
    --nb-select-bg: var(--nb-primary);
    --nb-select-color: var(--nb-primary-content);
    --nb-select-border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
    --nb-select-hover-bg: color-mix(in oklch, var(--nb-primary) 90%, black);
    --nb-select-active-bg: color-mix(in oklch, var(--nb-primary) 80%, black);
  }

  .nb-select--secondary {
    --nb-select-bg: var(--nb-secondary);
    --nb-select-color: var(--nb-secondary-content);
    --nb-select-border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
    --nb-select-hover-bg: color-mix(in oklch, var(--nb-secondary) 90%, black);
    --nb-select-active-bg: color-mix(in oklch, var(--nb-secondary) 80%, black);
  }

  .nb-select--neutral {
    --nb-select-bg: var(--nb-base-200);
    --nb-select-color: var(--nb-base-content);
    --nb-select-border-color: var(--nb-border-field-color);
    --nb-select-hover-bg: var(--nb-base-300);
    --nb-select-active-bg: color-mix(in oklch, var(--nb-base-300) 90%, black);
  }

  .nb-select--error {
    --nb-select-bg: var(--nb-error);
    --nb-select-color: var(--nb-error-content);
    --nb-select-border-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
    --nb-select-hover-bg: color-mix(in oklch, var(--nb-error) 90%, black);
    --nb-select-active-bg: color-mix(in oklch, var(--nb-error) 80%, black);
  }

  .nb-select--success {
    --nb-select-bg: var(--nb-success);
    --nb-select-color: var(--nb-success-content);
    --nb-select-border-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
    --nb-select-hover-bg: color-mix(in oklch, var(--nb-success) 90%, black);
    --nb-select-active-bg: color-mix(in oklch, var(--nb-success) 80%, black);
  }

  /* ============================================
     外观变体
     ============================================ */
  .nb-select--outline .nb-select__trigger {
    background-color: transparent;
    border-color: var(--nb-select-bg);
    color: var(--nb-select-bg);
    box-shadow: none;
  }
  .nb-select--outline .nb-select__trigger:hover {
    background-color: color-mix(in oklch, var(--nb-select-bg) 8%, transparent);
  }
  .nb-select--outline .nb-select__trigger:active {
    background-color: color-mix(in oklch, var(--nb-select-bg) 15%, transparent);
    transform: translate(1px, 1px); /* 小位移，因为无阴影 */
  }
  .nb-select--outline .nb-select__trigger[aria-busy="true"]::after {
    border-color: var(--nb-select-bg);
  }

  .nb-select--ghost .nb-select__trigger {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
  .nb-select--ghost .nb-select__trigger:hover {
    background-color: var(--nb-base-200);
    border-color: var(--nb-base-200);
  }
  .nb-select--ghost .nb-select__trigger:active {
    background-color: var(--nb-base-300);
    border-color: var(--nb-base-300);
  }

  .nb-select--link .nb-select__trigger {
    background-color: transparent;
    border-color: transparent;
    border-bottom: 2px solid var(--nb-border-field-color);
    box-shadow: none;
    padding-inline: 0;
    border-radius: 0;
  }
  .nb-select--link .nb-select__trigger:hover {
    border-bottom-color: var(--nb-primary);
    background-color: transparent;
    transform: none;
    box-shadow: none;
  }
  .nb-select--link .nb-select__trigger:active {
    border-bottom-color: color-mix(in oklch, var(--nb-primary) 80%, black);
    transform: none;
  }

  /* ============================================
     prefers-reduced-motion
     ============================================ */
  @media (prefers-reduced-motion: reduce) {
    .nb-select__trigger,
    .nb-select__trigger:hover,
    .nb-select__trigger:active,
    .nb-select__dropdown,
    .nb-select__icon,
    .nb-select__option {
      transition: none !important;
      transform: none !important;
    }

    .nb-select__trigger:hover {
      box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    }

    .nb-select__trigger:active {
      box-shadow: var(--nb-shadow-none);
    }

    .nb-select[data-state="open"] .nb-select__dropdown {
      transform: translateY(0);
    }
  }

  /* ============================================
     forced-colors
     ============================================ */
  @media (forced-colors: active) {
    .nb-select__trigger,
    .nb-select__dropdown {
      border: 2px solid currentColor;
      box-shadow: none;
    }

    .nb-select__trigger:focus-visible,
    .nb-select__option:focus-visible {
      outline: 2px solid currentColor;
    }

    .nb-select__option:hover,
    .nb-select__option[data-highlighted="true"] {
      background-color: Highlight;
      color: HighlightText;
      forced-color-adjust: none;
    }

    .nb-select__option[aria-selected="true"] {
      background-color: Highlight;
      color: HighlightText;
      forced-color-adjust: none;
    }

    .nb-select__trigger:hover,
    .nb-select__trigger:active {
      transform: none;
    }
  }

  /* ============================================
     320px 移动端适配
     ============================================ */
  @media (max-width: 320px) {
    .nb-select__trigger {
      min-height: 2.75rem; /* 44px 最小触摸目标 */
    }

    .nb-select__dropdown {
      position: fixed;
      inset-inline: 0.5rem;
      inset-block-start: auto;
      inset-block-end: 0;
      max-height: 60vh;
    }

    .nb-select__option {
      padding-block: 0.75rem;
      font-size: max(0.875rem, 16px);
    }
  }

  /* 200% 缩放：保证字体不小于 16px */
  @media (max-width: 960px) {
    .nb-select__trigger,
    .nb-select__option,
    .nb-select--native .nb-select__native {
      font-size: max(0.875rem, 16px);
    }
  }
}
```

### 9.2 HTML 使用示例

```html
<!-- 1. 默认 Select -->
<div class="nb-select" data-state="closed" aria-label="选择城市">
  <button class="nb-select__trigger" type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="dropdown-1">
    <span class="nb-select__value" data-placeholder="请选择城市">北京</span>
    <span class="nb-select__icon" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
        <path d="M2 4 L6 8 L10 4"/>
      </svg>
    </span>
  </button>
  <div class="nb-select__dropdown" id="dropdown-1" role="listbox" hidden>
    <div class="nb-select__option" role="option" aria-selected="true">
      <span class="nb-select__option-text">北京</span>
      <span class="nb-select__option-check" aria-hidden="true">✓</span>
    </div>
    <div class="nb-select__option" role="option" aria-selected="false">
      <span class="nb-select__option-text">上海</span>
      <span class="nb-select__option-check" aria-hidden="true">✓</span>
    </div>
    <div class="nb-select__option" role="option" aria-selected="false">
      <span class="nb-select__option-text">广州</span>
      <span class="nb-select__option-check" aria-hidden="true">✓</span>
    </div>
  </div>
</div>

<!-- 2. Primary 变体 + 大尺寸 -->
<div class="nb-select nb-select--primary nb-select--lg" data-state="closed" aria-label="选择套餐">
  <button class="nb-select__trigger" type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="dropdown-2">
    <span class="nb-select__value">专业版</span>
    <span class="nb-select__icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
        <path d="M2 4 L6 8 L10 4"/>
      </svg>
    </span>
  </button>
  <div class="nb-select__dropdown" id="dropdown-2" role="listbox" hidden>...</div>
</div>

<!-- 3. Outline + 全宽 + 错误状态 -->
<div class="nb-select nb-select--outline nb-select--full-width" data-state="closed">
  <button class="nb-select__trigger" type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="dropdown-3" aria-invalid="true" aria-describedby="error-3">
    <span class="nb-select__value">请选择</span>
    <span class="nb-select__icon" aria-hidden="true">...</span>
  </button>
  <div class="nb-select__dropdown" id="dropdown-3" role="listbox" hidden>...</div>
</div>
<p id="error-3" class="nb-error-text" role="alert">此项为必填</p>

<!-- 4. 禁用状态 -->
<div class="nb-select" data-state="closed" aria-label="选择部门">
  <button class="nb-select__trigger" type="button" disabled aria-disabled="true" aria-expanded="false">
    <span class="nb-select__value">技术部</span>
    <span class="nb-select__icon" aria-hidden="true">...</span>
  </button>
</div>

<!-- 5. 加载状态 -->
<div class="nb-select" data-state="closed" aria-label="加载数据">
  <button class="nb-select__trigger" type="button" aria-busy="true" aria-expanded="false" aria-haspopup="listbox">
    <span class="nb-select__value">加载中...</span>
    <span class="nb-select__icon" aria-hidden="true">...</span>
  </button>
</div>

<!-- 6. 原生降级模式 -->
<div class="nb-select nb-select--native nb-select--full-width" aria-label="选择省份">
  <select class="nb-select__native" name="province" required>
    <option value="">请选择省份</option>
    <option value="bj">北京市</option>
    <option value="sh">上海市</option>
    <option value="gd">广东省</option>
  </select>
  <span class="nb-select__icon" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
      <path d="M2 4 L6 8 L10 4"/>
    </svg>
  </span>
</div>

<!-- 7. 带分组 -->
<div class="nb-select" data-state="closed" aria-label="选择语言">
  <button class="nb-select__trigger" type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="dropdown-7">
    <span class="nb-select__value">JavaScript</span>
    <span class="nb-select__icon" aria-hidden="true">...</span>
  </button>
  <div class="nb-select__dropdown" id="dropdown-7" role="listbox" hidden>
    <div class="nb-select__option-group" role="group" aria-label="前端">
      <div class="nb-select__option-group-label">前端</div>
      <div class="nb-select__option" role="option" aria-selected="true">JavaScript</div>
      <div class="nb-select__option" role="option" aria-selected="false">TypeScript</div>
      <div class="nb-select__option" role="option" aria-selected="false">CSS</div>
    </div>
    <div class="nb-select__option-group" role="group" aria-label="后端">
      <div class="nb-select__option-group-label">后端</div>
      <div class="nb-select__option" role="option" aria-selected="false">Python</div>
      <div class="nb-select__option" role="option" aria-selected="false">Go</div>
      <div class="nb-select__option" role="option" aria-selected="false">Rust</div>
    </div>
  </div>
</div>

<!-- 8. 紧凑模式 + 小尺寸 -->
<div class="nb-select nb-select--sm nb-select--compact" data-state="closed" aria-label="选择状态">
  <button class="nb-select__trigger" type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="dropdown-8">
    <span class="nb-select__value">全部</span>
    <span class="nb-select__icon" aria-hidden="true">...</span>
  </button>
  <div class="nb-select__dropdown" id="dropdown-8" role="listbox" hidden>...</div>
</div>
```

---

## 10. 检查清单

以下验收项必须与文档阶段 2.7（验收标准）对齐，全部通过方可进入组件实现阶段。

### 10.1 视觉合规检查

- [ ] 所有边框宽度为 2px，样式为 `solid`，颜色使用 `color-mix(in oklch, ...)` 动态计算，无硬编码 `#hex`
- [ ] 触发器和面板的所有圆角为 `0px`（使用 `var(--nb-radius-field)` 和 `var(--nb-radius-overlay)`），无圆角例外
- [ ] 所有阴影使用硬阴影（blur = 0，spread = 0），无渐变过渡
- [ ] 触发器 Default 阴影为 `--nb-shadow-sm`（2px 2px），Hover 为 `--nb-shadow-md`（4px 4px），Active 为 `none`
- [ ] 面板阴影为 `--nb-shadow-lg`（6px 6px），大于触发器阴影以表示层级提升
- [ ] 所有颜色使用语义 Token（`--nb-primary`, `--nb-base-100`, `--nb-base-content` 等），无硬编码 `oklch()` 或 `#hex`
- [ ] 禁止使用 `linear-gradient`、`radial-gradient` 或任何背景渐变
- [ ] 禁止使用 `background-image` 噪点/纹理
- [ ] 所有 Hover 状态使用 `transform: translate()` 而非 `margin`/`position` 实现位移
- [ ] 所有过渡使用 `transform` 和 `box-shadow`（GPU 加速属性），不触发重排

### 10.2 交互合规检查

- [ ] Hover 位移为 `translate(-2px, -2px)`，Active 位移为 `translate(2px, 2px)`（对应 sm → md 的阴影阶梯）
- [ ] 过渡时长：状态切换 ≤ 150ms（标准），颜色微调 ≤ 100ms（快速）
- [ ] 缓动函数使用 `cubic-bezier(0.4, 0, 0.2, 1)`（标准）
- [ ] 触摸设备不依赖 Hover，使用 `:active` 提供按下反馈
- [ ] 已移除 `-webkit-tap-highlight-color`，避免默认高亮冲突
- [ ] `@media (prefers-reduced-motion: reduce)` 已实现：取消 `transform` 位移，保留即时 `box-shadow` 切换
- [ ] `@media (hover: hover) and (pointer: fine)` 已用于隔离 Hover 样式，避免触摸端 sticky hover
- [ ] `@media (hover: none) and (pointer: coarse)` 已禁用 Hover 样式回退
- [ ] `@media (forced-colors: active)` 已实现：边框使用 `currentColor`，焦点使用高对比色，禁用 `box-shadow`

### 10.3 可访问性检查

- [ ] 触发器可通过 `Tab` 键聚焦，Tab 顺序正确
- [ ] `Enter` 和 `Space` 可展开/收起面板并选中选项
- [ ] `Escape` 可关闭面板，焦点返回触发器
- [ ] `ArrowDown`/`ArrowUp` 可在面板内导航选项
- [ ] `Home`/`End` 可跳转至第一个/最后一个选项
- [ ] `focus-visible` 使用 `outline: 2px solid var(--nb-focus)`，`outline-offset: 2px`
- [ ] 触发器有 `role="combobox"`，`aria-expanded`，`aria-haspopup="listbox"`，`aria-controls`
- [ ] 面板有 `role="listbox"`，选项有 `role="option"`，`aria-selected`
- [ ] 禁用状态有 `aria-disabled="true"` 或 `disabled` 属性
- [ ] 加载状态有 `aria-busy="true"`
- [ ] 无效状态有 `aria-invalid="true"` 和 `aria-describedby` 关联错误消息
- [ ] 所有方向相关属性使用逻辑属性（`padding-inline`, `margin-inline-start`, `border-inline-start-width` 等）
- [ ] 最小触摸目标 ≥ 44×44px（移动端 ≥ 48×48px）
- [ ] 320px 视口下可用：面板固定底部弹出，选项增大点击区域
- [ ] 200% 缩放下可用：字体最小 16px，布局不溢出

### 10.4 结构与代码检查

- [ ] 所有公共类名以 `nb-` 为前缀，无冲突通用类名
- [ ] 代码使用 `@layer nb.components.select` 包裹，避免样式冲突
- [ ] 组件局部变量使用 `--nb-select-*` 前缀，不影响全局
- [ ] 尺寸变体（xs/sm/md/lg/xl）全部定义，数值精确
- [ ] 颜色变体（primary/secondary/neutral/error/success）全部定义
- [ ] 外观变体（solid/outline/ghost/link）全部定义
- [ ] 布局变体（full-width/compact/comfortable）全部定义
- [ ] 所有状态（Default/Hover/Active/Focus/Disabled/Loading/Invalid/Valid/Open/Readonly）均有 CSS 规则
- [ ] 状态冲突优先级正确（Loading > Disabled > Invalid > Active > Hover > Focus > Default）
- [ ] 原生降级模式（`<select>` + `.nb-select--native`）已提供
- [ ] 选项分组（`role="group"`）已支持
- [ ] 选项选中标记（`.nb-select__option-check`）已实现
- [ ] 下拉箭头图标使用 SVG，线条宽度 2px，`stroke-linecap="square"`

### 10.5 一致性检查

- [ ] 与 `brand-and-tenets.md` 的命名规范一致（`nb-` 前缀，语义 Token）
- [ ] 与 `shadows-and-motion.md` 的位移公式一致（Hover: -2px/-2px, Active: 2px/2px）
- [ ] 与 `radius-and-borders.md` 的 Field 类别一致（直角，2px 边框，color-mix 边框色）
- [ ] 与 `interaction-language.md` 的状态矩阵一致（Invalid: 3px inline-start 强调，Disabled: opacity 0.5）
- [ ] 与 `interaction-language.md` 的过渡时长一致（fast: 100ms, normal: 150ms）
- [ ] 与 `interaction-language.md` 的缓动曲线一致（standard: `cubic-bezier(0.4, 0, 0.2, 1)`）
- [ ] 与 `interaction-language.md` 的 prefers-reduced-motion 策略一致
- [ ] 与 `interaction-language.md` 的 forced-colors 策略一致

---

> **文档状态**：正式规范 | **适用范围**：Neo-Brutal UI Select 组件 | **维护者**：设计系统团队
> **关联文档**：`brand-and-tenets.md` · `shadows-and-motion.md` · `radius-and-borders.md` · `interaction-language.md`
