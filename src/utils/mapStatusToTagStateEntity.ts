import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";

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
    case "rejected":
      return { type: "not-selected" };
    case "active":
      return { type: "receiving-applications" };
    default:
      return undefined;
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
