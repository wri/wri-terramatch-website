import { useCallback, useEffect, useState } from "react";
import { useStore } from "react-redux";

import ApiSlice from "@/store/apiSlice";
import { AppStore } from "@/store/store";
import { Connected, Connection, OptionalProps } from "@/types/connection";

import { useStableProps } from "./useStableProps";

/**
 * Use a connection to efficiently depend on data in the Redux store.
 *
 * In this hook, an internal subscription to the store is used instead of a useSelector() on the
 * whole API state. This limits redraws of the component to the times that the connected state of
 * the Connection changes.
 */
export function useConnection<TSelected, TProps extends OptionalProps, State>(
  connection: Connection<TSelected, TProps, State>,
  props: TProps | Record<any, never> = {}
): Connected<TSelected> {
  const { getState, selector, isLoaded, load } = connection;
  const store = useStore<AppStore>();

  const stableProps = useStableProps(props);
  const getConnected = useCallback(() => {
    const state = (getState ?? ApiSlice.getState)(store.getState()) as State;
    const connected = selector(state, stableProps);
    const loadingDone = isLoaded == null || isLoaded(connected, stableProps);
    return { loadingDone, connected };
  }, [getState, store, selector, stableProps, isLoaded]);

  const [connected, setConnected] = useState(() => {
    const { loadingDone, connected } = getConnected();
    return loadingDone ? connected : null;
  });

  useEffect(() => {
    function checkState() {
      const { loadingDone, connected: currentConnected } = getConnected();
      if (load != null) load(currentConnected, stableProps);
      if (loadingDone) {
        setConnected(currentConnected);
      } else {
        // In case something was loaded and then got unloaded via a redux store clear
        setConnected(null);
      }
    }

    const subscription = store.subscribe(checkState);
    checkState();
    return subscription;
  }, [connection, getConnected, load, stableProps, store]);

  return connected == null ? [false, {}] : [true, connected];
}
