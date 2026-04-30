export type MappedTagState = "draft" | "pending-approval" | "information-required" | "approved";

export interface MappedTagProps {
  state: MappedTagState;
  className?: string;
  size?: "small" | "default";
}
