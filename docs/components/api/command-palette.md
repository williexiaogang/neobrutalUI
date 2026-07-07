# Command Palette API

> **Component**: Command Palette  
> **Category**: Overlay  
> **Base classes**: `.nb-command-palette-backdrop`, `.nb-command-palette`  
> **Status**: In Progress (CSS visual layer implemented; JS search, keyboard navigation, and selection are planned)

---

## Class Names

### Container / Backdrop

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-command-palette-backdrop` | Component | Fixed-position overlay container. Required. |
| `.is-open` | State | Reveals the backdrop and dialog panel. |

### Dialog Panel

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-command-palette` | Component | The command palette dialog panel. Required inside backdrop. |
| `.nb-command-palette-sm` | Size | Wider panel (`max-inline-size: 28rem`). |
| `.nb-command-palette-lg` | Size | Widest panel (`max-inline-size: 44rem`). |

### Search Input

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-command-palette-input` | Part | Search input wrapper with icon and field. |
| `.nb-command-palette-input-icon` | Part | Decorative search icon. |
| `.nb-command-palette-input-field` | Part | The actual text input. |

### Results List

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-command-palette-list` | Part | Scrollable list of groups and items. |
| `.nb-command-palette-group` | Part | Group header / section label. |

### Items

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-command-palette-item` | Component | Selectable command row. |
| `.nb-command-palette-item-active` | State | Highlighted active item. |
| `.nb-command-palette-item-disabled` | State | Non-interactive item. |
| `.nb-command-palette-item-icon` | Part | Leading icon for an item. |
| `.nb-command-palette-item-content` | Part | Title + description stack. |
| `.nb-command-palette-item-title` | Part | Primary command label. |
| `.nb-command-palette-item-description` | Part | Secondary description. |
| `.nb-command-palette-shortcut` | Part | Keyboard shortcut badge group. |

### Empty State

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-command-palette-empty` | Part | Centered empty-state container. |
| `.nb-command-palette-empty-icon` | Part | Empty-state icon. |
| `.nb-command-palette-empty-title` | Part | Empty-state heading. |
| `.nb-command-palette-empty-description` | Part | Empty-state helper text. |

### Footer

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-command-palette-footer` | Part | Bottom hint / status bar. |

### Class Combination Examples

```html
<div class="nb-command-palette-backdrop is-open" data-nb-command-palette>
  <div class="nb-command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
    <div class="nb-command-palette-input">
      <svg class="nb-command-palette-input-icon" aria-hidden="true">...</svg>
      <input class="nb-command-palette-input-field" type="text" placeholder="Search commands..." />
    </div>
    <ul class="nb-command-palette-list" role="listbox">
      <li class="nb-command-palette-group" role="presentation">Preferences</li>
      <li>
        <button class="nb-command-palette-item nb-command-palette-item-active" type="button" role="option">
          <svg class="nb-command-palette-item-icon" aria-hidden="true">...</svg>
          <span class="nb-command-palette-item-content">
            <span class="nb-command-palette-item-title">Toggle Dark Mode</span>
            <span class="nb-command-palette-item-description">Switch between light and dark themes</span>
          </span>
          <span class="nb-command-palette-shortcut"><kbd>⌘</kbd><kbd>D</kbd></span>
        </button>
      </li>
    </ul>
    <div class="nb-command-palette-footer">⌘K to open · ↑↓ to navigate · ↵ to select</div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-command-palette-backdrop" data-nb-command-palette aria-hidden="true">
  <div class="nb-command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
    <div class="nb-command-palette-input">
      <svg class="nb-command-palette-input-icon" aria-hidden="true">...</svg>
      <input class="nb-command-palette-input-field" type="text" placeholder="Search commands..." />
    </div>
    <ul class="nb-command-palette-list" role="listbox" aria-label="Commands">
      <li class="nb-command-palette-group" role="presentation">Actions</li>
      <li>
        <button class="nb-command-palette-item" type="button" role="option">
          <span class="nb-command-palette-item-title">Create New Project</span>
          <span class="nb-command-palette-shortcut"><kbd>⌘</kbd><kbd>N</kbd></span>
        </button>
      </li>
      <li class="nb-command-palette-item-disabled">
        <button class="nb-command-palette-item" type="button" role="option" disabled>
          <span class="nb-command-palette-item-title">Disabled Command</span>
        </button>
      </li>
    </ul>
    <div class="nb-command-palette-footer">Navigation hints</div>
  </div>
