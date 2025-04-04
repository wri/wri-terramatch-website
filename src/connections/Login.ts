import { useRouter } from "next/router";
import { useEffect } from "react";
import { createSelector } from "reselect";

import { authLogin } from "@/generated/v3/userService/userServiceComponents";
import { authLoginFetchFailed, authLoginIsFetching } from "@/generated/v3/userService/userServiceSelectors";
import { selectFirstLogin } from "@/generated/v3/utils";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";

type LoginConnection = {
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  loginFailed: boolean;
  token?: string;
};

export const login = (emailAddress: string, password: string) => authLogin({ body: { emailAddress, password } });

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

export const useLoginRedirect = () => {
  const router = useRouter();
  const { returnUrl } = router.query;
  const [, { isLoggedIn }] = useLogin();

  useEffect(() => {
    if (isLoggedIn) {
      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl as string));
      } else if (typeof window !== "undefined" && localStorage.getItem("dashboardReturnUrl")) {
        const savedUrl = localStorage.getItem("dashboardReturnUrl");
        localStorage.removeItem("dashboardReturnUrl");
        if (savedUrl) {
          router.push(savedUrl);
        }
      }
    }
  }, [isLoggedIn, returnUrl, router]);
};
