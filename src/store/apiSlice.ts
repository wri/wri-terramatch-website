import { createListenerMiddleware, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QueryClient } from "@tanstack/react-query";
import { compareDesc } from "date-fns";
import { WritableDraft } from "immer";
import { isNumber, isString, uniq } from "lodash";
import isArray from "lodash/isArray";
import { Store } from "redux";

import { getAccessToken, setAccessToken } from "@/admin/apiProvider/utils/token";
import {
  ENTITY_SERVICE_RESOURCES,
  EntityServiceApiResources
} from "@/generated/v3/entityService/entityServiceConstants";
import { JOB_SERVICE_RESOURCES, JobServiceApiResources } from "@/generated/v3/jobService/jobServiceConstants";
import {
  RESEARCH_SERVICE_RESOURCES,
  ResearchServiceApiResources
} from "@/generated/v3/researchService/researchServiceConstants";
import { USER_SERVICE_RESOURCES, UserServiceApiResources } from "@/generated/v3/userService/userServiceConstants";
import { LoginDto } from "@/generated/v3/userService/userServiceSchemas";
import { __TEST_HYDRATE__ } from "@/store/store";

export type PendingErrorState = {
  statusCode: number;
  message: string;
  error?: string;
};

export const isPendingErrorState = (error: unknown): error is PendingErrorState =>
  error != null && isNumber((error as PendingErrorState).statusCode) && isString((error as PendingErrorState).message);

export type Pending = true | PendingErrorState;

export const isInProgress = (pending?: Pending) => pending === true;

export const isErrorState = (pending?: Pending): pending is PendingErrorState =>
  pending != null && !isInProgress(pending);

const METHODS = ["GET", "DELETE", "POST", "PUT", "PATCH"] as const;
export type Method = (typeof METHODS)[number];

export type ApiPendingStore = {
  [key in Method]: Record<string, Pending>;
};

export type ApiFilteredIndexCache = {
  ids: string[];
  total?: number;
  included?: any[];
};

// This one is a map of resource -> queryString -> page number -> list of ids from that page.
export type ApiIndexStore = {
  [key in ResourceType]: Record<string, Record<number, ApiFilteredIndexCache>>;
};

