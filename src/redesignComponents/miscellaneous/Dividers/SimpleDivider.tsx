import { Box, BoxProps } from "@chakra-ui/react";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

export interface SimpleDividerProps extends BoxProps {
  variant?: "horizontal" | "vertical";
}

const SimpleDivider: FC<SimpleDividerProps> = props => {
  const { variant = "horizontal", backgroundColor = "neutral.300", width, height, className, ...rest } = props;
  return (
    <Box
      className={twMerge("shrink-0", className)}
      width={width ? width : variant === "horizontal" ? "100%" : "0.063rem"}
      height={height ? height : variant === "vertical" ? "100%" : "0.063rem"}
      backgroundColor={backgroundColor}
      {...rest}
    />
  );
};

export default SimpleDivider;
