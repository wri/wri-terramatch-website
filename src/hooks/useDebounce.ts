import { useCallback, useEffect, useRef } from "react";

type Timer = ReturnType<typeof setTimeout>;
type SomeFunction = (...args: any[]) => void;

// Note: func is a hook dependency and should be made stable (use useCallback)
export function useDebounce<Func extends SomeFunction>(func: Func, delay = 500) {
  const timer = useRef<Timer>();

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      const newTimer = setTimeout(() => {
        func(...args);
      }, delay);
      clearTimeout(timer.current);
      timer.current = newTimer;
    },
    [delay, func]
  ) as Func;
}
