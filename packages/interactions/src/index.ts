// ============================================================================
// Neo-Brutal UI Interactions — Public Entry Point
// Zero-dependency, SSR-safe, tree-shakeable ESM exports.
// ============================================================================

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export type {
  ComponentInstance,
  BaseOptions,
  OtpOptions,
  OtpInstance,
  SegmentedControlOptions,
  SegmentedControlInstance,
  CodeBlockOptions,
  CodeBlockInstance,
  DialogOptions,
  TabsOptions,
  TabsInstance,
  CarouselOptions,
  CarouselInstance,
  DropdownOptions,
  TooltipOptions,
  DrawerOptions,
  DisclosureOptions,
  MenuOptions,
  AccordionInstance,
  RatingOptions,
  RatingInstance,
  DatePickerOptions,
  DatePickerInstance,
  CommandPaletteOptions,
  CommandPaletteInstance,
} from './types.js';

// --------------------------------------------------------------------------
// Factory primitives
// --------------------------------------------------------------------------

export {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  getFocusableElements,
  saveActiveElement,
  restoreActiveElement,
  dispatchNamespacedEvent,
} from './factory.js';

// --------------------------------------------------------------------------
// Implemented components
// --------------------------------------------------------------------------

export { createDialog } from './dialog.js';
export { createTabs } from './tabs.js';
export { createCarousel } from './carousel.js';
export { createTooltip } from './tooltip.js';

// --------------------------------------------------------------------------
// Animation helpers
// --------------------------------------------------------------------------

export { reveal, countUp, stagger } from './animations.js';
export type { RevealOptions, CountUpOptions, StaggerOptions } from './animations.js';

export { createToastManager } from './toast.js';
export type { ToastOptions } from './toast.js';

import { createCollapse, type CollapseInstance } from './collapse.js';
import type { DisclosureOptions } from './types.js';
export { createCollapse };
export type { CollapseInstance };

// --------------------------------------------------------------------------
// Placeholders (now implemented)
// --------------------------------------------------------------------------

export { createDropdown } from './dropdown.js';

export { createDrawer } from './drawer.js';

export { createRating } from './rating.js';

export { createOtp } from './otp.js';

export { createSegmentedControl } from './segmented-control.js';

export { createCodeBlock } from './code-block.js';

export { createDatePicker } from './date-picker.js';

export { createCommandPalette } from './command-palette.js';

export function createDisclosure(element: HTMLElement, options: DisclosureOptions = {}): CollapseInstance {
  return createCollapse(element, options);
}
