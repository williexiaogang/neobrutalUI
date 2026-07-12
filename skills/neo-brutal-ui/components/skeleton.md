### skeleton
Base skeleton block. Required.

[Skeleton docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/skeleton.md)

#### Class names
- component: `nb-skeleton`
- style: `nb-skeleton-wave`
- shape: `nb-skeleton-circle`, `nb-skeleton-text`, `nb-skeleton-image`, `nb-skeleton-card`, `nb-skeleton-button`
- size: `nb-skeleton-xs`, `nb-skeleton-sm`, `nb-skeleton-md`, `nb-skeleton-lg`, `nb-skeleton-xl`
- modifier: `nb-skeleton-text-1`, `nb-skeleton-text-2`, `nb-skeleton-text-3`, `nb-skeleton-text-4`, `nb-skeleton-group`, `nb-skeleton-group-horizontal`

#### Syntax

```html
<!-- Text lines -->
<span class="nb-skeleton" style="inline-size: 60%; block-size: 1.25rem;"></span>
<span class="nb-skeleton nb-skeleton-text nb-skeleton-text-2"></span>

<!-- Avatar + text group -->
<div class="nb-skeleton-group-horizontal">
  <span class="nb-skeleton nb-skeleton-circle"></span>
  <div class="nb-skeleton-group">
    <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-1"></span>
    <span class="nb-skeleton nb-skeleton-text nb-skeleton-text-3"></span>
  </div>
</div>
```

#### Rules
- Always include the base class `nb-skeleton`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
