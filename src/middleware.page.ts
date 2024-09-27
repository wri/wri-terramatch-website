import * as Sentry from "@sentry/nextjs";
import { NextRequest } from "next/server";

import { isAdmin, UserRole } from "@/admin/apiProvider/utils/user";
import { myOrganisationConnection } from "@/connections/Organisation";
import { myUserConnection } from "@/connections/User";
import { makeStore } from "@/store/store";
import { loadConnection } from "@/utils/loadConnection";
import { MiddlewareCacheKey, MiddlewareMatcher } from "@/utils/MiddlewareMatcher";

//Todo: refactor this logic somewhere down the line as there are lot's of if/else nested!
export async function middleware(request: NextRequest) {
  const matcher = new MiddlewareMatcher(request);

  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const middlewareCache = request.cookies.get(MiddlewareCacheKey)?.value;

    if (!!accessToken && !!middlewareCache) {
      //If middleware result is cached bypass api call to improve performance
      matcher.when(middlewareCache.includes("admin"))?.redirect(middlewareCache);
      matcher.exact("/")?.redirect(middlewareCache);
      matcher.startWith("/auth")?.redirect(middlewareCache);
      matcher.next();

      return matcher.getResult();
    }

    await matcher.if(
      !accessToken,
      async () => {
        //Not logged-in

        matcher.startWith("/home")?.redirect("/");
        matcher.startWith("/auth")?.next();
        matcher.exact("/")?.next();

        matcher.redirect("/auth/login");
      },
      async () => {
        // Set up the redux store.
        makeStore(accessToken);

        const { user } = await loadConnection(myUserConnection);
        const { organisationId, organisation, userStatus } = await loadConnection(myOrganisationConnection);

        matcher.if(
          !user?.emailAddressVerifiedAt,
          () => {
            //Email is not verified
            matcher.redirect(`/auth/signup/confirm?email=${user?.emailAddress}`);
          },
          () => {
            //Email is verified
            const userIsAdmin = isAdmin(user?.primaryRole as UserRole);

            matcher.when(user != null && userIsAdmin)?.redirect(`/admin`, { cacheResponse: true });

            matcher
              .when(organisation != null && organisation.status !== "draft")
              ?.startWith("/organization/create")
              ?.redirect(`/organization/create/confirm`);

            matcher.when(organisation == null)?.redirect(`/organization/assign`);

            matcher.when(organisation?.status === "draft")?.redirect(`/organization/create`);

            matcher.when(userStatus === "requested")?.redirect(`/organization/status/pending`);

            matcher
              .when(organisationId != null)
              ?.exact("/organization")
              ?.redirect(`/organization/${organisationId}`);

            matcher.when(organisation?.status === "rejected")?.redirect(`/organization/status/rejected`);

            matcher.exact("/")?.redirect(`/home`);

            matcher.startWith("/auth")?.redirect("/home");

            if (!userIsAdmin && organisation?.status === "approved" && userStatus !== "requested") {
              //Cache result if user has and approved org
              matcher.next().cache("/home");
            } else {
              matcher.next();
            }
          }
        );
      }
    );
  } catch (error) {
    Sentry.captureException(error);
    matcher.redirect("/"); //To be redirected to a custom error page
  }

  return matcher.getResult();
}

export const config = {
  matcher: ["/((?!.*\\.|api|admin|monitoring|_next\\/).*)", "/"]
};
