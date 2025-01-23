import { useEffect } from "react";

/**
 * A simple hook to run an effect only once when the component mounts.
 */
export function useOnMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
}
