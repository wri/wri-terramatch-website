import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { Framework } from "@/context/framework.provider";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";

import { InformationRequiredIcon } from "../../foundations/Icons";
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
  tooltipContent,
  classNameTitle
}) => (
  <Flex direction="column" gap={2}>
    <Flex gap={1} color={color} alignItems="center">
      {iconWithColor}
      <Text
        textStyle="300"
        color="neutral.800"
        paddingLeft={1}
        className={twMerge("whitespace-nowrap", classNameTitle)}
      >
        {title}
      </Text>
      <Tooltip content={tooltipContent} position="top">
        <InformationRequiredIcon color="neutral.800" boxSize="14px" />
      </Tooltip>
    </Flex>
    <Text textStyle="400-bold" color="neutral.900">
      {progress.toLocaleString()}
    </Text>
  </Flex>
);

const NoGoalLargeMetricCardContent: FC<NoGoalMetricCardContentProps> = ({
  title,
  progress,
  color,
  iconWithColor,
  tooltipContent,
  classNameTitle
}) => (
  <Flex gap={3} color={color} alignItems="center">
    {iconWithColor}
    <Flex direction="column" gap={0}>
      <Flex gap={1} alignItems="center">
        <Text textStyle="400" color="neutral.800" className={twMerge("whitespace-nowrap", classNameTitle)}>
          {title}
        </Text>
        <Tooltip content={tooltipContent} position="top">
          <InformationRequiredIcon color="neutral.800" boxSize="14px" />
        </Tooltip>
      </Flex>
      <Text textStyle="600-bold" color="neutral.900">
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
  tooltipContent,
  classNameTitle
}) => {
  const t = useT();
  const progressValue = goal > 0 ? (progress / goal) * 100 : 0;

  return (
    <Flex direction="column" gap={2}>
      <Flex gap={2} alignItems="center">
        {iconWithColor}
        <Text textStyle="300" color="neutral.800" className={twMerge("whitespace-nowrap", classNameTitle)}>
          {title}
        </Text>
        <Tooltip content={tooltipContent} position="top">
          <InformationRequiredIcon color="neutral.800" boxSize="14px" />
        </Tooltip>
      </Flex>
      <Flex gap={2} alignItems="center">
        <ProgressBar progress={progressValue} color={color} />
        <Flex gap={1} alignItems="center">
          <Text textStyle="400-bold" color="neutral.900">
            {progress.toLocaleString()}
          </Text>
          <Text textStyle="300" color="neutral.800">
            {t("of")}
          </Text>
          <Text textStyle="300" color="neutral.800">
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
  tooltipContent,
  classNameTitle,
  frameworkKey
}) => {
  const t = useT();
  const progressValue = goal > 0 ? (progress / goal) * 100 : progress;
  return (
    <Flex gap={3} alignItems="center">
      <DonutChart progress={progressValue} color={color} type={type}>
        {iconWithColor}
      </DonutChart>
      <Flex direction="column" gap={2}>
        <Flex gap={1} alignItems="center">
          <Text textStyle="400" color="neutral.900" className={twMerge("whitespace-nowrap", classNameTitle)}>
            {title}
          </Text>
          <Tooltip content={tooltipContent} position="top">
            <InformationRequiredIcon color="neutral.800" boxSize="14px" />
          </Tooltip>
        </Flex>
        {frameworkKey === Framework.PPC && type === "jobsCreated" ? (
          <Flex gap={1} alignItems="center">
            <Text textStyle="600-bold" color="neutral.900">
              {progress.toLocaleString()}
            </Text>
          </Flex>
        ) : goal > 0 || progress > 0 ? (
          <Flex gap={1} alignItems="center">
            <Text textStyle="600-bold" color="neutral.900">
              {Math.round(progress).toLocaleString()}
            </Text>
            <Text textStyle="500" color="neutral.800">
              {t("of")}
            </Text>
            <Text textStyle="500" color="neutral.800">
              {goal.toLocaleString()}
            </Text>
          </Flex>
        ) : (
          <Text textStyle="500-bold" color="neutral.600">
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
    className,
    classNameTitle,
    frameworkKey
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
          classNameTitle={classNameTitle}
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
          classNameTitle={classNameTitle}
          frameworkKey={frameworkKey}
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
          classNameTitle={classNameTitle}
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
          classNameTitle={classNameTitle}
        />
      );
      break;
  }

  return (
    <Flex
      padding={3}
      className={twMerge(
        "h-fit justify-start rounded-lg border border-theme-neutral-300 bg-theme-neutral-100 p-3",
        className
      )}
    >
      {content}
    </Flex>
  );
};

export default MetricCard;
