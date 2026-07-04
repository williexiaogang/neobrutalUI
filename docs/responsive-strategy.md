# Responsive Strategy

## 断点定义

| 名称 | 最小宽度 | 用途 |
|------|----------|------|
| `sm` | 640px | 小屏手机横屏 |
| `md` | 768px | 平板竖屏（主要断点） |
| `lg` | 1024px | 平板横屏 / 小桌面 |
| `xl` | 1280px | 标准桌面 |
| `2xl` | 1536px | 大桌面 |

### 移动优先原则

所有组件默认样式针对移动端（0–767px），然后使用 `@media (min-width: 768px)` 添加桌面端增强。

## 组件响应式行为

### Modal
- 移动端：全宽（`max-inline-size: 100%`），可选底部 Sheet 模式
- 桌面端：居中对话框（`max-inline-size: 28rem`）

### Table
- 移动端：水平滚动容器（`.nb-table-wrapper`）
- 桌面端：完整表格布局

### Navbar
- 移动端：汉堡按钮 + 折叠菜单
- 桌面端：水平导航链接

### Dropdown
- 移动端：全宽面板（`min-inline-size: 100%`）
- 桌面端：固定最小宽度（`min-inline-size: 12rem`）

### Tabs
- 移动端：横向滚动或纵向堆叠
- 桌面端：横向 Tab 列表

### Tooltip
- 移动端：允许文本换行（`white-space: normal`），最大宽度限制为 `16rem`
- 桌面端：单行不换行（`white-space: nowrap`），最大宽度 `20rem`

## 320px 保证

所有组件在 320px 宽度下必须：
- 不水平溢出（无 `overflow-x: auto` 除非明确需要）
- 不固定宽度（使用 `%` 或 `max-width` 而非 `width`）
- 文本可读（不强制不换行）
- 触摸目标最小 44×44px

## 响应式工具类

组件库提供以下响应式工具类：

| 类名 | 移动端 | 桌面端（≥768px） |
|------|--------|------------------|
| `.nb-hidden-mobile` | `display: none` | `display: initial` |
| `.nb-hidden-desktop` | `display: initial` | `display: none` |
| `.nb-text-responsive` | `font-size: var(--nb-text-sm)` | `font-size: var(--nb-text-base)` |

## 实现状态

| 组件 | 移动端适配 | 桌面端增强 | 验证状态 |
|------|-----------|-----------|----------|
| Modal | 全宽 + Sheet 模式 | 居中对话框 | ✅ 已验证 |
| Table | 水平滚动容器 | 完整表格 | ✅ 已验证 |
| Navbar | 汉堡按钮 + 折叠 | 水平导航 | ✅ 已验证 |
| Dropdown | 全宽面板 | 固定最小宽度 | ✅ 已验证 |
| Tabs | 横向滚动 | 横向列表 | ✅ 已补充 |
| Tooltip | 换行 + 缩小宽度 | 单行不换行 | ✅ 已验证 |
