---
"@neo-brutal-ui/core": minor
---

Promote OTP Input, Segmented Control, and Code Block to `ready` status.

These components now pass the Ready acceptance gates:
- API docs at `docs/components/api/otp.md`, `segmented-control.md`, and `code-block.md` match the current CSS
- All documented variants, sizes, states, and color accents are implemented in core CSS
- Showcase demos initialize the matching interaction modules (`createOtp`, `createSegmentedControl`, `createCodeBlock`)
- Accessibility semantics are documented, including ARIA group/radiogroup labels and copy-button labels
- RTL layout uses logical CSS properties
- Responsive behavior verified down to 320px viewport
- Behavior tests cover the OTP, Segmented Control, and Code Block interaction modules

Also fixes the Segmented Control checked/disabled selectors to target the native radio input inside each `.nb-segmented-item` using `:has(:checked)` and `:has(:disabled)`.
