import { format, isValid, parse, parseISO } from "date-fns";

export const parseDateValues = (value: any) => {
  try {
    const formattedValue = formatEntryValue(value);
    const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());
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
  return isValid(parseISO(value));
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
