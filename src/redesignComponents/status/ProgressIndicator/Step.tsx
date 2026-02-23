import { Button, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import { FC } from "react";

import {
  BADGE_FOCUS_RING_CLASSES,
  FORCED_FOCUS_CLASSES,
  STEP_STATUS_HOVER_STYLE_MAP,
  STEP_STATUS_PRESSED_STYLE_MAP
} from "@/redesignComponents/navigation/FormNavigation/formNavigation.constants";
import {
  getStepBadgeClasses,
  getStepBadgeContent,
  getStepLabelStyle
} from "@/redesignComponents/navigation/FormNavigation/formNavigation.utils";

import { StepProps } from "./types";

export const Step: FC<StepProps> = props => {
  const { index, status, label, actions, onClick, isFocused, isHovered, isPressed } = props;

  return (
    <Flex gap={3} alignItems="center" justify="space-between">
      <Button
        gap={2}
        disabled={status === "disabled"}
        onClick={onClick}
        tabIndex={-1}
        className="group flex h-fit min-w-0 flex-1 basis-0 items-center justify-start focus-visible:outline-none"
      >
        <div
          role="button"
          tabIndex={status === "disabled" ? -1 : 0}
          aria-disabled={status === "disabled"}
          className={classNames(
            getStepBadgeClasses(status),
            BADGE_FOCUS_RING_CLASSES,
            isFocused && FORCED_FOCUS_CLASSES,
            isHovered && STEP_STATUS_HOVER_STYLE_MAP[status],
            isPressed && STEP_STATUS_PRESSED_STYLE_MAP[status]
          )}
        >
          {getStepBadgeContent(status, index)}
        </div>
        <Text title={label} textStyle="400" {...getStepLabelStyle(status)} className="min-w-0 truncate">
          {label}
        </Text>
      </Button>
      {actions}
    </Flex>
  );
};
