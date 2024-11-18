import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin, UserRole } from "@/admin/apiProvider/utils/user";
import { OrganisationDto, UserDto } from "@/generated/v3/userService/userServiceSchemas";
import { resolveUrl } from "@/generated/v3/utils";
import { MiddlewareCacheKey, MiddlewareMatcher } from "@/utils/MiddlewareMatcher";

//Todo: refactor this logic somewhere down the line as there are lot's of if/else nested!
export async function middleware(request: NextRequest) {
  const matcher = new MiddlewareMatcher(request);

  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const middlewareCache = request.cookies.get(MiddlewareCacheKey)?.value;

    if (!!accessToken && !!middlewareCache) {
      // Skip middleware for dashboard routes to prevent redirect loop
      if (request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.next();
      }
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
        // The redux store isn't available yet at this point, so we do a quick manual users/me fetch
        // to get the data we need to resolve routing.
        const result = await fetch(resolveUrl("/users/v3/users/me"), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });
        const json = await result.json();

        const user = json.data.attributes as UserDto;
        const {
          id: organisationId,
          meta: { userStatus }
        } = json.data.relationships?.org?.data ?? { meta: {} };
        const organisation: OrganisationDto | undefined = json.included?.[0]?.attributes;

        matcher.if(
          !user?.emailAddressVerifiedAt,
          () => {
            //Email is not verified
            matcher.redirect(`/auth/signup/confirm?email=${user?.emailAddress}`);
          },
          () => {
            //Email is verified
            const userIsAdmin = isAdmin(user?.primaryRole as UserRole);
            const userIsFunderOrGovernment = user?.primaryRole === "funder" || user?.primaryRole === "government";

            // Allow admin and funder/government users to access dashboard routes
            if ((userIsAdmin || userIsFunderOrGovernment) && request.nextUrl.pathname.startsWith("/dashboard")) {
              matcher.next();
              return matcher.getResult();
            }

            // Default admin redirect for non-dashboard routes
            matcher.when(user != null && userIsAdmin)?.redirect(`/admin`, { cacheResponse: true });

            // Special handling for funder and government roles
            if (userIsFunderOrGovernment) {
              // Redirect funder/government directly to dashboard regardless of organization
              matcher.redirect(`/dashboard`, { cacheResponse: true });
              return matcher.getResult();
            }

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
