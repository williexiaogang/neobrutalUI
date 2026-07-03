# Neo-Brutal UI

> 一个采用 daisyUI 设计哲学、拥有独立类名与实现的新粗野风格（Neo-Brutalism）UI 组件库，面向 Tailwind CSS v4+ 和现代前端项目。

---

## 核心特性

- **强作用域类名** — 采用 `nb-btn nb-btn-primary` 的显式命名模式，可预测性高，与 Tailwind Utility 共存时零冲突。
- **CSS 核心零运行时依赖** — 基础视觉组件完全由 CSS 驱动，无需引入任何 JavaScript。
- **可选原生 JavaScript 交互包** — 复杂交互（Modal、Dropdown、Accordion 等）通过无框架依赖的 JS 包提供，支持 Tree-shaking，按需引入。
- **支持 `data-theme` 嵌套多主题** — 允许同一页面内嵌套使用不同主题区域，主题 Token 通过 CSS 自定义属性传递。
- **基于 OKLCH 的颜色系统** — 利用感知均匀的色空间构建主题，确保在不同亮度下的对比度一致性。
- **现代 CSS 优先** — 原生使用 Cascade Layers、Logical Properties、Container Queries 等现代 CSS 能力。
- **可访问性优先** — 内置键盘操作支持、RTL 适配、尊重 `prefers-reduced-motion` 和 `forced-colors` 媒体查询。

---

## 安装

```bash
npm install neo-brutal-ui
# 或
pnpm add neo-brutal-ui
# 或
yarn add neo-brutal-ui
```

> **前置要求**：Tailwind CSS v4.0.0+。详见 [支持策略](docs/support-policy.md)。

---

## 使用示例

### 1. 在 CSS 中导入

```css
@import "neo-brutal-ui";
```

### 2. 在 HTML 中使用组件

```html
<button class="nb-btn nb-btn-primary nb-btn-lg">
  Click me
</button>
```

### 3. 主题切换

在任意祖先元素上添加 `data-theme` 属性即可启用对应主题：

```html
<div data-theme="neo-brutal">
  <button class="nb-btn nb-btn-primary">Neo-Brutal Button</button>
</div>
```

也支持嵌套主题：

```html
<div data-theme="neo-brutal">
  <!-- 外层使用 neo-brutal 主题 -->
  <button class="nb-btn nb-btn-primary">Primary</button>

  <div data-theme="future-theme">
    <!-- 内层可覆盖为其他主题 -->
    <button class="nb-btn nb-btn-primary">Future Primary</button>
  </div>
</div>
```

---

## 技术基线

| 项目 | 最低版本 | 说明 |
|------|----------|------|
| Tailwind CSS | v4.0.0 | 基于 CSS 原生导入，不兼容 v3 |
| Node.js | 20.0.0 | 开发/构建环境要求 |
| TypeScript | 5.0 | 类型支持（如使用 TS） |

### 浏览器支持

- Chrome / Edge：最近两个主要版本
- Firefox：最近两个主要版本
- Safari：17+
- iOS Safari：17+
- Android Chrome：最近两个主要版本

> 详见 [docs/support-policy.md](docs/support-policy.md)。

---

## 支持策略

详细的运行环境、技术栈版本、浏览器范围及现代 CSS 能力使用清单，请参阅：

📄 **[docs/support-policy.md](docs/support-policy.md)**

---

## 贡献指南

> 待补充。贡献指南正在编写中，敬请期待。

---

## 许可证

> 待补充。最终许可证将在首个正式版本发布前确定。

---

<p align="center">
  <sub>Built with Neo-Brutalism spirit. Bold, honest, and unapologetic.</sub>
</p>
