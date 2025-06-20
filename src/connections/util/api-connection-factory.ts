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
import { Connection, LoadedPredicate, PaginatedConnectionProps, PaginatedQueryParams } from "@/types/connection";
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
type FilterProp<FilterFields extends string | number | symbol> = { filter?: Partial<Record<FilterFields, string>> };

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
type PartialVariablesFactory<Variables extends QueryVariables, PropsType> = (props: PropsType) => Partial<Variables>;
type VariablesFactory<Variables extends QueryVariables, PropsType> = (props: PropsType) => Variables;

const resourceDataSelector =
  <DTO>(resource: ResourceType) =>
  ({ id }: IdProps) =>
  (store: ApiDataStore): DataConnection<DTO> => ({ data: store[resource][id]?.attributes as DTO | undefined });

const indexDataSelector =
  <DTO, Variables extends QueryVariables, PropsType>(
    resource: ResourceType,
    indexMetaSelector: IndexMetaSelector<Variables>
  ) =>
  (props: PropsType, variablesFactory: VariablesFactory<Variables, PropsType>) =>
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

type SelectorPrototype<Variables extends QueryVariables, SelectedType, PropsType extends Record<string, unknown>> = (
  props: PropsType,
  variablesFactory: VariablesFactory<Variables, PropsType>
) => (state: ApiDataStore) => SelectedType;

type SelectorCacheKeyFactory<Variables extends QueryVariables, PropsType extends Record<string, unknown>> = (
  variablesFactory: VariablesFactory<Variables, PropsType>
) => (props: PropsType) => string;

type FetcherPrototype<Variables extends QueryVariables, PropsType extends Record<string, unknown>> = (
  props: PropsType,
  variablesFactory: VariablesFactory<Variables, PropsType>
) => void;

type ConnectionPrototype<Variables extends QueryVariables, SelectedType, PropsType extends Record<string, unknown>> = {
  fetcher?: FetcherPrototype<Variables, PropsType>;
  variablesFactory?: PartialVariablesFactory<Variables, PropsType>;
  isLoaded?: LoadedPredicate<SelectedType, PropsType>;
  selectorCacheKeyFactory?: SelectorCacheKeyFactory<Variables, PropsType>;
  selectors?: SelectorPrototype<Variables, SelectedType, PropsType>[];
};

export class ApiConnectionFactory<
  Variables extends QueryVariables,
  SelectedType,
  PropsType extends Record<string, unknown>
