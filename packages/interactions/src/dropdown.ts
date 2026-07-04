// ============================================================================
// Neo-Brutal UI Interactions — Dropdown
// Keyboard-navigable, accessible trigger-controlled menu panel.
// ============================================================================

import type { DropdownOptions, ComponentInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:dropdown';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;

/** Create a dropdown interaction instance for the given element */
export function createDropdown(element: HTMLElement, options: DropdownOptions = {}): ComponentInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(
      `[${NAMESPACE}] createDropdown requires a valid HTMLElement. Received: ${typeof element}`
    );
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) ?? createDropdown(element, options);
  }

  const {
    placement = 'bottom',
    closeOnEscape = true,
    closeOnOutsideClick = true,
    onOpen,
    onClose,
    onToggle,
  } = options;

  const triggerElement = element.querySelector<HTMLElement>('.nb-dropdown-trigger');
  const panelElement = element.querySelector<HTMLElement>('.nb-dropdown-panel');

  if (!triggerElement) {
    throw new Error(`[${NAMESPACE}] No .nb-dropdown-trigger found inside the provided element.`);
  }
  if (!panelElement) {
    throw new Error(`[${NAMESPACE}] No .nb-dropdown-panel found inside the provided element.`);
  }

  const trigger = triggerElement;
  const panel = panelElement;
  const items = Array.from(panel.querySelectorAll<HTMLElement>('.nb-dropdown-item'));
  const events = createEventManager();
  const state = createStateManager(false);
  let activeItemIndex = -1;
  let cleanupState: (() => void) | undefined;

  // --------------------------------------------------------------------------
  // Placement
  // --------------------------------------------------------------------------

  function applyPlacement(): void {
    panel.classList.remove('nb-dropdown-start', 'nb-dropdown-end', 'nb-dropdown-top', 'nb-dropdown-bottom');
    panel.classList.add(`nb-dropdown-${placement}`);
  }

  // --------------------------------------------------------------------------
  // Item navigation
  // --------------------------------------------------------------------------

  function getEnabledItems(): HTMLElement[] {
    return items.filter(
      (item) => !item.hasAttribute('disabled') && !item.classList.contains('nb-dropdown-item-disabled')
    );
  }

  function focusItem(index: number): void {
    const enabled = getEnabledItems();
    if (enabled.length === 0) return;

    const target = enabled[index];
    if (target) {
      target.focus();
      activeItemIndex = index;
    }
  }

  function focusNext(): void {
    const enabled = getEnabledItems();
    if (enabled.length === 0) return;
    const next = (activeItemIndex + 1) % enabled.length;
    focusItem(next);
  }

  function focusPrev(): void {
    const enabled = getEnabledItems();
    if (enabled.length === 0) return;
    const prev = (activeItemIndex - 1 + enabled.length) % enabled.length;
    focusItem(prev);
  }

  function selectItem(item: HTMLElement): void {
    if (item.hasAttribute('disabled') || item.classList.contains('nb-dropdown-item-disabled')) return;
    item.click();
  }

  // --------------------------------------------------------------------------
  // Open / Close
  // --------------------------------------------------------------------------

  function open(): void {
    if (state.value) return;

    const allowed = dispatchNamespacedEvent(trigger, EVENT_OPEN);
    if (!allowed) return;

    trigger.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
    state.set(true);

    activeItemIndex = -1;
    dispatchNamespacedEvent(trigger, EVENT_TOGGLE, { isOpen: true });
    onOpen?.();
    onToggle?.(true);
  }

  function close(returnFocus = true): void {
    if (!state.value) return;

    const allowed = dispatchNamespacedEvent(trigger, EVENT_CLOSE);
    if (!allowed) return;

    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    state.set(false);

    activeItemIndex = -1;
    dispatchNamespacedEvent(trigger, EVENT_TOGGLE, { isOpen: false });
    onClose?.();
    onToggle?.(false);

    if (returnFocus) {
      trigger.focus();
    }
  }

  function toggle(): void {
    if (state.value) close();
    else open();
  }

  // --------------------------------------------------------------------------
  // Event wiring — trigger
  // --------------------------------------------------------------------------

  events.add(trigger, 'click', () => toggle());

  events.add(trigger, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!state.value) open();
    }
  });

  // --------------------------------------------------------------------------
  // Event wiring — panel items
  // --------------------------------------------------------------------------

  items.forEach((item) => {
    events.add(item, 'click', (e: MouseEvent) => {
      if (item.hasAttribute('disabled') || item.classList.contains('nb-dropdown-item-disabled')) {
        e.preventDefault();
        return;
      }
      // Let the click propagate for consumer handlers, then close
      close();
    });
  });

  // --------------------------------------------------------------------------
  // Event wiring — keyboard navigation inside panel
  // --------------------------------------------------------------------------

  events.add(panel, 'keydown', (e: KeyboardEvent) => {
    if (!state.value) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusPrev();
        break;
      case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        focusItem(getEnabledItems().length - 1);
        break;
      case 'Enter':
      case ' ': {
        const focused = document.activeElement as HTMLElement | null;
        if (focused && focused.classList.contains('nb-dropdown-item')) {
          e.preventDefault();
          selectItem(focused);
        }
        break;
      }
      case 'Escape':
        if (closeOnEscape) {
          e.preventDefault();
          close();
        }
        break;
      case 'Tab':
        // Close on tab out to match native select behavior
        close();
        break;
    }
  });

  // --------------------------------------------------------------------------
  // Event wiring — outside click
  // --------------------------------------------------------------------------

  if (closeOnOutsideClick) {
    events.add(document, 'click', (e: MouseEvent) => {
      if (!state.value) return;
      const target = e.target as Node;
      if (!element.contains(target)) {
        close(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Event wiring — global escape
  // --------------------------------------------------------------------------

  if (closeOnEscape) {
    events.add(document, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.value) {
        e.preventDefault();
        close();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: ComponentInstance = {
    open,
    close,
    toggle,
    destroy() {
      if (state.value) close(false);
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
  applyPlacement();

  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  // Ensure initial aria-expanded matches state
  trigger.setAttribute('aria-expanded', 'false');

  return instance;
}
