### avatar
Base avatar class. Required.

[Avatar docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/avatar.md)

#### Class names
- component: `nb-avatar`
- part: `nb-avatar-image`, `nb-avatar-initials`, `nb-avatar-status`
- state / color: `nb-avatar-status-online`, `nb-avatar-status-busy`, `nb-avatar-status-away`, `nb-avatar-status-offline`
- size: `nb-avatar-sm`, `nb-avatar-lg`, `nb-avatar-xl`
- modifier: `nb-avatar-group`

#### Syntax

```html
<!-- Initials avatar -->
<div class="nb-avatar">
  <span class="nb-avatar-initials">AB</span>
</div>

<!-- Image avatar with online status -->
<div class="nb-avatar nb-avatar-lg">
  <img class="nb-avatar-image" src="avatar.jpg" alt="Alice Chen" />
  <span class="nb-avatar-status nb-avatar-status-online" aria-label="Online"></span>
</div>

<!-- Grouped avatars -->
<div class="nb-avatar-group">
  <div class="nb-avatar"><span class="nb-avatar-initials">AA</span></div>
  <div class="nb-avatar"><span class="nb-avatar-initials">BB</span></div>
  <div class="nb-avatar"><span class="nb-avatar-initials">CC</span></div>
</div>
```

#### Rules
- Always include the base class `nb-avatar`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
