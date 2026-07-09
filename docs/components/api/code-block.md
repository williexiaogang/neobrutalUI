# Code Block API

> **Component**: Code Block  
> **Category**: Data Display  
> **Base class**: `.nb-code-block`  
> **Status**: Ready

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-code-block` | Component | Base code block class. Required. |
| `.nb-code-block-header` | Part | Header bar with language/filename and actions. |
| `.nb-code-block-lang` | Part | Language or filename label. |
| `.nb-code-block-actions` | Part | Action buttons container (e.g. copy). |
| `.nb-code-block-body` | Part | Scrollable code area. |
| `.nb-code-block-pre` | Part | `<pre>` wrapper for the code. |
| `.nb-code-block-code` | Part | `<code>` element. |
| `.nb-code-block-lines` | Part / Variant | List container for line-numbered code. |
| `.nb-code-block-line` | Part | Individual code line. |
| `.nb-code-block-line-number` | Part | Gutter line number. |
| `.nb-code-block-line-content` | Part | Actual code text on a line. |
| `.nb-code-block-primary` | Color | Accent header/lang color set to `--nb-primary`. |
| `.nb-code-block-secondary` | Color | Accent header/lang color set to `--nb-secondary`. |
| `.nb-code-block-accent` | Color | Accent header/lang color set to `--nb-accent`. |
| `.nb-code-block-info` | Color | Accent header/lang color set to `--nb-info`. |
| `.nb-code-block-success` | Color | Accent header/lang color set to `--nb-success`. |
| `.nb-code-block-warning` | Color | Accent header/lang color set to `--nb-warning`. |
| `.nb-code-block-error` | Color | Accent header/lang color set to `--nb-error`. |
| `.nb-code-block-sm` | Size | Smaller body/header padding and font. |
| `.nb-code-block-lg` | Size | Larger body/header padding and font. |
| `.nb-code-block-plain` | Variant | Hides the header. |
| `.nb-code-block-full` | Variant | Removes `max-block-size` on the body. |

### Class Combination Examples

```html
<!-- Code block with header, line numbers, and primary accent -->
<div class="nb-code-block nb-code-block-primary">
  <div class="nb-code-block-header">
    <span class="nb-code-block-lang">TypeScript</span>
    <div class="nb-code-block-actions">
      <button class="nb-btn nb-btn-sm" type="button" aria-label="Copy code">Copy</button>
    </div>
  </div>
  <div class="nb-code-block-body">
    <div class="nb-code-block-pre">
      <code class="nb-code-block-code">...</code>
    </div>
  </div>
</div>

<!-- Small inline-ish code block without header -->
<div class="nb-code-block nb-code-block-sm nb-code-block-accent">
  <div class="nb-code-block-body">
    <div class="nb-code-block-pre">
      <code class="nb-code-block-code">npm install @neo-brutal-ui</code>
    </div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-code-block nb-code-block-primary">
  <div class="nb-code-block-header">
    <span class="nb-code-block-lang">TypeScript</span>
    <div class="nb-code-block-actions">
      <button class="nb-btn nb-btn-sm" type="button" aria-label="Copy code">Copy</button>
    </div>
  </div>
  <div class="nb-code-block-body">
    <div class="nb-code-block-pre">
      <code class="nb-code-block-code">
        <div class="nb-code-block-line">
          <span class="nb-code-block-line-number">1</span>
          <span class="nb-code-block-line-content">const x = 1;</span>
        </div>
      </code>
    </div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<div class="nb-code-block">` containing `<div class="nb-code-block-pre">` and `<code class="nb-code-block-code">`.
- Use `<pre>` instead of `.nb-code-block-pre` if you prefer semantic markup, but the class is required for styling.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On the copy button. |
| `aria-live="polite"` | On a hidden status element to announce "Copied" feedback. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` / `Enter` / `Space` | Standard button behavior for copy/action buttons. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (actions only) | `.nb-btn:hover` inside `.nb-code-block-actions` | Action button hover (see Button API). |
| **focus-visible** | ✅ | `:focus-visible` (global) / `.nb-btn:focus-visible` | Default outline or button outline. |
| **disabled** | ❌ Not styled | — | No code-block-specific disabled state. |
| **active** | ✅ (actions only) | `.nb-btn:active` | Action button active state. |
| **current** | ❌ Not applicable | — | No current state. |
| **selected** | ❌ Not applicable | — | No selected state. |
| **read-only** | ❌ Not applicable | — | Code blocks are inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-code-block` is a flex column with hard border, radius, and shadow. The header sits above a scrollable body. Line numbers render in a fixed-width gutter. Color variants only recolor the header language label via `--_accent`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-code-block {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### With Header and Line Numbers

```html
<div class="nb-code-block nb-code-block-primary">
  <div class="nb-code-block-header">
    <span class="nb-code-block-lang">TypeScript</span>
    <div class="nb-code-block-actions">
      <button class="nb-btn nb-btn-sm" type="button" aria-label="Copy code">Copy</button>
    </div>
  </div>
  <div class="nb-code-block-body">
    <div class="nb-code-block-pre">
      <code class="nb-code-block-code">
        <div class="nb-code-block-line">
          <span class="nb-code-block-line-number">1</span>
          <span class="nb-code-block-line-content">const x = 1;</span>
        </div>
      </code>
    </div>
  </div>
</div>
```

### Plain (No Header)

```html
<div class="nb-code-block nb-code-block-plain nb-code-block-secondary">
  <div class="nb-code-block-header">
    <span class="nb-code-block-lang">CSS</span>
  </div>
  <div class="nb-code-block-body">
    <div class="nb-code-block-pre">
      <code class="nb-code-block-code">.nb-btn { border: 3px solid var(--nb-color-black); }</code>
    </div>
  </div>
</div>
```

### Size Variants

```html
<div class="nb-code-block nb-code-block-sm nb-code-block-accent">...</div>
<div class="nb-code-block nb-code-block-lg nb-code-block-secondary">...</div>
```
