import { assign, Dictionary, isEmpty, merge } from "lodash";
import { createSelector } from "reselect";

import { resourcesDeletedSelector } from "@/connections/util/resourceDeleter";
import { FetchParams, getStableQuery, RequestVariables, resolveUrl, V3ApiEndpoint } from "@/generated/v3/utils";
import ApiSlice, {
  ApiDataStore,
  ApiFilteredIndexCache,
  PendingError,
  Relationships,
  ResourceType,
  StoreResource,
  StoreResourceMap
} from "@/store/apiSlice";
import { Connection, LoadedPredicate, PaginatedConnectionProps, PaginatedQueryParams } from "@/types/connection";
import Log from "@/utils/log";
import { selectorCache } from "@/utils/selectorCache";

class ApiConnectionFactoryError extends Error {}

export type DataConnection<DTO> = { data?: DTO };
export type ListConnection<DTO> = { data?: DTO[] };
export type MapConnection<DTO> = { data?: Dictionary<DTO> };
export type IndexConnection<DTO> = ListConnection<DTO> & {
  indexTotal?: number;
};
export type CreateConnection<DTO, CreateAttributes> = DataConnection<DTO> & {
  isCreating: boolean;
  createFailure: PendingError | undefined;
  create: (attributes: CreateAttributes, isMultipart?: boolean) => void;
};
export type LoadFailureConnection = { loadFailure: PendingError | undefined };
export type IsLoadingConnection = { isLoading: boolean };
export type IsDeletedConnection = { isDeleted: boolean };
export type RefetchConnection = { refetch: () => void };
export type UpdateConnection<UpdateAttributes> = {
  isUpdating: boolean;
  updateFailure: PendingError | undefined;
  update: (attributes: UpdateAttributes) => void;
};

type Sideloads<Variables extends QueryVariables> = Required<Variables>["queryParams"] extends { sideloads?: infer T }
  ? T
  : never;

export type IdProp = { id?: string };
export type IdsProp = { ids?: string[] };
export type FilterProp<Filters> = { filter?: Filters };
export type SideloadsProp<SideloadsType> = { sideloads?: SideloadsType };
export type EnabledProp = {
  /**
   * The connection will count as loaded if this value is explicitly set to false, preventing any API
   * requests until it is removed or set to true.
   */
  enabled?: boolean;
};

export type Fetcher<Variables, Headers> = (variables: Variables, headers?: Headers) => void;
type IndexMetaSelector<Variables> = (
  resource: ResourceType,
  variables: Omit<Variables, "body">
) => (store: ApiDataStore) => ApiFilteredIndexCache;

export type QueryVariables = {
  pathParams?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
};
type UpdateData<Attributes = unknown> = { type: ResourceType; id: string; attributes: Attributes };
type UpdateAttributes<T> = T extends UpdateBody<infer D> ? (D extends UpdateData<infer A> ? A : never) : never;
type UpdateBody<U extends UpdateData = UpdateData> = {
  body: {
    data: U;
  };
};
type CreateData<Attributes = unknown> = { type: ResourceType; attributes: Attributes };
type CreateAttributes<T> = T extends CreateBody<infer D> ? (D extends CreateData<infer A> ? A : never) : never;
export type CreateBody<C extends CreateData = CreateData> = {
  body: {
    data: C;
  };
};
type PartialVariablesFactory<Variables extends QueryVariables, Props> = (
  props: Props
) => Partial<Variables> | undefined;
type VariablesFactory<Variables extends QueryVariables, Props> = (props: Props) => Variables | undefined;

type ResourceFilter<DTO, Props> = (
  props: Props,
  indexMeta: ApiFilteredIndexCache,
  resources: StoreResourceMap<DTO>
) => DTO[] | undefined;

type ResourceSelector<Props, Variables extends QueryVariables> = (
  props: Props,
  variablesFactory: VariablesFactory<Variables, Props>,
  resource: ResourceType
) => (store: ApiDataStore) => StoreResource<unknown> | undefined;

const resourceSelectorById =
  ({ id }: IdProp, _: unknown, resource: ResourceType) =>
  (store: ApiDataStore) =>
    id == null ? undefined : store[resource][id];

