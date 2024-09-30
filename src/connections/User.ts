import { createSelector } from "reselect";

import { usersFind, UsersFindVariables } from "@/generated/v3/userService/userServiceComponents";
import { usersFindFetchFailed } from "@/generated/v3/userService/userServicePredicates";
import { UserDto } from "@/generated/v3/userService/userServiceSchemas";
import { ApiDataStore, Relationships } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";

type UserConnection = {
  user?: UserDto;
  userRelationships?: Relationships;
  userLoadFailed: boolean;
};

const selectMeId = (store: ApiDataStore) => store.meta.meUserId;
const selectUsers = (store: ApiDataStore) => store.users;
export const selectMe = createSelector([selectMeId, selectUsers], (meId, users) =>
  meId == null ? undefined : users?.[meId]
);

const FIND_ME: UsersFindVariables = { pathParams: { id: "me" } };

const myUserConnection: Connection<UserConnection> = {
  load: ({ user }) => {
    if (user == null) usersFind(FIND_ME);
  },

  isLoaded: ({ user, userLoadFailed }) => userLoadFailed || user != null,

  selector: createSelector([selectMe, usersFindFetchFailed(FIND_ME)], (resource, userLoadFailure) => ({
    user: resource?.attributes,
    userRelationships: resource?.relationships,
    userLoadFailed: userLoadFailure != null
  }))
};
export const useMyUser = connectionHook(myUserConnection);
export const loadMyUser = connectionLoader(myUserConnection);
