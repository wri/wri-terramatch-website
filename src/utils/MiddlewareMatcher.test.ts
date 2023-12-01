/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";

import { MiddlewareMatcher } from "./MiddlewareMatcher";
//@ts-ignore
Headers.prototype.getAll = () => [];

const getRequest = (url: string) => {
  const req = new NextRequest(new Request(`https://localhost:3000${url}`), {});
  req.headers.set("cookie", "token=aosdiasodij;");
  return req;
};

describe("Test methods", () => {
  it("test startWith", async () => {
    const req = getRequest("/home/test");
    const matcher = new MiddlewareMatcher(req);

    expect(matcher.startWith("/home")).toBe(matcher);
  });

  it("test exact", async () => {
    const req = getRequest("/home/test");
    const matcher = new MiddlewareMatcher(req);

    //@ts-ignore
    const response = matcher.exact("/home/test");

    expect(response).toBe(matcher);
  });

  it("test when", async () => {
    const req = getRequest("/home");
    const matcher = new MiddlewareMatcher(req);

    //@ts-ignore
    const response = matcher.when(true)?.startWith("/home");

    expect(response).toBe(matcher);
  });

  it("test when", async () => {
    const req = getRequest("/home");
    const matcher = new MiddlewareMatcher(req);

    //@ts-ignore
    const response = matcher.when(false)?.startWith("/home");

    expect(response).toBe(undefined);
  });

  it("test redirect when nexturl !== url", async () => {
    const req = getRequest("/home");
    const matcher = new MiddlewareMatcher(req);

    //@ts-ignore
    const expected = matcher.redirect("/home/test?email=test@example.com");

    expect(matcher.getResult()?.headers.get("location")).toBe(expected?.headers.get("location"));
  });

  it("test redirect: undefined default when nexturl === url", async () => {
    const req = getRequest("/home");
    const matcher = new MiddlewareMatcher(req);

    //@ts-ignore
    matcher.redirect("/home");

    expect(matcher.getResult()).toBe(undefined);
  });

  it("test cache method", async () => {
    const req = getRequest("/home");
    const matcher = new MiddlewareMatcher(req);
    const url = "cached-url";
    //@ts-ignore
    matcher.next().cache(url);

    expect(matcher.getResult()?.headers.get("set-cookie")?.includes(`middlewareCache=${url}`));
  });

  it("test next set result status to 200", async () => {
    const req = getRequest("/");
    const matcher = new MiddlewareMatcher(req);

    //@ts-ignore
    matcher.next();

    expect(matcher.getResult()?.status).toBe(200);
  });
});
