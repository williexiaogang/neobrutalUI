import type { ShowcaseComponent } from "@/types/component";

/**
 * Component catalog for the showcase site.
 *
 * This data must reflect the *actual* implementation status of the library.
 * As of this preview build, core visual primitives exist but no component has
 * yet reached the Ready threshold (full variants, accessibility, mobile, RTL,
 * and stable API). Complex interaction components are still planned.
 */
export const components: ShowcaseComponent[] = [
  /* ----------------------------------------------------------------------
   * In Progress — visual CSS exists but the full component contract is not
   * finished (missing full state matrices, RTL verification, API review).
   * ---------------------------------------------------------------------- */
  {
    name: "Button",
    slug: "button",
    category: "actions",
    status: "beta",
    description: "Bold actions with tactile press feedback.",
    available: true,
    featured: true,
    demo: "ButtonDemo",
    tags: ["action"],
    notes:
      "Base visual styles, variants, sizes, hover/active states, and disabled state are implemented. Loading state and full ARIA keyboard behavior are in progress.",
    knownIssues: [
      "Loading state spinner alignment needs refinement.",
      "Icon-only button accessible name pattern not documented yet.",
    ],
  },
  {
    name: "Card",
    slug: "card",
    category: "layout",
    status: "beta",
    description: "Structured surfaces with header, body, and footer areas.",
    available: true,
    featured: true,
    demo: "CardDemo",
    tags: ["surface"],
    notes:
      "Basic card structure and shadow styling are available. Interactive card behavior and media variants are in progress.",
  },
  {
    name: "Input",
    slug: "input",
    category: "forms",
    status: "beta",
    description: "Strong form fields with clear focus and validation states.",
    available: true,
    demo: "InputDemo",
    tags: ["form", "field"],
    notes:
      "Visual styling for focus, disabled, invalid, and size variants are implemented. Prefix/suffix containers and autofill normalization are in progress.",
    knownIssues: [
      "Browser autofill styling still needs refinement.",
      "Prefix/suffix text alignment not finalized.",
    ],
  },
  {
    name: "Field",
    slug: "field",
    category: "forms",
    status: "beta",
    description: "Form field wrapper with label, description, error, and required states.",
    available: true,
    demo: "FieldDemo",
    tags: ["form", "field"],
    notes: "CSS visual layer implemented. Includes group, inline, row, and required variants.",
    knownIssues: [],
    css: "packages/core/src/components/field.css",
  },
  {
    name: "Textarea",
    slug: "textarea",
    category: "forms",
    status: "beta",
    description: "Multi-line text fields with resizable behavior.",
    available: true,
    demo: "TextareaDemo",
    tags: ["form", "field"],
    notes: "Base styling is implemented. Character counter and size variants are in progress.",
  },
  {
    name: "Select",
    slug: "select",
    category: "forms",
    status: "beta",
    description: "Native-styled single-select controls.",
    available: true,
    demo: "SelectDemo",
    tags: ["form", "field"],
    notes:
      "Visual styling and custom arrow indicator are implemented. RTL arrow placement and forced-colors review are in progress.",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "forms",
    status: "beta",
    description: "Binary selectors with clear checked and disabled states.",
    available: true,
    demo: "CheckboxDemo",
    tags: ["form", "selector"],
    notes:
      "Base checked and disabled visuals are implemented. Indeterminate state and label association examples are in progress.",
  },
  {
    name: "Radio",
    slug: "radio",
    category: "forms",
    status: "beta",
    description: "Single-choice selectors within a group.",
    available: true,
    demo: "RadioDemo",
    tags: ["form", "selector"],
    notes:
      "Visual styling for checked and disabled states is implemented. Radio group documentation is in progress.",
  },
  {
    name: "Toggle",
    slug: "toggle",
    category: "forms",
    status: "beta",
    description: "Switch controls with animated thumb feedback.",
    available: true,
    demo: "ToggleDemo",
    tags: ["form", "selector"],
    notes:
      "Base switch styling and animation are implemented. Reduced-motion handling and RTL positioning are in progress.",
  },
  {
    name: "Badge",
    slug: "badge",
    category: "data-display",
    status: "beta",
    description: "Compact status labels and counts.",
    available: true,
    demo: "BadgeDemo",
    tags: ["label"],
    notes:
      "Base badge shapes, semantic colors, and outline variant are implemented. Removable tag behavior is in progress.",
  },
  {
    name: "Alert",
    slug: "alert",
    category: "feedback",
    status: "beta",
    description: "Contextual messages with accent borders.",
    available: true,
    demo: "AlertDemo",
    tags: ["message"],
    notes:
      "Visual styling for info, success, warning, and error accents is implemented. Dismissible behavior is in progress.",
  },
  {
    name: "Divider",
    slug: "divider",
    category: "layout",
    status: "beta",
    description: "Horizontal and vertical section separators.",
    available: true,
    demo: "DividerDemo",
    tags: ["separator"],
    notes: "Horizontal divider with text is implemented. Vertical orientation is in progress.",
  },
  {
    name: "Loading",
    slug: "loading",
    category: "feedback",
    status: "beta",
    description: "Geometric loading indicators.",
    available: true,
    demo: "LoadingDemo",
    tags: ["spinner"],
    notes:
      "Base spinner animation and reduced-motion fallback are implemented. Size variants and screen-reader strategy are in progress.",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    category: "feedback",
    status: "beta",
    description: "Placeholder shapes for loading content.",
    available: true,
    demo: "SkeletonDemo",
    tags: ["placeholder"],
    notes:
      "Base pulse animation and reduced-motion fallback are implemented. Avatar and card skeleton patterns are in progress.",
  },
  {
    name: "Modal",
    slug: "modal",
    category: "overlay",
    status: "beta",
    description: "Dialog overlays with focus trapping and keyboard dismissal.",
    available: true,
    demo: "ModalDemo",
    tags: ["dialog"],
    notes:
      "CSS implementation is complete: backdrop, dialog, header/body/footer, size variants (xs/sm/md/lg/xl/full), color variants (primary/danger/warning/success), mobile sheet variant, open/close animations, reduced-motion, and forced-colors support. JS interactions are optional.",
    knownIssues: [
      "JS focus trap for div fallback is planned.",
    ],
  },


  /* ----------------------------------------------------------------------
   * Planned — on the roadmap but no usable implementation yet.
   * ---------------------------------------------------------------------- */
  {
    name: "Tabs",
    slug: "tabs",
    category: "navigation",
    status: "beta",
    description: "Horizontal and vertical tab panels with keyboard navigation.",
    available: true,
    demo: "TabsDemo",
    tags: ["navigation"],
    notes: "CSS visual layer implemented. JS tab switching is optional.",
  },
  {
    name: "Dropdown",
    slug: "dropdown",
    category: "overlay",
    status: "beta",
    description: "Trigger-controlled menu panels with item groups and dividers.",
    available: true,
    demo: "DropdownDemo",
    tags: ["menu"],
    notes: "CSS visual layer and JS interaction are implemented.",
  },

  {
    name: "Tooltip",
    slug: "tooltip",
    category: "overlay",
    status: "beta",
    description: "Hover and focus triggered helper text.",
    available: true,
    demo: "TooltipDemo",
    tags: ["hint"],
    notes: "CSS visual layer and JS interaction are implemented.",
  },
  {
    name: "Table",
    slug: "table",
    category: "data-display",
    status: "beta",
    description: "Structured data with header, zebra striping, and compact modes.",
    available: true,
    demo: "TableDemo",
    tags: ["data"],
    notes: "Base styling, zebra, hover, and compact variants are implemented.",
  },
  {
    name: "Navbar",
    slug: "navbar",
    category: "navigation",
    status: "beta",
    description: "Top navigation with brand, links, and mobile collapse.",
    available: true,
    demo: "NavbarDemo",
    tags: ["navigation"],
    notes: "Visual structure and responsive mobile layout are implemented. Collapse behavior requires optional JS.",
  },
  {
    name: "Drawer",
    slug: "drawer",
    category: "overlay",
    status: "planned",
    description: "Slide-in side panel for navigation or forms.",
    available: false,
    tags: ["panel"],
  },
  {
    name: "Toast",
    slug: "toast",
    category: "feedback",
    status: "planned",
    description: "Temporary feedback messages for application events.",
    available: false,
    tags: ["message"],
  },
  {
    name: "Accordion",
    slug: "accordion",
    category: "layout",
    status: "planned",
    description: "Collapsible content sections with keyboard support.",
    available: false,
    tags: ["disclosure"],
  },
  {
    name: "Progress",
    slug: "progress",
    category: "feedback",
    status: "planned",
    description: "Linear progress indicators for loading workflows.",
    available: false,
    tags: ["meter"],
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "data-display",
    status: "planned",
    description: "User or entity thumbnails with fallback initials.",
    available: false,
    tags: ["media"],
  },
  {
    name: "Stat",
    slug: "stat",
    category: "data-display",
    status: "planned",
    description: "Metric display with label, value, and trend.",
    available: false,
    tags: ["metric"],
  },
  {
    name: "Steps",
    slug: "steps",
    category: "navigation",
    status: "planned",
    description: "Multi-step process indicators.",
    available: false,
    tags: ["wizard"],
  },
  {
    name: "Breadcrumbs",
    slug: "breadcrumbs",
    category: "navigation",
    status: "planned",
    description: "Hierarchical page path navigation.",
    available: false,
    tags: ["navigation"],
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "navigation",
    status: "planned",
    description: "Page number controls for large data sets.",
    available: false,
    tags: ["navigation"],
  },
  {
    name: "Hero",
    slug: "hero",
    category: "layout",
    status: "planned",
    description: "Large marketing hero block with call-to-action.",
    available: false,
    tags: ["marketing"],
  },
  {
    name: "Timeline",
    slug: "timeline",
    category: "data-display",
    status: "planned",
    description: "Chronological event list with markers.",
    available: false,
    tags: ["chronology"],
  },
  {
    name: "Rating",
    slug: "rating",
    category: "forms",
    status: "planned",
    description: "Star or icon-based value selection.",
    available: false,
    tags: ["input"],
  },
  {
    name: "Chat",
    slug: "chat",
    category: "data-display",
    status: "planned",
    description: "Message bubble layout for conversation UIs.",
    available: false,
    tags: ["messaging"],
  },
  {
    name: "Kbd",
    slug: "kbd",
    category: "data-display",
    status: "planned",
    description: "Keyboard key representations.",
    available: false,
    tags: ["shortcut"],
  },
];

export const categories: Record<
  ShowcaseComponent["category"],
  string
> = {
  actions: "Actions",
  forms: "Forms",
  "data-display": "Data Display",
  feedback: "Feedback",
  navigation: "Navigation",
  overlay: "Overlay",
  layout: "Layout",
};

export function getStatusCounts() {
  return components.reduce(
    (acc, component) => {
      acc[component.status] = (acc[component.status] ?? 0) + 1;
      return acc;
    },
    {
      ready: 0,
      beta: 0,
      "in-progress": 0,
      planned: 0,
      experimental: 0,
    } as Record<ShowcaseComponent["status"], number>
  );
}

export function getAvailableComponents() {
  return components.filter((c) => c.available);
}

export function getRoadmapPreview(limitPlanned = 4) {
  const availableNow = components.filter(
    (c) => c.status === "ready" || c.status === "beta"
  );
  const buildingNext = components.filter((c) => c.status === "in-progress");
  const planned = components.filter((c) => c.status === "planned");

  return {
    availableNow,
    buildingNext,
    plannedPreview: planned.slice(0, limitPlanned),
    plannedTotal: planned.length,
  };
}
