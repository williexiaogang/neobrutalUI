# Neo-Brutal UI — Accessibility Specification

> **Version:** 0.0.2-alpha  
> **Last updated:** 2026-07-05  
> **Scope:** 48 CSS components + 11 JS interactions  
> **Standard targets:** WCAG 2.2 AA, EN 301 549, Section 508

---

## 1. Global Accessibility Requirements Checklist

Every component shipped in `@neo-brutal-ui/core` and `@neo-brutal-ui/interactions` MUST satisfy the following baseline requirements. These are non-negotiable and are enforced by CI lint rules and manual audit gates.

### 1.1 Semantic HTML
- [ ] Components use the most appropriate native HTML element (`<button>`, `<a>`, `<dialog>`, `<table>`, `<nav>`, `<input>`, `<select>`, `<fieldset>`, `<label>`, `<ol>`, `<ul>`, `<li>`, `<progress>`, etc.).
- [ ] ARIA roles are used only when native semantics are insufficient or when the root element is a generic `<div>` / `<span>`.
- [ ] Landmarks (`<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<aside>`) are preserved in consumer markup; components do not force arbitrary landmark elements.
- [ ] Heading hierarchy (`h1`–`h6`) is preserved; components that render text headings expose the level via a prop or wrapper class, not by hard-coding `h3`.
- [ ] Lists (`<ol>`, `<ul>`, `<dl>`) are used for sequential or grouped content (steps, breadcrumbs, menu, pagination, etc.).
- [ ] Data tables use `<table>`, `<thead>`, `<tbody>`, `<th>` with `scope="col"` or `scope="row"`.

### 1.2 Keyboard Navigation
- [ ] All interactive elements are reachable with `Tab` / `Shift+Tab`.
- [ ] Custom composite widgets (tabs, carousel, menu, dropdown, command-palette, steps, accordion, rating) implement roving `tabindex` or arrow-key navigation per WAI-ARIA Authoring Practices 1.2.
- [ ] `Escape` closes transient overlays (modal, drawer, dropdown, menu, tooltip, toast) unless it is a destructive action.
- [ ] `Enter` / `Space` activate buttons, links, menu items, toggles, and accordion triggers.
- [ ] `Home` / `End` jump to first / last item in list-like widgets (tabs, menu, dropdown, pagination, steps).
- [ ] Arrow keys (`↑` `↓` `←` `→`) navigate inside tabs, menus, dropdowns, carousels, command-palette, rating, and steps.
- [ ] No keyboard traps except in intentional modal focus scopes; `Tab` + `Shift` cycles inside modals / drawers.

### 1.3 Focus Order
- [ ] Focus order matches visual reading order (top-to-bottom, left-to-right in LTR; top-to-bottom, right-to-left in RTL).
- [ ] Opening an overlay moves focus to the first focusable element inside the overlay (or the overlay container itself if it has `tabindex="-1"`).
- [ ] Closing an overlay returns focus to the element that triggered it (or the previously focused element).
- [ ] Focus is visibly indicated; no invisible focus jumps.
- [ ] Focusable but hidden elements (`hidden`, `display: none`, `visibility: hidden`) are removed from the tab order.

### 1.4 Focus-Visible
- [ ] Every focusable component has a `:focus-visible` style that is distinct from `:hover` and `:active`.
- [ ] Focus ring uses `outline: 2px solid var(--nb-focus)` with `outline-offset: 2px` (or equivalent inside the component) as the default pattern.
- [ ] No `outline: none` without a replacement focus indicator.
- [ ] Focus rings have a contrast ratio ≥ 3:1 against adjacent backgrounds (light and dark themes).
- [ ] `cursor: pointer` is used on interactive elements; `cursor: not-allowed` on disabled elements.

### 1.5 Touch Targets
- [ ] Minimum interactive target size is **44 × 44 CSS pixels** (WCAG 2.5.5 AAA preferred; **24 × 24 CSS pixels** absolute minimum per WCAG 2.5.8 AA).
- [ ] Buttons, links, inputs, selects, toggles, checkboxes, radios, menu items, dropdown items, tab triggers, pagination links, carousel dots, and carousel arrows all meet the target size.
- [ ] Adjacent targets have at least 2 px spacing (CSS `gap` or `margin`) to reduce accidental activation.
- [ ] Small variants (`-sm`) must still meet the 24 × 24 minimum; if they cannot, they must be used inside a larger hit-area wrapper or documented as an exception.

