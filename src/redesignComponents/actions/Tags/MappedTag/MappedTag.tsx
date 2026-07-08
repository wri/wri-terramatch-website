import type { FC, ReactElement } from "react";

import { usePolygonTagValues } from "@/hooks/translation/usePolygonTagValues";
import { CheckApprovedIcon, DraftIcon, InfoIcon, PendingIcon } from "@/redesignComponents/foundations/Icons";

import ActionStatusTag from "../ActionStatusTag/ActionStatusTag";

export interface MappedTagProps {
  state: MappedTagState;
  className?: string;
  size?: "small" | "default";
}

export type MappedTagState = "draft" | "pending-approval" | "information-required" | "approved";

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

const MappedTag: FC<MappedTagProps> = ({ state, size = "default", ...rest }) => {
  const MappedTagLabelMap = usePolygonTagValues();

  return (
    <ActionStatusTag
      icon={getMappedTagIcon(state, size)}
      state="neutral-light"
      label={MappedTagLabelMap[state] ?? ""}
      size={size}
      {...rest}
    />
  );
};

export default MappedTag;
