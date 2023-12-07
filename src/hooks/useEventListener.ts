import { useEffect } from "react";

/**
 * To attach a listener to a HTML element, and detaching when component unmounts
 * @param id Element id
 * @param type Event type
 * @param listener
 */
export function useEventListener<K extends keyof HTMLElementEventMap>(
  id: string,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
) {
  useEffect(() => {
    //To stop user from changing number value using scroll
    document.getElementById(id)?.addEventListener(type, listener);

    return () => {
      document.getElementById(id)?.removeEventListener(type, listener);
    };
  }, [id, listener, type]);
}
