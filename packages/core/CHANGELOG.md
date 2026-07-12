# @neo-brutal-ui/core

## 1.0.0

### Minor Changes

- a615eb6: Add the `emerald` and `emerald-dark` built-in themes.

  - Added `[data-theme="emerald"]` and `[data-theme="emerald-dark"]` color tokens to `packages/core/src/tokens/colors.css`.
  - Added corresponding shadow, spacing, motion, z-index, component, and reset token scopes for the new themes.
  - Emerald uses an emerald-green primary (OKLCH 155°) with teal, lime, sky-blue, amber, and rose accents.
  - Updated the showcase header theme toggle to cycle through `neo-brutal`, `neo-brutal-dark`, `emerald`, and `emerald-dark`.
  - Updated documentation (`docs/dark-theme.md`, `docs/design/brand-and-tenets.md`, `packages/themes/neo-brutal/README.md`, framework guides) to mention the new themes.

- 198cb26: Promote Date Picker and Command Palette to `ready` status.

  These components now pass the Ready acceptance gates:
  - API docs at `docs/components/api/date-picker.md` and `command-palette.md` reflect the current CSS
  - All documented variants, sizes, states, and color accents are implemented in core CSS
  - Showcase demos initialize the matching interaction modules (`createDatePicker`, `createCommandPalette`)
  - Accessibility semantics are documented, including ARIA roles for combobox/dialog and listbox/option
  - RTL layout uses logical CSS properties
  - Responsive behavior verified down to 320px viewport
  - Behavior tests cover the Date Picker and Command Palette interaction modules

- d14238d: Promote Divider, Loading, and Skeleton to `ready` status.

  These components now pass the Ready acceptance gates:
  - API docs exist at `docs/components/api/<slug>.md` and match the current CSS
  - CSS implements all documented variants, sizes, states, and color accents
  - Showcase demos cover the component surface
  - Accessibility semantics are documented, including screen-reader strategy for Loading
  - RTL layout verified via logical CSS properties
  - Responsive behavior verified down to 320px viewport
  - Reduced-motion and disabled states marked as N/A for the static Divider and Skeleton shapes; Loading includes a reduced-motion dashed-ring fallback

  Divider now demonstrates horizontal (with and without label) and vertical orientations. Loading documents the `role="status"` / `aria-live="polite"` live-region strategy and notes that size variants are not implemented (use inline sizing). Skeleton documents pulse/wave animations, the reduced-motion alternative, and common text-line, avatar, and card patterns.

- c13e07e: Promote six components to `ready` status: File Input, Table, List, Description List, Color Picker, and Chat.

  These components now pass the Ready acceptance gates:
  - API docs exist at `docs/components/api/<slug>.md` and match current CSS
  - CSS implements all documented variants, sizes, states, and color accents
  - Showcase demos cover the component surface
  - Accessibility semantics (landmarks, labels, ARIA attributes) are documented
  - RTL layout verified via logical CSS properties
  - Responsive behavior verified down to 320px viewport
  - Reduced-motion and disabled states marked as N/A for purely static components (Table, List, Description List, Chat)

  Additional documentation updates:
  - File Input: drag-and-drop CSS state is documented, with full drop handling left to consumer JS
  - Table: responsive wrapper pattern and long-content behavior documented
  - List: responsive inline wrapping and long-content behavior documented
  - Description List: horizontal grid responsive behavior and long-content wrapping documented
  - Color Picker: native color dialog limitations and value-sync requirements documented

