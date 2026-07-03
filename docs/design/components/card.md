# Card 组件设计基准稿

> **文档编号**：DS-COMP-001  
> **组件名称**：Card  
> **类名前缀**：`nb-card`  
> **组件类别**：Box  
> **适用范围**：Neo-Brutal UI 全部实现版本（v1.0+）  
> **最后更新**：2025 年 6 月  
> **依赖规范**：`brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md`

---

## 1. 组件概述

### 1.1 组件名称与用途

**Card（卡片）**是 Neo-Brutal UI 中最基础的容器组件，用于将相关信息组织在一个独立的、具有物理层级的表面单元中。Card 模拟现实世界中的卡片或纸板——具有明确的边界、厚度（通过硬阴影表达）和可堆叠性。

**典型使用场景**：
- 产品展示（商品卡片、作品卡片）
- 信息聚合（用户资料、文章摘要、通知）
- 功能入口（仪表板模块、快捷操作面板）
- 表单分组（登录框、设置面板）
- 数据可视化容器（图表卡片、统计面板）

### 1.2 对应的语义 HTML 元素

| 场景 | 推荐元素 | 理由 |
|------|----------|------|
| **通用容器** | `<article>` | 表示独立、自包含的内容单元，适合博客摘要、商品卡片 |
| **可点击卡片** | `<a>` 或 `<button>` | 当整个卡片可点击时，使用 `<a>`（导航）或 `<button>`（操作） |
| **列表项** | `<li>` | 当卡片作为列表（如产品列表）中的项时 |
| **分组容器** | `<section>` | 当卡片仅用于视觉分组而非独立内容时 |
| **对话框/弹窗** | `<dialog>` | 当 Card 作为 Modal 的内容容器时（参见 Modal 组件规范） |

**注意**：无论使用何种语义元素，**视觉样式保持一致**。可点击卡片必须通过 `nb-card--interactive` 类启用交互状态。

### 1.3 类名体系

| 类名 | 类型 | 说明 |
|------|------|------|
| `.nb-card` | **核心类** | 必选。定义卡片的基础样式（边框、背景、阴影） |
| `.nb-card--{size}` | 尺寸修饰 | 可选。`xs` / `sm` / `md` / `lg` / `xl` |
| `.nb-card--{variant}` | 颜色修饰 | 可选。`primary` / `secondary` / `neutral` / `success` / `warning` / `error` / `info` |
| `.nb-card--{appearance}` | 外观修饰 | 可选。`outline` / `ghost` / `solid`（默认） |
| `.nb-card--interactive` | 交互修饰 | 可选。启用 Hover/Active 位移和阴影变化 |
| `.nb-card--horizontal` | 布局修饰 | 可选。水平布局（图片左/右侧） |
| `.nb-card--full-width` | 布局修饰 | 可选。宽度 100%，填充父容器 |
| `.nb-card--image-top` | 布局修饰 | 可选。图片位于顶部（默认） |
| `.nb-card--image-left` | 布局修饰 | 可选。图片位于左侧（配合 horizontal） |
| `.nb-card--marketing` | 特殊修饰 | 可选。营销变体，允许 4px 圆角例外 |
| `.nb-card__image` | 子元素 | 可选。卡片媒体区域 |
| `.nb-card__header` | 子元素 | 可选。标题区域，含标题、副标题、操作 |
| `.nb-card__body` | 子元素 | 可选。主内容区域 |
| `.nb-card__footer` | 子元素 | 可选。底部操作区域 |
| `.nb-card__title` | 子元素 | 可选。卡片主标题 |
| `.nb-card__subtitle` | 子元素 | 可选。卡片副标题 |
| `.nb-card__actions` | 子元素 | 可选。操作按钮组 |
| `.nb-card--loading` | 状态类 | 动态。加载状态 |
| `.nb-card--disabled` | 状态类 | 动态。禁用状态 |
| `.nb-card--selected` | 状态类 | 动态。选中状态 |
| `.nb-card--invalid` | 状态类 | 动态。验证失败状态 |

---

## 2. DOM Contract

### 2.1 推荐的 HTML 结构

#### 基础卡片（标准结构）

```html
<article class="nb-card">
  <div class="nb-card__header">
    <h3 class="nb-card__title">卡片标题</h3>
    <p class="nb-card__subtitle">副标题或描述</p>
  </div>
  <div class="nb-card__body">
    <p>卡片的主体内容区域。可以包含文本、列表、图表或其他组件。</p>
  </div>
  <div class="nb-card__footer">
    <div class="nb-card__actions">
      <button class="nb-btn nb-btn--primary">确认</button>
      <button class="nb-btn nb-btn--ghost">取消</button>
    </div>
  </div>
</article>
```

#### 媒体卡片（含图片）

```html
<article class="nb-card nb-card--image-top">
  <div class="nb-card__image">
    <img src="photo.jpg" alt="描述文本" />
  </div>
  <div class="nb-card__body">
    <h3 class="nb-card__title">带图片的卡片</h3>
    <p>图片在顶部的默认布局。</p>
  </div>
</article>
```

#### 水平卡片（图片在左）

```html
<article class="nb-card nb-card--horizontal nb-card--image-left">
  <div class="nb-card__image">
    <img src="photo.jpg" alt="描述文本" />
  </div>
  <div class="nb-card__body">
    <h3 class="nb-card__title">水平布局</h3>
    <p>图片在左侧，内容在右侧。</p>
  </div>
</article>
```

#### 可点击卡片（交互式）

```html
<a href="/detail" class="nb-card nb-card--interactive">
  <div class="nb-card__body">
    <h3 class="nb-card__title">可点击卡片</h3>
    <p>整个卡片区域可点击，Hover 时有位移反馈。</p>
  </div>
</a>
```

#### 加载状态卡片

```html
<article class="nb-card nb-card--loading" aria-busy="true">
  <div class="nb-card__body">
    <div class="nb-skeleton nb-skeleton--text"></div>
    <div class="nb-skeleton nb-skeleton--text"></div>
  </div>
</article>
```

### 2.2 必需子元素与可选子元素

| 子元素 | 类名 | 必需性 | 说明 |
|--------|------|--------|------|
| 根容器 | `.nb-card` | **必需** | 卡片外层容器 |
| 图片区域 | `.nb-card__image` | 可选 | 媒体内容（图片、视频、插图） |
| 头部 | `.nb-card__header` | 可选 | 标题、副标题、图标、元信息 |
| 标题 | `.nb-card__title` | 可选 | 主标题，通常置于 header 或 body 内 |
| 副标题 | `.nb-card__subtitle` | 可选 | 辅助描述文本 |
| 主体 | `.nb-card__body` | 可选 | 主内容区，但建议始终包含 |
| 底部 | `.nb-card__footer` | 可选 | 操作按钮、元信息、链接 |
| 操作区 | `.nb-card__actions` | 可选 | 按钮组，通常置于 footer 内 |

**DOM 结构规则**：
1. `.nb-card__header`、`.nb-card__body`、`.nb-card__footer` 为**同级兄弟元素**，按此顺序排列。
2. `.nb-card__image` 可置于 `.nb-card__header` 之前（图片顶部布局）或作为子元素（图片背景布局）。
3. 可点击卡片（`nb-card--interactive`）内部**不得包含其他可点击元素**（如按钮、链接），避免嵌套交互冲突。
4. 卡片内部可嵌套其他卡片，但**不推荐超过两级**，避免视觉层级混乱。

### 2.3 ARIA 属性要求

