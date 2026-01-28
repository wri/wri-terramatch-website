import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { ProgressTag } from "../actions/Tags/ProgressTag/ProgressTag";
import Tooltip from "../actions/Tooltip/Tooltip";
import { InformationRequired } from "../foundations/Icons";
import SimpleDivider from "../miscellaneous/Dividers/SimpleDivider";
import DonutChart from "./DonutChart";
import { MultiMetricCardProps } from "./types";
import { getIconWithProgressColor16 } from "./utils/getIconWithProgressColor";

const MultiMetricCard: FC<MultiMetricCardProps> = props => {
  const { title, status = "not-started", metrics } = props;
  const t = useT();
  return (
    <Flex
      direction="column"
      gap={3}
      padding={4}
      borderRadius={"6px"}
      height="fit-content"
      backgroundColor="neutral.100"
    >
      <Text fontSize="16px" fontWeight="bold" color="neutral.900" lineHeight="24px">
        {title}
      </Text>
      {metrics.map(metric => {
        const progressValue = metric.goal > 0 ? (metric.progress / metric.goal) * 100 : 0;
        const iconWithColor = getIconWithProgressColor16(metric.icon, metric.progress, metric.goal, metric.color);

        return (
          <Flex key={metric.title} gap={3} alignItems="center">
            <DonutChart progress={progressValue} color={metric.color} size={54}>
              {iconWithColor}
            </DonutChart>
            <Flex direction="column" gap={1}>
              <Flex gap={1}>
                <Text fontSize="14px" color="neutral.900" lineHeight="20px">
                  {metric.title}
                </Text>
                <Tooltip content={<Text>{metric.tooltipContent}</Text>}>
                  <InformationRequired color="neutral.800" boxSize="12px" />
                </Tooltip>
              </Flex>
              {metric.goal > 0 ? (
                <Flex gap={1} alignItems="center">
                  <Text fontSize="16px" fontWeight="bold" color="neutral.900" lineHeight="24px">
                    {metric.progress.toLocaleString()}
                  </Text>
                  <Text fontSize="14px" color="neutral.800" lineHeight="20px">
                    {t("of")}
                  </Text>
                  <Text fontSize="14px" color="neutral.800" lineHeight="20px">
                    {metric.goal.toLocaleString()}
                  </Text>
                </Flex>
              ) : (
                <Text fontSize="14px" fontWeight="bold" color="neutral.600" lineHeight="20px">
                  {t("N/A")}
                </Text>
              )}
            </Flex>
          </Flex>
        );
      })}
      <SimpleDivider />
      <Flex gap={2} alignItems="center">
        <Text fontSize="14px" color="neutral.800" lineHeight="20px">
          {t("Restoration Status")}:
        </Text>
        <ProgressTag state={status} />
      </Flex>
    </Flex>
  );
};

export default MultiMetricCard;
