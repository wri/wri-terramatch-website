import ApiSlice, {
  ApiDataStore,
  isErrorState,
  isInProgress,
  Method,
  PendingErrorState,
  ResourceType
} from "@/store/apiSlice";
import Log from "@/utils/log";
import {
  dashboardServiceUrl,
  entityServiceUrl,
  jobServiceUrl,
  researchServiceUrl,
  userServiceUrl
} from "@/constants/environment";
import { Dictionary } from "lodash";
import qs, { ParsedQs } from "qs";
import { removeAccessToken } from "@/admin/apiProvider/utils/token";

export type ErrorWrapper<TError> = TError | { statusCode: -1; message: string };

type SelectorOptions<TQueryParams, TPathParams> = {
  url: string;
  method: string;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
};

const V3_NAMESPACES: Record<string, string> = {
  auth: userServiceUrl,
  entities: entityServiceUrl,
  jobs: jobServiceUrl,
  research: researchServiceUrl,
  trees: entityServiceUrl,
  users: userServiceUrl,
  dashboard: dashboardServiceUrl
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

export type FetchParamValue = number | string | boolean | null | undefined | FetchParamValue[];
export type FetchParams = Dictionary<FetchParamValue | FetchParams | FetchParams[]>;

export const getStableQuery = (queryParams?: FetchParams) => {
  if (queryParams == null) return "";

  const keys = Object.keys(queryParams);
  if (keys.length === 0) return "";

  // qs will gleefully stringify null and undefined values as `key=` if you leave the key in place.
  // For our implementation, we never want to send the empty key to the server in the query, so
  // delete any keys that have such a value.
  for (const key of keys) {
    if (queryParams[key] == null) delete queryParams[key];
  }
  // Have `qs` handle the initial stringify because it's smarter about embedded objects and arrays.
  const searchParams = new URLSearchParams(qs.stringify(queryParams));
  // Make sure the output string always ends up in the same order because we need the URL string
  // that is generated from a set of query / path params to be consistent even if the order of the
  // params in the source object changes.
  searchParams.sort();
  const query = searchParams.toString();
  return query.length === 0 ? "" : `?${query}`;
};

const getStablePathAndQuery = (url: string, queryParams: FetchParams = {}, pathParams: FetchParams = {}) => {
  const query = getStableQuery(queryParams);
  return `${url.replace(/\{\w*}/g, key => pathParams[key.slice(1, -1)] as string)}${query}`;
};

export const resolveUrl = (url: string, queryParams: FetchParams = {}, pathParams: FetchParams = {}) =>
  `${getBaseUrl(url)}${getStablePathAndQuery(url, queryParams, pathParams)}`;

export function isFetchingSelector<TQueryParams extends FetchParams, TPathParams extends FetchParams>({
  url,
  method,
  pathParams,
  queryParams
}: SelectorOptions<TQueryParams, TPathParams>) {
  const fullUrl = resolveUrl(url, queryParams, pathParams);
  return (store: ApiDataStore) => isInProgress(store.meta.pending[method.toUpperCase() as Method][fullUrl]);
}

export function fetchFailedSelector<TQueryParams extends FetchParams, TPathParams extends FetchParams>({
  url,
  method,
  pathParams,
  queryParams
}: SelectorOptions<TQueryParams, TPathParams>) {
  const fullUrl = resolveUrl(url, queryParams, pathParams);
  return (store: ApiDataStore) => {
    const pending = store.meta.pending[method.toUpperCase() as Method][fullUrl];
    return isErrorState(pending) ? pending : null;
  };
}

export function indexMetaSelector<TQueryParams extends {}, TPathParams extends {}>({
  resource,
  url,
  pathParams,
  queryParams
}: Omit<SelectorOptions<TQueryParams, TPathParams>, "method"> & { resource: ResourceType }) {
  // Some query params gets specified as a single indexed key like `page[number]`, and some get
  // specified as a complex object like `sideloads: [{ entity: "sites", pageSize: 5 }]`, and running
  // what we get through qs stringify / parse will normalize it.
  const normalizedQuery = qs.parse(qs.stringify(queryParams));
  const queryKeys = Object.keys(normalizedQuery);
  const pageNumber = Number(queryKeys.includes("page") ? (normalizedQuery.page as ParsedQs).number : 1);
  if (queryKeys.includes("page") && (normalizedQuery.page as ParsedQs).number != null) {
    delete (normalizedQuery.page as ParsedQs).number;
  }
  if (queryKeys.includes("sideloads")) {
    delete normalizedQuery.sideloads;
  }

  const stableUrl = getStablePathAndQuery(url, normalizedQuery, pathParams);
  return (store: ApiDataStore) => store.meta.indices[resource][stableUrl]?.[pageNumber];
}

const isPending = (method: Method, fullUrl: string) => ApiSlice.currentState.meta.pending[method][fullUrl] != null;

// NOTE: logout and selectFirstLogin are provided in this file instead of the Login.ts connection file
// in order to avoid importing anything from connections in this file, which can cause a circular
// dependency resolution problem.

export const logout = () => {
  removeAccessToken();
  // When we log out, remove all cached API resources so that when we log in again, these resources
  // are freshly fetched from the BE.
  ApiSlice.clearApiCache();
};

export const selectFirstLogin = (store: ApiDataStore) => Object.values(store.logins)?.[0]?.attributes;

async function dispatchRequest<TData, TError>(url: string, requestInit: RequestInit) {
  const actionPayload = { url, method: requestInit.method as Method };
  ApiSlice.fetchStarting(actionPayload);

  try {
    const response = await fetch(url, requestInit);

    if (!response.ok) {
      const error = (await response.json()) as ErrorWrapper<TError>;
      ApiSlice.fetchFailed({ ...actionPayload, error: error as PendingErrorState });

      if (url.endsWith("/users/me") && response.status === 401) {
        // If the users/me fetch is unauthorized, our login has timed out and we need to transition
        // to a logged out state.
        logout();
      }

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
  const { token } = selectFirstLogin(ApiSlice.currentState) ?? {};
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
