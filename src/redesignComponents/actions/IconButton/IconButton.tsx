import { IconButton as WriIconButton } from "@worldresources/wri-design-systems";
import { FC } from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  disabled?: boolean;
}

const IconButton: FC<IconButtonProps> = ({ icon, disabled, ...props }) => {
  return <WriIconButton icon={icon} disabled={disabled} {...props} />;
};

export default IconButton;
