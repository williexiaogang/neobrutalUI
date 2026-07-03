# 2.5 交互语言

> **状态不可只通过颜色区分。** 任何状态变化必须配合位移、边框、阴影或图标变化。新粗野风格（Neo-Brutalism）的交互反馈强调**物理感**——组件是实体，有重量，可按下，可弹起。

---

## 1. 状态定义与视觉表现

### 1.1 Default（默认状态）

组件处于非交互、非激活的基准状态。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 边框 | 标准实线 | `border: 2px solid var(--nb-border)` |
| 阴影 | 对应组件级别 | `box-shadow: var(--nb-shadow-md)`（一般组件） |
| 背景 | 对应表面层级 | `background: var(--nb-base-200)` |
| 文本色 | 对应语义色 | `color: var(--nb-base-content)` |
| 光标 | 默认 | `cursor: default`（容器）/ `cursor: pointer`（按钮） |
| 透明度 | 无 | `opacity: 1` |

**CSS 示例：**

```css
.nb-component {
  border: 2px solid var(--nb-border);
  box-shadow: var(--nb-shadow-md);
  background: var(--nb-base-200);
  color: var(--nb-base-content);
  transition: transform var(--nb-duration-normal) ease,
              box-shadow var(--nb-duration-normal) ease,
              border-color var(--nb-duration-fast) ease;
}
```

---

### 1.2 Hover（悬停状态）

用户指针位于组件上方时的反馈。Hover 必须提供**物理上升感**——组件仿佛被手指托起。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 阴影 | 升一级（变大） | `box-shadow: var(--nb-shadow-lg)` |
| 位移 | 向阴影反方向移动 | `transform: translate(-2px, -2px)` |
| 边框 | 可微调，加亮 | `border-color: color-mix(in oklch, var(--nb-border) 80%, var(--nb-base-100))` |
| 背景 | 不变（避免仅靠颜色区分） | — |
| 光标 | 指针 | `cursor: pointer` |

**位移公式：**

```
Hover 位移 = -(阴影增量 / 2)
```

例如：阴影从 `4px 4px` 增大到 `6px 6px`，增量为 `2px`，则位移 `(-1px, -1px)`。按设计系统统一取 `(-2px, -2px)` 以强化视觉感知。

**CSS 示例：**

```css
.nb-component:hover {
  box-shadow: var(--nb-shadow-lg);
  transform: translate(-2px, -2px);
  border-color: color-mix(in oklch, var(--nb-border) 80%, var(--nb-base-100));
}
```

**布局稳定性检查：** 使用 `transform` 进行位移，不触发重排（reflow），周围元素位置不变。禁止在 Hover 中修改 `margin`、`padding`、`width`、`height` 或 `position`。

---

### 1.3 Active / Pressed（按下状态）

用户点击或按下组件时的反馈。必须提供**物理下沉感**——组件被按入表面。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 阴影 | 归零 | `box-shadow: var(--nb-shadow-none)` |
| 位移 | 向原阴影位置移动 | `transform: translate(4px, 4px)`（对应 `--nb-shadow-md` 的 4px 4px） |
| 边框 | 颜色加深，形成内嵌感 | `border-color: color-mix(in oklch, var(--nb-border) 120%, var(--nb-base-300))` |
| 背景 | 可微调，但不作为主要区分 | — |

**位移公式：**

```
Active 位移 = Default 阴影的 X/Y 偏移量
```

例如：Default 阴影为 `4px 4px 0`，则 Active 位移为 `(4px, 4px)`。组件移动到原阴影位置，阴影同时归零，形成"被按平"的视觉效果。

**CSS 示例：**

```css
.nb-component:active,
.nb-component.is-active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
  border-color: color-mix(in oklch, var(--nb-border) 120%, var(--nb-base-300));
}
```

**可点击区域稳定性：** Active 位移量不超过原阴影偏移量，因此组件在视觉上仍占据原 `box-shadow` 所覆盖的近似区域。用户不会"丢失"目标。禁止位移量超过阴影偏移量（如 `translate(8px, 8px)` 当阴影仅为 `4px 4px` 时）。

