import { createSelector } from "reselect";

import { OrganisationDto } from "@/generated/v3/userService/userServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

type OrganisationConnection = {
  organisation?: OrganisationDto;

  /**
   * Only included when this connection gets chained with a UserConnection so the meta on the
   * relationship is available.
   */
  userStatus?: "approved" | "rejected" | "requested";
};

type OrganisationConnectionProps = {
  organisationId?: string;
};

const organisationSelector = (organisationId?: string) => (store: ApiDataStore) =>
  organisationId == null ? undefined : store.organisations?.[organisationId];

export const organisationConnection: Connection<OrganisationConnection, OrganisationConnectionProps> = {
  // TODO: This doesn't get a load/isLoaded until we have a v3 organisation get endpoint. For now
  //  we have to rely on the data that gets included in the users/me response.
  selector: selectorCache(
    ({ organisationId }) => organisationId ?? "",
    ({ organisationId }) =>
      createSelector([organisationSelector(organisationId)], org => ({
        organisation: org?.attributes
      }))
  )
};
