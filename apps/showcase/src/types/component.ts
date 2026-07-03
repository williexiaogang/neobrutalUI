export type ComponentStatus =
  | "ready"
  | "beta"
  | "in-progress"
  | "planned"
  | "experimental";

export type ComponentCategory =
  | "actions"
  | "forms"
  | "data-display"
  | "feedback"
  | "navigation"
  | "overlay"
  | "layout";

export interface ShowcaseComponent {
  name: string;
  slug: string;
  category: ComponentCategory;
  status: ComponentStatus;
  description: string;
  available: boolean;
  featured?: boolean;
  demo?: string;
  notes?: string;
  knownIssues?: string[];
  tags?: string[];
}
