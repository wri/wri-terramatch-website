import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import {
  UsersFindPathParams,
  UsersFindVariables,
  UserUpdatePathParams,
  UserUpdateVariables
} from "./userServiceComponents";

export const authLoginIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/auth/v3/logins", method: "post" });

export const authLoginFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/auth/v3/logins", method: "post" });

export const usersFindIsFetching = (variables: Omit<UsersFindVariables, "body">) => (store: ApiDataStore) =>
  isFetching<{}, UsersFindPathParams>({ store, url: "/users/v3/users/{uuid}", method: "get", ...variables });

export const usersFindFetchFailed = (variables: Omit<UsersFindVariables, "body">) => (store: ApiDataStore) =>
  fetchFailed<{}, UsersFindPathParams>({ store, url: "/users/v3/users/{uuid}", method: "get", ...variables });

export const userUpdateIsFetching = (variables: Omit<UserUpdateVariables, "body">) => (store: ApiDataStore) =>
  isFetching<{}, UserUpdatePathParams>({ store, url: "/users/v3/users/{uuid}", method: "patch", ...variables });

export const userUpdateFetchFailed = (variables: Omit<UserUpdateVariables, "body">) => (store: ApiDataStore) =>
  fetchFailed<{}, UserUpdatePathParams>({ store, url: "/users/v3/users/{uuid}", method: "patch", ...variables });
