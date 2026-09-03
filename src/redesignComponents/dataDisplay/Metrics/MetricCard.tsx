import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, MouseEvent, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useMetricsCardAnalyticsContext } from "@/components/reports/HighLevelMetrics/HighLevelMetricsCard";
import { Framework } from "@/context/framework.provider";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { toMetricLabel } from "@/utils/analytics/metricsCardAnalytics";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

import { InfoIcon } from "../../foundations/Icons";
import DonutChart from "./DonutChart";
import ProgressBar from "./ProgressBar";
import {
  DonutChartMetricCardContentProps,
  MetricCardProps,
  NoGoalMetricCardContentProps,
  ProgressBarMetricCardContentProps
} from "./types";
import { getIconWithProgressColor } from "./utils/getIconWithProgressColor";

const shouldRenderSuffix = (progressLabel?: string, suffix?: string): boolean =>
  progressLabel == null && suffix != null && suffix !== "";

type MetricContextItemProps = {
  label: string;
  value: number;
  goal?: number;
  suffix?: string;
  goalSuffix?: string;
};

const MetricContextItem: FC<MetricContextItemProps> = ({ label, value, goal, suffix, goalSuffix }) => {
  const t = useT();
  const showGoal = goal != null && goal > 0;
  const valueSuffix = suffix != null && suffix !== "" ? suffix : undefined;
  const displayedGoalSuffix = goalSuffix != null && goalSuffix !== "" ? goalSuffix : valueSuffix;

  return (
    <Flex gap={1} className="items-center">
      <Text color="neutral.700" textStyle="200">
        {label}
      </Text>
      <Text color="neutral.900" textStyle="300-bold">
        {formatNumberLocaleString(value)}
      </Text>
      {valueSuffix != null ? (
        <Text color="neutral.900" textStyle="300-bold">
          {valueSuffix}
        </Text>
      ) : null}
      {showGoal ? (
        <>
          <Text color="neutral.700" textStyle="200">
            {t("of")}
          </Text>
          <Text color="neutral.900" textStyle="300-bold">
            {formatNumberLocaleString(goal)}
          </Text>
          {displayedGoalSuffix != null ? (
            <Text color="neutral.900" textStyle="300-bold">
              {displayedGoalSuffix}
            </Text>
          ) : null}
        </>
      ) : null}
    </Flex>
  );
};

type MetricContextColProps = {
  selection?: number;
  filtered?: number;
  goal?: number;
  suffix?: string;
  goalSuffix?: string;
};

const MetricContextCol: FC<MetricContextColProps> = ({ selection, filtered, goal, suffix, goalSuffix }) => {
  const t = useT();
  const items = [
    selection != null ? { key: "selection", label: t("Selection:"), value: selection } : null,
    filtered != null ? { key: "filtered", label: t("Filtered:"), value: filtered } : null
  ].filter((item): item is { key: string; label: string; value: number } => item != null);

  if (items.length === 0) {
    return null;
  }

  return (
    <Flex gap={2} flexDirection="column">
      {items.map(item => (
        <MetricContextItem
          key={item.key}
          label={item.label}
          value={item.value}
          goal={goal}
          suffix={suffix}
          goalSuffix={goalSuffix}
        />
      ))}
    </Flex>
  );
};

type MetricTooltipTriggerProps = {
  tooltipContent: ReactNode;
  metricLabel?: string;
  type?: string;
};

const MetricTooltipTrigger: FC<MetricTooltipTriggerProps> = ({ tooltipContent, metricLabel, type }) => {
  const analytics = useMetricsCardAnalyticsContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const label = toMetricLabel(metricLabel, type);
    if (label !== "") {
      analytics?.onTooltipEngaged(label);
    }
  };

  return (
    <Tooltip content={tooltipContent} position="top">
      <button type="button" className="inline-flex items-center" onClick={handleClick} aria-label="Metric information">
        <InfoIcon color="neutral.800" boxSize="14px" />
      </button>
    </Tooltip>
  );
};