---

### 1.4 Focus Visible（焦点可见状态）

键盘导航（Tab 键）时的高对比度指示器。不使用浏览器默认 outline，使用自定义高对比色以符合新粗野风格的鲜明特征。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 外框 | 2px 实线 | `outline: 2px solid var(--nb-focus)` |
| 外框偏移 | 2px 间距 | `outline-offset: 2px` |
| 阴影 | 保留 Default 或升级 | `box-shadow: var(--nb-shadow-md)`（不变） |
| 位移 | 不位移 | `transform: none`（避免与 Hover 位移冲突） |
| 焦点色 | 高对比，建议亮蓝或亮黄 | `--nb-focus: oklch(70% 0.15 250)` |

**焦点色计算规则：**

`--nb-focus` 应为 `--nb-primary` 的对比色。若 `--nb-primary` 偏暖（如橙红），则 `--nb-focus` 使用冷色（亮蓝）；若 `--nb-primary` 偏冷，则 `--nb-focus` 使用暖色（亮黄）。确保在任意主题下达到 WCAG 2.1 AA 级对比度（4.5:1）。

**CSS 示例：**

```css
.nb-component:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  /* 不修改 transform 或 box-shadow，避免与 Hover 冲突 */
}

/* 当 Focus 与 Hover 同时发生（如鼠标悬停后键盘 Tab） */
.nb-component:hover:focus-visible {
  box-shadow: var(--nb-shadow-lg);
  transform: translate(-2px, -2px);
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}
```

**注意：** `focus-visible` 仅在键盘导航时触发，鼠标点击不触发，避免与 Active 状态视觉冲突。

---

### 1.5 Disabled（禁用状态）

组件不可用，不接受任何交互。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 透明度 | 降低至 50% | `opacity: 0.5` |
| 阴影 | 移除 | `box-shadow: none` |
| 边框 | 颜色变淡 | `border-color: color-mix(in oklch, var(--nb-border) 50%, transparent)` |
| 背景 | 颜色变淡 | `background: color-mix(in oklch, var(--nb-base-200) 50%, transparent)` |
| 光标 | 禁止 | `cursor: not-allowed` |
| 文本色 | 变淡 | `color: color-mix(in oklch, var(--nb-base-content) 50%, transparent)` |

**交互阻断：** Disabled 状态必须完全阻断 Hover 和 Active 的视觉效果。使用 `:disabled` 伪类或 `.is-disabled` 类，并确保 CSS 选择器优先级足够高。

**可访问性：** 必须设置 `aria-disabled="true"` 或 `disabled` 属性（对表单元素）。

**CSS 示例：**

```css
.nb-component:disabled,
.nb-component.is-disabled,
.nb-component[aria-disabled="true"] {
  opacity: 0.5;
  box-shadow: none;
  border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
  background: color-mix(in oklch, var(--nb-base-200) 50%, transparent);
  color: color-mix(in oklch, var(--nb-base-content) 50%, transparent);
  cursor: not-allowed;
  pointer-events: none; /* 阻断所有鼠标事件 */
}

/* 强制覆盖 Hover 和 Active */
.nb-component.is-disabled:hover,
.nb-component.is-disabled:active {
  box-shadow: none;
  transform: none;
  border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
}
```

---

### 1.6 Readonly（只读状态）

组件内容可见但不可编辑。与 Disabled 的区别：Readonly 仍参与表单提交，仍可见，不降低透明度。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 边框 | 颜色变淡，但可见 | `border-color: color-mix(in oklch, var(--nb-border) 50%, transparent)` |
| 背景 | 不变或微调 | `background: var(--nb-base-100)` |
| 阴影 | 移除或降低 | `box-shadow: var(--nb-shadow-xs)` 或 `none` |
| 光标 | 默认文本 | `cursor: default` |
| 透明度 | 不变 | `opacity: 1` |

**与 Disabled 的关键区别：**

