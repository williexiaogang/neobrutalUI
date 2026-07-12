# Integration Guide — React

> **Framework**: React 18+ (also works with Preact, Solid)  
> **Build Tool**: Vite, Next.js, or any React-compatible bundler  
> **Tailwind**: v4+  
> **Difficulty**: Beginner  
> **Time**: ~5 minutes

---

## 1. Install Dependencies

```bash
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions
npm install -D tailwindcss @tailwindcss/vite
```

> If you are using Next.js, see the [Next.js guide](nextjs.md) instead.

---

## 2. Import the CSS

In your global CSS entry (e.g., `src/index.css` or `src/App.css`):

```css
@import "tailwindcss";
@import "@neo-brutal-ui/theme-neo-brutal/css";
```

---

## 3. Use Components in JSX

Neo-Brutal UI is **CSS-first and framework-agnostic**. You write plain HTML/CSS classes in your JSX — no React wrapper components are required.

```jsx
export function MyPage() {
  return (
    <main data-theme="neo-brutal">
      <button className="nb-btn nb-btn-primary">
        Create project
      </button>

      <div className="nb-card nb-mt-6">
        <div className="nb-card-header">
          <h3 className="nb-card-title">Card title</h3>
        </div>
        <div className="nb-card-body">
          <p>Card content goes here.</p>
        </div>
        <div className="nb-card-footer">
          <button className="nb-btn nb-btn-outline">Cancel</button>
          <button className="nb-btn nb-btn-primary">Save</button>
        </div>
      </div>
    </main>
  );
}
```

> **Note**: Use `className` instead of `class` in React. Neo-Brutal UI classes work identically with `className`.

---

## 4. Optional: JS Interactions in React

For components that need JS state (dialog, tabs, carousel, tooltip, dropdown, drawer, toast, collapse, rating), you can import the vanilla JS interactions and wrap them in a `useEffect`:

```jsx
import { useEffect, useRef } from "react";
import { createDialog } from "@neo-brutal-ui/interactions/dialog";

export function Dialog({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    const instance = createDialog(dialogRef.current, {
      onClose,
      closeOnEscape: true,
    });
    instanceRef.current = instance;
    return () => instance.destroy();
  }, [onClose]);

  useEffect(() => {
    if (instanceRef.current) {
      isOpen ? instanceRef.current.open() : instanceRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="nb-modal">
      <div className="nb-modal-box">
        <h2 className="nb-modal-title">Confirm</h2>
        <p>Are you sure?</p>
        <div className="nb-modal-actions">
          <button className="nb-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </dialog>
  );
}
```

### Alternative: Custom hooks

For reusable patterns, wrap the interaction in a custom hook:

```jsx
import { useEffect, useRef } from "react";
import { createTabs } from "@neo-brutal-ui/interactions/tabs";

export function useTabs() {
  const ref = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    instanceRef.current = createTabs(ref.current);
    return () => instanceRef.current?.destroy();
  }, []);

  return ref;
}
```

---

## 5. Dark Theme Toggle

```jsx
import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const saved = localStorage.getItem("nb-theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    // Available themes: neo-brutal, neo-brutal-dark, emerald, emerald-dark
    const next = html.getAttribute("data-theme") === "neo-brutal"
      ? "neo-brutal-dark"
      : "neo-brutal";
    html.setAttribute("data-theme", next);
    localStorage.setItem("nb-theme", next);
  };

  return <button className="nb-btn" onClick={toggle}>Toggle theme</button>;
}
```

For SSR frameworks (Next.js, Remix), restore the theme in an inline script in the HTML `<head>` to prevent hydration mismatches.

---

## 6. Server Components (Next.js App Router)

In Next.js App Router, keep the CSS import in your root layout (a Server Component) and use the JS interactions only in Client Components (`"use client"`):

```tsx
// app/layout.tsx (Server Component)
import "@neo-brutal-ui/theme-neo-brutal/css";

export default function RootLayout({ children }) {
  return (
    <html data-theme="neo-brutal">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/components/Tabs.tsx (Client Component)
"use client";
import { useTabs } from "./useTabs";

export function Tabs() {
  const ref = useTabs();
  return <div ref={ref} className="nb-tabs">...</div>;
}
```

---

## 7. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `className` not working | Using `class` in JSX | Always use `className` in React/JSX. |
| JS interaction throws | Element not yet in DOM | Call `createDialog` after mount (inside `useEffect`). |
| Hydration mismatch | Theme restored after render | Use inline `<script>` in `<head>` for SSR. |
| Styles missing in prod | CSS import tree-shaken | Ensure CSS import is in a file that is not dynamically imported. |

