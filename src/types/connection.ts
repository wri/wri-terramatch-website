import { ApiDataStore } from "@/store/apiSlice";

export type OptionalProps = Record<string, unknown> | undefined;

export type Selector<SelectedType, PropsType extends OptionalProps = undefined> = (
  state: ApiDataStore,
  props: PropsType
) => SelectedType;

export type Connection<SelectedType, PropsType extends OptionalProps = undefined> = {
  selector: Selector<SelectedType, PropsType>;
  isLoaded?: (selected: SelectedType, props: PropsType) => boolean;
  load?: (selected: SelectedType, props: PropsType) => void;
};

export type Connected<SelectedType> = readonly [boolean, SelectedType | Record<any, never>];
