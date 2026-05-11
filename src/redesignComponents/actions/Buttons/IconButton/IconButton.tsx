import { IconButton as WriIconButton } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import { FC } from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "borderless";
  size?: "default" | "small";
}

const IconButton: FC<IconButtonProps> = ({
  icon,
  disabled,
  onClick,
  variant = "primary",
  size = "default",
  ...props
}) => {
  return (
    <WriIconButton
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      {...props}
      className={classNames("hover:bg-theme-primary-500/20 active:bg-theme-primary-500/40 !h-6 !w-6 rounded-sm")}
      css={{
        width: "1.5rem !important",
        height: "1.5rem !important",
        minWidth: "1.5rem !important",
        maxWidth: "1.5rem !important"
      }}
    />
  );
};

export default IconButton;
