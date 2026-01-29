import { Tag } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import {
  DEFAULT_SIZE,
  ICON_MAP,
  ICON_SIZE_DEFAULT,
  ICON_SIZE_SMALL,
  NEUTRAL_STATES,
  NEUTRAL_TEXT_STATES,
  TAG_LABELS,
  WARNING_STATES,
  WARNING_TEXT_STATES
} from "./constants";

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

const TagSubmission: FC<TagSubmissionProps> = ({ state, className, size = DEFAULT_SIZE }) => {
  const t = useT();

  const label = TAG_LABELS[state];
  const iconConfig = ICON_MAP[state];
  const IconComponent = iconConfig.component;

  return (
    <Tag.Root
      className={classNames(
        "box-shadow-none flex h-fit w-fit items-center gap-2 rounded-full border px-2 py-1 shadow-none",
        {
          "border-theme-neutral-300 bg-theme-neutral-100": NEUTRAL_STATES.includes(state),
          "border-theme-warning-300 bg-theme-warning-100": WARNING_STATES.includes(state),
          "border-theme-success-300 bg-theme-success-100": state === "approved",
          "border-theme-error-300 bg-theme-error-100": state === "due"
        },
        className
      )}
    >
      <Tag.Label className="flex items-center gap-1">
        <IconComponent
          color={iconConfig.color}
          boxSize={iconConfig.boxSize}
          className={
            iconConfig.useDynamicSize
              ? classNames({
                  [ICON_SIZE_DEFAULT]: size === "default",
                  [ICON_SIZE_SMALL]: size === "small"
                })
              : iconConfig.className
          }
        />
        <span
          className={classNames("font-bold", {
            "text-theme-neutral-800": NEUTRAL_TEXT_STATES.includes(state),
            "text-theme-neutral-900": state === "nothing-reported",
            "text-theme-warning-900": WARNING_TEXT_STATES.includes(state),
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
