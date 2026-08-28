import type { DateValue } from "@ark-ui/react";
import { CalendarDate, endOfMonth, startOfMonth } from "@internationalized/date";

export function formatMonthYear(date: { year: number; month: number }, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(
    new Date(date.year, date.month - 1, 1)
  );
}

export function parseMonthYearInput(raw: string): CalendarDate | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const namedMatch = trimmed.match(/^([A-Za-zäöüÄÖÜáéíóúÁÉÍÓÚñÑ.]+)\s+(\d{4})$/);
  if (namedMatch) {
    const year = Number(namedMatch[2]);
    const parsed = Date.parse(`${namedMatch[1]} 1, ${year}`);
    if (!Number.isNaN(parsed)) {
      const date = new Date(parsed);
      return new CalendarDate(date.getFullYear(), date.getMonth() + 1, 1);
    }
  }

  const parts = trimmed.split(/[/\-.]+/).map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) return undefined;

  const [first, second] = parts;
  const year = first > 31 ? first : second;
  const month = first > 31 ? second : first;

  if (month < 1 || month > 12 || year < 1) return undefined;
  return new CalendarDate(year, month, 1);
}

export function toMonthRangeBounds(value: DateValue[]): DateValue[] {
  if (value.length === 0) return [];

  if (value.length === 1) {
    return [startOfMonth(value[0])];
  }

  const [start, end] = value[0].compare(value[1]) <= 0 ? [value[0], value[1]] : [value[1], value[0]];
  return [startOfMonth(start), endOfMonth(end)];
}

export function areSameMonthRanges(a: DateValue[], b: DateValue[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((date, index) => date.compare(b[index]) === 0);
}
