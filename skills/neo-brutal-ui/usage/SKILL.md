---
name: neo-brutal-ui-usage
description: Mandatory usage rules for Neo-Brutal UI
---

## Neo-Brutal UI usage rules

1. Neo-Brutal UI class names are **strongly scoped**. Every public class begins with `nb-` and includes the component name: `nb-btn`, `nb-btn-primary`, `nb-card-body`.
2. A component always needs its base class. Modifier classes alone do nothing. Example: use `nb-btn nb-btn-primary`, never just `nb-btn-primary`.
3. Customize with Tailwind CSS utilities when Neo-Brutal UI does not provide the needed modifier. Example: `nb-btn px-10` adds custom horizontal padding.
4. If a Tailwind utility cannot override a Neo-Brutal UI style because of specificity, append `!` to the utility as a last resort. Example: `nb-btn bg-red-500!`. Use sparingly.
5. Prefer the **default variant and neutral colors** unless the user explicitly asks for a specific variant or color. Example: use `nb-btn`, not `nb-btn-primary`, by default.
6. Layout with Tailwind `flex` and `grid` should be responsive using Tailwind responsive prefixes.
7. Only allowed class names are existing Neo-Brutal UI classes or Tailwind CSS utility classes. Do not invent new `nb-*` classes.
8. Avoid writing custom CSS. Use Neo-Brutal UI classes or Tailwind utilities.
9. Do not add `bg-base-100 text-base-content` to `<body>` unless necessary; theme tokens are already scoped via `data-theme`.
10. Icon-only components must have an accessible name via `aria-label` or visually hidden text.
11. Prefer native HTML states (`disabled`, `checked`, `open`) over custom state classes when available.
12. Respect `prefers-reduced-motion` and `forced-colors`: do not add motion or color overrides that break these user preferences.

## Class-name categories

These type names are for reference only and are not used in code.

- `component`: the required base class, e.g. `nb-btn`
- `part`: a child part, e.g. `nb-card-body`
- `variant`: a visual style, e.g. `nb-btn-outline`
- `color`: a semantic color, e.g. `nb-btn-primary`
- `size`: a size step, e.g. `nb-btn-lg`
- `state`: an interactive state, e.g. `nb-btn-loading`
- `layout`: layout behavior, e.g. `nb-btn-block`
- `placement`: position, e.g. `nb-tooltip-top`

## Combining classes

A single element can carry one base class plus any compatible combination of color, variant, size, state, and layout classes. Example:

```html
<button class="nb-btn nb-btn-primary nb-btn-outline nb-btn-lg nb-btn-block">
  Large outline primary button
</button>
```
