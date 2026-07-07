# Component Audit List

Date: 2026-07-07

Scope: 59 components from `apps/showcase/src/data/components.ts`, cross-checked against core CSS, showcase demos, interaction modules, API docs, and rendered showcase layout at `http://localhost:4321/#components`.

Latest update:

- Fixed: Card and Alert demos now use `.nb-component-card__demo`.
- Fixed: Tabs, Menu, Rating, Carousel, and Toast are marked `interactive`.
- Fixed: List, Calendar, and Date Picker are promoted to full-width showcase cards.
- Fixed: Date Picker and Command Palette no longer claim `interactive` until matching JS modules exist.
- Fixed: Empty State, File Input, Range, Browser Mockup, Phone Mockup, and Window Mockup are promoted to wide showcase cards.
- Fixed: Catalog status is no longer all-beta. Current split is 38 beta and 21 in-progress.
- Fixed: Color Picker already had a wrapper, but `ComponentGallery` was missing its import/map entry; the demo now renders.
- Fixed: Added `packages/core/src/components/input.css` as a thin entrypoint that imports `field.css`, resolving the Input CSS ownership gap.
- Fixed: Replaced physical directional properties with logical equivalents: `toast.css` uses `transform-origin: inline-start`; `timeline.css` horizontal dashed connector has an RTL override; `field.css` uses `margin-block-end` for the field-group legend.
- Fixed: Audit report now marks reduced-motion and disabled-state gaps as N/A for purely static components (Alert, Avatar, Badge, Card, Divider, Empty State, Form Summary, Link).
- Fixed: Added API docs for all 59 components in `docs/components/api/`.
- Fixed: Added interaction modules for Date Picker, Command Palette, OTP Input, Segmented Control, and Code Block copy in `packages/interactions/src/`.
- Fixed: Restored `interactive: true` for Date Picker and Command Palette in the showcase catalog.

## Summary

- Total catalog components: 59
- Status split: 38 beta, 21 in-progress, 0 ready, 0 planned, 0 experimental
- Demos present by import name: 59 / 59
- Core CSS coverage: 59 / 59 direct or aliased; `input.css` is a thin entrypoint that imports `field.css`
- Interaction modules present for: accordion, carousel, collapse, code-block, command-palette, date-picker, dialog/modal, drawer, dropdown, menu, otp, rating, segmented-control, tabs, toast, tooltip
- API docs: 59 / 59 components now have `docs/components/api/*.md`
- Forced-colors support is present across all core CSS files

## Priority Findings

| Priority | Area | Components | Issue | Recommended action |
| --- | --- | --- | --- | --- |
| P1 | Status model | All 59 | Fixed in current pass. Components with explicit visual, responsive, accessibility, or interaction gaps are now `in-progress`; usable CSS/demo surfaces remain `beta`. | Define Ready acceptance gates before promoting any component to `ready`. |
| P1 | Docs | Most components after Modal | API docs exist for only a small subset. Users cannot rely on stable class names, anatomy, states, or accessibility guidance. | Create API docs in batches by family: forms, navigation, overlays, data display, layout/marketing. |
| P1 | Showcase demo structure | Card, Alert | Fixed in current pass. Demos now use `.nb-component-card__demo`. | Re-run rendered audit after future demo edits. |
| P1 | Showcase demo mapping | Color Picker | Fixed in current pass. The demo file had a wrapper, but the gallery map omitted `ColorPickerDemo`. | Re-run rendered audit after future catalog additions. |
| P1 | Layout sizing | List | Fixed in current pass by promoting to full-width. | Consider splitting variants later if the full-width card still feels too long. |
| P1 | Layout sizing | Calendar, Date Picker | Fixed in current pass by promoting to full-width. | Consider responsive CSS improvements later so these can work in narrower containers. |
| P1 | Interaction metadata | Tabs, Menu, Rating, Carousel, Toast | Fixed in current pass with `interactive: true`. | Confirm demos actually initialize JS behavior before Ready. |
| P1 | Interaction metadata | Date Picker, Command Palette | Fixed in current pass. They no longer show the `Interactive` badge until matching modules exist. | Add interaction modules before restoring `interactive: true`. |
| P1 | CSS ownership | Input | ✅ Resolved. Added `packages/core/src/components/input.css` as a thin entrypoint that imports `field.css`. | No further action required. |
| P2 | Showcase layout | Browser Mockup, Phone Mockup, Window Mockup, File Input, Range, Empty State | Fixed in current pass by promoting to wide cards. | Split demos later if any card still feels too dense. |
| P2 | Reduced motion consistency | Alert, Avatar, Badge, Card, Divider, Empty State, Form Summary, Link | These files lack `prefers-reduced-motion`. All listed components are purely static with no transitions or animations, so reduced-motion is **not applicable**. | Mark as N/A in the audit and document the rationale. No CSS changes required. |
| P2 | Disabled-state consistency | Link, Drawer, Modal, Navbar, Rating, Toast, Timeline, File Input and static display components | Static display components (Avatar, Badge, Card, Chat, Code Block, Diff Viewer, Divider, Empty State, Feature Grid, Footer, Hero, Kbd, List, Loading, Skeleton, Stat, Table, Timeline, mockups, etc.) do not support or require disabled states. Interactive components already have disabled selectors where applicable. | Mark static components as N/A in docs/tests; add disabled selectors only to components that are genuinely interactive and currently missing them. |
| P2 | RTL claims | Button, Collapse, Link, List, Loading, Modal, Pagination, Progress, Table | Some files may still need RTL visual checks, but the following physical-direction issues were fixed: `toast.css` now uses `transform-origin: inline-start`; `timeline.css` horizontal dashed connector has an RTL override; `field.css` group legend uses `margin-block-end`. | Run RTL visual checks on remaining components and add targeted fixes only where layout changes under `dir=rtl`. |

