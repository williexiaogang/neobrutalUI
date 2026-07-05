// ============================================================================
// Neo-Brutal UI Interactions — Collapse
// WAI-ARIA compliant single disclosure panel.
// ============================================================================

import type { DisclosureOptions, ComponentInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:collapse';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;

export interface CollapseInstance extends ComponentInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

/**
 * Create a collapse interaction instance.
 *
 * Expected markup (simplified):
 *   <div class="nb-collapse" data-nb-collapse>
 *     <button data-nb-collapse-trigger aria-expanded="false" aria-controls="collapse-panel-1" id="collapse-trigger-1">
 *       Section title
 *     </button>
 *     <div data-nb-collapse-panel id="collapse-panel-1" role="region" aria-labelledby="collapse-trigger-1">
 *       <div class="nb-collapse-panel-inner"><div class="nb-collapse-content">…</div></div>
 *     </div>
 *   </div>
 */
export function createCollapse(element: HTMLElement, options: DisclosureOptions = {}): CollapseInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createCollapse requires a valid HTMLElement.`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return (getInstance(element) as unknown as CollapseInstance) ?? createCollapse(element, options);
  }

  const {
    onOpen,
    onClose,
    onToggle,
  } = options;

  const trigger = element.querySelector<HTMLElement>('[data-nb-collapse-trigger]');
  const panel = element.querySelector<HTMLElement>('[data-nb-collapse-panel]');

  if (!trigger) {
    throw new Error(`[${NAMESPACE}] No [data-nb-collapse-trigger] found inside the provided element.`);
  }

  const triggerEl = trigger as HTMLElement;

  const events = createEventManager();
  const state = createStateManager(false);
  let cleanupState: (() => void) | undefined;

  function syncAttributes(isOpen: boolean): void {
    element.classList.toggle('is-open', isOpen);
    triggerEl.setAttribute('aria-expanded', String(isOpen));
    if (panel) {
      panel.classList.toggle('is-open', isOpen);
      panel.setAttribute('aria-hidden', String(!isOpen));
    }
  }

  function open(): void {
    if (state.value) return;

    const allowed = dispatchNamespacedEvent(triggerEl, EVENT_OPEN, {});
    if (!allowed) return;

    state.set(true);
    syncAttributes(true);

    dispatchNamespacedEvent(triggerEl, EVENT_TOGGLE, { isOpen: true });
    onOpen?.();
    onToggle?.(true);
  }

  function close(): void {
    if (!state.value) return;

    const allowed = dispatchNamespacedEvent(triggerEl, EVENT_CLOSE, {});
    if (!allowed) return;

    state.set(false);
    syncAttributes(false);

    dispatchNamespacedEvent(triggerEl, EVENT_TOGGLE, { isOpen: false });
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

  function handleTriggerKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }

  events.add(triggerEl, 'click', toggle);
  events.add(triggerEl, 'keydown', handleTriggerKeydown);

  const instance: CollapseInstance = {
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
  const isExpanded = triggerEl.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    state.set(true);
    syncAttributes(true);
  } else {
    syncAttributes(false);
  }

  return instance;
}
