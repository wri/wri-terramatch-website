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

/** Sort by submittedAt with consistent null handling: nulls last when ASC, nulls first when DESC */
export const sortBySubmittedAt = <T extends { submittedAt?: string | null }>(
  data: T[],
  direction: "ASC" | "DESC"
): T[] => {
  return [...data].sort((a, b) => {
    const aVal = a.submittedAt;
    const bVal = b.submittedAt;
    const aNull = aVal == null;
    const bNull = bVal == null;

    if (aNull && bNull) return 0;
    if (aNull) return direction === "ASC" ? 1 : -1;
    if (bNull) return direction === "ASC" ? -1 : 1;

    const aTime = new Date(aVal).getTime();
    const bTime = new Date(bVal).getTime();
    return direction === "ASC" ? aTime - bTime : bTime - aTime;
  });
};
