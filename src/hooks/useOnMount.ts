import { isFunction } from "lodash";
import { useEffect } from "react";

/**
 * A simple hook to run an effect only once when the component mounts.
 *
 * Unlike the raw useEffect hook from React, an async function may be passed in here. The return
 * value of the callback is checked, and if a function is returned, it is returned to useEffect,
 * otherwise it is ignored.
 */
export function useOnMount(callback: () => unknown) {
  useEffect(() => {
    const result = callback();
    // only return the result of the callback if it's a cleanup function.
    if (isFunction(result)) return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