> {
  constructor(readonly prototype: ConnectionPrototype<Variables, SelectedType, PropsType>) {}

  /**
   * Adds a `data` property to the connection, specified by the id in IdProps, and typed with the
   * provided DTO generic parameter.
   */
  static singleResource<DTO, Variables extends QueryVariables>(
    resource: ResourceType,
    fetcher: Fetcher<Variables>,
    variablesFactory: VariablesFactory<Variables, IdProps>
  ) {
    return new ApiConnectionFactory<Variables, DataConnection<DTO>, IdProps>({
      fetcher: (props, variablesFactory) => fetcher(variablesFactory(props)),
      isLoaded: ({ data }) => data != null,
      variablesFactory,
      selectors: [resourceDataSelector<DTO>(resource)],
      selectorCacheKeyFactory:
        () =>
        ({ id }: IdProps) =>
          id
    });
  }

  /**
   * Adds a `data` property to the connection, specified by the id in IdProps. The connection will
   * only count as loaded if the resulting data has lightResource: false, and will therefore ask
   * the server for the full DTO if it is not already loaded.
   */
  static singleFullResource<DTO extends { lightResource: boolean }, Variables extends QueryVariables>(
    resource: ResourceType,
    fetcher: Fetcher<Variables>,
    variablesFactory: VariablesFactory<Variables, IdProps>
  ) {
    return new ApiConnectionFactory<Variables, DataConnection<DTO>, IdProps>({
      fetcher: (props, variablesFactory) => fetcher(variablesFactory(props)),
      isLoaded: ({ data }) => data != null && !data.lightResource,
      variablesFactory,
      selectors: [resourceDataSelector<DTO>(resource)],
      selectorCacheKeyFactory:
        () =>
        ({ id }: IdProps) =>
          id
    });
  }

  /**
   * Adds a `data` property to the connection as an array of the current index data, typed by the
   * provided DTO generic parameter.
   */
  static index<DTO, Variables extends QueryVariables, PropsType extends Record<string, unknown> = {}>(
    resource: ResourceType,
    fetcher: Fetcher<Variables>,
    indexMetaSelector: IndexMetaSelector<Variables>,
    variablesFactory: VariablesFactory<Variables, PropsType>
  ) {
    return new ApiConnectionFactory<Variables, IndexConnection<DTO>, PropsType>({
      fetcher: (props, variablesFactory) => fetcher(variablesFactory(props)),
      isLoaded: ({ data }) => data != null,
      variablesFactory,
      selectors: [indexDataSelector<DTO, Variables, PropsType>(resource, indexMetaSelector)],
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
   * Adds a `loadFailure` property to the connection, using the provided failure selector. If the
   * connection reports a load failure, it counts as loaded.
   */
  public fetchFailure(failureSelector: FailureSelector<Variables>) {
    return this.chain<LoadFailureConnection, PropsType>({
      isLoaded: ({ loadFailure }) => loadFailure != null,
      selectors: [
        (props, variablesFactory) => (store: ApiDataStore) => ({
          loadFailure: failureSelector(variablesFactory(props))(store)
        })
      ]
    });
  }

  /**
   * Adds an `isLoading` boolean flag to the connection using the provided inProgressSelector.
   */
  public fetchInProgress(inProgressSelector: InProgressSelector<Variables>) {
    return this.chain<IsLoadingConnection, PropsType>({
      selectors: [
        (props, variablesFactory) => (store: ApiDataStore) => ({
          isLoading: inProgressSelector(variablesFactory(props))(store)
        })
      ]
    });
  }

  /**
   * Adds a prop type to the connection
   * @param addVariablesFactory The method that should modify how the request variables are generated
   *   based on the new props.
   */
  public addProps<AddPropsType extends Record<string, unknown>>(
    addVariablesFactory: PartialVariablesFactory<Variables, AddPropsType>
  ) {
    return this.chain<SelectedType, PropsType & AddPropsType>({
      variablesFactory: this.mergeVariablesFactory<AddPropsType>(addVariablesFactory)
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

  /**
   * Builds the Connection based on the current state of the prototype.
   */
  public buildConnection(): Connection<SelectedType, PropsType> {
    const {
      fetcher,
      variablesFactory: prototypeVariablesFactory,
      isLoaded,
      selectors,
      selectorCacheKeyFactory
    } = this.prototype;
    if (selectors == null) throw new ApiConnectionFactoryError("Selectors not defined");
    if (selectorCacheKeyFactory == null) throw new ApiConnectionFactoryError("Selector cache key factory not defined");

    const variablesFactory = (prototypeVariablesFactory ?? (() => ({} as Variables))) as VariablesFactory<
      Variables,
      PropsType
    >;

    const connection: Connection<SelectedType, PropsType> = {
      isLoaded,
      selector: selectorCache<SelectedType, PropsType, ApiDataStore>(selectorCacheKeyFactory(variablesFactory), props =>
        createSelector(
          selectors.map(selector => selector(props, variablesFactory)),
          (...results: Partial<SelectedType>[]) => assign({}, ...results) as SelectedType
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

  protected chain<AddSelectedType, AddPropsType extends Record<string, unknown>>(
    addPrototype: ConnectionPrototype<Variables, AddSelectedType, AddPropsType>
  ): ApiConnectionFactory<Variables, SelectedType & AddSelectedType, PropsType & AddPropsType> {
    if (addPrototype.fetcher != null && this.prototype?.fetcher != null) {
      throw new ApiConnectionFactoryError("Fetcher already defined");
    }

    let isLoaded: LoadedPredicate<SelectedType & AddSelectedType, PropsType & AddPropsType> | undefined =
      this.prototype?.isLoaded ?? addPrototype.isLoaded;
    if (this.prototype?.isLoaded != null && addPrototype.isLoaded != null) {
      const firstPredicate = this.prototype.isLoaded;
      const secondPredicate = addPrototype.isLoaded;
      isLoaded = (selected: SelectedType & AddSelectedType, props: PropsType & AddPropsType) =>
        firstPredicate(selected, props) || secondPredicate(selected, props);
    }

    return new ApiConnectionFactory({
      fetcher: (addPrototype.fetcher ?? this.prototype?.fetcher) as
        | FetcherPrototype<Variables, PropsType & AddPropsType>
        | undefined,
      isLoaded,
      selectors: [...(this.prototype?.selectors ?? []), ...(addPrototype?.selectors ?? [])] as SelectorPrototype<
        Variables,
        SelectedType & AddSelectedType,
        PropsType & AddPropsType
      >[],
      selectorCacheKeyFactory: this.prototype.selectorCacheKeyFactory as
        | SelectorCacheKeyFactory<Variables, PropsType & AddPropsType>
        | undefined
    });
  }

  protected mergeVariablesFactory<AddPropsType>(addVariablesFactory: PartialVariablesFactory<Variables, AddPropsType>) {
    if (this.prototype.variablesFactory == null) return addVariablesFactory;

    const { variablesFactory } = this.prototype;
    return (props: PropsType & AddPropsType) => merge({}, variablesFactory(props), addVariablesFactory(props));
  }
}
