// ============================================================================
// Neo-Brutal UI Interactions — Menu
// WAI-ARIA menubar / menu pattern with full keyboard navigation.
// Supports nested submenus, horizontal and vertical layouts.
// ============================================================================

import type { MenuOptions, ComponentInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:menu';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;
const EVENT_SELECT = `${NAMESPACE}:select`;

/** Create a menu interaction instance for the given element */
export function createMenu(element: HTMLElement, options: MenuOptions = {}): ComponentInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(
      `[${NAMESPACE}] createMenu requires a valid HTMLElement. Received: ${typeof element}`
    );
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) ?? createMenu(element, options);
  }

  const {
    orientation = 'vertical',
    closeOnEscape = true,
    closeOnOutsideClick = true,
    onOpen,
    onClose,
    onToggle,
    onSelect,
  } = options;

  const isHorizontal = orientation === 'horizontal';
  const items = Array.from(
    element.querySelectorAll<HTMLElement>('.nb-menu-item, [role="menuitem"]')
  );

  if (items.length === 0) {
    console.warn(`[${NAMESPACE}] No menu items found inside the provided element.`);
  }

  const events = createEventManager();
  const state = createStateManager(false);
  let activeItemIndex = -1;
  let cleanupState: (() => void) | undefined;
  let openSubmenus = new Set<HTMLElement>();

  // --------------------------------------------------------------------------
  // Item navigation
  // --------------------------------------------------------------------------

  function getEnabledItems(): HTMLElement[] {
    return items.filter(
      (item) => !item.hasAttribute('disabled') && !item.classList.contains('nb-menu-item-disabled')
    );
  }

  function focusItem(index: number): void {
    const enabled = getEnabledItems();
    if (enabled.length === 0) return;

    const target = enabled[index];
    if (target) {
      target.focus();
      target.setAttribute('tabindex', '0');
      activeItemIndex = index;

      // Set all other items to tabindex -1
      enabled.forEach((item, i) => {
        if (i !== index) {
          item.setAttribute('tabindex', '-1');
        }
      });
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

  function focusFirst(): void {
    focusItem(0);
  }

  function focusLast(): void {
    const enabled = getEnabledItems();
    if (enabled.length === 0) return;
    focusItem(enabled.length - 1);
  }

  function selectItem(item: HTMLElement): void {
    if (item.hasAttribute('disabled') || item.classList.contains('nb-menu-item-disabled')) return;

    const allowed = dispatchNamespacedEvent(item, EVENT_SELECT, { item });
    if (!allowed) return;

    onSelect?.(item);

    // If item has a submenu, toggle it instead of closing
    const submenu = item.nextElementSibling as HTMLElement | null;
    if (submenu && submenu.classList.contains('nb-menu-submenu')) {
      toggleSubmenu(submenu);
      return;
    }

    // Close all submenus and the menu
    closeAllSubmenus();
    close();
  }

  // --------------------------------------------------------------------------
  // Submenu management
  // --------------------------------------------------------------------------

  function openSubmenu(submenu: HTMLElement): void {
    submenu.classList.add('is-open');
    submenu.setAttribute('aria-expanded', 'true');
    openSubmenus.add(submenu);
    state.set(true);
  }

  function closeSubmenu(submenu: HTMLElement): void {
    submenu.classList.remove('is-open');
    submenu.setAttribute('aria-expanded', 'false');
    openSubmenus.delete(submenu);
  }

  function closeAllSubmenus(): void {
    openSubmenus.forEach((submenu) => {
      submenu.classList.remove('is-open');
      submenu.setAttribute('aria-expanded', 'false');
    });
    openSubmenus.clear();
  }

  function toggleSubmenu(submenu: HTMLElement): void {
    if (submenu.classList.contains('is-open')) {
      closeSubmenu(submenu);
    } else {
      // Close sibling submenus
      const parent = submenu.parentElement;
      if (parent) {
        const siblings = parent.querySelectorAll<HTMLElement>('.nb-menu-submenu.is-open');
        siblings.forEach((s) => {
          if (s !== submenu) closeSubmenu(s);
        });
      }
      openSubmenu(submenu);
    }
  }

  // --------------------------------------------------------------------------
  // Open / Close
  // --------------------------------------------------------------------------

  function open(): void {
    if (state.value) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_OPEN);
    if (!allowed) return;

    state.set(true);
    dispatchNamespacedEvent(element, EVENT_TOGGLE, { isOpen: true });
    onOpen?.();
    onToggle?.(true);

    // Focus first item
    focusFirst();
  }

  function close(returnFocus = true): void {
    if (!state.value && openSubmenus.size === 0) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_CLOSE);
    if (!allowed) return;

    closeAllSubmenus();
    state.set(false);
    activeItemIndex = -1;

    dispatchNamespacedEvent(element, EVENT_TOGGLE, { isOpen: false });
    onClose?.();
    onToggle?.(false);

    if (returnFocus) {
      element.focus();
    }
  }

  function toggle(): void {
    if (state.value) close();
    else open();
  }

  // --------------------------------------------------------------------------
  // Keyboard navigation
  // --------------------------------------------------------------------------

  function handleKeydown(e: KeyboardEvent): void {
    const enabled = getEnabledItems();
    if (enabled.length === 0) return;

    const keys = {
      next: isHorizontal ? 'ArrowRight' : 'ArrowDown',
      prev: isHorizontal ? 'ArrowLeft' : 'ArrowUp',
      into: isHorizontal ? 'ArrowDown' : 'ArrowRight',
      outOf: isHorizontal ? 'ArrowUp' : 'ArrowLeft',
    };

    switch (e.key) {
      case keys.next:
        e.preventDefault();
        focusNext();
        break;
      case keys.prev:
        e.preventDefault();
        focusPrev();
        break;
      case 'Home':
        e.preventDefault();
        focusFirst();
        break;
      case 'End':
        e.preventDefault();
        focusLast();
        break;
      case keys.into: {
        // Open submenu if present
        const focused = document.activeElement as HTMLElement | null;
        if (focused) {
          const submenu = focused.nextElementSibling as HTMLElement | null;
          if (submenu && submenu.classList.contains('nb-menu-submenu')) {
            e.preventDefault();
            openSubmenu(submenu);
            // Focus first item in submenu
            const subItems = submenu.querySelectorAll<HTMLElement>('.nb-menu-item, [role="menuitem"]');
            const firstEnabled = Array.from(subItems).find(
              (item) => !item.hasAttribute('disabled') && !item.classList.contains('nb-menu-item-disabled')
            );
            firstEnabled?.focus();
          }
        }
        break;
      }
      case keys.outOf: {
        // Close current submenu and return to parent
        const focused = document.activeElement as HTMLElement | null;
        if (focused) {
          const parentSubmenu = focused.closest('.nb-menu-submenu') as HTMLElement | null;
          if (parentSubmenu) {
            e.preventDefault();
            closeSubmenu(parentSubmenu);
            const trigger = parentSubmenu.previousElementSibling as HTMLElement | null;
            trigger?.focus();
          }
        }
        break;
      }
      case 'Enter':
      case ' ': {
        const focused = document.activeElement as HTMLElement | null;
        if (focused && (focused.classList.contains('nb-menu-item') || focused.getAttribute('role') === 'menuitem')) {
          e.preventDefault();
          selectItem(focused);
        }
        break;
      }
      case 'Escape':
        if (closeOnEscape) {
          e.preventDefault();
          // Close innermost submenu first
          if (openSubmenus.size > 0) {
            const lastOpened = Array.from(openSubmenus).pop();
            if (lastOpened) {
              closeSubmenu(lastOpened);
              const trigger = lastOpened.previousElementSibling as HTMLElement | null;
              trigger?.focus();
            }
          } else {
            close();
          }
        }
        break;
      case 'Tab':
        // Close on tab out
        close();
        break;
    }
  }

  // --------------------------------------------------------------------------
  // Event wiring — items
  // --------------------------------------------------------------------------

  items.forEach((item) => {
    events.add(item, 'click', (e: MouseEvent) => {
      if (item.hasAttribute('disabled') || item.classList.contains('nb-menu-item-disabled')) {
        e.preventDefault();
        return;
      }
      selectItem(item);
    });

    events.add(item, 'keydown', (e: KeyboardEvent) => {
      // Let the global handler manage most keys
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectItem(item);
      }
    });

    // Hover to open submenu (optional, progressive enhancement)
    const submenu = item.nextElementSibling as HTMLElement | null;
    if (submenu && submenu.classList.contains('nb-menu-submenu')) {
      events.add(item, 'mouseenter', () => {
        if (state.value || isHorizontal) {
          openSubmenu(submenu);
        }
      });

      events.add(submenu, 'mouseleave', () => {
        if (isHorizontal) {
          closeSubmenu(submenu);
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // Event wiring — container keyboard
  // --------------------------------------------------------------------------

  events.add(element, 'keydown', (e: KeyboardEvent) => handleKeydown(e));

  // --------------------------------------------------------------------------
  // Event wiring — outside click
  // --------------------------------------------------------------------------

  if (closeOnOutsideClick) {
    events.add(document, 'click', (e: MouseEvent) => {
      if (!state.value && openSubmenus.size === 0) return;
      const target = e.target as Node;
      if (!element.contains(target)) {
        close(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Initialize tabindex
  // --------------------------------------------------------------------------

  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
  });

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: ComponentInstance = {
    open,
    close,
    toggle,
    destroy() {
      closeAllSubmenus();
      if (state.value) close(false);
      events.destroy();
      cleanupState?.();
      state.clear();
      initRegistry.delete(element);
    },
    get isOpen(): boolean {
      return state.value || openSubmenus.size > 0;
    },
  };

  registerInstance(element, instance);

  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  // Set orientation
  element.setAttribute('aria-orientation', orientation);

  return instance;
}
