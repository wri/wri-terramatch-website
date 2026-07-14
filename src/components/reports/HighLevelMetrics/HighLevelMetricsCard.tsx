import { createContext, FC, ReactNode, useCallback, useContext, useEffect } from "react";

import { trackMetricsCardAnalyticsEvent, trackMetricsCardViewedOnce } from "@/utils/analytics/metricsCardAnalytics";
import { PAGE_CONTEXT_REPORT_OVERVIEW, PageContext } from "@/utils/analytics/pageContext";
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
  pageContext?: PageContext;
};

const HighLevelMetricsCard: FC<HighLevelMetricsCardProps> = ({
  entityType,
  entityId,
  children,
  pageContext = PAGE_CONTEXT_REPORT_OVERVIEW
}) => {
  useEffect(() => {
    trackMetricsCardViewedOnce({ entityType, entityId, pageContext });
  }, [entityId, entityType, pageContext]);

  const onTooltipEngaged = useCallback(
    (metricLabel: string) => {
      trackMetricsCardAnalyticsEvent("metrics_card_tooltip_engaged", {
        entityType,
        entityId,
        metricLabel,
        pageContext
      });
    },
    [entityId, entityType, pageContext]
  );

  return (
    <MetricsCardAnalyticsContext.Provider value={{ onTooltipEngaged }}>{children}</MetricsCardAnalyticsContext.Provider>
  );
};

export default HighLevelMetricsCard;