| 属性 | 适用场景 | 值 | 说明 |
|------|----------|-----|------|
| `role` | 语义不明确时 | `"article"` / `"region"` / `"button"` | 当使用 `<div>` 而非语义元素时显式声明 |
| `aria-label` | 无可见标题时 | 字符串 | 为卡片提供可访问名称 |
| `aria-labelledby` | 有标题元素时 | 标题元素的 `id` | 将标题关联为卡片名称 |
| `aria-describedby` | 有补充描述时 | 描述元素的 `id` | 关联副标题或描述文本 |
| `aria-busy` | 加载状态 | `"true"` | 动态加载时声明 |
| `aria-disabled` | 禁用状态 | `"true"` | 静态禁用时声明（非表单元素） |
| `aria-selected` | 可选中卡片 | `"true"` / `"false"` | 在卡片组（如选择列表）中使用 |
| `aria-invalid` | 验证失败 | `"true"` | 表单卡片验证失败时 |
| `tabindex` | 可点击卡片 | `"0"` | 当使用 `<div>` 模拟可点击卡片时 |

**ARIA 示例**：

```html
<!-- 无可见标题的卡片 -->
<div class="nb-card" role="article" aria-label="用户统计概览">
  ...
</div>

<!-- 可选中卡片组 -->
<div role="list">
  <article class="nb-card nb-card--interactive nb-card--selected" 
           role="listitem"
           aria-selected="true"
           tabindex="0">
    <div class="nb-card__body">...</div>
  </article>
</div>

<!-- 加载中卡片 -->
<article class="nb-card nb-card--loading" aria-busy="true" aria-live="polite">
  <div class="nb-card__body">加载中...</div>
</article>
```

### 2.4 键盘行为

| 交互 | 键盘事件 | 行为 | 适用场景 |
|------|----------|------|----------|
| **聚焦卡片** | `Tab` | 将焦点移至可交互卡片（`nb-card--interactive`）或卡片内部第一个可聚焦元素 | 全部 |
| **激活卡片** | `Enter` / `Space` | 触发卡片的点击操作（等同于鼠标点击） | `nb-card--interactive` |
| **卡片组导航** | `↑` / `↓` / `←` / `→` | 在卡片组（Grid 或 List）中方向导航 | 可选，需 JS 实现 |
| **内部导航** | `Tab` | 在卡片内部可聚焦元素间顺序移动 | 包含表单/按钮的卡片 |
| **关闭/取消** | `Escape` | 关闭可展开卡片（如手风琴卡片） | 特定变体 |

**键盘行为规则**：
1. 可交互卡片（`nb-card--interactive`）必须可通过 `Tab` 键聚焦，且聚焦时显示 `:focus-visible` 样式。
2. 当使用 `<a>` 或 `<button>` 作为卡片根元素时，浏览器原生键盘行为已满足要求。
3. 当使用 `<div>` 模拟可点击卡片时，必须手动处理 `Enter` 和 `Space` 键事件，并设置 `tabindex="0"`。
4. 卡片组（如图片画廊）中，方向键导航不替代 `Tab` 顺序，而是作为补充导航模式。

---

## 3. 尺寸与变体

### 3.1 尺寸规格

Card 组件支持五种尺寸，主要通过**内部 padding**、**标题字号**、**间距**和**最小宽度**进行区分。Card 本身不设固定高度，由内容决定。

| 尺寸 | 类名 | 最小宽度 | Header Padding | Body Padding | Footer Padding | 标题字号 | 副标题字号 | 内部 Gap | 阴影 |
|------|------|----------|----------------|--------------|----------------|----------|------------|----------|------|
| **XS** | `.nb-card--xs` | `12rem` (192px) | `0.5rem 0.75rem` | `0.75rem` | `0.5rem 0.75rem` | `0.875rem` | `0.75rem` | `0.25rem` | `--nb-shadow-sm` |
| **SM** | `.nb-card--sm` | `16rem` (256px) | `0.75rem 1rem` | `1rem` | `0.75rem 1rem` | `0.875rem` | `0.75rem` | `0.5rem` | `--nb-shadow-sm` |
| **MD** | `.nb-card--md` (默认) | `20rem` (320px) | `1rem 1.25rem` | `1.25rem` | `1rem 1.25rem` | `1rem` | `0.875rem` | `0.5rem` | `--nb-shadow-md` |
| **LG** | `.nb-card--lg` | `24rem` (384px) | `1.25rem 1.5rem` | `1.5rem` | `1.25rem 1.5rem` | `1.125rem` | `0.875rem` | `0.75rem` | `--nb-shadow-md` |
| **XL** | `.nb-card--xl` | `28rem` (448px) | `1.5rem 2rem` | `2rem` | `1.5rem 2rem` | `1.25rem` | `1rem` | `1rem` | `--nb-shadow-lg` |

**尺寸 CSS 规则**：

```css
@layer components {
  /* ---- 基础尺寸 ---- */
  .nb-card {
    min-width: 20rem; /* md 默认 */
  }

  .nb-card--xs {
    min-width: 12rem;
  }
  .nb-card--xs .nb-card__header {
    padding: 0.5rem 0.75rem;
  }
  .nb-card--xs .nb-card__body {
    padding: 0.75rem;
  }
  .nb-card--xs .nb-card__footer {
    padding: 0.5rem 0.75rem;
  }
  .nb-card--xs .nb-card__title {
    font-size: 0.875rem;
  }
  .nb-card--xs .nb-card__subtitle {
    font-size: 0.75rem;
  }
  .nb-card--xs .nb-card__header,
  .nb-card--xs .nb-card__body {
    gap: 0.25rem;
  }
  .nb-card--xs {
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }

  .nb-card--sm {
    min-width: 16rem;
  }
  .nb-card--sm .nb-card__header {
    padding: 0.75rem 1rem;
  }
  .nb-card--sm .nb-card__body {
    padding: 1rem;
  }
  .nb-card--sm .nb-card__footer {
    padding: 0.75rem 1rem;
  }
  .nb-card--sm .nb-card__title {
    font-size: 0.875rem;
  }
  .nb-card--sm .nb-card__subtitle {
    font-size: 0.75rem;
  }
  .nb-card--sm {
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }

  .nb-card--md {
    min-width: 20rem;
  }
  .nb-card--md .nb-card__header {
    padding: 1rem 1.25rem;
  }
  .nb-card--md .nb-card__body {
    padding: 1.25rem;
  }
  .nb-card--md .nb-card__footer {
    padding: 1rem 1.25rem;
  }
  .nb-card--md .nb-card__title {
    font-size: 1rem;
  }
  .nb-card--md .nb-card__subtitle {
    font-size: 0.875rem;
  }
  .nb-card--md {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-card--lg {
    min-width: 24rem;
  }
  .nb-card--lg .nb-card__header {
    padding: 1.25rem 1.5rem;
  }
  .nb-card--lg .nb-card__body {
    padding: 1.5rem;
  }
  .nb-card--lg .nb-card__footer {
    padding: 1.25rem 1.5rem;
  }
  .nb-card--lg .nb-card__title {
    font-size: 1.125rem;
  }
  .nb-card--lg .nb-card__subtitle {
    font-size: 0.875rem;
  }
  .nb-card--lg {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-card--xl {
    min-width: 28rem;
  }
  .nb-card--xl .nb-card__header {
    padding: 1.5rem 2rem;
  }
  .nb-card--xl .nb-card__body {
    padding: 2rem;
  }
  .nb-card--xl .nb-card__footer {
    padding: 1.5rem 2rem;
  }
  .nb-card--xl .nb-card__title {
    font-size: 1.25rem;
  }
  .nb-card--xl .nb-card__subtitle {
    font-size: 1rem;
  }
  .nb-card--xl {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  }
}
```

### 3.2 颜色变体

颜色变体通过改变卡片的背景色、边框色和文本色来表达不同的语义层级。

