import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { getExcludedCriteriaIds, isValidCriteriaData } from "@/helpers/polygonValidation";

import { getPolygonAnalyticsContext, trackPolygonEvent } from "./ga4";

export type PolygonType = "monitoring_plot" | "standard";

export type BulkActionType =
  | "fix_overlap"
  | "run_validation"
  | "submit"
  | "download"
  | "approve"
  | "request_information";

export type PolygonUploadErrorType = "file_format" | "geometry" | "size_limit";

export type PolygonValidationErrorType =
  | "overlap"
  | "self_intersection"
  | "outside_country"
  | "incomplete"
  | "size_limit"
  | "spike"
  | "coordinate_system"
  | "polygon_type"
  | "estimated_area"
  | "plant_start_date"
  | "unknown";

const CRITERIA_ID_TO_VALIDATION_ERROR: Record<number, PolygonValidationErrorType> = {
  3: "overlap",
  4: "self_intersection",
  5: "coordinate_system",
  6: "size_limit",
  7: "outside_country",
  8: "spike",
  10: "polygon_type",
  12: "estimated_area",
  14: "incomplete",
  15: "plant_start_date"
};

const UPLOAD_ERROR_KEYWORDS: Array<{ pattern: RegExp; errorType: PolygonUploadErrorType }> = [
  { pattern: /size|limit|mb|too large/i, errorType: "size_limit" },
  { pattern: /format|extension|unsupported|kml|geojson|zip|shapefile/i, errorType: "file_format" },
  { pattern: /geometry|invalid|self.?intersect|overlap|coordinate|polygon/i, errorType: "geometry" }
];

export const formatPolygonTargetId = (polygonIds: string[]): string => {
  if (polygonIds.length === 0) {
    return "bulk";
  }
  if (polygonIds.length === 1) {
    return polygonIds[0];
  }
  return "bulk";
};

export const inferUploadFileFormat = (fileName: string): string => {
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith(".geojson")) return "geojson";
  if (lowerName.endsWith(".kml")) return "kml";
  if (lowerName.endsWith(".zip")) return "shapefile";
  return "unknown";
};

export const classifyUploadFailureErrorType = (message: string): PolygonUploadErrorType => {
  for (const { pattern, errorType } of UPLOAD_ERROR_KEYWORDS) {
    if (pattern.test(message)) {
      return errorType;
    }
  }
  return "geometry";
};

export const resolveValidationErrorTypes = (validation: ValidationDto): PolygonValidationErrorType[] => {
  const excludedCriteriaIds = new Set(getExcludedCriteriaIds(validation));
  const errorTypes = new Set<PolygonValidationErrorType>();

  for (const criteria of validation.criteriaList ?? []) {
    if (criteria.valid || excludedCriteriaIds.has(criteria.criteriaId)) {
      continue;
    }

    const mapped = CRITERIA_ID_TO_VALIDATION_ERROR[criteria.criteriaId];
    errorTypes.add(mapped ?? "unknown");
  }

  return Array.from(errorTypes);
};

export const isFirstPassValidation = (priorValidationStatus: string | null | undefined): boolean => {
  const normalized = priorValidationStatus?.toLowerCase() ?? "";
  return (
    normalized === "" || normalized === "notchecked" || normalized === "not_checked" || normalized === "not checked"
  );
};

// Project scope (project-level polygon review) reuses these site-page tracking helpers; the entity
// they describe is passed explicitly so project events aren't mislabeled as site events. Defaults to
// "site" so every existing site-page call site keeps identical behaviour.
export type PolygonAnalyticsEntityType = "site" | "project";

export const trackPolygonRunValidationClicked = ({
  siteUuid,
  polygonIds,
  entityType = "site"
}: {
  siteUuid: string;
  polygonIds: string[];
  entityType?: PolygonAnalyticsEntityType;
}): void => {
  trackPolygonEvent("polygon_run_validation_clicked", {
    ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
    polygon_id: formatPolygonTargetId(polygonIds)
  });
};

export const trackPolygonSearchUsed = ({
  siteUuid,
  entityType = "site"
}: {
  siteUuid: string;
  entityType?: PolygonAnalyticsEntityType;
}): void => {
  trackPolygonEvent("polygon_search_used", {
    ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid })
  });
};

export const trackPolygonFilterApplied = ({
  siteUuid,
  filterTypes,
  entityType = "site"
}: {
  siteUuid: string;
  filterTypes: string[];
  entityType?: PolygonAnalyticsEntityType;
}): void => {
  if (filterTypes.length === 0) {
    return;
  }

  trackPolygonEvent("polygon_filter_applied", {
    ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
    filter_type: filterTypes.join(",")
  });
};

export const trackPolygonFilterCleared = ({
  siteUuid,
  entityType = "site"
}: {
  siteUuid: string;
  entityType?: PolygonAnalyticsEntityType;
}): void => {
  trackPolygonEvent("polygon_filter_cleared", {
    ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid })
  });
};

export const trackBulkActionCompleted = ({
  siteUuid,
  actionType,
  polygonCount,
  entityType = "site"
}: {
  siteUuid: string;
  actionType: BulkActionType;
  polygonCount: number;
  entityType?: PolygonAnalyticsEntityType;
}): void => {
  trackPolygonEvent("bulk_action_completed", {
    ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
    action_type: actionType,
    polygon_count: polygonCount
  });
};

