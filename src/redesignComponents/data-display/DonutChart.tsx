import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

import { DonutChartProps } from "./types";

const DonutChart: FC<DonutChartProps> = ({
  value,
  size = 90,
  color,
  backgroundColor,
  className,
  children,
  ...rest
}) => {
  const progress = Math.max(0, Math.min(100, value));

  const center = size / 2;
  const radius = size / 2;

  const angle = (-90 + (progress / 100) * 360) * (Math.PI / 180);

  const endX = center + radius * Math.cos(angle);
  const endY = center + radius * Math.sin(angle);

  const largeArcFlag = progress > 50 ? 1 : 0;

  const pathData =
    progress === 0
      ? ""
      : progress === 100
      ? null
      : `M ${center} ${center} L ${center} 0 A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

  const progressColor = color || getThemedColor("primary", 600);
  const bgColor = backgroundColor || getThemedColor("neutral", 300);

  return (
    <Box
      className={className}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={`${size}px`}
      height={`${size}px`}
      position="relative"
      {...rest}
    >
      <Box
        position="absolute"
        top={"50%"}
        left={"50%"}
        transform={"translate(-50%, -50%)"}
        width={`${size / 2}px`}
        height={`${size / 2}px`}
        backgroundColor="white"
        rounded="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Box>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {progress < 100 && <circle cx={center} cy={center} r={radius} fill={bgColor} />}
        {progress === 100 ? (
          <circle cx={center} cy={center} r={radius} fill={progressColor} />
        ) : (
          pathData && <path d={pathData} fill={progressColor} />
        )}
      </svg>
    </Box>
  );
};

export default DonutChart;
