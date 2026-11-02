import { RefObject, useEffect, useLayoutEffect, useRef } from "react";

import { EASE_IN_OUT_CUBIC_CSS, prefersReducedMotion, TABLE_TRANSITION_MS } from "./tableTransition";

export const useHeightTransition = (
  ref: RefObject<HTMLElement>,
  trigger: unknown,
  enabled: boolean,
  getAnimatedElement: (element: HTMLElement) => HTMLElement | null
) => {
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

    const delta = element.getBoundingClientRect().height - fromHeight;
    if (Math.abs(delta) < 1) return;

    const animatedElement = getAnimatedElement(element) ?? element;
    const toHeight = animatedElement.getBoundingClientRect().height;
    const options = { duration: TABLE_TRANSITION_MS, easing: EASE_IN_OUT_CUBIC_CSS };
    const animations = [
      animatedElement.animate(
        [
          { height: `${toHeight - delta}px`, overflow: "hidden" },
          { height: `${toHeight}px`, overflow: "hidden" }
        ],
        options
      ),
      ...Array.from(animatedElement.querySelectorAll("tbody"), body =>
        body.animate([{ opacity: 0 }, { opacity: 1 }], options)
      )
    ];
    return () => animations.forEach(animation => animation.cancel());
  }, [enabled, getAnimatedElement, ref, trigger]);
};
