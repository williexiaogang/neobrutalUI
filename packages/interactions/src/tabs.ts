// ============================================================================
// Neo-Brutal UI Interactions — Tabs
// WAI-ARIA compliant keyboard navigation + tab panel switching.
// ============================================================================

import type { TabsOptions, TabsInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:tabs';
const EVENT_CHANGE = `${NAMESPACE}:change`;

/**
 * Create a tabs interaction instance.
 *
 * Expected markup (simplified):
 *   <div data-nb-tabs>
 *     <div role="tablist" aria-label="...">
 *       <button role="tab" aria-selected="true"  aria-controls="panel-1" id="tab-1">Tab 1</button>
 *       <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">Tab 2</button>
 *     </div>
 *     <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">…</div>
 *     <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>…</div>
 *   </div>
 */
export function createTabs(element: HTMLElement, options: TabsOptions = {}): TabsInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createTabs requires a valid HTMLElement. Received: ${typeof element}`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) as TabsInstance ?? createTabs(element, options);
  }

  const { defaultIndex = 0, onOpen, onClose, onToggle } = options;

  const tablist = element.querySelector<HTMLElement>('[role="tablist"]');
  if (!tablist) {
    throw new Error(`[${NAMESPACE}] No [role="tablist"] found inside the provided element.`);
  }

  const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
  if (tabs.length === 0) {
    throw new Error(`[${NAMESPACE}] No [role="tab"] elements found inside the tablist.`);
  }

  const panels = tabs
    .map((tab) => {
      const panelId = tab.getAttribute('aria-controls');
      return panelId ? document.getElementById(panelId) : null;
    })
    .filter((el): el is HTMLElement => el !== null);

  if (panels.length !== tabs.length) {
    console.warn(`[${NAMESPACE}] Some tabs are missing associated [aria-controls] panels.`);
  }

  const events = createEventManager();
  const state = createStateManager(false);
  let activeIndex = -1;
  let cleanupState: (() => void) | undefined;

  // --------------------------------------------------------------------------
  // Core navigation
  // --------------------------------------------------------------------------

  function syncAttributes(index: number): void {
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const panel = panels[i];
      const isSelected = i === index;

      tab.setAttribute('aria-selected', String(isSelected));
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      tab.classList.toggle('nb-tabs__tab--active', isSelected);

      if (panel) {
        panel.hidden = !isSelected;
        panel.classList.toggle('nb-tabs__panel--active', isSelected);
      }
    }
  }

  function goTo(index: number): void {
    if (index < 0 || index >= tabs.length) return;
    if (index === activeIndex) return;

    const previousIndex = activeIndex;
    activeIndex = index;

    const allowed = dispatchNamespacedEvent(tabs[index], EVENT_CHANGE, {
      previousIndex: previousIndex >= 0 ? previousIndex : null,
      activeIndex: index,
      tab: tabs[index],
      panel: panels[index] ?? null,
    });

    if (!allowed) {
      activeIndex = previousIndex;
      return;
    }

    syncAttributes(index);
    tabs[index].focus();
    state.set(true);

    onOpen?.();
    onToggle?.(true);
  }

  function open(): void {
    if (activeIndex < 0) goTo(defaultIndex);
  }

  function close(): void {
    // Tabs are always "open" in the sense that one panel is visible.
    // We simply notify listeners but do not hide panels.
    state.set(false);
    onClose?.();
    onToggle?.(false);
  }

  function toggle(): void {
    // For tabs, toggle just re-activates the default tab if none is active.
    if (activeIndex < 0 || !state.value) open();
    else close();
  }

  // --------------------------------------------------------------------------
  // Keyboard navigation
  // --------------------------------------------------------------------------

  const isHorizontal = tablist.getAttribute('aria-orientation') !== 'vertical';

  function handleKeydown(e: KeyboardEvent, index: number): void {
    const keys = {
      next: isHorizontal ? 'ArrowRight' : 'ArrowDown',
      prev: isHorizontal ? 'ArrowLeft' : 'ArrowUp',
      first: 'Home',
      last: 'End',
    };

    let targetIndex = -1;

    if (e.key === keys.next) {
      targetIndex = (index + 1) % tabs.length;
    } else if (e.key === keys.prev) {
      targetIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === keys.first) {
      targetIndex = 0;
    } else if (e.key === keys.last) {
      targetIndex = tabs.length - 1;
    }

    if (targetIndex >= 0) {
      e.preventDefault();
      goTo(targetIndex);
    }
  }

  // --------------------------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------------------------

  tabs.forEach((tab, index) => {
    events.add(tab, 'click', () => goTo(index));
    events.add(tab, 'keydown', (e: KeyboardEvent) => handleKeydown(e, index));
  });

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: TabsInstance = {
    open,
    close,
    toggle,
    goTo,
    destroy() {
      events.destroy();
      cleanupState?.();
      state.clear();
      initRegistry.delete(element);
      // Reset attributes to initial state?  We leave them as-is to avoid
      // breaking static markup assumptions.
    },
    get isOpen(): boolean {
      return state.value;
    },
    get activeIndex(): number {
      return activeIndex;
    },
  };

  registerInstance(element, instance);
  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  // Initialize first tab
  if (tabs.length > 0) {
    const initial = Math.min(Math.max(defaultIndex, 0), tabs.length - 1);
    // Silent init — no event fired
    activeIndex = initial;
    syncAttributes(initial);
  }

  return instance;
}

