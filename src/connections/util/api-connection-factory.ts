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
  loadedPredicates?: LoadedPredicate<SelectedType, PropsType>[];
  selectors: SelectorPrototype<SelectedType, PropsType>[];
};

abstract class ApiConnectionFactory<SelectedType = {}, PropsType extends Record<string, unknown> = {}> {
  protected constructor(private connectionPrototype?: ConnectionPrototype<SelectedType, PropsType>) {}

  buildConnection(): Connection<SelectedType, PropsType> {
    if (this.connectionPrototype == null) {
      throw new ApiConnectionFactoryError("Connection prototype not defined");
    }

    const { fetcher, loadedPredicates, selectors } = this.connectionPrototype;

    const isLoaded =
      loadedPredicates == null || loadedPredicates.length === 0
        ? undefined
        : (selected: SelectedType, props: PropsType) =>
            loadedPredicates.find(predicate => predicate(selected, props)) != null;

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
        throw new ApiConnectionFactoryError("Fetcher defined without loaded predicates");
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
  ) {
    if (addPrototype.fetcher != null && this.connectionPrototype?.fetcher != null) {
      throw new ApiConnectionFactoryError("Fetcher already defined");
    }

    return {
      fetcher: addPrototype.fetcher ?? this.connectionPrototype?.fetcher,
      loadedPredicates: [
        ...(this.connectionPrototype?.loadedPredicates ?? []),
        ...(addPrototype.loadedPredicates ?? [])
      ],
      selectors: [...(this.connectionPrototype?.selectors ?? []), ...addPrototype.selectors] as SelectorPrototype<
        SelectedType & AddSelectedType,
        PropsType & AddPropsType
      >[]
    } as ConnectionPrototype<SelectedType & AddSelectedType, PropsType & AddPropsType>;
  }
}

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

  public singleResource<DTO = never>(fetcher: GetFetcher<GetVariables>) {
    return new IdConnectionFactory(
      this.resource,
      this.paramsFactory,
      this.chainPrototype<DataConnection<DTO>, IdProps>({
        fetcher: props => fetcher(this.paramsFactory(props)),
        loadedPredicates: [({ data }) => data != null],
        selectors: [props => resourceDataSelector<DTO>(this.resource)(props)]
      })
    );
  }

  public singleFullResource<DTO extends { lightResource: boolean } = never>(fetcher: GetFetcher<GetVariables>) {
    return new IdConnectionFactory(
      this.resource,
      this.paramsFactory,
      this.chainPrototype<DataConnection<DTO>, IdProps>({
        fetcher: props => fetcher(this.paramsFactory(props)),
        loadedPredicates: [({ data }) => data != null && !data.lightResource],
        selectors: [props => resourceDataSelector<DTO>(this.resource)(props)]
      })
    );
  }

  public fetchFailure(failureSelector: GetFailureSelector<GetVariables>) {
    return new IdConnectionFactory(
      this.resource,
      this.paramsFactory,
      this.chainPrototype<LoadFailureConnection, IdProps>({
        loadedPredicates: [({ loadFailure }) => loadFailure != null],
        selectors: [
          props => (store: ApiDataStore) => ({
            loadFailure: failureSelector(this.paramsFactory(props))(store)
          })
        ]
      })
    );
  }

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
