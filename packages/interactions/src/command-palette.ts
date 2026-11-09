// ============================================================================
// Neo-Brutal UI Interactions — Command Palette
// Keyboard-driven command palette with filtering and selection.
// ============================================================================

import type { CommandPaletteOptions, CommandPaletteInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:command-palette';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;
const EVENT_SELECT = `${NAMESPACE}:select`;

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

function defaultFilter(query: string, item: HTMLElement): boolean {
  const text = (item.textContent ?? '').toLowerCase();
  return text.includes(query.toLowerCase());
}

/**
 * Create a command palette interaction instance.
 *
 * Expected markup (simplified):
 *   <div class="nb-command-palette-backdrop" data-nb-command-palette>
 *     <div class="nb-command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
 *       <div class="nb-command-palette-input">
 *         <input type="text" class="nb-command-palette-input-field" placeholder="Type a command or search..." />
 *       </div>
 *       <ul class="nb-command-palette-list" role="listbox">
 *         <li class="nb-command-palette-group" role="presentation">Preferences</li>
 *         <li class="nb-command-palette-item" role="option" aria-selected="false" data-value="toggle-dark">Toggle Dark Mode</li>
 *         …
 *       </ul>
 *       <div class="nb-command-palette-empty" hidden>No results found</div>
 *       <div class="nb-command-palette-footer">…</div>
 *     </div>
 *   </div>
 */
export function createCommandPalette(
  element: HTMLElement,
  options: CommandPaletteOptions = {}
): CommandPaletteInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(
      `[${NAMESPACE}] createCommandPalette requires a valid HTMLElement. Received: ${typeof element}`
    );
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) as CommandPaletteInstance ?? createCommandPalette(element, options);
  }

  const { hotkey = true, filter = defaultFilter, onOpen, onClose, onToggle, onSelect } = options;

  const dialog = element.querySelector<HTMLElement>('.nb-command-palette');
  const input = element.querySelector<HTMLInputElement>('.nb-command-palette-input-field')!;
  const list = element.querySelector<HTMLElement>('.nb-command-palette-list')!;
  const empty = element.querySelector<HTMLElement>('.nb-command-palette-empty');

  if (!input) {
    throw new Error(`[${NAMESPACE}] No .nb-command-palette-input-field found inside the provided element.`);
  }
  if (!list) {
    throw new Error(`[${NAMESPACE}] No .nb-command-palette-list found inside the provided element.`);
  }

  const items = Array.from(list.querySelectorAll<HTMLElement>('.nb-command-palette-item'));

  const events = createEventManager();
  const state = createStateManager(false);
  let cleanupState: (() => void) | undefined;
  let activeIndex = -1;

  // --------------------------------------------------------------------------
  // Visibility helpers
  // --------------------------------------------------------------------------

  function getVisibleItems(): HTMLElement[] {
    return items.filter((item) => !item.hidden);
  }

  function updateEmptyState(): void {
    if (!empty) return;
    empty.hidden = getVisibleItems().length > 0;
  }

  function updateGroups(): void {
    const children = Array.from(list.children) as HTMLElement[];
    let currentGroup: HTMLElement | null = null;
    let groupHasVisible = false;

    for (const child of children) {
      if (child.classList.contains('nb-command-palette-group')) {
        if (currentGroup) {
          currentGroup.hidden = !groupHasVisible;
        }
        currentGroup = child;
        groupHasVisible = false;
      } else if (child.classList.contains('nb-command-palette-item') && !child.hidden) {
        groupHasVisible = true;
      }
    }

    if (currentGroup) {
      currentGroup.hidden = !groupHasVisible;
    }
  }

  function applyFilter(): void {
    const query = input.value;
    for (const item of items) {
      item.hidden = !filter(query, item);
    }
    updateGroups();
    updateEmptyState();
  }

  // --------------------------------------------------------------------------
  // Active item
  // --------------------------------------------------------------------------

  function setActiveItem(index: number): void {
    const visible = getVisibleItems();
    if (visible.length === 0) {
      activeIndex = -1;
      return;
    }

    activeIndex = Math.max(0, Math.min(index, visible.length - 1));

    for (const item of visible) {
      item.classList.remove('nb-command-palette-item-active');
      item.setAttribute('aria-selected', 'false');
    }

    const active = visible[activeIndex];
    if (active) {
      active.classList.add('nb-command-palette-item-active');
      active.setAttribute('aria-selected', 'true');
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  function selectItem(item: HTMLElement): void {
    const value = item.getAttribute('data-value') ?? '';

    const allowed = dispatchNamespacedEvent(element, EVENT_SELECT, { value, item });
    if (!allowed) return;

    onSelect?.(value, item);
    close();
  }

  function select(value: string): void {
    const match = items.find((item) => item.getAttribute('data-value') === value);
    if (match) {
      selectItem(match);
    }
  }

  // --------------------------------------------------------------------------
  // Open / Close
  // --------------------------------------------------------------------------

  function open(): void {
    if (state.value) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_OPEN);
    if (!allowed) return;

    element.classList.add('is-open');
    state.set(true);

    if (isBrowser) {
      input.focus();
    }

    activeIndex = -1;
    setActiveItem(0);

    dispatchNamespacedEvent(element, EVENT_TOGGLE, { isOpen: true });
    onOpen?.();
    onToggle?.(true);
  }

  function close(): void {
    if (!state.value) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_CLOSE);
    if (!allowed) return;

    element.classList.remove('is-open');
    state.set(false);
    input.value = '';
    applyFilter();
    activeIndex = -1;

    for (const item of items) {
      item.classList.remove('nb-command-palette-item-active');
      item.setAttribute('aria-selected', 'false');
    }

    dispatchNamespacedEvent(element, EVENT_TOGGLE, { isOpen: false });
    onClose?.();
    onToggle?.(false);
  }

  function toggle(): void {
    if (state.value) close();
    else open();
  }

  // --------------------------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------------------------

  events.add(input, 'input', () => {
    applyFilter();
    setActiveItem(0);
  });

  events.add(input, 'keydown', (e: KeyboardEvent) => {
    if (!state.value) return;

    const visible = getVisibleItems();
    if (visible.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveItem(activeIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveItem(activeIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        setActiveItem(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveItem(visible.length - 1);
        break;
      case 'Enter': {
        const active = visible[activeIndex];
        if (active) {
          e.preventDefault();
          selectItem(active);
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        close();
        break;
    }
  });

  items.forEach((item) => {
    events.add(item, 'click', () => selectItem(item));
  });

  events.add(element, 'click', (e: MouseEvent) => {
    const target = e.target as Node;
    if (target instanceof Node && dialog && !dialog.contains(target)) {
      close();
    }
  });

  events.add(document, 'keydown', (e: KeyboardEvent) => {
    if (!hotkey) return;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open();
    }
  });

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: CommandPaletteInstance = {
    open,
    close,
    toggle,
    select,
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

  // Initialize item roles
  items.forEach((item, index) => {
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', 'false');
    if (!item.hasAttribute('id')) {
      item.setAttribute('id', `${NAMESPACE}-item-${index}`);
    }
  });

  if (empty) {
    empty.hidden = true;
  }

  return instance;
}
