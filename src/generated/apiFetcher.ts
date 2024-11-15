import { getAccessToken } from "@/admin/apiProvider/utils/token";
import { ApiContext } from "./apiContext";
import FormData from "form-data";
import Log from "@/utils/log";
import { resolveUrl as resolveV3Url } from "./v3/utils";
import { apiBaseUrl } from "@/constants/environment";

const baseUrl = `${apiBaseUrl}/api`;

export type ErrorWrapper<TError> =
  | TError
  | {
      statusCode: number;
      errors?: APIError[];
    };

export type APIError = {
  source: string;
  detail: string;
  code: string;
  template: string;
  variables: any;
};

export type ApiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
  signal?: AbortSignal;
  noBaseUrl?: boolean;
} & ApiContext["fetcherOptions"];

export async function apiFetch<
  TData,
  TError,
  TBody extends {} | FormData | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {}
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  signal,
  noBaseUrl
}: ApiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams>): Promise<TData> {
  let response;
  let error: ErrorWrapper<TError>;
  try {
    const requestHeaders: HeadersInit = {
      "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json",
      ...headers
    };

    const accessToken = typeof window !== "undefined" && getAccessToken();

    if (!requestHeaders?.Authorization && accessToken) {
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

    response = await fetch(`${noBaseUrl ? "" : baseUrl}${resolveUrl(url, queryParams, pathParams)}`, {
      signal,
      method: method.toUpperCase(),
      // @ts-ignore
      body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
      headers: requestHeaders
    });

    if (!response.ok) {
      try {
        error = {
          statusCode: response.status,
          ...(await response.json())
        };
      } catch (e) {
        Log.error("v1/2 API Fetch error", e);
        error = {
          statusCode: -1
        };
      }

      throw error;
    }

    if (response.headers.get("content-type")?.includes("json")) {
      const payload = await response.json();
      if (payload.data?.job_uuid == null) return payload;

      return await processDelayedJob<TData>(signal, payload.data.job_uuid);
    } else {
      // if it is not a json response, assume it is a blob and cast it to TData
      return (await response.blob()) as unknown as TData;
    }
  } catch (e) {
    Log.error("v1/2 API Fetch error", e);
    error = {
      statusCode: response?.status || -1,
      //@ts-ignore
      ...(e || {})
    };
    throw error;
  }
}

const resolveUrl = (url: string, queryParams: Record<string, string> = {}, pathParams: Record<string, string> = {}) => {
  let query = new URLSearchParams(queryParams).toString();
  if (query) query = `?${query}`;
  return url.replace(/\{\w*\}/g, key => pathParams[key.slice(1, -1)]) + query;
};

const JOB_POLL_TIMEOUT = 500; // in ms

type JobResult = {
  data: {
    attributes: {
      status: "pending" | "failed" | "succeeded";
      statusCode: number | null;
      payload: object | null;
    };
  };
};

async function loadJob(signal: AbortSignal | undefined, delayedJobId: string): Promise<JobResult> {
  let response, error;
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const accessToken = typeof window !== "undefined" && getAccessToken();
    if (accessToken != null) headers.Authorization = `Bearer ${accessToken}`;

    const url = resolveV3Url(`/jobs/v3/delayedJobs/${delayedJobId}`);
    response = await fetch(url, { signal, headers });
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

    return await response.json();
  } catch (e) {
    Log.error("Delayed Job Fetch error", e);
    error = {
      statusCode: response?.status || -1,
      //@ts-ignore
      ...(e || {})
    };
    throw error;
  }
}

async function processDelayedJob<TData>(signal: AbortSignal | undefined, delayedJobId: string): Promise<TData> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const accessToken = typeof window !== "undefined" && getAccessToken();
  if (accessToken != null) headers.Authorization = `Bearer ${accessToken}`;

  let jobResult;
  for (
    jobResult = await loadJob(signal, delayedJobId);
    jobResult.data?.attributes?.status === "pending";
    jobResult = await loadJob(signal, delayedJobId)
  ) {
    if (signal?.aborted) throw new Error("Aborted");
    await new Promise(resolve => setTimeout(resolve, JOB_POLL_TIMEOUT));
  }

  const { status, statusCode, payload } = jobResult.data!.attributes;
  if (status === "failed") throw { statusCode, ...payload };

  return payload as TData;
}
