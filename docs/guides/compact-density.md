# Compact density

Compact density is the small-screen size for every component. Default sizes stay the same.

## API

Apply it to one component or to a whole region. Both forms use the same tokens:

```html
<button class="nb-btn nb-btn-primary nb-compact" type="button">Save</button>

<section data-nb-density="compact">
  <button class="nb-btn" type="button">Cancel</button>
  <input class="nb-input" type="email" />
</section>
```

`class="nb-compact"` on a parent compacts every component inside it. `data-nb-density="compact"` does the same and can sit on `<html>`.

## Floors

These do not get smaller in compact density.

| Floor | Value | What it protects |
| --- | --- | --- |
| Fine pointer target | 24px (`--nb-target-min`) | WCAG 2.2 target size |
| Coarse pointer target | 44px (`--nb-target-touch`) | Touch target size |
| Body and control text | 14px, inputs stay 16px | Readable type. `--nb-text-base` is not reduced |
| Badge text | 12px (`--nb-text-badge-floor`) | Short labels only |
| Focus | 3px `--nb-focus` outline | Visible keyboard focus |
| Border | 2px | Neo-brutal stroke |
| Motion | Existing `prefers-reduced-motion` rules | Compact hover offset is removed when motion is reduced |

What does shrink: padding and gaps from `--nb-space-2` upward (`--nb-space-1` stays 4px), hard shadow offsets (down to 1–4px), and display sizes from `--nb-text-lg` upward.

If a visual mark must be smaller than the target (carousel dot, badge remove, checkbox, radio, toggle), a transparent `::before` extends the hit area to the floor. The painted box does not have to grow.

## Component by component

| Component | Compact behavior | Floor |
| --- | --- | --- |
| Button | Less padding, 2px shadow. Height follows `--nb-target`. Icon buttons use that box for both axes. | 24px / 44px |
| Button Group | Same button rules. Gap uses the compact space scale. | 24px / 44px |
| Card | Padding and shadow follow density tokens. Body text stays at least 14px. | Text 14px |
| Input | Padding follows density tokens. Height follows `--nb-target`. Type stays 16px. | 24px / 44px, 16px text |
| Field | Gap stays at least 4px. Hints and descriptions stay at least 14px. | Text 14px |
| Textarea | Same type as input. Min height 4.5rem. | 16px text |
| Select | Same as input. | 24px / 44px, 16px text |
| Checkbox | 20px painted box. `::before` extends the hit area. | 24px / 44px hit |
| Radio | Same as checkbox. | 24px / 44px hit |
| Toggle | Painted switch stays 44×24. `::before` extends the short side. | 24px / 44px hit |
| Badge | Label stays 12px and does not go lower. Remove button hit area is extended. | 12px text, 24px / 44px hit |
| Alert | Padding shrinks. Accent bar is 4px. Close button follows `--nb-target`. Body stays at least 14px. | 24px / 44px, text 14px |
| Divider | Stroke stays 2px. | Not a target |
| Loading | Spinner visual is 16px. It is not a control. | Decorative |
| Skeleton | Bars are 12px, circles 32px square, cards 96px, and button placeholders 32px. Image aspect ratios are preserved. | Decorative |
| Modal | Width fits the viewport minus 1rem gutters. Close button follows `--nb-target`. | 24px / 44px |
| Tabs | Tab height follows `--nb-target`. Focus outline stays 3px. | 24px / 44px |
| Dropdown | Trigger and items follow `--nb-target`. | 24px / 44px |
| Tooltip | Max width 16rem. Text stays at least 14px. | Text 14px |
| Table | Cell padding follows density tokens. Text stays at least 14px. | Text 14px |
| List | Item padding follows density tokens. Text stays at least 14px. | Text 14px |
| Description List | Padding follows density tokens. Description stays at least 14px. Ink colors unchanged. | Text 14px |
| Navbar | Toggle follows `--nb-target` on both axes. | 24px / 44px |
| Drawer | Max width `min(18rem, 100%)`. Close button follows `--nb-target`. | 24px / 44px |
| Toast | Padding follows density tokens. Close button follows `--nb-target`. Message stays at least 14px. | 24px / 44px |
| Accordion | Trigger follows `--nb-target`. | 24px / 44px |
| Collapse | Trigger follows `--nb-target`. | 24px / 44px |
| Progress | Track height 8px. Not a control. | Decorative |
| Avatar | Box 32px. Initials stay at least 14px. | Text 14px |
| Stat | Value uses the compact `--nb-text-2xl` (20px, bold). Description stays at least 14px. | Text 14px |
| Steps | Indicator is 28px (the number is not a separate control). Label text is unchanged and at least 14px. | Text 14px |
| Breadcrumbs | Each link follows `--nb-target`. | 24px / 44px |
| Pagination | Page links and prev/next follow `--nb-target`. | 24px / 44px |
| Link | Stays inline (inline-text exception). Color stays the ink token. Underline stays 2px. | Text 14px+ |
| Menu | Items follow `--nb-target`. | 24px / 44px |
| Empty State | Padding follows density tokens. Message stays at least 14px. | Text 14px |
| Form Summary | Padding follows density tokens. Title color stays the ink token. | Text 14px |
| File Input | Drop-zone padding follows density tokens. Remove button follows `--nb-target`. | 24px / 44px |
| Range | The slider box follows `--nb-target` on the block axis. | 24px / 44px |
| OTP Input | Each cell is `--nb-target` square. Digit type stays 16px. | 24px / 44px, 16px text |
| Segmented Control | Each segment follows `--nb-target`. | 24px / 44px |
| Color Picker | Swatch control follows `--nb-target` on both axes. | 24px / 44px |
| Hero | Padding uses compact `--nb-space-6`. Title uses compact `--nb-text-4xl` (28px). Description stays at least 14px. | Text 14px |
| Footer | Padding follows density tokens. | Text 14px |
| Timeline | Padding and marker gap follow density tokens. | Text 14px |
| Rating | Star box becomes `--nb-target` because the star glyph uses `::before`. | 24px / 44px |
| Chat | Bubble can use the full narrow width. Padding follows density tokens. | Text 14px |
| Carousel | Nav buttons follow `--nb-target`. Dots paint at 16px and extend their hit area. Slides min height 6rem. | 24px / 44px hit |
| Kbd | Box follows `--nb-target` and does not go below 24px. | 24px, text 14px |
| Code Block | Padding follows density tokens. Code stays 14px. Copy button is a button. | 24px / 44px button |
| Diff Viewer | Padding follows density tokens. Added/removed text colors unchanged. | Text 14px |
| Pricing Card | Max width 18rem. Padding follows density tokens. Name color stays the ink token. | Text 14px |
| Feature Grid | Icon tile is 32px. Title stays at least 16px. | Text 16px title |
| Calendar | Day cells are at least 28px, and `--nb-target` when that is larger. Nav buttons follow `--nb-target`. | 24px / 44px |
| Date Picker | The field is an input. The popup calendar uses the calendar rules. | 24px / 44px |
| Command Palette | Field and options follow `--nb-target`. Field type stays 16px. | 24px / 44px, 16px text |
| Browser Mockup | Screen min height 6rem. Padding follows density tokens. | Decorative frame |
| Phone Mockup | Frame max width 16rem. Screen min height 6rem. | Decorative frame |
| Window Mockup | Screen min height 6rem. Window controls follow `--nb-target` on both axes. | 24px / 44px |
