import { format, isValid, parseISO } from "date-fns";

export const convertDateformat = (value: any) => {
  if (isValid(parseISO(value))) {
    if (typeof value === "string") {
      const dateObject = new Date(value);
      const formattedDay = dateObject.getUTCDate().toString().padStart(2, "0");
      const formattedMonth = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
      const formattedYear = dateObject.getUTCFullYear();
      const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
      return formattedDate;
    }
    return format(new Date(value), "dd/MM/yyyy");
  } else {
    return value;
  }
};
