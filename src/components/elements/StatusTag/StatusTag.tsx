import { useT } from "@transifex/react";
import { FC } from "react";

import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import { ActionStatusTagState } from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag.type";
import MappedTag from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { PendingIcon, RejectedIcon } from "@/redesignComponents/foundations/Icons";
import { mapStatusToMappedTagState, mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

export interface StatusTagProps {
  status?: string | null;
  size?: "small" | "default";
  className?: string;
  variant?: "mapped" | "submission";
}

const FUNDING_STATUS_TAG: Record<string, { state: ActionStatusTagState; label: string }> = {
  inactive: { state: "neutral-dark", label: "Closed" },
  "coming-soon": { state: "attention", label: "Coming Soon" }
};

const StatusTag: FC<StatusTagProps> = ({ status, size = "default", className, variant = "submission" }) => {
  const t = useT();
  const boxSize = size === "default" ? 3 : 2.5;
  const mappedState = mapStatusToMappedTagState(status);

  if (variant === "mapped" && mappedState != null) {
    return <MappedTag state={mappedState} size={size} className={className} />;
  }

  if (status === "approved") {
    return <MappedTag state="approved" size={size} className={className} />;
  }

  const tagState = mapStatusToTagStateEntity(status);
  if (tagState != null) {
    return <TagSubmission state={tagState.type} size={size} className={className} />;
  }

  const fundingStatus = status == null ? undefined : FUNDING_STATUS_TAG[status];
  if (fundingStatus != null) {
    const icon =
      status === "coming-soon" ? (
        <PendingIcon color="warning.500" boxSize={boxSize} />
      ) : (
        <RejectedIcon color="neutral.900" boxSize={boxSize} />
      );

    return (
      <ActionStatusTag
        state={fundingStatus.state}
        size={size}
        className={className}
        icon={icon}
        label={t(fundingStatus.label)}
      />
    );
  }

  return null;
};

export default StatusTag;
