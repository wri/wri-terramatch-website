import { createSelector } from "reselect";

import { removeAccessToken } from "@/admin/apiProvider/utils/token";
import { authLogin } from "@/generated/v3/userService/userServiceComponents";
import { authLoginFetchFailed, authLoginIsFetching } from "@/generated/v3/userService/userServicePredicates";
import ApiSlice, { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";

type LoginConnection = {
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  loginFailed: boolean;
  token?: string;
};

export const login = (emailAddress: string, password: string) => authLogin({ body: { emailAddress, password } });
export const logout = () => {
  removeAccessToken();
  // When we log out, remove all cached API resources so that when we log in again, these resources
  // are freshly fetched from the BE.
  ApiSlice.clearApiCache();
};

const selectFirstLogin = (state: ApiDataStore) => {
  const values = Object.values(state.logins);
  return values.length < 1 ? null : values[0];
};

export const loginConnection: Connection<LoginConnection> = {
  selector: createSelector(
    [authLoginIsFetching, authLoginFetchFailed, selectFirstLogin],
    (isLoggingIn, failedLogin, firstLogin) => {
      return {
        isLoggingIn,
        isLoggedIn: firstLogin != null,
        loginFailed: failedLogin != null,
        token: firstLogin?.token
      };
    }
  )
};
