# Component Audit List

Date: 2026-07-10

Scope: 59 components from `apps/showcase/src/data/components.ts`, cross-checked against core CSS (`packages/core/src/components/`), showcase demos (`apps/showcase/src/components/demos/`), interaction modules (`packages/interactions/src/`), API docs (`docs/components/api/`), and the rendered showcase layout.

## Latest update

- **Fixed**: Added missing `@import` statements for `chat-bubble.css` and `kbd.css` in `packages/core/src/index.css`. Both components were already marked `ready` in showcase and had complete CSS files, but their styles were not exported through the package entry point.
- **Fixed**: Synchronized API doc status for **Accordion, Collapse, Dropdown, Tabs, Toast, Tooltip** from `beta` to `ready` in `docs/components/api/*.md`. These components had already been promoted in `apps/showcase/src/data/components.ts` and in changeset `.changeset/promote-ready-components.md`.
- **Added**: Implemented `createNavbar()` interaction module in `packages/interactions/src/navbar.ts`, wired it in `NavbarDemo.astro`, added behavior tests, and promoted **Navbar** from `in-progress` to `ready`.
- **Added**: Implemented `createCalendar()` interaction module in `packages/interactions/src/calendar.ts`, wired it in `CalendarDemo.astro`, added behavior tests, and promoted **Calendar** from `in-progress` to `ready`.
- **Added**: Created `docs/components/README.md` as a landing page for the component documentation, listing all 59 components by category with links to their API docs.
- **Updated**: Regenerated this audit report to reflect the current catalog state (59 ready / 0 beta / 0 in-progress).

## Next Actions

1. **Visual regression** — expand component-specific Playwright baselines beyond Button once cards are stable.
2. **Acceptance warnings** — address remaining 200% zoom and long-text heuristics for components with real rendered overflow.

## Summary

| Metric | Value |
| --- | --- |
| Total catalog components | 59 |
| Status split | 59 ready, 0 beta, 0 in-progress, 0 planned, 0 experimental |
| Demos present | 59 / 59 |
| Core CSS coverage | 59 / 59 (direct or aliased via shared files) |
| Interaction modules | 18 / 59 |
| API docs | 59 / 59 |
| Wide cards | 13 |
| Full-width cards | 5 |

### Shared CSS files

| CSS file | Shared by |
| --- | --- |
| `selector.css` | Checkbox, Radio, Toggle |
| `field.css` | Input, Textarea, Select, Field (via `input.css`) |
| `input.css` | Thin entrypoint that imports `field.css` |

### Components without a matching standalone CSS file

| Component | Status | Note |
| --- | --- | --- |
| **Chat** | ready | Implemented in `chat-bubble.css`; import now added to `index.css`. |
| **Kbd** | ready | Implemented in `kbd.css`; import now added to `index.css`. |
| **Radio** | ready | Implemented in `selector.css`. |
| **Toggle** | ready | Implemented in `selector.css`. |
| **Input** | ready | Implemented via `field.css` through `input.css`. |
| **Textarea** | ready | Implemented via `field.css`. |
| **Select** | ready | Implemented via `field.css`. |

## Priority Findings

| Priority | Area | Components | Issue | Recommended action |
| --- | --- | --- | --- | --- |
| P1 | CSS exports | Chat, Kbd | `packages/core/src/index.css` was missing `@import` for `chat-bubble.css` and `kbd.css`. | ✅ Fixed in this pass. |
| P1 | Docs status | Accordion, Collapse, Dropdown, Tabs, Toast, Tooltip | API docs still marked `beta` while showcase and changesets already promoted them to `ready`. | ✅ Fixed in this pass. |
| — | — | — | All catalog components are now `ready`. | Continue visual regression coverage and acceptance warning cleanup. |
| P2 | Feature gap | Loading | No size variants implemented. | ✅ Fixed: added `.nb-loading-xs`, `.nb-loading-sm`, `.nb-loading-lg`, `.nb-loading-xl` with proportional border widths. |
| P2 | Feature gap | Alert | No dismissible close-button style. | ✅ Fixed: added `.nb-alert-dismissible` and `.nb-alert-close` with hover/active/focus-visible states. |

## Component Checklist

