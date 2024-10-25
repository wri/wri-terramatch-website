import { ApiDataStore } from "@/store/apiSlice";
import { Selector } from "@/types/connection";

type PureSelector<S> = (store: ApiDataStore) => S;

/**
 * A factory and cache pattern for creating pure selectors from the ApiDataStore. This allows
 * a connection that takes a given set of props, and is likely to get called many times during the
 * lifecycle of the component to ensure that its selectors aren't getting re-created on every
 * render, and are therefore going to get the performance gains we want from reselect.
 *
 * @param keyFactory A method that returns a string representation of the hooks props
 * @param selectorFactory A method that returns a pure (store-only) selector.
 */
export function selectorCache<S, P extends Record<string, unknown>>(
  keyFactory: (props: P) => string,
  selectorFactory: (props: P) => PureSelector<S>
): Selector<S, P> {
  const selectors = new Map<string, PureSelector<S>>();

  return (store: ApiDataStore, props: P) => {
    const key = keyFactory(props);
    let selector = selectors.get(key);
    if (selector == null) {
      selectors.set(key, (selector = selectorFactory(props)));
    }
    return selector(store);
  };
}
