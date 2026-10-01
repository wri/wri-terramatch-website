import { Box } from "@chakra-ui/react";
import { Button as WriButton, ButtonProps as WriButtonProps } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import React, { FC } from "react";

import { getThemedColor } from "@/lib/theme";

export interface IButtonProps extends WriButtonProps {
  as?: React.ElementType;
  href?: string;
  typeVariant?: "light" | "dark";
  classNameContainer?: string;
}

const Button: FC<IButtonProps> = ({
  children,
  className,
  variant = "primary",
  typeVariant = "light",
  classNameContainer,
  ...props
}) => {
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
