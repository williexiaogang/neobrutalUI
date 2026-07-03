# Modal 设计基准稿

> 组件类型：Overlay 覆盖层组件  
> 文档版本：v1.0  
> 最后更新：设计系统初版  
> 维护者：Neo-Brutal UI 设计系统团队  
> 关联文档：`brand-and-tenets.md`、`shadows-and-motion.md`、`radius-and-borders.md`、`interaction-language.md`

---

## 1. 组件概述

### 1.1 组件名称与用途

**Modal**（模态框 / 对话框）是一个覆盖在当前页面上方的容器组件，用于在不离开当前上下文的情况下，向用户展示重要信息、收集表单输入或请求用户确认。

Modal 的核心设计特征：
- **高对比度**：通过硬阴影（`--nb-shadow-xl`）和深色遮罩（`--nb-overlay`）明确区分前景与背景。
- **刚性进入**：打开时伴随短促的缩放/位移入场动画，关闭时伴随淡出退场。
- **物理层级**：Modal 对话框位于最高表面层级（`--nb-base-100` + 实线边框），遮罩位于覆盖层（`--nb-overlay`）。
- **焦点陷阱**：打开时焦点被限制在 Modal 内部，Tab 键在内部循环，Esc 键关闭。

### 1.2 语义 HTML 元素

首选 `<dialog>` 元素（HTML5 原生），降级方案使用 `<div role="dialog">` + `aria-modal="true"`。

| 方案 | 元素 | 说明 |
|------|------|------|
| **首选** | `<dialog>` | 原生支持 `showModal()`、`close()`、`::backdrop` 伪元素，无障碍支持最佳。 |
| **降级** | `<div role="dialog">` | 需手动实现焦点陷阱和 `aria-modal` 属性。 |

### 1.3 类名体系

| 类名 | 作用 | 说明 |
|------|------|------|
| `.nb-modal-backdrop` | 遮罩层 | 固定定位，覆盖全屏，半透黑背景 |
| `.nb-modal` | 对话框主体 | 核心容器，承载内容 |
| `.nb-modal__header` | 头部区域 | 标题 + 关闭按钮（可选） |
| `.nb-modal__title` | 标题文本 | 语义化标题 |
| `.nb-modal__close` | 关闭按钮 | 位于头部右上角 |
| `.nb-modal__body` | 内容区域 | 主要信息或表单 |
| `.nb-modal__footer` | 底部操作区 | 按钮组（确认/取消/操作） |
| `.nb-modal--xs` ~ `.nb-modal--xl` | 尺寸变体 | 控制 max-width |
| `.nb-modal--primary` | 主色变体 | 强调头部背景 |
| `.nb-modal--danger` | 危险变体 | 错误/删除确认场景 |
| `.nb-modal--warning` | 警告变体 | 警告提示场景 |
| `.nb-modal--scrollable` | 可滚动变体 | body 区域可滚动 |
| `.nb-modal--sheet` | 底部弹窗变体 | 移动端适配 |
| `.nb-modal--fullscreen` | 全屏变体 | 覆盖全屏 |
| `.nb-modal--loading` | 加载状态 | 内容被遮罩 + spinner 覆盖 |
| `.nb-modal-backdrop.is-open` / `.nb-modal.is-open` | JS 状态类 | 控制显示/隐藏和动画 |

---

## 2. DOM Contract

### 2.1 推荐 HTML 结构

```html
<!-- 方案 A：使用 <dialog> 元素（推荐） -->
<dialog class="nb-modal-backdrop" aria-labelledby="modal-title-1" aria-describedby="modal-desc-1">
  <div class="nb-modal nb-modal--md" role="document">
    <header class="nb-modal__header">
      <h2 class="nb-modal__title" id="modal-title-1">对话框标题</h2>
      <button class="nb-modal__close" type="button" aria-label="关闭对话框">
        <span aria-hidden="true">×</span>
      </button>
    </header>
    <div class="nb-modal__body" id="modal-desc-1">
      <p>这里是模态框的主要内容。可以包含文本、表单、图片等任意内容。</p>
    </div>
    <footer class="nb-modal__footer">
      <button class="nb-btn nb-btn--ghost" type="button">取消</button>
      <button class="nb-btn nb-btn--primary" type="button">确认</button>
    </footer>
  </div>
</dialog>

<!-- 方案 B：使用 <div role="dialog">（降级方案） -->
<div class="nb-modal-backdrop" aria-hidden="true" role="presentation"></div>
<div class="nb-modal nb-modal--md" role="dialog" aria-modal="true" aria-labelledby="modal-title-2" aria-describedby="modal-desc-2">
  <div class="nb-modal__header">
    <h2 class="nb-modal__title" id="modal-title-2">对话框标题</h2>
    <button class="nb-modal__close" type="button" aria-label="关闭对话框">
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <div class="nb-modal__body" id="modal-desc-2">
    <p>这里是模态框的主要内容。</p>
  </div>
  <div class="nb-modal__footer">
    <button class="nb-btn nb-btn--ghost" type="button">取消</button>
    <button class="nb-btn nb-btn--primary" type="button">确认</button>
  </div>
</div>
```

### 2.2 必需与可选子元素

| 子元素 | 状态 | 说明 |
|--------|------|------|
| `.nb-modal__header` | 可选 | 包含标题和关闭按钮。无标题的确认框可省略。 |
| `.nb-modal__title` | 可选 | 当存在 header 时推荐。使用 `<h2>` 或 `<h3>`，确保页面标题层级正确。 |
| `.nb-modal__close` | 可选 | 当存在 header 时推荐。确认框可改为 footer 中的按钮关闭。 |
| `.nb-modal__body` | **必需** | 核心内容区域。 |
| `.nb-modal__footer` | 可选 | 操作按钮组。纯信息展示可省略。 |

### 2.3 ARIA 属性要求

| 属性 | 位置 | 值 | 说明 |
|------|------|-----|------|
| `role="dialog"` | `.nb-modal` | 必需 | 声明对话框语义。 |
| `aria-modal="true"` | `.nb-modal` | 必需 | 声明这是一个模态对话框，辅助技术应将焦点限制在其内部。 |
| `aria-labelledby` | `.nb-modal` | 指向 title ID | 为对话框提供可访问名称。 |
| `aria-describedby` | `.nb-modal` | 指向 body 内容 ID | 为对话框提供描述。 |
| `aria-label="关闭对话框"` | `.nb-modal__close` | 推荐 | 为关闭按钮提供可访问标签。 |
| `aria-hidden="true"` | 关闭按钮内图标 | 必需 | 纯视觉图标不应被朗读。 |
| `aria-busy="true"` | `.nb-modal` | 条件 | 加载状态时使用。 |
| `aria-live="polite"` | `.nb-modal__body` | 条件 | 动态内容更新时，确保屏幕阅读器朗读新内容。 |
| `aria-invalid="true"` | `.nb-modal` 或表单元素 | 条件 | 表单验证失败时。 |

