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
