import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import { UsersFindPathParams, UsersFindVariables } from "./userServiceComponents";

export const authLoginIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/auth/v3/logins", method: "post" });

export const authLoginFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/auth/v3/logins", method: "post" });

export const usersFindIsFetching = (variables: UsersFindVariables) => (store: ApiDataStore) =>
  isFetching<{}, UsersFindPathParams>({ store, url: "/users/v3/users/{id}", method: "get", ...variables });

export const usersFindFetchFailed = (variables: UsersFindVariables) => (store: ApiDataStore) =>
  fetchFailed<{}, UsersFindPathParams>({ store, url: "/users/v3/users/{id}", method: "get", ...variables });

export const healthControllerCheckIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/health", method: "get" });

export const healthControllerCheckFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/health", method: "get" });