const resourceSelectorByCustomId =
  <Props>(customIdFactory: (props: Props) => string) =>
  (props: Props, _: unknown, resource: ResourceType) => {
    const id = customIdFactory(props);
    return (store: ApiDataStore) => (id == null ? undefined : store[resource][id]);
  };

const resourceSelectorByFilter = <
  FilterFields,
  Props extends FilterProp<FilterFields>,
  Variables extends QueryVariables
>(
  props: Props,
  variablesFactory: VariablesFactory<Variables, Props>,
  resource: ResourceType
) => {
  const variables = variablesFactory(props);
  if (variables == null) return () => undefined;

  const id = getStableQuery(variables.queryParams as FetchParams);
  return (store: ApiDataStore) => store[resource][id];
};

const resourceAttributesSelector =
  <DTO, Props, Variables extends QueryVariables>(resourceSelector: ResourceSelector<Props, Variables>) =>
  (props: Props, variablesFactory: VariablesFactory<Variables, Props>, resource: ResourceType) =>
    createSelector([resourceSelector(props, variablesFactory, resource)], resource => ({
      data: resource?.attributes as DTO | undefined
    }));

const resourceRelationshipsSelector = (props: IdProp, variablesFactory: unknown, resource: ResourceType) =>
  createSelector([resourceSelectorById(props, variablesFactory, resource)], resource => resource?.relationships);

const resourceMapSelector =
  <DTO>(resource: ResourceType) =>
  (store: ApiDataStore) =>
    store[resource] as StoreResourceMap<DTO>;

const indexDataSelector =
  <DTO, Variables extends QueryVariables, Props>(
    resource: ResourceType,
    indexMetaSelector: IndexMetaSelector<Variables>
  ) =>
  (props: Props, variablesFactory: VariablesFactory<Variables, Props>) =>
    createSelector(
      [indexMetaSelector(resource, variablesFactory(props) as Variables), resourceMapSelector<DTO>(resource)],
      (indexMeta, resources): IndexConnection<DTO> => {
        if (indexMeta == null) return {};

        const data = [] as DTO[];
        for (const id of indexMeta.ids) {
          // If we're missing any of the data we're supposed to have, return nothing so the
          // index endpoint is queried again.
          if (resources[id] == null) return {};
          data.push(resources[id].attributes as DTO);
        }

        return { data, indexTotal: indexMeta.total };
      }
    );

const multipleResourceSelector =
  <DTO, Variables extends QueryVariables>(resource: ResourceType, indexMetaSelector: IndexMetaSelector<Variables>) =>
  (props: IdsProp, variablesFactory: VariablesFactory<Variables, IdsProp>) =>
    createSelector(
      [indexMetaSelector(resource, variablesFactory(props) as Variables), resourceMapSelector<DTO>(resource)],
      (indexMeta, resources): MapConnection<DTO> => {
        // Start with the index meta ids - if we've queried this exact set of ids before, this will
        // represent what the server actually sent, even if it doesn't fully match what was in the query.
        // In the case where we haven't queried this exact set before and one or more of them is
        // missing from the cache, return an empty map so that this exact set is queried.
        const ids = indexMeta?.ids ?? props.ids ?? [];
        const cacheData = ids.reduce((data, id) => {
          if (resources[id] == null) return data;
          return { ...data, [id]: resources[id].attributes as DTO };
        }, {} as Dictionary<DTO>);

        return Object.keys(cacheData ?? {}).length === ids.length ? { data: cacheData } : { data: undefined };
      }
    );

const filterResourceSelector =
  <DTO, Variables extends QueryVariables, Props extends Record<string, unknown>>(
    resource: ResourceType,
    indexMetaSelector: IndexMetaSelector<Variables>,
    resourceFilter: ResourceFilter<DTO, Props>
  ) =>
  (props: Props, variablesFactory: VariablesFactory<Variables, Props>) =>
    createSelector(
      [indexMetaSelector(resource, variablesFactory(props) as Variables), resourceMapSelector<DTO>(resource)],
      (indexMeta, resources): ListConnection<DTO> => {
        const filtered = resourceFilter(props, indexMeta, resources);
        if ((filtered == null || filtered.length === 0) && indexMeta == null) return {};

        return { data: filtered ?? [] };
      }
    );

