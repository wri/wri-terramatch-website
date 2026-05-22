import { Modal as WriModal } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC, useEffect } from "react";

const Modal: FC<ComponentProps<typeof WriModal>> = ({ open = false, ...props }) => {
  useEffect(() => {
    if (open) return;
    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.documentElement.removeAttribute("data-scroll-locked");
  }, [open]);

  return <WriModal open={open} {...props} />;
};

export default Modal;