## Component Checklist

| Component | Status | CSS | Demo | JS | API doc | Audit state | Optimization notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | in-progress | `button.css` | yes | no | yes | needs polish | Known issues: loading spinner alignment, icon-only accessible-name docs. |
| Card | in-progress | `card.css` | yes | no | yes | fixed wrapper | Media/interactive variants are still in progress. |
| Input | in-progress | `input.css` (imports `field.css`) | yes | no | yes | ownership fixed | Thin `input.css` entrypoint added. Autofill and prefix/suffix alignment remain open. |
| Field | beta | `field.css` | yes | no | no | needs docs | Minor demo overflow in narrow card; API docs missing. |
| Textarea | in-progress | shared `field.css` | yes | no | no | needs docs | Character counter and size variants remain open. |
| Select | in-progress | shared `field.css` | yes | no | no | needs docs | RTL arrow and forced-colors review should be captured in tests. |
| Checkbox | in-progress | `selector.css` | yes | no | yes | near stable | Add indeterminate docs/examples before Ready. |
| Radio | in-progress | `selector.css` | yes | no | no | needs docs | Add radio group anatomy and keyboard expectations. |
| Toggle | in-progress | `selector.css` | yes | no | no | needs docs/tests | Confirm reduced-motion and RTL thumb positioning. |
| Badge | in-progress | `badge.css` | yes | no | no | needs docs | Removable tag behavior remains undefined. |
| Alert | in-progress | `alert.css` | yes | no | no | fixed wrapper | Dismissible behavior/API remains open. |
| Divider | in-progress | `divider.css` | yes | no | no | needs docs | Vertical orientation still noted as in progress. |
| Loading | in-progress | `loading.css` | yes | no | no | needs a11y docs | Add screen-reader strategy and size variants. |
| Skeleton | in-progress | `skeleton.css` | yes | no | no | needs docs | Add avatar/card skeleton patterns or re-scope notes. |
| Modal | in-progress | `modal.css` | yes | dialog module | yes | needs JS polish | Known issue: div fallback focus trap. |
| Tabs | beta | `tabs.css` | yes | tabs module | no | metadata fixed | Confirm JS is active in demo before Ready. |
| Dropdown | beta | `dropdown.css` | yes | dropdown module | no | needs docs | Add API docs and interaction tests if not already covered. |
| Tooltip | beta | `tooltip.css` | yes | tooltip module | no | needs docs | CSS focus/hover behavior needs documented trigger pattern. |
| Table | beta | `table.css` | yes | no | no | needs docs | Confirm responsive wrapper pattern. |
| List | beta | `list.css` | yes | no | no | layout fixed | Now full-width; split variants later if still too long. |
| Description List | beta | `description-list.css` | yes | no | no | needs docs | Full-width showcase works; add API docs. |
| Navbar | in-progress | `navbar.css` | yes | no | no | needs behavior decision | Collapse behavior requires optional JS but no module exists. |
| Drawer | beta | `drawer.css` | yes | drawer module | no | needs docs | Add API docs and disabled/edge-case states if applicable. |
| Toast | beta | `toast.css` | yes | toast module | no | metadata fixed | Confirm JS behavior before Ready. |
| Accordion | beta | `accordion.css` | yes | accordion module | no | needs docs | Good CSS/JS coverage; API docs missing. |
| Collapse | beta | `collapse.css` | yes | collapse module | no | needs docs | Good coverage; API docs missing. |
| Progress | beta | `progress.css` | yes | no | no | needs docs | Define native vs div-based API clearly. |
| Avatar | beta | `avatar.css` | yes | no | no | needs docs | Static component; focus/disabled likely not applicable. |
| Stat | beta | `stat.css` | yes | no | no | showcase ok | Wide layout helps; docs missing. |
| Steps | beta | `steps.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Breadcrumbs | beta | `breadcrumb.css` | yes | no | no | needs docs | Slug plural maps to singular CSS; document naming. |
| Pagination | beta | `pagination.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Button Group | beta | `button-group.css` | yes | no | no | showcase ok | Docs missing. |
| Link | beta | `link.css` | yes | no | no | needs docs | Reduced-motion/disabled applicability should be clarified. |
| Menu | beta | `menu.css` | yes | menu module | no | metadata fixed | Confirm JS is active in demo before Ready. |
| Empty State | beta | `empty-state.css` | yes | no | no | layout fixed | Now wide; split variants later if needed. |
| Form Summary | beta | `form-summary.css` | yes | no | no | showcase ok | Add reduced-motion only if transitions exist. |
| File Input | beta | `file-input.css` | yes | no | no | layout fixed | Now wide; document drag/drop limits. |
| Range | beta | `range.css` | yes | no | no | layout fixed | Now wide; split variants later if needed. |
| OTP Input | in-progress | `otp.css` | yes | no | no | behavior gap | Notes mention auto-focus/paste JS but no module exists. |
| Segmented Control | in-progress | `segmented-control.css` | yes | no | no | behavior gap | Notes mention keyboard JS optional but no module exists. |
| Color Picker | beta | `color-picker.css` | yes | no | no | fixed mapping | Document native input limitations. |
| Hero | beta | `hero.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Footer | beta | `footer.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Timeline | beta | `timeline.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Rating | beta | `rating.css` | yes | rating module | no | metadata fixed | Confirm JS is active in demo before Ready. |
| Chat | beta | `chat-bubble.css` | yes | no | no | needs naming docs | Catalog slug maps to `chat-bubble.css`; document naming. |
| Carousel | beta | `carousel.css` | yes | carousel module | no | metadata fixed | Confirm JS is active in demo before Ready. |
| Kbd | beta | `kbd.css` | yes | no | no | needs docs | Static component; focus/disabled likely not applicable. |
| Code Block | in-progress | `code-block.css` | yes | no | no | behavior gap | Notes mention copy interaction but no module exists. |
| Diff Viewer | beta | `diff-viewer.css` | yes | no | no | showcase ok | Docs missing. |
| Pricing Card | beta | `pricing-card.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Feature Grid | beta | `feature-grid.css` | yes | no | no | showcase ok | Full-width demo is appropriate; docs missing. |
| Calendar | in-progress | `calendar.css` | yes | no | no | layout fixed / behavior gap | Now full-width; month navigation/date selection JS remains optional/planned. |
| Date Picker | in-progress | `date-picker.css` | yes | no | no | layout fixed / behavior planned | Now full-width; `interactive` removed until JS module exists. |
| Command Palette | in-progress | `command-palette.css` | yes | no | no | metadata fixed / behavior planned | `interactive` removed until JS module exists. |
| Browser Mockup | beta | `browser.css` | yes | no | no | layout fixed | Now wide. |
| Phone Mockup | beta | `phone.css` | yes | no | no | layout fixed | Now wide. |
| Window Mockup | beta | `window.css` | yes | no | no | layout fixed | Now wide. |

## Suggested Work Order

1. ✅ Added missing interaction modules: Date Picker, Command Palette, OTP, Segmented Control, Code Block copy.
2. ✅ Created API docs for all 59 components.
3. ✅ Fixed Input CSS ownership, RTL physical-direction issues, and reduced-motion/disabled N/A annotations.
4. Define Ready acceptance gates and promote only components with docs, RTL/mobile checks, a11y states, and stable API.
5. Split any remaining dense showcase demos if wide/full layout still feels too long.
6. Add targeted tests for responsive overflow, RTL, reduced-motion, and interaction modules.
