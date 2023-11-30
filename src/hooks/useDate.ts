import { format as _format, subMonths, subWeeks } from "date-fns";
import * as Locales from "date-fns/locale";
import { useRouter } from "next/router";

export const useDate = () => {
  const { locale } = useRouter();
  const formattedLocale = locale?.substring(0, 2) ?? "en";

  /**
   * Formats the date to selected format type and current locale.
   * @param date Date in string value
   * @param format default: dd/MM/yyyy
   * @returns string
   */
  const format = (date?: string | number | Date, format = "dd/MM/yyyy") => {
    if (!date) return "";
    // @ts-ignore
    return _format(new Date(date), format, { locale: Locales[formattedLocale] ?? Locales.enUS });
  };

  return { format, subMonths, subWeeks };
};
