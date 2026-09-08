import type { NurseryIndexRow } from "./nurseryIndex.types";

type Translate = (key: string, params?: Record<string, unknown>) => string;

const SUBMITTABLE_STATUSES: ReadonlySet<NonNullable<NurseryIndexRow["status"]>> = new Set([
  "draft",
  "information-required"
]);

export type NurserySubmitBlockingReason = "approved" | "submitted";

const SUBMIT_BLOCKED_STATUSES: Partial<Record<NonNullable<NurseryIndexRow["status"]>, NurserySubmitBlockingReason>> = {
  approved: "approved",
  "pending-approval": "submitted"
};

export const isNurserySubmittable = (nursery: Pick<NurseryIndexRow, "status">): boolean =>
  nursery.status != null && SUBMITTABLE_STATUSES.has(nursery.status);

export const isNurseryDeletable = (nursery: Pick<NurseryIndexRow, "status">): boolean => nursery.status === "draft";

export const isNurseryEditable = (nursery: Pick<NurseryIndexRow, "status" | "updateRequestStatus">): boolean =>
  nursery.status !== "pending-approval" && nursery.updateRequestStatus !== "pending-approval";

export const getNurserySubmitBlockingReason = (
  nursery: Pick<NurseryIndexRow, "status">
): NurserySubmitBlockingReason | null =>
  nursery.status == null ? null : SUBMIT_BLOCKED_STATUSES[nursery.status] ?? null;

export const getNurseryIndexSubmitTooltip = (
  nurseries: Array<Pick<NurseryIndexRow, "status">>,
  t: Translate
): string | string[] | undefined => {
  if (nurseries.length === 0 || nurseries.every(isNurserySubmittable)) {
    return undefined;
  }

  const blockingReasons = new Set(
    nurseries
      .map(getNurserySubmitBlockingReason)
      .filter((reason): reason is NurserySubmitBlockingReason => reason != null)
  );
  const hasEligibleSelection = nurseries.some(isNurserySubmittable);

  if (hasEligibleSelection || blockingReasons.size > 1) {
    return [
      t("One or more selected profile can't be submitted because"),
      t("they are already approved or awaiting approval")
    ];
  }

  if (blockingReasons.has("approved")) {
    return t("This profile has already been approved");
  }

  return t("This profile has already been submitted for review");
};