| 变体 | 类名 | 背景色 | 文本色 | 边框色 | 使用场景 |
|------|------|--------|--------|--------|----------|
| **Primary** | `.nb-card--primary` | `--nb-primary` | `--nb-primary-content` | `color-mix(in oklch, var(--nb-primary-content) 20%, transparent)` | 主推内容、CTA 卡片 |
| **Secondary** | `.nb-card--secondary` | `--nb-secondary` | `--nb-secondary-content` | `color-mix(in oklch, var(--nb-secondary-content) 20%, transparent)` | 次要内容、功能入口 |
| **Neutral** | `.nb-card--neutral` | `--nb-neutral` | `--nb-neutral-content` | `color-mix(in oklch, var(--nb-neutral-content) 20%, transparent)` | 中性信息、默认替代 |
| **Success** | `.nb-card--success` | `--nb-success` | `--nb-success-content` | `color-mix(in oklch, var(--nb-success-content) 20%, transparent)` | 成功状态、正向反馈 |
| **Warning** | `.nb-card--warning` | `--nb-warning` | `--nb-warning-content` | `color-mix(in oklch, var(--nb-warning-content) 20%, transparent)` | 警告信息、注意提示 |
| **Error** | `.nb-card--error` | `--nb-error` | `--nb-error-content` | `color-mix(in oklch, var(--nb-error-content) 20%, transparent)` | 错误信息、危险操作 |
| **Info** | `.nb-card--info` | `--nb-info` | `--nb-info-content` | `color-mix(in oklch, var(--nb-info-content) 20%, transparent)` | 信息提示、说明卡片 |

**颜色变体 CSS 规则**：

```css
@layer components {
  /* ---- 颜色变体 ---- */
  .nb-card--primary {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--primary .nb-card__header,
  .nb-card--primary .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
    border-color: var(--nb-card-border-color);
  }

  .nb-card--secondary {
    background-color: var(--nb-secondary);
    color: var(--nb-secondary-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--secondary .nb-card__header,
  .nb-card--secondary .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-secondary) 90%, black);
    border-color: var(--nb-card-border-color);
  }

  .nb-card--neutral {
    background-color: var(--nb-neutral);
    color: var(--nb-neutral-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-neutral-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--neutral .nb-card__header,
  .nb-card--neutral .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-neutral) 90%, black);
    border-color: var(--nb-card-border-color);
  }

  .nb-card--success {
    background-color: var(--nb-success);
    color: var(--nb-success-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--success .nb-card__header,
  .nb-card--success .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-success) 90%, black);
    border-color: var(--nb-card-border-color);
  }

  .nb-card--warning {
    background-color: var(--nb-warning);
    color: var(--nb-warning-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--warning .nb-card__header,
  .nb-card--warning .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-warning) 90%, black);
    border-color: var(--nb-card-border-color);
  }

  .nb-card--error {
    background-color: var(--nb-error);
    color: var(--nb-error-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--error .nb-card__header,
  .nb-card--error .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-error) 90%, black);
    border-color: var(--nb-card-border-color);
  }

  .nb-card--info {
    background-color: var(--nb-info);
    color: var(--nb-info-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-info-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--info .nb-card__header,
  .nb-card--info .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-info) 90%, black);
    border-color: var(--nb-card-border-color);
  }
}
```

### 3.3 外观变体

外观变体在保持语义色的同时，改变填充方式以适应不同的视觉层级需求。

| 变体 | 类名 | 背景色 | 边框色 | 文本色 | 阴影 | 使用场景 |
|------|------|--------|--------|--------|------|----------|
| **Solid**（默认） | `.nb-card` | `--nb-base-200` | `var(--nb-border)` | `--nb-base-content` | `--nb-shadow-md` | 标准卡片，需要明确层级 |
| **Outline** | `.nb-card--outline` | `transparent` | `var(--nb-border-strong)` | `--nb-base-content` | `none` | 弱层级、卡片组中的非重点项 |
| **Ghost** | `.nb-card--ghost` | `transparent` | `transparent` | `--nb-base-content` | `none` | 极简展示、仅内容分组 |

**外观变体 CSS 规则**：

```css
@layer components {
  /* ---- 外观变体 ---- */
  .nb-card--outline {
    background-color: transparent;
    border: 2px solid var(--nb-border-strong);
    box-shadow: none;
  }
  .nb-card--outline .nb-card__header,
  .nb-card--outline .nb-card__footer {
    background-color: transparent;
    border-color: var(--nb-border-strong);
  }

  .nb-card--ghost {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
  .nb-card--ghost .nb-card__header,
  .nb-card--ghost .nb-card__footer {
    background-color: transparent;
    border-color: transparent;
  }
}
```

**外观与颜色组合**：外观变体与颜色变体可以组合使用。例如 `.nb-card--primary.nb-card--outline` 会产生主色边框、透明背景的卡片。

### 3.4 布局变体

| 变体 | 类名 | 规则 | 使用场景 |
|------|------|------|----------|
| **Vertical**（默认） | 无 | `flex-direction: column` | 图片在顶部或纯文本卡片 |
| **Horizontal** | `.nb-card--horizontal` | `flex-direction: row` | 图片在左侧，右侧为内容 |
| **Full Width** | `.nb-card--full-width` | `width: 100%` | 填充父容器宽度 |
| **Image Top** | `.nb-card--image-top` | 图片在 header 之前 | 默认媒体布局 |
| **Image Left** | `.nb-card--image-left` | 图片在左侧，配合 horizontal | 产品列表、媒体对象 |

**布局变体 CSS 规则**：

```css
@layer components {
  /* ---- 布局变体 ---- */
  .nb-card--horizontal {
    flex-direction: row;
  }
  .nb-card--horizontal .nb-card__image {
    flex: 0 0 auto;
    max-width: 40%;
  }
  .nb-card--horizontal .nb-card__image img {
    height: 100%;
    object-fit: cover;
  }
  .nb-card--horizontal .nb-card__body {
    flex: 1 1 auto;
  }

  .nb-card--full-width {
    width: 100%;
    min-width: auto;
  }

  .nb-card--image-top .nb-card__image {
    order: -1;
  }
  .nb-card--image-top .nb-card__image img {
    width: 100%;
    display: block;
  }

  .nb-card--image-left .nb-card__image {
    order: -1;
  }
}
```

### 3.5 密度变体

Card 支持通过密度模式调整内部信息密度。密度通过父级类或组件自身类控制。

| 密度 | 类名 | Header Padding | Body Padding | Footer Padding | 内部 Gap | 适用场景 |
|------|------|----------------|--------------|----------------|----------|----------|
| **Compact** | `.nb-density-compact` | 减半 | 减半 | 减半 | `0.25rem` | 数据仪表盘、密集列表 |
| **Default** | 默认 | 标准值 | 标准值 | 标准值 | `0.5rem` | 通用场景 |
| **Comfortable** | `.nb-density-comfortable` | 增加 50% | 增加 50% | 增加 50% | `1rem` | 营销页、展示页 |

