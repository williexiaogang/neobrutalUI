# ADR-005: 通过 `data-theme` 属性进行 Token 作用域控制

- 日期：2025-01-15
- 状态：accepted

---

## 背景（Context）

主题系统（Theme System）是组件库的核心基础设施之一。它定义了颜色、字体、间距、阴影、边框等设计 token，这些 token 通过 CSS 自定义属性（CSS Custom Properties）在组件样式中引用。例如：

```css
.nb-btn-primary {
  background-color: var(--nb-primary);
  border-color: var(--nb-primary-border);
}
```

主题系统的关键架构决策之一是：**token 的作用域如何控制？** 即，主题变量是在全局 `:root` 上定义，还是在某个特定选择器下定义？这直接决定了：

1. 是否支持同一页面内嵌套多个主题（如页面主体使用"neo-brutal"主题，但某个嵌入的 widget 使用"future-theme"）。
2. 主题切换的机制（全局切换 vs 局部切换）。
3. Portal / Overlay 组件（如 Modal、Dropdown、Toast）在 DOM 树中通常被挂载到 `document.body` 或 `document.documentElement`，脱离了原组件的 DOM 上下文，如何保证它们继承正确的主题？

传统的全局主题方案（如 `:root { --primary: #xxx; }`）简单直接，但缺乏嵌套能力。对于现代应用（如微前端、嵌入式 widget、设计系统文档站展示多主题对比），嵌套多主题能力越来越重要。

## 决策（Decision）

**Neo-Brutal UI 的 Token 通过 `data-theme` 属性进行作用域控制，不直接全局污染 `:root`。** 具体规则如下：

### 1. Token 定义在 `[data-theme]` 选择器下

每个主题的 token 定义在对应 `data-theme` 属性值的选择器下，而非全局 `:root`：

```css
/* 不推荐：全局污染 :root */
/* :root { --nb-primary: #3b82f6; } */

/* 推荐：在 data-theme 作用域内定义 */
[data-theme="neo-brutal"] {
  --nb-primary: oklch(60% 0.2 250);
  --nb-primary-border: oklch(50% 0.2 250);
  --nb-shadow-offset: 4px;
  --nb-shadow-color: oklch(20% 0.05 250);
  /* ... */
}

[data-theme="future-theme"] {
  --nb-primary: oklch(65% 0.18 300);
  /* ... */
}
```

### 2. 默认主题回退机制

为了兼容未显式设置 `data-theme` 的场景，提供一个基于 `:root` 的默认主题回退：

```css
:root,
[data-theme="neo-brutal"] {
  --nb-primary: oklch(60% 0.2 250);
  /* ... 默认主题 token ... */
}
```

这意味着：
- 如果页面任何元素都没有 `data-theme` 属性，`:root` 上的默认 token 生效。
- 如果元素或其祖先有 `data-theme="neo-brutal"`，由于 CSS 层叠的优先级，该作用域下的 token 会覆盖 `:root` 的默认值。
- 如果元素或其祖先有 `data-theme="future-theme"`，则使用另一套 token。

### 3. 嵌套主题能力

`data-theme` 属性的继承机制天然支持嵌套：

```html
<!-- 外层：neo-brutal 主题 -->
<body data-theme="neo-brutal">
  <button class="nb-btn nb-btn-primary">Neo-Brutal Button</button>

  <!-- 内层：future-theme 主题 -->
  <div data-theme="future-theme">
    <button class="nb-btn nb-btn-primary">Future Button</button>

    <!-- 再嵌套回 neo-brutal -->
    <div data-theme="neo-brutal">
      <button class="nb-btn nb-btn-primary">Back to Neo-Brutal</button>
    </div>
  </div>
</body>
```

CSS 自定义属性遵循标准继承规则，子元素会继承最近的祖先 `data-theme` 定义的 token 值。

### 4. 组件样式始终引用自定义属性，不硬编码

所有组件样式都引用自定义属性，而不包含任何硬编码的颜色或尺寸值：

```css
.nb-btn-primary {
  background-color: var(--nb-primary);
  border: var(--nb-border-width) solid var(--nb-primary-border);
  box-shadow: var(--nb-shadow-offset) var(--nb-shadow-offset) 0 var(--nb-shadow-color);
}
```

这确保了组件在不同主题下自动适配，无需为每个主题重写组件样式。

### 5. Portal / Overlay 组件的主题传递策略

对于 Modal、Dropdown、Toast 等 Portal 组件（通常挂载到 `document.body`），需要确保它们继承正确的主题上下文。采用以下策略：

1. **首选策略**：Portal 组件在打开时，检查触发元素的最近 `data-theme` 祖先，将该值复制到 Portal 容器的 `data-theme` 属性上。
   ```js
   const triggerTheme = triggerElement.closest('[data-theme]')?.dataset.theme;
   portalContainer.setAttribute('data-theme', triggerTheme || 'neo-brutal');
   ```

2. **备选策略**：如果用户显式在 Portal 组件的 API 中指定了 `data-theme`，优先使用用户指定的值。

3. **兜底策略**：如果 Portal 容器没有任何 `data-theme`，则回退到 `:root` 的默认 token。

此策略在 CSS 包中不实现（因为 CSS 包无 JS），在 JS 交互包中提供。

## 替代方案（Alternatives）

### 替代方案 1：`:root` 全局主题

