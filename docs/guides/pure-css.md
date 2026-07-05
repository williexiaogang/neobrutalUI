# Integration Guide — Pure CSS (No Tailwind)

> **Use case**: Projects without Tailwind CSS, static sites, or when you only need the compiled CSS.  
> **Difficulty**: Beginner  
> **Time**: ~2 minutes  
> **Caveat**: This guide describes how to use the **compiled CSS** from the `core` package. Full production-ready compiled CSS distribution may be added in a future release. Currently, the recommended path is still through Tailwind CSS v4+.

---

## 1. Install the Core Package

```bash
npm install @neo-brutal-ui/core
```

---

## 2. Use the CSS Entry Point

The `@neo-brutal-ui/core` package exports CSS files that are already processed by Tailwind CSS v4's engine. You can import them directly in any HTML file, bundler, or CSS pipeline:

### In a `<link>` tag (CDN / local)

If the CSS file is served from `node_modules` or a CDN:

```html
<link rel="stylesheet" href="./node_modules/@neo-brutal-ui/core/dist/index.css" />
```

### In a bundled CSS file

```css
@import "@neo-brutal-ui/core/css";
```

> The `css` export points to `dist/index.css`, which includes tokens, base reset, all components, and utilities.

---

## 3. HTML Markup

Neo-Brutal UI does not require any JavaScript or build-time processing after the CSS is loaded. Use the classes directly in plain HTML:

```html
<!doctype html>
<html data-theme="neo-brutal">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Neo-Brutal UI — Pure CSS</title>
    <link rel="stylesheet" href="./node_modules/@neo-brutal-ui/core/dist/index.css" />
  </head>
  <body>
    <main>
      <button class="nb-btn nb-btn-primary">Primary action</button>
      <button class="nb-btn nb-btn-outline">Secondary action</button>

      <div class="nb-card" style="margin-block-start: 1rem;">
        <div class="nb-card-header">
          <h2 class="nb-card-title">Card title</h2>
        </div>
        <div class="nb-card-body">
          <p>All styles are applied via CSS. No JavaScript is required.</p>
        </div>
      </div>
    </main>
  </body>
</html>
```

---

## 4. Split Entry Points (Advanced)

If you want to load only certain layers to reduce CSS size, use the split exports:

```css
/* 1. Tokens — must come first */
@import "@neo-brutal-ui/core/tokens";

/* 2. Base — reset and global styles */
@import "@neo-brutal-ui/core/base";

/* 3. Components — only the components you need */
@import "@neo-brutal-ui/core/components";

/* 4. Utilities — sr-only, responsive helpers */
@import "@neo-brutal-ui/core/utilities";
```

> **Note**: `components.css` imports all 40+ component files. If you need granular control, you can import individual component files from the `src` directory and process them yourself, but this requires a Tailwind-compatible CSS pipeline.

---

## 5. Dark Theme

Switch themes by changing the `data-theme` attribute on `<html>` or any ancestor:

```html
<html data-theme="neo-brutal-dark">
```

No additional CSS files are needed — both themes are included in the single CSS bundle.

---

## 6. Customizing Without Tailwind

Even without Tailwind, you can override CSS custom properties (variables) to customize the theme:

```css
[data-theme="neo-brutal"] {
  --nb-primary: oklch(70% 0.25 350); /* Brighter pink */
  --nb-border-width: 4px; /* Thicker borders */
  --nb-btn-shadow: 6px 6px 0px 0px var(--nb-border); /* Larger shadow */
}
```

Place these overrides **after** the Neo-Brutal UI import so they take precedence.

---

## 7. Browser Support

Because you are using pre-built CSS that relies on modern features (`@layer`, `oklch()`, CSS nesting, logical properties), the browser support is the same as the full Tailwind pipeline:

| Browser | Minimum Version |
|---------|----------------|
| Chrome / Edge | 111+ |
| Firefox | 128+ |
| Safari | 17.2+ |

For older browsers, use a build tool like **Lightning CSS** or **PostCSS** to down-level the CSS before serving it.

---

## 8. When to Use This Approach

| Scenario | Recommendation |
|----------|---------------|
| Static HTML site, no build step | ✅ Pure CSS is perfect. |
| Existing project with custom CSS pipeline | ✅ Import the CSS and override tokens. |
| Need tree-shaking or dead-code elimination | ❌ Use Tailwind v4 for better control. |
| Need custom design tokens | ⚠️ Can override CSS variables, but Tailwind integration is more flexible. |
| Large SPA with many components | ❌ Use Tailwind v4 + split entry points for smaller bundles. |

---

## 9. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| File not found | Path to `node_modules` is wrong | Use a bundler or copy the CSS file to your public directory. |
| Colors look wrong | Browser lacks `oklch()` support | Down-level with Lightning CSS or serve a fallback palette. |
| Logical properties not working | Old browser | Use a polyfill or downgrade CSS properties. |
| Theme not switching | `data-theme` missing | Add `data-theme="neo-brutal"` to `<html>`. |

