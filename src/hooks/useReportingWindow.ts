import { useMemo } from "react";

import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { useDate } from "@/hooks/useDate";

enum Period {
  QUARTERLY,
  BI_ANNUALLY
}

/**
 * to generate reporting window based on the due_date and period
 * ex: quarterly   => {3 month before due_date} - {1 month before due date} [yyyy]
 * ex: bi-annually => {6 month before due_date} - {1 month before due date} [yyyy]
 * Must be wrapped in a FrameworkContext in order to determine reporting period.
 * @returns string
 */
export const useReportingWindow = (dueDate: string) => {
  const { format, subMonths } = useDate();
  const { framework } = useFrameworkContext();
  const period = framework === Framework.PPC ? Period.QUARTERLY : Period.BI_ANNUALLY;

  return useMemo(() => {
    if (dueDate == null) return "";

    const date = new Date(dueDate);
    let start, end, year;
    if (period === Period.QUARTERLY) {
      // Calculate start and end months for quarterly
      const startMonth = (date.getMonth() - 3 + 12) % 12; // Adjusting for negative values
      start = format(new Date(date.getFullYear(), startMonth, 1), "MMMM");
      end = format(subMonths(date, 1), "MMMM");
      year = format(subMonths(date, 1), "yyyy");
    } else {
      // Calculate start and end months for bi-annually
      const startMonth = (date.getMonth() - 6 + 12) % 12; // Adjusting for negative values
      start = format(new Date(date.getFullYear(), startMonth, 1), "MMMM");
      end = format(subMonths(date, 1), "MMMM");
      year = format(subMonths(date, 1), "yyyy");
    }

    return `${start} - ${end} ${year}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueDate]);
};
