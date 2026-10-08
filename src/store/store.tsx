import { configureStore } from "@reduxjs/toolkit";
import { filter } from "lodash";
import { PropsWithChildren, useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createLogger } from "redux-logger";

import DataApiSlice, { dataApiSlice, DataApiStore } from "@/store/dataApiSlice";

import ApiSlice, { ApiDataStore, apiSlice, authListenerMiddleware } from "./apiSlice";

// Action used only in test suites to dump some specific state into the store.
export const __TEST_HYDRATE__ = "__TEST_HYDRATE__";

export type AppStore = {
  api: ApiDataStore;
  dataApi: DataApiStore;
};

type Store = ReturnType<typeof configureStore<AppStore>>;

// Points the static ApiSlice / DataApiSlice references (used to dispatch API actions outside of
// React) at the given store.
const bindStore = (store: Store) => {
  ApiSlice.redux = store;
  DataApiSlice.redux = store;

  if (typeof window !== "undefined" && (window as any).terramatch != null) {
    // Make some things available to the browser console for easy debugging.
    (window as any).terramatch.getState = () => store.getState();
  }
};

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      api: apiSlice.reducer,
      dataApi: dataApiSlice.reducer
    },
    middleware: getDefaultMiddleware => {
      const includeLogger =
        typeof window !== "undefined" && process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";

      if (includeLogger) {
        // Most of our actions include a URL, and it's useful to have that in the top level visible
        // log when it's present.
        const logger = createLogger({
          titleFormatter: (action: any, time: string, took: number) => {
            const { url, method } = action?.payload ?? {};
            const extra = url == null ? "" : ` [${filter([method, url]).join(" ")}]`;
            return `action @ ${time} ${action.type} (in ${took.toFixed(2)} ms)${extra}`;
          }
        });
        return getDefaultMiddleware().prepend(authListenerMiddleware.middleware).concat(logger);
      } else {
        return getDefaultMiddleware().prepend(authListenerMiddleware.middleware);
      }
    }
  });

  bindStore(store);
  return store;
};

export const WrappedReduxProvider = ({ children }: PropsWithChildren) => {
  const store = useMemo(() => makeStore(), []);
  // React 19 StrictMode calls the useMemo factory twice in development but keeps the first result,
  // so the second makeStore() call leaves the static references bound to a store the Provider never
  // sees. Bind them to the store the Provider actually uses.
  bindStore(store);
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};
