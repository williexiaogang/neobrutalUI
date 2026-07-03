# 2.3 阴影与位移数学关系

> **适用范围**：Neo-Brutal UI 全部交互式组件（Button、Card、Dropdown、Modal、Drawer 等）及所有响应式表面元素。  
> **目标**：建立一套基于硬阴影（hard shadow）与刚性位移（rigid translation）的视觉反馈系统，确保所有状态变化在 `150 ms` 内完成，不使用模糊、渐变或弹性动画。

---

## 1. 阴影阶梯系统（Shadow Scale）

阴影采用**无模糊（blur = 0）、无扩散（spread = 0）**的硬阴影策略，偏移量构成严格的等差数列，确保视觉层级清晰可预测。

### 1.1 阴影 Token 定义

| Token | 偏移量（X / Y） | 模糊 | 扩散 | 使用场景 |
|-------|---------------|------|------|----------|
| `--nb-shadow-none` | `0` / `0` | `0` | `0` | Active / Pressed 状态；禁用阴影时 |
| `--nb-shadow-xs` | `1px` / `1px` | `0` | `0` | 极小元素、内嵌标签、紧密列表项 |
| `--nb-shadow-sm` | `2px` / `2px` | `0` | `0` | 默认小型组件（小型 Button、Badge、Input） |
| `--nb-shadow-md` | `4px` / `4px` | `0` | `0` | **默认标准阴影**（标准 Button、Card、Alert） |
| `--nb-shadow-lg` | `6px` / `6px` | `0` | `0` | Hover 状态提升；大型组件（Modal、Drawer） |
| `--nb-shadow-xl` | `8px` / `8px` | `0` | `0` | 拖拽状态（Dragging）、最高层级浮层（Dropdown Panel） |

### 1.2 CSS 变量声明

```css
:root {
  /* 基础阴影几何（无颜色） */
  --nb-shadow-none: 0px 0px 0;
  --nb-shadow-xs: 1px 1px 0;
  --nb-shadow-sm: 2px 2px 0;
  --nb-shadow-md: 4px 4px 0;
  --nb-shadow-lg: 6px 6px 0;
  --nb-shadow-xl: 8px 8px 0;

  /* 阴影颜色 —— 使用 color-mix 保证主题一致性 */
  --nb-shadow-color: color-mix(in oklch, var(--nb-base-content) 25%, transparent);
}
```

> **说明**：所有阴影变量仅定义 `X-offset Y-offset blur`，不包含颜色。颜色通过 `--nb-shadow-color` 统一注入，便于主题级覆盖。

### 1.3 颜色规则与主题适配

阴影颜色不直接使用 `#000` 或 `black`，而是使用 `--nb-base-content`（当前主题的主要内容色）的 `color-mix` 结果，确保在浅色、深色或任意主题色下保持一致的视觉重量。

```css
/* 浅色主题（默认） */
--nb-shadow-color: color-mix(in oklch, var(--nb-base-content) 25%, transparent);

/* 深色主题（neo-brutal-dark） */
--nb-shadow-color: color-mix(in oklch, var(--nb-base-content) 35%, transparent);
```

| 场景 | 混合比例 | 理由 |
|------|----------|------|
| 浅色背景 | `25%` | 避免阴影过重，保持干净 |
| 深色背景 | `35%` | 提升阴影可见度，防止淹没 |
| 高对比度模式 | `45%` | 确保可访问性 |

---

## 2. 交互状态位移公式

Neo-Brutal UI 的状态变化遵循**"阴影增大 = 元素反方向位移"**的刚性原则，保持视觉重心（bounding box 中心点）始终稳定。

### 2.1 状态定义

| 状态 | 阴影 Token | 阴影值 | `transform` | 位移公式 |
|------|-----------|--------|-------------|----------|
| **Default** | `--nb-shadow-md` | `4px 4px 0 var(--nb-shadow-color)` | `none` | `translate(0, 0)` |
| **Hover** | `--nb-shadow-lg` | `6px 6px 0 var(--nb-shadow-color)` | `translate(-2px, -2px)` | 阴影增大 2px，元素反向移动 2px |
| **Active / Pressed** | `--nb-shadow-none` | `0px 0px 0` | `translate(4px, 4px)` | 阴影归零，元素移向原阴影位置（"按下"） |

