import { Flex } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import MetricCard from "./MetricCard";
import { MetricCardVariant } from "./types";

const INDEX_METRIC_CARD_CLASS_NAME = "w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100";

export type IndexMetricCardItem = {
  key: string;
  title: string;
  progress: number;
  goal: number;
  icon: ReactNode;
  color?: string;
  tooltipContent?: ReactNode;
  filtered?: number | null;
  selection?: number | null;
  metricLabel?: string;
  progressSuffix?: string;
  variant?: MetricCardVariant;
  widthProgressBar?: string;
};

type IndexMetricCardRowProps = {
  cards: IndexMetricCardItem[];
  className?: string;
};

const IndexMetricCardRow: FC<IndexMetricCardRowProps> = ({ cards, className }) => {
  if (cards.length === 0) {
    return null;
  }

  return (
    <Flex className={twMerge("mb-5 flex-wrap gap-4", className)}>
      {cards.map(card => (
        <MetricCard
          key={card.key}
          title={card.title}
          progress={card.progress}
          goal={card.goal}
          icon={card.icon}
          color={card.color}
          tooltipContent={card.tooltipContent}
          filtered={card.filtered}
          selection={card.selection}
          metricLabel={card.metricLabel}
          progressSuffix={card.progressSuffix}
          variant={card.variant}
          widthProgressBar={card.widthProgressBar}
          className={INDEX_METRIC_CARD_CLASS_NAME}
        />
      ))}
    </Flex>
  );
};

export default IndexMetricCardRow;
