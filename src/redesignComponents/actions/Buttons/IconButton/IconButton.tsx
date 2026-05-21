import { IconButton as WriIconButton } from "@worldresources/wri-design-systems";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface IconButtonProps {
  icon: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "borderless";
  size?: "default" | "small";
  className?: string;
}

const IconButton: FC<IconButtonProps> = ({
  icon,
  disabled,
  onClick,
  variant = "primary",
  size = "default",
  className,
  ...props
}) => {
  return (
    <WriIconButton
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      {...props}
      className={twMerge(
        "!h-6 !w-6 rounded-sm hover:bg-theme-primary-500/20 active:bg-theme-primary-500/40",
        className
      )}
    />
  );
};

export default IconButton;
