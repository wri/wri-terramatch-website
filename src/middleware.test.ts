/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";

import { OrganisationDto, UserDto } from "@/generated/v3/userService/userServiceSchemas";

import { middleware } from "./middleware.page";

//@ts-ignore
Headers.prototype.getAll = () => []; //To fix TypeError: this._headers.getAll is not a function

const domain = "https://localhost:3000";

const getRequest = (url: string, loggedIn?: boolean, cachedUrl?: string) => {
  const req = new NextRequest(new Request(`${domain}${url}`), {});
  req.headers.set("cookie", `accessToken=aosdiasodij;${cachedUrl ? `middlewareCache=${cachedUrl}` : ""}`);

  if (loggedIn) {
    //@ts-ignore
    req.cookies.get = (name: string) => {
      if (name === "middlewareCache") {
        return {
          name,
          value: cachedUrl
        };
      } else {
        return { name, value: name };
      }
    };
  }

  return req;
};

const testMultipleRoute = async (spy: any, expected: string, cachedUrl?: string) => {
  await middleware(getRequest("/", true, cachedUrl));
  expect(spy).toBeCalledWith(new URL(expected, domain));

  await middleware(getRequest("/home", true, cachedUrl));
  expect(spy).toBeCalledWith(new URL(expected, domain));

  await middleware(getRequest("/organization/create", true, cachedUrl));
  expect(spy).toBeCalledWith(new URL(expected, domain));

  await middleware(getRequest("/auth/login", true, cachedUrl));
  expect(spy).toBeCalledWith(new URL(expected, domain));
};

describe("User is not Logged In", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("allow /", async () => {
    const spy = jest.spyOn(NextResponse, "next");

    await middleware(getRequest("/"));
    expect(spy).toBeCalled();
  });

  it("redirect all routes to /auth/login", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");

    await middleware(getRequest("/organisation/create"));
    expect(spy).toBeCalledWith(new URL("/auth/login", domain));
  });

  it("allow routes under /auth", async () => {
    const spy = jest.spyOn(NextResponse, "next");

    await middleware(getRequest("/auth/reset-password"));
    expect(spy).toBeCalled();
  });

  it("redirect /home to /", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");

    await middleware(getRequest("/home"));
    expect(spy).toBeCalledWith(new URL("/", domain));
  });
});

function mockUsersMe(
  userAttributes: Partial<UserDto>,
  org: {
    attributes?: Partial<OrganisationDto>;
    id?: string;
    userStatus?: string;
  } = {}
) {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          attributes: userAttributes,
          relationships: {
            org: {
              data: {
                id: org.id,
                meta: { userStatus: org.userStatus }
              }
            }
          }
        },
        included: [{ attributes: org.attributes }]
      })
    } as Response)
  );
}

describe("User is Logged In and not verified", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("redirect not verified users to /auth/signup/confirm", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddress: "test@example.com" });

    await middleware(getRequest("/", true));
    await testMultipleRoute(spy, `/auth/signup/confirm?email=test@example.com`);
  });
});

describe("User is Logged In and verified", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("redirect routes that start with /organization/create to /organization/create/confirm when org has been approved", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z" }, { attributes: { status: "approved" } });

    await middleware(getRequest("/organization/create/test", true));
    expect(spy).toBeCalledWith(new URL("/organization/create/confirm", domain));

    await middleware(getRequest("/organization/create", true));
    expect(spy).toBeCalledWith(new URL("/organization/create/confirm", domain));
  });

  it("redirect any route to /admin when user is an admin", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z", primaryRole: "admin-super" });

    await testMultipleRoute(spy, "/admin");
  });

  it("redirect any route to /organization/assign when org does not exist", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z" });

    await testMultipleRoute(spy, "/organization/assign");
  });

  it("redirect any route to /organization/create when org is a draft", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z" }, { attributes: { status: "draft" } });

    await testMultipleRoute(spy, "/organization/create");
  });

  it("redirect any route to /organization/status/pending when user is awaiting org approval", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z" }, { userStatus: "requested" });

    await testMultipleRoute(spy, "/organization/status/pending");
  });

  it("redirect any route to /organization/status/rejected when user is rejected", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z" }, { attributes: { status: "rejected" } });

    await testMultipleRoute(spy, "/organization/status/rejected");
  });

  it("redirect /organization to /organization/[org_uuid]", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe(
      { emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z" },
      { attributes: { status: "approved" }, id: "uuid" }
    );

    await middleware(getRequest("/organization", true));

    expect(spy).toBeCalledWith(new URL("/organization/uuid", domain));
  });

  it("redirect / to /home", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z" }, { attributes: { status: "approved" } });

    await middleware(getRequest("/", true));

    expect(spy).toBeCalledWith(new URL("/home", domain));
  });

  it("redirect routes that startWith /auth to /home", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    mockUsersMe({ emailAddressVerifiedAt: "2023-02-17T10:54:16.000000Z" }, { attributes: { status: "approved" } });

    await middleware(getRequest("/auth", true));
    expect(spy).toBeCalledWith(new URL("/home", domain));

    await middleware(getRequest("/auth/sign-up", true));
    expect(spy).toBeCalledWith(new URL("/home", domain));
  });
});

describe("middlewareCache is existing", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("cachedUrl='/admin' and user is logged in / should redirect to /home", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    const cachedUrl = "admin";
    await testMultipleRoute(spy, cachedUrl, cachedUrl);

    expect(spy).toBeCalledWith(new URL(cachedUrl, domain));
  });

  test("cachedUrl is set and user is logged in / and /auth should redirect to cachedUrl", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    const cachedUrl = "home";
    await middleware(getRequest("/", true, cachedUrl));
    expect(spy).toBeCalledWith(new URL(cachedUrl, domain));

    await middleware(getRequest("/auth", true, cachedUrl));
    expect(spy).toBeCalledWith(new URL(cachedUrl, domain));
  });

  test("cachedUrl is set and user is logged in any route except / and /auth should not get redirected", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    const cachedUrl = "/home";

    await middleware(getRequest("/my-projects", true, cachedUrl));
    expect(spy).toBeCalledTimes(0);

    await middleware(getRequest("/project/[uuid]", true, cachedUrl));
    expect(spy).toBeCalledTimes(0);

    await middleware(getRequest("/opportunities", true, cachedUrl));
    expect(spy).toBeCalledTimes(0);
  });
});
