import { useDate } from "@/hooks/useDate";

export const useGetReportingWindow = () => {
  const { format, subMonths, subWeeks } = useDate();

  return {
    getReportingWindow: (due_date: string, period: "quarterly" | "bi-annually") => {
      if (!due_date) return "";

      const date = new Date(due_date);
      const end = format(subWeeks(date, 1), "MMMM");
      const start = format(subMonths(date, period == "quarterly" ? 2 : 5), "MMMM");

      return `${start} - ${end} ${format(date, "yyyy")}`;
    }
  };
};
