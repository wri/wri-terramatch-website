import { format, isValid, parse, parseISO } from "date-fns";

export const fixInputValueDates = (value: any) => {
  try {
    value = formatEntryValue(value);
    const date = format(Date.parse(value), "dd/MM/yyyy");
    if (!isValid(date)) {
      value = format(new Date(value), "yyyy-MM-dd");
    }
  } catch (e) {
    value = parse(value, "dd/MM/yyyy", new Date());
  }
  return value;
};

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
