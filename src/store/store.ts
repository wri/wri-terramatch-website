import { configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";

import ApiSlice, { apiSlice, authListenerMiddleware } from "@/store/apiSlice";

export const makeStore = (authToken?: string) => {
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

  ApiSlice.store = store;

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
