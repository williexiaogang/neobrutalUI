# 2. 品牌命名与视觉铁律

> 本文档定义 Neo-Brutal UI 设计系统的品牌身份与底层视觉约束。所有 Token、CSS 变量与命名规则必须在此文档中明确后方可进入组件实现阶段。
> 
> **适用范围**：所有 CSS 变量、组件类名、主题配置、设计稿审查。

---

## 2.1 品牌与命名

### 2.1.1 风格名称

| 属性 | 值 | 说明 |
|------|-----|------|
| **风格名** | `Neo-Brutalism` | 已确认。指代「新粗野主义」设计风格——高对比度、硬阴影、直角边框、无渐变、无拟物。 |
| **类名前缀** | `nb-` | 已确认。所有公共类名必须以 `nb-` 开头，如 `nb-btn`、`nb-card`。私有工具类使用 `nbu-`（保留，暂未启用）。 |
| **npm 包正式名称** | `neo-brutal-ui` | 发布到 npm 的正式包名。短横线连接，全小写，符合 npm 命名规范。 |
| **组件库展示名称** | `Neo-Brutal UI` | 对外展示、文档站标题、README 标题使用的名称。空格分隔，首字母大写。 |
| **主题名称** | `neo-brutal` | 默认浅色主题标识名。 |
| **Dark Theme 名称** | `neo-brutal-dark` | 默认暗色主题标识，与 `neo-brutal` 成对出现。 |
| **扩展主题** | `emerald` / `emerald-dark` | 以 emerald 绿为主色的浅色/暗色主题。 |

### 2.1.2 命名理由与使用场景

#### `Neo-Brutalism`（风格名）

- **理由**：直接继承设计圈公认的「Neobrutalism」或「Neo-Brutalism」术语，无需创造新词。加连字符 `-` 与品牌命名规范统一。
- **使用场景**：设计文档分类、营销材料、设计趋势文章引用、主题描述字段。

#### `nb-`（类名前缀）

- **理由**：取 `Neo-Brutal` 的首字母缩写。短（2 字符）、易记、冲突概率低。对比 `neo-brutal-`（过长）和 `nb-`（简洁），后者在密集 HTML 中可读性更好。
- **使用场景**：所有组件级 CSS 类名，如：
  - `nb-btn`（按钮）
  - `nb-card`（卡片）
  - `nb-input`（输入框）
  - `nb-modal`（模态框）
- **禁止**：不允许使用无前缀的通用类名（如 `btn`、`card`），避免与宿主项目冲突。

#### `neo-brutal-ui`（npm 包名）

- **理由**：遵循 npm 包名规范——全小写、短横线分隔、无特殊符号。同时包含 `ui` 以明确这是一个 UI 组件库，区别于 `neo-brutal`（可能指设计风格本身）。
- **使用场景**：`package.json` 的 `name` 字段、`npm install neo-brutal-ui`、CDN 路径 `/npm/neo-brutal-ui@latest/`。

#### `Neo-Brutal UI`（展示名称）

- **理由**：面向开发者和设计师的友好名称，符合「产品名」直觉。空格分隔使其更像一个产品，而非一个配置项。
- **使用场景**：文档站 `<title>`、README 一级标题、GitHub 仓库名（`NeoBrutalUI` 用于仓库 URL，但标题使用 `Neo-Brutal UI`）、演讲幻灯片。

#### `neo-brutal`（主题名）

- **理由**：Tailwind CSS v4 插件主题名称采用短横线小写格式。与 npm 包名区分，主题名更短，强调「风格」而非「包」。
- **使用场景**：`tailwind.config.js` 或 CSS 配置中的 `theme.name`：
  ```css
  @plugin "neo-brutal-ui" {
    theme: neo-brutal;
  }
  ```

#### `neo-brutal-dark`（暗色主题名）

- **理由**：与 `neo-brutal` 形成对称命名，`-dark` 后缀是 Tailwind 生态和 daisyUI 的暗色模式惯例。
- **使用场景**：暗色模式切换开关、`data-theme="neo-brutal-dark"` 主题容器。

