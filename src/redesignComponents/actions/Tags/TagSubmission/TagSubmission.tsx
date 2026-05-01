import { useT } from "@transifex/react";
import type { FC, ReactElement } from "react";

import {
  CheckApprovedIcon,
  DraftIcon,
  DueIcon,
  InfoIcon,
  NothingReportedIcon,
  PendingIcon
} from "@/redesignComponents/foundations/Icons";

import ActionStatusTag from "../ActionStatusTag/ActionStatusTag";
import { ActionStatusTagState } from "../ActionStatusTag/ActionStatusTag.type";

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

export const useTagLabel = (tag: TagSubmissionState) => {
  const t = useT();
  const map = {
    draft: t("Draft"),
    "nothing-reported": t("Nothing Reported"),
    "pending-approval-neutral": t("Pending Approval"),
    "pending-approval": t("Pending Approval"),
    "information-required": t("Information Required"),
    approved: t("Approved"),
    due: t("Due")
  };

  return map[tag];
};

const TagSubmissionActionStatusTagStateMap: Record<TagSubmissionState, ActionStatusTagState> = {
  draft: "neutral-light",
  "nothing-reported": "neutral-dark",
  "pending-approval-neutral": "neutral-light",
  "pending-approval": "attention",
  "information-required": "attention",
  approved: "warning",
  due: "success"
};

function getTagSubmissionIcon(state: TagSubmissionState, size: "small" | "default"): ReactElement {
  const boxSize = size === "default" ? 3 : 2.5;

  switch (state) {
    case "draft":
      return <DraftIcon color="neutral.600" boxSize={boxSize} />;
    case "nothing-reported":
      return <NothingReportedIcon color="neutral.900" boxSize={boxSize} />;
    case "pending-approval-neutral":
      return <PendingIcon color="neutral.700" boxSize={boxSize} />;
    case "pending-approval":
      return <PendingIcon color="warning.500" boxSize={boxSize} />;
    case "information-required":
      return <InfoIcon color="warning.500" boxSize={boxSize} />;
    case "approved":
      return <CheckApprovedIcon color="success.500" boxSize={boxSize} />;
    case "due":
      return <DueIcon color="error.500" boxSize={boxSize} />;
    default:
      return <></>;
  }
}

const TagSubmission: FC<TagSubmissionProps> = ({ state, size = "default", ...rest }) => {
  const label = useTagLabel(state);

  return (
    <ActionStatusTag
      icon={getTagSubmissionIcon(state, size)}
      state={TagSubmissionActionStatusTagStateMap[state]}
      label={label}
      size={size}
      {...rest}
    />
  );
};

export default TagSubmission;