```css
@layer components {
  /* ---- 密度变体 ---- */
  .nb-card.nb-density-compact .nb-card__header,
  .nb-density-compact .nb-card .nb-card__header {
    padding-block: calc(var(--nb-card-header-padding-block, 1rem) * 0.5);
    padding-inline: calc(var(--nb-card-header-padding-inline, 1.25rem) * 0.75);
  }
  .nb-card.nb-density-compact .nb-card__body,
  .nb-density-compact .nb-card .nb-card__body {
    padding: calc(var(--nb-card-body-padding, 1.25rem) * 0.75);
  }
  .nb-card.nb-density-compact .nb-card__footer,
  .nb-density-compact .nb-card .nb-card__footer {
    padding-block: calc(var(--nb-card-footer-padding-block, 1rem) * 0.5);
    padding-inline: calc(var(--nb-card-footer-padding-inline, 1.25rem) * 0.75);
  }

  .nb-card.nb-density-comfortable .nb-card__header,
  .nb-density-comfortable .nb-card .nb-card__header {
    padding-block: calc(var(--nb-card-header-padding-block, 1rem) * 1.25);
    padding-inline: calc(var(--nb-card-header-padding-inline, 1.25rem) * 1.25);
  }
  .nb-card.nb-density-comfortable .nb-card__body,
  .nb-density-comfortable .nb-card .nb-card__body {
    padding: calc(var(--nb-card-body-padding, 1.25rem) * 1.25);
  }
  .nb-card.nb-density-comfortable .nb-card__footer,
  .nb-density-comfortable .nb-card .nb-card__footer {
    padding-block: calc(var(--nb-card-footer-padding-block, 1rem) * 1.25);
    padding-inline: calc(var(--nb-card-footer-padding-inline, 1.25rem) * 1.25);
  }
}
```

---

## 4. 状态矩阵

以下状态矩阵适用于 **可交互卡片（`.nb-card--interactive`）** 和 **静态卡片**。对于静态卡片，不适用 Hover/Active 状态，已标记为 N/A。

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 光标 | 备注 |
|------|------|------|------|------|--------|------|------|------|
| **Default** | `2px solid var(--nb-border)` | `--nb-shadow-md` (md 尺寸) | `none` | `bg: --nb-base-200`, `color: --nb-base-content` | `1.0` | — | `default` | 静态卡片基准状态 |
| **Hover** | `2px solid color-mix(in oklch, var(--nb-border) 80%, var(--nb-base-100))` | `--nb-shadow-lg` | `translate(-2px, -2px)` | `bg: --nb-base-300` | `1.0` | `150ms brutal` | `pointer` | 仅 `.nb-card--interactive` |
| **Active / Pressed** | `2px solid color-mix(in oklch, var(--nb-border) 120%, var(--nb-base-300))` | `--nb-shadow-none` | `translate(4px, 4px)` | `bg: --nb-base-200` | `1.0` | `150ms brutal` | `pointer` | 仅 `.nb-card--interactive` |
| **Focus Visible** | `2px solid var(--nb-border)` | 保留当前 | `none` | `outline: 2px solid var(--nb-focus)`, `outline-offset: 2px` | `1.0` | `100ms standard` | `default` | 键盘导航时触发 |
| **Disabled** | `2px solid color-mix(in oklch, var(--nb-border) 50%, transparent)` | `--nb-shadow-none` | `none` | `bg: color-mix(in oklch, --nb-base-200 50%, transparent)`, `color: color-mix(in oklch, --nb-base-content 50%, transparent)` | `0.5` | `instant` | `not-allowed` | 需 `aria-disabled="true"` |
| **Loading / Busy** | 保留当前 | 保留当前 | `none` | 内容区域覆盖半透明遮罩，显示 spinner | `1.0` (容器) | `loading pulse` | `wait` | 需 `aria-busy="true"` |
| **Invalid** | `2px solid var(--nb-error)`, `border-inline-start-width: 3px` | 保留当前 | `none` | `bg: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100))` | `1.0` | `100ms standard` | `default` | 需 `aria-invalid="true"` |
| **Valid** | `2px solid var(--nb-success)` | 保留当前 | `none` | `bg: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100))` | `1.0` | `100ms standard` | `default` | 可选，不强制显示 |
| **Selected / Checked** | `2px solid var(--nb-primary)` | `--nb-shadow-sm` | `none` | `bg: var(--nb-primary)`, `color: var(--nb-primary-content)` | `1.0` | `100ms standard` | `pointer` | 需 `aria-selected="true"` |
| **Open / Expanded** | 保留当前 | 提升一级 | `none` | 内容区域展开（max-height 过渡） | `1.0` | `250ms standard` | `default` | 适用于手风琴卡片变体 |
| **Readonly** | `2px solid color-mix(in oklch, var(--nb-border) 50%, transparent)` | `--nb-shadow-xs` | `none` | `bg: var(--nb-base-100)` | `1.0` | `instant` | `default` | 表单卡片中使用 |

### 状态优先级

当多个状态同时出现时，按以下优先级应用（从高到低）：

1. **Loading** — 覆盖所有交互状态
2. **Disabled** — 覆盖 Hover、Active、Focus
3. **Invalid** — 覆盖 Default，但 Hover/Active 仍生效
4. **Valid** — 覆盖 Default，但 Hover/Active 仍生效
5. **Selected** — 覆盖 Default
6. **Active** — 覆盖 Hover
7. **Hover** — 覆盖 Default
8. **Focus Visible** — 与 Hover 共存
9. **Default** — 基准状态

---

## 5. 阴影与位移规则

### 5.1 阴影阶梯使用

Card 作为 Box 类别组件，使用 `--nb-shadow-md` 作为**默认阴影**。尺寸变体可调整阴影等级：

| 尺寸 | 默认阴影 | 说明 |
|------|----------|------|
| XS / SM | `--nb-shadow-sm` | 小卡片使用小阴影，避免视觉过重 |
| MD / LG | `--nb-shadow-md` | 标准阴影 |
| XL | `--nb-shadow-lg` | 大卡片使用大阴影，强化层级 |

### 5.2 交互状态阴影与位移

仅 `.nb-card--interactive` 启用以下效果：

| 状态 | 阴影 | `transform` | 过渡 |
|------|------|-------------|------|
| **Default** | `var(--nb-shadow-md) var(--nb-shadow-color)` | `translate(0, 0)` | — |
| **Hover** | `var(--nb-shadow-lg) var(--nb-shadow-color)` | `translate(-2px, -2px)` | `150ms brutal` |
| **Active** | `var(--nb-shadow-none)` | `translate(4px, 4px)` | `150ms brutal` |
| **Focus + Hover** | `var(--nb-shadow-lg) var(--nb-shadow-color)` | `translate(-2px, -2px)` | `150ms brutal` |

### 5.3 布局稳定性

- **使用 `transform: translate()`**，禁止使用 `margin` 或 `position` 实现位移。
- `transform` 属于合成层属性，不触发重排（reflow），保持文档流稳定。
- 位移后元素的**布局占位空间不变**，周围卡片位置不受影响。

### 5.4 过渡定义

```css
.nb-card--interactive {
  transition: transform var(--nb-duration-normal) var(--nb-ease-brutal),
              box-shadow var(--nb-duration-normal) var(--nb-ease-brutal);
  will-change: transform, box-shadow;
}
```

### 5.5 触摸设备策略

```css
/* 所有设备：Active 反馈 */
.nb-card--interactive:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
}

/* 桌面端：Hover 提升 */
@media (hover: hover) and (pointer: fine) {
  .nb-card--interactive:hover {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  .nb-card--interactive:hover:active {
    box-shadow: var(--nb-shadow-none);
    transform: translate(4px, 4px);
  }
}

/* 触摸端：禁用 Hover 样式 */
@media (hover: none) and (pointer: coarse) {
  .nb-card--interactive:hover {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: none;
  }
}
```

### 5.6 减少动画偏好（prefers-reduced-motion）

```css
@media (prefers-reduced-motion: reduce) {
  .nb-card--interactive,
  .nb-card--interactive:hover,
  .nb-card--interactive:active {
    transform: none !important;
    transition: none;
  }

  .nb-card--interactive:hover {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  }

  .nb-card--interactive:active {
    box-shadow: var(--nb-shadow-none);
  }
}
```

---

## 6. 圆角与边框

### 6.1 圆角规则

Card 属于 **Box 类别**，默认使用 `--nb-radius-box`（`0px`，即直角）。

