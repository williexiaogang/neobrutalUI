# Neo-Brutal UI 组件库开发 Todo List

> **项目定位**：一个采用 daisyUI 组件 API 设计思想、但拥有独立类名与实现的新粗野风格 UI 组件库。  
> **目标用户**：Tailwind CSS v4+ 项目、Vite 项目及其他支持 CSS 导入的现代前端项目。  
> **发布方式**：npm 包。  
> **核心原则**：强作用域类名、Token 驱动、CSS 核心零运行时依赖、可选原生 JavaScript 交互包、可嵌套多主题。  
> **非目标**：不兼容 Tailwind CSS v3；不提供 CDN；不保证与 daisyUI 的类名或 DOM 结构直接兼容。

---

## 0. 已确认的产品契约

开始开发前，以下约束视为已确定，除非通过正式的设计决策记录修改。

- [x] **组件库类型**
  - 采用独立实现方案。
  - 复用 daisyUI 的组件分类、修饰符组合和易用性思想。
  - 不使用 daisyUI 的原始组件类名。
  - 不以“daisyUI 主题”或“daisyUI 可替换皮肤”作为产品定位。

- [x] **类名策略**
  - 使用强作用域命名。
  - 组件类、变体类、尺寸类和状态类都包含组件名称。
  - 示例：

    ```html
    <button class="nb-btn nb-btn-primary nb-btn-lg">
      Button
    </button>
    ```

  - 禁止以下弱作用域写法：

    ```html
    <button class="nb-btn nb-primary nb-lg">
    ```

- [x] **技术基线**
  - Tailwind CSS v4+。
  - 现代浏览器。
  - 不兼容 Tailwind CSS v3。
  - 使用 OKLCH 作为主题颜色的主要表达方式。
  - 优先使用现代 CSS，避免无必要的 polyfill。

- [x] **安装方式**
  - 发布 npm 包。
  - 支持 CSS `@import`。
  - 支持 JavaScript / TypeScript 模块导入。
  - 不提供 CDN 构建。

- [x] **主题能力**
  - 支持在同一页面通过 `data-theme` 嵌套多个主题。
  - Token 不直接全局污染 `:root`。
  - 第一版可以只发布新粗野主题，但架构必须支持未来扩展其他风格及 Dark Theme。

- [x] **运行时边界**
  - 核心视觉组件为纯 CSS。
  - 复杂交互通过可选原生 JavaScript 包提供。
  - CSS 包不得强依赖 JavaScript 包。
  - JavaScript 交互包不得依赖 React、Vue、Svelte 或第三方状态库。

- [x] **首发策略**
  - 首先实现 MVP 核心组件。
  - 其他组件继续记录在本文件中，标记为后续或可选。
  - 不因首发范围缩小而破坏整体 API 一致性。

- [x] **首版基础能力**
  - 键盘可操作。
  - `:focus-visible`。
  - RTL。
  - `prefers-reduced-motion`。
  - `forced-colors`。
  - 响应式尺寸和布局修饰符。
  - Dark Theme 不必首发，但必须预留完整能力。

---

# 阶段 1：项目边界与架构决策

> **目标**：在编写组件前固定目录、包边界、浏览器基线和兼容承诺。

## 1.1 定义支持范围

- [x] 在 `support-policy.md` 中记录：
  - Tailwind CSS 最低版本：v4。
  - Node.js 最低版本。
  - TypeScript 最低版本。
  - 支持的包管理器：npm、pnpm、yarn。
  - 支持的浏览器范围。
  - 是否支持 Shadow DOM。
  - 是否支持无 Tailwind 项目直接引入编译后的 CSS。
  - 不支持 Tailwind CSS v3。
  - 不提供 CDN。

- [x] 建议浏览器基线：
  - Chrome / Edge 最近两个主要版本。
  - Firefox 最近两个主要版本。
  - Safari 17+。
  - iOS Safari 17+。
  - Android Chrome 最近两个主要版本。

- [x] 明确现代 CSS 能力使用清单：
  - CSS Custom Properties。
  - Cascade Layers。
  - Logical Properties。
  - `color-mix()` 是否允许。
  - `:has()` 是否允许。
  - CSS Nesting 是否允许。
  - Container Queries 是否允许。
  - `@property` 是否允许。

## 1.2 建立设计决策记录

- [x] 创建 `docs/decisions/`。
- [x] 建立 ADR 模板：
  - 背景。
  - 决策。
  - 替代方案。
  - 影响。
  - 状态。
  - 日期。

- [x] 至少记录以下 ADR：
  - `001-independent-component-library.md`
  - `002-strong-scoped-class-names.md`
  - `003-tailwind-v4-only.md`
  - `004-css-core-and-optional-interactions.md`
  - `005-data-theme-scoping.md`

## 1.3 建立 Monorepo 或包目录

推荐结构：

```text
neo-brutal-ui/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   ├── base/
│   │   │   ├── components/
│   │   │   ├── utilities/
│   │   │   └── index.css
│   │   ├── tests/
│   │   └── package.json
│   ├── interactions/
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   └── themes/
│       └── neo-brutal/
│           ├── src/
│           ├── tests/
│           └── package.json
├── apps/
│   ├── docs/
│   └── playground/
├── docs/
│   ├── decisions/
│   ├── components/
│   └── guides/
├── scripts/
├── package.json
└── README.md
```

- [x] 决定使用单包还是多包发布。
- [x] 推荐初期发布：
  - `@scope/neo-brutal-ui`
  - `@scope/neo-brutal-ui/interactions`
- [x] 若多主题成熟后，再拆分独立主题包。
- [x] 配置 workspace。
- [x] 配置统一 lint、test、build、release 命令。

## 1.4 阶段验收

- [x] 新成员只阅读 README 和 ADR 即可理解产品边界。
- [x] 核心 CSS 与交互 JavaScript 的职责没有重叠或歧义。
- [x] 包名、目录、导出路径和版本策略已确定。

---

# 阶段 2：新粗野视觉规范

> **目标**：建立可测量、可复现的新粗野视觉语言，而不是只使用“黑边框 + 硬阴影”的模糊描述。