### 2.4 键盘行为

| 按键 | 行为 | 说明 |
|------|------|------|
| `Tab` | 焦点在 Modal 内循环 | 焦点陷阱（Focus Trap）实现。顺序：header → body → footer 按钮。 |
| `Shift + Tab` | 反向焦点循环 | 同上。 |
| `Esc` | 关闭 Modal | 取消/关闭操作，无需确认。 |
| `Enter` | 激活当前焦点元素 | 如果焦点在默认操作按钮上，触发确认。 |
| `Space` | 激活按钮/复选框 | 标准行为。 |
| 焦点初始位置 | 自动聚焦 | 打开时焦点自动移至 `.nb-modal__close`（如存在）或第一个可交互元素。 |
| 焦点恢复 | 关闭后恢复 | 关闭时焦点应回到触发 Modal 的按钮上。 |

**焦点陷阱（Focus Trap）实现要点：**
- 打开 Modal 时，记录触发元素（`document.activeElement`）。
- 关闭 Modal 时，将焦点恢复至触发元素。
- 在 Modal 内监听 `Tab` 和 `Shift + Tab`，确保焦点不会离开 Modal。
- 当焦点在最后一个可交互元素上按 `Tab` 时，跳转到第一个可交互元素；反之亦然。

---

## 3. 尺寸与变体

### 3.1 尺寸阶梯

Modal 通过 `--nb-modal-width` 控制最大宽度，使用 `max-width` 而非 `width`，确保在小屏幕上自适应。

| 尺寸 | 类名 | max-width | padding | 典型场景 |
|------|------|-----------|---------|----------|
| **xs** | `.nb-modal--xs` | `20rem` (320px) | `1rem` | 简单确认、单行提示 |
| **sm** | `.nb-modal--sm` | `24rem` (384px) | `1rem` | 短表单、通知 |
| **md** | `.nb-modal--md` | `28rem` (448px) | `1.25rem` | 标准对话框（默认） |
| **lg** | `.nb-modal--lg` | `32rem` (512px) | `1.25rem` | 较长表单、详情展示 |
| **xl** | `.nb-modal--xl` | `40rem` (640px) | `1.5rem` | 复杂表单、宽表格 |
| **full** | `.nb-modal--full` | `100%` | `1.5rem` | 全宽、沉浸式内容 |

```css
.nb-modal {
  width: 100%;
  max-width: 28rem; /* md 为默认 */
  margin: auto;
}

.nb-modal--xs  { max-width: 20rem; }
.nb-modal--sm  { max-width: 24rem; }
.nb-modal--md  { max-width: 28rem; }
.nb-modal--lg  { max-width: 32rem; }
.nb-modal--xl  { max-width: 40rem; }
.nb-modal--full { max-width: 100%; }
```

### 3.2 颜色变体

颜色变体作用于 Modal 的头部（`.nb-modal__header`），用于快速传达对话框的情感色彩。

| 变体 | 类名 | 头部背景 | 头部文本 | 场景 |
|------|------|----------|----------|------|
| **neutral** | `.nb-modal`（默认） | `--nb-base-200` | `--nb-base-content` | 通用信息、默认对话框 |
| **primary** | `.nb-modal--primary` | `--nb-primary` | `--nb-primary-content` | 主操作确认、积极提示 |
| **danger** | `.nb-modal--danger` | `--nb-error` | `--nb-error-content` | 删除确认、危险操作 |
| **warning** | `.nb-modal--warning` | `--nb-warning` | `--nb-warning-content` | 警告提示、不可逆操作 |
| **success** | `.nb-modal--success` | `--nb-success` | `--nb-success-content` | 成功确认、完成提示 |

```css
/* 颜色变体通过 CSS 自定义属性覆盖 */
.nb-modal--primary .nb-modal__header {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
  border-bottom-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
}

.nb-modal--danger .nb-modal__header {
  background-color: var(--nb-error);
  color: var(--nb-error-content);
  border-bottom-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
}

.nb-modal--warning .nb-modal__header {
  background-color: var(--nb-warning);
  color: var(--nb-warning-content);
  border-bottom-color: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
}

.nb-modal--success .nb-modal__header {
  background-color: var(--nb-success);
  color: var(--nb-success-content);
  border-bottom-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
}
```

### 3.3 布局变体

| 变体 | 类名 | 说明 | CSS 规则 |
|------|------|------|----------|
| **scrollable** | `.nb-modal--scrollable` | body 区域可垂直滚动 | `.nb-modal__body { max-height: 60vh; overflow-y: auto; }` |
| **centered** | `.nb-modal`（默认） | 垂直水平居中 | `margin: auto; align-self: center;` |
| **bottom-sheet** | `.nb-modal--sheet` | 移动端底部弹窗 | 详见§3.4 |
| **fullscreen** | `.nb-modal--fullscreen` | 全屏覆盖 | `max-width: 100%; min-height: 100vh; border: none;` |
| **static** | `.nb-modal--static` | 点击遮罩不关闭 | 需 JS 配合，忽略 backdrop 点击 |

### 3.4 移动端底部弹窗（Bottom Sheet）

```css
@media (max-width: 768px) {
  .nb-modal--sheet {
    max-width: 100%;
    margin-block-start: auto; /* 推到底部 */
    margin-block-end: 0;
    border-radius: var(--nb-radius-overlay-exception) var(--nb-radius-overlay-exception) 0 0; /* 4px 顶部圆角 */
    box-shadow: 0 -4px 0 0 var(--nb-shadow-color); /* 顶部阴影 */
    animation: nb-modal-sheet-enter var(--nb-duration-slow) var(--nb-ease-out);
  }

  @keyframes nb-modal-sheet-enter {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }

  @keyframes nb-modal-sheet-exit {
    from { transform: translateY(0); }
    to   { transform: translateY(100%); }
  }

  .nb-modal-backdrop:has(.nb-modal--sheet) {
    align-items: flex-end; /* 底部对齐 */
  }
}
```

---

## 4. 状态矩阵

