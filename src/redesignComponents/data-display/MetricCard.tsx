import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";

import { getThemedColor } from "@/lib/theme";

import { InformationRequired } from "../foundations/Icons";
import DonutChart from "./DonutChart";
import ProgressBar from "./ProgressBar";
import {
  DonutChartMetricCardContentProps,
  MetricCardProps,
  ProgressBarMetricCardContentProps,
  SimpleMetricCardContentProps
} from "./types";
import { getIconWithProgressColor24 } from "./utils/getIconWithProgressColor";

const SimpleMetricCardContent: FC<SimpleMetricCardContentProps> = ({ title, progress, color, iconWithColor }) => (
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
);

const ProgressBarMetricCardContent: FC<ProgressBarMetricCardContentProps> = ({
  title,
  progress,
  goal,
  color,
  iconWithColor
}) => {
  const t = useT();
  const progressValue = goal > 0 ? (progress / goal) * 100 : 0;

  return (
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
            {t("of")}
          </Text>
          <Text fontSize="14px" color="neutral.800" lineHeight="20px">
            {goal.toLocaleString()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

const DonutChartMetricCardContent: FC<DonutChartMetricCardContentProps> = ({
  title,
  progress,
  goal,
  color,
  iconWithColor
}) => {
  const t = useT();
  const progressValue = goal > 0 ? (progress / goal) * 100 : 0;

  return (
    <Flex gap={3} alignItems="center">
      <DonutChart progress={progressValue} color={color}>
        {iconWithColor}
      </DonutChart>
      <Flex direction="column" gap={2}>
        <Flex gap={1} alignItems="center">
          <Text fontSize="16px" color="neutral.900" lineHeight="24px">
            {title}
          </Text>
          <InformationRequired color="neutral.800" boxSize="14px" />
        </Flex>
        {goal > 0 ? (
          <Flex gap={1} alignItems="center">
            <Text fontSize="20px" fontWeight="bold" color="neutral.900" lineHeight="28px">
              {progress.toLocaleString()}
            </Text>
            <Text fontSize="18px" color="neutral.800" lineHeight="28px">
              {t("of")}
            </Text>
            <Text fontSize="18px" color="neutral.800" lineHeight="28px">
              {goal.toLocaleString()}
            </Text>
          </Flex>
        ) : (
          <Text fontSize="18px" fontWeight="bold" color="neutral.600" lineHeight="28px">
            {t("N/A")}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

const MetricCard: FC<MetricCardProps> = props => {
  const { title, progress, goal, tooltipContent, variant = "simple", icon, color = "primary.600" } = props;
  const iconWithColor = getIconWithProgressColor24(icon, progress, goal, color);

  let content: ReactNode;

  switch (variant) {
    case "progressBar":
      content = (
        <ProgressBarMetricCardContent
          title={title}
          progress={progress}
          goal={goal}
          color={color}
          iconWithColor={iconWithColor}
        />
      );
      break;
    case "donutChart":
      content = (
        <DonutChartMetricCardContent
          title={title}
          progress={progress}
          goal={goal}
          tooltipContent={tooltipContent}
          color={color}
          iconWithColor={iconWithColor}
        />
      );
      break;
    case "simple":
    default:
      content = (
        <SimpleMetricCardContent title={title} progress={progress} color={color} iconWithColor={iconWithColor} />
      );
      break;
  }

  return (
    <Box padding={3} borderRadius={8} border={`1px solid ${getThemedColor("neutral", 300)}`} height="fit-content">
      {content}
    </Box>
  );
};

export default MetricCard;
