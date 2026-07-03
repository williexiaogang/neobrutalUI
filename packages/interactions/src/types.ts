// ============================================================================
// Neo-Brutal UI Interactions — Core Types
// Zero-dependency, SSR-safe, tree-shakeable.
// ============================================================================

/** Base lifecycle callbacks shared by all components */
export interface BaseOptions {
  /** Called when the component opens */
  onOpen?: () => void;
  /** Called when the component closes */
  onClose?: () => void;
  /** Called whenever the component toggles, receiving the new state */
  onToggle?: (isOpen: boolean) => void;
}

/** Standard interface returned by every component factory */
export interface ComponentInstance {
  /** Programmatically open the component */
  open(): void;
  /** Programmatically close the component */
  close(): void;
  /** Toggle the open/closed state */
  toggle(): void;
  /** Tear down all listeners, observers, and references */
  destroy(): void;
  /** Read the current open state */
  get isOpen(): boolean;
}

// --------------------------------------------------------------------------
// Dialog
// --------------------------------------------------------------------------

export interface DialogOptions extends BaseOptions {
  /** Close when Escape key is pressed. Default: true */
  closeOnEscape?: boolean;
  /** Close when the backdrop/overlay is clicked. Default: true */
  closeOnBackdropClick?: boolean;
  /** Return focus to the trigger element when closing. Default: true */
  returnFocus?: boolean;
  /** Trap focus inside the dialog while open. Default: true */
  focusTrap?: boolean;
}

// --------------------------------------------------------------------------
// Tabs
// --------------------------------------------------------------------------

export interface TabsOptions extends BaseOptions {
  /** Zero-based index of the initially-active tab. Default: 0 */
  defaultIndex?: number;
}

/** Extended interface for tabs that exposes index navigation */
export interface TabsInstance extends ComponentInstance {
  /** Activate a specific tab by zero-based index */
  goTo(index: number): void;
  /** Read the currently active tab index */
  get activeIndex(): number;
}

// --------------------------------------------------------------------------
// Dropdown
// --------------------------------------------------------------------------

export interface DropdownOptions extends BaseOptions {
  /** Preferred placement relative to the trigger. Default: 'bottom' */
  placement?: 'start' | 'end' | 'top' | 'bottom';
  /** Close when Escape key is pressed. Default: true */
  closeOnEscape?: boolean;
  /** Close when clicking outside the menu. Default: true */
  closeOnOutsideClick?: boolean;
}

// --------------------------------------------------------------------------
// Tooltip
// --------------------------------------------------------------------------

export interface TooltipOptions extends BaseOptions {
  /** Preferred placement relative to the trigger. Default: 'top' */
  placement?: 'top' | 'bottom' | 'start' | 'end';
  /** Delay in ms before showing the tooltip. Default: 0 */
  delay?: number;
  /** Interaction that triggers the tooltip. Default: 'hover' */
  trigger?: 'hover' | 'focus' | 'both';
}

// --------------------------------------------------------------------------
// Drawer
// --------------------------------------------------------------------------

export interface DrawerOptions extends BaseOptions {
  /** Placement on the screen. Default: 'end' */
  placement?: 'start' | 'end' | 'top' | 'bottom';
  /** Close when Escape key is pressed. Default: true */
  closeOnEscape?: boolean;
  /** Close when the backdrop/overlay is clicked. Default: true */
  closeOnBackdropClick?: boolean;
}

// --------------------------------------------------------------------------
// Disclosure (Accordion / Collapsible details)
// --------------------------------------------------------------------------

export interface DisclosureOptions extends BaseOptions {
  /** Allow multiple panels to be open simultaneously. Default: false */
  allowMultiple?: boolean;
  /** Close other panels when one opens. Default: true */
  closeOthers?: boolean;
}