type ApiDeletedStore = {
  [key in ResourceType]: string[];
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

export type StoreResourceMap<AttributeType> = Record<string, StoreResource<AttributeType>>;

export const RESOURCES = [
  ...ENTITY_SERVICE_RESOURCES,
  ...JOB_SERVICE_RESOURCES,
  ...USER_SERVICE_RESOURCES,
  ...RESEARCH_SERVICE_RESOURCES
] as const;

type ApiResources = EntityServiceApiResources &
  JobServiceApiResources &
  UserServiceApiResources &
  ResearchServiceApiResources;

export type ResourceType = (typeof RESOURCES)[number];

export type JsonApiResource = {
  type: ResourceType;
  id: string;
  attributes: Attributes;
  relationships?: { [key: string]: { data: Relationship | Relationship[] } };
};

export type IndexData = {
  resource: ResourceType;
  requestPath: string;
  ids: string[];
  total?: number;
  cursor?: string;
  pageNumber?: number;
  included?: any[];
};

export type ResponseMeta = {
  resourceType: ResourceType;
  resourceId?: string;
  indices?: IndexData[];
};

export type JsonApiResponse = {
  data?: JsonApiResource[] | JsonApiResource;
  included?: JsonApiResource[];
  meta: ResponseMeta;
};

export type IndexApiResponse = Omit<JsonApiResponse, "meta"> & {
  meta: Omit<ResponseMeta, "indices"> & { indices: IndexData[] };
};

export type DeleteApiResponse = Omit<JsonApiResponse, "meta" | "data"> & {
  meta: Omit<ResponseMeta, "indices" | "resourceId"> & { resourceId: string };
};

export type ApiDataStore = ApiResources & {
  meta: {
    /** Stores the state of in-flight and failed requests */
    pending: ApiPendingStore;

    /**
     * Stores the IDs and metadata that were returned for paginated (and often filtered and/or
     * sorted) index queries.
     **/
    indices: ApiIndexStore;

    deleted: ApiDeletedStore;

    /** Is snatched and stored by middleware when a users/me request completes. */
    meUserId?: string;
  };
};

export const INITIAL_STATE = {
  ...RESOURCES.reduce((acc: Partial<ApiResources>, resource) => {
    acc[resource] = {};

    if (resource === "logins" && typeof window !== "undefined") {
      const accessToken = getAccessToken();
      if (accessToken != null) {
        // We only ever expect there to be at most one Login in the store, and we never inspect the ID
        // so we can safely fake a login into the store when we have an authToken already set in a
        // cookie on app bootup.
        acc[resource]!["1"] = { attributes: { token: accessToken } };
      }
    }

    return acc;
  }, {}),

  meta: {
    pending: METHODS.reduce((acc: Partial<ApiPendingStore>, method) => {
      acc[method] = {};
      return acc;
    }, {}) as ApiPendingStore,

    indices: RESOURCES.reduce((acc, resource) => ({ ...acc, [resource]: {} }), {} as Partial<ApiIndexStore>),

    deleted: RESOURCES.reduce(
      (acc, resource) => ({ ...acc, [resource]: [] as string[] }),
      {} as Partial<ApiDeletedStore>
    )
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

// This may get more sophisticated in the future, but for now this is good enough
type PruneCacheProps = {
  resource: ResourceType;
  // If ids and searchQuery are null, the whole cache for this resource is removed.
  ids?: string[];
  // If searchQuery is specified, the search index meta cache is removed for this query.
  searchQuery?: string;
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

const pruneCache = (state: WritableDraft<ApiDataStore>, action: PayloadAction<PruneCacheProps>) => {
  const { resource, ids, searchQuery } = action.payload;
  if (ids == null && searchQuery == null) {
    state[resource] = {};
    return;
  }

  if (ids != null) {
    for (const id of ids) {
      delete state[resource][id];
    }
  }

  if (searchQuery != null) {
    delete state.meta.indices[resource][searchQuery];
  }
};

const isLogin = ({ url, method }: { url: string; method: Method }) =>
  url.endsWith("auth/v3/logins") && method === "POST";

const isIndexResponse = (method: string, response: JsonApiResponse): response is IndexApiResponse =>
  method === "GET" && isArray(response.data) && response.meta.indices != null && response.meta.indices.length > 0;

const isDeleteResponse = (method: string, response: JsonApiResponse): response is DeleteApiResponse =>
  method === "DELETE" && response.meta.resourceId != null;

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

      if (isDeleteResponse(method, response)) {
        const resource = response.meta.resourceType;
        const ids = [response.meta.resourceId];
        pruneCache(state, apiSlice.actions.pruneCache({ resource, ids }));
        state.meta.deleted[resource] = uniq([...state.meta.deleted[resource], ...ids]);
        return;
      }

      // All response objects from the v3 api conform to JsonApiResponse
      let { data, included } = response;
      if (!isArray(data)) data = [data!];

      if (isIndexResponse(method, response)) {
        for (const indexMeta of response.meta.indices) {
          let cache = state.meta.indices[indexMeta.resource][indexMeta.requestPath];
          if (cache == null) cache = state.meta.indices[indexMeta.resource][indexMeta.requestPath] = {};

          cache[indexMeta.pageNumber ?? 1] = {
            ids: indexMeta.ids,
            total: indexMeta.total,
            included: response.included
          };
        }
      }

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
        let useResponseResource = true;

        const cached = state[type][id] as StoreResource<any>;
        if (cached != null) {
          const { updatedAt: cachedUpdatedAt, lightResource: cachedLightResource } = cached.attributes;
          const { updatedAt: responseUpdatedAt, lightResource: responseLightResource } = attributes;
          if (
            cachedUpdatedAt != null &&
            responseUpdatedAt != null &&
            responseLightResource === true &&
            cachedLightResource === false
          ) {
            // if the cached value in the store is a full resource and the resource in the response
            // is a light resource, we only want to replace what's in the store if the updatedAt
            // stamp on the response resource is newer.
            useResponseResource =
              compareDesc(new Date(responseUpdatedAt as string), new Date(cachedUpdatedAt as string)) > 0;
          }
        }

        if (useResponseResource) {
          const storeResource: StoreResource<any> = { attributes };
          if (responseRelationships != null) {
            storeResource.relationships = {};
            for (const [key, { data }] of Object.entries(responseRelationships)) {
              storeResource.relationships[key] = Array.isArray(data) ? data : [data];
            }
          }
          state[type][id] = storeResource;
        }
      }

      if (url.endsWith("users/v3/users/me") && method === "GET") {
        state.meta.meUserId = (response.data as JsonApiResource).id;
      }
    },

    pruneCache,

    clearApiCache
  },

  extraReducers: builder => {
    // Used only in test suites to dump some specific state into the store.
    builder.addCase(__TEST_HYDRATE__, (state, action) => {
      const {
        payload: { api: payloadState }
      } = action as unknown as PayloadAction<{ api: ApiDataStore }>;

      clearApiCache(state);

      for (const resource of RESOURCES) {
        state[resource] = payloadState[resource] as StoreResourceMap<any>;
      }

      state.meta = payloadState.meta;
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
  static redux: Store;
  private static _queryClient?: QueryClient;

  static set queryClient(value: QueryClient | undefined) {
    this._queryClient = value;
  }

  static get currentState(): ApiDataStore {
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

  static pruneCache(resource: ResourceType, ids?: string[]) {
    this.redux.dispatch(apiSlice.actions.pruneCache({ resource, ids }));
  }

  static pruneIndex(resource: ResourceType, searchQuery: string) {
    this.redux.dispatch(apiSlice.actions.pruneCache({ resource, searchQuery }));
  }

  static clearApiCache() {
    this.redux.dispatch(apiSlice.actions.clearApiCache());
    this._queryClient?.getQueryCache()?.clear();
    this._queryClient?.clear();
  }
}
