// ============================================================================
// Neo-Brutal UI Interactions — Tooltip
// Hover/focus triggered helper text with delay, placement, and touch guard.
// ============================================================================

import type { TooltipOptions, ComponentInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:tooltip';
const EVENT_SHOW = `${NAMESPACE}:show`;
const EVENT_HIDE = `${NAMESPACE}:hide`;

const PLACEMENT_CLASSES = ['nb-tooltip-top', 'nb-tooltip-bottom', 'nb-tooltip-start', 'nb-tooltip-end'];

/** Detect touch-primary devices to suppress hover tooltips */
function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

/** Create a tooltip interaction instance */
export function createTooltip(element: HTMLElement, options: TooltipOptions = {}): ComponentInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createTooltip requires a valid HTMLElement. Received: ${typeof element}`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) ?? createTooltip(element, options);
  }

  const {
    placement = 'top',
    delay = 0,
    trigger = 'hover',
    onOpen,
    onClose,
    onToggle,
  } = options;

  const contentElement = element.querySelector<HTMLElement>('.nb-tooltip-content');
  if (!contentElement) {
    throw new Error(`[${NAMESPACE}] No .nb-tooltip-content found inside the provided element.`);
  }

  const content = contentElement;
  const events = createEventManager();
  const state = createStateManager(false);
  let showTimer: ReturnType<typeof setTimeout> | null = null;
  let cleanupState: (() => void) | undefined;

  // Apply placement class
  function applyPlacement(): void {
    PLACEMENT_CLASSES.forEach((cls) => element.classList.remove(cls));
    element.classList.add(`nb-tooltip-${placement}`);
  }

  // Show
  function show(): void {
    if (state.value) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_SHOW);
    if (!allowed) return;

    content.classList.add('is-visible');
    state.set(true);

    dispatchNamespacedEvent(element, `${NAMESPACE}:toggle`, { isVisible: true });
    onOpen?.();
    onToggle?.(true);
  }

  // Hide
  function hide(): void {
    if (!state.value) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_HIDE);
    if (!allowed) return;

    content.classList.remove('is-visible');
    state.set(false);

    dispatchNamespacedEvent(element, `${NAMESPACE}:toggle`, { isVisible: false });
    onClose?.();
    onToggle?.(false);
  }

  // Toggle
  function toggle(): void {
    if (state.value) hide();
    else show();
  }

  // Delayed show
  function scheduleShow(): void {
    if (showTimer) clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      showTimer = null;
      show();
    }, delay);
  }

  // Cancel delayed show
  function cancelShow(): void {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
  }

  // --------------------------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------------------------

  const hoverTriggers = trigger === 'hover' || trigger === 'both';
  const focusTriggers = trigger === 'focus' || trigger === 'both';

  // Hover
  if (hoverTriggers) {
    events.add(element, 'mouseenter', () => {
      if (isTouchDevice()) return;
      scheduleShow();
    });

    events.add(element, 'mouseleave', () => {
      if (isTouchDevice()) return;
      cancelShow();
      hide();
    });
  }

  // Focus
  if (focusTriggers) {
    events.add(element, 'focusin', () => {
      scheduleShow();
    });

    events.add(element, 'focusout', () => {
      cancelShow();
      hide();
    });
  }

  // Touch: long-press to show (optional)
  if (isTouchDevice()) {
    let touchTimer: ReturnType<typeof setTimeout> | null = null;

    events.add(element, 'touchstart', () => {
      touchTimer = setTimeout(() => {
        touchTimer = null;
        show();
      }, 500);
    });

    events.add(element, 'touchend', () => {
      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
      hide();
    });

    events.add(element, 'touchcancel', () => {
      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
      hide();
    });
  }

  // Keyboard: Escape to hide
  events.add(element, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && state.value) {
      hide();
    }
  });

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  applyPlacement();

  const instance: ComponentInstance = {
    open() {
      cancelShow();
      show();
    },
    close() {
      cancelShow();
      hide();
    },
    toggle,
    get isOpen(): boolean {
      return state.value;
    },
    destroy() {
      cancelShow();
      hide();
      events.destroy();
      cleanupState?.();
      state.clear();
      PLACEMENT_CLASSES.forEach((cls) => element.classList.remove(cls));
      initRegistry.delete(element);
    },
    get isVisible(): boolean {
      return state.value;
    },
  };

  registerInstance(element, instance);
  cleanupState = state.subscribe((isVisible) => {
    element.setAttribute('data-nb-state', isVisible ? 'visible' : 'hidden');
  });

  return instance;
}
