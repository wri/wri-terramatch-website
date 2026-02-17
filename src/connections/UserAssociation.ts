import {
  createUserAssociation,
  CreateUserAssociationPathParams,
  deleteUserAssociation,
  getUserAssociation,
  GetUserAssociationPathParams,
  GetUserAssociationQueryParams
} from "@/generated/v3/userService/userServiceComponents";
import { UserAssociationDto } from "@/generated/v3/userService/userServiceSchemas";
import { resolveUrl } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";

import { v3Resource } from "./util/apiConnectionFactory";
import { connectionHook } from "./util/connectionShortcuts";

const userAssociationConnection = v3Resource("associatedUsers", getUserAssociation)
  .index<UserAssociationDto, GetUserAssociationPathParams>(({ uuid }) => ({ pathParams: { uuid } }))
  .filter<GetUserAssociationQueryParams>()
  .buildConnection();

export const useUserAssociations = connectionHook(userAssociationConnection);

export const bulkDeleteUserAssociations = async (projectUuid: string, uuids: string[]): Promise<void> => {
  const failureSelector = deleteUserAssociation.fetchFailedSelector({});
  const previousFailure = failureSelector(ApiSlice.currentState);
  if (previousFailure != null) {
    ApiSlice.clearPending(resolveUrl(deleteUserAssociation.url, {}), deleteUserAssociation.method);
  }

  deleteUserAssociation.fetch({ pathParams: { uuid: projectUuid }, queryParams: { uuids } });

  await new Promise<void>((resolve, reject) => {
    const unsubscribe = ApiSlice.redux.subscribe(() => {
      const currentState = ApiSlice.currentState;
      const deleted = currentState.meta.deleted.associatedUsers ?? [];
      const allDeleted = uuids.every(uuid => deleted.includes(uuid));
      const failure = failureSelector(currentState);

      if (allDeleted) {
        unsubscribe();
        resolve();
      } else if (failure != null) {
        unsubscribe();
        reject(failure);
      }
    });
  });

  ApiSlice.pruneCache("associatedUsers");
  ApiSlice.pruneIndex("associatedUsers", "");
};

const userAssociationCreationConnection = v3Resource("associatedUsers", createUserAssociation)
  .create<UserAssociationDto, CreateUserAssociationPathParams>(({ uuid }) => ({ pathParams: { uuid } }))
  .buildConnection();

export const useUserAssociationCreation = connectionHook(userAssociationCreationConnection);
