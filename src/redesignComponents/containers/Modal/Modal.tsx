import { Modal as WriModal } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";

type ModalProps = ComponentProps<typeof WriModal> & {
  restoreFocus?: boolean;
  finalFocusEl?: () => HTMLElement | null;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
  modal?: boolean;
};

const Modal: FC<ModalProps> = ({ open = false, ...props }) => {
  useModalScrollFix(open);

  return <WriModal {...(props as Omit<ComponentProps<typeof WriModal>, "open">)} open={open} />;
};

export default Modal;
