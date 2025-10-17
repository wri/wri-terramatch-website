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
import { Dictionary, isObject } from "lodash";
import qs, { ParsedQs } from "qs";
import { getAccessToken, removeAccessToken } from "@/admin/apiProvider/utils/token";
import { DelayedJobDto } from "./jobService/jobServiceSchemas";
import JobsSlice from "@/store/jobsSlice";
import { resolveUrl as resolveV3Url } from "./utils";

export type ErrorPayload = { statusCode: number; message: string };
export type ErrorWrapper<TError extends undefined | { payload: ErrorPayload }> =
  | (TError extends undefined ? undefined : NonNullable<TError>["payload"])
  | { statusCode: -1; message: string };

export type TranslatableError = ErrorPayload & { code: string; variables?: Dictionary<any> };
export const isTranslatableError = (payload: ErrorPayload): payload is TranslatableError =>
  (payload as TranslatableError).code != null;

const V3_NAMESPACES: Record<string, string> = {
  auth: userServiceUrl,
  boundingBoxes: researchServiceUrl,
  validations: researchServiceUrl,
  entities: entityServiceUrl,
  forms: entityServiceUrl,
  dashboard: dashboardServiceUrl,
  jobs: jobServiceUrl,
  organisations: userServiceUrl,
  research: researchServiceUrl,
  trees: entityServiceUrl,
  users: userServiceUrl
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
  for (const [key, value] of Object.entries(queryParams)) {
    // Copy the array in case the original is read only.
    if (Array.isArray(value)) queryParams[key] = [...value].sort() as FetchParamValue[] | FetchParams[];
  }

  const query = qs.stringify(queryParams, { arrayFormat: "indices", sort: (a, b) => a.localeCompare(b) });
  if (query.length === 0) return query;
  return `?${replaceEmptyBrackets ? query.replace(/%5B%5D/g, "") : query}`;
};

const getStablePathAndQuery = (url: string, queryParams: FetchParams = {}, pathParams: FetchParams = {}) => {
  const query = getStableQuery(queryParams, false);
  return `${url.replace(/\{\w*}/g, key => pathParams[key.slice(1, -1)] as string)}${query}`;
};

export const resolveUrl = <TQueryParams extends {}, TPathParams extends {}>(
  url: string,
  { queryParams, pathParams }: UrlVariables<TQueryParams, TPathParams> = {}
) => `${getBaseUrl(url)}${getStablePathAndQuery(url, queryParams, pathParams)}`;

export type UrlVariables<TQueryParams extends {}, TPathParams extends {}> = {
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
};
export type RequestVariables<
  TQueryParams extends {} = {},
  TPathParams extends {} = {},
  TBody extends {} | FormData | undefined | null = {}
> = UrlVariables<TQueryParams, TPathParams> & { body?: TBody };

type RequestBody = {
  data?: { type: ResourceType; attributes?: Dictionary<unknown> };
};

export class V3ApiEndpoint<
  TResponse = unknown,
  TError extends ErrorPayload | undefined = ErrorPayload,
  TVariables extends RequestVariables = RequestVariables,
  THeaders extends {} = {}
