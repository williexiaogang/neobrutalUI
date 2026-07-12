# API Tokens

## Component Token Design

### Three-Layer Token Architecture

Neo-Brutal UI uses a three-layer token architecture:

1. **Primitive Layer** — Low-level values:
   - Colors: `--nb-color-yellow-400`, `--nb-color-pink-400`, etc.
   - Spacing: `--nb-space-1`, `--nb-space-2`, etc.
   - Shadows: `--nb-shadow-xs`, `--nb-shadow-sm`, etc.
   - Motion: `--nb-duration-fast`, `--nb-ease-out`, etc.

2. **Semantic Layer** — Meaningful abstractions:
   - Surface: `--nb-base-100`, `--nb-base-200`, `--nb-base-300`
   - Content: `--nb-base-content`, `--nb-base-content-muted`
   - Intent: `--nb-primary`, `--nb-secondary`, `--nb-accent`, `--nb-info`, `--nb-success`, `--nb-warning`, `--nb-error`
   - Structural: `--nb-border`, `--nb-focus`, `--nb-overlay`

3. **Component Layer** — Per-component public overrides:
   - Format: `--nb-{component}-{property}`
   - Purpose: Allow consumers to customize a specific component without overriding CSS rules
   - Examples: `--nb-btn-shadow`, `--nb-card-padding`, `--nb-modal-max-width`

### Public vs Internal Tokens

| Token Prefix | Scope | Overridable | Where Defined |
|-------------|-------|-------------|---------------|
| `--nb-*` | Public | ✅ Yes | `packages/core/src/tokens/*.css` |
| `--nb-{component}-*` | Public | ✅ Yes | `packages/core/src/tokens/component.css` |
| `--_*` | Internal | ❌ No | Component CSS files |

**Rule:** Component CSS files (`components/*.css`) should only define `--_*` private variables. They may reference `--nb-*` public tokens via `var()`, but must never define new `--nb-*` tokens.

### How to Override

Override component tokens in your own CSS after loading the theme:

```css
[data-theme="neo-brutal"] {
  /* Make all buttons use thicker borders */
  --nb-btn-border-width: 4px;

  /* Increase card padding */
  --nb-card-padding: var(--nb-space-6);

  /* Make modals wider */
  --nb-modal-max-width: 32rem;

  /* Change alert accent width */
  --nb-alert-accent-width: 8px;
}
```

### Token Reference

#### Button
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-btn-border-width` | `var(--nb-border-width)` | Border thickness |
| `--nb-btn-shadow` | `var(--nb-shadow-md)` | Default shadow |
| `--nb-btn-shadow-hover` | `var(--nb-shadow-lg)` | Hover shadow |
| `--nb-btn-shadow-active` | `var(--nb-shadow-xs)` | Active/pressed shadow |

#### Card
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-card-shadow` | `var(--nb-shadow-md)` | Card shadow |
| `--nb-card-padding` | `var(--nb-space-4)` | Header, body, footer padding |

#### Field
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-field-gap` | `var(--nb-space-1)` | Gap between label, input, description |

#### Input
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-input-border-color` | `var(--nb-border)` | Default border color |
| `--nb-input-shadow` | `var(--nb-shadow-sm)` | Default shadow |
| `--nb-input-shadow-focus` | `var(--nb-shadow-md)` | Focus shadow |

#### Badge
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-badge-border-radius` | `9999px` | Pill radius |

#### Alert
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-alert-accent-width` | `6px` | Left accent border width |

#### Modal
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-modal-max-width` | `28rem` | Default max inline size |
| `--nb-modal-shadow` | `var(--nb-shadow-xl)` | Dialog shadow |
| `--nb-modal-backdrop-opacity` | `0.6` | Backdrop opacity |

#### Loading
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-loading-size` | `1.5rem` | Spinner diameter |
| `--nb-loading-border-width` | `3px` | Spinner border thickness |

#### Divider
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-divider-thickness` | `2px` | Line thickness |

#### Dropdown
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-dropdown-panel-min-width` | `12rem` | Panel minimum width |
| `--nb-dropdown-shadow` | `var(--nb-shadow-md)` | Panel shadow |

#### Tooltip
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-tooltip-max-width` | `20rem` | Content max width |
| `--nb-tooltip-bg` | `var(--nb-neutral)` | Background color |
| `--nb-tooltip-fg` | `var(--nb-neutral-content)` | Text color |

#### Link
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-link-underline-width` | `2px` | Underline thickness |
| `--nb-link-hover-bg` | `var(--nb-accent)` | Hover background |

#### Navbar
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-navbar-shadow` | `var(--nb-shadow-sm)` | Bar shadow |

#### Tabs
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-tab-active-border-color` | `var(--nb-primary)` | Active tab indicator |
| `--nb-tab-padding` | `var(--nb-space-2) var(--nb-space-4)` | Tab padding |

#### Table
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-table-shadow` | `var(--nb-shadow-sm)` | Table shadow |
| `--nb-table-header-bg` | `var(--nb-base-200)` | Header row background |

#### Skeleton
| Token | Default | Description |
|-------|---------|-------------|
| `--nb-skeleton-bg` | `var(--nb-base-200)` | Base placeholder color |
| `--nb-skeleton-shimmer` | `var(--nb-base-300)` | Shimmer highlight color |
