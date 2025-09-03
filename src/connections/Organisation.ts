import { createSelector } from "reselect";

import { selectMe, useMyUser } from "@/connections/User";
import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { resourceCreator } from "@/connections/util/resourceCreator";
import { organisationCreation } from "@/generated/v3/userService/userServiceComponents";
import { OrganisationDto } from "@/generated/v3/userService/userServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { ApiDataStore } from "@/store/apiSlice";
import { Connected, Connection } from "@/types/connection";

type OrganisationConnection = {
  organisation?: OrganisationDto;
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

// The "myOrganisationConnection" is only valid once the users/me response has been loaded, so
// this hook depends on the myUserConnection to fetch users/me and then loads the data it needs
// from the store.
export const useMyOrg = (): Connected<MyOrganisationConnection> => {
  const [loaded] = useMyUser();
  const [, orgShape] = useConnection(myOrganisationConnection);
  return loaded ? [true, orgShape] : [false, {}];
};

const orgCreationConnection = v3Resource("organisations", organisationCreation)
  .create<OrganisationDto>()
  .buildConnection();

export const createOrg = resourceCreator(orgCreationConnection);
