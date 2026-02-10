import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";

import { getThemedColor } from "@/lib/theme";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";

import { InformationRequired } from "../../foundations/Icons";
import DonutChart from "./DonutChart";
import ProgressBar from "./ProgressBar";
import {
  DonutChartMetricCardContentProps,
  MetricCardProps,
  NoGoalMetricCardContentProps,
  ProgressBarMetricCardContentProps
} from "./types";
import { getIconWithProgressColor } from "./utils/getIconWithProgressColor";

const NoGoalMediumMetricCardContent: FC<NoGoalMetricCardContentProps> = ({
  title,
  progress,
  color,
  iconWithColor,
  tooltipContent
}) => (
  <Flex direction="column" gap={2}>
    <Flex gap={1} color={color} alignItems="center">
      {iconWithColor}
      <Text fontSize="14px" color="neutral.800" lineHeight="20px" paddingLeft={1}>
        {title}
      </Text>
      <Tooltip content={tooltipContent} position="top">
        <InformationRequired color="neutral.800" boxSize="14px" />
      </Tooltip>
    </Flex>
    <Text fontSize="16px" fontWeight="bold" color="neutral.900" lineHeight="24px">
      {progress.toLocaleString()}
    </Text>
  </Flex>
);

const NoGoalLargeMetricCardContent: FC<NoGoalMetricCardContentProps> = ({
  title,
  progress,
  color,
  iconWithColor,
  tooltipContent
}) => (
  <Flex gap={3} color={color} alignItems="center">
    {iconWithColor}
    <Flex direction="column" gap={0}>
      <Flex gap={1} alignItems="center">
        <Text fontSize="16px" color="neutral.800" lineHeight="24px">
          {title}
        </Text>
        <Tooltip content={tooltipContent} position="top">
          <InformationRequired color="neutral.800" boxSize="14px" />
        </Tooltip>
      </Flex>
      <Text fontSize="20px" fontWeight="bold" color="neutral.900" lineHeight="28px">
        {progress.toLocaleString()}
      </Text>
    </Flex>
  </Flex>
);

const ProgressBarMetricCardContent: FC<ProgressBarMetricCardContentProps> = ({
  title,
  progress,
  goal,
  color,
  iconWithColor,
  tooltipContent
}) => {
  const t = useT();
  const progressValue = goal > 0 ? (progress / goal) * 100 : 0;

  return (
    <Flex direction="column" gap={2}>
      <Flex gap={2} alignItems="center">
        {iconWithColor}
        <Text fontSize="14px" color="neutral.800" lineHeight="20px">
          {title}
        </Text>
        <Tooltip content={tooltipContent} position="top">
          <InformationRequired color="neutral.800" boxSize="14px" />
        </Tooltip>
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
  iconWithColor,
  type,
  tooltipContent
}) => {
  const t = useT();
  const progressValue = type === "jobsCreated" ? progress : goal > 0 ? (progress / goal) * 100 : 0;
  return (
    <Flex gap={3} alignItems="center">
      <DonutChart progress={progressValue} color={color} type={type}>
        {iconWithColor}
      </DonutChart>
      <Flex direction="column" gap={2}>
        <Flex gap={1} alignItems="center">
          <Text fontSize="16px" color="neutral.900" lineHeight="24px">
            {title}
          </Text>
          <Tooltip content={tooltipContent} position="top">
            <InformationRequired color="neutral.800" boxSize="14px" />
          </Tooltip>
        </Flex>
        {type === "jobsCreated" && progressValue > 0 ? (
          <Flex gap={1} alignItems="center">
            <Text fontSize="20px" fontWeight="bold" color="neutral.900" lineHeight="28px">
              {progress.toLocaleString()}
            </Text>
          </Flex>
        ) : goal > 0 ? (
          <Flex gap={1} alignItems="center">
            <Text fontSize="20px" fontWeight="bold" color="neutral.900" lineHeight="28px">
              {Math.round(progress).toLocaleString()}
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
  const {
    title,
    progress,
    goal,
    tooltipContent,
    variant = "medium",
    icon,
    color = "primary.600",
    type,
    className
  } = props;
  const iconWithColor14 = getIconWithProgressColor(icon, progress, goal, "14px", color, variant);
  const iconWithColor24 = getIconWithProgressColor(icon, progress, goal, "24px", color, variant);
  const iconWithColor50 = getIconWithProgressColor(icon, progress, goal, "50px", color, variant);

  let content: ReactNode;

  switch (variant) {
    case "progressBar":
      content = (
        <ProgressBarMetricCardContent
          title={title}
          progress={progress}
          goal={goal}
          color={color}
          iconWithColor={iconWithColor14}
          tooltipContent={tooltipContent}
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
          iconWithColor={iconWithColor24}
          type={type}
        />
      );
      break;
    case "medium":
      content = (
        <NoGoalMediumMetricCardContent
          title={title}
          progress={progress}
          color={color}
          iconWithColor={iconWithColor14}
          tooltipContent={tooltipContent}
        />
      );
      break;
    case "large":
      content = (
        <NoGoalLargeMetricCardContent
          title={title}
          progress={progress}
          color={color}
          iconWithColor={iconWithColor50}
          tooltipContent={tooltipContent}
        />
      );
      break;
  }

  return (
    <Box
      padding={3}
      borderRadius={8}
      border={`1px solid ${getThemedColor("neutral", 300)}`}
      height="fit-content"
      justifyContent="center"
      display="flex"
      className={className}
    >
      {content}
    </Box>
  );
};

export default MetricCard;
