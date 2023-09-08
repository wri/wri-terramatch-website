import { getBackLink } from "@/admin/components/BackButton";

describe("test getBackLink()", () => {
  test("to return /user for /user/7940acab-4491-4356-859a-3439c3f69ae9/show", () => {
    const pathname = "/user/7940acab-4491-4356-859a-3439c3f69ae9/show";
    const backLink = getBackLink(pathname);

    expect(backLink).toBe("/user");
  });

  test("to return /user for /user/7940acab-4491-4356-859a-3439c3f69ae9", () => {
    const pathname = "/user/7940acab-4491-4356-859a-3439c3f69ae9";
    const backLink = getBackLink(pathname);

    expect(backLink).toBe("/user");
  });

  test("to return /user for /user/7940acab-4491-4356-859a-3439c3f69ae9/show/1", () => {
    const pathname = "/user/7940acab-4491-4356-859a-3439c3f69ae9/show/1";
    const backLink = getBackLink(pathname);

    expect(backLink).toBe("/user");
  });

  test("to return / for /user", () => {
    const pathname = "/user";
    const backLink = getBackLink(pathname);

    expect(backLink).toBe("/");
  });
});
