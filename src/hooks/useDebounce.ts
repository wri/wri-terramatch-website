import { useCallback, useEffect, useRef } from "react";

type Timer = ReturnType<typeof setTimeout>;

// Note: func is a hook dependency and should be made stable (use useCallback)
export function useDebounce<Func extends (...args: any[]) => void>(func: Func, delay = 500) {
  const timer = useRef<Timer>();

  useEffect(() => {
    return () => {
      if (timer.current != null) clearTimeout(timer.current);
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      if (timer.current != null) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [delay, func]
  ) as Func;
}
