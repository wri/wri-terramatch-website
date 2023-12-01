import { renderHook } from "@testing-library/react";

import { useGetReportingWindow } from "@/hooks/useGetReportingWindow";

jest.mock("next/router", () => require("next-router-mock"));

describe("Test useGetReportingWindow hook", () => {
  test("Test `bi-annually` window", () => {
    const { result } = renderHook(() => {
      const due_date = "2023-04-17T10:20:47.000000Z";
      const { getReportingWindow } = useGetReportingWindow();
      return getReportingWindow(due_date, "bi-annually");
    });
    expect(result.current).toBe("November - April 2023");
  });

  test("Test `quarterly` window", () => {
    const { result } = renderHook(() => {
      const due_date = "2023-04-17T10:20:47.000000Z";
      const { getReportingWindow } = useGetReportingWindow();
      return getReportingWindow(due_date, "quarterly");
    });
    expect(result.current).toBe("February - April 2023");
  });
});