| 对比项 | Disabled | Readonly |
|--------|----------|----------|
| 透明度 | 0.5 | 1（不变） |
| 表单提交 | 不提交 | 提交 |
| 光标 | `not-allowed` | `default` |
| 视觉存在感 | 弱化，退居背景 | 保持，只是不可编辑 |

**CSS 示例：**

```css
.nb-component[readonly],
.nb-component.is-readonly {
  border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-xs);
  cursor: default;
  /* Hover 和 Active 不生效 */
  pointer-events: none;
}
```

---

### 1.7 Invalid（无效/错误状态）

表单验证失败，或组件数据不合法。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 边框 | 错误色，加粗 | `border: 2px solid var(--nb-error)` |
| 强调边框 | 左侧（inline-start）3px 加粗 | `border-inline-start-width: 3px` |
| 背景 | 可添加微红底色 | `background: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100))` |
| 阴影 | 可选错误色阴影 | `box-shadow: var(--nb-shadow-error)`（若定义） |
| 图标 | 可配合错误图标 | 在组件内部或右侧显示 `×` 或警告图标 |

**错误阴影变量（可选）：**

```css
:root {
  --nb-shadow-error: 4px 4px 0 color-mix(in oklch, var(--nb-error) 40%, transparent);
}
```

**CSS 示例：**

```css
.nb-component.is-invalid,
.nb-component:invalid {
  border: 2px solid var(--nb-error);
  border-inline-start-width: 3px;
  background: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
  /* 可选：错误阴影 */
  box-shadow: var(--nb-shadow-error, var(--nb-shadow-md));
}

/* 错误图标 */
.nb-component.is-invalid::after {
  content: "⚠";
  color: var(--nb-error);
  margin-inline-start: 0.5rem;
}
```

**注意：** Invalid 状态应配合 `aria-invalid="true"` 和关联的 `aria-describedby` 指向错误消息元素。

---

### 1.8 Valid（有效状态）

表单验证通过。Valid 状态不应过于显眼，避免视觉噪音。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 边框 | 成功色，但细于 Invalid | `border: 2px solid var(--nb-success)` |
| 背景 | 可选微绿底色 | `background: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100))` |
| 图标 | 可选对勾图标 | 仅在需要强化反馈时显示 |

**设计原则：** Valid 状态是"默认预期"，不应抢夺注意力。仅在复杂表单或需要逐步确认的场景中使用。大多数场景下，不显示 Valid 状态，仅在 Invalid 时提供反馈。

**CSS 示例：**

```css
.nb-component.is-valid,
.nb-component:valid:not(:invalid) {
  border: 2px solid var(--nb-success);
  background: color-mix(in oklch, var(--nb-success) 5%, var(--nb-base-100));
}

/* 仅在需要时显示对勾图标 */
.nb-component.is-valid.is-show-icon::after {
  content: "✓";
  color: var(--nb-success);
  margin-inline-start: 0.5rem;
}
```

---

### 1.9 Selected / Checked（选中状态）

用户已选择或激活的选项。常见于 Checkbox、Radio、Toggle、Menu Item、Tab。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 背景 | 主色填充 | `background: var(--nb-primary)` |
| 文本色 | 主色对比色 | `color: var(--nb-primary-content)` |
| 边框 | 主色边框 | `border-color: var(--nb-primary)` |
| 阴影 | 保留或降低 | `box-shadow: var(--nb-shadow-sm)` |
| 图标 | 显示选中标记 | Checkbox 显示 `✓`，Radio 显示内圆点 |

**Checkbox 示例：**

```css
.nb-checkbox:checked,
.nb-checkbox.is-checked {
  background: var(--nb-primary);
  border-color: var(--nb-primary);
  color: var(--nb-primary-content);
  box-shadow: var(--nb-shadow-sm);
}

.nb-checkbox:checked::after {
  content: "✓";
  display: block;
  text-align: center;
  font-weight: 700;
}
```

**Toggle 示例：**

