import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

const EllipsisDivider = (props: BoxProps = {}) => {
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
