import type { ComponentProps } from "react";
import { FC } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";

import BaseModal from "./BaseModal";

const Modal: FC<ComponentProps<typeof BaseModal>> = ({ open = false, ...props }) => {
  useModalScrollFix(open);

  return <BaseModal open={open} {...props} />;
};

export default Modal;
