import { Box, BoxProps } from "@chakra-ui/react";
import React, { FC } from "react";

const EllipsisDivider: FC<BoxProps> = (props = {}) => {
  const {
    color = "neutral.900",
    width = "4px",
    height = "4px",
    borderRadius = "50%",
    as = "span",
    display = "inline-block",
    ...rest
  } = props;

  return (
    <Box
      as={as}
      display={display}
      width={width}
      height={height}
      borderRadius={borderRadius}
      backgroundColor={color}
      {...rest}
    />
  );
};

export default EllipsisDivider;
