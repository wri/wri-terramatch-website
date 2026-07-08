import { useEffect } from "react";

const HOTJAR_WIDGET_SELECTORS = "#_hj_feedback_container, [id^='_hj_feedback'], [id^='survey_'], ._hj-widget-container";

const HOTJAR_BOTTOM_OFFSET = "5.5rem";

/** Lifts injected Hotjar widgets so they do not cover the wizard sticky footer. */
export const useHotjarAboveStickyFooter = () => {
  useEffect(() => {
    const applyOffset = () => {
      document.querySelectorAll(HOTJAR_WIDGET_SELECTORS).forEach(node => {
        if (node instanceof HTMLElement) {
          node.style.setProperty("bottom", HOTJAR_BOTTOM_OFFSET, "important");
        }
      });
    };

    const clearOffset = () => {
      document.querySelectorAll(HOTJAR_WIDGET_SELECTORS).forEach(node => {
        if (node instanceof HTMLElement) {
          node.style.removeProperty("bottom");
        }
      });
    };

    applyOffset();

    const observer = new MutationObserver(applyOffset);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      clearOffset();
    };
  }, []);
};
