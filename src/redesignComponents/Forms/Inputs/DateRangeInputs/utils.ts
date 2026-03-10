import type { DateValue } from "@ark-ui/react";

export const formatDate = (date: DateValue): string => {
  const mm = String(date.month).padStart(2, "0");
  const dd = String(date.day).padStart(2, "0");
  const yy = String(date.year).slice(-2);
  return `${mm}/${dd}/${yy}`;
};
