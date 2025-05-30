import { createSelector } from "reselect";

import {
  userCreation,
  usersFind,
  UsersFindVariables,
  userUpdate
} from "@/generated/v3/userService/userServiceComponents";
import { UserDto, UserNewRequest, UserUpdateAttributes } from "@/generated/v3/userService/userServiceSchemas";
import {
  userCreationFetchFailed,
  userCreationIsFetching,
  usersFindFetchFailed,
  userUpdateFetchFailed
} from "@/generated/v3/userService/userServiceSelectors";
import { selectFirstLogin } from "@/generated/v3/utils";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type ValidLocale = Exclude<UserUpdateAttributes["locale"], null>;

export type UserConnection = {
  user?: UserDto;
  userLoadFailed: boolean;
  isAdmin: boolean;
  isFunderOrGovernment: boolean;

  userUpdateFailed: boolean;
  setLocale?: (locale: ValidLocale) => void;

  /** Used internally by the connection to determine if an attempt to load users/me should happen or not. */
  isLoggedIn: boolean;
};

const selectMeId = (store: ApiDataStore) => store.meta.meUserId;
const selectUsers = (store: ApiDataStore) => store.users;
export const selectMe = createSelector([selectMeId, selectUsers], (meId, users) =>
  meId == null ? undefined : users?.[meId]
);
const userUpdateSelector = selectorCache(
  ({ uuid }: { uuid: string }) => uuid,
  ({ uuid }) =>
    createSelector([userUpdateFetchFailed({ pathParams: { uuid } })], userFindFailure => ({ userFindFailure }))
);
const selectMeUpdateFailure = (store: ApiDataStore) => {
  const user = selectMe(store);
  if (user == null) return undefined;

  return userUpdateSelector(store, user.attributes);
};

const isAdmin = (user?: UserDto) =>
  (user?.primaryRole === "project-manager" || user?.primaryRole.includes("admin")) ?? false;
const isFunderOrGovernment = (user?: UserDto) => user?.primaryRole === "funder" || user?.primaryRole === "government";

const FIND_ME: UsersFindVariables = { pathParams: { uuid: "me" } };

const updateUser = (uuid: string, update: UserUpdateAttributes) => {
  userUpdate({ pathParams: { uuid }, body: { data: { id: uuid, type: "users", attributes: update } } });
};

const myUserConnection: Connection<UserConnection> = {
  load: ({ isLoggedIn, user }) => {
    if (user == null && isLoggedIn) usersFind(FIND_ME);
  },

  isLoaded: ({ user, userLoadFailed, isLoggedIn }) => !isLoggedIn || userLoadFailed || user != null,

  selector: createSelector(
    [selectMe, selectFirstLogin, usersFindFetchFailed(FIND_ME), selectMeUpdateFailure],
    (resource, firstLogin, userLoadFailure, userUpdateFailure) => ({
      user: resource?.attributes,
      userLoadFailed: userLoadFailure != null,
      isLoggedIn: firstLogin?.token != null,
      isAdmin: isAdmin(resource?.attributes),
      isFunderOrGovernment: isFunderOrGovernment(resource?.attributes),
      userUpdateFailed: userUpdateFailure != null,

      setLocale:
        resource == null ? undefined : (locale: ValidLocale) => updateUser(resource.attributes.uuid, { locale })
    })
  )
};

export const selectUserCreation = (store: ApiDataStore) => Object.values(store.users)?.[0]?.attributes;

type UserCreationConnection = {
  isLoading: boolean;
  requestFailed: PendingErrorState | null;
  isSuccess: boolean;
  emailNewUser: string;
  signUp: (newUSer: UserNewRequest) => void;
};

const userCreationConnection: Connection<UserCreationConnection> = {
  selector: createSelector(
    [userCreationIsFetching, userCreationFetchFailed, selectUserCreation],
    (isLoading, requestFailed, selector) => ({
      isLoading,
      requestFailed,
      isSuccess: selector?.emailAddress != null,
      emailNewUser: selector?.emailAddress,
      signUp: (newUser: UserNewRequest) => userCreation({ body: newUser })
    })
  )
};

export const useMyUser = connectionHook(myUserConnection);
export const loadMyUser = connectionLoader(myUserConnection);
export const useUserCreation = connectionHook(userCreationConnection);
