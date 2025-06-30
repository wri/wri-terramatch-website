import { assign, isEmpty } from "lodash";
import { createSelector } from "reselect";

import { FetchParams, getStableQuery } from "@/generated/v3/utils";
import {
  ApiDataStore,
  ApiFilteredIndexCache,
  PendingErrorState,
  ResourceType,
  StoreResource,
  StoreResourceMap
} from "@/store/apiSlice";
import { Connection, LoadedPredicate, PaginatedConnectionProps, PaginatedQueryParams } from "@/types/connection";
import { resourcesDeletedSelector } from "@/utils/connectedResourceDeleter";
import Log from "@/utils/log";
import { selectorCache } from "@/utils/selectorCache";

class ApiConnectionFactoryError extends Error {}

export type DataConnection<DTO> = { data: DTO | undefined };
type ListConnection<DTO> = { data?: DTO[] };
export type IndexConnection<DTO> = ListConnection<DTO> & {
  indexTotal?: number;
};
export type LoadFailureConnection = { loadFailure: PendingErrorState | null };
type IsLoadingConnection = { isLoading: boolean };
type IsDeletedConnection = { isDeleted: boolean };
type RefetchConnection = { refetch: () => void };
type UpdateConnection<UpdateAttributes> = {
  isUpdating: boolean;
  updateFailure: PendingErrorState | null;
  update: (attributes: UpdateAttributes) => void;
};

export type IdProps = { id?: string };
export type IdsProps = { ids?: string[] };
export type FilterProp<FilterFields extends string | number | symbol> = {
  filter?: Partial<Record<FilterFields, string>>;
};
export type EnabledProp = {
  /**
   * The connection will count as loaded if this value is explicitly set to false, preventing any API
   * requests until it is removed or set to true.
   */
  enabled?: boolean;
};

export type Fetcher<Variables> = (variables: Variables, signal?: AbortSignal) => void;
type FailureSelector<Variables> = (
  variables: Omit<Variables, "body">
) => (store: ApiDataStore) => PendingErrorState | null;
type InProgressSelector<Variables> = (variables: Omit<Variables, "body">) => (store: ApiDataStore) => boolean;
type IndexMetaSelector<Variables> = (
  resource: ResourceType,
  variables: Omit<Variables, "body">
) => (store: ApiDataStore) => ApiFilteredIndexCache;

type QueryVariables = {
  pathParams?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
};
type UpdateData<Attributes = unknown> = { type: ResourceType; id: string; attributes: Attributes };
type UpdateAttributes<T> = T extends UpdateData<infer A> ? A : never;
export type UpdateBody<U extends UpdateData> = {
  body: {
    data: U;
  };
};
type PartialVariablesFactory<Variables extends QueryVariables, Props> = (
  props: Props
) => Partial<Variables> | undefined;
type VariablesFactory<Variables extends QueryVariables, Props> = (props: Props) => Variables | undefined;

const resourceDataSelector =
  <DTO>() =>
  ({ id }: IdProps, _: unknown, resource: ResourceType) =>
    createSelector(
      [(store: ApiDataStore) => (id == null ? undefined : (store[resource][id] as StoreResource<DTO>))],
      resource => ({
        data: resource?.attributes as DTO | undefined
      })
    );

