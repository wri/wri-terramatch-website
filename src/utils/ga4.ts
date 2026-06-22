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

export type FormSectionEventName = "section_started" | "section_completed" | "section_error_triggered";

export type ReportEventName =
  | "report_opened"
  | "report_submitted"
  | "form_nav_clicked"
  | "review_page_viewed"
  | "feedback_banner_displayed"
  | "accordion_expanded"
  | "report_save_exited"
  | "report_reopened";

export type Ga4EntityType = "project" | "site" | "nursery" | "unknown";

type Ga4EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const toPolygonEntityType = (entityType?: string | null): string => {
  const normalized = entityType?.toLowerCase() ?? "";
  if (normalized.includes("project")) return "project";
  if (normalized.includes("site")) return "site";
  if (normalized.includes("nurser")) return "nursery";
  return normalized.length > 0 ? normalized : "unknown";
};

const sanitizeParams = (params: Ga4EventParams): Record<string, string | number | boolean> => {
  const entries = Object.entries(params).map(([key, value]) => [key, value ?? "unknown"]);
  return Object.fromEntries(entries) as Record<string, string | number | boolean>;
};

const trackGa4Event = (eventName: string, params: Ga4EventParams): void => {
  if (typeof window === "undefined") return;
  const safeParams = sanitizeParams(params);

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: eventName,
    ...safeParams
  });

  window.gtag?.("event", eventName, safeParams);
};

export const getPolygonAnalyticsContext = ({
  entityType,
  entityId
}: {
  entityType?: string | null;
  entityId?: string | null;
}) => ({
  entity_type: toPolygonEntityType(entityType),
  entity_id: entityId ?? ""
});

export const getFormSectionAnalyticsContext = ({
  entityType,
  entityId,
  sectionName,
  formStepId,
  errorType
}: {
  entityType: Exclude<Ga4EntityType, "unknown">;
  entityId?: string | null;
  sectionName: string;
  formStepId: string;
  errorType?: string | null;
}) => ({
  entity_type: entityType,
  entity_id: entityId ?? "unknown",
  section_name: sectionName,
  form_step_id: formStepId,
  ...(errorType != null && errorType !== "" ? { error_type: errorType } : {})
});

export const trackPolygonEvent = (eventName: PolygonEventName, params: Ga4EventParams): void => {
  if (typeof window === "undefined") {
    return;
  }

  const { source, ...rest } = params;
  const normalizedParams = source != null ? { ...rest, polygon_source: source } : rest;

  const payload = Object.fromEntries(
    Object.entries({ event: eventName, ...normalizedParams }).filter(([, value]) => value != null)
  );

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
};

export const trackFormSectionEvent = (eventName: FormSectionEventName, params: Ga4EventParams): void => {
  trackGa4Event(eventName, params);
};

export const trackReportEvent = (eventName: ReportEventName, params: Ga4EventParams): void => {
  trackGa4Event(eventName, params);
};
