# Neo-Brutal UI — Public API Contract

> **Version**: 0.1.0-preview  
> **Scope**: CSS-only layer (`packages/core/src/index.css`)  
> **Last updated**: 2025-07-04

This document defines the public API contract for the Neo-Brutal UI component library. All class names, naming conventions, and DOM contracts documented here are binding for consumers.

---

## 1. Class Name Taxonomy

Neo-Brutal UI uses **strong scoped class names** (see ADR-002). Every modifier is prefixed with its component name to eliminate ambiguity and prevent collisions with Tailwind CSS utilities.

| Category | Format | Example | Description |
|----------|--------|---------|-------------|
| **Component** | `nb-{component}` | `nb-btn` | Base component class. Required before any modifier. |
| **Part** | `nb-{component}-{part}` | `nb-card-body` | Sub-element within a component. |
| **Variant** | `nb-{component}-{variant}` | `nb-btn-outline` | Visual style variant (outline, ghost, link). |
| **Color** | `nb-{component}-{color}` | `nb-btn-primary` | Semantic color application. |
| **Size** | `nb-{component}-{size}` | `nb-btn-lg` | Size scale (xs/sm/md/lg/xl). Default `md` is implicit. |
| **State** | `nb-{component}-{state}` or pseudo-class | `:disabled` | Interaction or data state. |
| **Layout** | `nb-{component}-{layout}` | `nb-divider-vertical` | Structural layout change. |
| **Placement** | `nb-{component}-{placement}` | `nb-tooltip-top` | Positional variant (reserved; not yet implemented). |

### Naming Rules

1. **Always combine base + modifier**: `nb-btn nb-btn-primary nb-btn-lg`
2. **Never use weak scoping**: `nb-primary` is invalid; use `nb-btn-primary`.
3. **State classes are additive**: `nb-btn nb-btn-primary nb-btn-block` (real example) or `nb-modal nb-modal-lg nb-modal-primary` (real example).
4. **Pseudo-classes preferred over state classes** when native HTML semantics exist:
   - ✅ `:disabled`, `:checked`, `:invalid` (native)
   - ✅ `.is-open` (JS-managed, when no native equivalent)
   - ❌ `.nb-btn-disabled` (redundant with `:disabled`)

---

## 2. Public Naming Dictionary

The following terms are **canonical**. Do not use synonyms in component APIs, documentation, or prop names.

### 2.1 Size Scale

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | Extra small | Compact buttons, small badges |
| `sm` | Small | Reduced padding/gap |
| `md` | Medium | **Default. Omit in class names when using default.** |
| `lg` | Large | Increased padding/gap |
| `xl` | Extra large | Maximum padding/gap |

> **Rule**: When a component uses the default (`md`) size, do not include a size class. The base component class already encodes the default size.

### 2.2 Color Semantics

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| `neutral` | `--nb-neutral` / `--nb-neutral-content` | Gray, baseline, non-action |
| `primary` | `--nb-primary` / `--nb-primary-content` | Main action, most prominent |
| `secondary` | `--nb-secondary` / `--nb-secondary-content` | Secondary action |
| `accent` | `--nb-accent` / `--nb-accent-content` | Highlight, attention grab |
| `info` | `--nb-info` / `--nb-info-content` | Informational context |
| `success` | `--nb-success` / `--nb-success-content` | Positive outcome |
| `warning` | `--nb-warning` / `--nb-warning-content` | Caution, attention needed |
| `error` | `--nb-error` / `--nb-error-content` | Failure, critical error |

### 2.3 States

