### tabs
Tab list container. Required on the element that wraps the tabs.

[Tabs docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/tabs.md)

#### Class names
- component: `nb-tabs`
- modifier: `nb-tabs-vertical`
- behavior: `nb-tab-active`, `nb-tab-disabled`

#### Syntax

```html
<!-- Horizontal tabs -->
<div class="nb-tabs" role="tablist" aria-label="Settings">
  <button class="nb-tab nb-tab-active" role="tab" aria-selected="true" type="button">General</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Security</button>
  <button class="nb-tab nb-tab-disabled" role="tab" aria-selected="false" disabled type="button">Billing</button>
</div>
<div class="nb-tab-panel" role="tabpanel">
  <p>General settings content.</p>
</div>

<!-- Vertical tabs -->
<div class="nb-tabs nb-tabs-vertical" role="tablist" aria-label="Profile">
  <button class="nb-tab nb-tab-active" role="tab" aria-selected="true" type="button">Profile</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Notifications</button>
  <button class="nb-tab" role="tab" aria-selected="false" type="button">Integrations</button>
</div>
```

#### Rules
- Always include the base class `nb-tabs`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
