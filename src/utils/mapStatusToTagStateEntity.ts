import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";

export const mapStatusToTagStateEntity = (
  status: string | null | undefined
): { type: TagSubmissionState } | undefined => {
  switch (status) {
    case "draft":
      return { type: "draft" };
    case "started":
      return { type: "draft" };
    case "awaiting-approval":
      return { type: "pending-approval" };
    case "needs-more-information":
      return { type: "information-required" };
    case "approved":
      return { type: "approved" };
    default:
      return undefined;
  }
};
