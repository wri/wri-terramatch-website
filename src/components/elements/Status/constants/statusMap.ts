export const STATUS_MAP: { [key: string]: string } = {
  due: "Due",
  approved: "Approved",
  submitted: "Submitted",
  draft: "Draft",
  started: "Draft",
  "under-review": "Under Review",
  "needs-more-information": "Needs More Information",
  "awaiting-approval": "Awaiting Approval",
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
  STARTED = "started",
  // eslint-disable-next-line no-unused-vars
  SUBMITTED = "submitted",
  // eslint-disable-next-line no-unused-vars
  APPROVED = "approved",
  // eslint-disable-next-line no-unused-vars
  UNDER_REVIEW = "under-review",
  // eslint-disable-next-line no-unused-vars
  NEEDS_MORE_INFORMATION = "needs-more-information",
  // eslint-disable-next-line no-unused-vars
  AWAITING_APPROVAL = "awaiting-approval",
  // eslint-disable-next-line no-unused-vars
  EDIT = "edit",
  // eslint-disable-next-line no-unused-vars
  ERROR = "error",
  // eslint-disable-next-line no-unused-vars
  WARNING = "warning"
}
