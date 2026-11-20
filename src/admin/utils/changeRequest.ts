type UpdateRequestStatus = "draft" | "pending-approval" | "approved" | "information-required";

const ACTIVE_CHANGE_REQUEST_STATUSES: ReadonlyArray<UpdateRequestStatus> = [
  "draft",
  "pending-approval",
  "information-required"
];

/**
 * An active change request means status changes must be made on the change request itself,
 * not on the entity, so admins can't approve or request more info while one is open.
 */
export const hasActiveChangeRequest = (updateRequestStatus: UpdateRequestStatus | null | undefined) =>
  updateRequestStatus != null && ACTIVE_CHANGE_REQUEST_STATUSES.includes(updateRequestStatus);
