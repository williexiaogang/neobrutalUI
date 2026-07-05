# Integration Guide — Vue

> **Framework**: Vue 3 (Composition API)  
> **Build Tool**: Vite  
> **Tailwind**: v4+  
> **Difficulty**: Beginner  
> **Time**: ~5 minutes

---

## 1. Create a Vue Project

```bash
npm create vue@latest my-app
# or npm create vite@latest my-app -- --template vue

cd my-app
npm install
```

---

## 2. Install Tailwind CSS v4

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin to `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
});
```

---

## 3. Install Neo-Brutal UI

```bash
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions
```

---

## 4. Import the Theme

In your global CSS entry (e.g., `src/style.css` or `src/assets/main.css`):

```css
@import "tailwindcss";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

---

## 5. Use Components in `.vue` SFC

Neo-Brutal UI is **CSS-first**. Use the classes directly in your templates — no Vue wrapper components are required.

```vue
<template>
  <main data-theme="neo-brutal">
    <button class="nb-btn nb-btn-primary" type="button">
      Create project
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
</template>
```

---

## 6. Optional: JS Interactions in Vue

For interactive components (dialog, tabs, carousel, tooltip, dropdown, drawer, toast, collapse, rating), use a Vue custom directive or a composable:

### Composable approach (recommended)

```ts
// src/composables/useDialog.ts
import { ref, onMounted, onUnmounted } from "vue";
import { createDialog } from "@neo-brutal-ui/interactions/dialog";
import type { ComponentInstance } from "@neo-brutal-ui/interactions";

export function useDialog() {
  const el = ref<HTMLDialogElement | null>(null);
  const instance = ref<ComponentInstance | null>(null);

  onMounted(() => {
    if (el.value) {
      instance.value = createDialog(el.value);
    }
  });

  onUnmounted(() => {
    instance.value?.destroy();
  });

  return { el, instance };
}
```

```vue
<template>
  <dialog ref="el" class="nb-modal">
    <div class="nb-modal-box">
      <h2 class="nb-modal-title">Confirm</h2>
      <p>Are you sure?</p>
      <div class="nb-modal-actions">
        <button class="nb-btn" @click="instance?.close()">Cancel</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useDialog } from "@/composables/useDialog";
const { el, instance } = useDialog();
</script>
```

### Custom directive approach

```ts
// src/directives/nbDialog.ts
import { createDialog } from "@neo-brutal-ui/interactions/dialog";

export const vNbDialog = {
  mounted(el: HTMLDialogElement) {
    (el as any).__nbDialog = createDialog(el);
  },
  unmounted(el: HTMLDialogElement) {
    (el as any).__nbDialog?.destroy();
  },
};
```

```vue
<template>
  <dialog v-nb-dialog class="nb-modal">...</dialog>
</template>

<script setup>
import { vNbDialog } from "@/directives/nbDialog";
</script>
```

---

## 7. Dark Theme Toggle

```vue
<template>
  <button class="nb-btn" @click="toggleTheme">
    {{ isDark ? 'Light' : 'Dark' }}
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(false);

onMounted(() => {
  const saved = localStorage.getItem("nb-theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
    isDark.value = saved === "neo-brutal-dark";
  }
});

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "neo-brutal"
    ? "neo-brutal-dark"
    : "neo-brutal";
  html.setAttribute("data-theme", next);
  localStorage.setItem("nb-theme", next);
  isDark.value = next === "neo-brutal-dark";
}
</script>
```

For SSR (Nuxt), restore the theme in a server plugin or inline script to avoid hydration mismatches.

---

## 8. Nuxt 3 Specifics

If you are using Nuxt 3, add the CSS import in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ["@neo-brutal-ui/theme-neo-brutal/css"],
  modules: ["@nuxtjs/tailwindcss"], // or configure manually
});
```

> Nuxt's Tailwind module may still use v3. Ensure you are on a version that supports Tailwind CSS v4, or configure it manually with `@tailwindcss/vite`.

---

## 9. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Styles not applied | CSS import missing | Add `@import "@neo-brutal-ui/theme-neo-brutal/css";` to your global CSS. |
| `ref` is `null` in `onMounted` | Element is inside `v-if` | Use `v-show` instead, or wait for the next tick with `await nextTick()`. |
| Dialog not opening | `instance` not initialized | Check that `createDialog` ran inside `onMounted`. |
| Dark theme flashes | Theme restored after hydration | Use a Nuxt plugin or inline script in `<head>`. |

