import { useEffect, useRef } from "react";

/**
 * A hook useful for executing a side effect after component render (in an effect) if the given
 * value changes. Uses strict equals. The primary use of this hook is to prevent a side effect from
 * being executed multiple times if the component re-renders after the value has transitioned to its
 * action state.
 *
 * Callback is guaranteed to execute on the first render of the component. This is intentional. A
 * consumer of this hook is expected to check the current state of the value and take action based
 * on its current state. If the component initially renders with the value in the action state, we'd
 * want the resulting side effect to take place immediately, rather than only when the value has
 * changed.
 *
 * Example:
 *
 * useValueChanged(isLoggedIn, () => {
 *   if (isLoggedIn) router.push("/home");
 * }
 */
export function useValueChanged<T>(value: T, callback: () => void) {
  const ref = useRef<T>();
  useEffect(() => {
    if (ref.current !== value) {
      ref.current = value;
      callback();
    }
  });
}
