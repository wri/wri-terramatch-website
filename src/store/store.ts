import { configureStore } from "@reduxjs/toolkit";
import { createWrapper, MakeStore } from "next-redux-wrapper";
import { Store } from "redux";
import { createLogger } from "redux-logger";

import ApiSlice, { ApiDataStore, apiSlice, authListenerMiddleware } from "@/store/apiSlice";

export type AppStore = {
  api: ApiDataStore;
};

const makeStore: MakeStore<Store<AppStore>> = context => {
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

  return store;
};

export const wrapper = createWrapper<Store<AppStore>>(makeStore);
