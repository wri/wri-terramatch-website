import { createSelector } from "reselect";

import { selectMe, useMyUser } from "@/connections/User";
import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "@/connections/util/resourceMutator";
import {
  organisationCreation,
  organisationDelete,
  organisationIndex,
  OrganisationIndexQueryParams,
  organisationShow,
  organisationUpdate
} from "@/generated/v3/userService/userServiceComponents";
import {
  OrganisationFullDto,
  OrganisationLightDto,
  OrganisationUpdateAttributes
} from "@/generated/v3/userService/userServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { ApiDataStore } from "@/store/apiSlice";
import { Connected, Connection, Filter } from "@/types/connection";

type OrganisationConnection = {
  organisation?: OrganisationLightDto | OrganisationFullDto;
};

type UserStatus = "approved" | "rejected" | "requested";
export type MyOrganisationConnection = OrganisationConnection & {
  organisationId?: string;
  userStatus?: UserStatus;
};

const selectOrganisations = (store: ApiDataStore) => store.organisations;

const myOrganisationConnection: Connection<MyOrganisationConnection> = {
  selector: createSelector([selectMe, selectOrganisations], (user, orgs) => {
    const { id, meta } = user?.relationships?.org?.[0] ?? {};
    if (id == null) return {};

    return {
      organisationId: id,
      organisation: orgs?.[id]?.attributes,
      userStatus: meta?.userStatus as UserStatus
    };
  })
};

export const indexOrgsConnection = v3Resource("organisations", organisationIndex)
  .index<OrganisationLightDto>(() => ({ queryParams: { lightResource: true } }))
  .pagination()
  .filter<Filter<OrganisationIndexQueryParams>>()
  .buildConnection();

const organisationConnection = v3Resource("organisations", organisationShow)
  .singleFullResource<OrganisationFullDto & { lightResource: boolean }>(({ id }) =>
    id == null ? undefined : { pathParams: { uuid: id } }
  )
  .sideloads()
  .isLoading()
  .loadFailure()
  .update(organisationUpdate)
  .buildConnection();

const orgCreationConnection = v3Resource("organisations", organisationCreation)
  .create<OrganisationLightDto>()
  .buildConnection();

// The "myOrganisationConnection" is only valid once the users/me response has been loaded, so
// this hook depends on the myUserConnection to fetch users/me and then loads the data it needs
// from the store.
export const useMyOrg = (): Connected<MyOrganisationConnection> => {
  const [loaded] = useMyUser();
  const [, orgShape] = useConnection(myOrganisationConnection);
  return loaded ? [true, orgShape] : [false, {}];
};

export const loadOrganisation = connectionLoader(organisationConnection);
export const useOrganisation = connectionHook(organisationConnection);
export const updateOrganisation = resourceUpdater(
  organisationConnection as unknown as Connection<
    import("@/connections/util/apiConnectionFactory").DataConnection<OrganisationFullDto> &
      import("@/connections/util/apiConnectionFactory").LoadFailureConnection &
      import("@/connections/util/apiConnectionFactory").UpdateConnection<OrganisationUpdateAttributes>,
    { id?: string }
  >
);
export const deleteOrganisation = deleterAsync("organisations", organisationDelete, uuid => ({
  pathParams: { uuid }
}));

export const loadOrganisations = connectionLoader(indexOrgsConnection);
export const useOrganisations = connectionHook(indexOrgsConnection);

export const createOrg = resourceCreator(orgCreationConnection);
export const useOrgCreate = connectionHook(orgCreationConnection);
