import { IconButton as WriIconButton } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import { FC } from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  disabled?: boolean;
}

const IconButton: FC<IconButtonProps> = ({ icon, disabled, ...props }) => {
  return (
    <WriIconButton
      icon={icon}
      disabled={disabled}
      {...props}
      className={classNames("hover:bg-theme-primary-500/20 active:bg-theme-primary-500/40 !h-6 !w-6 rounded-sm")}
      css={{
        width: "24px !important",
        height: "24px !important",
        minWidth: "24px !important",
        maxWidth: "24px !important"
      }}
    />
  );
};

export default IconButton;
