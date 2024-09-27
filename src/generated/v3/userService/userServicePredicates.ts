import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import { UsersFindPathParams, UsersFindVariables } from "./userServiceComponents";

export const authLoginIsFetching = (state: ApiDataStore) =>
  isFetching<{}, {}>({ state, url: "/auth/v3/logins", method: "post" });

export const authLoginFetchFailed = (state: ApiDataStore) =>
  fetchFailed<{}, {}>({ state, url: "/auth/v3/logins", method: "post" });

export const usersFindIsFetching = (state: ApiDataStore, variables: UsersFindVariables) =>
  isFetching<{}, UsersFindPathParams>({ state, url: "/users/v3/users/{id}", method: "get", ...variables });

export const usersFindFetchFailed = (state: ApiDataStore, variables: UsersFindVariables) =>
  fetchFailed<{}, UsersFindPathParams>({ state, url: "/users/v3/users/{id}", method: "get", ...variables });