### 1.6 Color Independence
- [ ] No information is conveyed by color alone. Error states use borders + text + icons. Success states use icons + text. Disabled states use `opacity` + `cursor: not-allowed` + reduced shadow.
- [ ] Focus indicators are not color-dependent; they use `outline`.
- [ ] Link underlines are preserved or visible on hover/focus.
- [ ] Charts and data visualizations (stats, progress, rating) provide text alternatives or labels.

### 1.7 200 % Zoom (Reflow)
- [ ] All components remain usable at 320 px equivalent width (1280 px at 400 % zoom per WCAG 1.4.10).
- [ ] Horizontal scroll is avoided except for data tables (`nb-table-wrapper`) and carousel tracks, which are expected scrollable containers.
- [ ] Modal / drawer content reflows without clipping; `max-inline-size` is set in `rem` / `ch` units, not fixed `px`.
- [ ] Navbar collapses into a vertical stack below 768 px.
- [ ] Tab lists scroll horizontally on narrow viewports instead of wrapping.
- [ ] Steps overflow-x scroll on narrow viewports.

### 1.8 Screen Reader Support
- [ ] All images have meaningful `alt` text; decorative images have `alt=""` or `aria-hidden="true"`.
- [ ] Icons inside interactive elements have `aria-hidden="true"` and a text label or `aria-label` on the parent.
- [ ] Form inputs have associated `<label>` elements or `aria-label` / `aria-labelledby`.
- [ ] Error messages are linked via `aria-describedby` or `aria-errormessage` (when supported).
- [ ] Required fields are indicated visually and programmatically (`aria-required="true"` or `required` attribute).
- [ ] Dynamic content updates use `aria-live` regions (toasts, alerts, loading states, command-palette results).
- [ ] Hidden panels are marked with `hidden` or `aria-hidden="true"` and removed from the accessibility tree.
- [ ] Progress bars expose `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label` or `aria-labelledby`.
- [ ] Loading skeletons are hidden from AT (`aria-hidden="true"`) with a live-region announcement.
- [ ] Skip links are available in full-page layouts (not enforced by components, but documented in integration guides).

---

## 2. Component-by-Component Accessibility Matrix

> **Legend:**  
> `role` = required / recommended ARIA role(s)  
> `kbd` = keyboard interaction pattern  
> `live` = live-region usage (`polite`, `assertive`, `none`)  
> `JS` = requires JS interaction package for full a11y compliance  
> `🔄` = RTL-aware (uses logical properties)

