---
name: neo-brutal-ui-install
description: Installation notes for Neo-Brutal UI
---

## Neo-Brutal UI install notes

1. Neo-Brutal UI requires **Tailwind CSS v4+** and **Node.js 20+**.
2. Install the core CSS, default theme, and optional interactions:

```sh
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions tailwindcss
```

Or with pnpm:

```sh
pnpm add @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions tailwindcss
```

Or with yarn:

```sh
yarn add @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions tailwindcss
```

3. Import the default theme in your app stylesheet:

```css
@import "tailwindcss";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

4. Wrap your app in a theme container:

```html
<html data-theme="neo-brutal">
  <body>
    <button class="nb-btn nb-btn-primary">Get started</button>
  </body>
</html>
```

5. Optional: import interactions only when a component needs JavaScript behavior:

```js
import { createDialog } from "@neo-brutal-ui/interactions/dialog";
```
