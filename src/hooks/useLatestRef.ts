import { useRef } from "react";

/** Keeps a ref synced to the latest value without adding it to effect dependency arrays. */
export const useLatestRef = <T>(value: T) => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
