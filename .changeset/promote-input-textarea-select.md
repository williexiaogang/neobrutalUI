---
"@neo-brutal-ui/core": minor
---

Promote **Input**, **Textarea**, and **Select** to `ready` status.

These components now pass the Ready acceptance gates:
- API docs at `docs/components/api/input.md`, `docs/components/api/textarea.md`, and `docs/components/api/select.md` match the current CSS
- All documented variants, sizes, states, and shared `field.css` behavior are implemented
- Showcase demos cover sizes, states, prefix/suffix alignment, and character-counter structure
- Accessibility semantics (labels, `aria-invalid`, `aria-describedby`, `aria-live`) are documented
- RTL layout verified via logical CSS properties and the `[dir="rtl"]` select arrow override
- Responsive behavior verified down to 320px viewport

CSS updates in `packages/core/src/components/field.css` normalize browser autofill styling for `.nb-input`, `.nb-textarea`, and `.nb-select` so the default yellow autofill fill does not clash with the theme.
