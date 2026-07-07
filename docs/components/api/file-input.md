# File Input API

> **Component**: File Input  
> **Category**: Forms  
> **Base class**: `.nb-file-input`  
> **Status**: Beta (CSS visual layer implemented; drag area, file list, and remove button styling available)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-file-input` | Component | Base wrapper for the file input and optional file list. |
| `.nb-file-input-area` | Part | Visible drop zone / button area that triggers file selection. |
| `.nb-file-input-native` | Part | Visually hidden native `<input type="file">`. |
| `.nb-file-input-icon` | Part | Decorative icon inside the drop zone. |
| `.nb-file-input-hint` | Part | Helper text inside the drop zone. |
| `.nb-file-input-btn` | Part | Button-styled prompt inside the drop zone. |
| `.nb-file-list` | Part | List of selected files. |
| `.nb-file-item` | Part | Individual selected file row. |
| `.nb-file-item-name` | Part | Truncated file name. |
| `.nb-file-item-size` | Part | Muted file size text. |
| `.nb-file-item-remove` | Part | Remove button for a selected file. |
| `.nb-file-input-error` | Part | Error message below the drop zone. |
| `.is-dragover` | State | Applied to `.nb-file-input-area` during drag-over; solid border and elevated shadow. |

### Class Combination Examples

```html
<!-- Basic file input -->
<div class="nb-file-input">
  <label class="nb-file-input-area" for="file-upload">
    <input class="nb-file-input-native" id="file-upload" type="file" />
    <svg class="nb-file-input-icon"><!-- upload icon --></svg>
    <span class="nb-file-input-hint">Drag & drop files here or click to browse</span>
    <span class="nb-file-input-btn">Choose File</span>
  </label>
</div>

<!-- With selected files and error -->
<div class="nb-file-input">
  <label class="nb-file-input-area" for="file-upload" aria-invalid="true">
    <input class="nb-file-input-native" id="file-upload" type="file" aria-invalid="true" />
    <span class="nb-file-input-hint">File must be under 5MB</span>
    <span class="nb-file-input-btn">Retry Upload</span>
  </label>
  <ul class="nb-file-list">
    <li class="nb-file-item">
      <span class="nb-file-item-name">document.pdf</span>
      <span class="nb-file-item-size">2.4 MB</span>
      <button class="nb-file-item-remove" type="button" aria-label="Remove file">×</button>
    </li>
  </ul>
  <span class="nb-file-input-error">File too large.</span>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-file-input">
  <label class="nb-file-input-area" for="avatar">
    <input class="nb-file-input-native" id="avatar" type="file" name="avatar" accept="image/*" />
    <svg class="nb-file-input-icon" aria-hidden="true"><!-- icon --></svg>
    <span class="nb-file-input-hint">Drag & drop or click to upload</span>
    <span class="nb-file-input-btn">Choose File</span>
  </label>

  <ul class="nb-file-list">
    <li class="nb-file-item">
      <span class="nb-file-item-name">avatar.png</span>
      <span class="nb-file-item-size">1.1 MB</span>
      <button class="nb-file-item-remove" type="button" aria-label="Remove avatar.png">×</button>
    </li>
  </ul>

  <span class="nb-file-input-error" id="avatar-error">Please select a valid image.</span>
