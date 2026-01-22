import { ButtonProps } from "@chakra-ui/react";
import { Button as WriButton } from "@worldresources/wri-design-systems";
import clsx from "clsx";
import { FC } from "react";

import { secondaryTextColorClass } from "./Button.styles";

interface IButtonProps extends Omit<ButtonProps, "size" | "variant" | "colorPalette" | "children"> {
  className?: string;
  variant?: "primary" | "secondary" | "borderless" | "outline";
  size?: "default" | "small";
  children?: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: FC<IButtonProps> = ({ children, className, variant = "primary", ...props }) => {
  const buttonClassName = clsx(className, variant === "secondary" && secondaryTextColorClass);

  return (
    <WriButton variant={variant} {...props} className={buttonClassName}>
      {children}
    </WriButton>
  );
};

export default Button;