> {
  constructor(readonly url: string, readonly method: Method) {}

  fetch(variables: TVariables, headers?: THeaders) {
    if (isPending(this.method, resolveUrl(this.url, variables))) {
      // Ignore requests to issue an API request that is in progress or has failed without a cache
      // clear.
      return;
    }

    // The promise is ignored on purpose. Further progress of the request is tracked through
    // redux.
    this.executeRequest(variables, headers);
  }

  /**
   * Provides a way to execute create requests in parallel. Important things to note:
   *  - This method ignores the pending store when dispatching the request. This means that the
   *    selectors provided on V3ApiEndpoint are not useful for these requests because if multiple
   *    requests are in flight at once, they will overwrite each other's state in the pending store
   *  - This method will throw an error without executing the request if it is used with an endpoint
   *    that uses a method other than POST
   *  - Most endpoints should be using the fetch() method above via the apiConnectionFactory. This
   *    approach is _only_ meant to be used for endpoints that support multiple in flight requests
   *    at the same time (like media upload) and ignore the protections built into the pending request
   *    store in Redux.
   *  - The response payload from this request will be returned from this method (and errors will be
   *    thrown). The resources returned will also be stored in the redux store as usual, and may be
   *    accessed by other connections.
   */
  async fetchParallel(variables: TVariables, headers?: THeaders): Promise<TResponse> {
    if (this.method !== "POST") throw new Error("fetchParallel may only be used with create endpoints.");
    return await this.executeRequest(variables, headers);
  }

  isFetchingSelector(variables: Omit<RequestVariables, "body">) {
    const fullUrl = resolveUrl(this.url, variables);
    return (store: ApiDataStore) => isInProgress(store.meta.pending[this.method.toUpperCase() as Method][fullUrl]);
  }

  fetchFailedSelector(variables: Omit<RequestVariables, "body">) {
    const fullUrl = resolveUrl(this.url, variables);
    return (store: ApiDataStore) => {
      const pending = store.meta.pending[this.method][fullUrl];
      return isErrorState(pending) ? pending : undefined;
    };
  }

  indexMetaSelector(resource: ResourceType, variables: Omit<RequestVariables, "body">) {
    // Some query params get specified as a single indexed key like `page[number]`, and some get
    // specified as a complex object like `sideloads: [{ entity: "sites", pageSize: 5 }]`, and running
    // what we get through qs stringify / parse will normalize it.
    const normalizedQuery = qs.parse(qs.stringify(variables.queryParams), { arrayLimit: 1000 });
    const queryKeys = Object.keys(normalizedQuery);
    const pageNumber = Number(queryKeys.includes("page") ? (normalizedQuery.page as ParsedQs).number : 1);
    if (queryKeys.includes("page") && (normalizedQuery.page as ParsedQs).number != null) {
      delete (normalizedQuery.page as ParsedQs).number;
    }
    if (queryKeys.includes("sideloads")) {
      delete normalizedQuery.sideloads;
    }

    const stableUrl = getStablePathAndQuery(this.url, normalizedQuery, variables.pathParams);
    return (store: ApiDataStore) => store.meta.indices[resource][stableUrl]?.[pageNumber];
  }

  completeSelector(variables: Omit<RequestVariables, "body">) {
    const fullUrl = resolveUrl(this.url, variables);
    return (store: ApiDataStore) => {
      const pending = store.meta.pending[this.method][fullUrl];
      return isCompletedCreationState(pending) ? pending : undefined;
    };
  }

  private async executeRequest(variables: TVariables, headers?: THeaders) {
    const fullUrl = resolveUrl(this.url, variables);

    // If the attributes of the request body includes a FormData member, stuff the rest of the attributes
    // into the formdata and replace the body with the form data instance.
    if (variables.body != null && (variables.body as RequestBody).data?.attributes?.formData instanceof FormData) {
      const { type, attributes } = (variables.body as RequestBody).data!;
      const { formData, ...otherAttributes } = attributes as { formData: FormData };
      formData.append("type", type);
      formData.append("data", JSON.stringify(otherAttributes));
      variables.body = formData;
    }

    const requestHeaders: HeadersInit = { ...headers };
    // As the fetch API is being used, when multipart/form-data is specified the Content-Type header
    // must be left off so that the browser can set the correct boundary.
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object
    if (!(variables.body instanceof FormData)) requestHeaders["Content-Type"] = "application/json";

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

    if (requestHeaders["Content-Type"].toLowerCase().includes("multipart/form-data")) {
      delete requestHeaders["Content-Type"];
    }

    return await dispatchRequest<TResponse>(fullUrl, {
      method: this.method,
      body:
        variables.body == null
          ? undefined
          : variables.body instanceof FormData
          ? variables.body
          : JSON.stringify(variables.body),
      headers: requestHeaders
    });
  }
}

const isPending = (method: Method, fullUrl: string) => ApiSlice.currentState.meta.pending[method][fullUrl] != null;

