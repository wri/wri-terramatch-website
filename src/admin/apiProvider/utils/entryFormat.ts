import { format, isValid, parseISO } from "date-fns";

export const formatEntryValue = (entry: any) => {
  if (isDateType(entry)) {
    return convertDateFormat(entry);
  }
  return entry;
};

const isDateType = (value: any) => {
  return isValid(parseISO(value));
};

const convertDateFormat = (value: any) => {
  if (typeof value === "string") {
    const dateObject = new Date(value);
    const formattedDay = dateObject.getUTCDate().toString().padStart(2, "0");
    const formattedMonth = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
    const formattedYear = dateObject.getUTCFullYear();
    const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
    return formattedDate;
  }
  return format(new Date(value), "dd/MM/yyyy");
};
