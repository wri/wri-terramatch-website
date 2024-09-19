import { configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";

import { apiReducer } from "@/store/apiSlice";

export default configureStore({
  reducer: {
    api: apiReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger)
});