</div>
```

### Semantic Element

- **Preferred**: `<input type="file">` hidden inside a `<label class="nb-file-input-area">`.
- The native input is visually hidden but remains focusable and clickable via the label.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `type="file"` | Yes | `"file"` | Required for file selection. |
| `id` | Yes | Unique string | Links the hidden input to the visible label via `for`. |
| `name` | Recommended | Form field name | Required for form submission. |
| `for` | Yes (on label) | Input `id` | Makes the drop zone clickable. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On the hidden input if no visible text label is present. |
| `aria-describedby` | Reference `.nb-file-input-hint` or `.nb-file-input-error`. |
| `aria-invalid="true"` | On `.nb-file-input-area` and the native input when validation fails. |
| `aria-label` | On `.nb-file-item-remove` to name the remove action. |
| `role="button"` | Avoid; use the native label/input behavior instead. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Focus moves to the hidden file input (focus ring shown on `.nb-file-input-area` via `:focus-within`). |
| `Enter` / `Space` | Opens the native file picker when focus is on the input/label. |
| `Tab` | Moves to `.nb-file-item-remove` buttons when a file list is present. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-file-input-area:hover` | Border turns `--nb-primary`; shadow elevates to `md`. |
| **focus** | ✅ | `.nb-file-input-area:focus-within` | Border turns `--nb-focus`; shadow elevates to `md`; outline removed. |
| **focus-visible** | ✅ | `:focus-within` | No additional outline; rely on focus-within shadow/border change. |
| **disabled** | ✅ (native) | `.nb-file-input-native:disabled` | No custom styling on the area; native input disabled state applies. |
| **dragover** | ✅ | `.nb-file-input-area.is-dragover` | Solid `--nb-primary` border, `--nb-base-200` background, elevated shadow. |
| **invalid** | ✅ | `.nb-file-input-area[aria-invalid="true"]` | `border-color: var(--nb-error)`. |
| **readonly / loading** | ❌ Not applicable | — | Not applicable. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

The drop zone uses a dashed border and smooth transitions:

```css
.nb-file-input-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--nb-space-2);
  padding: var(--nb-space-6) var(--nb-space-4);
  border: var(--nb-border-width) dashed var(--nb-border);
  border-radius: var(--nb-radius-box);
  background: var(--nb-base-100);
  box-shadow: var(--nb-shadow-sm);
  cursor: pointer;
  transition: border-color var(--nb-duration-fast) var(--nb-ease-out),
              box-shadow var(--nb-duration-fast) var(--nb-ease-out);
}
```

The native input is visually hidden but remains accessible:

```css
.nb-file-input-native {
  position: absolute;
  opacity: 0;
  inline-size: 0.0625rem;
  block-size: 0.0625rem;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-file-input-area {
    transition: none;
  }
}
```

### RTL

Uses logical properties; no special RTL overrides needed.

---

## Examples

### Basic File Input

```html
<div class="nb-file-input">
  <label class="nb-file-input-area" for="demo-file">
    <input class="nb-file-input-native" id="demo-file" type="file" />
    <svg class="nb-file-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
    <span class="nb-file-input-hint">Drag & drop files here or click to browse</span>
    <span class="nb-file-input-btn">Choose File</span>
  </label>
</div>
```

### With Selected Files

```html
<div class="nb-file-input">
  <label class="nb-file-input-area" for="demo-file-2">
    <input class="nb-file-input-native" id="demo-file-2" type="file" multiple />
    <span class="nb-file-input-hint">Drag & drop files here or click to browse</span>
    <span class="nb-file-input-btn">Upload Files</span>
  </label>
  <ul class="nb-file-list">
    <li class="nb-file-item">
      <span class="nb-file-item-name">document.pdf</span>
      <span class="nb-file-item-size">2.4 MB</span>
      <button class="nb-file-item-remove" type="button" aria-label="Remove file">×</button>
    </li>
  </ul>
</div>
```

### Error State

```html
<div class="nb-file-input">
  <label class="nb-file-input-area" for="demo-file-3" aria-invalid="true">
    <input class="nb-file-input-native" id="demo-file-3" type="file" aria-invalid="true" />
    <span class="nb-file-input-hint">File must be under 5MB</span>
    <span class="nb-file-input-btn">Retry Upload</span>
  </label>
  <span class="nb-file-input-error">File too large. Maximum size is 5MB.</span>
</div>
```

### Dragover State

```html
<div class="nb-file-input">
  <label class="nb-file-input-area is-dragover" for="demo-file-4">
    <input class="nb-file-input-native" id="demo-file-4" type="file" />
    <span class="nb-file-input-hint">Drop files here to upload</span>
    <span class="nb-file-input-btn">Release to Upload</span>
  </label>
</div>
```
