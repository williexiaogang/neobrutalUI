// ============================================================================
// Neo-Brutal UI Interactions — Date Picker
// Accessible, keyboard-friendly date picker with single and range selection.
// ============================================================================

import type { DatePickerOptions, DatePickerInstance } from './types.js';
import {
  createEventManager,
  createStateManager,
  initRegistry,
  isInitialized,
  registerInstance,
  getInstance,
  getFocusableElements,
  dispatchNamespacedEvent,
} from './factory.js';

const NAMESPACE = 'nb:date-picker';
const EVENT_OPEN = `${NAMESPACE}:open`;
const EVENT_CLOSE = `${NAMESPACE}:close`;
const EVENT_TOGGLE = `${NAMESPACE}:toggle`;
const EVENT_SELECT = `${NAMESPACE}:select`;
const EVENT_RANGE = `${NAMESPACE}:range`;
const EVENT_MONTH_CHANGE = `${NAMESPACE}:month-change`;

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Parse a date value into a local Date object.
 * ISO strings (`YYYY-MM-DD`) are parsed as local midnight to avoid timezone drift.
 */
function parseDateValue(value: Date | string | undefined): Date | undefined {
  if (value === undefined || value === null) return undefined;
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function formatDateDefault(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(target: Date, start: Date, end: Date): boolean {
  const t = target.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return t > Math.min(s, e) && t < Math.max(s, e);
}

/**
 * Create a date picker interaction instance.
 *
 * Expected markup (simplified):
 *   <div class="nb-date-picker" data-nb-date-picker>
 *     <div class="nb-date-picker-input">
 *       <input type="text" placeholder="Select a date" readonly />
 *       <button type="button" aria-label="Open calendar">📅</button>
 *     </div>
 *     <div class="nb-date-picker-panel">
 *       <div class="nb-calendar">
 *         <div class="nb-calendar-header">
 *           <button class="nb-calendar-nav-btn" aria-label="Previous month">‹</button>
 *           <span class="nb-calendar-month-label">June 2025</span>
 *           <button class="nb-calendar-nav-btn" aria-label="Next month">›</button>
 *         </div>
 *         <div class="nb-calendar-grid">
 *           <div class="nb-calendar-day" data-date="2025-06-01">1</div>
 *           …
 *         </div>
 *       </div>
 *       <div class="nb-date-picker-footer">
 *         <button type="button" data-action="today">Today</button>
 *         <button type="button" data-action="clear">Clear</button>
 *       </div>
 *     </div>
 *   </div>
 */
export function createDatePicker(element: HTMLElement, options: DatePickerOptions = {}): DatePickerInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createDatePicker requires a valid HTMLElement. Received: ${typeof element}`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return getInstance(element) as DatePickerInstance ?? createDatePicker(element, options);
  }

  const {
    mode = 'single',
    formatDate = formatDateDefault,
    defaultDate,
    minDate,
    maxDate,
    onOpen,
    onClose,
    onToggle,
    onSelect,
    onRange,
  } = options;

  const input = element.querySelector<HTMLInputElement>('.nb-date-picker-input input')!;
  const trigger = element.querySelector<HTMLElement>('.nb-date-picker-input button');
  const panel = element.querySelector<HTMLElement>('.nb-date-picker-panel')!;
  const calendar = element.querySelector<HTMLElement>('.nb-calendar')!;
  const monthLabel = calendar.querySelector<HTMLElement>('.nb-calendar-month-label');
  const navButtons = Array.from(calendar.querySelectorAll<HTMLElement>('.nb-calendar-nav-btn'));
  const grid = calendar.querySelector<HTMLElement>('.nb-calendar-grid');
  const footerButtons = Array.from(panel.querySelectorAll<HTMLElement>('.nb-date-picker-footer-btn'));

  if (!input) {
    throw new Error(`[${NAMESPACE}] No input found inside .nb-date-picker-input.`);
  }
  if (!panel) {
    throw new Error(`[${NAMESPACE}] No .nb-date-picker-panel found inside the provided element.`);
  }
  if (!calendar) {
    throw new Error(`[${NAMESPACE}] No .nb-calendar found inside the provided element.`);
  }

  const min = parseDateValue(minDate);
  const max = parseDateValue(maxDate);

  const events = createEventManager();
  const state = createStateManager(false);
  let cleanupState: (() => void) | undefined;

  let selectedDate: Date | undefined;
  let rangeStart: Date | undefined;
  let rangeEnd: Date | undefined;

  // --------------------------------------------------------------------------
  // Calendar view helpers
  // --------------------------------------------------------------------------

  function getViewDate(): Date {
    const year = calendar.getAttribute('data-year');
    const month = calendar.getAttribute('data-month');
    if (year && month) {
      return new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    }
    return new Date();
  }

  function setViewDate(date: Date): void {
    calendar.setAttribute('data-year', String(date.getFullYear()));
    calendar.setAttribute('data-month', String(date.getMonth() + 1));
    if (monthLabel) {
      monthLabel.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }

  function isDateDisabled(date: Date): boolean {
    if (min && date.getTime() < min.getTime()) return true;
    if (max && date.getTime() > max.getTime()) return true;
    return false;
  }

  // --------------------------------------------------------------------------
  // Selection & UI sync
  // --------------------------------------------------------------------------

  function updateInput(): void {
    if (mode === 'range') {
      if (rangeStart && rangeEnd) {
        input.value = `${formatDate(rangeStart)} - ${formatDate(rangeEnd)}`;
      } else if (rangeStart) {
        input.value = formatDate(rangeStart);
      } else {
        input.value = '';
      }
    } else {
      input.value = selectedDate ? formatDate(selectedDate) : '';
    }
  }

  function syncDayStates(): void {
    if (!grid) return;
    const days = Array.from(grid.querySelectorAll<HTMLElement>('.nb-calendar-day'));
    for (const day of days) {
      const dateValue = day.getAttribute('data-date');
      if (!dateValue) continue;
      const date = parseDateValue(dateValue);
      if (!date) continue;

      day.classList.remove(
        'nb-calendar-day--selected',
        'nb-calendar-day--range-start',
        'nb-calendar-day--range-end',
        'nb-calendar-day--in-range'
      );
      day.removeAttribute('aria-selected');

      const disabled = isDateDisabled(date);
      day.classList.toggle('nb-calendar-day--disabled', disabled);
      day.setAttribute('aria-disabled', String(disabled));

      if (mode === 'range' && rangeStart && rangeEnd) {
        if (isSameDay(date, rangeStart)) {
          day.classList.add('nb-calendar-day--selected', 'nb-calendar-day--range-start');
          day.setAttribute('aria-selected', 'true');
        } else if (isSameDay(date, rangeEnd)) {
          day.classList.add('nb-calendar-day--selected', 'nb-calendar-day--range-end');
          day.setAttribute('aria-selected', 'true');
        } else if (isBetween(date, rangeStart, rangeEnd)) {
          day.classList.add('nb-calendar-day--in-range');
        }
      } else if (mode === 'range' && rangeStart && isSameDay(date, rangeStart)) {
        day.classList.add('nb-calendar-day--selected', 'nb-calendar-day--range-start');
        day.setAttribute('aria-selected', 'true');
      } else if (selectedDate && isSameDay(date, selectedDate)) {
        day.classList.add('nb-calendar-day--selected');
        day.setAttribute('aria-selected', 'true');
      }
    }
  }

  function selectSingle(date: Date): void {
    if (isDateDisabled(date)) return;
    selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    updateInput();
    syncDayStates();

    const allowed = dispatchNamespacedEvent(element, EVENT_SELECT, { date: selectedDate });
    if (allowed) {
      onSelect?.(selectedDate);
    }
  }

  function selectRange(date: Date): void {
    if (isDateDisabled(date)) return;
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (!rangeStart || (rangeStart && rangeEnd)) {
      rangeStart = normalized;
      rangeEnd = undefined;
    } else {
      if (normalized.getTime() < rangeStart.getTime()) {
        rangeEnd = rangeStart;
        rangeStart = normalized;
      } else {
        rangeEnd = normalized;
      }

      const range = { start: rangeStart, end: rangeEnd };
      const allowed = dispatchNamespacedEvent(element, EVENT_RANGE, range);
      if (allowed) {
        onRange?.(range);
      }
    }

    updateInput();
    syncDayStates();
  }

  function selectDate(date: Date): void {
    if (mode === 'range') {
      selectRange(date);
    } else {
      selectSingle(date);
      close();
    }
  }

  function clear(): void {
    selectedDate = undefined;
    rangeStart = undefined;
    rangeEnd = undefined;
    input.value = '';
    syncDayStates();
  }

  function setDate(value: Date | string): void {
    const date = parseDateValue(value);
    if (!date) return;
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
    if (mode === 'range') {
      selectRange(date);
    } else {
      selectSingle(date);
    }
  }

  // --------------------------------------------------------------------------
  // Open / Close
  // --------------------------------------------------------------------------

  function open(): void {
    if (state.value) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_OPEN);
    if (!allowed) return;

    panel.setAttribute('data-open', '');
    state.set(true);

    if (isBrowser) {
      const focusables = getFocusableElements(panel);
      (focusables[0] ?? input).focus();
    }

    dispatchNamespacedEvent(element, EVENT_TOGGLE, { isOpen: true });
    onOpen?.();
    onToggle?.(true);
  }

  function close(): void {
    if (!state.value) return;

    const allowed = dispatchNamespacedEvent(element, EVENT_CLOSE);
    if (!allowed) return;

    panel.removeAttribute('data-open');
    state.set(false);
    if (isBrowser) {
      input.focus();
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
  // Month navigation
  // --------------------------------------------------------------------------

  function changeMonth(delta: number): void {
    const view = getViewDate();
    view.setMonth(view.getMonth() + delta);
    setViewDate(view);

    dispatchNamespacedEvent(element, EVENT_MONTH_CHANGE, {
      month: view.getMonth() + 1,
      year: view.getFullYear(),
    });
  }

  // --------------------------------------------------------------------------
  // Event wiring
  // --------------------------------------------------------------------------

  if (trigger) {
    events.add(trigger, 'click', () => toggle());
  }

  events.add(input, 'click', () => open());

  if (navButtons.length >= 2) {
    events.add(navButtons[0], 'click', () => changeMonth(-1));
    events.add(navButtons[1], 'click', () => changeMonth(1));
  }

  if (grid) {
    events.add(grid, 'click', (e: MouseEvent) => {
      const day = (e.target as HTMLElement).closest<HTMLElement>('.nb-calendar-day');
      if (!day) return;
      const dateValue = day.getAttribute('data-date');
      if (!dateValue) return;
      const date = parseDateValue(dateValue);
      if (!date) return;
      selectDate(date);
    });
  }

  footerButtons.forEach((button) => {
    events.add(button, 'click', () => {
      const action = button.getAttribute('data-action');
      if (action === 'today') {
        const today = new Date();
        setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
        selectDate(today);
      } else if (action === 'clear') {
        clear();
      }
    });
  });

  events.add(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && state.value) {
      e.preventDefault();
      close();
    }
  });

  events.add(document, 'click', (e: MouseEvent) => {
    if (!state.value) return;
    const target = e.target as Node;
    if (!element.contains(target)) {
      close();
    }
  });

  // --------------------------------------------------------------------------
  // Instance
  // --------------------------------------------------------------------------

  const instance: DatePickerInstance = {
    open,
    close,
    toggle,
    setDate,
    clear,
    destroy() {
      if (state.value) close();
      events.destroy();
      cleanupState?.();
      state.clear();
      initRegistry.delete(element);
    },
    get value(): string {
      return input.value;
    },
    get isOpen(): boolean {
      return state.value;
    },
  };

  registerInstance(element, instance);
  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  // Initialize view and default date
  const initial = parseDateValue(defaultDate) ?? new Date();
  setViewDate(new Date(initial.getFullYear(), initial.getMonth(), 1));
  syncDayStates();

  if (defaultDate && !isDateDisabled(initial)) {
    const normalized = new Date(initial.getFullYear(), initial.getMonth(), initial.getDate());
    if (mode === 'range') {
      rangeStart = normalized;
      rangeEnd = undefined;
    } else {
      selectedDate = normalized;
    }
    updateInput();
    syncDayStates();
  }

  return instance;
}
