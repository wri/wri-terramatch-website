import { renderHook } from "@testing-library/react";

import AuthProvider from "@/context/auth.provider";
import * as api from "@/generated/apiComponents";

import { useMyOrg } from "./useMyOrg";

jest.mock("@/generated/apiComponents", () => ({
  __esModule: true,
  useGetAuthMe: jest.fn(),
  usePostAuthLogin: jest.fn()
}));

describe("test useMyOrg hook", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    //@ts-ignore
    api.usePostAuthLogin.mockReturnValue({ mutateAsync: jest.fn(), isLoading: false, error: null });
  });

  test("user has my_organisation ", () => {
    const expected = {
      //this is a representation of org obj, we don't need all attributes to for this test
      uuid: "1234-1234"
    };

    //@ts-ignore
    api.useGetAuthMe.mockReturnValue({
      data: {
        data: {
          my_monitoring_organisations: [
            {
              uuid: "5678-5678"
            }
          ],
          my_organisation: expected
        }
      }
    });

    const { result } = renderHook(() => useMyOrg(), {
      wrapper: props => <AuthProvider>{props.children}</AuthProvider>
    });

    expect(result.current).toBe(expected);
  });

  test("user has no my_organisation and has my_monitoring_organisations", () => {
    const expected = {
      //this is a representation of org obj, we don't need all attributes to for this test
      uuid: "1234-1234"
    };

    //@ts-ignore
    api.useGetAuthMe.mockReturnValue({
      data: {
        data: {
          my_monitoring_organisations: [
            expected,
            {
              uuid: "5678-5678"
            }
          ],
          my_organisation: null
        }
      }
    });

    const { result } = renderHook(() => useMyOrg(), {
      wrapper: props => <AuthProvider>{props.children}</AuthProvider>
    });

    expect(result.current).toBe(expected);
  });

  test("user has no my_organisation and no my_monitoring_organisations", () => {
    //@ts-ignore
    api.useGetAuthMe.mockReturnValue({
      data: {
        data: {
          my_monitoring_organisations: null,
          my_organisation: null
        }
      }
    });

    const { result } = renderHook(() => useMyOrg(), {
      wrapper: props => <AuthProvider>{props.children}</AuthProvider>
    });

    expect(result.current).toBe(undefined);
  });
});
