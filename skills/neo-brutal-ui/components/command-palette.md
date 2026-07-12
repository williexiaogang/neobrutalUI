### command-palette
Fixed-position overlay container. Required.

[Command Palette docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/command-palette.md)

#### Class names
- behavior: `is-open`

#### Syntax

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

#### Rules
- Always include the base class `nb-command-palette`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
