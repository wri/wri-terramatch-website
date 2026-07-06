import { useEffect } from "react";

export const releaseModalScrollLock = () => {
  document.body.style.pointerEvents = "";
  document.body.style.overflow = "";
  document.body.removeAttribute("aria-hidden");
  document.documentElement.style.overflow = "";
  document.documentElement.removeAttribute("data-scroll-locked");
  document.documentElement.removeAttribute("data-scroll-lock");
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
