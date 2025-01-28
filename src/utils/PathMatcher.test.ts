import { PathMatcher, Redirect } from "./PathMatcher";

describe("PathMatcher", () => {
  it("test startWith", async () => {
    const matcher = new PathMatcher("/home/test");
    expect(matcher.startsWith("/home")).toBe(matcher);
  });

  it("test exact", async () => {
    const matcher = new PathMatcher("/home/test");
    expect(matcher.exact("/home/test")).toBe(matcher);
  });

  it("test when", async () => {
    const matcher = new PathMatcher("/home");
    expect(matcher.when(true)?.startsWith("/home")).toBe(matcher);
  });

  it("test when", async () => {
    const matcher = new PathMatcher("/home");
    expect(matcher.when(false)?.startsWith("/home")).toBe(undefined);
  });

  it("test redirect when nexturl !== url", async () => {
    const matcher = new PathMatcher("/home");
    expect(() => matcher.redirect("/home/text?email=test@example.org")).toThrowError(
      new Redirect("/home/text?email=test@example.org")
    );
  });

  it("test allow", async () => {
    const matcher = new PathMatcher("/");
    expect(() => matcher.allow()).toThrowError(new Redirect());
  });
});
