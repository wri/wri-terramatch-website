import { isFunction } from "lodash";
import { useEffect, useRef } from "react";

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

export function useOnUnmount(callback: () => void) {
  // This is a little tricky - because we pass an empty array to `useEffect`, it's capturing
  // the callback that was sent into this function the first time it was called if we simply
  // reference callback in `useEffect`. We'd rather use the callback that was sent in the
  // _last_ time this was called, so we need to stuff it in a ref instead.
  const destructorRef = useRef(callback);
  destructorRef.current = callback;
  useEffect(
    () => () => destructorRef.current(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}