const queryParamCacheKeyFactory =
  <Variables extends QueryVariables, Props>(variablesFactory: VariablesFactory<Variables, Props>) =>
  (props: Props) => {
    const variables = variablesFactory(props);
    if (variables == null) return "";

    let cacheKey = "";
    const { pathParams, queryParams } = variables;
    if (pathParams != null) {
      cacheKey =
        Object.keys(pathParams)
          .sort()
          .map(key => String(pathParams[key]))
          .join(":") + ":";
    }
    if (queryParams != null) {
      cacheKey = `${cacheKey}${getStableQuery(queryParams as FetchParams)}`;
    }
    return cacheKey;
  };

type SelectorFactory<Variables extends QueryVariables, Selected, Props extends Record<string, unknown>> = (
  props: Props,
  variablesFactory: VariablesFactory<Variables, Props>,
  resource: ResourceType
) => (state: ApiDataStore) => Selected;

type SelectorCacheKeyFactory<Variables extends QueryVariables, Props extends Record<string, unknown>> = (
  variablesFactory: VariablesFactory<Variables, Props>
) => (props: Props) => string;

type ConnectionPrototype<
  Variables extends QueryVariables,
  Selected,
  Props extends Record<string, unknown>,
  Headers extends {}
> = {
  resource: ResourceType;
  selectorCacheKeyFactory: SelectorCacheKeyFactory<Variables, Props>;
  selectors?: SelectorFactory<Variables, Selected, Props>[];
  variablesFactory?: PartialVariablesFactory<Variables, Props>;
  isLoaded?: LoadedPredicate<Selected, Props>;
  fetcher?: Fetcher<Variables, Headers>;
};

const withDebugLogging = <V extends QueryVariables, S, P extends Record<string, unknown>, H extends {}>(
  label: string,
  { variablesFactory, isLoaded, selectors, resource, fetcher, selectorCacheKeyFactory }: ConnectionPrototype<V, S, P, H>
): ConnectionPrototype<V, S, P, H> => ({
  variablesFactory:
    variablesFactory == null
      ? undefined
      : props => {
          const result = variablesFactory(props);
          Log.debug(`[${label}] Variables`, { props, result });
          return result;
        },
  isLoaded:
    isLoaded == null
      ? undefined
      : (selected, props) => {
          const result = isLoaded(selected, props);
          Log.debug(`[${label}] isLoaded`, { props, result });
          return result;
        },
  fetcher,
  selectors,
  resource,
  selectorCacheKeyFactory
});

const requireEndpoint = <R, E, V extends RequestVariables, H extends {}>(endpoint?: V3ApiEndpoint<R, E, V, H>) => {
  if (endpoint == null) throw new ApiConnectionFactoryError("Endpoint not defined for this factory");
  return endpoint;
};

/**
 * Begins the ApiConnectionFactory chain for a given resource type and V3ApiEndpoint. For most of the
 * connection type functions provided off of v3Endpoint, the `endpoint` parameter is required.
 */
