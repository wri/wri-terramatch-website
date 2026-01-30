import { isEqualWith } from "lodash";

/**
 * Compare any two values for deep equality. Uses lodash's isEqualWith to allow null and undefined
 * to count as equal.
 */
export const valueWiseEqual = (a: any, b: any) =>
  isEqualWith(a, b, (valueA, valueB) => (valueA == null && valueB == null ? true : undefined));
