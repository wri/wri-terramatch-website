/* eslint-disable no-redeclare */
import { useRef } from "react";

import { useConnection } from "@/hooks/useConnection";
import { Connection, OptionalProps } from "@/types/connection";
import Log from "@/utils/log";

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
 * A convenience hook to depend on multiple connections, and receive a single "loaded" flag for all of them.
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
