import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import {
  UsersFindPathParams,
  UsersFindVariables,
  UserUpdatePathParams,
  UserUpdateVariables,
  ResetPasswordPathParams,
  ResetPasswordVariables
} from "./userServiceComponents";

export const authLoginIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/auth/v3/logins", method: "post" });

export const authLoginFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/auth/v3/logins", method: "post" });

export const usersFindIsFetching = (variables: UsersFindVariables) => (store: ApiDataStore) =>
  isFetching<{}, UsersFindPathParams>({ store, url: "/users/v3/users/{uuid}", method: "get", ...variables });

export const usersFindFetchFailed = (variables: UsersFindVariables) => (store: ApiDataStore) =>
  fetchFailed<{}, UsersFindPathParams>({ store, url: "/users/v3/users/{uuid}", method: "get", ...variables });

export const userUpdateIsFetching = (variables: UserUpdateVariables) => (store: ApiDataStore) =>
  isFetching<{}, UserUpdatePathParams>({ store, url: "/users/v3/users/{uuid}", method: "patch", ...variables });

export const userUpdateFetchFailed = (variables: UserUpdateVariables) => (store: ApiDataStore) =>
  fetchFailed<{}, UserUpdatePathParams>({ store, url: "/users/v3/users/{uuid}", method: "patch", ...variables });

export const requestPasswordResetIsFetching = (store: ApiDataStore) =>
  isFetching<{}, {}>({ store, url: "/auth/v3/passwordResets", method: "post" });

export const requestPasswordResetFetchFailed = (store: ApiDataStore) =>
  fetchFailed<{}, {}>({ store, url: "/auth/v3/passwordResets", method: "post" });

export const resetPasswordIsFetching = (variables: ResetPasswordVariables) => (store: ApiDataStore) =>
  isFetching<{}, ResetPasswordPathParams>({
    store,
    url: "/auth/v3/passwordResets/{token}",
    method: "put",
    ...variables
  });

export const resetPasswordFetchFailed = (variables: ResetPasswordVariables) => (store: ApiDataStore) =>
  fetchFailed<{}, ResetPasswordPathParams>({
    store,
    url: "/auth/v3/passwordResets/{token}",
    method: "put",
    ...variables
  });