> **说明**：Modal 是一个覆盖层容器组件，其状态系统与交互式按压组件（如 Button、Card）有显著差异。以下状态针对 **Modal 对话框主体**（`.nb-modal`）和 **遮罩层**（`.nb-modal-backdrop`）分别描述。

### 4.1 Modal 对话框主体（.nb-modal）状态矩阵

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 说明 |
|------|------|------|------|------|--------|------|------|
| **Default** | 2px solid `var(--nb-border)` | `--nb-shadow-none` | none | `var(--nb-base-100)` 背景 | 1.0 | 无 | 关闭/隐藏状态 |
| **Hover** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | Modal 本身不可悬停 |
| **Active / Pressed** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | Modal 本身不可按压 |
| **Focus Visible** | 2px solid `var(--nb-focus)` | `--nb-shadow-xl` | none | 不变 | 1.0 | 100ms standard | 焦点在内部可交互元素时，外部显示焦点环 |
| **Disabled** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | Modal 不可禁用 |
| **Loading / Busy** | 2px solid `var(--nb-border)` | `--nb-shadow-xl` | none | 不变 | 1.0 | Loading 脉冲 | `aria-busy="true"`，body 内容被遮罩，spinner 覆盖 |
| **Invalid** | 2px solid `var(--nb-error)` + 3px `inline-start` | `--nb-shadow-xl` | none | 微红底色 | 1.0 | 100ms standard | 表单验证失败，应用于包含表单的场景 |
| **Valid** | 2px solid `var(--nb-success)` | `--nb-shadow-xl` | none | 微绿底色 | 1.0 | 100ms standard | 表单验证通过（可选） |
| **Selected / Checked** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | Modal 无选中状态 |
| **Open / Expanded** | 2px solid `var(--nb-border)` | `--nb-shadow-xl` | none | 不变 | 1.0 | 250ms standard | 打开状态，可见，入场动画 |
| **Readonly** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | Modal 无只读状态 |
| **Dragging** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | Modal 不支持拖拽 |

### 4.2 遮罩层（.nb-modal-backdrop）状态矩阵

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 说明 |
|------|------|------|------|------|--------|------|------|
| **Default** | none | none | none | `var(--nb-overlay)` | 0（隐藏） | 无 | 关闭状态，不可见 |
| **Open** | none | none | none | `var(--nb-overlay)` | 0.3 | 250ms standard | 打开状态，半透明遮罩覆盖全屏 |
| **Disabled** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | **N/A** | 遮罩不可禁用 |
| **Loading** | none | none | none | `var(--nb-overlay)` | 0.5 | 250ms standard | 内容加载时遮罩加深，阻止交互 |

### 4.3 内部交互元素状态（关闭按钮、Footer 按钮）

Modal 内部的关闭按钮（`.nb-modal__close`）和 Footer 按钮继承标准交互组件状态（Button 规范），遵循以下状态变化：

| 状态 | 阴影 | 位移 | 说明 |
|------|------|------|------|
| **Default** | `--nb-shadow-sm` | none | 关闭按钮默认有小阴影 |
| **Hover** | `--nb-shadow-md` | `translate(-2px, -2px)` | 悬停提升 |
| **Active** | `--nb-shadow-none` | `translate(2px, 2px)` | 按下（关闭按钮使用 sm 阴影，Active 位移 2px） |
| **Focus Visible** | 不变 | none | `outline: 2px solid var(--nb-focus)` |
| **Disabled** | none | none | opacity: 0.5, cursor: not-allowed |

---

## 5. 阴影与位移规则

### 5.1 阴影策略

Modal 属于 **Overlay 类别** 的 **大型组件**，根据 `shadows-and-motion.md` 规范：

| 元素 | 默认阴影 | 理由 |
|------|----------|------|
| `.nb-modal`（关闭） | `--nb-shadow-none` | 隐藏时无阴影 |
| `.nb-modal`（打开） | `--nb-shadow-xl` | 大型覆盖组件，需要最高层级阴影以强调浮起感 |
| `.nb-modal__close` | `--nb-shadow-sm` | 小型交互按钮 |
| `.nb-modal--sheet` | 顶部阴影 `0 -4px 0 0` | 底部弹窗的特殊顶部阴影，模拟从底部浮起 |

**注意**：Modal 本身不是可按压的交互表面，因此 **Hover 时阴影不升级**，**Active 时阴影不归零**。Modal 的打开/关闭动画通过 `opacity` 和 `transform` 的缩放/位移实现，而非阴影变化。

### 5.2 打开/关闭动画

```css
/* 打开动画：从下方缩放淡入 */
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

/* 关闭动画：缩放淡出 */
@keyframes nb-modal-exit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
}

/* 遮罩层淡入 */
@keyframes nb-modal-backdrop-enter {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* 遮罩层淡出 */
@keyframes nb-modal-backdrop-exit {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

### 5.3 过渡属性

```css
.nb-modal {
  transition: opacity var(--nb-duration-slow) var(--nb-ease-standard),
              transform var(--nb-duration-slow) var(--nb-ease-standard),
              box-shadow var(--nb-duration-slow) var(--nb-ease-standard);
}

.nb-modal-backdrop {
  transition: opacity var(--nb-duration-slow) var(--nb-ease-standard);
}
```

### 5.4 内部关闭按钮的位移规则

```css
.nb-modal__close {
  box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  transform: translate(0, 0);
  transition: transform var(--nb-duration-normal) var(--nb-ease-standard),
              box-shadow var(--nb-duration-normal) var(--nb-ease-standard);
  will-change: transform, box-shadow;
}

.nb-modal__close:hover {
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  transform: translate(-2px, -2px);
}

.nb-modal__close:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(2px, 2px);
}
```

---

## 6. 圆角与边框

### 6.1 圆角 Token

Modal 属于 **Overlay 类别**，使用 Overlay 专用圆角 Token：

| Token | 值 | 用途 |
|-------|-----|------|
| `--nb-radius-overlay` | `0px` | Modal 默认圆角（直角） |
| `--nb-radius-overlay-exception` | `4px` | 移动端底部弹窗顶部圆角例外 |

```css
.nb-modal {
  border-radius: var(--nb-radius-overlay); /* 0px — 默认直角 */
}