</div>
```

### Semantic Elements

| Element | Recommendation |
|---------|---------------|
| Backdrop | `<div>` fixed overlay. |
| Dialog | `<div>` with `role="dialog"` and `aria-modal="true"`. |
| Input | `<input type="text">` with `.nb-command-palette-input-field`. |
| Results | `<ul>` with `role="listbox"`; group headers can be `<li role="presentation">`. |
| Item | `<button type="button">` with `role="option"` inside `<li>`. |

### Part Usage Rules

| Part | Required? | Notes |
|------|-----------|-------|
| `.nb-command-palette-input` | Recommended | Contains the search field. |
| `.nb-command-palette-list` | Recommended | Scrollable results area. |
| `.nb-command-palette-item` | Yes | At least one item or `.nb-command-palette-empty` should exist. |
| `.nb-command-palette-group` | No | Use to visually group commands. |
| `.nb-command-palette-footer` | No | Hints or status text. |
| `.nb-command-palette-empty` | No | Shown when no results match the query. |

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role="dialog"` | Yes | `"dialog"` | Required on `.nb-command-palette`. |
| `aria-modal="true"` | Yes | `"true"` | Indicates background content is inert. |
| `aria-label` / `aria-labelledby` | Recommended | `"Command palette"` | Required if no visible title. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-hidden="true"` | On the backdrop when closed. |
| `aria-label="Commands"` | On the results list. |
| `role="listbox"` / `role="option"` | For keyboard-navigable command list. |
| `aria-disabled="true"` | For disabled items. |
| `aria-activedescendant` | On the input to track the active item. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `⌘K` / `Ctrl+K` | Opens the command palette (requires JS). |
| `Escape` | Closes the palette (requires JS). |
| `ArrowDown` / `ArrowUp` | Moves active item (requires JS). |
| `Enter` | Selects the active item (requires JS). |
| `Tab` | Traps focus within the palette (requires JS). |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ (item) | `.nb-command-palette-item:hover` | Background `--nb-base-200`. |
| **focus-visible** | ✅ (input / item) | `.nb-command-palette-input-field:focus-visible`, `.nb-command-palette-item:focus-visible` | `outline: 2px solid var(--nb-focus)`, `outline-offset: -2px`. |
| **active / selected** | ✅ | `.nb-command-palette-item-active`, `.nb-command-palette-item-active .nb-command-palette-item-icon` | Background `--nb-base-200`; icon color `--nb-primary`; shortcut color updates. |
| **disabled** | ✅ | `.nb-command-palette-item-disabled` | `opacity: 0.5`, `cursor: not-allowed`; hover background removed. |
| **open** | ✅ | `.nb-command-palette-backdrop.is-open`, `.nb-command-palette-backdrop.is-open .nb-command-palette` | Backdrop fades in; panel scales up and translates down. |
| **loading** | — N/A | — | Not applicable. |

### Open State Transitions

```css
.nb-command-palette-backdrop {
  opacity: 0;
  visibility: hidden;
}
.nb-command-palette {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.nb-command-palette-backdrop.is-open {
  opacity: 1;
  visibility: visible;
}
.nb-command-palette-backdrop.is-open .nb-command-palette {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

---

## CSS Implementation Notes

### Backdrop

```css
.nb-command-palette-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-block-start: 20vh;
  padding-inline: var(--nb-space-4);
  z-index: var(--nb-z-modal);
  background: var(--nb-overlay);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--nb-duration-slow) var(--nb-ease-out),
    visibility var(--nb-duration-slow) var(--nb-ease-out);
}
```

### Dialog Panel

```css
.nb-command-palette {
  position: relative;
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  max-inline-size: 36rem;
  max-block-size: calc(80vh - var(--nb-space-8));
  background: var(--nb-base-100);
  border: var(--nb-border-width) solid var(--nb-border);
  border-radius: var(--nb-radius-overlay);
  box-shadow: var(--nb-shadow-xl);
  overflow: hidden;
}
```

### Search Input

```css
.nb-command-palette-input {
  display: flex;
  align-items: center;
  gap: var(--nb-space-3);
  padding: var(--nb-space-4);
  border-block-end: var(--nb-border-width) solid var(--nb-border);
  background: var(--nb-base-200);
}
```

### Size Variants

`.nb-command-palette-sm` sets `max-inline-size: 28rem`; `.nb-command-palette-lg` sets `max-inline-size: 44rem`. Both also reduce/increase input and item title font sizes.

### Responsive

On mobile (`max-width: 768px`) the backdrop padding is removed, the panel fills the viewport, border-radius becomes `0`, and max block size becomes `100vh`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-command-palette-backdrop,
  .nb-command-palette,
  .nb-command-palette-item {
    transition: none;
    transform: none !important;
  }

  .nb-command-palette-backdrop.is-open .nb-command-palette {
    transform: none;
  }
}
```

### Forced Colors

The dialog border, input area border, input field border, item focus outline, item icon, shortcut badges, footer border, group color, and backdrop all use system colors (`CanvasText`, `Highlight`, `GrayText`, `Canvas`). `forced-color-adjust: none` is applied to the panel.

### RTL

Uses logical properties (`inset-inline-start/end`, `border-block-end`, etc.); no special RTL overrides needed.

---

## Examples

### Basic

```html
<div class="nb-command-palette-backdrop" data-nb-command-palette aria-hidden="true">
  <div class="nb-command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
    <div class="nb-command-palette-input">
      <svg class="nb-command-palette-input-icon" aria-hidden="true">...</svg>
      <input class="nb-command-palette-input-field" type="text" placeholder="Type a command..." />
    </div>
    <ul class="nb-command-palette-list" role="listbox">
      <li class="nb-command-palette-group" role="presentation">Actions</li>
      <li>
        <button class="nb-command-palette-item" type="button" role="option">
          <span class="nb-command-palette-item-title">Create New Project</span>
          <span class="nb-command-palette-shortcut"><kbd>⌘</kbd><kbd>N</kbd></span>
        </button>
      </li>
    </ul>
    <div class="nb-command-palette-footer">⌘K to open · ↑↓ to navigate · ↵ to select</div>
  </div>
</div>
```

### Size Variants

```html
<div class="nb-command-palette-backdrop is-open">
  <div class="nb-command-palette nb-command-palette-sm">...</div>
</div>

<div class="nb-command-palette-backdrop is-open">
  <div class="nb-command-palette nb-command-palette-lg">...</div>
</div>
```

### Empty State

```html
<div class="nb-command-palette-backdrop is-open">
  <div class="nb-command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
    <div class="nb-command-palette-input">
      <input class="nb-command-palette-input-field" type="text" value="xyz" />
    </div>
    <div class="nb-command-palette-empty">
      <div class="nb-command-palette-empty-icon" aria-hidden="true">🔍</div>
      <div class="nb-command-palette-empty-title">No results found</div>
      <div class="nb-command-palette-empty-description">Try a different search term.</div>
    </div>
    <div class="nb-command-palette-footer">Press Esc to close</div>
  </div>
</div>
```

### Disabled and Active Items

```html
<ul class="nb-command-palette-list" role="listbox">
  <li>
    <button class="nb-command-palette-item nb-command-palette-item-active" type="button" role="option">
      <span class="nb-command-palette-item-title">Active Command</span>
    </button>
  </li>
  <li>
    <button class="nb-command-palette-item nb-command-palette-item-disabled" type="button" role="option" disabled>
      <span class="nb-command-palette-item-title">Disabled Command</span>
    </button>
  </li>
</ul>
```

---

## Known Issues

- None listed in component catalog.

> **Note**: The `CommandPaletteDemo.astro` file uses several class names that do not exist in the current CSS (`nb-command-palette-dialog`, `nb-command-palette-search`, `nb-command-palette-results`, `nb-command-palette-group-label`, `nb-command-palette-neutral`, `nb-command-palette-secondary`). Document the markup using the CSS-backed classes listed above.