| State | CSS Selector / Class | Applicable To |
|-------|---------------------|---------------|
| `hover` | `:hover` | Interactive components (Button, Card, Link) |
| `active` | `:active` | Interactive components |
| `focus-visible` | `:focus-visible` | All focusable elements |
| `disabled` | `:disabled` | Form elements, buttons |
| `readonly` | `[readonly]` | Form inputs |
| `invalid` | `[aria-invalid="true"]` | Form inputs |
| `valid` | `[aria-invalid="false"]` (implicit) | Form inputs |
| `checked` | `:checked` | Checkbox, Radio, Toggle |
| `indeterminate` | `:indeterminate` | Checkbox (reserved, not yet implemented) |
| `selected` | `.is-selected` or `[aria-selected="true"]` | Tabs, Dropdown items (reserved) |
| `open` | `.is-open` or `[open]` | Modal, Dropdown, Accordion |
| `expanded` | `[aria-expanded="true"]` | Accordion, Navbar (reserved) |
| `loading` | `.is-loading` or `[aria-busy="true"]` | Button, Card, Skeleton |
| `busy` | `[aria-busy="true"]` | Any region receiving updates |

### 2.4 Appearance Variants

| Token | Meaning |
|-------|---------|
| `outline` | Transparent background, thicker border |
| `ghost` | Transparent background, no shadow, hover fill |
| `link` | Text-only, underline, inline |

### 2.5 Layout

| Token | Meaning |
|-------|---------|
| `vertical` | Stack children vertically |
| `horizontal` | Stack children horizontally (default for most) |
| `block` | Full-width display |

### 2.6 Placement (Reserved)

| Token | Meaning |
|-------|---------|
| `top` | Position above trigger |
| `bottom` | Position below trigger |
| `start` / `left` | Logical start / physical left |
| `end` / `right` | Logical end / physical right |

> **Note**: `left` / `right` are reserved for components where physical direction is semantically required (e.g., `nb-tooltip-left`). All new components should prefer logical `start` / `end`.

---

## 3. DOM Contract Template

Every MVP component follows this contract structure:

### 3.1 Recommended Semantic Element

Choose the HTML element that best matches the component's semantics:

- **Button** → `<button>` (not `<a>` styled as button)
- **Card** → `<article>` or `<section>`
- **Input** → `<input>` with explicit `type`
- **Textarea** → `<textarea>`
- **Select** → `<select>`
- **Checkbox** → `<input type="checkbox">`
- **Radio** → `<input type="radio">`
- **Toggle** → `<input type="checkbox" role="switch">`
- **Modal** → `<dialog>` (preferred) or `<div role="dialog" aria-modal="true">`
- **Alert** → `<div role="alert">`
- **Divider** → `<hr>` (horizontal) or `<div role="separator" aria-orientation="vertical">`
- **Loading** → `<span>` or `<div>` with `aria-hidden="true"` (decorative) or `role="status"`
- **Skeleton** → `<div>` with `aria-hidden="true"` while loading

### 3.2 Required Child Elements

Child elements that must exist for the component to render correctly:

| Component | Required Children |
|-----------|-------------------|
| Card | None (header/body/footer are optional) |
| Modal | At least one of header, body, or footer |
| Alert | None (icon/title/body are optional) |
| Field | Label + control (Input/Textarea/Select) |

### 3.3 Optional Child Elements

Child elements that enhance the component but are not required:

| Component | Optional Children |
|-----------|-------------------|
| Card | `.nb-card-header`, `.nb-card-body`, `.nb-card-footer`, `.nb-card-title` |
| Modal | `.nb-modal-header`, `.nb-modal-body`, `.nb-modal-footer`, `.nb-modal-close` |
| Alert | `.nb-alert-icon`, `.nb-alert-title`, `.nb-alert-body` |
| Field | `.nb-field-label`, `.nb-field-description`, `.nb-field-error` |

### 3.4 ARIA Attributes

Standard ARIA patterns per component:

