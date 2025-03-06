import { format as _format, subMonths, subWeeks } from "date-fns";
import * as DateLocales from "date-fns/locale";
import { useRouter } from "next/router";
import { useCallback } from "react";

const Locales = DateLocales as Record<string, any>;
/**
 * Collection of most used date manipulator and formatter.
 * @returns { format, subMonths, subWeeks }
 */
export const useDate = () => {
  const { locale } = useRouter();
  const formattedLocale = locale?.substring(0, 2) ?? "en";

  /**
   * Formats the date to selected format type and current locale.
   * @param date Date in string value
   * @param format default: dd/MM/yyyy
   * @returns string
   */
  const format = useCallback(
    (date?: string | number | Date | null, format = "dd/MM/yyyy") => {
      if (!date) return "";

      return _format(new Date(date), format, { locale: Locales[formattedLocale] ?? Locales.enUS });
    },
    [formattedLocale]
  );

  return { format, subMonths, subWeeks };
};
