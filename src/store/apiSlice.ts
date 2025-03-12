import { createListenerMiddleware, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QueryClient } from "@tanstack/react-query";
import { compareDesc } from "date-fns";
import { WritableDraft } from "immer";
import isArray from "lodash/isArray";
import { Store } from "redux";

import { getAccessToken, setAccessToken } from "@/admin/apiProvider/utils/token";
import {
  DemographicDto,
  EstablishmentsTreesDto,
  ProjectFullDto,
  ProjectLightDto,
  SiteFullDto,
  SiteLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { DelayedJobDto } from "@/generated/v3/jobService/jobServiceSchemas";
import { SitePolygonDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  LoginDto,
  OrganisationDto,
  ResetPasswordResponseDto,
  UserDto,
  VerificationUserResponseDto
} from "@/generated/v3/userService/userServiceSchemas";
import { FetchParams, serializeParams } from "@/generated/v3/utils";
import { __TEST_HYDRATE__ } from "@/store/store";

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

export type ApiFilteredIndexCache = {
  ids: string[];
  page: ResponseMeta["page"];
};

// This one is a map of resource -> queryString -> page number -> list of ids from that page.
export type ApiIndexStore = {
  [key in ResourceType]: Record<string, Record<number, ApiFilteredIndexCache>>;
};

export const indexMetaSelector = (
  resource: ResourceType,
  { pathParams, queryParams }: { pathParams?: FetchParams; queryParams?: FetchParams }
) => {
  const modifiedQuery = { ...queryParams };
  const pageNumber = Number(modifiedQuery["page[number]"] ?? 0);
  delete modifiedQuery["page[number]"];
  const serialized = serializeParams(pathParams, queryParams);

  return (store: ApiDataStore) => store.meta.indices[resource][serialized]?.[pageNumber];
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

// The list of potential resource types. IMPORTANT: When a new resource type is integrated, it must
// be added to this list.
export const RESOURCES = [
  "delayedJobs",
  "demographics",
  "establishmentTrees",
  "logins",
  "organisations",
  "passwordResets",
  "verifications",
  "projects",
  "sites",
  "users",
  "sitePolygons"
] as const;

// The store for entities may contain either light DTOs or full DTOs depending on where the
// data came from. This type allows us to specify that the shape of the objects in the store
// conform to the light DTO and all full DTO members are optional. The connections that use
// this section of the store should explicitly cast their member object to either the light
// or full version depending on what the connection is expected to produce. See Entity.ts connection
// for more.
type EntityType<LightDto, FullDto> = LightDto & Partial<Omit<FullDto, keyof LightDto>>;

type ApiResources = {
  delayedJobs: StoreResourceMap<DelayedJobDto>;
  demographics: StoreResourceMap<DemographicDto>;
  establishmentTrees: StoreResourceMap<EstablishmentsTreesDto>;
  logins: StoreResourceMap<LoginDto>;
  organisations: StoreResourceMap<OrganisationDto>;
  passwordResets: StoreResourceMap<ResetPasswordResponseDto>;
  verifications: StoreResourceMap<VerificationUserResponseDto>;
  projects: StoreResourceMap<EntityType<ProjectLightDto, ProjectFullDto>>;
  sites: StoreResourceMap<EntityType<SiteLightDto, SiteFullDto>>;
  users: StoreResourceMap<UserDto>;
  sitePolygons: StoreResourceMap<SitePolygonDto>;
};

export type ResourceType = (typeof RESOURCES)[number];

export type JsonApiResource = {
  type: ResourceType;
  id: string;
  attributes: Attributes;
  relationships?: { [key: string]: { data: Relationship | Relationship[] } };
};

export type ResponseMeta = {
  resourceType: ResourceType;
  page?: {
    number: number;
    total: number;
  };
};

export type JsonApiResponse = {
  data: JsonApiResource[] | JsonApiResource;
  included?: JsonApiResource[];
  meta: ResponseMeta;
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

    indices: RESOURCES.reduce((acc, resource) => ({ ...acc, [resource]: {} }), {} as Partial<ApiIndexStore>)
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
  serializedParams: string;
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

const isLogin = ({ url, method }: { url: string; method: Method }) =>
  url.endsWith("auth/v3/logins") && method === "POST";

const isIndexResponse = ({ method, response }: { method: string; response: JsonApiResponse }) =>
  method === "GET" && isArray(response.data);

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
      // All response objects from the v3 api conform to JsonApiResponse
      let { data, included, meta } = response;
      if (!isArray(data)) data = [data];

      if (isIndexResponse(action.payload)) {
        let cache = state.meta.indices[meta.resourceType][action.payload.serializedParams];
        if (cache == null) cache = state.meta.indices[meta.resourceType][action.payload.serializedParams] = {};

        const pageNumber = Number(new URL(url).searchParams.get("page[number]") ?? 0);
        cache[pageNumber] = {
          ids: data.map(({ id }) => id),
          page: action.payload.response.meta.page
        };
      }

      if (isLogin(action.payload)) {
        // After a successful login, clear the entire cache; we want all mounted components to
        // re-fetch their data with the new login credentials.
        clearApiCache(state);
      } else {
        delete state.meta.pending[method][url];
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

    pruneCache: (state, action: PayloadAction<PruneCacheProps>) => {
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
    },

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
