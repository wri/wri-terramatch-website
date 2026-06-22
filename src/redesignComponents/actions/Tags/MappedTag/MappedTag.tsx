import type { FC, ReactElement } from "react";

import { CheckApprovedIcon, DraftIcon, InfoIcon, PendingIcon } from "@/redesignComponents/foundations/Icons";

import ActionStatusTag from "../ActionStatusTag/ActionStatusTag";

export interface MappedTagProps {
  state: MappedTagState;
  className?: string;
  size?: "small" | "default";
}

export type MappedTagState = "draft" | "pending-approval" | "information-required" | "approved";

const MappedTagLabelMap: Record<MappedTagState, string> = {
  draft: "Draft",
  "pending-approval": "Pending Approval",
  "information-required": "Information Required",
  approved: "Approved"
};

function getMappedTagIcon(state: MappedTagState, size: "small" | "default" = "default"): ReactElement {
  switch (state) {
    case "draft":
      return <DraftIcon color="neutralActive.3" boxSize={size === "default" ? 3 : 2.5} />;
    case "pending-approval":
      return <PendingIcon color="neutralActive.1" boxSize={size === "default" ? 3 : 2.5} />;
    case "information-required":
      return <InfoIcon color="attention.1" boxSize={size === "default" ? 3 : 2.5} />;
    case "approved":
      return <CheckApprovedIcon color="positive.1" boxSize={size === "default" ? 3 : 2.5} />;
    default:
      return <></>;
  }
}

const MappedTag: FC<MappedTagProps> = ({ state, size = "default", ...rest }) => (
  <ActionStatusTag
    icon={getMappedTagIcon(state, size)}
    state="neutral-light"
    label={MappedTagLabelMap[state]}
    size={size}
    {...rest}
  />
);

export default MappedTag;