```css
.nb-toggle.is-checked .nb-toggle-thumb {
  background: var(--nb-primary);
  border-color: var(--nb-primary);
  transform: translateX(100%); /* 滑块移动 */
}
```

---

### 1.10 Open / Expanded（展开状态）

容器、下拉菜单、折叠面板等展开时的状态。

| 场景 | 规则 | 变量 / 值 |
|------|------|-----------|
| Modal | Backdrop 覆盖 + 内容面板 | Backdrop: `background: color-mix(in oklch, var(--nb-base-300) 80%, transparent)` |
| Dropdown | 面板显示 + 触发器高亮 | Panel: `box-shadow: var(--nb-shadow-lg)` |
| Accordion | 内容展开 + 图标旋转 | Content: `max-height` 从 0 过渡到 auto（JS 控制） |
| Drawer | 侧边滑入 | `transform: translateX(0)` 从 `translateX(-100%)` |

**Modal 完整 CSS 示例：**

```css
.nb-modal-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in oklch, var(--nb-base-300) 80%, transparent);
  z-index: var(--nb-z-modal-backdrop, 1040);
  opacity: 0;
  transition: opacity var(--nb-duration-slow) var(--nb-ease-standard);
}

.nb-modal-backdrop.is-open {
  opacity: 1;
}

.nb-modal-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateY(-20px);
  background: var(--nb-base-100);
  border: 2px solid var(--nb-border);
  box-shadow: var(--nb-shadow-xl);
  z-index: var(--nb-z-modal, 1050);
  opacity: 0;
  transition: opacity var(--nb-duration-slow) var(--nb-ease-standard),
              transform var(--nb-duration-slow) var(--nb-ease-standard);
}

.nb-modal-panel.is-open {
  opacity: 1;
  transform: translate(-50%, -50%) translateY(0);
}
```

---

### 1.11 Loading / Busy（加载状态）

组件正在处理中，内容被替换为 Loading 指示器，但保持尺寸不变。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 内容可见性 | 隐藏原内容 | `visibility: hidden` 或 `opacity: 0`（保持占位） |
| Loading 指示器 | 居中显示 | 绝对定位居中 |
| 尺寸 | 保持原尺寸 | `width`、`height` 不变 |
| 交互 | 不可交互 | `pointer-events: none` |
| 光标 | 等待 | `cursor: wait` |

**CSS 示例：**

```css
.nb-component.is-loading {
  position: relative;
  pointer-events: none;
  cursor: wait;
}

.nb-component.is-loading > * {
  visibility: hidden;
}

/* Loading 方块（新粗野风格） */
.nb-component.is-loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  background: var(--nb-primary);
  border: 2px solid var(--nb-border);
  animation: nb-loading-pulse 1s steps(2) infinite;
  transform: translate(-50%, -50%);
}

@keyframes nb-loading-pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); }
}
```

**可访问性：** 必须设置 `aria-busy="true"`。

```html
<button class="nb-btn is-loading" aria-busy="true" disabled>
  提交中...
</button>
```

---

### 1.12 Dragging（拖拽中，预留）

组件被拖拽时的视觉反馈。此状态为预留实现，当前版本提供规范定义。

| 属性 | 规则 | 变量 / 值 |
|------|------|-----------|
| 阴影 | 显著增大 | `box-shadow: var(--nb-shadow-xl)` |
| 透明度 | 微调降低 | `opacity: 0.9` |
| 边框 | 虚线化 | `border-style: dashed` |
| 位移 | 跟随鼠标 | 由 JS 动态设置 `transform: translate(x, y)` |
| 光标 | 抓取 | `cursor: grabbing` |

**CSS 示例：**

```css
.nb-component.is-dragging {
  box-shadow: var(--nb-shadow-xl);
  opacity: 0.9;
  border-style: dashed;
  cursor: grabbing;
  z-index: var(--nb-z-dragging, 1070);
  /* 提升层级，确保在拖拽目标之上 */
}

/* 放置目标高亮 */
.nb-drop-target.is-drag-over {
  border-color: var(--nb-primary);
  border-style: dashed;
  background: color-mix(in oklch, var(--nb-primary) 10%, var(--nb-base-100));
}
```