> **几何原理**：Default 阴影为 `4px 4px`，Hover 时阴影变为 `6px 6px`。元素向反方向移动 `2px`，视觉上元素底部和右侧的空白（阴影区域）从 `4px` 增加到 `6px`，但元素本身的位置重心不变，仅呈现"悬浮更高"的错觉。Active 时阴影消失，元素向原阴影位置移动 `4px`，恰好落在视觉上"无阴影"的平面上，形成强烈的按下反馈。

### 2.2 完整 CSS 状态代码示例

```css
/* 基础交互组件（以 Button 为例） */
.nb-button {
  /* 默认状态 */
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  transform: translate(0, 0);
  transition: transform 150ms ease, box-shadow 150ms ease;
  will-change: transform, box-shadow;
}

.nb-button:hover {
  /* Hover 状态：阴影升一级，元素反方向位移 */
  box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  transform: translate(-2px, -2px);
}

.nb-button:active,
.nb-button[data-active="true"] {
  /* Active 状态：阴影归零，元素移向原阴影位置 */
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
}

/* 过渡定义 */
.nb-button {
  transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
              box-shadow var(--nb-duration-normal) var(--nb-easing-standard);
}
```

### 2.3 状态变化时序图（示意）

```
Default          Hover                    Active
  │                │                        │
  ▼                ▼                        ▼
┌──────┐      ┌──────┐                ┌──────┐
│      │      │      │                │      │
│  E   │  →   │  E   │  ← 2px         │  E   │  → 4px
│      │      │      │                │      │
└──┬┬──┘      └──┬┬──┘                └──────┘
   ││              ││                        
   │└─ shadow ────┘│                        
   │   4px 4px     │   6px 6px               
   │               │                        
   └─ translate(0) ┘  translate(-2px,-2px)  translate(4px,4px)
```

---

## 3. 布局稳定性保障

### 3.1 Hover 不造成周围布局抖动

**问题**：使用 `margin` 或 `position: relative + top/left` 实现位移会导致元素脱离原占位空间，引发周围元素重排（reflow），产生布局抖动。

**解决方案**：使用 `transform: translate()`。

- `transform` 属于**合成层（composited layer）**属性，不触发布局重排（reflow）或重绘（repaint），仅由 GPU 执行合成操作。
- 位移前后，元素的**布局占位空间（layout space）**保持不变，文档流中的其他元素位置不受影响。
- 对比：

| 方案 | 触发重排 | 触发重绘 | 性能影响 | 推荐 |
|------|----------|----------|----------|------|
| `margin-top: -2px` | ✅ 是 | ✅ 是 | 高 | ❌ 禁止 |
| `position: relative; top: -2px` | ✅ 是 | ✅ 是 | 高 | ❌ 禁止 |
| `transform: translate(-2px, -2px)` | ❌ 否 | ❌ 否 | 极低 | ✅ 唯一 |

```css
/* ❌ 错误示例：导致布局抖动 */
.nb-button:hover {
  margin-top: -2px;
  margin-left: -2px;
  box-shadow: 6px 6px 0 var(--nb-shadow-color);
}

/* ✅ 正确示例：仅合成层变化 */
.nb-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
}
```

### 3.2 Active 不导致可点击区域明显偏移

**问题**：Active 状态下元素位移过大，用户点击后手指/光标可能已不在元素上方，导致视觉与交互不一致。

**约束规则**：

1. **Active 位移量 ≤ 默认阴影偏移量**。例如默认阴影为 `4px 4px`，Active 位移最大为 `4px 4px`。元素移动后，其新位置恰好与阴影消失前的**视觉底部/右侧对齐**，用户认知中"元素还在原处"。
2. **可点击区域（hit area）**在视觉上仍能被用户识别：位移后元素不应与相邻元素重叠或产生歧义。
3. **最小触摸目标**：即使发生位移，组件必须保持至少 `44px × 44px` 的物理点击区域（符合 WCAG 2.5.5）。

