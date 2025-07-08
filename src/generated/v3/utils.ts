import ApiSlice, {
  ApiDataStore,
  isCompletedCreationState,
  isErrorState,
  isInProgress,
  Method,
  PendingError,
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
import { getAccessToken, removeAccessToken } from "@/admin/apiProvider/utils/token";
import { DelayedJobDto } from "./jobService/jobServiceSchemas";
import JobsSlice from "@/store/jobsSlice";
import { resolveUrl as resolveV3Url } from "./utils";

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
  dashboard: dashboardServiceUrl,
  boundingBoxes: researchServiceUrl
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

export const getStableQuery = (queryParams?: FetchParams, replaceEmptyBrackets = true) => {
  if (queryParams == null) return "";

  const keys = Object.keys(queryParams);
  if (keys.length === 0) return "";

  // qs will gleefully stringify null and undefined values as `key=` if you leave the key in place.
  // For our implementation, we never want to send the empty key to the server in the query, so
  // delete any keys that have such a value.
  for (const key of keys) {
    if (queryParams[key] == null) delete queryParams[key];
  }
  // guarantee order of array query params.
  for (const value of Object.values(queryParams)) {
    if (Array.isArray(value)) value.sort();
  }

  const query = qs.stringify(queryParams, { arrayFormat: "indices", sort: (a, b) => a.localeCompare(b) });
  if (query.length === 0) return query;
  return `?${replaceEmptyBrackets ? query.replace(/%5B%5D/g, "") : query}`;
};

const getStablePathAndQuery = (url: string, queryParams: FetchParams = {}, pathParams: FetchParams = {}) => {
  const query = getStableQuery(queryParams, false);
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
    return isErrorState(pending) ? pending : undefined;
  };
}

export function completeSelector<TQueryParams extends FetchParams, TPathParams extends FetchParams>({
  url,
  method,
  pathParams,
  queryParams
}: SelectorOptions<TQueryParams, TPathParams>) {
  const fullUrl = resolveUrl(url, queryParams, pathParams);
  return (store: ApiDataStore) => {
    const pending = store.meta.pending[method.toUpperCase() as Method][fullUrl];
    return isCompletedCreationState(pending) ? pending : undefined;
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

async function dispatchRequest<TData, TError>(url: string, requestInit: RequestInit) {
  const actionPayload = { url, method: requestInit.method as Method };
  ApiSlice.fetchStarting(actionPayload);

  try {
    const response = await fetch(url, requestInit);

    if (!response.ok) {
      const error = (await response.json()) as ErrorWrapper<TError>;
      ApiSlice.fetchFailed({ ...actionPayload, error: error as PendingError });

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
    }

    if (responsePayload?.data?.attributes?.uuid && responsePayload?.data?.type == "delayedJobs") {
      return await processDelayedJob<TData>(
        requestInit?.signal!,
        responsePayload?.data?.attributes?.uuid,
        actionPayload
      );
    }

    ApiSlice.fetchSucceeded({ ...actionPayload, response: responsePayload });
    return responsePayload;
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

/**
 * Execute a request to the v3 backend. Returns the client-side-only request ID string. If undefined
 * is returned, it indicates the request was not sent because it is already pending.
 */
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
  const token = Object.values(ApiSlice.currentState.logins)?.[0]?.attributes?.token;
  if (!requestHeaders?.Authorization && token != null) {
    // Always include the JWT access token if we have one.
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // As the fetch API is being used, when multipart/form-data is specified
  // the Content-Type header must be deleted so that the browser can set
  // the correct boundary.
  // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object
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

const JOB_POLL_TIMEOUT = 500; // in ms

type JobResult = { data: { attributes: DelayedJobDto } };

async function loadJob(
  signal: AbortSignal | undefined,
  delayedJobId: string,
  retries = 3,
  actionPayload: { url: string; method: Method }
): Promise<JobResult> {
  let response, error;
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const accessToken = typeof window !== "undefined" && getAccessToken();
    if (accessToken != null) headers.Authorization = `Bearer ${accessToken}`;

    const url = resolveV3Url(`/jobs/v3/delayedJobs/${delayedJobId}`);
    response = await fetch(url, { signal, headers });

    // Retry logic for handling 502 Bad Gateway errors
    // When requesting the job status from the server, a 502 Bad Gateway error may occur. This error should be temporary,
    // retrying the request after a short delay might return the correct response.
    // If the server responds with a 502 status and there are remaining retries, then try to reload the job status.
    if (response.status === 502 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, JOB_POLL_TIMEOUT));
      return loadJob(signal, delayedJobId, retries - 1, actionPayload); // Retry
    }

    if (!response.ok) {
      try {
        error = {
          statusCode: response.status,
          ...(await response.json())
        };
      } catch (e) {
        error = { statusCode: -1 };
      }

      throw error;
    }

    const jsonResponse = await response.json();
    ApiSlice.fetchSucceeded({ ...actionPayload, response: jsonResponse });
    return jsonResponse;
  } catch (e: unknown) {
    Log.error("Delayed Job Fetch error", e);

    if (typeof e === "object" && e !== null) {
      const errorMessage = (e as { message?: string }).message ?? "";
      const statusCode = (e as { statusCode?: number }).statusCode ?? -1;

      const isNetworkError = errorMessage.includes("network changed") || errorMessage.includes("Failed to fetch");

      if ((isNetworkError || statusCode === -1 || statusCode === 401) && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 4 * JOB_POLL_TIMEOUT));
        return loadJob(signal, delayedJobId, retries - 1, actionPayload);
      }
    }

    throw error;
  }
}

async function processDelayedJob<TData>(
  signal: AbortSignal | undefined,
  delayedJobId: string,
  actionPayload: { url: string; method: Method }
): Promise<TData> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const accessToken = typeof window !== "undefined" && getAccessToken();
  if (accessToken != null) headers.Authorization = `Bearer ${accessToken}`;

  let jobResult;
  for (
    jobResult = await loadJob(signal, delayedJobId, 3, actionPayload);
    jobResult.data?.attributes?.status === "pending";
    jobResult = await loadJob(signal, delayedJobId, 3, actionPayload)
  ) {
    const { totalContent, processedContent, progressMessage } = jobResult.data?.attributes;
    const effectiveTotalContent =
      jobResult.data?.attributes?.status === "pending" && totalContent === null ? 1 : totalContent ?? 0;
    JobsSlice.setJobsProgress(effectiveTotalContent, processedContent ?? 0, progressMessage);

    if (signal?.aborted) throw new Error("Aborted");
    await new Promise(resolve => setTimeout(resolve, JOB_POLL_TIMEOUT));
  }

  const { status, statusCode, payload } = jobResult.data!.attributes;
  if (status === "failed") throw { statusCode, ...payload };

  return payload as TData;
}