export const v3Resource = <TResponse, TError, TVariables extends RequestVariables, THeaders extends {}>(
  resource: ResourceType,
  endpoint?: V3ApiEndpoint<TResponse, TError, TVariables, THeaders>
) => ({
  /**
   * Creates a connection that fetches a single resource from the backend.
   */
  singleResource: <DTO>(variablesFactory: VariablesFactory<TVariables, IdProp>) =>
    new ApiConnectionFactory<TVariables, DataConnection<DTO>, IdProp, THeaders>(endpoint, {
      resource,
      fetcher: requireEndpoint(endpoint).fetch.bind(endpoint),
      isLoaded: ({ data }, { id }) => isEmpty(id) || data != null,
      variablesFactory,
      selectors: [resourceAttributesSelector<DTO, IdProp, TVariables>(resourceSelectorById)],
      selectorCacheKeyFactory:
        () =>
        ({ id }: IdProp) =>
          id ?? ""
    }).loadFailure(),

  /**
   * Creates a connection that fetches a "full" resource from the backend (one that has
   * lightResource: false in its DTO). If the current cached copy of this resource is a light resource,
   * the connection is not complete, and the fetch will occur.
   */
  singleFullResource: <DTO extends { lightResource: boolean }>(
    variablesFactory: VariablesFactory<TVariables, IdProp>
  ) =>
    new ApiConnectionFactory<TVariables, DataConnection<DTO>, IdProp, THeaders>(endpoint, {
      resource,
      fetcher: requireEndpoint(endpoint).fetch.bind(endpoint),
      isLoaded: ({ data }, { id }) => isEmpty(id) || (data != null && !data.lightResource),
      variablesFactory,
      selectors: [resourceAttributesSelector<DTO, IdProp, TVariables>(resourceSelectorById)],
      selectorCacheKeyFactory:
        () =>
        ({ id }: IdProp) =>
          id ?? ""
    }).loadFailure(),

  /**
   * Creates a connection that fetches a single resource from the BE with a custom ID pattern.
   */
  singleByCustomId: <DTO, Props extends Record<string, unknown>>(
    variablesFactory: VariablesFactory<TVariables, Props>,
    customIdFactory: (props: Props) => string
  ) =>
    new ApiConnectionFactory<TVariables, DataConnection<DTO>, Props, THeaders>(endpoint, {
      resource,
      fetcher: requireEndpoint(endpoint).fetch.bind(endpoint),
      isLoaded: ({ data }, props) => {
        const id = customIdFactory(props);
        return isEmpty(id) || data != null;
      },
      variablesFactory,
      selectors: [resourceAttributesSelector<DTO, Props, TVariables>(resourceSelectorByCustomId(customIdFactory))],
      selectorCacheKeyFactory: () => props => customIdFactory(props)
    }).loadFailure(),

  /**
   * Creates a connection that fetches a single resource by using query param filters instead of
   * a single resource ID. The ID from the BE is expected to be the stable query string as created
   * by getStableQuery().
   */
  singleByFilter: <DTO, FilterFields extends Required<TVariables>["queryParams"]>(
    variablesFactory: VariablesFactory<TVariables, FilterProp<FilterFields>> = () => ({} as TVariables)
  ) =>
    new ApiConnectionFactory<TVariables, DataConnection<DTO>, {}, THeaders>(endpoint, {
      resource,
      fetcher: requireEndpoint(endpoint).fetch.bind(endpoint),
      isLoaded: ({ data }) => data != null,
      variablesFactory,
      selectors: [
        resourceAttributesSelector<DTO, FilterProp<TVariables["queryParams"]>, TVariables>(resourceSelectorByFilter)
      ],
      selectorCacheKeyFactory: queryParamCacheKeyFactory
    })
      .filter<FilterFields>()
      .loadFailure(),

  /**
   * Creates a connection that fetches multiple resources at once with an `ids` array query parameter.
   */
  multipleResources: <DTO>(variablesFactory: VariablesFactory<TVariables, IdsProp>) =>
    new ApiConnectionFactory<TVariables, MapConnection<DTO>, IdsProp, THeaders>(endpoint, {
      resource,
      fetcher: requireEndpoint(endpoint).fetch.bind(endpoint),
      isLoaded: ({ data }) => data != null,
      variablesFactory,
      selectors: [
        multipleResourceSelector<DTO, TVariables>(resource, requireEndpoint(endpoint).indexMetaSelector.bind(endpoint))
      ],
      selectorCacheKeyFactory: queryParamCacheKeyFactory
    }).loadFailure(),

  /**
   * Creates a connection that looks for resources that match the filter in the cached store, and if
   * the filter is not satisfied, it returns undefined, allowing the request to execute.
   */
  filterResources: <DTO, Props extends Record<string, unknown>>(
    variablesFactory: VariablesFactory<TVariables, Props>,
    resourceFilter: ResourceFilter<DTO, Props>
  ) =>
    new ApiConnectionFactory<TVariables, ListConnection<DTO>, Props, THeaders>(endpoint, {
      resource,
      fetcher: requireEndpoint(endpoint).fetch.bind(endpoint),
      isLoaded: ({ data }) => data != null,
      variablesFactory,
      selectors: [
        filterResourceSelector<DTO, TVariables, Props>(
          resource,
          requireEndpoint(endpoint).indexMetaSelector.bind(endpoint),
          resourceFilter
        )
      ],
      selectorCacheKeyFactory: queryParamCacheKeyFactory
    }).loadFailure(),

  /**
   * Creates a connection that fetches a resource index from the backend.
   */
  index: <DTO, Props extends Record<string, unknown> = {}>(
    variablesFactory: VariablesFactory<TVariables, Props> = () => ({} as TVariables)
  ) =>
    new ApiConnectionFactory<TVariables, IndexConnection<DTO>, Props, THeaders>(endpoint, {
      resource,
      fetcher: requireEndpoint(endpoint).fetch.bind(endpoint),
      isLoaded: ({ data }) => data != null,
      variablesFactory,
      selectors: [
        indexDataSelector<DTO, TVariables, Props>(resource, requireEndpoint(endpoint).indexMetaSelector.bind(endpoint))
      ],
      selectorCacheKeyFactory: queryParamCacheKeyFactory
    }).loadFailure(),

  /**
   * Creates a connection for creating a resource.
   */
  create: <DTO, Props extends Record<string, unknown> = {}>(
    variablesFactory: VariablesFactory<Omit<TVariables, "body">, Props> = () => ({} as Omit<TVariables, "body">)
  ) => {
    console.log("variablesFactory", variablesFactory);
    const createEndpoint = requireEndpoint(endpoint);
    return new ApiConnectionFactory<TVariables, CreateConnection<DTO, CreateAttributes<TVariables>>, Props, THeaders>(
      // This connection does not load data on mount; the endpoint being passed in is for creation of resources.
      undefined,
      {
        resource,
        variablesFactory:
          variablesFactory == null ? undefined : (variablesFactory as PartialVariablesFactory<TVariables, Props>),
        selectors: [
          (props, variablesFactory, resource) => {
            const variables = variablesFactory(props);
            console.log("variables", variables);
            if (variables == null) {
              const create = () => {};
              return () => ({ data: undefined, isCreating: false, createFailure: undefined, create });
            }

            return createSelector(
              [
                createEndpoint.isFetchingSelector(variables),
                createEndpoint.fetchFailedSelector(variables),
                createEndpoint.completeSelector(variables),
                resourceMapSelector<DTO>(resource)
              ],
              (isCreating, createFailure, createCompleted, resources) => {
                if (createCompleted != null && createCompleted.resourceIds.length !== 1) {
                  Log.error("The create connection factory expects a single resource to be created", {
                    createCompleted
                  });
                }

                const create = (attributes: CreateAttributes<TVariables>, isMultipart?: boolean) => {
                  if (createFailure != null || createCompleted != null) {
                    ApiSlice.clearPending(resolveUrl(createEndpoint.url, variables), createEndpoint.method);
                  }
                  console.log("isMultipart", isMultipart);
                  let headers: HeadersInit = {
                    "Content-Type": isMultipart ? "multipart/form-data" : "application/json"
                  };
                  console.log("headers", headers);
                  console.log("variables", variables);
                  console.log("resource", resource);
                  console.log("attributes", attributes);
                  if (isMultipart) {
                    // @ts-ignore
                    const { formData, ...restAttributes } = attributes;
                    formData.append("type", resource);
                    formData.append("data", JSON.stringify({ attributes: restAttributes }));
                    createEndpoint.fetch({ ...variables, body: formData }, headers as THeaders);
                  } else {
                    createEndpoint.fetch(
                      { ...variables, body: { data: { type: resource, attributes } } },
                      headers as THeaders
                    );
                  }
                };

                return {
                  data:
                    createCompleted != null && createCompleted.resourceIds.length === 1
                      ? resources[createCompleted?.resourceIds[0]]?.attributes
                      : undefined,
                  isCreating,
                  createFailure,
                  create
                };
              }
            );
          }
        ],
        selectorCacheKeyFactory: queryParamCacheKeyFactory
      }
    );
  },

  /**
   * Creates a connection that does no fetching; it simply pulls a list of resources by ID from the cache.
   */
  list: <DTO>() =>
    new ApiConnectionFactory<never, ListConnection<DTO>, IdsProp, never>(undefined, {
      resource,
      selectors: [
        ({ ids }, _, resource) => {
          if (ids == null) return () => ({ data: undefined });
          return createSelector([resourceMapSelector<DTO>(resource)], resources => ({
            data: ids.map(id => resources[id]?.attributes)
          }));
        }
      ],
      selectorCacheKeyFactory:
        () =>
        ({ ids }) =>
          ids?.join() ?? ""
    })
});