- 2620988: Promote Hero, Footer, Timeline, Diff Viewer, Browser Mockup, Phone Mockup, and Window Mockup from `beta` to `ready` status.

  These components now pass the Ready acceptance gates:
  - API docs at `docs/components/api/<slug>.md` match the current CSS
  - CSS implements all documented variants, sizes, states, and color accents
  - Showcase demos cover the component surface
  - Accessibility semantics are documented (landmarks, labels, ARIA attributes)
  - RTL layout verified via logical CSS properties
  - Responsive behavior verified down to 320px viewport
  - Reduced-motion and disabled states marked as N/A for the purely static components

  Fixed demo markup to use the CSS-defined class names:
  - `BrowserMockupDemo`: `.nb-browser-header` and `.nb-browser-body`
  - `PhoneMockupDemo`: `.nb-phone-notch-bar`, `.nb-phone-indicator`, `.nb-phone-indicator-bar`, and `.nb-phone-screen-content`
  - `WindowMockupDemo`: `.nb-window-header`, `.nb-window-title`, `.nb-window-title-icon`, and control variants
  - `TimelineDemo`: `.nb-timeline-marker-*`, `.nb-timeline-time`, and `.nb-timeline-body`
  - `DiffViewerDemo`: removed non-existent color variants and used `.nb-diff-stat-added`/`.nb-diff-stat-removed`

- f6ae9fb: Promote **Input**, **Textarea**, and **Select** to `ready` status.

  These components now pass the Ready acceptance gates:
  - API docs at `docs/components/api/input.md`, `docs/components/api/textarea.md`, and `docs/components/api/select.md` match the current CSS
  - All documented variants, sizes, states, and shared `field.css` behavior are implemented
  - Showcase demos cover sizes, states, prefix/suffix alignment, and character-counter structure
  - Accessibility semantics (labels, `aria-invalid`, `aria-describedby`, `aria-live`) are documented
  - RTL layout verified via logical CSS properties and the `[dir="rtl"]` select arrow override
  - Responsive behavior verified down to 320px viewport

  CSS updates in `packages/core/src/components/field.css` normalize browser autofill styling for `.nb-input`, `.nb-textarea`, and `.nb-select` so the default yellow autofill fill does not clash with the theme.

- 3d027b9: Promote OTP Input, Segmented Control, and Code Block to `ready` status.

  These components now pass the Ready acceptance gates:
  - API docs at `docs/components/api/otp.md`, `segmented-control.md`, and `code-block.md` match the current CSS
  - All documented variants, sizes, states, and color accents are implemented in core CSS
  - Showcase demos initialize the matching interaction modules (`createOtp`, `createSegmentedControl`, `createCodeBlock`)
  - Accessibility semantics are documented, including ARIA group/radiogroup labels and copy-button labels
  - RTL layout uses logical CSS properties
  - Responsive behavior verified down to 320px viewport
  - Behavior tests cover the OTP, Segmented Control, and Code Block interaction modules

  Also fixes the Segmented Control checked/disabled selectors to target the native radio input inside each `.nb-segmented-item` using `:has(:checked)` and `:has(:disabled)`.

- 60af10b: Promote Pricing Card, Feature Grid, and Field to `ready` status.

  These components now pass the Ready acceptance gates:
  - API docs at `docs/components/api/<slug>.md` match the current CSS
  - All documented variants, sizes, states, and color accents are implemented
  - Showcase demos cover the component surface
  - Accessibility semantics are documented (landmarks, labels, ARIA attributes)
  - RTL layout verified via logical CSS properties
  - Responsive behavior verified down to 320px viewport
  - Reduced-motion and disabled states documented as N/A for the static/presentational surface

  Additional fixes:
  - Corrected Pricing Card showcase demo to use the documented class names (`.nb-pricing-card-name`, `.nb-pricing-card-price-block`, `.nb-pricing-card-cta`, and `.nb-pricing-card-feature-muted`) and added accessible `aria-labelledby` labels.
  - Added a narrow-viewport media query to `.nb-field-row` so side-by-side fields stack vertically below 640px.

- b9b3845: Promote Radio, Toggle, and Alert to `ready` status.

  These components now pass the Ready acceptance gates:
  - API docs at `docs/components/api/radio.md`, `docs/components/api/toggle.md`, and `docs/components/api/alert.md` match the current CSS
  - All documented variants, sizes, states, and color accents are implemented
  - Showcase demos cover the component surface (checked, disabled, color variants)
  - Accessibility semantics are documented (radio group anatomy, switch `role="switch"`, `role="alert"`, ARIA attributes)
  - RTL layout verified via logical CSS properties
  - Responsive behavior verified down to 320px viewport

  Additional fixes:
  - Added `.nb-toggle::after` to the `prefers-reduced-motion` media query so the thumb animation is also suppressed when reduced motion is requested.

