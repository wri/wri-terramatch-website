import { createSelector } from "reselect";

import { authLogin } from "@/generated/v3/userService/userServiceComponents";
import {
  AUTH_LOGIN_URL,
  authLoginFetchFailed,
  authLoginIsFetching
} from "@/generated/v3/userService/userServiceSelectors";
import { resolveUrl, selectFirstLogin } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";

type LoginConnection = {
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  loginFailed: boolean;
  token?: string;
};

export const login = (emailAddress: string, password: string) => {
  // If there was a previous failed login, we need to clear it out so that the authLogin() call below
  // doesn't get immediately stopped.
  ApiSlice.clearPending(resolveUrl(AUTH_LOGIN_URL), "POST");
  authLogin({ body: { emailAddress, password } });
};

const loginConnection: Connection<LoginConnection> = {
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
export const useLogin = connectionHook(loginConnection);
export const loadLogin = connectionLoader(loginConnection);
