import { isFetchingSelector, fetchFailedSelector } from "../utils";
import {
  UsersFindPathParams,
  UsersFindVariables,
  UserUpdatePathParams,
  UserUpdateVariables,
  ResetPasswordPathParams,
  ResetPasswordVariables
} from "./userServiceComponents";

export const authLoginIsFetching = isFetchingSelector<{}, {}>({ url: "/auth/v3/logins", method: "post" });

export const authLoginFetchFailed = fetchFailedSelector<{}, {}>({ url: "/auth/v3/logins", method: "post" });

export const usersFindIsFetching = (variables: Omit<UsersFindVariables, "body">) =>
  isFetchingSelector<{}, UsersFindPathParams>({ url: "/users/v3/users/{uuid}", method: "get", ...variables });

export const usersFindFetchFailed = (variables: Omit<UsersFindVariables, "body">) =>
  fetchFailedSelector<{}, UsersFindPathParams>({ url: "/users/v3/users/{uuid}", method: "get", ...variables });

export const userUpdateIsFetching = (variables: Omit<UserUpdateVariables, "body">) =>
  isFetchingSelector<{}, UserUpdatePathParams>({ url: "/users/v3/users/{uuid}", method: "patch", ...variables });

export const userUpdateFetchFailed = (variables: Omit<UserUpdateVariables, "body">) =>
  fetchFailedSelector<{}, UserUpdatePathParams>({ url: "/users/v3/users/{uuid}", method: "patch", ...variables });

export const userCreationIsFetching = isFetchingSelector<{}, {}>({ url: "/users/v3/users", method: "post" });

export const userCreationFetchFailed = fetchFailedSelector<{}, {}>({ url: "/users/v3/users", method: "post" });

export const requestPasswordResetIsFetching = isFetchingSelector<{}, {}>({
  url: "/auth/v3/passwordResets",
  method: "post"
});

export const requestPasswordResetFetchFailed = fetchFailedSelector<{}, {}>({
  url: "/auth/v3/passwordResets",
  method: "post"
});

export const resetPasswordIsFetching = (variables: Omit<ResetPasswordVariables, "body">) =>
  isFetchingSelector<{}, ResetPasswordPathParams>({
    url: "/auth/v3/passwordResets/{token}",
    method: "put",
    ...variables
  });

export const resetPasswordFetchFailed = (variables: Omit<ResetPasswordVariables, "body">) =>
  fetchFailedSelector<{}, ResetPasswordPathParams>({
    url: "/auth/v3/passwordResets/{token}",
    method: "put",
    ...variables
  });

export const verifyUserIsFetching = isFetchingSelector<{}, {}>({ url: "/auth/v3/verifications", method: "post" });

export const verifyUserFetchFailed = fetchFailedSelector<{}, {}>({ url: "/auth/v3/verifications", method: "post" });
