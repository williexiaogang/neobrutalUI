# Modal API

> **Component**: Modal  
> **Category**: Overlay  
> **Base classes**: `.nb-modal-backdrop`, `.nb-modal`  
> **Status**: Ready

---

## Class Names

### Container / Backdrop

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-modal-backdrop` | Component | Fixed-position overlay container. Can be `<dialog>` or `<div>`. |

### Dialog Panel

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-modal` | Component | The dialog panel itself. Required inside backdrop. |
| `.nb-modal-header` | Part | Top section with title and close button. Has background fill. |
| `.nb-modal-title` | Part | Dialog heading. Removes margins, sets font size. |
| `.nb-modal-close` | Part | Close button in header. Styled as a small square button. |
| `.nb-modal-body` | Part | Main content area with standard padding. |
| `.nb-modal-footer` | Part | Bottom section with action buttons. Has background fill and flex layout. |

### Size Variants

| Class Name | Category | Max Width |
|------------|----------|-----------|
| `.nb-modal-xs` | Size | 20rem (320px) |
| `.nb-modal-sm` | Size | 24rem (384px) |
| `.nb-modal-md` | Size | 28rem (448px) — default |
| `.nb-modal-lg` | Size | 32rem (512px) |
| `.nb-modal-xl` | Size | 40rem (640px) |
| `.nb-modal-full` | Layout | 100% width, 100vh height, no border-radius |

### Color Variants (Header Accent)

| Class Name | Category | Header Background |
|------------|----------|-------------------|
| `.nb-modal-primary` | Color | `--nb-primary` |
| `.nb-modal-danger` | Color | `--nb-error` |
| `.nb-modal-warning` | Color | `--nb-warning` |
| `.nb-modal-success` | Color | `--nb-success` |

### Layout Variants

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-modal-sheet` | Layout | Mobile bottom sheet. Aligns to bottom, full width on small screens. |

### State Classes

| Class Name | Category | Description |
|------------|----------|-------------|
| `.is-open` | State | Applied to `.nb-modal-backdrop` (non-`<dialog>`) or used alongside `[open]`. Triggers CSS transitions. |

### Class Combination Examples

```html
<!-- Basic modal -->
<dialog class="nb-modal-backdrop" open>
  <div class="nb-modal">
    <div class="nb-modal-body">Content</div>
  </div>
</dialog>

<!-- Full modal with all parts -->
<div class="nb-modal-backdrop is-open">
  <div class="nb-modal nb-modal-lg nb-modal-primary">
    <div class="nb-modal-header">
      <h2 class="nb-modal-title">Confirm Action</h2>
      <button class="nb-modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="nb-modal-body">Are you sure?</div>
    <div class="nb-modal-footer">
      <button class="nb-btn nb-btn-ghost">Cancel</button>
      <button class="nb-btn nb-btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure (Native `<dialog>`)

```html
<dialog class="nb-modal-backdrop" aria-labelledby="modal-title">
  <div class="nb-modal">
    <div class="nb-modal-header">
      <h2 class="nb-modal-title" id="modal-title">Dialog Title</h2>
      <button class="nb-modal-close" aria-label="Close dialog">&times;</button>
    </div>
    <div class="nb-modal-body">
      <p>Dialog content goes here.</p>
    </div>
    <div class="nb-modal-footer">
      <button class="nb-btn nb-btn-ghost" formmethod="dialog">Cancel</button>
      <button class="nb-btn nb-btn-primary">Save Changes</button>
    </div>
  </div>
</dialog>
```

### Recommended Structure (`<div>` Fallback)

```html
<div class="nb-modal-backdrop is-open" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="nb-modal" role="document">
    <div class="nb-modal-header">
      <h2 class="nb-modal-title" id="modal-title">Dialog Title</h2>
      <button class="nb-modal-close" aria-label="Close dialog">&times;</button>
    </div>
    <div class="nb-modal-body">
      <p>Dialog content goes here.</p>
    </div>
    <div class="nb-modal-footer">
      <button class="nb-btn nb-btn-ghost">Cancel</button>
      <button class="nb-btn nb-btn-primary">Save Changes</button>
    </div>
  </div>
</div>
```

### Semantic Elements

