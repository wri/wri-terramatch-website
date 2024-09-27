import { configureStore } from "@reduxjs/toolkit";
import { Store } from "redux";
import { logger } from "redux-logger";

import ApiSlice, { ApiDataStore, apiSlice, authListenerMiddleware } from "@/store/apiSlice";

export type AppStore = {
  api: ApiDataStore;
};

export const makeStore = (authToken?: string): Store<AppStore> => {
  const store = configureStore({
    reducer: {
      api: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => {
      if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
        return getDefaultMiddleware().prepend(authListenerMiddleware.middleware);
      } else {
        return getDefaultMiddleware().prepend(authListenerMiddleware.middleware).concat(logger);
      }
    }
  });

  if (authToken != null) {
    store.dispatch(apiSlice.actions.setInitialAuthToken({ authToken }));
  }

  ApiSlice.redux = store;

  return store;
};