## 2.1 品牌与命名

- [x] 风格名：Neo-Brutalism。
- [x] 类名前缀：`nb-`。
- [x] 确定 npm 包正式名称。
- [x] 确定组件库展示名称。
- [x] 确定主题名称：
  - 建议：`neo-brutal`
- [x] 确定 Dark Theme 预留名称：
  - 建议：`neo-brutal-dark`

## 2.2 视觉铁律

- [x] 主要边框：2px 实线。
- [x] 默认圆角：0px。
- [x] 使用硬阴影。
- [x] 明确边框颜色是否始终为内容色，而非固定纯黑。
- [x] 定义表面层级：
  - Page。
  - Surface。
  - Raised Surface。
  - Overlay。
- [x] 定义背景使用规则：
  - 纯色优先。
  - 是否允许渐变。
  - 是否允许噪点或纸张纹理。
  - 是否允许图案背景。
- [x] 定义插图、图标和照片容器规则。
- [x] 定义信息密度：
  - Compact。
  - Default。
  - Comfortable。
- [x] 定义字体策略：
  - 默认字体栈。
  - 标题字体栈。
  - 等宽字体栈。
  - 字重范围。
  - 大写文本使用规则。
  - 字间距规则。

## 2.3 阴影与位移数学关系

- [x] 定义阴影阶梯：

  ```css
  --nb-shadow-xs;
  --nb-shadow-sm;
  --nb-shadow-md;
  --nb-shadow-lg;
  ```

- [x] 定义每一级阴影的 X/Y 偏移。
- [x] 明确 Hover 和 Active 的位移公式。
- [x] 推荐初始规则：

  ```text
  Default：4px 4px 0
  Hover：6px 6px 0，同时 translate(-2px, -2px)
  Active：0 0 0，同时 translate(4px, 4px)
  ```

- [x] 检查 Hover 不造成周围布局抖动。
- [x] 检查 Active 不导致可点击区域明显偏移。
- [x] 为触摸设备定义无 Hover 的替代反馈。
- [x] 为 `prefers-reduced-motion` 定义无位移动画模式。

## 2.4 圆角、边框和组件类别

不要只定义一个全局圆角和边框变量，按组件类别拆分：

```css
--nb-radius-selector;
--nb-radius-field;
--nb-radius-box;
--nb-radius-overlay;

--nb-border-selector;
--nb-border-field;
--nb-border-box;
--nb-border-overlay;
```

- [x] Selector：Checkbox、Radio、Toggle。
- [x] Field：Button、Input、Select、Textarea。
- [x] Box：Card、Alert、Table、Stat。
- [x] Overlay：Modal、Dropdown、Tooltip、Drawer。
- [x] 定义允许使用圆形或胶囊形的例外：
  - Radio。
  - Toggle 滑块。
  - Avatar。
  - 状态点。
  - Loading 图形。

## 2.5 交互语言

- [x] Default。
- [x] Hover。
- [x] Active / Pressed。
- [x] Focus Visible。
- [x] Disabled。
- [x] Readonly。
- [x] Invalid。
- [x] Selected / Checked。
- [x] Open / Expanded。
- [x] Loading / Busy。
- [x] Dragging（后续组件需要时）。
- [x] 明确所有状态不可只通过颜色区分。
- [x] 确定全局过渡时长阶梯：

  ```css
  --nb-duration-fast;
  --nb-duration-normal;
  --nb-duration-slow;
  ```

- [x] 确定缓动曲线。
- [x] 新粗野风格优先使用直接、短促的动画，避免过度柔和。

## 2.6 设计基准稿

至少完成以下视觉稿，包含所有状态：

- [x] Button。
- [x] Card。
- [x] Input。
- [x] Select。
- [x] Checkbox。
- [x] Modal。
- [x] Alert。
- [x] Table。

## 2.7 阶段验收

- [ ] 根据规范独立Button
- [ ] 阴影、位移、边框和圆角均有数值定义。
- [ ] 所有组件例外都有记录，不依赖开发者临时判断。
- [ ] 设计稿覆盖键盘焦点、禁用和错误状态。

---

# 阶段 3：类名、DOM 与组件 API 契约

> **目标**：先定义公共 API，再实现 CSS，避免后续因命名不一致产生破坏性更新。

## 3.1 类名分类

所有公共类名必须属于以下类别之一：

| 类别 | 格式 | 示例 |
|---|---|---|
| Component | `nb-{component}` | `nb-btn` |
| Part | `nb-{component}-{part}` | `nb-card-body` |
| Variant | `nb-{component}-{variant}` | `nb-btn-outline` |
| Color | `nb-{component}-{color}` | `nb-btn-primary` |
| Size | `nb-{component}-{size}` | `nb-btn-lg` |
| State | `nb-{component}-{state}` | `nb-btn-loading` |
| Layout | `nb-{component}-{layout}` | `nb-tabs-vertical` |
| Placement | `nb-{component}-{placement}` | `nb-tooltip-top` |

- [x] 建立公共命名词典。
- [x] 禁止同义词混用，例如：
  - `large` 与 `lg`。
  - `danger` 与 `error`。
  - `active` 与 `selected`。
- [x] 默认尺寸统一为 `md`，默认类可以省略。
- [x] 公共尺寸阶梯：

  ```text
  xs / sm / md / lg / xl
  ```

- [ ] 不要求每个组件实现全部尺寸，但已实现的尺寸必须使用上述名称。
- [x] 响应式变体遵循 Tailwind 前缀：

  ```html
  <button class="nb-btn nb-btn-sm md:nb-btn-md lg:nb-btn-lg">
  ```

## 3.2 DOM Contract

每个组件文档必须定义：

- [x] 推荐语义元素。
- [x] 必需子元素。
- [x] 可选子元素。
- [x] 允许嵌套结构。
- [x] 不允许的结构。
- [x] ARIA 属性。
- [x] 键盘行为。
- [x] 数据属性。
- [x] JavaScript 初始化方式。
- [x] 服务端渲染行为。
- [x] 无 JavaScript 时的降级方式。

示例：

