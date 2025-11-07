import { useEffect } from "react";

import { useStableProps } from "@/hooks/useStableProps";

/**
 * To attach a listener to a HTML element, and detaching when component unmounts
 */
export function useEventListener<K extends keyof HTMLElementEventMap>(
  id: string,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  addEventOptions?: AddEventListenerOptions
) {
  const stableAddEventOptions = useStableProps(addEventOptions);
  useEffect(() => {
    document.getElementById(id)?.addEventListener(type, listener, stableAddEventOptions);

    return () => {
      document.getElementById(id)?.removeEventListener(type, listener);
    };
  }, [id, listener, stableAddEventOptions, type]);
}
