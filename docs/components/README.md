# Components

Neo-Brutal UI provides **59 ready-to-use components** across six categories. Every component ships with complete CSS, a showcase demo, API documentation, and—where needed—an optional zero-dependency JavaScript interaction module.

## Status

All catalog components are currently **`ready`**:

- **59 ready** / 0 beta / 0 in-progress / 0 planned / 0 experimental
- **18 components** include optional JavaScript interaction modules
- CSS covers states, variants, sizes, colors, RTL, reduced-motion, and forced-colors

Components marked with **[JS]** below require `@neo-brutal-ui/interactions` for full keyboard/ARIA behavior.

---

## Component Index

### Actions

| Component | Slug | JS |
|-----------|------|----|
| [Button](./api/button.md) | `button` | — |
| [Button Group](./api/button-group.md) | `button-group` | — |

### Layout

| Component | Slug | JS |
|-----------|------|----|
| [Card](./api/card.md) | `card` | — |
| [Divider](./api/divider.md) | `divider` | — |
| [Accordion](./api/accordion.md) | `accordion` | ✅ |
| [Collapse](./api/collapse.md) | `collapse` | ✅ |
| [Empty State](./api/empty-state.md) | `empty-state` | — |
| [Hero](./api/hero.md) | `hero` | — |
| [Footer](./api/footer.md) | `footer` | — |
| [Pricing Card](./api/pricing-card.md) | `pricing-card` | — |
| [Feature Grid](./api/feature-grid.md) | `feature-grid` | — |

### Forms

| Component | Slug | JS |
|-----------|------|----|
| [Input](./api/input.md) | `input` | — |
| [Field](./api/field.md) | `field` | — |
| [Textarea](./api/textarea.md) | `textarea` | — |
| [Select](./api/select.md) | `select` | — |
| [Checkbox](./api/checkbox.md) | `checkbox` | — |
| [Radio](./api/radio.md) | `radio` | — |
| [Toggle](./api/toggle.md) | `toggle` | — |
| [Form Summary](./api/form-summary.md) | `form-summary` | — |
| [File Input](./api/file-input.md) | `file-input` | — |
| [Range](./api/range.md) | `range` | — |
| [OTP Input](./api/otp.md) | `otp` | ✅ |
| [Segmented Control](./api/segmented-control.md) | `segmented-control` | ✅ |
| [Color Picker](./api/color-picker.md) | `color-picker` | — |
| [Rating](./api/rating.md) | `rating` | ✅ |
| [Date Picker](./api/date-picker.md) | `date-picker` | ✅ |

### Data Display

| Component | Slug | JS |
|-----------|------|----|
| [Badge](./api/badge.md) | `badge` | — |
| [Table](./api/table.md) | `table` | — |
| [List](./api/list.md) | `list` | — |
| [Description List](./api/description-list.md) | `description-list` | — |
| [Avatar](./api/avatar.md) | `avatar` | — |
| [Stat](./api/stat.md) | `stat` | — |
| [Timeline](./api/timeline.md) | `timeline` | — |
| [Chat](./api/chat.md) | `chat` | — |
| [Carousel](./api/carousel.md) | `carousel` | ✅ |
| [Kbd](./api/kbd.md) | `kbd` | — |
| [Code Block](./api/code-block.md) | `code-block` | ✅ |
| [Diff Viewer](./api/diff-viewer.md) | `diff-viewer` | — |
| [Calendar](./api/calendar.md) | `calendar` | ✅ |
| [Browser Mockup](./api/browser-mockup.md) | `browser-mockup` | — |
| [Phone Mockup](./api/phone-mockup.md) | `phone-mockup` | — |
| [Window Mockup](./api/window-mockup.md) | `window-mockup` | — |

### Feedback

| Component | Slug | JS |
|-----------|------|----|
| [Alert](./api/alert.md) | `alert` | — |
| [Loading](./api/loading.md) | `loading` | — |
| [Skeleton](./api/skeleton.md) | `skeleton` | — |
| [Toast](./api/toast.md) | `toast` | ✅ |
| [Progress](./api/progress.md) | `progress` | — |

### Overlay

| Component | Slug | JS |
|-----------|------|----|
| [Modal](./api/modal.md) | `modal` | ✅ |
| [Dropdown](./api/dropdown.md) | `dropdown` | ✅ |
| [Tooltip](./api/tooltip.md) | `tooltip` | ✅ |
| [Drawer](./api/drawer.md) | `drawer` | ✅ |
| [Command Palette](./api/command-palette.md) | `command-palette` | ✅ |

### Navigation

| Component | Slug | JS |
|-----------|------|----|
| [Tabs](./api/tabs.md) | `tabs` | ✅ |
| [Navbar](./api/navbar.md) | `navbar` | ✅ |
| [Steps](./api/steps.md) | `steps` | — |
| [Breadcrumbs](./api/breadcrumbs.md) | `breadcrumbs` | — |
| [Pagination](./api/pagination.md) | `pagination` | — |
| [Link](./api/link.md) | `link` | — |
| [Menu](./api/menu.md) | `menu` | ✅ |

---

## Quick Start

### CSS only

Import the core styles in your project:

```css
@import "@neo-brutal-ui/core";
```

Then use any component class:

```html
<button class="nb-btn nb-btn-primary">Click me</button>
```

### With interactions

For components marked **[JS]**, import the matching interaction module:

```ts
import { createTabs } from "@neo-brutal-ui/interactions/tabs";

document.querySelectorAll<HTMLElement>("[data-nb-tabs]").forEach((el) => {
  createTabs(el);
});
```

Each API doc includes the exact markup contract and initialization example for that component.

---

## Conventions

- **Class prefix**: all public classes use the `nb-` prefix and include the component name (e.g. `nb-btn`, `nb-btn-primary`, `nb-btn-lg`).
- **Status classes**: interactive states are expressed with native HTML attributes (`disabled`, `checked`, `open`) where possible; public state classes are added only when native attributes cannot express the state.
- **RTL**: components use logical CSS properties and do not require separate RTL overrides.
- **Accessibility**: keyboard focus, `focus-visible`, color contrast, ARIA roles, and screen-reader attributes are built into both CSS and JS layers.
- **Theming**: colors are driven by CSS custom properties scoped to `[data-theme="neo-brutal"]`. See [API Tokens](../api-tokens.md) and [Dark Theme](../dark-theme.md) for details.

---

## Contributing

Before adding or promoting a component, review the [API Contract](../api-contract.md), [Support Policy](../support-policy.md), and the decision records in [../decisions/](../decisions/). The [Component Audit List](../../reports/component-audit-list.md) tracks the current status of every component.
