# Integration Guide — Astro

> **Framework**: Astro 4+  
> **Tailwind**: v4+ (via `@tailwindcss/vite`)  
> **Difficulty**: Beginner  
> **Time**: ~5 minutes  
> **Special notes**: Astro is a perfect fit for Neo-Brutal UI because both are framework-agnostic and HTML-first.

---

## 1. Create an Astro Project

```bash
npm create astro@latest my-app
# Choose: recommended, TypeScript, install dependencies

cd my-app
```

---

## 2. Install Tailwind CSS v4

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin to `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

---

## 3. Install Neo-Brutal UI

```bash
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions
```

---

## 4. Import the Theme

In your global CSS entry (e.g., `src/styles/global.css`):

```css
@import "tailwindcss";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

Import this file in your base layout or the Astro pages that need it:

```astro
---
import "../styles/global.css";
---
```

---

## 5. Use Components in `.astro` Files

Astro's HTML-first model aligns perfectly with Neo-Brutal UI's CSS-first approach. Use the classes directly in your markup:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout>
  <main data-theme="neo-brutal">
    <button class="nb-btn nb-btn-primary" type="button">
      Get started
    </button>

    <div class="nb-card nb-mt-4">
      <div class="nb-card-header">
        <h3 class="nb-card-title">Card title</h3>
      </div>
      <div class="nb-card-body">
        <p>Card content goes here.</p>
      </div>
      <div class="nb-card-footer">
        <button class="nb-btn nb-btn-outline">Cancel</button>
        <button class="nb-btn nb-btn-primary">Save</button>
      </div>
    </div>
  </main>
</BaseLayout>
```

---

## 6. Optional: JS Interactions in Astro Islands

For interactive components, use Astro's `<script>` tags or framework islands.

### Native `<script>` tag (recommended for simple cases)

```astro
<dialog id="my-dialog" class="nb-modal">
  <div class="nb-modal-box">
    <h2 class="nb-modal-title">Confirm</h2>
    <p>Are you sure?</p>
    <div class="nb-modal-actions">
      <button class="nb-btn" data-close-dialog>Cancel</button>
    </div>
  </div>
</dialog>

<button class="nb-btn nb-btn-primary" data-open-dialog>Open dialog</button>

<script>
  import { createDialog } from "@neo-brutal-ui/interactions/dialog";

  const dialog = document.querySelector("#my-dialog");
  const instance = createDialog(dialog);

  document.querySelector("[data-open-dialog]").addEventListener("click", () => instance.open());
  document.querySelector("[data-close-dialog]").addEventListener("click", () => instance.close());
</script>
```

> Astro hoists `<script>` tags and bundles them automatically. TypeScript is supported inside `<script>` when using the `client:*` directives or regular scripts in `.astro` files.

### With React / Vue / Svelte islands

If you prefer a framework island, use Astro's client directives:

```astro
---
import DialogIsland from "../components/DialogIsland.tsx";
---

<DialogIsland client:load />
```

```tsx
// src/components/DialogIsland.tsx
import { useRef, useEffect } from "react";
import { createDialog } from "@neo-brutal-ui/interactions/dialog";

export default function DialogIsland() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const instance = createDialog(ref.current);
    return () => instance.destroy();
  }, []);

  return <dialog ref={ref} className="nb-modal">...</dialog>;
}
```

---

## 7. Dark Theme Toggle

Create a theme toggle with an inline script to prevent FOUC, plus a client-side toggle button:

```astro
---
// src/layouts/BaseLayout.astro
---

<!doctype html>
<html lang="en" data-theme="neo-brutal">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>

    <!-- Theme restoration — runs before paint -->
    <script is:inline>
      (function () {
        var saved = localStorage.getItem("nb-theme");
        if (["neo-brutal", "neo-brutal-dark", "emerald", "emerald-dark"].includes(saved)) {
          document.documentElement.setAttribute("data-theme", saved);
        }
      })();
    </script>
  </head>
  <body>
    <slot />

    <script>
      document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
        const html = document.documentElement;
        // Available themes: neo-brutal, neo-brutal-dark, emerald, emerald-dark
        const next = html.getAttribute("data-theme") === "neo-brutal"
          ? "neo-brutal-dark"
          : "neo-brutal";
        html.setAttribute("data-theme", next);
        localStorage.setItem("nb-theme", next);
      });
    </script>
  </body>
</html>
```

```astro
<button class="nb-btn nb-btn-sm" data-theme-toggle aria-label="Toggle theme">
  🌓
</button>
```

> `is:inline` prevents Astro from bundling and optimizing the script, ensuring it runs exactly as written and before any other scripts.

---

## 8. Content Collections (CMS / Markdown)

If you are using Astro Content Collections or rendering Markdown, you can apply Neo-Brutal UI styles to rendered content via scoped CSS or global overrides:

```css
/* src/styles/content.css */
.nb-content h1,
.nb-content h2,
.nb-content h3 {
  font-weight: 800;
  margin-block-start: var(--nb-space-6);
  margin-block-end: var(--nb-space-3);
}

.nb-content p {
  margin-block-end: var(--nb-space-4);
  line-height: var(--nb-leading-normal);
}
```

Wrap your rendered content in a `.nb-content` container.

---

## 9. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Styles not applied | CSS import not resolved | Ensure `astro.config.mjs` has the Tailwind Vite plugin and `@neo-brutal-ui/theme-neo-brutal/css` is imported in a global CSS file. |
| Script errors in `<script>` | Astro hoists scripts to module scope | Use `import` syntax directly inside `<script>`; Astro handles bundling. |
| Theme flashes on load | `is:inline` script missing | Add the inline restoration script in `<head>` before the first paint. |
| Client island not hydrating | Missing `client:*` directive | Add `client:load`, `client:visible`, or `client:idle` to framework components. |