| 变体/场景 | 圆角值 | 说明 |
|-----------|--------|------|
| **默认卡片** | `var(--nb-radius-box)` = `0px` | 标准直角，符合新粗野主义 |
| **营销变体** | `var(--nb-radius-box-exception)` = `4px` | 仅 `.nb-card--marketing` 允许 |
| **图片区域** | `0px` | 图片与卡片边界对齐，无圆角 |
| **子元素（header/body/footer）** | `0px` | 保持直角一致 |

### 6.2 边框规则

- **默认边框宽度**：`2px`
- **默认边框样式**：`solid`
- **默认边框颜色**：`var(--nb-border)` = `color-mix(in oklch, var(--nb-base-content) 20%, transparent)`

**边框细分规则**：

| 元素 | 边框规则 | 说明 |
|------|----------|------|
| `.nb-card`（外框） | `2px solid var(--nb-border)` | 完整外边框 |
| `.nb-card__header` | `border-block-end: 2px solid var(--nb-border)` | 仅底部边框，与 body 分隔 |
| `.nb-card__footer` | `border-block-start: 2px solid var(--nb-border)` | 仅顶部边框，与 body 分隔 |
| `.nb-card__body` | 无边框 | 内容区域无外框，避免视觉噪音 |
| `.nb-card--outline` | `2px solid var(--nb-border-strong)` | 强调边框 |

### 6.3 例外情况

- **`.nb-card--marketing`**：允许使用 `4px` 圆角，作为营销场景的柔和化处理。
- 任何其他变体**不得使用圆角**，保持直角一致。

---

## 7. 颜色策略

### 7.1 颜色 Token 使用

| 用途 | Token | 说明 |
|------|-------|------|
| 默认背景 | `--nb-base-200` | Surface 层级 |
| 默认文本 | `--nb-base-content` | 内容色 |
| 默认边框 | `--nb-border` | `color-mix(in oklch, --nb-base-content 20%, transparent)` |
| 强调边框 | `--nb-border-strong` | `color-mix(in oklch, --nb-base-content 40%, transparent)` |
| Header/Footer 背景 | `--nb-base-200` 或变体色 90% mix | 与 body 微区分 |
| Hover 背景 | `--nb-base-300` | Raised Surface 层级 |
| 焦点色 | `--nb-focus` | `oklch(70% 0.15 250)` 或主题适配色 |

### 7.2 颜色变体映射

每个语义变体（primary、secondary 等）遵循统一模式：

```
背景色 = var(--nb-{variant})
文本色 = var(--nb-{variant}-content)
边框色 = color-mix(in oklch, var(--nb-{variant}-content) 20%, transparent)
Header/Footer 背景 = color-mix(in oklch, var(--nb-{variant}) 90%, black)
```

### 7.3 动态颜色计算（color-mix）

**Hover 状态背景微调**：

```css
.nb-card--interactive:hover {
  background-color: var(--nb-base-300); /* 默认变体 */
}

.nb-card--primary.nb-card--interactive:hover {
  background-color: color-mix(in oklch, var(--nb-primary) 90%, white);
}
```

**Active 状态背景微调**：

```css
.nb-card--interactive:active {
  background-color: var(--nb-base-200); /* 恢复默认 */
}

.nb-card--primary.nb-card--interactive:active {
  background-color: color-mix(in oklch, var(--nb-primary) 95%, black);
}
```

**边框色动态计算**：

```css
/* 默认边框：内容色的 20% 混合 */
--nb-border: color-mix(in oklch, var(--nb-base-content) 20%, transparent);

/* 强调边框：内容色的 40% 混合 */
--nb-border-strong: color-mix(in oklch, var(--nb-base-content) 40%, transparent);

/* 在 primary 背景上，边框自动基于 primary-content 计算 */
.nb-card--primary {
  --nb-base-content: var(--nb-primary-content); /* 局部覆盖 */
  border: 2px solid var(--nb-border); /* 自动使用 primary-content 计算 */
}
```

### 7.4 禁止事项

- ❌ **禁止**在组件 CSS 中硬编码 `#hex` 颜色值（如 `#000000`、`#ffffff`）。
- ❌ **禁止**在组件 CSS 中直接使用未经批准的 `oklch()` 值（如 `oklch(50% 0.1 200)`）。
- ❌ **禁止**使用 `linear-gradient`、`radial-gradient` 作为卡片背景。
- ✅ **允许**在全局 `:root` 中定义 `oklch()` 主题色（如 `--nb-primary: oklch(60% 0.2 250)`）。
- ✅ **允许**使用 `color-mix(in oklch, ...)` 动态计算颜色。

---

## 8. 可访问性要求

### 8.1 键盘可操作性

| 要求 | 规则 | 验证方式 |
|------|------|----------|
| **Tab 顺序** | 可交互卡片必须可通过 `Tab` 键聚焦；静态卡片内的可聚焦元素（如按钮、链接）必须按文档顺序参与 Tab 导航 | 键盘测试 |
| **Enter/Space 激活** | 可交互卡片在聚焦时，按 `Enter` 或 `Space` 必须触发点击操作 | 键盘测试 |
| **焦点顺序** | 卡片内部焦点顺序必须遵循视觉顺序（从上到下，从左到右） | 键盘测试 |
| **焦点陷阱** | 除非 Card 作为 Modal 使用，否则**不得**在卡片内部陷阱焦点 | 代码审查 |

### 8.2 Focus Visible 样式

```css
.nb-card--interactive:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

/* Focus + Hover 共存 */
.nb-card--interactive:hover:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  transform: translate(-2px, -2px);
}
```

### 8.3 ARIA 属性

| 属性 | 必须性 | 说明 |
|------|--------|------|
| `aria-label` 或 `aria-labelledby` | 推荐 | 为无可见标题的卡片提供可访问名称 |
| `aria-describedby` | 可选 | 关联副标题或描述 |
| `aria-busy="true"` | 加载时必需 | 声明卡片内容正在加载 |
| `aria-disabled="true"` | 禁用时必需 | 非表单元素的禁用声明 |
| `aria-selected="true"` | 选中时必需 | 可选中卡片组中使用 |
| `aria-invalid="true"` | 验证失败时必需 | 配合 `aria-describedby` 指向错误消息 |
| `role` | 使用非语义元素时必需 | 显式声明语义角色 |

### 8.4 RTL 适配（逻辑属性）

Card 组件**全面使用 CSS 逻辑属性**，确保在 RTL 布局下无需额外调整：

| 物理属性 | 逻辑属性替代 | 说明 |
|----------|-------------|------|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` | 操作按钮间距 |
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` | 内部填充 |
| `border-left` | `border-inline-start` | Invalid 状态的强调边框 |
| `text-align: left` | `text-align: start` | 文本对齐 |
| `left` | `inset-inline-start` | 绝对定位 |

**RTL 示例**：

```css
.nb-card--invalid {
  border-inline-start-width: 3px; /* 逻辑属性：RTL 自动切换为右侧 */
}

.nb-card__actions {
  margin-inline-start: auto; /* 逻辑属性：RTL 自动切换 */
}
```

### 8.5 减少动画偏好（prefers-reduced-motion）

```css
@media (prefers-reduced-motion: reduce) {
  .nb-card--interactive,
  .nb-card--interactive:hover,
  .nb-card--interactive:active {
    transform: none !important;
    transition: none;
  }

  .nb-card--loading::after {
    animation: none; /* 停止 spinner 旋转 */
  }
}
```

### 8.6 强制颜色模式（forced-colors）

在 Windows 高对比度模式或 `forced-colors: active` 下：

