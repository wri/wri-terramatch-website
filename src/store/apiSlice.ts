import { createListenerMiddleware, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isArray } from "lodash";
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

type StoreResource<AttributeType> = {
  attributes: AttributeType;
  relationships?: {
    [key: string]: Relationship | Relationship[];
  };
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
  relationships?: Relationship | Relationship[];
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

const initialState = {
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

export const apiSlice = createSlice({
  name: "api",
  initialState,
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
      delete state.meta.pending[method][url];

      // All response objects from the v3 api conform to JsonApiResponse
      let { data } = response;
      if (!isArray(data)) data = [data];
      for (const resource of data) {
        // The data resource type is expected to match what is declared above in ApiDataStore, but
        // there isn't a way to enforce that with TS against this dynamic data structure, so we
        // use the dreaded any.
        const { type, id, ...rest } = resource;
        state[type][id] = rest as StoreResource<any>;
      }
    },

    clearApiCache: state => {
      for (const resource of RESOURCES) {
        state[resource] = {};
      }

      for (const method of METHODS) {
        state.meta.pending[method] = {};
      }
    },

    // only used during app bootup.
    setInitialAuthToken: (state, action: PayloadAction<{ authToken: string }>) => {
      const { authToken } = action.payload;
      // We only ever expect there to be at most one Login in the store, and we never inspect the ID
      // so we can safely fake a login into the store when we have an authToken already set in a
      // cookie on app bootup.
      state.logins["1"] = { attributes: { token: authToken } };
    }
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
    const { url, method, response } = action.payload;
    if (!url.endsWith("auth/v3/logins") || method !== "POST") return;

    const { token } = (response.data as JsonApiResource).attributes as LoginDto;
    setAccessToken(token);
  }
});

export default class ApiSlice {
  private static _store: Store;

  static set store(store: Store) {
    this._store = store;
  }

  static get store(): Store {
    return this._store;
  }

  static fetchStarting(props: ApiFetchStartingProps) {
    this.store.dispatch(apiSlice.actions.apiFetchStarting(props));
  }

  static fetchFailed(props: ApiFetchFailedProps) {
    this.store.dispatch(apiSlice.actions.apiFetchFailed(props));
  }

  static fetchSucceeded(props: ApiFetchSucceededProps) {
    this.store.dispatch(apiSlice.actions.apiFetchSucceeded(props));
  }

  static clearApiCache() {
    this.store.dispatch(apiSlice.actions.clearApiCache());
  }
}