---

## 2. 全局过渡时长阶梯

所有状态变化必须使用统一的过渡系统，确保全库交互节奏一致。

### 2.1 时长变量

| 变量名 | 值 | 使用场景 |
|--------|-----|----------|
| `--nb-duration-instant` | `0ms` | 无过渡，即时切换（如 Disabled 状态） |
| `--nb-duration-fast` | `100ms` | Hover 状态切换、边框颜色微调 |
| `--nb-duration-normal` | `150ms` | 按钮按下、阴影变化、常规状态切换 |
| `--nb-duration-slow` | `250ms` | Modal 打开/关闭、Dropdown 展开、Drawer 滑入 |
| `--nb-duration-slower` | `350ms` | 页面级过渡、大型容器展开 |

### 2.2 缓动曲线

| 变量名 | 值 | 使用场景 | 特征 |
|--------|-----|----------|------|
| `--nb-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 默认通用过渡 | 温和减速，自然流畅 |
| `--nb-ease-brutal` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | 新粗野风格推荐 | 更直接、更硬朗的减速 |
| `--nb-ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 出场动画 | 快速启动，柔和结束 |
| `--nb-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 入场动画（较少使用） | 柔和启动，快速结束 |
| `--nb-ease-step` | `steps(2)` | 粗野风格脉冲 | 阶梯式，无中间态 |

**缓动曲线选择指南：**

- 按钮 Hover/Active：使用 `--nb-ease-brutal`（150ms），提供直接反馈感。
- 模态框打开：使用 `--nb-ease-standard`（250ms），兼顾柔和与效率。
- Loading 动画：使用 `--nb-ease-step`（1s），阶梯式跳动，强化粗野风格。
- 颜色/透明度过渡：使用 `--nb-ease-standard`（100ms），平滑但不拖沓。

### 2.3 CSS 变量定义

```css
:root {
  /* Duration */
  --nb-duration-instant: 0ms;
  --nb-duration-fast: 100ms;
  --nb-duration-normal: 150ms;
  --nb-duration-slow: 250ms;
  --nb-duration-slower: 350ms;

  /* Easing */
  --nb-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --nb-ease-brutal: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --nb-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --nb-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --nb-ease-step: steps(2);
}
```

---

## 3. 新粗野风格动画原则

### 3.1 核心原则

1. **直接（Direct）**：状态变化无冗余，从 A 到 B 不绕弯。
2. **短促（Short）**：最长不超过 250ms，大多数在 150ms 内完成。
3. **有节奏感（Rhythmic）**：使用阶梯式（steps）或硬朗缓动，避免过于平滑的 ease-in-out。
4. **物理感（Physical）**：组件有重量，有阴影，有位移——它们"存在"于空间中。

### 3.2 属性使用优先级

**优先使用（GPU 加速，不触发重排）：**

| 属性 | 使用场景 |
|------|----------|
| `transform` | 位移、缩放、旋转 |
| `opacity` | 淡入淡出、显示/隐藏 |
| `filter`（谨慎） | 仅在必要时使用，如 blur 遮罩 |

**禁止使用（触发重排/重绘，性能差）：**

| 属性 | 原因 | 替代方案 |
|------|------|----------|
| `width` / `height` | 触发重排，周围元素位移 | 使用 `transform: scale()` 或预定义尺寸 |
| `top` / `left` / `right` / `bottom` | 触发重排 | 使用 `transform: translate()` |
| `margin` / `padding` | 触发重排 | 使用 `transform` 或保持尺寸不变 |
| `border-width` | 触发重排 | 使用 `box-shadow` 或保持边框不变 |

### 3.3 动画时长上限

- **快速反馈（Hover/Active）**：≤ 150ms
- **中等过渡（Dropdown/Accordion）**：≤ 250ms
- **大型过渡（Modal/Drawer）**：≤ 350ms
- **持续动画（Loading/Spinner）**：循环，单周期 500ms-1s

**禁止：** 超过 500ms 的过渡动画（特殊页面过渡除外）。

### 3.4 禁止的动画类型

| 动画类型 | 禁止原因 | 替代方案 |
|----------|----------|----------|
| 弹性（Bounce） | 过于俏皮，不符合粗野风格 | 硬朗减速缓动 |
| 弹性缩放（Elastic Scale） | 破坏实体感 | 线性或阶梯式缩放 |
| 过度平滑（Expo Ease-In-Out） | 过于柔和，失去粗野感 | `--nb-ease-brutal` |
| 渐变过渡（Gradient Animation） | 新粗野风格不使用渐变 | 纯色切换或透明度变化 |

---

## 4. 触摸设备策略

### 4.1 无 Hover 环境

移动设备无 Hover 状态，必须通过其他方式提供等效反馈：

| 桌面状态 | 移动端等效 |
|----------|------------|
| Hover | 无（或使用 `:active` 短促按下反馈） |
| Active | `:active` 伪类（按下时触发） |
| Focus | 点击后聚焦，显示焦点环 |

### 4.2 :active 反馈

```css
@media (hover: none) {
  /* 触摸设备：提供按下反馈 */
  .nb-component:active {
    box-shadow: var(--nb-shadow-none);
    transform: translate(4px, 4px);
  }
}
```

### 4.3 不依赖 Hover 作为核心状态提示

- **颜色变化：** 不可仅通过 Hover 改变颜色传达信息（如"Hover 查看详情"）。
- **隐藏内容：** 不可在 Hover 时显示不可达内容（如 Hover 才显示的操作按钮）。
- **替代方案：** 使用显式按钮、切换、或点击展开。

---

## 5. prefers-reduced-motion 模式

当用户启用减少动画时，必须取消位移动画，保留即时状态切换。

### 5.1 CSS 实现

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* 保留 box-shadow 的即时切换，但取消 transform */
  .nb-component,
  .nb-component:hover,
  .nb-component:active,
  .nb-component:focus-visible,
  .nb-modal-panel,
  .nb-modal-backdrop,
  .nb-drawer {
    transition: none !important;
    transform: none !important;
  }

  /* 颜色变化保留即时切换 */
  .nb-component:hover {
    box-shadow: var(--nb-shadow-lg); /* 即时切换，无过渡 */
  }

  .nb-component:active {
    box-shadow: var(--nb-shadow-none);
  }
}
```

