import { renderHook } from "@testing-library/react";

import { Framework } from "@/context/framework.provider";
import { useReportingWindow } from "@/hooks/useReportingWindow";

jest.mock("next/router", () => require("next-router-mock"));

describe("Test useGetReportingWindow hook", () => {
  test("Test `bi-annually` window", () => {
    const { result } = renderHook(() => {
      const dueDate = "2023-04-17T10:20:47.000000Z";
      return useReportingWindow(Framework.TF, dueDate);
    });
    expect(result.current).toBe("October - March 2023");
  });

  test("Test `quarterly` window", () => {
    const { result } = renderHook(() => {
      const dueDate = "2023-04-17T10:20:47.000000Z";
      return useReportingWindow(Framework.PPC, dueDate);
    });
    expect(result.current).toBe("January - March 2023");
  });
});