#### `emerald` / `emerald-dark`（扩展主题名）

- **理由**：以 emerald 绿（OKLCH 155°）为主色，搭配 teal、lime、sky blue 等辅助色，提供一组与默认主题不同的品牌配色。`-dark` 提供对应的暗色版本。
- **使用场景**：`data-theme="emerald"` 或 `data-theme="emerald-dark"` 主题容器。

---

## 2.2 视觉铁律

视觉铁律是 Neo-Brutal UI 的不可违反的底层约束。任何组件、变体、扩展都必须在此铁律框架内构建。

### 2.2.1 边框（Border）

- **主要边框宽度**：`2px`
- **主要边框样式**：`solid`
- **边框颜色规则**：不使用固定纯黑（如 `#000` 或 `black`），而是基于内容色（content color）通过 `color-mix` 动态计算，确保在不同主题色下保持一致的视觉重量。

```css
:root {
  /* 默认边框：当前内容色的 20% 混合透明 */
  --nb-border: color-mix(in oklch, var(--nb-base-content) 20%, transparent);
  /* 强调边框：当前内容色的 40% 混合透明 */
  --nb-border-strong: color-mix(in oklch, var(--nb-base-content) 40%, transparent);
}
```

**示例：不同背景下的边框一致性**

```css
.nb-card {
  border: 2px solid var(--nb-border);
}

.nb-card-primary {
  /* 在 primary 色背景上，边框自动基于 primary-content 计算 */
  --nb-base-content: var(--nb-primary-content);
  background: var(--nb-primary);
  border: 2px solid var(--nb-border);
}
```

**说明**：`color-mix(in oklch, ...)` 确保在 OKLCH 色空间下混合，避免色相漂移。使用 `currentColor` 或具体语义变量（如 `var(--nb-base-content)`）而非硬编码 `#000`，使主题切换时边框自动适应。

---

### 2.2.2 圆角（Radius）

- **默认圆角**：`0px`（即直角）
- **这是原则**：Neo-Brutalism 的核心特征之一是拒绝「友好」的圆角。绝大多数组件必须为直角。
- **允许的例外**：仅在功能性组件（如 Radio、Toggle、Avatar）中允许圆形或胶囊形，详见 `radius-and-borders.md` 的圆角例外清单。

```css
:root {
  --nb-radius: 0px;
  --nb-radius-selector: 0px;
  --nb-radius-field: 0px;
  --nb-radius-box: 0px;
  --nb-radius-overlay: 0px;
  --nb-radius-full: 9999px; /* 仅用于 Badge 胶囊形、Avatar 圆形等例外 */
  --nb-radius-circle: 50%;  /* 仅用于 Radio、Toggle、Status Dot */
}
```

---

### 2.2.3 硬阴影（Hard Shadows）

- **定义**：使用纯色阴影（`box-shadow`），**无模糊半径（blur radius = 0）、无扩散（spread = 0）、无渐变过渡**。
- **原理**：硬阴影模拟物理世界中物体与光源的刚性关系，是新粗野风格的标志性特征。

```css
:root {
  --nb-shadow-none: 0 0 0 transparent;
  --nb-shadow-xs: 1px 1px 0 var(--nb-shadow-color);
  --nb-shadow-sm: 2px 2px 0 var(--nb-shadow-color);
  --nb-shadow-md: 4px 4px 0 var(--nb-shadow-color);
  --nb-shadow-lg: 6px 6px 0 var(--nb-shadow-color);
  --nb-shadow-xl: 8px 8px 0 var(--nb-shadow-color);

  /* 阴影颜色：基于内容色的 25% 混合 */
  --nb-shadow-color: color-mix(in oklch, var(--nb-base-content) 25%, transparent);
}
```

**注意**：`box-shadow` 的语法中第三个值是 blur radius，必须严格为 `0`。任何 `box-shadow: Xpx Ypx Npx`（其中 N > 0）都是违反铁律的。

---

### 2.2.4 表面层级定义（Surface Hierarchy）

