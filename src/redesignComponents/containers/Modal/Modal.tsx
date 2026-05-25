import { Modal as WriModal } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";

const Modal: FC<ComponentProps<typeof WriModal>> = ({ open = false, ...props }) => {
  useModalScrollFix(open);

  return <WriModal open={open} {...props} />;
};

export default Modal;
