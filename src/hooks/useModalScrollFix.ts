import { useEffect } from "react";

/**
 * Radix-based modals (used via our Modal wrapper) sometimes leave scroll-lock
 * artifacts on the <body> / <html> when they close. This hook cleans them up.
 */
export const useModalScrollFix = (open: boolean) => {
  useEffect(() => {
    if (open) return;
    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.documentElement.removeAttribute("data-scroll-locked");
  }, [open]);
};