```css
@media (forced-colors: active) {
  .nb-card {
    border: 2px solid CanvasText; /* 使用系统高对比色 */
    forced-color-adjust: none; /* 保留自定义样式 */
  }

  .nb-card--interactive:focus-visible {
    outline: 2px solid Highlight; /* 使用系统高对比焦点色 */
    outline-offset: 2px;
  }

  .nb-card__header,
  .nb-card__footer {
    border-color: CanvasText;
  }

  .nb-card--invalid {
    border-inline-start-color: Mark; /* 使用系统错误色 */
  }
}
```

### 8.7 移动端可用性（320px 视口）

| 要求 | 规则 | 验证方式 |
|------|------|----------|
| **最小宽度** | 在 320px 视口下，卡片最小宽度不得小于 `12rem`（192px），避免水平溢出 | 浏览器 DevTools 测试 |
| **触摸目标** | 卡片内部的可点击元素（按钮、链接）必须保持至少 `44px × 44px` 的触摸目标 | 触摸测试 |
| **可读性** | 在 320px 视口下，卡片文本字号不得小于 `0.75rem`（12px） | 视觉检查 |
| **间距** | 卡片间距在移动端适当缩小，避免内容挤压 | 响应式测试 |

### 8.8 200% 缩放测试

| 要求 | 规则 | 验证方式 |
|------|------|----------|
| **文本不截断** | 200% 缩放时，卡片标题和正文不得被截断或重叠 | 浏览器缩放测试 |
| **布局不崩溃** | 200% 缩放时，卡片内部布局（header/body/footer）保持结构完整 | 浏览器缩放测试 |
| **焦点可见** | 200% 缩放时，`:focus-visible` 的 outline 仍完整可见 | 键盘测试 |
| **阴影可见** | 200% 缩放时，硬阴影仍保持清晰可辨（不与其他元素混淆） | 视觉检查 |

---

## 9. 完整 CSS 示例

### 9.1 核心 CSS 代码