页面中的元素按物理层级分为四级，每一级对应一个语义化颜色变量。禁止跳过层级，禁止自行添加「第 5 层」。

| 层级 | 语义名称 | CSS 变量 | 用途说明 | 典型场景 |
|------|---------|----------|---------|---------|
| **Page** | 页面底层 | `--nb-base-100` | 最底层背景，整个页面的画布 | `<body>` 背景、大面积页面底色 |
| **Surface** | 普通组件表面 | `--nb-base-200` | 可放置内容的平面，如卡片、面板 | Card、Alert、Table 容器 |
| **Raised Surface** | 凸起表面 | `--nb-base-300` | 需要被抬起的表面，暗示可交互或更高层级 | Hover 状态提升、Stat 组件 |
| **Overlay** | 覆盖层 | `--nb-overlay` | 模态、抽屉、下拉面板背后的遮罩 | Modal Backdrop、Dropdown Panel |

```css
:root {
  --nb-base-100: #ffffff;        /* 页面底层 */
  --nb-base-200: #f3f3f3;        /* 普通表面 */
  --nb-base-300: #e8e8e8;        /* 凸起表面 */
  --nb-overlay: #000000;         /* 覆盖层，通常配合透明度使用 */
  --nb-overlay-opacity: 0.3;     /* 覆盖层默认透明度 */
}
```

**层级使用规则**：

1. 背景层（`--nb-base-100`）上可以直接放置 Surface（`--nb-base-200`）。
2. 同一层级之间保持相同背景色，通过边框和阴影区分边界。
3. 不允许在 `--nb-base-100` 上直接放置 `--nb-base-300`（必须经历 `--nb-base-200` 作为中间层）。
4. Overlay 仅用于遮罩，不用于内容承载。

**示例代码**：

```css
.nb-page {
  background: var(--nb-base-100);
}

.nb-card {
  background: var(--nb-base-200);
  border: 2px solid var(--nb-border);
  box-shadow: var(--nb-shadow-md);
}

.nb-card:hover {
  background: var(--nb-base-300); /* Raised Surface */
}

.nb-modal-backdrop {
  background: color-mix(in oklch, var(--nb-overlay) 30%, transparent);
}
```

---

### 2.2.5 背景使用规则

| 规则 | 说明 | 状态 |
|------|------|------|
| **纯色优先** | 所有背景必须使用 `solid` 纯色（CSS 颜色值、`var()` 引用），禁止使用 `linear-gradient`、`radial-gradient`、`conic-gradient`。 | 强制 |
| **禁止渐变** | 任何渐变效果均违背新粗野主义的「无修饰」原则。 | 强制 |
| **禁止噪点/纹理** | 不使用 `background-image` 引入噪点、纸张纹理、颗粒感图片。风格应通过硬阴影、粗边框、高对比色彩表达，而非纹理模拟。 | 强制 |
| **允许图案背景** | 允许使用 CSS 图案（如细条纹、点阵、方格），但**仅作为装饰性组件的背景**（如 Hero 区域、营销 Banner），且**不作为任何组件的默认状态**。 | 可选，受控 |

**允许的装饰性图案示例**（仅限非默认场景）：

```css
/* 细条纹：仅用于装饰性 Banner */
.nb-hero-pattern-stripe {
  background: repeating-linear-gradient(
    45deg,
    var(--nb-base-200),
    var(--nb-base-200) 10px,
    var(--nb-base-300) 10px,
    var(--nb-base-300) 20px
  );
}

/* 点阵：仅用于装饰性区域 */
.nb-hero-pattern-dots {
  background-image: radial-gradient(circle, var(--nb-border) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

> ⚠️ **警告**：上述图案代码中使用了 `repeating-linear-gradient` 和 `radial-gradient`。这是**唯一允许使用渐变语法**的场景，且仅用于生成几何图案，而非色彩过渡。组件库核心样式中不得使用。

---

### 2.2.6 插图、图标和照片容器规则

| 类型 | 规则 | 说明 |
|------|------|------|
| **插图（Illustration）** | 允许粗线条风格（thick-stroke）。线条宽度建议 ≥ 2px，色彩使用主题色或高对比黑白。 | 推荐使用 SVG 格式，确保线条可缩放。 |
| **图标（Icon）** | 允许粗线条风格。推荐线宽 2px，端点使用 `stroke-linecap="round"` 或 `stroke-linecap="square"`。禁止使用细线（< 2px）图标。 | 若使用第三方图标库（如 Phosphor、Tabler），选择「bold」或「duotone」权重。 |
| **照片容器（Photo Container）** | 容器本身使用 `2px solid var(--nb-border)` 实线边框。容器内部的照片**不应用任何滤镜**（如 `filter: grayscale()`、`filter: sepia()`）。 | 保持照片的真实色彩，容器的粗边框即已提供足够的风格化。 |

```css
.nb-photo-frame {
  border: 2px solid var(--nb-border);
  box-shadow: var(--nb-shadow-md);
  /* 照片内部无滤镜 */
}

