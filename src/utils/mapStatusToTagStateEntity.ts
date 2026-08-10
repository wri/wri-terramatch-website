import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";

export const mapStatusToTagStateEntity = (
  status: string | null | undefined
): { type: TagSubmissionState } | undefined => {
  switch (status) {
    case "draft":
      return { type: "draft" };
    case "pending-approval":
      return { type: "pending-approval" };
    case "information-required":
      return { type: "information-required" };
    case "approved":
      return { type: "approved" };
    case "due":
      return { type: "due" };
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
