# Integration Guide — Mixing with Existing Tailwind Utilities

> **Use case**: Adding Neo-Brutal UI to a project that already uses Tailwind CSS v4 utilities.  
> **Difficulty**: Intermediate  
> **Time**: ~5 minutes  
> **Key concern**: CSS cascade layer order and class-name collisions.

---

## 1. How Neo-Brutal UI Layers Work

Neo-Brutal UI uses CSS `@layer` to manage cascade priority. The layer order is:

```css
@layer nb.theme, nb.base, nb.components, nb.utilities;
```

| Layer | Contents | Priority |
|-------|----------|----------|
| `nb.theme` | Tokens, colors, spacing | Lowest |
| `nb.base` | Reset, global typography | Low |
| `nb.components` | Component styles (`.nb-*`) | Medium |
| `nb.utilities` | `sr-only`, responsive helpers | High |

Tailwind CSS v4 also uses its own layer system (`@layer utilities`, `@layer components`, etc.). Because Neo-Brutal UI's layers are **namespaced** (`nb.*`), they do not conflict with Tailwind's layers.

---

## 2. Import Order

The correct order in your CSS entry file is:

```css
/* 1. Tailwind CSS v4 */
@import "tailwindcss";

/* 2. Neo-Brutal UI theme (imports core internally) */
@import "@neo-brutal-ui/theme-neo-brutal/css";

/* 3. Your own custom overrides */
@layer nb.theme {
  [data-theme="neo-brutal"] {
    --nb-primary: oklch(70% 0.25 350);
  }
}
```

> **Why this order works**: Tailwind v4's utilities are unlayered (or in their own `utilities` layer). Neo-Brutal UI's component layer (`nb.components`) has lower specificity than unlayered utilities, so `class="nb-btn mb-4"` works correctly: the margin from `mb-4` wins because it is unlayered and has the same specificity as `.nb-btn`.

---

## 3. Combining Neo-Brutal UI Classes with Tailwind Utilities

Neo-Brutal UI classes and Tailwind utilities can be mixed freely in the same element:

```html
<button class="nb-btn nb-btn-primary mb-4 px-8">
  Custom spacing
</button>
```

- `nb-btn` and `nb-btn-primary` come from Neo-Brutal UI's component layer.
- `mb-4` and `px-8` come from Tailwind's utility layer.

Because Tailwind utilities are **unlayered** (or in a higher-priority layer), they will override the component's padding and margin if the same property is set.

### Common combinations

```html
<!-- Layout + spacing -->
<div class="nb-card mx-auto max-w-md p-0">
  <!-- Override card padding with Tailwind utility -->
</div>

<!-- Typography + sizing -->
<h2 class="nb-card-title text-3xl font-extrabold">
  <!-- Override font size and weight -->
</h2>

<!-- Flex + gap -->
<div class="nb-card-footer flex gap-6">
  <!-- Override footer layout with Tailwind flex utilities -->
</div>
```

---

## 4. Customizing Tokens with Tailwind's Theme

If you want Neo-Brutal UI to use Tailwind's theme values instead of its own, override the CSS variables:

```css
@layer nb.theme {
  [data-theme="neo-brutal"] {
    --nb-space-4: 1.5rem; /* Override spacing token */
    --nb-radius-box: 0.5rem; /* Rounder corners */
  }
  [data-theme="emerald"] {
    --nb-primary: #10b981; /* Example emerald override */
  }
}
```

This keeps the component architecture but changes the visual output.

---

## 5. Avoiding Class Name Collisions

Neo-Brutal UI uses a **strong scoped prefix** (`nb-`) to avoid collisions with Tailwind utilities. There is no overlap:

| Tailwind class | Neo-Brutal UI class | Safe? |
|---------------|--------------------|-------|
| `btn` (not standard Tailwind) | `nb-btn` | ✅ Safe |
| `btn-primary` | `nb-btn-primary` | ✅ Safe |
| `card` | `nb-card` | ✅ Safe |
| `text-primary` | `nb-text-primary` | ✅ Safe |
| `bg-primary` | `nb-bg-primary` | ✅ Safe |
| `p-4` | `nb-p-4` | ✅ Safe |

> **Tailwind itself does not ship `.btn` or `.card` classes**, so there is no collision. If you are using a Tailwind plugin that adds component classes (e.g., `tailwindcss-buttons`), you may need to check for overlaps.

---

## 6. Using Neo-Brutal UI Utilities Instead of Tailwind's

Neo-Brutal UI provides a small set of utilities in its `utilities` layer:

| Class | Purpose | Tailwind Equivalent |
|-------|---------|---------------------|
| `.nb-hidden-mobile` | Hide on mobile | `hidden md:block` |
| `.nb-hidden-desktop` | Hide on desktop | `md:hidden` |
| `.nb-text-responsive` | Responsive font size | `text-sm md:text-base` |

You can use either Neo-Brutal UI's utilities or Tailwind's — whichever fits your project's conventions.

---

## 7. Advanced: Custom Layer Order

If you need to change the cascade order for a specific use case, you can declare the layers explicitly in your CSS entry file before any imports:

```css
@layer nb.theme, nb.base, nb.components, nb.utilities, tailwind-base, tailwind-components, tailwind-utilities;

@import "tailwindcss";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

This ensures Tailwind's utilities are evaluated at the highest priority, overriding everything else.

---

## 8. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Tailwind utility not overriding component | Utility in wrong layer | Ensure `@import "tailwindcss"` comes before the Neo-Brutal UI theme. |
| Component style overriding Tailwind | Specificity too high | Use `!important` sparingly, or adjust import order. |
| Token override not working | Override in wrong layer | Place overrides inside `@layer nb.theme`. |
| Custom utility not working | Not in a recognized layer | Add custom utilities to `@layer nb.utilities` or Tailwind's `utilities` layer. |