const NoGoalMediumMetricCardContent: FC<NoGoalMetricCardContentProps> = ({
  title,
  progress,
  progressLabel,
  progressSuffix,
  color,
  iconWithColor,
  tooltipContent,
  classNameTitle,
  metricLabel,
  type
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
      {tooltipContent != null && (
        <MetricTooltipTrigger tooltipContent={tooltipContent} metricLabel={metricLabel} type={type} />
      )}
    </Flex>
    <Flex gap={1} className="items-center">
      <Text textStyle="400-bold" color="neutral.900">
        {progressLabel ?? formatNumberLocaleString(progress)}
      </Text>
      {shouldRenderSuffix(progressLabel, progressSuffix) ? (
        <Text textStyle="400-bold" color="neutral.900">
          {progressSuffix}
        </Text>
      ) : null}
    </Flex>
  </Flex>
);

const NoGoalLargeMetricCardContent: FC<NoGoalMetricCardContentProps> = ({
  title,
  progress,
  progressLabel,
  progressSuffix,
  color,
  iconWithColor,
  tooltipContent,
  classNameTitle,
  metricLabel,
  type
}) => (
  <Flex gap={3} color={color} alignItems="center">
    {iconWithColor}
    <Flex direction="column" gap={0}>
      <Flex gap={1} alignItems="center">
        <Text textStyle="400" color="neutral.800" className={twMerge("whitespace-nowrap", classNameTitle)}>
          {title}
        </Text>
        {tooltipContent != null && (
          <MetricTooltipTrigger tooltipContent={tooltipContent} metricLabel={metricLabel} type={type} />
        )}
      </Flex>
      <Flex gap={1} className="items-center">
        <Text textStyle="600-bold" color="neutral.900">
          {progressLabel ?? formatNumberLocaleString(progress)}
        </Text>
        {shouldRenderSuffix(progressLabel, progressSuffix) ? (
          <Text textStyle="600-bold" color="neutral.900">
            {progressSuffix}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  </Flex>
);

const ProgressBarMetricCardContent: FC<ProgressBarMetricCardContentProps> = ({
  title,
  progress,
  progressLabel,
  goal,
  progressSuffix,
  goalSuffix,
  color,
  iconWithColor,
  tooltipContent,
  classNameTitle,
  metricLabel,
  widthProgressBar = "100%",
  type
}) => {
  const t = useT();
  const progressValue = goal > 0 ? (progress / goal) * 100 : 0;

  return (
    <Flex direction="column" gap={2} className="w-full">
      <Flex gap={2} alignItems="center">
        {iconWithColor}
        <Text textStyle="300" color="neutral.800" className={twMerge("whitespace-nowrap", classNameTitle)}>
          {title}
        </Text>
        {tooltipContent != null && (
          <MetricTooltipTrigger tooltipContent={tooltipContent} metricLabel={metricLabel} type={type} />
        )}
      </Flex>
      <Flex gap={2} alignItems="center">
        <ProgressBar progress={progressValue} color={color} width={widthProgressBar} />
        <Flex gap={1} alignItems="center">
          <Flex gap={1} className="items-center">
            <Text textStyle="400-bold" color="neutral.900">
              {progressLabel ?? formatNumberLocaleString(progress)}
            </Text>
            {shouldRenderSuffix(progressLabel, progressSuffix) ? (
              <Text textStyle="400-bold" color="neutral.800">
                {progressSuffix}
              </Text>
            ) : null}
          </Flex>
          <Text textStyle="300" color="neutral.800">
            {t("of")}
          </Text>
          <Flex gap={1} className="items-center">
            <Text textStyle="300" color="neutral.800">
              {formatNumberLocaleString(goal)}
            </Text>
            {goalSuffix != null && goalSuffix !== "" ? (
              <Text textStyle="300" color="neutral.800">
                {goalSuffix}
              </Text>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const DonutChartMetricCardContent: FC<DonutChartMetricCardContentProps> = ({
  title,
  progress,
  progressLabel,
  goal,
  color,
  iconWithColor,
  type,
  progressSuffix,
  goalSuffix,
  tooltipContent,
  classNameTitle,
  frameworkKey,
  metricLabel
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
          {tooltipContent != null && (
            <MetricTooltipTrigger tooltipContent={tooltipContent} metricLabel={metricLabel} type={type} />
          )}
        </Flex>
        {frameworkKey === Framework.PPC && type === "jobsCreated" ? (
          <Flex gap={1} alignItems="center">
            <Text textStyle="600-bold" color="neutral.900">
              {progressLabel ?? formatNumberLocaleString(progress)}
            </Text>
            {shouldRenderSuffix(progressLabel, progressSuffix) ? (
              <Text textStyle="600-bold" color="neutral.900">
                {progressSuffix}
              </Text>
            ) : null}
          </Flex>
        ) : goal > 0 || progress > 0 ? (
          <Flex gap={1} alignItems="center">
            <Flex gap={1} className="items-center">
              <Text textStyle="600-bold" color="neutral.900">
                {progressLabel ?? formatNumberLocaleString(Math.round(progress))}
              </Text>
              {shouldRenderSuffix(progressLabel, progressSuffix) ? (
                <Text textStyle="600-bold" color="neutral.900">
                  {progressSuffix}
                </Text>
              ) : null}
            </Flex>
            <Text textStyle="500" color="neutral.800">
              {t("of")}
            </Text>
            <Flex gap={1} className="items-center">
              <Text textStyle="500" color="neutral.800">
                {formatNumberLocaleString(goal)}
              </Text>
              {goalSuffix != null && goalSuffix !== "" ? (
                <Text textStyle="500" color="neutral.800">
                  {goalSuffix}
                </Text>
              ) : null}
            </Flex>
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
    progressLabel,
    goal,
    progressSuffix,
    goalSuffix,
    tooltipContent,
    variant = "medium",
    icon,
    color = "primary.600",
    type,
    className,
    classNameTitle,
    frameworkKey,
    selection,
    filtered,
    metricLabel,
    widthProgressBar
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
          progressLabel={progressLabel}
          goal={goal}
          progressSuffix={progressSuffix}
          goalSuffix={goalSuffix}
          color={color}
          iconWithColor={iconWithColor14}
          tooltipContent={tooltipContent}
          classNameTitle={classNameTitle}
          metricLabel={metricLabel}
          type={type}
          widthProgressBar={widthProgressBar}
        />
      );
      break;
    case "donutChart":
      content = (
        <DonutChartMetricCardContent
          title={title}
          progress={progress}
          progressLabel={progressLabel}
          goal={goal}
          progressSuffix={progressSuffix}
          goalSuffix={goalSuffix}
          tooltipContent={tooltipContent}
          color={color}
          iconWithColor={iconWithColor24}
          type={type}
          classNameTitle={classNameTitle}
          frameworkKey={frameworkKey}
          metricLabel={metricLabel}
        />
      );
      break;
    case "medium":
      content = (
        <NoGoalMediumMetricCardContent
          title={title}
          progress={progress}
          progressLabel={progressLabel}
          progressSuffix={progressSuffix}
          color={color}
          iconWithColor={iconWithColor14}
          tooltipContent={tooltipContent}
          classNameTitle={classNameTitle}
          metricLabel={metricLabel}
          type={type}
        />
      );
      break;
    case "large":
      content = (
        <NoGoalLargeMetricCardContent
          title={title}
          progress={progress}
          progressLabel={progressLabel}
          progressSuffix={progressSuffix}
          color={color}
          iconWithColor={iconWithColor50}
          tooltipContent={tooltipContent}
          classNameTitle={classNameTitle}
          metricLabel={metricLabel}
          type={type}
        />
      );
      break;
  }

  return (
    <Flex
      direction="column"
      gap={2}
      padding={3}
      className={twMerge(
        "h-fit justify-start rounded-lg border border-theme-neutral-300 bg-theme-neutral-100 p-3",
        className
      )}
    >
      {content}
      <MetricContextCol
        selection={selection}
        filtered={filtered}
        goal={goal}
        suffix={progressSuffix}
        goalSuffix={goalSuffix}
      />
    </Flex>
  );
};

export default MetricCard;
