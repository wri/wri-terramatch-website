export type TagSubmissionState =
  | "draft"
  | "nothing-reported"
  | "pending-approval-neutral"
  | "pending-approval"
  | "information-required"
  | "approved"
  | "due";

export interface TagSubmissionProps {
  state: TagSubmissionState;
  className?: string;
  size?: "small" | "default";
}
