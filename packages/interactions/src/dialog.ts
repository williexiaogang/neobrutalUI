// ============================================================================
// Neo-Brutal UI Interactions — Dialog
// Uses the native <dialog> element API when available; falls back to ARIA.
// ============================================================================

import type { DialogOptions, ComponentInstance } from './types.js';
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

const NAMESPACE = 'nb:dialog';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;

/** Create a dialog interaction instance for a native <dialog> or fallback dialog element */
export function createDialog(element: HTMLElement, options: DialogOptions = {}): ComponentInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(
      `[${NAMESPACE}] createDialog requires a valid HTMLElement. Received: ${typeof element}`
    );
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) ?? createDialog(element, options);
  }

  const {
    closeOnEscape = true,
    closeOnBackdropClick = true,
    returnFocus = true,
    focusTrap = true,
    onOpen,
    onClose,
    onToggle,
  } = options;

  const events = createEventManager();
  const state = createStateManager(false);
  const isNativeDialog =
    typeof HTMLDialogElement !== 'undefined' && element instanceof HTMLDialogElement;
  let lastFocusedElement: Element | null = null;
  let cleanupState: (() => void) | undefined;

  // --------------------------------------------------------------------------
  // Focus trap
  // --------------------------------------------------------------------------

  function trapFocus(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || !focusTrap) return;

    const focusables = getFocusableElements(element);
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

    const allowed = dispatchNamespacedEvent(element, EVENT_OPEN);
    if (!allowed) return;

    lastFocusedElement = saveActiveElement();

    if (isNativeDialog && element.showModal) {
      element.showModal();
    } else {
      element.setAttribute('open', '');
      element.setAttribute('aria-modal', 'true');
      element.setAttribute('role', 'dialog');
    }

    state.set(true);
    element.classList.add('is-open');
    element.setAttribute('aria-hidden', 'false');
    element.classList.add('nb-dialog--open');

    // Move focus to first focusable element inside dialog
    if (focusTrap) {
      const focusables = getFocusableElements(element);
      const autofocus = element.querySelector<HTMLElement>('[data-nb-autofocus]');
      (autofocus || focusables[0] || element).focus();
    }

    dispatchNamespacedEvent(element, EVENT_TOGGLE, { isOpen: true });
    onOpen?.();
    onToggle?.(true);
  }

  // --------------------------------------------------------------------------
  // Close
  // --------------------------------------------------------------------------

  function close(): void {
    if (!state.value) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_CLOSE);
    if (!allowed) return;

    if (isNativeDialog && element.close) {
      element.close();
    } else {
      element.removeAttribute('open');
      element.removeAttribute('aria-modal');
    }

    state.set(false);
    element.classList.remove('is-open');
    element.setAttribute('aria-hidden', 'true');
    element.classList.remove('nb-dialog--open');

    if (returnFocus) {
      restoreActiveElement(lastFocusedElement);
    }
    lastFocusedElement = null;

    dispatchNamespacedEvent(element, EVENT_TOGGLE, { isOpen: false });
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
    events.add(element, 'click', (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const isBackdropClick =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

      if (isBackdropClick) {
        e.preventDefault();
        close();
      }
    });
  }

  // Focus trap on Tab key
  if (focusTrap) {
    events.add(element, 'keydown', trapFocus);
  }

  // Listen for native dialog close event (e.g. form[method="dialog"] submit)
  events.add(element, 'close', () => {
    if (state.value) close();
  });

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