const isPendingError = (error: any): error is PendingError => {
  if (!isObject(error) || error instanceof Error) return false;
  const pending = error as PendingError;
  return pending.statusCode != null && pending.message != null;
};

// NOTE: logout and selectFirstLogin are provided in this file instead of the Login.ts connection file
// in order to avoid importing anything from connections in this file, which can cause a circular
// dependency resolution problem.

export const logout = () => {
  removeAccessToken();
  // When we log out, remove all cached API resources so that when we log in again, these resources
  // are freshly fetched from the BE.
  ApiSlice.clearApiCache();
};

async function dispatchRequest<TData>(url: string, requestInit: RequestInit) {
  const actionPayload = { url, method: requestInit.method as Method };
  ApiSlice.fetchStarting(actionPayload);

  try {
    const response = await fetch(url, requestInit);

    if (!response.ok) {
      if (url.endsWith("/users/me") && response.status === 401) {
        // If the users/me fetch is unauthorized, our login has timed out and we need to transition
        // to a logged out state.
        logout();
      }

      throw await response.json();
    }

    if (!response.headers.get("content-type")?.includes("json")) {
      // this API integration only supports JSON type responses at the moment.
      throw new Error(`Response type is not JSON [${response.headers.get("content-type")}]`);
    }

    const responsePayload = await response.json();
    if (isPendingError(responsePayload)) throw responsePayload;

    if (responsePayload?.data?.attributes?.uuid && responsePayload?.data?.type == "delayedJobs") {
      return await processDelayedJob<TData>(responsePayload?.data?.attributes?.uuid, actionPayload);
    }

    ApiSlice.fetchSucceeded({ ...actionPayload, response: responsePayload });
    return responsePayload;
  } catch (e) {
    if (isPendingError(e)) {
      // This was an error response from the server
      ApiSlice.fetchFailed({ ...actionPayload, error: e });
      throw e;
    }

    Log.error("Unexpected API fetch failure", e);
    const error = { statusCode: -1, message: e instanceof Error ? `Network error (${e.message})` : "Network error" };
    ApiSlice.fetchFailed({ ...actionPayload, error });
    throw error;
  }
}

const JOB_POLL_TIMEOUT = 500; // in ms

type JobResult = { data: { attributes: DelayedJobDto } };

async function loadJob(
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
    response = await fetch(url, { headers });

    // Retry logic for handling 502 Bad Gateway errors
    // When requesting the job status from the server, a 502 Bad Gateway error may occur. This error should be temporary,
    // retrying the request after a short delay might return the correct response.
    // If the server responds with a 502 status and there are remaining retries, then try to reload the job status.
    if (response.status === 502 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, JOB_POLL_TIMEOUT));
      return loadJob(delayedJobId, retries - 1, actionPayload); // Retry
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
        return loadJob(delayedJobId, retries - 1, actionPayload);
      }
    }

    throw error;
  }
}

async function processDelayedJob<TData>(
  delayedJobId: string,
  actionPayload: { url: string; method: Method }
): Promise<TData> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const accessToken = typeof window !== "undefined" && getAccessToken();
  if (accessToken != null) headers.Authorization = `Bearer ${accessToken}`;

  let jobResult;
  for (
    jobResult = await loadJob(delayedJobId, 3, actionPayload);
    jobResult.data?.attributes?.status === "pending";
    jobResult = await loadJob(delayedJobId, 3, actionPayload)
  ) {
    const { totalContent, processedContent, progressMessage } = jobResult.data?.attributes;
    const effectiveTotalContent =
      jobResult.data?.attributes?.status === "pending" && totalContent === null ? 1 : totalContent ?? 0;
    JobsSlice.setJobsProgress(effectiveTotalContent, processedContent ?? 0, progressMessage);

    await new Promise(resolve => setTimeout(resolve, JOB_POLL_TIMEOUT));
  }

  const { status, statusCode, payload } = jobResult.data!.attributes;
  if (status === "failed") throw { statusCode, ...payload };

  return payload as TData;
}
