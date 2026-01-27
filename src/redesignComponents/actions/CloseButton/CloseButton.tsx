import { CloseButton as WriCloseButton } from "@worldresources/wri-design-systems";
import { FC } from "react";

interface ICloseButtonProps {
  disabled?: boolean;
}

const CloseButton: FC<ICloseButtonProps> = ({ disabled, ...props }) => {
  return <WriCloseButton disabled={disabled} {...props} />;
};

export default CloseButton;
