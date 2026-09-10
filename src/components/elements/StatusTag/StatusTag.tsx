import { FC } from "react";

import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { mapStatusToTagStateBySource, StatusTagSource } from "@/utils/mapStatusToTagStateEntity";

export interface StatusTagProps {
  status?: string | null;
  size?: "small" | "default";
  className?: string;
  source?: StatusTagSource;
}

const StatusTag: FC<StatusTagProps> = ({ status, size = "default", className, source = "entity" }) => {
  const tagState = mapStatusToTagStateBySource(status, source);
  if (tagState == null) return null;

  return <TagSubmission state={tagState.type} size={size} className={className} />;
};

export default StatusTag;