.nb-photo-frame img {
  display: block;
  width: 100%;
  height: auto;
  /* 明确禁止滤镜 */
  filter: none;
}

.nb-icon {
  stroke-width: 2px;
  stroke-linecap: square;
  stroke-linejoin: miter;
}
```

---

### 2.2.7 信息密度（Density）

信息密度控制组件内部的 padding、gap 以及文本间距，适应不同场景的数据密度需求。

| 密度模式 | 场景 | Padding | Gap | 典型应用 |
|---------|------|---------|-----|---------|
| **Compact** | 数据密集场景（表格、仪表盘、管理后台） | `0.5rem`（8px） | `0.25rem`（4px） | 数据表格、密集列表、属性面板 |
| **Default** | 通用场景，平衡可读性与密度 | `1rem`（16px） | `0.5rem`（8px） | 标准表单、卡片、按钮 |
| **Comfortable** | 营销页、展示页，需要呼吸感 | `1.5rem`（24px） | `1rem`（16px） | 落地页、博客文章、产品展示 |

```css
:root {
  /* 密度 Token */
  --nb-density-compact-padding: 0.5rem;
  --nb-density-compact-gap: 0.25rem;
  
  --nb-density-default-padding: 1rem;
  --nb-density-default-gap: 0.5rem;
  
  --nb-density-comfortable-padding: 1.5rem;
  --nb-density-comfortable-gap: 1rem;
}

/* 默认使用 Default 密度 */
.nb-component {
  padding: var(--nb-density-default-padding);
  gap: var(--nb-density-default-gap);
}

/* 紧凑模式 */
.nb-density-compact .nb-component,
.nb-component.nb-density-compact {
  padding: var(--nb-density-compact-padding);
  gap: var(--nb-density-compact-gap);
}

/* 舒适模式 */
.nb-density-comfortable .nb-component,
.nb-component.nb-density-comfortable {
  padding: var(--nb-density-comfortable-padding);
  gap: var(--nb-density-comfortable-gap);
}
```

**密度应用原则**：

1. 组件默认使用 `Default` 密度。
2. 密度通过父级类名（如 `.nb-density-compact`）或组件自身类名（如 `.nb-table.nb-density-compact`）控制。
3. 密度变化**只影响内部 padding 和 gap**，不影响边框宽度、阴影大小、字体大小。
4. 按钮、输入框等表单元素在 `Compact` 模式下仍保持最小可点击区域（≥ 44×44px，触摸设备 ≥ 48×48px）。

---

### 2.2.8 字体策略（Typography）

#### 默认字体栈

```css
:root {
  --nb-font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  
  --nb-font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", "Courier New", monospace;
}

