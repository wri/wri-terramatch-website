import { useMemo } from "react";

import { Framework } from "@/context/framework.provider";
import { toUtcCalendarDate, useDate } from "@/hooks/useDate";

enum Period {
  QUARTERLY,
  BI_ANNUALLY
}

/**
 * to generate reporting window based on the due_date and period
 * ex: quarterly   => {3 month before due_date} - {1 month before due date} [yyyy]
 * ex: bi-annually => {6 month before due_date} - {1 month before due date} [yyyy]
 * Uses the UTC calendar day of dueDate so the window is timezone-stable.
 * @returns string
 */
export const useReportingWindow = (framework: Framework, dueDate?: string) => {
  const { format, subMonths } = useDate();
  const period = framework === Framework.PPC ? Period.QUARTERLY : Period.BI_ANNUALLY;

  return useMemo(() => {
    if (dueDate == null) return "";

    // Shift once into local calendar space matching the UTC due day, then format
    // without a second UTC conversion (useUtc = false).
    const date = toUtcCalendarDate(dueDate);
    let start, end, year;
    if (period === Period.QUARTERLY) {
      const startMonth = (date.getMonth() - 3 + 12) % 12;
      try {
        start = format(new Date(date.getFullYear(), startMonth, 1), "MMMM", false);
      } catch (e) {
        start = "";
      }
      end = format(subMonths(date, 1), "MMMM", false);
      year = format(subMonths(date, 1), "yyyy", false);
    } else {
      const startMonth = (date.getMonth() - 6 + 12) % 12;
      try {
        start = format(new Date(date.getFullYear(), startMonth, 1), "MMMM", false);
      } catch (e) {
        start = "";
      }
      end = format(subMonths(date, 1), "MMMM", false);
      year = format(subMonths(date, 1), "yyyy", false);
    }

    return `${start} - ${end} ${year}`;
  }, [dueDate, format, period, subMonths]);
};
