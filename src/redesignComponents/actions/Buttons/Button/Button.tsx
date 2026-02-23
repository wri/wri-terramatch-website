import { ButtonProps } from "@chakra-ui/react";
import { Button as WriButton } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import React from "react";

export interface IButtonProps extends Omit<ButtonProps, "size" | "variant" | "colorPalette" | "children"> {
  className?: string;
  variant?: "primary" | "secondary" | "borderless" | "outline";
  size?: "default" | "small";
  children?: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({ children, className, variant = "primary", ...props }: IButtonProps) => {
  return (
    <WriButton variant={variant} {...props} className={classNames("shadow-monitored", className)}>
      {children}
    </WriButton>
  );
};

export default Button;
