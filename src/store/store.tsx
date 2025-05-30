import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { filter } from "lodash";
import { PropsWithChildren, useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createLogger } from "redux-logger";

import DataApiSlice, { dataApiSlice, DataApiStore } from "@/store/dataApiSlice";

import ApiSlice, { ApiDataStore, apiSlice, authListenerMiddleware } from "./apiSlice";
import JobsSlice, { JobsDataStore, jobsSlice } from "./jobsSlice";

// Action used only in test suites to dump some specific state into the store.
export const __TEST_HYDRATE__ = "__TEST_HYDRATE__";

export type AppStore = {
  api: ApiDataStore;
  jobs: JobsDataStore;
  dataApi: DataApiStore;
};

export const makeStore = (queryClient?: QueryClient) => {
  const store = configureStore({
    reducer: {
      api: apiSlice.reducer,
      jobs: jobsSlice.reducer,
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

  ApiSlice.redux = store;
  ApiSlice.queryClient = queryClient;
  JobsSlice.redux = store;
  DataApiSlice.redux = store;

  if (typeof window !== "undefined" && (window as any).terramatch != null) {
    // Make some things available to the browser console for easy debugging.
    (window as any).terramatch.getState = () => store.getState();
  }

  return store;
};

export const WrappedReduxProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const store = useMemo(() => makeStore(queryClient), [queryClient]);
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};
