import { Box, BoxProps } from "@chakra-ui/react";
import React, { FC } from "react";

const SimpleDivider: FC<BoxProps> = props => {
  const { backgroundColor = "neutral.300", width = "100%", height = "1px", ...rest } = props;
  return <Box width={width} height={height} backgroundColor={backgroundColor} {...rest} />;
};

export default SimpleDivider;