body {
  font-family: var(--nb-font-sans);
}
```

| 用途 | 字体栈 | 说明 |
|------|--------|------|
| **默认字体** | `var(--nb-font-sans)` | 系统字体栈优先，保证跨平台渲染一致性，无需加载外部字体。 |
| **标题字体** | `var(--nb-font-sans)` | 与默认字体栈相同，但通过字重（`font-weight: 700` 或 `800`）和字号区分层级。 |
| **等宽字体** | `var(--nb-font-mono)` | 用于代码、数值、标签（Label）、时间戳等需要等宽对齐的场景。 |

#### 字重范围（Font Weight）

| 字重 | 值 | 使用场景 | 状态 |
|------|-----|---------|------|
| 轻量 | 300 | 极少使用，仅用于超大展示标题（Display Text） | 可选 |
| 常规 | 400 | 正文、段落、描述 | 默认 |
| 中等 | 500 | 次标题、辅助文本 | 可选 |
| 半粗 | 600 | 小标题、卡片标题、表头 | 推荐 |
| 粗体 | 700 | 按钮文本、主标题、强调 | 推荐 |
| 特粗 | 800 | 超大标题、Hero 文本、关键数字 | 推荐 |
| 黑体 | 900 | 最大强调，仅用于特殊营销场景 | 可选 |

```css
:root {
  --nb-weight-light: 300;
  --nb-weight-normal: 400;
  --nb-weight-medium: 500;
  --nb-weight-semibold: 600;
  --nb-weight-bold: 700;
  --nb-weight-extrabold: 800;
  --nb-weight-black: 900;
}
```

**推荐字重**：日常开发优先使用 **400、600、700、800** 四个档位。300 和 500 可作为微调，900 不建议常规使用。

#### 大写文本使用规则（Uppercase）

`text-transform: uppercase` 在 Neo-Brutal UI 中是**受控风格**，不是默认。

| 允许使用的组件 | 必须同时增加 `letter-spacing` | 说明 |
|---------------|------------------------------|------|
| **Label** | `var(--nb-tracking-wide)`（0.05em） | 表单标签、属性名 |
| **Badge** | `var(--nb-tracking-wider)`（0.1em） | 状态标签、分类标记 |
| **小标题 / Overline** | `var(--nb-tracking-wide)`（0.05em） | 章节前的小标题、面包屑分隔 |
| **按钮文本** | 可选，`var(--nb-tracking-normal)`（0） | 默认按钮文本不使用 uppercase，除非设计稿明确要求 |

```css
.nb-label {
  text-transform: uppercase;
  letter-spacing: var(--nb-tracking-wide);
  font-weight: var(--nb-weight-semibold);
  font-size: 0.875rem; /* 14px */
}

.nb-badge {
  text-transform: uppercase;
  letter-spacing: var(--nb-tracking-wider);
  font-weight: var(--nb-weight-bold);
  font-size: 0.75rem; /* 12px */
}
```

**禁止**：正文段落、长文本、卡片描述、表单占位符（placeholder）禁止使用 `uppercase`。

#### 字间距规则（Letter Spacing / Tracking）

```css
:root {
  --nb-tracking-tight: -0.02em;   /* 紧凑，用于超大标题，消除视觉空隙 */
  --nb-tracking-normal: 0;        /* 默认，无额外间距 */
  --nb-tracking-wide: 0.05em;     /* 加宽，用于 uppercase Label */
  --nb-tracking-wider: 0.1em;     /* 更宽，用于 uppercase Badge、小标签 */
}
```

| Token | 值 | 使用场景 |
|-------|-----|---------|
| `--nb-tracking-tight` | `-0.02em` | 大标题（H1、H2）、Display 文本，减少大字号的松散感 |
| `--nb-tracking-normal` | `0` | 正文、段落、默认状态 |
| `--nb-tracking-wide` | `0.05em` | uppercase Label、小标题、Overline |
| `--nb-tracking-wider` | `0.1em` | uppercase Badge、极小标签、状态标记 |

```css
.nb-heading-1 {
  font-size: 2.5rem;
  font-weight: var(--nb-weight-extrabold);
  letter-spacing: var(--nb-tracking-tight);
  line-height: 1.1;
}

.nb-badge-primary {
  font-size: 0.75rem;
  font-weight: var(--nb-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--nb-tracking-wider);
}
```

---

## Token 速查表（Token Cheat Sheet）

> 本表汇总本文档中定义的所有 CSS 自定义属性（CSS Variables / Design Tokens），按类别分组。所有 Token 均以 `--nb-` 为前缀。

### 品牌与命名 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-prefix` | `nb` | 类名前缀（CSS 中不直接使用，作为命名规范） |
| `--nb-theme` | `neo-brutal` | 主题标识 |
| `--nb-theme-dark` | `neo-brutal-dark` | 暗色主题预留标识 |

