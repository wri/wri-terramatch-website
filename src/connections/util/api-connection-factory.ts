import { assign, merge } from "lodash";
import { createSelector } from "reselect";

import { FetchParams, getStableQuery } from "@/generated/v3/utils";
import {
  ApiDataStore,
  ApiFilteredIndexCache,
  PendingErrorState,
  ResourceType,
  StoreResourceMap
} from "@/store/apiSlice";
import {
  Connection,
  LoadedPredicate,
  OptionalProps,
  PaginatedConnectionProps,
  PaginatedQueryParams
} from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

class ApiConnectionFactoryError extends Error {}

type DataConnection<DTO> = { data: DTO | undefined };
type IndexConnection<DTO> = {
  data?: DTO[];
  indexTotal?: number;
};
type LoadFailureConnection = { loadFailure: PendingErrorState | null };
type IsLoadingConnection = { isLoading: boolean };
export type IdProps = { id: string };

type Fetcher<Variables> = (variables: Variables, signal?: AbortSignal) => void;
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
type VariablesFactory<Variables extends QueryVariables, PropsType> = (props: PropsType) => Variables;

const resourceDataSelector =
  <DTO>(resource: ResourceType) =>
  ({ id }: IdProps) =>
  (store: ApiDataStore): DataConnection<DTO> => ({ data: store[resource][id]?.attributes as DTO | undefined });

