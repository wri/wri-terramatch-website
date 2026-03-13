import type { DateValue } from "@ark-ui/react";

export const formatDate = (date: DateValue): string => {
  return new Date(date.year, date.month - 1, date.day).toLocaleDateString();
};