| Element | Recommendation |
|---------|---------------|
| `<dialog>` | **Preferred.** Provides native `::backdrop`, `[open]` attribute, `Escape` key dismissal, and focus trapping without JS. |
| `<div>` | Fallback when `<dialog>` support is insufficient. `createDialog()` manages focus trapping, backdrop click, `Escape` dismissal, and open state attributes/classes. Add `role="dialog"` and `aria-modal="true"` when rendering open without JS. |

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-modal-header` | No | Omit for simple confirmation dialogs or alerts. |
| `.nb-modal-title` | No | Only inside header. Required for accessibility when header is present. |
| `.nb-modal-close` | No | Recommended for non-destructive modals. Can omit for required flows (e.g., terms acceptance). |
| `.nb-modal-body` | Recommended | At least one content container should exist. |
| `.nb-modal-footer` | No | Omit for read-only modals (e.g., image preview). |

### ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="dialog"` | Required for `<div>` fallback. Native `<dialog>` has implicit role. |
| `aria-modal="true"` | Required for `<div>` fallback. Indicates content beneath is inert. |
| `aria-labelledby` | Reference the `.nb-modal-title` element ID. Required if title exists. |
| `aria-describedby` | Reference the primary message in `.nb-modal-body` for screen reader announcement. |
| `aria-label` | Alternative to `aria-labelledby` if no visible title. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Cycles focus within the modal (trapped). |
| `Shift + Tab` | Cycles focus backward within the modal. |
| `Escape` | Closes the modal (native `<dialog>` behavior; requires JS for `<div>` fallback). |
| `Enter` | Activates the focused button. |
| `Space` | Activates the focused button or checkbox. |

### No-JS Degradation