const indexDataSelector =
  <DTO, Variables extends QueryVariables, PropsType>(
    resource: ResourceType,
    indexMetaSelector: IndexMetaSelector<Variables>,
    variablesFactory: VariablesFactory<Variables, PropsType>
  ) =>
  (props: PropsType) =>
    createSelector(
      [
        indexMetaSelector(resource, variablesFactory(props)),
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

type SelectorPrototype<SelectedType, PropsType extends OptionalProps = undefined> = (
  props: PropsType
) => (state: ApiDataStore) => SelectedType;

type ConnectionPrototype<SelectedType, PropsType extends OptionalProps = undefined> = {
  fetcher?: (props: PropsType) => void;
  isLoaded?: LoadedPredicate<SelectedType, PropsType>;
  selectors: SelectorPrototype<SelectedType, PropsType>[];
};

abstract class ApiConnectionFactory<SelectedType = {}, PropsType extends Record<string, unknown> = {}> {
  protected constructor(protected connectionPrototype?: ConnectionPrototype<SelectedType, PropsType>) {}

  buildConnection(): Connection<SelectedType, PropsType> {
    if (this.connectionPrototype == null) {
      throw new ApiConnectionFactoryError("Connection prototype not defined");
    }

    const { fetcher, isLoaded, selectors } = this.connectionPrototype;

    const connection: Connection<SelectedType, PropsType> = {
      isLoaded,
      selector: selectorCache<SelectedType, PropsType, ApiDataStore>(this.selectorCacheKeyFactory, props =>
        createSelector(
          selectors.map(selector => selector(props)),
          (...results: Partial<SelectedType>[]) => assign({}, ...results) as SelectedType
        )
      )
    };

    if (fetcher != null) {
      if (isLoaded == null) {
        throw new ApiConnectionFactoryError("Fetcher defined without isLoaded predicate");
      }

      connection.load = (selected, props) => {
        if (!isLoaded(selected, props)) fetcher(props);
      };
    }

    return connection;
  }

  protected abstract get selectorCacheKeyFactory(): (props: PropsType) => string;

  protected chainPrototype<AddSelectedType, AddPropsType extends OptionalProps>(
    addPrototype: ConnectionPrototype<AddSelectedType, AddPropsType>
  ): ConnectionPrototype<SelectedType & AddSelectedType, PropsType & AddPropsType> {
    if (addPrototype.fetcher != null && this.connectionPrototype?.fetcher != null) {
      throw new ApiConnectionFactoryError("Fetcher already defined");
    }

    let isLoaded: LoadedPredicate<SelectedType & AddSelectedType, PropsType & AddPropsType> | undefined =
      this.connectionPrototype?.isLoaded ?? addPrototype.isLoaded;
    if (this.connectionPrototype?.isLoaded != null && addPrototype.isLoaded != null) {
      const firstPredicate = this.connectionPrototype.isLoaded;
      const secondPredicate = addPrototype.isLoaded;
      isLoaded = (selected: SelectedType & AddSelectedType, props: PropsType & AddPropsType) =>
        firstPredicate(selected, props) || secondPredicate(selected, props);
    }

    return {
      fetcher: addPrototype.fetcher ?? this.connectionPrototype?.fetcher,
      isLoaded,
      selectors: [...(this.connectionPrototype?.selectors ?? []), ...addPrototype.selectors] as SelectorPrototype<
        SelectedType & AddSelectedType,
        PropsType & AddPropsType
      >[]
    };
  }
}

/**
 * A factory for creating connections to fetch a single resource by ID. Has support for the "full DTO"
 * pattern implemented in several resources in the v3 backend.
 */
export class IdConnectionFactory<
  GetVariables extends QueryVariables,
  SelectedType = {},
  PropsType extends IdProps = IdProps
> extends ApiConnectionFactory<SelectedType, PropsType> {
  constructor(
    private readonly resource: ResourceType,
    private readonly variablesFactory: VariablesFactory<GetVariables, PropsType>,
    connectionPrototype?: ConnectionPrototype<SelectedType, PropsType>
  ) {
    super(connectionPrototype);
  }

  protected get selectorCacheKeyFactory() {
    return ({ id }: PropsType) => id;
  }

  /**
   * Adds a `data` property to the connection, specified by the id in IdProps, and typed with the
   * provided DTO generic parameter.
   *
   * The generic DTO parameter is required to be provided explicitly. If it is left off, the
   * resulting connection `data` will be typed with "never", which should generate errors in the
   * connection usage.
   */
  public singleResource<DTO = never>(fetcher: Fetcher<GetVariables>) {
    const variablesFactory = this.variablesFactory as VariablesFactory<GetVariables, IdProps>;
    return new IdConnectionFactory(
      this.resource,
      variablesFactory,
      this.chainPrototype<DataConnection<DTO>, IdProps>({
        fetcher: props => fetcher(variablesFactory(props)),
        isLoaded: ({ data }) => data != null,
        selectors: [props => resourceDataSelector<DTO>(this.resource)(props)]
      })
    );
  }

  /**
   * Adds a `data` property to the connection, specified by the id in IdProps. The connection will
   * only count as loaded if the resulting data has lightResource: false, and will therefore ask
   * the server for the full DTO if it is not already loaded.
   *
   * The generic DTO parameter is required to be provided explicitly. If it is left off, the
   * resulting connection `data` will be typed with "never", which should generate errors in the
   * connection usage.
   */
  public singleFullResource<DTO extends { lightResource: boolean } = never>(fetcher: Fetcher<GetVariables>) {
    const variablesFactory = this.variablesFactory as VariablesFactory<GetVariables, IdProps>;
    return new IdConnectionFactory(
      this.resource,
      variablesFactory,
      this.chainPrototype<DataConnection<DTO>, IdProps>({
        fetcher: props => fetcher(variablesFactory(props)),
        isLoaded: ({ data }) => data != null && !data.lightResource,
        selectors: [resourceDataSelector<DTO>(this.resource)]
      })
    );
  }

  /**
   * Adds a `loadFailure` property to the connection, using the provided failure selector. If the
   * connection reports a load failure, it counts as loaded.
   */
  public fetchFailure(failureSelector: FailureSelector<GetVariables>) {
    const variablesFactory = this.variablesFactory as VariablesFactory<GetVariables, IdProps>;
    return new IdConnectionFactory(
      this.resource,
      variablesFactory,
      this.chainPrototype<LoadFailureConnection, IdProps>({
        isLoaded: ({ loadFailure }) => loadFailure != null,
        selectors: [
          props => (store: ApiDataStore) => ({
            loadFailure: failureSelector(variablesFactory(props))(store)
          })
        ]
      })
    );
  }

  /**
   * Adds an `isLoading` boolean flag to the connection using the provided inProgressSelector.
   */
  public fetchInProgress(inProgressSelector: InProgressSelector<GetVariables>) {
    const variablesFactory = this.variablesFactory as VariablesFactory<GetVariables, IdProps>;
    return new IdConnectionFactory(
      this.resource,
      variablesFactory,
      this.chainPrototype<IsLoadingConnection, IdProps>({
        selectors: [
          props => (store: ApiDataStore) => ({
            isLoading: inProgressSelector(variablesFactory(props))(store)
          })
        ]
      })
    );
  }
}

export class IndexConnectionFactory<
  IndexVariables extends QueryVariables,
  SelectedType = {},
  PropsType extends Record<string, unknown> = {}
> extends ApiConnectionFactory<SelectedType, PropsType> {
  constructor(
    private readonly resource: ResourceType,
    private readonly variablesFactory?: VariablesFactory<IndexVariables, PropsType>,
    connectionPrototype?: ConnectionPrototype<SelectedType, PropsType>
  ) {
    super(connectionPrototype);
  }

  protected get selectorCacheKeyFactory() {
    return (props: PropsType) => {
      const variables = this.variablesFactory?.(props);
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
    };
  }

  private chainParamsFactory<AddPropsType>(addVariablesFactory: VariablesFactory<IndexVariables, AddPropsType>) {
    if (this.variablesFactory == null) return addVariablesFactory;

    const variablesFactory = this.variablesFactory;
    return (props: PropsType & AddPropsType) => merge({}, variablesFactory(props), addVariablesFactory(props));
  }

  /**
   * Adds a `data` property to the connection as an array of the current index data, typed by the
   * provided DTO generic parameter.
   *
   * The generic DTO parameter is required to be provided explicitly. If it is left off, the
   * resulting connection `data` will be typed with "never", which should generate errors in the
   * connection usage.
   */
  public index<DTO = never>(fetcher: Fetcher<IndexVariables>, indexMetaSelector: IndexMetaSelector<IndexVariables>) {
    const variablesFactory = this.variablesFactory as VariablesFactory<IndexVariables, PropsType>;
    return new IndexConnectionFactory(
      this.resource,
      variablesFactory,
      this.chainPrototype<IndexConnection<DTO>, PropsType>({
        fetcher: props => fetcher(variablesFactory(props)),
        isLoaded: ({ data }) => data != null,
        selectors: [
          indexDataSelector<DTO, IndexVariables, PropsType>(this.resource, indexMetaSelector, variablesFactory)
        ]
      })
    );
  }

  public pagination() {
    return new IndexConnectionFactory<IndexVariables, SelectedType, PropsType & PaginatedConnectionProps>(
      this.resource,
      this.chainParamsFactory<PaginatedConnectionProps>(({ pageSize, pageNumber, sortField, sortDirection }) => {
        const queryParams: PaginatedQueryParams = {};
        if (pageNumber != null) {
          queryParams["page[number]"] = pageNumber;
          queryParams["page[size]"] = pageSize;
        }
        if (sortField != null) {
          queryParams["sort[field]"] = sortField;
          queryParams["sort[direction]"] = sortDirection ?? "ASC";
        }
        return { queryParams } as IndexVariables;
      }),
      this.connectionPrototype as ConnectionPrototype<SelectedType, PropsType & PaginatedConnectionProps>
    );
  }
}
