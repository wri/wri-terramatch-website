import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";

export type StatusTagSource = "entity" | "formSubmission" | "funding";

export const mapStatusToTagStateEntity = (
  status: string | null | undefined
): { type: TagSubmissionState } | undefined => {
  switch (status) {
    case "draft":
    case "started":
      return { type: "draft" };
    case "pending-approval":
    case "awaiting":
    case "awaiting-approval":
    case "submitted":
    case "submitted-for-approval":
      return { type: "pending-approval" };
    case "information-required":
    case "needs-more-information":
    case "more-info-requested":
      return { type: "information-required" };
    case "approved":
      return { type: "approved" };
    case "due":
    case "not-started":
      return { type: "due" };
    case "nothing-to-report":
    case "nothing-reported":
    case "no-update":
      return { type: "nothing-reported" };
    default:
      return undefined;
  }
};

export const mapFormSubmissionStatusToTagState = (
  status: string | null | undefined
): { type: TagSubmissionState } | undefined => {
  if (status === "rejected") {
    return { type: "not-selected" };
  }

  return mapStatusToTagStateEntity(status);
};

export const mapFundingStatusToTagState = (
  status: string | null | undefined
): { type: TagSubmissionState } | undefined => {
  switch (status) {
    case "active":
      return { type: "receiving-applications" };
    case "inactive":
    case "disabled":
      return { type: "closed" };
    case "coming-soon":
      return { type: "coming-soon" };
    default:
      return undefined;
  }
};

export const mapStatusToTagStateBySource = (
  status: string | null | undefined,
  source: StatusTagSource = "entity"
): { type: TagSubmissionState } | undefined => {
  switch (source) {
    case "formSubmission":
      return mapFormSubmissionStatusToTagState(status);
    case "funding":
      return mapFundingStatusToTagState(status);
    default:
      return mapStatusToTagStateEntity(status);
  }
};

export const mapSitePolygonStatusToMappedTagState = (status: SitePolygonLightDto["status"]): MappedTagState => {
  switch (status) {
    case "approved":
      return "approved";
    case "pending-approval":
      return "pending-approval";
    case "information-required":
      return "information-required";
    case "draft":
    default:
      return "draft";
  }
};

export const mapSiteValidationStatusToTagState = (
  status: SitePolygonLightDto["validationStatus"]
): ValidationTagState => {
  switch (status) {
    case "passed":
      return "passed";
    case "failed":
      return "failed";
    case "partial":
      return "partially-passed";
    default:
      return "not-started";
  }
};
