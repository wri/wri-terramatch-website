import queryString from "query-string";

/** Appends `params` to `href` (which may already have a query string), skipping null / empty values. */
export const appendQueryParams = (href: string, params: Record<string, string | null | undefined>) =>
  queryString.stringifyUrl({ url: href, query: params }, { skipNull: true, skipEmptyString: true, sort: false });
