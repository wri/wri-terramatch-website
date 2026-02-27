import { Modal as WriModal } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Modal: FC<ComponentProps<typeof WriModal>> = props => {
  return <WriModal {...props} />;
};

export default Modal;
