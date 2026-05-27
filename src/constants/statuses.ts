import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";

export const DRAFT = "draft";
export const NEEDS_MORE_INFORMATION = "needs-more-information";
export const APPROVED = "approved";
export const SUBMITTED = "submitted";
export const FORM_POLYGONS = "form-polygons";
export const DELETED_POLYGONS = "deleted-polygons";
export const AWAITING_APPROVAL = "awaiting-approval";
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
