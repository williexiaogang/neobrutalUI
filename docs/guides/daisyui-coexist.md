# Integration Guide — Coexisting with daisyUI

> **Use case**: Gradually migrating from daisyUI to Neo-Brutal UI, or using both in different parts of a large application.  
> **Difficulty**: Advanced  
> **Time**: ~10 minutes  
> **Key concerns**: Prefix conflicts, CSS layer ordering, theme variable collisions.

---

## 1. Understanding the Conflict Landscape

Both daisyUI and Neo-Brutal UI are component libraries built on Tailwind CSS. They share similar concepts (themes, semantic colors, component classes) but use different naming conventions and architecture:

| Aspect | daisyUI | Neo-Brutal UI |
|--------|---------|---------------|
| Prefix | `btn`, `card`, `modal` | `nb-btn`, `nb-card`, `nb-modal` |
| Theme | `data-theme="light"` | `data-theme="neo-brutal"` |
| Tokens | `--p`, `--s`, `--a` | `--nb-primary`, `--nb-secondary`, `--nb-accent` |
| Layers | None (flat CSS) | `@layer nb.theme, nb.base, nb.components, nb.utilities` |

Because Neo-Brutal UI uses the `nb-` prefix and namespaced CSS layers, it is **designed to coexist** with daisyUI or any other UI library. However, there are edge cases to manage.

---

## 2. Prefix Strategy

### Neo-Brutal UI prefix: `nb-`

Neo-Brutal UI classes always start with `nb-` (e.g., `.nb-btn`, `.nb-card`). This is a **strong scoped prefix** that prevents collisions with daisyUI's unprefixed classes (`.btn`, `.card`).

| Class | daisyUI | Neo-Brutal UI | Collision? |
|-------|---------|---------------|------------|
| Button | `.btn` | `.nb-btn` | ❌ No |
| Primary button | `.btn-primary` | `.nb-btn-primary` | ❌ No |
| Card | `.card` | `.nb-card` | ❌ No |
| Card title | `.card-title` | `.nb-card-title` | ❌ No |
| Modal | `.modal` | `.nb-modal` | ❌ No |

> **Result**: Class names do not collide. You can use both libraries in the same project without renaming.

---

## 3. Theme Variable Conflicts

Both libraries define CSS custom properties for theming. The risk is low because they use different prefixes:

| daisyUI token | Neo-Brutal UI token | Collision? |
|---------------|--------------------|------------|
| `--p` (primary) | `--nb-primary` | ❌ No |
| `--s` (secondary) | `--nb-secondary` | ❌ No |
| `--bc` (base content) | `--nb-base-content` | ❌ No |
| `--b1` (base 100) | `--nb-base-100` | ❌ No |

### The only overlap: `data-theme`

Both libraries use the `data-theme` HTML attribute. If you set `data-theme="light"` for daisyUI, it will not affect Neo-Brutal UI because Neo-Brutal UI only responds to `neo-brutal`, `neo-brutal-dark`, `emerald`, and `emerald-dark`.

### Safe dual-theme setup

```html
<html data-theme="light">
  <!-- daisyUI components use light theme -->
  
  <div data-theme="neo-brutal">
    <!-- Neo-Brutal UI components use neo-brutal theme -->
  </div>
</html>
```

> **Note**: daisyUI themes cascade down to children. Neo-Brutal UI themes are scoped to the element they are set on and its descendants. They will not interfere with each other.

---

## 4. CSS Layer Ordering

Neo-Brutal UI uses `@layer` to manage cascade priority. daisyUI does not use layers (as of its current version). This means:

- **daisyUI styles** are unlayered and have higher specificity than layered styles at the same specificity level.
- **Neo-Brutal UI styles** are inside `nb.components`, so unlayered daisyUI classes will override them if the same selector is used.

### Import order recommendation

```css
/* 1. Tailwind CSS v4 */
@import "tailwindcss";

/* 2. daisyUI (unlayered) */
@import "daisyui";

/* 3. Neo-Brutal UI (layered) */
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

Because daisyUI is unlayered, its styles will take precedence over Neo-Brutal UI's layered styles if both target the same element. This is usually fine because you use **one library's classes per element**, not both.

### When you need both on the same element

If you must apply both daisyUI and Neo-Brutal UI classes to the same element (e.g., during a migration), use `!important` or explicit layer ordering:

```css
@layer nb.components, daisyui, tailwind-utilities;

@import "tailwindcss";
@import "daisyui";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

This forces daisyUI to be evaluated between Neo-Brutal UI components and Tailwind utilities.

---

## 5. Migration Strategy: Page-by-Page

The safest way to migrate from daisyUI to Neo-Brutal UI is page-by-page:

### Step 1: Install both libraries

```bash
npm install daisyui @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal
```

### Step 2: Use daisyUI on legacy pages

```html
<!-- Legacy page — daisyUI -->
<html data-theme="light">
  <button class="btn btn-primary">Save</button>
</html>
```

### Step 3: Use Neo-Brutal UI on new pages

```html
<!-- New page — Neo-Brutal UI -->
<html data-theme="neo-brutal">
  <button class="nb-btn nb-btn-primary">Save</button>
</html>
```

### Step 4: Gradually replace within a page

If you have a page that uses both, wrap each section in its own theme container:

```html
<div data-theme="light">
  <header class="navbar bg-base-100">
    <!-- daisyUI header -->
  </header>
</div>

<div data-theme="neo-brutal">
  <main>
    <button class="nb-btn nb-btn-primary">New action</button>
  </main>
</div>
```

---

## 6. Token Harmonization (Advanced)

If you want both libraries to share the same color palette, map daisyUI's semantic tokens to Neo-Brutal UI's tokens:

```css
@layer nb.theme {
  [data-theme="neo-brutal"] {
    --nb-primary: var(--p);     /* daisyUI primary → Neo-Brutal primary */
    --nb-secondary: var(--s);   /* daisyUI secondary → Neo-Brutal secondary */
    --nb-accent: var(--a);       /* daisyUI accent → Neo-Brutal accent */
    --nb-base-100: var(--b1);   /* daisyUI base-100 → Neo-Brutal base-100 */
  }
}
```

Place this in your global CSS **after** both libraries are imported. This ensures Neo-Brutal UI components use daisyUI's current theme colors.

---

## 7. Build Size Impact

Including both libraries will increase your CSS bundle size:

| Library | Approx. CSS Size (gzip) |
|---------|------------------------|
| daisyUI | ~20–30 KB |
| Neo-Brutal UI core | ~15–25 KB |
| Both | ~35–55 KB |

If bundle size is critical, consider:

1. Migrating fully to Neo-Brutal UI (it has no JS runtime, only CSS).
2. Using daisyUI's `themes: false` config to disable unused themes.
3. Using Neo-Brutal UI's split entry points (`tokens`, `base`, `components`, `utilities`) to load only what you need.

---

## 8. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Neo-Brutal UI styles missing | CSS not imported | Add `@import "@neo-brutal-ui/theme-neo-brutal/css";`. |
| daisyUI overrides Neo-Brutal UI | Unlayered CSS wins | Use explicit layer ordering or `!important` for migration targets. |
| Theme colors look wrong | Token mapping mismatch | Map daisyUI tokens to Neo-Brutal UI tokens in a custom layer. |
| `data-theme` affects both | Using generic theme name | Use `neo-brutal`, `neo-brutal-dark`, `emerald`, or `emerald-dark` for Neo-Brutal UI; `light` / `dark` for daisyUI. |
| JS interactions conflict | Both libraries attach listeners | Only initialize one library's JS per component. |

