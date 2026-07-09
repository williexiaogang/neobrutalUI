# Menu API

> **Component**: Menu  
> **Category**: Navigation  
> **Base class**: `.nb-menu`  
> **Status**: Ready (vertical menu, horizontal menubar, submenus, disabled items, dividers, group labels, keyboard interaction, sizes, reduced-motion, and forced-colors support included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-menu` | Component | Menu container. Required. |
| `.nb-menu-horizontal` | Layout | Horizontal menubar layout. |
| `.nb-menu-item` | Component | Individual menu item. Required on each control. |
| `.nb-menu-item-active` | State | Visually marks the selected/active item. |
| `.nb-menu-item-disabled` | State | Dims the item and removes pointer cursor. |
| `.nb-menu-submenu-trigger` | Part | Item that opens a nested submenu; adds a caret indicator. |
| `.nb-menu-submenu` | Component | Nested submenu panel. |
| `.nb-menu-divider` | Part | Horizontal separator between groups. |
| `.nb-menu-group-label` | Part | Non-interactive group header. |
| `.nb-menu-collapsed` | Variant | Full-width stacked items with borders for mobile/minimal lists. |
| `.nb-menu-responsive` | Variant | Horizontal menubar that stacks vertically on mobile. |

### Class Combination Examples

```html
<!-- Vertical menu -->
<ul class="nb-menu" role="menu" aria-label="User menu">
  <li class="nb-menu-item" role="menuitem">Profile</li>
  <li class="nb-menu-item" role="menuitem">Settings</li>
  <li class="nb-menu-item nb-menu-item-disabled" role="menuitem" aria-disabled="true">Logout</li>
</ul>

<!-- Horizontal menubar -->
<ul class="nb-menu nb-menu-horizontal" role="menubar" aria-label="Main navigation">
  <li class="nb-menu-item" role="menuitem">Home</li>
  <li class="nb-menu-item nb-menu-item-active" role="menuitem" aria-selected="true">Products</li>
  <li class="nb-menu-item" role="menuitem">About</li>
</ul>

<!-- Menu with submenu -->
<ul class="nb-menu" role="menu" aria-label="File menu">
  <li class="nb-menu-item" role="menuitem">New</li>
  <li class="nb-menu-item nb-menu-submenu-trigger" role="menuitem" aria-haspopup="true" aria-expanded="false">
    Save As
    <ul class="nb-menu-submenu" role="menu" aria-label="Save As submenu">
      <li class="nb-menu-item" role="menuitem">PDF</li>
      <li class="nb-menu-item" role="menuitem">Word</li>
      <li class="nb-menu-item" role="menuitem">Text</li>
    </ul>
  </li>
</ul>
```

---

## DOM Contract

### Recommended Structure

```html
<ul class="nb-menu" role="menu" aria-label="User menu">
  <li class="nb-menu-item" role="menuitem">Profile</li>
  <li class="nb-menu-item" role="menuitem">Settings</li>
  <li class="nb-menu-divider" role="separator"></li>
  <li class="nb-menu-item nb-menu-item-disabled" role="menuitem" aria-disabled="true">Logout</li>
</ul>
```

### Semantic Element

- **Preferred**: `<ul>` / `<li>` with appropriate ARIA roles.
- **Menu**: Use `role="menu"` for vertical menus.
- **Menubar**: Use `role="menubar"` with `.nb-menu-horizontal`.
- **Items**: Use `role="menuitem"`, `role="menuitemcheckbox"`, or `role="menuitemradio"`.
- **Separators**: Use `<li class="nb-menu-divider" role="separator">`.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| `role="menu"` / `role="menubar"` | Recommended | `"menu"` or `"menubar"` | Identifies the widget type. |
| `role="menuitem"` | Recommended | `"menuitem"` | Identifies each interactive item. |
| `aria-label` | Recommended | Description of the menu | Names the menu region. |
| `aria-expanded` | Recommended | `"true"` / `"false"` | On submenu triggers. |
| `aria-haspopup="true"` | Recommended | `"true"` | On submenu triggers. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `aria-label` | On each menu/menubar and submenu. |
| `aria-selected="true"` | For active items in a menubar. |
| `aria-checked="true"` | For checkbox/radio menu items. |
| `aria-disabled="true"` | For disabled items. |
| `role="separator"` | On divider elements. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus into/out of the menu. |
| `ArrowDown` / `ArrowUp` | Moves focus between vertical menu items. |
| `ArrowLeft` / `ArrowRight` | Moves focus between menubar items; opens/closes submenus. |
| `Enter` / `Space` | Activates a menu item or opens a submenu. |
| `Esc` | Closes the current submenu or menu. |
| `Home` / `End` | Moves focus to first/last item. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ✅ | `.nb-menu-item:hover:not(:disabled):not(.nb-menu-item-disabled)` | Background changes to `var(--nb-base-200)`. |
| **active** | ❌ Not styled | — | No explicit `:active` styles. |
| **focus-visible** | ✅ | `.nb-menu-item:focus-visible` | `outline: 2px solid var(--nb-focus)` with -2px inset offset and background set to `var(--nb-base-200)`. |
| **disabled** | ✅ | `.nb-menu-item:disabled`, `.nb-menu-item-disabled`, `[role="menuitem"].nb-menu-item-disabled` | `opacity: 0.5`, `cursor: not-allowed`. |
| **selected** | ✅ | `.nb-menu-item-active`, `[aria-selected="true"]`, `[aria-checked="true"]` | Background changes to `var(--nb-base-200)` and font weight increases to 700. Horizontal items also gain a bottom primary border. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

- Vertical menus are styled as bordered panels with a shadow.
- Horizontal menubars are transparent, borderless, and scroll horizontally if needed.
- Submenus are hidden by default and shown with `.is-open`; horizontal submenus are absolutely positioned.
- Menu items have a fast background transition on hover/focus.
- `createMenu()` manages roving focus, submenu `aria-expanded`, Escape handling, outside-click closing, and optional `onSelect` callbacks.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .nb-menu-item,
  .nb-menu [role="menuitem"] {
    transition: none;
  }
}
```

### RTL

Uses logical properties (`margin-inline-start`, `padding-inline-start`, `inset-inline-start`, etc.); no special RTL overrides needed.

---

## Examples

### Basic Vertical Menu

```html
<ul class="nb-menu" role="menu" aria-label="User menu">
  <li class="nb-menu-item" role="menuitem">Profile</li>
  <li class="nb-menu-item" role="menuitem">Settings</li>
  <li class="nb-menu-item" role="menuitem">Messages</li>
  <li class="nb-menu-item" role="menuitem">Logout</li>
</ul>
```

### Horizontal Menubar

```html
<ul class="nb-menu nb-menu-horizontal" role="menubar" aria-label="Main navigation">
  <li class="nb-menu-item" role="menuitem">Home</li>
  <li class="nb-menu-item" role="menuitem">Products</li>
  <li class="nb-menu-item nb-menu-item-active" role="menuitem" aria-selected="true">Services</li>
  <li class="nb-menu-item" role="menuitem">About</li>
  <li class="nb-menu-item" role="menuitem">Contact</li>
</ul>
```

### Menu with Submenu

```html
<ul class="nb-menu" role="menu" aria-label="File menu">
  <li class="nb-menu-item" role="menuitem">New</li>
  <li class="nb-menu-item" role="menuitem">Open</li>
  <li class="nb-menu-item nb-menu-submenu-trigger" role="menuitem" aria-haspopup="true" aria-expanded="false">
    Save As
    <ul class="nb-menu-submenu" role="menu" aria-label="Save As submenu">
      <li class="nb-menu-item" role="menuitem">PDF</li>
      <li class="nb-menu-item" role="menuitem">Word</li>
      <li class="nb-menu-item" role="menuitem">Text</li>
    </ul>
  </li>
  <li class="nb-menu-item" role="menuitem">Print</li>
</ul>
```

### Menu with Divider and Group Labels

```html
<ul class="nb-menu" role="menu" aria-label="Project menu">
  <li class="nb-menu-group-label" aria-label="Project">Project</li>
  <li class="nb-menu-item" role="menuitem">New Project</li>
  <li class="nb-menu-item" role="menuitem">Open Project</li>
  <li class="nb-menu-item" role="menuitem">Recent Projects</li>
  <li class="nb-menu-divider" role="separator"></li>
  <li class="nb-menu-group-label" aria-label="Account">Account</li>
  <li class="nb-menu-item" role="menuitem">Profile</li>
  <li class="nb-menu-item" role="menuitem">Billing</li>
  <li class="nb-menu-item" role="menuitem">Team</li>
</ul>
```

### Active and Disabled Items

```html
<ul class="nb-menu" role="menu" aria-label="View menu">
  <li class="nb-menu-item" role="menuitem">Zoom In</li>
  <li class="nb-menu-item" role="menuitem">Zoom Out</li>
  <li class="nb-menu-item nb-menu-item-active" role="menuitem" aria-selected="true">Fit to Screen</li>
  <li class="nb-menu-item nb-menu-item-disabled" role="menuitem" aria-disabled="true">Actual Size</li>
</ul>
```
