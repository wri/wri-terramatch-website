import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

type SitePolygonStatus = SitePolygonLightDto["status"];

export const previewSubmissionStatusAfterEdit = (
  status: SitePolygonStatus | null,
  hasChangesResettingValidation: boolean,
  isAdmin: boolean
): SitePolygonStatus | null =>
  hasChangesResettingValidation && isAdmin && status === "approved" ? "pending-approval" : status;
