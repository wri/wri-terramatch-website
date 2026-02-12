import _ from "lodash";

/** Items with a createdAt date field (e.g. media, uploads) */
export interface WithCreatedAt {
  createdAt: string;
}

/**
 * Returns a new array sorted by createdAt. Immutable.
 * DESC = newest first, ASC = oldest first.
 */
export function sortByCreatedAt<T extends WithCreatedAt>(items: T[], sortOrder: "ASC" | "DESC"): T[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sortOrder === "DESC" ? bTime - aTime : aTime - bTime;
  });
}

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
