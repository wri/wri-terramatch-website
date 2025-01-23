import queryString from "query-string";
import { useMemo } from "react";

/**
 * Captures and parses the query string at the time the component mounts.
 */
export function useQueryString() {
  return useMemo(() => queryString.parse(window.location.search), []);
}
