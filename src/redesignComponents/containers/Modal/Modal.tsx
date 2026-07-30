import { Modal as WriModal } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";

const Modal: FC<ComponentProps<typeof WriModal>> = ({
  open = false,
  modal = true,
  restoreFocus = true,
  trapFocus = false,
  ...props
}) => {
  useModalScrollFix(open);

  return (
    <WriModal
      lazyMount
      unmountOnExit
      open={open}
      modal={modal}
      restoreFocus={restoreFocus}
      trapFocus={trapFocus}
      {...props}
    />
  );
};

export default Modal;