| Component | Required ARIA | Recommended ARIA |
|-----------|--------------|------------------|
| Button | — | `aria-label` (if icon-only), `aria-expanded`, `aria-haspopup`, `aria-pressed` |
| Input | `aria-label` or `<label>` | `aria-describedby`, `aria-invalid`, `aria-required` |
| Checkbox | — | `aria-checked` (managed by browser), `aria-labelledby` |
| Radio | `name` (grouping) | `aria-checked`, `aria-labelledby` |
| Toggle | `role="switch"` | `aria-checked` |
| Modal | `role="dialog"`, `aria-modal="true"` | `aria-labelledby` (title), `aria-describedby` (body) |
| Alert | `role="alert"` (or implicit on `<output>`) | `aria-live="polite"` |
| Loading | — | `role="status"`, `aria-label="Loading"` |

### 3.5 Keyboard Behavior

| Component | Tab Sequence | Enter | Space | Escape | Arrow Keys |
|-----------|-------------|-------|-------|--------|------------|
| Button | Focusable | Activate | Activate | — | — |
| Input | Focusable | Submit form | — | — | — |
| Checkbox | Focusable | Toggle | Toggle | — | — |
| Radio | Focusable (group) | Select | Select | — | Navigate group |
| Toggle | Focusable | Toggle | Toggle | — | — |
| Select | Focusable | Open/Select | Open | Close | Navigate options |
| Modal | Trap focus | Primary action | — | Close | Tab navigation |

### 3.6 No-JS Degradation

| Component | No-JS Behavior |
|-----------|---------------|
| Button | Renders as static element. `:disabled` works natively. |
| Input | Native HTML validation, `:focus`, `:disabled`, `:invalid` all work without JS. |
| Checkbox / Radio / Toggle | Native form behavior, `:checked`, `:disabled` work without JS. |
| Select | Native `<select>` dropdown works without JS. |
| Modal | `<dialog>` element provides native `open` attribute and `::backdrop` without JS. |
| Alert | Static display. No dismiss without JS. |
| Loading | Static spinner (no animation without CSS). |
| Skeleton | Static gray block without pulse animation. |
| Card / Divider / Badge | Purely presentational; no JS needed. |

---

## 4. State Matrix

This matrix honestly reflects the **current CSS implementation** in `packages/core/src/index.css`. A ✓ means the state is explicitly styled. A — means the state does not apply. A blank means the state is not yet implemented.

| State | Button | Card | Input | Textarea | Select | Checkbox | Radio | Toggle | Badge | Alert | Divider | Loading | Skeleton | Modal |
|-------|:------:|:----:|:-----:|:--------:|:------:|:--------:|:-----:|:------:|:-----:|:-----:|:-------:|:-------:|:--------:|:-----:|
| **hover** | ✓ | | | | | | | | | | | | | |
| **active** | ✓ | | | | | | | | | | | | | |
| **focus** | | | ✓ | ✓ | ✓ | | | | | | | | | |
| **focus-visible** | ✓¹ | | ✓¹ | ✓¹ | ✓¹ | ✓¹ | ✓¹ | ✓¹ | | | | | | |
| **disabled** | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — | — | — |
| **readonly** | — | — | | | | — | — | — | — | — | — | — | — | — |
| **invalid** | — | — | ✓ | ✓ | ✓ | — | — | — | — | — | — | — | — | — |
| **valid** | — | — | | | | — | — | — | — | — | — | — | — | — |
| **checked** | — | — | — | — | — | ✓ | ✓ | ✓ | — | — | — | — | — | — |
| **indeterminate** | — | — | — | — | — | | | — | — | — | — | — | — | — |
| **selected** | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **open** | — | — | — | — | — | — | — | — | — | — | — | — | — | ✓² |
| **expanded** | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **loading** | | — | — | — | — | — | — | — | — | — | — | ✓³ | ✓³ | — |
| **busy** | — | — | — | — | — | — | — | — | — | — | — | — | — | — |

**Legend:**

- ¹ `focus-visible`: Handled globally via `[data-theme="neo-brutal"] :focus-visible { outline: 3px solid var(--nb-focus); outline-offset: 2px; }`. Form fields additionally have component-level `:focus` styling (border-color + box-shadow change).
- ² `open`: Modal uses `.is-open` class or native `<dialog [open]>` attribute. CSS provides transitions for both.
- ³ `loading`: `.nb-loading` is a standalone spinner component. `.nb-skeleton` is a standalone placeholder component. Neither is a state class applied to other components.

