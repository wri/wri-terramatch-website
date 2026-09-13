import { act, renderHook } from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import { MemoryRouter, useSearchParams } from "react-router-dom";

import { useSearchParamsDrilldown } from "./useSearchParamsDrilldown";

const wrapperFor =
  (initialUrl: string): FC<PropsWithChildren> =>
  ({ children }) =>
    <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>;

// Render the adapter alongside a raw useSearchParams so tests can assert the full URL, not just the
// site — the adapter must preserve the sibling ?project= param when toggling ?site=.
const renderDrilldown = (initialUrl: string) =>
  renderHook(
    () => ({
      drilldown: useSearchParamsDrilldown(),
      params: useSearchParams()[0]
    }),
    { wrapper: wrapperFor(initialUrl) }
  );

describe("useSearchParamsDrilldown", () => {
  it("reads the drilled-in site from ?site=", () => {
    const { result } = renderDrilldown("/polygon-review?project=p1&site=s1");
    expect(result.current.drilldown.siteUuid).toBe("s1");
  });

  it("returns null when there is no ?site=", () => {
    const { result } = renderDrilldown("/polygon-review?project=p1");
    expect(result.current.drilldown.siteUuid).toBeNull();
  });

  it("drillInto sets ?site= while preserving ?project=", () => {
    const { result } = renderDrilldown("/polygon-review?project=p1");

    act(() => result.current.drilldown.drillInto("s2"));

    expect(result.current.drilldown.siteUuid).toBe("s2");
    expect(result.current.params.get("project")).toBe("p1");
  });

  it("backToSites clears ?site= but keeps ?project=", () => {
    const { result } = renderDrilldown("/polygon-review?project=p1&site=s1");

    act(() => result.current.drilldown.backToSites());

    expect(result.current.drilldown.siteUuid).toBeNull();
    expect(result.current.params.get("project")).toBe("p1");
  });

  it("switching drill-in target replaces ?site= in place", () => {
    const { result } = renderDrilldown("/polygon-review?project=p1&site=s1");

    act(() => result.current.drilldown.drillInto("s2"));

    expect(result.current.drilldown.siteUuid).toBe("s2");
    expect(result.current.params.getAll("site")).toEqual(["s2"]);
  });
});
