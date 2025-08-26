import { Unsubscribe } from "redux";

import ApiSlice from "@/store/apiSlice";
import { Connection, OptionalProps } from "@/types/connection";

const isLoadedPredicate = <SType, PType extends OptionalProps, State>(
  connection: Connection<SType, PType, State>,
  props: PType | Record<any, never>
) => {
  const { selector, isLoaded, load } = connection;
  return (state: State) => {
    const connected = selector(state, props);
    const loaded = isLoaded == null || isLoaded(connected, props);
    if (!loaded && load != null) load(connected, props);
    return loaded;
  };
};

export async function loadConnection<SType, PType extends OptionalProps, State>(
  connection: Connection<SType, PType, State>,
  props: PType | Record<any, never> = {}
) {
  return await connectionInState(isLoadedPredicate(connection, props), connection, props);
}

export async function connectionInState<SType, PType extends OptionalProps, State>(
  predicate: (state: State) => boolean,
  connection: Connection<SType, PType, State>,
  props: PType | Record<any, never> = {}
) {
  const { getState, selector } = connection;

  const getCurrentState = () => (getState ?? ApiSlice.getState)(ApiSlice.redux.getState()) as State;
  const state = getCurrentState();
  if (predicate(state)) return selector(state, props);

  const unsubscribe = await new Promise<Unsubscribe>(resolve => {
    const unsubscribe = ApiSlice.redux.subscribe(() => {
      if (predicate(getCurrentState())) resolve(unsubscribe);
    });
  });
  unsubscribe();

  return selector(getCurrentState(), props);
}