```css
/* 验证：位移量 = 阴影偏移量，视觉重心守恒 */
.nb-button {
  --default-shadow: 4px;
}

.nb-button:active {
  /* 位移量 4px = 默认阴影 4px，视觉上元素"落回原平面" */
  transform: translate(var(--default-shadow), var(--default-shadow));
  box-shadow: none;
}
```

---

## 4. 触摸设备策略

Neo-Brutal UI 的设计哲学要求：**不依赖 Hover 作为核心状态提示**。Hover 仅是桌面端的增强体验，所有状态信息必须通过默认视觉或 Active 状态传达。

### 4.1 无 Hover 环境的降级策略

| 设备类型 | Hover 支持 | 策略 |
|----------|------------|------|
| 桌面（鼠标） | ✅ 支持 | Hover 提供阴影提升；Active 提供按下反馈 |
| 触摸（手机/平板） | ❌ 不支持 | 仅通过 `:active` 伪类提供按下反馈；Hover 样式不生效 |
| 混合（Surface/触摸笔记本） | ⚠️ 部分支持 | 使用 `@media (hover: hover)` 精准判断 |

### 4.2 触摸端 CSS 实现

```css
/* 默认：所有设备都有 Active 反馈 */
.nb-button:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(4px, 4px);
  transition-duration: 100ms; /* 触摸端反馈更快 */
}

/* 桌面端增强：Hover 提升 */
@media (hover: hover) and (pointer: fine) {
  .nb-button:hover {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }

  .nb-button:hover:active {
    /* 从 Hover 状态按下：直接归零，无中间态 */
    box-shadow: var(--nb-shadow-none);
    transform: translate(4px, 4px);
  }
}

/* 触摸端：禁用 Hover 样式，避免 sticky hover 问题 */
@media (hover: none) and (pointer: coarse) {
  .nb-button:hover {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: none;
  }
}
```

### 4.3 核心原则

- **Hover 不改变颜色作为唯一状态提示**：例如，不允许"仅通过 Hover 改变背景色来暗示可点击"。必须始终有阴影或边框变化作为默认识别特征。
- **触摸端必须能完成全部操作**：所有功能不依赖 Hover 触发，Dropdown 等组件通过 Click/Tap 打开，而非 Hover 延迟打开。
- **`-webkit-tap-highlight-color`**：移除浏览器默认的触摸高亮，避免与 Neo-Brutal 的自定义 Active 样式冲突。

```css
.nb-button {
  -webkit-tap-highlight-color: transparent;
}
```

---

## 5. 减少动画偏好（prefers-reduced-motion）

当用户启用系统级"减少动画"（Windows: 设置 → 辅助功能 → 视觉效果；macOS: 系统设置 → 辅助功能 → 显示 → 减少动态效果）时，必须取消所有位移动画，仅保留即时（instant）的阴影切换。

### 5.1 实现规则

- **取消 `transform` 位移**：元素在状态变化时**不发生位置移动**，直接切换阴影。
- **过渡时长归零**：使用 `transition: none` 或 `transition-duration: 0.01ms`（后者用于保留 `transitionend` 事件触发，如需 JS 监听）。
- **保留即时视觉反馈**：阴影仍然从 `md` → `none` 切换，只是无动画过程。

### 5.2 完整 CSS 代码示例

```css
/* 标准动画模式（默认） */
.nb-button {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .nb-button,
  .nb-button:hover,
  .nb-button:active {
    /* 禁用位移 */
    transform: none !important;
    /* 即时切换，无过渡 */
    transition: none;
    /* 或保留 transitionend 兼容性：
       transition-duration: 0.01ms;
    */
  }

  .nb-button:hover {
    /* 无位移，仅阴影提升 */
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  }

  .nb-button:active {
    /* 无位移，仅阴影归零 */
    box-shadow: var(--nb-shadow-none);
  }
}
```

### 5.3 可选增强：不依赖 `@media` 的 Token 方案

```css
:root {
  --nb-motion-transform: translate(-2px, -2px);
  --nb-motion-transition: transform 150ms ease, box-shadow 150ms ease;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --nb-motion-transform: none;
    --nb-motion-transition: none;
  }
}

.nb-button:hover {
  transform: var(--nb-motion-transform);
  transition: var(--nb-motion-transition);
}
```

