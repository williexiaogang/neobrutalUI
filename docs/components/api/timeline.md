# Timeline API

> **Component**: Timeline  
> **Category**: Data Display  
> **Base class**: `.nb-timeline`  
> **Status**: Ready (vertical, horizontal, alternate, opposite, dashed connector, marker colors, sizes, RTL logical layout, forced-colors support, and reduced-motion/disabled N/A guidance included)

---

## Class Names

| Class Name | Category | Description |
|------------|----------|-------------|
| `.nb-timeline` | Component | Base timeline container. Required. |
| `.nb-timeline-item` | Part | Individual timeline event. |
| `.nb-timeline-marker` | Part | Marker dot before each event. |
| `.nb-timeline-marker-primary` | Color | Marker color set to `--nb-primary`. |
| `.nb-timeline-marker-secondary` | Color | Marker color set to `--nb-secondary`. |
| `.nb-timeline-marker-accent` | Color | Marker color set to `--nb-accent`. |
| `.nb-timeline-marker-info` | Color | Marker color set to `--nb-info`. |
| `.nb-timeline-marker-success` | Color | Marker color set to `--nb-success`. |
| `.nb-timeline-marker-warning` | Color | Marker color set to `--nb-warning`. |
| `.nb-timeline-marker-error` | Color | Marker color set to `--nb-error`. |
| `.nb-timeline-marker-neutral` | Color | Marker color set to `--nb-neutral`. |
| `.nb-timeline-marker-icon` | Variant | Larger icon-sized marker. |
| `.nb-timeline-connector` | Part | Vertical/horizontal connector line. |
| `.nb-timeline-content` | Part | Content area for an event. |
| `.nb-timeline-card` | Part | Bordered card wrapper for content. |
| `.nb-timeline-time` | Part | Timestamp / date label. |
| `.nb-timeline-title` | Part | Event title. |
| `.nb-timeline-body` | Part | Event body text. |
| `.nb-timeline-alternate` | Layout | Zig-zag alternating layout. |
| `.nb-timeline-horizontal` | Layout | Horizontal step layout. |
| `.nb-timeline-opposite` | Layout | Two-column vertical layout with opposite content. |
| `.nb-timeline-sm` | Size | Smaller marker, card, title, and body. |
| `.nb-timeline-lg` | Size | Larger marker, card, title, and body. |
| `.nb-timeline-dashed` | Variant | Dashed connector line. |

### Class Combination Examples

```html
<!-- Vertical timeline with colored markers -->
<div class="nb-timeline">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-primary"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Project Kickoff</div>
      <div class="nb-timeline-time">Jan 15, 2026</div>
      <div class="nb-timeline-body">Initial planning and scope.</div>
    </div>
  </div>
</div>

<!-- Horizontal timeline -->
<div class="nb-timeline nb-timeline-horizontal">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-secondary"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Research</div>
      <div class="nb-timeline-time">Week 1</div>
    </div>
  </div>
</div>

<!-- Dashed alternate timeline -->
<div class="nb-timeline nb-timeline-dashed nb-timeline-alternate">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-info"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Discovery</div>
      <div class="nb-timeline-body">Interviews and audits.</div>
    </div>
  </div>
</div>
```

---

## DOM Contract

### Recommended Structure

```html
<div class="nb-timeline">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-primary"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-card">
        <div class="nb-timeline-time">Jan 15, 2026</div>
        <div class="nb-timeline-title">Project Kickoff</div>
        <div class="nb-timeline-body">Initial planning, stakeholder alignment, and scope definition.</div>
      </div>
    </div>
  </div>
</div>
```

### Semantic Element

- **Preferred**: `<div>` with ARIA. Use `<ol class="nb-timeline">` and `<li class="nb-timeline-item">` if the order is meaningful.
- For `<ol>`, remove default list styling is handled by CSS.

### Required Attributes

| Attribute | Required? | Value | Notes |
|-----------|-----------|-------|-------|
| — | — | — | No component-specific required attributes. |

### Recommended ARIA

| Attribute | When to Use |
|-----------|-------------|
| `role="list"` | If a non-list element is used as the timeline container. |
| `role="listitem"` | If a non-`<li>` element is used as an item. |
| `aria-label` | On the timeline container to describe the event sequence. |

### Keyboard Behavior

| Key | Behavior |
|-----|----------|
| Standard list/document navigation | Timelines are static content. |

---

## State Matrix

| State | Support | CSS Selector / Class | Visual Effect |
|-------|---------|---------------------|---------------|
| **hover** | ❌ Not styled | — | No hover styles. |
| **focus-visible** | ✅ | `.nb-timeline-item:focus-visible`, `.nb-timeline-card:focus-visible` | `outline: 2px solid var(--nb-focus); outline-offset: 2px;` |
| **disabled** | ❌ Not applicable | — | Timelines are not interactive. |
| **active** | ❌ Not applicable | — | No active state. |
| **current** | ❌ Not styled | — | No current-event styles. |
| **selected** | ❌ Not applicable | — | No selected state. |
| **read-only** | ❌ Not applicable | — | Timelines are inherently read-only. |

---

## CSS Implementation Notes

### Layout / Shadow / Motion

`.nb-timeline` is a flex column. Each item aligns a marker and content with a gap. A connector pseudo-element runs behind the markers. The horizontal variant flips the flex direction and repositions the connector. The alternate variant uses a centered connector with zig-zag content. The opposite variant uses a three-column grid.

### Reduced Motion

No transitions or animations; reduced-motion is not applicable.

### RTL

Uses logical properties throughout. The dashed horizontal connector flips direction for `[dir="rtl"]` so the repeating gradient runs left-to-right visually.

---

## Examples

### Vertical Timeline

```html
<div class="nb-timeline">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-primary"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Project Kickoff</div>
      <div class="nb-timeline-time">Jan 15, 2026</div>
      <div class="nb-timeline-body">Initial planning and scope.</div>
    </div>
  </div>
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-success"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Design Complete</div>
      <div class="nb-timeline-time">Feb 03, 2026</div>
      <div class="nb-timeline-body">Wireframes approved.</div>
    </div>
  </div>
</div>
```

### Horizontal Timeline

```html
<div class="nb-timeline nb-timeline-horizontal">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-secondary"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Research</div>
      <div class="nb-timeline-time">Week 1</div>
    </div>
  </div>
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-secondary"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Prototype</div>
      <div class="nb-timeline-time">Week 2</div>
    </div>
  </div>
</div>
```

### Dashed Alternate Timeline

```html
<div class="nb-timeline nb-timeline-dashed nb-timeline-alternate">
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-info"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Discovery</div>
      <div class="nb-timeline-body">Interviews and audits.</div>
    </div>
  </div>
  <div class="nb-timeline-item">
    <div class="nb-timeline-marker nb-timeline-marker-info"></div>
    <div class="nb-timeline-content">
      <div class="nb-timeline-title">Ideation</div>
      <div class="nb-timeline-body">Workshops and sketches.</div>
    </div>
  </div>
</div>
```

### Icon-Sized Marker

```html
<div class="nb-timeline-item">
  <div class="nb-timeline-marker nb-timeline-marker-icon nb-timeline-marker-success">✓</div>
  <div class="nb-timeline-content">...</div>
</div>
```
