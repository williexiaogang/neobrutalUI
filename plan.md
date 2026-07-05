# Neo-Brutal UI Stage 8+ Execution Plan

## Current State Summary

**Completed (Stages 1-7):**
- Core CSS package: 17 components (button, card, field/input/textarea/select, selector/checkbox/radio/toggle, badge, alert, divider, loading, modal, link, tabs, table, navbar, dropdown, tooltip, drawer, toast)
- Interactions package: dialog, tabs, tooltip, toast, dropdown, drawer, animations (reveal, countUp, stagger)
- Token system: colors (OKLCH + dark theme), spacing, shadows, motion, z-index, component
- Base: reset
- Utilities: sr-only, responsive
- Build system, changesets, showcase app (Astro)
- Dark theme (`neo-brutal-dark`) fully implemented

**Missing from MVP:**
- Skeleton component
- `createDisclosure` interaction (placeholder)

## Execution Roadmap

### Stage 1: Stage 8 P1 Components (Immediate)
Target: 10 high-priority post-MVP components

| Component | CSS Only | Needs JS | Notes |
|-----------|----------|----------|-------|
| Skeleton | ✅ | ❌ | Missing from MVP |
| Progress | ✅ | ❌ | Bar + circular variants |
| Avatar | ✅ | ❌ | Image, initials, status dot |
| Stat | ✅ | ❌ | Number + label + trend |
| Breadcrumbs | ✅ | ❌ | Nav with separators |
| Pagination | ✅ | ❌ | Page numbers + prev/next |
| Steps | ✅ | ❌ | Horizontal + vertical |
| Empty State | ✅ | ❌ | Icon + message + action |
| Button Group | ✅ | ❌ | Joined buttons |
| Accordion | ✅ | ✅ | CSS visuals + JS toggle |
| Menu | ✅ | ✅ | ARIA menu pattern |

### Stage 2: Stage 8 P2-P4 Components (Batch 2)
Timeline, Rating, Chat Bubble, Kbd, List, Description List, Carousel, Collapse, Code Block, Diff Viewer, Hero, Footer, Pricing Card, Feature Grid, Mockups, etc.

### Stage 3: Quality & Testing
- Stage 9: Accessibility specs (axe-core, keyboard tests, forced-colors, reduced-motion)
- Stage 10: RTL verification, i18n content stress tests
- Stage 11: ESLint, Stylelint, visual regression, API snapshots, bundle size gates

### Stage 4: Documentation & Release
- Stage 12: Component docs, playground features, integration guides
- Stage 13: npm packaging, exports verification, release workflow
- Stage 14: Theme generator (future)

## Component Implementation Rules

All new components must follow these patterns (derived from existing codebase):

1. **CSS File Pattern:**
   - File: `packages/core/src/components/{name}.css`
   - Wrapped in `@layer nb.components { }`
   - Use `--_` prefix for internal custom properties
   - Use semantic tokens (`--nb-primary`, `--nb-base-100`, etc.)
   - Include `prefers-reduced-motion` media query
   - Include `forced-colors` media query
   - Use logical properties (`inline-size`, `block-size`, `padding-inline`, etc.)

2. **Class Naming:**
   - Component: `nb-{name}`
   - Parts: `nb-{name}-{part}`
   - Variants: `nb-{name}-{variant}`
   - Colors: `nb-{name}-{color}`
   - Sizes: `nb-{name}-{size}`

3. **Registration:**
   - Add `@import` to `packages/core/src/index.css`

4. **JS Interactions (if needed):**
   - File: `packages/interactions/src/{name}.ts`
   - Export `create{Name}` function
   - Return `{ open, close, toggle, destroy, getState }`
   - Use factory primitives from `factory.js`
   - SSR-safe (no top-level window/document access)
   - Export from `packages/interactions/src/index.ts`

## Token Reference

**Spacing:** `--nb-space-1` (0.25rem) through `--nb-space-16` (4rem)
**Text:** `--nb-text-xs` through `--nb-text-4xl`
**Shadows:** `--nb-shadow-xs` (1px) through `--nb-shadow-xl` (8px)
**Border width:** `--nb-border-width: 2px`
**Radius:** All `--nb-radius-*` are `0px` (neo-brutal style)
**Duration:** `--nb-duration-fast`, `--nb-duration-normal`, `--nb-duration-slow`
**Easing:** `--nb-ease-out`, `--nb-ease-in-out`

**Semantic colors:** `--nb-base-100/200/300`, `--nb-base-content`, `--nb-base-content-muted`, `--nb-neutral`, `--nb-primary`, `--nb-secondary`, `--nb-accent`, `--nb-info`, `--nb-success`, `--nb-warning`, `--nb-error`, plus `*-content` variants

**Z-index:** `--nb-z-dropdown`, `--nb-z-sticky`, `--nb-z-drawer`, `--nb-z-modal`, `--nb-z-toast`, `--nb-z-tooltip`
