import { RefObject, useEffect, useLayoutEffect, useRef } from "react";

import { EASE_IN_OUT_CUBIC_CSS, prefersReducedMotion, TABLE_TRANSITION_MS } from "./tableTransition";

/**
 * Animates the element from its previous height to its new one whenever `trigger` changes. The last rendered height
 * is tracked with a ResizeObserver, whose callbacks run after layout effects, so it still holds the pre-change value
 * when the layout effect below measures the new height.
 */
export const useHeightTransition = (ref: RefObject<HTMLElement>, trigger: unknown, enabled = true) => {
  const lastHeightRef = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (element == null) return;
    const observer = new ResizeObserver(([entry]) => {
      lastHeightRef.current = entry.borderBoxSize[0]?.blockSize ?? entry.target.getBoundingClientRect().height;
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  useLayoutEffect(() => {
    const element = ref.current;
    const fromHeight = lastHeightRef.current;
    if (!enabled || element == null || fromHeight == null) return;
    if (prefersReducedMotion()) return;

    const toHeight = element.getBoundingClientRect().height;
    if (Math.abs(toHeight - fromHeight) < 1) return;

    const animation = element.animate(
      [
        { height: `${fromHeight}px`, overflow: "hidden" },
        { height: `${toHeight}px`, overflow: "hidden" }
      ],
      { duration: TABLE_TRANSITION_MS, easing: EASE_IN_OUT_CUBIC_CSS }
    );
    return () => animation.cancel();
  }, [enabled, ref, trigger]);
};
