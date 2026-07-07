# Window Mockup API

> **Component**: Window Mockup  
> **Category**: Data Display  
> **Base class**: `.nb-window`  
> **Status**: Beta (size and color header variants implemented; interactive control buttons and footer bar included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-window` | Component | Base window frame container. Required. |
| `.nb-window-header` | Part | Title bar with title and controls. |
| `.nb-window-title` | Part | Wrapper for the icon and title text. |
| `.nb-window-title-icon` | Part | Small icon in the title bar. |
| `.nb-window-title-text` | Part | Truncated window title text. |
| `.nb-window-controls` | Part | Container for control buttons. |
| `.nb-window-control` | Component/Part | Individual control button (minimize, maximize, close). |
| `.nb-window-control-minimize` | Variant | Minimize button content (`−`). |
| `.nb-window-control-maximize` | Variant | Maximize button content (`□`). |
| `.nb-window-control-close` | Variant | Close button content (`×`) with error background. |
| `.nb-window-body` | Part | Main content area. |
| `.nb-window-footer` | Part | Optional footer bar. |
| `.nb-window-sm` | Size | Smaller frame, header, and body. |
| `.nb-window-lg` | Size | Larger frame and body. |
| `.nb-window-primary` | Color | Primary header background. |
| `.nb-window-secondary` | Color | Secondary header background. |
| `.nb-window-accent` | Color | Accent header background. |
| `.nb-window-neutral` | Color | Neutral header background. |
| `.nb-window-dark` | Variant | Dark content fill in the body. |

> **Naming note**: The catalog slug is `window-mockup`. The CSS filename is `window.css` and the base class is `.nb-window`.

### Class Combination Examples

```html
<div class="nb-window nb-window-lg nb-window-primary">
  <div class="nb-window-header">
    <div class="nb-window-title">
      <span class="nb-window-title-icon" aria-hidden="true">📝</span>
      <span class="nb-window-title-text">notes.txt</span>
    </div>
    <div class="nb-window-controls">
      <button class="nb-window-control nb-window-control-minimize" aria-label="Minimize" type="button"></button>
      <button class="nb-window-control nb-window-control-maximize" aria-label="Maximize" type="button"></button>
      <button class="nb-window-control nb-window-control-close" aria-label="Close" type="button"></button>
    </div>
  </div>
  <div class="nb-window-body">
    <!-- content -->
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-window">
  <div class="nb-window-header">
    <div class="nb-window-title">
      <span class="nb-window-title-icon" aria-hidden="true">📁</span>
      <span class="nb-window-title-text">project/</span>
    </div>
    <div class="nb-window-controls">
      <button class="nb-window-control nb-window-control-minimize" aria-label="Minimize" type="button"></button>
      <button class="nb-window-control nb-window-control-maximize" aria-label="Maximize" type="button"></button>
      <button class="nb-window-control nb-window-control-close" aria-label="Close" type="button"></button>
    </div>
  </div>
  <div class="nb-window-body">
    <p>Window content goes here.</p>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<figure>` with an optional `<figcaption>` for screenshots, or `<div>` for UI previews.
- **Control buttons**: Use real `<button>` elements with explicit `aria-label` attributes; the CSS supplies the glyph via `::before`.

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-window-header` | Recommended | Contains the title and controls. |
| `.nb-window-title` | Recommended | Wraps icon and title text. |
| `.nb-window-title-icon` | No | Decorative window icon. |
| `.nb-window-title-text` | Recommended | Window title. |
| `.nb-window-controls` | No | Control buttons. |
| `.nb-window-body` | Recommended | Main content area. |
| `.nb-window-footer` | No | Optional status/footer bar. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `aria-label` | Required (controls) | Action name | Each control button must have an accessible name. |
| `type` | Required (controls) | `"button"` | Prevents accidental form submission. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On the frame to describe the preview (e.g., "Window preview of file manager"). |
| `aria-hidden="true"` | On decorative title icon. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus to the control buttons inside `.nb-window-controls`. |
| `Enter` / `Space` | Activates a focused control button. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-window-control:hover` | Shadow elevates to `--nb-shadow-sm`, button translates `(-1px, -1px)`. |
| **active** | ✅ | `.nb-window-control:active` | Shadow removed, button translates `(1px, 1px)`. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | — N/A | — | Window Mockup itself is not interactive; controls are real buttons and support `disabled`. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

```css
.nb-window {
  --_bg: var(--nb-base-100);
  --_header-bg: var(--nb-base-200);
  --_border: var(--nb-border);
  --_shadow: var(--nb-shadow-md);

  display: flex;
  flex-direction: column;
  inline-size: 100%;
  border: var(--nb-border-width) solid var(--_border);
  border-radius: var(--nb-radius-box);
  background: var(--_bg);
  box-shadow: var(--_shadow);
  overflow: hidden;
}

.nb-window-control {
  box-shadow: var(--nb-shadow-xs);
  transition: transform var(--nb-duration-fast) var(--nb-ease-out),
    box-shadow var(--nb-duration-fast) var(--nb-ease-out);
}

.nb-window-control:hover {
  box-shadow: var(--nb-shadow-sm);
  transform: translate(-1px, -1px);
}

.nb-window-control:active {
  box-shadow: none;
  transform: translate(1px, 1px);
}
```

Control glyphs are rendered with `::before` content. The close button uses `--nb-error` background.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-window,
  .nb-window-control {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

### Forced Colors

```css
@media (forced-colors: active) {
  .nb-window {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }

  .nb-window-header,
  .nb-window-footer {
    border-color: CanvasText;
  }

  .nb-window-control {
    forced-color-adjust: none;
  }
}
```

---

## Examples

### Basic Window Mockup

```html
<div class="nb-window" aria-label="File manager preview">
  <div class="nb-window-header">
    <div class="nb-window-title">
      <span class="nb-window-title-icon" aria-hidden="true">📁</span>
      <span class="nb-window-title-text">project/</span>
    </div>
    <div class="nb-window-controls">
      <button class="nb-window-control nb-window-control-minimize" aria-label="Minimize" type="button"></button>
      <button class="nb-window-control nb-window-control-maximize" aria-label="Maximize" type="button"></button>
      <button class="nb-window-control nb-window-control-close" aria-label="Close" type="button"></button>
    </div>
  </div>
  <div class="nb-window-body">
    <p>README.md</p>
    <p>src/</p>
    <p>package.json</p>
  </div>
</div>
```

### Large Primary Window with Footer

```html
<div class="nb-window nb-window-lg nb-window-primary" aria-label="Text editor preview">
  <div class="nb-window-header">
    <div class="nb-window-title">
      <span class="nb-window-title-icon" aria-hidden="true">📝</span>
      <span class="nb-window-title-text">notes.txt</span>
    </div>
    <div class="nb-window-controls">
      <button class="nb-window-control nb-window-control-minimize" aria-label="Minimize" type="button"></button>
      <button class="nb-window-control nb-window-control-maximize" aria-label="Maximize" type="button"></button>
      <button class="nb-window-control nb-window-control-close" aria-label="Close" type="button"></button>
    </div>
  </div>
  <div class="nb-window-body">
    <p>// TODO</p>
    <p>- [x] Build component library</p>
    <p>- [ ] Write documentation</p>
  </div>
  <div class="nb-window-footer">
    <span>UTF-8 • 5 lines</span>
  </div>
</div>
```

### Dark Terminal Window

```html
<div class="nb-window nb-window-dark nb-window-secondary" aria-label="Terminal preview">
  <div class="nb-window-header">
    <div class="nb-window-title">
      <span class="nb-window-title-icon" aria-hidden="true">⚡</span>
      <span class="nb-window-title-text">Terminal</span>
    </div>
    <div class="nb-window-controls">
      <button class="nb-window-control nb-window-control-minimize" aria-label="Minimize" type="button"></button>
      <button class="nb-window-control nb-window-control-maximize" aria-label="Maximize" type="button"></button>
      <button class="nb-window-control nb-window-control-close" aria-label="Close" type="button"></button>
    </div>
  </div>
  <div class="nb-window-body">
    <pre><code>$ npm run build
✔ Building 24 components</code></pre>
  </div>
</div>
```

---

## Known Issues

- The showcase demo uses `.nb-window-titlebar` and `.nb-window-icon`, which do not exist in the current CSS build. The CSS expects `.nb-window-header` for the title bar, `.nb-window-title` as the title wrapper, and `.nb-window-title-icon` for the icon. Demo markup should be updated to use the CSS-defined classes.