| Component | ARIA Role(s) | Keyboard Behavior | Live Region | Notes |
|-----------|--------------|-------------------|-------------|-------|
| **accordion** | `region` (each item), `button` (trigger) | `Enter` / `Space` toggle; arrow keys optional | `none` | `aria-expanded` required; `aria-controls` optional. JS `createCollapse` handles toggle. |
| **alert** | `alert` / `alertdialog` / `status` | `none` (static) | `assertive` if dynamic | Info/error/warning variants map to `alert` or `status`. Icon must be `aria-hidden`. |
| **avatar** | `img` | `none` | `none` | Must have `alt` text. Decorative avatars use `alt=""`. |
| **badge** | `status` (optional) | `none` | `none` | Purely decorative or status label. No interaction. |
| **breadcrumb** | `nav`, `ol`, `li` | `Tab` through links | `none` | Current page is `<span>` or `<a aria-current="page">`. Separators are `aria-hidden`. |
| **browser** | `figure` (optional) | `none` | `none` | Decorative window chrome. No AT-critical content. |
| **button** | `button` | `Enter` / `Space` | `none` | Disabled uses `disabled` or `aria-disabled="true"`. Focus-visible ring required. |
| **button-group** | `group` | Arrow keys between buttons (optional) | `none` | One button may be `aria-pressed="true"` for toggle groups. |
| **calendar** | `grid`, `gridcell`, `button` | Arrow keys navigate days; `Enter` selects; `Home`/`End`/`PageUp`/`PageDown` | `none` | Complex widget; needs JS for full keyboard support. |
| **card** | `article` / `section` (optional) | `none` | `none` | Content container. No built-in ARIA required. |
| **carousel** | `region`, `tablist` (dots), `button` | `←` `→` / `Tab` + `Enter`; optional auto-play pause | `none` | Auto-play MUST have a pause control. Dots are `tablist` if used as tabs. JS `createCarousel` handles arrows. |
| **chat-bubble** | `log` (container), `article` (message) | `none` | `polite` (container) | Incoming messages append to `role="log"`. Sender / time should be `aria-hidden` or text. |
| **code-block** | `code` or `pre` + `code` | `Tab` to copy button; `Ctrl+A` to select | `none` | Copy button must have `aria-label`. Syntax highlighting is visual; plain text is primary. |
| **collapse** | `region` (content) | `Enter` / `Space` toggle | `none` | `aria-expanded` on trigger. Content is `hidden` or `display:none` when collapsed. |
| **command-palette** | `dialog`, `combobox`, `listbox`, `option` | `↑` `↓` navigate; `Enter` select; `Escape` close; `Tab` / `Shift+Tab` trap | `polite` (results count) | Search input is `combobox`. Results are `listbox`. Needs JS. |
| **date-picker** | `dialog` / `group` + `grid` | Same as calendar inside overlay | `none` | Input field + calendar popup. Popup must trap focus. |
| **description-list** | `dl`, `dt`, `dd` | `none` | `none` | Native semantics. No ARIA needed. |
| **diff-viewer** | `table` or `group` + `list` | `none` | `none` | Old / new lines need visual and text distinction. |
| **divider** | `separator` (optional) | `none` | `none` | Decorative `<hr>`; use `aria-hidden="true"` if purely visual. |
| **drawer** | `dialog` (fallback) / native `<dialog>` | `Tab` trap; `Escape` close; focus return | `none` | Use `<dialog>` element when possible. JS `createDrawer` manages focus. |
| **dropdown** | `menu`, `menuitem`, `separator` | `↑` `↓` navigate; `Enter` / `Space` activate; `Escape` close; `Tab` moves to next focusable | `none` | Trigger must have `aria-expanded`, `aria-haspopup="menu"`. JS `createDropdown` handles keyboard. |
| **empty-state** | `status` or `region` | `none` | `none` | Illustration must have `alt` text. CTA button follows button rules. |
| **feature-grid** | `list` / `group` (optional) | `none` | `none` | Decorative layout container. No built-in ARIA. |
| **field** (input, textarea, select) | `textbox` / `combobox` / `searchbox` | `Tab` / `Shift+Tab`; standard form keys | `none` | Label MUST be `<label>` or `aria-label`. Error linked via `aria-describedby`. |
| **footer** | `contentinfo` (optional) | `none` | `none` | Semantic `<footer>` inside `<body>` is landmark. |
| **hero** | `banner` (optional) | `none` | `none` | Decorative container. CTA buttons follow button rules. |
| **kbd** | `kbd` | `none` | `none` | Decorative. Must not be the ONLY way to explain keyboard shortcuts. |
| **link** | `link` | `Enter` | `none` | Must be `<a href="...">`. Focus-visible ring required. |
| **list** | `list` / `listitem` | `none` | `none` | Native `<ul>` / `<ol>` semantics. |
| **loading** | `progressbar` / `status` | `none` | `polite` | Linear loader uses `progress`. Skeletons use `aria-hidden="true"` + live region. |
| **menu** | `menubar` / `menu`, `menuitem` | `↑` `↓` `←` `→` navigate; `Enter` / `Space` activate; `Escape` close submenu; `Home` / `End` | `none` | Submenus use `aria-expanded`. JS `createMenu` or `createDropdown` required. |
| **modal** | `dialog` / native `<dialog>` | `Tab` trap; `Escape` close; focus return | `none` | Use `<dialog>` element. JS `createDialog` manages focus trap and return. |
| **navbar** | `navigation` / native `<nav>` | `Tab` through links; `Enter` / `Space` toggle mobile menu | `none` | Mobile toggle must have `aria-expanded`, `aria-controls`. Brand link is `<a href>` or `<span>` if non-navigable. |
| **pagination** | `navigation`, `list`, `link` / `button` | `Tab` / `Shift+Tab`; `Enter` on page links | `none` | Current page is `aria-current="page"`. Disabled prev/next use `aria-disabled="true"`. |
| **phone** | `img` (frame) | `none` | `none` | Decorative device mockup. No AT-critical content. |
| **pricing-card** | `article` (optional) | `none` | `none` | CTA button follows button rules. Feature list uses `<ul>`. |
| **progress** | `progressbar` | `none` | `none` | Native `<progress>` or div-based with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. |
| **rating** | `slider` | `←` `→` adjust; `Enter` / `Space` submit | `none` | `aria-valuenow`, `aria-valuemax`, `aria-label="Rating"`. JS `createRating` required. |
| **selector** (checkbox, radio, toggle) | `checkbox` / `radio` / `switch` | `Tab` / `Shift+Tab`; `Space` toggle; arrow keys inside radio groups | `none` | Toggle (`nb-toggle`) should use `role="switch"` and `aria-checked`. |
| **skeleton** | `none` (hidden from AT) | `none` | `none` | `aria-hidden="true"`. Accompany with a live-region announcement if loading is long. |
| **stat** | `group` (optional) | `none` | `none` | Numbers should be readable by AT; avoid animated `countUp` without `aria-live`. |
| **steps** | `list` / `group` | `Tab` through interactive steps; `Enter` to activate | `none` | Completed / active states use `aria-current="step"` on active item. |
| **table** | `table`, `row`, `columnheader`, `cell` | `Tab` through focusable cells; arrow keys inside data grid (optional) | `none` | Simple tables use native `<table>`. Complex data grids need `role="grid"` + JS. |
| **tabs** | `tablist`, `tab`, `tabpanel` | `←` `→` or `↑` `↓` navigate; `Enter` / `Space` activate; `Home` / `End` | `none` | `aria-selected`, `aria-controls`, `aria-labelledby` required. JS `createTabs` handles keyboard. |
| **timeline** | `list` / `group` (optional) | `none` | `none` | Sequential items; native `<ol>` or `<ul>` semantics suffice. |
| **toast** | `alert` / `status` | `Tab` to dismiss button; `Escape` optional dismiss | `polite` or `assertive` | Container uses `aria-live="polite"` (default) or `assertive` for errors. JS `createToastManager` required. |
| **tooltip** | `tooltip` | `Tab` to trigger; `Escape` dismiss (optional) | `none` | `role="tooltip"` on content. Trigger must have `aria-describedby` pointing to tooltip. JS `createTooltip` handles show/hide. |
| **window** | `figure` (optional) | `none` | `none` | Decorative mockup. No AT-critical content. |

