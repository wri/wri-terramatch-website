import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useRef } from "react";

import { trackMetricsCardAnalyticsEvent } from "@/utils/analytics/metricsCardAnalytics";
import { MetricsCardEntityType } from "@/utils/ga4";

type MetricsCardAnalyticsContextValue = {
  onTooltipEngaged: (metricLabel: string) => void;
};

const MetricsCardAnalyticsContext = createContext<MetricsCardAnalyticsContextValue | null>(null);

export const useMetricsCardAnalyticsContext = (): MetricsCardAnalyticsContextValue | null =>
  useContext(MetricsCardAnalyticsContext);

export type HighLevelMetricsCardProps = {
  entityType: MetricsCardEntityType;
  entityId: string;
  children: ReactNode;
};

const HighLevelMetricsCard: FC<HighLevelMetricsCardProps> = ({ entityType, entityId, children }) => {
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (hasTrackedView.current || entityId.trim() === "") return;

    hasTrackedView.current = true;
    trackMetricsCardAnalyticsEvent("metrics_card_viewed", { entityType, entityId });
  }, [entityId, entityType]);

  const onTooltipEngaged = useCallback(
    (metricLabel: string) => {
      trackMetricsCardAnalyticsEvent("metrics_card_tooltip_engaged", {
        entityType,
        entityId,
        metricLabel
      });
    },
    [entityId, entityType]
  );

  return (
    <MetricsCardAnalyticsContext.Provider value={{ onTooltipEngaged }}>{children}</MetricsCardAnalyticsContext.Provider>
  );
};

export default HighLevelMetricsCard;