- dfa114e: Promote twenty components to `ready` status: Accordion, Avatar, Badge, Button, Button Group, Card, Carousel, Checkbox, Collapse, Drawer, Dropdown, Kbd, Link, Menu, Modal, Progress, Rating, Tabs, Toast, and Tooltip.

  These components now pass the Ready acceptance gates:
  - API docs match the current CSS and behavior
  - All documented variants, sizes, and states are implemented
  - Showcase demos wire the corresponding interaction modules where applicable
  - Keyboard navigation, focus order, and ARIA attributes are implemented
  - RTL layout verified via Playwright structural checks
  - Responsive behavior verified down to 320px viewport
  - Unit/visual tests cover core behavior

  Additionally, the Tabs, Toast, Menu, Rating, and Carousel showcase demos initialize their JS modules (`createTabs`, `createToastManager`, `createMenu`, `createRating`, and `createCarousel`), satisfying the interactive demo wiring gate. Badge now includes the removable tag control pattern in CSS, demo, and API docs. Progress now documents the native, custom linear, and circular ARIA contracts and splits dense demos into focused examples. Avatar, Button Group, Kbd, and Link now have ready status with documented semantics, ARIA guidance, reduced-motion applicability, and forced-colors coverage.

- edfdb36: Promote seven presentational components to `ready` status: Stat, Steps, Breadcrumbs, Pagination, Empty State, Form Summary, and Range.

  These components now pass the Ready acceptance gates:
  - API docs match the current CSS and behavior
  - All documented variants, sizes, states, and color accents are implemented
  - Showcase demos cover the component surface
  - Accessibility semantics (landmarks, labels, ARIA attributes) are documented
  - RTL layout verified via logical CSS properties and Playwright structural checks
  - Responsive behavior verified down to 320px viewport
  - Existing package/visual tests cover the library surface

### Patch Changes

- 3fa66d1: Promote Calendar to `ready` and add the `createCalendar()` interaction module.

  - Added `packages/interactions/src/calendar.ts` with `createCalendar()` factory for standalone month calendars.
  - Exported `./calendar` subpath from `@neo-brutal-ui/interactions`.
  - Wired `createCalendar()` into `CalendarDemo.astro`; the demo now uses dynamically generated grids with month navigation and selection.
  - Added behavior tests covering month navigation, single/range selection, min/max disabled dates, and keyboard navigation.
  - Updated `apps/showcase/src/data/components.ts` to mark Calendar as `ready` and `interactive: true`.
  - Updated `docs/components/api/calendar.md` to `Ready` status and documented the JS initialization contract.

- 5a1b51f: Fix missing CSS imports and synchronize documentation status.

  - Added `@import url("./components/kbd.css")` and `@import url("./components/chat-bubble.css")` to `packages/core/src/index.css` so the `Kbd` and `Chat` ready components are exported through the core package entry point.
  - Updated API doc status for `Accordion`, `Collapse`, `Dropdown`, `Tabs`, `Toast`, and `Tooltip` from `beta` to `ready` to match the showcase catalog and existing changesets.
  - Regenerated `reports/component-audit-list.md` to reflect the current 57 ready / 0 beta / 2 in-progress split.

- 29510c6: Promote Navbar to `ready` and add the `createNavbar()` interaction module.

  - Added `packages/interactions/src/navbar.ts` with `createNavbar()` factory for mobile collapse toggles.
  - Exported `./navbar` subpath from `@neo-brutal-ui/interactions`.
  - Wired `createNavbar()` into `NavbarDemo.astro` so the hamburger button now toggles the collapse menu.
  - Added behavior tests covering click/keyboard toggle, Escape close, markup initialization, and cleanup.
  - Updated `apps/showcase/src/data/components.ts` to mark Navbar as `ready` and `interactive: true`.
  - Updated `docs/components/api/navbar.md` to `Ready` status and documented the JS initialization contract.

## 0.0.2

### Patch Changes

- 810d09c: Prepare packages for npm release with public publish metadata, scoped install examples, package README files, and tarball smoke checks.