### 颜色与边框 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-border` | `color-mix(in oklch, var(--nb-base-content) 20%, transparent)` | 默认边框色 |
| `--nb-border-strong` | `color-mix(in oklch, var(--nb-base-content) 40%, transparent)` | 强调边框色 |
| `--nb-base-100` | `#ffffff` | 页面底层背景 |
| `--nb-base-200` | `#f3f3f3` | 普通组件表面背景 |
| `--nb-base-300` | `#e8e8e8` | 凸起表面背景 |
| `--nb-overlay` | `#000000` | 覆盖层底色 |
| `--nb-overlay-opacity` | `0.3` | 覆盖层默认透明度 |

### 阴影 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-shadow-color` | `color-mix(in oklch, var(--nb-base-content) 25%, transparent)` | 阴影基准色 |
| `--nb-shadow-none` | `0 0 0 transparent` | 无阴影 |
| `--nb-shadow-xs` | `1px 1px 0 var(--nb-shadow-color)` | 超小阴影 |
| `--nb-shadow-sm` | `2px 2px 0 var(--nb-shadow-color)` | 小阴影 |
| `--nb-shadow-md` | `4px 4px 0 var(--nb-shadow-color)` | 中等阴影 |
| `--nb-shadow-lg` | `6px 6px 0 var(--nb-shadow-color)` | 大阴影 |
| `--nb-shadow-xl` | `8px 8px 0 var(--nb-shadow-color)` | 超大阴影 |

### 圆角 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-radius` | `0px` | 全局默认圆角（直角） |
| `--nb-radius-selector` | `0px` | Selector 类别圆角 |
| `--nb-radius-field` | `0px` | Field 类别圆角 |
| `--nb-radius-box` | `0px` | Box 类别圆角 |
| `--nb-radius-overlay` | `0px` | Overlay 类别圆角 |
| `--nb-radius-full` | `9999px` | 胶囊形（Badge 等） |
| `--nb-radius-circle` | `50%` | 圆形（Radio、Toggle、Avatar） |

### 密度 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-density-compact-padding` | `0.5rem` | 紧凑模式 padding |
| `--nb-density-compact-gap` | `0.25rem` | 紧凑模式 gap |
| `--nb-density-default-padding` | `1rem` | 默认模式 padding |
| `--nb-density-default-gap` | `0.5rem` | 默认模式 gap |
| `--nb-density-comfortable-padding` | `1.5rem` | 舒适模式 padding |
| `--nb-density-comfortable-gap` | `1rem` | 舒适模式 gap |

### 字体 Token

| Token | 值 | 说明 |
|-------|-----|------|
| `--nb-font-sans` | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, ...` | 无衬线字体栈 |
| `--nb-font-mono` | `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", "Courier New", monospace` | 等宽字体栈 |
| `--nb-weight-light` | `300` | 轻量字重 |
| `--nb-weight-normal` | `400` | 常规字重（默认） |
| `--nb-weight-medium` | `500` | 中等字重 |
| `--nb-weight-semibold` | `600` | 半粗字重 |
| `--nb-weight-bold` | `700` | 粗体字重 |
| `--nb-weight-extrabold` | `800` | 特粗字重 |
| `--nb-weight-black` | `900` | 黑体字重 |
| `--nb-tracking-tight` | `-0.02em` | 紧凑字间距 |
| `--nb-tracking-normal` | `0` | 默认字间距 |
| `--nb-tracking-wide` | `0.05em` | 加宽字间距 |
| `--nb-tracking-wider` | `0.1em` | 更宽字间距 |

---

> **文档版本**：v1.0  
> **最后更新**：2025 年 6 月  
> **维护者**：Neo-Brutal UI 设计系统团队  
> **审核状态**：待技术评审（Tech Review）
