export function getDateFormatString(lang: string) {
  const formatObj = new Intl.DateTimeFormat(lang).formatToParts(new Date());

  return formatObj
    .map(obj => {
      switch (obj.type) {
        case "day":
          return "DD";
        case "month":
          return "MM";
        case "year":
          return "YYYY";
        default:
          return obj.value;
      }
    })
    .join("");
}

export function formatDateValue(date: { year: number; month: number; day: number }, pattern: string): string {
  const dd = String(date.day).padStart(2, "0");
  const mm = String(date.month).padStart(2, "0");
  const yyyy = String(date.year);

  return pattern.replace("YYYY", yyyy).replace("MM", mm).replace("DD", dd);
}
