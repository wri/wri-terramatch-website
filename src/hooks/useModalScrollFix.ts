import { useEffect } from "react";

/** Clears Chakra scroll-lock styles that can leave the page unclickable after a modal closes. */
export const releaseModalScrollLock = () => {
  document.body.style.pointerEvents = "";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  document.documentElement.removeAttribute("data-scroll-locked");
};

export const useModalScrollFix = (open: boolean) => {
  useEffect(() => {
    if (!open) {
      releaseModalScrollLock();
    }

    return () => {
      releaseModalScrollLock();
    };
  }, [open]);
};