```html
<div class="nb-card">
  <div class="nb-card-header">...</div>
  <div class="nb-card-body">...</div>
  <div class="nb-card-footer">...</div>
</div>
```

## 3.3 状态矩阵

不要要求所有组件都实现同样的五种状态。为每个组件选择适用状态：

| 状态类别 | 状态 |
|---|---|
| Pointer | hover、active |
| Keyboard | focus-visible |
| Availability | disabled、readonly |
| Validation | valid、invalid |
| Selection | checked、indeterminate、selected |
| Disclosure | open、closed、expanded |
| Loading | loading、busy |
| Data | empty、partial、complete |

- [x] 为每个组件建立状态表。
- [x] 未适用状态标记为 N/A。
- [x] CSS 类状态与原生伪类优先级明确。
- [x] 原生属性优先，例如：
  - `disabled`
  - `checked`
  - `open`
  - `aria-expanded`
- [x] 只有原生状态无法表达时才增加公共状态类。

## 3.4 API 稳定性

- [x] 组件类名视为公共 API。
- [x] Token 名称视为公共 API。
- [x] DOM Contract 是否属于稳定 API 需要明确。
- [x] 发布前建立弃用机制。
- [x] 禁止未记录的公共类名。
- [x] 建立 API 快照测试。

## 3.5 阶段验收

- [x] 所有 MVP 组件在写 CSS 前已有 API 草案。
- [x] 不存在 `nb-btn-large` 与 `nb-btn-lg` 等重复表达。
- [x] 状态主要通过原生 HTML 属性表达。
- [x] 公共 API 能够被自动提取到文档。

---

# 阶段 4：Token 与主题系统

> **目标**：建立 Primitive、Semantic、Component 三层 Token，支持主题嵌套和后续扩展。

## 4.1 Primitive Tokens

Primitive Token 表达原始设计值，不直接描述业务语义。

- [x] 原始颜色。
- [x] 空间阶梯。
- [x] 字号阶梯。
- [x] 行高阶梯。
- [x] 字重。
- [x] 边框宽度。
- [x] 圆角。
- [x] 阴影偏移。
- [x] 动画时长。
- [x] 层级。

示例：

```css
--nb-color-yellow-500;
--nb-color-blue-500;
--nb-space-1;
--nb-space-2;
--nb-border-2;
--nb-shadow-offset-md;
```

## 4.2 Semantic Color Tokens

至少包含：

```css
--nb-base-100;
--nb-base-200;
--nb-base-300;
--nb-base-content;
--nb-base-content-muted;

--nb-neutral;
--nb-neutral-content;

--nb-primary;
--nb-primary-content;

--nb-secondary;
--nb-secondary-content;

--nb-accent;
--nb-accent-content;

--nb-info;
--nb-info-content;

--nb-success;
--nb-success-content;

--nb-warning;
--nb-warning-content;

--nb-error;
--nb-error-content;

--nb-border;
--nb-focus;
--nb-overlay;
```

- [x] 每个语义背景色都有对应 content Token。
- [x] 不在组件中自行推断文字颜色。
- [x] 所有色值使用 OKLCH 为主要表示。
- [x] 提供 sRGB fallback 的必要性评估。
- [x] 定义颜色超出目标色域时的处理方式。
- [x] 对比度测试基于最终浏览器输出颜色，而不是只检查源 OKLCH 数值。

## 4.3 Component Tokens

组件可暴露少量稳定的覆盖入口：

```css
--nb-btn-border-width;
--nb-btn-shadow;
--nb-btn-padding-inline;
--nb-input-focus-offset;
--nb-card-padding;
--nb-modal-max-width;
```

- [x] 仅暴露真正有长期定制价值的 Token。
- [x] 禁止把每条 CSS 声明都转换成公共 Token。
- [x] 内部 Token 使用清晰前缀并标记为非公共。
- [x] 文档区分公共 Token 与内部 Token。

## 4.4 主题作用域

推荐：

```css
@layer theme {
  [data-theme="neo-brutal"] {
    --nb-primary: ...;
  }
}
```

- [x] 不把主题 Token 仅定义在 `:root`。
- [x] 支持：

  ```html
  <body data-theme="neo-brutal">
    <section data-theme="future-theme">
      ...
    </section>
  </body>
  ```

- [x] 验证嵌套主题继承。
- [x] 验证 Portal / Overlay 场景的主题继承。
- [x] 为 Modal 等挂载到 `body` 的组件提供主题传递说明。
- [x] 预留 `neo-brutal-dark`。
- [x] v1 即使不发布 Dark Theme，也不得在组件内硬编码亮色假设。

## 4.5 CSS Cascade Layers

- [x] 固定 Layer 顺序：

  ```css
  @layer reset, theme, base, components, utilities, overrides;
  ```

- [x] 记录用户覆写推荐位置。
- [x] 避免不必要的 `!important`。
- [x] 对状态、变体和用户 utility 的优先级建立测试。
- [x] 验证与 Tailwind v4 utility 混用时的覆盖关系。

## 4.6 Token 自动检查

- [x] 检查组件 CSS 中的硬编码颜色。
- [x] 检查未定义 Token。
- [x] 检查循环引用。
- [x] 检查不符合命名规范的 Token。
- [x] 检查 public/internal Token 清单。
- [x] 修改 `--nb-primary` 后所有相关组件自动更新。
- [x] 修改主题作用域只影响对应子树。

## 4.7 阶段验收

- [x] 组件文件不直接写 `#hex` 或未经批准的 `oklch()`。
- [x] 同一页面可嵌套两个主题。
- [x] Token 文档包含名称、层级、默认值、用途和稳定性。
- [x] 为未来 Dark Theme 添加主题时不需要修改组件 CSS。

---

# 阶段 5：基础样式与通用能力

## 5.1 Base Reset

- [x] 只加入组件库必须的最小 Reset。
- [x] 不覆盖宿主项目所有 HTML 元素。
- [x] 默认使用 `box-sizing: border-box` 的范围需明确。
- [x] 不擅自修改全局 body 字体或背景。
- [x] Form controls 的字体继承规则明确。
- [x] 图像和 SVG 的默认行为明确。

