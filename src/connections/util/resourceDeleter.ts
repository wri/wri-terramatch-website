import { createSelector } from "reselect";

import { ErrorPayload, RequestVariables, resolveUrl, V3ApiEndpoint } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, ResourceType } from "@/store/apiSlice";

export const resourcesDeletedSelector = (resource: ResourceType) => (store: ApiDataStore) =>
  store.meta.deleted[resource];

/**
 * Creates a resource deletion async function for the given resource type.
 *
 * Resource deletion presents an interesting problem in the Connection system: often when a resource
 * gets deleted, the connections that depend on it will refetch their resources, or unmount the
 * child component that depended on that resource. In that case, waiting for redux state changes
 * within that child component to give feedback when the deletion is successful becomes a race
 * condition and will often fail. Therefore, for deletions, we have this utility for handling
 * deletes more gracefully.
 */
export const deleterAsync = <R, E extends ErrorPayload | undefined, V extends RequestVariables, H extends {}>(
  type: ResourceType,
  endpoint: V3ApiEndpoint<R, E, V, H>,
  variablesFactory: (id: string) => V
) => {
  /**
   * Deletes the given resource by ID. Note: on a successful deletion, the component that this
   * was called from will often be unmounted automatically. Therefore, be very careful interacting
   * with the state of the component (useState calls, etc) after this promise has completed.
   */
  return async function deleteResource(id: string) {
    const selector = createSelector(
      [resourcesDeletedSelector(type), endpoint.fetchFailedSelector(variablesFactory(id))],
      (deleted, deleteFailure) => ({
        isDeleted: id != null && deleted.includes(id),
        deleteFailure
      })
    );

    const { isDeleted, deleteFailure } = selector(ApiSlice.currentState);
    if (isDeleted) return;

    if (deleteFailure != null) {
      const variables = variablesFactory(id);
      ApiSlice.clearPending(resolveUrl(endpoint.url, variables), endpoint.method);
    }

    endpoint.fetch(variablesFactory(id));

    await new Promise<void>((resolve, reject) => {
      const unsubscribe = ApiSlice.redux.subscribe(() => {
        const { isDeleted, deleteFailure } = selector(ApiSlice.currentState);
        if (isDeleted || deleteFailure != null) {
          unsubscribe();

          if (isDeleted) {
            resolve();
          } else {
            reject(deleteFailure);
          }
        }
      });
    });
  };
};
