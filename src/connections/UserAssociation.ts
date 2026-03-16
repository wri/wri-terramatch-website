import { createSelector } from "reselect";

import {
  acceptProjectInvite,
  createUserAssociation,
  CreateUserAssociationPathParams,
  deleteUserAssociation,
  getUserAssociation,
  GetUserAssociationPathParams,
  GetUserAssociationQueryParams,
  inviteOrganisationUser
} from "@/generated/v3/userService/userServiceComponents";
import {
  OrganisationInviteRequestDto,
  ProjectInviteAcceptBodyDto,
  UserAssociationDto
} from "@/generated/v3/userService/userServiceSchemas";
import { getStableIndexPath, resolveUrl } from "@/generated/v3/utils";
import ApiSlice, { PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

import { v3Resource } from "./util/apiConnectionFactory";
import { connectionHook } from "./util/connectionShortcuts";

export type InviteOrganisationUserParams = {
  emailAddress: string;
  callbackUrl?: string;
};

type InviteOrganisationUserConnection = {
  invite: (params: InviteOrganisationUserParams) => void;
  isLoading: boolean;
  inviteFailure: PendingError | undefined;
};

type InviteOrganisationUserProps = {
  organisationUuid: string;
};

const inviteOrganisationConnection: Connection<InviteOrganisationUserConnection, InviteOrganisationUserProps> = {
  selector: selectorCache(
    ({ organisationUuid }) => organisationUuid ?? "",
    ({ organisationUuid }) => {
      const pathParams =
        organisationUuid == null || organisationUuid === ""
          ? null
          : { uuid: organisationUuid, model: "organisations" as const };
      return createSelector(
        [
          pathParams != null ? inviteOrganisationUser.isFetchingSelector({ pathParams }) : () => false,
          pathParams != null ? inviteOrganisationUser.fetchFailedSelector({ pathParams }) : () => undefined,
          pathParams != null ? inviteOrganisationUser.completeSelector({ pathParams }) : () => undefined
        ],
        (isLoading, inviteFailure, inviteComplete) => {
          const invite = (params: InviteOrganisationUserParams) => {
            if (pathParams == null) return;
            if (inviteFailure != null || inviteComplete != null) {
              ApiSlice.clearPending(
                resolveUrl(inviteOrganisationUser.url, { pathParams }),
                inviteOrganisationUser.method
              );
            }
            const body = {
              emailAddress: params.emailAddress,
              ...(params.callbackUrl != null &&
                params.callbackUrl !== "" && {
                  callbackUrl: params.callbackUrl
                })
            } as OrganisationInviteRequestDto;
            inviteOrganisationUser.fetch({ pathParams, body });
          };
          return {
            invite,
            isLoading: isLoading ?? false,
            inviteFailure: inviteFailure ?? undefined
          };
        }
      );
    }
  )
};

export const useInviteOrganisationUser = connectionHook(inviteOrganisationConnection);

export const acceptProjectInviteByToken = async (token: string): Promise<void> => {
  const pathParams = { model: "projects" as const };
  const body = { token } as ProjectInviteAcceptBodyDto;
  await acceptProjectInvite.fetch({ pathParams, body });
};

const userAssociationConnection = v3Resource("associatedUsers", getUserAssociation)
  .index<UserAssociationDto, GetUserAssociationPathParams>(({ uuid }) => ({ pathParams: { uuid, model: "projects" } }))
  .filter<GetUserAssociationQueryParams>()
  .buildConnection();

export const useUserAssociations = connectionHook(userAssociationConnection);

const userAssociationCreationConnection = v3Resource("associatedUsers", createUserAssociation)
  .create<UserAssociationDto, CreateUserAssociationPathParams>(({ uuid }) => ({
    pathParams: { uuid, model: "projects" }
  }))
  .buildConnection();

export const useUserAssociationCreation = connectionHook(userAssociationCreationConnection);

export type OrganisationUserAssociationsProps = {
  organisationUuid: string;
  status?: "requested" | "approved" | "rejected";
};

const organisationUserAssociationConnection = v3Resource("associatedUsers", getUserAssociation)
  .index<UserAssociationDto, OrganisationUserAssociationsProps>(({ organisationUuid, status }) =>
    organisationUuid != null && organisationUuid !== ""
      ? {
          pathParams: { uuid: organisationUuid, model: "organisations" as const },
          queryParams: status != null ? { status } : undefined
        }
      : undefined
  )
  .refetch((props, variablesFactory) => {
    const variables = variablesFactory(props);
    if (variables == null) return;
    const { stableUrl } = getStableIndexPath(getUserAssociation.url, variables);
    ApiSlice.pruneIndex("associatedUsers", stableUrl);
  })
  .buildConnection();

export const useOrganisationUserAssociations = connectionHook(organisationUserAssociationConnection);

export const bulkDeleteUserAssociations = async (projectUuid: string, uuids: string[]): Promise<void> => {
  const failureSelector = deleteUserAssociation.fetchFailedSelector({});
  const previousFailure = failureSelector(ApiSlice.currentState);
  if (previousFailure != null) {
    ApiSlice.clearPending(resolveUrl(deleteUserAssociation.url, {}), deleteUserAssociation.method);
  }

  deleteUserAssociation.fetch({ pathParams: { uuid: projectUuid, model: "projects" }, queryParams: { uuids } });

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