> **此方案的优势**：所有运动逻辑通过 Token 控制，减少 `@media` 块的重复代码，便于主题级统一管理。

---

## 6. 位移公式速查表

| 状态 | 阴影阶梯 | 阴影 X | 阴影 Y | `translateX` | `translateY` | 运动方向 | 视觉隐喻 |
|------|----------|--------|--------|--------------|--------------|----------|----------|
| Default | `md` | `4px` | `4px` | `0` | `0` | — | 平放于桌面 |
| Hover | `lg` | `6px` | `6px` | `-2px` | `-2px` | 左上 | 被手指/光标向上轻推 |
| Active | `none` | `0` | `0` | `4px` | `4px` | 右下 | 被按下至桌面平面 |
| Dragging（预留） | `xl` | `8px` | `8px` | `-4px` | `-4px` | 左上 | 被拿起移动 |
| Disabled | `none` | `0` | `0` | `0` | `0` | — | 无交互，无深度 |

### 6.1 通用公式

```
Hover translate = -(shadow_hover - shadow_default)
Active translate = shadow_default
```

| 默认阴影 | Hover 阴影 | Hover 位移 | Active 位移 |
|----------|------------|------------|-------------|
| `sm (2px)` | `md (4px)` | `(-2px, -2px)` | `(2px, 2px)` |
| `md (4px)` | `lg (6px)` | `(-2px, -2px)` | `(4px, 4px)` |
| `lg (6px)` | `xl (8px)` | `(-2px, -2px)` | `(6px, 6px)` |
| `xs (1px)` | `sm (2px)` | `(-1px, -1px)` | `(1px, 1px)` |

> **规律**：Hover 位移量始终为 `-(hover_shadow - default_shadow)`，即阴影增量的反方向。Active 位移量始终等于默认阴影的偏移量。

---

## 7. 可直接复制使用的 CSS 代码块

### 7.1 核心 Token 定义（放入 `theme.css` 或 `tokens.css`）

```css
/* =============================================
   Neo-Brutal UI — Shadow & Motion Tokens
   ============================================= */

:root {
  /* ---- 阴影几何（无颜色） ---- */
  --nb-shadow-none: 0px 0px 0;
  --nb-shadow-xs: 1px 1px 0;
  --nb-shadow-sm: 2px 2px 0;
  --nb-shadow-md: 4px 4px 0;
  --nb-shadow-lg: 6px 6px 0;
  --nb-shadow-xl: 8px 8px 0;

  /* ---- 阴影颜色（主题适配） ---- */
  --nb-shadow-color: color-mix(in oklch, var(--nb-base-content) 25%, transparent);

  /* ---- 过渡时长 ---- */
  --nb-duration-fast: 100ms;
  --nb-duration-normal: 150ms;
  --nb-duration-slow: 250ms;

  /* ---- 缓动曲线 ---- */
  --nb-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --nb-easing-brutal: cubic-bezier(0.25, 0.1, 0.25, 1.0);

  /* ---- 运动控制（用于 prefers-reduced-motion） ---- */
  --nb-motion-transform-hover: translate(-2px, -2px);
  --nb-motion-transform-active: translate(4px, 4px);
  --nb-motion-transition: transform var(--nb-duration-normal) var(--nb-easing-standard),
                         box-shadow var(--nb-duration-normal) var(--nb-easing-standard);
}

/* 深色主题阴影增强 */
[data-theme="neo-brutal-dark"] {
  --nb-shadow-color: color-mix(in oklch, var(--nb-base-content) 35%, transparent);
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --nb-motion-transform-hover: none;
    --nb-motion-transform-active: none;
    --nb-motion-transition: none;
  }
}
```

### 7.2 标准交互组件模式（Button / Card / 可点击面板）

