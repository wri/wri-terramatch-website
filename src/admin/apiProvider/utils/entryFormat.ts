import { format, isValid, parse, parseISO } from "date-fns";

export const parseDateValues = (value: any) => {
  try {
    const formattedValue = formatEntryValue(value);
    const parsedDate = parse(formattedValue, "dd/MM/yyyy HH:mm", new Date());
    try {
      return format(new Date(parsedDate), "yyyy-MM-dd");
    } catch (e) {
      return value;
    }
  } catch (e) {
    return value;
  }
};

export const formatEntryValue = (entry: any) => {
  if (isDateType(entry)) {
    return convertDateFormat(entry);
  }

  if (typeof entry === "string") {
    return entry.replaceAll("\n", "<br />");
  }

  return entry;
};

const isDateType = (value: any) => {
  if (typeof value !== "string") {
    return false;
  }
  const trimmedValue = value.trim();
  if (trimmedValue === "") {
    return false;
  }

  // Avoid treating plain numeric values (e.g. "1000") as year-based dates.
  // We only accept ISO-like date strings used by the API.
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+-Z]*)?$/;
  if (!isoDatePattern.test(trimmedValue)) {
    return false;
  }

  return isValid(parseISO(trimmedValue));
};

export const convertDateFormat = (value: any) => {
  if (typeof value === "string") {
    const dateObject = new Date(value);
    const formattedDay = dateObject.getUTCDate().toString().padStart(2, "0");
    const formattedMonth = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
    const formattedYear = dateObject.getUTCFullYear();
    const formattedHours = dateObject.getUTCHours().toString().padStart(2, "0");
    const formattedMinutes = dateObject.getUTCMinutes().toString().padStart(2, "0");
    const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHours}:${formattedMinutes}`;
    return formattedDate;
  }
  try {
    return format(new Date(value), "dd/MM/yyyy HH:mm");
  } catch (e) {
    return value;
  }
};

export const formatDateForEnGb = (value: string | null) => {
  if (value == null || value == "") return "";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
};