- **描述**：所有 token 定义在 `:root` 上，通过切换 `:root` 的类名（如 `.theme-neo-brutal` 或 `.theme-future`）来切换主题。
- **未采纳原因**：
  - 无法支持同一页面内嵌套不同主题（`:root` 只能有一种状态）。
  - 微前端场景中，多个应用共享同一个 `:root`，主题切换会互相影响。
  - 需要 JavaScript 动态修改 `:root` 的类名，而 `data-theme` 可以通过 HTML 静态设置。

### 替代方案 2：通过 CSS 类名作用域（如 `.theme-neo-brutal`）

- **描述**：使用 class 而非 data-attribute 来标记主题作用域，如 `.nb-theme-neo-brutal { --nb-primary: ... }`。
- **未采纳原因**：
  - `data-theme` 是 WAI-ARIA 和 HTML5 标准中语义上更明确的方式来表达"主题"这一元数据。
  - class 可能被用于样式控制（如 `.dark-mode` 同时用于其他 CSS 规则），而 `data-theme` 专注于数据/状态，语义更纯粹。
  - `data-theme` 在 JavaScript 中访问更直接（`element.dataset.theme`），无需解析 classList。
  - 社区趋势（如 shadcn/ui、Radix Themes）普遍使用 `data-theme` 或 `data-mode` 进行主题控制。

### 替代方案 3：CSS Shadow DOM 封装

- **描述**：每个组件使用 Web Components 和 Shadow DOM，将 token 封装在 Shadow Root 内。
- **未采纳原因**：
  - 本项目第一版不基于 Web Components 构建，目标是与 Tailwind CSS 和现有 HTML/JS 生态无缝集成。
  - Shadow DOM 的样式隔离会导致 Tailwind utility 类无法穿透组件内部（除非使用 `::part` 或 CSS 变量穿透，但复杂度高）。
  - 与"CSS 核心零运行时依赖"的架构决策（ADR-004）冲突，因为 Web Components 需要 JS 注册。

### 替代方案 4：每个组件硬编码全部主题变体

- **描述**：不使用 CSS 自定义属性，而是为每个组件的每个主题写独立的 CSS 规则。
- **未采纳原因**：
  - 代码冗余巨大：每个组件的每个颜色 token 都需要为主题 A、主题 B 各写一遍。
  - 新增主题需要修改所有组件的 CSS，不可扩展。
  - 运行时无法动态切换主题（需要加载不同的 CSS 文件）。
  - 完全违背现代 CSS 设计 token 的最佳实践。

## 影响（Consequences）

### 正面影响

- **嵌套主题支持**：同一页面可以安全地嵌套多个主题，每个区域独立，互不干扰。
- **微前端友好**：微前端应用中的每个子应用可以有自己的 `data-theme`，不会影响宿主应用或其他子应用。
- **设计系统文档站友好**：可以在同一页面上并排展示同一组件在不同主题下的效果（如左侧 neo-brutal，右侧 future-theme）。
- **JavaScript 无关**：主题可以通过纯 HTML 设置（`<html data-theme="neo-brutal">`），无需 JS 参与初始化。
- **语义清晰**：`data-theme` 明确表达"这是一个主题作用域"，比 class 更容易理解和维护。
- **CSS 自定义属性继承高效**：`data-theme` 下的自定义属性通过标准 CSS 继承机制传播，无需额外的 JS 计算或样式注入。
- **动态主题切换简单**：通过 JS 修改元素的 `data-theme` 属性即可切换主题，无需操作复杂的 classList 或重新加载 CSS 文件。

### 负面影响 / 风险

- **Portal / Overlay 组件的主题传递复杂度**：Modal 等内容被挂载到 body 后，脱离了原 `data-theme` 上下文，需要 JS 主动复制主题属性。
  - 缓解措施：在 JS 交互包中封装此逻辑，对用户透明；在文档中明确说明 Portal 组件的主题行为。
- **`:root` 回退可能意外污染**：如果 `:root` 上定义了默认 token，且页面中某些组件没有被任何 `data-theme` 包裹，它们会使用 `:root` 的默认值。这在预期内，但需要文档说明。
- **自定义属性性能**：大量使用 CSS 自定义属性（每个组件引用多个 token）在极端复杂的页面上可能有性能影响。
  - 缓解措施：CSS 自定义属性的性能开销在现代浏览器中已可忽略（特别是只读属性，不涉及动态计算）。后续可通过性能测试验证。
- **第三方组件库集成**：如果页面中同时使用了其他依赖全局 `:root` token 的组件库，可能存在命名冲突。
  - 缓解措施：所有 token 使用 `nb-` 前缀（如 `--nb-primary`），最大程度降低冲突概率；文档中说明 token 命名空间。

### 技术债务 / 后续工作

- 制定完整的 Token 命名规范（如 `--nb-{component}-{property}-{state}` 或 `--nb-{category}-{property}`）。
- 创建 Token 文档页面，列出所有可用 token 及其默认值、用途说明。
- 为每个官方主题（`neo-brutal` 及后续主题）提供完整的 token 参考表。
- 开发主题预览工具（如文档站上的交互式主题编辑器，实时修改 token 并预览组件效果）。
- 在 JS 交互包中实现 `getThemeContext(element)` 工具函数，用于获取元素的主题继承链，供 Portal 组件使用。
- 评估是否需要提供 `data-theme="inherit"` 特殊值，用于显式声明"继承父级主题"（虽然 CSS 默认行为就是继承）。
- 测试 Portal 组件在多层嵌套主题中的行为，确保主题复制逻辑正确。

---

> 本记录已被接受。后续关于颜色系统（OKLCH）的决策，将通过新的 ADR 补充。