### 5.2 规则说明

- `transform` 位移：完全取消，状态变化即时生效。
- `box-shadow`：保留即时切换，但不使用过渡。
- `opacity` / `color` / `background`：保留即时切换，无过渡。
- 持续动画（Loading）：停止或替换为静态图标。
- 滚动：取消平滑滚动，使用即时跳转。

---

## 6. 状态冲突与优先级

当多个状态同时出现时，按以下优先级（从高到低）应用：

| 优先级 | 状态 | 说明 |
|--------|------|------|
| 1 | **Dragging** | 最高优先级，覆盖所有其他状态 |
| 2 | **Loading** | 覆盖 Hover、Active、Focus |
| 3 | **Disabled** | 覆盖 Hover、Active、Focus，但不覆盖 Loading（Loading 先判断） |
| 4 | **Invalid** | 覆盖 Default，但 Hover 和 Active 仍需生效 |
| 5 | **Active** | 覆盖 Hover 和 Default |
| 6 | **Hover** | 覆盖 Default |
| 7 | **Focus Visible** | 与 Hover 可共存，不互相覆盖 |
| 8 | **Default** | 基准状态 |

**CSS 实现策略：** 使用选择器优先级和 `:is()` 管理组合状态。

```css
/* 高优先级：Disabled + Loading */
.nb-component.is-loading,
.nb-component:disabled,
.nb-component[aria-disabled="true"] {
  /* 最高优先级样式 */
}

/* 组合状态：Invalid + Hover */
.nb-component.is-invalid:hover {
  border-color: var(--nb-error);
  box-shadow: var(--nb-shadow-lg);
  transform: translate(-2px, -2px);
}

/* 组合状态：Focus + Hover */
.nb-component:hover:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  box-shadow: var(--nb-shadow-lg);
  transform: translate(-2px, -2px);
}
```

