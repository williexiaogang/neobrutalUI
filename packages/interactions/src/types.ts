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
  /** Read visible state for components whose public language is visibility */
  readonly isVisible?: boolean;
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
  /** Return focus to the trigger element when closing. Default: true */
  returnFocus?: boolean;
  /** Trap focus inside the drawer while open. Default: true */
  focusTrap?: boolean;
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

// --------------------------------------------------------------------------
// Menu
// --------------------------------------------------------------------------

export interface MenuOptions extends BaseOptions {
  /** Orientation of the menu. Default: 'vertical' */
  orientation?: 'horizontal' | 'vertical';
  /** Close when Escape key is pressed. Default: true */
  closeOnEscape?: boolean;
  /** Close when clicking outside the menu. Default: true */
  closeOnOutsideClick?: boolean;
  /** Called when a menu item is selected */
  onSelect?: (item: HTMLElement) => void;
}

// --------------------------------------------------------------------------
// Accordion
// --------------------------------------------------------------------------

/** Extended interface for accordion that exposes panel navigation */
export interface AccordionInstance extends ComponentInstance {
  /** Open a specific panel by zero-based index */
  openPanel(index: number): void;
  /** Close a specific panel by zero-based index */
  closePanel(index: number): void;
  /** Toggle a specific panel by zero-based index */
  togglePanel(index: number): void;
  /** Read the currently open panel indices */
  get activeIndices(): number[];
}

// --------------------------------------------------------------------------
// Rating
// --------------------------------------------------------------------------

export interface RatingOptions {
  /** Maximum rating value. Default: 5 */
  max?: number;
  /** Initial value. Default: 0 */
  value?: number;
  /** Prevent user interaction. Default: false */
  readOnly?: boolean;
  /** Allow half-step values. Default: false */
  allowHalf?: boolean;
  /** Called when the rating value changes */
  onChange?: (value: number) => void;
  /** Called when a star is hovered */
  onHover?: (value: number) => void;
  /** Called when the mouse leaves the rating area */
  onLeave?: () => void;
}

export interface RatingInstance extends ComponentInstance {
  /** Read the current rating value */
  readonly value: number;
  /** Set the rating value programmatically */
  setValue(value: number): void;
  /** Clear the rating (set to 0) */
  clear(): void;
}
// --------------------------------------------------------------------------

export interface CarouselOptions {
  /** Zero-based index of the initially-active slide. Default: 0 */
  defaultIndex?: number;
  /** Enable auto-play in ms. Default: 0 (disabled) */
  autoPlay?: number;
  /** Pause auto-play on hover. Default: true */
  pauseOnHover?: boolean;
  /** Pause auto-play on focus. Default: true */
  pauseOnFocus?: boolean;
  /** Enable infinite loop. Default: false */
  loop?: boolean;
  /** Called when the active slide changes */
  onChange?: (index: number, previousIndex: number) => void;
  /** Called when auto-play starts */
  onPlay?: () => void;
  /** Called when auto-play pauses */
  onPause?: () => void;
}

export interface CarouselInstance extends ComponentInstance {
  /** Navigate to a specific slide by zero-based index */
  goTo(index: number): void;
  /** Advance to the next slide */
  next(): void;
  /** Go back to the previous slide */
  prev(): void;
  /** Start auto-play (if configured) */
  play(): void;
  /** Pause auto-play */
  pause(): void;
  /** Read the currently active slide index */
  get activeIndex(): number;
  /** Read whether auto-play is currently running */
  get isPlaying(): boolean;
  /** Read the total number of slides */
  get slideCount(): number;
}

