### dropdown
Wrapper that positions the panel relative to the trigger. Required.

[Dropdown docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/dropdown.md)

#### Class names
- component: `nb-dropdown`
- part: `nb-dropdown-trigger`, `nb-dropdown-divider`, `nb-dropdown-group-label`
- modifier: `nb-dropdown-start`, `nb-dropdown-end`, `nb-dropdown-top`, `nb-dropdown-bottom`
- behavior: `nb-dropdown-item-active`, `nb-dropdown-item-disabled`, `is-open`

#### Syntax

```html
<!-- Basic dropdown with groups -->
<div class="nb-dropdown" data-nb-dropdown>
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false" aria-haspopup="true">
    Options
    <span aria-hidden="true"> ▼</span>
  </button>
  <div class="nb-dropdown-panel">
    <div class="nb-dropdown-group-label">Actions</div>
    <button class="nb-dropdown-item" type="button">Edit</button>
    <button class="nb-dropdown-item" type="button">Duplicate</button>
    <div class="nb-dropdown-divider"></div>
    <div class="nb-dropdown-group-label">Danger</div>
    <button class="nb-dropdown-item" type="button" style="color: var(--nb-error);">Delete</button>
  </div>
</div>

<!-- End-aligned panel -->
<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false">Align End</button>
  <div class="nb-dropdown-panel nb-dropdown-end">
    <button class="nb-dropdown-item" type="button">Item</button>
  </div>
</div>

<!-- Top placement -->
<div class="nb-dropdown">
  <button class="nb-btn nb-dropdown-trigger" type="button" aria-expanded="false">Drop Up</button>
  <div class="nb-dropdown-panel nb-dropdown-top">
    <button class="nb-dropdown-item" type="button">Item</button>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-dropdown`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
