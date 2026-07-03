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
  DialogOptions,
  TabsOptions,
  TabsInstance,
  DropdownOptions,
  TooltipOptions,
  DrawerOptions,
  DisclosureOptions,
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

export { createTooltip } from './tooltip.js';

// --------------------------------------------------------------------------
// Placeholders (not yet implemented)
// --------------------------------------------------------------------------

export { createDropdown } from './dropdown.js';

export function createDrawer(): never {
  throw new Error('[@neo-brutal-ui/interactions] createDrawer is not yet implemented.');
}

export function createDisclosure(): never {
  throw new Error('[@neo-brutal-ui/interactions] createDisclosure is not yet implemented.');
}