/* 移动端底部弹窗顶部圆角例外 */
@media (max-width: 768px) {
  .nb-modal--sheet {
    border-radius: var(--nb-radius-overlay-exception) var(--nb-radius-overlay-exception) 0 0;
  }
}
```

### 6.2 边框规则

| 元素 | 边框宽度 | 边框样式 | 边框颜色 | 说明 |
|------|----------|----------|----------|------|
| `.nb-modal` | 2px | solid | `var(--nb-border-overlay-color)` | 主容器边框 |
| `.nb-modal__header` | 0 0 2px 0 | solid | `var(--nb-border-overlay-color)` | 底部边框分隔 |
| `.nb-modal__footer` | 2px 0 0 0 | solid | `var(--nb-border-overlay-color)` | 顶部边框分隔 |
| `.nb-modal__close` | 2px | solid | `var(--nb-border-overlay-color)` | 关闭按钮边框 |

```css
:root {
  --nb-border-overlay-color: color-mix(in oklch, var(--nb-base-content) 20%, transparent);
}

.nb-modal {
  border: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
}

.nb-modal__header {
  border-bottom: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
}

.nb-modal__footer {
  border-top: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
}

.nb-modal__close {
  border: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
}
```

### 6.3 颜色变体边框适配

颜色变体（primary/danger/warning/success）的头部边框需要基于其内容色动态计算：

```css
.nb-modal--primary .nb-modal__header {
  --nb-base-content: var(--nb-primary-content); /* 覆盖内容色变量 */
  border-bottom-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
}

.nb-modal--danger .nb-modal__header {
  --nb-base-content: var(--nb-error-content);
  border-bottom-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
}

.nb-modal--warning .nb-modal__header {
  --nb-base-content: var(--nb-warning-content);
  border-bottom-color: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
}

.nb-modal--success .nb-modal__header {
  --nb-base-content: var(--nb-success-content);
  border-bottom-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
}
```

---

## 7. 颜色策略

### 7.1 颜色 Token 使用规则

| 元素 | 背景色 | 文本色 | 边框色 | 说明 |
|------|--------|--------|--------|------|
| `.nb-modal` | `var(--nb-base-100)` | `var(--nb-base-content)` | `var(--nb-border-overlay-color)` | 对话框主体 |
| `.nb-modal__header` | `var(--nb-base-200)` | `var(--nb-base-content)` | `var(--nb-border-overlay-color)` | 默认头部 |
| `.nb-modal__body` | `var(--nb-base-100)` | `var(--nb-base-content)` | none | 内容区域 |
| `.nb-modal__footer` | `var(--nb-base-200)` | `var(--nb-base-content)` | `var(--nb-border-overlay-color)` | 底部操作区 |
| `.nb-modal__close` | `var(--nb-base-100)` | `var(--nb-base-content)` | `var(--nb-border-overlay-color)` | 关闭按钮 |
| `.nb-modal-backdrop` | `var(--nb-overlay)` | — | none | 遮罩层（配合透明度） |

### 7.2 颜色变体详细映射

```css
/* === 默认（neutral） === */
.nb-modal .nb-modal__header {
  background-color: var(--nb-base-200);
  color: var(--nb-base-content);
}

/* === 主色（primary） === */
.nb-modal--primary .nb-modal__header {
  background-color: var(--nb-primary);
  color: var(--nb-primary-content);
}

/* === 危险（danger） === */
.nb-modal--danger .nb-modal__header {
  background-color: var(--nb-error);
  color: var(--nb-error-content);
}

/* === 警告（warning） === */
.nb-modal--warning .nb-modal__header {
  background-color: var(--nb-warning);
  color: var(--nb-warning-content);
}

/* === 成功（success） === */
.nb-modal--success .nb-modal__header {
  background-color: var(--nb-success);
  color: var(--nb-success-content);
}
```

### 7.3 使用 color-mix 的动态颜色

```css
/* 关闭按钮 Hover 背景色微调（基于当前内容色） */
.nb-modal__close:hover {
  background-color: color-mix(in oklch, var(--nb-base-content) 10%, var(--nb-base-100));
}

/* 关闭按钮 Active 背景色微调 */
.nb-modal__close:active {
  background-color: color-mix(in oklch, var(--nb-base-content) 20%, var(--nb-base-100));
}

/* 颜色变体头部关闭按钮的 Hover 背景 */
.nb-modal--primary .nb-modal__close:hover {
  background-color: color-mix(in oklch, var(--nb-primary-content) 15%, var(--nb-primary));
}

.nb-modal--danger .nb-modal__close:hover {
  background-color: color-mix(in oklch, var(--nb-error-content) 15%, var(--nb-error));
}

/* Loading 状态遮罩色 */
.nb-modal--loading::after {
  background-color: color-mix(in oklch, var(--nb-base-100) 80%, transparent);
}

/* Invalid 状态微红底色 */
.nb-modal--invalid .nb-modal__body {
  background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
}

/* Valid 状态微绿底色 */
.nb-modal--valid .nb-modal__body {
  background-color: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
}
```

---

## 8. 可访问性要求

### 8.1 键盘可操作性

| 要求 | 实现 | 说明 |
|------|------|------|
| **Tab 顺序** | 焦点陷阱 | 打开时焦点限制在 Modal 内部，Tab 在最后元素与第一个元素之间循环。 |
| **Esc 关闭** | `keydown` 监听 | 按 `Esc` 触发关闭，关闭时焦点返回触发元素。 |
| **Enter 确认** | 默认按钮激活 | 当焦点在默认操作按钮上时，按 `Enter` 触发确认。 |
| **焦点初始位置** | 自动聚焦 | 打开时焦点自动移至第一个可交互元素（推荐关闭按钮或主操作按钮）。 |
| **焦点恢复** | 关闭后恢复 | 关闭时 `document.activeElement` 恢复为打开前的触发元素。 |

```javascript
// 焦点陷阱伪代码
function trapFocus(modal) {
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}
```

### 8.2 :focus-visible 样式

```css
/* Modal 内部所有可交互元素的焦点样式 */
.nb-modal button:focus-visible,
.nb-modal [href]:focus-visible,
.nb-modal input:focus-visible,
.nb-modal select:focus-visible,
.nb-modal textarea:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

/* 关闭按钮焦点样式 */
.nb-modal__close:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  /* 不修改 transform 或 box-shadow，避免与 Hover 冲突 */
}

/* Hover + Focus 共存 */
.nb-modal__close:hover:focus-visible {
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  transform: translate(-2px, -2px);
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}
```

### 8.3 ARIA 属性完整清单

```html
<dialog
  class="nb-modal-backdrop"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
  aria-modal="true"
