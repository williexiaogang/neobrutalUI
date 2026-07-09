---
"@neo-brutal-ui/core": minor
---

Promote Pricing Card, Feature Grid, and Field to `ready` status.

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
