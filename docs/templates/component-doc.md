# Component Documentation Template

> **Component Name**: `{ComponentName}`  
> **Slug**: `{component-slug}`  
> **Category**: `{actions | forms | data-display | feedback | navigation | overlay | layout}`  
> **Status**: `{ready | beta | in-progress | planned}`  
> **Last Updated**: `YYYY-MM-DD`

---

## 1. Purpose

What does this component do? When should a user reach for it?

- Summarize the visual and functional purpose in one paragraph.
- Link to related components if applicable (e.g., Button → Button Group).
- Mention if it is purely CSS or requires optional JS interactions.

---

## 2. When NOT to Use

- Anti-patterns and common misuses.
- Accessibility concerns that require a different component.
- Situations where a simpler native HTML element is sufficient.

---

## 3. Installation

### CSS-only (no JS)

```css
@import "@neo-brutal-ui/core/css";
```

### With optional JS interactions

```js
import { create{ComponentName} } from "@neo-brutal-ui/interactions/{component-slug}";
```

---

## 4. Basic Example

### Minimal markup

```html
<element class="nb-{component}">
  <!-- required child structure -->
</element>
```

### Common variant

```html
<element class="nb-{component} nb-{component}-{variant}">
  <!-- common usage -->
</element>
```

### With JS enhancement (if applicable)

```js
import { create{ComponentName} } from "@neo-brutal-ui/interactions/{component-slug}";

const element = document.querySelector("...");
const instance = create{ComponentName}(element);
```

---

## 5. Class Names

| Class | Element | Required? | Description |
|-------|---------|-----------|-------------|
| `.nb-{component}` | Root | **Yes** | Base component styles. |
| `.nb-{component}-{part}` | Sub-element | Contextual | Child part (e.g., `.nb-card-body`). |
| `.nb-{component}-{variant}` | Root / Part | No | Visual variant (e.g., `.nb-btn-outline`). |
| `.nb-{component}-{size}` | Root / Part | No | Size modifier (e.g., `.nb-btn-lg`). |
| `.nb-{component}-{color}` | Root | No | Semantic color (e.g., `.nb-btn-primary`). |
| `.nb-{component}-{layout}` | Root | No | Structural change (e.g., `.nb-tabs-vertical`). |

> **Rule**: Always combine the base class with modifiers. `nb-btn nb-btn-primary` is valid; `nb-btn-primary` alone is not.

---

## 6. DOM Contract

### Required markup structure

```html
<!-- Minimal valid DOM -->
<element class="nb-{component}">
  <!-- describe exact required child hierarchy -->
</element>
```

### Optional enhancements

- `aria-*` attributes that improve accessibility.
- `data-*` attributes consumed by JS interactions.
- Wrapper elements needed for responsive behavior.

---

## 7. Variants

| Variant | Class | Visual Description |
|---------|-------|-------------------|
| Default | `.nb-{component}` | Standard appearance. |
| Outline | `.nb-{component}-outline` | Transparent background with border. |
| Ghost | `.nb-{component}-ghost` | Transparent, no border, subtle hover. |
| Link | `.nb-{component}-link` | Underlined text style. |
| (add more) | | |

---

## 8. Sizes

| Size | Class | Notes |
|------|-------|-------|
| `xs` | `.nb-{component}-xs` | Extra compact. |
| `sm` | `.nb-{component}-sm` | Reduced padding / gap. |
| `md` | *(none)* | **Default.** Do not add a class. |
| `lg` | `.nb-{component}-lg` | Increased padding / gap. |
| `xl` | `.nb-{component}-xl` | Maximum padding / gap. |

---

## 9. State Matrix

| State | Native Selector / Class | How to Apply | Visual Change |
|-------|------------------------|--------------|---------------|
| Hover | `:hover` | Native interaction | Shadow lift, offset transform. |
| Active | `:active` | Native interaction | Pressed shadow, reduced offset. |
| Focus-visible | `:focus-visible` | Keyboard focus | Focus ring (outline). |
| Disabled | `:disabled` | Native attribute | Muted colors, no shadow, no transform. |
| Invalid | `[aria-invalid="true"]` | Validation state | Error border / color accent. |
| Loading | `.nb-loading` | Utility class | Spinner overlay, reduced opacity. |
| Readonly | `[readonly]` | Native attribute | Subtle background, no focus ring. |
| (add more) | | | |

---

## 10. Accessibility

### ARIA roles and attributes