>
  <div class="nb-modal nb-modal--md" role="document">
    <header class="nb-modal__header">
      <h2 class="nb-modal__title" id="modal-title">确认删除</h2>
      <button class="nb-modal__close" type="button" aria-label="关闭对话框">
        <span aria-hidden="true">×</span>
      </button>
    </header>
    <div class="nb-modal__body" id="modal-desc">
      <p>此操作不可撤销。确定要删除此项吗？</p>
    </div>
    <footer class="nb-modal__footer">
      <button class="nb-btn nb-btn--ghost" type="button">取消</button>
      <button class="nb-btn nb-btn--danger" type="button">删除</button>
    </footer>
  </div>
</dialog>
```

### 8.4 RTL 适配

所有涉及方向的属性必须使用 **Logical Properties**（逻辑属性）：

| 物理属性 | 逻辑属性 | 说明 |
|----------|----------|------|
| `margin-left` | `margin-inline-start` | 关闭按钮在 RTL 中自动移至左侧 |
| `margin-right` | `margin-inline-end` | 标题与关闭按钮间距 |
| `text-align: left` | `text-align: start` | 文本对齐 |
| `text-align: right` | `text-align: end` | 文本对齐 |
| `border-left` | `border-inline-start` | 强调边框 |
| `border-right` | `border-inline-end` | 强调边框 |
| `left` | `inset-inline-start` | 定位 |
| `right` | `inset-inline-end` | 定位 |

```css
.nb-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem; /* 使用 gap 替代方向性 margin */
}

.nb-modal__title {
  margin: 0;
  text-align: start; /* 逻辑属性 */
}

.nb-modal__footer {
  display: flex;
  justify-content: flex-end; /* 在 RTL 中自动反转 */
  gap: 0.75rem;
}

/* Invalid 状态的 3px 强调边框 */
.nb-modal--invalid .nb-modal__body {
  border-inline-start-width: 3px;
  border-inline-start-color: var(--nb-error);
}
```

### 8.5 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-modal,
  .nb-modal-backdrop,
  .nb-modal.is-open,
  .nb-modal-backdrop.is-open {
    /* 取消所有动画过渡 */
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }

  /* 保留即时状态切换，无动画 */
  .nb-modal {
    opacity: 1; /* 直接显示，无淡入 */
  }

  .nb-modal:not(.is-open) {
    opacity: 0; /* 直接隐藏，无淡出 */
  }

  .nb-modal-backdrop:not(.is-open) {
    opacity: 0;
  }

  .nb-modal-backdrop.is-open {
    opacity: 0.3;
  }

  /* 内部关闭按钮也取消动画 */
  .nb-modal__close {
    transition: none !important;
    transform: none !important;
  }

  .nb-modal__close:hover {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  }

  .nb-modal__close:active {
    box-shadow: var(--nb-shadow-none);
  }
}
```

### 8.6 forced-colors（高对比度模式）

```css
@media (forced-colors: active) {
  .nb-modal {
    border: 2px solid CanvasText; /* 使用系统高对比色 */
    forced-color-adjust: none; /* 保留自定义样式 */
  }

  .nb-modal__header,
  .nb-modal__footer {
    border-color: CanvasText;
  }

  .nb-modal-backdrop {
    background-color: Canvas; /* 系统背景色 */
    opacity: 0.9; /* 更高透明度 */
  }

  .nb-modal__close {
    border: 2px solid CanvasText;
  }

  .nb-modal__close:focus-visible,
  .nb-modal button:focus-visible,
  .nb-modal a:focus-visible {
    outline: 2px solid Highlight; /* 系统高对比焦点色 */
    outline-offset: 2px;
  }

  /* 颜色变体在高对比度模式下简化 */
  .nb-modal--primary .nb-modal__header,
  .nb-modal--danger .nb-modal__header,
  .nb-modal--warning .nb-modal__header,
  .nb-modal--success .nb-modal__header {
    background-color: Canvas;
    color: CanvasText;
    border-color: CanvasText;
  }
}
```

### 8.7 320px 移动端可用性

```css
/* 最小屏幕适配 */
@media (max-width: 320px) {
  .nb-modal {
    max-width: 100%;
    margin: 0.5rem;
  }

  .nb-modal__header,
  .nb-modal__body,
  .nb-modal__footer {
    padding: 0.75rem 1rem; /* 减小 padding */
  }

  .nb-modal__footer {
    flex-direction: column; /* 按钮垂直堆叠 */
    gap: 0.5rem;
  }

  .nb-modal__footer .nb-btn {
    width: 100%; /* 按钮全宽 */
  }
}
```

### 8.8 200% 缩放测试

```css
/* 200% 缩放测试要点：
   - 确保所有内容在 200% 缩放下仍然可见
   - 文本不应截断或溢出
   - 可交互元素保持最小 44×44px 点击区域
   - 滚动条在需要时自动出现
*/

.nb-modal--scrollable .nb-modal__body {
  max-height: 60vh;
  overflow-y: auto;
  /* 确保 200% 缩放下仍可滚动浏览全部内容 */
}

/* 在 200% 缩放下，Modal 最大高度限制 */
@media (min-resolution: 192dpi) {
  .nb-modal {
    max-height: 90vh;
    overflow-y: auto;
  }
}
```

---

## 9. 完整 CSS 示例

### 9.1 CSS 变量预设（需放入 tokens.css）

```css
/* =============================================
   Neo-Brutal UI — Modal Tokens
   ============================================= */

:root {
  /* ---- Modal 专用变量 ---- */
  --nb-modal-width: 28rem;
  --nb-modal-padding: 1.25rem;
  --nb-modal-z-index: 1050;
  --nb-modal-backdrop-z-index: 1040;

  /* ---- 阴影（引用全局 Token） ---- */
  --nb-shadow-none: 0px 0px 0;
  --nb-shadow-xs: 1px 1px 0;
  --nb-shadow-sm: 2px 2px 0;
  --nb-shadow-md: 4px 4px 0;
  --nb-shadow-lg: 6px 6px 0;
  --nb-shadow-xl: 8px 8px 0;
  --nb-shadow-color: color-mix(in oklch, var(--nb-base-content) 25%, transparent);

  /* ---- Overlay 边框 ---- */
  --nb-border-overlay: 2px;
  --nb-border-overlay-color: color-mix(in oklch, var(--nb-base-content) 20%, transparent);

  /* ---- 圆角 ---- */
  --nb-radius-overlay: 0px;
  --nb-radius-overlay-exception: 4px;

  /* ---- 过渡 ---- */
  --nb-duration-fast: 100ms;
  --nb-duration-normal: 150ms;
  --nb-duration-slow: 250ms;
  --nb-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --nb-ease-out: cubic-bezier(0, 0, 0.2, 1);

  /* ---- 焦点色 ---- */
  --nb-focus: oklch(70% 0.15 250);

  /* ---- 颜色 ---- */
  --nb-base-100: #ffffff;
  --nb-base-200: #f3f3f3;
  --nb-base-300: #e8e8e8;
  --nb-base-content: #1a1a1a;
  --nb-primary: oklch(60% 0.2 250);
  --nb-primary-content: #ffffff;
  --nb-error: oklch(55% 0.22 25);
  --nb-error-content: #ffffff;
  --nb-warning: oklch(75% 0.15 85);
  --nb-warning-content: #1a1a1a;
  --nb-success: oklch(65% 0.18 145);
  --nb-success-content: #ffffff;
  --nb-overlay: #000000;
  --nb-overlay-opacity: 0.3;
}
```

