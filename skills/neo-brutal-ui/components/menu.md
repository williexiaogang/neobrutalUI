### menu
Menu container. Required.

[Menu docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/menu.md)

#### Class names
- component: `nb-menu`
- modifier: `nb-menu-horizontal`
- behavior: `nb-menu-item-active`, `nb-menu-item-disabled`
- part: `nb-menu-submenu-trigger`, `nb-menu-divider`, `nb-menu-group-label`
- style: `nb-menu-collapsed`, `nb-menu-responsive`

#### Syntax

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

#### Rules
- Always include the base class `nb-menu`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
