# Neo-Brutal UI 支持策略

本文档定义 Neo-Brutal UI 组件库正式支持的运行环境、技术栈版本及现代 CSS 能力范围。

---

## 环境基线

### Tailwind CSS 最低版本

- **v4.0.0**（最低版本）
- 不兼容 Tailwind CSS v3

### Node.js 最低版本

- **20.0.0**
- 建议在 CI 和本地开发中使用 Node.js 20 LTS 或更高版本

### TypeScript 最低版本

- **5.0**
- 若项目使用 TypeScript，建议不低于 5.0 以支持现代类型推断和 `tsconfig` 选项

### 包管理器

支持以下包管理器安装：

- `npm`（>= 10）
- `pnpm`（>= 9，**推荐**）
- `yarn`（>= 4）

> 项目内部开发和 CI 统一使用 pnpm。

---

## 浏览器支持范围

| 浏览器 | 支持范围 |
|--------|----------|
| Chrome / Edge | 最近两个主要版本 |
| Firefox | 最近两个主要版本 |
| Safari | 17+ |
| iOS Safari | 17+ |
| Android Chrome | 最近两个主要版本 |

> **说明**：Neo-Brutal UI 广泛依赖现代 CSS 能力（如 `@layer`、`color-mix()`、CSS 嵌套），因此不承诺对旧版浏览器或 IE 提供支持。用户如需兼容旧浏览器，需自行引入 polyfill 或降级策略。

---

## Shadow DOM 支持

- **状态**：支持（通过 CSS 自定义属性传递主题 Token）
- **说明**：在 Shadow DOM 内部使用 Neo-Brutal UI 时，可通过显式注入 CSS 自定义属性实现主题传递。但 Shadow DOM 的自动化主题同步不在第一版核心承诺范围内，相关文档将在后续版本补充。

---

## 无 Tailwind 项目引入策略

- **当前版本**：**暂不支持**编译后的独立 CSS 文件作为官方发布形式。
- **第一版使用方式**：必须通过 Tailwind CSS v4+ 的 CSS 导入方式使用（如 `@import "neo-brutal-ui";`）。
- **未来计划**：可能在后续版本提供独立 CSS 构建产物，但现阶段仅保证基于 Tailwind CSS v4 的集成体验。

---

## 明确不支持

以下技术方案或场景在当前版本及近期路线图中**明确不支持**：

- **Tailwind CSS v3**：由于 v4 与 v3 在配置方式、引擎和 CSS 能力上存在根本性差异，不提供向后兼容。
- **CDN 构建**：不通过 CDN 链接提供独立的 UMD / IIFE 构建包。所有组件和样式通过 npm 包分发，由用户构建流水线处理。
- **Internet Explorer**：所有版本均不兼容 IE。

---

## 现代 CSS 能力使用清单

Neo-Brutal UI 在核心样式中主动使用以下现代 CSS 特性。用户构建环境（如 Tailwind CSS v4+ 的 Lightning CSS 处理流程）会自动处理必要的降级与兼容。

| CSS 特性 | 状态 | 说明 |
|----------|------|------|
| CSS Custom Properties | ✅ 允许 | 主题系统的核心机制，用于 Token 传递与动态切换 |
| Cascade Layers (`@layer`) | ✅ 允许 | 优先级管理，避免与 Tailwind Utility 冲突 |
| Logical Properties | ✅ 优先使用 | 优先使用 `margin-inline-start`、`padding-block` 等逻辑属性，以原生支持 RTL |
| `color-mix()` | ✅ 允许 | 颜色混合与透明度调整，用于 hover / active 状态 |
| `:has()` | ✅ 允许 | 仅用于**增强**体验（如简化特定兄弟节点选择），不得作为核心功能的前提条件 |
| CSS Nesting | ✅ 允许 | 减少重复选择器，提升源码可读性 |
| Container Queries | ✅ 允许 | 组件级响应式设计，替代部分媒体查询场景 |
| `@property` | ✅ 允许 | 用于动画自定义属性（如渐变动画），需评估 fallback 方案 |

> **原则**：上述特性中标注 "允许" 的特性会在组件库源码中直接使用；标注 "优先使用" 的特性表示在等效方案中选择逻辑属性。所有特性均假定下游项目使用 Tailwind CSS v4+ 或兼容的 CSS 处理工具链。

---

*最后更新：项目初始化阶段，后续可能随版本迭代调整。*
