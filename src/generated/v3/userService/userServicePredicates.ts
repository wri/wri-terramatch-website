import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import {
  UsersFindPathParams,
  UsersFindVariables,
  ResetPasswordPathParams,
  ResetPasswordVariables
} from "./userServiceComponents";

export const authLoginIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/auth/v3/logins", method: "post" });

export const authLoginFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/auth/v3/logins", method: "post" });

export const usersFindIsFetching = (variables: UsersFindVariables) => (store: ApiDataStore) =>
  isFetching<{}, UsersFindPathParams>({ store, url: "/users/v3/users/{id}", method: "get", ...variables });

export const usersFindFetchFailed = (variables: UsersFindVariables) => (store: ApiDataStore) =>
  fetchFailed<{}, UsersFindPathParams>({ store, url: "/users/v3/users/{id}", method: "get", ...variables });

export const requestPasswordResetIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/auth/v3/reset-password/request", method: "post" });

export const requestPasswordResetFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/auth/v3/reset-password/request", method: "post" });

export const resetPasswordIsFetching = (variables: ResetPasswordVariables) => (store: ApiDataStore) =>
  isFetching<{}, ResetPasswordPathParams>({
    store,
    url: "/auth/v3/reset-password/reset/{token}",
    method: "post",
    ...variables
  });

export const resetPasswordFetchFailed = (variables: ResetPasswordVariables) => (store: ApiDataStore) =>
  fetchFailed<{}, ResetPasswordPathParams>({
    store,
    url: "/auth/v3/reset-password/reset/{token}",
    method: "post",
    ...variables
  });