const indexDataSelector =
  <DTO, Variables extends QueryVariables, Props>(
    resource: ResourceType,
    indexMetaSelector: IndexMetaSelector<Variables>
  ) =>
  (props: Props, variablesFactory: VariablesFactory<Variables, Props>) =>
    createSelector(
      [
        indexMetaSelector(resource, variablesFactory(props) as Variables),
        (store: ApiDataStore) => store[resource] as StoreResourceMap<DTO>
      ],
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

type SelectorFactory<Variables extends QueryVariables, Selected, Props extends Record<string, unknown>> = (
  props: Props,
  variablesFactory: VariablesFactory<Variables, Props>,
  resource: ResourceType
) => (state: ApiDataStore) => Selected;

type SelectorCacheKeyFactory<Variables extends QueryVariables, Props extends Record<string, unknown>> = (
  variablesFactory: VariablesFactory<Variables, Props>
) => (props: Props) => string;

type FetcherPrototype<Variables extends QueryVariables, Props extends Record<string, unknown>> = (
  props: Props,
  variablesFactory: VariablesFactory<Variables, Props>
) => void;

type ConnectionPrototype<Variables extends QueryVariables, Selected, Props extends Record<string, unknown>> = {
  resource: ResourceType;
  selectorCacheKeyFactory: SelectorCacheKeyFactory<Variables, Props>;
  selectors?: SelectorFactory<Variables, Selected, Props>[];
  variablesFactory?: PartialVariablesFactory<Variables, Props>;
  isLoaded?: LoadedPredicate<Selected, Props>;
  fetcher?: FetcherPrototype<Variables, Props>;
};

const withDebugLogging = <V extends QueryVariables, S, P extends Record<string, unknown>>(
  label: string,
  { variablesFactory, isLoaded, selectors, resource, fetcher, selectorCacheKeyFactory }: ConnectionPrototype<V, S, P>
): ConnectionPrototype<V, S, P> => ({
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
  fetcher:
    fetcher == null
      ? undefined
      : (props, variablesFactory) => {
          Log.debug(`[${label}] Fetching data`, { props, variables: variablesFactory(props) });
          fetcher(props, variablesFactory);
        },
  selectors,
  resource,
  selectorCacheKeyFactory
});

export class ApiConnectionFactory<Variables extends QueryVariables, Selected, Props extends Record<string, unknown>> {
  protected constructor(readonly prototype: ConnectionPrototype<Variables, Selected, Props>) {}

  /**
   * Creates a connection that fetches a single resource from the backend.
   */
  static singleResource<DTO, Variables extends QueryVariables>(
    resource: ResourceType,
    fetcher: Fetcher<Variables>,
    variablesFactory: VariablesFactory<Variables, IdProps>
  ) {
    return new ApiConnectionFactory<Variables, DataConnection<DTO>, IdProps>({
      resource,
      fetcher: (props, variablesFactory) => {
        const variables = variablesFactory(props);
        if (variables != null) fetcher(variables);
      },
      isLoaded: ({ data }, { id }) => isEmpty(id) || data != null,
      variablesFactory,
      selectors: [resourceDataSelector<DTO>()],
      selectorCacheKeyFactory:
        () =>
        ({ id }: IdProps) =>
          id ?? ""
    });
  }

  /**
   * Creates a connection that fetches a "full" resource from the backend (one that has
   * lightResource: false in its DTO). If the current cached copy of this resource is a light resource,
   * the connection is not complete, and the fetch will occur.
   */
  static singleFullResource<DTO extends { lightResource: boolean }, Variables extends QueryVariables>(
    resource: ResourceType,
    fetcher: Fetcher<Variables>,
    variablesFactory: VariablesFactory<Variables, IdProps>
  ) {
    return new ApiConnectionFactory<Variables, DataConnection<DTO>, IdProps>({
      resource,
      fetcher: (props, variablesFactory) => {
        const variables = variablesFactory(props);
        if (variables != null) fetcher(variables);
      },
      isLoaded: ({ data }, { id }) => isEmpty(id) || (data != null && !data.lightResource),
      variablesFactory,
      selectors: [resourceDataSelector<DTO>()],
      selectorCacheKeyFactory:
        () =>
        ({ id }: IdProps) =>
          id ?? ""
    });
  }

  /**
   * Creates a connection that fetches a resource index from the backend.
   */
  static index<DTO, Variables extends QueryVariables, Props extends Record<string, unknown> = {}>(
    resource: ResourceType,
    fetcher: Fetcher<Variables>,
    indexMetaSelector: IndexMetaSelector<Variables>,
    variablesFactory: VariablesFactory<Variables, Props> = () => ({} as Variables)
  ) {
    return new ApiConnectionFactory<Variables, IndexConnection<DTO>, Props>({
      resource,
      fetcher: (props, variablesFactory) => {
        const variables = variablesFactory(props);
        if (variables != null) fetcher(variables);
      },
      isLoaded: ({ data }) => data != null,
      variablesFactory,
      selectors: [indexDataSelector<DTO, Variables, Props>(resource, indexMetaSelector)],
      selectorCacheKeyFactory: variablesFactory => props => {
        const variables = variablesFactory(props);
        if (variables == null) return "";

        let cacheKey = "";
        const { pathParams, queryParams } = variables;
        if (pathParams != null) {
          cacheKey = Object.keys(pathParams)
            .sort()
            .map(key => String(pathParams[key]))
            .join(":");
          cacheKey = `${cacheKey}:`;
        }
        if (queryParams != null) {
          cacheKey = `${cacheKey}${getStableQuery(queryParams as FetchParams)}`;
        }
        return cacheKey;
      }
    });
  }

  /**
   * Creates a connection that does no fetching; it simply pulls a list of resources by ID from the cache.
   */
  static list<DTO>(resource: ResourceType) {
    return new ApiConnectionFactory<never, ListConnection<DTO>, IdsProps>({
      resource,
      selectors: [
        ({ ids }, _, resource) => {
          if (ids == null) return () => ({ data: undefined });
          return createSelector([(store: ApiDataStore) => store[resource] as StoreResourceMap<DTO>], resources => ({
            data: ids.map(id => resources[id]?.attributes)
          }));
        }
      ],
      selectorCacheKeyFactory:
        () =>
        ({ ids }) =>
          ids?.join() ?? ""
    });
  }

  /**
   * Adds a `loadFailure` property to the connection, using the provided failure selector. If the
   * connection reports a load failure, it counts as loaded.
   */
  public fetchFailure(failureSelector: FailureSelector<Variables>) {
    return this.chain<LoadFailureConnection, Props>({
      isLoaded: ({ loadFailure }) => loadFailure != null,
      selectors: [
        (props, variablesFactory) => {
          const variables = variablesFactory(props);
          if (variables == null) return () => ({ loadFailure: null });
          return createSelector([failureSelector(variables)], loadFailure => ({ loadFailure }));
        }
      ]
    });
  }

  /**
   * Adds an `isLoading` boolean flag to the connection using the provided inProgressSelector.
   */
  public fetchInProgress(inProgressSelector: InProgressSelector<Variables>) {
    return this.chain<IsLoadingConnection, Props>({
      selectors: [
        (props, variablesFactory) => {
          const variables = variablesFactory(props);
          if (variables == null) return () => ({ isLoading: false });
          return createSelector([inProgressSelector(variables)], isLoading => ({ isLoading }));
        }
      ]
    });
  }

  public isDeleted() {
    return this.chain<IsDeletedConnection, IdProps & Props>({
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
   * Adds a `filter` prop to the connection that is a record of string values that maps onto
   * the query params of the generated request variables.
   */
  public filters<FilterField extends keyof Required<Variables>["queryParams"]>(
    fields: Record<FilterField, "string" | "boolean" | "array">
  ) {
    return this.addProps<FilterProp<FilterField>>(({ filter }) => {
      const queryParams: FetchParams = {};
      if (filter != null) {
        for (const [field, type] of Object.entries(fields)) {
          const value = filter[field as FilterField];
          if (value == null) continue;

          if (type === "string") {
            queryParams[field] = value;
          } else if (type === "boolean") {
            queryParams[field] = value === "true";
          } else if (type === "array") {
            queryParams[field] = Array.isArray(value) ? value : [value];
          } else {
            throw new ApiConnectionFactoryError(`Unsupported filter type: ${type}`);
          }
        }
      }
      return { queryParams } as Variables;
    });
  }

  public enabledFlag() {
    return this.addProps<EnabledProp>(undefined, (_, { enabled }) => enabled === false);
  }

  public refetch(refetch: (props: Props) => void) {
    return this.chain<RefetchConnection, Props>({
      selectors: [
        props => {
          // It's important for the selector to always return the identical result, regardless of input;
          // otherwise the final createSelector for the connection will recalculate on every state change.
          const result = { refetch: () => refetch(props) };
          return () => result;
        }
      ]
    });
  }

  public update<U extends UpdateData>(
    updateFetcher: Fetcher<Variables & UpdateBody<U>>,
    updateInProgress: InProgressSelector<Variables>,
    updateFailed: FailureSelector<Variables>
  ) {
    return this.chain<UpdateConnection<UpdateAttributes<U>>, IdProps & Props>({
      selectors: [
        (props, variablesFactory, resource) => {
          const variables = variablesFactory(props);
          if (variables == null) {
            const update = () => {};
            return () => ({
              isUpdating: false,
              updateFailure: null,
              update
            });
          }

          // Avoid creating inline in the createSelector call so that the function has the same identity on every
          // state update, preventing some possible re-renders when the function is a dependency in useEffect.
          const update = (attributes: UpdateAttributes<U>) => {
            if (props.id == null) return;
            updateFetcher({ ...variables, body: { data: { type: resource, id: props.id, attributes } as U } });
          };
          return createSelector(
            [updateInProgress(variables), updateFailed(variables)],
            (isUpdating, updateFailure) => ({ isUpdating, updateFailure, update })
          );
        }
      ]
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
    return this.chain<Selected, Props & AddProps>({
      variablesFactory: addVariablesFactory,
      isLoaded
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
        if (!isLoaded(selected, props)) fetcher(props, variablesFactory);
      };
    }

    return connection;
  }

  protected chain<AddSelected, AddProps extends Record<string, unknown>>(
    addPrototype: Omit<
      ConnectionPrototype<Variables, AddSelected, AddProps>,
      "resource" | "fetcher" | "selectorCacheKeyFactory"
    >
  ): ApiConnectionFactory<Variables, Selected & AddSelected, Props & AddProps> {
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
        return { ...first, ...second };
      };
    }

    return new ApiConnectionFactory({
      isLoaded,
      variablesFactory,
      selectors: [...(this.prototype.selectors ?? []), ...(addPrototype.selectors ?? [])] as SelectorFactory<
        Variables,
        Selected & AddSelected,
        Props & AddProps
      >[],
      resource: this.prototype.resource,
      fetcher: this.prototype.fetcher as FetcherPrototype<Variables, Props & AddProps>,
      selectorCacheKeyFactory: this.prototype.selectorCacheKeyFactory as SelectorCacheKeyFactory<
        Variables,
        Props & AddProps
      >
    });
  }
}