## 5.2 RTL 与 Logical Properties

- [x] 公共 CSS 优先使用：
  - `margin-inline`
  - `padding-inline`
  - `border-inline-start`
  - `inset-inline-end`
  - `block-size`
  - `inline-size`

- [x] 公共 API 使用：
  - `start / end`
  - 不使用 `left / right` 表达语义位置。

- [x] Tooltip 等真实方向组件可保留物理方向，但需补充 RTL 行为说明。
- [x] 在 `dir="rtl"` 下测试全部 MVP 组件。
- [x] 复杂图标方向是否镜像需逐项定义。

## 5.3 响应式策略

- [ ] 使用 Tailwind v4 响应式前缀。
- [ ] 组件内部不写死与宿主项目冲突的断点值，或明确采用统一断点。
- [ ] 定义移动优先原则。
- [ ] Modal、Drawer、Navbar、Table 提供移动端行为。
- [ ] 支持 320px 宽度。
- [ ] 测试横屏移动设备。

## 5.4 Z-index 系统

- [x] 定义层级 Token：

  ```css
  --nb-z-dropdown;
  --nb-z-sticky;
  --nb-z-drawer;
  --nb-z-modal;
  --nb-z-toast;
  --nb-z-tooltip;
  ```

- [x] 禁止组件中使用未登记的任意 z-index。
- [x] 文档说明与宿主项目层级冲突的处理方式。
- [x] 检查嵌套 stacking context。

## 5.5 阶段验收

- [ ] 引入组件库不会重置整个宿主项目。
- [ ] RTL 下无关键布局错误。
- [ ] 320px 宽度下核心组件可用。
- [ ] Overlay 层级关系可预测。

---

# 阶段 6：MVP 组件

> **目标**：完成能够支撑常见应用界面的首发组件集。所有组件必须先有 API Contract，再有实现。

## 6.1 Button

- [x] 基础类：`nb-btn`。
- [x] 颜色：
  - `nb-btn-neutral`
  - `nb-btn-primary`
  - `nb-btn-secondary`
  - `nb-btn-accent`
  - `nb-btn-info`
  - `nb-btn-success`
  - `nb-btn-warning`
  - `nb-btn-error`
- [x] 外观：
  - `nb-btn-outline`
  - `nb-btn-ghost`
  - `nb-btn-link`
- [x] 尺寸：xs / sm / md / lg / xl。
- [x] 形态：
  - 图标按钮。
  - 全宽。
  - 方形。
- [x] 状态：
  - hover。
  - active。
  - focus-visible。
  - disabled。
  - loading。
- [x] 原生 `<button>` 和 `<a>` 的使用差异。
- [x] 图标按钮必须有 accessible name。
- [x] Loading 时内容尺寸不跳动。

## 6.2 Card

- [x] `nb-card`。
- [x] `nb-card-header`。
- [x] `nb-card-body`。
- [x] `nb-card-footer`。
- [x] `nb-card-title`。
- [x] 变体：
  - 默认。
  - 无阴影。
  - Interactive。
  - Media。
- [x] Interactive Card 的语义和键盘行为明确。
- [x] Card 本身不默认拥有点击行为。
- [x] 长标题和长正文压力测试。

## 6.3 Input

- [x] `nb-input`。
- [x] 尺寸：sm / md / lg。
- [x] 状态：
  - focus-visible。
  - disabled。
  - readonly。
  - invalid。
  - valid。
- [x] Placeholder。
- [x] 前后图标容器。
- [x] Prefix / Suffix 文本。
- [x] Error message 关联。
- [x] 浏览器 autofill 样式。
- [x] 日期、数字和搜索输入兼容检查。

## 6.4 Textarea

- [x] 复用 Field Token。
- [x] 最小高度。
- [x] resize：
  - vertical 默认。
  - none 可选。
- [x] disabled / readonly / invalid。
- [x] 字数提示结构。
- [x] 长内容滚动。

## 6.5 Select

- [x] `nb-select`。
- [x] 单选原生 `<select>`。
- [x] 尺寸：sm / md / lg。
- [x] disabled / invalid。
- [x] 自定义箭头。
- [x] RTL 箭头位置。
- [x] forced-colors 下保持可用。
- [x] 第一版不实现复杂 Combobox，避免与原生 Select 混淆。

## 6.6 Checkbox

- [x] `nb-checkbox`。
- [x] checked。
- [x] indeterminate。
- [x] disabled。
- [x] focus-visible。
- [x] forced-colors。
- [x] 选中标记不只通过背景颜色表达。
- [x] 与 Label 组合示例。

## 6.7 Radio

- [x] `nb-radio`。
- [x] checked。
- [x] disabled。
- [x] focus-visible。
- [x] Radio Group 语义。
- [x] 箭头键行为依赖原生 radio。
- [x] 圆形作为允许的视觉例外。

## 6.8 Toggle

- [x] `nb-toggle`。
- [x] 基于 checkbox。
- [x] checked。
- [x] disabled。
- [x] focus-visible。
- [x] 滑块动画。
- [x] reduced-motion。
- [x] 开关必须有可访问标签。
- [x] 不使用颜色作为唯一状态提示。

## 6.9 Field / Form Control

- [x] `nb-field`。
- [x] `nb-field-label`。
- [x] `nb-field-description`。
- [x] `nb-field-error`。
- [x] Required 标识。
- [x] Label 与控件显式绑定。
- [x] Error message 使用 `aria-describedby`。
- [x] Fieldset 与 Legend 示例。
- [x] 横向和纵向布局。

## 6.10 Badge

- [x] `nb-badge`。
- [x] 语义颜色。
- [x] outline。
- [x] 尺寸。
- [x] 状态点模式。
- [x] 可移除标签的按钮结构。
- [x] 不将 Badge 误用为 Button。

## 6.11 Alert

- [x] `nb-alert`。
- [x] info / success / warning / error。
- [x] 图标区。
- [x] 标题和正文。
- [x] 操作区。
- [x] 可关闭样式。
- [x] 使用 inline-start 强调边框。
- [x] `role="alert"` 和普通静态提示的区别写入文档。

