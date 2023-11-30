import { Dispatch, SetStateAction, useState } from "react";

/**
 * return an instance of useState which fires `onChangeEffect` on state change
 * @param defaultValue default value for state
 * @param onChangeEffect [(value: T) => void] Fires on state change
 * @returns [state, setStateWithChangeEffect, setStateWithoutFiringEffect]
 *
 * this hook replace the common misuse of useEffect
 * const [state, setState] = useState();
 * useEffect(()=>{
 *  // on state change action
 * }, [state])
 *
 * replace with
 * const [state, setState, setStateWithoutFiringEffect] = useStateWithEffect("", value => {
 *  // on state change action
 * });
 */

export function useStateWithEffect<T>(
  defaultValue: T,
  onChangeEffect: (value: T) => void
): [T, Dispatch<SetStateAction<T>>, Dispatch<SetStateAction<T>>] {
  const [state, _setState] = useState<T>(defaultValue);

  const setState: Dispatch<SetStateAction<T>> = v => {
    let newState;

    if (typeof v === "function") {
      //@ts-ignore
      newState = v(state);
    } else {
      newState = v;
    }

    _setState(newState);
    onChangeEffect(newState);
  };

  return [state, setState, _setState];
}
