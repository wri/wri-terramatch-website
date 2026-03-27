import { createSelector } from "reselect";

import { loginConnection } from "@/connections/Login";
import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader, selectConnection } from "@/connections/util/connectionShortcuts";
import {
  userCreation,
  userDelete,
  userIndex,
  UserIndexQueryParams,
  usersFind,
  UsersFindVariables,
  userUpdate
} from "@/generated/v3/userService/userServiceComponents";
import { UserDto, UserUpdateAttributes } from "@/generated/v3/userService/userServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection, Filter } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

import { deleterAsync } from "./util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "./util/resourceMutator";

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
    createSelector([userUpdate.fetchFailedSelector({ pathParams: { uuid } })], userFindFailure => ({ userFindFailure }))
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
  userUpdate.fetch({ pathParams: { uuid }, body: { data: { id: uuid, type: "users", attributes: update } } });
};

const myUserConnection: Connection<UserConnection> = {
  load: ({ isLoggedIn, user }) => {
    if (user == null && isLoggedIn) usersFind.fetch(FIND_ME);
  },

  isLoaded: ({ user, userLoadFailed, isLoggedIn }) => !isLoggedIn || userLoadFailed || user != null,

  selector: createSelector(
    [selectMe, selectConnection(loginConnection, {}), usersFind.fetchFailedSelector(FIND_ME), selectMeUpdateFailure],
    (resource, { data: login }, userLoadFailure, userUpdateFailure) => ({
      user: resource?.attributes,
      userLoadFailed: userLoadFailure != null,
      isLoggedIn: login?.token != null,
      isAdmin: isAdmin(resource?.attributes),
      isFunderOrGovernment: isFunderOrGovernment(resource?.attributes),
      userUpdateFailed: userUpdateFailure != null,

      setLocale:
        resource == null ? undefined : (locale: ValidLocale) => updateUser(resource.attributes.uuid, { locale })
    })
  )
};

const userCreationConnection = v3Resource("users", userCreation).create<UserDto>().buildConnection();

const userIndexConnection = v3Resource("users", userIndex)
  .index<UserDto & { lightResource: boolean }>()
  .pagination()
  .filter<Filter<UserIndexQueryParams>>()
  .buildConnection();

const userConnection = v3Resource("users", usersFind)
  .singleFullResource<UserDto & { lightResource: boolean }>(({ id }) =>
    id == null ? undefined : { pathParams: { uuid: id } }
  )
  .update(userUpdate)
  .buildConnection();

export const deleteUser = deleterAsync("users", userDelete, uuid => ({ pathParams: { uuid } }));

export const createUser = resourceCreator(userCreationConnection);
export const updateUserResource = resourceUpdater(userConnection);
export const useUser = connectionHook(userConnection);
export const loadUser = connectionLoader(userConnection);
export const useUserIndex = connectionHook(userIndexConnection);
export const loadUserIndex = connectionLoader(userIndexConnection);

export const useMyUser = connectionHook(myUserConnection);
export const loadMyUser = connectionLoader(myUserConnection);
export const useUserCreation = connectionHook(userCreationConnection);