### 9.2 完整 Modal CSS（使用 @layer）

```css
/* =============================================
   Neo-Brutal UI — Modal Component
   ============================================= */

@layer nb.components {

  /* ---- 1. Backdrop 遮罩层 ---- */
  .nb-modal-backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background-color: color-mix(in oklch, var(--nb-overlay) 30%, transparent);
    z-index: var(--nb-modal-backdrop-z-index, 1040);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--nb-duration-slow) var(--nb-ease-standard),
                visibility var(--nb-duration-slow) var(--nb-ease-standard);
  }

  .nb-modal-backdrop.is-open {
    opacity: 1;
    visibility: visible;
  }

  /* ---- 2. Modal 对话框主体 ---- */
  .nb-modal {
    position: relative;
    width: 100%;
    max-width: var(--nb-modal-width, 28rem);
    background-color: var(--nb-base-100);
    border: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
    border-radius: var(--nb-radius-overlay);
    box-shadow: var(--nb-shadow-xl) var(--nb-shadow-color);
    overflow: hidden;
    opacity: 0;
    transform: translateY(8px) scale(0.98);
    transition: opacity var(--nb-duration-slow) var(--nb-ease-standard),
                transform var(--nb-duration-slow) var(--nb-ease-standard);
  }

  .nb-modal.is-open {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  /* ---- 3. Header ---- */
  .nb-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    border-bottom: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
    background-color: var(--nb-base-200);
  }

  .nb-modal__title {
    margin: 0;
    font-weight: var(--nb-weight-semibold, 600);
    font-size: 1.125rem;
    line-height: 1.25;
    color: inherit;
  }

  /* ---- 4. Close Button ---- */
  .nb-modal__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background-color: var(--nb-base-100);
    color: var(--nb-base-content);
    border: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
    border-radius: var(--nb-radius-overlay);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
    transform: translate(0, 0);
    transition: transform var(--nb-duration-normal) var(--nb-ease-standard),
                box-shadow var(--nb-duration-normal) var(--nb-ease-standard),
                background-color var(--nb-duration-fast) var(--nb-ease-standard);
    will-change: transform, box-shadow;
    -webkit-tap-highlight-color: transparent;
  }

  .nb-modal__close:hover {
    background-color: color-mix(in oklch, var(--nb-base-content) 10%, var(--nb-base-100));
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  .nb-modal__close:active {
    background-color: color-mix(in oklch, var(--nb-base-content) 20%, var(--nb-base-100));
    box-shadow: var(--nb-shadow-none);
    transform: translate(2px, 2px);
  }

  .nb-modal__close:focus-visible {
    outline: 2px solid var(--nb-focus);
    outline-offset: 2px;
  }

  .nb-modal__close:hover:focus-visible {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  /* ---- 5. Body ---- */
  .nb-modal__body {
    padding: 1.25rem;
    background-color: var(--nb-base-100);
    color: var(--nb-base-content);
  }

  .nb-modal--scrollable .nb-modal__body {
    max-height: 60vh;
    overflow-y: auto;
  }

  /* ---- 6. Footer ---- */
  .nb-modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-top: var(--nb-border-overlay) solid var(--nb-border-overlay-color);
    background-color: var(--nb-base-200);
  }

  /* ---- 7. 尺寸变体 ---- */
  .nb-modal--xs  { max-width: 20rem; }
  .nb-modal--sm  { max-width: 24rem; }
  .nb-modal--md  { max-width: 28rem; }
  .nb-modal--lg  { max-width: 32rem; }
  .nb-modal--xl  { max-width: 40rem; }
  .nb-modal--full { max-width: 100%; }

  /* ---- 8. 颜色变体 ---- */
  .nb-modal--primary .nb-modal__header {
    background-color: var(--nb-primary);
    color: var(--nb-primary-content);
    border-bottom-color: color-mix(in oklch, var(--nb-primary-content) 20%, transparent);
  }

  .nb-modal--danger .nb-modal__header {
    background-color: var(--nb-error);
    color: var(--nb-error-content);
    border-bottom-color: color-mix(in oklch, var(--nb-error-content) 20%, transparent);
  }

  .nb-modal--warning .nb-modal__header {
    background-color: var(--nb-warning);
    color: var(--nb-warning-content);
    border-bottom-color: color-mix(in oklch, var(--nb-warning-content) 20%, transparent);
  }

  .nb-modal--success .nb-modal__header {
    background-color: var(--nb-success);
    color: var(--nb-success-content);
    border-bottom-color: color-mix(in oklch, var(--nb-success-content) 20%, transparent);
  }

  /* 颜色变体关闭按钮适配 */
  .nb-modal--primary .nb-modal__close:hover {
    background-color: color-mix(in oklch, var(--nb-primary-content) 15%, var(--nb-primary));
  }
  .nb-modal--danger .nb-modal__close:hover {
    background-color: color-mix(in oklch, var(--nb-error-content) 15%, var(--nb-error));
  }
  .nb-modal--warning .nb-modal__close:hover {
    background-color: color-mix(in oklch, var(--nb-warning-content) 15%, var(--nb-warning));
  }
  .nb-modal--success .nb-modal__close:hover {
    background-color: color-mix(in oklch, var(--nb-success-content) 15%, var(--nb-success));
  }

  /* ---- 9. Loading 状态 ---- */
  .nb-modal--loading {
    position: relative;
  }

  .nb-modal--loading::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: color-mix(in oklch, var(--nb-base-100) 80%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .nb-modal--loading::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.5rem;
    height: 1.5rem;
    background-color: var(--nb-primary);
    border: 2px solid var(--nb-border-overlay-color);
    z-index: 11;
    animation: nb-loading-pulse 1s steps(2) infinite;
    transform: translate(-50%, -50%);
  }

  @keyframes nb-loading-pulse {
    0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50%      { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
  }

  /* ---- 10. Invalid 状态 ---- */
  .nb-modal--invalid .nb-modal__body {
    border-inline-start-width: 3px;
    border-inline-start-color: var(--nb-error);
    border-inline-start-style: solid;
    background-color: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
  }

  /* ---- 11. Valid 状态 ---- */
  .nb-modal--valid .nb-modal__body {
    border-inline-start-color: var(--nb-success);
    border-inline-start-width: 3px;
    border-inline-start-style: solid;
    background-color: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
  }

  /* ---- 12. 移动端底部弹窗 ---- */
  @media (max-width: 768px) {
    .nb-modal--sheet {
      max-width: 100%;
      margin-block-start: auto;
      margin-block-end: 0;
      border-radius: var(--nb-radius-overlay-exception) var(--nb-radius-overlay-exception) 0 0;
      box-shadow: 0 -4px 0 0 var(--nb-shadow-color);
      animation: nb-modal-sheet-enter var(--nb-duration-slow) var(--nb-ease-out);
    }

    .nb-modal--sheet:not(.is-open) {
      animation: nb-modal-sheet-exit var(--nb-duration-slow) var(--nb-ease-standard);
    }

    .nb-modal-backdrop:has(.nb-modal--sheet) {
      align-items: flex-end;
    }

    @keyframes nb-modal-sheet-enter {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }

    @keyframes nb-modal-sheet-exit {
      from { transform: translateY(0); }
      to   { transform: translateY(100%); }
    }
  }

  /* ---- 13. 全屏变体 ---- */
  .nb-modal--fullscreen {
    max-width: 100%;
    min-height: 100vh;
    border: none;
    border-radius: 0;
    margin: 0;
  }

  .nb-modal--fullscreen .nb-modal__body {
    flex: 1 1 auto;
    overflow-y: auto;
  }

  /* ---- 14. 最小屏幕适配（320px） ---- */
  @media (max-width: 320px) {
    .nb-modal {
      max-width: 100%;
      margin: 0.5rem;
    }

    .nb-modal__header,
    .nb-modal__body,
    .nb-modal__footer {
      padding: 0.75rem 1rem;
    }

    .nb-modal__footer {
      flex-direction: column;
      gap: 0.5rem;
    }

    .nb-modal__footer .nb-btn {
      width: 100%;
    }
  }

  /* ---- 15. prefers-reduced-motion ---- */
  @media (prefers-reduced-motion: reduce) {
    .nb-modal,
    .nb-modal-backdrop {
      transition: none !important;
      animation: none !important;
    }

    .nb-modal.is-open {
      opacity: 1;
      transform: none;
    }

    .nb-modal:not(.is-open) {
      opacity: 0;
      transform: none;
    }

    .nb-modal__close {
      transition: none !important;
      transform: none !important;
    }

    .nb-modal__close:hover {
      box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    }

    .nb-modal__close:active {
      box-shadow: var(--nb-shadow-none);
    }
  }

  /* ---- 16. forced-colors ---- */
  @media (forced-colors: active) {
    .nb-modal {
      border: 2px solid CanvasText;
      forced-color-adjust: none;
    }

    .nb-modal__header,
    .nb-modal__footer {
      border-color: CanvasText;
    }

    .nb-modal-backdrop {
      background-color: Canvas;
      opacity: 0.9;
    }

    .nb-modal__close {
      border: 2px solid CanvasText;
    }

    .nb-modal__close:focus-visible,
    .nb-modal button:focus-visible,
    .nb-modal a:focus-visible {
      outline: 2px solid Highlight;
      outline-offset: 2px;
    }

    .nb-modal--primary .nb-modal__header,
    .nb-modal--danger .nb-modal__header,
    .nb-modal--warning .nb-modal__header,
    .nb-modal--success .nb-modal__header {
      background-color: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
  }

} /* end @layer nb.components */
```

