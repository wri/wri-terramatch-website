import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useRef } from "react";

import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";

import { buildProjectMetrics } from "./utils/metrics.config";
import { renderMetricTooltip } from "./utils/metrics.helpers";

interface KeyIndicatorsInsightsProps {
  project: ProjectFullDto;
  onLastCardRightChange?: (width: number) => void;
}

const KeyIndicatorsInsightsTab: FC<KeyIndicatorsInsightsProps> = ({ project, onLastCardRightChange }) => {
  const metricsContainerRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const metrics = buildProjectMetrics(project, t);

  useEffect(() => {
    if (!onLastCardRightChange) return;

    const containerEl = metricsContainerRef.current;
    if (!containerEl) return;

    const metricCardNodes = containerEl.querySelectorAll("[data-metric-card-item]");
    if (!metricCardNodes.length) return;

    let frameId: number;

    const updateRightMostCardEdge = () => {
      cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        const containerRect = containerEl.getBoundingClientRect();

        let rightMostEdge = 0;

        metricCardNodes.forEach(node => {
          const cardRect = node.getBoundingClientRect();
          rightMostEdge = Math.max(rightMostEdge, cardRect.right - containerRect.left);
        });

        onLastCardRightChange(rightMostEdge);
      });
    };

    updateRightMostCardEdge();

    const resizeObserver = new ResizeObserver(updateRightMostCardEdge);
    resizeObserver.observe(containerEl);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [onLastCardRightChange]);

  return (
    <Flex
      ref={metricsContainerRef}
      gap={8}
      flexWrap="wrap"
      justify="flex-start"
      display="inline-flex"
      width="fit-content"
      alignSelf="flex-start"
    >
      {metrics.map(metric => (
        <Box key={metric.title} data-metric-card-item>
          <MetricCard
            {...metric}
            variant="donutChart"
            className={"min-w-[426px]"}
            tooltipContent={renderMetricTooltip(metric.tooltip)}
          />
        </Box>
      ))}
    </Flex>
  );
};

export default KeyIndicatorsInsightsTab;
