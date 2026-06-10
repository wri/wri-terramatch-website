import { FC } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";

import ModalBase from "./ModalBase";
import type { ModalProps } from "./types";

const Modal: FC<ModalProps> = ({ open = false, ...props }) => {
  useModalScrollFix(open);

  return <ModalBase open={open} {...props} />;
};

export default Modal;
