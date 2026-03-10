import { CloseButton as WriCloseButton } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import { FC } from "react";

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
      className={classNames(className, focusOutlineClass)}
      onClick={onClick}
    />
  );
};

export default CloseButton;
