import { useEffect } from "react";

const HOTJAR_WIDGET_SELECTORS = [
  "#_hj_feedback_container",
  "[id^='_hj_feedback']",
  "[id^='survey_']",
  "._hj-widget-container"
].join(", ");

/** Matches ToolbarForm sticky footer height (~py-3 + button + shadow). */
const HOTJAR_BOTTOM_OFFSET = "5.5rem";

/**
 * Hotjar injects survey UI on document.body with inline styles (often `bottom` +
 * `!important`). Author CSS cannot reliably override that, so we set the same
 * property on the live nodes while the wizard sticky footer is open.
 */
export const useHotjarAboveStickyFooter = () => {
  useEffect(() => {
    const applyOffset = () => {
      document.querySelectorAll(HOTJAR_WIDGET_SELECTORS).forEach(node => {
        if (!(node instanceof HTMLElement)) return;
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
      document.querySelectorAll(HOTJAR_WIDGET_SELECTORS).forEach(node => {
        if (node instanceof HTMLElement) {
          node.style.removeProperty("bottom");
        }
      });
    };
  }, []);
};
