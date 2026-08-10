export const STATUS_MAP: { [key: string]: string } = {
  due: "Due",
  approved: "Approved",
  submitted: "Submitted",
  "pending-approval": "Pending Approval",
  draft: "Draft",
  "under-review": "Under Review",
  "information-required": "Information Required",
  "no-update": "No Update"
};

export const PLANTING_STATUS_MAP: { [key: string]: string } = {
  "no-restoration-expected": "No Restoration Expected",
  "not-started": "Not Started",
  "in-progress": "In Progress",
  "replacement-planting": "Replacement Planting",
  completed: "Completed"
};

export enum StatusEnum {
  // eslint-disable-next-line no-unused-vars
  DRAFT = "draft",
  // eslint-disable-next-line no-unused-vars
  SUBMITTED = "submitted",
  // eslint-disable-next-line no-unused-vars
  PENDING_APPROVAL = "pending-approval",
  // eslint-disable-next-line no-unused-vars
  APPROVED = "approved",
  // eslint-disable-next-line no-unused-vars
  UNDER_REVIEW = "under-review",
  // eslint-disable-next-line no-unused-vars
  INFORMATION_REQUIRED = "information-required",
  // eslint-disable-next-line no-unused-vars
  EDIT = "edit",
  // eslint-disable-next-line no-unused-vars
  ERROR = "error",
  // eslint-disable-next-line no-unused-vars
  WARNING = "warning"
}
