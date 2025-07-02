import { isEqual } from "lodash";
import { useMemo, useRef } from "react";

/**
 * A hook to make a props object effective in a useEffect hook dependency. Will only return a
 * new object is the _content_ of the props changes (is not equivalent with the previous version
 * according to lodash isEqual).
 *
 * Due to the use of lodash isEqual() under the hood, this hook comes with a performance cost. If
 * you have a reasonable way to avoid using this hook, that's probably for the best.
 */
export const useStableProps = <T>(props: T) => {
  const propsRef = useRef(props);
  return useMemo(() => {
    if (!isEqual(propsRef.current, props)) {
      propsRef.current = props;
      return props;
    }

    return propsRef.current;
  }, [props]);
};