---

## 7. 完整组件状态示例

### 7.1 Button（按钮）

```css
.nb-btn {
  /* Default */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--nb-border);
  background: var(--nb-base-200);
  color: var(--nb-base-content);
  box-shadow: var(--nb-shadow-md);
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--nb-duration-normal) var(--nb-ease-brutal),
              box-shadow var(--nb-duration-normal) var(--nb-ease-brutal),
              border-color var(--nb-duration-fast) var(--nb-ease-standard);
}

.nb-btn:hover {
  box-shadow: var(--nb-shadow-lg);
  transform: translate(-2px, -2px);
  border-color: color-mix(in oklch, var(--nb-border) 80%, var(--nb-base-100));
}

.nb-btn:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
  border-color: color-mix(in oklch, var(--nb-border) 120%, var(--nb-base-300));
}

.nb-btn:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
}

.nb-btn:disabled,
.nb-btn[aria-disabled="true"] {
  opacity: 0.5;
  box-shadow: none;
  border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
  background: color-mix(in oklch, var(--nb-base-200) 50%, transparent);
  color: color-mix(in oklch, var(--nb-base-content) 50%, transparent);
  cursor: not-allowed;
  pointer-events: none;
}

.nb-btn.is-loading {
  position: relative;
  pointer-events: none;
  cursor: wait;
}

.nb-btn.is-loading > * {
  visibility: hidden;
}

.nb-btn.is-loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  background: var(--nb-primary);
  border: 2px solid var(--nb-border);
  animation: nb-loading-pulse 1s steps(2) infinite;
  transform: translate(-50%, -50%);
}
```

### 7.2 Input（输入框）

```css
.nb-input {
  /* Default */
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--nb-border);
  background: var(--nb-base-100);
  color: var(--nb-base-content);
  box-shadow: var(--nb-shadow-sm);
  transition: border-color var(--nb-duration-fast) var(--nb-ease-standard),
              box-shadow var(--nb-duration-fast) var(--nb-ease-standard);
}

.nb-input:hover {
  border-color: color-mix(in oklch, var(--nb-border) 80%, var(--nb-base-100));
}

.nb-input:focus-visible {
  outline: 2px solid var(--nb-focus);
  outline-offset: 2px;
  border-color: var(--nb-primary);
  box-shadow: var(--nb-shadow-md);
}

.nb-input:disabled {
  opacity: 0.5;
  box-shadow: none;
  border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
  background: color-mix(in oklch, var(--nb-base-100) 50%, transparent);
  cursor: not-allowed;
}

.nb-input[readonly] {
  border-color: color-mix(in oklch, var(--nb-border) 50%, transparent);
  background: var(--nb-base-200);
  box-shadow: var(--nb-shadow-xs);
  cursor: default;
}

.nb-input:invalid,
.nb-input.is-invalid {
  border: 2px solid var(--nb-error);
  border-inline-start-width: 3px;
  background: color-mix(in oklch, var(--nb-error) 8%, var(--nb-base-100));
}

.nb-input:valid:not(:invalid) {
  border: 2px solid var(--nb-success);
}
```

### 7.3 Card（卡片）

