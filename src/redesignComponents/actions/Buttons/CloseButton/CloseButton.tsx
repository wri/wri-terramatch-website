import { CloseButton as WriCloseButton } from "@worldresources/wri-design-systems";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import { focusOutlineClass } from "../Button/Button.styles";

interface ICloseButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const CloseButton: FC<ICloseButtonProps> = ({ disabled, onClick, className, ...props }) => {
  return (
    <WriCloseButton
      disabled={disabled}
      {...props}
      className={twMerge(focusOutlineClass, className)}
      onClick={onClick}
    />
  );
};

export default CloseButton;
