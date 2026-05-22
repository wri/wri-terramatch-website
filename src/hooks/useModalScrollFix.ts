import { useEffect } from "react";

export const useModalScrollFix = (open: boolean) => {
  useEffect(() => {
    if (open) return;
    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.documentElement.removeAttribute("data-scroll-locked");
  }, [open]);
};