```css
.nb-card {
  /* Default */
  border: 2px solid var(--nb-border);
  background: var(--nb-base-200);
  box-shadow: var(--nb-shadow-md);
  transition: transform var(--nb-duration-normal) var(--nb-ease-brutal),
              box-shadow var(--nb-duration-normal) var(--nb-ease-brutal);
}

.nb-card:hover {
  box-shadow: var(--nb-shadow-lg);
  transform: translate(-2px, -2px);
}

.nb-card:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
}

.nb-card.is-loading {
  position: relative;
  pointer-events: none;
}

.nb-card.is-loading::after {
  content: "";
  position: absolute;
  inset: 0;
  background: color-mix(in oklch, var(--nb-base-100) 80%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 8. 状态矩阵速查表

| 状态 | 边框 | 阴影 | 位移 | 颜色 | 透明度 | 动画 | 光标 |
|------|------|------|------|------|--------|------|------|
| **Default** | 2px solid | `--nb-shadow-md` | none | 标准 | 1.0 | — | default/pointer |
| **Hover** | 加亮 | 升一级 (`lg`) | `(-2px, -2px)` | 不变 | 1.0 | 150ms brutal | pointer |
| **Active** | 加深 | `none` | `(4px, 4px)` | 不变 | 1.0 | 150ms brutal | pointer |
| **Focus Visible** | 不变 | 不变 | none | 外框 `--nb-focus` | 1.0 | 100ms standard | default |
| **Disabled** | 变淡 50% | none | none | 变淡 50% | 0.5 | instant | not-allowed |
| **Readonly** | 变淡 50% | `xs` / none | none | 不变 | 1.0 | instant | default |
| **Invalid** | `--nb-error` 2px + 3px 左侧 | 可选 error | none | 微红底色 | 1.0 | 100ms standard | default |
| **Valid** | `--nb-success` 2px | 不变 | none | 微绿底色 | 1.0 | 100ms standard | default |
| **Selected** | `--nb-primary` | `sm` | none | 主色+对比色 | 1.0 | 100ms standard | pointer |
| **Open** | 不变 | 增大 | 视场景 | 不变 | 1.0 | 250ms standard | default |
| **Loading** | 不变 | 不变 | none | 不变 | 1.0 | Loading 动画 | wait |
| **Dragging** | dashed | `--nb-shadow-xl` | JS 动态 | 不变 | 0.9 | instant | grabbing |

---

## 9. Token 速查表

### 9.1 状态相关 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-focus` | `oklch(70% 0.15 250)` | 焦点高亮色，建议亮蓝 |
| `--nb-shadow-error` | `4px 4px 0 color-mix(...)` | 可选错误阴影 |
| `--nb-z-modal-backdrop` | `1040` | Modal 遮罩层级 |
| `--nb-z-modal` | `1050` | Modal 内容层级 |
| `--nb-z-dragging` | `1070` | 拖拽元素层级 |

### 9.2 过渡 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-duration-instant` | `0ms` | 即时切换 |
| `--nb-duration-fast` | `100ms` | 快速过渡 |
| `--nb-duration-normal` | `150ms` | 标准过渡 |
| `--nb-duration-slow` | `250ms` | 慢速过渡 |
| `--nb-duration-slower` | `350ms` | 更慢过渡 |
| `--nb-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 标准缓动 |
| `--nb-ease-brutal` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | 粗野风格缓动 |
| `--nb-ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 减速出场 |
| `--nb-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 加速入场 |
| `--nb-ease-step` | `steps(2)` | 阶梯式 |

### 9.3 阴影 Token（引用）

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-shadow-none` | `0 0 0` | 无阴影 |
| `--nb-shadow-xs` | `1px 1px 0` | 超小阴影 |
| `--nb-shadow-sm` | `2px 2px 0` | 小阴影 |
| `--nb-shadow-md` | `4px 4px 0` | 中等阴影（默认） |
| `--nb-shadow-lg` | `6px 6px 0` | 大阴影（Hover） |
| `--nb-shadow-xl` | `8px 8px 0` | 超大阴影（Modal/Dragging） |

### 9.4 颜色 Token（引用）

| Token | 说明 |
|-------|------|
| `--nb-base-100` | 页面底层背景 |
| `--nb-base-200` | 普通组件表面 |
| `--nb-base-300` | 凸起表面 |
| `--nb-base-content` | 内容文本色 |
| `--nb-border` | 标准边框色 |
| `--nb-primary` | 主色 |
| `--nb-primary-content` | 主色对比色 |
| `--nb-error` | 错误色 |
| `--nb-success` | 成功色 |
| `--nb-overlay` | 覆盖层背景色 |
