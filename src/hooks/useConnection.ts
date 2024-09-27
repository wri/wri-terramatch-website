import { useCallback, useEffect, useState } from "react";
import { useStore } from "react-redux";

import { AppStore } from "@/store/store";
import { Connected, Connection, OptionalProps } from "@/types/connection";

/**
 * Use a connection to efficiently depend on data in the Redux store.
 *
 * In this hook, an internal subscription to the store is used instead of a useSelector() on the
 * whole API state. This limits redraws of the component to the times that the connected state of
 * the Connection changes.
 */
export function useConnection<TSelected, TProps extends OptionalProps = undefined>(
  connection: Connection<TSelected, TProps>,
  props: TProps | Record<any, never> = {}
): Connected<TSelected> {
  const { selector, isLoaded, load } = connection;
  const store = useStore<AppStore>();

  const getConnected = useCallback(() => {
    const connected = selector(store.getState().api, props);
    const loadingDone = isLoaded == null || isLoaded(connected, props);
    return { loadingDone, connected };
  }, [store, isLoaded, props, selector]);

  const [connected, setConnected] = useState(() => {
    const { loadingDone, connected } = getConnected();
    return loadingDone ? connected : null;
  });

  useEffect(
    () => {
      function checkState() {
        const { loadingDone, connected: currentConnected } = getConnected();
        if (load != null) load(currentConnected, props);
        if (loadingDone) {
          setConnected(currentConnected);
        } else {
          // In case something was loaded and then got unloaded via a redux store clear
          if (connected != null) setConnected(null);
        }
      }

      const subscription = store.subscribe(checkState);
      checkState();
      return subscription;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connection, ...Object.keys(props ?? [])]
  );

  return [connected != null, connected ?? {}];
}
