import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function useValueChanged<T>(value: T, callback: () => void) {
  const previous = usePrevious(value);
  if (previous !== value) callback();
}
