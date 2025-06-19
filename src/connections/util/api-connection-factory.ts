import { assign } from "lodash";
import { createSelector } from "reselect";

import { ApiDataStore, ApiResources, PendingErrorState } from "@/store/apiSlice";
import { Connection, LoadedPredicate, OptionalProps } from "@/types/connection";
import { selectorCache } from "@/utils/selectorCache";

class ApiConnectionFactoryError extends Error {}

type DataConnection<DTO> = { data: DTO | undefined };
type LoadFailureConnection = { loadFailure: PendingErrorState | null };
type IsLoadingConnection = { isLoading: boolean };
export type IdProps = { id: string };

type GetFetcher<GetVariables> = (variables: GetVariables, signal?: AbortSignal) => void;
type GetFailureSelector<GetVariables> = (
  variables: Omit<GetVariables, "body">
) => (store: ApiDataStore) => PendingErrorState | null;
type GetInProgressSelector<GetVariables> = (variables: Omit<GetVariables, "body">) => (store: ApiDataStore) => boolean;

type GetParamsFactory<GetVariables> = (props: IdProps) => GetVariables;

const resourceDataSelector =
  <DTO>(resource: keyof ApiResources) =>
  ({ id }: IdProps) =>
  (store: ApiDataStore) => ({ data: store[resource][id]?.attributes as DTO | undefined });

type SelectorPrototype<SelectedType, PropsType extends OptionalProps = undefined> = (
  props: PropsType
) => (state: ApiDataStore) => Partial<SelectedType>;

type ConnectionPrototype<SelectedType, PropsType extends OptionalProps = undefined> = {
  fetcher?: (props: PropsType) => void;
  isLoaded?: LoadedPredicate<SelectedType, PropsType>;
  selectors: SelectorPrototype<SelectedType, PropsType>[];
};

abstract class ApiConnectionFactory<SelectedType = {}, PropsType extends Record<string, unknown> = {}> {
  protected constructor(private connectionPrototype?: ConnectionPrototype<SelectedType, PropsType>) {}

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
  GetVariables,
  SelectedType = {},
  PropsType extends IdProps = IdProps
> extends ApiConnectionFactory<SelectedType, PropsType> {
  constructor(
    private readonly resource: keyof ApiResources,
    private readonly paramsFactory: GetParamsFactory<GetVariables>,
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
  public singleResource<DTO = never>(fetcher: GetFetcher<GetVariables>) {
    return new IdConnectionFactory(
      this.resource,
      this.paramsFactory,
      this.chainPrototype<DataConnection<DTO>, IdProps>({
        fetcher: props => fetcher(this.paramsFactory(props)),
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
  public singleFullResource<DTO extends { lightResource: boolean } = never>(fetcher: GetFetcher<GetVariables>) {
    return new IdConnectionFactory(
      this.resource,
      this.paramsFactory,
      this.chainPrototype<DataConnection<DTO>, IdProps>({
        fetcher: props => fetcher(this.paramsFactory(props)),
        isLoaded: ({ data }) => data != null && !data.lightResource,
        selectors: [props => resourceDataSelector<DTO>(this.resource)(props)]
      })
    );
  }

  /**
   * Adds a `loadFailure` property to the connection, using the provided failure selector. If the
   * connection reports a load failure, it counts as loaded.
   */
  public fetchFailure(failureSelector: GetFailureSelector<GetVariables>) {
    return new IdConnectionFactory(
      this.resource,
      this.paramsFactory,
      this.chainPrototype<LoadFailureConnection, IdProps>({
        isLoaded: ({ loadFailure }) => loadFailure != null,
        selectors: [
          props => (store: ApiDataStore) => ({
            loadFailure: failureSelector(this.paramsFactory(props))(store)
          })
        ]
      })
    );
  }

  /**
   * Adds an `isLoading` boolean flag to the connection using the provided inProgressSelector.
   */
  public fetchInProgress(inProgressSelector: GetInProgressSelector<GetVariables>) {
    return new IdConnectionFactory(
      this.resource,
      this.paramsFactory,
      this.chainPrototype<IsLoadingConnection, IdProps>({
        selectors: [
          props => (store: ApiDataStore) => ({
            isLoading: inProgressSelector(this.paramsFactory(props))(store)
          })
        ]
      })
    );
  }
}