### 9.3 使用 HTML 示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neo-Brutal UI — Modal 示例</title>
  <link rel="stylesheet" href="neo-brutal-ui.css">
</head>
<body>

  <!-- 触发按钮 -->
  <button class="nb-btn nb-btn--primary" type="button" onclick="document.getElementById('demo-modal').showModal()">
    打开对话框
  </button>

  <!-- 标准 Modal -->
  <dialog id="demo-modal" class="nb-modal-backdrop" aria-labelledby="demo-title" aria-describedby="demo-desc">
    <div class="nb-modal nb-modal--md" role="document">
      <header class="nb-modal__header">
        <h2 class="nb-modal__title" id="demo-title">确认操作</h2>
        <button class="nb-modal__close" type="button" onclick="document.getElementById('demo-modal').close()" aria-label="关闭对话框">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="nb-modal__body" id="demo-desc">
        <p>您确定要执行此操作吗？此操作不可撤销。</p>
      </div>
      <footer class="nb-modal__footer">
        <button class="nb-btn nb-btn--ghost" type="button" onclick="document.getElementById('demo-modal').close()">取消</button>
        <button class="nb-btn nb-btn--primary" type="button">确认</button>
      </footer>
    </div>
  </dialog>

  <!-- 危险确认 Modal -->
  <dialog id="danger-modal" class="nb-modal-backdrop" aria-labelledby="danger-title">
    <div class="nb-modal nb-modal--sm nb-modal--danger" role="document">
      <header class="nb-modal__header">
        <h2 class="nb-modal__title" id="danger-title">删除确认</h2>
        <button class="nb-modal__close" type="button" onclick="document.getElementById('danger-modal').close()" aria-label="关闭对话框">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="nb-modal__body">
        <p>此操作将永久删除该项目及其所有关联数据。确定要继续吗？</p>
      </div>
      <footer class="nb-modal__footer">
        <button class="nb-btn nb-btn--ghost" type="button" onclick="document.getElementById('danger-modal').close()">取消</button>
        <button class="nb-btn nb-btn--danger" type="button">删除</button>
      </footer>
    </div>
  </dialog>

  <!-- 可滚动内容 Modal -->
  <dialog id="scrollable-modal" class="nb-modal-backdrop" aria-labelledby="scroll-title">
    <div class="nb-modal nb-modal--lg nb-modal--scrollable" role="document">
      <header class="nb-modal__header">
        <h2 class="nb-modal__title" id="scroll-title">服务条款</h2>
        <button class="nb-modal__close" type="button" onclick="document.getElementById('scrollable-modal').close()" aria-label="关闭对话框">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="nb-modal__body">
        <p>这里是大量可滚动的服务条款内容...</p>
        <p>（重复多次以演示滚动效果）</p>
      </div>
      <footer class="nb-modal__footer">
        <button class="nb-btn nb-btn--primary" type="button">同意并继续</button>
      </footer>
    </div>
  </dialog>

  <!-- 加载中 Modal -->
  <dialog id="loading-modal" class="nb-modal-backdrop" aria-labelledby="loading-title" aria-busy="true">
    <div class="nb-modal nb-modal--xs nb-modal--loading" role="document">
      <header class="nb-modal__header">
        <h2 class="nb-modal__title" id="loading-title">处理中</h2>
      </header>
      <div class="nb-modal__body">
        <p>正在提交数据，请稍候...</p>
      </div>
    </div>
  </dialog>