## 6.12 Divider

- [x] 水平。
- [x] 垂直。
- [x] 带文字。
- [x] 使用逻辑方向属性。
- [x] 装饰性 Divider 对屏幕阅读器隐藏。
- [x] 不错误替代语义 `<hr>`。

## 6.13 Loading

- [x] Spinner。
- [x] 方块或几何风格 Loader。
- [x] 尺寸。
- [x] 语义颜色。
- [x] reduced-motion 替代。
- [x] 与按钮 Loading 状态组合。
- [x] 屏幕阅读器提示策略。

## 6.14 Skeleton

- [x] Text Skeleton。
- [x] Avatar Skeleton。
- [x] Card Skeleton。
- [x] reduced-motion。
- [x] 避免造成强烈闪烁。
- [x] 保持最终内容布局空间。

## 6.15 Tabs

- [x] `nb-tabs`。
- [x] `nb-tab`。
- [x] `nb-tab-panel`。
- [x] 横向 / 纵向。
- [x] active。
- [x] disabled。
- [x] 键盘方向键切换。
- [x] `role="tablist"`、`role="tab"`、`role="tabpanel"`。
- [x] CSS 只负责视觉，交互由可选 JS 包负责。
- [x] 无 JS 时提供普通链接降级方案。

## 6.16 Dropdown

- [x] Trigger。
- [x] Panel。
- [x] Item。
- [x] Divider。
- [x] Group label。
- [x] start / end 对齐。
- [x] 键盘导航。
- [x] Escape 关闭。
- [x] 点击外部关闭。
- [x] Focus 管理。
- [x] 区分普通 Popover 与 ARIA Menu。
- [x] 交互由可选 JS 包负责。

## 6.17 Modal

- [x] Backdrop。
- [x] Dialog。
- [x] Header / Body / Footer。
- [x] sm / md / lg / full。
- [x] 打开和关闭动画。
- [x] Escape 关闭。
- [x] 点击 Backdrop 关闭策略。
- [x] Focus Trap。
- [x] 初始焦点。
- [x] 关闭后焦点返回。
- [x] 页面滚动锁定。
- [x] `role="dialog"`。
- [x] `aria-modal="true"`。
- [x] Portal 下的主题传递。
- [x] 交互由可选 JS 包负责。

## 6.18 Tooltip

- [x] top / bottom / start / end。
- [x] hover 和 focus 均可触发。
- [x] `aria-describedby`。
- [x] 延迟显示策略。
- [x] 触摸设备策略。
- [x] 不允许 Tooltip 内放交互元素。
- [x] forced-colors。
- [x] 视口边缘碰撞处理由可选 JS 增强。

## 6.19 Table

- [x] 基础 Table。
- [x] Header。
- [x] Zebra。
- [x] Hover。
- [x] Compact。
- [x] 响应式横向滚动容器。
- [x] Sticky Header 可选。
- [x] 排序按钮结构。
- [x] Empty State。
- [x] Caption。
- [x] 不默认将表格转换为卡片，以免破坏语义。

## 6.20 Navbar

- [x] Brand。
- [x] Navigation。
- [x] Actions。
- [x] Sticky 可选。
- [x] 移动端折叠结构。
- [x] 汉堡按钮 accessible name。
- [x] 与 Drawer 组合。
- [x] RTL。
- [x] Safe area 支持评估。

## 6.21 MVP 验收

每个 MVP 组件必须满足：

- [ ] API 文档完成。
- [ ] HTML 示例可复制运行。
- [ ] 无 JavaScript 核心样式可显示。
- [ ] 适用状态齐全。
- [ ] Keyboard 测试通过。
- [ ] axe 自动测试无严重问题。
- [ ] RTL 截图通过。
- [ ] reduced-motion 通过。
- [ ] forced-colors 基本可用。
- [ ] 320px 移动端通过。
- [ ] 200% 缩放通过。
- [ ] 长文本和中文内容通过。
- [ ] 不含未经批准的硬编码颜色。
- [ ] 视觉回归基线已建立。

---

# 阶段 7：可选原生 JavaScript 交互包

> **目标**：为 CSS 无法完整实现的组件提供无框架、可访问、可 Tree-shake 的行为层。

## 7.1 公共原则

- [x] 零框架依赖。
- [x] TypeScript 源码。
- [x] ESM 输出。
- [x] 支持 Tree-shaking。
- [x] SSR 安全，不在模块顶层直接访问 `window` 或 `document`。
- [x] 不自动扫描整个 DOM，除非用户显式启用 auto-init。
- [x] 初始化函数返回 destroy 方法。
- [x] 支持重复初始化保护。
- [x] 事件名称带命名空间。
- [x] 公共 API 有类型定义。
- [x] 核心交互包 gzip 体积目标明确。

## 7.2 建议 API

```ts
createTabs(element, options)
createDropdown(element, options)
createDialog(element, options)
createDrawer(element, options)
createDisclosure(element, options)
createTooltip(element, options)
```

- [x] 每个 API 返回：
  - `open()`。
  - `close()`。
  - `toggle()`。
  - `destroy()`。
  - 当前状态读取方法。

- [x] 支持受控模式。
- [x] 支持非受控模式。
- [x] 支持生命周期事件。
- [x] 支持取消事件。
- [x] 不把动画工具和组件交互混为同一个 `toggleClass()` API。

## 7.3 通用动画辅助

可选提供：

- [ ] `reveal()`。
- [ ] `countUp()`。
- [ ] `stagger()`。

要求：

- [ ] `IntersectionObserver` 不支持时合理降级。
- [ ] reduced-motion 时直接显示最终状态。
- [ ] 不默认修改用户内容。
- [ ] 不造成布局持续重算。

## 7.4 阶段验收

- [ ] JS 未加载时页面内容仍可访问。
- [ ] Modal、Tabs、Dropdown 的键盘行为通过测试。
- [ ] 初始化和销毁不会泄漏监听器。
- [ ] 打包后可按函数 Tree-shake。
- [ ] TypeScript 类型测试通过。

---

# 阶段 8：后续组件与可选组件

