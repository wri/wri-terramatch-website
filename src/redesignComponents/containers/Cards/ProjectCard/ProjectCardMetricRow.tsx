import { Box, Flex, IconProps, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ComponentType, FC, ReactNode } from "react";

import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import ProgressBar from "@/redesignComponents/dataDisplay/Metrics/ProgressBar";
import { InfoIcon } from "@/redesignComponents/foundations/Icons";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

export interface ProjectCardMetric {
  key: string;
  Icon: ComponentType<IconProps>;
  label: string;
  color: string;
  value: number;
  goal?: number | null;
  tooltipContent?: ReactNode;
}

export interface ProjectCardMetricRowProps {
  metric: ProjectCardMetric;
}

const EMPTY_ICON_COLOR = "neutral.500";

const ProjectCardMetricRow: FC<ProjectCardMetricRowProps> = ({
  metric: { Icon, label, color, value, goal, tooltipContent }
}) => {
  const t = useT();

  return (
    <Flex alignItems="center" gap={4}>
      <Flex alignItems="center" gap={1}>
        <Icon boxSize="0.875rem" color={value > 0 ? color : EMPTY_ICON_COLOR} />
        <Text textStyle="200" color="neutral.800" whiteSpace="nowrap">
          {label}
        </Text>
        {tooltipContent != null && (
          <Tooltip content={tooltipContent} position="top">
            <InfoIcon boxSize="0.6875rem" color="neutral.800" aria-label={t("Metric information")} />
          </Tooltip>
        )}
      </Flex>
      <Flex alignItems="center" gap={2}>
        {goal != null && (
          <Box width={{ base: "2.5rem", sm: "3.75rem" }} flexShrink={0}>
            <ProgressBar progress={goal > 0 ? (value / goal) * 100 : 0} color={color} />
          </Box>
        )}
        <Flex alignItems="center" gap={0.5} whiteSpace="nowrap">
          <Text textStyle="300-bold" color="neutral.900">
            {formatNumberLocaleString(value)}
          </Text>
          {goal != null && (
            <Text textStyle="300" color="neutral.800">
              {t("of {goal}", { goal: formatNumberLocaleString(goal) })}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectCardMetricRow;
