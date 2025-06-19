import { ApiDataStore } from "@/store/apiSlice";
import { AppStore } from "@/store/store";

export type OptionalProps = Record<string, unknown> | undefined;

export type Selector<State, SelectedType, PropsType extends OptionalProps = undefined> = (
  state: State,
  props: PropsType
) => SelectedType;

export type LoadedPredicate<SelectedType, PropsType extends OptionalProps = undefined> = (
  selected: SelectedType,
  props: PropsType
) => boolean;

export type Connection<SelectedType, PropsType extends OptionalProps = undefined, State = ApiDataStore> = {
  // If the `State` is not ApiDataStore, this method is required to provide the State from the overall redux store.
  // Note: this method must _not_ do any data mapping, it should simply select a subset of the AppStore and
  // return it.
  getState?: (store: AppStore) => State;
  selector: Selector<State, SelectedType, PropsType>;
  isLoaded?: LoadedPredicate<SelectedType, PropsType>;
  load?: (selected: SelectedType, props: PropsType) => void;
};

export type Connected<SelectedType> = readonly [true, SelectedType] | readonly [false, Record<any, never>];

export type PaginatedConnectionProps = {
  pageSize?: number;
  pageNumber?: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
};
