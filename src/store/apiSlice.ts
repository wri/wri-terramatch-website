import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isArray } from "lodash";

import { LoginResponse } from "@/generated/v3/userService/userServiceSchemas";

export type PendingErrorState = {
  statusCode: number;
  message: string;
  error?: string;
};

export type Pending = true | PendingErrorState;

export const isInProgress = (pending?: Pending) => pending === true;

export const isErrorState = (pending?: Pending): pending is PendingErrorState =>
  pending != null && !isInProgress(pending);

export type Method = "GET" | "DELETE" | "POST" | "PUT" | "PATCH";

export type ApiPendingStore = {
  [key in Method]: Record<string, Pending>;
};

// The list of potential resource types. Each of these resources must be included in ApiDataStore,
// with a mapping to the response type for that resource.
export const RESOURCES = ["logins"] as const;

export type JsonApiResource = {
  type: (typeof RESOURCES)[number];
  id: string;
};

export type JsonApiResponse = {
  data: JsonApiResource[] | JsonApiResource;
};

export type ApiDataStore = {
  logins: Record<string, LoginResponse>;

  meta: {
    pending: ApiPendingStore;
  };
};

const initialState: ApiDataStore = {
  logins: {},

  meta: {
    pending: {
      GET: {},
      DELETE: {},
      POST: {},
      PUT: {},
      PATCH: {}
    }
  }
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    apiFetchStarting: (state, action: PayloadAction<{ url: string; method: Method }>) => {
      const { url, method } = action.payload;
      state.meta.pending[method][url] = true;
    },
    apiFetchFailed: (state, action: PayloadAction<{ url: string; method: Method; error: PendingErrorState }>) => {
      const { url, method, error } = action.payload;
      state.meta.pending[method][url] = error;
    },
    apiFetchSucceeded: (state, action: PayloadAction<{ url: string; method: Method; response: JsonApiResponse }>) => {
      const { url, method, response } = action.payload;
      delete state.meta.pending[method][url];

      // All response objects from the v3 api conform to JsonApiResponse
      let { data } = response;
      if (!isArray(data)) data = [data];
      for (const resource of data) {
        // The data resource type is expected to match what is declared above in ApiDataStore, but
        // there isn't a way to enforce that with TS against this dynamic data structure, so we
        // use the dreaded any.
        state[resource.type][resource.id] = resource as any;
      }
    }
  }
});

export const { apiFetchStarting, apiFetchFailed, apiFetchSucceeded } = apiSlice.actions;
export const apiReducer = apiSlice.reducer;