| Component | Status | CSS | Demo | JS | API doc | Size | Optimization notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | ready | `button.css` | yes | no | yes | — | Loading, icon-only sizing, accessible-name docs, visual baselines, reduced-motion, forced-colors. |
| Card | ready | `card.css` | yes | no | yes | — | Media and interactive variants, API docs, reduced-motion, forced-colors. |
| Input | ready | `input.css` → `field.css` | yes | no | yes | — | Thin entrypoint; autofill and prefix/suffix alignment implemented. |
| Field | ready | `field.css` | yes | no | yes | — | Label, description, error, required, field group, row layout, RTL. |
| Textarea | ready | `field.css` | yes | no | yes | — | Character counter structure, sm/lg sizes, RTL. |
| Select | ready | `field.css` | yes | no | yes | — | Native select styling, custom arrow, RTL arrow, forced-colors. |
| Checkbox | ready | `selector.css` | yes | no | yes | — | Checked, indeterminate, disabled, focus-visible, reduced-motion, forced-colors. |
| Radio | ready | `selector.css` | yes | no | yes | — | Circular selector, radio group anatomy, keyboard expectations, RTL. |
| Toggle | ready | `selector.css` | yes | no | yes | — | Pill switch, animated thumb, reduced-motion, RTL thumb position. |
| Badge | ready | `badge.css` | yes | no | yes | — | Semantic colors, outline, removable tag control. |
| Alert | ready | `alert.css` | yes | no | yes | — | Info/success/warning/error variants, inline-start accent border. `.nb-alert-dismissible` and `.nb-alert-close` styles provided; dismissal behavior requires consumer JS. |
| Divider | ready | `divider.css` | yes | no | yes | — | Horizontal, vertical, with label; logical properties; reduced-motion/disabled N/A. |
| Loading | ready | `loading.css` | yes | no | yes | — | Spinner animation, reduced-motion fallback, screen-reader strategy. Size variants: `.nb-loading-xs`, `.nb-loading-sm`, `.nb-loading-lg`, `.nb-loading-xl`. |
| Skeleton | ready | `skeleton.css` | yes | no | yes | — | Pulse/wave, text/avatar/card/button/image shapes, reduced-motion. |
| Modal | ready | `modal.css` | yes | dialog | yes | wide | Native dialog + div fallback focus trap, Escape/backdrop, focus restore. |
| Tabs | ready | `tabs.css` | yes | tabs | yes | wide | `createTabs()` wired; keyboard navigation and ARIA sync verified. |
| Dropdown | ready | `dropdown.css` | yes | dropdown | yes | wide | Interaction tests cover open/close, Escape, outside click. |
| Tooltip | ready | `tooltip.css` | yes | tooltip | yes | — | Focus/hover trigger, `aria-describedby`, collision handling. |
| Table | ready | `table.css` | yes | no | yes | full | Responsive wrapper pattern, zebra, hover, compact, sticky header option. |
| List | ready | `list.css` | yes | no | yes | full | Numbered, bulleted, striped, divided, bordered, inline, compact. |
| Description List | ready | `description-list.css` | yes | no | yes | — | Horizontal, bordered, divided, compact, RTL. |
| Navbar | ready | `navbar.css` | yes | navbar | yes | full | Collapse toggle, Escape close, aria-expanded sync, focus management, reduced-motion, forced-colors, RTL, tests. |
| Drawer | ready | `drawer.css` | yes | drawer | yes | wide | Focus trap, Escape, backdrop, placements, RTL, reduced-motion, forced-colors. |
| Toast | ready | `toast.css` | yes | toast | yes | wide | `createToastManager()` wired; stacking, auto-dismiss, positions, reduced-motion. |
| Accordion | ready | `accordion.css` | yes | accordion | yes | — | Single/multi-open, flush, sizes, keyboard navigation, disabled items. |
| Collapse | ready | `collapse.css` | yes | collapse | yes | — | Smooth transitions, keyboard toggle, disabled state, sm/lg sizes. |
| Progress | ready | `progress.css` | yes | no | yes | — | Native/custom linear, circular, striped, indeterminate, sizes, colors. |
| Avatar | ready | `avatar.css` | yes | no | yes | — | Image, initials, status dots, sizes, grouped avatars, RTL, forced-colors. |
| Stat | ready | `stat.css` | yes | no | yes | — | Vertical/horizontal, trend arrows, colors, sizes, compact, ghost. |
| Steps | ready | `steps.css` | yes | no | yes | — | Horizontal/vertical, completed/active/disabled, colors, sizes, responsive scroll. |
| Breadcrumbs | ready | `breadcrumb.css` | yes | no | yes | — | Semantic nav+ol, current page marker, separators, mobile collapsed variant. |
| Pagination | ready | `pagination.css` | yes | no | yes | — | Numbered pages, prev/next, active/disabled, ellipsis, sizes, colors. |
| Button Group | ready | `button-group.css` | yes | no | yes | — | Horizontal/vertical/block, hover/active/disabled, focus-visible, group ARIA. |
| Link | ready | `link.css` | yes | no | yes | — | Underline, hover background, focus-visible, forced-colors. |
| Menu | ready | `menu.css` | yes | menu | yes | — | Vertical/horizontal, submenus, group labels, disabled items, roving keyboard. |
| Empty State | ready | `empty-state.css` | yes | no | yes | wide | Icon, title, message, action, compact, bordered, forced-colors. |
| Form Summary | ready | `form-summary.css` | yes | no | yes | — | Error/warning variants, message list, field links, compact, RTL. |
| File Input | ready | `file-input.css` | yes | no | yes | wide | Drag area, selected file list, remove button, `.is-dragover` state. Full DnD handling needs consumer JS. |
| Range | ready | `range.css` | yes | no | yes | wide | Track, thumb, fill, colors, vertical, tick marks, disabled, forced-colors. |
| OTP Input | ready | `otp.css` | yes | otp | yes | — | Segmented boxes, auto-focus chaining, paste handling, keyboard nav, tests. |
| Segmented Control | ready | `segmented-control.css` | yes | segmented-control | yes | — | Horizontal/vertical/block, roving focus, keyboard nav, colors, sizes, tests. |
| Color Picker | ready | `color-picker.css` | yes | no | yes | — | Native input styling, swatch, sizes, disabled, forced-colors. |
| Hero | ready | `hero.css` | yes | no | yes | — | Title, subtitle, actions, media, sizes, alignments, colors, RTL. |
| Footer | ready | `footer.css` | yes | no | yes | — | Brand, link groups, bottom bar, compact, colors, RTL. |
| Timeline | ready | `timeline.css` | yes | no | yes | — | Vertical/horizontal/alternate/opposite/dashed, markers, colors, sizes, RTL. |
| Rating | ready | `rating.css` | yes | rating | yes | — | Read-only, half-filled, interactive radiogroup, keyboard selection. |
| Chat | ready | `chat-bubble.css` | yes | no | yes | — | Sent/received variants, colors, sizes, avatar, meta, tail pointers, RTL. |
| Carousel | ready | `carousel.css` | yes | carousel | yes | wide | Scroll-snap, nav/dots, keyboard, autoplay/loop, multi-slide, reduced-motion. |
| Kbd | ready | `kbd.css` | yes | no | yes | — | Sizes, colors, pressed state, shortcut groups, ARIA labels, forced-colors. |
| Code Block | ready | `code-block.css` | yes | code-block | yes | — | Header, copy action, line numbers, sizes, colors, plain/full, tests. |
| Diff Viewer | ready | `diff-viewer.css` | yes | no | yes | — | File header, hunks, added/removed/unchanged lines, sizes, forced-colors. |
| Pricing Card | ready | `pricing-card.css` | yes | no | yes | — | Plan header, price, features, CTA, colors, sizes, hover lift, reduced-motion. |
| Feature Grid | ready | `feature-grid.css` | yes | no | yes | — | Responsive grid, icon/title/description, colors, sizes, hover lift. |
| Calendar | ready | `calendar.css` | yes | calendar | yes | full | Month grid generation, navigation, single/range selection, keyboard nav, min/max limits, ARIA, tests. |
| Date Picker | ready | `date-picker.css` | yes | date-picker | yes | full | Trigger, dropdown panel, range mode, inline variant, sizes, colors, tests. |
| Command Palette | ready | `command-palette.css` | yes | command-palette | yes | wide | Backdrop, search, grouped results, shortcuts, active item, mobile fullscreen, tests. |
| Browser Mockup | ready | `browser.css` | yes | no | yes | wide | Frame, toolbar, address bar, content, sizes, colors, forced-colors. |
| Phone Mockup | ready | `phone.css` | yes | no | yes | wide | Frame, notch, screen, home indicator, sizes, colors, forced-colors. |
| Window Mockup | ready | `window.css` | yes | no | yes | wide | Frame, title bar, controls, content, footer, sizes, colors, forced-colors. |
