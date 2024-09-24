import { dispatchRequest, resolveUrl } from "@/generated/v3/utils";

// This type is imported in the auto generated `userServiceComponents` file, so it needs to be
// exported from this file.
export type { ErrorWrapper } from "../utils";

export type UserServiceFetcherExtraProps = {
  /**
   * You can add some extra props to your generated fetchers.
   *
   * Note: You need to re-gen after adding the first property to
   * have the `UserServiceFetcherExtraProps` injected in `UserServiceComponents.ts`
   **/
};

export type UserServiceFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
  signal?: AbortSignal;
} & UserServiceFetcherExtraProps;

export function userServiceFetch<
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
  signal
}: UserServiceFetcherOptions<TBody, THeaders, TQueryParams, TPathParams>) {
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers
  };

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
  dispatchRequest<TData, TError>(resolveUrl(url, queryParams, pathParams), {
    signal,
    method: method.toUpperCase(),
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    headers: requestHeaders
  });
}
