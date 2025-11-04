import { renderHook } from "@testing-library/react";
import { ReactNode, useMemo } from "react";
import { act } from "react-dom/test-utils";
import { Provider as ReduxProvider } from "react-redux";
import { createSelector } from "reselect";

import { AuthLoginResponse } from "@/generated/v3/userService/userServiceComponents";
import { useConnection } from "@/hooks/useConnection";
import ApiSlice, { ApiDataStore, JsonApiResponse } from "@/store/apiSlice";
import { makeStore } from "@/store/store";
import { Connection } from "@/types/connection";

const StoreWrapper = ({ children }: { children: ReactNode }) => {
  const store = useMemo(() => makeStore(), []);
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

describe("Test useConnection hook", () => {
  test("isLoaded", async () => {
    const load = jest.fn();
    let selected = { connectionLoaded: false };
    const connection = {
      selector: () => selected,
      load,
      isLoaded: ({ connectionLoaded }) => connectionLoaded
    } as Connection<{ connectionLoaded: boolean }>;
    let rendered = renderHook(() => useConnection(connection), { wrapper: StoreWrapper });

    expect(rendered.result.current[0]).toBe(false);
    // Load is now called after a delay.
    await new Promise(resolve => setTimeout(resolve));
    expect(load).toHaveBeenCalled();

    load.mockReset();
    selected = { connectionLoaded: true };
    rendered = renderHook(() => useConnection(connection), { wrapper: StoreWrapper });
    expect(rendered.result.current[0]).toBe(true);
    // Load is now called after a delay.
    await new Promise(resolve => setTimeout(resolve));
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
    } as Connection<{ login: AuthLoginResponse }>;

    const { result, rerender } = renderHook(() => useConnection(connection), { wrapper: StoreWrapper });
    rerender();

    expect(result.current[1]).toStrictEqual({ login: null });
    // The rerender doesn't cause an additional call to either function because the input (the
    // redux store) didn't change.
    expect(selector).toHaveBeenCalledTimes(1);
    expect(payloadCreator).toHaveBeenCalledTimes(1);

    const token = "asdfasdfasdf";
    const response = {
      data: { type: "logins", id: "1", attributes: { token } },
      meta: { resourceType: "logins" }
    } as JsonApiResponse;
    act(() => {
      ApiSlice.fetchSucceeded({ url: "/foo", method: "POST", response });
    });

    // The store has changed so the selector gets called again, and the selector's result has
    // changed so the payload creator gets called again, and returns the new Login response that
    // was saved in the store.
    expect(result.current[1]).toStrictEqual({ login: { attributes: { token } } });
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
