import { getEntityDetailPageLink } from "@/helpers/entity";

describe("getEntityDetailPageLink", () => {
  test("getEntityDetailPageLink works for project", () => {
    const expected = "/project/[uuid]";
    expect(getEntityDetailPageLink("projects", "[uuid]")).toBe(expected);
  });

  test("getEntityDetailPageLink works for site", () => {
    const expected = "/site/[uuid]";
    expect(getEntityDetailPageLink("sites", "[uuid]")).toBe(expected);
  });

  test("getEntityDetailPageLink works for nursery", () => {
    const expected = "/nursery/[uuid]";
    expect(getEntityDetailPageLink("nurseries", "[uuid]")).toBe(expected);
  });

  test("getEntityDetailPageLink works for project-report", () => {
    const expected = "/reports/project-report/[uuid]";
    expect(getEntityDetailPageLink("project-reports", "[uuid]")).toBe(expected);
  });

  test("getEntityDetailPageLink works for site-report", () => {
    const expected = "/reports/site-report/[uuid]";
    expect(getEntityDetailPageLink("site-reports", "[uuid]")).toBe(expected);
  });

  test("getEntityDetailPageLink works for nursery-report", () => {
    const expected = "/reports/nursery-report/[uuid]";
    expect(getEntityDetailPageLink("nursery-reports", "[uuid]")).toBe(expected);
  });
});
