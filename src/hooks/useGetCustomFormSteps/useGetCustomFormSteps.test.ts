import { renderHook } from "@testing-library/react";

import { FormRead } from "@/generated/apiSchemas";

import formSchema from "./formSchema.json";
import { useGetCustomFormSteps } from "./useGetCustomFormSteps";

describe("test useGetCustomFormSteps hook", () => {
  test("snapShot test", () => {
    const { result } = renderHook(() => useGetCustomFormSteps(formSchema as FormRead));
    expect(result.current).toMatchSnapshot();
  });
});
