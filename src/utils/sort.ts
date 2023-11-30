import _ from "lodash";

export const sortByDate = <T>(arr: T[], getter: string, direction: "ASC" | "DESC" = "ASC") => {
  return arr.sort((a, b) => {
    const aVal = _.get(a, getter);
    const bVal = _.get(b, getter);

    if (!aVal || !bVal) {
      return 0;
    }

    const aTime = new Date(aVal).getTime();
    const bTime = new Date(bVal).getTime();

    if (direction === "ASC") {
      return bTime - aTime;
    }

    return aTime - bTime;
  });
};