export const trackPolygonDownloaded = ({
  siteUuid,
  polygonType,
  polygonId,
  polygonCount,
  entityType = "site"
}: {
  siteUuid: string;
  polygonType: PolygonType;
  polygonId?: string;
  polygonCount?: number;
  entityType?: PolygonAnalyticsEntityType;
}): void => {
  trackPolygonEvent("polygon_downloaded", {
    ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
    polygon_type: polygonType,
    ...(polygonId != null && polygonId !== "" ? { polygon_id: polygonId } : {}),
    ...(polygonCount != null ? { polygon_count: polygonCount } : {})
  });
};

export const trackPolygonUploadAttempted = ({
  siteUuid,
  fileFormat
}: {
  siteUuid: string;
  fileFormat: string;
}): void => {
  trackPolygonEvent("polygon_upload_attempted", {
    ...getPolygonAnalyticsContext({ entityType: "site", entityId: siteUuid }),
    file_format: fileFormat
  });
};

export const trackPolygonUploadSucceeded = ({
  siteUuid,
  polygonCount,
  isReupload
}: {
  siteUuid: string;
  polygonCount: number;
  isReupload: boolean;
}): void => {
  trackPolygonEvent("polygon_upload_succeeded", {
    ...getPolygonAnalyticsContext({ entityType: "site", entityId: siteUuid }),
    polygon_count: polygonCount
  });

  if (isReupload) {
    trackPolygonEvent("polygon_reuploaded", {
      ...getPolygonAnalyticsContext({ entityType: "site", entityId: siteUuid }),
      polygon_source: "Uploaded"
    });
  }

  trackPolygonEvent("polygon_uploaded", {
    ...getPolygonAnalyticsContext({ entityType: "site", entityId: siteUuid }),
    polygon_id: polygonCount > 1 ? "bulk_upload" : "single_upload",
    polygon_source: "Uploaded",
    polygon_count: polygonCount
  });
};

export const trackPolygonUploadFailed = ({
  siteUuid,
  errorType
}: {
  siteUuid: string;
  errorType: PolygonUploadErrorType;
}): void => {
  trackPolygonEvent("polygon_upload_failed", {
    ...getPolygonAnalyticsContext({ entityType: "site", entityId: siteUuid }),
    error_type: errorType
  });
};

export const trackPolygonUploadError = ({
  siteUuid,
  errorType
}: {
  siteUuid: string;
  errorType: PolygonUploadErrorType;
}): void => {
  trackPolygonEvent("polygon_upload_error", {
    ...getPolygonAnalyticsContext({ entityType: "site", entityId: siteUuid }),
    error_type: errorType
  });
};

export const trackPolygonValidationResults = ({
  siteUuid,
  polygonId,
  validation,
  priorValidationStatus,
  entityType = "site"
}: {
  siteUuid: string;
  polygonId: string;
  validation: ValidationDto;
  priorValidationStatus?: string | null;
  entityType?: PolygonAnalyticsEntityType;
}): void => {
  const passed = isValidCriteriaData(validation);
  const validationResult = passed ? "pass" : "fail";

  trackPolygonEvent("polygon_validation_run", {
    ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
    polygon_id: polygonId,
    validation_result: validationResult
  });

  if (!passed) {
    const errorTypes = resolveValidationErrorTypes(validation);
    for (const errorType of errorTypes) {
      trackPolygonEvent("polygon_validation_error", {
        ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
        polygon_id: polygonId,
        error_type: errorType
      });
    }
    return;
  }

  if (isFirstPassValidation(priorValidationStatus)) {
    trackPolygonEvent("first_pass_validation_passed", {
      ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
      polygon_id: polygonId
    });
  }
};

export const trackPolygonStatusChanged = ({
  siteUuid,
  polygonId,
  fromStatus,
  toStatus,
  entityType = "site"
}: {
  siteUuid: string;
  polygonId: string;
  fromStatus: string;
  toStatus: string;
  entityType?: PolygonAnalyticsEntityType;
}): void => {
  trackPolygonEvent("polygon_status_changed", {
    ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
    polygon_id: polygonId,
    from_status: fromStatus,
    to_status: toStatus
  });

  if (toStatus === "information-required") {
    trackPolygonEvent("polygon_information_required", {
      ...getPolygonAnalyticsContext({ entityType, entityId: siteUuid }),
      polygon_id: polygonId
    });
  }
};

export const resolveActivePolygonFilterTypes = ({
  polygonStatus,
  validationStatus,
  plantStartFrom,
  plantStartTo,
  practice,
  targetSys,
  submissionCycle,
  hasOverlap,
  showDeleted
}: {
  polygonStatus: string[];
  validationStatus: string[];
  plantStartFrom: string;
  plantStartTo: string;
  practice: string[];
  targetSys: string[];
  submissionCycle: string[];
  hasOverlap: boolean;
  showDeleted: boolean;
}): string[] => {
  if (showDeleted) return ["deleted"];

  const filterTypes: string[] = [];
  if (polygonStatus.length > 0) filterTypes.push("status");
  if (validationStatus.length > 0) filterTypes.push("validation_result");
  if (plantStartFrom !== "" || plantStartTo !== "") filterTypes.push("plant_start_date");
  if (practice.length > 0) filterTypes.push("practice");
  if (targetSys.length > 0) filterTypes.push("target_land_use");
  if (submissionCycle.length > 0) filterTypes.push("submission_cycle");
  if (hasOverlap) filterTypes.push("overlap");
  return filterTypes;
};
