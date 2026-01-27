import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { ProgressBarProps } from "./types";

const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  width = "100%",
  height = 8,
  color,
  backgroundColor,
  className,
  ...rest
}) => {
  const progressValue = Math.max(0, Math.min(100, progress));

  const progressColor = color ?? "primary.600";
  const bgColor = backgroundColor ?? "neutral.300";

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
        width={`${progressValue}%`}
        height="100%"
        backgroundColor={progressColor}
        borderRadius="full"
        transition="width 0.3s ease-in-out"
      />
    </Box>
  );
};

export default ProgressBar;
