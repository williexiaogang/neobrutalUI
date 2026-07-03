import type { ComponentStatus } from "@/types/component";

export const statusOrder: ComponentStatus[] = [
  "ready",
  "beta",
  "in-progress",
  "planned",
  "experimental",
];

export const statusLabels: Record<ComponentStatus, string> = {
  ready: "Ready",
  beta: "Beta",
  "in-progress": "In Progress",
  planned: "Planned",
  experimental: "Experimental",
};

export const statusDescriptions: Record<ComponentStatus, string> = {
  ready:
    "Main visuals, variants, basic accessibility, and mobile support are complete.",
  beta:
    "Core functionality is available but may still have known issues or API tweaks.",
  "in-progress":
    "Partial implementation exists. Visuals or interaction are still being finalized.",
  planned:
    "On the roadmap with no usable implementation yet.",
  experimental:
    "Exploratory work. API and visuals may change significantly.",
};
