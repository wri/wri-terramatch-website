import { useEffect } from "react";

const HOTJAR_ROOT_SELECTORS = [
  "#_hj_feedback_container",
  "[id^='_hj_feedback']",
  "[id^='survey_']",
  "._hj-widget-container"
].join(", ");

/**
 * Footer is ~py-3 + button (~4rem). Use extra clearance so the bubble sits
 * fully above Download / Save and Exit / Submit.
 */
const HOTJAR_BOTTOM_OFFSET = "7rem";

const collectHotjarElements = (): HTMLElement[] => {
  const roots = Array.from(document.querySelectorAll(HOTJAR_ROOT_SELECTORS)).filter(
    (node): node is HTMLElement => node instanceof HTMLElement
  );

  const targets = new Set<HTMLElement>();

  roots.forEach(root => {
    targets.add(root);
    root.querySelectorAll("*").forEach(child => {
      if (!(child instanceof HTMLElement)) return;
      const { position, bottom } = window.getComputedStyle(child);
      // Only viewport-fixed nodes share the sticky-footer collision; leave
      // absolute layout inside the survey chrome alone.
      if (position === "fixed" && bottom !== "auto") {
        targets.add(child);
      }
    });
  });

  return Array.from(targets);
};

/**
 * Hotjar injects survey UI on document.body. The visible bubble is often a
 * nested `position: fixed` node, so offsetting only the root is not enough.
 */
export const useHotjarAboveStickyFooter = () => {
  useEffect(() => {
    const applyOffset = () => {
      collectHotjarElements().forEach(node => {
        if (node.style.getPropertyValue("bottom") === HOTJAR_BOTTOM_OFFSET) return;
        node.style.setProperty("bottom", HOTJAR_BOTTOM_OFFSET, "important");
      });
    };

    applyOffset();

    const observer = new MutationObserver(applyOffset);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "id"]
    });

    return () => {
      observer.disconnect();
      collectHotjarElements().forEach(node => {
        node.style.removeProperty("bottom");
      });
    };
  }, []);
};
