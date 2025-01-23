import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { createLogger } from "redux-logger";

import ApiSlice, { ApiDataStore, apiSlice, authListenerMiddleware } from "@/store/apiSlice";

export type AppStore = {
  api: ApiDataStore;
};

export const makeStore = (queryClient?: QueryClient) => {
  const store = configureStore({
    reducer: {
      api: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => {
      const includeLogger =
        typeof window !== "undefined" && process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";

      if (includeLogger) {
        // Most of our actions include a URL, and it's useful to have that in the top level visible
        // log when it's present.
        const logger = createLogger({
          titleFormatter: (action: any, time: string, took: number) => {
            const extra = action?.payload?.url == null ? "" : ` [${action.payload.url}]`;
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

  if (typeof window !== "undefined" && (window as any).terramatch != null) {
    // Make some things available to the browser console for easy debugging.
    (window as any).terramatch.getApiState = () => store.getState();
  }

  return store;
};

export const WrappedReduxProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const store = useMemo(() => makeStore(queryClient), [queryClient]);
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};
