type PolygonEventName =
  | "polygon_drawn"
  | "polygon_shape_edited"
  | "polygon_attributes_edited"
  | "polygon_viewed"
  | "polygon_commented"
  | "polygon_validation_run"
  | "polygon_overlap_fix_clicked"
  | "polygon_downloaded"
  | "polygon_uploaded"
  | "polygon_submitted"
  | "polygon_image_edited"
  | "polygon_gallery_viewed";

type PolygonEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const toSnakeEntityType = (entityName?: string | null): "project" | "site" | "nursery" | "unknown" => {
  if (entityName == null) return "unknown";
  const normalized = entityName.toLowerCase();
  if (normalized.includes("project")) return "project";
  if (normalized.includes("site")) return "site";
  if (normalized.includes("nurser")) return "nursery";
  return "unknown";
};

const sanitizeParams = (params: PolygonEventParams): Record<string, string | number | boolean> => {
  const entries = Object.entries(params).map(([key, value]) => [key, value ?? "unknown"]);
  return Object.fromEntries(entries) as Record<string, string | number | boolean>;
};

export const getPolygonAnalyticsContext = ({
  entityType,
  entityId
}: {
  entityType?: string | null;
  entityId?: string | null;
}) => ({
  entity_type: toSnakeEntityType(entityType),
  entity_id: entityId ?? "unknown"
});

export const trackPolygonEvent = (eventName: PolygonEventName, params: PolygonEventParams): void => {
  if (typeof window === "undefined") return;
  const safeParams = sanitizeParams(params);

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: eventName,
    ...safeParams
  });

  window.gtag?.("event", eventName, safeParams);
};
