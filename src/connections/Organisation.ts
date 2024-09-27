import { createSelector } from "reselect";

import { selectMe } from "@/connections/User";
import { OrganisationDto } from "@/generated/v3/userService/userServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

type OrganisationConnection = {
  organisation?: OrganisationDto;
};

type UserStatus = "approved" | "rejected" | "requested";
export type MyOrganisationConnection = OrganisationConnection & {
  organisationId?: string;
  userStatus?: UserStatus;
};

type OrganisationConnectionProps = {
  organisationId?: string;
};

const selectOrganisations = (store: ApiDataStore) => store.organisations;
const organisationSelector = (organisationId?: string) => (store: ApiDataStore) =>
  organisationId == null ? undefined : store.organisations?.[organisationId];

// TODO: This doesn't get a load/isLoaded until we have a v3 organisation get endpoint. For now we
//  have to rely on the data that is already in the store. We might not even end up needing this
//  connection, but it does illustrate nicely how to create a connection that takes props, so I'm
//  leaving it in for now.
export const organisationConnection: Connection<OrganisationConnection, OrganisationConnectionProps> = {
  selector: selectorCache(
    ({ organisationId }) => organisationId ?? "",
    ({ organisationId }) =>
      createSelector([organisationSelector(organisationId)], org => ({
        organisation: org?.attributes
      }))
  )
};

// TODO (NJC): This connection relies on the User.myUserConnection to have been mounted at some
//   point. I'd like to create a system for explicit connection dependencies, but haven't had time
//   yet. For one thing, there's no clean way to indicate that this connection isn't "loaded" when
//   the user load failed.
export const myOrganisationConnection: Connection<MyOrganisationConnection> = {
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
