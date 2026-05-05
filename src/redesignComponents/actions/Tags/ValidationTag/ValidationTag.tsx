import { FC } from "react";

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
  failed: "success",
  passed: "warning"
};

const ValidationTagLabelMap: Record<ValidationTagState, string> = {
  "not-started": "Not Started",
  "partially-passed": "Partially Passed",
  failed: "Failed",
  passed: "Passed"
};

const ValidationTag: FC<ValidationTagMapProps> = ({ status, ...rest }) => (
  <ActionStatusTag state={ValidationTagStateMap[status]} label={ValidationTagLabelMap[status]} {...rest} />
);

export default ValidationTag;
