import type { NurseryIndexRow } from "./nurseryIndex.types";

const SUBMITTABLE_STATUSES: ReadonlySet<NonNullable<NurseryIndexRow["status"]>> = new Set([
  "draft",
  "information-required"
]);

export const isNurserySubmittable = (nursery: Pick<NurseryIndexRow, "status">): boolean =>
  nursery.status != null && SUBMITTABLE_STATUSES.has(nursery.status);

export const isNurseryDeletable = (nursery: Pick<NurseryIndexRow, "status">): boolean => nursery.status === "draft";

export const isNurseryEditable = (nursery: Pick<NurseryIndexRow, "status" | "updateRequestStatus">): boolean =>
  nursery.status !== "pending-approval" && nursery.updateRequestStatus !== "pending-approval";
