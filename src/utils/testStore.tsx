import { cloneDeep, Dictionary } from "lodash";
import { ReactNode, useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { authLogin } from "@/generated/v3/userService/userServiceComponents";
import { resolveUrl } from "@/generated/v3/utils";
import { INITIAL_STATE } from "@/store/apiSlice";
import { dataApiSlice, GadmData, GadmLevel } from "@/store/dataApiSlice";
import { __TEST_HYDRATE__, makeStore } from "@/store/store";

class StoreBuilder {
  store = cloneDeep(INITIAL_STATE);

  gadmData: GadmData[] = [];

  addLogin(token: string) {
    this.store.logins[1] = { attributes: { token } };
    this.store.meta.pending["POST"][resolveUrl(authLogin.url)] = { resourceIds: ["1"] };
    return this;
  }

  addGadmCodes(gadmLevel: GadmLevel, data: Dictionary<string>, parentCode?: string) {
    this.gadmData.push({ gadmLevel, data, parentCode });
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
      if (storeBuilder != null) {
        store.dispatch({ type: __TEST_HYDRATE__, payload: { api: storeBuilder.store } });
        for (const gadmData of storeBuilder.gadmData) {
          const { gadmLevel, parentCode } = gadmData;
          store.dispatch(
            dataApiSlice.actions.dataSetFetchSucceeded({ url: `${gadmLevel}/${parentCode ?? "global"}`, ...gadmData })
          );
        }
      }

      return store;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export const buildStore = () => new StoreBuilder();
