import { FC } from "react";

import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

export interface StatusTagProps {
  status?: string | null;
  size?: "small" | "default";
  className?: string;
}

const StatusTag: FC<StatusTagProps> = ({ status, size = "default", className }) => {
  const tagState = mapStatusToTagStateEntity(status);
  if (tagState == null) return null;

  return <TagSubmission state={tagState.type} size={size} className={className} />;
};

export default StatusTag;
