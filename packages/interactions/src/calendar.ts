// ============================================================================
// Neo-Brutal UI Interactions — Calendar
// Standalone, accessible month calendar with navigation and selection.
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
} from './factory.js';

const NAMESPACE = 'nb:calendar';
const EVENT_SELECT = `${NAMESPACE}:select`;
const EVENT_RANGE = `${NAMESPACE}:range`;
const EVENT_MONTH_CHANGE = `${NAMESPACE}:month-change`;

const CLASS_DAY = 'nb-calendar-day';
const CLASS_SELECTED = 'nb-calendar-day-selected';
const CLASS_TODAY = 'nb-calendar-day-today';
const CLASS_DISABLED = 'nb-calendar-day-disabled';
const CLASS_OUTSIDE = 'nb-calendar-day-outside';
const CLASS_RANGE_START = 'nb-calendar-day-range-start';
const CLASS_RANGE_END = 'nb-calendar-day-range-end';
const CLASS_RANGE_MID = 'nb-calendar-day-range-mid';

export interface CalendarOptions extends BaseOptions {
  /** Selection mode. Default: 'single' */
  mode?: 'single' | 'range';
  /** Initially selected date */
  defaultDate?: Date | string;
  /** Earliest selectable date */
  minDate?: Date | string;
  /** Latest selectable date */
  maxDate?: Date | string;
  /** First day of the week. 0 = Sunday, 1 = Monday. Default: 0 */
  firstDayOfWeek?: number;
  /** Locale for month titles and weekday abbreviations. Default: 'en-US' */
  locale?: string;
  /** Custom month title formatter */
  formatMonthTitle?: (date: Date, locale: string) => string;
  /** Override "today" for tests or static sites. Default: current date */
  today?: Date | string;
}

export interface CalendarInstance extends ComponentInstance {
  /** Currently selected single date */
  get value(): Date | undefined;
  /** Currently selected range */
  get range(): { start: Date | undefined; end: Date | undefined };
  /** Select a date programmatically */
  setDate(value: Date | string): void;
  /** Clear the current selection */
  clear(): void;
  /** Navigate to a specific month (month is 0-based) */
  goToMonth(year: number, month: number): void;
  /** Focus the calendar grid */
  open(): void;
  /** Blur focus if it is inside the calendar */
  close(): void;
  /** Toggle focus on the calendar grid */
  toggle(): void;
  /** Tear down all listeners */
  destroy(): void;
  /** Whether the calendar grid currently contains focus */
  get isOpen(): boolean;
}

// ============================================================================
// Date helpers
// ============================================================================

