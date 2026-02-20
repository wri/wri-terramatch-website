import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { ProgressTag } from "../../actions/Tags/ProgressTag/ProgressTag";
import { InformationRequired } from "../../foundations/Icons";
import SimpleDivider from "../../miscellaneous/Dividers/SimpleDivider";
import DonutChart from "./DonutChart";
import { MultiMetricCardProps } from "./types";
import { getIconWithProgressColor } from "./utils/getIconWithProgressColor";

const MultiMetricCard: FC<MultiMetricCardProps> = props => {
  const { title, status = "not-started", metrics, labelStatus = "Label Status" } = props;
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
      <Text textStyle="400" fontWeight="bold" color="neutral.900">
        {title}
      </Text>
      {metrics.map(metric => {
        const progressValue = metric.goal > 0 ? (metric.progress / metric.goal) * 100 : 0;
        const iconWithColor = getIconWithProgressColor(
          metric.icon,
          metric.progress,
          metric.goal,
          "16px",
          metric.color,
          "donutChart"
        );

        return (
          <Flex key={metric.title} gap={3} alignItems="center">
            <DonutChart progress={progressValue} color={metric.color} size={54}>
              {iconWithColor}
            </DonutChart>
            <Flex direction="column" gap={1}>
              <Flex gap={1} alignItems="center">
                <Text textStyle="300" color="neutral.800">
                  {metric.title}
                </Text>
                <InformationRequired color="neutral.800" boxSize="12px" />
              </Flex>
              {metric.goal > 0 ? (
                <Flex gap={1} alignItems="center">
                  <Text textStyle="400" fontWeight="bold" color="neutral.900">
                    {metric.progress.toLocaleString()}
                  </Text>
                  <Text textStyle="300" color="neutral.800">
                    {t("of")}
                  </Text>
                  <Text textStyle="300" color="neutral.800">
                    {metric.goal.toLocaleString()}
                  </Text>
                </Flex>
              ) : (
                <Text textStyle="300" fontWeight="bold" color="neutral.600">
                  {t("N/A")}
                </Text>
              )}
            </Flex>
          </Flex>
        );
      })}
      <SimpleDivider />
      <Flex gap={2} alignItems="center">
        <Text textStyle="300" color="neutral.800">
          {labelStatus}:
        </Text>
        <ProgressTag state={status} />
      </Flex>
    </Flex>
  );
};

export default MultiMetricCard;
