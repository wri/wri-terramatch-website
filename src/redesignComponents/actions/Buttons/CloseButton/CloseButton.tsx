import { CloseButton as WriCloseButton } from "@worldresources/wri-design-systems";
import { FC } from "react";

import { focusOutlineClass } from "../Button/Button.styles";

interface ICloseButtonProps {
  disabled?: boolean;
}

const CloseButton: FC<ICloseButtonProps> = ({ disabled, ...props }) => {
  return <WriCloseButton disabled={disabled} {...props} className={focusOutlineClass} />;
};

export default CloseButton;
