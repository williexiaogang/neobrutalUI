# Table API

> **Component**: Table  
> **Category**: Data Display  
> **Base class**: `.nb-table`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-table` | Component | Base table class. Required on the `<table>` element. |
| `.nb-table-zebra` | Variant | Applies alternating row background on even rows. |
| `.nb-table-compact` | Variant | Reduces cell padding to `--nb-space-1` / `--nb-space-2`. |
| `.nb-table-wrapper` | Layout | Horizontal scroll wrapper for responsive tables. |
| `.nb-table-empty` | State | Styles an empty-state row with centered muted italic text. |

### Class Combination Examples

```html
<!-- Basic table -->
<table class="nb-table">...</table>

<!-- Zebra table inside responsive wrapper -->
<div class="nb-table-wrapper">
  <table class="nb-table nb-table-zebra">...</table>
</div>

<!-- Compact table -->
<div class="nb-table-wrapper">
  <table class="nb-table nb-table-compact">...</table>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-table-wrapper">
  <table class="nb-table">
    <thead>
      <tr>
        <th>User</th>
        <th>Role</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alice Chen</td>
        <td>Admin</td>
        <td>Active</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Semantic Element

- **Preferred**: `<table>` with `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>`.
- Use `<caption>` for a table title or summary; `.nb-table caption` is styled.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `scope="col"` / `scope="row"` | On `<th>` cells to clarify header associations. |
| `aria-sort` | On sortable column headers. |
| `aria-label` or `aria-labelledby` | On `.nb-table-wrapper` if the table lacks a `<caption>`. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| Standard table navigation | Screen readers provide row/column navigation for native tables. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-table tbody tr:hover` | Row background changes to `--nb-base-200`. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 3px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ❌ Not applicable | — | Tables do not have a disabled state. |
| **active** | ❌ Not applicable | — | Tables do not have an active state. |
| **current** | ❌ Not applicable | — | Row selection state is not styled; use custom classes or JS. |
| **selected** | ❌ Not applicable | — | No selected-row styles are provided. |
| **read-only** | ❌ Not applicable | — | Tables are inherently read-only. |
| **reduced-motion** | ❌ Not applicable | — | Tables are static data displays; no component-level motion. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-table` uses full inline width, collapsed borders, a hard border, and `--nb-shadow-sm`. Header cells receive `--nb-base-200` background and a bottom border. Body rows transition background on hover.

### Reduced Motion

No component-level transitions or animations; reduced-motion is not applicable.

### Responsive Behavior

Wrap tables in `.nb-table-wrapper` (`overflow-x: auto; inline-size: 100%`) to prevent wide tables from breaking narrow viewports. Long cell content is not truncated by default; use custom `max-inline-size`, `white-space: nowrap`, or `text-overflow: ellipsis` classes as needed.

### RTL

Uses logical properties (`text-align: start`, `border-block-end`, `inline-size`) throughout; no special RTL overrides needed.

---

## Examples

### Basic Table

```html
<div class="nb-table-wrapper">
  <table class="nb-table">
    <thead>
      <tr><th>User</th><th>Role</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Alice Chen</td><td>Admin</td><td>Active</td></tr>
      <tr><td>Bob Smith</td><td>Editor</td><td>Active</td></tr>
    </tbody>
  </table>
</div>
```

### Zebra Striping

```html
<table class="nb-table nb-table-zebra">
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

### Compact

```html
<table class="nb-table nb-table-compact">
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

### Empty State

```html
<table class="nb-table">
  <tbody>
    <tr class="nb-table-empty">
      <td colspan="3">No results found.</td>
    </tr>
  </tbody>
</table>
```
