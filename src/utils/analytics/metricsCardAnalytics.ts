import { EntityName } from "@/types/common";
import {
  getMetricsCardAnalyticsContext,
  MetricsCardEntityType,
  MetricsCardEventName,
  trackMetricsCardEvent
} from "@/utils/ga4";

const METRICS_CARD_ENTITY_TYPES = new Set<MetricsCardEntityType>([
  "project-report",
  "site-report",
  "nursery-report",
  "financial-report"
]);

const ENTITY_NAME_TO_METRICS_CARD_TYPE: Partial<Record<EntityName, MetricsCardEntityType>> = {
  "project-reports": "project-report",
  "site-reports": "site-report",
  "nursery-reports": "nursery-report",
  "financial-reports": "financial-report"
};

const FORM_MODEL_TO_METRICS_CARD_TYPE: Record<string, MetricsCardEntityType> = {
  projectReports: "project-report",
  siteReports: "site-report",
  nurseryReports: "nursery-report",
  financialReports: "financial-report"
};

export const resolveMetricsCardEntityType = (entityName?: EntityName | string | null): MetricsCardEntityType | null => {
  if (entityName == null) return null;

  const fromEntityName = ENTITY_NAME_TO_METRICS_CARD_TYPE[entityName as EntityName];
  if (fromEntityName != null) return fromEntityName;

  return FORM_MODEL_TO_METRICS_CARD_TYPE[entityName] ?? null;
};

export const toMetricLabel = (metricLabel?: string | null, type?: string | null): string => {
  if (metricLabel != null && metricLabel.trim() !== "") return metricLabel.trim();
  if (type == null || type.trim() === "") return "";

  return type.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
};

type MetricsCardAnalyticsPayload = {
  entityType: MetricsCardEntityType;
  entityId?: string | null;
  metricLabel?: string | null;
};

const isValidMetricsCardPayload = (
  eventName: MetricsCardEventName,
  { entityType, entityId, metricLabel }: MetricsCardAnalyticsPayload
): boolean => {
  if (!METRICS_CARD_ENTITY_TYPES.has(entityType)) return false;
  if (entityId == null || entityId.trim() === "") return false;

  if (eventName === "metrics_card_tooltip_engaged") {
    return metricLabel != null && metricLabel.trim() !== "";
  }

  return true;
};

const viewedMetricsCards = new Set<string>();

const getMetricsCardViewKey = (entityType: MetricsCardEntityType, entityId: string): string =>
  `${entityType}:${entityId}`;

export const trackMetricsCardAnalyticsEvent = (
  eventName: MetricsCardEventName,
  payload: MetricsCardAnalyticsPayload
): void => {
  if (!isValidMetricsCardPayload(eventName, payload)) return;

  trackMetricsCardEvent(
    eventName,
    getMetricsCardAnalyticsContext({
      entityType: payload.entityType,
      entityId: payload.entityId,
      metricLabel: payload.metricLabel
    })
  );
};

export const trackMetricsCardViewedOnce = (payload: Omit<MetricsCardAnalyticsPayload, "metricLabel">): void => {
  const entityId = payload.entityId?.trim() ?? "";
  if (entityId === "") return;

  const viewKey = getMetricsCardViewKey(payload.entityType, entityId);
  if (viewedMetricsCards.has(viewKey)) return;

  viewedMetricsCards.add(viewKey);
  trackMetricsCardAnalyticsEvent("metrics_card_viewed", { ...payload, entityId });
};

export const createMetricsCardCtaHandler = (
  payload: Omit<MetricsCardAnalyticsPayload, "metricLabel">,
  onClick?: () => void
): (() => void) => {
  return () => {
    trackMetricsCardAnalyticsEvent("metrics_card_cta_clicked", payload);
    onClick?.();
  };
};
