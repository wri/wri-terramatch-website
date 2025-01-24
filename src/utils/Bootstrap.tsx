import { normalizeLocale, tx } from "@transifex/native";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useMemo } from "react";

import { useMyOrg } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";
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

      matcher.if(user == null, () => {
        matcher.startsWith("/auth")?.allow();
        matcher.exact("/")?.allow();
        matcher.redirect("/");
      });

      matcher.when(user!.emailAddressVerifiedAt == null)?.ensure(`/auth/signup/confirm?email=${user!.emailAddress}`);

      // If they were already on dashboard, they were caught by the dashboard allow() at the top.
      matcher.when(isFunderOrGovernment)?.redirect("/dashboard/learn-more?tab=about-us");

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
    const routerLocale = normalizeLocale(router.locale);
    if (tx.getCurrentLocale() !== routerLocale) {
      Log.info("Updating in-browser locale", { normalized: routerLocale, locale: router.locale });
      tx.setCurrentLocale(routerLocale);
    }
  }, [router.locale]);
};

const Bootstrap = ({ children }: PropsWithChildren) => {
  const [loaded] = useMyUser();

  useLanguageTransition();
  useRedirect();

  // don't try to mount children until we've tried to load our own user.
  return !loaded ? null : <>{children}</>;
};

export default Bootstrap;
