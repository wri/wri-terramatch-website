import { renderHook } from "@testing-library/react";

import AuthProvider, { useAuthContext } from "@/context/auth.provider";
import * as api from "@/generated/apiComponents";

jest.mock("@/generated/apiComponents", () => ({
  __esModule: true,
  useGetAuthMe: jest.fn(),
  usePostAuthLogin: jest.fn()
}));

jest.mock("@/generated/apiFetcher", () => ({
  __esModule: true,
  apiFetch: jest.fn()
}));

describe("Test auth.provider context", () => {
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";
  const userData = {
    uuid: "1234-1234",
    name: "3SC"
  };

  beforeEach(() => {
    jest.resetAllMocks();
    //@ts-ignore
    api.usePostAuthLogin.mockImplementation(() => ({
      mutateAsync: jest.fn(() => Promise.resolve({ data: { token } })),
      isLoading: false,
      error: null
    }));
    //@ts-ignore
    api.useGetAuthMe.mockReturnValue({
      data: {
        data: userData
      }
    });
  });

  test("login method update local storage", async () => {
    const { result } = renderHook(() => useAuthContext(), {
      wrapper: props => <AuthProvider token={token}>{props.children}</AuthProvider>
    });

    jest.spyOn(window.localStorage.__proto__, "setItem");

    await result.current.login({ email_address: "example@3sidedcube.com", password: "12345" });

    expect(localStorage.setItem).toBeCalledWith("access_token", token);
  });
});
