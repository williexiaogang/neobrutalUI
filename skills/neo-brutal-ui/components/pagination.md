### pagination
Outer pagination wrapper. Required.

[Pagination docs](https://github.com/williexiaogang/neobrutalUI/tree/main/docs/components/api/pagination.md)

#### Class names
- component: `nb-pagination`
- part: `nb-pagination-item`, `nb-pagination-link`, `nb-pagination-prev`, `nb-pagination-next`, `nb-pagination-ellipsis`
- behavior: `nb-pagination-active`, `nb-pagination-disabled`
- size: `nb-pagination-sm`, `nb-pagination-lg`

#### Syntax

```html
<!-- Basic pagination -->
<nav class="nb-pagination" aria-label="Pagination">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-prev" aria-disabled="true">&larr;</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">1</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">2</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">3</a>
    </li>
    <li class="nb-pagination-item">
      <span class="nb-pagination-ellipsis">&hellip;</span>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-link">10</a>
    </li>
    <li class="nb-pagination-item">
      <a href="#" class="nb-pagination-next">&rarr;</a>
    </li>
  </ul>
</nav>

<!-- Small size -->
<nav class="nb-pagination nb-pagination-sm" aria-label="Small pagination">
  <ul class="nb-pagination-list">
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link nb-pagination-active" aria-current="page">1</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">2</a></li>
    <li class="nb-pagination-item"><a href="#" class="nb-pagination-link">3</a></li>
  </ul>
</nav>
```

#### Rules
- Always include the base class `nb-pagination`.
- Modifiers are optional and can be combined when documented.
- Prefer native HTML states (disabled, checked, open) over custom state classes.
