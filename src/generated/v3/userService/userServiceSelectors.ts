import { isFetchingSelector, fetchFailedSelector, completeSelector } from "../utils";
import {
  UsersFindPathParams,
  UsersFindVariables,
  UserUpdatePathParams,
  UserUpdateVariables,
  ResetPasswordPathParams,
  ResetPasswordVariables
} from "./userServiceComponents";

export const AUTH_LOGIN_URL = "/auth/v3/logins";

export const authLoginIsFetching = (_?: Omit<void, "body">) =>
  isFetchingSelector<{}, {}>({ url: AUTH_LOGIN_URL, method: "post" });

export const authLoginFetchFailed = (_?: Omit<void, "body">) =>
  fetchFailedSelector<{}, {}>({ url: AUTH_LOGIN_URL, method: "post" });

export const authLoginComplete = (_?: Omit<void, "body">) =>
  completeSelector<{}, {}>({ url: AUTH_LOGIN_URL, method: "post" });

export const USERS_FIND_URL = "/users/v3/users/{uuid}";

export const usersFindIsFetching = (variables: Omit<UsersFindVariables, "body">) =>
  isFetchingSelector<{}, UsersFindPathParams>({ url: USERS_FIND_URL, method: "get", ...variables });

export const usersFindFetchFailed = (variables: Omit<UsersFindVariables, "body">) =>
  fetchFailedSelector<{}, UsersFindPathParams>({ url: USERS_FIND_URL, method: "get", ...variables });

export const USER_UPDATE_URL = "/users/v3/users/{uuid}";

export const userUpdateIsFetching = (variables: Omit<UserUpdateVariables, "body">) =>
  isFetchingSelector<{}, UserUpdatePathParams>({ url: USER_UPDATE_URL, method: "patch", ...variables });

export const userUpdateFetchFailed = (variables: Omit<UserUpdateVariables, "body">) =>
  fetchFailedSelector<{}, UserUpdatePathParams>({ url: USER_UPDATE_URL, method: "patch", ...variables });

export const USER_CREATION_URL = "/users/v3/users";

export const userCreationIsFetching = (_?: Omit<void, "body">) =>
  isFetchingSelector<{}, {}>({ url: USER_CREATION_URL, method: "post" });

export const userCreationFetchFailed = (_?: Omit<void, "body">) =>
  fetchFailedSelector<{}, {}>({ url: USER_CREATION_URL, method: "post" });

export const userCreationComplete = (_?: Omit<void, "body">) =>
  completeSelector<{}, {}>({ url: USER_CREATION_URL, method: "post" });

export const REQUEST_PASSWORD_RESET_URL = "/auth/v3/passwordResets";

export const requestPasswordResetIsFetching = (_?: Omit<void, "body">) =>
  isFetchingSelector<{}, {}>({ url: REQUEST_PASSWORD_RESET_URL, method: "post" });

export const requestPasswordResetFetchFailed = (_?: Omit<void, "body">) =>
  fetchFailedSelector<{}, {}>({ url: REQUEST_PASSWORD_RESET_URL, method: "post" });

export const requestPasswordResetComplete = (_?: Omit<void, "body">) =>
  completeSelector<{}, {}>({ url: REQUEST_PASSWORD_RESET_URL, method: "post" });

export const RESET_PASSWORD_URL = "/auth/v3/passwordResets/{token}";

export const resetPasswordIsFetching = (variables: Omit<ResetPasswordVariables, "body">) =>
  isFetchingSelector<{}, ResetPasswordPathParams>({ url: RESET_PASSWORD_URL, method: "put", ...variables });

export const resetPasswordFetchFailed = (variables: Omit<ResetPasswordVariables, "body">) =>
  fetchFailedSelector<{}, ResetPasswordPathParams>({ url: RESET_PASSWORD_URL, method: "put", ...variables });

export const VERIFY_USER_URL = "/auth/v3/verifications";

export const verifyUserIsFetching = (_?: Omit<void, "body">) =>
  isFetchingSelector<{}, {}>({ url: VERIFY_USER_URL, method: "post" });

export const verifyUserFetchFailed = (_?: Omit<void, "body">) =>
  fetchFailedSelector<{}, {}>({ url: VERIFY_USER_URL, method: "post" });

export const verifyUserComplete = (_?: Omit<void, "body">) =>
  completeSelector<{}, {}>({ url: VERIFY_USER_URL, method: "post" });
