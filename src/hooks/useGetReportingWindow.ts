import { useDate } from "@/hooks/useDate";

/**
 * to generate reporting window based on the due_date and period
 * ex: quarterly   => {3 month before due_date} - {1 month before due date} [yyyy]
 * ex: bi-annually => {6 month before due_date} - {1 month before due date} [yyyy]
 * @returns string
 */
export const useGetReportingWindow = () => {
  const { format, subMonths } = useDate();

  return {
    getReportingWindow: (due_date: string, period: "quarterly" | "bi-annually") => {
      if (!due_date) return "";

      const date = new Date(due_date);

      let start, end, year;

      if (period === "quarterly") {
        // Calculate start and end months for quarterly
        const startMonth = (date.getMonth() - 3 + 12) % 12; // Adjusting for negative values
        start = format(new Date(date.getFullYear(), startMonth, 1), "MMMM");
        end = format(subMonths(date, 1), "MMMM");
        year = format(subMonths(date, 1), "yyyy");
      } else if (period === "bi-annually") {
        // Calculate start and end months for bi-annually
        const startMonth = (date.getMonth() - 6 + 12) % 12; // Adjusting for negative values
        start = format(new Date(date.getFullYear(), startMonth, 1), "MMMM");
        end = format(subMonths(date, 1), "MMMM");
        year = format(subMonths(date, 1), "yyyy");
      }

      return `${start} - ${end} ${year}`;
    }
  };
};
