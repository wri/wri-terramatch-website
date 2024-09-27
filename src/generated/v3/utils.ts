import ApiSlice, { ApiDataStore, isErrorState, isInProgress, Method, PendingErrorState } from "@/store/apiSlice";
import Log from "@/utils/log";
import { getAccessToken } from "@/admin/apiProvider/utils/token";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ErrorWrapper<TError> = TError | { statusCode: -1; message: string };

type SelectorOptions<TQueryParams, TPathParams> = {
  store: ApiDataStore;
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
  store,
  url,
  method,
  pathParams,
  queryParams
}: SelectorOptions<TQueryParams, TPathParams>): boolean {
  const fullUrl = resolveUrl(url, queryParams, pathParams);
  const pending = store.meta.pending[method.toUpperCase() as Method][fullUrl];
  return isInProgress(pending);
}

export function fetchFailed<TQueryParams extends {}, TPathParams extends {}>({
  store,
  url,
  method,
  pathParams,
  queryParams
}: SelectorOptions<TQueryParams, TPathParams>): PendingErrorState | null {
  const fullUrl = resolveUrl(url, queryParams, pathParams);
  const pending = store.meta.pending[method.toUpperCase() as Method][fullUrl];
  return isErrorState(pending) ? pending : null;
}

const isPending = (method: Method, fullUrl: string) => ApiSlice.apiDataStore.meta.pending[method][fullUrl] != null;

async function dispatchRequest<TData, TError>(url: string, requestInit: RequestInit) {
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
    Log.error("Unexpected API fetch failure", e);
    const message = e instanceof Error ? `Network error (${e.message})` : "Network error";
    ApiSlice.fetchFailed({ ...actionPayload, error: { statusCode: -1, message } });
  }
}

export type ServiceFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
  signal?: AbortSignal;
};

export function serviceFetch<
  TData,
  TError,
  TBody extends {} | FormData | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {}
>({
  url,
  method: methodString,
  body,
  headers,
  pathParams,
  queryParams,
  signal
}: ServiceFetcherOptions<TBody, THeaders, TQueryParams, TPathParams>) {
  const fullUrl = resolveUrl(url, queryParams, pathParams);
  const method = methodString.toUpperCase() as Method;
  if (isPending(method, fullUrl)) {
    // Ignore requests to issue an API request that is in progress or has failed without a cache
    // clear.
    return;
  }

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers
  };

  const accessToken = typeof window === "undefined" ? null : getAccessToken();
  if (!requestHeaders?.Authorization && accessToken != null) {
    // Always include the JWT access token if we have one.
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  /**
   * As the fetch API is being used, when multipart/form-data is specified
   * the Content-Type header must be deleted so that the browser can set
   * the correct boundary.
   * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object
   */
  if (requestHeaders["Content-Type"].toLowerCase().includes("multipart/form-data")) {
    delete requestHeaders["Content-Type"];
  }

  // The promise is ignored on purpose. Further progress of the request is tracked through
  // redux.
  dispatchRequest<TData, TError>(fullUrl, {
    signal,
    method,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    headers: requestHeaders
  });
}
