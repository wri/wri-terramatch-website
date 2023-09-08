import * as Sentry from "@sentry/nextjs";
import { NextRequest } from "next/server";

import { fetchGetAuthMe } from "@/generated/apiComponents";
import { UserRead } from "@/generated/apiSchemas";
import { getMyOrg } from "@/hooks/useMyOrg";
import { MiddlewareMatcher } from "@/utils/MiddlewareMatcher";

//Todo: refactor this logic somewhere down the line as there are lot's of if/else nested!
export async function middleware(request: NextRequest) {
  const matcher = new MiddlewareMatcher(request);
  const accessToken = request.cookies.get("accessToken");

  try {
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
        //Logged-in
        const response = (await fetchGetAuthMe({
          headers: { Authorization: `Bearer ${accessToken!.value}` }
        })) as { data: UserRead };

        const userData = response.data;

        matcher.if(
          !userData?.email_address_verified_at,
          () => {
            //Email is not verified
            matcher.redirect(`/auth/signup/confirm?email=${userData.email_address}`);
          },
          () => {
            //Email is verified
            //@ts-ignore
            const myOrg = userData && getMyOrg(userData);

            matcher.startWith("/programme")?.redirect((request: NextRequest) => `/v1${request.nextUrl.pathname}`);
            matcher.startWith("/programmeSite")?.redirect((request: NextRequest) => `/v1${request.nextUrl.pathname}`);
            matcher.startWith("/terrafund")?.redirect((request: NextRequest) => `/v1${request.nextUrl.pathname}`);

            matcher.when(!!userData && userData?.role === "admin")?.redirect(`/admin`);

            matcher
              .when(!!myOrg && !!myOrg?.status && myOrg?.status !== "draft")
              ?.startWith("/organization/create")
              ?.redirect(`/organization/create/confirm`);

            matcher.when(!myOrg)?.redirect(`/organization/assign`);

            matcher.when(!!myOrg && (!myOrg?.status || myOrg?.status === "draft"))?.redirect(`/organization/create`);

            matcher
              .when(!!myOrg && !!myOrg?.users_status && myOrg?.users_status === "requested")
              ?.redirect(`/organization/status/pending`);

            matcher.when(!!myOrg)?.exact("/organization")?.redirect(`/organization/${myOrg?.uuid}`);

            matcher.when(!!myOrg && myOrg?.status === "rejected")?.redirect(`/organization/status/rejected`);

            matcher.exact("/")?.redirect(`/home`);

            matcher.startWith("/auth")?.redirect("/home");
          }
        );

        matcher.next();
      }
    );
  } catch (error) {
    Sentry.captureException(error);
    matcher.redirect("/"); //To be redirected to a custom error page
  }

  return matcher.getResult();
}

export const config = {
  matcher: ["/((?!.*\\.|v1|api|admin|monitoring|_next\\/).*)", "/"]
};
