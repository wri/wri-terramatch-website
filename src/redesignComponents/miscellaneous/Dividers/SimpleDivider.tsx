import { Box, BoxProps } from "@chakra-ui/react";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

export interface SimpleDividerProps extends BoxProps {
  variant?: "horizontal" | "vertical";
}

const SimpleDivider: FC<SimpleDividerProps> = props => {
  const {
    variant = "horizontal",
    backgroundColor = "neutral.300",
    width = "100%",
    height = "0.063rem",
    className,
    ...rest
  } = props;
  return (
    <Box
      className={twMerge("shrink-0", className)}
      width={variant === "horizontal" ? width : "0.063rem"}
      height={variant === "vertical" ? "100%" : height}
      backgroundColor={backgroundColor}
      {...rest}
    />
  );
};

export default SimpleDivider;
