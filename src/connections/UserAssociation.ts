import { createSelector } from "reselect";

import {
  acceptProjectInvite,
  createUserAssociation,
  CreateUserAssociationPathParams,
  deleteUserAssociation,
  getUserAssociation,
  GetUserAssociationPathParams,
  GetUserAssociationQueryParams,
  inviteOrganisationUser,
  updateUserAssociation
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

export const bulkDeleteUserAssociations = async (
  resourceUuid: string,
  uuids: string[],
  model: "projects" | "organisations" = "projects"
): Promise<void> => {
  await deleteUserAssociation.fetchAwait({
    pathParams: { uuid: resourceUuid, model },
    queryParams: { uuids }
  });
  ApiSlice.pruneCache("associatedUsers");
  ApiSlice.pruneIndex("associatedUsers", "");
};

export const updateOrganisationUserStatuses = async (
  organisationUuid: string,
  userUuids: string[],
  status: "approved" | "rejected"
): Promise<void> => {
  let failure: unknown;
  for (const userUuid of userUuids) {
    try {
      await updateUserAssociation.fetchAwait({
        pathParams: { model: "organisations", uuid: organisationUuid, userUuid },
        body: { data: { type: "associatedUsers", attributes: { status } } }
      });
    } catch (error) {
      failure = error;
      break;
    }
  }

  ApiSlice.pruneCache("associatedUsers");
  ApiSlice.pruneIndex("associatedUsers", "");
  if (failure != null) throw failure;
};
