import { FC } from "react";

import { CheckApproved, Draft, Due, Info, NothingReported, Pending } from "@/redesignComponents/foundations/Icons";

import type { TagSubmissionState } from "./TagSubmission";

export const TAG_LABELS: Record<TagSubmissionState, string> = {
  draft: "Draft",
  "nothing-reported": "Nothing Reported",
  "pending-approval-neutral": "Pending Approval",
  "pending-approval": "Pending Approval",
  "information-required": "Information Required",
  approved: "Approved",
  due: "Due"
};

export const DEFAULT_SIZE = "default" as const;
export const ICON_SIZE_DEFAULT = "h-3 w-3";
export const ICON_SIZE_SMALL = "h-2.5 w-2.5";

export const NEUTRAL_STATES: TagSubmissionState[] = ["draft", "nothing-reported", "pending-approval-neutral"];
export const WARNING_STATES: TagSubmissionState[] = ["pending-approval", "information-required"];
export const NEUTRAL_TEXT_STATES: TagSubmissionState[] = ["draft", "pending-approval-neutral"];
export const WARNING_TEXT_STATES: TagSubmissionState[] = ["pending-approval", "information-required"];

export interface IconConfig {
  component: FC<{ color: string; className?: string; boxSize?: number }>;
  color: string;
  className?: string;
  boxSize?: number;
  useDynamicSize?: boolean;
}

export const ICON_MAP: Record<TagSubmissionState, IconConfig> = {
  draft: {
    component: Draft,
    color: "neutral.600",
    boxSize: 3,
    useDynamicSize: true
  },
  "nothing-reported": {
    component: NothingReported,
    color: "neutral.900",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  "pending-approval-neutral": {
    component: Pending,
    color: "neutral.700",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  "pending-approval": {
    component: Pending,
    color: "warning.500",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  "information-required": {
    component: Info,
    color: "warning.500",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  approved: {
    component: CheckApproved,
    color: "success.500",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  due: {
    component: Due,
    color: "error.500",
    className: "min-h-3 min-w-3 h-3 w-3"
  }
};
