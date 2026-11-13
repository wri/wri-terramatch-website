import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactElement, ReactNode } from "react";

import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import ProgressBar from "@/redesignComponents/dataDisplay/Metrics/ProgressBar";
import { InfoIcon } from "@/redesignComponents/foundations/Icons";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

export interface ProjectCardMetric {
  value: number;
  goal: number;
  tooltipContent?: ReactNode;
}

export interface ProjectCardMetricRowProps {
  icon: ReactElement;
  label: string;
  metric: ProjectCardMetric;
  color: string;
}

const ProjectCardMetricRow: FC<ProjectCardMetricRowProps> = ({ icon, label, metric, color }) => {
  const t = useT();
  const progress = metric.goal > 0 ? (metric.value / metric.goal) * 100 : 0;

  return (
    <Flex alignItems="center" gap={4}>
      <Flex alignItems="center" gap={1}>
        {icon}
        <Text textStyle="200" color="neutral.800" whiteSpace="nowrap">
          {label}
        </Text>
        {metric.tooltipContent != null && (
          <Tooltip content={metric.tooltipContent} position="top">
            <InfoIcon boxSize="0.6875rem" color="neutral.800" aria-label={t("Metric information")} />
          </Tooltip>
        )}
      </Flex>
      <Flex alignItems="center" gap={2}>
        <ProgressBar progress={progress} width="3.75rem" color={color} />
        <Flex alignItems="center" gap={0.5} whiteSpace="nowrap">
          <Text textStyle="300-bold" color="neutral.900">
            {formatNumberLocaleString(metric.value)}
          </Text>
          <Text textStyle="300" color="neutral.800">
            {t("of {goal}", { goal: formatNumberLocaleString(metric.goal) })}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectCardMetricRow;
