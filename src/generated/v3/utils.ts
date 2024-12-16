import ApiSlice, { ApiDataStore, isErrorState, isInProgress, Method, PendingErrorState } from "@/store/apiSlice";
import Log from "@/utils/log";
import { selectLogin } from "@/connections/Login";
import { entityServiceUrl, jobServiceUrl, userServiceUrl } from "@/constants/environment";

export type ErrorWrapper<TError> = TError | { statusCode: -1; message: string };

type SelectorOptions<TQueryParams, TPathParams> = {
  store: ApiDataStore;
  url: string;
  method: string;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
};

const V3_NAMESPACES: Record<string, string> = {
  auth: userServiceUrl,
  users: userServiceUrl,
  jobs: jobServiceUrl,
  trees: entityServiceUrl
} as const;

const getBaseUrl = (url: string) => {
  // The v3 space is divided into services, and each service may host multiple namespaces. In
  // local dev, we don't use a proxy, so the FE needs to know how to connect to each service
  // individually.
  const namespace = url.substring(1).split("/")[0];
  const baseUrl = V3_NAMESPACES[namespace];
  if (baseUrl == null) throw new Error(`Namespace not defined! [${namespace}]`);

  return baseUrl;
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

  return `${getBaseUrl(url)}${url.replace(/\{\w*}/g, key => pathParams[key.slice(1, -1)]) + query}`;
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
    const response = await fetch(url, requestInit);

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

  // Note: there's a race condition that I haven't figured out yet: the middleware in apiSlice that
  // sets the access token in localStorage is firing _after_ the action has been merged into the
  // store, which means that the next connections that kick off right away don't have access to
  // the token through the getAccessToken method. So, we grab it from the store instead, which is
  // more reliable in this case.
  const { token } = selectLogin();
  if (!requestHeaders?.Authorization && token != null) {
    // Always include the JWT access token if we have one.
    requestHeaders.Authorization = `Bearer ${token}`;
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