> **目标**：保留完整路线图，但不阻塞 MVP 发布。

## 8.1 P1：首发后优先组件

- [ ] Drawer。
- [ ] Menu。
- [ ] Breadcrumbs。
- [ ] Pagination。
- [ ] Toast。
- [ ] Accordion。
- [ ] Progress。
- [ ] Avatar。
- [ ] Stat。
- [ ] Steps。
- [ ] Empty State。
- [ ] Button Group / Join。

## 8.2 P2：数据展示组件

- [ ] Timeline。
- [ ] Rating。
- [ ] Chat Bubble。
- [ ] Kbd。
- [ ] List。
- [ ] Description List。
- [ ] Carousel。
- [ ] Collapse。
- [ ] Code Block。
- [ ] Diff Viewer 样式。

## 8.3 P3：页面与营销组件

- [ ] Hero。
- [ ] Footer。
- [ ] Pricing Card。
- [ ] Feature Grid。
- [ ] Mockup Browser。
- [ ] Mockup Phone。
- [ ] Mockup Window。
- [ ] Command Palette 样式。
- [ ] Calendar 样式。
- [ ] Date Picker 样式。

## 8.4 P4：高级表单组件

- [ ] Range。
- [ ] File Input。
- [ ] Combobox。
- [ ] Multi Select。
- [ ] Autocomplete。
- [ ] OTP Input。
- [ ] Segmented Control。
- [ ] Color Picker 样式。
- [ ] Date / Time Input 增强。
- [ ] Form Validation Summary。

## 8.5 组件加入条件

新增组件前必须回答：

- [ ] 是否可由现有组件组合完成。
- [ ] 是否有明确高频使用场景。
- [ ] 是否需要 JavaScript。
- [ ] 是否能满足可访问性要求。
- [ ] 是否会扩大公共 API。
- [ ] 是否已有稳定的原生 HTML 语义。
- [ ] 是否适合放在核心包，还是示例 / Recipe。
- [ ] 是否会显著增加包体积。

---

# 阶段 9：可访问性规范

> **目标**：无障碍不是发布前补丁，而是组件 Contract 的一部分。

## 9.1 全局要求

- [ ] 使用语义 HTML。
- [ ] 键盘可完成全部核心操作。
- [ ] Focus 顺序符合视觉顺序。
- [ ] 使用 `:focus-visible`。
- [ ] Focus 样式在所有主题背景上清晰。
- [ ] 触摸目标建议至少 44×44 CSS px，或提供足够的组合点击区域。
- [ ] 状态不只通过颜色表达。
- [ ] 支持 200% 缩放。
- [ ] 支持系统字体放大。
- [ ] 支持屏幕阅读器名称和描述。
- [ ] 动态内容有适当 live region 策略。
- [ ] 避免无意义的 ARIA。
- [ ] 优先使用原生元素，而不是重造语义。

## 9.2 Reduced Motion

- [ ] 所有位移、旋转、闪烁和 Shimmer 都检查：

  ```css
  @media (prefers-reduced-motion: reduce)
  ```

- [ ] 关闭非必要动画。
- [ ] 保留必要的状态变化，但改为即时或淡入。
- [ ] 不因关闭动画导致内容不可见。

## 9.3 Forced Colors

- [ ] 测试 Windows High Contrast / `forced-colors: active`。
- [ ] 不依赖背景图片表达选中状态。
- [ ] Checkbox、Radio、Toggle 可识别。
- [ ] Focus ring 可见。
- [ ] 边框不会因强制色消失。
- [ ] 必要时使用系统颜色关键字。

## 9.4 自动与人工测试

- [ ] axe-core。
- [ ] Playwright + axe。
- [ ] 键盘手动测试。
- [ ] VoiceOver 冒烟测试。
- [ ] NVDA 冒烟测试。
- [ ] forced-colors 手动测试。
- [ ] reduced-motion 手动测试。

## 9.5 阶段验收

- [ ] MVP 无 Critical / Serious axe 问题。
- [ ] Modal、Tabs、Dropdown 完成人工键盘测试。
- [ ] 所有表单错误可被屏幕阅读器关联。
- [ ] 无纯颜色状态。
- [ ] 可访问性问题进入发布阻塞清单。

---

# 阶段 10：国际化、RTL 与内容压力测试

## 10.1 国际化约束

- [ ] 组件 CSS 不包含需要翻译的固定文本。
- [ ] JS 默认提示文本可配置。
- [ ] 不通过 CSS `content` 写入关键业务文本。
- [ ] 日期、数字、货币格式不由视觉组件库处理。
- [ ] 图标和文本顺序支持 RTL。
- [ ] start / end 替代 left / right。

## 10.2 内容压力测试

每个 MVP 组件至少测试：

- [ ] 简体中文。
- [ ] 繁体中文。
- [ ] 英文。
- [ ] 阿拉伯语 RTL。
- [ ] 长德语文本。
- [ ] 超长不可断词字符串。
- [ ] Emoji。
- [ ] 无文本仅图标。
- [ ] 按钮文本长度翻倍。
- [ ] Card 标题三行。
- [ ] 表格列内容超长。
- [ ] 输入框系统自动填充。

## 10.3 阶段验收

- [ ] RTL 下无方向性硬编码。
- [ ] 长文本不会遮挡关键操作。
- [ ] 文本扩展 200% 后主要布局仍可使用。
- [ ] 组件不假设英文字符宽度。

---

# 阶段 11：测试与质量门禁

> **目标**：把视觉一致性、API 稳定性和可访问性变成自动化发布门槛。

## 11.1 静态检查

- [ ] ESLint。
- [ ] Stylelint。
- [ ] TypeScript strict。
- [ ] Prettier。
- [ ] CSS Token 检查脚本。
- [ ] 禁止未登记 z-index。
- [ ] 禁止未登记动画时长。
- [ ] 禁止未登记公共类名。
- [ ] 检查逻辑方向属性使用。
- [ ] 检查包导出有效性。

## 11.2 单元测试

