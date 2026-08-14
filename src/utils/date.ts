import { CalendarDate } from "@internationalized/date";

export function getDateFormatString(lang: string) {
  const formatObj = new Intl.DateTimeFormat(lang).formatToParts(new Date());

  return formatObj
    .map(obj => {
      switch (obj.type) {
        case "day":
          return "DD";
        case "month":
          return "MM";
        case "year":
          return "YYYY";
        default:
          return obj.value;
      }
    })
    .join("");
}

export function formatDateValue(date: { year: number; month: number; day: number }, pattern: string): string {
  const dd = String(date.day).padStart(2, "0");
  const mm = String(date.month).padStart(2, "0");
  const yyyy = String(date.year);

  return pattern.replace("YYYY", yyyy).replace("MM", mm).replace("DD", dd);
}

/** Formats a year/month value as a localized "MMM YYYY" string, e.g. "May 2026". */
export function formatMonthValue(date: { year: number; month: number }, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(new Date(date.year, date.month - 1, 1));
}

const monthNameCache = new Map<string, string[]>();

/** Returns the 12 month names ("jan", "feb", ...) for a locale, normalized to lowercase with no trailing period. */
function getMonthNames(locale: string, style: "short" | "long"): string[] {
  const cacheKey = `${locale}:${style}`;
  const cached = monthNameCache.get(cacheKey);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat(locale, { month: style });
  const names = Array.from({ length: 12 }, (_, month) =>
    formatter
      .format(new Date(2020, month, 1))
      .toLowerCase()
      .replace(/\u00a0/g, " ")
      .trim()
      .replace(/\.$/, "")
  );
  monthNameCache.set(cacheKey, names);
  return names;
}

/** Resolves a localized month name (e.g. "may", "ene", "January") to its 1-based month number. */
function getMonthNumberFromName(name: string, locale: string): number | undefined {
  const normalized = name.trim().toLowerCase().replace(/\.$/, "");
  if (!normalized) return undefined;

  const shortIndex = getMonthNames(locale, "short").indexOf(normalized);
  if (shortIndex !== -1) return shortIndex + 1;

  const longIndex = getMonthNames(locale, "long").indexOf(normalized);
  return longIndex === -1 ? undefined : longIndex + 1;
}

/**
 * Parses user input into the 1st day of that month. Accepts both the numeric format the user can
 * type ("5/2026", "05/26", "5") and the localized "MMM YYYY" text (e.g. "May 2026") produced by
 * `formatMonthValue`, so a value round-trips correctly when an input is blurred without editing it.
 */
export function parseMonthInput(raw: string, locale = "en-US"): CalendarDate | undefined {
  const trimmed = raw.replace(/\u00a0/g, " ").trim();
  if (!trimmed) return undefined;

  const textMatch = trimmed.match(/^([^\d]+?)[.,]?\s+(\d{2,4})$/);
  if (textMatch) {
    const [, monthName, yearText] = textMatch;
    const month = getMonthNumberFromName(monthName, locale);
    if (month != null) {
      const year = yearText.length <= 2 ? Number(yearText) + 2000 : Number(yearText);
      return new CalendarDate(year, month, 1);
    }
  }

  const parts = trimmed.split(/[/\-.]+/).map(Number);
  if (parts.some(isNaN)) return undefined;

  const now = new Date();
  let month: number;
  let year: number;

  if (parts.length === 2) {
    [month, year] = parts;
    if (year < 100) year += 2000;
  } else if (parts.length === 1) {
    const n = parts[0];
    if (n > 12) {
      year = n < 100 ? 2000 + n : n;
      month = now.getMonth() + 1;
    } else {
      month = n;
      year = now.getFullYear();
    }
  } else {
    return undefined;
  }

  if (month < 1 || month > 12) return undefined;
  if (year < 1) return undefined;

  return new CalendarDate(year, month, 1);
}

/** Parses user input ("3/12/2026", "15/03", or "15") into a CalendarDate using the locale pattern. */
export function parseDateInput(raw: string, pattern: string): CalendarDate | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  const parts = trimmed.split(/[/\-.]+/).map(Number);
  if (parts.some(isNaN)) return undefined;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const dayFirst = pattern.indexOf("DD") < pattern.indexOf("MM");

  let year: number;
  let month: number;
  let day: number;

  if (parts.length === 3) {
    if (dayFirst) {
      [day, month, year] = parts;
    } else {
      [month, day, year] = parts;
    }
    if (year < 100) year += 2000;
  } else if (parts.length === 2) {
    year = currentYear;
    if (dayFirst) {
      [day, month] = parts;
    } else {
      [month, day] = parts;
    }
  } else if (parts.length === 1) {
    const n = parts[0];
    year = currentYear;
    if (dayFirst) {
      day = n;
      month = currentMonth;
    } else {
      if (n >= 1 && n <= 12) {
        month = n;
        day = 1;
      } else {
        day = n;
        month = currentMonth;
      }
    }
  } else {
    return undefined;
  }

  if (month < 1 || month > 12) return undefined;
  const maxDay = new Date(year, month, 0).getDate();
  if (day < 1 || day > maxDay) return undefined;
  if (year < 1) return undefined;

  return new CalendarDate(year, month, day);
}
