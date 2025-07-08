import { connectionHook, connectionSelector } from "@/connections/util/connectionShortcuts";
import { authLogin, AuthLoginVariables } from "@/generated/v3/userService/userServiceComponents";
import { LoginDto } from "@/generated/v3/userService/userServiceSchemas";
import {
  AUTH_LOGIN_URL,
  authLoginComplete,
  authLoginFetchFailed,
  authLoginIsFetching
} from "@/generated/v3/userService/userServiceSelectors";

import { ApiConnectionFactory } from "./util/apiConnectionFactory";

export const loginConnection = ApiConnectionFactory.create<LoginDto, AuthLoginVariables>(
  "logins",
  authLogin,
  authLoginIsFetching,
  authLoginFetchFailed,
  authLoginComplete,
  AUTH_LOGIN_URL
).buildConnection();

export const useLogin = connectionHook(loginConnection);
export const selectLogin = connectionSelector(loginConnection);
