import { renderHook, waitFor } from "@testing-library/react";

import { loadSitePolygonCount } from "@/connections/SitePolygons";

import { useProjectPolygonStatusCounts } from "./useProjectPolygonStatusCounts";

jest.mock("@/connections/SitePolygons", () => ({ loadSitePolygonCount: jest.fn() }));

const mockLoad = loadSitePolygonCount as jest.MockedFunction<typeof loadSitePolygonCount>;

// The hook fires: [total(no filter), passed, partial, failed, not_checked] in that order.
const mockCounts = (total: number, passed: number, partial: number, failed: number, notChecked: number) => {
  mockLoad.mockReset();
  mockLoad
    .mockResolvedValueOnce(total)
    .mockResolvedValueOnce(passed)
    .mockResolvedValueOnce(partial)
    .mockResolvedValueOnce(failed)
    .mockResolvedValueOnce(notChecked);
};

describe("useProjectPolygonStatusCounts", () => {
  it("derives approvable (passed+partial) and needsWork (failed+not_checked) from the buckets", async () => {
    mockCounts(10977, 2038, 6901, 1807, 231);
    const { result } = renderHook(() => useProjectPolygonStatusCounts("proj-1"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.counts.total).toBe(10977);
    expect(result.current.counts.approvable).toBe(2038 + 6901);
    expect(result.current.counts.needsWork).toBe(1807 + 231);
    expect(result.current.counts.failed).toBe(1807);
    expect(result.current.error).toBeNull();
  });

  it("queries each status with the validationStatus filter (no brackets — the bound property name)", async () => {
    mockCounts(1, 1, 0, 0, 0);
    renderHook(() => useProjectPolygonStatusCounts("proj-1"));

    await waitFor(() => expect(mockLoad).toHaveBeenCalledTimes(5));

    const filters = mockLoad.mock.calls.map(call => (call[0] as { filter?: Record<string, unknown> }).filter);
    expect(filters[0]).toBeUndefined(); // total = unfiltered
    expect(filters).toContainEqual({ validationStatus: ["passed"] });
    expect(filters).toContainEqual({ validationStatus: ["failed"] });
    expect(filters).toContainEqual({ validationStatus: ["not_checked"] });
  });

  it("surfaces an error and leaves counts at zero when a request fails (drives the fail-safe gate)", async () => {
    mockLoad.mockReset();
    mockLoad.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useProjectPolygonStatusCounts("proj-1"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).not.toBeNull();
    expect(result.current.counts.total).toBe(0);
  });

  it("does not fetch when disabled or given an empty uuid", async () => {
    mockLoad.mockReset();
    const { result } = renderHook(() => useProjectPolygonStatusCounts("", true));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockLoad).not.toHaveBeenCalled();
  });
});