```css
@layer components {
  /* =============================================
     Neo-Brutal UI — Card Component
     ============================================= */

  /* ---- 基础结构 ---- */
  .nb-card {
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: 20rem;
    background-color: var(--nb-base-200);
    color: var(--nb-base-content);
    border: 2px solid var(--nb-border);
    border-radius: var(--nb-radius-box); /* 0px */
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    overflow: hidden;
    transition: transform var(--nb-duration-normal) var(--nb-ease-brutal),
                box-shadow var(--nb-duration-normal) var(--nb-ease-brutal),
                background-color var(--nb-duration-fast) var(--nb-ease-standard);
    -webkit-tap-highlight-color: transparent;

    /* 局部变量，供子元素使用 */
    --nb-card-border-color: var(--nb-border);
    --nb-card-header-padding-block: 1rem;
    --nb-card-header-padding-inline: 1.25rem;
    --nb-card-body-padding: 1.25rem;
    --nb-card-footer-padding-block: 1rem;
    --nb-card-footer-padding-inline: 1.25rem;
  }

  /* ---- 子元素 ---- */
  .nb-card__image {
    display: block;
    overflow: hidden;
  }
  .nb-card__image img {
    display: block;
    width: 100%;
    height: auto;
    filter: none; /* 禁止照片滤镜 */
  }

  .nb-card__header {
    padding: var(--nb-card-header-padding-block) var(--nb-card-header-padding-inline);
    border-block-end: 2px solid var(--nb-card-border-color);
    background-color: var(--nb-base-200);
    font-weight: var(--nb-weight-semibold);
  }

  .nb-card__body {
    padding: var(--nb-card-body-padding);
    flex: 1 1 auto;
  }

  .nb-card__footer {
    padding: var(--nb-card-footer-padding-block) var(--nb-card-footer-padding-inline);
    border-block-start: 2px solid var(--nb-card-border-color);
    background-color: var(--nb-base-200);
  }

  .nb-card__title {
    margin: 0;
    font-size: 1rem;
    font-weight: var(--nb-weight-bold);
    line-height: 1.25;
    color: inherit;
  }

  .nb-card__subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    font-weight: var(--nb-weight-normal);
    line-height: 1.4;
    color: color-mix(in oklch, var(--nb-base-content) 70%, transparent);
  }

  .nb-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  /* ---- 尺寸变体 ---- */
  .nb-card--xs { min-width: 12rem; box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color); }
  .nb-card--xs .nb-card__header { padding: 0.5rem 0.75rem; }
  .nb-card--xs .nb-card__body { padding: 0.75rem; }
  .nb-card--xs .nb-card__footer { padding: 0.5rem 0.75rem; }
  .nb-card--xs .nb-card__title { font-size: 0.875rem; }
  .nb-card--xs .nb-card__subtitle { font-size: 0.75rem; }

  .nb-card--sm { min-width: 16rem; box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color); }
  .nb-card--sm .nb-card__header { padding: 0.75rem 1rem; }
  .nb-card--sm .nb-card__body { padding: 1rem; }
  .nb-card--sm .nb-card__footer { padding: 0.75rem 1rem; }
  .nb-card--sm .nb-card__title { font-size: 0.875rem; }
  .nb-card--sm .nb-card__subtitle { font-size: 0.75rem; }

  .nb-card--md { min-width: 20rem; }
  .nb-card--md .nb-card__header { padding: 1rem 1.25rem; }
  .nb-card--md .nb-card__body { padding: 1.25rem; }
  .nb-card--md .nb-card__footer { padding: 1rem 1.25rem; }

  .nb-card--lg { min-width: 24rem; }
  .nb-card--lg .nb-card__header { padding: 1.25rem 1.5rem; }
  .nb-card--lg .nb-card__body { padding: 1.5rem; }
  .nb-card--lg .nb-card__footer { padding: 1.25rem 1.5rem; }
  .nb-card--lg .nb-card__title { font-size: 1.125rem; }

  .nb-card--xl { min-width: 28rem; box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color); }
  .nb-card--xl .nb-card__header { padding: 1.5rem 2rem; }
  .nb-card--xl .nb-card__body { padding: 2rem; }
  .nb-card--xl .nb-card__footer { padding: 1.5rem 2rem; }
  .nb-card--xl .nb-card__title { font-size: 1.25rem; }
  .nb-card--xl .nb-card__subtitle { font-size: 1rem; }

  /* ---- 颜色变体 ---- */
  .nb-card--primary {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--primary .nb-card__header,
  .nb-card--primary .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
  }
  .nb-card--primary .nb-card__subtitle {
    color: color-mix(in oklch, var(--nb-primary-content) 70%, transparent);
  }

  .nb-card--secondary {
    background-color: var(--nb-secondary);
    color: var(--nb-secondary-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-secondary-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--secondary .nb-card__header,
  .nb-card--secondary .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-secondary) 90%, black);
  }
  .nb-card--secondary .nb-card__subtitle {
    color: color-mix(in oklch, var(--nb-secondary-content) 70%, transparent);
  }

  .nb-card--neutral {
    background-color: var(--nb-neutral);
    color: var(--nb-neutral-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-neutral-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--neutral .nb-card__header,
  .nb-card--neutral .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-neutral) 90%, black);
  }

  .nb-card--success {
    background-color: var(--nb-success);
    color: var(--nb-success-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--success .nb-card__header,
  .nb-card--success .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-success) 90%, black);
  }

  .nb-card--warning {
    background-color: var(--nb-warning);
    color: var(--nb-warning-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--warning .nb-card__header,
  .nb-card--warning .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-warning) 90%, black);
  }

  .nb-card--error {
    background-color: var(--nb-error);
    color: var(--nb-error-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--error .nb-card__header,
  .nb-card--error .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-error) 90%, black);
  }

  .nb-card--info {
    background-color: var(--nb-info);
    color: var(--nb-info-content);
    --nb-card-border-color: color-mix(in oklch, var(--nb-info-content) 20%, transparent);
    border-color: var(--nb-card-border-color);
  }
  .nb-card--info .nb-card__header,
  .nb-card--info .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-info) 90%, black);
  }

  /* ---- 外观变体 ---- */
  .nb-card--outline {
    background-color: transparent;
    border: 2px solid var(--nb-border-strong);
    box-shadow: none;
  }
  .nb-card--outline .nb-card__header,
  .nb-card--outline .nb-card__footer {
    background-color: transparent;
  }

  .nb-card--ghost {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
  .nb-card--ghost .nb-card__header,
  .nb-card--ghost .nb-card__footer {
    background-color: transparent;
    border-color: transparent;
  }

  /* ---- 布局变体 ---- */
  .nb-card--horizontal {
    flex-direction: row;
  }
  .nb-card--horizontal .nb-card__image {
    flex: 0 0 auto;
    max-width: 40%;
  }
  .nb-card--horizontal .nb-card__image img {
    height: 100%;
    object-fit: cover;
  }
  .nb-card--horizontal .nb-card__body {
    flex: 1 1 auto;
  }

  .nb-card--full-width {
    width: 100%;
    min-width: auto;
  }

  .nb-card--image-top .nb-card__image {
    order: -1;
  }
  .nb-card--image-top .nb-card__image img {
    width: 100%;
  }

  .nb-card--image-left .nb-card__image {
    order: -1;
  }

  .nb-card--marketing {
    border-radius: var(--nb-radius-box-exception); /* 4px */
  }

  /* ---- 交互状态 ---- */
  .nb-card--interactive {
    cursor: pointer;
    text-decoration: none;
    will-change: transform, box-shadow;
  }

  @media (hover: hover) and (pointer: fine) {
    .nb-card--interactive:hover {
      box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
      transform: translate(-2px, -2px);
      background-color: var(--nb-base-300);
    }
  }

  .nb-card--interactive:active {
    box-shadow: var(--nb-shadow-none);
    transform: translate(4px, 4px);
    background-color: var(--nb-base-200);
  }

  .nb-card--interactive:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  @media (hover: hover) and (pointer: fine) {
    .nb-card--interactive:hover:focus-visible {
      box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
      transform: translate(-2px, -2px);
    }
  }

  /* ---- 状态：Disabled ---- */
  .nb-card--disabled,
  .nb-card[aria-disabled="true"] {
    opacity: 0.5;
    box-shadow: none;
    border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
    background-color: color-mix(in oklch, var(--nb-base-200) 50%, transparent);
    color: color-mix(in oklch, var(--nb-base-content) 50%, transparent);
    cursor: not-allowed;
    pointer-events: none;
  }
  .nb-card--disabled .nb-card__header,
  .nb-card--disabled .nb-card__footer,
  .nb-card[aria-disabled="true"] .nb-card__header,
  .nb-card[aria-disabled="true"] .nb-card__footer {
    background-color: transparent;
  }

  /* ---- 状态：Loading ---- */
  .nb-card--loading {
    position: relative;
    pointer-events: none;
    cursor: wait;
  }
  .nb-card--loading .nb-card__body > * {
    visibility: hidden;
  }
  .nb-card--loading::after {
    content: "";
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: color-mix(in oklch, var(--nb-base-100) 80%, transparent);
  }
  .nb-card--loading::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2rem;
    height: 2rem;
    background-color: var(--nb-primary);
    border: 2px solid var(--nb-border);
    z-index: 1;
    animation: nb-card-loading-pulse 1s steps(2) infinite;
    transform: translate(-50%, -50%);
  }

  @keyframes nb-card-loading-pulse {
    0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
  }

  /* ---- 状态：Invalid ---- */
  .nb-card--invalid {
    border: 2px solid var(--nb-error);
    border-inline-start-width: 3px;
    background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
  }
  .nb-card--invalid .nb-card__header,
  .nb-card--invalid .nb-card__footer {
    border-color: var(--nb-error);
  }

  /* ---- 状态：Valid ---- */
  .nb-card--valid {
    border: 2px solid var(--nb-success);
    background-color: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
  }
  .nb-card--valid .nb-card__header,
  .nb-card--valid .nb-card__footer {
    border-color: var(--nb-success);
  }

  /* ---- 状态：Selected ---- */
  .nb-card--selected {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    border-color: var(--nb-primary);
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  }
  .nb-card--selected .nb-card__header,
  .nb-card--selected .nb-card__footer {
    background-color: color-mix(in oklch, var(--nb-primary) 90%, black);
    border-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  }
  .nb-card--selected .nb-card__subtitle {
    color: color-mix(in oklch, var(--nb-primary-content) 70%, transparent);
  }

  /* ---- 状态：Readonly ---- */
  .nb-card--readonly {
    border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
    background-color: var(--nb-base-100);
    box-shadow: var(--nb-shadow-xs) var(--nb-shadow-color);
    cursor: default;
  }
  .nb-card--readonly .nb-card__header,
  .nb-card--readonly .nb-card__footer {
    background-color: transparent;
  }

  /* ---- 触摸端策略 ---- */
  @media (hover: none) and (pointer: coarse) {
    .nb-card--interactive:hover {
      box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
      transform: none;
    }
  }

  /* ---- 减少动画偏好 ---- */
  @media (prefers-reduced-motion: reduce) {
    .nb-card,
    .nb-card--interactive,
    .nb-card--interactive:hover,
    .nb-card--interactive:active {
      transform: none !important;
      transition: none;
    }

    .nb-card--interactive:hover {
      box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    }

    .nb-card--interactive:active {
      box-shadow: var(--nb-shadow-none);
    }

    .nb-card--loading::before {
      animation: none;
    }
  }

  /* ---- 强制颜色模式 ---- */
  @media (forced-colors: active) {
    .nb-card {
      border: 2px solid CanvasText;
      forced-color-adjust: none;
    }
    .nb-card--interactive:focus-visible {
      outline: 2px solid Highlight;
      outline-offset: 2px;
    }
    .nb-card__header,
    .nb-card__footer {
      border-color: CanvasText;
    }
    .nb-card--invalid {
      border-inline-start-color: Mark;
    }
  }
}
```

### 9.2 HTML 使用示例

#### 示例 1：基础卡片（默认尺寸）

```html
<article class="nb-card">
  <div class="nb-card__header">
    <h3 class="nb-card__title">项目概览</h3>
    <p class="nb-card__subtitle">2025 年 Q2 数据汇总</p>
  </div>
  <div class="nb-card__body">
    <p>本季度共完成 24 个项目，同比增长 15%。客户满意度达到 96%。</p>
  </div>
  <div class="nb-card__footer">
    <div class="nb-card__actions">
      <button class="nb-btn nb-btn--primary">查看详情</button>
      <button class="nb-btn nb-btn--ghost">导出报告</button>
    </div>
  </div>
</article>
```

#### 示例 2：可点击产品卡片（带图片）

```html
<a href="/product/123" class="nb-card nb-card--interactive nb-card--image-top">
  <div class="nb-card__image">
    <img src="product.jpg" alt="复古机械键盘" />
  </div>
  <div class="nb-card__body">
    <h3 class="nb-card__title">机械键盘 Pro</h3>
    <p class="nb-card__subtitle">¥899</p>
    <p> Cherry 轴体，全键无冲，PBT 键帽。</p>
  </div>
</a>
```

#### 示例 3：水平布局卡片（图片在左）

```html
<article class="nb-card nb-card--horizontal nb-card--image-left nb-card--sm">
  <div class="nb-card__image">
    <img src="avatar.jpg" alt="用户头像" />
  </div>
  <div class="nb-card__body">
    <h3 class="nb-card__title">张三</h3>
    <p class="nb-card__subtitle">高级前端工程师</p>
    <p>专注于设计系统与组件库开发。</p>
  </div>
</article>
```

