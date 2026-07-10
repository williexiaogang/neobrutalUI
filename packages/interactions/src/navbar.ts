// ============================================================================
// Neo-Brutal UI Interactions — Navbar
// Mobile collapse toggle for the navbar component.
// ============================================================================

import type { BaseOptions, ComponentInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
  getFocusableElements,
} from './factory.js';

const NAMESPACE = 'nb:navbar';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;

export interface NavbarOptions extends BaseOptions {
  /** Close the collapse menu when Escape is pressed. Default: true */
  closeOnEscape?: boolean;
  /** Move focus to the first nav link when opening. Default: true */
  focusOnOpen?: boolean;
  /** Return focus to the toggle button when closing. Default: true */
  returnFocus?: boolean;
}

/** Extended interface for navbar that exposes the collapse state */
export interface NavbarInstance extends ComponentInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

/**
 * Create a navbar collapse interaction instance.
 *
 * Expected markup (simplified):
 *   <nav class="nb-navbar" data-nb-navbar aria-label="Main navigation">
 *     <a href="#" class="nb-navbar-brand">Brand</a>
 *     <div class="nb-navbar-collapse" id="navbar-collapse">
 *       <ul class="nb-navbar-nav">…</ul>
 *       <div class="nb-navbar-actions">…</div>
 *     </div>
 *     <button class="nb-navbar-toggle" type="button" aria-expanded="false" aria-controls="navbar-collapse">
 *       <span aria-hidden="true">☰</span>
 *     </button>
 *   </nav>
 */
export function createNavbar(element: HTMLElement, options: NavbarOptions = {}): NavbarInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createNavbar requires a valid HTMLElement.`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return (getInstance(element) as unknown as NavbarInstance) ?? createNavbar(element, options);
  }

  const { onOpen, onClose, onToggle, closeOnEscape = true, focusOnOpen = true, returnFocus = true } = options;

  const toggleEl =
    element.querySelector<HTMLElement>('[data-nb-navbar-toggle]') ??
    element.querySelector<HTMLElement>('.nb-navbar-toggle');

  const collapseEl =
    element.querySelector<HTMLElement>('[data-nb-navbar-collapse]') ??
    element.querySelector<HTMLElement>('.nb-navbar-collapse');

  if (!toggleEl) {
    throw new Error(`[${NAMESPACE}] No .nb-navbar-toggle or [data-nb-navbar-toggle] found inside the provided element.`);
  }

  const toggleButton: HTMLElement = toggleEl;

  const events = createEventManager();
  const state = createStateManager(false);
  let cleanupState: (() => void) | undefined;
  let lastFocusedElement: Element | null = null;

  function syncAttributes(isOpen: boolean): void {
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    if (collapseEl) {
      collapseEl.classList.toggle('is-open', isOpen);
    }
  }

  function focusFirstNavLink(): void {
    if (!collapseEl || !focusOnOpen) return;
    const focusables = getFocusableElements(collapseEl);
    if (focusables.length > 0) {
      focusables[0].focus();
    }
  }

  function open(): void {
    if (state.value) return;

    const allowed = dispatchNamespacedEvent(toggleButton, EVENT_OPEN, {});
    if (!allowed) return;

    if (returnFocus) {
      lastFocusedElement = document.activeElement;
    }

    state.set(true);
    syncAttributes(true);
    focusFirstNavLink();

    dispatchNamespacedEvent(toggleButton, EVENT_TOGGLE, { isOpen: true });
    onOpen?.();
    onToggle?.(true);
  }

  function close(): void {
    if (!state.value) return;

    const allowed = dispatchNamespacedEvent(toggleButton, EVENT_CLOSE, {});
    if (!allowed) return;

    state.set(false);
    syncAttributes(false);

    if (returnFocus && lastFocusedElement === toggleButton) {
      toggleButton.focus();
    }

    dispatchNamespacedEvent(toggleButton, EVENT_TOGGLE, { isOpen: false });
    onClose?.();
    onToggle?.(false);
  }

  function toggle(): void {
    if (state.value) {
      close();
    } else {
      open();
    }
  }

  function handleToggleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }

  function handleDocumentKeydown(e: KeyboardEvent): void {
    if (closeOnEscape && e.key === 'Escape' && state.value) {
      e.preventDefault();
      close();
    }
  }

  events.add(toggleButton, 'click', toggle);
  events.add(toggleButton, 'keydown', handleToggleKeydown);
  events.add(document, 'keydown', handleDocumentKeydown);

  const instance: NavbarInstance = {
    open,
    close,
    toggle,
    destroy() {
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

  // Initialize from markup
  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    state.set(true);
    syncAttributes(true);
  } else {
    syncAttributes(false);
  }

  return instance;
}
