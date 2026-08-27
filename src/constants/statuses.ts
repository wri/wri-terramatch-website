import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";

export const DRAFT = "draft";
export const INFORMATION_REQUIRED = "information-required";
/** @deprecated Use INFORMATION_REQUIRED */
export const NEEDS_MORE_INFORMATION = INFORMATION_REQUIRED;
export const APPROVED = "approved";
export const SUBMITTED = "submitted";
export const FORM_POLYGONS = "form-polygons";
export const DELETED_POLYGONS = "deleted-polygons";
export const PENDING_APPROVAL = "pending-approval";
/** @deprecated Use PENDING_APPROVAL */
export const AWAITING_APPROVAL = PENDING_APPROVAL;
// Synthetic status bucket used only by the read-only deleted-polygons audit view (never
// persisted): every polygon returned by that view is bucketed here regardless of its real
// (pre-deletion) status, so the map can render them all with one dedicated ghost style.
export const DELETED_AUDIT_POLYGONS = "deleted-audit";
export const STATUSES = [
  {
    label: "Draft",
    value: POLYGON_DRAFT
  },
  {
    label: "Pending Approval",
    value: POLYGON_PENDING_APPROVAL
  },
  {
    label: "Information Required",
    value: POLYGON_INFORMATION_REQUIRED
  },
  {
    label: "Approved",
    value: POLYGON_APPROVED
  },
  {
    label: "Form Polygons",
    value: FORM_POLYGONS
  }
];
