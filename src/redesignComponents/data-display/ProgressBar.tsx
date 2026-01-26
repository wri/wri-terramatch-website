import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

import { ProgressBarProps } from "./types";

const ProgressBar: FC<ProgressBarProps> = ({
  value,
  width = "100%",
  height = 8,
  color,
  backgroundColor,
  className,
  ...rest
}) => {
  const progress = Math.max(0, Math.min(100, value));

  const progressColor = color ?? getThemedColor("primary", 600);
  const bgColor = backgroundColor ?? getThemedColor("neutral", 300);

  return (
    <Box
      className={className}
      width={width}
      height={`${height}px`}
      backgroundColor={bgColor}
      borderRadius="full"
      overflow="hidden"
      position="relative"
      {...rest}
    >
      <Box
        width={`${progress}%`}
        height="100%"
        backgroundColor={progressColor}
        borderRadius="full"
        transition="width 0.3s ease-in-out"
      />
    </Box>
  );
};

export default ProgressBar;
