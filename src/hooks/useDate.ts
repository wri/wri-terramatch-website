import { format as _format, subMonths, subWeeks } from "date-fns";
import * as DateLocales from "date-fns/locale";
import { useRouter } from "next/router";
import { useCallback } from "react";

const Locales = DateLocales as Record<string, any>;

/**
 * Re-interpret a UTC instant as a local calendar date with the same Y/M/D/H/M/S
 * components, so date-fns `format` displays the UTC calendar day for every user.
 */
export const toUtcCalendarDate = (date: string | number | Date): Date => {
  const parsed = date instanceof Date ? date : new Date(date);
  return new Date(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth(),
    parsed.getUTCDate(),
    parsed.getUTCHours(),
    parsed.getUTCMinutes(),
    parsed.getUTCSeconds(),
    parsed.getUTCMilliseconds()
  );
};

/**
 * Collection of most used date manipulator and formatter.
 * By default, formatting uses the UTC calendar day so due dates like
 * `2025-07-31T00:00:00.000Z` show as 31 July for every timezone.
 * @returns { format, subMonths, subWeeks }
 */
export const useDate = () => {
  const { locale } = useRouter();
  const formattedLocale = locale?.substring(0, 2) ?? "en";

  /**
   * Formats the date to selected format type and current locale.
   * @param date Date in string value
   * @param format default: dd/MM/yyyy
   * @param useUtc When true (default), format the UTC calendar components.
   *   Pass false when `date` was already shifted with `toUtcCalendarDate`.
   * @returns string
   */
  const format = useCallback(
    (date?: string | number | Date | null, format = "dd/MM/yyyy", useUtc = true) => {
      if (!date) return "";

      const value = useUtc ? toUtcCalendarDate(date) : new Date(date);
      return _format(value, format, { locale: Locales[formattedLocale] ?? Locales.enUS });
    },
    [formattedLocale]
  );

  return { format, subMonths, subWeeks };
};
