import { CloseButton as WriCloseButton } from "@worldresources/wri-design-systems";
import { FC } from "react";

import { focusOutlineClass } from "../Button/Button.styles";

interface ICloseButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

const CloseButton: FC<ICloseButtonProps> = ({ disabled, onClick, ...props }) => {
  return <WriCloseButton disabled={disabled} {...props} className={focusOutlineClass} onClick={onClick} />;
};

export default CloseButton;
