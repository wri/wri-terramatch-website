import { normalizeLocale, tx } from "@transifex/native";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

import { getAccessToken } from "@/admin/apiProvider/utils/token";
import { useMyOrg } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";
import { websocketUrl } from "@/constants/environment";
import ApiSlice, { JsonApiDocument } from "@/store/apiSlice";
import Log from "@/utils/log";
import { PathMatcher, Redirect } from "@/utils/PathMatcher";

const useRedirect = () => {
  const router = useRouter();
  const [loaded, { user, isAdmin, isFunderOrGovernment }] = useMyUser();
  const [, { organisation, organisationId, userStatus }] = useMyOrg();

  return useMemo(() => {
    if (!loaded) return;

    Log.info("Calculating potential redirect", { from: router.asPath });
    const matcher = new PathMatcher(router.asPath);

    try {
      // Allow everybody to access the dashboard
      matcher.startsWith("/dashboard")?.allow();

      // Check if we're coming from a login redirection
      const isFromLogin = typeof window !== "undefined" && sessionStorage.getItem("isRedirectingFromLogin") === "true";

      // If we're specifically redirecting to /dashboard/learn-more after login, allow it
      if (isFromLogin && router.asPath === "/dashboard/learn-more") {
        matcher.allow();
        sessionStorage.removeItem("isRedirectingFromLogin");
        return;
      }

      matcher.if(user == null, () => {
        matcher.startsWith("/auth")?.allow();
        matcher.startsWith("/admin")?.redirect("/auth/login");
        matcher.exact("/")?.allow();
        matcher.redirect("/");
      });

      matcher.when(user!.emailAddressVerifiedAt == null)?.ensure(`/auth/signup/confirm?email=${user!.emailAddress}`);

      // If they were already on dashboard, they were caught by the dashboard allow() at the top.
      matcher.when(isFunderOrGovernment)?.redirect("/dashboard/learn-more?tab=about-us");

      // The standalone admin polygon review page lives outside of /admin while react-admin is
      // being removed. Let admins reach it without being forced back to the RA panel;
      // the page itself enforces admin access.
      matcher.when(/^\/site\/[^/]+\/polygon-review(?:[/?#]|$)/.test(router.asPath))?.allow();

      matcher.when(isAdmin)?.ensure("/admin");

      matcher.if(
        organisation == null,
        () => matcher.ensure("/organization/assign"),
        () => matcher.exact("/organization")?.redirect(`/organization/${organisationId}`)
      );
      matcher.when(userStatus === "requested")?.ensure("/organization/status/pending");
      matcher.if(
        organisation!.status === "draft",
        () => matcher.ensure("/organization/create"),
        () => {
          matcher.if(
            organisation!.status === "rejected",
            () => matcher.ensure("/organization/status/rejected"),
            () => matcher.startsWith("/organization/create")?.ensure("/organization/create/confirm")
          );
        }
      );

      matcher.exact("/")?.redirect("/home");
      matcher.startsWith("/auth")?.redirect("/home");
    } catch (error) {
      if (error instanceof Redirect) {
        if (error.path != null) {
          Log.info("Forcing redirect", error.path);
          router.push(error.path);
        }
      } else throw error;
    }

    // Ignoring changes to router. This should only calculate on initial page load, or when something
    // important about the current user changes. Where the user can navigate to from there is
    // determined by the navigational items available to them on the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, organisation, organisationId, user, userStatus]);
};

const useLanguageTransition = () => {
  const [, { user }] = useMyUser();
  const router = useRouter();

  useEffect(() => {
    // make sure our route contains the appropriate locale if not english.
    if (user?.locale != null && router.locale !== user.locale) {
      router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: user.locale });
    }
  }, [router, user?.locale]);

  useEffect(() => {
    const routerLocale = normalizeLocale(router.locale ?? "en");
    if (tx.getCurrentLocale() !== routerLocale) {
      Log.info("Updating in-browser locale", { normalized: routerLocale, locale: router.locale });
      tx.setCurrentLocale(routerLocale);
    }
  }, [router.locale]);
};

// For now, the socket is only used to receive model updates pushed by the server, so the socket
// is not exposed to external consumers. If we end up using it for two way communications, the socket
// should be exposed through a react context.
const useWebsocket = () => {
  const [, { user }] = useMyUser();

  useEffect(() => {
    if (user?.uuid == null) return;

    const accessToken = typeof window !== "undefined" && getAccessToken();
    if (accessToken == null) {
      Log.error(`We have a logged in user, but no access token [${user.uuid}]`);
      return;
    }

    Log.info("Connecting to websocket for user data pushes");
    const socket = io(websocketUrl, {
      autoConnect: true,
      path: "/userSockets/v3/connection",
      auth: { token: `Bearer ${accessToken}` }
    });
    socket.on("connect", () => {
      Log.info("Websocket connected");
    });
    socket.on("disconnect", () => {
      Log.info("Websocket disconnected");
    });
    socket.on("connect_error", err => {
      Log.error("Websocket error", err);
    });
    socket.on("userDataPush", (document: JsonApiDocument) => {
      ApiSlice.storeDocument(document);
    });
    socket.on("userDataReset", (document: JsonApiDocument) => {
      ApiSlice.pruneCache(document.meta.resourceType);
      ApiSlice.storeDocument(document);
    });

    return () => {
      Log.info("Disconnecting websocket");
      socket.disconnect();
    };
  }, [user?.uuid]);
};

const Bootstrap = ({ children }: PropsWithChildren) => {
  const [loaded] = useMyUser();

  useLanguageTransition();
  useRedirect();
  useWebsocket();

  // don't try to mount children until we've tried to load our own user.
  return !loaded ? null : <>{children}</>;
};

export default Bootstrap;
