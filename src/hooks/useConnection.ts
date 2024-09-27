/* eslint-disable no-redeclare */
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";

import { AppStore } from "@/store/store";
import { Connected, Connection, OptionalProps } from "@/types/connection";
import Log from "@/utils/log";

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

export function useConnections<S1, S2, P1 extends OptionalProps, P2 extends OptionalProps>(
  connections: [Connection<S1, P1>, Connection<S2, P2>],
  props?: P1 & P2
): readonly [boolean, [S1, S2]];
export function useConnections<
  S1,
  S2,
  S3,
  P1 extends OptionalProps,
  P2 extends OptionalProps,
  P3 extends OptionalProps
>(connections: [Connection<S1, P1>, Connection<S2, P2>], props?: P1 & P2 & P3): readonly [boolean, [S1, S2, S3]];
export function useConnections<
  S1,
  S2,
  S3,
  S4,
  P1 extends OptionalProps,
  P2 extends OptionalProps,
  P3 extends OptionalProps,
  P4 extends OptionalProps
>(
  connections: [Connection<S1, P1>, Connection<S2, P2>, Connection<S3, P3>, Connection<S4, P4>],
  props?: P1 & P2 & P3 & P4
): readonly [boolean, [S1, S2, S3, S4]];
export function useConnections<
  S1,
  S2,
  S3,
  S4,
  S5,
  P1 extends OptionalProps,
  P2 extends OptionalProps,
  P3 extends OptionalProps,
  P4 extends OptionalProps,
  P5 extends OptionalProps
>(
  connections: [Connection<S1, P1>, Connection<S2, P2>, Connection<S3, P3>, Connection<S4, P4>, Connection<S5, P5>],
  props?: P1 & P2 & P3 & P4 & P5
): readonly [boolean, [S1, S2, S3, S4, S5]];

/**
 * A convenience function to depend on multiple connections, and receive a single "loaded" flag
 * for all of them.
 */
export function useConnections(
  connections: Connection<unknown, any>[],
  props: Record<string, unknown> = {}
): readonly [boolean, unknown[]] {
  const numConnections = useRef(connections.length);
  if (numConnections.current !== connections.length) {
    // We're violating the rules of hooks by running hooks in a loop below, so let's scream about
    // it extra loud if the number of connections changes.
    Log.error("NUMBER OF CONNECTIONS CHANGED!", { original: numConnections.current, current: connections.length });
  }

  return connections.reduce(
    ([allLoaded, connecteds], connection) => {
      const [loaded, connected] = useConnection(connection, props);
      return [loaded && allLoaded, [...connecteds, connected]];
    },
    [true, []] as readonly [boolean, unknown[]]
  );
}
