import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";

import FrameworkProvider from "@/context/framework.provider";
import { useReportingWindow } from "@/hooks/useReportingWindow";

jest.mock("next/router", () => require("next-router-mock"));

describe("Test useGetReportingWindow hook", () => {
  test("Test `bi-annually` window", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FrameworkProvider frameworkKey="terrafund">{children}</FrameworkProvider>
    );
    const { result } = renderHook(
      () => {
        const dueDate = "2023-04-17T10:20:47.000000Z";
        return useReportingWindow(dueDate);
      },
      { wrapper }
    );
    expect(result.current).toBe("October - March 2023");
  });

  test("Test `quarterly` window", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FrameworkProvider frameworkKey="ppc">{children}</FrameworkProvider>
    );
    const { result } = renderHook(
      () => {
        const dueDate = "2023-04-17T10:20:47.000000Z";
        return useReportingWindow(dueDate);
      },
      { wrapper }
    );
    expect(result.current).toBe("January - March 2023");
  });
});