/**
 * The factory class for chaining features into, and then building a connection. It is not exported
 * from this module on purpose - the entry point for creating a factory is the v3Resources method.
 */
class ApiConnectionFactory<
  Variables extends QueryVariables,
  Selected,
  Props extends Record<string, unknown>,
  Headers extends {}
> {
  constructor(
    protected readonly endpoint: V3ApiEndpoint | undefined,
    protected readonly prototype: ConnectionPrototype<Variables, Selected, Props, Headers>
  ) {}

  /**
   * Adds a `loadFailure` property to the connection. If the connection reports a load failure, it
   * counts as loaded.
   *
   * This will typically be used on every connection that fetches data. If it is left off, the FE
   * will keep polling the BE on failure until a successful response is returned, which is not
   * likely to be the desired behavior.
   */
  loadFailure() {
    const endpoint = requireEndpoint(this.endpoint);
    return this.chain<LoadFailureConnection, Props>({
      isLoaded: ({ loadFailure }) => loadFailure != null,
      selectors: [
        (props, variablesFactory) => {
          const variables = variablesFactory(props);
          if (variables == null) return () => ({ loadFailure: undefined });
          return createSelector([endpoint.fetchFailedSelector(variables)], loadFailure => ({ loadFailure }));
        }
      ]
    });
  }

  /**
   * Adds an `isLoading` boolean flag to the connection.
   */
  public isLoading() {
    const endpoint = requireEndpoint(this.endpoint);
    return this.chain<IsLoadingConnection, Props>({
      selectors: [
        (props, variablesFactory) => {
          const variables = variablesFactory(props);
          if (variables == null) return () => ({ isLoading: false });
          return createSelector([endpoint.isFetchingSelector(variables)], isLoading => ({ isLoading }));
        }
      ]
    });
  }

  /**
   * Adds an isDeleted flag to the connection using the resourcesDeletedSelector from connectedResourceDeleter
   */
  public isDeleted() {
    return this.chain<IsDeletedConnection, IdProp & Props>({
      isLoaded: ({ isDeleted }) => isDeleted,
      selectors: [
        ({ id }, _, resource) => {
          if (id == null) return () => ({ isDeleted: false });
          return createSelector([resourcesDeletedSelector(resource)], deleted => ({
            isDeleted: deleted.includes(id)
          }));
        }
      ]
    });
  }

  /**
   * Adds pagination features to the props and variable modification for this index connection.
   */
  public pagination() {
    return this.addProps<PaginatedConnectionProps>(({ pageSize, pageNumber, sortField, sortDirection }) => {
      const queryParams: PaginatedQueryParams = {};
      if (pageNumber != null) {
        queryParams["page[number]"] = pageNumber;
        queryParams["page[size]"] = pageSize;
      }
      if (sortField != null) {
        queryParams["sort[field]"] = sortField;
        queryParams["sort[direction]"] = sortDirection ?? "ASC";
      }
      return { queryParams } as Variables;
    });
  }

  /**
   * Adds a `filter` prop to the connection that is a subset of the query params for the request.
   * Explicitly supplying the FilterFields generic parameter is required for correct typing.
   */
  public filter<FilterFields extends Required<Variables>["queryParams"] = never>() {
    return this.addProps<FilterProp<FilterFields>>(({ filter }) => ({ queryParams: filter ?? {} } as Variables));
  }

  /**
   * Adds an "enabled" connection prop so that the final connection can be disabled easily via props.
   */
  public enabledProp() {
    return this.addProps<EnabledProp>(undefined, (_, { enabled }) => enabled === false);
  }

  /**
   * Adds a no-arg refetch() method to the final connection shape that calls the provided refetch method under the hood.
   */
  public refetch(refetch: (props: Props, variablesFactory: VariablesFactory<Variables, Props>) => void) {
    return this.chain<RefetchConnection, Props>({
      selectors: [
        (props, variablesFactory) => {
          // It's important for the selector to always return the identical result, regardless of input;
          // otherwise the final createSelector for the connection will recalculate on every state change.
          const result = { refetch: () => refetch(props, variablesFactory) };
          return () => result;
        }
      ]
    });
  }

  /**
   * Adds an update method and update progress / failure members to the final selected connection shape.
   *
   * The generic parameters may be left to be inferred unless the endpoint accepts more than one type
   * of body data. In that case, both must be provided. See Entity.ts for an example.
   */
  public update<Attributes extends UpdateAttributes<UpdateVariables>, UpdateVariables extends Variables>(
    endpoint: V3ApiEndpoint<unknown, unknown, UpdateVariables>
  ) {
    return this.chain<UpdateConnection<Attributes>, IdProp & Props>({
      selectors: [
        (props, variablesFactory, resource) => {
          const variables = variablesFactory(props);
          if (variables == null) {
            const update = () => {};
            return () => ({ isUpdating: false, updateFailure: undefined, update });
          }

          // Avoid creating inline in the createSelector call so that the function has the same identity on every
          // state update, preventing some possible re-renders when the function is a dependency in useEffect.
          const update = (attributes: Attributes) => {
            if (props.id == null) return;
            endpoint.fetch({
              ...variables,
              body: { data: { type: resource, id: props.id, attributes } }
            } as unknown as UpdateVariables);
          };
          return createSelector(
            [endpoint.isFetchingSelector(variables), endpoint.fetchFailedSelector(variables)],
            (isUpdating, updateFailure) => ({ isUpdating, updateFailure, update })
          );
        }
      ]
    });
  }

  /**
   * Extracts the type of the sideloads query param from the Variables generic parameter on the factory
   * and adds that type to the connection props for addition to the final query.
   */
  public sideloads() {
    return this.addProps<SideloadsProp<Sideloads<Variables>>>(({ sideloads }) => {
      const queryParams: Variables["queryParams"] = { sideloads };
      return { queryParams } as Variables;
    });
  }

  /**
   * Adds a prop type to the connection
   * @param addVariablesFactory The method that should modify how the request variables are generated
   *   based on the new props.
   * @param isLoaded If provided, this method will be chained into the isLoaded predicate of the
   *   final connection
   */
  public addProps<AddProps extends Record<string, unknown>>(
    addVariablesFactory?: PartialVariablesFactory<Variables, AddProps>,
    isLoaded?: LoadedPredicate<Selected, AddProps>
  ) {
    return this.chain<Selected, AddProps>({
      variablesFactory: addVariablesFactory,
      isLoaded
    });
  }

  /**
   * Adds properties to the final selected shape of the connection based on the resource relationships.
   * @param selector The selector to add. It will accept the props of the current state of the
   *   connection factory, and must return the shape indicated by the AddSelected generic parameter.
   */
  public addRelationshipData<AddSelected>(selector: (relationships?: Relationships) => AddSelected) {
    return this.chain<AddSelected, IdProp>({
      selectors: [
        (props, variablesFactory, resource) =>
          createSelector([resourceRelationshipsSelector(props, variablesFactory, resource)], selector)
      ]
    });
  }

  /**
   * Builds the Connection based on the current state of the prototype.
   *
   * @param debugLoggingLabel If provided, debug logging will be enabled on this connection, and will
   *   be proceeded by the provided label.
   */
  public buildConnection(debugLoggingLabel?: string): Connection<Selected, Props> {
    const {
      resource,
      fetcher,
      variablesFactory: prototypeVariablesFactory,
      isLoaded,
      selectors,
      selectorCacheKeyFactory: prototypeSelectorCacheKeyFactory
    } = debugLoggingLabel == null ? this.prototype : withDebugLogging(debugLoggingLabel, this.prototype);
    if (selectors == null) throw new ApiConnectionFactoryError("Selectors not defined");
    if (prototypeSelectorCacheKeyFactory == null) {
      throw new ApiConnectionFactoryError("Selector cache key factory not defined");
    }

    const variablesFactory = (prototypeVariablesFactory ?? (() => ({} as Variables))) as VariablesFactory<
      Variables,
      Props
    >;

    const selectorCacheKeyFactory =
      debugLoggingLabel == null
        ? prototypeSelectorCacheKeyFactory
        : ((variablesFactory => props => {
            const result = prototypeSelectorCacheKeyFactory(variablesFactory)(props);
            Log.debug(`[${debugLoggingLabel}] Selector cache key`, { props, result });
            return result;
          }) as SelectorCacheKeyFactory<Variables, Props>);

    const connection: Connection<Selected, Props> = {
      isLoaded,
      selector: selectorCache<Selected, Props, ApiDataStore>(selectorCacheKeyFactory(variablesFactory), props =>
        createSelector(
          selectors.map(selector => selector(props, variablesFactory, resource)),
          (...results: Partial<Selected>[]) => {
            if (debugLoggingLabel != null) {
              Log.debug(`[${debugLoggingLabel}] Selector`, { props, results });
            }
            return assign({}, ...results) as Selected;
          }
        )
      )
    };

    if (fetcher != null) {
      if (isLoaded == null) {
        throw new ApiConnectionFactoryError("Fetcher defined without isLoaded predicate");
      }

      connection.load = (selected, props) => {
        if (!isLoaded(selected, props)) {
          const variables = variablesFactory(props);
          if (debugLoggingLabel != null) {
            Log.debug(`[${debugLoggingLabel}] Fetching data`, { props, variables });
          }
          if (variables != null) {
            fetcher(variables);
          }
        }
      };
    }

    return connection;
  }

  protected chain<AddSelected, AddProps extends Record<string, unknown>>(
    addPrototype: Omit<
      ConnectionPrototype<Variables, AddSelected, AddProps, Headers>,
      "resource" | "fetcher" | "selectorCacheKeyFactory"
    >
  ): ApiConnectionFactory<Variables, Selected & AddSelected, Props & AddProps, Headers> {
    let isLoaded: LoadedPredicate<Selected & AddSelected, Props & AddProps> | undefined =
      this.prototype.isLoaded ?? addPrototype.isLoaded;
    if (this.prototype.isLoaded != null && addPrototype.isLoaded != null) {
      const firstPredicate = this.prototype.isLoaded;
      const secondPredicate = addPrototype.isLoaded;
      isLoaded = (selected: Selected & AddSelected, props: Props & AddProps) =>
        firstPredicate(selected, props) || secondPredicate(selected, props);
    }

    let variablesFactory = (this.prototype.variablesFactory ??
      addPrototype.variablesFactory) as PartialVariablesFactory<Variables, Props & AddProps>;
    if (this.prototype.variablesFactory != null && addPrototype.variablesFactory != null) {
      const firstFactory = this.prototype.variablesFactory;
      const secondFactory = addPrototype.variablesFactory;
      variablesFactory = (props: Props & AddProps) => {
        const first = firstFactory(props);
        const second = secondFactory(props);
        // If either factory isn't getting the props it needs to succeed, the whole chain fails.
        if (first == null || second == null) return undefined;
        return merge({}, first, second);
      };
    }

    return new ApiConnectionFactory(this.endpoint, {
      isLoaded,
      variablesFactory,
      selectors: [...(this.prototype.selectors ?? []), ...(addPrototype.selectors ?? [])] as SelectorFactory<
        Variables,
        Selected & AddSelected,
        Props & AddProps
      >[],
      resource: this.prototype.resource,
      fetcher: this.prototype.fetcher,
      selectorCacheKeyFactory: this.prototype.selectorCacheKeyFactory as SelectorCacheKeyFactory<
        Variables,
        Props & AddProps
      >
    });
  }
}
