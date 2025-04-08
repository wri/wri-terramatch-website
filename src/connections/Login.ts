import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
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
  const hasRedirected = useRef(false);
  const isRouterReady = useRef(false);

  useEffect(() => {
    if (router.isReady) {
      isRouterReady.current = true;
    }
  }, [router.isReady]);

  useEffect(() => {
    if (isLoggedIn && isRouterReady.current && !hasRedirected.current) {
      hasRedirected.current = true;

      let redirectTarget = null;

      if (returnUrl && typeof returnUrl === "string") {
        redirectTarget = decodeURIComponent(returnUrl);
      } else if (typeof window !== "undefined") {
        const savedUrl = localStorage.getItem("dashboardReturnUrl");
        if (savedUrl) {
          redirectTarget = savedUrl;
          localStorage.removeItem("dashboardReturnUrl");
        }
      }
      if (redirectTarget) {
        setTimeout(() => {
          router.push(redirectTarget);
        }, 50);
      }
    }
  }, [isLoggedIn, returnUrl, router, isRouterReady]);
};
