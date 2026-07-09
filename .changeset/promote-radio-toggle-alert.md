---
"@neo-brutal-ui/core": minor
---

Promote Radio, Toggle, and Alert to `ready` status.

These components now pass the Ready acceptance gates:
- API docs at `docs/components/api/radio.md`, `docs/components/api/toggle.md`, and `docs/components/api/alert.md` match the current CSS
- All documented variants, sizes, states, and color accents are implemented
- Showcase demos cover the component surface (checked, disabled, color variants)
- Accessibility semantics are documented (radio group anatomy, switch `role="switch"`, `role="alert"`, ARIA attributes)
- RTL layout verified via logical CSS properties
- Responsive behavior verified down to 320px viewport

Additional fixes:
- Added `.nb-toggle::after` to the `prefers-reduced-motion` media query so the thumb animation is also suppressed when reduced motion is requested.
