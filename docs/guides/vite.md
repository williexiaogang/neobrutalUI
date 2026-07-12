# Integration Guide — Vite + Tailwind CSS v4

> **Framework**: Vite (vanilla JS / TypeScript)  
> **Tailwind**: v4+  
> **Difficulty**: Beginner  
> **Time**: ~5 minutes

---

## 1. Create a Vite Project

```bash
npm create vite@latest my-app -- --template vanilla
# or --template vanilla-ts, react, vue, svelte, preact, solid

cd my-app
npm install
```

---

## 2. Install Tailwind CSS v4

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin to `vite.config.ts` (or `vite.config.js`):

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

> **Note**: Tailwind CSS v4 does not use a `tailwind.config.js` file. Configuration is done in CSS.

---

## 3. Install Neo-Brutal UI

```bash
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions
```

---

## 4. Import the Theme

In your main CSS entry file (e.g., `src/style.css`):

```css
@import "tailwindcss";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

> `theme-neo-brutal` imports `@neo-brutal-ui/core/css` internally, so you only need the theme line.

---

## 5. Use Components in HTML

```html
<main data-theme="neo-brutal">
  <button class="nb-btn nb-btn-primary">Get started</button>
</main>
```

---

## 6. Optional: Add JS Interactions

```js
import { createDialog } from "@neo-brutal-ui/interactions/dialog";

const dialog = document.querySelector("dialog");
const instance = createDialog(dialog);

document.querySelector("[data-open]").addEventListener("click", () => instance.open());
```

---

## 7. Dark Theme Toggle

```js
function toggleTheme() {
  const html = document.documentElement;
  // Available themes: neo-brutal, neo-brutal-dark, emerald, emerald-dark
  const next = html.getAttribute("data-theme") === "neo-brutal" 
    ? "neo-brutal-dark" 
    : "neo-brutal";
  html.setAttribute("data-theme", next);
  localStorage.setItem("nb-theme", next);
}

// Restore on load
const saved = localStorage.getItem("nb-theme");
if (saved) document.documentElement.setAttribute("data-theme", saved);
```

Place this script **inline and synchronously** in `<head>` before any paint to avoid a flash of unstyled content.

---

## 8. Tree-Shaking Considerations

Tailwind CSS v4 scans your source files and generates only the utilities you use. Neo-Brutal UI's component CSS is **pre-built** and imported as a whole layer, so it is not tree-shaken by Tailwind. If you need to reduce CSS size, use the split entry points:

```css
@import "tailwindcss";
@import "@neo-brutal-ui/core/tokens";
@import "@neo-brutal-ui/core/base";
@import "@neo-brutal-ui/core/components";
@import "@neo-brutal-ui/core/utilities";
```

Then configure your build to drop unused component files from `components.css` if you know exactly which components you need. This is an advanced optimization and not required for most apps.

---

## 9. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| "Cannot resolve `@neo-brutal-ui/theme-neo-brutal/css`" | Package not installed | Run `npm install @neo-brutal-ui/theme-neo-brutal`. |
| Styles not applied | CSS not imported | Ensure `@import "@neo-brutal-ui/theme-neo-brutal/css";` is in your CSS entry. |
| Tailwind utilities missing | `@import "tailwindcss"` omitted | Add it before the theme import. |
| Dark theme flashes on load | Restore script runs too late | Move the script to `<head>` and run it synchronously. |

