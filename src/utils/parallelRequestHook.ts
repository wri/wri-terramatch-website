import { CreateAttributes } from "@/connections/util/apiConnectionFactory";
import { ErrorWrapper, RequestVariables, V3ApiEndpoint } from "@/generated/v3/utils";
import { ResourceType } from "@/store/apiSlice";

type RequestOptions<TResponse, TError, TVariables extends RequestVariables> = {
  onSuccess?: (response: TResponse, attributes: CreateAttributes<TVariables>) => void;
  onError?: (error: ErrorWrapper<TError>, attributes: CreateAttributes<TVariables>) => void;
  isMultipart?: boolean;
};

/**
 * Creates a hook that can be used to provide a method for running multiple resource creation
 * requests at the same time.
 *
 * This should _only_ be used for requests that require multiple requests to the same endpoint
 * to run in parallel (such as file upload).
 */
export const parallelRequestHook =
  <TResponse, TError, TVariables extends RequestVariables, THeaders extends {}>(
    resource: ResourceType,
    endpoint: V3ApiEndpoint<TResponse, TError, TVariables, THeaders>
  ) =>
  (urlVariables: Omit<TVariables, "body">) =>
  (attributes: CreateAttributes<TVariables>, options: RequestOptions<TResponse, TError, TVariables> = {}) => {
    const headers: HeadersInit = {
      "Content-Type": options.isMultipart ? "multipart/form-data" : "application/json"
    };

    let variables: TVariables;
    if (options.isMultipart) {
      const { formData, ...restAttributes } = attributes as { formData: FormData };
      formData.append("type", resource);
      formData.append("data", JSON.stringify({ attributes: restAttributes }));
      variables = { ...urlVariables, body: formData } as unknown as TVariables;
    } else {
      variables = { ...urlVariables, body: { data: { type: resource, attributes } } } as unknown as TVariables;
    }
    endpoint.fetchParallel(variables, headers as THeaders).then(
      response => {
        options.onSuccess?.(response, attributes);
      },
      error => {
        options.onError?.(error as ErrorWrapper<TError>, attributes);
      }
    );
  };