- **With `<dialog>`**: The `open` attribute controls visibility without JavaScript. `::backdrop` renders automatically. Form buttons with `formmethod="dialog"` close the modal without JS.
- **With `<div>`**: Requires `.is-open` class, which can be set server-side on page load for initial modal display. Full interactivity (focus trap, backdrop click, Escape) requires JS.

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (close button) | `.nb-modal-close:hover` | Shadow elevates, `translate(-2px, -2px)`. |
| **active** | ✅ (close button) | `.nb-modal-close:active` | Shadow drops, `translate(2px, 2px)`. |
| **focus-visible** | ✅ | `:focus-visible` (global) | `outline: 3px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | — N/A | — | Modal is not a form element. |
| **open** | ✅ | `.nb-modal-backdrop.is-open`, `dialog[open]` | Backdrop opacity/visibility transitions in. Modal panel opacity and transform animate from `translateY(8px) scale(0.98)` to `translateY(0) scale(1)`. |
| **loading** | — N/A | — | Not applicable to Modal. |

### Open State Transitions

```css
/* Closed state */
.nb-modal-backdrop {
  opacity: 0;
  visibility: hidden;
}
.nb-modal {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

/* Open state */
.nb-modal-backdrop.is-open,
dialog.nb-modal-backdrop[open] {
  opacity: 1;
  visibility: visible;
}
.nb-modal-backdrop.is-open .nb-modal,
dialog.nb-modal-backdrop[open] .nb-modal {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

---

## CSS Implementation Notes

### Backdrop Variants

```css
/* <dialog> element */
dialog.nb-modal-backdrop {
  border: none;
  padding: var(--nb-space-4);
  background: none;
  max-width: none;
  max-height: none;
  margin: 0;
  inset: 0;
}
dialog.nb-modal-backdrop::backdrop {
  background: var(--nb-overlay);
  opacity: 0;
  transition: opacity var(--nb-duration-slow) var(--nb-ease-out);
}
dialog.nb-modal-backdrop[open]::backdrop {
  opacity: 1;
}

/* <div> fallback */
.nb-modal-backdrop:not(dialog) {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--nb-space-4);
  z-index: var(--nb-z-modal);
  background: var(--nb-overlay);
}
```

### Dialog Panel

```css
.nb-modal {
  position: relative;
  inline-size: 100%;
  max-inline-size: 28rem;     /* Default md size */
  max-block-size: calc(100vh - var(--nb-space-8));
  overflow: auto;
  background: var(--nb-base-100);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-overlay);   /* 0px */
  box-shadow: var(--nb-shadow-xl);           /* Note: --nb-shadow-xl defined in tokens but value is 8px 8px 0 */
}
```

> **Note**: The current CSS references `var(--nb-shadow-xl)` but the token definition in `index.css` only defines up to `--nb-shadow-lg` (6px). This may need alignment in a future build.

### Header / Footer Styling

```css
.nb-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--nb-space-3);
  padding: var(--nb-space-4);
  border-block-end: var(--nb-border-width) solid var(--nb-border);
  background: var(--nb-base-200);
}

.nb-modal-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--nb-space-3);
  padding: var(--nb-space-4);
  border-block-start: var(--nb-border-width) solid var(--nb-border);
  background: var(--nb-base-200);
}
```

### Close Button

```css
.nb-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  background: var(--nb-base-100);
  color: var(--nb-base-content);
  border: var(--nb-border-width) solid var(--nb-border);
  font-size: var(--nb-text-xl);
  line-height: 1;
  cursor: pointer;
  box-shadow: var(--nb-shadow-sm);
  transition: transform var(--nb-duration-fast) var(--nb-ease-out),
              box-shadow var(--nb-duration-fast) var(--nb-ease-out);
}
```

### Mobile Sheet Variant

```css
@media (max-width: 768px) {
  .nb-modal-sheet {
    max-inline-size: 100%;
    margin-block-start: auto;
    margin-block-end: 0;
    border-radius: 0;
    box-shadow: 0 -4px 0 var(--nb-border);
  }
  .nb-modal-backdrop:has(.nb-modal-sheet) {
    align-items: flex-end;
    padding: 0;
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-modal-backdrop, .nb-modal {
    transition: none;
    animation: none;
    transform: none !important;
  }
}
```

### Forced Colors (High Contrast)

```css
@media (forced-colors: active) {
  .nb-modal {
    border: 2px solid CanvasText;
    forced-color-adjust: none;
  }
  .nb-modal-header, .nb-modal-footer {
    border-color: CanvasText;
  }
  .nb-modal-backdrop:not(dialog) {
    background: Canvas;
    opacity: 0.9;
  }
  dialog.nb-modal-backdrop::backdrop {
    background: Canvas;
    opacity: 0.9;
  }
  .nb-modal-close {
    border: 2px solid CanvasText;
  }
}
```

---

## Examples

### Basic Dialog (Native `<dialog>`)

```html
<dialog class="nb-modal-backdrop" id="basic-dialog">
  <div class="nb-modal">
    <div class="nb-modal-body">
      <p>This is a simple dialog without header or footer.</p>
    </div>
  </div>
</dialog>

<!-- Open with JS: document.getElementById('basic-dialog').showModal() -->
```

### Confirmation Dialog

```html
<dialog class="nb-modal-backdrop" aria-labelledby="confirm-title">
  <div class="nb-modal nb-modal-sm">
    <div class="nb-modal-header">
      <h2 class="nb-modal-title" id="confirm-title">Confirm Delete</h2>
      <button class="nb-modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="nb-modal-body">
      <p>Are you sure you want to delete this item? This action cannot be undone.</p>
    </div>
    <div class="nb-modal-footer">
      <button class="nb-btn nb-btn-ghost" formmethod="dialog">Cancel</button>
      <button class="nb-btn nb-btn-primary nb-modal-danger">Delete</button>
    </div>
  </div>
</dialog>
```

> **Note**: The `.nb-modal-danger` class applies to the `.nb-modal` container, coloring the header background. The button inside uses `.nb-btn-primary` for its own styling.

### Large Form Modal

```html
<dialog class="nb-modal-backdrop" aria-labelledby="form-title">
  <div class="nb-modal nb-modal-lg">
    <div class="nb-modal-header">
      <h2 class="nb-modal-title" id="form-title">Edit Profile</h2>
      <button class="nb-modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="nb-modal-body">
      <div class="nb-field">
        <label class="nb-field-label" for="edit-name">Display Name</label>
        <input class="nb-input" id="edit-name" type="text" />
      </div>
      <div class="nb-field">
        <label class="nb-field-label" for="edit-bio">Bio</label>
        <textarea class="nb-textarea" id="edit-bio"></textarea>
      </div>
    </div>
    <div class="nb-modal-footer">
      <button class="nb-btn nb-btn-ghost" formmethod="dialog">Cancel</button>
      <button class="nb-btn nb-btn-primary">Save Profile</button>
    </div>
  </div>
</dialog>
```

### Mobile Bottom Sheet

```html
<dialog class="nb-modal-backdrop" aria-labelledby="sheet-title">
  <div class="nb-modal nb-modal-sheet">
    <div class="nb-modal-header">
      <h2 class="nb-modal-title" id="sheet-title">Options</h2>
      <button class="nb-modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="nb-modal-body">
      <button class="nb-btn nb-btn-block nb-btn-ghost">Share</button>
      <button class="nb-btn nb-btn-block nb-btn-ghost">Edit</button>
      <button class="nb-btn nb-btn-block nb-btn-ghost">Delete</button>
    </div>
  </div>
</dialog>
```

### Full-Screen Modal

```html
<dialog class="nb-modal-backdrop">
  <div class="nb-modal nb-modal-full">
    <div class="nb-modal-header">
      <h2 class="nb-modal-title">Full Screen Content</h2>
      <button class="nb-modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="nb-modal-body">
      <p>This modal takes up the entire viewport.</p>
    </div>
  </div>
</dialog>
```

---

## Known Issues

- `<div>`-based fallback requires JavaScript for focus trapping.
- Open/close animation timing may need refinement.
- `--nb-shadow-xl` is referenced but not defined in the current theme tokens (only up to `--nb-shadow-lg`).
- The modal component in `components.ts` is marked `status: "in-progress"` and `available: false` because JS interactivity is not yet complete, even though CSS styling is advanced.
