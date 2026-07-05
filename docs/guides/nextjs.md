# Integration Guide — Next.js

> **Framework**: Next.js 14+ (App Router or Pages Router)  
> **Tailwind**: v4+  
> **Difficulty**: Intermediate  
> **Time**: ~10 minutes  
> **Special concerns**: SSR, hydration, theme flash-of-unstyled-content (FOUC)

---

## 1. Install Dependencies

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app
```

```bash
npm install @neo-brutal-ui/core @neo-brutal-ui/theme-neo-brutal @neo-brutal-ui/interactions
```

---

## 2. Import the Theme (App Router)

In `app/layout.tsx` (Server Component), import the CSS globally:

```tsx
import "@neo-brutal-ui/theme-neo-brutal/css";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="neo-brutal">
      <body>{children}</body>
    </html>
  );
}
```

> **Do not** import `@neo-brutal-ui/theme-neo-brutal/css` inside a Client Component — it will cause CSS duplication and hydration warnings. Always import CSS in the root layout or a global CSS file.

---

## 3. Prevent Theme Flash on Load (Critical)

Next.js renders HTML on the server, so the browser may paint the page before React hydrates. If the user previously selected dark mode, you will see a flash of light mode unless you restore the theme **before** the first paint.

Add this inline script to `app/layout.tsx` inside `<head>`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="neo-brutal">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var saved = localStorage.getItem('nb-theme');
                if (saved === 'neo-brutal-dark' || saved === 'neo-brutal') {
                  document.documentElement.setAttribute('data-theme', saved);
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

This script runs synchronously before the browser paints, eliminating the FOUC.

---

## 4. Use Components in JSX

Neo-Brutal UI classes work in any React component, Server or Client:

```tsx
// app/page.tsx — Server Component
export default function HomePage() {
  return (
    <main className="nb-container nb-stack" data-theme="neo-brutal">
      <button className="nb-btn nb-btn-primary" type="button">
        Get started
      </button>

      <div className="nb-card">
        <div className="nb-card-header">
          <h3 className="nb-card-title">Card title</h3>
        </div>
        <div className="nb-card-body">
          <p>Card content goes here.</p>
        </div>
      </div>
    </main>
  );
}
```

---

## 5. Optional: JS Interactions in Client Components

The interaction packages (`@neo-brutal-ui/interactions/*`) require the DOM, so they must run in Client Components only. Mark the component with `"use client"`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { createDialog } from "@neo-brutal-ui/interactions/dialog";

export function ConfirmDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const instanceRef = useRef<ReturnType<typeof createDialog> | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    instanceRef.current = createDialog(dialogRef.current, { onClose });
    return () => instanceRef.current?.destroy();
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
          <button className="nb-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}
```

Then import it in a Server Component:

```tsx
// app/page.tsx — Server Component
import { ConfirmDialog } from "./components/ConfirmDialog";

export default function HomePage() {
  return (
    <main>
      <ConfirmDialog />
    </main>
  );
}
```

---

## 6. Theme Setup with Next.js App Router

Create a Client Component for the theme toggle:

```tsx
"use client";

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
    const next =
      html.getAttribute("data-theme") === "neo-brutal"
        ? "neo-brutal-dark"
        : "neo-brutal";
    html.setAttribute("data-theme", next);
    localStorage.setItem("nb-theme", next);
  };

  return (
    <button className="nb-btn nb-btn-sm" onClick={toggle} aria-label="Toggle theme">
      🌓
    </button>
  );
}
```

---

## 7. Pages Router (Legacy)

If you are using the Pages Router (`pages/_app.tsx`):

```tsx
import "@neo-brutal-ui/theme-neo-brutal/css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

Add the theme restoration script in `pages/_document.tsx`:

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="neo-brutal">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var saved = localStorage.getItem('nb-theme');
                if (saved === 'neo-brutal-dark' || saved === 'neo-brutal') {
                  document.documentElement.setAttribute('data-theme', saved);
                }
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

---

## 8. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Hydration mismatch | `data-theme` differs between server and client | Ensure the inline script sets the same `data-theme` the server renders. |
| CSS import warning | Importing CSS in a Client Component | Move CSS imports to `layout.tsx` or `_app.tsx`. |
| Dialog does not open | `createDialog` called before hydration | Wrap in `useEffect` inside a Client Component. |
| Theme flashes on load | Restoration script runs after paint | Move script to `<head>` and run it synchronously. |
| `window is not defined` | Accessing DOM in Server Component | Move DOM access to Client Components (`"use client"`). |

