import { Box, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { getThemedColor } from "@/lib/theme";

import Tooltip from "../actions/Tooltip/Tooltip";
import { InformationRequired } from "../foundations/Icons";
import DonutChart from "./DonutChart";
import ProgressBar from "./ProgressBar";
import { MetricCardProps } from "./types";
import { getIconWithProgressColor24 } from "./utils/getIconWithProgressColor";

const MetricCard: FC<MetricCardProps> = props => {
  const { title, progress, goal, tooltipContent, variant = "simple", icon, color = "primary.600" } = props;
  const progressValue = goal ? (progress / goal) * 100 : 0;

  const iconWithColor = getIconWithProgressColor24(icon, progress, color);

  const content = {
    simple: (
      <Flex direction="column" gap={2}>
        <Flex gap={2} color={color}>
          {iconWithColor}
          <Text fontSize="14px" color="neutral.700" lineHeight="20px">
            {title}
          </Text>
        </Flex>
        <Text fontSize="16px" fontWeight="bold" color="neutral.900" lineHeight="24px">
          {progress.toLocaleString()}
        </Text>
      </Flex>
    ),
    progressBar: (
      <Flex direction="column" gap={2}>
        <Flex gap={2}>
          {iconWithColor}
          <Text fontSize="14px" color="neutral.700" lineHeight="20px">
            {title}
          </Text>
        </Flex>
        <Flex gap={2} alignItems="center">
          <ProgressBar progress={progressValue} color={color} />
          <Flex gap={1} alignItems="center">
            <Text fontSize="16px" fontWeight="bold" color="neutral.900" lineHeight="24px">
              {progress.toLocaleString()}
            </Text>
            <Text fontSize="14px" color="neutral.800" lineHeight="20px">
              of
            </Text>
            <Text fontSize="14px" color="neutral.800" lineHeight="20px">
              {goal.toLocaleString()}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    ),
    donutChart: (
      <Flex gap={3} alignItems="center">
        <DonutChart progress={progressValue} color={color}>
          {iconWithColor}
        </DonutChart>
        <Flex direction="column" gap={2}>
          <Flex gap={1}>
            <Text fontSize="16px" color="neutral.900" lineHeight="24px">
              {title}
            </Text>
            <Tooltip content={<Text>{tooltipContent}</Text>}>
              <InformationRequired color="neutral.800" boxSize="14px" />
            </Tooltip>
          </Flex>
          {goal ? (
            <Flex gap={1} alignItems="center">
              <Text fontSize="20px" fontWeight="bold" color="neutral.900" lineHeight="28px">
                {progress.toLocaleString()}
              </Text>
              <Text fontSize="18px" color="neutral.800" lineHeight="28px">
                of
              </Text>
              <Text fontSize="18px" color="neutral.800" lineHeight="28px">
                {goal.toLocaleString()}
              </Text>
            </Flex>
          ) : (
            <Text fontSize="18px" fontWeight="bold" color="neutral.600" lineHeight="28px">
              N/A
            </Text>
          )}
        </Flex>
      </Flex>
    )
  };

  return (
    <Box padding={3} borderRadius={8} border={`1px solid ${getThemedColor("neutral", 300)}`} height="fit-content">
      {content[variant]}
    </Box>
  );
};

export default MetricCard;