### Component-Specific Notes

- **Button**: Hover and Active use the Neo-Brutal shadow/translate system (`translate(-2px, -2px)` on hover, `translate(2px, 2px)` on active). Disabled uses `opacity: 0.6`, `cursor: not-allowed`, and resets shadow/position. The `loading` state is **not yet implemented** for Button in CSS (`.nb-btn-loading` does not exist).
- **Card**: No interactive states are styled in the current CSS. Card is a presentational container.
- **Input / Textarea / Select**: Focus changes `border-color` to `--nb-focus` and elevates `box-shadow`. Disabled changes background and opacity. Invalid (via `[aria-invalid="true"]`) changes `border-color` to `--nb-error`.
- **Checkbox / Radio**: Checked fills background with `--nb-primary` and renders a pseudo-element marker. Disabled reduces opacity.
- **Toggle**: Checked shifts the pseudo-element thumb via `transform: translateX(1.25rem)`. RTL support: `[dir="rtl"] .nb-toggle:checked::after { transform: translateX(-1.25rem); }`. Disabled reduces opacity.
- **Loading**: Only `.nb-loading` class exists — a standalone spinner with `animation: nb-spin`. Reduced-motion fallback replaces the animation with a dashed border style.
- **Skeleton**: Only `.nb-skeleton` class exists — a standalone pulse animation. Reduced-motion fallback shows a static background.
- **Modal**: Open state uses CSS transitions on `.is-open` or `[open]`. Size variants (`xs` through `xl`, `full`) and color variants (`primary`, `danger`, `warning`, `success`) are implemented. Sheet layout for mobile (`nb-modal-sheet`) is implemented.

---

## 5. Theme Scoping

All component styles are scoped to `[data-theme="neo-brutal"]` and its descendants. The library does **not** pollute global `:root`.

```html
<!-- Wrap your app or section -->
<div data-theme="neo-brutal">
  <button class="nb-btn nb-btn-primary">Click me</button>
</div>
```

Nested themes are supported via CSS custom property inheritance:

```html
<div data-theme="neo-brutal">
  <button class="nb-btn">Outer theme</button>
  <div data-theme="future-theme">
    <button class="nb-btn">Nested theme</button>
  </div>
</div>
```

See ADR-005 for full details on `data-theme` scoping strategy.

---

## 6. Accessibility Baseline

### 6.1 Focus Management

Focus-visible is defined globally in `@layer nb.base`:

```css
[data-theme="neo-brutal"] :focus-visible {
  outline: 3px solid var(--nb-focus);
  outline-offset: 2px;
}
```

Components should **not** override this unless the default outline conflicts with the component shape.

### 6.2 Reduced Motion

All transitions and animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .nb-btn { transition: none; }
  .nb-loading { animation: none; border: 3px dashed var(--nb-primary); }
  .nb-skeleton { animation: none; background: var(--nb-base-200); }
}
```

### 6.3 Forced Colors

Modal provides `forced-colors: active` overrides to ensure visibility in high-contrast mode. Other components should follow this pattern.

---

## 7. CSS Layer Order

Components are organized into CSS cascade layers:

```css
@layer nb.theme, nb.base, nb.components, nb.utilities;
```

| Layer | Contents |
|-------|----------|
| `nb.theme` | CSS custom properties (design tokens) |
| `nb.base` | Global resets, focus-visible, selection styles |
| `nb.components` | All component styles |
| `nb.utilities` | Helper utilities (`.nb-sr-only`) |

---

## 8. Change Log

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0-preview | 2025-07-04 | Initial API contract for preview build. Covers Button, Card, Input, Textarea, Select, Checkbox, Radio, Toggle, Badge, Alert, Divider, Loading, Skeleton, Modal. |
