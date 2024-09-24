import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { act } from "react-dom/test-utils";
import { createSelector } from "reselect";

import { LoginResponse } from "@/generated/v3/userService/userServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import ApiSlice, { ApiDataStore, JsonApiResource } from "@/store/apiSlice";
import StoreProvider from "@/store/StoreProvider";
import { Connection } from "@/types/connection";

const StoreWrapper = ({ children }: { children: ReactNode }) => <StoreProvider>{children}</StoreProvider>;

describe("Test useConnection hook", () => {
  test("isLoaded", () => {
    const load = jest.fn();
    let connectionLoaded = false;
    const connection = {
      selector: () => ({ connectionLoaded }),
      load,
      isLoaded: ({ connectionLoaded }) => connectionLoaded
    } as Connection<{ connectionLoaded: boolean }>;
    let rendered = renderHook(() => useConnection(connection), { wrapper: StoreWrapper });

    expect(rendered.result.current[0]).toBe(false);
    expect(load).toHaveBeenCalled();

    load.mockReset();
    connectionLoaded = true;
    rendered = renderHook(() => useConnection(connection), { wrapper: StoreWrapper });
    expect(rendered.result.current[0]).toBe(true);
    expect(load).toHaveBeenCalled();
  });

  test("selector efficiency", () => {
    const selector = jest.fn(({ logins }: ApiDataStore) => logins);
    const payloadCreator = jest.fn(logins => {
      const values = Object.values(logins);
      return { login: values.length < 1 ? null : values[0] };
    });
    const connection = {
      selector: createSelector([selector], payloadCreator)
    } as Connection<{ login: LoginResponse }>;

    const { result, rerender } = renderHook(() => useConnection(connection), { wrapper: StoreWrapper });
    rerender();

    expect(result.current[1]).toStrictEqual({ login: null });
    // The rerender doesn't cause an additional call to either function because the input (the
    // redux store) didn't change.
    expect(selector).toHaveBeenCalledTimes(1);
    expect(payloadCreator).toHaveBeenCalledTimes(1);

    const token = "asdfasdfasdf";
    const data = { type: "logins", id: "1", token } as JsonApiResource;
    act(() => {
      ApiSlice.fetchSucceeded({ url: "/foo", method: "POST", response: { data } });
    });

    // The store has changed so the selector gets called again, and the selector's result has
    // changed so the payload creator gets called again, and returns the new Login response that
    // was saved in the store.
    expect(result.current[1]).toStrictEqual({ login: data });
    expect(selector).toHaveBeenCalledTimes(2);
    expect(payloadCreator).toHaveBeenCalledTimes(2);

    rerender();
    // The store didn't change, so neither function gets called.
    expect(selector).toHaveBeenCalledTimes(2);
    expect(payloadCreator).toHaveBeenCalledTimes(2);

    act(() => {
      ApiSlice.fetchStarting({ url: "/bar", method: "POST" });
    });
    // The store has changed, so the selector gets called again, but the selector's result is
    // the same so the payload creator does not get called again, and returns its memoized result.
    expect(selector).toHaveBeenCalledTimes(3);
    expect(payloadCreator).toHaveBeenCalledTimes(2);
  });
});
