import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

import { DonutChartProps } from "./types";

const DonutChart: FC<DonutChartProps> = ({
  progress,
  size = 5.625,
  color,
  backgroundColor,
  className,
  children,
  type,
  ...rest
}) => {
  const progressValue = Math.max(0, Math.min(100, progress));

  const center = size / 2;
  const radius = size / 2;

  const angle = (-90 + (progressValue / 100) * 360) * (Math.PI / 180);

  const endX = center + radius * Math.cos(angle);
  const endY = center + radius * Math.sin(angle);

  const largeArcFlag = progressValue > 50 ? 1 : 0;

  const pathData =
    progressValue === 0
      ? ""
      : progressValue === 100
      ? null
      : `M ${center} ${center} L ${center} 0 A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

  const progressColor = color ?? getThemedColor("primary", 600);
  const bgColor = backgroundColor ?? getThemedColor("neutral", 300);

  return (
    <Box
      className={className}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={`${size}rem`}
      height={`${size}rem`}
      position="relative"
      color={progressColor}
      {...rest}
    >
      <Box
        position="absolute"
        top={"50%"}
        left={"50%"}
        transform={"translate(-50%, -50%)"}
        width={`${size / 2}rem`}
        height={`${size / 2}rem`}
        backgroundColor="white"
        rounded="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Box>
      {type === "jobsCreated" && progressValue > 0 ? (
        <svg width={`${size}rem`} height={`${size}rem`} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={radius} fill="currentColor" />
        </svg>
      ) : (
        <svg width={`${size}rem`} height={`${size}rem`} viewBox={`0 0 ${size} ${size}`}>
          {progressValue < 100 && <circle cx={center} cy={center} r={radius} fill={bgColor} />}
          {progressValue === 100 ? (
            <circle cx={center} cy={center} r={radius} fill="currentColor" />
          ) : (
            pathData && <path d={pathData} fill="currentColor" />
          )}
        </svg>
      )}
    </Box>
  );
};

export default DonutChart;
