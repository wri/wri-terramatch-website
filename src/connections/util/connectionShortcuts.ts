import { useConnection } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";
import { Connection, OptionalProps } from "@/types/connection";
import { loadConnection } from "@/utils/loadConnection";

type PropsParamType<PropsType extends OptionalProps> = undefined extends PropsType ? [] : [props: PropsType];

/**
 * Generates a hook for using this specific connection.
 */
export const connectionHook =
  <TSelected, TProps extends OptionalProps, State>(connection: Connection<TSelected, TProps, State>) =>
  (...args: PropsParamType<TProps>) =>
    useConnection(connection, args[0]);

/**
 * Generates an async loader for this specific connection. Awaiting on the loader will not return
 * until the connection is in a valid loaded state.
 */
export const connectionLoader =
  <TSelected, TProps extends OptionalProps, State>(connection: Connection<TSelected, TProps, State>) =>
  (...args: PropsParamType<TProps>) =>
    loadConnection(connection, args[0]);

/**
 * Generates a synchronous selector for this specific connection. Ignores loaded state and simply
 * returns the current connection state with whatever is currently cached in the store.
 *
 * Note: Use sparingly! There are very few cases where this type of connection access is actually
 * desirable. In almost every case, connectionHook or connectionLoader is what you really want.
 */
export const connectionSelector =
  <TSelected, TProps extends OptionalProps, State>(connection: Connection<TSelected, TProps, State>) =>
  (...args: PropsParamType<TProps>) => {
    const state = (connection.getState ?? ApiSlice.getState)(ApiSlice.redux.getState()) as State;
    return connection.selector(state, args[0] as TProps);
  };
