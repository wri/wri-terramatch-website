import { FC } from "react";

import { usePolygonValidationTagValues } from "@/hooks/translation/usePolygonValidationTagValues";

import ActionStatusTag from "../ActionStatusTag/ActionStatusTag";
import { ActionStatusTagState } from "../ActionStatusTag/ActionStatusTag.type";

export type ValidationTagState = "not-started" | "partially-passed" | "failed" | "passed";

export interface ValidationTagMapProps {
  className?: string;
  status: ValidationTagState;
  size?: "small" | "default";
}

const ValidationTagStateMap: Record<ValidationTagState, ActionStatusTagState> = {
  "not-started": "neutral-light",
  "partially-passed": "attention",
  failed: "warning",
  passed: "success"
};

const ValidationTag: FC<ValidationTagMapProps> = ({ status, ...rest }) => {
  const ValidationTagLabelMap = usePolygonValidationTagValues();

  return (
    <ActionStatusTag state={ValidationTagStateMap[status]} label={ValidationTagLabelMap[status] ?? ""} {...rest} />
  );
};

export default ValidationTag;
