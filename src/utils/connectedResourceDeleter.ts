import { createSelector } from "reselect";

import ApiSlice, { ApiDataStore, PendingErrorState, ResourceType } from "@/store/apiSlice";

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
export const connectedResourceDeleter = (
  type: ResourceType,
  fetchFailedSelector: (id: string) => (store: ApiDataStore) => PendingErrorState | null,
  deleteFetch: (id: string) => void
) => {
  /**
   * Deletes the given resource by ID. Note: on a successful deletion, the component that this
   * was called from will often be unmounted automatically. Therefore, be very careful interacting
   * with the state of the component (useState calls, etc) after this promise has completed.
   */
  return async function deleteResource(id: string) {
    const selector = createSelector(
      [resourcesDeletedSelector(type), fetchFailedSelector(id)],
      (deleted, deleteFailure) => ({
        isDeleted: id != null && deleted.includes(id),
        deleteFailure
      })
    );

    const { isDeleted, deleteFailure } = selector(ApiSlice.currentState);
    if (isDeleted) return;
    if (deleteFailure != null) throw deleteFailure;

    deleteFetch(id);

    await new Promise<void>((resolve, reject) => {
      const unsubscribe = ApiSlice.redux.subscribe(() => {
        const { isDeleted, deleteFailure } = selector(ApiSlice.currentState);
        if (isDeleted || deleteFailure != null) {
          unsubscribe();

          if (isDeleted) resolve();
          else reject(deleteFailure);
        }
      });
    });
  };
};
