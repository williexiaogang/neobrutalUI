# Neo-Brutal UI — MVP 验收测试报告

> 生成时间：2026/7/4 上午11:57:53

## Summary

| 检查项 | 通过 | 警告 | 严重 | 状态 |
|--------|------|------|------|------|
| 颜色对比度 | 0 | 5 | 0 | ⚠️ 需关注 |
| 320px 移动端 | 1 | 0 | 0 | ✅ 通过 |
| 200% 缩放 | 1 | 0 | 0 | ✅ 通过 |
| 键盘焦点 | 1 | 0 | 0 | ✅ 通过 |
| Reduced Motion | 1 | 0 | 0 | ✅ 通过 |
| Forced Colors | 1 | 0 | 0 | ✅ 通过 |
| 长文本 | 1 | 0 | 0 | ✅ 通过 |

---

## 颜色对比度

| 文件 | 选择器 | color | background | 对比度 | 等级 |
|------|------|------|------|------|------|
| packages/core/src/components/badge.css | `.nb-badge-primary` | var(--nb-primary-content) | var(--nb-primary) | 3.59:1 | ⚠️ 警告 |
| packages/core/src/components/badge.css | `.nb-badge-info` | var(--nb-info-content) | var(--nb-info) | 2.91:1 | ⚠️ 警告 |
| packages/core/src/components/badge.css | `.nb-badge-error` | var(--nb-error-content) | var(--nb-error) | 4.06:1 | ⚠️ 警告 |
| packages/core/src/components/modal.css | `.nb-modal-primary .nb-modal-header` | var(--nb-primary-content) | var(--nb-primary) | 3.59:1 | ⚠️ 警告 |
| packages/core/src/components/modal.css | `.nb-modal-danger .nb-modal-header` | var(--nb-error-content) | var(--nb-error) | 4.06:1 | ⚠️ 警告 |

## 320px 移动端

✅ 未发现问题。

## 200% 缩放

✅ 未发现问题。

## 键盘焦点

✅ 未发现问题。

## Reduced Motion

✅ 未发现问题。

## Forced Colors

✅ 未发现问题。

## 长文本

✅ 未发现问题。

---

## Recommendations

### 警告（建议优化）

- **颜色对比度** — `packages/core/src/components/badge.css` : 对比度 3.59:1 低于 WCAG AA 阈值
- **颜色对比度** — `packages/core/src/components/badge.css` : 对比度 2.91:1 低于 WCAG AA 阈值
- **颜色对比度** — `packages/core/src/components/badge.css` : 对比度 4.06:1 低于 WCAG AA 阈值
- **颜色对比度** — `packages/core/src/components/modal.css` : 对比度 3.59:1 低于 WCAG AA 阈值
- **颜色对比度** — `packages/core/src/components/modal.css` : 对比度 4.06:1 低于 WCAG AA 阈值


---

*报告由 scripts/test-acceptance.mjs 自动生成*
