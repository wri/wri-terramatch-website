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

type WindowWithDataLayer = Window & { dataLayer?: Array<Record<string, unknown>> };

const toSnakeEntityType = (entityType?: string | null) => {
  const normalized = entityType?.toLowerCase() ?? "";
  if (normalized.includes("project")) return "project";
  if (normalized.includes("site")) return "site";
  if (normalized.includes("nurser")) return "nursery";
  return "";
};

export const getPolygonAnalyticsContext = ({
  entityType,
  entityId
}: {
  entityType?: string | null;
  entityId?: string | null;
}) => ({
  entity_type: toSnakeEntityType(entityType),
  entity_id: entityId ?? ""
});

export const trackPolygonEvent = (eventName: PolygonEventName, params: PolygonEventParams): void => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = Object.fromEntries(
    Object.entries({ event: eventName, ...params }).filter(([, value]) => value != null)
  );

  const { dataLayer } = window as WindowWithDataLayer;
  const layer = dataLayer ?? [];
  layer.push(payload);
  (window as WindowWithDataLayer).dataLayer = layer;
};
