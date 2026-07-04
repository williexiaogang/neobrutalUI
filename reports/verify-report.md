# CSS Verification Report

**Generated:** 2026-07-04T13:36:59.677Z
**Files Scanned:** 27
**Total Token Definitions:** 113

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
| packages\core\src\base\reset.css | Yes | 0 | 6 |
| packages\core\src\components\alert.css | Yes | 10 | 16 |
| packages\core\src\components\badge.css | Yes | 10 | 28 |
| packages\core\src\components\button.css | Yes | 18 | 37 |
| packages\core\src\components\card.css | Yes | 10 | 12 |
| packages\core\src\components\divider.css | Yes | 8 | 4 |
| packages\core\src\components\drawer.css | Yes | 30 | 40 |
| packages\core\src\components\dropdown.css | Yes | 31 | 29 |
| packages\core\src\components\field.css | Yes | 45 | 52 |
| packages\core\src\components\link.css | Yes | 5 | 4 |
| packages\core\src\components\loading.css | Yes | 6 | 8 |
| packages\core\src\components\modal.css | Yes | 53 | 61 |
| packages\core\src\components\navbar.css | Yes | 27 | 40 |
| packages\core\src\components\selector.css | Yes | 31 | 26 |
| packages\core\src\components\table.css | Yes | 21 | 28 |
| packages\core\src\components\tabs.css | Yes | 46 | 19 |
| packages\core\src\components\toast.css | Yes | 27 | 57 |
| packages\core\src\components\tooltip.css | Yes | 30 | 21 |
| packages\core\src\index.css | Yes | 0 | 0 |
| packages\core\src\tokens\colors.css | Yes | 0 | 3 |
| packages\core\src\tokens\component.css | Yes | 0 | 23 |
| packages\core\src\tokens\motion.css | Yes | 0 | 0 |
| packages\core\src\tokens\shadows.css | Yes | 0 | 10 |
| packages\core\src\tokens\spacing.css | Yes | 0 | 0 |
| packages\core\src\tokens\z-index.css | Yes | 0 | 0 |
| packages\core\src\utilities\responsive.css | Yes | 11 | 6 |
| packages\core\src\utilities\sr-only.css | Yes | 1 | 0 |

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
