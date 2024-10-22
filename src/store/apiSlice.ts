import { createListenerMiddleware, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";
import isArray from "lodash/isArray";
import { HYDRATE } from "next-redux-wrapper";
import { Store } from "redux";

import { setAccessToken } from "@/admin/apiProvider/utils/token";
import { LoginDto, OrganisationDto, UserDto } from "@/generated/v3/userService/userServiceSchemas";

export type PendingErrorState = {
  statusCode: number;
  message: string;
  error?: string;
};

export type Pending = true | PendingErrorState;

export const isInProgress = (pending?: Pending) => pending === true;

export const isErrorState = (pending?: Pending): pending is PendingErrorState =>
  pending != null && !isInProgress(pending);

const METHODS = ["GET", "DELETE", "POST", "PUT", "PATCH"] as const;
export type Method = (typeof METHODS)[number];

export type ApiPendingStore = {
  [key in Method]: Record<string, Pending>;
};

type AttributeValue = string | number | boolean;
type Attributes = {
  [key: string]: AttributeValue | Attributes;
};

type Relationship = {
  type: string;
  id: string;
  meta?: Attributes;
};

export type Relationships = {
  [key: string]: Relationship[];
};

export type StoreResource<AttributeType> = {
  attributes: AttributeType;
  // We do a bit of munging on the shape from the API, removing the intermediate "data" member, and
  // ensuring there's always an array, to make consuming the data clientside a little smoother.
  relationships?: Relationships;
};

type StoreResourceMap<AttributeType> = Record<string, StoreResource<AttributeType>>;

// The list of potential resource types. IMPORTANT: When a new resource type is integrated, it must
// be added to this list.
export const RESOURCES = ["logins", "organisations", "users"] as const;

type ApiResources = {
  logins: StoreResourceMap<LoginDto>;
  organisations: StoreResourceMap<OrganisationDto>;
  users: StoreResourceMap<UserDto>;
};

export type JsonApiResource = {
  type: (typeof RESOURCES)[number];
  id: string;
  attributes: Attributes;
  relationships?: { [key: string]: { data: Relationship | Relationship[] } };
};

export type JsonApiResponse = {
  data: JsonApiResource[] | JsonApiResource;
  included?: JsonApiResource[];
};

export type ApiDataStore = ApiResources & {
  meta: {
    /** Stores the state of in-flight and failed requests */
    pending: ApiPendingStore;

    /** Is snatched and stored by middleware when a users/me request completes. */
    meUserId?: string;
  };
};

export const INITIAL_STATE = {
  ...RESOURCES.reduce((acc: Partial<ApiResources>, resource) => {
    acc[resource] = {};
    return acc;
  }, {}),

  meta: {
    pending: METHODS.reduce((acc: Partial<ApiPendingStore>, method) => {
      acc[method] = {};
      return acc;
    }, {}) as ApiPendingStore
  }
} as ApiDataStore;

type ApiFetchStartingProps = {
  url: string;
  method: Method;
};
type ApiFetchFailedProps = ApiFetchStartingProps & {
  error: PendingErrorState;
};
type ApiFetchSucceededProps = ApiFetchStartingProps & {
  response: JsonApiResponse;
};

const clearApiCache = (state: WritableDraft<ApiDataStore>) => {
  for (const resource of RESOURCES) {
    state[resource] = {};
  }

  for (const method of METHODS) {
    state.meta.pending[method] = {};
  }

  delete state.meta.meUserId;
};

const isLogin = ({ url, method }: { url: string; method: Method }) =>
  url.endsWith("auth/v3/logins") && method === "POST";

export const apiSlice = createSlice({
  name: "api",

  initialState: INITIAL_STATE,

  reducers: {
    apiFetchStarting: (state, action: PayloadAction<ApiFetchStartingProps>) => {
      const { url, method } = action.payload;
      state.meta.pending[method][url] = true;
    },
    apiFetchFailed: (state, action: PayloadAction<ApiFetchFailedProps>) => {
      const { url, method, error } = action.payload;
      state.meta.pending[method][url] = error;
    },
    apiFetchSucceeded: (state, action: PayloadAction<ApiFetchSucceededProps>) => {
      const { url, method, response } = action.payload;
      if (isLogin(action.payload)) {
        // After a successful login, clear the entire cache; we want all mounted components to
        // re-fetch their data with the new login credentials.
        clearApiCache(state);
      } else {
        delete state.meta.pending[method][url];
      }

      // All response objects from the v3 api conform to JsonApiResponse
      let { data, included } = response;
      if (!isArray(data)) data = [data];
      if (included != null) {
        // For the purposes of this reducer, data and included are the same: they both get merged
        // into the data cache.
        data = [...data, ...included];
      }
      for (const resource of data) {
        // The data resource type is expected to match what is declared above in ApiDataStore, but
        // there isn't a way to enforce that with TS against this dynamic data structure, so we
        // use the dreaded any.
        const { type, id, attributes, relationships: responseRelationships } = resource;
        const storeResource: StoreResource<any> = { attributes };
        if (responseRelationships != null) {
          storeResource.relationships = {};
          for (const [key, { data }] of Object.entries(responseRelationships)) {
            storeResource.relationships[key] = Array.isArray(data) ? data : [data];
          }
        }
        state[type][id] = storeResource;
      }

      if (url.endsWith("users/v3/users/me") && method === "GET") {
        state.meta.meUserId = (response.data as JsonApiResource).id;
      }
    },

    clearApiCache,

    // only used during app bootup.
    setInitialAuthToken: (state, action: PayloadAction<{ authToken: string }>) => {
      const { authToken } = action.payload;
      // We only ever expect there to be at most one Login in the store, and we never inspect the ID
      // so we can safely fake a login into the store when we have an authToken already set in a
      // cookie on app bootup.
      state.logins["1"] = { attributes: { token: authToken } };
    }
  },

  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action) => {
      const {
        payload: { api: payloadState }
      } = action as unknown as PayloadAction<{ api: ApiDataStore }>;

      if (state.meta.meUserId !== payloadState.meta.meUserId) {
        // It's likely the server hasn't loaded as many resources as the client. We should only
        // clear out our cached client-side state if the server claims to have a different logged-in
        // user state than we do.
        clearApiCache(state);
      }

      for (const resource of RESOURCES) {
        state[resource] = payloadState[resource] as StoreResourceMap<any>;
      }

      for (const method of METHODS) {
        state.meta.pending[method] = payloadState.meta.pending[method];
      }

      if (payloadState.meta.meUserId != null) {
        state.meta.meUserId = payloadState.meta.meUserId;
      }
    });
  }
});

