### drawer
Fixed-position overlay behind the drawer. Required.

[Drawer docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/drawer.md)

#### Class names
- behavior: `is-open`

#### Syntax

```html
<!-- Basic right drawer -->
<div class="nb-drawer-backdrop is-open" data-nb-drawer aria-hidden="false">
  <div class="nb-drawer nb-drawer-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div class="nb-drawer-header">
      <span class="nb-drawer-title" id="drawer-title">Title</span>
      <button class="nb-drawer-close" type="button" aria-label="Close" data-drawer-close>×</button>
    </div>
    <div class="nb-drawer-body">Content</div>
  </div>
</div>

<!-- Left drawer with footer -->
<div class="nb-drawer-backdrop" id="drawer-left" data-nb-drawer aria-hidden="true">
  <div class="nb-drawer nb-drawer-start" role="dialog" aria-modal="true" aria-labelledby="drawer-left-title">
    <div class="nb-drawer-header">
      <span class="nb-drawer-title" id="drawer-left-title">Left Drawer</span>
      <button class="nb-drawer-close" type="button" aria-label="Close">×</button>
    </div>
    <div class="nb-drawer-body"><p>Content</p></div>
    <div class="nb-drawer-footer">
      <button class="nb-btn" type="button" data-drawer-close>Cancel</button>
      <button class="nb-btn nb-btn-primary" type="button">Save</button>
    </div>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-drawer`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
