import type { FC, ReactElement } from "react";

import { ProjectQaStatusOption } from "@/constants/polygonHandoff";
import { useProjectQaStatusLabels } from "@/hooks/translation/useProjectQaStatusLabels";
import { CheckApprovedIcon, DueIcon, NothingReportedIcon, PendingIcon } from "@/redesignComponents/foundations/Icons";

import ActionStatusTag from "../ActionStatusTag/ActionStatusTag";
import { ActionStatusTagState } from "../ActionStatusTag/ActionStatusTag.type";

export interface QaStatusTagProps {
  status: ProjectQaStatusOption;
  className?: string;
  size?: "small" | "default";
}

const QA_STATUS_TAG_STATE: Record<ProjectQaStatusOption, ActionStatusTagState> = {
  "qa-in-progress": "neutral-light",
  "qa-completed": "success",
  "no-data-submitted": "warning",
  "no-data-expected": "neutral-light"
};

const getQaStatusIcon = (status: ProjectQaStatusOption, size: "small" | "default"): ReactElement => {
  const boxSize = size === "default" ? 3 : 2.5;

  switch (status) {
    case "qa-in-progress":
      return <PendingIcon color="neutral.900" boxSize={boxSize} />;
    case "qa-completed":
      return <CheckApprovedIcon color="success.500" boxSize={boxSize} />;
    case "no-data-submitted":
      return <DueIcon color="error.500" boxSize={boxSize} />;
    case "no-data-expected":
      return <NothingReportedIcon color="neutral.900" boxSize={boxSize} />;
  }
};

const QaStatusTag: FC<QaStatusTagProps> = ({ status, size = "default", ...rest }) => {
  const labels = useProjectQaStatusLabels();

  return (
    <ActionStatusTag
      icon={getQaStatusIcon(status, size)}
      state={QA_STATUS_TAG_STATE[status]}
      label={labels[status]}
      size={size}
      {...rest}
    />
  );
};

export default QaStatusTag;