```css
/* =============================================
   Neo-Brutal UI — Standard Interactive Surface
   ============================================= */

.nb-surface {
  /* 默认状态 */
  box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
  transform: translate(0, 0);
  transition: var(--nb-motion-transition);
  will-change: transform, box-shadow;

  /* 触摸高亮清除 */
  -webkit-tap-highlight-color: transparent;
}

/* Hover：仅在有精细指针的设备生效 */
@media (hover: hover) and (pointer: fine) {
  .nb-surface:hover {
    box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
    transform: var(--nb-motion-transform-hover);
  }
}

/* Active / Pressed：所有设备 */
.nb-surface:active,
.nb-surface[data-active="true"] {
  box-shadow: var(--nb-shadow-none);
  transform: var(--nb-motion-transform-active);
}

/* Disabled */
.nb-surface:disabled,
.nb-surface[aria-disabled="true"] {
  opacity: 0.5;
  box-shadow: var(--nb-shadow-none);
  transform: none;
  cursor: not-allowed;
  pointer-events: none;
}
```

### 7.3 小型组件模式（Badge / 小标签 / 紧凑按钮）

```css
.nb-surface-sm {
  box-shadow: var(--nb-shadow-sm) var(--nb-shadow-color);
  transform: translate(0, 0);
  transition: var(--nb-motion-transition);
}

@media (hover: hover) and (pointer: fine) {
  .nb-surface-sm:hover {
    box-shadow: var(--nb-shadow-md) var(--nb-shadow-color);
    transform: translate(-2px, -2px);
  }
}

.nb-surface-sm:active {
  box-shadow: var(--nb-shadow-none);
  transform: translate(2px, 2px);
}
```

### 7.4 大型组件模式（Modal / Drawer / Dropdown Panel）

```css
.nb-surface-lg {
  box-shadow: var(--nb-shadow-lg) var(--nb-shadow-color);
  transform: translate(0, 0);
  transition: var(--nb-motion-transition);
}

/* 大型组件通常不提升 Hover（避免过度夸张），但可提升 Dragging */
.nb-surface-lg[data-dragging="true"] {
  box-shadow: var(--nb-shadow-xl) var(--nb-shadow-color);
  transform: translate(-4px, -4px);
  border-style: dashed;
}
```

### 7.5 完整状态矩阵（可复制到 Storybook / 文档）

```css
/*
 * 状态矩阵速查（以 --nb-shadow-md 为默认的组件）
 *
 * | 状态      | 阴影              | 位移                | 其他                     |
 * |-----------|-------------------|---------------------|--------------------------|
 * | Default   | md (4px 4px)      | none                | —                        |
 * | Hover     | lg (6px 6px)      | translate(-2,-2)  | —                        |
 * | Active    | none (0 0)        | translate(4,4)      | —                        |
 * | Focus     | md (4px 4px)      | none                | outline: 2px solid focus |
 * | Disabled  | none (0 0)        | none                | opacity: 0.5             |
 * | Loading   | md (4px 4px)      | none                | aria-busy="true"         |
 * | Dragging  | xl (8px 8px)      | translate(-4,-4)    | border-style: dashed     |
 */
```

---

## 8. 设计检查清单（Checklist）

- [ ] 所有阴影是否使用 `box-shadow` 而非 `drop-shadow` 滤镜？
- [ ] 所有阴影是否 `blur = 0` 且 `spread = 0`？
- [ ] 阴影颜色是否使用 `color-mix(in oklch, ...)` 而非固定 `#000`？
- [ ] Hover 位移是否使用 `transform: translate()` 而非 `margin` 或 `position`？
- [ ] Active 位移量是否 ≤ 默认阴影偏移量？
- [ ] 过渡时长是否 ≤ 150ms（标准状态）且 ≤ 250ms（最大允许）？
- [ ] 触摸设备是否仅通过 `:active` 提供反馈，不依赖 Hover？
- [ ] 是否实现 `@media (prefers-reduced-motion: reduce)` 并取消位移？
- [ ] 是否移除 `-webkit-tap-highlight-color` 避免默认高亮冲突？
- [ ] 所有 `transform` 和 `box-shadow` 是否添加 `transition` 且使用 GPU 加速属性？

---

> **文档版本**：v1.0  
> **最后更新**：设计系统初版  
> **维护者**：Neo-Brutal UI 设计系统团队