function parseDateValue(value: Date | string | undefined): Date | undefined {
  if (value === undefined || value === null) return undefined;
  if (value instanceof Date) return normalizeDate(value);

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return normalizeDate(parsed);
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function formatMonthTitleDefault(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

function formatWeekdayDefault(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { weekday: 'narrow' });
}

// ============================================================================
// Calendar factory
// ============================================================================

/**
 * Create a calendar interaction instance.
 *
 * Expected markup (simplified):
 *   <div class="nb-calendar" data-nb-calendar role="application" aria-label="Calendar">
 *     <div class="nb-calendar-header">
 *       <button class="nb-calendar-nav-btn" type="button" aria-label="Previous month">‹</button>
 *       <span class="nb-calendar-title" aria-live="polite" aria-atomic="true">June 2025</span>
 *       <button class="nb-calendar-nav-btn" type="button" aria-label="Next month">›</button>
 *     </div>
 *     <div class="nb-calendar-weekdays" aria-hidden="true">…</div>
 *     <div class="nb-calendar-grid" role="grid">
 *       <div class="nb-calendar-row" role="row">…gridcells…</div>
 *     </div>
 *   </div>
 */
export function createCalendar(element: HTMLElement, options: CalendarOptions = {}): CalendarInstance {
  if (!element || !(element instanceof HTMLElement)) {
    throw new TypeError(`[${NAMESPACE}] createCalendar requires a valid HTMLElement.`);
  }

  if (isInitialized(element)) {
    console.warn(`[${NAMESPACE}] Element already initialized. Returning existing instance.`);
    return (getInstance(element) as unknown as CalendarInstance) ?? createCalendar(element, options);
  }

  const {
    mode = 'single',
    defaultDate,
    minDate,
    maxDate,
    firstDayOfWeek = 0,
    locale = 'en-US',
    formatMonthTitle = formatMonthTitleDefault,
    today: todayOption,
  } = options;

  const header = element.querySelector<HTMLElement>('.nb-calendar-header');
  const titleEl = element.querySelector<HTMLElement>('.nb-calendar-title') ??
    header?.querySelector<HTMLElement>('span');
  const navButtons = Array.from(element.querySelectorAll<HTMLElement>('.nb-calendar-nav-btn'));
  const grid = element.querySelector<HTMLElement>('.nb-calendar-grid');
  const weekdaysRow = element.querySelector<HTMLElement>('.nb-calendar-weekdays');

  if (!grid) {
    throw new Error(`[${NAMESPACE}] No .nb-calendar-grid found inside the provided element.`);
  }

  const calendarGrid: HTMLElement = grid;

  const min = parseDateValue(minDate);
  const max = parseDateValue(maxDate);
  const today = parseDateValue(todayOption) ?? normalizeDate(new Date());

  const events = createEventManager();
  const state = createStateManager(false);
  let cleanupState: (() => void) | undefined;

  let viewDate = getInitialViewDate();
  let selectedDate: Date | undefined = parseDateValue(defaultDate);
  let rangeStart: Date | undefined;
  let rangeEnd: Date | undefined;

  if (mode === 'range' && selectedDate) {
    rangeStart = selectedDate;
  }

  function getInitialViewDate(): Date {
    const yearAttr = element.getAttribute('data-year');
    const monthAttr = element.getAttribute('data-month');
    if (yearAttr && monthAttr) {
      return new Date(parseInt(yearAttr, 10), parseInt(monthAttr, 10) - 1, 1);
    }
    const seed = selectedDate ?? today;
    return new Date(seed.getFullYear(), seed.getMonth(), 1);
  }

  function isDateDisabled(date: Date): boolean {
    if (min && date.getTime() < min.getTime()) return true;
    if (max && date.getTime() > max.getTime()) return true;
    return false;
  }

  function setViewDate(date: Date): void {
    viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
    element.setAttribute('data-year', String(viewDate.getFullYear()));
    element.setAttribute('data-month', String(viewDate.getMonth() + 1));
    if (titleEl) {
      titleEl.textContent = formatMonthTitle(viewDate, locale);
    }
  }

  function renderWeekdays(): void {
    if (!weekdaysRow) return;
    weekdaysRow.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const dayIndex = (firstDayOfWeek + i) % 7;
      const labelDate = new Date(2021, 0, dayIndex + 3); // Jan 3 2021 = Sunday
      const cell = document.createElement('div');
      cell.className = 'nb-calendar-weekday';
      cell.textContent = formatWeekdayDefault(labelDate, locale);
      weekdaysRow.appendChild(cell);
    }
  }

  function renderGrid(): void {
    calendarGrid.innerHTML = '';

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const leadingDays = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

    const startDate = new Date(year, month, 1 - leadingDays);

    let row: HTMLElement | null = null;

    for (let i = 0; i < totalCells; i++) {
      if (i % 7 === 0) {
        row = document.createElement('div');
        row.className = 'nb-calendar-row';
        row.setAttribute('role', 'row');
        calendarGrid.appendChild(row);
      }

      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const cell = document.createElement('div');
      cell.className = CLASS_DAY;
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('tabindex', '-1');
      cell.setAttribute('data-date', formatISODate(date));
      cell.textContent = String(date.getDate());

      const isOutside = date.getMonth() !== month;
      const disabled = isDateDisabled(date);
      const isToday = isSameDay(date, today);

      if (isOutside) cell.classList.add(CLASS_OUTSIDE);
      if (disabled) cell.classList.add(CLASS_DISABLED);
      if (isToday) cell.classList.add(CLASS_TODAY);

      if (!disabled) {
        cell.setAttribute('aria-selected', 'false');
      } else {
        cell.setAttribute('aria-disabled', 'true');
      }

      row?.appendChild(cell);
    }

    syncSelectionClasses();
  }

  function syncSelectionClasses(): void {
    const days = Array.from(calendarGrid.querySelectorAll<HTMLElement>(`.${CLASS_DAY}`));
    for (const day of days) {
      const dateValue = day.getAttribute('data-date');
      if (!dateValue) continue;
      const date = parseDateValue(dateValue);
      if (!date) continue;

      day.classList.remove(CLASS_SELECTED, CLASS_RANGE_START, CLASS_RANGE_END, CLASS_RANGE_MID);
      if (!day.classList.contains(CLASS_DISABLED)) {
        day.setAttribute('aria-selected', 'false');
      }

      if (mode === 'range' && rangeStart && rangeEnd) {
        if (isSameDay(date, rangeStart)) {
          day.classList.add(CLASS_SELECTED, CLASS_RANGE_START);
          day.setAttribute('aria-selected', 'true');
        } else if (isSameDay(date, rangeEnd)) {
          day.classList.add(CLASS_SELECTED, CLASS_RANGE_END);
          day.setAttribute('aria-selected', 'true');
        } else if (isBetween(date, rangeStart, rangeEnd)) {
          day.classList.add(CLASS_RANGE_MID);
        }
      } else if (mode === 'range' && rangeStart && isSameDay(date, rangeStart)) {
        day.classList.add(CLASS_SELECTED, CLASS_RANGE_START);
        day.setAttribute('aria-selected', 'true');
      } else if (selectedDate && isSameDay(date, selectedDate)) {
        day.classList.add(CLASS_SELECTED);
        day.setAttribute('aria-selected', 'true');
      }
    }
  }

  function findDayCell(date: Date): HTMLElement | null {
    const iso = formatISODate(date);
    return calendarGrid.querySelector<HTMLElement>(`.${CLASS_DAY}[data-date="${iso}"]`);
  }

  function focusDate(date: Date): void {
    const cell = findDayCell(date);
    if (cell && !cell.classList.contains(CLASS_DISABLED)) {
      cell.focus();
    }
  }

  function selectSingle(date: Date): void {
    if (isDateDisabled(date)) return;
    selectedDate = normalizeDate(date);
    syncSelectionClasses();

    const allowed = dispatchNamespacedEvent(element, EVENT_SELECT, { date: selectedDate });
    if (allowed) {
      options.onToggle?.(true);
    }
  }

  function selectRange(date: Date): void {
    if (isDateDisabled(date)) return;
    const normalized = normalizeDate(date);

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

      const start = rangeStart;
      const end = rangeEnd;
      const allowed = dispatchNamespacedEvent(element, EVENT_RANGE, { start, end });
      if (allowed) {
        options.onToggle?.(true);
      }
    }

    syncSelectionClasses();
  }

  function handleDayClick(e: MouseEvent): void {
    const cell = (e.target as HTMLElement).closest<HTMLElement>(`.${CLASS_DAY}`);
    if (!cell || cell.classList.contains(CLASS_DISABLED)) return;

    const dateValue = cell.getAttribute('data-date');
    if (!dateValue) return;
    const date = parseDateValue(dateValue);
    if (!date) return;

    if (mode === 'range') {
      selectRange(date);
    } else {
      selectSingle(date);
    }
  }

  function handleGridKeydown(e: KeyboardEvent): void {
    const active = document.activeElement as HTMLElement | null;
    const currentCell = active?.closest(`.${CLASS_DAY}`) as HTMLElement | null;
    if (!currentCell) return;

    const dateValue = currentCell.getAttribute('data-date');
    if (!dateValue) return;
    const currentDate = parseDateValue(dateValue);
    if (!currentDate) return;

    let nextDate: Date | undefined;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() - 7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 7);
        break;
      case 'PageUp':
        e.preventDefault();
        goToMonth(viewDate.getFullYear(), viewDate.getMonth() - 1);
        nextDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), Math.min(currentDate.getDate(), getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth())));
        break;
      case 'PageDown':
        e.preventDefault();
        goToMonth(viewDate.getFullYear(), viewDate.getMonth() + 1);
        nextDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), Math.min(currentDate.getDate(), getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth())));
        break;
      case 'Home':
        e.preventDefault();
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() - ((currentDate.getDay() - firstDayOfWeek + 7) % 7));
        break;
      case 'End':
        e.preventDefault();
        nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + (6 - ((currentDate.getDay() - firstDayOfWeek + 7) % 7)));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (mode === 'range') {
          selectRange(currentDate);
        } else {
          selectSingle(currentDate);
        }
        return;
    }

    if (nextDate) {
      const nextMonth = nextDate.getMonth();
      const nextYear = nextDate.getFullYear();
      if (nextYear !== viewDate.getFullYear() || nextMonth !== viewDate.getMonth()) {
        goToMonth(nextYear, nextMonth);
      }
      focusDate(nextDate);
    }
  }

  function handleNavClick(e: MouseEvent): void {
    const btn = e.currentTarget as HTMLElement;
    const isPrev = navButtons.indexOf(btn) === 0;
    goToMonth(viewDate.getFullYear(), viewDate.getMonth() + (isPrev ? -1 : 1));
  }

  function goToMonth(year: number, month: number): void {
    const nextView = new Date(year, month, 1);
    setViewDate(nextView);
    renderGrid();
    dispatchNamespacedEvent(element, EVENT_MONTH_CHANGE, {
      year: nextView.getFullYear(),
      month: nextView.getMonth() + 1,
    });
  }

  function setDate(value: Date | string): void {
    const date = parseDateValue(value);
    if (!date || isDateDisabled(date)) return;

    if (mode === 'range') {
      rangeStart = date;
      rangeEnd = undefined;
    } else {
      selectedDate = date;
    }

    goToMonth(date.getFullYear(), date.getMonth());
  }

  function clear(): void {
    selectedDate = undefined;
    rangeStart = undefined;
    rangeEnd = undefined;
    syncSelectionClasses();
  }

  function open(): void {
    const target = selectedDate ?? rangeStart ?? today;
    focusDate(target);
    state.set(true);
  }

  function close(): void {
    const active = document.activeElement as HTMLElement | null;
    if (active && element.contains(active)) {
      active.blur();
    }
    state.set(false);
  }

  function toggle(): void {
    const active = document.activeElement as HTMLElement | null;
    if (active && element.contains(active)) {
      close();
    } else {
      open();
    }
  }

  // Wire events
  events.add(calendarGrid, 'click', handleDayClick);
  events.add(calendarGrid, 'keydown', handleGridKeydown);
  navButtons.forEach((btn) => events.add(btn, 'click', handleNavClick));

  const instance: CalendarInstance = {
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
      const active = document.activeElement as HTMLElement | null;
      return active ? element.contains(active) : false;
    },
    get value(): Date | undefined {
      return selectedDate;
    },
    get range(): { start: Date | undefined; end: Date | undefined } {
      return { start: rangeStart, end: rangeEnd };
    },
    setDate,
    clear,
    goToMonth,
  };

  registerInstance(element, instance);
  cleanupState = state.subscribe((isOpen) => {
    element.setAttribute('data-nb-state', isOpen ? 'open' : 'closed');
  });

  // Initialize
  renderWeekdays();
  setViewDate(viewDate);
  renderGrid();

  return instance;
}