- [ ] Token 生成。
- [ ] 类名映射。
- [ ] JS 初始化 / 销毁。
- [ ] Tabs 键盘切换。
- [ ] Dialog Focus Trap。
- [ ] Dropdown Escape 和外部点击。
- [ ] RTL 状态。
- [ ] reduced-motion 分支。
- [ ] SSR import。

## 11.3 视觉回归

- [ ] 使用 Playwright 截图。
- [ ] 每个组件至少包含：
  - Default。
  - Hover。
  - Active。
  - Focus。
  - Disabled。
  - Invalid。
  - RTL。
  - Mobile。
  - Dark Theme 预留测试页。
  - forced-colors 可人工辅助。

- [ ] 浏览器矩阵：
  - Chromium。
  - WebKit。
  - Firefox。

- [ ] Viewport：
  - 320×568。
  - 390×844。
  - 768×1024。
  - 1440×900。

## 11.4 包体积门槛

- [ ] 设定完整 CSS gzip 上限。
- [ ] 设定 Core CSS gzip 上限。
- [ ] 设定 Interactions JS gzip 上限。
- [ ] 记录每次发布的包体积变化。
- [ ] 超过阈值时 CI 失败或要求批准。
- [ ] 验证 CSS 构建不会重复包含 Token。

## 11.5 性能规则

- [ ] 动画优先使用 transform 和 opacity。
- [ ] 避免持续触发布局和绘制。
- [ ] 禁止无界 MutationObserver。
- [ ] IntersectionObserver 及时解除。
- [ ] Modal 滚动锁定不造成页面跳动。
- [ ] Tooltip / Dropdown 定位不在每帧无条件计算。
- [ ] 在中端移动设备进行人工检查。

## 11.6 API 回归

- [ ] 公共类名快照。
- [ ] 公共 Token 快照。
- [ ] JS 导出快照。
- [ ] TypeScript 类型测试。
- [ ] SemVer 规则测试。
- [ ] 删除或重命名公共 API 必须产生 major 版本。

## 11.7 阶段验收

- [ ] PR 必须通过 lint、typecheck、unit、visual 和 accessibility。
- [ ] 无未批准的视觉差异。
- [ ] 包体积未超过门槛。
- [ ] 公共 API 差异有明确说明。

---

# 阶段 12：文档与 Playground

## 12.1 文档模板

每个组件页面包含：

- [ ] 用途。
- [ ] 何时不使用。
- [ ] 安装与导入。
- [ ] 基础示例。
- [ ] 类名列表。
- [ ] DOM Contract。
- [ ] 变体。
- [ ] 尺寸。
- [ ] 状态矩阵。
- [ ] 可访问性要求。
- [ ] 键盘操作。
- [ ] RTL 示例。
- [ ] reduced-motion 说明。
- [ ] JavaScript 增强方式。
- [ ] 主题 Token。
- [ ] 常见错误。
- [ ] API 稳定性。

## 12.2 Playground

- [ ] 实时切换主题。
- [ ] 同页面嵌套不同主题。
- [ ] 切换 RTL。
- [ ] 切换 reduced-motion 模拟。
- [ ] 切换移动端 viewport。
- [ ] 修改主要 Token。
- [ ] 查看各组件状态。
- [ ] 复制 HTML。
- [ ] 显示 CSS / JS 导入方式。
- [ ] 展示长文本和多语言压力测试。

## 12.3 集成指南

- [ ] Vite。
- [ ] Tailwind CSS v4。
- [ ] 纯 CSS 项目。
- [ ] React。
- [ ] Vue。
- [ ] Svelte。
- [ ] Next.js。
- [ ] Astro。
- [ ] SSR 注意事项。
- [ ] 与现有 Tailwind Utility 混用。
- [ ] 与 daisyUI 共存时的前缀和 Layer 说明。
- [ ] Modal Portal 主题传递。

## 12.4 文档验收

- [ ] 新用户五分钟内完成安装并显示 Button。
- [ ] 示例代码来自真实测试文件，避免文档失效。
- [ ] 每个公共类名可在文档中搜索。
- [ ] 每个公共 Token 有说明。
- [ ] 版本切换和迁移指南可访问。

---

# 阶段 13：构建、npm 打包与发布

## 13.1 构建产物

建议导出：

```text
dist/
├── index.css
├── core.css
├── theme-neo-brutal.css
├── interactions.js
├── interactions.d.ts
└── package.json
```

- [ ] 未压缩开发版 CSS。
- [ ] 压缩生产版是否单独输出需确定。
- [ ] Source Map。
- [ ] TypeScript declarations。
- [ ] ESM。
- [ ] `sideEffects` 配置正确。
- [ ] CSS 文件包含在 npm 包中。
- [ ] 发布前检查 tarball 内容。

## 13.2 Package Exports

示例方向：

```json
{
  "exports": {
    ".": "./dist/index.css",
    "./core": "./dist/core.css",
    "./theme": "./dist/theme-neo-brutal.css",
    "./interactions": {
      "types": "./dist/interactions.d.ts",
      "import": "./dist/interactions.js"
    }
  }
}
```

- [ ] 实际导出结构经过 Node、Vite 和主流框架测试。
- [ ] CSS 导出能被 `@import` 和 JS import 使用。
- [ ] 不依赖 CDN。
- [ ] package.json 包含：
  - name。
  - version。
  - description。
  - keywords。
  - license。
  - repository。
  - bugs。
  - homepage。
  - files。
  - exports。
  - sideEffects。
  - engines。
  - peerDependencies。

## 13.3 版本管理

- [ ] 使用 SemVer。
- [ ] Changesets 或同等工具。
- [ ] 自动生成 Changelog。
- [ ] Prerelease：
  - `alpha`
  - `beta`
  - `rc`
- [ ] Public API 破坏性改动只进入 major。
- [ ] 视觉变化是否视为 breaking change 需定义。
- [ ] Token 删除和重命名视为 breaking change。

## 13.4 发布流程

- [ ] CI 构建。
- [ ] 测试。
- [ ] npm provenance。
- [ ] 2FA / Trusted Publishing。
- [ ] Dry run。
- [ ] 安装 tarball 冒烟测试。
- [ ] 发布 npm。
- [ ] 创建 Git tag。
- [ ] 创建 GitHub Release。
- [ ] 更新文档站版本。
- [ ] 发布后新建空项目验证安装。

