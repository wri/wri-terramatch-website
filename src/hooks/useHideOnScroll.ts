import { RefObject, useEffect } from "react";

const useHideOnScroll = (ref: RefObject<HTMLElement>, container?: HTMLElement | null, onHide?: () => void) => {
  useEffect(() => {
    const hideElement = () => {
      if (ref.current) {
        onHide?.();
      }
    };

    container?.addEventListener("scroll", hideElement);
    window.addEventListener("scroll", hideElement);

    hideElement();

    return () => {
      container?.removeEventListener("scroll", hideElement);
      window.removeEventListener("scroll", hideElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);
};

export default useHideOnScroll;
