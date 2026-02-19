import { ButtonProps } from "@chakra-ui/react";
import { Button as WriButton } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import clsx from "clsx";
import React from "react";

import { secondaryTextColorClass } from "./Button.styles";

export interface IButtonProps extends Omit<ButtonProps, "size" | "variant" | "colorPalette" | "children"> {
  className?: string;
  variant?: "primary" | "secondary" | "borderless" | "outline";
  size?: "default" | "small";
  children?: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
}

const Button = ({ children, className, variant = "primary", ...props }: IButtonProps) => {
  const buttonClassName = clsx(className, variant === "secondary" && secondaryTextColorClass);

  return (
    <WriButton variant={variant} {...props} className={classNames("shadow-monitored", buttonClassName)}>
      {children}
    </WriButton>
  );
};

export default Button;