</body>
</html>
```

---

## 10. 检查清单

以下验收项必须与阶段 2.7 的验收标准对齐，全部通过后方可进入组件实现阶段。

### 10.1 视觉规范检查

- [ ] **类名前缀**：所有公共类名以 `nb-` 为前缀，无无前缀的通用类名。
- [ ] **阴影**：Modal 打开状态使用 `--nb-shadow-xl`（8px 8px 0），无模糊、无扩散。
- [ ] **阴影颜色**：使用 `color-mix(in oklch, var(--nb-base-content) 25%, transparent)`，非固定 `#000`。
- [ ] **边框**：所有边框使用 2px solid，颜色通过 `color-mix` 动态计算。
- [ ] **圆角**：默认 `var(--nb-radius-overlay)` = 0px，仅移动端底部弹窗使用 `var(--nb-radius-overlay-exception)` = 4px 顶部。
- [ ] **颜色**：无硬编码 `#hex` 或未经批准的 `oklch()`，全部使用语义 Token。
- [ ] **背景**：纯色背景，无渐变、无噪点/纹理。

### 10.2 交互规范检查

- [ ] **打开动画**：使用 `translateY(8px) scale(0.98)` 到 `translateY(0) scale(1)`，时长 250ms。
- [ ] **关闭动画**：反向动画，时长 250ms。
- [ ] **遮罩过渡**：透明度 0 → 0.3，时长 250ms。
- [ ] **内部按钮**：关闭按钮遵循标准按压组件状态（Hover 位移 -2px，Active 位移 2px）。
- [ ] **过渡时长**：打开/关闭 ≤ 250ms，内部按钮状态 ≤ 150ms。
- [ ] **缓动**：使用 `cubic-bezier(0.4, 0, 0.2, 1)`（标准）或 `cubic-bezier(0, 0, 0.2, 1)`（出场）。
- [ ] **transform 优先**：所有位移使用 `transform: translate()`，不使用 `margin` 或 `position`。
- [ ] **触摸设备**：不依赖 Hover，关闭按钮提供 `:active` 反馈。
- [ ] **无弹性动画**：无 bounce、elastic 或过度平滑的缓动。

### 10.3 状态检查

- [ ] **Default 状态**：关闭/隐藏，阴影 none，opacity 0。
- [ ] **Open 状态**：显示，阴影 xl，opacity 1，有入场动画。
- [ ] **Hover**：标记为 N/A（Modal 本身不可悬停）。
- [ ] **Active / Pressed**：标记为 N/A（Modal 本身不可按压）。
- [ ] **Focus Visible**：内部可交互元素有 2px outline，offset 2px，颜色 `--nb-focus`。
- [ ] **Disabled**：标记为 N/A（Modal 本身不可禁用）。
- [ ] **Loading**：`aria-busy="true"`，body 内容被遮罩，spinner 居中，尺寸不变。
- [ ] **Invalid**：边框变 `--nb-error`，3px inline-start 强调边框，微红底色。
- [ ] **Valid**：边框变 `--nb-success`，3px inline-start 强调边框，微绿底色。
- [ ] **Selected / Checked**：标记为 N/A。
- [ ] **Readonly**：标记为 N/A。

### 10.4 可访问性检查

- [ ] **焦点陷阱**：打开时焦点限制在 Modal 内部，Tab 在内部循环。
- [ ] **Esc 关闭**：按 `Esc` 关闭 Modal，焦点返回触发元素。
- [ ] **焦点恢复**：关闭时焦点恢复至打开前的触发元素。
- [ ] **ARIA**：`role="dialog"`、`aria-modal="true"`、`aria-labelledby` 指向标题。
- [ ] **关闭按钮标签**：`aria-label="关闭对话框"`，内部图标 `aria-hidden="true"`。
- [ ] **RTL 适配**：使用逻辑属性（`inline-start`、`block-end`、`text-align: start` 等）。
- [ ] **prefers-reduced-motion**：取消所有动画和 transform，保留即时状态切换。
- [ ] **forced-colors**：边框使用 `CanvasText`，焦点环使用 `Highlight`，颜色变体简化。
- [ ] **320px 可用**：小屏幕下 padding 缩减，footer 按钮垂直堆叠且全宽。
- [ ] **200% 缩放**：内容不截断，可滚动区域正常工作，最小点击区域 ≥ 44×44px。
- [ ] **最小触摸目标**：关闭按钮 2rem × 2rem（32px），按钮 ≥ 44×44px。

### 10.5 代码质量检查

- [ ] **@layer**：CSS 包裹在 `@layer nb.components` 中。
- [ ] **CSS 变量**：全部使用 `--nb-*` 前缀变量，无硬编码值。
- [ ] **will-change**：transform 和 box-shadow 添加了 `will-change`。
- [ ] **GPU 加速**：仅使用 `transform` 和 `opacity` 实现动画，无 `width`/`height`/`margin` 动画。
- [ ] **z-index**：遮罩层 1040，Modal 内容 1050，层级清晰。
- [ ] **代码结构**：CSS 按逻辑分组（Backdrop → Modal → Header → Body → Footer → 变体 → 状态 → 媒体查询）。

### 10.6 变体完整性检查

- [ ] **尺寸变体**：xs、sm、md、lg、xl、full 全部实现。
- [ ] **颜色变体**：neutral、primary、danger、warning、success 全部实现。
- [ ] **布局变体**：scrollable、fullscreen、sheet 全部实现。
- [ ] **状态变体**：loading、invalid、valid 全部实现。

---

> **文档版本**：v1.0  
> **最后更新**：设计系统初版  
> **维护者**：Neo-Brutal UI 设计系统团队  
> **审核状态**：待技术评审（Tech Review）