export const authListenerMiddleware = createListenerMiddleware();
authListenerMiddleware.startListening({
  actionCreator: apiSlice.actions.apiFetchSucceeded,
  effect: async (
    action: PayloadAction<{
      url: string;
      method: Method;
      response: JsonApiResponse;
    }>
  ) => {
    if (!isLogin(action.payload)) return;
    const { token } = (action.payload.response.data as JsonApiResource).attributes as LoginDto;
    setAccessToken(token);
  }
});

export default class ApiSlice {
  private static _redux: Store;

  static set redux(store: Store) {
    this._redux = store;
  }

  static get redux(): Store {
    return this._redux;
  }

  static get apiDataStore(): ApiDataStore {
    return this.redux.getState().api;
  }

  static fetchStarting(props: ApiFetchStartingProps) {
    this.redux.dispatch(apiSlice.actions.apiFetchStarting(props));
  }

  static fetchFailed(props: ApiFetchFailedProps) {
    this.redux.dispatch(apiSlice.actions.apiFetchFailed(props));
  }

  static fetchSucceeded(props: ApiFetchSucceededProps) {
    this.redux.dispatch(apiSlice.actions.apiFetchSucceeded(props));
  }

  static clearApiCache() {
    this.redux.dispatch(apiSlice.actions.clearApiCache());
  }
}
