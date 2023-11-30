import { renderHook } from "@testing-library/react";

import { useDate } from "./useDate";

jest.mock("next/router", () => require("next-router-mock"));

describe("Test useDate hook", () => {
  test("Test default format", () => {
    const { result } = renderHook(() => {
      const date = useDate();
      return date.format("2023-04-17T10:20:47.000000Z");
    });

    expect(result.current).toBe("17/04/2023");
  });
});
