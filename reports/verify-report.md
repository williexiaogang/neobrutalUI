# CSS Verification Report

**Generated:** 2026-07-07T08:56:22.585Z
**Files Scanned:** 65
**Total Token Definitions:** 221

## Summary

| Check | Status | Issues |
|-------|--------|--------|
| Token Definitions | ✅ Pass | 0 |
| Hardcoded Colors | ✅ Pass | 0 |
| Layer Names | ✅ Pass | 0 |
| Component Prefixes | ✅ Pass | 0 |
| Circular References | ✅ Pass | 0 |
| Public / Internal Boundary | ✅ Pass | 0 |
| Brace Balance & Nesting | ✅ Pass | 0 |

**Result:** 7/7 checks passed
**Total Issues:** 0

## Details

### Token Definitions

✅ **Passed**

### Hardcoded Colors

✅ **Passed**

### Layer Names

✅ **Passed**

### Component Prefixes

✅ **Passed**

### Circular References

✅ **Passed**

### Public / Internal Boundary

✅ **Passed**

### Brace Balance & Nesting

✅ **Passed**

## File-Level Statistics

| File | Layer | Classes | Tokens Used |
|------|-------|---------|-------------|
| packages/core/src/base/reset.css | Yes | 0 | 6 |
| packages/core/src/components/accordion.css | Yes | 68 | 44 |
| packages/core/src/components/alert.css | Yes | 10 | 16 |
| packages/core/src/components/avatar.css | Yes | 26 | 20 |
| packages/core/src/components/badge.css | Yes | 10 | 28 |
| packages/core/src/components/breadcrumb.css | Yes | 19 | 20 |
| packages/core/src/components/browser.css | Yes | 38 | 42 |
| packages/core/src/components/button-group.css | Yes | 26 | 13 |
| packages/core/src/components/button.css | Yes | 18 | 37 |
| packages/core/src/components/calendar.css | Yes | 57 | 92 |
| packages/core/src/components/card.css | Yes | 10 | 12 |
| packages/core/src/components/carousel.css | Yes | 89 | 62 |
| packages/core/src/components/chat-bubble.css | Yes | 28 | 62 |
| packages/core/src/components/code-block.css | Yes | 36 | 41 |
| packages/core/src/components/collapse.css | Yes | 66 | 42 |
| packages/core/src/components/color-picker.css | Yes | 23 | 24 |
| packages/core/src/components/command-palette.css | Yes | 62 | 96 |
| packages/core/src/components/date-picker.css | Yes | 55 | 69 |
| packages/core/src/components/description-list.css | Yes | 82 | 55 |
| packages/core/src/components/diff-viewer.css | Yes | 63 | 48 |
| packages/core/src/components/divider.css | Yes | 8 | 4 |
| packages/core/src/components/drawer.css | Yes | 30 | 40 |
| packages/core/src/components/dropdown.css | Yes | 31 | 29 |
| packages/core/src/components/empty-state.css | Yes | 17 | 23 |
| packages/core/src/components/feature-grid.css | Yes | 39 | 39 |
| packages/core/src/components/field.css | Yes | 51 | 59 |
| packages/core/src/components/file-input.css | Yes | 23 | 57 |
| packages/core/src/components/footer.css | Yes | 58 | 50 |
| packages/core/src/components/form-summary.css | Yes | 18 | 27 |
| packages/core/src/components/hero.css | Yes | 47 | 40 |
| packages/core/src/components/input.css | No | 0 | 0 |
| packages/core/src/components/kbd.css | Yes | 21 | 33 |
| packages/core/src/components/link.css | Yes | 5 | 4 |
| packages/core/src/components/list.css | Yes | 75 | 61 |
| packages/core/src/components/loading.css | Yes | 3 | 3 |
| packages/core/src/components/menu.css | Yes | 89 | 48 |
| packages/core/src/components/modal.css | Yes | 53 | 61 |
| packages/core/src/components/navbar.css | Yes | 27 | 40 |
| packages/core/src/components/otp.css | Yes | 18 | 24 |
| packages/core/src/components/pagination.css | Yes | 48 | 34 |
| packages/core/src/components/phone.css | Yes | 35 | 31 |
| packages/core/src/components/pricing-card.css | Yes | 50 | 48 |
| packages/core/src/components/progress.css | Yes | 68 | 32 |
| packages/core/src/components/range.css | Yes | 31 | 43 |
| packages/core/src/components/rating.css | Yes | 46 | 25 |
| packages/core/src/components/segmented-control.css | Yes | 24 | 39 |
| packages/core/src/components/selector.css | Yes | 31 | 26 |
| packages/core/src/components/skeleton.css | Yes | 22 | 16 |
| packages/core/src/components/stat.css | Yes | 54 | 36 |
| packages/core/src/components/steps.css | Yes | 69 | 58 |
| packages/core/src/components/table.css | Yes | 21 | 28 |
| packages/core/src/components/tabs.css | Yes | 46 | 19 |
| packages/core/src/components/timeline.css | Yes | 101 | 49 |
| packages/core/src/components/toast.css | Yes | 27 | 57 |
| packages/core/src/components/tooltip.css | Yes | 30 | 21 |
| packages/core/src/components/window.css | Yes | 36 | 45 |
| packages/core/src/index.css | Yes | 0 | 0 |
| packages/core/src/tokens/colors.css | Yes | 0 | 3 |
| packages/core/src/tokens/component.css | Yes | 0 | 96 |
| packages/core/src/tokens/motion.css | Yes | 0 | 0 |
| packages/core/src/tokens/shadows.css | Yes | 0 | 10 |
| packages/core/src/tokens/spacing.css | Yes | 0 | 0 |
| packages/core/src/tokens/z-index.css | Yes | 0 | 0 |
| packages/core/src/utilities/responsive.css | Yes | 11 | 6 |
| packages/core/src/utilities/sr-only.css | Yes | 1 | 0 |

## How to Fix

| Issue | Fix |
|-------|-----|
| Undefined Token | Define the missing `--nb-*` variable in the appropriate `tokens/*.css` file, or check for typos. |
| Hardcoded Color | Replace `#hex` or `rgb()` with a semantic token like `var(--nb-primary)` or `var(--nb-base-content)`. |
| Invalid Layer Name | Use one of: `nb.theme`, `nb.base`, `nb.components`, `nb.utilities`. |
| Missing Prefix | Rename the class to start with `nb-`. |
| Circular Import | Reorder or remove `@import url()` statements to break the cycle. |
| Public Token in Component | Rename `--nb-*` to `--_*` in component files, or move the definition to `tokens/*.css`. |
| Unbalanced Braces | Check for missing or extra `{` / `}` in the reported file. |
