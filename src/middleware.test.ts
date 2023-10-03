/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";

import * as api from "@/generated/apiComponents";

import { middleware } from "./middleware.page";

//@ts-ignore
Headers.prototype.getAll = () => []; //To fix TypeError: this._headers.getAll is not a function

jest.mock("@/generated/apiComponents", () => ({
  __esModule: true,
  fetchGetAuthMe: jest.fn()
}));

const domain = "https://localhost:3000";

const getRequest = (url: string, loggedIn?: boolean) => {
  const req = new NextRequest(new Request(`${domain}${url}`), {});
  req.headers.set("cookie", "accessToken=aosdiasodij;");
  if (loggedIn) {
    //@ts-ignore
    req.cookies.get = (name: string) => name;
  }

  return req;
};

const testMultipleRoute = async (spy: any, expected: string) => {
  await middleware(getRequest("/", true));
  expect(spy).toBeCalledWith(new URL(expected, domain));

  await middleware(getRequest("/home", true));
  expect(spy).toBeCalledWith(new URL(expected, domain));

  await middleware(getRequest("/organization/create", true));
  expect(spy).toBeCalledWith(new URL(expected, domain));

  await middleware(getRequest("/auth/login", true));
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

describe("User is Logged In and not verified", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("redirect not verified users to /auth/signup/confirm", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address: "test@example.com",
        email_address_verified_at: null
      }
    });

    await middleware(getRequest("/", true));
    await testMultipleRoute(spy, `/auth/signup/confirm?email=test@example.com`);
  });
});

describe("User is Logged In and verified", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("redirect routes that start with /organization/create to /organization/create/confirm when org has been approved", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "approved"
        }
      }
    });

    await middleware(getRequest("/organization/create/test", true));
    expect(spy).toBeCalledWith(new URL("/organization/create/confirm", domain));

    await middleware(getRequest("/organization/create", true));
    expect(spy).toBeCalledWith(new URL("/organization/create/confirm", domain));
  });

  it("redirect any route to /admin when user is an admin", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: null,
        role: "admin"
      }
    });
    await testMultipleRoute(spy, "/admin");
  });

  it("redirect any route to /organization/assign when org does not exist", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: null
      }
    });
    await testMultipleRoute(spy, "/organization/assign");
  });

  it("redirect any route to /organization/create when org is a draft", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "draft"
        }
      }
    });
    await testMultipleRoute(spy, "/organization/create");
  });

  it("redirect any route to /organization/status/pending when user is awaiting org approval", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [
          {
            users_status: "requested"
          }
        ],
        my_organisation: null
      }
    });

    await testMultipleRoute(spy, "/organization/status/pending");
  });

  it("redirect any route to /organization/status/rejected when user is rejected", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "rejected"
        }
      }
    });

    await testMultipleRoute(spy, "/organization/status/rejected");
  });

  it("redirect /organization to /organization/[org_uuid]", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "approved",
          name: "",
          uuid: "uuid"
        }
      }
    });

    await middleware(getRequest("/organization", true));

    expect(spy).toBeCalledWith(new URL("/organization/uuid", domain));
  });

  it("redirect / to /home", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "approved",
          name: ""
        }
      }
    });

    await middleware(getRequest("/", true));

    expect(spy).toBeCalledWith(new URL("/home", domain));
  });

  it("redirect routes that startWith /auth to /home", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "approved",
          name: ""
        }
      }
    });

    await middleware(getRequest("/auth", true));
    expect(spy).toBeCalledWith(new URL("/home", domain));

    await middleware(getRequest("/auth/sign-up", true));
    expect(spy).toBeCalledWith(new URL("/home", domain));
  });

  it("redirect routes that startWith /programme to /v1/programme", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "approved"
        }
      }
    });

    await middleware(getRequest("/programme/overview", true));
    expect(spy).toBeCalledWith(new URL("/v1/programme/overview", domain));
  });

  it("redirect routes that startWith /programmeSite to /v1/programmeSite", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "approved"
        }
      }
    });

    await middleware(getRequest("/programmeSite/overview", true));
    expect(spy).toBeCalledWith(new URL("/v1/programmeSite/overview", domain));
  });

  it("redirect routes that startWith /terrafund to /v1/terrafund", async () => {
    const spy = jest.spyOn(NextResponse, "redirect");
    //@ts-ignore
    api.fetchGetAuthMe.mockResolvedValue({
      data: {
        email_address_verified_at: "2023-02-17T10:54:16.000000Z",
        my_monitoring_organisations: [],
        my_organisation: {
          status: "approved"
        }
      }
    });

    await middleware(getRequest("/terrafund/programme/overview", true));
    expect(spy).toBeCalledWith(new URL("/v1/terrafund/programme/overview", domain));
  });
});
