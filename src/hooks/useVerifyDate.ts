export const useVerifyDate = () => {
  const formatDateLocalString = (inputDateString: string) => {
    try {
      const dateObject = new Date(inputDateString);
      const formattedDay = dateObject.getUTCDate().toString().padStart(2, "0");
      const formattedMonth = (dateObject.getUTCMonth() + 1).toString().padStart(2, "0");
      const formattedYear = dateObject.getUTCFullYear();
      const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
      return formattedDate;
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateString = (inputDateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDateString)) {
      return "Invalid Date";
    }

    const [year, month, day] = inputDateString.split("-");
    const dateObject = new Date(Number(year), Number(month) - 1, Number(day));

    const formattedDay = dateObject.getDate().toString().padStart(2, "0");
    const formattedMonth = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const formattedYear = dateObject.getFullYear();

    const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;

    return formattedDate;
  };

  function isDateStringValid(dateString: string): boolean {
    if (!isNaN(Number(dateString))) {
      return false;
    }
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp);
  }

  return { formatDateLocalString, formatDateString, isDateStringValid };
};