#### 示例 4：主色变体（强调卡片）

```html
<article class="nb-card nb-card--primary">
  <div class="nb-card__body">
    <h3 class="nb-card__title">专业版</h3>
    <p>解锁全部高级功能，优先技术支持。</p>
  </div>
  <div class="nb-card__footer">
    <div class="nb-card__actions">
      <button class="nb-btn nb-btn--primary">立即升级</button>
    </div>
  </div>
</article>
```

#### 示例 5：加载状态卡片

```html
<article class="nb-card nb-card--loading" aria-busy="true" aria-live="polite">
  <div class="nb-card__header">
    <h3 class="nb-card__title">加载中...</h3>
  </div>
  <div class="nb-card__body">
    <p>正在获取最新数据，请稍候。</p>
  </div>
</article>
```

#### 示例 6：选中状态卡片（卡片组）

```html
<div role="list" aria-label="选择套餐">
  <article class="nb-card nb-card--interactive nb-card--selected" 
           role="listitem"
           aria-selected="true"
           tabindex="0">
    <div class="nb-card__body">
      <h3 class="nb-card__title">团队版</h3>
      <p>已选择</p>
    </div>
  </article>
</div>
```

#### 示例 7：无效状态卡片（表单验证）

```html
<article class="nb-card nb-card--invalid" aria-invalid="true" aria-describedby="error-msg">
  <div class="nb-card__header">
    <h3 class="nb-card__title">支付信息</h3>
  </div>
  <div class="nb-card__body">
    <p>请检查您的支付方式。</p>
  </div>
</article>
<p id="error-msg" class="nb-error-text">银行卡信息无效，请重新输入。</p>
```

#### 示例 8：全宽轮廓卡片

```html
<article class="nb-card nb-card--outline nb-card--full-width">
  <div class="nb-card__body">
    <p>这是一个无填充、仅边框的轮廓卡片，适合作为列表项或弱层级容器。</p>
  </div>
</article>
```

---

## 10. 检查清单

以下检查清单必须与 Neo-Brutal UI 设计系统 **阶段 2.7 验收标准** 对齐。所有项必须标记为【通过】方可进入实现阶段。

### 10.1 视觉规范检查

- [ ] **边框检查**：所有 Card 外边框是否为 `2px solid`？
- [ ] **边框颜色检查**：边框颜色是否使用 `var(--nb-border)` 或 `color-mix(in oklch, ...)`，而非硬编码 `#hex`？
- [ ] **圆角检查**：默认 Card 圆角是否为 `0px`（直角）？
- [ ] **圆角例外检查**：仅有 `.nb-card--marketing` 允许 `4px` 圆角，其他变体是否均为直角？
- [ ] **阴影检查**：默认阴影是否为硬阴影（`blur = 0`, `spread = 0`）？
- [ ] **阴影颜色检查**：阴影颜色是否使用 `color-mix(in oklch, var(--nb-base-content) 25%, transparent)`？
- [ ] **背景检查**：默认背景是否为 `var(--nb-base-200)`（Surface 层级）？
- [ ] **渐变检查**：Card 是否未使用任何 `linear-gradient` 或 `radial-gradient`？
- [ ] **纹理检查**：Card 是否未使用任何 `background-image` 纹理？

### 10.2 交互规范检查

- [ ] **Hover 位移检查**：`.nb-card--interactive:hover` 是否使用 `transform: translate(-2px, -2px)`？
- [ ] **Active 位移检查**：`.nb-card--interactive:active` 是否使用 `transform: translate(4px, 4px)`？
- [ ] **Hover 阴影检查**：Hover 时阴影是否从 `md` 升级为 `lg`？
- [ ] **Active 阴影检查**：Active 时阴影是否归零（`--nb-shadow-none`）？
- [ ] **过渡检查**：`transform` 和 `box-shadow` 是否使用 `transition` 且时长 ≤ 150ms？
- [ ] **缓动检查**：过渡是否使用 `cubic-bezier(0.25, 0.1, 0.25, 1.0)`（brutal）或 `cubic-bezier(0.4, 0, 0.2, 1)`（standard）？
- [ ] **布局稳定性检查**：位移是否仅使用 `transform`，未使用 `margin` 或 `position`？
- [ ] **触摸检查**：触摸设备是否仅通过 `:active` 提供反馈，不依赖 Hover？
- [ ] **减少动画检查**：是否实现 `@media (prefers-reduced-motion: reduce)` 并取消位移？
- [ ] **触摸高亮检查**：是否移除 `-webkit-tap-highlight-color`？

### 10.3 状态规范检查

- [ ] **Default 状态**：是否有明确的边框、阴影、背景、文本色定义？
- [ ] **Hover 状态**：阴影是否升级、元素是否位移？
- [ ] **Active 状态**：阴影是否归零、元素是否移向原阴影位置？
- [ ] **Focus Visible**：是否使用 `2px solid var(--nb-focus)` + `outline-offset: 2px`？
- [ ] **Disabled**：是否设置 `opacity: 0.5`、`box-shadow: none`、`cursor: not-allowed`？
- [ ] **Loading**：是否设置 `aria-busy="true"`、尺寸是否保持不变、内容是否被遮罩？
- [ ] **Invalid**：边框是否变为 `var(--nb-error)`、`border-inline-start-width` 是否为 `3px`？
- [ ] **Valid**：边框是否变为 `var(--nb-success)`（可选，不强制）？
- [ ] **Selected**：背景是否变为 `var(--nb-primary)`、文本是否变为 `var(--nb-primary-content)`？
- [ ] **Readonly**：是否保持 `opacity: 1`、边框是否变淡？
- [ ] **Open**：手风琴变体是否正确展开（不适用标准 Card）？

### 10.4 可访问性检查

- [ ] **键盘检查**：可交互卡片是否可通过 `Tab` 键聚焦？
- [ ] **激活检查**：聚焦时是否可通过 `Enter` / `Space` 激活？
- [ ] **焦点可见**：键盘导航时焦点环是否清晰可见？
- [ ] **ARIA 标签**：无可见标题的卡片是否有 `aria-label` 或 `aria-labelledby`？
- [ ] **ARIA 状态**：加载状态是否有 `aria-busy`？禁用状态是否有 `aria-disabled`？
- [ ] **RTL 检查**：是否使用 `border-inline-start`、`padding-inline` 等逻辑属性？
- [ ] **高对比度检查**：`forced-colors` 模式下边框是否可见？焦点色是否使用 `Highlight`？
- [ ] **320px 检查**：最小宽度在 320px 视口下是否不溢出？触摸目标是否 ≥ 44px？
- [ ] **200% 缩放**：200% 缩放时文本是否不截断、布局是否不崩溃？

### 10.5 代码质量检查

- [ ] **CSS 变量**：是否使用 `--nb-` 前缀的 CSS 变量，而非硬编码值？
- [ ] **颜色空间**：`color-mix` 是否使用 `in oklch` 色空间？
- [ ] **@layer**：组件 CSS 是否包裹在 `@layer components` 中？
- [ ] **类名前缀**：所有公共类名是否以 `nb-` 开头？
- [ ] **BEM 规范**：子元素类名是否使用 `nb-card__` 前缀、修饰符是否使用 `nb-card--` 前缀？
- [ ] **无冲突**：类名是否未与常见框架（Bootstrap、Tailwind）产生冲突？
- [ ] **Token 一致性**：是否引用全局 Token 文档中定义的值？
- [ ] **文档对齐**：本文档是否与 `brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md` 一致？

---

> **文档版本**：v1.0  
> **最后更新**：2025 年 6 月  
> **维护者**：Neo-Brutal UI 设计系统团队  
> **审核状态**：待技术评审（Tech Review）
