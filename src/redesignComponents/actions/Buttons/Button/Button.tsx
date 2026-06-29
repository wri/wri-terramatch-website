import { Box, ButtonProps } from "@chakra-ui/react";
import { Button as WriButton } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import React from "react";

import { getThemedColor } from "@/lib/theme";

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
  typeVariant?: "neutral" | "negative" | "dark";
  classNameContainer?: string;
}

const Button = ({
  children,
  className,
  variant = "primary",
  typeVariant = "neutral",
  classNameContainer,
  ...props
}: IButtonProps) => {
  if (typeVariant === "negative") {
    return (
      <Box
        css={{
          "& button": {
            backgroundColor: `${getThemedColor("error", 100)} !important`,
            borderColor: `${getThemedColor("error", 300)} !important`,
            color: `${getThemedColor("error", 900)} !important`
          },
          "& button:active": {
            backgroundColor: `${getThemedColor("error", 400)} !important`
          },
          "& button:disabled": {
            backgroundColor: `${getThemedColor("neutral", 200)} !important`,
            borderColor: `${getThemedColor("neutral", 300)} !important`,
            color: `${getThemedColor("neutral", 500)} !important`
          }
        }}
        className={classNameContainer}
      >
        <WriButton variant={variant} {...props} className={classNames("shadow-monitored", className)}>
          {children}
        </WriButton>
      </Box>
    );
  }
  if (typeVariant === "dark") {
    return (
      <Box
        css={{
          "& button": {
            color: `${getThemedColor("neutral", 100)} !important`
          }
        }}
        className={classNameContainer}
      >
        <WriButton variant={variant} {...props} className={classNames("shadow-monitored", className)}>
          {children}
        </WriButton>
      </Box>
    );
  }
  return (
    <WriButton variant={variant} {...props} className={classNames("shadow-monitored", className)}>
      {children}
    </WriButton>
  );
};

export default Button;
