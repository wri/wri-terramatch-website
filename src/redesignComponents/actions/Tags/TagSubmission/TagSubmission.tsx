import { Tag } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import { CheckApproved, Draft, Due, Info, NothingReported, Pending } from "@/redesignComponents/foundations/Icons";

export type TagSubmissionState =
  | "draft"
  | "nothing-reported"
  | "pending-approval-neutral"
  | "pending-approval"
  | "information-required"
  | "approved"
  | "due";

export interface TagSubmissionProps {
  state: TagSubmissionState;
  className?: string;
  size?: "small" | "default";
}

const TAG_LABELS: Record<TagSubmissionState, string> = {
  draft: "Draft",
  "nothing-reported": "Nothing Reported",
  "pending-approval-neutral": "Pending Approval",
  "pending-approval": "Pending Approval",
  "information-required": "Information Required",
  approved: "Approved",
  due: "Due"
};

const DEFAULT_SIZE = "default" as const;
const ICON_SIZE_DEFAULT = "h-3 w-3";
const ICON_SIZE_SMALL = "h-2.5 w-2.5";

const TagSubmission: FC<TagSubmissionProps> = ({ state, className, size = DEFAULT_SIZE }) => {
  const t = useT();

  const label = TAG_LABELS[state];

  return (
    <Tag.Root
      className={classNames(
        "box-shadow-none flex h-fit w-fit items-center gap-2 rounded-full border px-2 py-1 shadow-none",
        {
          "border-theme-neutral-300 bg-theme-neutral-100":
            state === "draft" || state === "nothing-reported" || state === "pending-approval-neutral",
          "border-theme-warning-300 bg-theme-warning-100":
            state === "pending-approval" || state === "information-required",
          "border-theme-success-300 bg-theme-success-100": state === "approved",
          "border-theme-error-300 bg-theme-error-100": state === "due"
        },
        className
      )}
    >
      <Tag.Label className="flex items-center gap-1">
        {state === "draft" && (
          <Draft
            boxSize={3}
            color="neutral.600"
            className={classNames({
              [ICON_SIZE_DEFAULT]: size === "default",
              [ICON_SIZE_SMALL]: size === "small"
            })}
          />
        )}
        {state === "nothing-reported" && <NothingReported color="neutral.900" className="min-h-3 min-w-3 h-3 w-3" />}
        {state === "pending-approval-neutral" && <Pending color="neutral.700" className="min-h-3 min-w-3 h-3 w-3" />}
        {state === "pending-approval" && <Pending color="warning.500" className="min-h-3 min-w-3 h-3 w-3" />}
        {state === "information-required" && <Info color="warning.500" className="min-h-3 min-w-3 h-3 w-3" />}
        {state === "approved" && <CheckApproved color="success.500" className="min-h-3 min-w-3 h-3 w-3" />}
        {state === "due" && <Due color="error.500" className="min-h-3 min-w-3 h-3 w-3" />}
        <span
          className={classNames("font-bold", {
            "text-theme-neutral-800": state === "draft" || state === "pending-approval-neutral",
            "text-theme-neutral-900": state === "nothing-reported",
            "text-theme-warning-900": state === "pending-approval" || state === "information-required",
            "text-theme-success-900": state === "approved",
            "text-theme-error-900": state === "due",
            "text-sm": size === "default",
            "text-xs": size === "small",
            "leading-[20px]": size === "default",
            "leading-[16px]": size === "small"
          })}
        >
          {t(label)}
        </span>
      </Tag.Label>
    </Tag.Root>
  );
};

export default TagSubmission;
