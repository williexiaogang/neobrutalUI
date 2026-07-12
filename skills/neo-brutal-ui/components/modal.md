### modal
Fixed-position overlay container. Can be `<dialog>` or `<div>`.

[Modal docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/modal.md)

#### Class names

#### Syntax

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

#### Rules
- Always include the base class `nb-modal`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
