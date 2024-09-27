import { configureStore } from "@reduxjs/toolkit";
import { Store } from "redux";
import { createLogger } from "redux-logger";

import ApiSlice, { ApiDataStore, apiSlice, authListenerMiddleware } from "@/store/apiSlice";

export type AppStore = {
  api: ApiDataStore;
};

let store: Store<AppStore>;

export const makeStore = (authToken?: string): Store<AppStore> => {
  if (store != null) return store;

  store = configureStore({
    reducer: {
      api: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => {
      if (
        process.env.NEXT_RUNTIME === "nodejs" ||
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "test"
      ) {
        return getDefaultMiddleware().prepend(authListenerMiddleware.middleware);
      } else {
        // Most of our actions include a URL, and it's useful to have that in the top level visible
        // log when it's present.
        const logger = createLogger({
          titleFormatter: (action: any, time: string, took: number) => {
            const extra = action?.payload?.url == null ? "" : ` [${action.payload.url}]`;
            return `action @ ${time} ${action.type} (in ${took.toFixed(2)} ms)${extra}`;
          }
        });
        return getDefaultMiddleware().prepend(authListenerMiddleware.middleware).concat(logger);
      }
    }
  });

  ApiSlice.redux = store;

  if (authToken != null) {
    store.dispatch(apiSlice.actions.setInitialAuthToken({ authToken }));
  }

  return store;
};
