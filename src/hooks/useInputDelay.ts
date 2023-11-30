import { useEffect, useState } from "react";

type UseInputDelayParams = {
  when: any;
  callback: () => any;
  delay?: number;
};

type UseInputDelayReturn = {
  isTyping: boolean;
};
/**
 * Handles delay debounce on Input when user typing.
 * IMPORTANT: If declaring callback function after hook declaration:
 * Please do not use arrow function, but instead pure function to enable hoisting
 * @param UseInputDelayParams
 * @returns
 */
export const useInputDelay = ({ when, callback, delay = 1000 }: UseInputDelayParams): UseInputDelayReturn => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!when) return;
    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      await callback();
      setLoading(false);
    }, delay);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when]);

  return { isTyping: loading };
};
