import { IconProps } from "@chakra-ui/react";
import { FC } from "react";

import {
  CheckApprovedIcon,
  DraftIcon,
  DueIcon,
  InfoIcon,
  NothingReportedIcon,
  PendingIcon
} from "@/redesignComponents/foundations/Icons";

import type { TagSubmissionState } from "./TagSubmission.type";

export const DEFAULT_SIZE = "default" as const;
export const ICON_SIZE_DEFAULT = "h-3 w-3";
export const ICON_SIZE_SMALL = "h-2.5 w-2.5";

export const NEUTRAL_STATES: TagSubmissionState[] = ["draft", "nothing-reported", "pending-approval-neutral"];
export const WARNING_STATES: TagSubmissionState[] = ["pending-approval", "information-required"];
export const NEUTRAL_TEXT_STATES: TagSubmissionState[] = ["draft", "pending-approval-neutral"];
export const WARNING_TEXT_STATES: TagSubmissionState[] = ["pending-approval", "information-required"];

export interface IconConfig {
  component: FC<IconProps>;
  color: string;
  className?: string;
  boxSize?: number;
  useDynamicSize?: boolean;
}

export const ICON_MAP: Record<TagSubmissionState, IconConfig> = {
  draft: {
    component: DraftIcon,
    color: "neutral.600",
    boxSize: 3,
    useDynamicSize: true
  },
  "nothing-reported": {
    component: NothingReportedIcon,
    color: "neutral.900",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  "pending-approval-neutral": {
    component: PendingIcon,
    color: "neutral.700",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  "pending-approval": {
    component: PendingIcon,
    color: "warning.500",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  "information-required": {
    component: InfoIcon,
    color: "warning.500",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  approved: {
    component: CheckApprovedIcon,
    color: "success.500",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  due: {
    component: DueIcon,
    color: "error.500",
    className: "min-h-3 min-w-3 h-3 w-3"
  }
};
