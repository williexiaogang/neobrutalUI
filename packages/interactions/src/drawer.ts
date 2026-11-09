// ============================================================================
// Neo-Brutal UI Interactions — Drawer
// Slide-in side panel with backdrop, focus trap, and keyboard dismissal.
// ============================================================================

import type { DrawerOptions, ComponentInstance } from './types.js';
import {
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

const NAMESPACE = 'nb:drawer';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;

/** Create a drawer interaction instance for the given element */
export function createDrawer(element: HTMLElement, options: DrawerOptions = {}): ComponentInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(
      `[${NAMESPACE}] createDrawer requires a valid HTMLElement. Received: ${typeof element}`
    );
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) ?? createDrawer(element, options);
  }

  const {
    placement = 'end',
    closeOnEscape = true,
    closeOnBackdropClick = true,
    returnFocus = true,
    focusTrap = true,
    onOpen,
    onClose,
    onToggle,
  } = options;

  // --------------------------------------------------------------------------
  // Resolve drawer and backdrop elements
  // --------------------------------------------------------------------------

  let drawer: HTMLElement;
  let backdrop: HTMLElement;

  if (element.classList.contains('nb-drawer-backdrop')) {
    backdrop = element;
    const found = element.querySelector<HTMLElement>('.nb-drawer');
    if (!found) {
      throw new Error(`[${NAMESPACE}] No .nb-drawer found inside the provided backdrop element.`);
    }
    drawer = found;
  } else if (element.classList.contains('nb-drawer')) {
    drawer = element;
    const sibling = drawer.previousElementSibling;
    if (sibling?.classList.contains('nb-drawer-backdrop')) {
      backdrop = sibling as HTMLElement;
    } else if (drawer.parentElement?.classList.contains('nb-drawer-backdrop')) {
      backdrop = drawer.parentElement;
    } else {
      throw new Error(
        `[${NAMESPACE}] No .nb-drawer-backdrop found as sibling or parent of the provided drawer element.`
      );
    }
  } else {
    throw new Error(
      `[${NAMESPACE}] Element must have class .nb-drawer-backdrop or .nb-drawer. Received: ${element.className}`
    );
  }

  // Apply placement class
  drawer.classList.remove('nb-drawer-start', 'nb-drawer-end', 'nb-drawer-top', 'nb-drawer-bottom');
  drawer.classList.add(`nb-drawer-${placement}`);

  // --------------------------------------------------------------------------
  // State & events
  // --------------------------------------------------------------------------

  const events = createEventManager();
  const state = createStateManager(false);
  let lastFocusedElement: Element | null = null;
  let cleanupState: (() => void) | undefined;

  // --------------------------------------------------------------------------
  // Focus trap
  // --------------------------------------------------------------------------

  function trapFocus(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || !focusTrap) return;

    const focusables = getFocusableElements(drawer);
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // --------------------------------------------------------------------------
  // Open
  // --------------------------------------------------------------------------

  function open(): void {
    if (state.value) return;

    const allowed = dispatchNamespacedEvent(drawer, EVENT_OPEN);
    if (!allowed) return;

    lastFocusedElement = saveActiveElement();

    state.set(true);
    backdrop.classList.add('is-open');
    drawer.removeAttribute('aria-expanded');

    // Move focus to first focusable element inside drawer
    if (focusTrap) {
      const focusables = getFocusableElements(drawer);
      const autofocus = drawer.querySelector<HTMLElement>('[data-nb-autofocus]');
      (autofocus || focusables[0] || drawer).focus();
    }

    dispatchNamespacedEvent(drawer, EVENT_TOGGLE, { isOpen: true });
    onOpen?.();
    onToggle?.(true);
  }

  // --------------------------------------------------------------------------
  // Close
  // --------------------------------------------------------------------------

  function close(): void {
    if (!state.value) return;

    const allowed = dispatchNamespacedEvent(drawer, EVENT_CLOSE);
    if (!allowed) return;

    state.set(false);
    backdrop.classList.remove('is-open');
    drawer.removeAttribute('aria-expanded');

    if (returnFocus) {
      restoreActiveElement(lastFocusedElement);
    }
    lastFocusedElement = null;

    dispatchNamespacedEvent(drawer, EVENT_TOGGLE, { isOpen: false });
    onClose?.();
    onToggle?.(false);
  }

  // --------------------------------------------------------------------------
  // Toggle
  // --------------------------------------------------------------------------

  function toggle(): void {
    if (state.value) close();
    else open();
  }

  // --------------------------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------------------------

  // Escape key
  if (closeOnEscape) {
    events.add(document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.value) {
        e.preventDefault();
        close();
      }
    });
  }

  // Backdrop click
  if (closeOnBackdropClick) {
    events.add(backdrop, 'click', (e: MouseEvent) => {
      // Only close when clicking directly on the backdrop, not the drawer
      if (e.target === backdrop) {
        e.preventDefault();
        close();
      }
    });
  }

  // Focus trap on Tab key
  if (focusTrap) {
    events.add(drawer, 'keydown', trapFocus);
  }

  // --------------------------------------------------------------------------
  // Initial attributes
  // --------------------------------------------------------------------------

  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.removeAttribute('aria-expanded');

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: ComponentInstance = {
    open,
    close,
    toggle,
    destroy() {
      if (state.value) close();
      events.destroy();
      cleanupState?.();
      state.clear();
      initRegistry.delete(element);
    },
    get isOpen(): boolean {
      return state.value;
    },
  };

  registerInstance(element, instance);
  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  return instance;
}
