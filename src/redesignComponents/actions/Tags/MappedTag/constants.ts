import { IconProps } from "@chakra-ui/react";
import { FC } from "react";

import { CheckApprovedIcon, DraftIcon, InfoIcon, PendingIcon } from "@/redesignComponents/foundations/Icons";

import { MappedTagState } from "./MappedTag.type";

export interface IconConfig {
  component: FC<IconProps>;
  color: string;
  className?: string;
  boxSize?: number;
  useDynamicSize?: boolean;
}

export const ICON_MAP: Record<MappedTagState, IconConfig> = {
  draft: {
    component: DraftIcon,
    color: "neutralActive.3",
    boxSize: 3,
    useDynamicSize: true
  },
  "pending-approval": {
    component: PendingIcon,
    color: "neutralActive.1",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  "information-required": {
    component: InfoIcon,
    color: "attention.1",
    className: "min-h-3 min-w-3 h-3 w-3"
  },
  approved: {
    component: CheckApprovedIcon,
    color: "positive.1",
    className: "min-h-3 min-w-3 h-3 w-3"
  }
};
