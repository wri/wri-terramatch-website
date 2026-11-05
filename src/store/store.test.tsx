import { render } from "@testing-library/react";
import { StrictMode } from "react";
import { useStore } from "react-redux";
import { Store } from "redux";

import ApiSlice from "@/store/apiSlice";
import { WrappedReduxProvider } from "@/store/store";

describe("WrappedReduxProvider", () => {
  test("ApiSlice dispatches to the same store the Provider uses in StrictMode", () => {
    let providerStore: Store | undefined;
    const CaptureStore = () => {
      providerStore = useStore();
      return null;
    };

    render(
      <StrictMode>
        <WrappedReduxProvider>
          <CaptureStore />
        </WrappedReduxProvider>
      </StrictMode>
    );

    expect(providerStore).toBeDefined();
    expect(ApiSlice.redux).toBe(providerStore);
  });
});
