import { useEffect } from "react";

const HOTJAR_ROOT_SELECTORS = [
  "#_hj_feedback_container",
  "[id^='_hj_feedback']",
  "[id^='survey_']",
  "._hj-widget-container"
].join(", ");

/**
 * Footer is ~py-3 + button height. Lift the whole Hotjar chrome as one unit so
 * the minimized bubble clears Submit without breaking open/close layout.
 */
const HOTJAR_LIFT = "4rem";
const HOTJAR_TRANSFORM = `translateY(-${HOTJAR_LIFT})`;

const collectHotjarRoots = (): HTMLElement[] =>
  Array.from(document.querySelectorAll(HOTJAR_ROOT_SELECTORS)).filter(
    (node): node is HTMLElement => node instanceof HTMLElement
  );

/**
 * Prefer transform on the root over rewriting nested `bottom` values.
 * Nested Hotjar nodes use position:fixed; forcing the same bottom on all of
 * them stacks the open survey over the toggle and blocks closing.
 * A transform on the root creates a containing block so the bubble + panel
 * move together and Hotjar's internal open/close layout stays intact.
 */
export const useHotjarAboveStickyFooter = () => {
  useEffect(() => {
    const applyLift = () => {
      collectHotjarRoots().forEach(root => {
        if (root.style.getPropertyValue("transform") === HOTJAR_TRANSFORM) return;
        root.style.setProperty("transform", HOTJAR_TRANSFORM, "important");
      });
    };

    applyLift();

    const observer = new MutationObserver(applyLift);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "id"]
    });

    return () => {
      observer.disconnect();
      collectHotjarRoots().forEach(root => {
        root.style.removeProperty("transform");
      });
    };
  }, []);
};
