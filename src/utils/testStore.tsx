import { cloneDeep } from "lodash";
import { HYDRATE } from "next-redux-wrapper";
import { ReactNode, useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { INITIAL_STATE } from "@/store/apiSlice";
import { makeStore } from "@/store/store";

class StoreBuilder {
  store = cloneDeep(INITIAL_STATE);

  addLogin(token: string) {
    this.store.logins[1] = { attributes: { token } };
    return this;
  }
}

export const StoreProvider = ({ storeBuilder, children }: { storeBuilder?: StoreBuilder; children: ReactNode }) => {
  // We avoid using wrapper.useWrappedStore here so that different storybook components on the same page
  // can have different instances of the redux store. This is a little wonky because anything that
  // uses ApiSlice.store directly is going to get the last store created every time, including anything
  // that uses connection loads or selectors from connectionShortcuts. However, storybook stories
  // should be providing a store that has everything that component needs already loaded, and the
  // components only use useConnection, so this will at least work for the expected normal case.
  const store = useMemo(
    () => {
      const store = makeStore();
      const initialState = storeBuilder == null ? undefined : { api: storeBuilder.store };
      if (initialState != null) {
        store.dispatch({ type: HYDRATE, payload: initialState });
      }

      return store;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export const buildStore = () => new StoreBuilder();