### 2.1 JS Interaction Package A11y Contract

| Interaction | Required ARIA | Keyboard Contract | Focus Management |
|-------------|---------------|-------------------|------------------|
| `createDialog` | `role="dialog"`, `aria-modal="true"` (fallback) | `Escape` → close; `Tab` → trap; `Enter` on submit | Save / restore active element; focus first focusable on open |
| `createTabs` | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` | Arrow keys → next/prev; `Home` / `End`; `Enter` / `Space` → activate | Focus active tab on keyboard nav |
| `createCarousel` | `role="region"`, `aria-roledescription="carousel"` (optional) | `←` `→` → prev/next; dot `Tab` + `Enter` | Focus current slide or nav button |
| `createTooltip` | `role="tooltip"` | `Tab` / `Shift+Tab` to trigger; `Escape` dismiss | Return focus to trigger on dismiss |
| `createToastManager` | `aria-live="polite"` (container) | `Tab` to action buttons inside toast; `Escape` dismiss | Focus stays on current element unless toast is modal |
| `createCollapse` | `aria-expanded` on trigger | `Enter` / `Space` toggle | Focus remains on trigger |
| `createDropdown` | `role="menu"`, `role="menuitem"`, `aria-expanded`, `aria-haspopup` | `↑` `↓` navigate; `Enter` / `Space` activate; `Escape` / `Tab` close | Focus first item on open; return to trigger on close |
| `createDrawer` | `role="dialog"` (fallback) | `Escape` → close; `Tab` → trap | Save / restore active element |
| `createRating` | `role="slider"`, `aria-valuenow`, `aria-valuemax`, `aria-label` | `←` `→` adjust; `Enter` / `Space` submit | Focus on slider control |
| `createMenu` | `role="menubar"` / `menu`, `role="menuitem"`, `aria-expanded` | Arrow keys navigate; `Enter` / `Space` activate; `Escape` close submenu | Roving tabindex inside menubar |
| `createAccordion` | `aria-expanded`, `aria-controls` (optional) | `Enter` / `Space` toggle; optional arrow keys | Focus on trigger |

---

## 3. `forced-colors` Testing Checklist

All components are tested in Windows High Contrast mode (`forced-colors: active`) and must pass the following checks.

### 3.1 Visual Contrast
- [ ] Borders are visible on ALL components. No component relies solely on background color to show its boundaries.
- [ ] Interactive elements (buttons, inputs, links, menu items, tabs, pagination links, dropdown items, carousel dots, accordion triggers) have a visible border (`2px solid ButtonText` or `CanvasText`).
- [ ] Disabled elements use `GrayText` for borders and text.
- [ ] Focus indicators use `Highlight` with `HighlightText`.
- [ ] Selected / active states use `Highlight` background and `HighlightText` foreground.

### 3.2 Color Independence in Forced Colors
- [ ] Meaning is NOT conveyed by color alone. Success/error states use text labels or icons in addition to color.
- [ ] `forced-color-adjust: none` is used only where the component’s own color logic must be preserved (e.g., modal backdrop opacity); otherwise, system colors are respected.
- [ ] `color` and `background` values that map to system colors are verified (`Canvas`, `CanvasText`, `ButtonText`, `Highlight`, `HighlightText`, `GrayText`, `LinkText`).

### 3.3 Per-Component Forced-Colors Verification

| Component | Key Test | Expected Result |
|-----------|----------|-----------------|
| button | Border visible, disabled readable | `2px solid ButtonText` border; disabled uses `GrayText` |
| card | Border visible, header/footer separator visible | `2px solid CanvasText` border; header/footer border visible |
| alert | Border + accent border visible | `2px solid CanvasText`; icon uses `CanvasText` |
| input / select / textarea | Border visible, focus visible | `2px solid CanvasText`; focus outline `Highlight` |
| table | Borders visible, zebra striping visible | `2px solid CanvasText`; zebra uses `Canvas` + outline |
| tabs | Active tab border visible | Active tab uses `Highlight` border |
| navbar | Border + mobile toggle visible | Border `CanvasText`; toggle border `ButtonText` |
| steps | Indicator border + connector visible | Indicator `2px solid CanvasText`; completed/active use `Highlight` |
| pagination | Active page border + disabled readable | Active `Highlight` bg; disabled `GrayText` border |
| dropdown | Panel border + item focus visible | Panel `2px solid CanvasText`; item focus `Highlight` outline |
| menu | Panel border + item focus visible | Same as dropdown |
| modal | Dialog border + backdrop opacity | Dialog `2px solid CanvasText`; backdrop `Canvas` at 90% opacity |
| drawer | Panel border + backdrop opacity | Same as modal |
| toast | Border + close button visible | Toast `2px solid CanvasText`; close button `2px solid CanvasText` |
| tooltip | Border visible | Tooltip content `2px solid CanvasText` |
| badge | Border visible | `2px solid CanvasText` |
| checkbox / radio / toggle | Border + checked state visible | `2px solid CanvasText`; checked `Highlight` bg |
| progress | Track + fill visible | Track border `CanvasText`; fill `Highlight` |
| carousel | Viewport + nav + dot borders visible | Viewport, nav, dot borders `CanvasText`; active dot `Highlight` |
| accordion | Item border + trigger focus visible | Item `2px solid CanvasText`; trigger focus `Highlight` outline |
| kbd | Border visible | `2px solid ButtonText` |
| link | Underline + color | `LinkText` color; underline preserved |
| breadcrumb | Separator + current page readable | Separator `GrayText`; current page `CanvasText` |

---

## 4. `prefers-reduced-motion` Testing Checklist

All components respect `prefers-reduced-motion: reduce` and must pass the following checks.

### 4.1 Global Motion Rules
- [ ] No non-essential animations, transitions, or transforms are applied when the user prefers reduced motion.
- [ ] `transition: none` is applied to all animated properties (transform, box-shadow, background, opacity, border-color, outline-color, grid-template-rows, etc.).
- [ ] No infinite CSS animations (spinners, progress stripes, carousel auto-play) run automatically. They must be paused or removed.
- [ ] No parallax, scroll-linked animations, or zoom effects.
- [ ] JS interaction packages read `matchMedia('(prefers-reduced-motion: reduce)')` and disable smooth scroll, animated transitions, and count-up animations.

### 4.2 Per-Component Reduced-Motion Verification

| Component | Motion Source | Reduced-Motion Behavior |
|-----------|---------------|------------------------|
| button | `transform`, `box-shadow` transition | `transition: none` |
| card | `box-shadow` | `transition: none` (if any) |
| alert | `box-shadow` | `transition: none` (if any) |
| input / select / textarea | `box-shadow`, `border-color` transition | `transition: none` |
| tabs | `background` transition, `border-color` transition | `transition: none` |
| navbar | `background` transition on links, `transform` on toggle | `transition: none` |
| steps | `background`, `color`, `box-shadow` on indicator | `transition: none` |
| pagination | `transform`, `box-shadow` transition | `transition: none` |
| dropdown | `background` transition on items | `transition: none` |
| menu | `background` transition on items | `transition: none` |
| modal | `opacity`, `transform` transition | `transition: none`; `transform: none !important`; no animation |
| drawer | `opacity`, `transform` transition | `transition: none`; `transform: none !important` |
| toast | `opacity`, `transform` transition | `transition: none`; `transform: none`; `opacity: 1` |
| tooltip | `opacity`, `transform`, `visibility` transition | `transition: none`; `transform: none !important` |
| accordion | `grid-template-rows`, `box-shadow`, `transform` (icon) | `transition: none`; panel stays open if JS detects reduced motion (optional) |
| carousel | `scroll-behavior: smooth`, `transform` on nav, `scale` on dots | `scroll-behavior: auto`; nav/dots `transition: none` |
| progress | `inline-size` transition, stripe animation, indeterminate animation | `transition: none`; stripes `animation: none`; indeterminate `animation: none` |
| loading | Skeleton shimmer, spinner rotation | `animation: none`; show static state |
| kbd | `transform`, `box-shadow` transition | `transition: none` |
| breadcrumb | `background`, `border-color` transition | `transition: none` |
| toggle | `transform` on knob, `background` transition | `transition: none` |
| selector (checkbox/radio) | `background` transition | `transition: none` |
| table | `background` transition on row hover | `transition: none` |
| rating | `transform` on hover / selection | `transition: none` |
| chat-bubble | Entrance animation | `transition: none`; `animation: none` |
| timeline | Entrance animation (optional) | `transition: none`; `animation: none` |
| code-block | Copy feedback animation | `transition: none` or instant feedback |
| hero | Entrance animation (optional) | `transition: none`; `animation: none` |
| feature-grid | Stagger reveal (optional) | `transition: none`; `animation: none` |
| stat | `countUp` animation | JS detects reduced motion; shows final value instantly |
| command-palette | Overlay entrance | `transition: none`; `transform: none` |
| date-picker | Calendar panel transition | `transition: none` |
| diff-viewer | Line highlight transition | `transition: none` |
| browser / window / phone | Decorative animations | `transition: none`; `animation: none` |
| empty-state | Illustration animation | `transition: none`; `animation: none` |
| pricing-card | Hover lift (optional) | `transition: none` |
| toast-progress | `scaleX` animation | `animation: none`; progress bar hidden or at 0 |
| carousel-caption | Slide transition (optional) | `transition: none` |
| modal-sheet | Slide-up transform | `transition: none`; `transform: none` |
| drawer-start / end / top / bottom | Slide transform | `transition: none`; `transform: none` |

### 4.3 JS Interaction Motion Contracts

| Interaction | Animated Property | Reduced-Motion Behavior |
|-------------|-------------------|------------------------|
| `createDialog` | `opacity`, `transform` | Disable transition; show instantly |
| `createTabs` | `hidden` toggle | No animation; instant panel swap |
| `createCarousel` | Smooth scroll | `scroll-behavior: auto`; disable auto-play |
| `createTooltip` | `opacity`, `translateY` | Show/hide instantly; no transform |
| `createToastManager` | `opacity`, `translateY`, progress bar | Show instantly; hide instantly; progress bar skips animation |
| `createCollapse` | `grid-template-rows`, `height` | Open instantly; no transition |
| `createDropdown` | `display` toggle (CSS) | No animation; instant open/close |
| `createDrawer` | `opacity`, `translateX/Y` | Disable transition; show instantly |
| `createRating` | `transform` hover | No hover animation; instant selection |
| `createMenu` | Submenu `display` | No animation; instant open/close |
| `createAccordion` | `grid-template-rows` | Open instantly; no transition |

---

## 5. Testing Procedures

### 5.1 Automated Tests
Run `node scripts/test-a11y.mjs` to:
- Build the showcase app.
- Serve built HTML pages locally.
- Inject `axe-core` via Playwright.
- Report critical, serious, moderate, and minor violations.
- Fail CI if any critical or serious violations exist.

Run `node scripts/test-rtl.mjs` to:
- Scan all CSS files in `packages/core/src/components/`.
- Flag physical direction properties (`left`, `right`, `margin-left`, `margin-right`, `padding-left`, `padding-right`, `border-left`, `border-right`, `float: left`, `float: right`, `text-align: left`, `text-align: right`).
- Fail CI if any un-exempted physical properties are found.

### 5.2 Manual Tests
- [ ] Navigate the entire showcase site using only the keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, arrow keys).
- [ ] Enable Windows High Contrast mode (`Settings > Accessibility > Contrast themes`) and verify every component has visible borders and readable text.
- [ ] Enable `prefers-reduced-motion` in the OS (or via browser dev-tools emulation) and verify no non-essential motion occurs.
- [ ] Zoom the browser to 200 % and 400 %; verify no horizontal clipping except in expected scroll containers.
- [ ] Test the RTL page (`/rtl`) with a screen reader (NVDA, JAWS, VoiceOver) and verify reading order is right-to-left.
- [ ] Test the stress-test page (`/stress-test`) with a screen reader and verify long words and emoji are announced correctly.
- [ ] Run VoiceOver Rotor (macOS/iOS) and NVDA Elements List to verify headings, landmarks, form fields, links, and tables are present.

### 5.3 Screen Reader Test Matrix

| Screen Reader | Browser | OS | Test Scope |
|---------------|---------|----|------------|
| NVDA | Firefox / Chrome | Windows 11 | Full keyboard + HCM + focus order |
| JAWS | Chrome | Windows 11 | Modal/dialog focus traps, live regions, tables |
| VoiceOver | Safari | macOS | Landmark navigation, RTL reading, form labels |
| VoiceOver | Safari | iOS 17+ | Touch targets, swipe navigation, reduced motion |
| TalkBack | Chrome | Android 14+ | Touch targets, focus order, RTL |

---

## 6. Known A11y Gaps & Exemptions

| Component | Gap | Mitigation | Planned Fix |
|-----------|-----|------------|-------------|
| **steps** | Uses `left: 50%` and `left: calc(...)` for connector pseudo-elements (physical property, not logical). | Component renders correctly in LTR; RTL visual layout may need adjustment. | Replace with `inset-inline-start` and RTL-aware positioning. |
| **tooltip** | `transform: translateX(-50%)` is used for centering. | Works visually but is not logical-property aligned. | Evaluate `inset-inline-start: 50%` + `translateX(-50%)` or logical transform. |
| **carousel** | Auto-play is not paused automatically on reduced motion. | Consumer must pass `autoPlay: false` when reduced motion is preferred. | JS interaction should read `prefers-reduced-motion` and disable auto-play by default. |
| **calendar** | Full keyboard navigation (PageUp, PageDown, Home, End) is not implemented in the CSS layer. | Requires JS interaction package (`createCalendar` planned). | Add `createCalendar` interaction with full keyboard support. |
| **date-picker** | No built-in `aria-describedby` linking between input and calendar grid. | Requires consumer wiring or JS interaction. | Add JS interaction that manages `aria-controls` and `aria-describedby`. |
| **command-palette** | No built-in `aria-activedescendant` on combobox. | JS interaction manages visual focus; ARIA attribute needs explicit binding. | Update `createCommandPalette` to set `aria-activedescendant`. |
| **chat-bubble** | Incoming messages may not auto-announce if `role="log"` is not on the container. | Consumer must add `role="log"` and `aria-live` to the container. | Document the required DOM contract in component docs. |
| **diff-viewer** | Color-only distinction for added/removed lines. | Use `+`/`-` prefix text or `ins`/`del` elements. | Update CSS to add visible text indicators or use semantic elements. |
| **rating** | Partial stars (e.g., 3.5) may not be announced correctly by all screen readers. | Use `aria-valuenow` with step of 0.5 and `aria-valuetext`. | Test with NVDA / JAWS and adjust `aria-valuetext`. |

---

## 7. References

- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [HTML Accessibility API Mappings 1.0](https://www.w3.org/TR/html-aam-1.0/)
- [CSS Logical Properties and Values Level 1](https://drafts.csswg.org/css-logical/)
- [Media Queries Level 5 — `prefers-reduced-motion`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion)
- [CSS Media Queries Level 5 — `forced-colors`](https://drafts.csswg.org/mediaqueries-5/#forced-colors)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/4.9)
