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
  OrganisationShowQueryParams,
  organisationUpdate
} from "@/generated/v3/userService/userServiceComponents";
import { OrganisationFullDto, OrganisationLightDto } from "@/generated/v3/userService/userServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { ApiDataStore } from "@/store/apiSlice";
import { Connected, Connection, Filter } from "@/types/connection";

type OrganisationConnection = {
  organisation?: OrganisationLightDto;
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
  .index<OrganisationLightDto>()
  .pagination()
  .filter<Filter<OrganisationIndexQueryParams>>()
  .buildConnection();

// OrganisationFullDto from API may include lightResource even though it's not in the type
// We need lightResource to be required (not optional) for singleFullResource constraint
type OrganisationFullDtoWithLightResource = OrganisationFullDto & { lightResource: boolean };

type OrganisationConnectionProps = { id?: string; sideloads?: OrganisationShowQueryParams["sideloads"] };

const organisationConnection = v3Resource("organisations", organisationShow)
  .singleFullResource<OrganisationFullDtoWithLightResource>(({ id, sideloads }: OrganisationConnectionProps) => {
    console.log("[organisationConnection] variablesFactory called with id:", id);
    if (id == null || id === "") {
      console.log("[organisationConnection] Returning undefined (id is null or empty)");
      return undefined;
    }
    const variables: { pathParams: { uuid: string }; queryParams?: OrganisationShowQueryParams } = {
      pathParams: { uuid: id }
    };
    if (sideloads) {
      variables.queryParams = { sideloads };
    }
    console.log("[organisationConnection] Returning variables:", variables);
    return variables;
  })
  .addProps<{ sideloads?: OrganisationShowQueryParams["sideloads"] }>()
  .update(organisationUpdate)
  .buildConnection("organisationConnection");

export const useOrganisation = connectionHook(organisationConnection);
export const loadOrganisation = connectionLoader(organisationConnection);
export const updateOrganisation = resourceUpdater(organisationConnection);

export const deleteOrganisation = deleterAsync("organisations", organisationDelete, uuid => ({
  pathParams: { uuid }
}));

// The "myOrganisationConnection" is only valid once the users/me response has been loaded, so
// this hook depends on the myUserConnection to fetch users/me and then loads the data it needs
// from the store.
export const useMyOrg = (): Connected<MyOrganisationConnection> => {
  const [loaded] = useMyUser();
  const [, orgShape] = useConnection(myOrganisationConnection);
  return loaded ? [true, orgShape] : [false, {}];
};

const orgCreationConnection = v3Resource("organisations", organisationCreation)
  .create<OrganisationLightDto>()
  .buildConnection();

export const createOrg = resourceCreator(orgCreationConnection);
