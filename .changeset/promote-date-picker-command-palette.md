---
"@neo-brutal-ui/core": minor
---

Promote Date Picker and Command Palette to `ready` status.

These components now pass the Ready acceptance gates:
- API docs at `docs/components/api/date-picker.md` and `command-palette.md` reflect the current CSS
- All documented variants, sizes, states, and color accents are implemented in core CSS
- Showcase demos initialize the matching interaction modules (`createDatePicker`, `createCommandPalette`)
- Accessibility semantics are documented, including ARIA roles for combobox/dialog and listbox/option
- RTL layout uses logical CSS properties
- Responsive behavior verified down to 320px viewport
- Behavior tests cover the Date Picker and Command Palette interaction modules
