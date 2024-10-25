import { createSelector } from "reselect";

import { selectFirstLogin } from "@/connections/Login";
import { usersFind, UsersFindVariables } from "@/generated/v3/userService/userServiceComponents";
import { usersFindFetchFailed } from "@/generated/v3/userService/userServicePredicates";
import { UserDto } from "@/generated/v3/userService/userServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";

type UserConnection = {
  user?: UserDto;
  userLoadFailed: boolean;

  /** Used internally by the connection to determine if an attempt to load users/me should happen or not. */
  isLoggedIn: boolean;
};

const selectMeId = (store: ApiDataStore) => store.meta.meUserId;
const selectUsers = (store: ApiDataStore) => store.users;
export const selectMe = createSelector([selectMeId, selectUsers], (meId, users) =>
  meId == null ? undefined : users?.[meId]
);

const FIND_ME: UsersFindVariables = { pathParams: { id: "me" } };

export const myUserConnection: Connection<UserConnection> = {
  load: ({ isLoggedIn, user }) => {
    if (user == null && isLoggedIn) usersFind(FIND_ME);
  },

  isLoaded: ({ user, userLoadFailed, isLoggedIn }) => !isLoggedIn || userLoadFailed || user != null,

  selector: createSelector(
    [selectMe, selectFirstLogin, usersFindFetchFailed(FIND_ME)],
    (resource, firstLogin, userLoadFailure) => ({
      user: resource?.attributes,
      userLoadFailed: userLoadFailure != null,
      isLoggedIn: firstLogin?.token != null
    })
  )
};
export const useMyUser = connectionHook(myUserConnection);
export const loadMyUser = connectionLoader(myUserConnection);
