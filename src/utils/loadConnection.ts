import { Unsubscribe } from "redux";

import ApiSlice, { ApiDataStore } from "@/store/apiSlice";
import { Connection, OptionalProps } from "@/types/connection";

export async function loadConnection<SType, PType extends OptionalProps = undefined>(
  connection: Connection<SType, PType>,
  props: PType | Record<any, never> = {}
) {
  const { selector, isLoaded, load } = connection;
  const predicate = (store: ApiDataStore) => {
    const connected = selector(store, props);
    const loaded = isLoaded == null || isLoaded(connected, props);
    if (!loaded && load != null) load(connected, props);
    return loaded;
  };

  const store = ApiSlice.currentState;
  if (predicate(store)) return selector(store, props);

  const unsubscribe = await new Promise<Unsubscribe>(resolve => {
    const unsubscribe = ApiSlice.redux.subscribe(() => {
      if (predicate(ApiSlice.currentState)) resolve(unsubscribe);
    });
  });
  unsubscribe();

  return selector(ApiSlice.currentState, props);
}
