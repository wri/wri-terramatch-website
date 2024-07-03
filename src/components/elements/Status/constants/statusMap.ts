export const STATUS_MAP: { [key: string]: string } = {
  approved: "Approved",
  submitted: "Submitted",
  draft: "Draft",
  started: "Draft",
  "under-review": "Under Review",
  "needs-more-information": "Needs More Information",
  "planting-in-progress": "Planting in Progress",
  "awaiting-approval": "Awaiting Approval"
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
  RESTORATION_IN_PROGRESS = "restoration-in-progress",
  // eslint-disable-next-line no-unused-vars
  AWAITING_APPROVAL = "awaiting-approval"
}
