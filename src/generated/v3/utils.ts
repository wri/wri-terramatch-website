import ApiSlice, { ApiDataStore, isErrorState, isInProgress, Method, PendingErrorState } from "@/store/apiSlice";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ErrorWrapper<TError> = TError | { statusCode: -1; message: string };

type SelectorOptions<TQueryParams, TPathParams> = {
  state: ApiDataStore;
  url: string;
  method: string;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
};

export const resolveUrl = (
  url: string,
  queryParams: Record<string, string> = {},
  pathParams: Record<string, string> = {}
) => {
  const searchParams = new URLSearchParams(queryParams);
  // Make sure the output string always ends up in the same order because we need the URL string
  // that is generated from a set of query / path params to be consistent even if the order of the
  // params in the source object changes.
  searchParams.sort();
  let query = searchParams.toString();
  if (query) query = `?${query}`;
  return `${baseUrl}${url.replace(/\{\w*}/g, key => pathParams[key.slice(1, -1)]) + query}`;
};

export function isFetching<TQueryParams extends {}, TPathParams extends {}>({
  state,
  url,
  method,
  pathParams,
  queryParams
}: SelectorOptions<TQueryParams, TPathParams>): boolean {
  const fullUrl = resolveUrl(url, queryParams, pathParams);
  const pending = state.meta.pending[method.toUpperCase() as Method][fullUrl];
  return isInProgress(pending);
}

export function fetchFailed<TQueryParams extends {}, TPathParams extends {}>({
  state,
  url,
  method,
  pathParams,
  queryParams
}: SelectorOptions<TQueryParams, TPathParams>): PendingErrorState | null {
  const fullUrl = resolveUrl(url, queryParams, pathParams);
  const pending = state.meta.pending[method.toUpperCase() as Method][fullUrl];
  return isErrorState(pending) ? pending : null;
}

export async function dispatchRequest<TData, TError>(url: string, requestInit: RequestInit) {
  const actionPayload = { url, method: requestInit.method as Method };
  ApiSlice.fetchStarting(actionPayload);

  try {
    const response = await window.fetch(url, requestInit);

    if (!response.ok) {
      const error = (await response.json()) as ErrorWrapper<TError>;
      ApiSlice.fetchFailed({ ...actionPayload, error: error as PendingErrorState });
      return;
    }

    if (!response.headers.get("content-type")?.includes("json")) {
      // this API integration only supports JSON type responses at the moment.
      throw new Error(`Response type is not JSON [${response.headers.get("content-type")}]`);
    }

    const responsePayload = await response.json();
    if (responsePayload.statusCode != null && responsePayload.message != null) {
      ApiSlice.fetchFailed({ ...actionPayload, error: responsePayload });
    } else {
      ApiSlice.fetchSucceeded({ ...actionPayload, response: responsePayload });
    }
  } catch (e) {
    console.error("Unexpected API fetch failure", e);
    const message = e instanceof Error ? `Network error (${e.message})` : "Network error";
    ApiSlice.fetchFailed({ ...actionPayload, error: { statusCode: -1, message } });
  }
}