| Role / Attribute | Element | When Required | Notes |
|-----------------|---------|---------------|-------|
| `role="..."` | Root | If native semantic element is not used | Specify exact role. |
| `aria-expanded` | Trigger | For collapsible content | Toggle via JS. |
| `aria-controls` | Trigger | For collapsible content | ID of controlled region. |
| `aria-live` | Region | For dynamic updates | `polite` or `assertive`. |
| `aria-label` | Icon-only | When text is hidden | Provide accessible name. |

### Keyboard behavior

| Key | Action | Scope |
|-----|--------|-------|
| `Tab` | Move focus to next focusable element | Entire component |
| `Enter` / `Space` | Activate primary action | Buttons, links, triggers |
| `Escape` | Dismiss / close | Modals, dropdowns, drawers |
| `ArrowDown` / `ArrowUp` | Navigate list items | Dropdowns, tabs, select |
| `Home` / `End` | Jump to first / last item | Lists, tabs |
| (add more) | | |

---

## 11. RTL (Right-to-Left)

- Add `dir="rtl"` on the root or `<html>` element.
- All Neo-Brutal UI components use **logical CSS properties** (`inline-start`, `block-end`, etc.) so no extra classes are needed for RTL.
- Verify that icon-only or directional visual indicators flip correctly (e.g., chevron icons, step connectors, timeline arrows).

### RTL checklist for this component

- [ ] Icon-only directional indicators use `transform: scaleX(-1)` or logical transforms.
- [ ] Border accents use `border-inline-start` / `border-inline-end` rather than `border-left` / `border-right`.
- [ ] Text alignment respects `text-align: start` / `end`.

---

## 12. Reduced Motion

All components respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  .nb-{component} {
    transition: none;
    animation: none;
  }
}
```

- No hover lift or active press transforms when reduced motion is preferred.
- Any JS-driven animations (e.g., carousel auto-play) should be disabled by default in reduced-motion mode.

---

## 13. JS Enhancement (Optional)

### Import path

```js
import { create{ComponentName} } from "@neo-brutal-ui/interactions/{component-slug}";
```

### API surface

| Method | Description | Returns |
|--------|-------------|---------|
| `create{ComponentName}(element, options?)` | Initialize interaction. | `ComponentInstance` |
| `.open()` | Open / show. | `void` |
| `.close()` | Close / hide. | `void` |
| `.toggle()` | Toggle state. | `void` |
| `.destroy()` | Remove listeners and clean up. | `void` |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `closeOnEscape` | `boolean` | `true` | Close on `Escape` key. |
| `returnFocus` | `boolean` | `true` | Return focus to trigger on close. |
| `focusTrap` | `boolean` | `true` | Trap focus inside the component. |
| `onOpen` | `() => void` | `undefined` | Callback fired on open. |
| `onClose` | `() => void` | `undefined` | Callback fired on close. |

---

## 14. Tokens

### Public component tokens

| Token | Default | Overridable? | Description |
|-------|---------|--------------|-------------|
| `--nb-{component}-shadow` | `var(--nb-shadow-md)` | ✅ | Component shadow. |
| `--nb-{component}-padding` | `var(--nb-space-4)` | ✅ | Internal padding. |
| `--nb-{component}-border-width` | `var(--nb-border-width)` | ✅ | Border thickness. |

Override in your own CSS:

```css
[data-theme="neo-brutal"] {
  --nb-{component}-shadow: var(--nb-shadow-lg);
  --nb-{component}-padding: var(--nb-space-6);
}
```

---

## 15. Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Component styles missing | CSS not imported | Add `@import "@neo-brutal-ui/core/css";`. |
| Modifier has no effect | Base class omitted | Use `nb-{component} nb-{component}-{modifier}`. |
| Focus ring not visible | Custom CSS overrides outline | Ensure `outline: revert` or use Tailwind `outline` utilities. |
| Dark theme not working | `data-theme` missing | Add `<html data-theme="neo-brutal-dark">`. |

---

## 16. API Stability

| Status | Meaning | SemVer |
|--------|---------|--------|
| `ready` | Stable API. Safe for production. | Minor bumps for additions, patch for fixes. |
| `beta` | Core contract is set; edge cases may change. | Minor bumps may adjust edge-case behavior. |
| `in-progress` | Class names or DOM structure may change. | Breaking changes in minor versions until ready. |
| `planned` | Not yet implemented. Do not use. | — |

> **Note**: Even `beta` components follow the strong-scoped naming convention (`.nb-{component}-{modifier}`), so any breaking class rename will be documented in the changelog.

---

## 17. Related Components

- [Link to related component docs]
- [Link to another related component]

---

## 18. Changelog

| Version | Change | Migration |
|---------|--------|-----------|
| `0.0.2` | Initial beta release. | — |