## 13.5 发布验收

- [ ] `npm install` 成功。
- [ ] CSS 导入成功。
- [ ] Interactions 按需导入成功。
- [ ] TypeScript 类型正确。
- [ ] 没有意外包含源码、截图或测试产物。
- [ ] npm 页面包含清晰 README。
- [ ] 首发版本有迁移和已知限制说明。

---

# 阶段 14：主题生成器（后续）

> **目标**：允许用户从主色生成完整主题，但生成结果必须通过色域和可读性校验。

## 14.1 生成输入

- [ ] Primary。
- [ ] Base Background。
- [ ] Neutral。
- [ ] 风格强度。
- [ ] Border 对比度。
- [ ] Shadow 偏移。
- [ ] 是否生成 Dark Theme。
- [ ] 目标色域：sRGB / Display P3。

## 14.2 生成逻辑

- [ ] 不只通过固定 Hue +60° 生成 Secondary。
- [ ] 提供多种配色策略：
  - Analogous。
  - Complementary。
  - Split Complementary。
  - Manual。
- [ ] 自动生成 content 颜色。
- [ ] 自动生成 base 层级。
- [ ] 自动生成状态色。
- [ ] Hover / Active 同时考虑 L 和 C。
- [ ] Gamut mapping。
- [ ] 对比度检查。
- [ ] 状态色可区分性检查。

## 14.3 输出

- [ ] CSS Theme。
- [ ] JSON Token。
- [ ] 可复制 `data-theme` 名称。
- [ ] 预览全部 MVP 组件。
- [ ] 导出配置以便二次编辑。
- [ ] 生成结果包含警告信息。

## 14.4 验收

- [ ] 输出主题无需修改组件 CSS。
- [ ] Primary content 可读。
- [ ] 颜色没有明显超出目标色域。
- [ ] 错误、警告、成功状态可区分。
- [ ] 生成器输出通过 Token Schema 校验。

---

# MVP 发布路线

## Milestone A：基础架构

- [ ] 项目结构。
- [ ] 构建系统。
- [ ] CSS Layers。
- [ ] Token Schema。
- [ ] Neo-Brutal Theme。
- [ ] 文档框架。
- [ ] 测试框架。

## Milestone B：表单与基础展示

- [ ] Button。
- [ ] Card。
- [ ] Input。
- [ ] Textarea。
- [ ] Select。
- [ ] Checkbox。
- [ ] Radio。
- [ ] Toggle。
- [ ] Field。
- [ ] Badge。
- [ ] Alert。
- [ ] Divider。
- [ ] Loading。
- [ ] Skeleton。

## Milestone C：复杂界面

- [ ] Tabs。
- [ ] Dropdown。
- [ ] Modal。
- [ ] Tooltip。
- [ ] Table。
- [ ] Navbar。
- [ ] Interactions 基础包。

## Milestone D：质量与发布

- [ ] Accessibility。
- [ ] RTL。
- [ ] Reduced Motion。
- [ ] Forced Colors。
- [ ] Visual Regression。
- [ ] API Snapshot。
- [ ] npm Packaging。
- [ ] Documentation。
- [ ] Beta Release。
- [ ] RC Release。
- [ ] v1.0.0。

---

# Definition of Done

一个组件只有满足以下条件才可标记为完成：

- [ ] API Contract 已记录。
- [ ] 类名符合强作用域规范。
- [ ] DOM 结构已记录。
- [ ] 适用状态已实现。
- [ ] 使用 Token，无未批准硬编码。
- [ ] 支持 RTL。
- [ ] 支持 reduced-motion。
- [ ] forced-colors 基本可用。
- [ ] 键盘可操作。
- [ ] 可访问性测试通过。
- [ ] 移动端测试通过。
- [ ] 200% 缩放通过。
- [ ] 多语言长文本通过。
- [ ] 单元测试通过。
- [ ] 视觉回归已建立。
- [ ] 文档完成。
- [ ] 示例可运行。
- [ ] 包体积符合门槛。
- [ ] 没有未记录的公共 API。

---

# 当前状态

| 项目 | 状态 |
|---|---|
| 独立组件库方案 | ✅ 已确认 |
| 强作用域 `nb-` 类名 | ✅ 已确认 |
| Tailwind CSS v4+ | ✅ 已确认 |
| Tailwind CSS v3 | ❌ 不支持 |
| CDN | ❌ 不提供 |
| npm 发布 | ✅ 已确认 |
| 同页面多主题 | ✅ 已确认 |
| CSS 核心零 JS 依赖 | ✅ 已确认 |
| 可选原生 JS 交互包 | ✅ 已确认 |
| RTL | ✅ 首版支持 |
| Reduced Motion | ✅ 首版支持 |
| Forced Colors | ✅ 首版支持 |
| Dark Theme 成品 | ⏳ 后续 |
| Dark Theme 架构 | ✅ 首版预留 |
| MVP 组件实现 | ⏳ 待开发 |
| npm 包名 | ⏳ 待确定 |
| Node.js 最低版本 | ⏳ 待确定 |
| 浏览器基线最终确认 | ⏳ 待确定 |
| 包体积门槛 | ⏳ 待确定 |

---

# 开发原则速查

1. 先定义 API，再写 CSS。
2. 优先原生 HTML 状态，减少自定义状态类。
3. 组件只消费 Token，不直接消费主题具体颜色。
4. 所有公共类名强作用域。
5. CSS 核心不得依赖 JavaScript。
6. 复杂交互放入可选原生 JS 包。
7. 可访问性、RTL 和 Reduced Motion 属于首版能力。
8. 新组件先判断能否由现有组件组合。
9. 公共类名、Token 和 JS 导出均遵守 SemVer。
10. 文档示例必须来自可运行测试，避免示例漂移。

---

*最后更新：2026-07-03*  
*项目类型：独立 Neo-Brutal Tailwind CSS v4+ UI 组件库*  
*发布目标：npm*
