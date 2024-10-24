import { useConnection } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";
import { Connection, OptionalProps } from "@/types/connection";
import { loadConnection } from "@/utils/loadConnection";

/**
 * Generates a hook for using this specific connection.
 */
export function connectionHook<TSelected, TProps extends OptionalProps>(connection: Connection<TSelected, TProps>) {
  return (props: TProps | Record<any, never> = {}) => useConnection(connection, props);
}

/**
 * Generates an async loader for this specific connection. Awaiting on the loader will not return
 * until the connection is in a valid loaded state.
 */
export function connectionLoader<TSelected, TProps extends OptionalProps>(connection: Connection<TSelected, TProps>) {
  return (props: TProps | Record<any, never> = {}) => loadConnection(connection, props);
}

/**
 * Generates a synchronous selector for this specific connection. Ignores loaded state and simply
 * returns the current connection state with whatever is currently cached in the store.
 *
 * Note: Use sparingly! There are very few cases where this type of connection access is actually
 * desirable. In almost every case, connectionHook or connectionLoader is what you really want.
 */
export function connectionSelector<TSelected, TProps extends OptionalProps>(connection: Connection<TSelected, TProps>) {
  return (props: TProps | Record<any, never> = {}) => connection.selector(ApiSlice.apiDataStore, props);
}
